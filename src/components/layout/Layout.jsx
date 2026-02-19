import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden text-gray-200 font-sans selection:bg-neon-cyan/30 selection:text-white">
            {/* Background effects */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute inset-0 bg-background"></div>
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-neon-purple/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-cyan/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse"></div>
            </div>

            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 pt-24 relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
