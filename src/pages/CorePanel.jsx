import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Shield, Users, Megaphone, Loader2, RefreshCw, BarChart3, CheckCircle, AlertCircle, Clock, Download, BrainCircuit, Trash2 } from 'lucide-react';

const CorePanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [announcementsList, setAnnouncementsList] = useState([]);
    const [activeTab, setActiveTab] = useState('statistics'); // 'statistics', 'users', 'recruitment', 'announcements'

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [targetAudience, setTargetAudience] = useState('all');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyAndFetch = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                // Verify user is core
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profile || profile.role !== 'core') {
                    navigate('/dashboard'); // Kick out non-core members
                    return;
                }

                await Promise.all([fetchProfiles(), fetchRegistrations(), fetchAnnouncementsList()]);
            } catch (error) {
                console.error('Error verifying role:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetch();
    }, [user, navigate]);

    const fetchProfiles = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProfiles(data);
    };

    const fetchRegistrations = async () => {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setRegistrations(data);
    };

    const fetchAnnouncementsList = async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setAnnouncementsList(data || []);
    };

    const updateRole = async (userId, newRole) => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
            await fetchProfiles(); // refresh the list
        } catch (error) {
            console.error('Error updating role:', error);
            alert("Failed to update role. Did you run the Core Panel SQL?");
        } finally {
            setActionLoading(false);
        }
    };

    const updateRegistrationStatus = async (regId, newStatus) => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('registrations')
                .update({ status: newStatus || 'pending' })
                .eq('id', regId);

            if (error) throw error;
            await fetchRegistrations();
        } catch (error) {
            console.error('Error updating status:', error);
            alert("Failed to update status. Run the newly provided SQL setup file!");
        } finally {
            setActionLoading(false);
        }
    };

    const deleteProfile = async (id) => {
        if (!window.confirm("Permanently delete this user profile? (Their auth account remains, but profile data is wiped)")) return;
        setActionLoading(true);
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            await fetchProfiles();
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Failed to delete user profile.');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteRegistration = async (id) => {
        if (!window.confirm("Permanently delete this applicant's registration?")) return;
        setActionLoading(true);
        try {
            const { error } = await supabase.from('registrations').delete().eq('id', id);
            if (error) throw error;
            await fetchRegistrations();
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration.');
        } finally {
            setActionLoading(false);
        }
    };

    const postAnnouncement = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('announcements')
                .insert([
                    {
                        title,
                        content,
                        link: link || null,
                        target_audience: targetAudience,
                        created_by: user.id
                    }
                ]);

            if (error) throw error;

            setMessage('Announcement posted successfully!');
            setTitle('');
            setContent('');
            setLink('');
            setTargetAudience('all');
            await fetchAnnouncementsList();
        } catch (error) {
            console.error('Error posting announcement:', error);
            setMessage('Failed to post. Did you run the SQL?');
        } finally {
            setActionLoading(false);
        }
    };

    const deleteAnnouncement = async (id) => {
        if (!window.confirm("Permanently delete this update?")) return;
        setActionLoading(true);
        try {
            const { error } = await supabase.from('announcements').delete().eq('id', id);
            if (error) throw error;
            await fetchAnnouncementsList();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement.');
        } finally {
            setActionLoading(false);
        }
    };

    const downloadCSV = () => {
        if (registrations.length === 0) {
            alert("No registrations to download.");
            return;
        }

        // Define Headers
        const headers = ['Full Name', 'Roll Number', 'Email', 'Phone', 'Department', 'Year', 'Status', 'Registration Date'];

        // Convert to rows format, being careful with commas in full_name
        const csvRows = registrations.map(reg => {
            return [
                `"${reg.full_name || ''}"`, // Wrap in quotes case they have a comma
                reg.roll_number || '',
                reg.email || '',
                reg.phone || '',
                reg.department || '',
                reg.year || '',
                reg.status || 'pending',
                reg.created_at ? new Date(reg.created_at).toLocaleString() : ''
            ].join(',');
        });

        // Combine
        const csvString = [headers.join(','), ...csvRows].join('\n');

        // Download Blob
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const linkElem = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];

        linkElem.setAttribute('href', url);
        linkElem.setAttribute('download', `IoT_Club_Recruitments_${timestamp}.csv`);
        linkElem.style.visibility = 'hidden';

        document.body.appendChild(linkElem);
        linkElem.click();
        document.body.removeChild(linkElem);
    };

    // Calculate Statistics
    const totalUsers = profiles.length;
    const coreTeamCount = profiles.filter(p => p.role === 'core').length;
    const totalApplicants = registrations.length;
    const pendingApplicants = registrations.filter(r => !r.status || r.status === 'pending').length;
    const r1Applicants = registrations.filter(r => r.status === 'r1_quiz').length;
    const r2Applicants = registrations.filter(r => r.status === 'r2_gd').length;
    const r3Applicants = registrations.filter(r => r.status === 'r3_interview').length;
    const selectedApplicants = registrations.filter(r => r.status === 'selected').length;

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <Loader2 className="animate-spin text-neon-cyan" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-neon-cyan/5 border border-neon-cyan/30 p-6 rounded-2xl backdrop-blur-xl"
            >
                <div className="w-16 h-16 bg-neon-cyan/20 text-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <Shield size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">CORE TEAM PANEL</h1>
                    <p className="text-neon-cyan font-mono text-sm">Level 9 Authorization Granted</p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Add Announcement Section */}
                <div className="lg:col-span-1">
                    <Card className="p-6 border-neon-purple/20 bg-neon-purple/5 sticky top-28">
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                            <Megaphone className="text-neon-purple" size={20} />
                            Post Update
                        </h2>
                        <form onSubmit={postAnnouncement} className="space-y-4">
                            <div>
                                <label className="text-xs text-neon-purple font-mono uppercase tracking-wider ml-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neon-purple font-mono uppercase tracking-wider ml-1">Message Detail</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors h-24 resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neon-purple font-mono uppercase tracking-wider ml-1">Meeting Link (Optional)</label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://meet.google.com/..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neon-purple font-mono uppercase tracking-wider ml-1">Target Audience</label>
                                <select
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors"
                                >
                                    <option value="all">Everyone (Global Broadcast)</option>
                                    <option value="pending">Pending Applicants Only</option>
                                    <option value="shortlisted">Shortlisted Candidates (R2) Only</option>
                                    <option value="selected">Selected Candidates Only</option>
                                    <option value="member">Platform Members Only</option>
                                    <option value="core">Core Team Only</option>
                                </select>
                            </div>
                            {message && (
                                <p className="text-sm font-mono text-green-400">{message}</p>
                            )}
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-full py-3 text-sm font-bold tracking-widest uppercase bg-neon-purple hover:bg-neon-purple/80 hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] text-white"
                                disabled={actionLoading}
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Broadcast'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* User Management Section */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="text-neon-cyan" size={20} />
                                User Management
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => setActiveTab('statistics')}
                                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'statistics' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Analytics
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'users' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Platform Users
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('recruitment')}
                                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'recruitment' ? 'bg-neon-purple text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Recruitment Pool
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('announcements')}
                                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'announcements' ? 'bg-blue-400 text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Broadcasts
                                    </button>
                                </div>
                                <button onClick={() => { fetchProfiles(); fetchRegistrations(); fetchAnnouncementsList(); }} className="text-gray-400 hover:text-neon-cyan transition-colors" title="Refresh Data">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {activeTab === 'statistics' ? (
                                <div className="space-y-6">
                                    {/* Top Level Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                            <Users size={24} className="text-neon-cyan mb-2" />
                                            <div className="text-3xl font-bold text-white mb-1">{totalUsers}</div>
                                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Platform Users</div>
                                        </div>
                                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                            <Shield size={24} className="text-neon-purple mb-2" />
                                            <div className="text-3xl font-bold text-white mb-1">{coreTeamCount}</div>
                                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Core Team Members</div>
                                        </div>
                                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                            <BarChart3 size={24} className="text-blue-400 mb-2" />
                                            <div className="text-3xl font-bold text-white mb-1">{totalApplicants}</div>
                                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Applications</div>
                                        </div>
                                        <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                            <CheckCircle size={24} className="text-green-400 mb-2" />
                                            <div className="text-3xl font-bold text-white mb-1">{selectedApplicants}</div>
                                            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Selected Members</div>
                                        </div>
                                    </div>

                                    {/* Recruitment Pipeline Funnel */}
                                    <div className="mt-8 bg-black/40 border border-white/10 p-6 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 max-w-full rounded-full blur-[50px] pointer-events-none"></div>
                                        <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Recruitment Pipeline Funnel</h3>

                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-center">
                                            <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-white mb-1">{pendingApplicants}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Pending</div>
                                            </div>
                                            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-white mb-1">{r1Applicants}</div>
                                                <div className="text-[10px] text-red-500 uppercase tracking-wider font-mono">R1: Quiz</div>
                                            </div>
                                            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-white mb-1">{r2Applicants}</div>
                                                <div className="text-[10px] text-blue-500 uppercase tracking-wider font-mono">R2: Comm/GD</div>
                                            </div>
                                            <div className="bg-neon-purple/10 border border-neon-purple/30 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-white mb-1">{r3Applicants}</div>
                                                <div className="text-[10px] text-neon-purple uppercase tracking-wider font-mono">R3: Interview</div>
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex flex-col justify-center lg:col-span-1 col-span-2">
                                                <div className="text-xl font-bold text-white mb-1">{selectedApplicants}</div>
                                                <div className="text-[10px] text-green-400 uppercase tracking-wider font-mono">Final Selected</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'users' ? (
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3 font-mono border-r border-white/5">Name / Roll</th>
                                            <th className="px-4 py-3 font-mono border-r border-white/5">Dept</th>
                                            <th className="px-4 py-3 font-mono">Role Access</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profiles.map((profile) => (
                                            <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 border-r border-white/5">
                                                    <div className="font-bold text-white">{profile.full_name}</div>
                                                    <div className="text-xs font-mono text-neon-cyan mt-1">{profile.roll_number}</div>
                                                </td>
                                                <td className="px-4 py-3 border-r border-white/5">{profile.department}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={profile.role}
                                                            onChange={(e) => updateRole(profile.id, e.target.value)}
                                                            disabled={actionLoading || profile.id === user.id}
                                                            className={`bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-mono focus:outline-none transition-colors ${profile.role === 'core' ? 'text-neon-purple font-bold' :
                                                                profile.role === 'member' ? 'text-neon-cyan font-bold' : 'text-gray-400'
                                                                }`}
                                                        >
                                                            <option value="tinkerer">Tinkerer</option>
                                                            <option value="member">Member</option>
                                                            <option value="core">Core Team</option>
                                                        </select>
                                                        <button
                                                            onClick={() => deleteProfile(profile.id)}
                                                            disabled={profile.id === user.id || actionLoading}
                                                            className="text-gray-500 hover:text-red-500 transition-colors ml-2 disabled:opacity-30 disabled:hover:text-gray-500"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {profiles.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-gray-500 font-mono">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : activeTab === 'recruitment' ? (
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3 font-mono border-r border-white/5">Applicant</th>
                                            <th className="px-4 py-3 font-mono border-r border-white/5">Contact</th>
                                            <th className="px-4 py-3 font-mono border-r border-white/5">Dept / Year</th>
                                            <th className="px-4 py-3 font-mono">
                                                <div className="flex justify-between items-center">
                                                    <span>Pipeline Status</span>
                                                    <button
                                                        onClick={downloadCSV}
                                                        className="text-white hover:text-black bg-neon-purple/20 hover:bg-neon-purple border border-neon-purple p-1.5 rounded transition-colors"
                                                        title="Export CSV"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.map((reg) => (
                                            <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 border-r border-white/5">
                                                    <div className="font-bold text-white">{reg.full_name}</div>
                                                    <div className="text-xs font-mono text-neon-purple mt-1">{reg.roll_number}</div>
                                                </td>
                                                <td className="px-4 py-3 border-r border-white/5">
                                                    <div className="text-white mb-1">{reg.email}</div>
                                                    <div className="text-xs font-mono text-gray-400">{reg.phone}</div>
                                                </td>
                                                <td className="px-4 py-3 border-r border-white/5">
                                                    <div className="text-white mb-1">{reg.department}</div>
                                                    <div className="text-xs font-mono text-gray-400">Year: {reg.year}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={reg.status || 'pending'}
                                                            onChange={(e) => updateRegistrationStatus(reg.id, e.target.value)}
                                                            disabled={actionLoading}
                                                            className={`bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs font-bold focus:outline-none transition-colors w-full ${reg.status === 'selected' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                                                                reg.status === 'r1_quiz' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                                                                    reg.status === 'r2_gd' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                                                                        reg.status === 'r3_interview' ? 'text-neon-purple border-neon-purple/30 bg-neon-purple/10' :
                                                                            reg.status === 'rejected' ? 'text-gray-600 border-gray-600/30 bg-gray-800/10 line-through' :
                                                                                'text-gray-400'
                                                                }`}
                                                        >
                                                            <option value="pending" className="text-black bg-white">Pending Review</option>
                                                            <option value="r1_quiz" className="text-black bg-white text-red-600">Round 1 (Quiz)</option>
                                                            <option value="r2_gd" className="text-black bg-white text-blue-600">Round 2 (Comm/GD)</option>
                                                            <option value="r3_interview" className="text-black bg-white text-purple-600">Round 3 (Interview)</option>
                                                            <option value="selected" className="text-black bg-green-500">🏁 Selected Member</option>
                                                            <option value="rejected" className="text-black bg-gray-400">Not Selected</option>
                                                        </select>
                                                        <button
                                                            onClick={() => deleteRegistration(reg.id)}
                                                            disabled={actionLoading}
                                                            className="text-gray-500 hover:text-red-500 transition-colors ml-1 disabled:opacity-30 flex-shrink-0"
                                                            title="Delete Registration"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {registrations.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500 font-mono">No recruitment registrations found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : activeTab === 'announcements' ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Active Broadcasts</h3>
                                    {announcementsList.map(a => (
                                        <div key={a.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start justify-between group relative overflow-hidden">
                                            <div className="pr-12">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-white font-bold">{a.title}</h4>
                                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                                        Audience: {a.target_audience}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">{a.content}</p>
                                                {a.link && (
                                                    <a href={a.link} target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline text-sm font-mono mt-2 inline-block">
                                                        Link Attached ↗
                                                    </a>
                                                )}
                                                <div className="text-[10px] font-mono text-gray-600 mt-2">
                                                    {new Date(a.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteAnnouncement(a.id)}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-50 hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {announcementsList.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 font-mono border border-white/5 rounded-xl border-dashed">
                                            No announcements active.
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CorePanel;
