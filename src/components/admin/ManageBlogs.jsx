import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trash2, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            alert('Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to permanently delete the blog "${title}"?`)) return;

        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog.');
        }
    };

    if (loading) return <div className="text-center p-12 text-gray-500 font-mono flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Fetching Archives...</div>;

    if (blogs.length === 0) return (
        <div className="text-center p-12 bg-black/50 border border-white/10 rounded-xl">
            <h3 className="text-white font-bold mb-2">No Blogs Found</h3>
            <p className="text-gray-500 text-sm">Create a new blog via the Write Blog CMS tab.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map(blog => (
                <div key={blog.id} className="bg-black/40 border border-white/10 p-6 rounded-xl flex flex-col hover:border-neon-purple/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono text-neon-purple bg-neon-purple/10 px-2 py-1 rounded uppercase tracking-wider">
                            {blog.category || 'Uncategorized'}
                        </span>
                        <div className="flex gap-2">
                            <Link to={`/blog/${blog.id}`} target="_blank" className="p-2 text-gray-400 hover:text-neon-cyan bg-white/5 rounded-lg transition-colors">
                                <ExternalLink size={16} />
                            </Link>
                            <button onClick={() => handleDelete(blog.id, blog.title)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg bg-red-500/10 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{blog.title}</h3>
                    <div className="text-sm text-gray-500 font-mono mt-auto flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.published_at).toLocaleDateString()}</span>
                        <span>By {blog.author}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManageBlogs;
