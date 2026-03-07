import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Cpu, Server, Archive, ExternalLink, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock Data for the Vault
const VAULT_ITEMS = [
    {
        id: 1,
        title: "ESP32 Pinout & Specs",
        category: "microcontrollers",
        description: "High-resolution diagram of the 38-pin ESP32 DEVKIT V1. Essential for wiring sensors and avoiding power shorts.",
        type: "pdf",
        icon: <Cpu className="text-neon-cyan" size={24} />,
        link: "#", // Placeholder URL
        size: "2.4 MB"
    },
    {
        id: 2,
        title: "Arduino Uno R3 Reference",
        category: "microcontrollers",
        description: "Official schematic, analog/digital pin mappings, and power limits for the standard Arduino Uno.",
        type: "pdf",
        icon: <Cpu className="text-neon-purple" size={24} />,
        link: "#",
        size: "1.1 MB"
    },
    {
        id: 3,
        title: "DHT11 vs DHT22 Guide",
        category: "sensors",
        description: "Comparison chart for temperature/humidity sensors including pull-up resistor requirements and code snippets.",
        type: "pdf",
        icon: <Archive className="text-blue-400" size={24} />,
        link: "#",
        size: "0.8 MB"
    },
    {
        id: 4,
        title: "CP210x USB to UART Bridge",
        category: "drivers",
        description: "Windows/Mac drivers required to flash ESP32 and NodeMCU boards via USB. Fixes the 'COM Port not found' error.",
        type: "exe",
        icon: <Server className="text-green-400" size={24} />,
        link: "https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers", // Real external link
        size: "Driver"
    },
    {
        id: 5,
        title: "CH340 Serial Driver",
        category: "drivers",
        description: "Required for generic Arduino clones. Install this if your PC doesn't recognize your newly plugged-in board.",
        type: "zip",
        icon: <Server className="text-green-400" size={24} />,
        link: "#",
        size: "1.5 MB"
    },
    {
        id: 6,
        title: "I2C Scanner Code (C++)",
        category: "software",
        description: "A plug-and-play Arduino sketch that scans the I2C bus and outputs the hex addresses of all connected devices (LCDs, OLEDs, etc.).",
        type: "code",
        icon: <FileText className="text-gray-400" size={24} />,
        link: "#",
        size: "2 KB"
    }
];

const HardwareVault = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All Resources' },
        { id: 'microcontrollers', label: 'Microcontrollers' },
        { id: 'sensors', label: 'Sensors / Actuators' },
        { id: 'drivers', label: 'Drivers & Tools' },
        { id: 'software', label: 'Code Snippets' }
    ];

    const filteredItems = VAULT_ITEMS.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[150px] -z-10 absolute pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px] -z-10 absolute pointer-events-none"></div>

            <div className="container mx-auto max-w-7xl">
                {/* Header Sequence */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-neon-cyan/10 rounded-full mb-6 border border-neon-cyan/20"
                    >
                        <Archive className="text-neon-cyan" size={32} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight uppercase"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 line-through decoration-white/20">Hardware</span> Vault
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed"
                    >
                        Your definitive arsenal for IoT development. Download highly detailed pinout schematics, critical USB drivers, and core software repositories.
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                className={`px-4 py-2 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-300 border ${activeFilter === cat.id
                                        ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search schemas, drivers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-full pl-12 pr-6 py-3 text-white font-mono text-sm outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
                        />
                    </div>
                </div>

                {/* Vault Grid */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/20 rounded-2xl bg-white/5">
                        <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-white text-xl font-bold font-mono tracking-wider uppercase mb-2">No Archives Found</h3>
                        <p className="text-gray-500 font-mono text-sm">Expand your search parameters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="h-full flex flex-col p-6 bg-black/60 border-white/10 hover:border-neon-cyan/50 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden">

                                    {/* Subtle glowing corner */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-neon-cyan/20 blur-2xl rounded-full group-hover:bg-neon-cyan/40 transition-colors"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-neon-cyan/30 transition-colors shrink-0">
                                            {item.icon}
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 object-contain rounded border ${item.type === 'pdf' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                item.type === 'exe' || item.type === 'zip' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    'bg-white/10 text-gray-300 border-white/20'
                                            }`}>
                                            .{item.type}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-neon-cyan transition-colors line-clamp-1">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm font-sans mb-6 line-clamp-3 flex-1 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                        <span className="text-xs text-gray-500 font-mono">{item.size}</span>

                                        <a href={item.link} target={item.link !== '#' ? "_blank" : "_self"} rel="noreferrer" className="block">
                                            <Button variant="secondary" className="flex items-center gap-2 text-xs py-2 px-4 group-hover:bg-neon-cyan group-hover:text-black hover:scale-105 transition-all outline outline-1 outline-white/20 group-hover:outline-neon-cyan">
                                                {item.type === 'pdf' ? (
                                                    <><ExternalLink size={14} /> VIEW</>
                                                ) : item.type === 'code' ? (
                                                    <><FileText size={14} /> COPY</>
                                                ) : (
                                                    <><Download size={14} /> GET</>
                                                )}
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HardwareVault;
