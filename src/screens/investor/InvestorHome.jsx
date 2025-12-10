import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, TrendingUp, TrendingDown, BarChart3, Briefcase,
    Star, Bell, Calendar, FileText, ArrowUpRight, ArrowDownRight, Newspaper,
    Clock, Activity, Globe, Zap, Eye, Settings, PieChart, ArrowRight
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';
import { useMode } from '../../context/ModeContext';
import { useCMS } from '../../context/CMSContext';
import BurgerMenu from '../../components/BurgerMenu';
import InvestorHeader from '../../components/investor/InvestorHeader';
import MarketCard from '../../components/investor/MarketCard';
import { StockLogo } from '../../components/StockCard';
import Tooltip from '../../components/shared/Tooltip';
import { useToast } from '../../components/shared/Toast';

// Market Indices Mock Data
// Global Indices Configuration for Live Data
const INDICES_CONFIG = [
    { symbol: '^TASI.SR', name: 'TASI', flag: '🇸🇦', color: '#10b981' },
    { symbol: '^CASE30', name: 'EGX 30', flag: '🇪🇬', color: '#ef4444' },
    { symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸', color: '#3b82f6' },
    { symbol: '^IXIC', name: 'NASDAQ', flag: '🇺🇸', color: '#8b5cf6' },
    { symbol: '^DJI', name: 'DOW', flag: '🇺🇸', color: '#0ea5e9' },
    { symbol: '^GDAXI', name: 'DAX', flag: '🇩🇪', color: '#f59e0b' },
    { symbol: '^FTSE', name: 'FTSE 100', flag: '🇬🇧', color: '#64748b' },
    { symbol: '^N225', name: 'Nikkei', flag: '🇯🇵', color: '#dc2626' },
    { symbol: '^HSI', name: 'Hang Seng', flag: '🇭🇰', color: '#ec4899' },
];
// Portfolio Holdings Mock
const HOLDINGS = [
    { symbol: 'ARAMCO', name: 'Saudi Aramco', shares: 100, price: 32.50, change: 2.3, value: 3250, sector: 'Energy' },
    { symbol: 'STC', name: 'Saudi Telecom', shares: 50, price: 45.20, change: -0.8, value: 2260, sector: 'Telecom' },
    { symbol: 'SABIC', name: 'SABIC', shares: 75, price: 98.40, change: 1.5, value: 7380, sector: 'Materials' },
];

// Watchlist Mock
const WATCHLIST = [
    { symbol: 'AAPL', name: 'Apple Inc', price: 195.89, change: 1.45, alert: true },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 0.82, alert: false },
    { symbol: 'COMI', name: 'Commercial Intl Bank', price: 65.20, change: -1.2, alert: true },
];

// Economic Events Mock
const UPCOMING_EVENTS = [
    { date: 'Dec 11', title: 'FOMC Rate Decision', impact: 'high', time: '2:00 PM EST' },
    { date: 'Dec 12', title: 'CPI Data Release', impact: 'high', time: '8:30 AM EST' },
    { date: 'Dec 13', title: 'Saudi GDP Report', impact: 'medium', time: '10:00 AM' },
];

// News Mock
// News Mock
const NEWS_ITEMS = [
    {
        title: 'Oil Prices Surge on OPEC+ Production Cuts',
        source: 'Reuters',
        time: '2h ago',
        category: 'Commodities',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1661962692059-55d5a4319814?w=400&q=80'
    },
    {
        title: 'Tech Rally Continues as AI Investments Grow',
        source: 'Bloomberg',
        time: '4h ago',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80'
    },
    {
        title: 'Egyptian Pound Stabilizes After Central Bank Move',
        source: 'Al-Ahram',
        time: '6h ago',
        category: 'Forex',
        imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&q=80'
    },
];

export default function InvestorHome() {
    const { user } = useContext(UserContext);
    const { market, isMarketOpen } = useMarket(); // Import isMarketOpen
    const { announcements } = useCMS();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    // Live Indices State
    const [indicesData, setIndicesData] = useState([]);
    const [loadingIndices, setLoadingIndices] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch Global Indices
    useEffect(() => {
        // Initial Fetch
        fetchIndices();

        // Poll every 60 seconds for live updates
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, []);

    // Helper to get status for the current SELECTED market
    const getMarketStatus = () => {
        const isOpen = isMarketOpen(market.id); // Use robust Context logic
        if (isOpen) return { status: 'Open', color: '#10B981', bg: '#ECFDF5' };
        return { status: 'Closed', color: '#64748B', bg: '#F1F5F9' };
    };

    const fetchIndices = async () => {
        try {
            const promises = INDICES_CONFIG.map(async (idx) => {
                let status = 'closed';
                // Try to find market by approx flag match or symbol derived
                // Use robust isMarketOpen if mapped
                // Mapping index symbol to market ID is tricky, so we do best guess or simple open check
                // BUT for the main "Market Status" badge, we use the SELECTED market.

                try {
                    const res = await fetch(`/api/stock-profile?symbol=${encodeURIComponent(idx.symbol)}`);
                    const data = await res.json();

                    if (!data || data.error) return { ...idx, value: '---', change: '0.00%', isPositive: true, chartData: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50], status: 'closed' };

                    const price = data.price || data.regularMarketPrice || 0;
                    const changePercent = data.regularMarketChangePercent || 0;
                    const isPositive = changePercent >= 0;

                    // For the individual index cards, we can imply status from data or just show if it's "live"
                    // If change is moving, it's open.

                    return {
                        ...idx,
                        value: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        change: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
                        isPositive,
                        chartData: [50, 52, 55, 53, 58, 62, 60, 65, 70, 72, 75],
                        status: (data.marketState === 'REGULAR' || data.marketState === 'OPEN') ? 'open' : 'closed'
                    };
                } catch (e) {
                    // console.warn(`Failed to fetch ${idx.symbol}`, e);
                    return { ...idx, value: '---', change: '0.00%', isPositive: true, chartData: [], status: 'closed' };
                }
            });
            const results = await Promise.all(promises);
            setIndicesData(results);
        } catch (err) {
            console.error("Global Indices Error:", err);
        } finally {
            setLoadingIndices(false);
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Mock portfolio data
    const portfolioData = {
        totalValue: 125847.32,
        dayChange: 1247.89,
        dayChangePercent: 1.00,
        totalGain: 15847.32,
        totalGainPercent: 14.42,
        openPositions: 8,
        watchlistCount: 12,
        alertsActive: 5,
    };

    const marketStatus = getMarketStatus();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            paddingBottom: '100px',
            position: 'relative',
            zIndex: 0,
            isolation: 'isolate',
        }}>
            {/* Premium Header */}
            {/* Premium Header - Refactored to Component */}
            <InvestorHeader
                alertsCount={portfolioData.alertsActive}
                marketStatus={marketStatus}
                portfolioData={portfolioData}
                greeting={greeting}
            />

            {/* Global Markets Section - Clean White Theme */}
            <div style={{
                margin: '-1rem 1rem 0 1rem',
                background: '#FFFFFF',
                borderRadius: '28px',
                padding: '1.125rem 1.25rem',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.04)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.875rem',
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                        }}>
                            <Globe size={22} color="#059669" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Global Markets</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.2rem' }}>
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: '#10B981',
                                    boxShadow: '0 0 8px #10B981',
                                    animation: 'pulse 2s infinite',
                                }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Live • 9 Markets</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/investor/markets')}
                        style={{
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '0.625rem 1rem',
                            color: '#475569',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)';
                            e.currentTarget.style.borderColor = '#C7D2FE';
                            e.currentTarget.style.color = '#4F46E5';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)';
                            e.currentTarget.style.borderColor = '#E2E8F0';
                            e.currentTarget.style.color = '#475569';
                        }}
                    >
                        See All <ChevronRight size={16} />
                    </button>
                </div>

                {/* Market Cards Carousel - Live Data */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    paddingBottom: '0.75rem',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory',
                    marginLeft: '-0.5rem',
                    marginRight: '-0.5rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                }} className="no-scrollbar">
                    {loadingIndices ? (
                        // Skeleton Loading
                        [1, 2, 3].map(i => (
                            <div key={i} style={{ minWidth: '170px', height: '180px', background: '#f1f5f9', borderRadius: '24px', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                        ))
                    ) : (
                        indicesData.map((idx, i) => (
                            <MarketCard
                                key={i}
                                name={idx.name}
                                flag={idx.flag}
                                value={idx.value}
                                change={idx.change}
                                isPositive={idx.isPositive}
                                chartData={idx.chartData}
                                color={idx.color}
                                status={idx.status}
                                onClick={() => navigate('/market')}
                            />
                        ))
                    )}
                </div>

                {/* Scroll indicator dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    marginTop: '0.5rem',
                }}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                            width: i === 0 ? '18px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: i === 0 ? '#10B981' : '#E2E8F0',
                            transition: 'all 0.3s',
                        }} />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem 1rem' }}>

                {/* Announcements Banner */}
                {announcements && announcements
                    .filter(a => a.isActive && (a.targetMode === 'investor' || a.targetMode === 'all'))
                    .map((ann) => (
                        <div
                            key={ann.id}
                            style={{
                                marginBottom: '1.5rem',
                                background: ann.type === 'info' ? 'white' : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                color: ann.type === 'info' ? '#1E293B' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                border: ann.type === 'info' ? '1px solid #E2E8F0' : 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    marginBottom: '0.25rem',
                                    color: ann.type === 'info' ? '#0EA5E9' : '#94A3B8',
                                    display: 'flex', alignItems: 'center', gap: '0.375rem'
                                }}>
                                    <Bell size={12} />
                                    {ann.type}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{ann.title}</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4 }}>{ann.message}</p>

                                {ann.buttonText && (
                                    <button
                                        onClick={() => navigate(ann.buttonLink)}
                                        style={{
                                            marginTop: '0.75rem',
                                            padding: '0.5rem 1rem',
                                            background: ann.type === 'info' ? '#0F172A' : 'white',
                                            color: ann.type === 'info' ? 'white' : '#0F172A',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {ann.buttonText}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                {/* Quick Actions - Horizontal Scroll */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.25rem',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }} className="no-scrollbar">
                    {[
                        { icon: BarChart3, label: 'Market', path: '/market', color: '#0EA5E9' },
                        { icon: Briefcase, label: 'Portfolio', path: '/investor/portfolio', color: '#8B5CF6' },
                        { icon: Newspaper, label: 'News', path: '/news-feed', color: '#10B981' },
                        { icon: Star, label: 'Watchlist', path: '/investor/watchlist', color: '#F59E0B', badge: portfolioData.watchlistCount },
                        { icon: Bell, label: 'Alerts', path: '/investor/alerts', color: '#EF4444', badge: portfolioData.alertsActive },
                    ].map(action => (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem',
                                minWidth: 'calc(25% - 0.5625rem)',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E2E8F0',
                                cursor: 'pointer',
                                position: 'relative',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                flexShrink: 0,
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}05 100%)`,
                                border: `1px solid ${action.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <action.icon size={20} color={action.color} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                                {action.label}
                            </span>
                            {action.badge && (
                                <span style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    minWidth: '18px',
                                    height: '18px',
                                    borderRadius: '999px',
                                    background: action.color,
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 4px',
                                }}>{action.badge}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Portfolio Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                        borderRadius: '16px',
                        padding: '1rem',
                        border: '1px solid #A7F3D0',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={14} color="#059669" />
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Total Gain</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                            +${portfolioData.totalGain.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#10B981' }}>
                            +{portfolioData.totalGainPercent}% all time
                        </div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                        borderRadius: '16px',
                        padding: '1rem',
                        border: '1px solid #93C5FD',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                            <PieChart size={14} color="#2563EB" />
                            <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>Positions</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB' }}>
                            {portfolioData.openPositions}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#3B82F6' }}>
                            Open positions
                        </div>
                    </div>
                </div>

                {/* Watchlist Preview */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #E2E8F0',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star size={18} color="#F59E0B" fill="#F59E0B" />
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Watchlist</span>
                        </div>
                        <button
                            onClick={() => navigate('/investor/watchlist')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0EA5E9',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            See All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {WATCHLIST.map(stock => (
                            <div
                                key={stock.symbol}
                                onClick={() => navigate(`/company/${stock.symbol}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.875rem',
                                    background: '#F8FAFC',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <StockLogo ticker={stock.symbol} size={40} />
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{stock.symbol}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{stock.name}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>
                                        ${stock.price.toFixed(2)}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: stock.change >= 0 ? '#10B981' : '#EF4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '0.125rem',
                                    }}>
                                        {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Economic Calendar Preview */}
                <div style={{
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} color="white" />
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Upcoming Events</span>
                        </div>
                        <button
                            onClick={() => navigate('/investor/calendar')}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '999px',
                                padding: '0.375rem 0.75rem',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            View Calendar
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {UPCOMING_EVENTS.map((event, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.875rem',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <div style={{
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>{event.date.split(' ')[0]}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{event.date.split(' ')[1]}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{event.title}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>{event.time}</div>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '999px',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    background: event.impact === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                    color: event.impact === 'high' ? '#F87171' : '#FBBF24',
                                    textTransform: 'uppercase',
                                }}>{event.impact}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News Preview */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #E2E8F0',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} color="#0EA5E9" />
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Market News</span>
                        </div>
                        <button
                            onClick={() => navigate('/news-feed')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0EA5E9',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            More News
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>


                        {NEWS_ITEMS.map((news, index) => (
                            <div key={index} style={{
                                padding: '0.875rem',
                                background: '#F8FAFC',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                        <span style={{
                                            padding: '0.125rem 0.5rem',
                                            background: '#E0F2FE',
                                            borderRadius: '4px',
                                            fontSize: '0.6rem',
                                            fontWeight: 700,
                                            color: '#0284C7',
                                        }}>{news.category}</span>
                                        <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{news.time}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.25rem', lineHeight: '1.4' }}>
                                        {news.title}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                        {news.source}
                                    </div>
                                </div>
                                {news.imageUrl && (
                                    <div style={{
                                        width: '80px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={news.imageUrl}
                                            alt={news.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
