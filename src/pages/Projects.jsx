import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'IoT', 'Robotics', 'AI', 'Embedded', 'Hardwrae'];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.tags.includes(filter));

    return (
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple neon-text"
                >
                    Our Projects
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto"
                >
                    Explore the cutting-edge innovations built by our members.
                </motion.p>
            </div>

            {/* Filter Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
            >
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={filter === category ? 'primary' : 'outline'}
                        onClick={() => setFilter(category)}
                        className="capitalize"
                    >
                        {category}
                    </Button>
                ))}
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="h-full flex flex-col">
                            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-neon-cyan/30 text-neon-cyan">
                                    {project.status}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 flex-grow">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 py-12"
                >
                    No projects found in this category.
                </motion.div>
            )}
        </div>
    );
};

export default Projects;
