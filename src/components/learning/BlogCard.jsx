import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
    return (
        <Link to={`/blog/${post.id}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group block bg-surface/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 shadow-xl shadow-black/50"
            >
                <div className="h-48 overflow-hidden relative">
                    <img
                        src={post.image || "/logo.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-neon-cyan text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {post.category}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-3">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                        <span className="text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded">{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-sm text-gray-300">
                        <User size={16} className="text-neon-purple" />
                        <span>{post.author}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default BlogCard;
