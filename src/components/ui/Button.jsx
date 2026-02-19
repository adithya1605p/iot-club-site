import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";

    const variants = {
        primary: "bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]",
        secondary: "bg-neon-purple/10 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white shadow-[0_0_10px_rgba(189,0,255,0.2)] hover:shadow-[0_0_20px_rgba(189,0,255,0.5)]",
        ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
