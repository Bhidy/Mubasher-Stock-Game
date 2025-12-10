import React, { useState, useEffect, useCallback, useRef } from 'react';
import SafePortal from '../components/shared/SafePortal';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import {
    Users, Heart, MessageCircle, Share2, ExternalLink,
    RefreshCw, TrendingUp, Sparkles, Clock, Flame,
    Image as ImageIcon, Star, Zap, Award, Crown,
    BarChart2, Target, ChevronRight, Eye, AlertTriangle, TrendingDown, Info
} from 'lucide-react';
import { StockLogo } from '../components/StockCard';

// FAIL-SAFE ERROR BOUNDARY
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("XPage Crash:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#1e293b', marginTop: '20vh' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤕</div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        We encountered an unexpected issue while loading the market intelligence.
                    </p>
                    <button onClick={() => window.location.reload()} style={{
                        padding: '10px 24px', borderRadius: '12px', border: 'none',
                        background: '#0f172a', color: 'white', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Reload Page
                    </button>
                    <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                        {this.state.error?.toString()}
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}

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

// Expanded Ticker to Name Mapping
const TICKER_MAP = {
    '1120': 'Al Rajhi', '2222': 'Aramco', '2010': 'SABIC', '1180': 'SNB', '7010': 'STC',
    '2082': 'ACWA', '1211': 'Maaden', '1150': 'Alinma', '1140': 'Albilad', '1010': 'Riyad',
    '2380': 'Rabigh', '2280': 'Almarai', '4030': 'Bahri', '2290': 'Yansab', '2020': 'SABIC Agri',
    '4190': 'Jarir', '4200': 'Aldrees', '4002': 'Mouwasat', '2060': 'Tasnee', '2310': 'Sipchem',
    '4164': 'Nahdi', '1831': 'Maharah', '1810': 'Seera', '1830': 'Fitness Time', '1302': 'Bawan',
    '6001': 'Americana', '7202': 'Solutions', '7203': 'Elm', '7204': 'Al Masane', '7200': 'Moammar',
    '1060': 'SABB', '1030': 'SAIB', '1020': 'Jazira', '1080': 'ANB', '1050': 'BSF',
    '5110': 'Saudi Elec', '2190': 'SISCO', '3030': 'Saudi Cement', '3040': 'Qassim Cem',
    '1924': 'Developer', '2003': 'APPC', '4031': 'SGS', '4300': 'Dar Alarkan', '4230': 'Red Sea',
    'TASI': 'TASI', '^TASI': 'TASI'
};

const processMarketIntelligence = (tweets) => {
    try {
        if (!Array.isArray(tweets)) return null;

        const tickers = {};
        const sentiment = { bullish: 0, bearish: 0, neutral: 0, score: 50 };

        // Arabic & English Keywords
        const BULLISH_TERMS = ['breakout', 'bull', 'buy', 'long', 'support', 'profit', 'target', 'green', 'up', 'bounce', 'accumulate', 'moon', 'rocket', 'call', 'entry', 'اختراق', 'شراء', 'صعود', 'هدف', 'ايجابي', 'دعم', 'ارباح', 'تجميع'];
        const BEARISH_TERMS = ['breakdown', 'bear', 'sell', 'short', 'resistance', 'loss', 'drop', 'red', 'down', 'crash', 'put', 'exit', 'dump', 'كسر', 'بيع', 'هبوط', 'سلبي', 'مقاومة', 'خسارة', 'تصريف', 'انهيار'];

        // Name to Ticker Mapping for better extraction
        const NAME_TO_TICKER = {
            'aramco': '2222', 'ارامكو': '2222', 'أرامكو': '2222',
            'rajhi': '1120', 'الراجحي': '1120',
            'sabic': '2010', 'سابك': '2010',
            'stc': '7010', 'اس تي سي': '7010',
            'snb': '1180', 'اهلي': '1180', 'الأهلي': '1180',
            'acwa': '2082', 'اكوا': '2082',
            'maaden': '1211', 'معادن': '1211',
            'alinma': '1150', 'انماء': '1150', 'الإنماء': '1150',
            'albilad': '1140', 'البلاد': '1140',
            'riyad': '1010', 'الرياض': '1010',
            'lucid': 'LCID', 'لوسيد': 'LCID',
            'tesla': 'TSLA', 'تسلا': 'TSLA'
        };

        const tickerRegex = /\b\d{4}\b|\$[A-Z]{2,5}/g;

        tweets.forEach(t => {
            if (!t || typeof t.content !== 'string') return; // SAFETY CHECK
            const text = t.content.toLowerCase();

            // Sentiment Analysis
            let score = 0;
            BULLISH_TERMS.forEach(w => { if (text.includes(w)) score++; });
            BEARISH_TERMS.forEach(w => { if (text.includes(w)) score--; });

            if (score > 0) sentiment.bullish++;
            else if (score < 0) sentiment.bearish++;
            else sentiment.neutral++;

            // Ticker Extraction (Code based)
            const matches = t.content.match(tickerRegex);
            if (matches) {
                matches.forEach(m => {
                    const s = m.replace('$', '');
                    if (s.match(/^\d{4}$/) && (parseInt(s) >= 2020 && parseInt(s) <= 2035)) return;
                    tickers[s] = (tickers[s] || 0) + 1;
                });
            }

            // Ticker Extraction (Name based)
            Object.keys(NAME_TO_TICKER).forEach(name => {
                if (text.includes(name)) {
                    const symbol = NAME_TO_TICKER[name];
                    tickers[symbol] = (tickers[symbol] || 0) + 1;
                }
            });
        });

        // Score Calculation
        const total = sentiment.bullish + sentiment.bearish + sentiment.neutral;
        if (total > 0) {
            const ratio = (sentiment.bullish + 0.5 * sentiment.neutral) / total;
            sentiment.score = Math.round(ratio * 100);
        }

        // Sort tickers & Map Names
        const sortedTickers = Object.entries(tickers)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8) // Increased to 8 to ensure slider has content
            .map(([symbol, count]) => ({
                symbol,
                name: TICKER_MAP[symbol] || symbol,
                count
            }));

        return { sentiment, tickers: sortedTickers };
    } catch (e) {
        console.error('Intelligence Processing Failed:', e);
        return { sentiment: { bullish: 0, bearish: 0, neutral: 0, score: 50 }, tickers: [] };
    }
};

// ============ MARKET INTELLIGENCE LOGIC ============
// (Logic remains distinct, separated from UI)

// Enhanced Ticker Branding (Colors + Initials)
const getStockStyle = (name) => {
    const n = name.toLowerCase();
    if (n.includes('aramco')) return { bg: '#006400', letter: 'A', color: '#4ade80' }; // Aramco Green
    if (n.includes('rajhi')) return { bg: '#1e3a8a', letter: 'R', color: '#60a5fa' }; // Rajhi Blue
    if (n.includes('sabic')) return { bg: '#0f766e', letter: 'S', color: '#2dd4bf' }; // SABIC Teal
    if (n.includes('stc')) return { bg: '#4c1d95', letter: 'S', color: '#a78bfa' }; // STC Purple
    if (n.includes('bank')) return { bg: '#1e3a8a', letter: 'B', color: '#60a5fa' };
    return { bg: '#334155', letter: name[0], color: '#cbd5e1' }; // Default Slate
};

// ============ PREMIUM DARK DASHBOARD (SHINY) ============
const SentimentDashboard = ({ sentiment, tickers }) => {
    const [tickerIndex, setTickerIndex] = useState(0);

    useEffect(() => {
        if (tickers.length <= 1) return;
        const interval = setInterval(() => {
            setTickerIndex(prev => (prev + 1) % tickers.length);
        }, 6000); // 6 Seconds Slide
        return () => clearInterval(interval);
    }, [tickers.length]);

    const activeTicker = tickers.length > 0 ? tickers[tickerIndex] : null;

    // Determine Market Mood Text & Color (Professional Investor Wording)
    let mood = "Neutral";
    let moodColor = "#94a3b8";
    if (sentiment.score >= 60) { mood = "Bullish"; moodColor = "#10b981"; }
    if (sentiment.score >= 75) { mood = "Strong Buy"; moodColor = "#0ea5e9"; }
    if (sentiment.score <= 40) { mood = "Bearish"; moodColor = "#f59e0b"; }
    if (sentiment.score <= 25) { mood = "Strong Sell"; moodColor = "#ef4444"; }

    return (
        <div className="animate-fade-in" style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            borderRadius: '24px', padding: '1rem', marginBottom: '1rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Shine Overlay */}
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
                        {sentiment.score}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', marginTop: '2px' }}>
                        {mood}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '0.75rem', alignItems: 'center' }}>

                {/* LEFT: Gauge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Stats Row with spacing */}
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
                            width: `${sentiment.score}%`,
                            background: `linear-gradient(90deg, ${moodColor} 0%, ${moodColor}dd 100%)`,
                            height: '100%', borderRadius: '8px',
                            boxShadow: `0 0 20px 3px ${moodColor}60`,
                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative'
                        }}>
                            {/* Shimmer */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'shimmer 2s infinite'
                            }} />
                        </div>
                    </div>

                    {/* Mood Labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'white', fontWeight: 600 }}>
                        <span>Extreme Fear</span>
                        <span>Neutral</span>
                        <span>Extreme Greed</span>
                    </div>
                </div>

                {/* RIGHT: Hot Tickers Card */}
                <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '16px', padding: '0.875rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'white', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <Flame size={14} color="#f97316" fill="#f97316" style={{ filter: 'drop-shadow(0 0 4px #f97316)' }} /> HOT TICKERS
                        {tickers.length > 0 && <div style={{ width: '5px', height: '5px', background: '#10b981', borderRadius: '50%', marginLeft: 'auto', boxShadow: '0 0 6px #10b981' }} />}
                    </div>

                    {activeTicker ? (
                        <div key={tickerIndex} className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Fixed Size Logo Container */}
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}>
                                <StockLogo ticker={activeTicker.symbol} size={28} />
                            </div>
                            {/* Two Row Text: Name/Symbol on top, Mentions on bottom */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{activeTicker.name}</span>
                                    <span style={{ color: '#e2e8f0', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{activeTicker.symbol}</span>
                                </div>
                                <span style={{
                                    background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                                    whiteSpace: 'nowrap', boxShadow: '0 0 8px rgba(16,185,129,0.2)', width: 'fit-content'
                                }}>
                                    {activeTicker.count} mentions
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                            Scanning market...
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
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

// Tweet Card Component
const TweetCard = ({ tweet, index, showRank = false, rankNumber = 0 }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);

    // SAFETY CHECK: If tweet is malformed, skip rendering to prevent crash
    if (!tweet || !tweet.content) return null;

    const wasArabic = tweet.originalLang === 'ar' || tweet.isTranslated;
    const contentText = showOriginal ? (tweet.originalContent || tweet.content) : tweet.content;

    const maxLength = 280;
    const isLongContent = contentText.length > maxLength;
    const displayContent = isLongContent && !showFullContent ? contentText.slice(0, maxLength) + '...' : contentText;

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const openTweet = () => window.open(tweet.url, '_blank', 'noopener,noreferrer');

    const isArabic = /[\u0600-\u06FF]/.test(displayContent);

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
            <div style={{ padding: '0.75rem 0.75rem 0.5rem', display: 'flex', gap: '10px' }}>
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
                            <span
                                onClick={(e) => { e.stopPropagation(); setShowOriginal(!showOriginal); }}
                                title={showOriginal ? "Show Translation" : "Show Original Arabic"}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                                    background: showOriginal ? '#dbeafe' : '#fef3c7',
                                    color: showOriginal ? '#1e40af' : '#92400e',
                                    fontSize: '0.6rem', padding: '2px 6px', borderRadius: '6px', fontWeight: 600,
                                    cursor: 'pointer', userSelect: 'none'
                                }}
                            >
                                {showOriginal ? '🇺🇸 EN' : '🇸🇦 AR'}
                            </span>
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
            <div style={{ padding: '0 0.75rem' }}>
                <p style={{
                    fontSize: '0.95rem', lineHeight: 1.6, color: '#1e293b',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    direction: isArabic ? 'rtl' : 'ltr',
                    textAlign: isArabic ? 'right' : 'left',
                    fontFamily: isArabic ? 'Noto Sans Arabic, sans-serif' : 'inherit'
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
                display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0.75rem',
                marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', background: '#fafafa'
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
// Leaderboard Card (Collapsible)
const LeaderboardCard = ({ leaderboard }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!leaderboard?.length) return null;

    return (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
                    padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={20} color="#fbbf24" />
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Top Influencers</span>
                </div>
                {isExpanded ? <ChevronRight size={20} color="white" style={{ transform: 'rotate(-90deg)' }} /> : <ChevronRight size={20} color="white" style={{ transform: 'rotate(90deg)' }} />}
            </div>

            {isExpanded && (
                <div className="animate-slide-down" style={{ padding: '0.5rem' }}>
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
            )}
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

// Tab Configuration with Tooltips
const TABS = [
    { id: 'fresh', label: 'Fresh', icon: Clock, description: 'Latest posts', tooltip: 'See the newest tweets from elite Saudi market analysts, updated in real-time.' },
    { id: 'trending', label: 'Trending', icon: Flame, description: 'Hot right now', tooltip: 'Tweets gaining traction right now based on engagement velocity.' },
    { id: 'top-analysts', label: 'Top Analysts', icon: Crown, description: 'Elite insights', tooltip: 'Curated content from verified analysts with the highest accuracy.' },
    { id: 'most-engaged', label: 'Most Engaged', icon: BarChart2, description: 'Top performing', tooltip: 'Tweets with the highest likes, retweets, and replies.' }
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
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Tooltip Component (following app design pattern)
    const TooltipIcon = ({ id, content, title, color = '#94a3b8' }) => {
        const tooltipContent = activeTooltip === id && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 999999, padding: '1rem', backdropFilter: 'blur(4px)'
            }} onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }}>
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '1.5rem', maxWidth: '320px', width: '100%',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', animation: 'fadeIn 0.2s ease'
                }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
                        <button onClick={() => setActiveTooltip(null)} style={{
                            background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                        }}>✕</button>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{content}</p>
                </div>
            </div>
        );
        return (
            <>
                <div onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === id ? null : id); }}
                    style={{ cursor: 'pointer', padding: '4px', opacity: 0.7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={14} color={color} />
                </div>
                {tooltipContent && <SafePortal>{tooltipContent}</SafePortal>}
            </>
        );
    };

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
                let fetchedTweets = data.tweets || [];

                // ROBUST FALLBACK: If Trending is empty, try fetching Fresh and filtering/sorting locally
                if (tab === 'trending' && fetchedTweets.length === 0) {
                    console.log('Trending empty, falling back to Fresh sort');
                    const fallbackUrl = `${baseUrl}?tab=fresh`;
                    const fallbackResponse = await fetch(fallbackUrl);
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.success && fallbackData.tweets?.length > 0) {
                        fetchedTweets = fallbackData.tweets
                            .sort((a, b) => b.engagementScore - a.engagementScore)
                            .slice(0, 20); // Top 20 relevant
                    }
                }

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
        <ErrorBoundary>
            <div className="flex-col" style={{ padding: '0.75rem', gap: '0.75rem', paddingBottom: '6rem' }}>
                <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

                {/* Header */}
                <div className="animate-fade-in">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
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

                {/* Market Intelligence Dashboard with Tooltip */}
                {marketIntelligence && (
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                            <TooltipIcon
                                id="market-pulse"
                                title="Market Pulse"
                                content="Real-time sentiment analysis from elite Saudi market analysts on X (Twitter). The score indicates overall market mood: Strong Buy (75+), Bullish (60-74), Neutral (41-59), Bearish (26-40), Strong Sell (0-25). Hot Tickers shows the most discussed stocks."
                                color="rgba(255,255,255,0.7)"
                            />
                        </div>
                        <SentimentDashboard sentiment={marketIntelligence.sentiment} tickers={marketIntelligence.tickers} />
                    </div>
                )}

                {/* Smart Tabs with Tooltips */}
                <div className="animate-slide-up" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'
                }}>
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <div key={tab.id} style={{ position: 'relative' }}>
                                <button onClick={() => handleTabChange(tab.id)} style={{
                                    padding: '12px 8px', borderRadius: '16px', border: 'none', width: '100%', height: '100%', minHeight: '80px',
                                    background: isActive ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' : 'white',
                                    color: isActive ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.7rem',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 8px 24px rgba(15, 23, 42, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    <Icon size={20} color={isActive ? '#fbbf24' : '#64748b'} />
                                    {tab.label}
                                </button>
                                <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                                    <TooltipIcon id={`tab-${tab.id}`} title={tab.label} content={tab.tooltip} color={isActive ? 'rgba(255,255,255,0.6)' : '#94a3b8'} />
                                </div>
                            </div>
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
        </ErrorBoundary>
    );
}
