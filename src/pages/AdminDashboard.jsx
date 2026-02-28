import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Download, Search, Users, PieChart, BarChart3, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BlogEditor from '../components/admin/BlogEditor';
import ManageBlogs from '../components/admin/ManageBlogs';
import EventAnalytics from '../components/admin/EventAnalytics';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'registrations' or 'users'

    // Registrations State
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, byDept: {}, byYear: {} });

    // Users State
    const [users, setUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);

    const ADMIN_EMAILS = ['iotgcet2024@gmail.com', 'mdaahidsiddiqui@gmail.com', 'admin@gcetiot.com']; // Add other admins here

    const isAuthorized = user && ADMIN_EMAILS.includes(user.email);

    useEffect(() => {
        if (isAuthorized) {
            if (activeTab === 'registrations') {
                fetchData();
            } else {
                fetchUsers();
            }
        } else {
            setLoading(false);
        }
    }, [isAuthorized, user, activeTab]);

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

            setRegistrations(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setErrorMsg(error.message || 'Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMsg(error.message || 'Failed to fetch user profiles');
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

    const promoteToAdmin = async (id, currentRole) => {
        if (currentRole === 'admin') return;
        if (!window.confirm('Are you sure you want to promote this user to Admin? They will have full access.')) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setUsers(users.map(u => u.id === id ? { ...u, role: 'admin' } : u));
            alert('User successfully promoted to Admin.');
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to promote user: ' + error.message);
        }
    };

    const handleProfileDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name || 'this user'}? This will revoke their access to the app.`)) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error("Error deleting user profile", err);
            alert("Failed to delete user profile: " + err.message);
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

    const filteredData = registrations.filter(reg =>
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-neon-cyan text-xl">Verifying clearancce...</div>;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-black">
                <Card className="w-full max-w-md p-10 border-red-500/30 bg-black/80 backdrop-blur-xl text-center">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">RESTRICTED ACCESS</h2>
                    <p className="text-gray-400 font-mono mb-8 text-sm leading-relaxed">
                        {!user
                            ? "You must authenticate to access the command center."
                            : "Your current clearance level is insufficient for this sector."}
                    </p>

                    {!user ? (
                        <Link to="/login" className="block w-full py-4 bg-neon-cyan hover:bg-white hover:text-black font-bold font-mono tracking-widest text-black transition-all rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                            PROCEED TO LOGIN
                        </Link>
                    ) : (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono text-sm flex items-center gap-3">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>Logged in as: {user.email}</span>
                        </div>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Command Center</h1>
                    <p className="text-gray-400 font-mono text-sm">System Administration & Analytics</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={activeTab === 'registrations' ? fetchData : fetchUsers} className="border-white/20">
                        <RefreshCw size={18} />
                    </Button>
                    <Button variant="primary" onClick={downloadCSV} className="flex items-center gap-2">
                        <Download size={18} /> Export Reg. Data
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    User Directory
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${activeTab === 'registrations' ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    Event Registrations
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    Event Analytics
                </button>
                <button
                    onClick={() => setActiveTab('manage-blogs')}
                    className={`font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${activeTab === 'manage-blogs' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    Manage Blogs
                </button>
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${activeTab === 'blog' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    Write Blog CMS
                </button>
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

            {/* Conditionally Render Content */}
            {activeTab === 'blog' ? (
                <BlogEditor />
            ) : activeTab === 'manage-blogs' ? (
                <ManageBlogs />
            ) : activeTab === 'analytics' ? (
                <EventAnalytics />
            ) : (
                <Card className="border-white/10 w-full mb-8">
                    <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center bg-white/5">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder={activeTab === 'registrations' ? "Search Reg: Name, Email or ID..." : "Search Users: Name, Roll No..."}
                                value={activeTab === 'registrations' ? searchTerm : userSearchTerm}
                                onChange={(e) => activeTab === 'registrations' ? setSearchTerm(e.target.value) : setUserSearchTerm(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm"
                            />
                        </div>
                        <div className="ml-auto text-xs text-gray-500 font-mono">
                            Showing {activeTab === 'registrations' ? filteredData.length : users.filter(u => u.display_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.roll_number?.toLowerCase().includes(userSearchTerm.toLowerCase())).length} records
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'registrations' ? (
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
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider font-mono">
                                        <th className="p-4 border-b border-white/10">User</th>
                                        <th className="p-4 border-b border-white/10">Roll No</th>
                                        <th className="p-4 border-b border-white/10">Department</th>
                                        <th className="p-4 border-b border-white/10">Role</th>
                                        <th className="p-4 border-b border-white/10">Joined</th>
                                        <th className="p-4 border-b border-white/10 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500 animate-pulse">Scanning Database...</td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td>
                                        </tr>
                                    ) : (
                                        users.filter(u => u.display_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.roll_number?.toLowerCase().includes(userSearchTerm.toLowerCase())).map((u) => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{u.display_name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="p-4 text-neon-purple font-mono text-sm">{u.roll_number || 'N/A'}</td>
                                                <td className="p-4 text-gray-300 text-sm">
                                                    <span className="bg-white/10 px-2 py-1 rounded text-xs">{u.department || 'N/A'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold tracking-wider ${u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                                                        {u.role || 'user'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-500 text-xs font-mono">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right flex items-center justify-end gap-2">
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => promoteToAdmin(u.id, u.role)}
                                                            className="text-white hover:text-black text-xs uppercase font-bold tracking-wider px-3 py-1.5 border border-white/30 rounded hover:bg-white transition-colors"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleProfileDelete(u.id, u.display_name)}
                                                        className="text-red-500 hover:text-red-400 text-xs uppercase font-bold tracking-wider px-3 py-1.5 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;
