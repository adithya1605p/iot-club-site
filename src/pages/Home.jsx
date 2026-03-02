import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { team } from '../data/team';

// ─── Background Effects ────────────────────────────────────────────────────────
const BackgroundEffects = () => (
    <>
        {/* Grid pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-10"
            style={{
                backgroundImage: 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        />
        {/* Scanline */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06]"
            style={{
                background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
        />
        {/* Circuit traces */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] h-px w-48 opacity-40 animate-pulse"
                style={{ background: 'linear-gradient(90deg, transparent, #2b6cee, transparent)' }} />
            <div className="absolute top-[60%] right-[10%] w-px h-64 opacity-30 animate-pulse delay-75"
                style={{ background: 'linear-gradient(180deg, transparent, #2b6cee, transparent)' }} />
            <div className="absolute bottom-[20%] left-[30%] h-px w-32 opacity-40"
                style={{ background: 'linear-gradient(90deg, transparent, #ccff00, transparent)' }} />
            <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-cyber-lime rounded-full blur-[2px] animate-ping" />
            <div className="absolute bottom-[40%] left-[15%] w-1 h-1 bg-primary rounded-full blur-[1px] animate-ping delay-300" />
        </div>
    </>
);

// ─── Hero Section ──────────────────────────────────────────────────────────────
const HeroSection = () => {
    const cardRef = useRef(null);
    const rotX = useMotionValue(0);
    const rotY = useMotionValue(0);
    const springX = useSpring(rotX, { stiffness: 150, damping: 20 });
    const springY = useSpring(rotY, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        rotY.set(((e.clientX - cx) / rect.width) * 14);
        rotX.set(-((e.clientY - cy) / rect.height) * 10);
    };
    const handleMouseLeave = () => { rotX.set(0); rotY.set(0); };

    return (
        <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
            style={{ perspective: '1000px' }}>
            {/* Big ghost text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[18vw] font-black italic leading-none whitespace-nowrap opacity-[0.06] text-white"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
                    INNOVATE
                </span>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-8 flex flex-col items-center gap-2 z-10">
                <div className="w-px h-12 bg-cyber-lime" />
                <span className="text-[10px] font-bold text-cyber-lime uppercase tracking-[0.3em]"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    Scroll to Explore
                </span>
            </div>

            {/* 3D hero card */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
                className="relative w-[600px] max-w-[90vw] h-[400px] z-10"
            >
                {/* Main card */}
                <div className="absolute inset-0 rounded-lg overflow-hidden border border-white/10 shadow-2xl"
                    style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(12px)' }}>
                    <img
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                        alt="Electronics circuit board"
                        className="w-[120%] h-[120%] object-cover opacity-30 mix-blend-luminosity -ml-[10%] -mt-[10%]"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(43,108,238,0.15) 100%)' }} />
                </div>

                {/* Floating badge: Status */}
                <div className="absolute -top-10 -right-8 z-20 border border-cyber-lime/30 p-4"
                    style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', transform: 'translateZ(30px)' }}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-cyber-lime" style={{ fontSize: '16px' }}>memory</span>
                        <span className="text-[10px] font-mono text-cyber-lime tracking-widest">MCU_STATUS</span>
                    </div>
                    <div className="text-2xl font-black font-mono tracking-tighter">
                        ACTIVE<span className="animate-pulse">_</span>
                    </div>
                </div>

                {/* Floating badge: Clock speed */}
                <div className="absolute -bottom-5 -left-8 z-20 border border-primary/30 p-4 w-60"
                    style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', transform: 'translateZ(20px)' }}>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Clock Speed</span>
                        <span className="text-xs font-mono text-primary">240MHz</span>
                    </div>
                    <div className="w-full h-1 bg-white/10">
                        <div className="w-[85%] h-full bg-primary relative">
                            <div className="absolute right-0 -top-1 w-2 h-3 bg-white shadow-[0_0_10px_#2b6cee]" />
                        </div>
                    </div>
                </div>

                {/* Center heading */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30">
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-3 text-white"
                        style={{ textShadow: '0 0 40px rgba(0,0,0,1)', lineHeight: 0.9 }}>
                        NEXT GEN<br />
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(135deg, #ccff00, #2b6cee)', textShadow: 'none' }}>
                            HARDWARE
                        </span>
                    </h1>
                    <p className="text-sm font-mono text-slate-400 px-4 py-1 border border-white/10"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        // BUILDING THE INTERNET OF TOMORROW
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ title, category, year, description, image, accent = '#2b6cee', offset = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: offset ? 48 : 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer relative overflow-hidden flex flex-col justify-between h-[400px] p-6"
        style={{
            background: 'rgba(13,17,23,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 20px rgba(43,108,238,0.08)',
            transition: 'all 0.3s ease',
        }}
        whileHover={{
            borderColor: accent,
            boxShadow: `0 0 30px ${accent}55`,
            y: offset ? 42 : -6,
        }}
    >
        {/* Image */}
        <div className="w-full h-40 mb-4 relative overflow-hidden bg-black/50">
            {image ? (
                <img src={image} alt={title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            ) : (
                <div className="w-full h-full flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined text-5xl text-white/20">code</span>
                </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, black, transparent)' }} />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 font-mono text-[10px] uppercase"
                style={{ border: `1px solid ${accent}50`, color: accent, background: `${accent}10` }}>
                {category}
            </span>
            <span className="px-2 py-0.5 border border-white/10 font-mono text-[10px] text-slate-400 uppercase">{year}</span>
        </div>

        <h4 className="text-2xl font-black italic mb-2 transition-colors group-hover:text-white" style={{ color: 'white' }}>
            {title}
        </h4>
        <p className="text-sm text-slate-400 line-clamp-3">{description}</p>

        {/* Hover action */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Initialize</span>
            <ArrowUpRight size={16} className="text-white" />
        </div>
    </motion.div>
);

// ─── Projects Section ─────────────────────────────────────────────────────────
const ProjectsSection = ({ projects }) => (
    <section className="py-24 relative overflow-hidden" style={{ background: 'rgba(5,7,10,0.5)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(43,108,238,0.03), transparent)' }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
                <div>
                    <span className="text-cyber-lime font-mono text-xs mb-2 block tracking-widest">// PORTFOLIO</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Featured{' '}
                        <span style={{ WebkitTextStroke: '1px #ccff00', color: 'transparent' }}>Projects</span>
                    </h2>
                </div>
                <Link to="/projects"
                    className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                    View Armory <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
                {projects.map((p, i) => (
                    <ProjectCard key={p.id || i} {...p} offset={i === 1} />
                ))}
            </div>
        </div>
    </section>
);

// ─── About + Team Section ─────────────────────────────────────────────────────
const AboutSection = () => (
    <section className="py-32 relative overflow-hidden flex items-center">
        {/* Ghost text bg */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            <div className="absolute whitespace-nowrap opacity-[0.06] text-[20vh] font-black"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent', top: '30%', left: '-5%', transform: 'rotate(-6deg)' }}>
                HARDWARE HACKING SENSORS DATA CLOUD
            </div>
            <div className="absolute whitespace-nowrap opacity-[0.06] text-[20vh] font-black"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent', top: '50%', left: '-5%', transform: 'rotate(3deg)' }}>
                PCB DESIGN FIRMWARE PROTOCOLS WIRELESS
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16 w-full">
            {/* Left text */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1"
            >
                <h2 className="text-5xl md:text-7xl font-black italic leading-[0.9] mb-8">
                    BUILT BY<br />
                    <span className="text-primary">ENGINEERS</span><br />
                    FOR <span className="text-cyber-lime">ENGINEERS</span>
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-md leading-relaxed">
                    We are a collective of hardware enthusiasts, firmware wizards, and makers pushing the boundaries of what's possible with connected devices.
                </p>
                <div className="flex flex-col gap-4">
                    {[
                        { icon: 'groups', color: 'text-cyber-lime', title: 'Collaborative', sub: 'Open source hardware philosophy' },
                        { icon: 'precision_manufacturing', color: 'text-primary', title: 'Hands-On', sub: 'Real circuits, real firmware, real results' },
                    ].map(item => (
                        <div key={item.title} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                                <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/team"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-cyber-lime hover:bg-cyber-lime/10 transition-all font-bold uppercase tracking-widest text-xs">
                    Meet The Team <ArrowUpRight size={14} />
                </Link>
            </motion.div>

            {/* Right: terminal team view */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 w-full"
            >
                <div className="relative border border-white/10 w-full"
                    style={{ background: 'rgba(13,17,23,0.5)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-black font-mono text-xs p-4 relative overflow-hidden" style={{ minHeight: '360px' }}>
                        {/* Terminal header */}
                        <div className="flex justify-between border-b border-white/10 pb-2 mb-4 text-slate-500">
                            <span>user@iot-club:~/team</span>
                            <span className="text-cyber-lime">bash</span>
                        </div>
                        <div className="text-green-500 mb-2">$ ./list_members.sh --active</div>
                        <div className="text-slate-300 space-y-1 mb-4">
                            <p>&gt; Loading team database...</p>
                            <p>&gt; Connection established <span className="text-primary">(Latency: 2ms)</span></p>
                            <p className="text-slate-600">----------------------------------------</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {team.slice(0, 6).map((member) => (
                                <div key={member.id}
                                    className="group hover:bg-white/5 p-2 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                    <span className="text-primary font-bold block mb-1 text-[11px] truncate">
                                        {member.name.toUpperCase()} // {member.role.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 group-hover:text-cyber-lime transition-colors">
                                        &gt; {member.bio}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 animate-pulse text-green-400">_</p>
                        {/* Scan line */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="animate-[scan_3s_linear_infinite] h-8 w-full"
                                style={{ background: 'linear-gradient(to bottom, transparent, rgba(43,108,238,0.06), transparent)' }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = () => {
    const stats = [
        { label: 'Active Members', value: '40+' },
        { label: 'Projects Built', value: '12+' },
        { label: 'Workshops Held', value: '8' },
        { label: 'Est.', value: '2024' },
    ];
    return (
        <div className="border-y border-white/10 py-8" style={{ background: 'rgba(13,17,23,0.6)' }}>
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map(s => (
                    <div key={s.label} className="text-center">
                        <div className="text-4xl font-black text-cyber-lime mb-1">{s.value}</div>
                        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Footer CTA ───────────────────────────────────────────────────────────────
const FooterCTA = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) { setSent(true); setEmail(''); }
    };

    return (
        <footer className="relative bg-black border-t-2 border-primary/50">
            <div className="absolute top-0 left-0 w-full h-[2px]"
                style={{ background: 'linear-gradient(to right, #2b6cee, #ccff00, #2b6cee)' }} />
            {/* Corner accents */}
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-cyber-lime opacity-50" />
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary opacity-50" />

            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* CTA */}
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black italic uppercase mb-6 leading-none">
                            Join The<br />
                            <span style={{ WebkitTextStroke: '1px #ccff00', color: 'transparent' }}>Network</span>
                        </h2>
                        <p className="text-slate-400 max-w-md mb-8">
                            Ready to build the future? No prior hardware experience required — just curiosity and willingness to learn.
                        </p>
                        {sent ? (
                            <p className="text-cyber-lime font-mono text-sm">&gt; Request registered. We'll be in touch.</p>
                        ) : (
                            <form onSubmit={handleSubmit}
                                className="w-full max-w-md border border-white/10 p-1 flex items-center"
                                style={{ background: '#0d1117' }}>
                                <span className="pl-4 pr-2 text-cyber-lime font-mono">&gt;</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="enter_email_address"
                                    className="bg-transparent border-none text-white w-full focus:ring-0 focus:outline-none font-mono text-sm placeholder-slate-600"
                                />
                                <button type="submit"
                                    className="bg-primary hover:bg-cyber-lime hover:text-black font-bold uppercase tracking-widest text-xs px-6 py-3 transition-colors text-white">
                                    Execute
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Links grid */}
                    <div className="grid grid-cols-3 gap-8 font-mono text-xs">
                        <div>
                            <h4 className="text-primary uppercase mb-4 tracking-widest">[ SITEMAP ]</h4>
                            <ul className="space-y-2 text-slate-400">
                                {[['HOME', '/'], ['PROJECTS', '/projects'], ['EVENTS', '/events'], ['LEARN', '/learn'], ['TEAM', '/team']].map(([label, path]) => (
                                    <li key={label}>
                                        <Link to={path} className="hover:text-cyber-lime hover:pl-2 transition-all block">
                                            ./{label.toLowerCase()}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-primary uppercase mb-4 tracking-widest">[ SOCIALS ]</h4>
                            <ul className="space-y-2 text-slate-400">
                                {['GITHUB', 'LINKEDIN', 'INSTAGRAM', 'DISCORD'].map(s => (
                                    <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-primary uppercase mb-4 tracking-widest">[ SYSTEM ]</h4>
                            <div className="text-slate-500 space-y-1">
                                <p>STATUS: <span className="text-cyber-lime">ONLINE</span></p>
                                <p>MEMBERS: 40+</p>
                                <p>VER: 2.0.0</p>
                                <p>LOC: GCET</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest">
                    <p>© 2024 IOT CLUB GCET. ALL RIGHTS RESERVED.</p>
                    <p>GCET STUDENT CHAPTER // EST. 2024</p>
                </div>
            </div>
        </footer>
    );
};

// ─── Seed projects shown while DB loads ───────────────────────────────────────
const SEED = [
    {
        id: 's1',
        title: 'Smart Attendance System',
        category: 'RFID · ESP32',
        year: '2024',
        description: 'RFID-based attendance tracking across GCET classrooms — ESP32 readers log entries in real time to a central dashboard, eliminating manual roll-call.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=70',
        accent: '#ccff00',
    },
    {
        id: 's2',
        title: 'Agri Soil Monitor',
        category: 'Sensors · IoT',
        year: '2024',
        description: 'Wireless soil moisture and pH monitoring nodes for small farms. Data is transmitted over LoRa to a cloud dashboard — built for BID2BUILD Ideathon.',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70',
        accent: '#2b6cee',
        offset: true,
    },
    {
        id: 's3',
        title: 'Campus Notice Hub',
        category: 'ESP32 · Display',
        year: '2024',
        description: 'Smart digital noticeboard powered by an ESP32 that fetches college announcements from a Supabase-backed API and displays them on a TFT screen.',
        image: null,
        accent: '#a855f7',
    },
];


// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
    const [projects, setProjects] = useState(SEED);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('projects')
                    .select('id, title, description, image_url, tags')
                    .order('created_at', { ascending: false })
                    .limit(3);
                if (data && data.length >= 1) {
                    setProjects(data.map((p, i) => ({
                        id: p.id,
                        title: p.title.toUpperCase().replace(/ /g, '_'),
                        category: p.tags?.[0] ?? 'IoT',
                        year: '2024',
                        description: p.description,
                        image: p.image_url,
                        accent: ['#ccff00', '#2b6cee', '#a855f7'][i % 3],
                        offset: i === 1,
                    })));
                }
            } catch (_) { /* keep seed */ }
        })();
    }, []);

    return (
        <div className="font-display text-slate-100 overflow-x-hidden" style={{ background: '#05070a' }}>
            <BackgroundEffects />
            <HeroSection />
            <StatsBar />
            <ProjectsSection projects={projects} />
            <AboutSection />
            <FooterCTA />
        </div>
    );
};

export default Home;
