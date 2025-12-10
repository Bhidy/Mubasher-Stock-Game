import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, TrendingUp, HelpCircle, BarChart2, Brain } from 'lucide-react';
import { UserContext } from '../App';

// Typing indicator component
const TypingIndicator = () => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        padding: '12px 16px', background: 'white', borderRadius: '18px 18px 18px 4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', width: 'fit-content'
    }}>
        <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#10b981', animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
                }} />
            ))}
        </div>
        <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '0.75rem' }}>AI is thinking...</span>
    </div>
);

// Mini Stock Widget for Chat
const StockWidget = ({ symbol }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await fetch(`/api/stock-profile?symbol=${symbol}`);
                if (res.ok) setData(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchStock();
    }, [symbol]);

    if (!data) return null;

    const isPositive = (data.change || 0) >= 0;

    return (
        <div style={{
            marginTop: '10px',
            padding: '12px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <img
                src={data.logoUrl || `https://ui-avatars.com/api/?name=${data.symbol}&background=random`}
                alt={data.symbol}
                style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{data.symbol}</span>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{data.price?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>{data.shortName || data.longName}</span>
                    <span style={{ color: isPositive ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {data.change?.toFixed(2)} ({data.changePercent?.toFixed(2)}%)
                    </span>
                </div>
            </div>
        </div>
    );
};

// Message component with markdown-like formatting
const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    // Simple markdown-like formatting
    const formatText = (text) => {
        if (!text) return '';
        // Bold text: **text**
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br/>');
        return formatted;
    };

    return (
        <div style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            {/* Sender Name */}
            <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '4px',
                marginLeft: !isUser ? '4px' : '0',
                marginRight: !isUser ? '0' : '4px',
                textAlign: !isUser ? 'left' : 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: !isUser ? 'flex-start' : 'flex-end',
                gap: '6px'
            }}>
                {!isUser && <Sparkles size={12} color="#10b981" />}
                {!isUser ? 'Hero Ai' : 'You'}
                <span style={{ opacity: 0.6 }}>• {message.time}</span>
            </div>

            <div style={{
                padding: '0.875rem 1.125rem',
                borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: isUser ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'white',
                color: isUser ? 'white' : '#1e293b',
                boxShadow: isUser ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                lineHeight: '1.6',
                border: isUser ? 'none' : '1px solid #e2e8f0',
                position: 'relative'
            }}>
                <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />

                {/* Live Data Badge */}
                {!isUser && message.hasRealData && (
                    <div style={{
                        marginTop: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        color: '#059669',
                        fontWeight: 600,
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', animation: 'pulse 2s infinite' }} />
                        Live Market Context
                    </div>
                )}
                <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>
                    {isUser ? 'You' : 'Mubasher AI'} • {message.time || 'Just now'}
                </span>
            </div>
        </div>
    );
};

export default function Chatbot() {
    const { showChat, setShowChat } = useContext(UserContext);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 I'm **Hero Ai**, your intelligent stock market assistant.\n\nI can help you with:\n• Real-time stock analysis\n• Market trends & news\n• Investment advice\n• Portfolio strategies\n\nWhat would you like to know?",
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasRealData: false
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        { text: "Analyze Aramco", icon: BarChart2 },
        { text: "What's trending today?", icon: TrendingUp },
        { text: "Best dividend stocks?", icon: Sparkles },
        { text: "Market outlook 2024", icon: HelpCircle }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare conversation history (last 10 messages)
            const conversationHistory = messages.slice(-10).map(m => ({
                text: m.text,
                sender: m.sender
            }));

            // Call AI API
            const baseUrl = import.meta.env.DEV ? 'http://localhost:5001' : '';
            const response = await fetch(`${baseUrl}/api/chatbot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    conversationHistory
                })
            });

            const data = await response.json();

            if (data.success && data.response) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    hasRealData: data.hasRealData,
                    stocksAnalyzed: data.stocksAnalyzed
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "I apologize, I'm having trouble connecting. Please try again in a moment. In the meantime, check the Market Summary for live data! 📊",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                hasRealData: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <>
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>

            {/* Floating Icon */}
            <button
                onClick={() => setShowChat(!showChat)}
                style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height) + 1.5rem)',
                    right: '1.5rem',
                    width: '48px', // Smaller size
                    height: '48px', // Smaller size
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    cursor: 'pointer',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: showChat ? 'scale(0)' : 'scale(1)'
                }}
            >
                <Brain size={20} color="white" />
            </button>

            {/* Chat Window - Only render when visible to prevent click interference */}
            {showChat && (
                <div style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height) + 1rem)',
                    right: '1rem',
                    width: 'min(380px, calc(100vw - 2rem))',
                    height: 'min(560px, calc(100vh - var(--nav-height) - 3rem))',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 100,
                    overflow: 'hidden',
                    animation: 'chatSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    border: '1px solid rgba(0,0,0,0.08)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem 1.25rem',
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', right: -20, top: -20,
                            width: 100, height: 100, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)'
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '14px',
                                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}>
                                <Brain size={22} color="white" />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '2px' }}>Hero Ai</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
                                    }} />
                                    <p style={{ fontSize: '0.7rem', opacity: 0.9 }}>Online • Powered by Groq</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowChat(false)}
                            style={{
                                background: 'rgba(255,255,255,0.1)', border: 'none',
                                width: 36, height: 36, borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'white', zIndex: 1
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1.25rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
                    }}>
                        {messages.map(msg => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderTop: '1px solid #e2e8f0'
                    }}>
                        {/* Suggested Questions */}
                        {messages.length <= 2 && !isLoading && (
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                overflowX: 'auto',
                                paddingBottom: '12px',
                                scrollbarWidth: 'none'
                            }}>
                                {suggestedQuestions.map((q, i) => {
                                    const Icon = q.icon;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q.text)}
                                            style={{
                                                padding: '8px 14px',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                background: 'white',
                                                color: '#475569',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = '#10b981';
                                                e.currentTarget.style.background = '#f0fdf4';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.background = 'white';
                                            }}
                                        >
                                            <Icon size={14} color="#10b981" />
                                            {q.text}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={isLoading ? "AI is thinking..." : "Ask about any stock..."}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '14px 18px',
                                    borderRadius: '16px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '0.9375rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    background: isLoading ? '#f8fafc' : 'white'
                                }}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '16px',
                                    background: isLoading || !input.trim()
                                        ? '#e2e8f0'
                                        : 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                                    color: 'white',
                                    boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isLoading ? (
                                    <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Send size={22} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes chatSlideIn {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </>
    );
}
