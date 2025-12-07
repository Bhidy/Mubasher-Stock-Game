import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { UserContext } from '../App';

export default function Chatbot() {
    const { showChat, setShowChat } = useContext(UserContext);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello Mohamed! I'm your AI assistant. How can I help you with Saudi stocks today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const predefinedQuestions = [
        "What are the top safe stocks?",
        "Analyze Saudi Aramco",
        "Is Al Rajhi a good buy?",
        "Show me trending stocks"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        const userMessage = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            let responseText = "That's an interesting question about the Saudi market. Based on current trends, ";
            if (text.toLowerCase().includes('safe')) {
                responseText += "blue-chip stocks like Saudi Aramco and Al Rajhi Bank are considered safe bets due to their stability and dividends.";
            } else if (text.toLowerCase().includes('aramco')) {
                responseText += "Saudi Aramco (2222) is showing strong fundamentals with stable oil prices. It's a solid long-term hold.";
            } else if (text.toLowerCase().includes('rajhi')) {
                responseText += "Al Rajhi Bank (1120) is leading the banking sector. Technical indicators suggest a bullish trend.";
            } else if (text.toLowerCase().includes('trending')) {
                responseText += "Currently, ACWA Power and STC are trending due to recent project announcements.";
            } else {
                responseText += "I recommend diversifying your portfolio across banking and energy sectors for balanced growth.";
            }

            const botMessage = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Icon */}
            <button
                onClick={() => setShowChat(!showChat)}
                style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height) + 1.5rem)', // Above bottom nav
                    right: '1.5rem',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: showChat ? 'scale(0)' : 'scale(1)'
                }}
                className="animate-bounce-subtle"
            >
                <Bot size={24} color="white" />
            </button>

            {/* Chat Popup */}
            <div style={{
                position: 'fixed',
                bottom: 'calc(var(--nav-height) + 1.5rem)',
                right: '1.5rem',
                width: '350px',
                height: '500px',
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: showChat ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                opacity: showChat ? 1 : 0,
                pointerEvents: showChat ? 'auto' : 'none',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.5rem',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'white'
                }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.5rem',
                            borderRadius: '12px'
                        }}>
                            <Bot size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.125rem' }}>Mubasher AI</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online & Ready to Help</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', opacity: 0.8 }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    padding: '1.5rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    background: '#f8fafc'
                }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                                fontSize: '0.9375rem',
                                lineHeight: 1.5
                            }}>
                                {msg.text}
                            </div>
                            <span style={{
                                fontSize: '0.625rem',
                                color: '#94a3b8',
                                marginTop: '0.25rem',
                                marginLeft: '0.5rem',
                                marginRight: '0.5rem'
                            }}>
                                {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                    {/* Predefined Questions */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '0.75rem',
                        marginBottom: '0.5rem',
                        scrollbarWidth: 'none'
                    }}>
                        {predefinedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(q)}
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '9999px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.color = 'var(--text-secondary)';
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                            placeholder="Ask about any stock..."
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '9999px',
                                border: '2px solid #e2e8f0',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <button
                            onClick={() => handleSend(input)}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
