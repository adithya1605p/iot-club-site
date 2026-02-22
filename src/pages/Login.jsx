import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Mail, Lock, Loader2, AlertCircle, User, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');

    // If user is already logged in, redirect to dashboard
    if (user) {
        navigate('/dashboard');
        return null;
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                // Formatting checks
                if (!email.endsWith('@gcet.edu.in')) throw new Error('Please use your official @gcet.edu.in email.');
                if (rollNumber.trim().length !== 10) throw new Error('Roll Number must be exactly 10 characters.');
                if (password.length < 6) throw new Error('Password must be at least 6 characters.');
                if (!department) throw new Error('Please select a department.');

                // 1. Sign up the user in auth.users
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;

                // 2. Insert into profiles table
                if (authData.user) {
                    const { error: profileError } = await supabase.from('profiles').insert([
                        {
                            id: authData.user.id,
                            full_name: fullName.trim(),
                            roll_number: rollNumber.trim().toUpperCase(),
                            department: department
                        }
                    ]);
                    if (profileError) throw profileError;
                }

                navigate('/dashboard');
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <Card className="w-full max-w-md p-8 relative border-neon-cyan/20 bg-black/80 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-2 tracking-tight"
                    >
                        {isLogin ? 'SYSTEM LOGIN' : 'CREATE ACCOUNT'}
                    </motion.h2>
                    <p className="text-gray-400 font-mono text-sm">
                        {isLogin ? 'Authenticate to access your dashboard.' : 'Register for your secure profile.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <>
                            <InputGroup
                                icon={<User size={18} />}
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <InputGroup
                                icon={<Hash size={18} />}
                                type="text"
                                placeholder="Roll Number"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                maxLength="10"
                                required
                            />
                            <div className="space-y-1">
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
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
                        </>
                    )}

                    <InputGroup
                        icon={<Mail size={18} />}
                        type="email"
                        placeholder="College Email (@gcet.edu.in)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <InputGroup
                        icon={<Lock size={18} />}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-2 text-sm"
                        >
                            <AlertCircle size={16} />
                            <span>{errorMsg}</span>
                        </motion.div>
                    )}

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-full py-4 text-sm font-bold tracking-widest uppercase mt-4"
                        disabled={loading}
                    >
                        {loading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="animate-spin" /> Processing...</span> : (isLogin ? 'Authenticate' : 'Initialize')}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMsg('');
                        }}
                        className="text-gray-400 hover:text-neon-cyan text-sm transition-colors font-mono"
                    >
                        {isLogin ? "Don't have an account? Create one" : "Already registered? Login here"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

const InputGroup = ({ icon, ...props }) => (
    <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
            {icon}
        </div>
        <input
            {...props}
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
        />
    </div>
);

export default Login;
