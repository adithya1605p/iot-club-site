import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { Target, Zap, Users, Award, BookOpen } from 'lucide-react';

const About = () => {
    return (
        <div className="container mx-auto">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-cyan neon-text"
                >
                    IoT Club GCET
                </motion.h1>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                    The official IoT Club of <strong>Geethanjali College of Engineering and Technology</strong> (UGC Autonomous).
                    <br />
                    Igniting minds to innovate in the world of Internet of Things.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <Award className="text-neon-cyan" /> Organization
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        We are a student-driven technical club at GCET (Affiliated to JNTUH, ISO 9001:2015 certified).
                        Our goal is to foster a culture of making and problem-solving using embedded systems and smart technologies.
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Faculty Coordinator</span>
                            <span className="text-white font-medium">G. Vedha Vyas</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-gray-400">Student Coordinator</span>
                            <span className="text-white font-medium">A. Lakshmi Deepak (President)</span>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6">
                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-3 text-neon-purple">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                        <p className="text-gray-400 text-sm">To provide hands-on experience in IoT, bridging the gap between theoretical knowledge and real-world industrial applications.</p>
                    </Card>
                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 text-neon-blue">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                        <p className="text-gray-400 text-sm">Empowering students to build smart solutions for societal problems using Automation, AIoT, and Robotics.</p>
                    </Card>
                </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                    <BookOpen className="text-neon-cyan" /> Learning Tracks
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Embedded Systems", desc: "Arduino, ESP32, STM32, Sensors & Actuators." },
                        { title: "Cloud IoT", desc: "AWS IoT, Azure, Blink, Firebase & Data Visualization." },
                        { title: "AIoT (AI + IoT)", desc: "Edge Computing, TinyML, Image Processing." },
                        { title: "Robotics", desc: "Bot Design, Motor Control, Autonomous Navigation." }
                    ].map((track, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-10 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full mb-3"></div>
                            <h3 className="text-lg font-bold text-white mb-2">{track.title}</h3>
                            <p className="text-gray-400 text-sm">{track.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default About;
