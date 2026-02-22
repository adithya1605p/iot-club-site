import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <AlertOctagon size={80} className="mx-auto text-red-500 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <h1 className="text-6xl font-bold text-white mb-2 tracking-widest font-mono">404</h1>
                <h2 className="text-2xl font-bold text-neon-cyan mb-6 uppercase tracking-wider">SYSTEM FAULT: Page Not Found</h2>
                <p className="text-gray-400 font-mono text-sm mb-8">
                    The requested routing destination does not exist within the primary mainframe.
                    Please return to a valid access node.
                </p>
                <Link to="/">
                    <Button variant="primary" className="uppercase tracking-widest font-bold">
                        Return to Base
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
