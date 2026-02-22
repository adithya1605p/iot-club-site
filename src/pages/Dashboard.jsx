import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LogOut, User, Loader2, Zap, Cpu, Wifi } from 'lucide-react';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // Determine what announcements this user is allowed to see
                let allowedAudiences = ['all', profileData.role];
                let currentStatus = 'pending';

                // Fetch Application Status
                if (profileData?.roll_number) {
                    const { data: regData } = await supabase
                        .from('registrations')
                        .select('status')
                        .eq('roll_number', profileData.roll_number)
                        .single();

                    if (regData) {
                        currentStatus = regData.status || 'pending';
                        setApplicationStatus(currentStatus);
                    }
                }

                // Add their recruitment status to allowed audiences
                allowedAudiences.push(currentStatus);

                // Fetch Targeted Announcements
                const { data: annData, error: annError } = await supabase
                    .from('announcements')
                    .select('*')
                    .in('target_audience', allowedAudiences)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (!annError) setAnnouncements(annData);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <Loader2 className="animate-spin text-neon-cyan" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex justify-between items-center bg-surface/40 p-6 rounded-2xl border border-white/10 backdrop-blur-xl"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neon-cyan/20 text-neon-cyan rounded-full flex items-center justify-center">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profile?.full_name || user.email}</h1>
                        <p className="text-neon-cyan font-mono text-sm">{profile?.roll_number || 'No Roll Number'}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    {profile?.role === 'core' && (
                        <Button variant="outline" onClick={() => navigate('/core-panel')} className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white">
                            Core Panel
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleSignOut} className="flex gap-2 items-center text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Recruitment Status Card */}
                    {applicationStatus && (
                        <Card className={`p-6 border ${applicationStatus === 'selected' ? 'border-green-500/30 bg-green-500/5' :
                            ['r1_quiz', 'r2_gd', 'r3_interview'].includes(applicationStatus) ? 'border-neon-purple/30 bg-neon-purple/5' :
                                applicationStatus === 'rejected' ? 'border-red-500/30 bg-red-500/5' :
                                    'border-white/10 bg-white/5'
                            }`}>
                            <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                                Application Status
                                {applicationStatus === 'selected' && <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-wider">Accepted</span>}
                                {applicationStatus === 'r1_quiz' && <span className="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Round 1</span>}
                                {applicationStatus === 'r2_gd' && <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Round 2</span>}
                                {applicationStatus === 'r3_interview' && <span className="text-xs bg-neon-purple/20 text-neon-purple px-3 py-1 rounded-full uppercase tracking-wider font-mono">Round 3</span>}
                                {applicationStatus === 'rejected' && <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full uppercase tracking-wider">Not Selected</span>}
                                {(applicationStatus === 'pending' || !applicationStatus) && <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full uppercase tracking-wider">In Review</span>}
                            </h2>
                            <p className="text-sm font-mono text-gray-400">
                                {applicationStatus === 'selected' ? 'Congratulations you are selected as a member of IoT Club!' :
                                    applicationStatus === 'r1_quiz' ? 'You made it to Round 1 (Quiz)! Please check your email or announcements for instructions.' :
                                        applicationStatus === 'r2_gd' ? 'Great job! You have advanced to Round 2 (Group Discussion). Check announcements for the schedule.' :
                                            applicationStatus === 'r3_interview' ? 'Fantastic! You are in the final Round 3 (Interview). Check announcements for your time slot.' :
                                                applicationStatus === 'rejected' ? 'Unfortunately, your application was not selected this time. Keep tinkering!' :
                                                    'Your application has been received and is currently under review by the Core Team.'}
                            </p>

                            {applicationStatus === 'pending' && (
                                <div className="mt-4 w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div className="bg-neon-cyan h-full w-[20%] animate-pulse"></div>
                                </div>
                            )}
                            {applicationStatus === 'r1_quiz' && (
                                <div className="mt-4 w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div className="bg-red-500 h-full w-[40%] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                            )}
                            {applicationStatus === 'r2_gd' && (
                                <div className="mt-4 w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div className="bg-blue-500 h-full w-[60%] animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            )}
                            {applicationStatus === 'r3_interview' && (
                                <div className="mt-4 w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div className="bg-neon-purple h-full w-[80%] animate-pulse shadow-[0_0_10px_rgba(189,0,255,0.5)]"></div>
                                </div>
                            )}
                            {applicationStatus === 'selected' && (
                                <div className="mt-4 w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div className="bg-green-500 h-full w-full shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                                </div>
                            )}
                        </Card>
                    )}

                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Profile Data</h2>
                        <ul className="space-y-3 font-mono text-sm">
                            <li className="flex justify-between text-gray-400">
                                <span>Email:</span> <span className="text-white">{user.email}</span>
                            </li>
                            <li className="flex justify-between text-gray-400">
                                <span>Department:</span> <span className="text-white">{profile?.department || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between text-gray-400">
                                <span>Status:</span> <span className="text-neon-cyan capitalize">{profile?.role || 'Tinkerer'}</span>
                            </li>
                        </ul>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card className="p-6 border-neon-purple/20 bg-neon-purple/5">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Latest Updates / Links</h2>
                        {announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.map((ann) => (
                                    <div key={ann.id} className="bg-black/40 p-4 rounded-lg border border-neon-purple/20">
                                        <h3 className="text-neon-purple font-bold mb-1">{ann.title}</h3>
                                        <p className="text-gray-300 text-sm mb-3">{ann.content}</p>
                                        {ann.link && (
                                            <a href={ann.link} target="_blank" rel="noopener noreferrer" className="text-xs bg-neon-purple/20 text-neon-purple px-3 py-1.5 rounded font-mono hover:bg-neon-purple hover:text-white transition-colors inline-block">
                                                Open Link →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 font-mono text-center py-4 text-sm border border-dashed border-white/10 rounded-xl bg-black/20">
                                No new updates at this time.
                            </div>
                        )}
                    </Card>

                    {/* Fun Club Resources Section */}
                    <Card className="p-6 border-neon-cyan/20 bg-neon-cyan/5">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                            <Zap size={20} className="text-neon-cyan" />
                            Hardware Vault <span>(Coming Soon)</span>
                        </h2>
                        <p className="text-xs text-gray-400 font-mono mb-4 leading-relaxed">
                            Once you're inducted, you'll gain access to the club's inventory. We are building a checkout system for components.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col items-center justify-center text-center group cursor-not-allowed opacity-70">
                                <Cpu size={24} className="text-gray-400 mb-2 group-hover:text-neon-cyan transition-colors" />
                                <div className="text-sm font-bold text-white">ESP32 & Arduinos</div>
                                <div className="text-[10px] text-gray-500 font-mono">Microcontrollers</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col items-center justify-center text-center group cursor-not-allowed opacity-70">
                                <Wifi size={24} className="text-gray-400 mb-2 group-hover:text-neon-cyan transition-colors" />
                                <div className="text-sm font-bold text-white">IoT Sensors</div>
                                <div className="text-[10px] text-gray-500 font-mono">Temp, PIR, Sonar</div>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs text-center p-2 rounded font-mono">
                            Inventory System Locked (Lvl 1 Access Req)
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
