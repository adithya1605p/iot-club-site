import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Calendar, Plus, Link as LinkIcon, Copy, Trash2, Loader2, AlertCircle, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Form State
    const [isCreating, setIsCreating] = useState(false);
    const [creating, setCreating] = useState(false);

    // Combined form object
    const [newEvent, setNewEvent] = useState({
        title: '', tagline: '', date: '', time: '', location: '',
        category: '', cover_image: '', description: '', status: 'upcoming', slug: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setErrorMsg('Failed to fetch events from Database.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setCreating(true);
        setErrorMsg(null);

        const finalSlug = newEvent.slug || handleGenerateSlug(newEvent.title);

        try {
            const { error } = await supabase
                .from('events')
                .insert([{
                    ...newEvent,
                    slug: finalSlug
                }]);

            if (error) {
                if (error.code === '23505') {
                    throw new Error('An event with this identical URL slug already exists. Please modify the title or manually change the slug.');
                }
                throw error;
            }

            // Reset form
            setNewEvent({ title: '', tagline: '', date: '', time: '', location: '', category: '', cover_image: '', description: '', status: 'upcoming', slug: '' });
            setIsCreating(false);
            fetchEvents();
        } catch (error) {
            console.error('Error creating event:', error);
            setErrorMsg(error.message || 'Failed to generate event.');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteEvent = async (id, title) => {
        if (!window.confirm(`Warning: Deleting the event "${title}" will also permanently delete ALL registrations associated with it. Proceed with extreme caution.`)) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEvents(events.filter(ev => ev.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to terminate event. Wait till foreign key constraints are handled.');
        }
    };

    const handleStatusChange = async (id, status) => {
        await supabase.from('events').update({ status }).eq('id', id);
        fetchEvents();
    };

    const handleToggleReg = async (id, current) => {
        await supabase.from('events').update({ registration_open: !current }).eq('id', id);
        fetchEvents();
    };

    const copyToClipboard = (slug) => {
        const url = `${window.location.origin}/register/${slug}`;
        navigator.clipboard.writeText(url);
        alert('Dynamic Registration Link Copied to Clipboard!\n' + url);
    };

    if (loading) return <div className="text-center p-12 text-neon-cyan font-mono flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Synchronizing Event Data...</div>;

    return (
        <div className="w-full">
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-mono text-sm flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><AlertCircle size={18} /> {errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="text-xs uppercase hover:text-white transition-colors">Dismiss</button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-neon-cyan" /> Event Factory
                </h2>
                {!isCreating ? (
                    <Button variant="primary" onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                        <Plus size={18} /> Create New Event
                    </Button>
                ) : (
                    <Button variant="secondary" onClick={() => setIsCreating(false)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Cancel Creation
                    </Button>
                )}
            </div>

            {/* Event Creation Form */}
            {isCreating && (
                <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} className="mb-8">
                    <Card className="p-6 border-neon-cyan/30 bg-black/60 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider font-mono border-b border-white/10 pb-2">Generate Event Workspace & Reg Portal</h3>
                        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                ['title', 'Title *'], ['tagline', 'Tagline'], ['date', 'Date (display)'],
                                ['time', 'Time'], ['location', 'Venue'], ['category', 'Category'], ['cover_image', 'Cover Image URL']
                            ].map(([field, label]) => (
                                <div key={field}>
                                    <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">{label}</label>
                                    <input
                                        value={newEvent[field]}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setNewEvent(p => ({
                                                ...p,
                                                [field]: val,
                                                // auto update slug if title changes and slug hasn't been manually set much
                                                ...(field === 'title' && !p.slug ? { slug: handleGenerateSlug(val) } : {})
                                            }));
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                                        required={field === 'title'}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">Status</label>
                                <select value={newEvent.status} onChange={e => setNewEvent(p => ({ ...p, status: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors">
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="ended">Ended</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">Description</label>
                                <textarea rows={3} value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none resize-none transition-colors" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">Custom URL Slug</label>
                                <div className="flex items-center gap-2 text-gray-500 font-mono text-sm bg-black/50 border border-white/10 rounded-lg px-4 py-2">
                                    <span>/register/</span>
                                    <input
                                        type="text"
                                        value={newEvent.slug}
                                        onChange={(e) => setNewEvent(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                        placeholder="auto-generated-slug"
                                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 focus:text-neon-cyan"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-2">
                                <Button type="submit" variant="primary" className="w-full py-3 md:w-auto md:px-8" disabled={creating}>
                                    {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Deploying...</span> : 'Initialize Event Engine'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* List of Events */}
            {events.length === 0 ? (
                <div className="text-center p-12 bg-black/50 border border-white/10 rounded-xl">
                    <h3 className="text-white font-bold mb-2">No Active Events</h3>
                    <p className="text-gray-500 text-sm font-mono">Create an event to generate dynamic registration forms and workspaces.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {events.map((ev) => (
                        <div key={ev.id} className="bg-black/40 border border-white/10 p-5 rounded-xl hover:border-neon-cyan/50 transition-colors flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    {ev.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-mono mb-2 line-clamp-1">
                                    {ev.category} · {ev.date || 'No Date'}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                                    {/* Status toggle */}
                                    <select value={ev.status} onChange={e => handleStatusChange(ev.id, e.target.value)}
                                        className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-white focus:border-neon-cyan focus:outline-none">
                                        <option value="upcoming">Upcoming</option>
                                        <option value="live">🔴 Live</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                    {/* Reg toggle */}
                                    <button onClick={() => handleToggleReg(ev.id, ev.registration_open)}
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold transition-colors ${ev.registration_open ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-white/10 text-gray-500 bg-white/5'
                                            }`}>
                                        {ev.registration_open ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                        {ev.registration_open ? 'Reg Open' : 'Reg Closed'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                                {ev.slug && (
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                                        <LinkIcon size={14} className="text-gray-500 shrink-0" />
                                        <span className="truncate max-w-[150px] lg:max-w-xs block">.../register/{ev.slug}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 shrink-0">
                                    {ev.slug && (
                                        <button onClick={() => copyToClipboard(ev.slug)} title="Copy Form Link" className="flex-1 sm:flex-none p-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg transition-colors">
                                            <Copy size={16} />
                                        </button>
                                    )}
                                    <a href={`/events/${ev.id}`} target="_blank" rel="noreferrer" title="View Workspace" className="p-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-lg transition-colors">
                                        <Pencil size={16} />
                                    </a>
                                    <button onClick={() => handleDeleteEvent(ev.id, ev.title)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg bg-red-500/10 border border-transparent hover:border-red-500/50 transition-colors" title="Delete Event">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageEvents;
