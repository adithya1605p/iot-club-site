import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/* ── Countdown Hook ── */
function useCountdown(targetDateStr) {
    const calc = () => {
        const diff = new Date(targetDateStr) - Date.now();
        if (diff <= 0) return { days: 0, hrs: 0, min: 0, sec: 0, done: true };
        return {
            days: Math.floor(diff / 86400000),
            hrs: Math.floor((diff % 86400000) / 3600000),
            min: Math.floor((diff % 3600000) / 60000),
            sec: Math.floor((diff % 60000) / 1000),
            done: false,
        };
    };
    const [t, setT] = useState(calc);
    useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [targetDateStr]);
    return t;
}

const BG = () => (
    <>
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(to right,#1f2937 1px,transparent 1px),linear-gradient(to bottom,#1f2937 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(43,108,238,0.05) 0%, transparent 50%)' }} />
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06]"
            style={{ background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,0.28) 2px,rgba(0,0,0,0.28) 4px)' }} />
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] h-px w-24 opacity-30 animate-pulse"
                style={{ background: 'linear-gradient(90deg,transparent,#ccff00,transparent)' }} />
            <div className="absolute top-[60%] right-[15%] w-px h-36 opacity-30 animate-pulse"
                style={{ background: 'linear-gradient(180deg,transparent,#2b6cee,transparent)', animationDelay: '1s' }} />
            <div className="absolute bottom-[10%] left-[30%] w-2 h-2 bg-primary rounded-full blur-[2px]" style={{ animation: 'ping 3s ease-in-out infinite' }} />
        </div>
    </>
);

/* ── Event Card ── */
const EventCard = ({ event, featured, mt }) => {
    const cd = useCountdown(event.target);
    const [img, setImg] = useState(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: featured ? 0.1 : 0 }}
            className={`group relative ${mt} ${featured ? 'z-20' : ''}`}
        >
            {/* Glow for featured */}
            {featured && (
                <div className="absolute -inset-1 rounded-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'linear-gradient(to right,#ccff00,#2b6cee,#ccff00)', filter: 'blur(8px)' }} />
            )}

            <div className={`holo-card-v2 p-0 rounded-xl overflow-hidden transition-all duration-500 relative ${featured ? 'bg-black/80 border-primary/50' : ''}`}>
                {/* Featured badge */}
                {featured && (
                    <div className="absolute top-0 right-0 bg-cyber-lime text-black text-[10px] font-bold px-3 py-1 font-mono uppercase z-10">
                        Flagship Event
                    </div>
                )}
                {/* Top accent bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(to right,${event.accent},transparent)` }} />

                <div className={`p-6 relative ${featured ? 'p-8' : ''}`}>
                    {/* Shine overlay */}
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity"
                        style={{ background: 'linear-gradient(to right,transparent,white,transparent)', animation: 'none' }} />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <span className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider rounded"
                            style={{ background: `${event.accent}20`, border: `1px solid ${event.accent}50`, color: event.accent }}>
                            {event.category}
                        </span>
                        {featured
                            ? <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            : <span className="material-symbols-outlined text-white/30 group-hover:text-white/70 transition-colors">{event.icon}</span>
                        }
                    </div>

                    {/* Title */}
                    <h3 className={`font-black italic leading-none text-white mb-2 group-hover:text-cyber-lime transition-colors ${featured ? 'text-5xl' : 'text-3xl'}`}>
                        {event.title}
                    </h3>
                    {event.subtitle && (
                        <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-widest">{event.subtitle}</p>
                    )}

                    {/* Location for featured */}
                    {featured && (
                        <div className="flex items-center gap-2 text-sm font-mono text-primary mb-6">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            <span>{event.location}</span>
                        </div>
                    )}

                    {/* Date for non-featured */}
                    {!featured && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{event.date}</span>
                        </div>
                    )}

                    {/* Image */}
                    <div className={`relative mb-6 border border-white/10 bg-black/50 rounded-lg overflow-hidden group-hover:border-opacity-80 transition-colors ${featured ? 'h-48' : 'h-32'}`}
                        style={{ '--tw-border-opacity': 1, borderColor: `${event.accent}40` }}>
                        {event.image
                            ? <img src={event.image} alt={event.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity" />
                            : <div className="w-full h-full bg-gradient-to-br from-black to-slate-900 flex items-center justify-center">
                                <div className="text-[80px] leading-none font-black text-white/5 select-none">48H</div>
                            </div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        {/* Seat / status */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 text-[10px] font-mono border"
                            style={{ background: 'rgba(0,0,0,0.85)', borderColor: `${event.accent}40`, color: event.accent }}>
                            {event.status}
                        </div>
                        {featured && (
                            <div className="absolute bottom-4 left-4">
                                <div className="text-[10px] text-slate-400 uppercase">Theme</div>
                                <div className="text-white font-bold text-lg">{event.theme}</div>
                            </div>
                        )}
                    </div>

                    {/* Countdown */}
                    <div className={`grid grid-cols-4 gap-1 mb-6 text-center font-mono text-xs border-t border-b border-white/5 py-3 ${featured ? 'gap-2 border border-white/10 bg-white/5 rounded p-2' : ''}`}>
                        {['DAYS', 'HRS', 'MIN', 'SEC'].map((label, i) => {
                            const val = [cd.days, cd.hrs, cd.min, cd.sec][i];
                            const isLast = i === 3;
                            return (
                                <div key={label}>
                                    <span className={`block font-bold ${featured ? 'text-2xl' : 'text-lg'} ${isLast && !cd.done ? 'text-cyber-lime animate-pulse' : 'text-white'}`}>
                                        {String(val).padStart(2, '0')}
                                    </span>
                                    <span className="text-[8px] text-slate-500">{label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <button
                        className={`w-full font-bold uppercase tracking-[0.2em] transition-all glow-btn-v2 ${featured
                            ? 'py-4 bg-primary hover:bg-cyber-lime hover:text-black text-white text-sm font-black shadow-[0_0_20px_rgba(43,108,238,0.4)] hover:shadow-[0_0_40px_rgba(204,255,0,0.6)]'
                            : 'py-3 bg-white/5 hover:text-black border border-white/20 text-xs'
                            }`}
                        style={!featured ? { '--hover-bg': event.accent } : {}}
                        onMouseEnter={e => { if (!featured) { e.target.style.background = event.accent; e.target.style.borderColor = event.accent; } }}
                        onMouseLeave={e => { if (!featured) { e.target.style.background = ''; e.target.style.borderColor = ''; } }}
                    >
                        {cd.done ? 'View_Gallery' : 'Register_Now'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Events Data ── */
const EVENTS = [
    {
        id: 'sensor',
        title: 'Sensor Strike',
        subtitle: 'Hardware Challenge',
        category: 'Hardware Challenge',
        icon: 'sensors',
        date: '14 November 2024',
        location: 'CSE Seminar Hall, Block-1, GCET',
        image: '/events/sensor_strike_7.jpeg',
        accent: '#2b6cee',
        status: 'COMPLETED',
        theme: 'Sensor Mastery',
        desc: 'Students faced off across three live tracks — Sensor Showdown, Smart Snatch, and Circuit Chase. The goal: interface real sensors, build live data pipelines, and solve embedded challenges under pressure.',
        target: '2024-11-14',
    },
    {
        id: 'bid2build',
        title: 'BID2BUILD',
        subtitle: 'Ideathon',
        category: 'Ideathon',
        icon: 'lightbulb',
        date: '22 – 23 August 2025',
        location: 'Main Campus, GCET',
        image: '/events/bid2build_1.jpeg',
        accent: '#ccff00',
        status: 'UPCOMING',
        theme: '4 Domains · ₹16,000+ Prizes',
        desc: 'Teams bid on real-world problem statements across Agritech, Edutech, Healthcare, and Open Innovation — then build and pitch live solutions in 48 hours. Our largest event to date.',
        target: '2025-08-22',
        featured: true,
    },
    {
        id: 'iotverse',
        title: 'IoT Verse 2K23',
        subtitle: 'Annual Symposium',
        category: 'Symposium',
        icon: 'hub',
        date: '14 – 15 December 2023',
        location: 'GCET Campus',
        image: '/events/iotverse_1.png',
        accent: '#a855f7',
        status: 'COMPLETED',
        theme: 'Smart Living',
        desc: 'Two-day symposium featuring a keynote by Mr. Bharadwaj Arvapally, live project showcases, idea pitching rounds, and a tech quiz spanning Smart Healthcare, Education, and Agriculture.',
        target: '2023-12-14',
    },
];

const Events = () => {
    const [lightbox, setLightbox] = useState(null);

    return (
        <div className="font-display text-slate-100 overflow-x-hidden" style={{ background: '#05070a' }}>
            <BG />
            <main className="relative z-10 min-h-screen pt-32 pb-20">

                {/* ── Hero Header ── */}
                <div className="max-w-7xl mx-auto px-8 mb-20 relative text-center">
                    <div className="inline-block relative mb-4">
                        <span className="absolute -top-6 -right-6 text-cyber-lime material-symbols-outlined text-4xl animate-pulse-slow opacity-50">
                            wifi_tethering
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white"
                            style={{ textShadow: '0 0 30px rgba(43,108,238,0.3)' }}>
                            EVENTS<span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(135deg,#ccff00,#2b6cee)' }}>_HUB</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto border-t border-b border-white/10 py-4 uppercase tracking-widest">
                        // Synchronize with our workshops, hackathons, and flagship events.
                    </p>
                </div>

                {/* ── 3D Staggered Event Cards ── */}
                <div className="max-w-7xl mx-auto px-4 relative min-h-[800px] flex items-center justify-center">
                    {/* Bg orbit deco */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                        <div className="relative w-[600px] h-[600px] flex items-center justify-center opacity-20">
                            <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-[10%] border border-dashed border-cyber-lime/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute inset-[30%] border border-white/10 rounded-full animate-pulse-slow" />
                            <div className="w-32 h-32 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg,rgba(43,108,238,0.2),rgba(204,255,0,0.1))' }} />
                            <div className="absolute text-[20vw] font-black text-white/5 select-none animate-pulse-slow">2025</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full max-w-7xl relative z-10">
                        <EventCard event={EVENTS[0]} mt="lg:mt-20 animate-float" />
                        <EventCard event={EVENTS[1]} featured mt="animate-float-delayed lg:-translate-y-12 z-20" />
                        <EventCard event={EVENTS[2]} mt="lg:mt-32 animate-float" />
                    </div>
                </div>

                {/* ── Archive Terminal ── */}
                <div className="max-w-4xl mx-auto px-8 mt-32">
                    <div className="border border-white/10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                        <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-slate-500 font-mono text-xs">archive_log.txt</span>
                        </div>
                        <div className="p-6 h-64 overflow-y-auto custom-scrollbar-v2 space-y-3 font-mono text-xs">
                            <div className="text-slate-500 mb-4">// Past Event Log — Read Only Access</div>
                            {[
                                { date: '2025-08-22', name: 'BID2BUILD_IDEATHON', desc: '₹16,000+ prizes across 4 themes' },
                                { date: '2024-11-14', name: 'SENSOR_STRIKE', desc: 'Sensor Showdown, Smart Snatch, Circuit Chase' },
                                { date: '2023-12-14', name: 'IOT_VERSE_2K23', desc: 'Guest lectures + project exhibition' },
                                { date: '2022-12-02', name: 'TECHNOPHILIA_2K22', desc: 'Arduino workshop + Mr. Seshu Kumar (Wipro)' },
                            ].map(e => (
                                <div key={e.date} className="flex gap-4 group hover:bg-white/5 p-1 rounded transition-colors cursor-pointer">
                                    <span className="text-slate-600 w-24 shrink-0">{e.date}</span>
                                    <span className="text-primary font-bold">{e.name}</span>
                                    <span className="text-slate-400 hidden md:block">— {e.desc}</span>
                                    <span className="text-green-500 ml-auto opacity-0 group-hover:opacity-100 shrink-0">[COMPLETED]</span>
                                </div>
                            ))}
                            <div className="animate-pulse text-cyber-lime mt-4">_</div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Events;
