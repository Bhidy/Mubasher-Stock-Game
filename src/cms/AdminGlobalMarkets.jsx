import React, { useState, useEffect } from 'react';
import { usePrices } from '../context/PriceContext';
import {
    Globe, Activity, TrendingUp, TrendingDown, Clock, BarChart3,
    RefreshCw, DollarSign, Bitcoin, Flame, Calendar, Gauge, Map, PieChart as PieIcon
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ============================================================================
// PREMIUM GLOBAL MARKETS DASHBOARD - BLOOMBERG INSPIRED
// ============================================================================

const AdminGlobalMarkets = () => {
    const { prices } = usePrices(); // Loading state handled by UI feedback
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Auto-refresh timestamp
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // ========================================================================
    // DATA CONFIGURATION
    // ========================================================================

    const worldIndices = [
        // Americas
        { ticker: '^GSPC', name: 'S&P 500', country: '🇺🇸', region: 'Americas' },
        { ticker: '^DJI', name: 'Dow Jones', country: '🇺🇸', region: 'Americas' },
        { ticker: '^IXIC', name: 'Nasdaq', country: '🇺🇸', region: 'Americas' },
        { ticker: '^GSPTSE', name: 'TSX', country: '🇨🇦', region: 'Americas' },
        { ticker: '^BVSP', name: 'Bovespa', country: '🇧🇷', region: 'Americas' },
        { ticker: '^MXX', name: 'IPC Mexico', country: '🇲🇽', region: 'Americas' },
        // Europe
        { ticker: '^FTSE', name: 'FTSE 100', country: '🇬🇧', region: 'Europe' },
        { ticker: '^GDAXI', name: 'DAX', country: '🇩🇪', region: 'Europe' },
        { ticker: '^FCHI', name: 'CAC 40', country: '🇫🇷', region: 'Europe' },
        { ticker: '^IBEX', name: 'IBEX 35', country: '🇪🇸', region: 'Europe' },
        { ticker: '^SSMI', name: 'SMI', country: '🇨🇭', region: 'Europe' },
        { ticker: '^AEX', name: 'AEX', country: '🇳🇱', region: 'Europe' },
        // Asia-Pacific
        { ticker: '^N225', name: 'Nikkei 225', country: '🇯🇵', region: 'Asia' },
        { ticker: '^HSI', name: 'Hang Seng', country: '🇭🇰', region: 'Asia' },
        { ticker: '^KS11', name: 'KOSPI', country: '🇰🇷', region: 'Asia' },
        { ticker: '^TWII', name: 'TAIEX', country: '🇹🇼', region: 'Asia' },
        { ticker: '^STI', name: 'STI', country: '🇸🇬', region: 'Asia' },
        { ticker: '^AXJO', name: 'ASX 200', country: '🇦🇺', region: 'Asia' },
        // Middle East
        { ticker: '^TASI.SR', name: 'Tadawul', country: '🇸🇦', region: 'MENA' },
        { ticker: '^CASE30', name: 'EGX 30', country: '🇪🇬', region: 'MENA' },
    ];

    const commodities = [
        { ticker: 'GC=F', name: 'Gold', icon: '🥇', unit: '/oz' },
        { ticker: 'SI=F', name: 'Silver', icon: '🥈', unit: '/oz' },
        { ticker: 'BZ=F', name: 'Brent Crude', icon: '🛢️', unit: '/bbl' },
        { ticker: 'CL=F', name: 'WTI Crude', icon: '🛢️', unit: '/bbl' },
        { ticker: 'NG=F', name: 'Natural Gas', icon: '🔥', unit: '/MMBtu' },
        { ticker: 'HG=F', name: 'Copper', icon: '🔶', unit: '/lb' },
    ];

    const currencies = [
        { ticker: 'EURUSD=X', name: 'EUR/USD', base: '🇪🇺', quote: '🇺🇸' },
        { ticker: 'GBPUSD=X', name: 'GBP/USD', base: '🇬🇧', quote: '🇺🇸' },
        { ticker: 'USDJPY=X', name: 'USD/JPY', base: '🇺🇸', quote: '🇯🇵' },
        { ticker: 'USDCHF=X', name: 'USD/CHF', base: '🇺🇸', quote: '🇨🇭' },
        { ticker: 'AUDUSD=X', name: 'AUD/USD', base: '🇦🇺', quote: '🇺🇸' },
        { ticker: 'USDCAD=X', name: 'USD/CAD', base: '🇺🇸', quote: '🇨🇦' },
        { ticker: 'SAR=X', name: 'USD/SAR', base: '🇺🇸', quote: '🇸🇦' },
        { ticker: 'EGP=X', name: 'USD/EGP', base: '🇺🇸', quote: '🇪🇬' },
    ];

    const cryptos = [
        { ticker: 'BTC-USD', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
        { ticker: 'ETH-USD', name: 'Ethereum', icon: 'Ξ', color: '#627eea' },
        { ticker: 'SOL-USD', name: 'Solana', icon: '◎', color: '#9945ff' },
        { ticker: 'XRP-USD', name: 'XRP', icon: '✕', color: '#23292f' },
        { ticker: 'BNB-USD', name: 'BNB', icon: 'B', color: '#f3ba2f' },
        { ticker: 'ADA-USD', name: 'Cardano', icon: '₳', color: '#0033ad' },
    ];

    const economicEvents = [
        { date: 'Dec 13', event: 'US CPI Release', impact: 'high', region: '🇺🇸' },
        { date: 'Dec 14', event: 'ECB Rate Decision', impact: 'high', region: '🇪🇺' },
        { date: 'Dec 18', event: 'Fed FOMC Meeting', impact: 'high', region: '🇺🇸' },
        { date: 'Dec 19', event: 'BOE Rate Decision', impact: 'high', region: '🇬🇧' },
        { date: 'Dec 20', event: 'BOJ Rate Decision', impact: 'medium', region: '🇯🇵' },
        { date: 'Dec 22', event: 'US GDP Q3', impact: 'medium', region: '🇺🇸' },
    ];

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    const getPrice = (ticker) => {
        const data = prices[ticker] || {};
        return {
            price: data.price || data.regularMarketPrice || 0,
            change: data.change || data.regularMarketChange || 0,
            changePercent: data.changePercent || data.regularMarketChangePercent || 0,
        };
    };

    const formatPrice = (price, decimals = 2) => {
        if (!price) return '—';
        return price.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const getVixLevel = () => {
        const vix = getPrice('^VIX');
        const value = vix.price || 20;
        if (value < 15) return { level: 'Extreme Greed', color: '#10b981', score: 85 };
        if (value < 20) return { level: 'Greed', color: '#22c55e', score: 70 };
        if (value < 25) return { level: 'Neutral', color: '#eab308', score: 50 };
        if (value < 30) return { level: 'Fear', color: '#f97316', score: 30 };
        return { level: 'Extreme Fear', color: '#ef4444', score: 15 };
    };

    // ========================================================================
    // CHART DATA PREPARATION
    // ========================================================================

    const prepareMarketData = () => {
        const regions = { 'Americas': [], 'Europe': [], 'Asia': [], 'MENA': [] };
        let positive = 0;
        let negative = 0;

        worldIndices.forEach(idx => {
            const data = getPrice(idx.ticker);
            if (data.changePercent > 0) positive++;
            else negative++;

            if (regions[idx.region]) {
                regions[idx.region].push(data.changePercent);
            }
        });

        const sentimentData = [
            { name: 'Bullish', value: positive, color: '#10b981' },
            { name: 'Bearish', value: negative, color: '#ef4444' },
        ];

        const regionData = Object.entries(regions).map(([name, values]) => ({
            name,
            value: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
        }));

        return { sentimentData, regionData };
    };

    const { sentimentData, regionData } = prepareMarketData();

    // ========================================================================
    // SHARED STYLES
    // ========================================================================

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9',
    };

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #f1f5f9',
    };

    const gridStyle = (cols) => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1rem',
    });

    // ========================================================================
    // RENDER
    // ========================================================================

    const vixData = getVixLevel();

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1800px',
            margin: '0 auto',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
            minHeight: '100vh'
        }}>
            {/* ===================== HEADER ===================== */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1.5rem 2rem',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(15, 23, 42, 0.3)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    }}>
                        <Globe size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            color: 'white',
                            margin: 0,
                            letterSpacing: '-0.02em'
                        }}>
                            Global Markets Command Center
                        </h1>
                        <div style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.875rem',
                            marginTop: '0.25rem'
                        }}>
                            Real-time analytics across 20+ markets worldwide
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                            boxShadow: '0 0 10px #10b981',
                            animation: 'pulse 2s infinite'
                        }} />
                        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>
                            Live Data
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.8rem',
                    }}>
                        <RefreshCw size={14} />
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* ===================== ANALYTICS ROW ===================== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Market Sentiment Pie Chart */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <PieIcon size={24} color="#8b5cf6" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Global Market Sentiment
                        </h2>
                    </div>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regional Performance Bar Chart */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <Activity size={24} color="#3b82f6" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Regional Performance
                        </h2>
                    </div>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fear & Greed Gauge */}
                <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
                    <div style={{ ...sectionHeaderStyle, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                        <Gauge size={24} color="#f59e0b" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'white' }}>
                            Fear & Greed Index
                        </h2>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{
                            width: '160px',
                            height: '80px',
                            margin: '0 auto 1rem',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Gauge Background */}
                            <div style={{
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%',
                                background: `conic-gradient(
                                        #ef4444 0deg 36deg,
                                        #f97316 36deg 72deg,
                                        #eab308 72deg 108deg,
                                        #22c55e 108deg 144deg,
                                        #10b981 144deg 180deg,
                                        transparent 180deg
                                    )`,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }} />
                            {/* Inner Circle */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: '#1e293b',
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                            }} />
                            {/* Needle */}
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '50%',
                                width: '4px',
                                height: '60px',
                                background: 'white',
                                borderRadius: '2px',
                                transformOrigin: 'bottom center',
                                transform: `translateX(-50%) rotate(${(vixData.score - 50) * 1.8}deg)`,
                                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                            }} />
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: vixData.color,
                            marginBottom: '0.25rem',
                        }}>
                            {vixData.score}
                        </div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: vixData.color,
                        }}>
                            {vixData.level}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            Based on VIX: {formatPrice(getPrice('^VIX').price)}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== MAIN GRID ===================== */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* ===================== WORLD INDICES ===================== */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <BarChart3 size={24} color="#3b82f6" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            World Stock Indices
                        </h2>
                        <span style={{
                            marginLeft: 'auto',
                            background: '#eff6ff',
                            color: '#3b82f6',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            {worldIndices.length} Markets
                        </span>
                    </div>
                    <div style={gridStyle(4)}>
                        {worldIndices.map((idx, i) => {
                            const data = getPrice(idx.ticker);
                            const isPositive = data.changePercent >= 0;
                            return (
                                <div key={i} style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: isPositive ? '#f0fdf4' : '#fef2f2',
                                    border: `1px solid ${isPositive ? '#dcfce7' : '#fecaca'}`,
                                    transition: 'transform 0.2s',
                                    cursor: 'default',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.5rem' }}>{idx.country}</span>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
                                            color: '#64748b',
                                            background: '#f1f5f9',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '6px',
                                        }}>
                                            {idx.region}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                                        {idx.name}
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                                        {formatPrice(data.price)}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        color: isPositive ? '#16a34a' : '#dc2626',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===================== ECONOMIC CALENDAR ===================== */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <Calendar size={24} color="#8b5cf6" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Economic Calendar
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {economicEvents.map((event, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                            }}>
                                <span style={{ fontSize: '1.25rem' }}>{event.region}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>
                                        {event.event}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        {event.date}
                                    </div>
                                </div>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: event.impact === 'high' ? '#ef4444' : '#f59e0b',
                                    boxShadow: `0 0 8px ${event.impact === 'high' ? '#ef4444' : '#f59e0b'}`,
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===================== SECOND ROW ===================== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* ===================== COMMODITIES ===================== */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <Flame size={24} color="#f59e0b" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Commodities
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {commodities.map((item, i) => {
                            const data = getPrice(item.ticker);
                            const isPositive = data.changePercent >= 0;
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '10px',
                                    background: '#fffbeb',
                                    border: '1px solid #fef3c7',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#92400e' }}>
                                                {item.unit}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                                            ${formatPrice(data.price)}
                                        </div>
                                        <div style={{
                                            color: isPositive ? '#16a34a' : '#dc2626',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                        }}>
                                            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===================== FOREX ===================== */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <DollarSign size={24} color="#10b981" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Currency Exchange
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currencies.map((pair, i) => {
                            const data = getPrice(pair.ticker);
                            const isPositive = data.changePercent >= 0;
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    background: '#f0fdf4',
                                    border: '1px solid #dcfce7',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>{pair.base}</span>
                                        <span style={{ color: '#94a3b8' }}>→</span>
                                        <span>{pair.quote}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', marginLeft: '0.5rem' }}>
                                            {pair.name}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                                            {formatPrice(data.price, 4)}
                                        </div>
                                        <div style={{
                                            color: isPositive ? '#16a34a' : '#dc2626',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                        }}>
                                            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===================== CRYPTO ===================== */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <Bitcoin size={24} color="#f7931a" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                            Cryptocurrency
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {cryptos.map((coin, i) => {
                            const data = getPrice(coin.ticker);
                            const isPositive = data.changePercent >= 0;
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    background: `${coin.color}10`,
                                    border: `1px solid ${coin.color}30`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: coin.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                        }}>
                                            {coin.icon}
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                                            {coin.name}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                                            ${formatPrice(data.price)}
                                        </div>
                                        <div style={{
                                            color: isPositive ? '#16a34a' : '#dc2626',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                        }}>
                                            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===================== MARKET HEATMAP ===================== */}
            <div style={cardStyle}>
                <div style={sectionHeaderStyle}>
                    <Map size={24} color="#6366f1" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                        Global Market Heatmap
                    </h2>
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.75rem',
                        color: '#64748b'
                    }}>
                        Color intensity = % change magnitude
                    </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {['Americas', 'Europe', 'Asia', 'MENA'].map(region => (
                        <div key={region}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#64748b',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {region}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {worldIndices.filter(idx => idx.region === region).map((idx, i) => {
                                    const data = getPrice(idx.ticker);
                                    const isPositive = data.changePercent >= 0;
                                    const intensity = Math.min(Math.abs(data.changePercent) * 20, 100);
                                    return (
                                        <div key={i} style={{
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                            background: isPositive
                                                ? `rgba(16, 185, 129, ${0.1 + intensity / 200})`
                                                : `rgba(239, 68, 68, ${0.1 + intensity / 200})`,
                                            border: `1px solid ${isPositive ? '#10b98150' : '#ef444450'}`,
                                            flex: '0 0 auto',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                color: isPositive ? '#047857' : '#b91c1c',
                                            }}>
                                                <span>{idx.country}</span>
                                                <span>{idx.name}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                color: isPositive ? '#15803d' : '#dc2626',
                                            }}>
                                                {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pulse Animation Style */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default AdminGlobalMarkets;
