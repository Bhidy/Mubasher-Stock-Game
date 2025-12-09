import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, ThumbsUp, TrendingUp, Share2, Award, Flame, Target } from 'lucide-react';
import { StockLogo, SAUDI_STOCKS } from '../components/StockCard';
import { usePrices } from '../context/PriceContext';

import { useMarket } from '../context/MarketContext';

export default function Community() {
    const navigate = useNavigate();
    const { prices } = usePrices();
    const { market } = useMarket();
    const [activeTab, setActiveTab] = useState('Feed');
    const [likedPosts, setLikedPosts] = useState([]);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const dummyComments = [
        { id: 1, author: 'Faisal', text: 'Great analysis! I agree.', time: '10m ago' },
        { id: 2, author: 'Noura', text: 'What is your target price?', time: '5m ago' },
        { id: 3, author: 'Salem', text: 'Following this strategy. Thanks!', time: '1m ago' },
    ];

    const tabs = ['Feed', 'Top Picks', 'Discussions'];

    const POSTS_DATA = {
        'SA': [
            { id: 1, author: 'Yasser Al-Qahtani', avatar: '👑', time: '2h ago', content: 'Just locked in 2222, 1120, and 2010 for today. Feeling bullish! 🚀', likes: 124, comments: 18, picks: ['2222', '1120', '2010'], badge: 'Top 1%' },
            { id: 2, author: 'Saad Al-Harbi', avatar: '💎', time: '4h ago', content: 'My 7-day streak strategy: Always pick one safe stock, one volatile, and one trending. Works like magic! ✨', likes: 89, comments: 12, badge: 'Streak Master' },
            { id: 3, author: 'Majed Abdullah', avatar: '🚀', time: '6h ago', content: 'ACWA Power is looking spicy today! Who else is riding the wave? 🌊', likes: 156, comments: 34, picks: ['4061'], badge: 'Risk Taker' },
        ],
        'EG': [
            { id: 1, author: 'Ahmed Hassan', avatar: '🦅', time: '1h ago', content: 'CIB (COMI) is looking very strong today. Breakout imminent!', likes: 230, comments: 45, picks: ['COMI'], badge: 'Expert' },
            { id: 2, author: 'Mona El-Said', avatar: '💼', time: '3h ago', content: 'Watching HRHO closely. Volumes are increasing.', likes: 112, comments: 20, picks: ['HRHO'], badge: 'Analyst' },
        ],
        'US': [
            { id: 1, author: 'John Smith', avatar: '🇺🇸', time: '30m ago', content: 'Tesla (TSLA) earnings play? Who is in?', likes: 540, comments: 120, picks: ['TSLA'], badge: 'Pro' },
            { id: 2, author: 'Sarah Connor', avatar: '🤖', time: '2h ago', content: 'NVDA still has room to run. AI revolution is just starting.', likes: 890, comments: 210, picks: ['NVDA'], badge: 'Visionary' },
        ]
    };

    const posts = POSTS_DATA[market.id] || POSTS_DATA['SA'];

    // Top Picks - Using REAL prices from API
    const TOP_PICKS_DATA = {
        'SA': [
            { ticker: '2222', picks: 4291 }, { ticker: '1120', picks: 3847 }, { ticker: '2010', picks: 2156 },
            { ticker: '7010', picks: 1892 }, { ticker: '2082', picks: 1534 }, { ticker: '1180', picks: 1423 },
            { ticker: '2380', picks: 1287 }, { ticker: '4030', picks: 1156 }, { ticker: '2350', picks: 1089 }, { ticker: '4200', picks: 998 }
        ],
        'EG': [
            { ticker: 'COMI', picks: 5200 }, { ticker: 'HRHO', picks: 3100 }, { ticker: 'ESRS', picks: 2800 },
            { ticker: 'EAST', picks: 2500 }, { ticker: 'TMGH', picks: 2100 }
        ],
        'US': [
            { ticker: 'NVDA', picks: 15400 }, { ticker: 'TSLA', picks: 12300 }, { ticker: 'AAPL', picks: 11000 },
            { ticker: 'AMD', picks: 9800 }, { ticker: 'AMZN', picks: 8500 }
        ]
    };

    const topPicksBase = TOP_PICKS_DATA[market.id] || TOP_PICKS_DATA['SA'];

    const topPicks = topPicksBase.map(pick => {
        const suffix = market.suffix || (market.id === 'SA' ? '.SR' : market.id === 'EG' ? '.CA' : '');
        const fullTicker = pick.ticker.includes('.') ? pick.ticker : `${pick.ticker}${suffix}`;
        const stockData = prices[fullTicker] || {};
        const stockMeta = SAUDI_STOCKS[pick.ticker] || {}; // Fallback for names
        return {
            ticker: pick.ticker, // Display ticker
            fullTicker: fullTicker, // Navigation ticker
            name: stockMeta.name || stockData.name || pick.ticker,
            price: stockData.price || stockData.regularMarketPrice || 0,
            picks: pick.picks,
            change: stockData.changePercent || stockData.regularMarketChangePercent || 0
        };
    });

    const discussions = [
        {
            id: 1,
            title: 'Best stocks for beginners?',
            author: 'Khalid',
            replies: 23,
            time: '1h ago',
            category: 'Strategy'
        },
        {
            id: 2,
            title: 'How to maintain a winning streak?',
            author: 'Fahad',
            replies: 45,
            time: '3h ago',
            category: 'Tips'
        },
        {
            id: 3,
            title: 'Tech stocks vs. Blue chips - Debate',
            author: 'Abdullah',
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
                                        setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        cursor: 'pointer',
                                        color: activeCommentsPostId === post.id ? 'var(--primary)' : 'var(--text-secondary)',
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
                                        // Share functionality would go here
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

                            {activeCommentsPostId === post.id && (
                                <div className="animate-fade-in" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    {dummyComments.map(comment => (
                                        <div key={comment.id} style={{ marginBottom: '0.75rem' }}>
                                            <div className="flex-between">
                                                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{comment.author}</span>
                                                <span className="caption">{comment.time}</span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{comment.text}</p>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem 1rem',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                        <button style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 'var(--radius-full)',
                                            padding: '0.5rem 1rem',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}>Post</button>
                                    </div>
                                </div>
                            )}
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
                            <Card key={stock.ticker} onClick={() => navigate(`/company/${stock.fullTicker || stock.ticker}`)} style={{
                                padding: '1rem 1.25rem',
                                animationDelay: `${index * 0.05}s`,
                                cursor: 'pointer',
                                position: 'relative'
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
                                                <StockLogo ticker={stock.ticker} size={48} />
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
                                            <h3 className="h3" style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>{stock.name || stock.ticker}</h3>
                                            <div className="flex-center" style={{ gap: '0.25rem' }}>
                                                <Users size={12} color="var(--text-muted)" />
                                                <span className="caption">{stock.picks.toLocaleString()} picks</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-col" style={{ alignItems: 'flex-end', gap: '0.25rem' }}>
                                        <span style={{
                                            fontWeight: 800,
                                            fontSize: '1.125rem',
                                            color: '#1e293b'
                                        }}>
                                            {Number(stock.price).toFixed(2)} SAR
                                        </span>
                                        <span style={{
                                            color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
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
                                onClick={() => {
                                    navigate(`/community/discussion/${discussion.id}`);
                                }}
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
