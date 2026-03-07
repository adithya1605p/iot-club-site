import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';

const NewsCard = ({ article }) => {
    return (
        <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row bg-surface/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all shadow-lg group relative"
        >
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden shrink-0 bg-black/50 flex items-center justify-center">
                {article.image ? (
                    <img
                        src={article.image}
                        alt="Article Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className="text-4xl font-black text-white/10 uppercase tracking-widest rotate-[-15deg] scale-150">NEWS</div>
                )}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
                            {article.source}
                        </span>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <Calendar size={12} /> {article.publishedAt}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-neon-purple transition-colors leading-snug">
                        {article.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2">
                        {article.description}
                    </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-neon-cyan text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Read Full Article <ExternalLink size={16} />
                </div>
            </div>
        </motion.a>
    );
};

export default NewsCard;
