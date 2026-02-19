import { Github, Twitter, Linkedin, Mail, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-surface/50 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left flex items-center gap-4">
                        <img src="/src/assets/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full border border-white/10" />
                        <div>
                            <h3 className="text-lg font-bold text-white mb-0">IoT Club</h3>
                            <p className="text-gray-400 text-sm">Building the future with hardware & code.</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://www.instagram.com/iotclub.gcet?igsh=dm1neXcxZTEwMDNk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-cyan transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors"><Mail className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>

                    <div className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} IoT Club. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
