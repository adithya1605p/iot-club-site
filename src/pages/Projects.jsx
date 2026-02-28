import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FolderGit2, ExternalLink, Github, Plus, X, Loader2, Code, Terminal, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Seed example projects — always visible so the gallery looks populated from day one
const SEED_PROJECTS = [
    {
        id: 'seed-1',
        title: 'Smart Weather Station',
        description: 'A real-time environmental monitor using an ESP32 + DHT22 sensor. Logs temperature, humidity, and heat index to a Supabase table every 30s and displays a live dashboard via a mobile-friendly web UI hosted on the onboard Wi-Fi access point.',
        image_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&q=80',
        github_url: 'https://github.com/',
        demo_url: null,
        tags: ['ESP32', 'DHT22', 'Supabase', 'IoT'],
        author: { display_name: 'Adithya P', department: 'IoT' },
        _seed: true,
    },
    {
        id: 'seed-2',
        title: 'RFID Attendance System',
        description: 'Automates lab attendance using MFRC522 RFID cards and an Arduino Uno. Each tap writes a timestamped record to a Google Sheet via IFTTT. Includes an LCD confirmation screen and a buzzer for audible feedback.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
        github_url: 'https://github.com/',
        demo_url: 'https://youtube.com/',
        tags: ['Arduino', 'RFID', 'MFRC522', 'Google Sheets'],
        author: { display_name: 'Siddiqui M', department: 'ECE' },
        _seed: true,
    },
    {
        id: 'seed-3',
        title: 'Line-Following Robot',
        description: 'A two-wheeled autonomous bot using IR sensors and an L298N motor driver. The PID control algorithm keeps it precisely on a black-tape track at up to 0.8 m/s. Built for the inter-college robotics event at Techfest 2024.',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
        github_url: 'https://github.com/',
        demo_url: null,
        tags: ['Robotics', 'PID', 'IR Sensors', 'L298N'],
        author: { display_name: 'Priya K', department: 'CSE' },
        _seed: true,
    },
];

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_url: '',
        demo_url: '',
        image_url: '',
        tags: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProjects();
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Join with profiles to get the author's name
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    author:profiles(display_name, department)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Non-blocking error for UI
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setProfile(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        try {
            const { error } = await supabase
                .from('projects')
                .insert([{
                    title: formData.title,
                    description: formData.description,
                    github_url: formData.github_url,
                    demo_url: formData.demo_url,
                    image_url: formData.image_url,
                    tags: tagsArray,
                    author_id: user.id
                }]);

            if (error) throw error;

            // Reset and close
            setFormData({ title: '', description: '', github_url: '', demo_url: '', image_url: '', tags: '' });
            setIsModalOpen(false);
            fetchProjects(); // Refresh the grid
            alert('Project deployed to the Armory successfully!');
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Failed to submit project. Ensure your database table is provisioned.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight uppercase flex items-center justify-center md:justify-start gap-4"
                        >
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">Armory</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 font-mono text-sm md:text-base max-w-xl"
                        >
                            Explore open-source hardware and software projects engineered by IoT Club members. Build. Share. Inspire.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {user ? (
                            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 group">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Submit Project
                            </Button>
                        ) : (
                            <Link to="/login" className="inline-block">
                                <Button variant="secondary" className="flex items-center gap-2">
                                    <Code size={18} /> Login to Submit
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-neon-cyan">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="font-mono tracking-widest uppercase">Decyphering Schematics...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="py-32 text-center border border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <FolderGit2 className="text-gray-600 mx-auto mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">The Armory is Empty</h3>
                        <p className="text-gray-400 font-mono max-w-md mx-auto mb-6">
                            No projects have been submitted yet. Be the first to deploy your prototype to the grid.
                        </p>
                        {user && (
                            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 mx-auto">
                                <Zap size={18} /> Initialize First Project
                            </Button>
                        )}
                    </div>
                ) : (
                    // Merge real DB projects with seed examples
                    (() => {
                        const allProjects = [...projects, ...SEED_PROJECTS];
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {allProjects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="h-full flex flex-col group hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all duration-300 bg-black/40 overflow-hidden">
                                            {/* Optional Image */}
                                            {project.image_url ? (
                                                <div className="w-full h-48 bg-black/50 overflow-hidden border-b border-white/10 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                                    {project._seed && (
                                                        <span className="absolute top-3 left-3 z-20 text-[9px] font-mono font-bold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                                                            <Sparkles size={9} /> Example
                                                        </span>
                                                    )}
                                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-32 bg-gradient-to-br from-white/5 to-white/0 border-b border-white/10 flex items-center justify-center">
                                                    <Terminal className="text-white/20" size={48} />
                                                </div>
                                            )}

                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-neon-cyan transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <span className="bg-white/10 text-gray-300 font-mono text-[10px] uppercase px-2 py-1 rounded shrink-0 border border-white/5">
                                                        {project.author?.department || 'GUEST'}
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 text-sm font-mono mb-6 line-clamp-3 leading-relaxed flex-1">
                                                    {project.description}
                                                </p>

                                                {project.tags && project.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {project.tags.map((tag, i) => (
                                                            <span key={i} className="text-xs font-mono text-neon-purple bg-neon-purple/10 border border-neon-purple/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                                    <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/20 shrink-0">
                                                            {(project.author?.display_name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="truncate max-w-[120px] block">{project.author?.display_name || 'Anonymous'}</span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {project.github_url && (
                                                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20">
                                                                <Github size={16} />
                                                            </a>
                                                        )}
                                                        {project.demo_url && (
                                                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-2 text-neon-cyan hover:text-black bg-neon-cyan/10 hover:bg-neon-cyan rounded-lg transition-colors border border-neon-cyan/30">
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })()
                )}
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold font-mono tracking-wider uppercase flex items-center gap-2">
                                    <Code size={20} className="text-neon-cyan" /> Submit to Armory
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                                    <div className="space-y-1 block">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">Project Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. ESP32 Weather Station"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1 block">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">Technical Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            placeholder="Explain what the project does, the hardware used, and challenges overcome..."
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <div className="space-y-1 block w-full">
                                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">GitHub Repository URL</label>
                                            <input
                                                type="url"
                                                name="github_url"
                                                value={formData.github_url}
                                                onChange={handleInputChange}
                                                placeholder="https://github.com/..."
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1 block w-full">
                                            <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">Live Demo / Video URL</label>
                                            <input
                                                type="url"
                                                name="demo_url"
                                                value={formData.demo_url}
                                                onChange={handleInputChange}
                                                placeholder="https://youtu.be/..."
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1 block">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">Thumbnail Image URL</label>
                                        <input
                                            type="url"
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={handleInputChange}
                                            placeholder="https://imgur.com/... (Optional but heavily recommended)"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1 block">
                                        <label className="text-xs text-neon-cyan font-mono uppercase tracking-wider ml-1 block">Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Arduino, ML, WebSockets"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors font-mono uppercase text-sm"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4 w-full">
                                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="border-white/10 hover:bg-white/5">
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" disabled={submitting} className="min-w-[150px]">
                                            {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Deploy Project'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
