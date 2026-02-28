import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Rss, FileText, Loader2, Search, Archive, Download, ExternalLink, Cpu, Server } from 'lucide-react';
import { fetchIoTNews, fetchArxivPapers } from '../services/api';
import { supabase } from '../lib/supabaseClient';
import BlogCard from '../components/learning/BlogCard';
import NewsCard from '../components/learning/NewsCard';
import PaperCard from '../components/learning/PaperCard';

const VAULT_ITEMS = [
    // ── Books ────────────────────────────────────────────────────────────
    {
        id: 'book-1', title: 'Arduino for Dummies', category: 'Books',
        description: 'The perfect starting point for beginners. Covers the Arduino IDE, basic circuits, sensors, motors, and your first real projects — no prior experience needed.',
        type: 'pdf', icon: <BookOpen className="text-yellow-400" size={20} />,
        link: 'https://drive.google.com/uc?export=download&id=1vujIzw3ADpyRn2jkRZQ-J7-2U3UL4_gb', size: '~15 MB', download: true,
    },
    {
        id: 'book-2', title: 'Designing the Internet of Things', category: 'Books',
        description: 'A practical guide to building real IoT products — from prototyping with Arduino/Raspberry Pi to cloud connectivity, data, and product design thinking.',
        type: 'pdf', icon: <BookOpen className="text-orange-400" size={20} />,
        link: 'https://drive.google.com/uc?export=download&id=1Wt2SVa4nidgApz-SsPPNyuVyGDUIst6I', size: '~8 MB', download: true,
    },

    // ── Simulators ───────────────────────────────────────────────────────
    {
        id: 'sim-1', title: 'TinkerCAD Circuits', category: 'Simulators',
        description: 'Browser-based Arduino + circuit simulator by Autodesk. Build and test circuits with no hardware needed. Great for beginners to experiment safely.',
        type: 'link', icon: <Cpu className="text-neon-cyan" size={20} />,
        link: 'https://www.tinkercad.com/circuits', size: 'Free',
    },
    {
        id: 'sim-2', title: 'Wokwi — ESP32 & Arduino Simulator', category: 'Simulators',
        description: 'The most realistic online simulator for ESP32, Arduino Uno/Mega, Raspberry Pi Pico. Supports WiFi, OLED displays, sensors and real C++ code.',
        type: 'link', icon: <Cpu className="text-neon-purple" size={20} />,
        link: 'https://wokwi.com', size: 'Free',
    },
    {
        id: 'sim-3', title: 'Falstad Circuit Simulator', category: 'Simulators',
        description: 'Simulate analog & digital circuits live in your browser. Great for understanding how resistors, capacitors, op-amps and logic gates work before building.',
        type: 'link', icon: <Cpu className="text-blue-400" size={20} />,
        link: 'https://www.falstad.com/circuit/', size: 'Free',
    },

    // ── Learning & Wikis ─────────────────────────────────────────────────
    {
        id: 'wiki-1', title: 'All About Circuits', category: 'Learning',
        description: 'Free textbooks on DC/AC circuits, semiconductors, and digital logic. The go-to electronics theory reference for students — like Khan Academy for EE.',
        type: 'link', icon: <FileText className="text-green-400" size={20} />,
        link: 'https://www.allaboutcircuits.com', size: 'Free',
    },
    {
        id: 'wiki-2', title: 'Random Nerd Tutorials', category: 'Learning',
        description: 'Hundreds of step-by-step ESP32 / ESP8266 / Arduino tutorials with wiring diagrams and copy-paste code. Best practical IoT tutorial site online.',
        type: 'link', icon: <FileText className="text-neon-cyan" size={20} />,
        link: 'https://randomnerdtutorials.com', size: 'Free',
    },
    {
        id: 'wiki-3', title: 'Last Minute Engineers', category: 'Learning',
        description: 'Detailed tutorials for common IoT sensors and modules (DHT22, OLED, HC-SR04, SIM800L) with circuit diagrams. Excellent Indian-made resource.',
        type: 'link', icon: <FileText className="text-yellow-400" size={20} />,
        link: 'https://lastminuteengineers.com', size: 'Free',
    },
    {
        id: 'wiki-4', title: 'Arduino Official Docs', category: 'Learning',
        description: 'Official Arduino language reference, library docs, and built-in examples. Bookmark this — every function you will ever need is documented here.',
        type: 'link', icon: <FileText className="text-blue-400" size={20} />,
        link: 'https://docs.arduino.cc', size: 'Free',
    },

    // ── Reddit Communities ───────────────────────────────────────────────
    {
        id: 'reddit-1', title: 'r/arduino', category: 'Community',
        description: '700K+ members. Post your project, ask for help with code or wiring, or just browse cool builds. The most active Arduino community online.',
        type: 'link', icon: <ExternalLink className="text-orange-500" size={20} />,
        link: 'https://reddit.com/r/arduino', size: 'Community',
    },
    {
        id: 'reddit-2', title: 'r/esp32', category: 'Community',
        description: 'Dedicated subreddit for ESP32 projects, troubleshooting, and firmware. Great for WiFi/BLE specific questions.',
        type: 'link', icon: <ExternalLink className="text-orange-500" size={20} />,
        link: 'https://reddit.com/r/esp32', size: 'Community',
    },
    {
        id: 'reddit-3', title: 'r/IOT', category: 'Community',
        description: 'News, projects and discussions about the Internet of Things ecosystem — from MQTT protocols to cloud dashboards and edge computing.',
        type: 'link', icon: <ExternalLink className="text-orange-500" size={20} />,
        link: 'https://reddit.com/r/IOT', size: 'Community',
    },
    {
        id: 'reddit-4', title: 'r/electronics', category: 'Community',
        description: 'General electronics community. Good for circuit design questions, component identification, and PCB layout help.',
        type: 'link', icon: <ExternalLink className="text-orange-500" size={20} />,
        link: 'https://reddit.com/r/electronics', size: 'Community',
    },

    // ── Discord Servers ──────────────────────────────────────────────────
    {
        id: 'discord-1', title: 'Arduino Discord', category: 'Community',
        description: 'Official Arduino community Discord. Real-time help from experts, project showcases, and dedicated channels for beginners.',
        type: 'link', icon: <Server className="text-indigo-400" size={20} />,
        link: 'https://discord.gg/jQJFwW7', size: 'Discord',
    },
    {
        id: 'discord-2', title: 'ESP32 & MicroPython Discord', category: 'Community',
        description: 'Active Discord for ESP32 developers using MicroPython, CircuitPython, and C++. Great for firmware-level help.',
        type: 'link', icon: <Server className="text-indigo-400" size={20} />,
        link: 'https://discord.gg/RJZMeKGeamV', size: 'Discord',
    },
    {
        id: 'discord-3', title: 'Hackspace / Makers Discord', category: 'Community',
        description: 'A large maker community Discord with channels for 3D printing, electronics, robotics, and IoT. Good place to find collaborators.',
        type: 'link', icon: <Server className="text-indigo-400" size={20} />,
        link: 'https://discord.gg/hackspace', size: 'Discord',
    },

    // ── Original Drivers/Cheatsheets ─────────────────────────────────────
    {
        id: 'drv-1', title: 'CP210x USB–UART Driver', category: 'Drivers',
        description: 'Windows/Mac driver to flash ESP32 and NodeMCU boards via USB. Fixes "COM Port not found" errors.',
        type: 'link', icon: <Server className="text-green-400" size={20} />,
        link: 'https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers', size: 'External',
    },
    {
        id: 'drv-2', title: 'CH341SER (CH340 Driver)', category: 'Drivers',
        description: 'Required for generic Arduino clones and cheap NodeMCU boards. Install this if your PC does not recognize the board.',
        type: 'link', icon: <Server className="text-green-400" size={20} />,
        link: 'https://www.wch-ic.com/downloads/CH341SER_EXE.html', size: 'External',
    },
];

const LearningHub = () => {
    const [activeTab, setActiveTab] = useState('insights');
    const [news, setNews] = useState([]);
    const [papers, setPapers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingPapers, setLoadingPapers] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadExternalData = async () => {
            // Fetch Blogs
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('published_at', { ascending: false });
                if (error) throw error;
                setBlogs(data || []);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            } finally {
                setLoadingBlogs(false);
            }

            // Fetch News
            setTimeout(async () => {
                const newsData = await fetchIoTNews();
                setNews(newsData);
                setLoadingNews(false);
            }, 500); // Artificial slight delay for smooth UI transition

            // Fetch Papers
            setTimeout(async () => {
                const paperData = await fetchArxivPapers();
                setPapers(paperData);
                setLoadingPapers(false);
            }, 800);
        };
        loadExternalData();
    }, []);

    const tabs = [
        { id: 'insights', label: 'Club Insights', icon: <BookOpen size={18} /> },
        { id: 'news', label: 'Live IoT News', icon: <Rss size={18} /> },
        { id: 'research', label: 'Research Papers', icon: <FileText size={18} /> },
        { id: 'vault', label: 'Hardware Vault', icon: <Archive size={18} /> },
    ];

    const handleSearch = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            setLoadingPapers(true);
            try {
                // If search query is empty, default to standard IoT query
                const queryStr = searchQuery.trim() === '' ? 'all:iot OR all:embedded' : `all:${searchQuery.replace(/\s+/g, '+OR+all:')}`;
                const newPapers = await fetchArxivPapers(queryStr);
                setPapers(newPapers);
            } catch (err) {
                console.error("Error searching papers", err);
            } finally {
                setLoadingPapers(false);
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight"
                    >
                        THE LEARNING <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">HUB</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 font-mono max-w-2xl mx-auto text-sm md:text-base"
                    >
                        Expand your knowledge. Explore our weekly insights, real-time industry news, and cutting-edge academic research in IoT.
                    </motion.p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 inline-flex flex-wrap justify-center gap-1 md:gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white/10 text-white shadow-lg shadow-white/5 border border-white/10'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {/* Tab 1: Club Insights */}
                        {activeTab === 'insights' && (
                            <motion.div
                                key="insights"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {loadingBlogs ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-neon-cyan">
                                        <Loader2 className="animate-spin mb-4" size={48} />
                                        <p className="font-mono tracking-widest uppercase">Fetching Network Insights...</p>
                                    </div>
                                ) : blogs.length > 0 ? (
                                    blogs.map(post => (
                                        <BlogCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 text-gray-400 font-mono">
                                        No intelligence logs available.
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Tab 2: Live News */}
                        {activeTab === 'news' && (
                            <motion.div
                                key="news"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                {loadingNews ? (
                                    <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-20 text-neon-cyan">
                                        <Loader2 className="animate-spin mb-4" size={48} />
                                        <p className="font-mono tracking-widest uppercase">Intercepting News Feeds...</p>
                                    </div>
                                ) : news.length > 0 ? (
                                    news.map(article => (
                                        <NewsCard key={article.id} article={article} />
                                    ))
                                ) : (
                                    <div className="col-span-1 lg:col-span-2 text-center py-20 text-red-400 font-mono">
                                        Failed to connect to the news cipher. Try again later.
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Tab 3: Research Papers */}
                        {activeTab === 'research' && (
                            <motion.div
                                key="research"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col gap-6"
                            >
                                {/* Search Bar */}
                                <div className="flex justify-center w-full max-w-xl mx-auto mb-2">
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search size={18} className="text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search titles, authors, or summaries... (Press Enter to search live arXiv)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearch}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="ml-2 bg-neon-cyan text-black px-4 rounded-xl font-bold font-mono tracking-wider hover:bg-white transition-colors flex items-center justify-center shrink-0"
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                    {loadingPapers ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-neon-purple">
                                            <Loader2 className="animate-spin mb-4" size={48} />
                                            <p className="font-mono tracking-widest uppercase">Accessing arXiv Database...</p>
                                        </div>
                                    ) : papers.length > 0 ? (
                                        papers.map(paper => (
                                            <PaperCard key={paper.id} paper={paper} />
                                        ))
                                    ) : papers.length === 0 && !loadingPapers ? (
                                        <div className="col-span-full text-center py-20 text-gray-400 font-mono">
                                            No research papers match your search parameters. Try a different query.
                                        </div>
                                    ) : (
                                        <div className="col-span-full text-center py-20 text-red-400 font-mono">
                                            Database connection failed. Could not retrieve academic records.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {/* Tab 4: Hardware Vault */}
                        {activeTab === 'vault' && (
                            <motion.div
                                key="vault"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {VAULT_ITEMS.map((item) => (
                                    <div key={item.id} className="flex flex-col p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-neon-cyan/40 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.08)]">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-neon-cyan/30 transition-colors">
                                                {item.icon}
                                            </div>
                                            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded border ${item.type === 'pdf' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                item.type === 'code' ? 'bg-white/10 text-gray-300 border-white/20' :
                                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>.{item.type}</span>
                                        </div>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{item.category}</p>
                                        <h3 className="text-white font-bold mb-2 group-hover:text-neon-cyan transition-colors text-sm">{item.title}</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4">{item.description}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                            <span className="text-xs text-gray-600 font-mono">{item.size}</span>
                                            <a href={item.link} target={item.link !== '#' ? '_blank' : '_self'} rel="noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/20 text-gray-300 hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all">
                                                {item.type === 'pdf' ? <><ExternalLink size={12} /> VIEW</> :
                                                    item.type === 'code' ? <><FileText size={12} /> GET</> :
                                                        <><Download size={12} /> GET</>}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LearningHub;
