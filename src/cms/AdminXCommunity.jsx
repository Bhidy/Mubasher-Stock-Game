import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getEndpoint } from '../config/api';
import Card from '../components/Card';
import { StockLogo } from '../components/StockCard';
import {
    Clock, Flame, Crown, BarChart2,
    Zap, TrendingUp, TrendingDown,
    Heart, MessageCircle, RefreshCw, ExternalLink,
    Image as ImageIcon, Info, ChevronRight, Award, Globe
} from 'lucide-react';

// ============================================================================
// ADMIN X COMMUNITY - PREMIUM DASHBOARD
// ============================================================================

// --- HELPER COMPONENTS ---

const ProfileAvatar = ({ username, displayName, profileImage, size = 48, showBorder = true }) => {
    const [imgError, setImgError] = useState(false);
    const initial = displayName?.charAt(0) || username?.charAt(0) || 'U';
    const colors = [['#10b981', '#06b6d4'], ['#f59e0b', '#ef4444'], ['#8b5cf6', '#ec4899']];
    const colorIndex = (username?.charCodeAt(0) || 0) % colors.length;
    const [color1, color2] = colors[colorIndex];

    if (profileImage && !imgError) {
        return (
            <img src={profileImage} alt={displayName} onError={() => setImgError(true)}
                style={{
                    width: size, height: size, borderRadius: '50%', objectFit: 'cover',
                    border: showBorder ? '3px solid white' : 'none', flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
            border: showBorder ? '3px solid white' : 'none', flexShrink: 0
        }}>
            {initial.toUpperCase()}
        </div>
    );
};

const CategoryBadge = ({ category }) => {
    const config = {
        'Elite Analyst': { bg: '#fef3c7', color: '#92400e', icon: '👑' },
        'Technical': { bg: '#dbeafe', color: '#1e40af', icon: '📊' },
        'News': { bg: '#f3e8ff', color: '#6b21a8', icon: '📰' },
    }[category] || { bg: '#f1f5f9', color: '#475569', icon: '💼' };

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

// --- PREMIUM DASHBOARD WIDGETS (EXACT PORT FROM FRONTEND) ---

const SentimentDashboard = ({ sentiment, tickers }) => {
    const [tickerIndex, setTickerIndex] = useState(0);

    useEffect(() => {
        if (!tickers || tickers.length <= 1) return;
        const interval = setInterval(() => {
            setTickerIndex(prev => (prev + 1) % tickers.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [tickers?.length]);

    const activeTicker = tickers && tickers.length > 0 ? tickers[tickerIndex] : null;

    // Mood Logic
    let mood = "Neutral";
    let moodColor = "#94a3b8";
    const score = sentiment.score || 50;
    if (score >= 60) { mood = "Bullish"; moodColor = "#10b981"; }
    if (score >= 75) { mood = "Strong Buy"; moodColor = "#0ea5e9"; }
    if (score <= 40) { mood = "Bearish"; moodColor = "#f59e0b"; }
    if (score <= 25) { mood = "Strong Sell"; moodColor = "#ef4444"; }

    return (
        <div className="animate-fade-in" style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            borderRadius: '24px', padding: '1.5rem', marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Overlay Shine */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                pointerEvents: 'none', borderRadius: '24px 24px 0 0'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', position: 'relative' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        <Zap size={22} color={moodColor} fill={moodColor} style={{ filter: `drop-shadow(0 0 6px ${moodColor})` }} />
                        Market Pulse
                    </h3>
                    <p style={{ color: 'white', fontSize: '0.8rem', marginTop: '4px' }}>
                        Live Analysis of <span style={{ color: 'white', fontWeight: 700 }}>{sentiment.bullish + sentiment.bearish + sentiment.neutral}</span> Elite Insights
                    </p>
                </div>

                {/* Score Badge */}
                <div style={{
                    padding: '10px 18px', borderRadius: '14px',
                    background: 'rgba(0,0,0,0.4)', border: `2px solid ${moodColor}50`,
                    boxShadow: `0 0 20px -5px ${moodColor}80, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    textAlign: 'center'
                }}>
                    <div style={{ color: moodColor, fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, textShadow: `0 0 15px ${moodColor}` }}>
                        {score}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', marginTop: '2px' }}>
                        {mood}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: '1.5rem', alignItems: 'center' }}>
                {/* LEFT: Gauge & Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingDown size={12} /> Bearish <span style={{ color: '#fca5a5', marginLeft: '2px' }}>({sentiment.bearish})</span>
                        </span>
                        <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Bullish <span style={{ color: '#86efac', marginLeft: '2px' }}>({sentiment.bullish})</span> <TrendingUp size={12} />
                        </span>
                    </div>

                    {/* Shiny Progress Bar */}
                    <div style={{
                        height: '14px', background: 'rgba(0,0,0,0.5)',
                        borderRadius: '8px', overflow: 'hidden',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${score}%`,
                            background: `linear-gradient(90deg, ${moodColor} 0%, ${moodColor}dd 100%)`,
                            height: '100%', borderRadius: '8px',
                            boxShadow: `0 0 20px 3px ${moodColor}60`,
                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative'
                        }}>
                            {/* Shimmer Effect */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'shimmer 2s infinite'
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'white', fontWeight: 600, opacity: 0.7 }}>
                        <span>Extreme Fear</span>
                        <span>Neutral</span>
                        <span>Extreme Greed</span>
                    </div>
                </div>

                {/* RIGHT: Hot Tickers Card */}
                <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '16px', padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <Flame size={14} color="#f97316" fill="#f97316" style={{ filter: 'drop-shadow(0 0 4px #f97316)' }} /> HOT TICKERS
                    </div>

                    {activeTicker ? (
                        <div key={tickerIndex} className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <StockLogo ticker={activeTicker.symbol} size={32} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>{activeTicker.name}</span>
                                    <span style={{ color: '#e2e8f0', fontSize: '0.75rem', whiteSpace: 'nowrap', opacity: 0.7 }}>{activeTicker.symbol}</span>
                                </div>
                                <span style={{
                                    background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                                    fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                                    whiteSpace: 'nowrap', boxShadow: '0 0 8px rgba(16,185,129,0.2)', width: 'fit-content'
                                }}>
                                    {activeTicker.count} mentions
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '0.5rem' }}>
                            Scanning market...
                        </div>
                    )}
                </div>
            </div>

            {/* In-component Styles for animations */}
            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
            `}</style>
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
                    <div key={index} onClick={(e) => { e.stopPropagation(); setLightboxImage(img); }} style={{
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
                <div onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }} style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                    cursor: 'zoom-out', backdropFilter: 'blur(5px)'
                }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer', transition: 'background 0.2s'
                        }}
                    >
                        ✕
                    </button>
                    <img src={lightboxImage} alt="Full size" style={{
                        maxWidth: '100%', maxHeight: '100%', borderRadius: '8px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                        objectFit: 'contain'
                    }} />
                </div>
            )}
        </>
    );
};

// Stat Item Component
const StatItem = ({ icon: Icon, value, color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: color }}>
        <Icon size={16} fill={label === 'Impact' ? color : 'none'} />
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}
        </span>
    </div>
);

// Tweet Card
const TweetCard = ({ tweet }) => {
    // State to store matched translation if fetched client-side
    const [clientTranslation, setClientTranslation] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false); // If true, shows Arabic. If false, shows English

    const isArabicContent = /[\u0600-\u06FF]/.test(tweet.content);

    // Determine if we have a translation (either from backend or client)
    const hasBackendTranslation = tweet.isTranslated && tweet.originalContent;
    const hasClientTranslation = !!clientTranslation;
    const isTranslated = hasBackendTranslation || hasClientTranslation;

    // AUTO-TRANSLATION EFFECT
    useEffect(() => {
        // If content is Arabic and NOT yet translated by backend, translate it automatically
        if (isArabicContent && !hasBackendTranslation && !clientTranslation && !isTranslating) {
            handleTranslate();
        }
    }, [isArabicContent, hasBackendTranslation, clientTranslation, isTranslating]);

    // Content Display Logic
    let displayContent = tweet.content;
    let isRTL = false;

    if (hasBackendTranslation) {
        // Backend provides: content (English), originalContent (Arabic)
        if (showOriginal) {
            displayContent = tweet.originalContent;
            isRTL = true;
        } else {
            displayContent = tweet.content; // English
            isRTL = false;
        }
    } else if (hasClientTranslation) {
        // Client provides: clientTranslation (English), tweet.content (Arabic)
        if (showOriginal) {
            displayContent = tweet.content; // Original Arabic
            isRTL = true;
        } else {
            displayContent = clientTranslation; // Translated English
            isRTL = false;
        }
    } else if (isArabicContent) {
        // While auto-translating, show original (or could show loading...)
        displayContent = tweet.content;
        isRTL = true;
    }

    const handleTranslate = async (e) => {
        if (e) e.stopPropagation(); // Optional if called automatically

        // If already translated, this button acts as a toggle
        if (isTranslated && e) {
            setShowOriginal(!showOriginal);
            return;
        }

        setIsTranslating(true);
        try {
            // Random delay to avoid burst rate limits if many cards load at once
            const delay = Math.floor(Math.random() * 2000);
            await new Promise(r => setTimeout(r, delay));

            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(tweet.content)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data && data[0]) {
                const text = data[0].map(part => part[0]).join('');
                setClientTranslation(text);
                setShowOriginal(false); // Ensure English is shown
            }
        } catch (err) {
            console.error("Auto-Translation failed", err);
        } finally {
            setIsTranslating(false);
        }
    };

    const openTweet = () => window.open(tweet.url, '_blank', 'noreferrer');

    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <ProfileAvatar username={tweet.username} displayName={tweet.displayName} profileImage={tweet.profileImage} size={48} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{tweet.displayName}</span>
                            {tweet.tier === 1 && <Crown size={14} color="#fbbf24" fill="#fbbf24" />}
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>@{tweet.username}</span>
                            <span style={{ color: '#cbd5e1' }}>•</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{tweet.relativeTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <CategoryBadge category={tweet.category} />

                            {/* Translation Button */}
                            {(isArabicContent || isTranslated) && (
                                <button
                                    onClick={handleTranslate}
                                    disabled={isTranslating}
                                    style={{
                                        background: isTranslated && !showOriginal ? '#dbeafe' : '#f1f5f9',
                                        border: '1px solid',
                                        borderColor: isTranslated && !showOriginal ? '#bfdbfe' : '#e2e8f0',
                                        padding: '4px 8px', borderRadius: '6px',
                                        color: isTranslated && !showOriginal ? '#1e40af' : '#64748b',
                                        fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        transition: 'all 0.2s', opacity: isTranslating ? 0.7 : 1
                                    }}
                                >
                                    <Globe size={12} />
                                    {isTranslating ? 'Translating...' :
                                        !isTranslated ? 'Translate to English' :
                                            showOriginal ? 'View Translation' : 'View Original (Arabic)'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={openTweet} style={{
                    background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
                    color: '#cbd5e1', borderRadius: '50%', display: 'flex', transition: 'color 0.2s'
                }} onMouseOver={e => e.currentTarget.style.color = '#94a3b8'} onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}>
                    <ExternalLink size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '1rem' }}>
                <p style={{
                    fontSize: '0.95rem', lineHeight: 1.6, color: '#334155',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left',
                    fontFamily: isRTL ? '"Noto Sans Arabic", sans-serif' : 'inherit'
                }}>
                    {displayContent}
                </p>
                {tweet.images && tweet.images.length > 0 && <TweetImageGallery images={tweet.images} />}
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex', gap: '1.5rem', paddingTop: '0.75rem',
                borderTop: '1px solid #f8fafc', color: '#64748b'
            }}>
                <StatItem icon={Heart} value={tweet.likes} color="#ef4444" />
                <StatItem icon={RefreshCw} value={tweet.retweets} color="#10b981" />
                <StatItem icon={MessageCircle} value={tweet.replies} color="#3b82f6" />
                <StatItem icon={Zap} value={Math.round(tweet.engagementScore)} color="#f59e0b" label="Impact" />
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function AdminXCommunity() {
    const [activeTab, setActiveTab] = useState('fresh');
    const [selectedMarket, setSelectedMarket] = useState('SA'); // SA, EG, US
    const [tweets, setTweets] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [sentiment, setSentiment] = useState({ score: 50, bullish: 0, bearish: 0, neutral: 0 });
    const [tickers, setTickers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTweets = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const baseUrl = getEndpoint('/api/x-community');
            const url = `${baseUrl}?tab=${activeTab}&market=${selectedMarket}${isRefresh ? '&refresh=true' : ''}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setTweets(data.tweets || []);
                setLeaderboard(data.leaderboard || []);

                // Use Backend Sentiment if available
                if (data.sentiment) {
                    setSentiment(data.sentiment);
                }

                // Use Backend Hot Tickers if available (v3.3)
                if (data.hotTickers) {
                    setTickers(data.hotTickers);
                } else {
                    // Fallback to client-side if backend fails
                    const mentionCounts = {};
                    (data.tweets || []).forEach(t => {
                        const matches = t.content.match(/\b\d{4}\b|\$[A-Z]{2,5}/g);
                        if (matches) matches.forEach(m => mentionCounts[m] = (mentionCounts[m] || 0) + 1);
                    });
                    const sortedTickers = Object.entries(mentionCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([s, c]) => ({ symbol: s, name: s, count: c }));
                    setTickers(sortedTickers);
                }
            }
        } catch (error) {
            console.error("Failed to fetch X data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, selectedMarket]);

    useEffect(() => {
        fetchTweets();
        const interval = setInterval(() => fetchTweets(false), 30000); // 30s Auto Refresh (polite)
        return () => clearInterval(interval);
    }, [fetchTweets]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
            {/* Header with Market Selector & Refresh */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>X Community</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Real-time market intelligence from elite analysts</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchTweets(true)}
                        disabled={refreshing}
                        style={{
                            padding: '10px 16px', borderRadius: '16px', fontWeight: 600,
                            background: 'white', color: refreshing ? '#94a3b8' : '#0f172a',
                            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)', cursor: refreshing ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #f1f5f9',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                        <span>{refreshing ? 'Syncing...' : 'Refresh Feed'}</span>
                    </button>

                    {/* Premium Market Selector */}
                    <div style={{
                        background: 'white', padding: '6px', borderRadius: '16px',
                        boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)', display: 'flex', gap: '6px', border: '1px solid #f1f5f9'
                    }}>
                        {['SA', 'EG', 'US'].map(m => {
                            const isActive = selectedMarket === m;
                            return (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMarket(m)}
                                    style={{
                                        padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 700,
                                        background: isActive ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' : 'transparent',
                                        color: isActive ? 'white' : '#64748b',
                                        boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.3)' : 'none',
                                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'
                                    }}
                                >
                                    <span>{m === 'SA' ? '🇸🇦' : m === 'EG' ? '🇪🇬' : '🇺🇸'}</span>
                                    {m === 'SA' ? 'Saudi' : m === 'EG' ? 'Egypt' : 'US'}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
                {/* LEFT COLUMN: Feed */}
                <div>
                    {/* Sentiment Dashboard */}
                    <SentimentDashboard sentiment={sentiment} tickers={tickers} />

                    {/* Premium Tabs - Bigger, Clearer, Centered */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            background: '#f1f5f9',
                            padding: '0.5rem',
                            borderRadius: '20px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                        }}>
                            {[
                                { id: 'fresh', label: 'Fresh', icon: Clock },
                                { id: 'trending', label: 'Trending', icon: Flame },
                                { id: 'top-analysts', label: 'Top Analysts', icon: Crown },
                            ].map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '14px 28px',
                                            border: 'none',
                                            borderRadius: '16px',
                                            background: isActive
                                                ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'
                                                : 'transparent',
                                            color: isActive ? 'white' : '#64748b',
                                            fontWeight: isActive ? 800 : 600,
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isActive
                                                ? '0 8px 20px -4px rgba(15, 23, 42, 0.4)'
                                                : 'none',
                                            transform: isActive ? 'translateY(-2px)' : 'none'
                                        }}
                                    >
                                        <tab.icon
                                            size={20}
                                            color={isActive ? 'white' : '#94a3b8'}
                                            fill={isActive && tab.id === 'trending' ? 'white' : 'none'}
                                        />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tweets Feed */}
                    {loading && tweets.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <p style={{ color: '#64748b', fontWeight: 600 }}>Analyzing market data...</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tweets.map((t, i) => <TweetCard key={i} tweet={t} />)}

                            {tweets.length === 0 && (
                                <div style={{
                                    textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '24px',
                                    border: '2px dashed #e2e8f0'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>No updates yet</h3>
                                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Waiting for new signals from the {selectedMarket} market.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Leaderboard & Info */}
                <div>
                    <Card title="Top Influencers" icon={<Award size={20} color="#fbbf24" />} style={{ position: 'sticky', top: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
                        {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((user, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '0.75rem', borderRadius: '12px', background: idx === 0 ? '#fffbeb' : 'transparent',
                                marginBottom: '4px', border: idx === 0 ? '1px solid #fcd34d' : '1px solid transparent'
                            }}>
                                <span style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: idx === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: idx === 0 ? 'white' : '#64748b', fontWeight: 800, fontSize: '0.8rem',
                                    boxShadow: idx === 0 ? '0 4px 10px rgba(245, 158, 11, 0.4)' : 'none'
                                }}>{idx + 1}</span>
                                <ProfileAvatar username={user.username} displayName={user.displayName} profileImage={user.profileImage} size={36} showBorder={false} />
                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.displayName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{Math.round(user.totalEngagement).toLocaleString()} engagement</div>
                                </div>
                                {idx === 0 && <Crown size={16} color="#d97706" fill="#d97706" />}
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No data loaded</div>
                        )}
                    </Card>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#eff6ff', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                            <Info size={18} color="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Market Coverage</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.6 }}>
                            Currently monitoring top analysts in the <strong>{selectedMarket === 'SA' ? 'Saudi' : selectedMarket === 'EG' ? 'Egyptian' : 'US'}</strong> market.
                            Feed updates automatically every 30 seconds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
