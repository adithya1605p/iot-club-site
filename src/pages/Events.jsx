import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Clock, MapPin, X, Loader, ArrowRight } from 'lucide-react';

/* Status pill */
const StatusPill = ({ status }) => {
    const map = {
        live: { label: '🔴 LIVE', cls: 'text-red-400 bg-red-500/20 border-red-500/40 animate-pulse' },
        upcoming: { label: '🟡 UPCOMING', cls: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40' },
        ended: { label: 'Completed', cls: 'text-gray-400 bg-white/10 border-white/10' },
    };
    const s = map[status] || map.ended;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.cls}`}>{s.label}</span>
    );
};

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('events')
                .select('*')
                .order('date_iso', { ascending: false });
            if (data) setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div className="container mx-auto pt-24 min-h-screen px-4">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple neon-text"
                >
                    Events &amp; Workshops
                </motion.h1>
                <p className="text-gray-400">Explore our journey of learning and innovation.</p>
            </div>

            {loading && (
                <div className="flex justify-center py-20">
                    <Loader size={32} className="animate-spin text-neon-cyan" />
                </div>
            )}

            <div className="grid gap-12 max-w-6xl mx-auto">
                {events.map((event, index) => (
                    <Card key={event.id} className="flex flex-col gap-6 overflow-hidden border-white/5 bg-surface/40 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Cover image */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full md:w-2/5 h-64 md:h-80 overflow-hidden rounded-xl shrink-0 relative cursor-pointer group shadow-2xl shadow-neon-purple/10"
                                onClick={() => event.gallery?.length && setSelectedImage(event.cover_image)}
                            >
                                <img src={event.cover_image} alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3">
                                    <StatusPill status={event.status} />
                                </div>
                                {event.gallery?.length > 0 && (
                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 flex items-center gap-2">
                                        📷 {event.gallery.length} Photos
                                    </div>
                                )}
                            </motion.div>

                            {/* Info */}
                            <div className="flex flex-col justify-center flex-grow py-2 px-2 md:px-0">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-bold tracking-wider uppercase border border-neon-cyan/20">
                                        {event.category}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{event.title}</h3>
                                {event.tagline && (
                                    <p className="text-neon-cyan/60 text-sm mb-2 italic">{event.tagline}</p>
                                )}
                                <p className="text-gray-300 mb-6 text-base leading-relaxed line-clamp-3">{event.description}</p>

                                <div className="grid grid-cols-2 gap-y-3 mb-6 text-gray-400 text-sm border-t border-white/10 pt-4">
                                    {event.date && <span className="flex items-center gap-2"><Calendar size={16} className="text-neon-purple" />{event.date}</span>}
                                    {event.time && <span className="flex items-center gap-2"><Clock size={16} className="text-neon-purple" />{event.time}</span>}
                                    {event.location && <span className="flex items-center gap-2"><MapPin size={16} className="text-neon-purple" />{event.location}</span>}
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    <Button
                                        variant="outline"
                                        className="text-sm px-6 hover:bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan flex items-center gap-2"
                                        onClick={() => navigate(`/events/${event.id}`)}
                                    >
                                        View Details <ArrowRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Gallery strip */}
                        {event.gallery?.length > 0 && (
                            <div className="border-t border-white/5 pt-4">
                                <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold px-1">Event Gallery</p>
                                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth">
                                    {event.gallery.map((img, i) => (
                                        <motion.div whileHover={{ scale: 1.05 }} key={i} className="shrink-0 relative group">
                                            <img
                                                src={img} alt={`Gallery ${i}`}
                                                className="h-24 w-36 object-cover rounded-lg cursor-pointer border border-white/5 group-hover:border-neon-cyan/50 transition-colors shadow-lg"
                                                onClick={() => setSelectedImage(img)}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-red-500/20 hover:text-red-500">
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            src={selectedImage} alt="Full view"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;
