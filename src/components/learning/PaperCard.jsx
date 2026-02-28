import { motion } from 'framer-motion';
import { BookOpen, Calendar, Download } from 'lucide-react';

const PaperCard = ({ paper }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-surface/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-neon-cyan/50 transition-all duration-300 shadow-xl shadow-black/50 flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-neon-purple/20 text-neon-purple px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-2">
                        <BookOpen size={14} /> RESEARCH
                    </span>
                    <span className="text-gray-500 text-xs font-mono flex items-center gap-1">
                        <Calendar size={12} /> {paper.publishedAt}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-tight line-clamp-2" title={paper.title}>
                    {paper.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {paper.summary}
                </p>
            </div>

            <div>
                <div className="mb-4">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-widest block mb-1">Authors</span>
                    <p className="text-sm text-neon-cyan line-clamp-1" title={paper.authors}>
                        {paper.authors}
                    </p>
                </div>

                <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-neon-cyan/10 border border-white/10 hover:border-neon-cyan/50 text-white hover:text-neon-cyan transition-all flex items-center justify-center gap-2 font-bold text-sm tracking-widest uppercase"
                >
                    <Download size={16} /> View on arXiv
                </a>
            </div>
        </motion.div>
    );
};

export default PaperCard;
