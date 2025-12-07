import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Users, Trophy, Crown, TrendingUp, MessageCircle, Send, Star, Settings, UserPlus, LogOut, Activity, BarChart3 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Toast from '../components/Toast';

const CLAN_DATA = {
    '1': {
        id: 1,
        name: "Riyadh Traders",
        tag: "RYD",
        description: "Elite traders from Riyadh focusing on long-term growth strategies",
        rank: 1,
        members: 48,
        maxMembers: 50,
        score: "2.4M",
        trend: "+12%",
        level: 15,
        wins: 24,
        isPrivate: false,
        leader: "Yasser Al-Qahtani",
        topMembers: [
            { name: "Yasser Al-Qahtani", rank: 1, points: "125K", avatar: "👑" },
            { name: "Saad Al-Harbi", rank: 2, points: "98K", avatar: "💎" },
            { name: "Majed Abdullah", rank: 3, points: "87K", avatar: "🚀" },
            { name: "Faisal", rank: 4, points: "76K", avatar: "⭐" },
            { name: "Noura", rank: 5, points: "65K", avatar: "🎯" },
        ],
        recentActivity: [
            { user: "Yasser", action: "won 5K points", time: "2h ago" },
            { user: "Saad", action: "joined the clan", time: "5h ago" },
            { user: "Majed", action: "completed daily challenge", time: "1d ago" },
        ]
    },
    '2': {
        id: 2,
        name: "Jeddah Investors",
        tag: "JED",
        description: "Professional investors from Jeddah with proven track record",
        rank: 2,
        members: 50,
        maxMembers: 50,
        score: "2.1M",
        trend: "+8%",
        level: 14,
        wins: 20,
        isPrivate: false,
        leader: "Mohammed Al-Saud",
        topMembers: [
            { name: "Mohammed Al-Saud", rank: 1, points: "110K", avatar: "👑" },
            { name: "Fatima", rank: 2, points: "95K", avatar: "💎" },
            { name: "Abdullah", rank: 3, points: "82K", avatar: "🚀" },
            { name: "Sarah", rank: 4, points: "71K", avatar: "⭐" },
            { name: "Khalid", rank: 5, points: "68K", avatar: "🎯" },
        ],
        recentActivity: [
            { user: "Mohammed", action: "won 8K points", time: "1h ago" },
            { user: "Fatima", action: "completed weekly challenge", time: "3h ago" },
            { user: "Abdullah", action: "reached level 10", time: "6h ago" },
        ]
    },
    '3': {
        id: 3,
        name: "Dammam Bulls",
        tag: "DMM",
        description: "Aggressive trading strategy with high-risk, high-reward approach",
        rank: 3,
        members: 42,
        maxMembers: 50,
        score: "1.9M",
        trend: "+15%",
        level: 13,
        wins: 18,
        isPrivate: false,
        leader: "Omar Al-Harbi",
        topMembers: [
            { name: "Omar Al-Harbi", rank: 1, points: "105K", avatar: "👑" },
            { name: "Layla", rank: 2, points: "89K", avatar: "💎" },
            { name: "Hassan", rank: 3, points: "78K", avatar: "🚀" },
            { name: "Aisha", rank: 4, points: "69K", avatar: "⭐" },
            { name: "Tariq", rank: 5, points: "62K", avatar: "🎯" },
        ],
        recentActivity: [
            { user: "Omar", action: "won 12K points", time: "30m ago" },
            { user: "Layla", action: "achieved 10-day streak", time: "2h ago" },
            { user: "Hassan", action: "joined the clan", time: "4h ago" },
        ]
    },
    '4': {
        id: 4,
        name: "Saudi Stocks",
        tag: "SAU",
        description: "Focus on Saudi market with deep analysis and research",
        rank: 4,
        members: 35,
        maxMembers: 50,
        score: "1.5M",
        trend: "-2%",
        level: 11,
        wins: 15,
        isPrivate: false,
        leader: "Ahmed Al-Qahtani",
        topMembers: [
            { name: "Ahmed Al-Qahtani", rank: 1, points: "92K", avatar: "👑" },
            { name: "Nora", rank: 2, points: "81K", avatar: "💎" },
            { name: "Fahad", rank: 3, points: "73K", avatar: "🚀" },
            { name: "Maha", rank: 4, points: "65K", avatar: "⭐" },
            { name: "Saud", rank: 5, points: "58K", avatar: "🎯" },
        ],
        recentActivity: [
            { user: "Ahmed", action: "won 6K points", time: "1h ago" },
            { user: "Nora", action: "completed challenge", time: "5h ago" },
            { user: "Fahad", action: "reached level 8", time: "1d ago" },
        ]
    },
    '5': {
        id: 5,
        name: "Mecca Elites",
        tag: "MEC",
        description: "Premium members only with exclusive strategies",
        rank: 5,
        members: 28,
        maxMembers: 50,
        score: "1.2M",
        trend: "+5%",
        level: 10,
        wins: 12,
        isPrivate: true,
        leader: "Ibrahim Al-Saud",
        topMembers: [
            { name: "Ibrahim Al-Saud", rank: 1, points: "88K", avatar: "👑" },
            { name: "Huda", rank: 2, points: "76K", avatar: "💎" },
            { name: "Rayan", rank: 3, points: "68K", avatar: "🚀" },
            { name: "Lina", rank: 4, points: "61K", avatar: "⭐" },
            { name: "Zaid", rank: 5, points: "55K", avatar: "🎯" },
        ],
        recentActivity: [
            { user: "Ibrahim", action: "won 7K points", time: "2h ago" },
            { user: "Huda", action: "completed weekly goal", time: "4h ago" },
            { user: "Rayan", action: "joined the clan", time: "1d ago" },
        ]
    }
};

export default function ClanDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [activeTab, setActiveTab] = useState('members');

    const clan = CLAN_DATA[id] || CLAN_DATA['1'];

    const handleJoinClan = () => {
        if (clan.members >= clan.maxMembers) {
            setToast('This clan is full!');
            return;
        }
        if (clan.isPrivate) {
            setToast(`Join request sent to ${clan.name}!`);
        } else {
            setIsMember(true);
            setToast(`Successfully joined ${clan.name}! 🎉`);
        }
    };

    const handleLeaveClan = () => {
        setIsMember(false);
        setToast(`You left ${clan.name}`);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        if (!isMember) {
            setToast('Join the clan to chat!');
            return;
        }
        setToast('Message sent! 💬');
        setChatMessage('');
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return { bg: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', icon: '🥇' };
        if (rank === 2) return { bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', icon: '🥈' };
        if (rank === 3) return { bg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)', icon: '🥉' };
        return { bg: '#f1f5f9', icon: `#${rank}` };
    };

    const rankBadge = getRankBadge(clan.rank);

    const tabs = [
        { id: 'members', label: 'Members', icon: Users },
        { id: 'chat', label: 'Chat', icon: MessageCircle },
        { id: 'activity', label: 'Activity', icon: Activity },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            paddingBottom: '2rem'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
                padding: '1.5rem',
                paddingTop: '2rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        <ChevronLeft size={24} color="white" />
                    </button>

                    {/* Clan Info */}
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '16px',
                                background: rankBadge.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                border: '3px solid white'
                            }}>
                                {clan.rank <= 3 ? rankBadge.icon : <Shield size={36} color="white" />}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                                    [{clan.tag}] • Rank #{clan.rank}
                                </div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                                    {clan.name}
                                </h1>
                                <div className="flex-center" style={{ gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <Users size={16} /> {clan.members}/{clan.maxMembers} Members
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{clan.score}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Points</div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{clan.trend}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Trend</div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{clan.wins}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Wins</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Description & Join Button */}
                <Card style={{ padding: '1.25rem' }}>
                    <h3 className="h3" style={{ marginBottom: '0.75rem' }}>About</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {clan.description}
                    </p>
                    <div className="flex-center" style={{ gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Crown size={16} color="#f59e0b" />
                        <span>Leader: <strong>{clan.leader}</strong></span>
                    </div>
                </Card>

                {/* Join/Leave Button */}
                {!isMember ? (
                    <Button
                        onClick={handleJoinClan}
                        disabled={clan.members >= clan.maxMembers}
                        style={{
                            background: clan.members >= clan.maxMembers ? '#e2e8f0' : 'var(--gradient-primary)',
                            color: clan.members >= clan.maxMembers ? '#94a3b8' : 'white',
                            height: '3.5rem',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            boxShadow: clan.members >= clan.maxMembers ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.3)',
                            cursor: clan.members >= clan.maxMembers ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <UserPlus size={22} />
                        {clan.members >= clan.maxMembers ? 'Clan Full' : clan.isPrivate ? 'Request to Join' : 'Join Clan'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleLeaveClan}
                        variant="outline"
                        style={{
                            height: '3.5rem',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            color: '#ef4444',
                            borderColor: '#ef4444'
                        }}
                    >
                        <LogOut size={22} />
                        Leave Clan
                    </Button>
                )}

                {/* Tabs */}
                <div style={{
                    background: '#f1f5f9',
                    padding: '0.375rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    border: '2px solid #e2e8f0'
                }}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    background: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                    boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <Card style={{ padding: '1.25rem' }} className="animate-slide-up">
                        <h3 className="h3" style={{ marginBottom: '1rem' }}>Top Members</h3>
                        <div className="flex-col" style={{ gap: '0.75rem' }}>
                            {clan.topMembers.map((member, index) => (
                                <div key={index} className="flex-between" style={{
                                    padding: '0.75rem',
                                    background: index === 0 ? 'linear-gradient(90deg, #fef3c7 0%, white 100%)' : '#f8fafc',
                                    borderRadius: '12px'
                                }}>
                                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            background: member.rank <= 3 ? getRankBadge(member.rank).bg : '#e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem'
                                        }}>
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{member.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                Rank #{member.rank}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                                        {member.points}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <Card style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }} className="animate-slide-up">
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <h3 className="h3" style={{ color: '#1e40af' }}>Clan Chat</h3>
                            <Badge style={{ background: '#2563eb', color: 'white', border: 'none' }}>LIVE</Badge>
                        </div>

                        <div className="flex-col" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                            <ChatMessage user="Faisal" text="Great job team! Keep it up! 🚀" time="2m" />
                            <ChatMessage user="Noura" text="We're so close to rank 1!" time="5m" />
                            <ChatMessage user="Salem" text="Let's win this week!" time="10m" />
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
                                placeholder={isMember ? "Type a message..." : "Join clan to chat..."}
                                disabled={!isMember}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.875rem',
                                    background: 'transparent',
                                    color: isMember ? '#0f172a' : '#94a3b8'
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!isMember}
                                style={{
                                    background: isMember ? 'var(--primary)' : '#e2e8f0',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isMember ? 'pointer' : 'not-allowed'
                                }}
                            >
                                <Send size={18} color={isMember ? 'white' : '#94a3b8'} />
                            </button>
                        </div>
                    </Card>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                    <Card style={{ padding: '1.25rem' }} className="animate-slide-up">
                        <h3 className="h3" style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                        <div className="flex-col" style={{ gap: '0.75rem' }}>
                            {clan.recentActivity.map((activity, index) => (
                                <div key={index} style={{
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ fontWeight: 700 }}>{activity.user}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}> {activity.action}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '0.5rem' }}>• {activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            {/* Toast */}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}

function ChatMessage({ user, text, time }) {
    return (
        <div style={{
            background: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}>
            <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>{user}</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{time}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>{text}</p>
        </div>
    );
}
