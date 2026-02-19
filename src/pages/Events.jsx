import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

const Events = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Helper to generate image paths
    const getImages = (prefix, count, ext = 'jpeg') =>
        Array.from({ length: count }, (_, i) => `/events/${prefix}_${i + 1}.${ext}`);

    const events = [
        {
            id: 1,
            title: "BID2BUILD IDEATHON",
            date: "22nd - 23rd August",
            time: "2 Days Event",
            location: "GCET Campus",
            image: "/events/bid2build_1.jpeg",
            category: "Ideathon",
            desc: "A flagship technical event where students bid for problem statements and built innovative solutions. Themes included Open Innovation, Agritech, Edutech, and Health Care. Over ₹16,000 in prizes were awarded to the top teams.",
            status: "Completed",
            gallery: getImages('bid2build', 7, 'jpeg').map(img => img.replace('.jpeg', '.jpeg')) // Simple mapping, some might be png but extract script mostly did jpeg
        },
        {
            id: 2,
            title: "IoT Verse 2k23",
            date: "14th - 15th Dec 2023",
            time: "2 Days Event",
            location: "GCET Campus",
            image: "/events/iotverse_1.png",
            category: "Flagship Event",
            desc: "A two-day mega event featuring expert guest lectures by Mr. Bharadwaj Arvapally, Project Exhibitions, Idea Pitching, and Quiz competitions. Students explored domains like Healthcare, Smart Education, and Smart Agriculture.",
            status: "Completed",
            gallery: [
                '/events/iotverse_1.png',
                '/events/iotverse_2.jpeg',
                '/events/iotverse_3.png',
                '/events/iotverse_4.jpeg',
                '/events/iotverse_5.jpeg',
                '/events/iotverse_6.jpeg',
                '/events/iotverse_7.jpeg',
                '/events/iotverse_8.jpeg',
                '/events/iotverse_10.jpeg',
                '/events/iotverse_11.jpeg',
                '/events/iotverse_16.jpeg'
            ]
        },
        {
            id: 3,
            title: "Technophilia 2k22",
            date: "2nd - 3rd Dec 2022",
            time: "2 Days Event",
            location: "Block 4 & 5, GCET",
            image: "/events/technophilia_1.jpeg",
            category: "Workshop & Hackathon",
            desc: "A hands-on workshop and hackathon for 2nd and 3rd-year students. Featured sessions on IoT basics, Arduino programming, Tinkercad simulation, and a project building competition. Guest lecture by Mr. Seshu Kumar (Wipro).",
            status: "Completed",
            gallery: getImages('technophilia', 10, 'jpeg')
        }
    ];

    return (
        <div className="container mx-auto">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple neon-text"
                >
                    Events & Workshops
                </motion.h1>
                <p className="text-gray-400">Explore our journey of learning and innovation.</p>
            </div>

            <div className="grid gap-12 max-w-6xl mx-auto">
                {events.map((event, index) => (
                    <Card key={event.id} className="flex flex-col gap-6 overflow-hidden border-white/5 bg-surface/40 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full md:w-2/5 h-64 md:h-80 overflow-hidden rounded-xl shrink-0 relative cursor-pointer group shadow-2xl shadow-neon-purple/10"
                                onClick={() => event.gallery && setSelectedImage(event.image)}
                            >
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                                    {event.status}
                                </div>
                                {event.gallery && (
                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 flex items-center gap-2">
                                        <span>📷 {event.gallery.length} Photos</span>
                                    </div>
                                )}
                            </motion.div>

                            <div className="flex flex-col justify-center flex-grow py-2 px-2 md:px-0">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-bold tracking-wider uppercase border border-neon-cyan/20">{event.category}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{event.title}</h3>

                                <p className="text-gray-300 mb-6 text-base leading-relaxed h-full">
                                    {event.desc}
                                </p>

                                <div className="grid grid-cols-2 gap-y-3 mb-6 text-gray-400 text-sm border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-neon-purple" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-neon-purple" />
                                        <span>{event.time}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-2 col-span-2">
                                        <MapPin size={16} className="text-neon-purple" />
                                        <span>{event.location}</span>
                                    </div> */}
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-neon-purple" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    <Button variant="outline" className="text-sm px-6 w-full md:w-auto hover:bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mini Gallery Strip */}
                        {event.gallery && event.gallery.length > 0 && (
                            <div className="border-t border-white/5 pt-4">
                                <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold px-1">Event Gallery</p>
                                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth">
                                    {event.gallery.map((img, i) => (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            key={i}
                                            className="shrink-0 relative group"
                                        >
                                            <img
                                                src={img}
                                                alt={`Gallery ${i}`}
                                                className="h-24 w-36 object-cover rounded-lg cursor-pointer border border-white/5 group-hover:border-neon-cyan/50 transition-colors shadow-lg"
                                                onClick={() => setSelectedImage(img)}
                                                onError={(e) => { e.target.style.display = 'none' }} // Hide broken images if extensions mismatch
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-red-500/20 hover:text-red-500">
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedImage}
                            alt="Full view"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Events;
