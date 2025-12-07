import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import {
    Users, Heart, MessageCircle, Share2, ExternalLink,
    RefreshCw, Filter, TrendingUp, Sparkles, Clock,
    Image as ImageIcon, ChevronDown, Star, Zap
} from 'lucide-react';

// X Logo SVG Component
const XLogo = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Profile Avatar Component with real image or gradient fallback
const ProfileAvatar = ({ username, displayName, profileImage, size = 48 }) => {
    const [imgError, setImgError] = useState(false);

    const colors = [
        ['#10b981', '#06b6d4'],
        ['#f59e0b', '#ef4444'],
        ['#8b5cf6', '#ec4899'],
        ['#3b82f6', '#06b6d4'],
        ['#14b8a6', '#22c55e'],
        ['#f97316', '#eab308']
    ];

    const colorIndex = username.charCodeAt(0) % colors.length;
    const [color1, color2] = colors[colorIndex];
    const initial = displayName?.charAt(0) || username?.charAt(0) || 'U';

    // If we have a profile image and it hasn't errored, show it
    if (profileImage && !imgError) {
        return (
            <img
                src={profileImage}
                alt={displayName || username}
                onError={() => setImgError(true)}
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0
                }}
            />
        );
    }

    // Fallback to gradient initial
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: size * 0.4,
            boxShadow: `0 4px 12px ${color1}40`,
            border: '3px solid white',
            flexShrink: 0
        }}>
            {initial.toUpperCase()}
        </div>
    );
};

// Tweet Image Gallery Component
const TweetImageGallery = ({ images }) => {
    const [loadedImages, setLoadedImages] = useState({});
    const [lightboxImage, setLightboxImage] = useState(null);

    if (!images || images.length === 0) return null;

    const handleImageLoad = (index) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    const gridStyle = images.length === 1 ? {
        display: 'block'
    } : images.length === 2 ? {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px'
    } : {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '4px'
    };

    return (
        <>
            <div style={{
                ...gridStyle,
                borderRadius: '16px',
                overflow: 'hidden',
                marginTop: '12px'
            }}>
                {images.slice(0, 4).map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setLightboxImage(img)}
                        style={{
                            position: 'relative',
                            paddingBottom: images.length === 1 ? '56.25%' : '100%',
                            background: '#f1f5f9',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                    >
                        {!loadedImages[index] && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
                            }}>
                                <ImageIcon size={24} color="#94a3b8" />
                            </div>
                        )}
                        <img
                            src={img}
                            alt={`Tweet image ${index + 1}`}
                            onLoad={() => handleImageLoad(index)}
                            onError={(e) => e.target.style.display = 'none'}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: loadedImages[index] ? 1 : 0,
                                transition: 'opacity 0.3s ease'
                            }}
                        />
                        {images.length > 4 && index === 3 && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.5rem'
                            }}>
                                +{images.length - 4}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        cursor: 'zoom-out'
                    }}
                >
                    <img
                        src={lightboxImage}
                        alt="Full size"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                        }}
                    />
                </div>
            )}
        </>
    );
};

// Tweet Card Component with Translation & RTL Support
const TweetCard = ({ tweet, index, onLike }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Detect if text contains Arabic characters
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return arabicPattern.test(text);
    };

    const originalIsArabic = isArabic(tweet.content);

    // Auto-translate Arabic content on mount
    useEffect(() => {
        const translateContent = async () => {
            if (originalIsArabic && !translatedContent) {
                setIsTranslating(true);
                try {
                    const response = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text: tweet.content,
                            targetLang: 'en'
                        })
                    });
                    const data = await response.json();
                    if (data.translatedText) {
                        setTranslatedContent(data.translatedText);
                    }
                } catch (err) {
                    console.error('Translation failed:', err);
                }
                setIsTranslating(false);
            }
        };
        translateContent();
    }, [tweet.content, originalIsArabic, translatedContent]);

    // Use translated content if available
    const contentToDisplay = translatedContent || tweet.content;
    const maxLength = 280;
    const isLongContent = contentToDisplay.length > maxLength;
    const displayContent = isLongContent && !showFullContent
        ? contentToDisplay.slice(0, maxLength) + '...'
        : contentToDisplay;

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (onLike) onLike(tweet.id, !isLiked);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Tweet by @${tweet.username}`,
                    text: contentToDisplay.slice(0, 100),
                    url: tweet.url
                });
            } else {
                await navigator.clipboard.writeText(tweet.url);
            }
        } catch (e) { }
    };

    const openTweet = () => {
        window.open(tweet.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card
            className="animate-slide-up"
            style={{
                padding: 0,
                overflow: 'hidden',
                animationDelay: `${index * 0.05}s`,
                cursor: 'default'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '1rem 1rem 0.75rem',
                display: 'flex',
                gap: '12px'
            }}>
                <ProfileAvatar
                    username={tweet.username}
                    displayName={tweet.displayName}
                    profileImage={tweet.profileImage}
                    size={48}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '0.95rem'
                        }}>
                            {tweet.displayName}
                        </span>
                        <span style={{
                            color: '#64748b',
                            fontSize: '0.875rem'
                        }}>
                            @{tweet.username}
                        </span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{
                            color: '#94a3b8',
                            fontSize: '0.8rem'
                        }}>
                            {tweet.relativeTime}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Badge
                            color="info"
                            style={{
                                fontSize: '0.625rem',
                                padding: '0.125rem 0.5rem',
                                display: 'inline-flex'
                            }}
                        >
                            {tweet.category}
                        </Badge>
                        {/* Arabic Language Indicator */}
                        {originalIsArabic && (
                            <span
                                title="Translated from Arabic"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    fontSize: '0.6rem',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    fontWeight: 600
                                }}
                            >
                                🇸🇦 AR
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={openTweet}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.color = '#0f172a';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#94a3b8';
                    }}
                    title="View on X"
                >
                    <ExternalLink size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '0 1rem' }}>
                {isTranslating ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        padding: '8px 0'
                    }}>
                        <RefreshCw size={14} className="spin" />
                        Translating...
                    </div>
                ) : (
                    <p style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        color: '#1e293b',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        // Text always LTR for translated/English content
                        direction: 'ltr',
                        textAlign: 'left'
                    }}>
                        {displayContent}
                    </p>
                )}
                {isLongContent && !isTranslating && (
                    <button
                        onClick={() => setShowFullContent(!showFullContent)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#06b6d4',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            padding: '4px 0',
                            marginTop: '4px'
                        }}
                    >
                        {showFullContent ? 'Show less' : 'Show more'}
                    </button>
                )}

                {/* Images */}
                <TweetImageGallery images={tweet.images} />
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0.75rem 1rem',
                marginTop: '0.75rem',
                borderTop: '1px solid #f1f5f9'
            }}>
                <button
                    onClick={handleLike}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: isLiked ? '#ef4444' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        borderRadius: '9999px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Heart
                        size={18}
                        fill={isLiked ? '#ef4444' : 'none'}
                        style={{ transition: 'all 0.2s' }}
                    />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                    onClick={handleShare}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        borderRadius: '9999px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Share2 size={18} />
                    <span>Share</span>
                </button>

                <button
                    onClick={openTweet}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        borderRadius: '9999px',
                        transition: 'all 0.2s'
                    }}
                >
                    <XLogo size={16} />
                    <span>View</span>
                </button>
            </div>
        </Card>
    );
};

// Account Filter Chip Component
const AccountChip = ({ account, isSelected, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            border: isSelected ? '2px solid #06b6d4' : '2px solid #e2e8f0',
            background: isSelected ? 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)' : 'white',
            color: isSelected ? '#0891b2' : '#64748b',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isSelected ? '0 2px 8px rgba(6, 182, 212, 0.2)' : 'none'
        }}
    >
        {account.displayName || account.username}
    </button>
);

// Loading Skeleton
const TweetSkeleton = () => (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', display: 'flex', gap: '12px' }}>
            <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
            }} />
            <div style={{ flex: 1 }}>
                <div style={{
                    width: '60%',
                    height: 16,
                    borderRadius: 8,
                    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    marginBottom: 8
                }} />
                <div style={{
                    width: '40%',
                    height: 12,
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                }} />
            </div>
        </div>
        <div style={{ padding: '0 1rem 1rem' }}>
            <div style={{
                width: '100%',
                height: 60,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
            }} />
        </div>
    </Card>
);

// Main Component
export default function XCommunity() {
    const [tweets, setTweets] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const refreshIntervalRef = useRef(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch tweets function
    const fetchTweets = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true); else setLoading(true);
            setError(null);

            const baseUrl = import.meta.env.DEV
                ? 'http://localhost:5001/api/x-community'
                : '/api/x-community';

            const url = isRefresh ? `${baseUrl}?refresh=true` : baseUrl;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setTweets(data.tweets || []);
                setAccounts(data.accounts || []);
                setLastUpdated(new Date());
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

    // Initial fetch and auto-refresh setup
    useEffect(() => {
        fetchTweets();

        // Auto-refresh every 5 minutes
        refreshIntervalRef.current = setInterval(() => {
            console.log('🔄 Auto-refreshing X Community...');
            fetchTweets(true);
        }, 5 * 60 * 1000);

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [fetchTweets]);

    // Filter tweets by selected account
    const filteredTweets = selectedAccount === 'all'
        ? tweets
        : tweets.filter(t => t.username.toLowerCase() === selectedAccount.toLowerCase());

    // Manual refresh handler
    const handleRefresh = () => {
        if (!refreshing) {
            fetchTweets(true);
        }
    };

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                        }}>
                            <XLogo size={26} color="white" />
                        </div>
                        <div>
                            <h1 className="h1" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
                                X Community
                            </h1>
                            <p className="caption" style={{ marginTop: '2px' }}>
                                {accounts.length} market influencers
                            </p>
                        </div>
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* Stats Banner */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
                border: 'none',
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'
                }} />
                <Sparkles
                    size={60}
                    style={{
                        position: 'absolute',
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0.1,
                        color: 'white'
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Zap size={18} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.875rem' }}>
                            LIVE FEED
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                                {tweets.length}
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                Latest Posts
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>
                                {accounts.length}
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                Influencers
                            </span>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                padding: '10px 16px',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                opacity: refreshing ? 0.7 : 1
                            }}
                        >
                            <RefreshCw
                                size={16}
                                style={{
                                    animation: refreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                            {refreshing ? 'Updating...' : 'Refresh'}
                        </button>
                    </div>
                    {lastUpdated && (
                        <div style={{
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#64748b',
                            fontSize: '0.75rem'
                        }}>
                            <Clock size={12} />
                            Updated {lastUpdated.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            </Card>

            {/* Account Filters */}
            <div className="animate-slide-up">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        marginBottom: showFilters ? '12px' : 0,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} color="#64748b" />
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {selectedAccount === 'all'
                                ? 'All Accounts'
                                : accounts.find(a => a.username.toLowerCase() === selectedAccount.toLowerCase())?.displayName || selectedAccount
                            }
                        </span>
                    </div>
                    <ChevronDown
                        size={18}
                        color="#64748b"
                        style={{
                            transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }}
                    />
                </button>

                {showFilters && (
                    <div
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '12px',
                            background: '#f8fafc',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <AccountChip
                            account={{ displayName: 'All Accounts' }}
                            isSelected={selectedAccount === 'all'}
                            onClick={() => {
                                setSelectedAccount('all');
                                setShowFilters(false);
                            }}
                        />
                        {accounts.map(account => (
                            <AccountChip
                                key={account.username}
                                account={account}
                                isSelected={selectedAccount.toLowerCase() === account.username.toLowerCase()}
                                onClick={() => {
                                    setSelectedAccount(account.username);
                                    setShowFilters(false);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Error State */}
            {error && !loading && (
                <Card style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #fca5a5',
                    padding: '1.25rem',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '8px' }}>
                        Unable to load tweets
                    </p>
                    <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginBottom: '12px' }}>
                        {error}
                    </p>
                    <button
                        onClick={() => fetchTweets()}
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {[1, 2, 3].map(i => (
                        <TweetSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Tweets Feed */}
            {!loading && !error && (
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {filteredTweets.length > 0 ? (
                        filteredTweets.map((tweet, index) => (
                            <TweetCard
                                key={tweet.id}
                                tweet={tweet}
                                index={index}
                            />
                        ))
                    ) : (
                        <Card style={{
                            padding: '3rem 1.5rem',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                        }}>
                            <XLogo size={48} color="#94a3b8" />
                            <h3 style={{
                                marginTop: '16px',
                                marginBottom: '8px',
                                color: '#0f172a',
                                fontWeight: 700
                            }}>
                                No tweets yet
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                {selectedAccount === 'all'
                                    ? 'Tweets from the community will appear here'
                                    : 'No recent tweets from this account'
                                }
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* CSS for animations */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
