import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Plus, X, Upload, ShieldAlert, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['All', 'IoT', 'Robotics', 'AI', 'Embedded', 'Cloud', 'Hardware'];

    useEffect(() => {
        const init = async () => {
            // Check Auth Status
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Fetch Projects
            fetchProjects();
        };

        init();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    const [fetchError, setFetchError] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error("Error fetching armory projects:", err);
            setFetchError(err.message || "Failed to query the 'projects' table. Please run the SQL migration.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeploy = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
            const { error } = await supabase.from('projects').insert([{
                title: formData.title,
                description: formData.description,
                tags: tagsArray,
                image: formData.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', // default fallback
                status: 'Live',
                user_id: user.id
            }]);

            if (error) throw error;

            // Refresh and close form
            await fetchProjects();
            setFormData({ title: '', description: '', tags: '', image: '' });
            setShowForm(false);
        } catch (err) {
            console.error("Deployment failed:", err);
            alert("Failed to deploy project to Armory. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.tags && p.tags.some(tag => tag.toLowerCase() === filter.toLowerCase()));

    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full -z-10 pointer-events-none"></div>

            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-6 border border-red-500/20"
                    >
                        <ShieldAlert className="text-red-500" size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight uppercase"
                    >
                        The <span className="text-red-500">Armory</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto font-mono mb-8"
                    >
                        Open-source exhibition platform. Deploy your hardware systems and software architectures for the network to see.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center"
                    >
                        {user ? (
                            <Button
                                variant={showForm ? 'outline' : 'primary'}
                                onClick={() => setShowForm(!showForm)}
                                className={`flex items-center gap-2 font-mono uppercase tracking-widest ${showForm ? 'border-red-500/50 text-red-500' : 'bg-red-500 text-black outline-none border-none hover:bg-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
                            >
                                {showForm ? <><X size={18} /> Cancel Uplink</> : <><Plus size={18} /> Deploy to Armory</>}
                            </Button>
                        ) : (
                            <a href="/login">
                                <Button variant="outline" className="flex items-center gap-2 font-mono border-white/20 text-gray-400 hover:text-white hover:border-white uppercase tracking-widest">
                                    Login to Deploy
                                </Button>
                            </a>
                        )}
                    </motion.div>
                </div>

                {/* Deployment Form */}
                <AnimatePresence>
                    {showForm && user && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-black/50 border border-red-500/30 rounded-2xl p-6 md:p-8 mb-12 max-w-3xl mx-auto relative overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] -z-10 rounded-full"></div>

                            <h3 className="text-2xl font-black text-white font-mono mb-6 uppercase flex items-center gap-2">
                                <Upload className="text-red-500" /> Project Uplink
                            </h3>

                            <form onSubmit={handleDeploy} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-red-500 font-mono mb-2">Project Codename</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                                        placeholder="E.g. Autonomous Sentinel"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-red-500 font-mono mb-2">Technical Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-red-500 focus:outline-none transition-colors resize-none"
                                        placeholder="Describe the architecture, hardware, and algorithms used..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-red-500 font-mono mb-2">Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                                            placeholder="Hardware, AI, ROS2..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-red-500 font-mono mb-2">Image URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 text-right">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`font-mono uppercase tracking-widest bg-red-500 text-black border-none hover:bg-white shadow-[0_0_15px_rgba(239,68,68,0.3)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Transmitting...' : 'Execute Uplink'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 rounded-full font-mono text-sm uppercase tracking-wider transition-all duration-300 border ${filter === category
                                ? 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="font-mono tracking-widest uppercase text-sm">Accessing Armory Database...</p>
                    </div>
                ) : fetchError ? (
                    <div className="text-center py-20 border border-dashed border-red-500/50 rounded-2xl bg-red-500/10 font-mono shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <ShieldAlert className="mx-auto mb-4 text-red-500" size={48} />
                        <h3 className="text-xl font-black text-red-500 uppercase mb-2">CRITICAL DATABASE FAILURE</h3>
                        <p className="text-red-400 max-w-lg mx-auto leading-relaxed">
                            {fetchError}
                        </p>
                        <p className="text-gray-400 mt-4 text-xs tracking-widest uppercase">
                            Did you execute `projects_migration.sql` in Supabase?
                        </p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 font-mono">
                        No projects deployed to this sector yet.
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="h-full flex flex-col bg-black/60 border-white/10 hover:border-red-500/40 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] p-0 overflow-hidden">
                                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-red-500/30 text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                                                {project.status || 'Live'}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-red-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/10">
                                                {project.tags && project.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-400">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Projects;
