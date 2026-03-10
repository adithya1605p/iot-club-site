import { motion } from 'framer-motion';
import { team, advisoryBatches } from '../data/team';
import Card from '../components/ui/Card';
import { Linkedin, Crown, Star, Shield, FileText, Cpu, Users, Wifi, CalendarDays } from 'lucide-react';

const ROLE_ICONS = {
    'President': <Crown size={11} />,
    'Vice President': <Shield size={11} />,
    'Secretary': <FileText size={11} />,
    'Project Manager': <Cpu size={11} />,
    'Human Resource': <Users size={11} />,
    'Social Media': <Wifi size={11} />,
    'Organizing Manager': <CalendarDays size={11} />,
};

const LS_KEY = 'advisory_photo_positions';
const getSavedPositions = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
};


const AdvisoryCard = ({ member, index }) => {
    const saved = getSavedPositions();
    const pos = saved[member.id];
    // priority: hardcoded objPos → localStorage → default
    const objPos = member.objPos || (pos ? `${pos.x}% ${pos.y}%` : '50% 30%');
    const imgStyle = {
        objectPosition: objPos,
        ...(member.rotateDeg ? { transform: `rotate(${member.rotateDeg}deg) scale(1.55)` } : {}),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`group relative rounded-xl overflow-hidden border transition-all duration-300 text-center
            ${member.isFounder
                    ? 'border-yellow-400/50 bg-gradient-to-b from-yellow-400/10 to-black/60 shadow-[0_0_30px_rgba(250,204,21,0.15)] hover:shadow-[0_0_50px_rgba(250,204,21,0.3)]'
                    : 'border-white/10 bg-white/5 hover:border-neon-cyan/40 hover:bg-white/10'
                }`}
        >
            {member.isFounder && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 whitespace-nowrap">
                    <Crown size={11} className="text-yellow-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">Founder</span>
                </div>
            )}

            <div className="p-5 pt-10">
                <div className={`relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2
                ${member.isFounder
                        ? 'border-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                        : 'border-neon-cyan/30 group-hover:border-neon-cyan'
                    } transition-colors duration-300`}
                >
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={imgStyle}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML =
                                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1f2937;font-size:1.5rem;font-weight:700;color:#9ca3af">${member.name.charAt(0)}</div>`;
                        }}
                    />
                </div>

                <h3 className={`font-bold text-base mb-0.5 ${member.isFounder ? 'text-yellow-300' : 'text-white'}`}>
                    {member.name}
                    {member.isFounder && <Star size={11} className="inline ml-1 text-yellow-400 fill-yellow-400" />}
                </h3>
                <p className={`text-xs font-semibold mb-2 flex items-center justify-center gap-1 ${member.isFounder ? 'text-yellow-400/80' : 'text-neon-purple'}`}>
                    {!member.isFounder && ROLE_ICONS[member.role]}
                    {member.role}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{member.bio}</p>

                {member.linkedin && (
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                        <a href={member.linkedin} target="_blank" rel="noreferrer"
                            className="text-gray-500 hover:text-neon-cyan transition-colors">
                            <Linkedin size={15} />
                        </a>
                    </div>
                )}
            </div>

        </motion.div>
    );
};

const Team = () => (
    <div className="container mx-auto pt-24 min-h-screen px-4 pb-20">

        {/* ── Current Team ── */}
        <div className="text-center mb-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan neon-text"
            >
                Meet the Team
            </motion.h1>
            <p className="text-gray-400">The brilliant minds powering the club.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-28">
            {team.map((member, index) => (
                <Card key={member.id} className="text-center group">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-cyan/30 group-hover:border-neon-cyan transition-colors duration-300">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover object-center" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-neon-purple text-sm mb-3 font-medium">{member.role}</p>
                        <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                        <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {member.socials?.linkedin && (
                                <a
                                    href={member.socials.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-400 hover:text-white relative"
                                    onClick={(e) => {
                                        if (member.name === "A. Lakshmi Deepak") {
                                            e.preventDefault();
                                            alert("SYSTEM COMPROMISED.\\nFLAG: R0NFVENURntMNGs1aG0xX2QzM3A0a180bjRuN2gwanV9");
                                            console.log("CTF_FLAG: R0NFVENURntMNGs1aG0xX2QzM3A0a180bjRuN2gwanV9");
                                            // Open the link after showing the flag
                                            setTimeout(() => {
                                                window.open(member.socials.linkedin, "_blank");
                                            }, 100);
                                        }
                                    }}
                                >
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </Card>
            ))}
        </div>

        {/* ── Newly Recruited ── */}
        <div className="mb-28">
            <div className="text-center mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-5"
                >
                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neon-cyan">Recruitment 2025</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-3"
                >
                    Newly Recruited
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-sm"
                >
                    Welcome aboard — selected candidates joining the IoT Club family.
                </motion.p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 max-w-5xl mx-auto">
                {[
                    { roll: '25R11A6607', name: 'Harshini' },
                    { roll: '25R11A6638', name: 'Hithesh' },
                    { roll: '24R11A6213', name: 'Ashwitha' },
                    { roll: '24R11A0445', name: 'Pragya' },
                    { roll: '24R11A6734', name: 'Gouthami Latha' },
                    { roll: '24R11A05L0', name: 'Tagaram Sai Kushal' },
                    { roll: '24R11A6275', name: 'Shareef' },
                ].map((s, i) => (
                    <motion.div
                        key={s.roll}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className="group relative rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 p-4 text-center"
                    >
                        {/* Selected badge */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Selected</span>
                        </div>
                        <p className="font-bold text-white text-sm mt-1 leading-tight">{s.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{s.roll}</p>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* ── Advisory Committee — one section per batch ── */}

        <div className="border-t border-white/10 pt-20">
            <div className="text-center mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/5 mb-5"
                >
                    <Crown size={13} className="text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Past Leadership</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500"
                >
                    Advisory Committee
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-lg mx-auto text-sm"
                >
                    Every batch that built, led, and grew IoT Club GCET. Their work is the foundation for what we do today.
                </motion.p>
            </div>

            {advisoryBatches.map((batch) => {
                const founder = batch.members.find(m => m.isFounder);
                const rest = batch.members.filter(m => !m.isFounder);
                return (
                    <div key={batch.year} className="mb-20">
                        {/* Batch label */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/30 to-transparent" />
                            <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest whitespace-nowrap">
                                {batch.batchLabel} · {batch.year}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-l from-yellow-400/30 to-transparent" />
                        </div>

                        {/* Founder spotlight */}
                        {founder && (
                            <div className="max-w-xs mx-auto mb-8">
                                <AdvisoryCard member={founder} index={0} />
                            </div>
                        )}

                        {/* Rest of batch */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {rest.map((member, i) => (
                                <AdvisoryCard key={member.id} member={member} index={i + 1} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* ── Thank-you note ── */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 mb-16 max-w-2xl mx-auto text-center"
        >
            <div className="p-8 rounded-2xl border border-yellow-400/20 bg-gradient-to-b from-yellow-400/5 to-transparent">
                <h3 className="text-lg font-bold text-yellow-300 mb-3">A Note of Gratitude</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    To every senior who gave their time, ideas, and energy to build IoT Club GCET —
                    thank you. You didn't just run a club, you built a community from nothing.
                    The projects, events, and friendships you sparked continue to inspire every batch
                    that follows. This space exists because of you.
                </p>
            </div>
        </motion.div>

        {/* ── Designer credit — fixed bottom bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-2 bg-black/70 backdrop-blur-sm border-t border-white/5">
            <div className="inline-flex items-center gap-3 text-xs text-gray-500">
                <span>⚡ Designed &amp; built by</span>
                <span className="text-white font-semibold">N. Abhinav</span>
                <span className="w-px h-3 bg-white/20" />
                <a
                    href="https://www.linkedin.com/in/abhinav-nadipelly-504971322"
                    target="_blank" rel="noreferrer"
                    className="text-gray-500 hover:text-neon-cyan transition-colors"
                    title="LinkedIn"
                >
                    <Linkedin size={13} />
                </a>
                <a
                    href="https://github.com/ABHICODZ"
                    target="_blank" rel="noreferrer"
                    className="text-gray-500 hover:text-white transition-colors"
                    title="GitHub"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                </a>
            </div>
        </div>

    </div>
);


export default Team;
