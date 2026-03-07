import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Download, Search, Users, PieChart, BarChart3, Lock, RefreshCw, CalendarPlus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, byDept: {}, byYear: {} });
    const [adminTab, setAdminTab] = useState('registrations'); // registrations | events
    // Events management state
    const [dbEvents, setDbEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', tagline: '', date: '', time: '', location: '',
        category: '', cover_image: '', description: '', status: 'upcoming',
    });
    const [savingEvent, setSavingEvent] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);

    // Simple env-based PIN (fallback to '1234' if not set)
    const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === ADMIN_PIN) {
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Access Denied: Invalid Protocol Code');
        }
    };

    const [errorMsg, setErrorMsg] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRegistrations(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMsg(error.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const deptBox = {};
        const yearBox = {};

        data.forEach(reg => {
            // Count Depts
            deptBox[reg.department] = (deptBox[reg.department] || 0) + 1;
            // Count Years
            yearBox[reg.year] = (yearBox[reg.year] || 0) + 1;
        });

        setStats({
            total: data.length,
            byDept: deptBox,
            byYear: yearBox
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('registrations')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local state
            const updatedList = registrations.filter(r => r.id !== id);
            setRegistrations(updatedList);
            calculateStats(updatedList);
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record: ' + error.message);
        }
    };

    const downloadCSV = () => {
        const headers = ['Full Name', 'Roll Number', 'Email', 'Phone', 'Department', 'Year', 'Registered At'];
        const csvRows = [headers.join(',')];

        registrations.forEach(row => {
            const values = [
                row.full_name,
                row.roll_number,
                row.email,
                row.phone,
                row.department,
                row.year,
                new Date(row.created_at).toLocaleString()
            ];
            // Escape commas and quotes
            const escaped = values.map(v => `"${String(v).replace(/"/g, '""')}"`);
            csvRows.push(escaped.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iot-club-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const fetchDbEvents = async () => {
        setEventsLoading(true);
        const { data } = await supabase.from('events').select('id,title,status,date,category,registration_open').order('date_iso', { ascending: false });
        if (data) setDbEvents(data);
        setEventsLoading(false);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setSavingEvent(true);
        await supabase.from('events').insert([newEvent]);
        setNewEvent({ title: '', tagline: '', date: '', time: '', location: '', category: '', cover_image: '', description: '', status: 'upcoming' });
        setShowEventForm(false);
        fetchDbEvents();
        setSavingEvent(false);
    };

    const handleStatusChange = async (id, status) => {
        await supabase.from('events').update({ status }).eq('id', id);
        fetchDbEvents();
    };

    const handleToggleReg = async (id, current) => {
        await supabase.from('events').update({ registration_open: !current }).eq('id', id);
        fetchDbEvents();
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        await supabase.from('events').delete().eq('id', id);
        fetchDbEvents();
    };

    const filteredData = registrations.filter(reg =>
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-black">
                <Card className="w-full max-w-md p-8 border-neon-cyan/30 bg-black/80 backdrop-blur-xl text-center">
                    <Lock className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-6">RESTRICTED ACCESS</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Protocol Code"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-white text-xl tracking-widest focus:border-neon-cyan focus:outline-none"
                            autoFocus
                        />
                        <Button variant="primary" type="submit" className="w-full">Initialize Session</Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Command Center</h1>
                    <p className="text-gray-400 font-mono text-sm">Real-time Registration Analytics</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={fetchData} className="border-white/20">
                        <RefreshCw size={18} />
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="flex items-center gap-2">
                        <Download size={18} /> Export Data
                    </Button>
                </div>
            </div>

            {/* ── Tab switcher ── */}
            <div className="flex gap-1 mb-8 border-b border-white/10">
                {[['registrations', 'Registrations'], ['events', 'Manage Events']].map(([key, label]) => (
                    <button key={key}
                        onClick={() => { setAdminTab(key); if (key === 'events') fetchDbEvents(); }}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${adminTab === key ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >{label}</button>
                ))}
            </div>

            {errorMsg && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg flex items-center justify-between">
                    <span>⚠️ Error: {errorMsg}</span>
                    <span className="text-xs opacity-70">Check RLS Policies or Table Permissions</span>
                </div>
            )}

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Card className="p-6 border-neon-cyan/30 bg-neon-cyan/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-neon-cyan font-mono text-sm uppercase">Total Cadets</span>
                        <Users size={20} className="text-neon-cyan" />
                    </div>
                    <div className="text-4xl font-bold text-white">{stats.total}</div>
                </Card>

                <Card className="p-6 border-neon-purple/30 bg-neon-purple/5 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-neon-purple font-mono text-sm uppercase">Department Distribution</span>
                        <PieChart size={20} className="text-neon-purple" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(stats.byDept).map(([dept, count]) => (
                            <div key={dept} className="flex items-center gap-2">
                                <div className="text-2xl font-bold text-white">{count}</div>
                                <div className="text-xs text-gray-400 uppercase">{dept}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-400 font-mono text-sm uppercase">Year Breakdown</span>
                        <BarChart3 size={20} className="text-blue-400" />
                    </div>
                    <div className="space-y-2">
                        {Object.entries(stats.byYear).sort().map(([year, count]) => (
                            <div key={year} className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Year {year}</span>
                                <span className="text-white font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Data Table */}
            <Card className="border-white/10 w-full mb-8">
                <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center bg-white/5">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name, Email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm"
                        />
                    </div>
                    <div className="ml-auto text-xs text-gray-500 font-mono">
                        Showing {filteredData.length} records
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider font-mono">
                                <th className="p-4 border-b border-white/10">Name</th>
                                <th className="p-4 border-b border-white/10">Roll No</th>
                                <th className="p-4 border-b border-white/10">Dept / Year</th>
                                <th className="p-4 border-b border-white/10">Contact</th>
                                <th className="p-4 border-b border-white/10">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 animate-pulse">Scanning Database...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No records found within sector.</td>
                                </tr>
                            ) : (
                                filteredData.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{reg.full_name}</td>
                                        <td className="p-4 text-neon-cyan font-mono text-sm">{reg.roll_number}</td>
                                        <td className="p-4 text-gray-300 text-sm">
                                            <span className="bg-white/10 px-2 py-1 rounded text-xs mr-2">{reg.department}</span>
                                            <span className="text-gray-500">Yr {reg.year}</span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            <div className="flex flex-col">
                                                <span>{reg.email}</span>
                                                <span className="text-xs opacity-50">{reg.phone}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs font-mono">
                                            {new Date(reg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(reg.id)}
                                                className="text-red-500 hover:text-red-400 text-xs uppercase font-bold tracking-wider px-2 py-1 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ── MANAGE EVENTS TAB ── */}
            {adminTab === 'events' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Events</h2>
                        <button onClick={() => setShowEventForm(v => !v)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-semibold hover:bg-neon-cyan/20 transition-colors">
                            <CalendarPlus size={15} /> New Event
                        </button>
                    </div>

                    {/* Create form */}
                    {showEventForm && (
                        <Card className="mb-8 p-6 border-neon-cyan/20">
                            <h3 className="text-white font-bold mb-4">Create Event</h3>
                            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[['title', 'Title *'], ['tagline', 'Tagline'], ['date', 'Date (display)'], ['time', 'Time'], ['location', 'Venue'], ['category', 'Category'], ['cover_image', 'Cover Image URL'],].map(([field, label]) => (
                                    <div key={field}>
                                        <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                                        <input
                                            value={newEvent[field]} onChange={e => setNewEvent(p => ({ ...p, [field]: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none"
                                            required={field === 'title'}
                                        />
                                    </div>
                                ))}
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                                    <textarea rows={3} value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Status</label>
                                    <select value={newEvent.status} onChange={e => setNewEvent(p => ({ ...p, status: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan focus:outline-none">
                                        <option value="upcoming">Upcoming</option>
                                        <option value="live">Live</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex gap-3 justify-end">
                                    <button type="button" onClick={() => setShowEventForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                                    <button type="submit" disabled={savingEvent}
                                        className="px-6 py-2 rounded-lg bg-neon-cyan text-black font-bold text-sm hover:bg-neon-cyan/80 transition-colors disabled:opacity-50">
                                        {savingEvent ? 'Saving…' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {/* Events list */}
                    {eventsLoading
                        ? <p className="text-gray-500 text-center py-10">Loading events…</p>
                        : (
                            <div className="space-y-3">
                                {dbEvents.map(ev => (
                                    <Card key={ev.id} className="p-4 flex flex-wrap items-center gap-4 border-white/5">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{ev.title}</p>
                                            <p className="text-gray-500 text-xs">{ev.category} · {ev.date}</p>
                                        </div>
                                        {/* Status toggle */}
                                        <select value={ev.status} onChange={e => handleStatusChange(ev.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-neon-cyan focus:outline-none">
                                            <option value="upcoming">Upcoming</option>
                                            <option value="live">🔴 Live</option>
                                            <option value="ended">Ended</option>
                                        </select>
                                        {/* Reg toggle */}
                                        <button onClick={() => handleToggleReg(ev.id, ev.registration_open)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${ev.registration_open ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-white/10 text-gray-500 bg-white/5'
                                                }`}>
                                            {ev.registration_open ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                            {ev.registration_open ? 'Reg Open' : 'Reg Closed'}
                                        </button>
                                        {/* Detail link */}
                                        <a href={`/events/${ev.id}`} target="_blank" rel="noreferrer"
                                            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/30 transition-colors flex items-center gap-1">
                                            <Pencil size={11} /> View
                                        </a>
                                        {/* Delete */}
                                        <button onClick={() => handleDeleteEvent(ev.id)}
                                            className="p-1.5 rounded-lg border border-red-500/20 text-red-500/60 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </Card>
                                ))}
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
