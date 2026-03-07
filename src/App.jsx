import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import KonamiCode from './components/KonamiCode';
import PhotoAdjust from './pages/PhotoAdjust';
// Learning hub pages
import LearningHub from './pages/LearningHub';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import DynamicRegistration from './pages/DynamicRegistration';
import HardwareVault from './pages/HardwareVault';
import Leaderboard from './pages/Leaderboard';
import TelemetryDashboard from './pages/TelemetryDashboard';
import Projects from './pages/Projects';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-cyan selection:text-black">
        <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-30"></div>
        <KonamiCode />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:slug" element={<DynamicRegistration />} />
          <Route path="/learn" element={<LearningHub />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/vault" element={<HardwareVault />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/telemetry" element={<TelemetryDashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/photo-adjust" element={<PhotoAdjust />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
