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

    const fetchWithTimeout = (promise, ms = 15000) => {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Connection Timed Out.')), ms);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
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
            const { data: existingRoll, error: rollError } = await fetchWithTimeout(
                supabase
                    .from('registrations')
                    .select('id')
                    .eq('roll_number', cleanRollNumber)
                    .single()
            );

            if (rollError && rollError.code !== 'PGRST116') throw rollError; // PGRST116 is "No rows found"
            if (existingRoll) {
                setStatus({ type: 'success', message: 'You are already registered! Please make sure you have joined the WhatsApp group.' });
                setLoading(false);
                return;
            }

            // 2. Check for duplicate Email
            const { data: existingEmail, error: emailError } = await fetchWithTimeout(
                supabase
                    .from('registrations')
                    .select('id')
                    .eq('email', cleanEmail)
                    .single()
            );

            if (emailError && emailError.code !== 'PGRST116') throw emailError;
            if (existingEmail) {
                setStatus({ type: 'success', message: 'You are already registered! Please make sure you have joined the WhatsApp group.' });
                setLoading(false);
                return;
            }

            // 3. Insert NEW record
            const { error: insertError } = await fetchWithTimeout(
                supabase
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
                    ])
            );

            if (insertError) throw insertError;

            setStatus({ type: 'success', message: 'Registration Successful! Welcome to the Network.' });
            setFormData({ fullName: '', rollNumber: '', email: '', phone: '', department: '', year: '' });
        } catch (error) {
            console.error('Registration Error:', error);
            let errorMsg = 'Transmission Failed. Check your internet connection and try again.';

            if (error.message && error.message.includes('Timed Out')) {
                errorMsg = 'Connection timed out. Please try again on a stable network.';
            }

            setStatus({ type: 'error', message: errorMsg });
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
                        PROTOCOL <span className="text-neon-cyan">CONCLUDED</span>
                    </motion.h2>
                    <p className="text-gray-400 font-mono">IoT Club recruitments 2026 registration window has officially closed.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 md:p-12 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-center space-y-6 flex flex-col items-center justify-center my-8"
                >
                    <div className="w-20 h-20 rounded-full bg-neon-cyan/10 flex items-center justify-center mb-2">
                        <CheckCircle size={40} className="text-neon-cyan" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">Registrations are Closed</h3>
                    <p className="text-gray-400 font-mono max-w-md mx-auto">
                        Thank you to everyone who applied! We are no longer accepting new initiations.
                    </p>
                    <div className="mt-8 py-4 px-6 border border-white/10 rounded-lg bg-black/40 inline-block w-full text-center">
                        <p className="text-neon-cyan font-bold text-lg md:text-xl uppercase tracking-widest">
                            See you at the recruitment rounds!
                        </p>
                    </div>
                </motion.div>
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
