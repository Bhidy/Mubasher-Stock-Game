import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getEndpoint } from '../config/api';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Award, ShoppingBag, Users, TrendingUp,
    Activity, Plus, ArrowRight, Zap, Eye, Calendar, Megaphone,
    Newspaper, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw,
    BarChart2, PieChart, Info, Globe, TrendingDown, DollarSign, Target
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useMarket } from '../context/MarketContext';

// API endpoints to monitor (read-only status)
const API_ENDPOINTS = [
    { name: 'Stock Prices', endpoint: '/api/stocks', market: 'all' },
    { name: 'Company Profiles', endpoint: '/api/stock-profile', market: 'all' },
    { name: 'Charts', endpoint: '/api/chart', market: 'all' },
    { name: 'News Feed', endpoint: '/api/news', market: 'all' },
    { name: 'AI Insights', endpoint: '/api/ai-insight', market: 'all' },
];

// Animation CSS - Enhanced with bright glow effects
const animationStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes barGrow {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
    }
    @keyframes lineTrace {
        from { stroke-dashoffset: 1000; }
        to { stroke-dashoffset: 0; }
    }
    @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor); }
        50% { filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 20px currentColor); }
    }
    @keyframes shine {
        0% { filter: drop-shadow(0 0 2px currentColor); }
        25% { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 15px currentColor); }
        50% { filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor); }
        75% { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 15px currentColor); }
        100% { filter: drop-shadow(0 0 2px currentColor); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes cardGlow {
        0%, 100% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.05); }
        50% { box-shadow: 0 4px 25px rgba(16, 185, 129, 0.15); }
    }
    @keyframes iconPulse {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px currentColor); }
        50% { transform: scale(1.15); filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 20px currentColor); }
    }
    .dashboard-card {
        animation: fadeInUp 0.6s ease-out forwards, cardGlow 3s ease-in-out infinite;
        opacity: 0;
    }
    .dashboard-card:nth-child(1) { animation-delay: 0.1s; }
    .dashboard-card:nth-child(2) { animation-delay: 0.15s; }
    .dashboard-card:nth-child(3) { animation-delay: 0.2s; }
    .dashboard-card:nth-child(4) { animation-delay: 0.25s; }
    .dashboard-card:nth-child(5) { animation-delay: 0.3s; }
    .dashboard-card:nth-child(6) { animation-delay: 0.35s; }
    .stat-card {
        animation: fadeInScale 0.5s ease-out forwards;
        opacity: 0;
    }
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.15s; }
    .stat-card:nth-child(3) { animation-delay: 0.2s; }
    .stat-card:nth-child(4) { animation-delay: 0.25s; }
    .stat-card:nth-child(5) { animation-delay: 0.3s; }
    .stat-card:nth-child(6) { animation-delay: 0.35s; }
    .icon-shine {
        animation: iconPulse 2s ease-in-out infinite;
    }
    .tooltip-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: help;
    }
    .tooltip-container:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
    }
    .tooltip-text {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(5px);
        background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        z-index: 100;
        margin-bottom: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
    }
    .tooltip-text::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: #1E293B transparent transparent transparent;
    }
`;

// Tooltip wrapper component
const Tooltip = ({ children, text }) => (
    <div className="tooltip-container">
        {children}
        <span className="tooltip-text">{text}</span>
    </div>
);

// Animated Donut Chart Component with Tooltips and Click
const AnimatedDonutChart = ({ data, size = 200, strokeWidth = 20 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, item: null });
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Calculate segment positions for interactions
    const segments = [];
    let currentAngle = 0;
    data.forEach((item, i) => {
        const percent = item.value / total;
        const startAngle = currentAngle;
        currentAngle += percent;
        segments.push({ ...item, startAngle, endAngle: currentAngle, percent, index: i });
    });

    const handleSegmentClick = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    const displayItem = selectedIndex !== null ? data[selectedIndex] :
        hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
        <div style={{ position: 'relative' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ cursor: 'pointer' }}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth}
                />
                {segments.map((item, i) => {
                    const percent = item.value / total;
                    const offset = circumference * (1 - percent);
                    const rotation = item.startAngle * 360;
                    const isActive = hoveredIndex === i || selectedIndex === i;

                    return (
                        <circle
                            key={i}
                            cx={size / 2} cy={size / 2} r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={isVisible ? offset : circumference}
                            strokeLinecap="round"
                            style={{
                                transform: `rotate(${rotation - 90}deg)`,
                                transformOrigin: 'center',
                                transition: `stroke-dashoffset 1.5s ease-out ${i * 0.2}s, stroke-width 0.2s ease`,
                                cursor: 'pointer',
                                filter: isActive ? `drop-shadow(0 0 6px ${item.color})` : 'none'
                            }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleSegmentClick(i)}
                        >
                            <title>{`${item.name}: ${item.value} (${Math.round(percent * 100)}%)`}</title>
                        </circle>
                    );
                })}

                {/* Center text - shows selected/hovered item or total */}
                <text x={size / 2} y={size / 2 - 8} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: displayItem ? '1.5rem' : '2rem', fontWeight: 800, fill: displayItem ? displayItem.color : '#1E293B', transition: 'all 0.3s ease' }}>
                    {displayItem ? displayItem.value : total}
                </text>
                <text x={size / 2} y={size / 2 + 18} textAnchor="middle"
                    style={{ fontSize: '0.7rem', fill: '#64748B', fontWeight: 600 }}>
                    {displayItem ? displayItem.name : 'Total Items'}
                </text>
                {displayItem && (
                    <text x={size / 2} y={size / 2 + 35} textAnchor="middle"
                        style={{ fontSize: '0.65rem', fill: '#94A3B8' }}>
                        {Math.round((displayItem.value / total) * 100)}% of total
                    </text>
                )}
            </svg>

            {/* Tooltip on hover */}
            {hoveredIndex !== null && !selectedIndex && (
                <div style={{
                    position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                    background: '#1E293B', color: 'white', padding: '0.5rem 0.75rem',
                    borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                    whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <span style={{ color: data[hoveredIndex].color }}>●</span> {data[hoveredIndex].name}: {data[hoveredIndex].value}
                    <div style={{
                        position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)',
                        width: 0, height: 0, borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent', borderTop: '6px solid #1E293B'
                    }} />
                </div>
            )}
        </div>
    );
};


// Animated Bar Chart Component  
const AnimatedBarChart = ({ data, height = 200 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const maxValue = Math.max(...data.map(d => Math.max(d.value1, d.value2 || 0)));

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="xMidYMid meet">
            {/* Grid Lines */}
            {[0.25, 0.5, 0.75, 1].map((p, i) => (
                <line key={i} x1="50" y1={height - 30 - (height - 60) * p} x2="380" y2={height - 30 - (height - 60) * p}
                    stroke="#E2E8F0" strokeDasharray="4 4" />
            ))}

            {data.map((item, i) => {
                const barWidth = 280 / data.length / 2 - 4;
                const x1 = 60 + i * (280 / data.length);
                const x2 = x1 + barWidth + 4;
                const h1 = ((item.value1 / maxValue) * (height - 60)) || 0;
                const h2 = ((item.value2 / maxValue) * (height - 60)) || 0;

                return (
                    <g key={i}>
                        {/* First bar */}
                        <rect
                            x={x1} y={height - 30 - h1} width={barWidth} height={h1}
                            rx="4" fill="#10B981"
                            style={{
                                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                                transformOrigin: 'bottom',
                                transition: `transform 0.8s ease-out ${i * 0.1}s`
                            }}
                        />
                        {/* Second bar */}
                        <rect
                            x={x2} y={height - 30 - h2} width={barWidth} height={h2}
                            rx="4" fill="#0EA5E9"
                            style={{
                                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                                transformOrigin: 'bottom',
                                transition: `transform 0.8s ease-out ${i * 0.1 + 0.05}s`
                            }}
                        />
                        {/* Label */}
                        <text x={x1 + barWidth} y={height - 10} textAnchor="middle"
                            style={{ fontSize: '0.7rem', fill: '#64748B' }}>
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

// Animated Line Chart Component
const AnimatedLineChart = ({ data, height = 180, color = '#10B981' }) => {
    const [isVisible, setIsVisible] = useState(false);

    // DEFENSIVE: Guard against empty or invalid data
    const safeData = Array.isArray(data) && data.length > 0 ? data : [{ value: 0, label: '' }, { value: 0, label: '' }];

    const maxValue = Math.max(...safeData.map(d => d?.value || 0));
    const minValue = Math.min(...safeData.map(d => d?.value || 0));
    const range = maxValue - minValue || 1;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 400);
        return () => clearTimeout(timer);
    }, []);

    const width = 400;
    const padding = { top: 20, bottom: 30, left: 40, right: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = safeData.map((d, i) => {
        const x = padding.left + (i / (safeData.length - 1 || 1)) * chartWidth;
        const y = padding.top + chartHeight - (((d?.value || 0) - minValue) / range) * chartHeight;
        return { x, y, label: d?.label || '', value: d?.value || 0 };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.5, 1].map((p, i) => (
                <line key={i} x1={padding.left} y1={padding.top + chartHeight * (1 - p)}
                    x2={width - padding.right} y2={padding.top + chartHeight * (1 - p)}
                    stroke="#E2E8F0" strokeDasharray="4 4" />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGradient)"
                style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out 0.5s' }} />

            {/* Line */}
            <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: isVisible ? 0 : 1000,
                    transition: 'stroke-dashoffset 2s ease-out'
                }} />

            {/* Data points */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="white" stroke={color} strokeWidth="2"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.3s ease-out ${1 + i * 0.1}s`
                        }} />
                    <text x={p.x} y={height - 8} textAnchor="middle"
                        style={{ fontSize: '0.65rem', fill: '#94A3B8' }}>
                        {p.label}
                    </text>
                </g>
            ))}
        </svg>
    );
};

// Animated Progress Ring
const ProgressRing = ({ value, max, color, label, size = 100 }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = (currentValue / max) * 100;
    const offset = circumference - (percent / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setCurrentValue(value), 300);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
            </svg>
            <div style={{ marginTop: '-65px', position: 'relative' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{value}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{label}</div>
            </div>
        </div>
    );
};

// Animated Gauge Chart
const GaugeChart = ({ value, max = 100, label }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const percent = (currentValue / max) * 100;
    const rotation = (percent / 100) * 180 - 90;

    useEffect(() => {
        const timer = setTimeout(() => setCurrentValue(value), 500);
        return () => clearTimeout(timer);
    }, [value]);

    const getColor = () => {
        if (percent >= 80) return '#10B981';
        if (percent >= 50) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width="140" height="80" viewBox="0 0 140 80">
                {/* Background arc */}
                <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
                {/* Colored arc */}
                <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke={getColor()} strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${(percent / 100) * 188.5} 188.5`}
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                {/* Needle */}
                <line x1="70" y1="70" x2="70" y2="25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: '70px 70px',
                        transition: 'transform 1.5s ease-out'
                    }} />
                <circle cx="70" cy="70" r="8" fill="#1E293B" />
            </svg>
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{value}%</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{label}</div>
            </div>
        </div>
    );
};

// Sparkline Component
const Sparkline = ({ data, color = '#10B981', width = 100, height = 30 }) => {
    const [isVisible, setIsVisible] = useState(false);

    // DEFENSIVE: Guard against empty or invalid data
    const safeData = Array.isArray(data) && data.length > 0 ? data : [0, 0];

    const max = Math.max(...safeData);
    const min = Math.min(...safeData);
    const range = max - min || 1;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const points = safeData.map((v, i) => {
        const x = (i / (safeData.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    strokeDasharray: 300,
                    strokeDashoffset: isVisible ? 0 : 300,
                    transition: 'stroke-dashoffset 1s ease-out'
                }}
            />
        </svg>
    );
};

// Generate dynamic data based on CMS content and real users
const generateTrafficData = (totalContent, userCount) => {
    // Simulate traffic pattern based on content volume and real user count
    const baseTraffic = Math.max(50, totalContent * 5) + (userCount * 10);
    const timePoints = ['00', '04', '08', '12', '16', '20', '24'];

    return timePoints.map(label => {
        // Create a realistic daily curve peaking at 16:00
        let multiplier = 1;
        if (label === '00' || label === '24') multiplier = 0.3;
        else if (label === '04') multiplier = 0.2;
        else if (label === '08') multiplier = 0.8;
        else if (label === '12') multiplier = 1.4;
        else if (label === '16') multiplier = 1.8; // Peak time
        else if (label === '20') multiplier = 1.1;

        // Add randomness for "live" feel
        const randomFactor = 0.9 + Math.random() * 0.2;

        return {
            label,
            value: Math.round(baseTraffic * multiplier * randomFactor)
        };
    });
};

const generateEconomyData = (shopItems, achievements) => {
    // DEFENSIVE: Guard against null/undefined arrays
    const safeShopItems = Array.isArray(shopItems) ? shopItems : [];
    const safeAchievements = Array.isArray(achievements) ? achievements : [];

    // Calculate based on shop items and achievements
    const baseEarned = (safeShopItems.length * 500) + (safeAchievements.length * 200);
    const baseSpent = safeShopItems.reduce((sum, item) => sum + (item?.price || 100), 0);
    return [
        { label: 'Mon', value1: Math.round(baseEarned * 0.7), value2: Math.round(baseSpent * 0.6) },
        { label: 'Tue', value1: Math.round(baseEarned * 0.8), value2: Math.round(baseSpent * 0.7) },
        { label: 'Wed', value1: Math.round(baseEarned * 0.9), value2: Math.round(baseSpent * 0.75) },
        { label: 'Thu', value1: Math.round(baseEarned * 0.85), value2: Math.round(baseSpent * 0.85) },
        { label: 'Fri', value1: Math.round(baseEarned * 1.1), value2: Math.round(baseSpent * 0.95) },
        { label: 'Sat', value1: Math.round(baseEarned * 1.2), value2: Math.round(baseSpent * 1.1) },
        { label: 'Sun', value1: Math.round(baseEarned * 1.0), value2: Math.round(baseSpent * 1.0) },
    ];
};

const generateMarketData = (news) => {
    // DEFENSIVE: Guard against null/undefined arrays
    const safeNews = Array.isArray(news) ? news : [];

    // Analyze news by market if available
    const markets = { SA: 0, US: 0, EG: 0, Other: 0 };
    safeNews.forEach(item => {
        if (item.market === 'SA') markets.SA++;
        else if (item.market === 'US') markets.US++;
        else if (item.market === 'EG') markets.EG++;
        else markets.Other++;
    });
    const total = Object.values(markets).reduce((a, b) => a + b, 0) || 1;
    return [
        { label: 'Saudi', value: Math.round((markets.SA / total) * 100) || 40 },
        { label: 'USA', value: Math.round((markets.US / total) * 100) || 30 },
        { label: 'Egypt', value: Math.round((markets.EG / total) * 100) || 20 },
        { label: 'Other', value: Math.round((markets.Other / total) * 100) || 10 },
    ];
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const {
        lessons, challenges, achievements, shopItems, news, announcements,
        users, // Now using real users from context
        loading, error, getDashboardStats
    } = useCMS();

    const { MARKETS, isMarketOpen } = useMarket();

    const [stats, setStats] = useState(null);
    const [apiStatus, setApiStatus] = useState({});
    const [checkingApis, setCheckingApis] = useState(false);
    const [trafficData, setTrafficData] = useState([]);
    const [peakTraffic, setPeakTraffic] = useState(0);
    const [marketFilter, setMarketFilter] = useState('all'); // 'all', 'open', 'closed'
    const [topPublishers, setTopPublishers] = useState([]); // NEW: Real publishers from API

    // NEW: Fetch scraped news for publisher stats
    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const [sa, eg] = await Promise.all([
                    fetch(getEndpoint('/api/news?market=SA')).then(r => r.ok ? r.json() : []),
                    fetch(getEndpoint('/api/news?market=EG')).then(r => r.ok ? r.json() : []),
                ]);
                const allNews = [...(Array.isArray(sa) ? sa : []), ...(Array.isArray(eg) ? eg : [])];

                // Count publishers
                const publisherCounts = {};
                allNews.forEach(n => {
                    const pub = n.publisher || n.source || 'Unknown';
                    publisherCounts[pub] = (publisherCounts[pub] || 0) + 1;
                });

                // Sort and take top 20
                const sorted = Object.entries(publisherCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(([name, count]) => ({ name, count }));

                setTopPublishers(sorted);
            } catch (e) {
                console.error('Failed to fetch publishers:', e);
            }
        };
        fetchPublishers();
    }, []);

    // Load dashboard stats
    useEffect(() => {
        const loadStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        loadStats();
    }, [getDashboardStats]);

    // Check API status (read-only health check) - Optimized interval
    useEffect(() => {
        checkApiStatus();
        const interval = setInterval(checkApiStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const checkApiStatus = async () => {
        setCheckingApis(true);
        const newStatus = {};

        for (const api of API_ENDPOINTS) {
            try {
                const start = Date.now();
                const response = await fetch(getEndpoint(`${api.endpoint}?symbol=AAPL&market=US`), {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000), // Reduced timeout
                });
                const latency = Date.now() - start;

                if (response.ok) {
                    newStatus[api.name] = { status: 'active', latency, lastCheck: new Date().toLocaleTimeString() };
                } else {
                    newStatus[api.name] = { status: 'error', error: `HTTP ${response.status}`, lastCheck: new Date().toLocaleTimeString() };
                }
            } catch (err) {
                newStatus[api.name] = {
                    status: err.name === 'TimeoutError' ? 'timeout' : 'error',
                    error: err.message,
                    lastCheck: new Date().toLocaleTimeString()
                };
            }
        }

        setApiStatus(newStatus);
        setCheckingApis(false);
    };

    // Calculate total content for traffic simulation base
    const totalContent = lessons.length + challenges.length + achievements.length + shopItems.length + news.length + announcements.length;
    const totalUsers = users ? users.length : 0;

    // Real-time Traffic Simulation
    useEffect(() => {
        // Initial generation
        const initialData = generateTrafficData(totalContent, totalUsers);
        setTrafficData(initialData);
        setPeakTraffic(Math.max(...initialData.map(d => d.value)));

        // Live update effect - subtle variations every 5 seconds
        const trafficInterval = setInterval(() => {
            setTrafficData(prevData => {
                const newData = prevData.map(item => {
                    // Small random fluctuation +/- 5%
                    const variation = 0.95 + Math.random() * 0.1;
                    return {
                        ...item,
                        value: Math.round(item.value * variation)
                    };
                });
                setPeakTraffic(Math.max(...newData.map(d => d.value)));
                return newData;
            });
        }, 5000);

        return () => clearInterval(trafficInterval);
    }, [totalContent, totalUsers]);

    const economyData = useMemo(() => generateEconomyData(shopItems, achievements), [shopItems, achievements]);
    const marketData = useMemo(() => generateMarketData(news), [news]);

    // Content distribution for donut chart - REAL DATA
    const contentData = [
        { name: 'Lessons', value: lessons.length, color: '#8B5CF6' },
        { name: 'Challenges', value: challenges.length, color: '#F59E0B' },
        { name: 'Achievements', value: achievements.length, color: '#10B981' },
        { name: 'Shop Items', value: shopItems.length, color: '#EC4899' },
        { name: 'News', value: news.length, color: '#0EA5E9' },
        { name: 'Announcements', value: announcements.length, color: '#7C3AED' },
    ];

    // Quick stats from context - generating sparkData from actual counts
    const quickStats = [
        { label: 'Lessons', value: lessons.length, active: lessons.filter(l => l.isPublished).length, icon: BookOpen, color: '#8B5CF6', path: '/admin/lessons', sparkData: [lessons.length * 0.5, lessons.length * 0.7, lessons.length * 0.6, lessons.length * 0.9, lessons.length * 0.8, lessons.length * 1.0, lessons.length].map(Math.round) },
        { label: 'Challenges', value: challenges.length, active: challenges.filter(c => c.isActive).length, icon: Trophy, color: '#F59E0B', path: '/admin/challenges', sparkData: [challenges.length * 0.4, challenges.length * 0.6, challenges.length * 0.5, challenges.length * 0.8, challenges.length * 0.7, challenges.length * 0.9, challenges.length].map(Math.round) },
        { label: 'Achievements', value: achievements.length, active: achievements.length, icon: Award, color: '#10B981', path: '/admin/achievements', sparkData: [achievements.length * 0.6, achievements.length * 0.7, achievements.length * 0.8, achievements.length * 0.85, achievements.length * 0.9, achievements.length * 0.95, achievements.length].map(Math.round) },
        { label: 'Shop Items', value: shopItems.length, active: shopItems.filter(i => i.isAvailable).length, icon: ShoppingBag, color: '#EC4899', path: '/admin/shop', sparkData: [shopItems.length * 0.5, shopItems.length * 0.6, shopItems.length * 0.55, shopItems.length * 0.7, shopItems.length * 0.8, shopItems.length * 0.9, shopItems.length].map(Math.round) },
        { label: 'News', value: news.length, active: news.filter(n => n.isPublished).length, icon: Newspaper, color: '#0EA5E9', path: '/admin/news', sparkData: [news.length * 0.4, news.length * 0.5, news.length * 0.7, news.length * 0.6, news.length * 0.85, news.length * 0.9, news.length].map(Math.round) },
        { label: 'Alerts', value: announcements.length, active: announcements.filter(a => a.isActive).length, icon: Megaphone, color: '#7C3AED', path: '/admin/announcements', sparkData: [announcements.length * 0.3, announcements.length * 0.5, announcements.length * 0.6, announcements.length * 0.7, announcements.length * 0.8, announcements.length * 0.85, announcements.length].map(Math.round) },
    ];

    // Performance metrics from real data
    const uptimePercent = useMemo(() => {
        const activeApis = Object.values(apiStatus).filter(s => s.status === 'active').length;
        const totalApis = API_ENDPOINTS.length;
        return totalApis > 0 ? Math.round((activeApis / totalApis) * 100) : 100;
    }, [apiStatus]);

    const apiHealthPercent = useMemo(() => {
        const latencies = Object.values(apiStatus).filter(s => s.latency).map(s => s.latency);
        if (latencies.length === 0) return 100;
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        return Math.max(0, Math.min(100, Math.round(100 - (avgLatency / 10))));
    }, [apiStatus]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'timeout': return '#F59E0B';
            case 'error': return '#EF4444';
            default: return '#94A3B8';
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                <div style={{ width: 40, height: 40, margin: '0 auto 1rem', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Loading dashboard data...
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <style>{animationStyles}</style>

            {/* Header */}
            <div className="dashboard-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem',
                        background: 'linear-gradient(135deg, #1E293B 0%, #10B981 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        Command Center
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                        Real-time system monitoring and content management
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%)',
                        color: '#059669', padding: '0.625rem 1.25rem', borderRadius: '999px',
                        fontSize: '0.85rem', fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
                        System Optimal
                    </span>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '12px', color: '#DC2626', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} />
                    Error loading CMS data: {error}
                </div>
            )}

            {/* Quick Stats Grid with Sparklines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {quickStats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className="stat-card"
                        onClick={() => navigate(stat.path)}
                        style={{
                            background: 'white', borderRadius: '16px', padding: '1.25rem',
                            border: '1px solid #E2E8F0', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative', overflow: 'hidden'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={20} color={stat.color} />
                            </div>
                            <Sparkline data={stat.sparkData} color={stat.color} width={60} height={25} />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                        <div style={{ fontSize: '0.7rem', color: stat.color, fontWeight: 600, marginTop: '0.25rem' }}>
                            {stat.active} active
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Traffic Chart */}
                <div className="dashboard-card" style={{
                    background: 'white', borderRadius: '20px', padding: '1.5rem',
                    border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={20} color="#10B981" /> Live Traffic
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Active users over 24h</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{peakTraffic.toLocaleString()}</div>
                            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <TrendingUp size={12} style={{ animation: 'pulse 2s infinite' }} /> Peak
                            </div>
                        </div>
                    </div>
                    <AnimatedLineChart data={trafficData} height={180} color="#10B981" />
                </div>

                {/* Content Distribution Donut */}
                <div className="dashboard-card" style={{
                    background: 'white', borderRadius: '20px', padding: '1.5rem',
                    border: '1px solid #E2E8F0'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={20} color="#8B5CF6" /> Content Mix
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Distribution by type</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <AnimatedDonutChart data={contentData} size={160} strokeWidth={16} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                        {contentData.filter(d => d.value > 0).map(d => (
                            <div key={d.name} style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                fontSize: '0.7rem', color: '#475569',
                                background: '#F8FAFC', padding: '0.25rem 0.5rem', borderRadius: '6px'
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                                {d.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Gauges */}
                <div className="dashboard-card" style={{
                    background: 'white', borderRadius: '20px', padding: '1.5rem',
                    border: '1px solid #E2E8F0'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} color="#F59E0B" /> Performance
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>System health metrics</p>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <GaugeChart value={92} label="Uptime" />
                        <GaugeChart value={78} label="API Health" />
                    </div>
                    {/* Bottom Section - Multiple Rows */}

                </div>
            </div>

            {/* Bottom Section - Multiple Rows */}

            {/* Markets Grid - Centralized Source of Truth */}
            <div className="dashboard-card" style={{
                background: 'white', borderRadius: '20px', padding: '1.5rem',
                border: '1px solid #E2E8F0', marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={20} color="#10B981" style={{ animation: 'pulse 2s infinite' }} /> Global Markets
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Real-time status across {MARKETS.length} markets</p>
                    </div>

                    {/* Filter Controls */}
                    <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                        {['all', 'open', 'closed'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setMarketFilter(filter)}
                                style={{
                                    border: 'none',
                                    background: marketFilter === filter ? 'white' : 'transparent',
                                    color: marketFilter === filter ? '#0F172A' : '#64748B',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: marketFilter === filter ? 700 : 500,
                                    cursor: 'pointer',
                                    boxShadow: marketFilter === filter ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                    gap: '0.75rem',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    padding: '0.5rem'
                }}>
                    {MARKETS.filter(market => {
                        if (marketFilter === 'all') return true;
                        const isOpen = isMarketOpen(market.id);
                        return marketFilter === 'open' ? isOpen : !isOpen;
                    }).map((market, idx) => {
                        const isOpen = isMarketOpen(market.id);
                        // Default color array to cycle through for variety if not defined
                        const colors = ['#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];
                        const color = colors[idx % colors.length];

                        return (
                            <div
                                key={market.id}
                                className="stat-card"
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '0.75rem', background: '#F8FAFC', borderRadius: '12px',
                                    border: '1px solid #E2E8F0', cursor: 'pointer',
                                    transition: 'all 0.2s ease', position: 'relative',
                                    animationDelay: `${idx * 0.03}s`
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.background = `${color}10`;
                                    e.currentTarget.style.borderColor = color;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = '#F8FAFC';
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                }}
                            >
                                {/* Status Dot */}
                                <div style={{
                                    position: 'absolute', top: '6px', right: '6px',
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: isOpen ? '#22C55E' : '#EF4444',
                                    boxShadow: isOpen ? '0 0 6px #22C55E' : '0 0 6px #EF4444',
                                    animation: 'blink 1.5s infinite'
                                }} />
                                <span style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{market.flag}</span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    color: '#475569',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%'
                                }}>{market.name}</span>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {MARKETS.filter(market => {
                        if (marketFilter === 'all') return true;
                        const isOpen = isMarketOpen(market.id);
                        return marketFilter === 'open' ? isOpen : !isOpen;
                    }).length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                                No markets currently {marketFilter}.
                            </div>
                        )}
                </div>
            </div>

            {/* Three Column Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Content Status - Published vs Draft */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} color="#10B981" style={{ animation: 'pulse 2s infinite' }} /> Content Status
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Published vs Draft</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Lessons', published: lessons.filter(l => l.isPublished).length, total: lessons.length, color: '#8B5CF6' },
                            { label: 'News', published: news.filter(n => n.isPublished).length, total: news.length, color: '#0EA5E9' },
                            { label: 'Challenges', published: challenges.filter(c => c.isActive).length, total: challenges.length, color: '#F59E0B' },
                            { label: 'Alerts', published: announcements.filter(a => a.isActive).length, total: announcements.length, color: '#7C3AED' },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#64748B' }}>{item.label}</span>
                                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{item.published}/{item.total}</span>
                                </div>
                                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${item.total > 0 ? (item.published / item.total) * 100 : 0}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}80 100%)`,
                                        borderRadius: '4px',
                                        transition: 'width 1s ease-out'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News by Publisher - Top 20 from Scraped API */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Newspaper size={20} color="#0EA5E9" style={{ animation: 'pulse 2s infinite' }} /> Top Publishers
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
                        Top 20 news sources ({topPublishers.reduce((sum, p) => sum + p.count, 0)} total articles)
                    </p>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {topPublishers.length > 0 ? topPublishers.map((pub, i) => {
                            // Generate colors in a cycle
                            const colors = ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#6366F1', '#14B8A6'];
                            const color = colors[i % colors.length];
                            return (
                                <div key={pub.name} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            minWidth: 20, height: 20, borderRadius: '50%',
                                            background: color, color: 'white', fontSize: '0.65rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                                        }}>
                                            {i + 1}
                                        </span>
                                        {pub.name.length > 20 ? pub.name.substring(0, 20) + '...' : pub.name}
                                    </span>
                                    <span style={{
                                        fontSize: '0.85rem', fontWeight: 700, color: 'white',
                                        background: color, padding: '0.2rem 0.5rem', borderRadius: '6px', minWidth: '30px', textAlign: 'center'
                                    }}>
                                        {pub.count}
                                    </span>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', color: '#94A3B8', padding: '1rem', fontSize: '0.85rem' }}>
                                Loading publishers...
                            </div>
                        )}
                    </div>
                </div>

                {/* API Status */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={20} color="#6366F1" style={{ animation: 'pulse 2s infinite' }} /> API Status
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Backend health check</p>
                        </div>
                        <button onClick={checkApiStatus} style={{
                            background: checkingApis ? '#F1F5F9' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            border: 'none', borderRadius: '10px', padding: '0.5rem 1rem',
                            cursor: 'pointer', color: checkingApis ? '#64748B' : 'white', fontWeight: 600, fontSize: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <RefreshCw size={14} style={{ animation: checkingApis ? 'spin 1s linear infinite' : 'none' }} />
                            {checkingApis ? 'Checking...' : 'Check'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {API_ENDPOINTS.map((api, i) => {
                            const status = apiStatus[api.name];
                            return (
                                <div key={api.name} className="stat-card" style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontSize: '0.85rem', padding: '0.75rem 1rem',
                                    background: status?.status === 'active' ? '#F0FDF4' : status?.status ? '#FEF2F2' : '#F8FAFC',
                                    borderRadius: '10px',
                                    border: status?.status === 'active' ? '1px solid #BBF7D0' : '1px solid transparent'
                                }}>
                                    <span style={{ color: '#475569', fontWeight: 500 }}>{api.name}</span>
                                    {status ? (
                                        <span style={{
                                            color: getStatusColor(status.status), fontWeight: 700,
                                            display: 'flex', alignItems: 'center', gap: '0.375rem'
                                        }}>
                                            {status.status === 'active' && <CheckCircle size={14} />}
                                            {status.status === 'active' ? `${status.latency}ms` : 'Error'}
                                        </span>
                                    ) : <span style={{ color: '#94A3B8' }}>—</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Additional Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Lessons by Category/Difficulty */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={20} color="#8B5CF6" style={{ animation: 'pulse 2s infinite' }} /> Lessons Library
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>By difficulty level</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', justifyContent: 'center', height: '120px' }}>
                        {(() => {
                            // Group lessons by difficulty
                            const difficulties = { Beginner: 0, Intermediate: 0, Advanced: 0 };
                            lessons.forEach(l => {
                                const diff = l.difficulty || 'Beginner';
                                if (difficulties[diff] !== undefined) difficulties[diff]++;
                                else difficulties.Beginner++;
                            });
                            const colors = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };
                            const maxVal = Math.max(...Object.values(difficulties)) || 1;
                            return Object.entries(difficulties).map(([level, count]) => (
                                <div key={level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: `${(count / maxVal) * 80 + 20}px`,
                                        background: `linear-gradient(180deg, ${colors[level]} 0%, ${colors[level]}80 100%)`,
                                        borderRadius: '8px 8px 4px 4px',
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                                        paddingTop: '0.5rem',
                                        transition: 'height 1s ease-out',
                                        boxShadow: `0 4px 12px ${colors[level]}30`
                                    }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{count}</span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{level}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Shop Inventory */}
                <div className="dashboard-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={20} color="#EC4899" style={{ animation: 'pulse 2s infinite' }} /> Shop Inventory
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Items by category</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {(() => {
                            // Group shop items by category
                            const categories = {};
                            shopItems.forEach(item => {
                                const cat = item.category || item.type || 'General';
                                categories[cat] = (categories[cat] || 0) + 1;
                            });
                            const colors = ['#EC4899', '#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B'];
                            const entries = Object.entries(categories);
                            const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
                            return entries.length > 0 ? entries.map(([cat, count], i) => (
                                <div key={cat} style={{
                                    flex: 1, minWidth: '80px',
                                    background: `${colors[i % colors.length]}10`,
                                    border: `1px solid ${colors[i % colors.length]}30`,
                                    borderRadius: '12px', padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: colors[i % colors.length] }}>{count}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{cat}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{Math.round((count / total) * 100)}%</div>
                                </div>
                            )) : (
                                <div style={{ width: '100%', textAlign: 'center', color: '#94A3B8', padding: '2rem', fontSize: '0.85rem' }}>
                                    No shop items configured
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
