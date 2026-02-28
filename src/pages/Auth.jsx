import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await signIn(email, password);
                if (signInError) throw signInError;
                navigate('/');
            } else {
                if (!displayName.trim()) throw new Error("Display Name is required");
                const cleanRollNumber = rollNumber.trim().toUpperCase();
                if (cleanRollNumber.length !== 10) throw new Error("Roll Number must be exactly 10 characters.");
                if (!department.trim()) throw new Error("Department/Branch is required");

                const cleanEmail = email.trim().toLowerCase();
                const ADMIN_EMAILS = ['iotgcet2024@gmail.com', 'mdaahidsiddiqui@gmail.com', 'admin@gcetiot.com'];
                if (!cleanEmail.endsWith('@gcet.edu.in') && !ADMIN_EMAILS.includes(cleanEmail)) {
                    throw new Error("Please use your official college email (@gcet.edu.in).");
                }

                const { error: signUpError } = await signUp(cleanEmail, password, displayName, cleanRollNumber, department);
                if (signUpError) throw signUpError;

                // If Successful, login immediately or show success message depending on Supabase settings.
                // Assuming implicit login or requiring email confirmation:
                setError({ type: 'success', message: 'Registration Successful! Check your email if confirmation is required, or try logging in.' });
                setIsLogin(true);
            }
        } catch (err) {
            // Supabase can return errors as nested objects; extract string safely
            const msg = typeof err?.message === 'string'
                ? err.message
                : typeof err === 'string'
                    ? err
                    : JSON.stringify(err?.message ?? err) || 'An error occurred during authentication.';
            setError({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
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
                    {/* Decorative edge line */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${isLogin ? 'bg-neon-cyan' : 'bg-neon-purple'} transition-colors duration-500`}></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                            {isLogin ? 'SYSTEM ACCESS' : 'INITIALIZE USER'}
                        </h2>
                        <p className="text-gray-400 font-mono text-sm">
                            {isLogin ? 'Authenticate to continue your session.' : 'Create credentials to join the network.'}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-mono border ${error.type === 'error'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : 'bg-green-500/10 border-green-500/20 text-green-400'
                                }`}
                        >
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error.message}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 relative"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon size={18} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Identification Name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                                            required={!isLogin}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                placeholder="Roll No. (10 chars)"
                                                value={rollNumber}
                                                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                                                maxLength={10}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                                                required={!isLogin}
                                            />
                                        </div>
                                        <div className="w-1/2 relative">
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all appearance-none"
                                                required={!isLogin}
                                            >
                                                <option value="" disabled className="text-gray-500">Select Branch</option>
                                                <option value="CSE">CSE</option>
                                                <option value="ECE">ECE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="MECH">MECH</option>
                                                <option value="CIVIL">CIVIL</option>
                                                <option value="AIML">AI & ML</option>
                                                <option value="DS">DATA SCIENCE</option>
                                                <option value="CS">CYBER SECURITY</option>
                                                <option value="OTHER">OTHER</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="email"
                                placeholder="Comm-Link (Email)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${isLogin ? 'focus:border-neon-cyan focus:ring-neon-cyan' : 'focus:border-neon-purple focus:ring-neon-purple'
                                    }`}
                                required
                            />
                            {!isLogin && (
                                <p className="text-xs text-neon-purple/70 font-mono mt-2 ml-2">
                                    * Must end with @gcet.edu.in
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="password"
                                placeholder="Encryption Key (Password)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${isLogin ? 'focus:border-neon-cyan focus:ring-neon-cyan' : 'focus:border-neon-purple focus:ring-neon-purple'
                                    }`}
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold font-mono tracking-widest text-black transition-all ${loading ? 'opacity-70 cursor-not-allowed bg-gray-600' :
                                isLogin ? 'bg-neon-cyan hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'bg-neon-purple hover:bg-white hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]'
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

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-400 font-mono">
                            {isLogin ? "Don't have access credentials?" : "Already possess access credentials?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className={`mt-2 text-sm font-bold tracking-wider hover:underline transition-colors ${isLogin ? 'text-neon-purple' : 'text-neon-cyan'
                                }`}
                        >
                            {isLogin ? "REQUEST CLEARANCE (REGISTER)" : "RETURN TO LOGIN"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
