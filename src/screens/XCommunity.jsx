import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import {
    Users, Heart, MessageCircle, Share2, ExternalLink,
    RefreshCw, TrendingUp, Sparkles, Clock, Flame,
    Image as ImageIcon, Star, Zap, Award, Crown,
    BarChart2, Target, ChevronRight, Eye
} from 'lucide-react';

// X Logo SVG Component
const XLogo = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Profile Avatar with real image support
const ProfileAvatar = ({ username, displayName, profileImage, size = 48, showBorder = true }) => {
    const [imgError, setImgError] = useState(false);
    const colors = [
        ['#10b981', '#06b6d4'], ['#f59e0b', '#ef4444'], ['#8b5cf6', '#ec4899'],
        ['#3b82f6', '#06b6d4'], ['#14b8a6', '#22c55e'], ['#f97316', '#eab308']
    ];
    const colorIndex = (username?.charCodeAt(0) || 0) % colors.length;
    const [color1, color2] = colors[colorIndex];
    const initial = displayName?.charAt(0) || username?.charAt(0) || 'U';

    if (profileImage && !imgError) {
        return (
            <img
                src={profileImage}
                alt={displayName || username}
                onError={() => setImgError(true)}
                style={{
                    width: size, height: size, borderRadius: '50%', objectFit: 'cover',
                    border: showBorder ? '3px solid white' : 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0
                }}
            />
        );
    }

    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: size * 0.4,
            boxShadow: `0 4px 12px ${color1}40`,
            border: showBorder ? '3px solid white' : 'none', flexShrink: 0
        }}>
            {initial.toUpperCase()}
        </div>
    );
};

// Category Badge with colors
const CategoryBadge = ({ category }) => {
    const categoryColors = {
        'Elite Analyst': { bg: '#fef3c7', color: '#92400e', icon: '👑' },
        'Technical': { bg: '#dbeafe', color: '#1e40af', icon: '📊' },
        'Fundamental': { bg: '#dcfce7', color: '#166534', icon: '📈' },
        'News': { bg: '#f3e8ff', color: '#6b21a8', icon: '📰' },
        'Signals': { bg: '#ffe4e6', color: '#be123c', icon: '🎯' },
        'Influencer': { bg: '#e0e7ff', color: '#3730a3', icon: '⭐' },
        'Educator': { bg: '#cffafe', color: '#0e7490', icon: '📚' },
        'Charts': { bg: '#fce7f3', color: '#9d174d', icon: '📉' }
    };
    const config = categoryColors[category] || { bg: '#f1f5f9', color: '#475569', icon: '💼' };

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: config.bg, color: config.color,
            fontSize: '0.625rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600
        }}>
            {config.icon} {category}
        </span>
    );
};

// ============ MARKET INTELLIGENCE LOGIC ============
const processMarketIntelligence = (tweets) => {
    const tickers = {};
    const sentiment = { bullish: 0, bearish: 0, neutral: 0, score: 50 };

    // Arabic & English Keywords
    const BULLISH_TERMS = ['breakout', 'bull', 'buy', 'long', 'support', 'profit', 'target', 'green', 'up', 'bounce', 'accumulate', 'moon', 'rocket', 'call', 'entry', 'اختراق', 'شراء', 'صعود', 'هدف', 'ايجابي', 'دعم', 'ارباح', 'تجميع'];
    const BEARISH_TERMS = ['breakdown', 'bear', 'sell', 'short', 'resistance', 'loss', 'drop', 'red', 'down', 'crash', 'put', 'exit', 'dump', 'كسر', 'بيع', 'هبوط', 'سلبي', 'مقاومة', 'خسارة', 'تصريف', 'انهيار'];

    // Ticker Regex: 4-digit codes (Saudi) or $TICKER
    // Filter out common years like 2023, 2024, 2025, 2030 to avoid confusion
    const tickerRegex = /\b\d{4}\b|\$[A-Z]{2,5}/g;

    tweets.forEach(t => {
        const text = t.content.toLowerCase();

        // Sentiment Analysis
        let score = 0;
        BULLISH_TERMS.forEach(w => { if (text.includes(w)) score++; });
        BEARISH_TERMS.forEach(w => { if (text.includes(w)) score--; });

        if (score > 0) sentiment.bullish++;
        else if (score < 0) sentiment.bearish++;
        else sentiment.neutral++;

        // Ticker Extraction
        const matches = t.content.match(tickerRegex);
        if (matches) {
            matches.forEach(m => {
                const s = m.replace('$', '');
                // Exclude years
                if (s.match(/^\d{4}$/) && (parseInt(s) >= 2020 && parseInt(s) <= 2035)) return;
                tickers[s] = (tickers[s] || 0) + 1;
            });
        }
    });

    // Calculate overall Sentiment Score (0-100)
    const total = sentiment.bullish + sentiment.bearish + sentiment.neutral;
    if (total > 0) {
        // Simple weighted: Bullish counts double in positive direction, Bearish in negative 
        // 50 is neutral. 
        const rawScore = 50 + ((sentiment.bullish - sentiment.bearish) / total * 50);
        sentiment.score = Math.min(100, Math.max(0, rawScore));
    }

    // Sort tickers
    const sortedTickers = Object.entries(tickers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([symbol, count]) => ({ symbol, count }));

    return { sentiment, tickers: sortedTickers };
};

// ============ SENTIMENT DASHBOARD COMPONENT ============
const SentimentDashboard = ({ sentiment, tickers }) => {
    // Determine Market Mood
    let mood = "Neutral";
    let moodColor = "#94a3b8"; // Gray
    if (sentiment.score >= 60) { mood = "Greed"; moodColor = "#22c55e"; } // Green
    else if (sentiment.score >= 75) { mood = "Euphoria"; moodColor = "#10b981"; } // Emerald
    else if (sentiment.score <= 40) { mood = "Fear"; moodColor = "#f59e0b"; } // Orange
    else if (sentiment.score <= 25) { mood = "Panic"; moodColor = "#ef4444"; } // Red

    return (
        <div className="animate-fade-in" style={{
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} color="#fbbf24" fill="#fbbf24" />
                        Market Intelligence
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>AI-Powered Analysis of {sentiment.bullish + sentiment.bearish + sentiment.neutral} recent insights</p>
                </div>
                <div style={{
                    padding: '8px 16px', borderRadius: '100px',
                    background: `${moodColor}20`, border: `1px solid ${moodColor}40`,
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: moodColor, boxShadow: `0 0 10px ${moodColor}` }} />
                    <span style={{ color: moodColor, fontWeight: 700, fontSize: '0.9rem' }}>{mood} ({sentiment.score.toFixed(0)})</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Sentiment Gauge */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <span style={{ color: '#ef4444' }}>Bearish ({sentiment.bearish})</span>
                        <span style={{ color: '#22c55e' }}>Bullish ({sentiment.bullish})</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${sentiment.score}%`, background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%)', height: '100%', transition: 'width 1s ease-out' }} />
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>Extreme Fear</span>
                        <span>Neutral</span>
                        <span>Extreme Greed</span>
                    </div>
                </div>

                {/* Hot Tickers */}
                <div>
                    <h4 style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Flame size={14} color="#f97316" /> Trending Tickers
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tickers.slice(0, 6).map((t, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(255,255,255,0.05)', padding: '6px 12px',
                                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'default', transition: 'all 0.2s'
                            }}>
                                <span style={{ color: '#white', fontWeight: 700, fontSize: '0.85rem' }}>{t.symbol}</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{t.count}</span>
                            </div>
                        ))}
                        {tickers.length === 0 && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Analyzing mentions...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tweet Image Gallery
const TweetImageGallery = ({ images }) => {
    const [loadedImages, setLoadedImages] = useState({});
    const [lightboxImage, setLightboxImage] = useState(null);

    if (!images?.length) return null;

    return (
        <>
            <div style={{
                display: images.length === 1 ? 'block' : 'grid',
                gridTemplateColumns: images.length > 1 ? '1fr 1fr' : undefined,
                gap: '4px', borderRadius: '16px', overflow: 'hidden', marginTop: '12px'
            }}>
                {images.slice(0, 4).map((img, index) => (
                    <div key={index} onClick={() => setLightboxImage(img)} style={{
                        position: 'relative', paddingBottom: images.length === 1 ? '56.25%' : '100%',
                        background: '#1e293b', cursor: 'pointer', overflow: 'hidden'
                    }}>
                        {!loadedImages[index] && (
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                background: '#1e293b'
                            }}>
                                <ImageIcon size={24} color="#475569" />
                            </div>
                        )}
                        <img src={img} alt={`Tweet image ${index + 1}`}
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                            onError={(e) => e.target.style.display = 'none'}
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                objectFit: 'cover', opacity: loadedImages[index] ? 1 : 0, transition: 'opacity 0.3s'
                            }}
                        />
                    </div>
                ))}
            </div>
            {lightboxImage && (
                <div onClick={() => setLightboxImage(null)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out'
                }}>
                    <img src={lightboxImage} alt="Full size" style={{
                        maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }} />
                </div>
            )}
        </>
    );
};

// Enhanced Tweet Card
const TweetCard = ({ tweet, index, showRank = false, rankNumber = 0 }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);

    const maxLength = 280;
    const isLongContent = tweet.content.length > maxLength;
    const displayContent = isLongContent && !showFullContent ? tweet.content.slice(0, maxLength) + '...' : tweet.content;
    const wasArabic = tweet.originalLang === 'ar' || tweet.isTranslated;

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const openTweet = () => window.open(tweet.url, '_blank', 'noopener,noreferrer');

    return (
        <Card className="animate-slide-up" style={{
            padding: 0, overflow: 'hidden', animationDelay: `${index * 0.03}s`, cursor: 'default',
            position: 'relative'
        }}>
            {/* Rank Badge for Trending/Most Engaged */}
            {showRank && rankNumber <= 3 && (
                <div style={{
                    position: 'absolute', top: '12px', right: '12px', zIndex: 5,
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: rankNumber === 1 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                        rankNumber === 2 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' :
                            'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    {rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : '🥉'}
                </div>
            )}

            {/* Header */}
            <div style={{ padding: '1rem 1rem 0.75rem', display: 'flex', gap: '12px' }}>
                <ProfileAvatar username={tweet.username} displayName={tweet.displayName} profileImage={tweet.profileImage} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{tweet.displayName}</span>
                        {tweet.tier === 1 && <Crown size={14} color="#fbbf24" fill="#fbbf24" />}
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>@{tweet.username}</span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{tweet.relativeTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <CategoryBadge category={tweet.category} />
                        {wasArabic && (
                            <span title="Translated from Arabic" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '3px',
                                background: '#fef3c7', color: '#92400e', fontSize: '0.6rem',
                                padding: '2px 6px', borderRadius: '6px', fontWeight: 600
                            }}>🇸🇦 AR</span>
                        )}
                    </div>
                </div>
                <button onClick={openTweet} style={{
                    background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
                    color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} title="View on X">
                    <ExternalLink size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '0 1rem' }}>
                <p style={{
                    fontSize: '0.95rem', lineHeight: 1.6, color: '#1e293b',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word', direction: 'ltr', textAlign: 'left'
                }} dangerouslySetInnerHTML={{
                    __html: displayContent.replace(/(\b\d{4}\b|\$[A-Z]{2,5})/g, '<span style="color: #2563eb; font-weight: 700; background: rgba(37,99,235,0.1); padding: 0 4px; border-radius: 4px; cursor: pointer;">$1</span>')
                }} />
                {isLongContent && (
                    <button onClick={() => setShowFullContent(!showFullContent)} style={{
                        background: 'none', border: 'none', color: '#06b6d4', fontWeight: 600,
                        fontSize: '0.875rem', cursor: 'pointer', padding: '4px 0', marginTop: '4px'
                    }}>
                        {showFullContent ? 'Show less' : 'Show more'}
                    </button>
                )}
                <TweetImageGallery images={tweet.images} />
            </div>

            {/* Engagement Stats */}
            <div style={{
                display: 'flex', justifyContent: 'space-around', padding: '0.75rem 1rem',
                marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', background: '#fafafa'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                    <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatNumber(tweet.likes)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                    <RefreshCw size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatNumber(tweet.retweets)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6' }}>
                    <MessageCircle size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatNumber(tweet.replies)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
                    <Zap size={16} fill="#f59e0b" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatNumber(Math.round(tweet.engagementScore))}</span>
                </div>
            </div>
        </Card>
    );
};

// Leaderboard Card
const LeaderboardCard = ({ leaderboard }) => {
    if (!leaderboard?.length) return null;

    return (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
                padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
                <Award size={20} color="#fbbf24" />
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Top Influencers</span>
            </div>
            <div style={{ padding: '0.5rem' }}>
                {leaderboard.slice(0, 5).map((user, idx) => (
                    <div key={user.username} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '0.75rem', borderRadius: '12px', background: idx === 0 ? '#fef9c3' : 'transparent',
                        marginBottom: '4px'
                    }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#f97316' : '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: idx < 3 ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.75rem'
                        }}>
                            {idx + 1}
                        </span>
                        <ProfileAvatar username={user.username} displayName={user.displayName} profileImage={user.profileImage} size={32} showBorder={false} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.displayName}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                {user.totalPosts} posts • {Math.round(user.totalEngagement).toLocaleString()} engagement
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// Loading Skeleton
const TweetSkeleton = () => (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', display: 'flex', gap: '12px' }}>
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
            }} />
            <div style={{ flex: 1 }}>
                <div style={{
                    width: '60%', height: 16, borderRadius: 8,
                    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: 8
                }} />
                <div style={{
                    width: '40%', height: 12, borderRadius: 6,
                    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
                }} />
            </div>
        </div>
        <div style={{ padding: '0 1rem 1rem' }}>
            <div style={{
                width: '100%', height: 60, borderRadius: 8,
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
            }} />
        </div>
    </Card>
);

// Tab Configuration
const TABS = [
    { id: 'fresh', label: 'Fresh', icon: Clock, description: 'Latest posts' },
    { id: 'trending', label: 'Trending', icon: Flame, description: 'Hot right now' },
    { id: 'top-analysts', label: 'Top Analysts', icon: Crown, description: 'Elite insights' },
    { id: 'most-engaged', label: 'Most Engaged', icon: BarChart2, description: 'Top performing' }
];

// Main Component
export default function XCommunity() {
    const [tweets, setTweets] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('fresh');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ accounts: 0, totalTweets: 0 });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [marketIntelligence, setMarketIntelligence] = useState(null);
    const refreshIntervalRef = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const fetchTweets = useCallback(async (tab, isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true); else setLoading(true);
            setError(null);

            const baseUrl = import.meta.env.DEV ? 'http://localhost:5001/api/x-community' : '/api/x-community';
            const url = `${baseUrl}?tab=${tab}${isRefresh ? '&refresh=true' : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const fetchedTweets = data.tweets || [];
                setTweets(fetchedTweets);
                setLeaderboard(data.leaderboard || []);
                setStats({ accounts: data.accounts || 0, totalTweets: data.totalTweets || 0 });
                setLastUpdated(new Date());

                // Process Intelligence locally on the frontend
                const intelligence = processMarketIntelligence(fetchedTweets);
                setMarketIntelligence(intelligence);
            } else {
                throw new Error(data.error || 'Failed to fetch tweets');
            }
        } catch (err) {
            console.error('Error fetching X Community:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTweets(activeTab);
        refreshIntervalRef.current = setInterval(() => fetchTweets(activeTab, true), 5 * 60 * 1000);
        return () => { if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current); };
    }, [activeTab, fetchTweets]);

    const handleTabChange = (tabId) => {
        if (tabId !== activeTab) {
            setActiveTab(tabId);
            setLoading(true);
        }
    };

    const handleRefresh = () => { if (!refreshing) fetchTweets(activeTab, true); };

    const showRank = activeTab === 'trending' || activeTab === 'most-engaged';

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>
            <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '16px',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.4)'
                        }}>
                            <XLogo size={28} color="white" />
                        </div>
                        <div>
                            <h1 className="h1" style={{ fontSize: '1.75rem', marginBottom: 0 }}>X Community</h1>
                            <p className="caption" style={{ marginTop: '2px' }}>
                                Market Pulse & Elite Insights
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleRefresh} disabled={refreshing} style={{
                            background: 'white', border: '1px solid #e2e8f0',
                            borderRadius: '12px', width: 42, height: 42, color: '#0f172a',
                            cursor: refreshing ? 'not-allowed' : 'pointer', fontSize: '1.2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', opacity: refreshing ? 0.7 : 1
                        }}>
                            <RefreshCw size={20} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                        </button>
                        <BurgerMenu />
                    </div>
                </div>
            </div>

            {/* Market Intelligence Dashboard (Replaces old Stats Banner) */}
            {marketIntelligence && (
                <SentimentDashboard sentiment={marketIntelligence.sentiment} tickers={marketIntelligence.tickers} />
            )}

            {/* Smart Tabs */}
            <div className="animate-slide-up" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'
            }}>
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
                            padding: '12px 8px', borderRadius: '16px', border: 'none',
                            background: isActive ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' : 'white',
                            color: isActive ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.7rem',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                            boxShadow: isActive ? '0 8px 24px rgba(15, 23, 42, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <Icon size={20} color={isActive ? '#fbbf24' : '#64748b'} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Leaderboard (show on Fresh and Most Engaged tabs) */}
            {(activeTab === 'fresh' || activeTab === 'most-engaged') && !loading && (
                <LeaderboardCard leaderboard={leaderboard} />
            )}

            {/* Error State */}
            {error && !loading && (
                <Card style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #fca5a5', padding: '1.25rem', textAlign: 'center'
                }}>
                    <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '8px' }}>Unable to load tweets</p>
                    <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginBottom: '12px' }}>{error}</p>
                    <button onClick={() => fetchTweets(activeTab)} style={{
                        background: '#dc2626', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '9999px', fontWeight: 600, cursor: 'pointer'
                    }}>Try Again</button>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {[1, 2, 3].map(i => <TweetSkeleton key={i} />)}
                </div>
            )}

            {/* Tweets Feed */}
            {!loading && !error && (
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {tweets.length > 0 ? (
                        tweets.map((tweet, index) => (
                            <TweetCard key={tweet.id} tweet={tweet} index={index} showRank={showRank} rankNumber={index + 1} />
                        ))
                    ) : (
                        <Card style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>No tweets found</h3>
                            <p style={{ color: '#6b7280' }}>Try refreshing or check back later for new content</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
