import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BG = () => (
    <>
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(to right,#1f2937 1px,transparent 1px),linear-gradient(to bottom,#1f2937 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06]"
            style={{ background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 2px,rgba(0,0,0,0.3) 2px,rgba(0,0,0,0.3) 4px)' }} />
        <div className="fixed top-[10%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse-slow"
            style={{ background: 'rgba(43,108,238,0.1)', filter: 'blur(100px)' }} />
        <div className="fixed bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full pointer-events-none animate-pulse-slow"
            style={{ background: 'rgba(204,255,0,0.05)', filter: 'blur(80px)', animationDelay: '1s' }} />
    </>
);

const TIMELINE = [
    {
        year: '2022',
        version: 'v1.0.0_INIT',
        title: 'The Genesis',
        body: 'Founded by a passionate group of GCET students who wanted more than theory — they wanted to build. The first meetup happened with borrowed Arduinos, a box of ESP8266 chips, and a shared Wi-Fi hotspot.',
        tags: ['First Meetup', 'Lab 204', 'Arduino'],
        dotColor: 'border-primary',
        activeDot: 'group-hover:bg-primary',
        glowShadow: 'rgba(43,108,238,0.5)',
        bgGlow: 'rgba(43,108,238,0.1)',
        hoverBorder: 'group-hover:border-primary/60',
        labelColor: 'text-primary',
    },
    {
        year: '2023',
        version: 'v1.5.0_EXPANSION',
        title: 'IoT Verse 2K23',
        body: 'Hosted our first mega event — IoT Verse 2K23. Two days of guest lectures by Mr. Bharadwaj Arvapally, project exhibitions, idea pitching, and quiz competitions covering Smart Healthcare, Education, and Agriculture.',
        tags: ['Guest Lecture', 'Project Exhibition', '100+ Attendees'],
        dotColor: 'border-white',
        activeDot: 'group-hover:bg-white',
        glowShadow: 'rgba(255,255,255,0.5)',
        bgGlow: 'rgba(255,255,255,0.05)',
        hoverBorder: 'group-hover:border-white/60',
        labelColor: 'text-white',
    },
    {
        year: '2024',
        version: 'v2.0.0_CURRENT',
        title: 'Beyond the Lab',
        body: 'Officially recognized club, Sensor Strike flagship event, BID2BUILD Ideathon with ₹16,000+ in prizes, and now an open-source web platform. We are not just a club — we are building a legacy for the juniors who come next.',
        tags: ['Sensor Strike', 'BID2BUILD', 'Web Platform'],
        dotColor: 'border-cyber-lime',
        activeDot: 'group-hover:bg-cyber-lime',
        glowShadow: 'rgba(204,255,0,0.5)',
        bgGlow: 'rgba(204,255,0,0.08)',
        hoverBorder: 'group-hover:border-cyber-lime/60',
        labelColor: 'text-cyber-lime',
    },
];

const About = () => (
    <div className="font-display text-slate-100 overflow-x-hidden" style={{ background: '#05070a' }}>
        <BG />
        <main className="relative z-10 w-full">

            {/* ── HERO ── */}
            <section className="min-h-screen w-full flex flex-col items-center justify-center relative pt-20"
                style={{ perspective: '1200px' }}>
                {/* Ghost bg text */}
                <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black italic leading-none whitespace-nowrap select-none pointer-events-none opacity-10 z-0 text-outline-v2">
                    CONNECTED
                </h1>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 items-center w-full">
                    {/* Left: text */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8 order-2 lg:order-1">
                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-lime/30 rounded-full bg-cyber-lime/5" style={{ backdropFilter: 'blur(8px)' }}>
                            <span className="w-2 h-2 bg-cyber-lime rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-cyber-lime tracking-widest">SYSTEM_STATUS: ONLINE</span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            WE BUILD<br />
                            THE <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#fff,#64748b)' }}>INVISIBLE</span><br />
                            <span className="text-outline-lime italic pr-4">FUTURE</span>
                        </h2>

                        <p className="text-lg text-slate-400 max-w-lg leading-relaxed glass-panel-v2 p-6 rounded-lg border-l-4 border-l-primary">
                            <span className="text-primary font-mono block mb-2 text-xs">// MISSION_STATEMENT</span>
                            IoT Club GCET is a collective of engineers, designers, and hackers dedicated to the intersection of hardware and software. We don't just write code — we solder, we wire, and we bring inanimate objects to life.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-4 flex-wrap pt-4">
                            {[['40+', 'Members'], ['3+', 'Projects'], ['∞', 'Possibilities']].map(([v, l]) => (
                                <div key={l} className="glass-panel-v2 px-6 py-4 rounded flex flex-col items-center hover:bg-white/5 transition-colors cursor-default">
                                    <span className="text-2xl font-black text-white">{v}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{l}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/events"
                            className="inline-flex items-center gap-2 px-8 py-4 font-black text-black text-xs uppercase tracking-widest transition-colors hover:bg-white"
                            style={{ background: '#ccff00' }}>
                            Apply for Membership
                        </Link>
                    </motion.div>

                    {/* Right: orbit visual */}
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[500px] w-full flex items-center justify-center order-1 lg:order-2"
                        style={{ perspective: '1200px' }}>
                        {/* Center rotated card */}
                        <div className="relative w-64 h-64" style={{ transform: 'rotateY(-10deg) rotateX(5deg) scale(1)', transformStyle: 'preserve-3d', transition: 'transform 0.5s ease' }}>
                            {/* The diamond card */}
                            <div className="absolute inset-0 border border-white/20 rounded-xl overflow-hidden rotate-45 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.1),transparent)', backdropFilter: 'blur(8px)', boxShadow: '0 0 50px rgba(43,108,238,0.2)' }}>
                                <div className="absolute inset-0 opacity-30 bg-cover mix-blend-overlay"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60')" }} />
                                <span className="material-symbols-outlined text-6xl text-white animate-pulse z-20"
                                    style={{ textShadow: '0 0 15px rgba(255,255,255,0.8)' }}>sensors</span>
                            </div>
                            {/* Orbit ring 1 — blue dot, reverse spin */}
                            <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite_reverse]" style={{ transform: 'scale(1.5)' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"
                                    style={{ boxShadow: '0 0 10px #2b6cee' }} />
                            </div>
                            {/* Orbit ring 2 — lime dot, forward spin, rotated */}
                            <div className="absolute inset-0 rounded-full border border-cyber-lime/30 rotate-45 animate-[spin_15s_linear_infinite]" style={{ transform: 'scale(1.8) rotate(45deg)' }}>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-cyber-lime rounded-full"
                                    style={{ boxShadow: '0 0 10px #ccff00' }} />
                            </div>
                            {/* Floating labels */}
                            <div className="absolute -top-10 -right-20 glass-panel-v2 p-3 rounded text-xs font-mono text-primary animate-float">
                                RX: 1024 packets/s
                            </div>
                            <div className="absolute -bottom-10 -left-10 glass-panel-v2 p-3 rounded text-xs font-mono text-cyber-lime"
                                style={{ animation: 'float-delayed 6s ease-in-out 0.7s infinite' }}>
                                PWR: 3.3V STABLE
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Explore History</span>
                    <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom,#ccff00,transparent)' }} />
                </div>
            </section>

            {/* ── TIMELINE ── */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* Sticky left */}
                        <div className="md:w-1/3 md:sticky md:top-32 h-fit">
                            <span className="text-cyber-lime font-mono text-xs mb-2 block">// ORIGIN_STORY</span>
                            <h3 className="text-5xl font-black uppercase italic mb-6 leading-none text-white">
                                EVOLUTION<br /><span className="text-outline-v2">LOG</span>
                            </h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                From a small group of GCET students hacking Arduinos in a lab to a campus-wide organisation driving real innovation. Here is our journey.
                            </p>
                            <div className="glass-panel-v2 p-6 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <span className="material-symbols-outlined text-6xl">history_edu</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Philosophy</h4>
                                <p className="text-sm text-slate-400">"Shared knowledge is the most powerful circuit we can build."</p>
                            </div>
                        </div>

                        {/* Timeline entries */}
                        <div className="md:w-2/3 relative pl-8 md:pl-16 border-l border-white/10">
                            <div className="absolute left-[-2px] top-0 bottom-0 w-[3px] timeline-line-v2" />
                            {TIMELINE.map((item, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`relative mb-24 last:mb-0 group cursor-default`}>
                                    {/* Dot */}
                                    <div className={`absolute -left-[41px] md:-left-[73px] top-2 w-4 h-4 bg-black border-2 ${item.dotColor} rounded-full ${item.activeDot} group-hover:scale-150 transition-all duration-300 z-20`}
                                        style={{ boxShadow: `0 0 10px ${item.glowShadow}` }} />
                                    {/* Card */}
                                    <div className={`glass-panel-v2 p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 ${item.hoverBorder} relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full blur-2xl" style={{ background: item.bgGlow }} />
                                        <span className="text-6xl font-black text-white/5 absolute bottom-4 right-4 group-hover:text-white/10 transition-colors">{item.year}</span>
                                        <div className="relative z-10">
                                            <span className={`font-mono text-xs mb-2 block ${item.labelColor}`}>{item.version}</span>
                                            <h4 className="text-3xl font-bold text-white mb-4">{item.title}</h4>
                                            <p className="text-slate-400 mb-4">{item.body}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map(t => (
                                                    <span key={t} className="text-[10px] uppercase border border-white/10 px-2 py-1 rounded text-slate-500">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-24 relative" style={{ background: 'rgba(0,0,0,0.5)' }}>
                {/* Concentric circles bg */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
                    {[80, 60, 40].map(s => (
                        <div key={s} className="absolute rounded-full border border-white/5" style={{ width: `${s}vw`, height: `${s}vw` }} />
                    ))}
                </div>
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-cyber-lime font-mono text-xs mb-2 block">// CORE_VALUES</span>
                        <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight">
                            WHY <span className="text-outline-lime">HARDWARE?</span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: 'build', color: 'text-primary', title: 'Tangibility', body: 'Software is powerful, but hardware is real. We believe in the satisfaction of holding your creation in your hand and watching it interact with the physical world.', offset: false },
                            { icon: 'bolt', color: 'text-cyber-lime', title: 'Energy', body: 'From 3.3V sensor nodes to solar-powered systems — we design circuits that do more with less, pushing the limits of power efficiency and edge computing.', offset: true },
                            { icon: 'code', color: 'text-white', title: 'Low Level', body: 'We operate close to the metal. Registers, interrupts, and direct memory access. We strip away abstraction to understand what truly makes machines tick.', offset: false },
                        ].map(v => (
                            <motion.div key={v.title}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: v.offset ? -32 : 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.5 }}
                                className="glass-panel-v2 p-8 group hover:bg-white/5 transition-all duration-300 cursor-default">
                                <span className={`material-symbols-outlined text-4xl ${v.color} mb-6 block group-hover:scale-110 transition-transform`}>{v.icon}</span>
                                <h4 className={`text-xl font-bold uppercase mb-4 tracking-wider ${v.color}`}>{v.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{v.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LEARNING TRACKS ── */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(43,108,238,0.03), transparent)' }} />
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-cyber-lime font-mono text-xs mb-2 block tracking-widest">// CURRICULUM</span>
                        <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight text-white">
                            Learning <span className="text-outline-lime">Tracks</span>
                        </h3>
                        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
                            Four focused domains — pick your path and go deep.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: 'memory', accent: '#ccff00',
                                title: 'Embedded Systems',
                                stack: ['Arduino', 'ESP32', 'STM32', 'Sensors & Actuators'],
                                desc: 'Go low-level. Program microcontrollers, interface peripherals, and build real-time firmware from scratch.',
                            },
                            {
                                icon: 'cloud', accent: '#2b6cee',
                                title: 'Cloud IoT',
                                stack: ['AWS IoT', 'Firebase', 'Azure', 'Data Visualization'],
                                desc: 'Connect your devices to the cloud. Build dashboards, pipelines, and remote monitoring systems.',
                            },
                            {
                                icon: 'psychology', accent: '#a855f7',
                                title: 'AIoT',
                                stack: ['TinyML', 'Edge Computing', 'Image Processing'],
                                desc: 'Bring AI to the edge. Run inference on microcontrollers, classify sensor data, and build smart systems.',
                            },
                            {
                                icon: 'precision_manufacturing', accent: '#f59e0b',
                                title: 'Robotics',
                                stack: ['Bot Design', 'Motor Control', 'Autonomous Navigation'],
                                desc: 'Build machines that move. Design chassis, write motor drivers, and create autonomous behaviours.',
                            },
                        ].map((track, i) => (
                            <motion.div key={track.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass-panel-v2 group cursor-default overflow-hidden relative hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="h-[3px]" style={{ background: `linear-gradient(to right, ${track.accent}, transparent)` }} />
                                <div className="p-6">
                                    <span className="material-symbols-outlined text-4xl mb-4 block group-hover:scale-110 transition-transform"
                                        style={{ color: track.accent }}>{track.icon}</span>
                                    <h4 className="text-lg font-black uppercase tracking-wider text-white mb-3">{track.title}</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-4">{track.desc}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {track.stack.map(s => (
                                            <span key={s} className="text-[9px] font-mono px-2 py-0.5 border border-white/10 text-slate-500 uppercase">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SPECIAL THANKS ── */}
            <section className="py-20 relative" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="max-w-3xl mx-auto px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative p-10 text-center overflow-hidden"
                        style={{
                            background: 'rgba(13,17,23,0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(204,255,0,0.2)',
                            boxShadow: '0 0 60px rgba(204,255,0,0.05)',
                        }}
                    >
                        {/* Corner accents */}
                        <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-cyber-lime" />
                        <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-cyber-lime" />
                        <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-cyber-lime" />
                        <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-cyber-lime" />
                        {/* Bg glow */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 rounded-full blur-3xl opacity-10"
                                style={{ background: 'radial-gradient(circle, #ccff00, transparent)' }} />
                        </div>

                        <span className="material-symbols-outlined text-5xl text-cyber-lime mb-6 block animate-pulse-slow">
                            workspace_premium
                        </span>
                        <span className="text-cyber-lime font-mono text-xs tracking-widest block mb-3">// SPECIAL_THANKS</span>
                        <h3 className="text-3xl md:text-4xl font-black italic text-white mb-6">Special Thanks</h3>
                        <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">
                            We extend our deepest gratitude to the Head of the Department, CSE (AI &amp; ML),{' '}
                            <strong className="text-white font-black">Dr. A. Nageshwar Rao</strong>,
                            {' '}for his continuous support, encouragement, and visionary guidance in establishing and nurturing the IoT Club at GCET.
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-xs text-slate-500 uppercase tracking-widest">
                            HoD — CSE (AI &amp; ML) · GCET
                        </div>
                    </motion.div>
                </div>
            </section>

        </main>
    </div>
);

export default About;
