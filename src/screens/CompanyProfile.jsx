import React, { useState, useEffect } from 'react';
import SafePortal from '../components/shared/SafePortal';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, TrendingUp, TrendingDown, Star, Share2, Plus, Bell,
    BarChart3, DollarSign, PieChart, Target, Building2, Globe, ChevronRight,
    Users, MessageCircle, Heart, Repeat2, Info, X
} from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import { StockLogo, SAUDI_STOCKS, US_STOCKS, EGYPT_STOCKS } from '../components/StockCard';
import ProgressBar from '../components/ProgressBar';
import StockMovementCard from '../components/StockMovementCard';
import { useToast } from '../components/shared/Toast';
import Tooltip from '../components/shared/Tooltip';

// Static content (news, posts) - these would come from a content API in production
const STATIC_CONTENT = {
    '2222': {
        news: [
            {
                title: "Aramco's First Quarterly Dividend Gain in Breaks Billions",
                time: '2h ago',
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
            },
            {
                title: "Aramco strikes capital deal to open Paris office",
                time: '5h ago',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Ahmed Al-Saud',
                avatar: 'https://i.pravatar.cc/150?img=12',
                time: '2h ago',
                content: 'Aramco looking strong! Great dividend yield and solid fundamentals. 🚀',
                likes: 24,
                comments: 5,
                shares: 2
            },
        ],
    },
    '1120': {
        news: [
            {
                title: "Al Rajhi Bank Reports Strong Q4 Earnings",
                time: '1h ago',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Mohammed Investor',
                avatar: 'https://i.pravatar.cc/150?img=8',
                time: '1h ago',
                content: 'Al Rajhi continues to dominate Islamic banking. Strong results! 💪',
                likes: 42,
                comments: 12,
                shares: 5
            }
        ],
    }
};

// Format helpers - always 2 decimal places
const formatNumber = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    if (typeof val === 'string') return val;
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
    return Number(val).toFixed(2);
};

const formatPercent = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    return (val * 100).toFixed(2) + '%';
};

const formatCurrency = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    return formatNumber(val) + ' SAR';
};

const formatPrice = (val) => {
    if (!val && val !== 0) return 'N/A';
    return Number(val).toFixed(2);
};

export default function CompanyProfile() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const { prices, loading: pricesLoading } = usePrices();
    const { showToast } = useToast();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [detailedStock, setDetailedStock] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const handleToggleWatchlist = () => {
        setIsWatchlisted(!isWatchlisted);
        showToast(
            isWatchlisted ? 'Removed from watchlist' : 'Added to watchlist ⭐',
            isWatchlisted ? 'info' : 'success'
        );
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareText = `Check out ${stockMeta.name || symbol} on Bhidy!`;

        if (navigator.share) {
            try {
                await navigator.share({ title: shareText, url: shareUrl });
                showToast('Shared successfully!', 'success');
            } catch (e) {
                // User cancelled
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const handleSetAlert = () => {
        showToast('Set price alerts in the Alerts section', 'info');
        navigate('/investor/alerts');
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // === ROBUST SYMBOL RESOLUTION ===
    // The URL may contain just the symbol number (e.g., 2222) or with suffix (e.g., 2222.SR)
    // We need to resolve the full symbol for API calls
    const resolveFullSymbol = (rawSymbol) => {
        // If already has a suffix, use as-is
        if (rawSymbol.includes('.')) return rawSymbol;

        // Check if it's a numeric Saudi symbol (most common case)
        if (/^\d+$/.test(rawSymbol)) {
            return rawSymbol + '.SR';
        }

        // Check if it's a known index
        if (rawSymbol.startsWith('^')) return rawSymbol;

        // For alphabetic symbols, check common patterns
        // EGX symbols typically don't have periods in URL but end with .CA
        // US symbols don't have periods
        // This is a heuristic - we default to no suffix for alphabetic
        return rawSymbol;
    };

    const fullSymbol = resolveFullSymbol(symbol);

    // Fetch detailed profile data with auto-refresh
    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            try {
                // Use fullSymbol (with market suffix) for API call
                const res = await fetch(`/api/stock-profile?symbol=${fullSymbol}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) setDetailedStock(data);
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            } finally {
                if (isMounted) setProfileLoading(false);
            }
        };

        // Initial fetch
        fetchProfile();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchProfile, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fullSymbol]);

    // Get real-time stock data from API
    // Dynamic stock key resolution based on market context from symbol format
    const isSaudi = !fullSymbol.includes('.') || fullSymbol.endsWith('.SR');
    const isEgypt = fullSymbol.endsWith('.CA');

    // Try to find exact match or match without suffix in prices
    const priceKey = Object.keys(prices).find(k => k === fullSymbol || k === symbol || k === symbol.split('.')[0] || k.startsWith(symbol));
    const stockBasic = prices[priceKey] || {};

    // Smart merge to prefer valid data over 0/N/A
    // This prevents "Live" data error zeros from overwriting our robust Fallback data
    const smartMerge = (detailed, basic) => {
        const merged = { ...detailed }; // Start with detailed (fallback/rich)
        if (!basic) return merged;

        Object.keys(basic).forEach(key => {
            const bVal = basic[key];
            const dVal = merged[key]; // Check against current merged value

            // Skip if basic value is invalid
            if (bVal === null || bVal === undefined || bVal === 'N/A') return;

            // CRITICAL: If basic is 0 but detailed has a value, keep detailed.
            // This handles cases where "Live" API returns 0s for open/high/low/MA
            if (bVal === 0 && dVal && dVal !== 0) return;

            merged[key] = bVal;
        });
        return merged;
    };

    // Merge detailed data with real-time price updates using smart logic
    const stock = smartMerge(detailedStock || {}, stockBasic);

    // Unified loading state
    const loading = pricesLoading && !stock.price; // Only block if we have NO price. Profile loading shouldn't block main view if price exists? 
    // Actually, user complained about N/A. So maybe we should wait for profile?
    // But blocking the whole UI for profile might feel slow.
    // Let's stick to non-blocking profile if price is available, but the fields will pop in.
    // Or, for the first load, wait for profile.

    // Let's just use the original loading check which checks !stock.price.
    // So if stock.price comes from detailedStock OR stockBasic, we show.

    // Combine metadata sources
    // Note: SAUDI_STOCKS is imported, but we should potentially import US_STOCKS/EGYPT_STOCKS or just use what we have in prices/fallback
    const rawSymbol = symbol.split('.')[0];
    const stockMeta = SAUDI_STOCKS[symbol] || SAUDI_STOCKS[rawSymbol] ||
        US_STOCKS[symbol] || US_STOCKS[rawSymbol] ||
        EGYPT_STOCKS[symbol] || EGYPT_STOCKS[rawSymbol] || {};
    const staticContent = STATIC_CONTENT[symbol] || STATIC_CONTENT[symbol.split('.')[0]] || {};

    // Currency helper
    const currency = isEgypt ? 'EGP' : (isSaudi && !symbol.match(/^[A-Z]+$/) ? 'SAR' : 'USD');

    // Override formatCurrency for this component instance
    const formatCurrencyLocal = (val) => {
        if (!val || val === 'N/A') return 'N/A';
        return formatNumber(val) + ' ' + currency;
    };

    const isPositive = (stock.change || stock.changePercent || 0) >= 0;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'valuation', label: 'Valuation', icon: PieChart },
        { id: 'analysts', label: 'Analysts', icon: Target },
        { id: 'about', label: 'About', icon: Building2 },
    ];

    // Tooltip component
    const TooltipIcon = ({ id, content, title, icon, color = '#94a3b8' }) => {
        const tooltipContent = activeTooltip === id && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1rem',
                backdropFilter: 'blur(4px)'
            }} onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(null);
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    maxWidth: '320px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative',
                    width: '100%'
                }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setActiveTooltip(null)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        {icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>}
                        {title && <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>{title}</h2>}
                        <div style={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.6,
                            color: '#4b5563'
                        }}>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip(activeTooltip === id ? null : id);
                    }}
                    style={{
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.7,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '4px'
                    }}
                >
                    <Info size={14} color={color} />
                </div>
                {tooltipContent && <SafePortal>{tooltipContent}</SafePortal>}
            </>
        );
    };

    // Helper to inject tooltip into Card title
    const CardTitleWithTooltip = ({ title, tooltipId, tooltipContent, tooltipIcon, icon }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon}
            <span>{title}</span>
            <TooltipIcon id={tooltipId} title={title} content={tooltipContent} icon={tooltipIcon} />
        </div>
    );

    if (loading && !stock.price) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#1f2937', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p>Loading stock data...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Premium Header with Gradient */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #0891b2 50%, #6366f1 100%)',
                padding: '1.5rem',
                paddingTop: '2rem',
                paddingBottom: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.5
                }} />

                {/* Navigation Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Tooltip text={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}>
                            <button
                                onClick={handleToggleWatchlist}
                                style={{
                                    background: isWatchlisted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Star size={20} color="white" fill={isWatchlisted ? 'white' : 'none'} />
                            </button>
                        </Tooltip>
                        <Tooltip text="Share this stock">
                            <button
                                onClick={handleShare}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Share2 size={20} color="white" />
                            </button>
                        </Tooltip>
                    </div>
                </div>

                {/* Company Info */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '60px', height: '60px',
                            background: 'white',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden'
                        }}>
                            <StockLogo ticker={symbol.split('.')[0]} logoUrl={stock.logo} size={52} />
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600 }}>
                                {stock.symbol || symbol}
                            </div>
                            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                {stockMeta.name || stock.name || stock.longName || symbol}
                            </h1>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                            {formatPrice(stock.price)} <span style={{ fontSize: '1.25rem', opacity: 0.8 }}>{currency}</span>
                        </div>

                        {/* Change + Exchange Badge Row */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            marginTop: '0.75rem',
                            flexWrap: 'wrap'
                        }}>
                            {/* Change Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 700
                            }}>
                                {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                {isPositive ? '+' : ''}{formatPrice(stock.change)} ({isPositive ? '+' : ''}{formatPrice(stock.changePercent)}%)
                            </div>

                            {/* Exchange Badge - Right side with glassmorphism */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.875rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.25)'
                            }}>
                                <span style={{ fontSize: '1.25rem' }}>
                                    {stock.exchange === 'NMS' || stock.exchange === 'NGM' || stock.exchange === 'NYQ' ? '🇺🇸' :
                                        stock.exchange === 'SAU' || isSaudi ? '🇸🇦' :
                                            stock.exchange === 'CAI' || isEgypt ? '🇪🇬' :
                                                stock.exchange === 'LSE' ? '🇬🇧' :
                                                    stock.exchange === 'FRA' || stock.exchange === 'GER' ? '🇩🇪' :
                                                        stock.exchange === 'TYO' ? '🇯🇵' :
                                                            stock.exchange === 'NSI' ? '🇮🇳' :
                                                                stock.exchange === 'TOR' ? '🇨🇦' :
                                                                    stock.exchange === 'ASX' ? '🇦🇺' :
                                                                        stock.exchange === 'HKG' ? '🇭🇰' : '🌐'}
                                </span>
                                <div>
                                    <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {stock.exchange === 'NMS' || stock.exchange === 'NGM' || stock.exchange === 'NCM' ? 'NASDAQ' :
                                            stock.exchange === 'NYQ' ? 'NYSE' :
                                                stock.exchange === 'SAU' || isSaudi ? 'Tadawul' :
                                                    stock.exchange === 'CAI' || isEgypt ? 'EGX' :
                                                        stock.exchange === 'LSE' ? 'London' :
                                                            stock.exchange || 'Exchange'}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
                                        Trading in {currency}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        marginTop: '1.5rem'
                    }}>
                        <button
                            onClick={() => navigate('/pick')}
                            style={{
                                background: 'white',
                                color: '#10b981',
                                border: 'none',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Plus size={18} />
                            Pick Stock
                        </button>
                        <button
                            onClick={handleSetAlert}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '2px solid white',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Bell size={18} />
                            Set Alert
                        </button>
                    </div>
                </div>
            </div>

            {/* Modern Pill Tabs */}
            <div style={{
                margin: '-1.5rem 1rem 0',
                background: 'white',
                borderRadius: '16px',
                padding: '0.5rem',
                display: 'flex',
                gap: '0.25rem',
                overflowX: 'auto',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
            }}>
                <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 0.5rem',
                                background: isActive ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'transparent',
                                border: 'none',
                                borderRadius: '12px',
                                color: isActive ? 'white' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                transition: 'all 0.2s',
                                minWidth: 'fit-content'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1.5rem', paddingBottom: '6rem' }}>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* AI Insight Card - Highlights the "Why is this moving?" */}
                        <StockMovementCard symbol={symbol} />

                        {/* Trading Info */}
                        <Card title={<CardTitleWithTooltip title="Trading Information" tooltipId="trading" tooltipIcon="📊" tooltipContent="Key trading data for the current session, including opening price, highs, lows, and volume traded." icon={<BarChart3 size={20} />} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Open" value={formatPrice(stock.open) + ' ' + currency} />
                                <DataCell label="Previous Close" value={formatPrice(stock.prevClose) + ' ' + currency} />
                                <DataCell label="Day High" value={formatPrice(stock.high) + ' ' + currency} />
                                <DataCell label="Day Low" value={formatPrice(stock.low) + ' ' + currency} />
                                <DataCell label="Volume" value={formatNumber(stock.volume)} />
                                <DataCell label="Avg Volume" value={formatNumber(stock.averageVolume)} />
                            </div>
                        </Card>

                        {/* 52-Week Range */}
                        <Card title={<CardTitleWithTooltip title="52-Week Range" tooltipId="52w" tooltipIcon="📅" tooltipContent="The lowest and highest price at which this stock has traded in the previous 52 weeks." />}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.875rem' }}>
                                        {formatPrice(stock.fiftyTwoWeekLow)}
                                    </span>
                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>
                                        {formatPrice(stock.fiftyTwoWeekHigh)}
                                    </span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)',
                                        borderRadius: '10px',
                                        width: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100))}%`
                                            : '50%'
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        left: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100))}%`
                                            : '50%',
                                        top: '-2px',
                                        width: '14px', height: '14px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        border: '3px solid #10b981',
                                        transform: 'translateX(-50%)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="50-Day MA" value={formatPrice(stock.fiftyDayAverage)} />
                                <DataCell label="200-Day MA" value={formatPrice(stock.twoHundredDayAverage)} />
                                <DataCell label="52-Week Change" value={formatPercent(stock.fiftyTwoWeekChange)} highlight />
                                <DataCell label="Beta" value={formatPrice(stock.beta)} />
                            </div>
                        </Card>

                        {/* Key Statistics Quick View */}
                        <Card title={<CardTitleWithTooltip title="Key Statistics" tooltipId="keystats" tooltipIcon="🔑" tooltipContent="Essential financial metrics. Market Cap is total value. P/E Ratio measures valuation. Dividend Yield is the return on investment from dividends." />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Market Cap" value={formatCurrencyLocal(stock.marketCap)} highlight />
                                <DataCell label="P/E Ratio" value={formatPrice(stock.trailingPE || stock.peRatio)} />
                                <DataCell label="EPS" value={formatPrice(stock.trailingEps || stock.eps) + ' ' + currency} />
                                <DataCell label="Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield || stock.dividendYield)} highlight />
                            </div>
                        </Card>

                        {/* NEW: Ownership Structure with Pie Chart Visualization */}
                        <Card title={<CardTitleWithTooltip title="Ownership Structure" tooltipId="ownership" tooltipIcon="👥" tooltipContent="Share distribution showing outstanding shares, float (publicly tradeable), and short interest (shares sold short)." />}>
                            <OwnershipPieChart
                                sharesOutstanding={stock.sharesOutstanding}
                                floatShares={stock.floatShares}
                                sharesShort={stock.sharesShort}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <DataCell label="Shares Outstanding" value={formatNumber(stock.sharesOutstanding)} />
                                <DataCell label="Float Shares" value={formatNumber(stock.floatShares)} />
                                <DataCell label="Short Interest" value={formatNumber(stock.sharesShort)} highlight />
                                <DataCell label="Short % of Float" value={stock.floatShares ? ((stock.sharesShort / stock.floatShares) * 100).toFixed(2) + '%' : 'N/A'} />
                            </div>
                            {/* Short Interest Indicator */}
                            {stock.sharesShort > 0 && stock.floatShares > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Short Interest Level</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (stock.sharesShort / stock.floatShares) > 0.1 ? '#ef4444' : '#10b981' }}>
                                            {((stock.sharesShort / stock.floatShares) * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${Math.min((stock.sharesShort / stock.floatShares) * 100 * 5, 100)}%`,
                                            background: (stock.sharesShort / stock.floatShares) > 0.2 ? '#ef4444' : (stock.sharesShort / stock.floatShares) > 0.1 ? '#f59e0b' : '#10b981',
                                            borderRadius: '4px',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.625rem', color: '#94a3b8' }}>
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Financials Tab */}
                {activeTab === 'financials' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title={<CardTitleWithTooltip title="Revenue & Profitability" tooltipId="revenue" tooltipIcon="💰" tooltipContent="Revenue is the total income. EBITDA is earnings before interest, taxes, depreciation, and amortization. Net Income is the final profit." icon={<DollarSign size={20} />} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Total Revenue" value={formatCurrency(stock.totalRevenue)} highlight />
                                <DataCell label="Revenue Per Share" value={formatPrice(stock.revenuePerShare) + ' SAR'} />
                                <DataCell label="Revenue Growth" value={formatPercent(stock.revenueGrowth)} />
                                <DataCell label="Gross Profits" value={formatCurrency(stock.grossProfits)} />
                                <DataCell label="EBITDA" value={formatCurrency(stock.ebitda)} highlight />
                                <DataCell label="Net Income" value={formatCurrency(stock.netIncomeToCommon)} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Profit Margins" tooltipId="margins" tooltipIcon="📉" tooltipContent="Margins represent the percentage of revenue that becomes profit at different stages. Higher margins generally indicate better efficiency." />}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <ProgressBar label="Profit Margin" value={stock.profitMargins} color="#10b981" />
                                <ProgressBar label="Gross Margin" value={stock.grossMargins} color="#3b82f6" />
                                <ProgressBar label="Operating Margin" value={stock.operatingMargins} color="#8b5cf6" />
                                <ProgressBar label="EBITDA Margin" value={stock.ebitdaMargins} color="#f59e0b" />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Cash Flow" tooltipId="cashflow" tooltipIcon="💸" tooltipContent="Operating Cash Flow is cash from normal business. Free Cash Flow is cash available after capital expenditures. Total Cash is current cash holdings." />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Operating Cash Flow" value={formatCurrency(stock.operatingCashflow)} />
                                <DataCell label="Free Cash Flow" value={formatCurrency(stock.freeCashflow)} highlight />
                                <DataCell label="Total Cash" value={formatCurrency(stock.totalCash)} />
                                <DataCell label="Cash Per Share" value={formatPrice(stock.totalCashPerShare) + ' SAR'} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Balance Sheet" tooltipId="balancesheet" tooltipIcon="📄" tooltipContent="A snapshot of a company's financial health. Total Debt indicates liabilities, while Book Value represents the equity value per share." />}>
                            <SimpleBarChart
                                data={[
                                    { label: 'Total Cash', value: stock.totalCash || 0, displayValue: formatNumber(stock.totalCash), color: '#10b981' },
                                    { label: 'Total Debt', value: stock.totalDebt || 0, displayValue: formatNumber(stock.totalDebt), color: '#ef4444' }
                                ]}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <DataCell label="Total Debt" value={formatCurrency(stock.totalDebt)} />
                                <DataCell label="Debt to Equity" value={formatPrice(stock.debtToEquity) + '%'} />
                                <DataCell label="Current Ratio" value={formatPrice(stock.currentRatio)} />
                                <DataCell label="Book Value" value={formatPrice(stock.bookValue) + ' ' + currency} />
                            </div>
                        </Card>

                        {/* NEW: Liquidity Gauge - Current Ratio vs Quick Ratio */}
                        <Card title={<CardTitleWithTooltip title="Liquidity Analysis" tooltipId="liquidity" tooltipIcon="💧" tooltipContent="Current Ratio measures ability to pay short-term obligations. Quick Ratio excludes inventory for stricter liquidity assessment. Values above 1 indicate good liquidity." />}>
                            <LiquidityGauge currentRatio={stock.currentRatio} quickRatio={stock.quickRatio} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <DataCell label="Current Ratio" value={formatPrice(stock.currentRatio)} highlight />
                                <DataCell label="Quick Ratio" value={formatPrice(stock.quickRatio)} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Valuation Tab */}
                {activeTab === 'valuation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title={<CardTitleWithTooltip title="Valuation Metrics" tooltipId="valuation" tooltipIcon="⚖️" tooltipContent="Metrics to evaluate if a stock is overvalued or undervalued. P/E and EV/EBITDA are common multiples used for comparison." icon={<PieChart size={20} />} />}>
                            {/* P/E Comparison Visualization */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 600 }}>P/E Ratio vs Market Avg</div>
                                <div style={{ height: '40px', background: '#f1f5f9', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    {/* Market Avg Marker (approx 20) */}
                                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#94a3b8', zIndex: 1 }}></div>
                                    <div style={{ position: 'absolute', left: '50%', top: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#64748b' }}>Mkt: 20x</div>

                                    {/* Stock P/E Bar */}
                                    <div style={{
                                        width: `${Math.min(100, ((stock.trailingPE || 0) / 40) * 100)}%`,
                                        height: '24px',
                                        background: (stock.trailingPE || 0) > 20 ? '#ef4444' : '#10b981',
                                        borderRadius: '0 4px 4px 0',
                                        marginLeft: '0',
                                        transition: 'width 1s ease'
                                    }} />
                                    <div style={{ marginLeft: '10px', fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                                        {formatPrice(stock.trailingPE)}x
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Market Cap" value={formatCurrencyLocal(stock.marketCap)} highlight />
                                <DataCell label="Enterprise Value" value={formatCurrencyLocal(stock.enterpriseValue)} />
                                <DataCell label="Trailing P/E" value={formatPrice(stock.trailingPE)} />
                                <DataCell label="Forward P/E" value={formatPrice(stock.forwardPE)} highlight />
                                <DataCell label="Price to Book" value={formatPrice(stock.priceToBook)} />
                                <DataCell label="EV/EBITDA" value={formatPrice(stock.enterpriseToEbitda)} />
                                <DataCell label="Price to Sales" value={formatPrice(stock.priceToSalesTrailing12Months)} highlight />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Earnings & Returns" tooltipId="eps" tooltipIcon="📈" tooltipContent="EPS indicates a company's profitability. ROE measures return on shareholder equity. ROA measures efficiency of total assets." />}>
                            {/* ROE vs ROA Comparison Chart */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <RoaRoeChart roe={stock.returnOnEquity} roa={stock.returnOnAssets} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Trailing EPS" value={formatPrice(stock.trailingEps) + ' ' + currency} highlight />
                                <DataCell label="Forward EPS" value={formatPrice(stock.forwardEps) + ' ' + currency} />
                                <DataCell label="Earnings Growth" value={formatPercent(stock.earningsGrowth)} />
                                <DataCell label="ROE" value={formatPercent(stock.returnOnEquity)} highlight />
                                <DataCell label="ROA" value={formatPercent(stock.returnOnAssets)} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Dividends" tooltipId="dividends" tooltipIcon="💸" tooltipContent="Information on dividend payments. Dividend Yield is the annual dividend income relative to the stock's price." />}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '4px solid #10b981',
                                    fontSize: '1rem', fontWeight: 800, color: '#10b981'
                                }}>
                                    {formatPercent(stock.trailingAnnualDividendYield).replace('%', '')}<span style={{ fontSize: '0.6rem' }}>%</span>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#166534' }}>Annual Yield</div>
                                    <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                                        Pays {formatPrice(stock.trailingAnnualDividendRate)} {currency} per share
                                    </div>
                                </div>
                            </div>

                            {/* Last Dividend Timeline */}
                            {stock.lastDividendDate && (
                                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Dividend Paid</div>
                                            <div style={{ fontWeight: 700, color: '#1f2937' }}>
                                                {formatPrice(stock.lastDividendValue)} {currency} on {new Date(stock.lastDividendDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Dividend Rate" value={formatPrice(stock.trailingAnnualDividendRate) + ' ' + currency} />
                                <DataCell label="Payout Ratio" value={formatPercent(stock.payoutRatio)} />
                                <DataCell label="Last Dividend" value={formatPrice(stock.lastDividendValue) + ' ' + currency} highlight />
                                <DataCell label="Last Div Date" value={stock.lastDividendDate ? new Date(stock.lastDividendDate).toLocaleDateString() : 'N/A'} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Analysts Tab */}
                {activeTab === 'analysts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Recommendation Gauge */}
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                Analyst Consensus
                                <span
                                    data-tooltip-id="analyst_consensus_tooltip"
                                    style={{
                                        cursor: 'help',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        background: '#f1f5f9',
                                        color: '#64748b',
                                        fontSize: '0.7rem',
                                        fontWeight: 700
                                    }}
                                >ⓘ</span>
                                <Tooltip id="analyst_consensus_tooltip" place="bottom" style={{ maxWidth: '280px', fontSize: '0.8rem', zIndex: 9999 }}>
                                    <div><strong>📈 Analyst Consensus</strong></div>
                                    <div style={{ marginTop: '0.5rem' }}>Aggregated rating from professional Wall Street analysts. Scale: 1 (Strong Buy) to 5 (Strong Sell).</div>
                                    <div style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '0.75rem' }}>Source: Yahoo Finance via institutional analyst reports</div>
                                </Tooltip>
                            </div>

                            <TechnicalGauge
                                value={stock.recommendationMean || 3}
                                inverse={true} // For Yahoo, 1 is Buy, 5 is Sell
                                label={stock.recommendationKey?.replace('_', ' ').toUpperCase() || 'NEUTRAL'}
                            />

                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem' }}>
                                Based on {stock.numberOfAnalystOpinions || 0} analysts
                            </div>
                        </div>

                        {/* Recommendation Breakdown */}
                        {stock.recommendationTrend && stock.recommendationTrend[0] && (
                            <Card title={<CardTitleWithTooltip title="Recommendation Breakdown" tooltipId="rec_breakdown" tooltipIcon="📊" tooltipContent="Distribution of analyst recommendations. Shows how many analysts rate the stock as Buy, Hold, or Sell." />}>
                                <div style={{ display: 'flex', gap: '0.5rem', height: '160px', alignItems: 'flex-end', paddingTop: '20px' }}>
                                    {[
                                        { label: 'Strong Buy', key: 'strongBuy', color: '#10b981' },
                                        { label: 'Buy', key: 'buy', color: '#34d399' },
                                        { label: 'Hold', key: 'hold', color: '#94a3b8' },
                                        { label: 'Sell', key: 'sell', color: '#f87171' },
                                        { label: 'Strong Sell', key: 'strongSell', color: '#ef4444' }
                                    ].map(item => {
                                        const val = stock.recommendationTrend[0][item.key] || 0;
                                        const max = Math.max(...Object.values(stock.recommendationTrend[0]).filter(v => typeof v === 'number'));
                                        const height = max > 0 ? (val / max) * 100 : 0;

                                        return (
                                            <div key={item.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1rem', color: item.color, marginBottom: '4px' }}>{val}</div>
                                                <div style={{
                                                    width: '40%',
                                                    minWidth: '20px',
                                                    height: `${Math.max(height, 2)}%`,
                                                    background: item.color,
                                                    borderRadius: '8px 8px 8px 8px',
                                                    opacity: 1,
                                                    transition: 'height 0.5s ease'
                                                }} />
                                                <div style={{ fontSize: '0.625rem', color: '#64748b', fontWeight: 600, textAlign: 'center', lineHeight: 1.2, marginTop: '4px' }}>
                                                    {item.label.replace(' ', '\n')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        {/* Price Targets Chart */}
                        <Card title={<CardTitleWithTooltip title="Price Targets" tooltipId="targets" tooltipIcon="🎯" tooltipContent="Analyst price targets for the next 12 months. Shows the Low, Average (Mean), and High price predictions compared to the current price." icon={<Target size={20} />} />}>
                            <PriceTargetChart
                                current={stock.price}
                                low={stock.targetLowPrice}
                                mean={stock.targetMeanPrice}
                                high={stock.targetHighPrice}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <DataCell label="Current Price" value={formatPrice(stock.price) + ' ' + currency} />
                                <DataCell label="Target Mean" value={formatPrice(stock.targetMeanPrice) + ' ' + currency} highlight />
                                <DataCell label="Target Median" value={formatPrice(stock.targetMedianPrice) + ' ' + currency} />
                                <DataCell label="Target High" value={formatPrice(stock.targetHighPrice) + ' ' + currency} />
                                <DataCell label="Target Low" value={formatPrice(stock.targetLowPrice) + ' ' + currency} />
                                <DataCell
                                    label="Upside Potential"
                                    value={stock.targetMeanPrice && stock.price
                                        ? (((stock.targetMeanPrice - stock.price) / stock.price) * 100).toFixed(2) + '%'
                                        : 'N/A'
                                    }
                                    highlight
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Card title="Company Profile" icon={<Building2 size={20} />}>
                            <p style={{ lineHeight: 1.8, color: '#475569', fontSize: '0.9375rem' }}>
                                {stock.description || stock.longBusinessSummary || "No company description available."}
                            </p>

                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Sector" value={stock.sector} />
                                <DataCell label="Industry" value={stock.industry} />
                                <DataCell label="Employees" value={stock.fullTimeEmployees || stock.employees ? (stock.fullTimeEmployees || stock.employees).toLocaleString() : null} />
                                <DataCell label="Country" value={stock.country} />
                                <DataCell label="City" value={stock.city} />
                                <DataCell label="Exchange" value={stock.exchange || (isSaudi ? 'Tadawul' : isEgypt ? 'EGX' : 'NYSE/NASDAQ')} highlight />
                            </div>

                            {stock.website && (
                                <a
                                    href={stock.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        background: 'var(--gradient-primary)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: 700
                                    }}
                                >
                                    <Globe size={18} />
                                    Visit Company Website
                                    <ChevronRight size={18} />
                                </a>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

// Card Component
function Card({ title, icon, children }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
            {title && (
                <h3 style={{
                    color: '#1f2937',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {icon && <span style={{ color: '#10b981' }}>{icon}</span>}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

// Data Cell Component
// Data Cell Component
function DataCell({ label, value, highlight }) {
    // If value is missing/null/undefined, show N/A
    const displayValue = (value === null || value === undefined || value === '') ? 'N/A' : value;

    return (
        <div style={{
            background: highlight
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                : '#f8fafc',
            padding: '1rem',
            borderRadius: '12px',
            border: highlight
                ? '1px solid rgba(16, 185, 129, 0.2)'
                : '1px solid #e2e8f0'
        }}>
            <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '0.25rem',
                fontWeight: 600
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: (highlight && displayValue !== 'N/A') ? '#10b981' : (displayValue === 'N/A' ? '#94a3b8' : '#1f2937')
            }}>
                {displayValue}
            </div>
        </div>
    );
}

// Info Badge Component
function InfoBadge({ label, value }) {
    return (
        <div style={{
            background: '#f1f5f9',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            display: 'inline-flex',
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid #e2e8f0'
        }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{label}:</span>
            <span style={{ color: '#1f2937', fontWeight: 700, fontSize: '0.875rem' }}>{value}</span>
        </div>
    );
}

// Technical Gauge Component
function TechnicalGauge({ value, inverse = false, label }) {
    // Value is 1-5. If inverse, 1 is Buy (Green), 5 is Sell (Red).
    // If not inverse, 1 is Sell (Red), 5 is Buy (Green).

    const normalizedValue = Math.max(1, Math.min(5, value));
    const percentage = ((normalizedValue - 1) / 4) * 100;

    // Calculate color
    const getColor = (val) => {
        if (inverse) {
            if (val <= 1.5) return '#10b981'; // Strong Buy
            if (val <= 2.5) return '#34d399'; // Buy
            if (val <= 3.5) return '#fbbf24'; // Hold
            if (val <= 4.5) return '#f87171'; // Sell
            return '#ef4444'; // Strong Sell
        } else {
            if (val <= 1.5) return '#ef4444'; // Strong Sell
            if (val <= 2.5) return '#f87171'; // Sell
            if (val <= 3.5) return '#fbbf24'; // Hold
            if (val <= 4.5) return '#34d399'; // Buy
            return '#10b981'; // Strong Buy
        }
    };

    const color = getColor(normalizedValue);

    // SVG Path for arc
    const radius = 80;
    const stroke = 12;
    const circumference = Math.PI * radius;
    const offset = circumference - ((inverse ? (100 - percentage) : percentage) / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: '200px', height: '120px', display: 'flex', justifyContent: 'center' }}>
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Background Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
                {/* Filled Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // We'll animate this or set it static for now
                    style={{
                        strokeDashoffset: circumference * (1 - (inverse ? (5 - normalizedValue) / 4 : (normalizedValue - 1) / 4)),
                        transition: 'stroke-dashoffset 1s ease-out'
                    }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                bottom: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: color }}>
                    {normalizedValue.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

// Price Target Chart Component - Visualizes current price vs analyst targets
function PriceTargetChart({ current, low, mean, high }) {
    // Safety check for missing data
    if (!low && !high && !mean) {
        return (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem', background: '#f8fafc', borderRadius: '12px' }}>
                No analyst price targets available
            </div>
        );
    }

    // Default values to prevent NaN
    const safeLow = low || current || 0;
    const safeHigh = high || current || safeLow * 1.5; // Fallback structure
    const safeMean = mean || (safeLow + safeHigh) / 2;
    const safeCurrent = current || 0;

    const min = Math.min(safeCurrent, safeLow) * 0.9;
    const max = Math.max(safeCurrent, safeHigh) * 1.1;
    const range = max - min; // Ensure range is not 0
    const safeRange = range === 0 ? 1 : range; // Prevent division by zero

    const getPos = (val) => Math.max(0, Math.min(100, ((val - min) / safeRange) * 100));

    return (
        <div style={{ position: 'relative', height: '80px', marginTop: '30px', marginBottom: '10px' }}>
            {/* Range Bar */}
            <div style={{
                position: 'absolute',
                left: `${getPos(safeLow)}%`,
                right: `${100 - getPos(safeHigh)}%`,
                top: '35px',
                height: '10px',
                background: '#e2e8f0',
                borderRadius: '5px'
            }} />

            {/* Low Marker - Label moved below bar */}
            <div style={{ position: 'absolute', left: `${getPos(safeLow)}%`, top: '25px', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: '2px', height: '30px', background: '#94a3b8', margin: '0 auto' }} />
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{safeLow.toFixed(2)}</div>
            </div>

            {/* High Marker - Label moved below bar */}
            <div style={{ position: 'absolute', left: `${getPos(safeHigh)}%`, top: '25px', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: '2px', height: '30px', background: '#94a3b8', margin: '0 auto' }} />
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{safeHigh.toFixed(2)}</div>
            </div>

            {/* Mean Marker */}
            <div style={{ position: 'absolute', left: `${getPos(safeMean)}%`, top: '28px', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 1 }}>
                <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700, marginTop: '18px' }}>Avg</div>
            </div>

            {/* Current Price Marker - Positioned above everything */}
            <div style={{ position: 'absolute', left: `${getPos(safeCurrent)}%`, top: '0', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 2 }}>
                <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap'
                }}>
                    {safeCurrent.toFixed(2)}
                </div>
                <div style={{ width: '2px', height: '24px', background: '#10b981', margin: '0 auto' }} />
            </div>
        </div>
    );
}



// Simple Bar Chart Component
function SimpleBarChart({ data, height = 100 }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: height + 'px', paddingTop: '20px' }}>
            {data.map((item, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: item.color }}>{item.displayValue}</div>
                    <div style={{
                        width: '40px',
                        height: maxValue > 0 ? `${Math.max((item.value / maxValue) * 100, 5)}%` : '5%',
                        background: item.color,
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'height 0.5s ease'
                    }} />
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

// NEW: Ownership Pie Chart Component - Donut visualization for share distribution
function OwnershipPieChart({ sharesOutstanding, floatShares, sharesShort }) {
    if (!sharesOutstanding || sharesOutstanding === 0) {
        return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>No ownership data available</div>;
    }

    const insiderShares = sharesOutstanding - (floatShares || 0);
    const shortPercent = floatShares ? (sharesShort / floatShares) * 100 : 0;
    const floatPercent = (floatShares / sharesOutstanding) * 100 || 0;
    const insiderPercent = 100 - floatPercent;

    // SVG Donut Chart
    const size = 160;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '1rem 0' }}>
            {/* Donut Chart */}
            <div style={{ position: 'relative' }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}
                    />
                    {/* Float shares (public) */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#10b981" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (floatPercent / 100) * circumference}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                    {/* Insider shares */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#3b82f6" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (insiderPercent / 100) * circumference}
                        transform={`rotate(${-90 + (floatPercent / 100) * 360} ${size / 2} ${size / 2})`}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                {/* Center text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937' }}>{floatPercent.toFixed(0)}%</div>
                    <div style={{ fontSize: '0.625rem', color: '#64748b', fontWeight: 600 }}>Float</div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Float ({floatPercent.toFixed(1)}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#3b82f6' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Insider ({insiderPercent.toFixed(1)}%)</span>
                </div>
                {shortPercent > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Short Interest ({shortPercent.toFixed(2)}%)</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// NEW: Liquidity Gauge Component - Visual comparison of Current vs Quick Ratio
function LiquidityGauge({ currentRatio, quickRatio }) {
    const formatRatio = (val) => val ? Number(val).toFixed(2) : 'N/A';
    const getColor = (val) => {
        if (!val) return '#94a3b8';
        if (val >= 2) return '#10b981';
        if (val >= 1) return '#f59e0b';
        return '#ef4444';
    };

    const maxRatio = 3; // Scale max
    const currentWidth = Math.min((currentRatio || 0) / maxRatio * 100, 100);
    const quickWidth = Math.min((quickRatio || 0) / maxRatio * 100, 100);

    return (
        <div style={{ padding: '0.5rem 0' }}>
            {/* Current Ratio Bar */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Current Ratio</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: getColor(currentRatio) }}>{formatRatio(currentRatio)}</span>
                </div>
                <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        height: '100%', width: `${currentWidth}%`,
                        background: `linear-gradient(90deg, ${getColor(currentRatio)} 0%, ${getColor(currentRatio)}dd 100%)`,
                        borderRadius: '6px', transition: 'width 0.5s ease'
                    }} />
                    {/* 1.0 marker */}
                    <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: '2px', background: '#94a3b8' }} />
                </div>
            </div>

            {/* Quick Ratio Bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Quick Ratio</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: getColor(quickRatio) }}>{formatRatio(quickRatio)}</span>
                </div>
                <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        height: '100%', width: `${quickWidth}%`,
                        background: `linear-gradient(90deg, ${getColor(quickRatio)} 0%, ${getColor(quickRatio)}dd 100%)`,
                        borderRadius: '6px', transition: 'width 0.5s ease'
                    }} />
                    {/* 1.0 marker */}
                    <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: '2px', background: '#94a3b8' }} />
                </div>
            </div>

            {/* Scale labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.625rem', color: '#94a3b8' }}>
                <span>0</span>
                <span>1.0 (Healthy)</span>
                <span>2.0</span>
                <span>3.0+</span>
            </div>
        </div>
    );
}

// NEW: ROA vs ROE Comparison Chart
function RoaRoeChart({ roe, roa }) {
    const formatPercent = (val) => val ? (val * 100).toFixed(1) + '%' : 'N/A';
    const maxVal = 1; // 100%
    const roeWidth = Math.min((roe || 0) / maxVal * 100, 100);
    const roaWidth = Math.min((roa || 0) / maxVal * 100, 100);

    return (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* ROE Column */}
            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.25rem' }}>{formatPercent(roe)}</div>
                    <div style={{
                        width: '50px',
                        height: `${Math.max(roeWidth, 5)}%`,
                        background: 'linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)',
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'height 0.5s ease'
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '0.5rem' }}>ROE</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Return on Equity</div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '120px', background: '#e2e8f0' }} />

            {/* ROA Column */}
            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.25rem' }}>{formatPercent(roa)}</div>
                    <div style={{
                        width: '50px',
                        height: `${Math.max(roaWidth, 5)}%`,
                        background: 'linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%)',
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'height 0.5s ease'
                    }} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '0.5rem' }}>ROA</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Return on Assets</div>
            </div>
        </div>
    );
}

// NEW: Exchange Badge Component
function ExchangeBadge({ exchange, currency }) {
    const getExchangeInfo = (ex) => {
        const exchanges = {
            // US
            'NMS': { name: 'NASDAQ', color: '#0066b2', icon: '🇺🇸' },
            'NGM': { name: 'NASDAQ', color: '#0066b2', icon: '🇺🇸' },
            'NCM': { name: 'NASDAQ', color: '#0066b2', icon: '🇺🇸' },
            'NYQ': { name: 'NYSE', color: '#0047ab', icon: '🇺🇸' },
            'NYSE': { name: 'NYSE', color: '#0047ab', icon: '🇺🇸' },
            'NASDAQ': { name: 'NASDAQ', color: '#0066b2', icon: '🇺🇸' },
            // Saudi
            'SAU': { name: 'Tadawul', color: '#006c35', icon: '🇸🇦' },
            'Tadawul': { name: 'Tadawul', color: '#006c35', icon: '🇸🇦' },
            // Egypt
            'CAI': { name: 'EGX', color: '#c09300', icon: '🇪🇬' },
            'EGX': { name: 'EGX', color: '#c09300', icon: '🇪🇬' },
            // UK
            'LSE': { name: 'London', color: '#c41e3a', icon: '🇬🇧' },
            'London': { name: 'London', color: '#c41e3a', icon: '🇬🇧' },
            'LON': { name: 'London', color: '#c41e3a', icon: '🇬🇧' },
            // Germany
            'GER': { name: 'Frankfurt', color: '#ffcc00', icon: '🇩🇪' },
            'FRA': { name: 'Frankfurt', color: '#ffcc00', icon: '🇩🇪' },
            'XETRA': { name: 'XETRA', color: '#003399', icon: '🇩🇪' },
            // Japan
            'JPX': { name: 'Tokyo', color: '#bc002d', icon: '🇯🇵' },
            'TYO': { name: 'Tokyo', color: '#bc002d', icon: '🇯🇵' },
            'Tokyo': { name: 'Tokyo', color: '#bc002d', icon: '🇯🇵' },
            // India
            'NSI': { name: 'NSE India', color: '#ff6600', icon: '🇮🇳' },
            'BSE': { name: 'BSE India', color: '#ff6600', icon: '🇮🇳' },
            // Canada
            'TOR': { name: 'Toronto', color: '#d52b1e', icon: '🇨🇦' },
            'TSX': { name: 'Toronto', color: '#d52b1e', icon: '🇨🇦' },
            // Australia
            'ASX': { name: 'Sydney', color: '#002776', icon: '🇦🇺' },
            // Hong Kong
            'HKG': { name: 'Hong Kong', color: '#de2910', icon: '🇭🇰' },
            // UAE
            'DFM': { name: 'Dubai', color: '#00732f', icon: '🇦🇪' },
            'ADX': { name: 'Abu Dhabi', color: '#00732f', icon: '🇦🇪' },
            // South Africa
            'JSE': { name: 'Johannesburg', color: '#007a4d', icon: '🇿🇦' },
            // Qatar
            'QSE': { name: 'Qatar', color: '#8d1b3d', icon: '🇶🇦' },
            // === PHASE 2 TIER 1 MARKETS ===
            // France
            'PAR': { name: 'Euronext Paris', color: '#002654', icon: '🇫🇷' },
            'Paris': { name: 'Paris', color: '#002654', icon: '🇫🇷' },
            'ENX': { name: 'Euronext', color: '#002654', icon: '🇫🇷' },
            // Switzerland
            'SWX': { name: 'SIX Swiss', color: '#ff0000', icon: '🇨🇭' },
            'VTX': { name: 'SIX Swiss', color: '#ff0000', icon: '🇨🇭' },
            'EBS': { name: 'SIX Swiss', color: '#ff0000', icon: '🇨🇭' },
            // Netherlands
            'AMS': { name: 'Amsterdam', color: '#ff6600', icon: '🇳🇱' },
            // Spain
            'MCE': { name: 'Madrid', color: '#c60b1e', icon: '🇪🇸' },
            'BME': { name: 'BME Spanish', color: '#c60b1e', icon: '🇪🇸' },
            // Italy
            'MIL': { name: 'Milan', color: '#008c45', icon: '🇮🇹' },
            'BIT': { name: 'Borsa Italiana', color: '#008c45', icon: '🇮🇹' },
            // Brazil
            'SAO': { name: 'B3 São Paulo', color: '#009c3b', icon: '🇧🇷' },
            'BVMF': { name: 'B3', color: '#009c3b', icon: '🇧🇷' },
            // Mexico
            'MEX': { name: 'BMV Mexico', color: '#006847', icon: '🇲🇽' },
            // South Korea
            'KSC': { name: 'Korea Stock', color: '#003478', icon: '🇰🇷' },
            'KRX': { name: 'Korea Exchange', color: '#003478', icon: '🇰🇷' },
            'KOE': { name: 'Korea Exchange', color: '#003478', icon: '🇰🇷' },
            // Taiwan
            'TAI': { name: 'Taiwan Stock', color: '#fe0000', icon: '🇹🇼' },
            'TPE': { name: 'Taipei Exchange', color: '#fe0000', icon: '🇹🇼' },
            'TWO': { name: 'Taipei Exchange', color: '#fe0000', icon: '🇹🇼' },
            // Singapore
            'SES': { name: 'Singapore', color: '#ee2536', icon: '🇸🇬' },
            'SGX': { name: 'SGX', color: '#ee2536', icon: '🇸🇬' },
        };
        return exchanges[ex] || { name: ex || 'Exchange', color: '#64748b', icon: '🌐' };
    };

    const info = getExchangeInfo(exchange);

    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem', background: `${info.color}10`,
            borderRadius: '12px', border: `1px solid ${info.color}30`
        }}>
            <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
            <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: info.color }}>{info.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trading in {currency}</div>
            </div>
        </div>
    );
}
