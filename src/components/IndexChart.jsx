import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const allRanges = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'];

export default function IndexChart({ symbol, color = '#10b981', visibleRanges = allRanges }) {
    const [data, setData] = useState([]);
    const [range, setRange] = useState('1D');
    // Ensure range is valid for the current set
    useEffect(() => {
        if (!visibleRanges.includes(range)) {
            setRange(visibleRanges[0]);
        }
    }, [visibleRanges]);

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ change: 0, percent: 0 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Ensure we use the correct encoded symbol
                // Use relative URL for API call to work in both Dev (via proxy) and Prod (Vercel functions)
                const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}&range=${range}`);
                const json = await res.json();

                if (json.quotes && json.quotes.length > 0) {
                    let quotes = json.quotes;

                    // Simple calc for range change
                    const first = quotes[0].price;
                    const last = quotes[quotes.length - 1].price;
                    setStats({
                        change: last - first,
                        percent: ((last - first) / first) * 100
                    });

                    // --- ENHANCEMENT: Add Future Period Markers ---
                    // We add 2 extra empty points to extend the X-axis
                    if (quotes.length > 0) {
                        const lastDate = new Date(quotes[quotes.length - 1].date);
                        const future1 = new Date(lastDate);
                        const future2 = new Date(lastDate);

                        // Increment based on approximate interval
                        if (['1D', '5D'].includes(range)) {
                            // Add minutes/hours
                            future1.setHours(future1.getHours() + 1);
                            future2.setHours(future2.getHours() + 2);
                        } else if (['1M', '3M'].includes(range)) {
                            // Add days
                            future1.setDate(future1.getDate() + 2);
                            future2.setDate(future2.getDate() + 4);
                        } else {
                            // Add months
                            future1.setMonth(future1.getMonth() + 1);
                            future2.setMonth(future2.getMonth() + 2);
                        }

                        // Append empty points for axis extension
                        quotes = [
                            ...quotes,
                            { date: future1.toISOString(), price: null }, // Null prevents line drawing
                            { date: future2.toISOString(), price: null }
                        ];
                    }

                    setData(quotes);
                } else {
                    setData([]);
                }
            } catch (e) {
                console.error(e);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [symbol, range]);

    // Calculate dynamic Y-axis domain (ignoring nulls)
    const validPrices = data.filter(d => d.price !== null).map(d => d.price);
    const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
    const maxPrice = validPrices.length ? Math.max(...validPrices) : 0;

    // Add buffer: Lower buffer slightly larger to show "missing level"
    const domainMin = minPrice - (maxPrice - minPrice) * 0.10;
    const domainMax = maxPrice + (maxPrice - minPrice) * 0.05;

    // X-Axis Formatter
    const formatXAxis = (tickItem) => {
        if (!tickItem) return '';
        const date = new Date(tickItem);
        if (range === '1D') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (['5D', '1M'].includes(range)) return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        if (['6M', 'YTD', '1Y'].includes(range)) return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
        return date.getFullYear().toString();
    };

    return (
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
            {/* Chart Area */}
            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)', zIndex: 10, backdropFilter: 'blur(1px)' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Loading Data...</span>
                    </div>
                )}
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`gradient-${symbol}-${range}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem' }}
                                labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                                formatter={(value) => [value ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A', '']}
                                labelFormatter={(label) => {
                                    const d = new Date(label);
                                    return range === '1D' ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString();
                                }}
                            />
                            <YAxis
                                hide={false} // Valid: Show axis? User implied "Missing price level on Left". Let's show it or rely on grid? User said "lowest visible y-axis label... add next lower". Usually this implies visible axis.
                                // But design guidelines often hide axis. Let's assume text meant they SAW the axis.
                                // Actually user request: "Add the Missing Price Level on the Left (Y-Axis)" implies visible axis.
                                axisLine={false}
                                tickLine={false}
                                width={40}
                                domain={[domainMin, domainMax]}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                tickCount={5}
                                tickFormatter={(val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                tickFormatter={formatXAxis}
                                minTickGap={30}
                                interval="preserveStartEnd"
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={color}
                                strokeWidth={2.5}
                                fill={`url(#gradient-${symbol}-${range})`}
                                animationDuration={1000}
                                connectNulls={false} // Important: Do NOT connect to the future null points
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    !loading && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No chart available for {range}</div>
                )}
            </div>

            {/* Range Selectors */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', background: '#f1f5f9', padding: '4px', borderRadius: '12px', overflowX: 'auto' }}>
                {visibleRanges.map(r => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        style={{
                            flex: 1,
                            minWidth: '40px',
                            padding: '8px 0',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '10px',
                            background: range === r ? '#fff' : 'transparent',
                            color: range === r ? '#0f172a' : '#64748b',
                            boxShadow: range === r ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
    );
}
