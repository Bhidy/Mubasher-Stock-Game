import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getEndpoint } from '../config/api';

/**
 * StockChart - Ultra Clean Premium Chart with Animations
 */

const PERIODS = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'];

export default function StockChart({ symbol, embedded = false, autoRefresh = true, height = 180 }) {
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('1M');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ change: 0, percent: 0, high: 0, low: 0 });
    const [animate, setAnimate] = useState(false);

    const isPositive = stats.change >= 0;
    const chartColor = isPositive ? '#10b981' : '#ef4444';

    const fetchChartData = useCallback(async () => {
        if (!symbol) return;

        setLoading(true);
        setError(null);
        setAnimate(false);

        try {
            const res = await fetch(getEndpoint(`/api/chart?symbol=${encodeURIComponent(symbol)}&range=${period}`));
            if (!res.ok) throw new Error('Failed to fetch');

            const json = await res.json();

            if (json.quotes && json.quotes.length > 0) {
                let quotes = json.quotes.map(q => ({
                    ...q,
                    price: q.price ?? q.close ?? null
                })).filter(q => q.price !== null);

                if (quotes.length >= 2) {
                    const prices = quotes.map(q => q.price);
                    const first = quotes[0].price;
                    const last = quotes[quotes.length - 1].price;
                    setStats({
                        change: last - first,
                        percent: ((last - first) / first) * 100,
                        high: Math.max(...prices),
                        low: Math.min(...prices)
                    });
                }

                setData(quotes);
                setTimeout(() => setAnimate(true), 50);
            } else {
                setData([]);
            }
        } catch (e) {
            console.error('Chart error:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [symbol, period]);

    useEffect(() => {
        fetchChartData();
        if (autoRefresh) {
            const interval = setInterval(fetchChartData, 30000);
            return () => clearInterval(interval);
        }
    }, [fetchChartData, autoRefresh]);

    const prices = data.map(d => d.price);
    const minP = prices.length ? Math.min(...prices) : 0;
    const maxP = prices.length ? Math.max(...prices) : 0;
    const range = maxP - minP || 1;

    return (
        <div style={{ position: 'relative' }}>
            {/* Chart Header with Animation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.4s ease-out'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isPositive ? '#dcfce7' : '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {isPositive ?
                            <TrendingUp size={14} color={chartColor} /> :
                            <TrendingDown size={14} color={chartColor} />
                        }
                    </div>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: chartColor
                    }}>
                        {isPositive ? '+' : ''}{stats.percent.toFixed(2)}%
                    </span>
                    <span style={{
                        fontSize: '0.7rem',
                        color: '#94a3b8',
                        fontWeight: 500
                    }}>
                        {period}
                    </span>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '0.72rem',
                    color: '#64748b'
                }}>
                    <span>H: <strong style={{ color: '#16a34a' }}>{stats.high.toFixed(2)}</strong></span>
                    <span>L: <strong style={{ color: '#ef4444' }}>{stats.low.toFixed(2)}</strong></span>
                </div>
            </div>

            {/* Chart Area with Animation */}
            <div style={{
                height: `${height}px`,
                width: '100%',
                background: 'white',
                borderRadius: '16px',
                padding: '8px 0',
                border: '1px solid #e2e8f0',
                position: 'relative',
                opacity: animate ? 1 : 0,
                transform: animate ? 'scale(1)' : 'scale(0.98)',
                transition: 'all 0.5s ease-out 0.1s'
            }}>
                {loading && data.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '16px',
                        zIndex: 5
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid #e2e8f0',
                                borderTopColor: '#10b981',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite'
                            }} />
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Loading chart...</span>
                        </div>
                    </div>
                )}

                {data.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id={`cleanGradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                                    <stop offset="50%" stopColor={chartColor} stopOpacity={0.1} />
                                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    padding: '10px 14px'
                                }}
                                labelStyle={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '4px' }}
                                itemStyle={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}
                                formatter={(value) => [value?.toFixed(2), '']}
                                labelFormatter={(label) => {
                                    const d = new Date(label);
                                    return period === '1D'
                                        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                }}
                            />

                            <YAxis
                                domain={[minP - range * 0.05, maxP + range * 0.05]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fill: '#94a3b8' }}
                                width={40}
                                tickFormatter={(v) => v.toFixed(0)}
                            />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fill: '#94a3b8' }}
                                tickFormatter={(t) => {
                                    const d = new Date(t);
                                    if (period === '1D') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                }}
                                minTickGap={40}
                                interval="preserveStartEnd"
                            />

                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={chartColor}
                                strokeWidth={2.5}
                                fill={`url(#cleanGradient-${symbol})`}
                                animationDuration={1200}
                                animationEasing="ease-out"
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}

                {!loading && data.length === 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#94a3b8',
                        gap: '8px'
                    }}>
                        <Activity size={24} color="#cbd5e1" />
                        <span style={{ fontSize: '0.8rem' }}>Chart unavailable</span>
                    </div>
                )}
            </div>

            {/* Period Selector with Animation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '0.75rem',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease-out 0.2s'
            }}>
                <div style={{
                    display: 'inline-flex',
                    gap: '4px',
                    background: '#f8fafc',
                    padding: '4px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                }}>
                    {PERIODS.map((p, i) => {
                        const isActive = period === p;
                        return (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                style={{
                                    padding: '7px 12px',
                                    fontSize: '0.72rem',
                                    fontWeight: isActive ? 700 : 500,
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: isActive ? 'white' : 'transparent',
                                    color: isActive ? '#0f172a' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}
