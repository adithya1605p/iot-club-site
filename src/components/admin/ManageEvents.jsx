import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Calendar, Plus, Link as LinkIcon, Copy, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Form State
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [creating, setCreating] = useState(false);

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

        const finalSlug = newSlug || handleGenerateSlug(newTitle);

        try {
            const { error } = await supabase
                .from('events')
                .insert([{
                    title: newTitle,
                    description: newDescription,
                    event_date: new Date(newDate).toISOString(),
                    slug: finalSlug
                }]);

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    throw new Error('An event with this identical URL slug already exists. Please modify the title or manually change the slug.');
                }
                throw error;
            }

            // Reset form
            setNewTitle('');
            setNewDescription('');
            setNewDate('');
            setNewSlug('');
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
            alert('Failed to terminate event.');
        }
    };

    const copyToClipboard = (slug) => {
        const url = `${window.location.origin}/register/${slug}`;
        navigator.clipboard.writeText(url);
        // Could add a toast notification here
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
                    <Calendar className="text-neon-cyan" /> Active Operations & Events
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
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    className="mb-8"
                >
                    <Card className="p-6 border-neon-cyan/30 bg-black/60 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider font-mono border-b border-white/10 pb-2">Generate Dynamic Registration Portal</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => {
                                            setNewTitle(e.target.value);
                                            if (!newSlug) setNewSlug(handleGenerateSlug(e.target.value));
                                        }}
                                        required
                                        placeholder="e.g. Arduino Hackathon 2026"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Launch Date</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Context / Description (Optional)</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Explain what the event is about..."
                                    rows="2"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1">Custom URL Slug</label>
                                <div className="flex items-center gap-2 text-gray-500 font-mono text-sm bg-black/50 border border-white/10 rounded-lg px-4 py-2">
                                    <span>/register/</span>
                                    <input
                                        type="text"
                                        value={newSlug}
                                        onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        placeholder="auto-generated-slug"
                                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 focus:text-neon-cyan"
                                    />
                                </div>
                            </div>

                            <Button type="submit" variant="primary" className="w-full py-3 mt-4" disabled={creating}>
                                {creating ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Deploying Event...</span> : 'Initialize Event Engine'}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* List of Events */}
            {events.length === 0 ? (
                <div className="text-center p-12 bg-black/50 border border-white/10 rounded-xl">
                    <h3 className="text-white font-bold mb-2">No Active Events</h3>
                    <p className="text-gray-500 text-sm font-mono">Create an event to generate dynamic registration forms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {events.map((ev) => (
                        <div key={ev.id} className="bg-black/40 border border-white/10 p-5 rounded-xl hover:border-neon-cyan/50 transition-colors flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                            <div className="lg:w-1/2">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    {ev.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-mono mb-2 line-clamp-2">
                                    {ev.description || 'No description provided.'}
                                </p>
                                <div className="text-xs font-mono text-neon-cyan flex items-center gap-2">
                                    <Calendar size={14} /> Scheduled: {new Date(ev.event_date).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                                    <LinkIcon size={14} className="text-gray-500 shrink-0" />
                                    <span className="truncate max-w-[150px] lg:max-w-xs block">.../register/{ev.slug}</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => copyToClipboard(ev.slug)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 px-3 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-colors"
                                    >
                                        <Copy size={16} /> Link
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                                        className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg bg-red-500/10 border border-transparent hover:border-red-500/50 transition-colors shrink-0"
                                        title="Delete Event"
                                    >
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
