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
            title: "Hardware Lab Access",
            description:
                "Get hands-on experience with Arduino, Raspberry Pi, ESP32, and advanced sensors in our dedicated lab.",
            icon: <IconCpu />,
        },
        {
            title: "Coding Workshops",
            description:
                "Weekly sessions on Python, C++, and Embedded Systems programming to level up your skills.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Project Support",
            description:
                "Full mentorship and funding support for innovative IoT projects. From idea to prototype.",
            icon: <IconTools />,
        },
        {
            title: "Vibrant Community",
            description: "Join a network of 500+ tech enthusiasts, seniors, and alumni who share your passion.",
            icon: <IconUsers />,
        },
        {
            title: "Campus Integration",
            description: "Build smart solutions for GCET campus. We turn our college into a smart city.",
            icon: <IconSchool />,
        },
        {
            title: "Hackathon Winning Teams",
            description:
                "We form and train teams that consistently win national Smart India Hackathons.",
            icon: <IconTrophy />,
        },
        {
            title: "Innovation Hub",
            description:
                "A space where crazy ideas are encouraged. If you can dream it, we help you build it.",
            icon: <IconBulb />,
        },
        {
            title: "Career Launchpad",
            description: "Our members get exclusive internship opportunities and portfolio building guidance.",
            icon: <IconRocket />,
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
