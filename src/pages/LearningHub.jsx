import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Rss, FileText, Loader2, Search } from 'lucide-react';
import { fetchIoTNews, fetchArxivPapers } from '../services/api';
import { supabase } from '../lib/supabaseClient';
import BlogCard from '../components/learning/BlogCard';
import NewsCard from '../components/learning/NewsCard';
import PaperCard from '../components/learning/PaperCard';

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
        { id: 'research', label: 'Research Papers', icon: <FileText size={18} /> }
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
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LearningHub;
