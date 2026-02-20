import { cn } from "../lib/utils";
import {
    IconCpu,
    IconTerminal2,
    IconTools,
    IconUsers,
    IconSchool,
    IconTrophy,
    IconRocket,
    IconBulb,
} from "@tabler/icons-react";

export default function FeaturesSection() {
    const features = [
        {
            title: "Hands-on Workshops",
            description:
                "Learn IoT basics, Arduino programming, and Tinkercad simulation through practical sessions.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Project Exhibitions",
            description:
                "Showcase your innovative ideas in domains like Healthcare, Smart Agriculture, and Edutech.",
            icon: <IconBulb />,
        },
        {
            title: "Ideathons & Hackathons",
            description:
                "Compete in flagship events like BID2BUILD to solve real-world problems and win prizes.",
            icon: <IconTrophy />,
        },
        {
            title: "Expert Guest Lectures",
            description: "Gain insights from industry professionals and experienced developers to guide your tech journey.",
            icon: <IconSchool />,
        },
        {
            title: "Idea Pitching",
            description: "Develop your presentation skills by pitching your smart solutions to peers and mentors.",
            icon: <IconRocket />,
        },
        {
            title: "Hardware Basics",
            description:
                "Get started with microcontrollers and sensors to build your very first working prototypes.",
            icon: <IconCpu />,
        },
        {
            title: "Collaborative Learning",
            description:
                "Join a passionate group of students dedicated to exploring the Internet of Things together.",
            icon: <IconUsers />,
        },
        {
            title: "Tech Competitions",
            description: "Test your knowledge and skills in technical quizzes and project building challenges.",
            icon: <IconTools />,
        },
    ];

    return (
        <div className="py-16 md:py-20 max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-12 md:mb-20 text-center">
                <span className="text-neon-cyan text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 block">Capabilities</span>
                <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    ENGINEERING THE FUTURE
                </h2>
                <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}

const Feature = ({ title, description, icon, index }) => {
    return (
        <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-neon-cyan/30 transition-all duration-300 overflow-hidden">
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
                <div className="w-12 h-12 mb-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
};
