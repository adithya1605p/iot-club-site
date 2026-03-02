import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { team } from '../data/team';

const ROLE_COLORS = {
    'President': '#ccff00',
    'Vice President': '#2b6cee',
    'Secretary': '#2b6cee',
    'HR': '#a855f7',
    'Treasurer': '#f59e0b',
    'Technical Lead': '#2b6cee',
};

const ROLE_SHORT = {
    'President': 'PRESIDENT',
    'Vice President': 'VP',
    'Secretary': 'SECRETARY',
    'HR': 'HR LEAD',
    'Treasurer': 'TREASURER',
    'Technical Lead': 'TECH_LEAD',
};

/* Card positions in 3D cloud — translateZ + translate offsets */
const POSITIONS = [
    { z: 200, top: '50%', left: '50%', tx: '-50%', ty: '-50%', rotY: 0, scale: 1, zIndex: 20 },
    { z: 100, top: '30%', left: '20%', tx: '-50%', ty: '-50%', rotY: -20, scale: 0.9, zIndex: 10 },
    { z: 120, top: '40%', left: '85%', tx: '-50%', ty: '-50%', rotY: 25, scale: 0.9, zIndex: 10 },
    { z: -50, top: '75%', left: '30%', tx: '-50%', ty: '-50%', rotY: -15, scale: 0.85, zIndex: 5 },
    { z: -80, top: '20%', left: '75%', tx: '-50%', ty: '-50%', rotY: 15, scale: 0.85, zIndex: 5 },
    { z: -150, top: '60%', left: '60%', tx: '-50%', ty: '-50%', rotY: 180, scale: 0.8, zIndex: 2 },
];

const Team = () => {
    const [selected, setSelected] = useState(team[0]);
    const [cloudPaused, setCloudPaused] = useState(false);

    const accent = (m) => ROLE_COLORS[m?.role] ?? '#2b6cee';

    return (
        <div className="font-display text-slate-100 overflow-x-hidden" style={{ background: '#05070a' }}>
            {/* Grid bg */}
            <div className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to right,#1f2937 1px,transparent 1px),linear-gradient(to bottom,#1f2937 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Scanline */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06]"
                style={{ background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,0.28) 2px,rgba(0,0,0,0.28) 4px)' }} />
            {/* Circuit traces */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] h-px w-48 opacity-40 animate-pulse"
                    style={{ background: 'linear-gradient(90deg,transparent,#2b6cee,transparent)' }} />
                <div className="absolute top-[60%] right-[10%] w-px h-64 opacity-30 animate-pulse"
                    style={{ background: 'linear-gradient(180deg,transparent,#2b6cee,transparent)', animationDelay: '75ms' }} />
                <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-cyber-lime rounded-full blur-[2px] animate-ping" />
                <div className="absolute bottom-[40%] left-[15%] w-1 h-1 bg-primary rounded-full blur-[1px] animate-ping" style={{ animationDelay: '300ms' }} />
            </div>

            <main className="relative z-10 w-full overflow-hidden pt-24 min-h-screen flex flex-col">
                {/* ── Header ── */}
                <section className="relative w-full px-8 py-12 flex flex-col items-center justify-center z-10">
                    <h1 className="text-[12vw] md:text-[8vw] font-black italic leading-[0.8] text-center select-none pointer-events-none opacity-10 absolute top-0 left-1/2 -translate-x-1/2 text-outline-v2 w-full">
                        NETWORK
                    </h1>
                    <div className="relative z-20 text-center mb-8">
                        <span className="text-cyber-lime font-mono text-xs mb-2 block tracking-[0.2em]">// PERSONNEL_DATABASE</span>
                        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
                            TEAM <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#2b6cee,#ccff00)' }}>CLOUD</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto font-mono text-sm leading-relaxed">
                            Navigating the minds behind the machines.<br className="hidden md:block" />
                            Hover on a card to inspect — click to lock focus.
                        </p>
                    </div>
                </section>

                {/* ── 3D Cloud ── */}
                <section className="relative flex-grow w-full flex items-center justify-center overflow-hidden h-[800px] py-10"
                    style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
                    {/* Rotate hint */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3 rounded-full border border-white/10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
                        <span className="material-symbols-outlined text-slate-400 text-sm animate-spin-slow">360</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Click to Inspect</span>
                    </div>

                    {/* Ghost words */}
                    <div className="absolute top-[20%] left-[5%] z-0 opacity-15 pointer-events-none">
                        <h3 className="text-5xl font-black italic text-outline-v2" style={{ transform: 'rotate(-15deg)' }}>HARDWARE</h3>
                    </div>
                    <div className="absolute bottom-[20%] right-[5%] z-0 opacity-15 pointer-events-none">
                        <h3 className="text-5xl font-black italic text-outline-v2" style={{ transform: 'rotate(10deg)' }}>FIRMWARE</h3>
                    </div>

                    {/* The rotating cloud */}
                    <div
                        className="relative w-[600px] h-[600px]"
                        style={{
                            transformStyle: 'preserve-3d',
                            animation: cloudPaused ? 'none' : 'float-cloud 20s linear infinite',
                        }}
                        onMouseEnter={() => setCloudPaused(true)}
                        onMouseLeave={() => setCloudPaused(false)}
                    >
                        {/* Central glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-pulse-slow"
                            style={{ background: 'rgba(43,108,238,0.2)', filter: 'blur(40px)' }} />

                        {/* SVG connectors */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(-20px)' }}>
                            <line stroke="#2b6cee" strokeOpacity="0.2" strokeWidth="1" x1="50%" y1="50%" x2="20%" y2="30%" />
                            <line stroke="#2b6cee" strokeOpacity="0.2" strokeWidth="1" x1="50%" y1="50%" x2="85%" y2="40%" />
                            <line stroke="#2b6cee" strokeOpacity="0.1" strokeWidth="1" x1="20%" y1="30%" x2="30%" y2="75%" />
                            <line stroke="#ccff00" strokeOpacity="0.08" strokeWidth="1" x1="85%" y1="40%" x2="75%" y2="20%" />
                        </svg>

                        {/* Team member ID cards */}
                        {team.map((member, i) => {
                            const pos = POSITIONS[i] ?? POSITIONS[POSITIONS.length - 1];
                            const color = accent(member);
                            const isFocused = selected?.id === member.id;
                            const firstName = member.name.split(' ').pop().toUpperCase();
                            const cardSize = pos.scale >= 1 ? 'w-64' : pos.scale >= 0.9 ? 'w-56' : 'w-48';
                            const opacity = pos.scale >= 0.85 ? 1 : 0.7;

                            return (
                                <div
                                    key={member.id}
                                    className="floating-id-card group"
                                    style={{
                                        top: pos.top, left: pos.left,
                                        transform: `translate(${pos.tx}, ${pos.ty}) translateZ(${pos.z}px) rotateY(${pos.rotY}deg)`,
                                        zIndex: isFocused ? 50 : pos.zIndex,
                                        opacity,
                                    }}
                                    onClick={() => setSelected(member)}
                                >
                                    <div className={`term-panel-v2 ${cardSize} p-1 relative overflow-hidden transition-all duration-300 group-hover:scale-110`}
                                        style={{ borderColor: isFocused ? color : '#2b6cee' }}>
                                        {/* Verified badge */}
                                        {isFocused && (
                                            <div className="absolute top-0 right-0 p-2 opacity-70">
                                                <span className="material-symbols-outlined text-cyber-lime" style={{ fontSize: '16px' }}>verified</span>
                                            </div>
                                        )}

                                        {/* Avatar + name */}
                                        <div className="bg-black/40 p-3 mb-1 border-b border-white/10 flex items-center gap-3">
                                            <div className={`${pos.scale >= 1 ? 'w-10 h-10' : 'w-8 h-8'} rounded bg-slate-800 border border-white/20 overflow-hidden shrink-0`}>
                                                <img src={member.image} alt={member.name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white tracking-widest truncate max-w-[120px]"
                                                    style={{ color: isFocused ? color : 'white' }}>
                                                    {firstName}
                                                </div>
                                                <div className="text-[9px] font-mono" style={{ color }}>
                                                    {ROLE_SHORT[member.role]}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail rows */}
                                        {pos.scale >= 0.9 && (
                                            <div className="px-3 py-2 text-[10px] text-slate-400 font-mono leading-relaxed">
                                                &gt; {member.bio.split(' ').slice(0, 5).join(' ')}...
                                            </div>
                                        )}

                                        {/* Status bottom row */}
                                        <div className="px-3 pb-2 flex justify-between font-mono text-[9px]">
                                            <span className="text-slate-600">ID: {String(i + 1).padStart(3, '0')}</span>
                                            <span className="text-cyber-lime">ACTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Right Detail Panel ── */}
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.25 }}
                                className="absolute top-[10%] right-4 md:right-12 z-40 w-72 hidden lg:block"
                            >
                                <div className="relative overflow-hidden p-6"
                                    style={{
                                        background: 'rgba(0,0,0,0.92)',
                                        border: `1px solid ${accent(selected)}`,
                                        boxShadow: `0 0 50px ${accent(selected)}18`,
                                        backdropFilter: 'blur(20px)',
                                    }}>
                                    {/* Corner accents */}
                                    <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2" style={{ borderColor: accent(selected) }} />
                                    <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2" style={{ borderColor: accent(selected) }} />

                                    {/* Name + role */}
                                    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-black italic text-white mb-1">{selected.name}</h3>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="text-[10px] px-2 py-0.5 font-mono"
                                                    style={{ background: `${accent(selected)}20`, border: `1px solid ${accent(selected)}40`, color: accent(selected) }}>
                                                    {selected.role.toUpperCase()}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 font-mono border border-cyber-lime/20 text-cyber-lime bg-cyber-lime/10">
                                                    L{selected.id === 1 ? 5 : 3} ACCESS
                                                </span>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-500">fingerprint</span>
                                    </div>

                                    {/* Photo */}
                                    <div className="w-20 h-20 overflow-hidden border-2 mb-4"
                                        style={{ borderColor: `${accent(selected)}50` }}>
                                        <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 font-mono text-xs text-slate-400 mb-6">
                                        <div className="flex justify-between"><span>DEPT:</span><span className="text-white">GCET IOT CLUB</span></div>
                                        <div className="flex justify-between"><span>BATCH:</span><span className="text-white">2022 – 2026</span></div>
                                        <div className="flex justify-between"><span>STATUS:</span><span className="text-cyber-lime animate-pulse">ONLINE</span></div>
                                    </div>

                                    {/* Bio */}
                                    <div className="p-3 border border-white/10 bg-white/5 mb-6">
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current Focus</div>
                                        <p className="text-xs text-slate-300 italic">"{selected.bio}"</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {selected.socials?.linkedin ? (
                                            <a href={selected.socials.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-1 py-2 font-bold text-xs uppercase tracking-widest transition-colors hover:opacity-90"
                                                style={{ background: accent(selected), color: '#000' }}>
                                                <Linkedin size={12} /> LinkedIn
                                            </a>
                                        ) : (
                                            <button className="flex-1 py-2 text-black font-bold text-xs uppercase tracking-widest"
                                                style={{ background: 'white' }}>Connect</button>
                                        )}
                                        <button className="flex-1 border border-white/20 text-white py-2 text-xs font-bold uppercase hover:bg-white/10 transition-colors">
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── Status bar ── */}
                <div className="w-full relative z-20 mt-auto border-t border-white/10"
                    style={{ background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(8px)' }}>
                    <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>SYSTEM STATUS: 100% OPERATIONAL</span>
                        </div>
                        <div className="hidden md:block">
                            <span>TEAM: {team.length} MEMBERS ACTIVE // GCET IOT CLUB 2024</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Team;
