import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Save, Image as ImageIcon, Code, Eye, Edit3, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogEditor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [imageUrl, setImageUrl] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            setErrorMsg("Title and content are required.");
            return;
        }

        setIsSaving(true);
        setErrorMsg(null);

        try {
            // First get the user's profile to get their display name
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();

            const authorName = profile?.display_name || user.email.split('@')[0];

            const { error } = await supabase
                .from('blogs')
                .insert([
                    {
                        title,
                        content,
                        category,
                        image_url: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
                        author: authorName,
                    }
                ]);

            if (error) throw error;

            alert("Blog published successfully!");
            navigate('/learn'); // Redirect to Learning Hub
        } catch (error) {
            console.error("Error saving blog:", error);
            setErrorMsg("Failed to save blog: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const insertTemplate = (type) => {
        let template = '';
        if (type === 'image') template = '![Alt Text](https://link-to-image.jpg)\n';
        if (type === 'code') template = '```javascript\n// Your code here\n```\n';
        if (type === '3d') template = '<model-viewer src="https://link-to-model.glb" auto-rotate camera-controls style="width: 100%; height: 400px;"></model-viewer>\n';

        setContent(prev => prev + template);
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden mt-8 text-left">
            {/* Toolbar */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => insertTemplate('image')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded hover:bg-white/10 text-gray-300 text-sm font-mono transition-colors"
                    >
                        <ImageIcon size={14} /> Add Image
                    </button>
                    <button
                        onClick={() => insertTemplate('code')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-white/10 rounded hover:bg-white/10 text-gray-300 text-sm font-mono transition-colors"
                    >
                        <Code size={14} /> Add Code
                    </button>
                    <button
                        onClick={() => insertTemplate('3d')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 border border-neon-purple/30 rounded hover:bg-neon-purple/40 text-neon-purple text-sm font-mono font-bold transition-colors"
                    >
                        ✨ Add 3D Model
                    </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 border rounded font-mono text-sm transition-colors ${isPreview ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'border-white/20 text-white hover:bg-white/10'}`}
                    >
                        {isPreview ? <><Edit3 size={16} /> Edit Mode</> : <><Eye size={16} /> Preview Mode</>}
                    </button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving} className="flex flex-1 md:flex-none justify-center items-center gap-2">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Publish
                    </Button>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-500/10 border-b border-red-500/30 text-red-400 text-sm font-mono">
                    ⚠️ {errorMsg}
                </div>
            )}

            {/* Editor Area */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Left: Inputs & Markdown */}
                <div className={`flex flex-col gap-4 h-full ${isPreview && 'hidden lg:flex'}`}>
                    <input
                        type="text"
                        placeholder="Blog Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-xl font-bold focus:border-neon-cyan focus:outline-none transition-colors"
                    />
                    <div className="flex gap-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-neon-cyan focus:outline-none w-1/3"
                        >
                            <option value="Technology">Technology</option>
                            <option value="IoT Projects">IoT Projects</option>
                            <option value="Tutorial">Tutorial</option>
                            <option value="Club Update">Club Update</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Cover Image URL (Optional)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-2/3 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                        />
                    </div>

                    <textarea
                        placeholder="Write your markdown here... Use standard Markdown syntax."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-4 text-gray-300 font-mono text-sm focus:border-neon-purple focus:outline-none transition-colors resize-none"
                    ></textarea>
                </div>

                {/* Right: Live Preview */}
                <div className={`h-full overflow-y-auto bg-black/80 border border-white/5 rounded-lg p-6 ${!isPreview && 'hidden lg:block'}`}>
                    <div className="prose prose-invert prose-lg max-w-none prose-neon">
                        {imageUrl && <img src={imageUrl} alt="Cover" className="w-full h-48 object-cover rounded-xl mb-6 border border-white/10" />}
                        <h1 className="text-3xl font-black text-white mb-2">{title || 'Blog Title Preview'}</h1>
                        <div className="text-neon-cyan font-mono text-xs uppercase tracking-widest mb-8 pb-4 border-b border-white/10">
                            {category} • By You • Just Now
                        </div>

                        {content ? (
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        if (!inline && match) {
                                            return (
                                                <SyntaxHighlighter
                                                    {...props}
                                                    children={String(children).replace(/\n$/, '')}
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{ background: '#0d1117', padding: '1.5rem', margin: '1.5rem 0' }}
                                                    className="rounded-xl border border-white/10 !bg-[#0d1117]"
                                                />
                                            );
                                        }
                                        return (
                                            <code {...props} className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-neon-cyan font-mono text-sm`}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    img: ({ node, ...props }) => <img {...props} className="rounded-xl border border-white/10 my-4" style={{ maxWidth: '100%' }} />
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-gray-600 font-mono italic">Live preview will appear here...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
