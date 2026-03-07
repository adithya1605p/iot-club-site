import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { supabase } from '../lib/supabaseClient';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (!data) {
                    navigate('/learn');
                } else {
                    // Map Supabase fields to the component's expected fields
                    setPost({
                        ...data,
                        readTime: "5 min read", // You could calculate this based on length
                        date: new Date(data.published_at).toLocaleDateString(),
                        image: data.image_url
                    });
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                navigate('/learn');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4 flex items-center justify-center">
                <Loader2 className="animate-spin text-neon-cyan" size={48} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4 flex flex-col items-center justify-center text-white font-mono">
                <h1 className="text-4xl font-black text-red-500 mb-4">404 - Post Not Found</h1>
                <p className="text-gray-400 mb-8 font-mono">The transmission you are looking for does not exist.</p>
                <Link to="/learn" className="px-6 py-3 bg-white/10 hover:bg-neon-cyan/20 border border-white/20 hover:border-neon-cyan/50 rounded-xl font-bold font-mono tracking-widest text-white transition-all">
                    RETURN TO HUB
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-dark-bg">
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[100px]"></div>
                <div className="absolute overflow-hidden w-full h-full">
                    <div className="w-full h-full [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:100px_100px] [background-position:center_center]"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/learn')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-8 font-mono text-sm tracking-wider uppercase"
                >
                    <div className="p-2 rounded-full border border-gray-700 group-hover:border-neon-cyan bg-black/50">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Learning Hub
                </button>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header Image */}
                    <div className="w-full h-64 md:h-96 relative bg-gradient-to-br from-black to-gray-900 border-b border-white/10">
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-neon-cyan/20">
                                    {post.category}
                                </span>
                                <span className="text-gray-300 bg-white/5 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 border border-white/10">
                                    <Clock size={12} /> {post.readTime}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                {post.title}
                            </h1>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="flex items-center justify-between px-8 md:px-12 py-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-[2px]">
                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white">
                                    <User size={18} />
                                </div>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm tracking-wide">{post.author}</p>
                                <p className="text-gray-400 text-xs font-mono flex items-center gap-1">
                                    <Calendar size={12} /> {post.date}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 md:p-12">
                        <div className={`prose prose-invert prose-lg max-w-none
prose-headings:font-black prose-headings:tracking-tight
prose-h1:text-white prose-h1:mb-6
prose-h2:text-neon-cyan prose-h2:mt-10 prose-h2:mb-4
prose-h3:text-gray-200
prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
prose-a:text-neon-purple prose-a:no-underline hover:prose-a:underline
prose-strong:text-white
prose-ul:text-gray-300 prose-ul:list-disc
prose-li:my-2
prose-blockquote:border-l-neon-cyan prose-blockquote:bg-neon-cyan/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-300 prose-blockquote:font-normal prose-blockquote:not-italic`}
                        >
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
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.article>
            </div>
        </div>
    );
};

export default BlogPost;
