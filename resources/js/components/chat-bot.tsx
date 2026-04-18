import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: number;
    role: 'bot' | 'user';
    text: string;
    timestamp: Date;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'bot',
            text: 'Halo! Saya Asisten Virtual BPMP Babel. Ada yang bisa saya bantu terkait penyewaan fasilitas kami?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now(),
            role: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsProcessing(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const botMsg: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: data.response || 'Maaf, saya sedang mengalami kendala teknis.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-poppins">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-[#1f9cd7] p-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-tight">Asisten BPMP</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-4 custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={cn(
                                        "flex w-full flex-col",
                                        msg.role === 'user' ? "items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[85%] rounded-3xl px-4 py-3 text-sm font-medium shadow-sm",
                                        msg.role === 'user' 
                                            ? "bg-[#1f9cd7] text-white rounded-tr-none" 
                                            : "bg-white text-gray-800 rounded-tl-none ring-1 ring-gray-100"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <span className="mt-1 px-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300" />
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:0.2s]" />
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="border-t border-gray-100 bg-white p-4">
                            <div className="relative flex items-center">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Tulis pesan..."
                                    className="h-12 w-full rounded-2xl border-none bg-gray-50 pl-4 pr-12 text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-[#1f9cd7]"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f9cd7] text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300",
                    isOpen ? "bg-rose-500 rotate-90" : "bg-[#1f9cd7] hover:bg-[#1785b7]"
                )}
            >
                {isOpen ? <X className="h-8 w-8" /> : (
                    <div className="relative">
                        <MessageCircle className="h-8 w-8" />
                        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                            <Sparkles className="h-2.5 w-2.5 text-white" />
                        </div>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
