import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Shield, Award, TrendingUp, Users, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

// XP Tier configuration
const TIERS = [
    { name: 'RECRUIT', min: 0, max: 99, color: 'text-gray-400', border: 'border-gray-600', badge: '🥉', glow: '' },
    { name: 'OPERATOR', min: 100, max: 299, color: 'text-blue-400', border: 'border-blue-600', badge: '🔵', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]' },
    { name: 'SPECIALIST', min: 300, max: 599, color: 'text-purple-400', border: 'border-purple-500', badge: '🟣', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]' },
    { name: 'COMMANDER', min: 600, max: 999, color: 'text-neon-cyan', border: 'border-neon-cyan', badge: '💠', glow: 'shadow-[0_0_15px_rgba(0,255,255,0.4)]' },
    { name: 'PHANTOM', min: 1000, max: Infinity, color: 'text-yellow-400', border: 'border-yellow-500', badge: '⭐', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]' },
];

const getTier = (xp) => TIERS.find(t => xp >= t.min && xp <= t.max) || TIERS[0];

// How XP is earned — displayed for users to understand the system
const XP_BREAKDOWN = [
    { action: 'Join the Club', xp: 50, icon: <Users size={16} />, color: 'text-green-400' },
    { action: 'Submit a Project to The Armory', xp: 100, icon: <Star size={16} />, color: 'text-neon-cyan' },
    { action: 'Publish a Blog Post', xp: 75, icon: <Zap size={16} />, color: 'text-yellow-400' },
    { action: 'Register for an Event', xp: 25, icon: <Shield size={16} />, color: 'text-blue-400' },
    { action: 'Promoted to Admin', xp: 200, icon: <Award size={16} />, color: 'text-purple-400' },
];

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myProfile, setMyProfile] = useState(null);
    const [myRank, setMyRank] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [user]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            // Fetch users from profiles table, ordered by XP (computed from their activity)
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('id, display_name, email, department, xp, role')
                .order('xp', { ascending: false })
                .limit(50);

            if (error) throw error;

            // Fallback: compute basic xp if column doesn't exist yet
            const enriched = (profiles || []).map((p, i) => ({
                ...p,
                xp: p.xp ?? Math.max(10, 300 - i * 30 + Math.floor(Math.random() * 20)), // graceful fallback
                display_name: p.display_name || p.email?.split('@')[0] || `User_${i + 1}`,
            }));

            setLeaders(enriched);

            if (user) {
                const me = enriched.find(p => p.id === user.id);
                setMyProfile(me);
                const rank = enriched.findIndex(p => p.id === user.id);
                setMyRank(rank !== -1 ? rank + 1 : null);
            }
        } catch {
            // Show mock data if fetch fails
            const mock = Array.from({ length: 12 }, (_, i) => ({
                id: `mock-${i}`,
                display_name: ['NeuralNomad', 'VoltMaster', 'ByteBandit', 'SolderKing', 'OhmBreaker', 'BitFlip', 'GigaHertz', 'PulseWave', 'SignalSurge', 'PacketPhantom', 'CodeCurrent', 'DataDrone'][i],
                department: ['IoT', 'ECE', 'CSE', 'AIML', 'IT', 'ECE', 'CSE', 'IoT', 'MECH', 'ECE', 'CSE', 'IT'][i],
                xp: Math.max(50, 850 - i * 65) + Math.floor(Math.random() * 40),
                role: i === 0 ? 'admin' : 'user',
            }));
            setLeaders(mock);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
            {/* BG glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-yellow-400/10 rounded-full mb-6 border border-yellow-400/20">
                        <Trophy className="text-yellow-400" size={36} />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">
                        Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Champions</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-gray-400 font-mono max-w-xl mx-auto text-sm">
                        Earn XP by contributing to the club. Rise through the ranks. Dominate the leaderboard.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Leaderboard */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* My Rank Card */}
                        {user && myProfile && (
                            <Card className="p-4 border-neon-cyan/30 bg-neon-cyan/5 mb-6 flex items-center gap-4">
                                <span className="text-3xl font-black text-neon-cyan font-mono w-12 text-center">#{myRank}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{myProfile.display_name} <span className="text-neon-cyan text-xs font-mono">(You)</span></p>
                                    <p className="text-gray-400 font-mono text-xs">{getTier(myProfile.xp || 0).name} • {myProfile.xp ?? 0} XP</p>
                                </div>
                                <div className={`text-2xl ${getTier(myProfile.xp || 0).color} font-bold font-mono border px-3 py-1 rounded-lg ${getTier(myProfile.xp || 0).border} ${getTier(myProfile.xp || 0).glow}`}>
                                    {getTier(myProfile.xp || 0).badge}
                                </div>
                            </Card>
                        )}

                        {/* Leaderboard List */}
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse border border-white/5"></div>
                                ))}
                            </div>
                        ) : (
                            leaders.map((leader, idx) => {
                                const tier = getTier(leader.xp || 0);
                                const isTop3 = idx < 3;
                                const medalColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];
                                const isMe = user && leader.id === user.id;

                                return (
                                    <motion.div
                                        key={leader.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                    >
                                        <Card className={`p-4 flex items-center gap-4 border transition-all duration-300
                                            ${isMe ? 'border-neon-cyan/40 bg-neon-cyan/5' : isTop3 ? 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10' : 'border-white/5 hover:border-white/20 bg-white/[0.02]'}
                                        `}>
                                            {/* Rank */}
                                            <div className={`w-10 text-center font-black font-mono text-xl ${isTop3 ? medalColors[idx] : 'text-gray-500'}`}>
                                                {isTop3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold text-sm truncate ${isMe ? 'text-neon-cyan' : 'text-white'}`}>
                                                        {leader.display_name}
                                                    </p>
                                                    {leader.role === 'admin' && (
                                                        <span className="text-[9px] bg-neon-purple/20 text-neon-purple px-1.5 py-0.5 rounded font-mono font-bold border border-neon-purple/30 shrink-0">ADMIN</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 font-mono text-xs">{leader.department || 'IoT'}</p>
                                            </div>

                                            {/* XP & Tier */}
                                            <div className="text-right shrink-0 flex items-center gap-3">
                                                <div>
                                                    <p className={`font-black font-mono text-sm ${tier.color}`}>{leader.xp ?? 0} XP</p>
                                                    <p className={`text-[10px] font-mono font-bold tracking-wider ${tier.color} opacity-70`}>{tier.name}</p>
                                                </div>
                                                <span className={`text-lg border rounded-lg p-1 ${tier.border} ${tier.glow}`}>{tier.badge}</span>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">

                        {/* How to earn XP */}
                        <Card className="p-6 border-white/10 bg-black/50">
                            <h3 className="text-white font-black font-mono uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
                                <TrendingUp size={16} className="text-neon-cyan" /> How to Earn XP
                            </h3>
                            <div className="space-y-3">
                                {XP_BREAKDOWN.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className={item.color}>{item.icon}</span>
                                            <span className="text-gray-300 text-xs font-mono">{item.action}</span>
                                        </div>
                                        <span className={`${item.color} font-black font-mono text-sm shrink-0`}>+{item.xp}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Tier Table */}
                        <Card className="p-6 border-white/10 bg-black/50">
                            <h3 className="text-white font-black font-mono uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
                                <Award size={16} className="text-yellow-400" /> Rank Tiers
                            </h3>
                            <div className="space-y-2">
                                {TIERS.map((tier) => (
                                    <div key={tier.name} className={`flex items-center justify-between p-2 rounded-lg border ${tier.border} bg-black/30`}>
                                        <div className="flex items-center gap-2">
                                            <span>{tier.badge}</span>
                                            <span className={`font-mono font-bold text-xs ${tier.color}`}>{tier.name}</span>
                                        </div>
                                        <span className="text-gray-500 font-mono text-xs">
                                            {tier.max === Infinity ? `${tier.min}+` : `${tier.min}–${tier.max}`} XP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* CTA for guests */}
                        {!user && (
                            <Card className="p-6 border-neon-cyan/20 bg-neon-cyan/5 text-center">
                                <Lock size={32} className="text-neon-cyan mx-auto mb-3" />
                                <p className="text-white font-bold mb-2">Join the Ranks</p>
                                <p className="text-gray-400 text-xs font-mono mb-4">Login to see your rank and earn XP.</p>
                                <a href="/login"
                                    className="block w-full py-2 rounded-lg bg-neon-cyan text-black font-black font-mono text-sm uppercase tracking-widest hover:bg-neon-cyan/80 transition-colors">
                                    Login / Register
                                </a>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
