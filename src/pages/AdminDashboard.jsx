import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Download, Search, Users, PieChart, BarChart3, Lock, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, byDept: {}, byYear: {} });

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
            <Card className="overflow-hidden border-white/10">
                <div className="p-4 border-b border-white/10 flex items-center bg-white/5">
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
        </div>
    );
};

export default AdminDashboard;
