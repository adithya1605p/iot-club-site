import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT', path: '/about' },
        { name: 'EVENTS', path: '/events' },
        { name: 'TEAM', path: '/team' },
        { name: 'JOIN', path: '/register' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo / Brand */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 border border-white/20 rounded-lg overflow-hidden relative">
                            <div className="absolute inset-0 bg-neon-cyan/20 group-hover:bg-neon-cyan/0 transition-colors duration-300"></div>
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-neon-cyan transition-colors duration-300 font-sans">IOT CLUB</span>
                            <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono">GCET STUDENT CHAPTER</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${location.pathname === link.path
                                        ? 'text-black bg-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 absolute top-20 left-0 w-full z-40">
                    <div className="px-6 py-8 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-5 py-4 rounded-xl text-lg font-bold tracking-widest transition-all border border-transparent ${location.pathname === link.path
                                    ? 'text-black bg-neon-cyan border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                                    : 'text-gray-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
