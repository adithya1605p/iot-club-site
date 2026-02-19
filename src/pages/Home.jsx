import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TextHoverEffect } from '../components/ui/text-hover-effect';
import FeaturesSection from '../components/FeaturesSection';

const Home = () => {
    return (
        <div className="bg-black min-h-screen">
            {/* Hero Section */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 pt-20 overflow-hidden">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-cyan/20 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>

                {/* Hero Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest text-neon-cyan uppercase"
                >
                    System Online • V2.0
                </motion.div>

                {/* Main Typography */}
                <div className="relative text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-9xl font-bold text-white mb-2 tracking-tighter"
                    >
                        IOT CLUB
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-2xl text-gray-400 tracking-[0.2em] font-light px-4"
                    >
                        INNOVATE <span className="text-neon-cyan">•</span> BUILD <span className="text-neon-cyan">•</span> DEPLOY
                    </motion.p>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col md:flex-row gap-6 mt-16 z-20">
                    <Link to="/contact">
                        <Button variant="primary" className="h-14 px-10 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(0,255,255,0.5)] transition-shadow">
                            Join the Network
                        </Button>
                    </Link>
                    <Link to="/about">
                        <Button variant="secondary" className="h-14 px-10 text-lg rounded-full border border-white/10 hover:bg-white/5 bg-transparent">
                            Explore Projects
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <FeaturesSection />

            {/* CTA Section */}
            <section className="py-20 text-center relative overflow-hidden rounded-3xl border-t border-white/10 bg-white/[0.02] backdrop-blur-sm max-w-7xl mx-auto mb-20">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5 opacity-50"></div>
                <div className="relative z-10 px-4">
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-wide">Ready to Innovate?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto font-mono">
                        Whether you're a beginner or a pro, there's a place for you in our team.
                        Let's build something amazing together.
                    </p>
                    <Link to="/contact">
                        <Button variant="secondary" className="px-8 py-4 text-lg rounded-full border border-white/20 hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all">
                            Become a Member
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
