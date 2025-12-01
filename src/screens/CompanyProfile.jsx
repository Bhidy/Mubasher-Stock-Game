import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Star, Share2, Heart, MessageCircle, Repeat2, Plus, Bell } from 'lucide-react';

// Mock data - replace with real API data
const COMPANY_DATA = {
    '2222': {
        symbol: '2222.SR',
        name: 'Saudi Aramco',
        logo: 'https://logo.clearbit.com/aramco.com',
        price: 24.54,
        change: -0.08,
        changePercent: -0.37,
        prevClose: 24.63,
        marketCap: '1.87T',
        pe: 14.2,
        high52w: 28.50,
        low52w: 23.10,
        volume: '12.5M',
        avgVolume: '15.2M',
        dividendYield: '4.2%',
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
            {
                title: "Aramco Payout Yields First Quantum Computer",
                time: '1d ago',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Ahmed Al-Saud',
                avatar: 'https://i.pravatar.cc/150?img=12',
                time: '2h ago',
                content: 'Aramco looking strong! Great dividend yield and solid fundamentals. Holding long term 🚀',
                likes: 24,
                comments: 5,
                shares: 2
            },
            {
                user: 'Sarah Investment',
                avatar: 'https://i.pravatar.cc/150?img=45',
                time: '5h ago',
                content: 'Just added more Aramco to my portfolio. The recent dip is a buying opportunity IMO.',
                likes: 18,
                comments: 3,
                shares: 1
            },
            {
                user: 'Khalid Trader',
                avatar: 'https://i.pravatar.cc/150?img=33',
                time: '1d ago',
                content: 'Technical analysis shows support at 24.00. Watch this level closely! 📊',
                likes: 31,
                comments: 8,
                shares: 4
            }
        ],
        keyStats: [
            { label: 'Market Cap', value: '1.87T SAR' },
            { label: 'P/E Ratio', value: '14.2' },
            { label: '52W High', value: '28.50' },
            { label: '52W Low', value: '23.10' },
            { label: 'Avg Volume', value: '15.2M' },
            { label: 'Dividend Yield', value: '4.2%' },
        ],
        performance: {
            '1D': -0.37,
            '5D': -2.54,
            '1M': -5.32,
            '6M': -1.84,
            'YTD': -12.51,
            '1Y': -10.76,
            '5Y': -16.97,
        },
        technicalIndicators: {
            summary: 'Sell',
            analystRating: 'Buy'
        },
        analystInsights: {
            priceTargets: {
                current: 24.54,
                average: 28.86,
                low: 25.50,
                high: 33.00
            },
            recommendations: {
                strongBuy: 4,
                buy: 7,
                hold: 8,
                underperform: 0,
                sell: 0
            }
        },
        chartData: {
            '1D': [24.68, 24.70, 24.67, 24.65, 24.62, 24.58, 24.60, 24.63, 24.61, 24.59, 24.56, 24.54, 24.52, 24.55, 24.54],
            '1W': [24.8, 24.75, 24.6, 24.9, 24.7, 24.5, 24.6, 24.54],
            '1M': [25.2, 25.0, 24.8, 24.9, 25.1, 24.9, 24.7, 24.6, 24.54],
            '3M': [23.5, 24.2, 25.0, 24.8, 24.3, 24.9, 24.6, 24.54],
            '6M': [26.0, 25.5, 24.8, 25.2, 24.6, 24.9, 24.7, 24.54],
            '1Y': [22.8, 24.5, 26.2, 25.8, 24.2, 25.0, 24.7, 24.54],
        }
    },
    '1120': {
        symbol: '1120.SR',
        name: 'Al Rajhi Bank',
        logo: 'https://logo.clearbit.com/alrajhibank.com.sa',
        price: 87.50,
        change: 1.20,
        changePercent: 1.39,
        prevClose: 86.30,
        marketCap: '328B',
        pe: 18.5,
        high52w: 92.00,
        low52w: 75.20,
        volume: '8.2M',
        avgVolume: '9.5M',
        dividendYield: '3.8%',
        news: [
            {
                title: "Al Rajhi Bank Reports Strong Q4 Earnings",
                time: '1h ago',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop'
            },
            {
                title: "Digital Banking Expansion Announced",
                time: '4h ago',
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Mohammed Investor',
                avatar: 'https://i.pravatar.cc/150?img=8',
                time: '1h ago',
                content: 'Al Rajhi continues to dominate Islamic banking. Strong Q4 results! 💪',
                likes: 42,
                comments: 12,
                shares: 5
            }
        ],
        keyStats: [
            { label: 'Market Cap', value: '328B SAR' },
            { label: 'P/E Ratio', value: '18.5' },
            { label: '52W High', value: '92.00' },
            { label: '52W Low', value: '75.20' },
            { label: 'Avg Volume', value: '9.5M' },
            { label: 'Dividend Yield', value: '3.8%' },
        ],
        performance: {
            '1D': 1.39,
            '5D': 2.1,
            '1M': 4.2,
            '6M': 8.5,
            'YTD': 6.7,
            '1Y': 15.8,
            '5Y': 22.3,
        },
        technicalIndicators: {
            summary: 'Buy',
            analystRating: 'Buy'
        },
        analystInsights: {
            priceTargets: {
                current: 87.50,
                average: 92.30,
                low: 85.00,
                high: 98.00
            },
            recommendations: {
                strongBuy: 5,
                buy: 8,
                hold: 6,
                underperform: 0,
                sell: 0
            }
        },
        chartData: {
            '1D': [87.2, 87.3, 87.1, 87.4, 87.5, 87.3, 87.50],
            '1W': [86.8, 86.6, 86.9, 87.2, 87.5, 87.6, 87.50],
            '1M': [84.2, 85.0, 85.8, 86.4, 87.1, 86.7, 87.50],
            '3M': [82.5, 84.2, 86.0, 85.8, 86.3, 86.9, 87.50],
            '6M': [78.0, 80.5, 82.8, 84.2, 85.6, 86.9, 87.50],
            '1Y': [75.8, 78.5, 82.2, 85.8, 84.2, 86.0, 87.50],
        }
    }
};

export default function CompanyProfile() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const company = COMPANY_DATA[symbol] || COMPANY_DATA['2222'];
    const isPositive = company.change >= 0;

    // Professional gauge component with stunning design
    const TechnicalGauge = ({ value, title, description }) => {
        const getAngle = () => {
            const positions = {
                'Strong Sell': -72,
                'Sell': -36,
                'Neutral': 0,
                'Buy': 36,
                'Strong Buy': 72
            };
            return positions[value] || 0;
        };

        const getColor = () => {
            if (value === 'Strong Buy') return '#10b981';
            if (value === 'Buy') return '#34d399';
            if (value === 'Neutral') return '#94a3b8';
            if (value === 'Sell') return '#f87171';
            if (value === 'Strong Sell') return '#ef4444';
            return '#94a3b8';
        };

        const angle = getAngle();
        const color = getColor();

        // Calculate the arc path for the filled portion
        const getArcPath = () => {
            const startAngle = -90;
            const endAngle = angle;
            const radius = 100;
            const centerX = 150;
            const centerY = 150;

            const start = {
                x: centerX + radius * Math.cos((startAngle * Math.PI) / 180),
                y: centerY + radius * Math.sin((startAngle * Math.PI) / 180)
            };

            const end = {
                x: centerX + radius * Math.cos((endAngle * Math.PI) / 180),
                y: centerY + radius * Math.sin((endAngle * Math.PI) / 180)
            };

            const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

            return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
        };

        return (
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem 1.5rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    marginBottom: '0.5rem',
                    color: '#1f2937'
                }}>{title}</h3>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    marginBottom: '2.5rem',
                    lineHeight: 1.5
                }}>{description}</p>

                <div style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <svg width="100%" height="200" viewBox="0 0 300 200" style={{ maxWidth: '300px' }}>
                        <defs>
                            {/* Gradient for the arc */}
                            <linearGradient id={`gauge-gradient-${title.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="25%" stopColor="#f87171" />
                                <stop offset="50%" stopColor="#94a3b8" />
                                <stop offset="75%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>

                            {/* Shadow filter */}
                            <filter id={`shadow-${title.replace(/\s/g, '')}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                <feOffset dx="0" dy="2" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.3" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background track */}
                        <path
                            d="M 50 150 A 100 100 0 0 1 250 150"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="20"
                            strokeLinecap="round"
                        />

                        {/* Gradient arc */}
                        <path
                            d="M 50 150 A 100 100 0 0 1 250 150"
                            fill="none"
                            stroke={`url(#gauge-gradient-${title.replace(/\s/g, '')})`}
                            strokeWidth="20"
                            strokeLinecap="round"
                        />

                        {/* Tick marks */}
                        {[-72, -36, 0, 36, 72].map((tickAngle, i) => {
                            const tickRadius = 95;
                            const tickLength = 8;
                            const x1 = 150 + (tickRadius - tickLength) * Math.cos((tickAngle * Math.PI) / 180);
                            const y1 = 150 + (tickRadius - tickLength) * Math.sin((tickAngle * Math.PI) / 180);
                            const x2 = 150 + tickRadius * Math.cos((tickAngle * Math.PI) / 180);
                            const y2 = 150 + tickRadius * Math.sin((tickAngle * Math.PI) / 180);

                            return (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#cbd5e1"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Needle with shadow */}
                        <g transform={`rotate(${angle} 150 150)`} filter={`url(#shadow-${title.replace(/\s/g, '')})`}>
                            {/* Needle */}
                            <path
                                d="M 150 150 L 145 145 L 150 60 L 155 145 Z"
                                fill="#1f2937"
                            />
                            {/* Center circle */}
                            <circle cx="150" cy="150" r="12" fill="#1f2937" />
                            <circle cx="150" cy="150" r="8" fill="white" />
                            <circle cx="150" cy="150" r="4" fill={color} />
                        </g>

                        {/* Labels */}
                        <text x="35" y="165" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">
                            Strong
                        </text>
                        <text x="35" y="177" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">
                            sell
                        </text>

                        <text x="150" y="50" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">
                            Neutral
                        </text>

                        <text x="265" y="165" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">
                            Strong
                        </text>
                        <text x="265" y="177" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">
                            buy
                        </text>
                    </svg>
                </div>

                {/* Value display */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '-1rem'
                }}>
                    <div style={{
                        display: 'inline-block',
                        background: `${color}15`,
                        padding: '0.75rem 2rem',
                        borderRadius: '12px',
                        border: `2px solid ${color}30`
                    }}>
                        <div style={{
                            fontSize: '1.75rem',
                            fontWeight: '900',
                            color: color,
                            letterSpacing: '-0.02em'
                        }}>
                            {value}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'stats', label: 'Key Statistics' },
        { id: 'technical', label: 'Technical' },
        { id: 'community', label: 'Community' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            paddingBottom: '2rem'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                padding: '1.5rem',
                paddingTop: '2rem',
                color: 'white',
                position: 'relative'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                }}>
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
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={24} color="white" />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setIsWatchlisted(!isWatchlisted)}
                            style={{
                                background: isWatchlisted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Star size={20} color="white" fill={isWatchlisted ? 'white' : 'none'} />
                        </button>
                        <button
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Share2 size={20} color="white" />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {company.logo && (
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: 'white',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    )}
                    <div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                            {company.symbol}
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0' }}>
                            {company.name}
                        </h1>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                        {company.price.toFixed(2)} SAR
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}>
                        {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        <span>
                            {isPositive ? '+' : ''}{company.change.toFixed(2)} ({isPositive ? '+' : ''}{company.changePercent.toFixed(2)}%)
                        </span>
                        <span style={{ opacity: 0.8, fontSize: '0.875rem' }}>Today</span>
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
                            transition: 'all 0.2s',
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
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '2px solid white',
                            padding: '0.875rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
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

            {/* Tabs */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem 1.5rem 0',
                borderBottom: '2px solid #e5e7eb',
                background: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }} className="hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '3px solid #10b981' : '3px solid transparent',
                            padding: '0.75rem 1rem',
                            color: activeTab === tab.id ? '#10b981' : '#6b7280',
                            fontWeight: activeTab === tab.id ? '700' : '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '-2px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Analyst Insights Summary */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#1f2937'
                            }}>
                                Analyst Insights
                            </h2>
                            <div style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}>
                                {/* Price Targets */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                                        Price Targets
                                    </h3>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <div style={{
                                            height: '10px',
                                            background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)',
                                            borderRadius: '10px',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: `${((company.analystInsights.priceTargets.average - company.analystInsights.priceTargets.low) / (company.analystInsights.priceTargets.high - company.analystInsights.priceTargets.low)) * 100}%`,
                                                top: '-35px',
                                                transform: 'translateX(-50%)'
                                            }}>
                                                <div style={{
                                                    background: '#10b981',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '10px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '700',
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                }}>
                                                    {company.analystInsights.priceTargets.average.toFixed(2)}<br />
                                                    <span style={{ fontSize: '0.625rem', opacity: 0.9 }}>Average</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                                        <div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>
                                                {company.analystInsights.priceTargets.current.toFixed(2)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600' }}>Current</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>
                                                {company.analystInsights.priceTargets.low.toFixed(2)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600' }}>Low</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>
                                                {company.analystInsights.priceTargets.high.toFixed(2)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600' }}>High</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations Summary */}
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
                                        Recommendations
                                    </h3>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {['strongBuy', 'buy', 'hold'].map((type, index) => {
                                            const colors = ['#10b981', '#6ee7b7', '#fbbf24'];
                                            const labels = ['Strong Buy', 'Buy', 'Hold'];
                                            const count = company.analystInsights.recommendations[type];
                                            const total = Object.values(company.analystInsights.recommendations).reduce((a, b) => a + b, 0);

                                            return count > 0 ? (
                                                <div key={type} style={{ flex: 1, textAlign: 'center' }}>
                                                    <div style={{
                                                        background: colors[index],
                                                        height: `${Math.max((count / total) * 120, 50)}px`,
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: '800',
                                                        fontSize: '1.5rem',
                                                        marginBottom: '0.5rem',
                                                        boxShadow: `0 4px 12px ${colors[index]}40`
                                                    }}>
                                                        {count}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600' }}>
                                                        {labels[index]}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Stats Preview */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#1f2937'
                            }}>
                                Key Statistics
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem'
                            }}>
                                {company.keyStats.slice(0, 4).map((stat, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'white',
                                            padding: '1.25rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600'
                                        }}>
                                            {stat.label}
                                        </div>
                                        <div style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '800',
                                            color: '#1f2937'
                                        }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Highlights */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#1f2937'
                            }}>
                                Performance
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem'
                            }}>
                                {Object.entries(company.performance).slice(0, 4).map(([period, value]) => (
                                    <div
                                        key={period}
                                        style={{
                                            background: 'white',
                                            padding: '1.25rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600'
                                        }}>
                                            {period}
                                        </div>
                                        <div style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '800',
                                            color: value >= 0 ? '#10b981' : '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            {value >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Community Posts */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#1f2937'
                            }}>
                                Community
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {company.communityPosts.slice(0, 2).map((post, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'white',
                                            padding: '1.25rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                            <img
                                                src={post.avatar}
                                                alt={post.user}
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1f2937' }}>
                                                    {post.user}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    {post.time}
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{
                                            fontSize: '0.9375rem',
                                            color: '#374151',
                                            lineHeight: 1.6,
                                            marginBottom: '1rem'
                                        }}>
                                            {post.content}
                                        </p>
                                        <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                            <button style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#6b7280',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}>
                                                <Heart size={18} />
                                                {post.likes}
                                            </button>
                                            <button style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#6b7280',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}>
                                                <MessageCircle size={18} />
                                                {post.comments}
                                            </button>
                                            <button style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#6b7280',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}>
                                                <Repeat2 size={18} />
                                                {post.shares}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent News */}
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                color: '#1f2937'
                            }}>
                                Recent News
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {company.news.slice(0, 2).map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'white',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                style={{
                                                    width: '120px',
                                                    height: '90px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{ flex: 1, padding: '1rem 1rem 1rem 0' }}>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '0.5rem',
                                                    lineHeight: 1.5
                                                }}>
                                                    {item.title}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#9ca3af'
                                                }}>
                                                    {item.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Key Statistics Tab */}
                {activeTab === 'stats' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem'
                    }}>
                        {company.keyStats.map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    background: 'white',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                            >
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600'
                                }}>
                                    {stat.label}
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    color: '#1f2937'
                                }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Technical Tab */}
                {activeTab === 'technical' && (
                    <>
                        <TechnicalGauge
                            value={company.technicalIndicators.summary}
                            title="Technicals"
                            description="Summarizing what the indicators are suggesting."
                        />
                        <TechnicalGauge
                            value={company.technicalIndicators.analystRating}
                            title="Analyst rating"
                            description="An aggregate view of professional's ratings."
                        />
                    </>
                )}

                {/* Community Tab */}
                {activeTab === 'community' && (
                    <div>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: '#1f2937'
                        }}>
                            Community Posts
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {company.communityPosts.map((post, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: 'white',
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <img
                                            src={post.avatar}
                                            alt={post.user}
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1f2937' }}>
                                                {post.user}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                {post.time}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '0.9375rem',
                                        color: '#374151',
                                        lineHeight: 1.6,
                                        marginBottom: '1rem'
                                    }}>
                                        {post.content}
                                    </p>
                                    <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                        <button style={{
                                            background: 'none',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#6b7280',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>
                                            <Heart size={18} />
                                            {post.likes}
                                        </button>
                                        <button style={{
                                            background: 'none',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#6b7280',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>
                                            <MessageCircle size={18} />
                                            {post.comments}
                                        </button>
                                        <button style={{
                                            background: 'none',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#6b7280',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}>
                                            <Repeat2 size={18} />
                                            {post.shares}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
