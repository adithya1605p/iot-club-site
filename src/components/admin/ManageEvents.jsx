import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Link as LinkIcon, Copy, Trash2, Loader2, AlertCircle, ToggleLeft, ToggleRight, Pencil, Save, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Default empty state
    const defaultEvent = {
        title: '', tagline: '', date: '', time: '', location: '',
        category: '', cover_image: '', description: '', status: 'upcoming', slug: '',
        rules: [], info: { team_size: '', prizes: '', duration: '' }, handouts: [], submission_link: ''
    };

    const [formData, setFormData] = useState(defaultEvent);

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
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const openCreateForm = () => {
        setFormData(defaultEvent);
        setEditingId(null);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openEditForm = (ev) => {
        setFormData({
            title: ev.title || '', tagline: ev.tagline || '', date: ev.date || '', time: ev.time || '', location: ev.location || '',
            category: ev.category || '', cover_image: ev.cover_image || '', description: ev.description || '', status: ev.status || 'upcoming', slug: ev.slug || '',
            rules: ev.rules || [], info: ev.info || { team_size: '', prizes: '', duration: '' }, handouts: ev.handouts || [], submission_link: ev.submission_link || ''
        });
        setEditingId(ev.id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg(null);

        const finalSlug = formData.slug || handleGenerateSlug(formData.title);
        const payload = { ...formData, slug: finalSlug };

        try {
            if (editingId) {
                const { error } = await supabase.from('events').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('events').insert([payload]);
                if (error) throw error;
            }

            setFormData(defaultEvent);
            setIsFormOpen(false);
            setEditingId(null);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            if (error.code === '23505') {
                setErrorMsg('An event with this specific URL slug already exists. Please modify the slug.');
            } else {
                setErrorMsg(error.message || 'Failed to save event.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async (id, title) => {
        if (!window.confirm(`Warning: Deleting the event "${title}" will also permanently delete ALL registrations associated with it. Proceed with extreme caution.`)) return;

        try {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) throw error;
            setEvents(events.filter(ev => ev.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to terminate event.');
        }
    };

    // Form Array Helpers
    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(p => ({ ...p, [field]: newArray }));
    };
    const addArrayItem = (field) => {
        setFormData(p => ({ ...p, [field]: [...p[field], field === 'handouts' ? { title: '', url: '', type: 'link' } : ''] }));
    };
    const removeArrayItem = (field, index) => {
        setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
    };

    if (loading) return <div className="text-center p-12 text-neon-cyan font-mono flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Synchronizing Event Data...</div>;

    return (
        <div className="w-full">
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-mono text-sm flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><AlertCircle size={18} /> {errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="text-xs uppercase hover:text-white transition-colors">Dismiss</button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-neon-cyan" /> Event Factory
                </h2>
                {!isFormOpen ? (
                    <Button variant="primary" onClick={openCreateForm} className="flex items-center gap-2">
                        <Plus size={18} /> Create New Event
                    </Button>
                ) : (
                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Close Editor
                    </Button>
                )}
            </div>

            {/* Event Editor Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                        <Card className="p-6 border-neon-cyan/30 bg-black/60 backdrop-blur-md">
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider font-mono border-b border-white/10 pb-2">
                                {editingId ? 'Edit Event Details' : 'Generate Event Workspace'}
                            </h3>
                            <form onSubmit={handleSaveEvent} className="space-y-6">

                                {/* Basic Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest border-b border-white/5 pb-1">Basic Intelligence</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            ['title', 'Title *'], ['tagline', 'Tagline'], ['date', 'Date (display)'],
                                            ['time', 'Time'], ['location', 'Venue'], ['category', 'Category'], ['cover_image', 'Cover Image URL']
                                        ].map(([field, label]) => (
                                            <div key={field}>
                                                <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">{label}</label>
                                                <input
                                                    value={formData[field]}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setFormData(p => ({
                                                            ...p,
                                                            [field]: val,
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
                                            <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors">
                                                <option value="upcoming">Upcoming</option>
                                                <option value="live">Live</option>
                                                <option value="ended">Ended</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">Custom URL Slug</label>
                                            <div className="flex items-center gap-2 text-gray-500 font-mono text-sm bg-black/50 border border-white/10 rounded-lg px-4 py-2">
                                                <span>/register/</span>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                                    placeholder="auto-generated-slug"
                                                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 focus:text-neon-cyan"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block mb-1">Description</label>
                                            <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none resize-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Workspace Data */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest border-b border-white/5 pb-1">Workspace Config (Registration / Rules / Handouts)</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Info JSON */}
                                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                            <h5 className="text-xs font-mono text-neon-cyan uppercase tracking-wider flex items-center gap-2">Event Quick Info <span className="text-gray-500 lowercase">(Shows on detail page)</span></h5>
                                            {['team_size', 'prizes', 'duration'].map((key) => (
                                                <div key={key}>
                                                    <label className="text-[10px] text-gray-400 capitalize">{key.replace('_', ' ')}</label>
                                                    <input
                                                        value={formData.info[key] || ''}
                                                        onChange={e => setFormData(p => ({ ...p, info: { ...p.info, [key]: e.target.value } }))}
                                                        className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-neon-cyan focus:outline-none"
                                                        placeholder={`e.g. ${key === 'team_size' ? '1 - 4 Members' : ''}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Submission Link */}
                                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                                            <h5 className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Project Submission Link</h5>
                                            <p className="text-[10px] text-gray-400">Google form or drive folder for final submissions.</p>
                                            <input
                                                value={formData.submission_link || ''}
                                                onChange={e => setFormData(p => ({ ...p, submission_link: e.target.value }))}
                                                className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
                                                placeholder="https://forms.gle/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Rules Array */}
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Event Rules</h5>
                                        <button type="button" onClick={() => addArrayItem('rules')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">Add Rule</button>
                                    </div>
                                    {formData.rules.map((rule, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <span className="text-gray-500 font-mono text-xs pt-2">{idx + 1}.</span>
                                            <textarea
                                                value={rule}
                                                onChange={e => handleArrayChange('rules', idx, e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-neon-cyan focus:outline-none resize-none" rows={2}
                                            />
                                            <button type="button" onClick={() => removeArrayItem('rules', idx)} className="text-red-500 hover:text-red-400 p-1"><X size={14} /></button>
                                        </div>
                                    ))}
                                    {formData.rules.length === 0 && <p className="text-xs text-gray-500 italic">No rules added. Tab will be hidden.</p>}
                                </div>

                                {/* Handouts Array */}
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Handouts & Resources</h5>
                                        <button type="button" onClick={() => addArrayItem('handouts')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">Add Handout</button>
                                    </div>
                                    {formData.handouts.map((handout, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2 border-b border-white/10 pb-2">
                                            <input
                                                value={handout.title} onChange={e => handleArrayChange('handouts', idx, { ...handout, title: e.target.value })}
                                                className="w-full md:w-1/3 bg-black border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="Document Title"
                                            />
                                            <input
                                                value={handout.url} onChange={e => handleArrayChange('handouts', idx, { ...handout, url: e.target.value })}
                                                className="w-full md:w-1/2 bg-black border border-white/10 rounded px-2 py-1 text-xs text-white" placeholder="URL (e.g. Drive Link)"
                                            />
                                            <select
                                                value={handout.type} onChange={e => handleArrayChange('handouts', idx, { ...handout, type: e.target.value })}
                                                className="w-full md:w-auto bg-black border border-white/10 rounded px-2 py-1 text-xs text-white">
                                                <option value="link">Link</option>
                                                <option value="pdf">PDF</option>
                                                <option value="drive">Drive</option>
                                            </select>
                                            <button type="button" onClick={() => removeArrayItem('handouts', idx)} className="text-red-500 hover:text-red-400 p-1 self-start md:self-center mt-1 md:mt-0"><X size={14} /></button>
                                        </div>
                                    ))}
                                    {formData.handouts.length === 0 && <p className="text-xs text-gray-500 italic">No handouts added. Tab will be hidden.</p>}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/10">
                                    <Button type="submit" variant="primary" className="w-full py-3 md:w-auto md:px-8" disabled={saving}>
                                        {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Saving...</span> : <span className="flex items-center gap-2"><Save size={18} /> {editingId ? 'Save Changes' : 'Initialize Event Engine'}</span>}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

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

                                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                                    <select value={ev.status} onChange={async e => {
                                        await supabase.from('events').update({ status: e.target.value }).eq('id', ev.id);
                                        fetchEvents();
                                    }} className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-white focus:border-neon-cyan focus:outline-none">
                                        <option value="upcoming">Upcoming</option>
                                        <option value="live">🔴 Live</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                    <button onClick={async () => {
                                        await supabase.from('events').update({ registration_open: !ev.registration_open }).eq('id', ev.id);
                                        fetchEvents();
                                    }} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold transition-colors ${ev.registration_open ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-white/10 text-gray-500 bg-white/5'}`}>
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
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/register/${ev.slug}`);
                                            alert('Registration Link Copied!');
                                        }} title="Copy Form Link" className="flex-1 sm:flex-none p-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg transition-colors">
                                            <Copy size={16} />
                                        </button>
                                    )}
                                    <a href={`/events/${ev.id}`} target="_blank" rel="noreferrer" title="View Workspace" className="p-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-lg transition-colors">
                                        <LinkIcon size={16} />
                                    </a>
                                    <button onClick={() => openEditForm(ev)} title="Edit Event Details" className="p-2 border border-white/10 text-blue-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/50 rounded-lg transition-colors">
                                        <Pencil size={16} />
                                    </button>
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
