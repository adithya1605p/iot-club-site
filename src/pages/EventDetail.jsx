import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import {
    Calendar, Clock, MapPin, ArrowLeft, Users, Trophy,
    FileText, Download, ExternalLink, Send, AlertCircle,
    BookOpen, Info, CheckCircle, Loader
} from 'lucide-react';

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
    const map = {
        live: { label: '🔴 LIVE NOW', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
        upcoming: { label: '🟡 UPCOMING', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50', text: 'text-yellow-400' },
        ended: { label: 'COMPLETED', bg: 'bg-white/5', border: 'border-white/10', text: 'text-gray-400' },
    };
    const s = map[status] || map.ended;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${s.bg} ${s.border} ${s.text}`}>
            {s.label}
        </span>
    );
};

/* ── Handout type icon ── */
const handoutIcon = (type) => {
    if (type === 'pdf') return <FileText size={15} className="text-red-400" />;
    if (type === 'drive') return <Download size={15} className="text-neon-cyan" />;
    return <ExternalLink size={15} className="text-neon-purple" />;
};

const TABS = ['Overview', 'Rules', 'Handouts', 'Submit'];

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('Overview');
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();
            if (error) setError('Event not found.');
            else setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size={32} className="animate-spin text-neon-cyan" />
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
            <AlertCircle size={48} className="text-red-400" />
            <h2 className="text-2xl font-bold text-white">Event not found</h2>
            <Link to="/events" className="text-neon-cyan hover:underline">← Back to Events</Link>
        </div>
    );

    const info = event.info || {};
    const handouts = event.handouts || [];
    const rules = event.rules || [];
    const isLive = event.status === 'live';
    const isUpcoming = event.status === 'upcoming';

    return (
        <div className="min-h-screen bg-black">
            {/* ── Hero ── */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                {event.cover_image
                    ? <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover opacity-50" />
                    : <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Back btn */}
                <button onClick={() => navigate('/events')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                    <ArrowLeft size={16} /> Events
                </button>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-5xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        {event.category && (
                            <span className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-bold border border-neon-cyan/20 uppercase tracking-wider">
                                {event.category}
                            </span>
                        )}
                        <StatusBadge status={event.status} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{event.title}</h1>
                    {event.tagline && <p className="text-gray-300 text-base">{event.tagline}</p>}
                </div>
            </div>

            {/* ── Meta bar ── */}
            <div className="bg-white/5 border-b border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap gap-6 text-sm text-gray-400">
                    {event.date && <span className="flex items-center gap-2"><Calendar size={14} className="text-neon-purple" />{event.date}</span>}
                    {event.time && <span className="flex items-center gap-2"><Clock size={14} className="text-neon-purple" />{event.time}</span>}
                    {event.location && <span className="flex items-center gap-2"><MapPin size={14} className="text-neon-purple" />{event.location}</span>}
                    {info.team_size && <span className="flex items-center gap-2"><Users size={14} className="text-neon-purple" />{info.team_size}</span>}
                    {info.prizes && <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-400" />{info.prizes}</span>}
                </div>
            </div>

            {/* ── Tab bar ── */}
            <div className="sticky top-16 z-30 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-5xl mx-auto px-6 flex gap-1">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-3.5 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px
                                ${tab === t
                                    ? 'border-neon-cyan text-neon-cyan'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ── */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >

                        {/* ── OVERVIEW ── */}
                        {tab === 'Overview' && (
                            <div className="space-y-8">
                                {event.description && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Info size={18} className="text-neon-cyan" /> About this Event
                                        </h2>
                                        <p className="text-gray-300 leading-relaxed">{event.description}</p>
                                    </div>
                                )}

                                {/* Info grid */}
                                {Object.keys(info).length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(info).map(([key, val]) => (
                                            <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                                                    {key.replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-white font-semibold text-sm">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Gallery strip */}
                                {event.gallery?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-3">Gallery</h3>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {event.gallery.map((img, i) => (
                                                <img key={i} src={img} alt=""
                                                    className="h-28 w-44 object-cover rounded-lg border border-white/10 hover:border-neon-cyan/50 cursor-pointer shrink-0 transition-colors"
                                                    onClick={() => setLightbox(img)}
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── RULES ── */}
                        {tab === 'Rules' && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <BookOpen size={18} className="text-neon-cyan" /> Rules &amp; Guidelines
                                </h2>
                                {rules.length === 0
                                    ? <p className="text-gray-500">Rules will be announced soon.</p>
                                    : (
                                        <ol className="space-y-4">
                                            {rules.map((rule, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
                                                >
                                                    <span className="text-neon-cyan font-black text-sm w-6 shrink-0 mt-0.5">{i + 1}.</span>
                                                    <span className="text-gray-300 text-sm leading-relaxed">{rule}</span>
                                                </motion.li>
                                            ))}
                                        </ol>
                                    )
                                }
                            </div>
                        )}

                        {/* ── HANDOUTS ── */}
                        {tab === 'Handouts' && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Download size={18} className="text-neon-cyan" /> Handouts &amp; Resources
                                </h2>
                                {handouts.length === 0
                                    ? <p className="text-gray-500">Handouts will be shared before the event.</p>
                                    : (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {handouts.map((h, i) => (
                                                <motion.a
                                                    key={i}
                                                    href={h.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.07 }}
                                                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all group"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                                        {handoutIcon(h.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-semibold truncate">{h.title}</p>
                                                        <p className="text-gray-500 text-xs capitalize">{h.type || 'Link'}</p>
                                                    </div>
                                                    <ExternalLink size={14} className="text-gray-600 group-hover:text-neon-cyan transition-colors shrink-0" />
                                                </motion.a>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        )}

                        {/* ── SUBMIT ── */}
                        {tab === 'Submit' && (
                            <div className="max-w-lg mx-auto text-center py-8 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center mx-auto">
                                    <Send size={24} className="text-neon-purple" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Submit Your Work</h2>

                                {event.status === 'ended' && (
                                    <p className="text-gray-500 text-sm">This event has ended. Submissions are closed.</p>
                                )}

                                {event.status === 'upcoming' && (
                                    <p className="text-yellow-400 text-sm">
                                        Submissions open when the event goes live.
                                    </p>
                                )}

                                {isLive && (
                                    <>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Upload your project files to Google Drive, then submit your Drive link below.
                                            Make sure the link is set to <span className="text-white font-semibold">"Anyone with the link can view"</span>.
                                        </p>
                                        {event.submission_link
                                            ? (
                                                <a
                                                    href={event.submission_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-neon-purple text-white font-bold text-sm hover:bg-neon-purple/80 transition-colors"
                                                >
                                                    <Send size={16} /> Open Submission Form
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Submission link coming soon.</p>
                                            )
                                        }
                                    </>
                                )}

                                {/* Register CTA */}
                                {event.registration_open && (isLive || isUpcoming) && (
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-gray-500 text-xs mb-3">Haven't registered yet?</p>
                                        <Link
                                            to="/register"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-neon-cyan/40 text-neon-cyan text-sm font-semibold hover:bg-neon-cyan/10 transition-colors"
                                        >
                                            <CheckCircle size={15} /> Register Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            src={lightbox} alt=""
                            className="max-w-full max-h-[90vh] rounded-xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventDetail;
