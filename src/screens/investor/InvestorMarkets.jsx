import React, { useState, useEffect, useMemo } from 'react';
import { getEndpoint } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import {
    Globe, Clock, TrendingUp, TrendingDown,
    Zap, AlertTriangle, ArrowRight, Sun, Moon,
    DollarSign, BarChart2, Activity, Calendar, Newspaper
} from 'lucide-react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
    ReferenceLine, Cell
} from 'recharts';
import { useMarket } from '../../context/MarketContext';
import BurgerMenu from '../../components/BurgerMenu';
import Sparkline from '../../components/shared/Sparkline';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

// --- CONFIGURATION ---

const MARKETS_TIMELINE = [
    { id: 'JP', name: 'Tokyo', start: 3, end: 9, color: '#f87171' }, // 03:00 - 09:00 UTC (Approx)
    { id: 'HK', name: 'Hong Kong', start: 1, end: 8, color: '#c084fc' },
    { id: 'SA', name: 'Riyadh (TASI)', start: 7, end: 12, color: '#10b981' }, // 07:00 - 12:00 UTC
    { id: 'EG', name: 'Cairo', start: 8, end: 12.5, color: '#fbbf24' },
    { id: 'UK', name: 'London', start: 8, end: 16.5, color: '#60a5fa' },
    { id: 'US', name: 'New York', start: 14.5, end: 21, color: '#3b82f6' }, // 14:30 - 21:00 UTC
];

const ASSET_CLASSES = [
    { name: 'Gold', symbol: 'XAU', value: '2,035.40', change: 0.45, isPositive: true },
    { name: 'Oil (WTI)', symbol: 'CL=F', value: '72.40', change: -1.2, isPositive: false },
    { name: 'Bitcoin', symbol: 'BTC', value: '43,250', change: 2.1, isPositive: true },
    { name: 'USD Index', symbol: 'DXY', value: '102.4', change: 0.1, isPositive: true },
];

const INDICES_CONFIG = [
    // Middle East & Africa
    { marketId: 'SA', symbol: '^TASI.SR', name: 'TASI', flag: '🇸🇦', importance: 80 },
    { marketId: 'AE', symbol: '^DFMGI', name: 'DFM', flag: '🇦🇪', importance: 70 },
    { marketId: 'AE', symbol: '^ADI', name: 'ADX', flag: '🇦🇪', importance: 68 },
    { marketId: 'EG', symbol: '^CASE30', name: 'EGX 30', flag: '🇪🇬', importance: 60 },
    { marketId: 'QA', symbol: '^QSI', name: 'QE Index', flag: '🇶🇦', importance: 65 },
    { marketId: 'KW', symbol: '^KWSE', name: 'Kuwait', flag: '🇰🇼', importance: 62 },
    { marketId: 'BH', symbol: '^BAX', name: 'Bahrain', flag: '🇧🇭', importance: 55 },
    // Americas
    { marketId: 'US', symbol: '^GSPC', name: 'S&P 500', flag: '🇺🇸', importance: 100 },
    { marketId: 'US', symbol: '^IXIC', name: 'NASDAQ', flag: '🇺🇸', importance: 95 },
    { marketId: 'US', symbol: '^DJI', name: 'Dow Jones', flag: '🇺🇸', importance: 92 },
    { marketId: 'CA', symbol: '^GSPTSE', name: 'TSX', flag: '🇨🇦', importance: 75 },
    { marketId: 'BR', symbol: '^BVSP', name: 'Bovespa', flag: '🇧🇷', importance: 72 },
    { marketId: 'MX', symbol: '^MXX', name: 'IPC Mexico', flag: '🇲🇽', importance: 65 },
    // Europe
    { marketId: 'UK', symbol: '^FTSE', name: 'FTSE 100', flag: '🇬🇧', importance: 88 },
    { marketId: 'DE', symbol: '^GDAXI', name: 'DAX', flag: '🇩🇪', importance: 85 },
    { marketId: 'FR', symbol: '^FCHI', name: 'CAC 40', flag: '🇫🇷', importance: 82 },
    { marketId: 'CH', symbol: '^SSMI', name: 'SMI', flag: '🇨🇭', importance: 78 },
    { marketId: 'NL', symbol: '^AEX', name: 'AEX', flag: '🇳🇱', importance: 70 },
    // Asia-Pacific
    { marketId: 'JP', symbol: '^N225', name: 'Nikkei 225', flag: '🇯🇵', importance: 90 },
    { marketId: 'HK', symbol: '^HSI', name: 'Hang Seng', flag: '🇭🇰', importance: 85 },
    { marketId: 'CN', symbol: '000001.SS', name: 'Shanghai', flag: '🇨🇳', importance: 88 },
    { marketId: 'KR', symbol: '^KS11', name: 'KOSPI', flag: '🇰🇷', importance: 80 },
    { marketId: 'AU', symbol: '^AXJO', name: 'ASX 200', flag: '🇦🇺', importance: 75 },
];

// --- COMPONENTS ---

// 1. Market Horizon Clock (Timeline)
const MarketHorizon = () => {
    const [nowPercent, setNowPercent] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const utcHours = now.getUTCHours() + (now.getUTCMinutes() / 60);
            setNowPercent((utcHours / 24) * 100);
        };
        updateTime();
        const i = setInterval(updateTime, 60000);
        return () => clearInterval(i);
    }, []);

    return (
        <Card style={{ padding: '1.5rem', marginBottom: '1.5rem', overflow: 'hidden', position: 'relative' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    <Clock size={18} color="#0EA5E9" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Market Horizon (UTC)</h3>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Live Timeline</div>
            </div>

            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
                {/* Time Grid */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.7rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
                    {[0, 6, 12, 18, 24].map(h => (
                        <div key={h} style={{ position: 'relative', height: '100%' }}>
                            <div style={{ position: 'absolute', bottom: -20, left: -5 }}>{h}:00</div>
                            <div style={{ width: '1px', height: '100%', background: '#f1f5f9' }} />
                        </div>
                    ))}
                </div>

                {/* Market Bars */}
                {MARKETS_TIMELINE.map((m, i) => {
                    const params = {
                        left: `${(m.start / 24) * 100}%`,
                        width: `${((m.end - m.start) / 24) * 100}%`,
                        top: `${i * 20 + 10}px`
                    };
                    const isActive = nowPercent > (m.start / 24) * 100 && nowPercent < (m.end / 24) * 100;

                    return (
                        <div key={m.id} style={{
                            position: 'absolute',
                            left: params.left,
                            width: params.width,
                            top: params.top,
                            height: '12px',
                            background: isActive ? m.color : '#e2e8f0',
                            borderRadius: '6px',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}>
                            {/* Label on Hover/Active */}
                            <div style={{
                                position: 'absolute', left: '105%', top: '-2px',
                                fontSize: '0.7rem', fontWeight: 700,
                                color: isActive ? '#0f172a' : '#94a3b8',
                                whiteSpace: 'nowrap'
                            }}>
                                {m.name} {isActive && <span style={{ color: '#10b981', marginLeft: 4 }}>• LIVE</span>}
                            </div>
                        </div>
                    );
                })}

                {/* Current Time Indicator */}
                <div style={{
                    position: 'absolute',
                    left: `${nowPercent}%`,
                    top: 0,
                    bottom: -20,
                    width: '2px',
                    background: '#ef4444',
                    zIndex: 20,
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}>
                    <div style={{
                        position: 'absolute', top: -5, left: -4, width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444'
                    }} />
                </div>
            </div>
        </Card>
    );
};

// 2. Main Screen Component
export default function InvestorMarkets() {
    const navigate = useNavigate();
    const { isMarketOpen, selectMarket } = useMarket();
    const [indicesData, setIndicesData] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Indices Data
    const fetchIndices = async () => {
        try {
            const promises = INDICES_CONFIG.map(async (idx) => {
                try {
                    const res = await fetch(getEndpoint(`/api/stock-profile?symbol=${encodeURIComponent(idx.symbol)}`));
                    const data = await res.json();

                    if (!data || data.error) throw new Error('No Data');

                    // API returns normalized fields: price, changePercent, prevClose
                    const price = Number(data.price || data.regularMarketPrice || 0);
                    let changePercent = data.changePercent !== undefined ? data.changePercent : data.regularMarketChangePercent;

                    // Fallback if changePercent is missing or null
                    if (changePercent === undefined || changePercent === null) {
                        const prev = Number(data.prevClose || data.previousClose || data.regularMarketPreviousClose);
                        if (prev && price) {
                            changePercent = ((price - prev) / prev) * 100;
                        } else {
                            changePercent = 0;
                        }
                    }

                    // Handle case where API returns a string
                    changePercent = Number(changePercent);

                    return {
                        ...idx,
                        value: price,
                        displayValue: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        change: changePercent || 0, // Ensure it's not NaN
                        // Mock volume based on change magnitude for visibility
                        volume: 100 + (Math.abs(changePercent) * 50),
                        status: isMarketOpen(idx.marketId) ? 'OPEN' : 'CLOSED'
                    };
                } catch {
                    return { ...idx, value: 0, displayValue: '---', change: 0, volume: 50, status: 'CLOSED' };
                }
            });
            const results = await Promise.all(promises);
            setIndicesData(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Fetch News Data
    const fetchNews = async () => {
        try {
            const res = await fetch(getEndpoint('/api/news?market=global&limit=10'));
            const data = await res.json();
            if (data && Array.isArray(data.articles)) {
                setNews(data.articles);
            } else if (Array.isArray(data)) {
                setNews(data);
            }
        } catch (e) {
            console.error('News fetch error:', e);
        }
    };

    useEffect(() => {
        fetchIndices();
        fetchNews();
        const indicesInterval = setInterval(fetchIndices, 60000);
        const newsInterval = setInterval(fetchNews, 300000); // Refresh news every 5 mins
        return () => {
            clearInterval(indicesInterval);
            clearInterval(newsInterval);
        };
    }, []);

    // Scatter Data Preparation
    const scatterData = useMemo(() => {
        return indicesData.map(i => ({
            x: Number(i.change.toFixed(2)),
            y: i.importance, // Y axis is Importance/Size
            z: i.volume, // Z axis is Volume (Bubble Size)
            name: i.name,
            symbol: i.symbol,
            fill: i.change >= 0 ? '#10b981' : '#ef4444'
        }));
    }, [indicesData]);

    // Daily Insight (Mock AI)
    const dailyInsight = useMemo(() => {
        const positives = indicesData.filter(i => i.change > 0).length;
        if (positives > indicesData.length / 2) return {
            title: "Bullish Momentum Dominates",
            desc: "Global equities are trending higher, led by US technology sectors. Risk appetite is returning as bond yields stabilize.",
            trend: 'up'
        };
        return {
            title: "Cautious Global Sentiment",
            desc: "Markets are mixed to lower as investors weigh earnings reports. Defensives are outperforming growth stocks today.",
            trend: 'down'
        };
    }, [indicesData]);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '120px' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: '1.5rem 1.5rem 3rem 1.5rem',
                color: 'white',
                borderBottomRightRadius: '32px',
                borderBottomLeftRadius: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <BurgerMenu variant="glass" />
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Global Pulse</h1>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Real-time Market Analytics</div>
                        </div>
                    </div>
                </div>

                {/* The Daily Brief Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: dailyInsight.trend === 'up' ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: '0.9rem' }}>
                            {dailyInsight.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {dailyInsight.title}
                        </div>
                        <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.7rem' }}>AI Insight</div>
                    </div>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                        {dailyInsight.desc}
                    </p>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', marginTop: '1.5rem' }}>

                {/* 1. Market Horizon (Clock) */}
                <MarketHorizon />

                {/* 2. Performance Landscape (Bubble Chart) */}
                <Card style={{ padding: '1rem', minHeight: '320px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <div className="flex-center" style={{ gap: '0.5rem' }}>
                            <Activity size={18} color="#8b5cf6" />
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Performance Landscape</h3>
                        </div>
                    </div>
                    <div style={{ height: '240px', width: '100%', paddingRight: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Change"
                                    unit="%"
                                    stroke="#94a3b8"
                                    tick={{ fontSize: 10 }}
                                    domain={[
                                        dataMin => Math.min(dataMin, -1.5),
                                        dataMax => Math.max(dataMax, 1.5)
                                    ]}
                                />
                                <YAxis type="number" dataKey="y" name="Importance" hide domain={[0, 120]} />
                                <ZAxis type="number" dataKey="z" range={[100, 600]} name="Volume" />
                                <ReTooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div style={{ background: '#1e293b', color: 'white', padding: '10px', borderRadius: '12px', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                                    <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span>{data.name}</span>
                                                        <span style={{ fontSize: '0.7em', padding: '1px 4px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }}>{data.symbol}</span>
                                                    </div>
                                                    <div style={{ color: data.x >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                                                        {data.x > 0 ? '+' : ''}{data.x.toFixed(2)}%
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
                                <Scatter name="Markets" data={scatterData} fill="#8884d8">
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={2} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                </Card>

                {/* 3. Asset Class Cross-Check (Grid) */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>Global Assets</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {ASSET_CLASSES.map((asset, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{asset.name}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{asset.value}</div>
                                <div style={{
                                    fontSize: '0.8rem', fontWeight: 700,
                                    color: asset.isPositive ? '#10b981' : '#ef4444',
                                    marginTop: '0.25rem'
                                }}>
                                    {asset.isPositive ? '+' : ''}{asset.change}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Detailed Indices Cards (White BG as requested) */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>Indices & Futures</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {indicesData.map((idx) => (
                        <div
                            key={idx.symbol}
                            onClick={() => { selectMarket(idx.marketId); navigate('/market'); }}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '1.25rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', width: '40px', height: '40px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {idx.flag}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{idx.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: idx.status === 'OPEN' ? '#10b981' : '#cbd5e1' }} />
                                        {idx.status}
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{idx.displayValue}</div>
                                <Badge
                                    color={idx.change >= 0 ? 'success' : 'danger'}
                                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', marginTop: '0.25rem' }}
                                >
                                    {idx.change > 0 ? '+' : ''}{Number(idx.change).toFixed(2)}%
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. Market News Section -- ADDED */}
                <div style={{ marginTop: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Market News</h3>
                        <button
                            onClick={() => navigate('/news-feed')}
                            style={{
                                color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700,
                                background: 'transparent', border: 'none', cursor: 'pointer'
                            }}>
                            More News
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {news.slice(0, 3).map((item, i) => (
                            <div
                                key={item.id || i}
                                onClick={() => navigate('/news-feed', { state: { selectedArticle: item } })}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                    cursor: 'pointer'
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '12px',
                                    background: '#f1f5f9', overflow: 'hidden', flexShrink: 0
                                }}>
                                    {item.image ? (
                                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            <Newspaper size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700,
                                                color: '#3b82f6', background: '#eff6ff',
                                                padding: '2px 8px', borderRadius: '6px'
                                            }}>
                                                {item.category || 'Markets'}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.timeAgo || '2h ago'}</span>
                                        </div>
                                        <h4 style={{
                                            fontSize: '0.95rem', fontWeight: 700, color: '#1e293b',
                                            lineHeight: '1.4', margin: 0,
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                                        {item.source || 'Reuters'}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {news.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                No news available at the moment.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
