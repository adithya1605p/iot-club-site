import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Admin emails that are allowed to register without @gcet.edu.in
const ALLOWED_ADMIN_EMAILS = ['iotgcet2024@gmail.com', 'mdaahidsiddiqui@gmail.com', 'admin@gcetiot.com'];

const BRANCHES = [
    { value: 'CSE', label: 'CSE' },
    { value: 'ECE', label: 'ECE' },
    { value: 'EEE', label: 'EEE' },
    { value: 'MECH', label: 'MECH' },
    { value: 'CIVIL', label: 'CIVIL' },
    { value: 'AIML', label: 'AI & ML' },
    { value: 'DS', label: 'DATA SCIENCE' },
    { value: 'CS', label: 'CYBER SECURITY' },
    { value: 'OTHER', label: 'OTHER' },
];

const extractMessage = (err) => {
    if (!err) return 'An unknown error occurred.';
    if (typeof err === 'string') return err;
    if (typeof err.message === 'string' && err.message) return err.message;
    // Supabase sometimes returns { msg: '...' } or { error_description: '...' }
    if (typeof err.msg === 'string') return err.msg;
    if (typeof err.error_description === 'string') return err.error_description;
    return 'An error occurred during authentication. Please try again.';
};

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // { type: 'error' | 'success', message: string }

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const switchToLogin = (message) => {
        setIsLogin(true);
        setError({ type: 'success', message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent double-submit
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // ── LOGIN ──────────────────────────────────────────────────────
                if (!email.trim()) throw new Error('Email is required.');
                if (!password) throw new Error('Password is required.');

                const { error: signInError } = await signIn(email.trim().toLowerCase(), password);
                if (signInError) throw signInError;
                navigate('/');

            } else {
                // ── REGISTER ───────────────────────────────────────────────────
                if (!displayName.trim()) throw new Error('Display name is required.');

                const cleanRollNumber = rollNumber.trim().toUpperCase();
                if (cleanRollNumber.length !== 10) throw new Error('Roll Number must be exactly 10 characters (e.g. 24R11A0535).');

                if (!department) throw new Error('Please select your branch / department.');

                const cleanEmail = email.trim().toLowerCase();
                if (!cleanEmail.endsWith('@gcet.edu.in') && !ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
                    throw new Error('Please use your official college email ending with @gcet.edu.in');
                }

                if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

                const { error: signUpError } = await signUp(cleanEmail, password, displayName.trim(), cleanRollNumber, department);

                if (signUpError) {
                    const msg = extractMessage(signUpError).toLowerCase();
                    // Handle "already registered" gracefully — switch to login tab
                    if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email address is already')) {
                        switchToLogin('That email is already registered! Please log in with your existing credentials.');
                        return;
                    }
                    throw signUpError;
                }

                // Success
                switchToLogin('Account created! You can now log in.');
            }
        } catch (err) {
            setError({ type: 'error', message: extractMessage(err) });
        } finally {
            setLoading(false);
        }
    };

    const handleModeSwitch = () => {
        setIsLogin(prev => !prev);
        setError(null);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative bg-dark-bg">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-surface/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Decorative top edge line */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${isLogin ? 'bg-neon-cyan' : 'bg-neon-purple'} transition-colors duration-500`}></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                            {isLogin ? 'SYSTEM ACCESS' : 'INITIALIZE USER'}
                        </h2>
                        <p className="text-gray-400 font-mono text-sm">
                            {isLogin ? 'Authenticate to continue your session.' : 'Create credentials to join the network.'}
                        </p>
                    </div>

                    {/* Error / Success Banner */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="alert"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem' }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className={`p-4 rounded-xl flex items-start gap-3 text-sm font-mono border overflow-hidden ${error.type === 'error'
                                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                        : 'bg-green-500/10 border-green-500/20 text-green-400'
                                    }`}
                            >
                                {error.type === 'error'
                                    ? <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    : <CheckCircle size={18} className="shrink-0 mt-0.5" />
                                }
                                <p>{error.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="register-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    {/* Display Name */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon size={18} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Roll + Branch Row */}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                placeholder="Roll No. (10 chars)"
                                                value={rollNumber}
                                                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                                                maxLength={10}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2 relative">
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all appearance-none"
                                                required
                                            >
                                                <option value="" disabled>Select Branch</option>
                                                {BRANCHES.map(b => (
                                                    <option key={b.value} value={b.value}>{b.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">▼</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="email"
                                placeholder={isLogin ? 'Email' : 'College Email (@gcet.edu.in)'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className={`w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${isLogin ? 'focus:border-neon-cyan focus:ring-neon-cyan' : 'focus:border-neon-purple focus:ring-neon-purple'
                                    }`}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <p className="text-xs text-neon-purple/70 font-mono -mt-3 ml-2">* Must end with @gcet.edu.in</p>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="password"
                                placeholder={isLogin ? 'Password' : 'Password (min. 6 characters)'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                className={`w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${isLogin ? 'focus:border-neon-cyan focus:ring-neon-cyan' : 'focus:border-neon-purple focus:ring-neon-purple'
                                    }`}
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold font-mono tracking-widest text-black transition-all ${loading
                                    ? 'opacity-70 cursor-not-allowed bg-gray-600 text-white'
                                    : isLogin
                                        ? 'bg-neon-cyan hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                                        : 'bg-neon-purple hover:bg-white hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                    {isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode Switch */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-400 font-mono">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <button
                            type="button"
                            onClick={handleModeSwitch}
                            className={`mt-2 text-sm font-bold tracking-wider hover:underline transition-colors ${isLogin ? 'text-neon-purple' : 'text-neon-cyan'
                                }`}
                        >
                            {isLogin ? 'REGISTER HERE' : 'LOGIN INSTEAD'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
