import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, Mail, Smartphone, Hash, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: '',
        year: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Format and clean data
        const cleanRollNumber = formData.rollNumber.trim().toUpperCase();
        const cleanEmail = formData.email.trim().toLowerCase();
        const cleanPhone = formData.phone.replace(/\D/g, ''); // Remove non-digits

        // Basic Formatting Validation
        if (cleanRollNumber.length !== 10) {
            setStatus({ type: 'error', message: 'Roll Number must be exactly 10 characters.' });
            setLoading(false);
            return;
        }
        if (!cleanEmail.endsWith('@gcet.edu.in')) {
            setStatus({ type: 'error', message: 'Please use your official college email (@gcet.edu.in).' });
            setLoading(false);
            return;
        }
        if (cleanPhone.length !== 10) {
            setStatus({ type: 'error', message: 'Phone Number must be exactly 10 digits.' });
            setLoading(false);
            return;
        }

        try {
            // 1. Check for duplicate Roll Number
            const { data: existingRoll, error: rollError } = await supabase
                .from('registrations')
                .select('id')
                .eq('roll_number', cleanRollNumber)
                .single();

            if (rollError && rollError.code !== 'PGRST116') throw rollError; // PGRST116 is "No rows found"
            if (existingRoll) {
                setStatus({ type: 'success', message: 'You are already registered! Please make sure you have joined the WhatsApp group.' });
                setLoading(false);
                return;
            }

            // 2. Check for duplicate Email
            const { data: existingEmail, error: emailError } = await supabase
                .from('registrations')
                .select('id')
                .eq('email', cleanEmail)
                .single();

            if (emailError && emailError.code !== 'PGRST116') throw emailError;
            if (existingEmail) {
                setStatus({ type: 'success', message: 'You are already registered! Please make sure you have joined the WhatsApp group.' });
                setLoading(false);
                return;
            }

            // 3. Insert NEW record
            const { error: insertError } = await supabase
                .from('registrations')
                .insert([
                    {
                        full_name: formData.fullName.trim(),
                        roll_number: cleanRollNumber,
                        email: cleanEmail,
                        phone: cleanPhone,
                        department: formData.department,
                        year: formData.year
                    }
                ]);

            if (insertError) throw insertError;

            setStatus({ type: 'success', message: 'Registration Successful! Welcome to the Network.' });
            setFormData({ fullName: '', rollNumber: '', email: '', phone: '', department: '', year: '' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: error.message || 'Transmission Failed. Check connection and try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-2xl p-8 md:p-12 relative border-neon-cyan/30 bg-black/60 backdrop-blur-xl">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                    >
                        INITIATE <span className="text-neon-cyan">PROTOCOL</span>
                    </motion.h2>
                    <p className="text-gray-400 font-mono">Enter your credentials to register for the IoT Club recruitments 2026.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            icon={<User size={18} />}
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <InputGroup
                            icon={<Hash size={18} />}
                            name="rollNumber"
                            placeholder="Roll Number"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            maxLength="10"
                            required
                        />
                        <InputGroup
                            icon={<Mail size={18} />}
                            name="email"
                            type="email"
                            placeholder="College Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <InputGroup
                            icon={<Smartphone size={18} />}
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            required
                        />
                        <div className="space-y-1">
                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors appearance-none"
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="CS">CS (Cyber Security)</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="AIML">AI&ML</option>
                                <option value="DS">Data Science</option>
                                <option value="CIVIL">Civil Engineering</option>
                                <option value="MECH">Mechanical Engineering</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors appearance-none"
                                required
                            >
                                <option value="" disabled>Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>


                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4 shadow-xl ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-2 border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}
                        >
                            <div className="flex items-center gap-3">
                                {status.type === 'success' ? <CheckCircle size={28} className="text-green-500 flex-shrink-0" /> : <AlertCircle size={24} className="flex-shrink-0" />}
                                <span className="font-mono text-base md:text-lg font-bold">{status.message}</span>
                            </div>

                            {status.type === 'success' && (
                                <div className="mt-4 w-full animate-bounce">
                                    <a
                                        href="https://chat.whatsapp.com/BreciBrPAMDEmBwhjMmrR1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-4 rounded-xl font-black text-lg md:text-xl uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all hover:scale-105"
                                    >
                                        <Smartphone size={24} />
                                        JOIN WHATSAPP GROUP NOW
                                    </a>
                                    <p className="text-gray-400 text-xs mt-3 font-mono">You MUST join the group to receive updates.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-full py-4 text-lg font-bold tracking-widest uppercase"
                        disabled={loading}
                    >
                        {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Transmitting...</span> : 'Confirm Registration'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

const InputGroup = ({ icon, label, ...props }) => (
    <div className="space-y-1">
        {props.placeholder && <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">{props.placeholder}</label>}
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                {icon}
            </div>
            <input
                {...props}
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors placeholder-transparent"
            />
        </div>
    </div>
);

export default Register;
