import React, { useState } from 'react';
import { Shield, Users, Trophy, Sword, Target, Plus, Search, MessageCircle, Crown, Star, ChevronLeft, Gift, Zap, TrendingUp, Send } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import BurgerMenu from '../components/BurgerMenu';
import CreateClan from '../components/CreateClan';
import FindClan from '../components/FindClan';

export default function Clans() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('clans');
    const [toast, setToast] = useState(null);
    const [showCreateClan, setShowCreateClan] = useState(false);
    const [showFindClan, setShowFindClan] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [showProTip, setShowProTip] = useState(false);

    const topClans = [
        { id: 1, rank: 1, name: "Riyadh Traders", members: 48, score: "2.4M", trend: "+12%", description: "Elite traders from Riyadh" },
        { id: 2, rank: 2, name: "Jeddah Investors", members: 50, score: "2.1M", trend: "+8%", description: "Professional investors" },
        { id: 3, rank: 3, name: "Dammam Bulls", members: 42, score: "1.9M", trend: "+15%", description: "Aggressive trading strategy" },
        { id: 4, rank: 4, name: "Saudi Stocks", members: 35, score: "1.5M", trend: "-2%", description: "Focus on Saudi market" },
        { id: 5, rank: 5, name: "Mecca Elites", members: 28, score: "1.2M", trend: "+5%", description: "Premium members only" },
    ];

    const handleClanClick = (clan) => {
        navigate(`/clans/${clan.id}`);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        setToast('Message sent! 💬');
        setChatMessage('');
    };

    return (
        <div className="flex-col" style={{
            minHeight: '100dvh',
            padding: '1.5rem',
            gap: '1.5rem',
            paddingBottom: '6rem',
            background: 'var(--bg-primary)'
        }}>

            {/* Header */}
            <div className="flex-between animate-fade-in" style={{ marginTop: '0.5rem' }}>
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronLeft size={24} color="var(--text-primary)" />
                    </button>
                    <div>
                        <h1 className="h2" style={{ marginBottom: '0.25rem' }}>Clans</h1>
                        <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>Join forces. Win together.</p>
                    </div>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(220, 38, 38, 0.25)'
                    }}>
                        <Shield size={24} color="white" />
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* Clan Wars Banner */}
            <div className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
                borderRadius: '24px',
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none'
                }} />

                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                <div className="flex-between" style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <Sword size={16} color="#fca5a5" />
                        <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>WEEKLY WAR</span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', opacity: 0.9, background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
                        Ends in 2d 14h
                    </span>
                </div>

                <div className="flex-between" style={{ position: 'relative', zIndex: 1, alignItems: 'flex-end' }}>
                    <div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h2 className="h3" style={{ color: '#fca5a5', fontSize: '1rem' }}>Prize Pool</h2>
                            <button
                                onClick={() => setShowProTip(true)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <span style={{ fontSize: '1rem' }}>💡</span>
                            </button>
                        </div>
                        <div style={{
                            fontSize: '2.25rem',
                            fontWeight: 900,
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            lineHeight: 1
                        }}>
                            100,000 <span style={{ fontSize: '1.5rem' }}>🪙</span>
                        </div>
                    </div>
                    <div className="animate-float" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                        <Trophy size={56} color="#fbbf24" fill="#fbbf24" fillOpacity={0.2} />
                    </div>
                </div>
            </div>

            {/* Pro Tip Modal */}
            {showProTip && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowProTip(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            maxWidth: '400px',
                            width: '100%',
                            position: 'relative',
                            transform: 'scale(1)',
                            animation: 'fadeIn 0.2s ease-out'
                        }}
                    >
                        <button
                            onClick={() => setShowProTip(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            ✕
                        </button>

                        <div className="flex-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>💡</span>
                            </div>
                            <h3 className="h3" style={{ color: '#92400e' }}>Pro Tip</h3>
                        </div>

                        <p style={{
                            fontSize: '0.9375rem',
                            color: '#78350f',
                            lineHeight: 1.6,
                            margin: 0,
                            textAlign: 'center'
                        }}>
                            Join active clans with consistent top performers. Communication and strategy are key to winning the weekly wars!
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons - Single Row */}
            <div className="animate-slide-up" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                animationDelay: '0.1s'
            }}>
                <Button
                    onClick={() => setShowCreateClan(true)}
                    variant="primary"
                    style={{
                        height: '3.5rem',
                        background: 'var(--text-primary)',
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Plus size={20} /> Create
                </Button>
                <Button
                    onClick={() => setShowFindClan(true)}
                    variant="outline"
                    style={{
                        height: '3.5rem',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Search size={20} /> Find Clan
                </Button>
            </div>

            {/* Tabs */}
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div style={{
                    background: '#f1f5f9',
                    padding: '0.375rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    border: '2px solid #e2e8f0'
                }}>
                    {['clans', 'chat'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '0.625rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                background: activeTab === tab ? 'white' : 'transparent',
                                color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                                boxShadow: activeTab === tab ? 'var(--shadow-md)' : 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            {tab === 'clans' ? 'Top Clans' : 'Clan Chat'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Clans Tab */}
            {activeTab === 'clans' && (
                <div className="flex-col animate-slide-up" style={{ gap: '1rem', animationDelay: '0.2s' }}>
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        {topClans.map((clan) => (
                            <div
                                key={clan.id}
                                onClick={() => handleClanClick(clan)}
                                style={{
                                    padding: '1rem',
                                    background: 'white',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div className="flex-center" style={{ gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: clan.rank === 1 ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' :
                                            clan.rank === 2 ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' :
                                                clan.rank === 3 ? 'linear-gradient(135deg, #b45309 0%, #78350f 100%)' : '#f1f5f9',
                                        color: clan.rank <= 3 ? 'white' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        boxShadow: clan.rank <= 3 ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
                                    }}>
                                        {clan.rank <= 3 ? <Crown size={20} fill="currentColor" /> : `#${clan.rank}`}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{clan.name}</div>
                                        <div className="flex-center" style={{ gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            <span className="flex-center" style={{ gap: '0.25rem' }}>
                                                <Users size={12} /> {clan.members}/50
                                            </span>
                                            <span style={{
                                                color: clan.trend.includes('+') ? 'var(--success)' : 'var(--danger)',
                                                background: clan.trend.includes('+') ? '#dcfce7' : '#fee2e2',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontWeight: 600
                                            }}>
                                                {clan.trend}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{clan.score}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Clan Chat Tab */}
            {activeTab === 'chat' && (
                <div className="animate-slide-up" style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: '0.2s'
                }}>
                    <div className="flex-between" style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                        <div className="flex-center" style={{ gap: '0.75rem' }}>
                            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)' }}>
                                <MessageCircle size={20} color="#2563eb" />
                            </div>
                            <h3 className="h3" style={{ color: '#1e40af' }}>Clan Chat</h3>
                        </div>
                        <Badge style={{ background: '#2563eb', color: 'white', border: 'none' }}>LIVE</Badge>
                    </div>

                    <div className="flex-col" style={{ gap: '0.75rem', position: 'relative', zIndex: 1, marginBottom: '1rem' }}>
                        <ChatMessage user="Faisal" text="Just bought ARAMCO! 🚀" time="2m" color="#3b82f6" />
                        <ChatMessage user="Noura" text="Nice! I'm holding SABIC." time="1m" color="#ec4899" />
                        <ChatMessage user="Salem" text="We need 5k more points!" time="Now" color="#10b981" />
                    </div>

                    {/* Chat Input */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-full)',
                        border: '2px solid #e2e8f0'
                    }}>
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Join a clan to chat..."
                            disabled
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '0.875rem',
                                background: 'transparent',
                                color: '#94a3b8'
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled
                            style={{
                                background: '#e2e8f0',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'not-allowed'
                            }}
                        >
                            <Send size={18} color="#94a3b8" />
                        </button>
                    </div>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginTop: '1rem',
                        fontWeight: 600
                    }}>
                        Join a clan to start chatting with members
                    </p>
                </div>
            )}

            {/* How to Win Section - Only on Clans Tab */}
            {activeTab === 'clans' && (
                <Card className="animate-slide-up" style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                    border: '2px solid #f59e0b',
                    animationDelay: '0.25s'
                }}>
                    <div className="flex-center" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            background: 'white',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                        }}>
                            <Gift size={24} color="#f59e0b" />
                        </div>
                        <h3 className="h3" style={{ color: '#92400e' }}>How to Win</h3>
                    </div>

                    <div className="flex-col" style={{ gap: '1rem' }}>
                        <BenefitItem
                            icon={<Users size={20} color="#f59e0b" />}
                            title="Join a Clan"
                            description="Team up with 50 players to compete together"
                        />
                        <BenefitItem
                            icon={<TrendingUp size={20} color="#f59e0b" />}
                            title="Earn Points"
                            description="Every successful pick adds to your clan's score"
                        />
                        <BenefitItem
                            icon={<Trophy size={20} color="#f59e0b" />}
                            title="Win Prizes"
                            description="Top 3 clans share 100,000 coins weekly!"
                        />
                        <BenefitItem
                            icon={<Zap size={20} color="#f59e0b" />}
                            title="Unlock Perks"
                            description="Exclusive badges, chat features, and bonuses"
                        />
                    </div>
                </Card>
            )}

            {/* Modals */}
            {showCreateClan && <CreateClan onClose={() => setShowCreateClan(false)} />}
            {showFindClan && <FindClan onClose={() => setShowFindClan(false)} />}

            {/* Toast Notification */}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}

function ChatMessage({ user, text, time, color }) {
    return (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '10px',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
                boxShadow: `0 2px 6px ${color}40`
            }}>
                {user[0]}
            </div>
            <div style={{
                background: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '1rem 1rem 1rem 0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                maxWidth: '80%'
            }}>
                <div className="flex-between" style={{ gap: '0.5rem', marginBottom: '0.125rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>{user}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{time}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{text}</p>
            </div>
        </div>
    );
}

function BenefitItem({ icon, title, description }) {
    return (
        <div className="flex-center" style={{ gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
                background: 'white',
                padding: '0.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.15)',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.875rem', marginBottom: '0.125rem' }}>
                    {title}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#78350f', margin: 0, lineHeight: 1.4 }}>
                    {description}
                </p>
            </div>
        </div>
    );
}
