import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import LearningHub from './pages/LearningHub';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import DynamicRegistration from './pages/DynamicRegistration';
import KonamiCode from './components/KonamiCode';

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
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} /> {/* Closed Recruitment */}
          <Route path="/register/:slug" element={<DynamicRegistration />} />
          <Route path="/learn" element={<LearningHub />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
