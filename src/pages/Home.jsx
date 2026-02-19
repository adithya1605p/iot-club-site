import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 relative"
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-neon-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.2)] mx-auto">
                        <img src="/src/assets/logo.jpg" alt="IoT Club Logo" className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6 px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm font-medium"
                >
                    🚀 Geethanjali College of Engineering and Technology
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple neon-text"
                >
                    IoT Club GCET <br /> <span className="text-3xl md:text-5xl text-white block mt-4">Innovate. Build. Inspire.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                >
                    The official community of makers and innovators at GCET.
                    We bridge the gap between hardware and software to build the future.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <Link to="/contact">
                        <Button variant="primary">Join Our Club <ArrowRight size={18} /></Button>
                    </Link>
                </motion.div>
            </section>

            {/* Features/Stats Section */}
            <section className="py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Cpu size={32} />, title: "Embedded Systems", desc: "Master hardware control." },
                        { icon: <Zap size={32} />, title: "Fast Prototyping", desc: "From idea to MVP in days." },
                        { icon: <Globe size={32} />, title: "Connected World", desc: "IoT solutions for smart cities." }
                    ].map((feature, i) => (
                        <Card key={i} className="text-center hover:bg-white/5 transition-colors">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-white">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center relative overflow-hidden rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 opacity-20"></div>
                <div className="relative z-10 px-4">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Innovate?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Whether you're a beginner or a pro, there's a place for you in our team.
                        Let's build something amazing together.
                    </p>
                    <Link to="/contact">
                        <Button variant="secondary" className="px-8 py-4 text-lg">
                            Become a Member
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
