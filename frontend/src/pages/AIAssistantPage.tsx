import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'bot', text: 'Hello! I am your AI learning companion. How can I help you master new skills today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's a fascinating perspective! Let's explore the conceptual core of that idea in a simpler way...",
                "Excellent question. Based on your current learning path, you might find specific modules in 'Neural Networks' very relevant.",
                "I've updated your progress profile. You're showing strong analytical growth. What shall we focus on next?",
                "I can simplify that for you: think of this concept like a multi-layered ecosystem where each node supports the other.",
                "I've generated a custom reading list for that topic. Would you like me to add it to your assignments?"
            ];

            const botResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: responses[Math.floor(Math.random() * responses.length)]
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div style={{ height: 'calc(100vh - var(--header-height) - 4rem)', display: 'flex', flexDirection: 'column' }}>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
            >
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }} className="text-gradient">AI Learning Assistant</h1>
                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} /> Your personalized holographic 24/7 mentor.
                </p>
            </motion.div>

            <motion.div 
                layout
                className="glass-panel" 
                style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflow: 'hidden', 
                    padding: 0,
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                }}
            >
                {/* Chat History Area */}
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '2.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '2rem',
                    background: 'radial-gradient(circle at 0px 0px, var(--color-primary) 0%, transparent 15%)'
                }}>
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 10 }}
                                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                                style={{
                                    display: 'flex',
                                    gap: '1.25rem',
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                    maxWidth: '75%',
                                    perspective: '1000px'
                                }}
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    style={{
                                        width: '42px', height: '42px', borderRadius: '12px',
                                        background: msg.sender === 'bot'
                                            ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                                            : 'var(--glass-bg)',
                                        color: msg.sender === 'bot' ? 'white' : 'var(--text-main)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, 
                                        boxShadow: msg.sender === 'bot' 
                                            ? '0 8px 16px rgba(139, 92, 246, 0.3)' 
                                            : 'var(--glass-shadow)',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                    {msg.sender === 'bot' ? <Bot size={22} /> : <User size={22} />}
                                </motion.div>
                                <div style={{
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '20px',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    background: msg.sender === 'user' 
                                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' 
                                        : 'var(--glass-bg)',
                                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                    borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                    boxShadow: msg.sender === 'user' ? '0 10px 20px rgba(139, 92, 246, 0.2)' : 'var(--glass-shadow)',
                                    border: '1px solid var(--glass-border)',
                                    backdropFilter: msg.sender === 'bot' ? 'blur(10px)' : 'none'
                                }}>
                                    <p>{msg.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}
                            >
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
                                }}>
                                    <Bot size={22} />
                                </div>
                                <div style={{
                                    padding: '1.25rem 1.75rem', borderRadius: '20px', background: 'var(--glass-bg)',
                                    borderTopLeftRadius: '4px', border: '1px solid var(--glass-border)',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Input Area */}
                <motion.div 
                    layout
                    style={{ 
                        padding: '1.5rem 2.5rem 2.5rem', 
                        borderTop: '1px solid var(--glass-border)', 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        backdropFilter: 'blur(20px)' 
                    }}
                >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Request an explanation or study plan..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="chat-input"
                            style={{
                                flex: 1, padding: '1.25rem 1.75rem', borderRadius: '16px', border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.03)', fontSize: '1rem', outline: 'none', color: 'var(--text-main)',
                                transition: 'all 0.3s ease',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                        <motion.button
                            onClick={handleSend}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--color-primary)' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'var(--color-primary)', color: 'white', width: '56px', height: '56px',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s ease',
                                border: 'none', cursor: 'pointer'
                            }}
                        >
                            <Send size={24} style={{ marginLeft: '2px' }} />
                        </motion.button>
                        
                        <style>{`
                            .chat-input:focus {
                                border-color: var(--color-primary) !important;
                                background: rgba(255, 255, 255, 0.06) !important;
                                box-shadow: 0 0 15px rgba(139, 92, 246, 0.15) !important;
                            }
                        `}</style>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
