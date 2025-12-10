import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, TrendingUp, TrendingDown, BarChart3, Briefcase,
    Star, Bell, Calendar, FileText, ArrowUpRight, ArrowDownRight,
    Clock, Activity, Globe, Zap, Eye, Settings, PieChart, ArrowRight
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';
import { useMode } from '../../context/ModeContext';
import { useCMS } from '../../context/CMSContext';
import BurgerMenu from '../../components/BurgerMenu';
import InvestorHeader from '../../components/investor/InvestorHeader';
import MarketCard from '../../components/investor/MarketCard';

// Market Indices Mock Data
const MARKET_INDICES = [
    { symbol: 'TASI', name: 'Tadawul All Share', value: 12847.32, change: 1.24, region: '🇸🇦' },
    { symbol: 'EGX30', name: 'EGX 30', value: 28934.56, change: -0.45, region: '🇪🇬' },
    { symbol: 'S&P 500', name: 'S&P 500', value: 5892.14, change: 0.87, region: '🇺🇸' },
    { symbol: 'NASDAQ', name: 'NASDAQ', value: 19234.67, change: 1.12, region: '🇺🇸' },
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
const NEWS_ITEMS = [
    { title: 'Oil Prices Surge on OPEC+ Production Cuts', source: 'Reuters', time: '2h ago', category: 'Commodities' },
    { title: 'Tech Rally Continues as AI Investments Grow', source: 'Bloomberg', time: '4h ago', category: 'Technology' },
    { title: 'Egyptian Pound Stabilizes After Central Bank Move', source: 'Al-Ahram', time: '6h ago', category: 'Forex' },
];

export default function InvestorHome() {
    const { user } = useContext(UserContext);
    const { market } = useMarket();
    const { announcements } = useCMS();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

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

    // Get market status
    const getMarketStatus = () => {
        const hour = currentTime.getHours();
        const day = currentTime.getDay();
        if (day === 0 || day === 6) return { status: 'Closed', color: '#64748B', bg: '#F1F5F9' };
        if (hour >= 9 && hour < 16) return { status: 'Open', color: '#10B981', bg: '#ECFDF5' };
        if (hour >= 8 && hour < 9) return { status: 'Pre-Market', color: '#F59E0B', bg: '#FEF3C7' };
        return { status: 'Closed', color: '#64748B', bg: '#F1F5F9' };
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

            {/* Market Indices Ticker */}
            <div style={{
                margin: '-1rem 1rem 0 1rem',
                background: 'white',
                borderRadius: '16px',
                padding: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E2E8F0',
                position: 'relative',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.875rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={16} color="#64748B" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Market Indices</span>
                    </div>
                    <button onClick={() => navigate('/market')} style={{
                        background: 'none',
                        border: 'none',
                        color: '#0EA5E9',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                    }}>
                        View All <ChevronRight size={14} />
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {MARKET_INDICES.map(index => (
                        <div key={index.symbol} style={{
                            minWidth: '140px',
                            padding: '0.75rem',
                            background: '#F8FAFC',
                            borderRadius: '12px',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                <span style={{ fontSize: '1rem' }}>{index.region}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B' }}>{index.symbol}</span>
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.125rem' }}>
                                {index.value.toLocaleString()}
                            </div>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: index.change >= 0 ? '#10B981' : '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.125rem',
                            }}>
                                {index.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
                            </div>
                        </div>
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

                {/* Market Summary Card */}
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Market Pulse</h2>

                        {/* Short cut to new Dashboard */}
                        <button
                            onClick={() => navigate('/investor/markets')}
                            style={{
                                color: '#0ea5e9',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            Global Dashboard <ArrowRight size={16} />
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        paddingBottom: '0.5rem',
                        scrollbarWidth: 'none'
                    }} className="no-scrollbar">
                        <MarketCard
                            name="TASI"
                            value="12,450.23"
                            change="+0.45%"
                            isPositive={true}
                            chartData={[65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85]}
                            color="#10b981"
                            onClick={() => navigate('/market')}
                        />
                        <MarketCard
                            name="S&P 500"
                            value="5,105.20"
                            change="+0.30%"
                            isPositive={true}
                            chartData={[40, 45, 50, 48, 52, 55, 58, 60, 62, 65, 68]}
                            color="#3b82f6"
                            onClick={() => navigate('/market')}
                        />
                    </div>
                </div>{/* Quick Actions */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                }}>
                    {[
                        { icon: BarChart3, label: 'Market', path: '/market', color: '#0EA5E9' },
                        { icon: Briefcase, label: 'Portfolio', path: '/investor/portfolio', color: '#8B5CF6' },
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
                                padding: '1rem 0.5rem',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E2E8F0',
                                cursor: 'pointer',
                                position: 'relative',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                    }}>
                                        {stock.symbol.substring(0, 2)}
                                    </div>
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
                            }}>
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
                                <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    {news.title}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                    {news.source}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
