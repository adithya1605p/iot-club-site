import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'EVENTS', path: '/events' },
    { name: 'LEARN', path: '/learn' },
    { name: 'TEAM', path: '/team' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, signOut, isAdmin } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location]);

    const links = [
        ...NAV_LINKS,
        ...(isAdmin ? [{ name: 'COMMAND', path: '/admin' }] : []),
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 px-8 py-5 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-background-dark/95 backdrop-blur-md border-b border-white/10' : 'bg-gradient-to-b from-background-dark/90 to-transparent'
                }`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-cyber-lime text-3xl group-hover:rotate-180 transition-transform duration-700">hub</span>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-widest leading-none">
                            IOT<span className="text-cyber-lime">CLUB</span>
                        </span>
                        <span className="text-[8px] tracking-[0.3em] text-slate-500 font-mono">GCET // V2.0</span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex gap-10 text-xs font-black tracking-widest">
                    {links.map(link => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link key={link.name} to={link.path}
                                className={`relative pb-1 transition-colors ${isActive ? 'text-cyber-lime' : 'text-slate-400 hover:text-white'
                                    }`}>
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-full h-[2px] transition-transform origin-left ${isActive ? 'bg-cyber-lime scale-x-100' : 'bg-primary scale-x-0 group-hover:scale-x-100'
                                    }`} />
                            </Link>
                        );
                    })}
                </div>

                {/* CTA / Logout */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <button onClick={signOut}
                            className="flex items-center gap-2 px-5 py-2 border border-white/20 hover:border-red-500/60 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest">
                            LOGOUT
                            <div className="w-2 h-2 bg-cyber-lime rounded-full animate-pulse" />
                        </button>
                    ) : (
                        <Link to="/login"
                            className="flex items-center gap-2 px-5 py-2 border border-white/20 hover:border-cyber-lime hover:bg-cyber-lime/10 transition-all group font-black text-xs uppercase tracking-widest">
                            CONNECT
                            <div className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-cyber-lime animate-pulse transition-colors" />
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="md:hidden text-white z-50" onClick={() => setIsOpen(v => !v)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25 }}
                        className="fixed inset-0 z-40 flex flex-col pt-28 px-8 gap-8"
                        style={{ background: 'rgba(5,7,10,0.98)', backdropFilter: 'blur(20px)' }}
                    >
                        {links.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Link to={link.path}
                                    className={`text-4xl font-black italic uppercase tracking-tight ${location.pathname === link.path ? 'text-cyber-lime' : 'text-white hover:text-cyber-lime'
                                        } transition-colors`}>
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                        <div className="mt-4">
                            {user ? (
                                <button onClick={signOut}
                                    className="px-6 py-3 border border-red-500/30 text-red-400 font-black uppercase tracking-widest text-sm">
                                    LOGOUT
                                </button>
                            ) : (
                                <Link to="/login"
                                    className="px-6 py-3 bg-cyber-lime text-black font-black uppercase tracking-widest text-sm">
                                    CONNECT →
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Side scroll indicator (desktop only) */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
                <div className="w-px h-16" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))' }} />
                <span className="text-[9px] font-mono text-cyber-lime tracking-[0.3em]"
                    style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
                <div className="w-px h-16" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }} />
            </div>
        </>
    );
};

export default Navbar;
