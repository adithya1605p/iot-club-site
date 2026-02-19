import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -5 } : {}}
            className={twMerge(
                "bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden group transition-all duration-300",
                hover ? "hover:border-neon-cyan/30 hover:shadow-[0_0_30px_-10px_rgba(0,243,255,0.15)]" : "",
                className
            )}
            {...props}
        >
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full pointer-events-none -ml-10 -mb-10" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
