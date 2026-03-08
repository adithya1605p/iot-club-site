import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Rss, FileText, Loader2, Search, Archive, Download, ExternalLink, Cpu, Server } from 'lucide-react';
import { fetchIoTNews, fetchArxivPapers } from '../services/api';
import { supabase } from '../lib/supabaseClient';
import BlogCard from '../components/learning/BlogCard';
import NewsCard from '../components/learning/NewsCard';
import PaperCard from '../components/learning/PaperCard';

const iconMap = {
    'cpu': <Cpu className="text-neon-cyan" size={20} />,
    'archive': <Archive className="text-yellow-400" size={20} />,
    'server': <Server className="text-green-400" size={20} />,
    'file-text': <FileText className="text-gray-400" size={20} />,
    'external-link': <ExternalLink className="text-red-500" size={20} />,
    'book-open': <BookOpen className="text-neon-purple" size={20} />
};

const LearningHub = () => {
    const [activeTab, setActiveTab] = useState('insights');
    const [news, setNews] = useState([]);
    const [papers, setPapers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [vaultItems, setVaultItems] = useState([]);

    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingPapers, setLoadingPapers] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loadingVault, setLoadingVault] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check Auth Status
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Auth Listener
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

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
            }, 500);

            // Fetch Papers
            setTimeout(async () => {
                const paperData = await fetchArxivPapers();
                setPapers(paperData);
                setLoadingPapers(false);
            }, 800);
        };
        loadExternalData();

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    // Fetch Vault items dynamically when tab is clicked
    useEffect(() => {
        if (activeTab === 'vault' && user && vaultItems.length === 0) {
            const fetchVault = async () => {
                setLoadingVault(true);
                try {
                    const { data, error } = await supabase
                        .from('vault')
                        .select('*')
                        .order('created_at', { ascending: true });
                    if (error) throw error;
                    setVaultItems(data || []);
                } catch (err) {
                    console.error("Error fetching vault:", err);
                } finally {
                    setLoadingVault(false);
                }
            };
            fetchVault();
        }
    }, [activeTab, user]);

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
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.05)_0%,_transparent_70%)] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.05)_0%,_transparent_70%)] rounded-full"></div>
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
                            >
                                {!user ? (
                                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-white/20 bg-white/5 rounded-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
                                            <Archive size={48} className="text-gray-500 mb-4" />
                                            <h3 className="text-2xl font-black text-white mb-2 font-mono">ENCRYPTED VAULT</h3>
                                            <p className="text-gray-400 font-mono mb-6 max-w-sm">Level 2 Clearance required. Please authenticate your identity to access technical schematics, drivers, and engineering texts.</p>
                                            <a href="/login">
                                                <button className="bg-neon-cyan text-black px-6 py-3 rounded-lg font-bold font-mono tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                                                    SYSTEM LOGIN
                                                </button>
                                            </a>
                                        </div>
                                        {/* Fake ghost grid for effect */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-20 filter blur-sm w-full">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-black/50 border border-white/10 h-40 rounded-2xl"></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : loadingVault ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-neon-cyan">
                                        <Loader2 className="animate-spin mb-4" size={48} />
                                        <p className="font-mono tracking-widest uppercase">Decyphering Vault Contents...</p>
                                    </div>
                                ) : vaultItems.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {vaultItems.map((item) => (
                                            <div key={item.id} className="flex flex-col p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-neon-cyan/40 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.08)]">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-neon-cyan/30 transition-colors">
                                                        {iconMap[item.icon_type] || <FileText className="text-gray-400" size={20} />}
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
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400 font-mono border border-dashed border-white/20 bg-white/5 rounded-2xl">
                                        Vault is currently empty. Hardware manifests have not been indexed.
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LearningHub;
