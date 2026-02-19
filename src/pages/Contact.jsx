import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Mail, UserPlus } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        year: '',
        branch: '',
        email: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const branches = [
        'Computer Science',
        'AI ML',
        'CS',
        'DS',
        'Civil',
        'Mechanical',
        'ECE',
        'EEE'
    ];

    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        console.log("Registration Data:", formData);
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', rollNo: '', year: '', branch: '', email: '' });
        }, 1500);
    };

    return (
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-cyan neon-text mb-4">Join The Club</h1>
                <p className="text-gray-400">Register now to become an official member of the IoT Club.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {/* Info Side */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-neon-cyan/10 rounded-full text-neon-cyan">
                            <Mail />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Email Us</h3>
                            <p className="text-gray-400 text-sm">contact@iotclub.com</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-neon-purple/20 to-transparent border-neon-purple/30">
                        <div className="mb-4 text-neon-purple">
                            <UserPlus size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Why Join?</h3>
                        <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                            <li>Access to Hardware Lab</li>
                            <li>Weekly Workshops</li>
                            <li>Hackathon Team Finding</li>
                            <li>Networking with Seniors</li>
                        </ul>
                    </Card>
                </div>

                {/* Registration Form */}
                <div className="md:col-span-2">
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors placeholder:text-gray-600"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors placeholder:text-gray-600"
                                        placeholder="21XX1A05XX"
                                        value={formData.rollNo}
                                        onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                                    <select
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    >
                                        <option value="" disabled>Select Year</option>
                                        {years.map(y => <option key={y} value={y} className="bg-surface text-white">{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                                    <select
                                        required
                                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                        value={formData.branch}
                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                    >
                                        <option value="" disabled>Select Branch</option>
                                        {branches.map(b => <option key={b} value={b} className="bg-surface text-white">{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-cyan focus:outline-none transition-colors placeholder:text-gray-600"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 text-lg"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Registering...' : 'Register Member'}
                            </Button>

                            {status === 'success' && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center animate-pulse">
                                    Registration Successful! Welcome to the club.
                                </div>
                            )}
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default Contact;
