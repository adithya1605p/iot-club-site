import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, Users, Trophy, Hourglass,
    ArrowLeft, ExternalLink, Download, AlertCircle, Loader2,
    LayoutGrid, Bell, Info, Scale, FileText, Rocket, Megaphone, Target
} from 'lucide-react';
import Button from '../components/ui/Button';

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'live': return (
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-bold tracking-[0.2em] text-sm uppercase">Event Live</span>
            </div>
        );
        case 'upcoming': return (
            <div className="flex items-center gap-2">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
                <span className="text-neon-cyan font-bold tracking-[0.2em] text-sm uppercase">Upcoming</span>
            </div>
        );
        case 'ended': return (
            <div className="flex items-center gap-2">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                <span className="text-gray-500 font-bold tracking-[0.2em] text-sm uppercase">Archive</span>
            </div>
        );
        default: return null;
    }
};

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const fetchEvent = async () => {
            const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
            if (data) setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event?.date_iso || event.status === 'ended') return;

        const targetDate = new Date(event.date_iso).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [event]);

    if (loading) return (
        <div className="min-h-screen bg-[#0a1111] flex items-center justify-center pt-20">
            <div className="flex flex-col items-center gap-4 text-neon-cyan font-mono">
                <Loader2 className="animate-spin w-12 h-12" />
                <p>Initializing Workspace...</p>
            </div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-[#0a1111] flex flex-col items-center justify-center pt-20 px-4 text-center">
            <h1 className="text-4xl text-white font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-400 mb-8 max-w-md">The workspace you are looking for does not exist or has been permanently deleted.</p>
            <Link to="/events" className="text-neon-cyan hover:underline flex items-center gap-2 font-mono"><ArrowLeft size={16} /> Return to Events</Link>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Info size={16} /> },
        ...(event.rules && event.rules.length > 0 ? [{ id: 'rules', label: 'Rules', icon: <Scale size={16} /> }] : []),
        ...(event.handouts && event.handouts.length > 0 ? [{ id: 'handouts', label: 'Handouts', icon: <FileText size={16} /> }] : []),
        ...(event.status !== 'ended' ? [{ id: 'submit', label: 'Submit Project', icon: <Rocket size={16} /> }] : [])
    ];

    return (
        <div className="min-h-screen bg-[#0a1111] font-sans pb-20">
            {/* Cinematic Hero Header */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1111] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-black/40 z-0"></div>

                {event.cover_image && (
                    <img
                        src={event.cover_image}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={event.title}
                    />
                )}

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full pt-20">
                    <Link to="/events" className="text-gray-300 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors text-sm font-mono bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <ArrowLeft size={16} /> Back to Feed
                    </Link>

                    <div className="mb-4">
                        <StatusBadge status={event.status} />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight text-white tracking-tight">
                        {event.title}
                    </h2>

                    {/* Glowing Countdown Timer */}
                    {event.status === 'upcoming' && (
                        <div className="flex gap-4 md:gap-8 bg-neon-cyan/5 backdrop-blur-md p-6 rounded-xl border border-neon-cyan/20 self-start">
                            {timeLeft.days > 0 && (
                                <>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl md:text-5xl font-bold text-neon-cyan drop-shadow-[0_0_20px_rgba(13,242,242,0.5)]">{String(timeLeft.days).padStart(2, '0')}</span>
                                        <span className="text-[10px] uppercase tracking-widest opacity-60 text-neon-cyan mt-1">Days</span>
                                    </div>
                                    <div className="text-3xl md:text-5xl font-light text-neon-cyan/30 self-center">:</div>
                                </>
                            )}
                            <div className="flex flex-col items-center">
                                <span className="text-3xl md:text-5xl font-bold text-neon-cyan drop-shadow-[0_0_20px_rgba(13,242,242,0.5)]">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-60 text-neon-cyan mt-1">Hours</span>
                            </div>
                            <div className="text-3xl md:text-5xl font-light text-neon-cyan/30 self-center">:</div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl md:text-5xl font-bold text-neon-cyan drop-shadow-[0_0_20px_rgba(13,242,242,0.5)]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-60 text-neon-cyan mt-1">Mins</span>
                            </div>
                            <div className="text-3xl md:text-5xl font-light text-neon-cyan/30 self-center">:</div>
                            <div className="flex flex-col items-center flex-shrink-0 w-16">
                                <span className="text-3xl md:text-5xl font-bold text-neon-cyan drop-shadow-[0_0_20px_rgba(13,242,242,0.5)] tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-60 text-neon-cyan mt-1">Secs</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Interactive Sliding Tabs */}
            <div className="sticky top-[64px] z-40 bg-[#0a1111]/80 backdrop-blur-xl border-b border-neon-cyan/10">
                <div className="flex px-4 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[120px] py-4 border-b-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workspace Content Area */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">

                {/* Left: Feed/Overview Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {event.tagline && (
                                        <div className="bg-neon-cyan/5 border border-neon-cyan/10 rounded-xl p-6">
                                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                                                <Megaphone className="text-neon-cyan" size={24} /> Mission Briefing
                                            </h3>
                                            <p className="text-lg font-mono text-neon-cyan/80 italic border-l-4 border-neon-cyan pl-4 py-1">"{event.tagline}"</p>
                                        </div>
                                    )}

                                    <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed prose-h3:text-white max-w-none bg-white/5 p-6 rounded-xl border border-white/5">
                                        <p className="whitespace-pre-wrap text-lg opacity-90">{event.description || 'Welcome to the workspace.'}</p>
                                    </div>

                                    {/* Action Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#102222]/80 backdrop-blur-md p-6 rounded-xl border border-neon-cyan/10 hover:border-neon-cyan/40 transition-all cursor-pointer group">
                                            <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                                                <Users className="text-neon-cyan" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2 text-white">Team Formation</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed font-mono">Join the Discord server to find your squad and plan your architecture.</p>
                                        </div>
                                        <div className="bg-[#102222]/80 backdrop-blur-md p-6 rounded-xl border border-neon-cyan/10 hover:border-neon-cyan/40 transition-all cursor-pointer group">
                                            <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                                                <LayoutGrid className="text-neon-cyan" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2 text-white">Resources Portal</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed font-mono">Access cloud credits, IoT boilerplate code, and Figma templates.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RULES TAB */}
                            {activeTab === 'rules' && event.rules && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white mb-6">Protocol & Terms</h3>
                                    {event.rules.map((rule, idx) => (
                                        <div key={idx} className="flex gap-4 p-5 bg-[#102222]/80 backdrop-blur-xl border border-neon-cyan/10 rounded-xl hover:bg-neon-cyan/5 hover:border-neon-cyan/30 transition-all">
                                            <span className="text-neon-cyan font-mono font-bold text-xl">{String(idx + 1).padStart(2, '0')}</span>
                                            <p className="text-gray-300 leading-relaxed pt-1">{rule}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* HANDOUTS TAB */}
                            {activeTab === 'handouts' && event.handouts && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-white mb-2">Classified Documents</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {event.handouts.map((doc, idx) => (
                                            <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer"
                                                className="group p-5 bg-[#102222]/80 border border-white/10 rounded-xl hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center group-hover:text-neon-purple transition-colors">
                                                        {doc.type === 'pdf' ? <Download size={20} /> : <ExternalLink size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium group-hover:text-neon-purple transition-colors truncate max-w-[150px]">{doc.title}</p>
                                                        <p className="text-xs text-neon-cyan uppercase font-mono mt-1">{doc.type}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SUBMIT TAB */}
                            {activeTab === 'submit' && (
                                <div className="bg-gradient-to-br from-neon-cyan/10 to-transparent border border-neon-cyan/20 rounded-2xl p-8 lg:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                    {event.submission_link ? (
                                        <>
                                            <div className="w-20 h-20 bg-black/50 border border-neon-cyan/30 text-neon-cyan rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(13,242,242,0.2)]">
                                                <Rocket size={40} className="ml-1" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-4">Launch Sequence</h3>
                                            <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">Ensure all repositories are public and documentation is finalized. Deploy your project to the central mainframe below.</p>
                                            <a href={event.submission_link} target="_blank" rel="noopener noreferrer" className="block w-full max-w-xs">
                                                <Button variant="primary" className="w-full h-14 text-lg shadow-[0_0_20px_rgba(13,242,242,0.4)] flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                                                    Open Portal <ExternalLink size={20} />
                                                </Button>
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                                <AlertCircle size={32} className="text-gray-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-400 mb-3">No Comm Link Established</h3>
                                            <p className="text-gray-500 max-w-sm">The submission portal is not active for this event yet.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Sidebar / Meta Info */}
                <div className="space-y-6">
                    {/* Primary Meta CTA Box */}
                    <div className="bg-gradient-to-br from-neon-purple/10 to-transparent border border-neon-purple/20 rounded-xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Target className="text-neon-purple" /> Event Status</h3>

                            {event.status !== 'ended' && event.registration_open && event.slug ? (
                                <>
                                    <div className="w-full bg-black/50 border border-white/10 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="bg-neon-purple h-2 rounded-full w-[10%] animate-pulse"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mb-6 font-mono">
                                        <span>Capacity Limit</span>
                                        <span className="text-neon-purple font-bold">Open</span>
                                    </div>
                                    <Link to={`/register/${event.slug}`} className="block">
                                        <Button variant="outline" className="w-full border-neon-purple/50 text-neon-purple hover:bg-neon-purple hover:text-white transition-all">
                                            Register Identity
                                        </Button>
                                    </Link>
                                </>
                            ) : event.status === 'ended' ? (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                                    <p className="text-gray-400 font-mono text-sm">Event Concluded.</p>
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                                    <p className="text-red-400 font-mono text-sm">Registration Closed</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta Specs Grid */}
                    <div className="bg-[#102222]/80 backdrop-blur-xl border border-neon-cyan/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10">Technical Specs</h3>
                        <div className="space-y-6">
                            {event.date && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center shrink-0 border border-neon-cyan/20">
                                        <Calendar className="text-neon-cyan w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neon-cyan uppercase tracking-widest font-mono mb-1">Date</p>
                                        <p className="text-sm font-bold text-white leading-tight">{event.date}</p>
                                    </div>
                                </div>
                            )}
                            {event.time && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center shrink-0 border border-neon-cyan/20">
                                        <Clock className="text-neon-cyan w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neon-cyan uppercase tracking-widest font-mono mb-1">Timebox</p>
                                        <p className="text-sm font-bold text-white leading-tight">{event.time}</p>
                                        {event.info?.duration && <p className="text-xs text-gray-500 font-mono mt-0.5">{event.info.duration}</p>}
                                    </div>
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center shrink-0 border border-neon-cyan/20">
                                        <MapPin className="text-neon-cyan w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neon-cyan uppercase tracking-widest font-mono mb-1">Coordinates</p>
                                        <p className="text-sm font-bold text-white leading-tight">{event.location}</p>
                                    </div>
                                </div>
                            )}
                            {event.info?.team_size && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center shrink-0 border border-neon-cyan/20">
                                        <Users className="text-neon-cyan w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neon-cyan uppercase tracking-widest font-mono mb-1">Squad Size</p>
                                        <p className="text-sm font-bold text-white leading-tight">{event.info.team_size}</p>
                                    </div>
                                </div>
                            )}
                            {event.info?.prizes && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
                                        <Trophy className="text-yellow-500 w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-yellow-500 uppercase tracking-widest font-mono mb-1">Bounty</p>
                                        <p className="text-sm font-bold text-white leading-tight max-w-[150px] truncate">{event.info.prizes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
