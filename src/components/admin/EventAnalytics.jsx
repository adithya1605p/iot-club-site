import { useState, useRef } from 'react';
import { Upload, PieChart as PieChartIcon, BarChart3, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#00ffff', '#bc13fe', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

const EventAnalytics = () => {
    const [fileName, setFileName] = useState(null);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data;
                setData(parsedData);
                calculateStats(parsedData);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
                alert("Failed to parse CSV file.");
            }
        });
    };

    const calculateStats = (csvData) => {
        const deptCount = {};
        const yearCount = {};

        csvData.forEach(row => {
            // Adjust these keys based on generic expected CSV headers
            const dept = row.Department || row.Branch || row.department || row.branch || 'Unknown';
            const year = row.Year || row.year || 'Unknown';

            deptCount[dept] = (deptCount[dept] || 0) + 1;
            yearCount[year] = (yearCount[year] || 0) + 1;
        });

        // Format for Recharts
        const deptData = Object.entries(deptCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        const yearData = Object.entries(yearCount).map(([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));

        setStats({
            total: csvData.length,
            deptData,
            yearData
        });
    };

    const clearData = () => {
        setData([]);
        setStats(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full">
            <Card className="p-8 border-white/10 mb-8 bg-black/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <BarChart3 className="text-neon-cyan" /> Event Analytics Engine
                        </h2>
                        <p className="text-gray-400 font-mono text-sm max-w-xl">
                            Upload a raw CSV file from any event registration form (like Google Forms). The engine will instantly parse the data locally—without saving sensitive info to the database—and generate interactive insights.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        {!fileName ? (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center gap-2 bg-neon-cyan text-black px-6 py-3 rounded-xl font-bold font-mono tracking-wider hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                            >
                                <Upload size={18} /> UPLOAD CSV
                            </button>
                        ) : (
                            <button
                                onClick={clearData}
                                className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold font-mono tracking-wider hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <Trash2 size={18} /> CLEAR DATA
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Summary */}
                    <Card className="col-span-1 lg:col-span-3 p-6 border-neon-cyan/20 bg-neon-cyan/5 flex justify-between items-center">
                        <div>
                            <div className="text-neon-cyan font-mono text-sm uppercase mb-1">Active Dataset</div>
                            <div className="text-white font-medium">{fileName}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-neon-cyan font-mono text-sm uppercase mb-1">Total Registrations</div>
                            <div className="text-3xl font-black text-white">{stats.total}</div>
                        </div>
                    </Card>

                    {/* Department Pie Chart */}
                    <Card className="col-span-1 lg:col-span-2 p-6 border-white/10 bg-black/40">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <PieChartIcon className="text-neon-purple" size={20} /> Branch Distribution
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.deptData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.deptData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                        itemStyle={{ color: '#00ffff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {stats.deptData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-sm font-mono text-gray-400">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.name}: {entry.value}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Year Bar Chart */}
                    <Card className="col-span-1 p-6 border-white/10 bg-black/40">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="text-blue-400" size={20} /> Year Breakdown
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.yearData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} />
                                    <YAxis stroke="#888" tick={{ fill: '#888', fontFamily: 'monospace' }} allowDecimals={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                        {stats.yearData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default EventAnalytics;
