import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, Wifi, Server, Database, Terminal, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';

const TelemetryDashboard = () => {
    const [data, setData] = useState([]);
    const [logs, setLogs] = useState([]);
    const [uptime, setUptime] = useState(0);
    const [systemLoad, setSystemLoad] = useState(32);

    // Simulate Data Stream
    useEffect(() => {
        // Initial historical data
        const initialData = Array.from({ length: 20 }, (_, i) => ({
            time: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temperature: 24 + Math.random() * 2,
            humidity: 45 + Math.random() * 5,
        }));
        setData(initialData);

        const initialLogs = [
            `[SYS] Telemetry Engine Initialized...`,
            `[NET] Connecting to MQTT broker tcp://iot.gcet.edu.in:1883`,
            `[NET] Connection established. Subscribe topic: sensor/lab_1/env`,
            `[AUTH] Handshake verified with Node_ESP32_01`
        ];
        setLogs(initialLogs);

        // Update loop
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Random fluctuations
            const newTemp = 24 + Math.random() * 3;
            const newHum = 45 + Math.random() * 6;
            const newLoad = Math.max(10, Math.min(100, systemLoad + (Math.random() * 20 - 10)));

            setSystemLoad(newLoad);

            setData(currentData => {
                const newData = [...currentData, { time: timeStr, temperature: newTemp, humidity: newHum }];
                if (newData.length > 20) newData.shift(); // Keep last 20 points
                return newData;
            });

            // Simulate incoming log occasionally
            if (Math.random() > 0.7) {
                const fakeLogs = [
                    `[DAT] Payload received: {"t": ${newTemp.toFixed(1)}, "h": ${newHum.toFixed(1)}}`,
                    `[SYS] Memory heap optimization... OK`,
                    `[NET] PING latency: ${Math.floor(Math.random() * 50 + 10)}ms`,
                    `[WRN] Dropped packet from Node_ESP8266_04`,
                    `[DAT] Syncing state with Supabase... OK`
                ];
                const rLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];

                setLogs(currentLogs => {
                    const newLogs = [...currentLogs, `[${timeStr}] ${rLog}`];
                    if (newLogs.length > 15) newLogs.shift();
                    return newLogs;
                });
            }

        }, 2000); // 2-second tick rate

        // Uptime counter
        const uptimeInterval = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(uptimeInterval);
        };
    }, []);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Custom Tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-neon-cyan/30 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                    <p className="text-gray-400 font-mono text-xs mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="font-mono text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(2)}
                            {entry.name === 'temperature' ? '°C' : '%'}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                        <Activity className="text-neon-cyan animate-pulse" /> Telemetry Dashboard
                    </h1>
                    <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        LIVE LINK ESTABLISHED // LAB NODE 01
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-mono text-sm border-l-2 border-l-neon-cyan">
                        <span className="text-gray-500 uppercase text-xs block mb-1">System Uptime</span>
                        <span className="text-white font-bold">{formatUptime(uptime)}</span>
                    </div>
                </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="p-5 border-white/5 bg-gradient-to-br from-black to-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs uppercase">Network Status</span>
                        <Wifi size={16} className="text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">OPTIMAL</div>
                    <div className="text-xs text-green-400 font-mono">14ms latency</div>
                </Card>

                <Card className="p-5 border-white/5 bg-gradient-to-br from-black to-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs uppercase">Active Nodes</span>
                        <Cpu size={16} className="text-neon-cyan" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">4 ONLINE</div>
                    <div className="text-xs text-neon-cyan font-mono">3 ESP32, 1 RPi</div>
                </Card>

                <Card className="p-5 border-white/5 bg-gradient-to-br from-black to-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs uppercase">Core Temp</span>
                        <AlertTriangle size={16} className={data.length > 0 && data[data.length - 1]?.temperature > 26 ? "text-orange-500" : "text-gray-500"} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {data.length > 0 ? data[data.length - 1].temperature.toFixed(1) : '--'}°C
                    </div>
                    <div className="text-xs text-gray-400 font-mono">Lab Environment</div>
                </Card>

                <Card className="p-5 border-white/5 bg-gradient-to-br from-black to-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-mono text-xs uppercase">System Load</span>
                        <Server size={16} className={systemLoad > 80 ? "text-red-500" : "text-neon-purple"} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {systemLoad.toFixed(0)}%
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${systemLoad > 80 ? 'bg-red-500' : 'bg-neon-purple'}`}
                            style={{ width: `${systemLoad}%` }}
                        ></div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Charts Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Temperature Chart */}
                    <Card className="p-6 border-white/10 bg-black/40">
                        <h3 className="text-white font-mono uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span> Thermal Sensor Stream
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff40" fontSize={11} tickMargin={10} />
                                    <YAxis stroke="#ffffff40" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="temperature" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Humidity Chart */}
                    <Card className="p-6 border-white/10 bg-black/40">
                        <h3 className="text-white font-mono uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Moisture Sensor Stream
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff40" fontSize={11} tickMargin={10} />
                                    <YAxis stroke="#ffffff40" fontSize={11} domain={[30, 70]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="humidity" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorHum)" isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column (Terminal) */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-neon-cyan/20 bg-[#050505] overflow-hidden flex flex-col min-h-[500px]">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Database size={14} className="text-neon-cyan" />
                                <span className="font-mono text-xs text-gray-300 uppercase">RAW_DATA_LOG</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs font-medium flex flex-col justify-end space-y-2">
                            {logs.map((log, i) => {
                                // Dynamic coloring based on log content
                                let textColor = 'text-green-400';
                                if (log.includes('[WRN]')) textColor = 'text-yellow-400';
                                else if (log.includes('[ERR]')) textColor = 'text-red-400';
                                else if (log.includes('[DAT]')) textColor = 'text-neon-cyan';
                                else if (log.includes('[SYS]')) textColor = 'text-gray-400';

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${textColor} break-all opacity-90`}
                                    >
                                        {/* The '>' prompt */}
                                        <span className="text-gray-600 mr-2">{'>'}</span>{log}
                                    </motion.div>
                                );
                            })}
                            <div className="text-green-400 items-center flex gap-2 mt-2 opacity-50">
                                <span className="text-gray-600">{'>'}</span>
                                <span className="w-2 h-3 bg-green-400 animate-pulse inline-block"></span>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default TelemetryDashboard;
