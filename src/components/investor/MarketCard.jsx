import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketCard({ name, flag, value, change, isPositive, chartData, color, onClick }) {
    // Transform flat array to object array for Recharts
    const data = chartData ? chartData.map((val, i) => ({ value: val, index: i })) : [];

    return (
        <div
            onClick={onClick}
            style={{
                minWidth: '200px',
                maxWidth: '200px',
                padding: '1rem',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                scrollSnapAlign: 'start',
                flexShrink: 0,
            }}
            onMouseOver={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }
            }}
            onMouseOut={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                }
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                        {flag && <span style={{ fontSize: '1rem' }}>{flag}</span>}
                        <h3 style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{name}</h3>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{value}</div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    color: isPositive ? '#10B981' : '#EF4444',
                    background: isPositive ? '#ECFDF5' : '#FEF2F2',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '999px',
                    fontWeight: 700, fontSize: '0.7rem'
                }}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {change}
                </div>
            </div>

            <div style={{ height: '50px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color || '#0EA5E9'} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color || '#0EA5E9'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color || '#0EA5E9'}
                            fill={`url(#gradient-${name.replace(/\s/g, '')})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
