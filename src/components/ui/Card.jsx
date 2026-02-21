import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { scale: 1.01, y: -2 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={twMerge(
                "bg-surface/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500",
                hover ? "hover:border-neon-cyan/40 hover:bg-surface/60 hover:shadow-[0_0_40px_-15px_rgba(0,255,255,0.2)]" : "",
                className
            )}
            {...props}
        >
            {/* Inner Glow - Smooth Fade In */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/0 blur-[60px] rounded-full pointer-events-none -mr-10 -mt-10 group-hover:bg-neon-purple/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-cyan/0 blur-[60px] rounded-full pointer-events-none -ml-10 -mb-10 group-hover:bg-neon-cyan/20 transition-colors duration-700" />

            {/* Content */}
            <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
