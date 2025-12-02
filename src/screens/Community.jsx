import React, { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, ThumbsUp, TrendingUp, Share2, Award, Flame, Target } from 'lucide-react';

export default function Community() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Feed');
    const [likedPosts, setLikedPosts] = useState([]);

    const tabs = ['Feed', 'Top Picks', 'Discussions'];

    const posts = [
        {
            id: 1,
            author: 'StockMaster',
            avatar: '👑',
            time: '2h ago',
            content: 'Just locked in 2222, 1120, and 2010 for today. Feeling bullish! 🚀',
            likes: 124,
            comments: 18,
            picks: ['2222', '1120', '2010'],
            badge: 'Top 1%'
        },
        {
            id: 2,
            author: 'DiamondHands',
            avatar: '💎',
            time: '4h ago',
            content: 'My 7-day streak strategy: Always pick one safe stock, one volatile, and one trending. Works like magic! ✨',
            likes: 89,
            comments: 12,
            badge: 'Streak Master'
        },
        {
            id: 3,
            author: 'MoonShot',
            avatar: '🚀',
            time: '6h ago',
            content: 'ACWA Power is looking spicy today! Who else is riding the wave? 🌊',
            likes: 156,
            comments: 34,
            picks: ['4061'],
            badge: 'Risk Taker'
        },
    ];

    const topPicks = [
        { ticker: '2222', picks: 4291, change: 1.2, trend: 'up', logo: 'https://logo.clearbit.com/aramco.com' },
        { ticker: '1120', picks: 3847, change: 0.8, trend: 'up', logo: 'https://logo.clearbit.com/alrajhibank.com.sa' },
        { ticker: '2010', picks: 3562, change: -1.5, trend: 'down', logo: 'https://logo.clearbit.com/sabic.com' },
        { ticker: '7010', picks: 2934, change: 2.4, trend: 'up', logo: 'https://logo.clearbit.com/stc.com.sa' },
        { ticker: '4061', picks: 2456, change: 5.6, trend: 'up', logo: 'https://logo.clearbit.com/acwapower.com' },
    ];

    const discussions = [
        {
            id: 1,
            title: 'Best stocks for beginners?',
            author: 'NewTrader',
            replies: 23,
            time: '1h ago',
            category: 'Strategy'
        },
        {
            id: 2,
            title: 'How to maintain a winning streak?',
            author: 'ProPlayer',
            replies: 45,
            time: '3h ago',
            category: 'Tips'
        },
        {
            id: 3,
            title: 'Tech stocks vs. Blue chips - Debate',
            author: 'Analyst99',
            replies: 67,
            time: '5h ago',
            category: 'Discussion'
        },
    ];

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <h1 className="h1" style={{ fontSize: '2.5rem' }}>👥 Community</h1>
                    <BurgerMenu />
                </div>
                <p className="body-sm">Connect with traders. Share strategies. Learn together.</p>
            </div>

            {/* Stats Banner */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '2px solid #06b6d4',
                padding: '1rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#075985' }}>47.2K</div>
                        <span className="caption" style={{ color: '#0c4a6e' }}>Active Players</span>
                    </div>
                    <div style={{ width: '1px', background: '#93c5fd' }} />
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#075985' }}>1.2K</div>
                        <span className="caption" style={{ color: '#0c4a6e' }}>Posts Today</span>
                    </div>
                    <div style={{ width: '1px', background: '#93c5fd' }} />
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#075985' }}>892</div>
                        <span className="caption" style={{ color: '#0c4a6e' }}>Online Now</span>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="animate-slide-up">
                <div style={{
                    background: '#f1f5f9',
                    padding: '0.375rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    border: '2px solid #e2e8f0'
                }}>
                    {tabs.map(tab => (
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
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Tab */}
            {activeTab === 'Feed' && (
                <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>
                    {posts.map((post, index) => (
                        <Card key={post.id} style={{
                            padding: '1.25rem',
                            animationDelay: `${index * 0.05}s`
                        }} className="animate-slide-up">
                            {/* Author Header */}
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div className="flex-center" style={{ gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                                    }}>
                                        {post.avatar}
                                    </div>
                                    <div>
                                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                                            <span style={{ fontWeight: 700 }}>{post.author}</span>
                                            {post.badge && (
                                                <Badge color="warning" style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>
                                                    {post.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="caption">{post.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>{post.content}</p>

                            {/* Picks */}
                            {post.picks && (
                                <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '1rem', justifyContent: 'flex-start' }}>
                                    {post.picks.map(pick => (
                                        <div key={pick} style={{
                                            background: '#d1fae5',
                                            color: '#10b981',
                                            padding: '0.375rem 0.875rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            border: '1.5px solid #a7f3d0'
                                        }}>
                                            {pick}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex-center" style={{ gap: '1.5rem', justifyContent: 'flex-start', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLikedPosts(prev =>
                                            prev.includes(post.id)
                                                ? prev.filter(id => id !== post.id)
                                                : [...prev, post.id]
                                        );
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        cursor: 'pointer',
                                        color: likedPosts.includes(post.id) ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}>
                                    <ThumbsUp size={18} fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Opening comments for post by ${post.author}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}>
                                    <MessageCircle size={18} />
                                    {post.comments}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Sharing post by ${post.author}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}>
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Top Picks Tab */}
            {activeTab === 'Top Picks' && (
                <div className="animate-slide-up">
                    <h3 className="h3" style={{ marginBottom: '1rem' }}>Most Popular Picks Today</h3>
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        {topPicks.map((stock, index) => (
                            <Card key={stock.ticker} onClick={() => navigate(`/company/${stock.ticker}`)} style={{
                                padding: '1rem 1.25rem',
                                animationDelay: `${index * 0.05}s`,
                                cursor: 'pointer'
                            }} className="animate-slide-up">
                                <div className="flex-between">
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                overflow: 'hidden'
                                            }}>
                                                <img src={stock.logo} alt={stock.ticker} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: -6,
                                                left: -6,
                                                width: '20px',
                                                height: '20px',
                                                background: index < 3 ? 'var(--gradient-gold)' : '#f1f5f9',
                                                color: index < 3 ? 'white' : 'var(--text-secondary)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.625rem',
                                                fontWeight: 700,
                                                border: '2px solid white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                zIndex: 2
                                            }}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="h3" style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>{stock.ticker}</h3>
                                            <div className="flex-center" style={{ gap: '0.25rem' }}>
                                                <Users size={12} color="var(--text-muted)" />
                                                <span className="caption">{stock.picks.toLocaleString()} picks</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                        <span style={{
                                            color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)',
                                            fontWeight: 700,
                                            fontSize: '1rem'
                                        }}>
                                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                                        </span>
                                        <span className="caption" style={{ color: stock.trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>
                                            {stock.trend === 'up' ? '↑ Rising' : '↓ Falling'}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Discussions Tab */}
            {activeTab === 'Discussions' && (
                <div className="animate-slide-up">
                    <h3 className="h3" style={{ marginBottom: '1rem' }}>Active Discussions</h3>
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        {discussions.map((discussion, index) => (
                            <Card
                                key={discussion.id}
                                onClick={() => alert(`Opening discussion: ${discussion.title}\n\nThis would show the full discussion thread in a real app!`)}
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    animationDelay: `${index * 0.05}s`
                                }} className="animate-slide-up">
                                <div className="flex-between">
                                    <div style={{ flex: 1 }}>
                                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.5rem', justifyContent: 'flex-start' }}>
                                            <h3 className="h3" style={{ fontSize: '1rem' }}>{discussion.title}</h3>
                                        </div>
                                        <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
                                            <span className="caption">by {discussion.author}</span>
                                            <Badge color="info" style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>
                                                {discussion.category}
                                            </Badge>
                                            <span className="caption">{discussion.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex-center" style={{ gap: '0.375rem', color: 'var(--text-secondary)' }}>
                                        <MessageCircle size={18} />
                                        <span style={{ fontWeight: 700 }}>{discussion.replies}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
