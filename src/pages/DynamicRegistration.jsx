import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, Mail, Smartphone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const DynamicRegistration = () => {
    const { slug } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: '',
        year: '1'
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchEvent = async () => {
            setLoadingEvent(true);
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setEventDetails(data);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setEventDetails(null);
            } finally {
                setLoadingEvent(false);
            }
        };

        if (slug) {
            fetchEvent();
        }
    }, [slug]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: '', message: '' });

        const cleanRollNumber = formData.rollNumber.trim().toUpperCase();
        const cleanEmail = formData.email.trim().toLowerCase();
        const cleanPhone = formData.phone.replace(/\D/g, '');

        if (cleanRollNumber.length !== 10) {
            setStatus({ type: 'error', message: 'Roll Number must be exactly 10 characters.' });
            setSubmitting(false);
            return;
        }
        if (!cleanEmail.endsWith('@gcet.edu.in')) {
            setStatus({ type: 'error', message: 'Please use your official college email (@gcet.edu.in).' });
            setSubmitting(false);
            return;
        }
        if (cleanPhone.length !== 10) {
            setStatus({ type: 'error', message: 'Phone Number must be exactly 10 digits.' });
            setSubmitting(false);
            return;
        }
        if (!formData.department) {
            setStatus({ type: 'error', message: 'Please select your branch.' });
            setSubmitting(false);
            return;
        }

        try {
            // Check for previous registration to THIS specific event
            const { data: existingReg, error: checkError } = await supabase
                .from('registrations')
                .select('id')
                .eq('roll_number', cleanRollNumber)
                .eq('event_id', eventDetails.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') throw checkError;

            if (existingReg) {
                setStatus({ type: 'success', message: 'You have already registered for this event!' });
                setSubmitting(false);
                return;
            }

            // Insert new record
            const { error: insertError } = await supabase
                .from('registrations')
                .insert([
                    {
                        full_name: formData.fullName.trim(),
                        roll_number: cleanRollNumber,
                        email: cleanEmail,
                        phone: cleanPhone,
                        department: formData.department,
                        year: formData.year,
                        event_id: eventDetails.id // Dynamic linking!
                    }
                ]);

            if (insertError) throw insertError;

            setStatus({ type: 'success', message: 'Successfully Registered! See you at the event.' });
            setFormData({ fullName: '', rollNumber: '', email: '', phone: '', department: '', year: '1' });
        } catch (error) {
            console.error('Registration Error:', error);
            setStatus({ type: 'error', message: 'Registration failed. Please attempt again or contact an admin.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingEvent) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-neon-cyan flex flex-col items-center">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <p className="font-mono tracking-widest uppercase text-sm">Validating Event Link...</p>
                </div>
            </div>
        );
    }

    if (!eventDetails) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <Card className="max-w-md p-8 text-center border-red-500/30 bg-black/80 backdrop-blur-xl">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
                    <p className="text-gray-400 font-mono mb-6 text-sm">
                        This registration link is invalid or has expired. Please verify the URL.
                    </p>
                    <Link to="/" className="text-neon-cyan hover:text-white font-mono uppercase tracking-widest text-sm transition-colors border-b border-neon-cyan pb-1">
                        Return Home
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-2xl p-8 md:p-12 relative border-neon-cyan/20 bg-black/60 backdrop-blur-xl z-10">

                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] text-balance"
                    >
                        {eventDetails.title}
                    </motion.h2>
                    {eventDetails.description && (
                        <p className="text-gray-300 font-mono mb-4 text-sm md:text-base text-balance line-clamp-3">
                            {eventDetails.description}
                        </p>
                    )}
                    <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                        Event Date: {new Date(eventDetails.event_date).toLocaleString()}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {status.type === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 md:p-12 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-center space-y-6 flex flex-col items-center justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-neon-cyan/10 flex items-center justify-center mb-2">
                                <CheckCircle size={40} className="text-neon-cyan" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">{status.message}</h3>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {status.type === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono text-sm flex items-start gap-3">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                    <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Full Legal Name</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><User size={18} /></div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Roll Number</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                                            required
                                            maxLength={10}
                                            placeholder="10 Chars"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors font-mono uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Department</label>
                                        <div className="relative">
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors appearance-none font-mono"
                                            >
                                                <option value="" disabled className="text-gray-500">Select Branch</option>
                                                <option value="CSE">CSE</option>
                                                <option value="IT">IT</option>
                                                <option value="ECE">ECE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="MECH">MECH</option>
                                                <option value="CIVIL">CIVIL</option>
                                                <option value="AIML">AIML</option>
                                                <option value="AIDS">AIDS</option>
                                                <option value="IOT">IOT</option>
                                                <option value="DS">DATA SCIENCE</option>
                                                <option value="CS">CYBER SECURITY</option>
                                                <option value="OTHER">OTHER</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">▼</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Official Email</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Mail size={18} /></div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="@gcet.edu.in"
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Smartphone size={18} /></div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                maxLength={10}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Current Year</label>
                                    <div className="flex gap-4">
                                        {['1', '2', '3', '4'].map((y) => (
                                            <label key={y} className={`flex-1 flex items-center justify-center p-3 rounded-lg border font-mono cursor-pointer transition-all ${formData.year === y ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 bg-black/50 text-gray-400 hover:border-white/30 hover:bg-white/5'}`}>
                                                <input type="radio" name="year" value={y} checked={formData.year === y} onChange={handleChange} className="hidden" />
                                                Yr {y}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 text-lg mt-8"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} /> Transmitting...
                                    </span>
                                ) : (
                                    'INITIALIZE REGISTRATION'
                                )}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default DynamicRegistration;
