import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketCard({ name, value, change, isPositive, chartData, color, onClick }) {
    // Transform flat array to object array for Recharts
    const data = chartData ? chartData.map((val, i) => ({ value: val, index: i })) : [];

    return (
        <div
            onClick={onClick}
            style={{
                minWidth: '220px',
                padding: '1.25rem',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
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
                    <h3 style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '0.25rem' }}>{name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{value}</div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    color: isPositive ? '#10B981' : '#EF4444',
                    background: isPositive ? '#ECFDF5' : '#FEF2F2',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    fontWeight: 700, fontSize: '0.75rem'
                }}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {change}
                </div>
            </div>

            <div style={{ height: '60px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color || '#0EA5E9'} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color || '#0EA5E9'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color || '#0EA5E9'}
                            fill={`url(#gradient-${name})`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
