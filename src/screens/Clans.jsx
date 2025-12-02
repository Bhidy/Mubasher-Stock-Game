import React, { useState } from 'react';
import { Shield, Users, Trophy, Sword, Target, Plus, Search, MessageCircle, Crown, Star, ChevronLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useNavigate } from 'react-router-dom';

export default function Clans() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('explore');

    const topClans = [
        { rank: 1, name: "Wall Street Wolves", members: 48, score: "2.4M", trend: "+12%" },
        { rank: 2, name: "Diamond Hands", members: 50, score: "2.1M", trend: "+8%" },
        { rank: 3, name: "The Bull Run", members: 42, score: "1.9M", trend: "+15%" },
        { rank: 4, name: "Crypto Kings", members: 35, score: "1.5M", trend: "-2%" },
        { rank: 5, name: "Alpha Squad", members: 28, score: "1.2M", trend: "+5%" },
    ];

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
                {/* Glass Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Background Pattern */}
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
                        <h2 className="h3" style={{ color: '#fca5a5', marginBottom: '0.25rem', fontSize: '1rem' }}>Prize Pool</h2>
                        <div style={{
                            fontSize: '2.25rem',
                            fontWeight: 900,
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            lineHeight: 1
                        }}>
                            1,000,000 <span style={{ fontSize: '1.5rem' }}>🪙</span>
                        </div>
                    </div>
                    <div className="animate-float" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                        <Trophy size={56} color="#fbbf24" fill="#fbbf24" fillOpacity={0.2} />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-center animate-slide-up" style={{ gap: '1rem', animationDelay: '0.1s' }}>
                <Button variant="primary" style={{
                    flex: 1,
                    height: '3.5rem',
                    background: 'var(--text-primary)',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Clan
                </Button>
                <Button variant="outline" style={{
                    flex: 1,
                    height: '3.5rem',
                    background: 'white',
                    border: '1px solid var(--border-color)'
                }}>
                    <Search size={20} style={{ marginRight: '0.5rem' }} /> Find Clan
                </Button>
            </div>

            {/* Top Clans List */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem', animationDelay: '0.2s' }}>
                <div className="flex-between">
                    <h3 className="h3">Top Clans</h3>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>View All</span>
                </div>

                <div className="flex-col" style={{ gap: '0.75rem' }}>
                    {topClans.map((clan, index) => (
                        <div key={clan.rank} style={{
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

            {/* Clan Chat Preview */}
            <div className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: '0.3s'
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

                <div className="flex-col" style={{ gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                    <ChatMessage user="Alex" text="Just bought TSLA! 🚀" time="2m" color="#3b82f6" />
                    <ChatMessage user="Sarah" text="Nice! I'm holding AAPL." time="1m" color="#ec4899" />
                    <ChatMessage user="Mike" text="We need 5k more points!" time="Now" color="#10b981" />
                </div>

                <Button variant="outline" style={{
                    marginTop: '1.25rem',
                    background: 'white',
                    border: 'none',
                    color: '#2563eb',
                    width: '100%',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                }}>
                    Join a Clan to Chat
                </Button>
            </div>

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
