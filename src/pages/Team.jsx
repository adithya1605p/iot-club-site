import { motion } from 'framer-motion';
import { team } from '../data/team';
import Card from '../components/ui/Card';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Team = () => {
    return (
        <div className="container mx-auto">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan neon-text"
                >
                    Meet the Team
                </motion.h1>
                <p className="text-gray-400">The brilliant minds powering the club.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                    <Card key={member.id} className="text-center group">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-cyan/30 group-hover:border-neon-cyan transition-colors duration-300">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                            <p className="text-neon-purple text-sm mb-3 font-medium">{member.role}</p>
                            <p className="text-gray-400 text-sm mb-4">{member.bio}</p>

                            <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {member.socials.github && <a href={member.socials.github} className="text-gray-400 hover:text-white"><Github size={18} /></a>}
                                {member.socials.linkedin && <a href={member.socials.linkedin} className="text-gray-400 hover:text-white"><Linkedin size={18} /></a>}
                                {member.socials.twitter && <a href={member.socials.twitter} className="text-gray-400 hover:text-white"><Twitter size={18} /></a>}
                            </div>
                        </motion.div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Team;
