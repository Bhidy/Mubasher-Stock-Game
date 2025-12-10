import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Premium Market Card Component
 * Displays market index with mini chart and change indicator
 * Designed for horizontal scroll carousel with dark/light themes
 */
export default function MarketCard({
    name,
    flag,
    value,
    change,
    isPositive,
    chartData = [],
    color = '#10b981',
    onClick,
    status = 'open', // 'open', 'closed', 'pre'
    variant = 'light' // 'light' or 'dark'
}) {
    // Generate SVG path from chart data
    const generatePath = () => {
        if (!chartData.length) return '';
        const max = Math.max(...chartData);
        const min = Math.min(...chartData);
        const range = max - min || 1;
        const height = 40;
        const width = 100;
        const step = width / (chartData.length - 1);

        const points = chartData.map((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        });

        return `M${points.join(' L')}`;
    };

    const isDark = variant === 'dark';

    const statusConfig = {
        open: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981', text: 'OPEN' },
        closed: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', text: 'CLOSED' },
        pre: { bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', text: 'PRE' },
    };

    const currentStatus = statusConfig[status] || statusConfig.open;

    return (
        <div
            onClick={onClick}
            style={{
                minWidth: '180px',
                maxWidth: '180px',
                padding: '1rem',
                background: isDark
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
                    : 'white',
                borderRadius: '20px',
                border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid #E2E8F0',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0, 0, 0, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseOver={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = isDark
                        ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0, 0, 0, 0.4)'
                        : '0 12px 30px rgba(0, 0, 0, 0.12)';
                }
            }}
            onMouseOut={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = isDark
                        ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0, 0, 0, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.06)';
                }
            }}
        >
            {/* Glow Effect */}
            <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {flag && <span style={{ fontSize: '1.25rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{flag}</span>}
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isDark ? 'white' : '#1E293B',
                        letterSpacing: '0.02em',
                    }}>{name}</span>
                </div>
                {status && (
                    <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: currentStatus.color,
                        background: currentStatus.bg,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                    }}>{currentStatus.text}</span>
                )}
            </div>

            {/* Value */}
            <div style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: isDark ? 'white' : '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1,
            }}>{value}</div>

            {/* Change Indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: isPositive ? '#10B981' : '#EF4444',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                }}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {change}
                </div>
            </div>

            {/* Mini Chart */}
            <div style={{
                height: '35px',
                width: '100%',
                marginTop: 'auto',
                position: 'relative',
            }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        <linearGradient id={`marketGradient-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={`${generatePath()} L100,40 L0,40 Z`}
                        fill={`url(#marketGradient-${name.replace(/\s/g, '')})`}
                    />

                    {/* Line */}
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* End dot */}
                    {chartData.length > 0 && (
                        <circle
                            cx="100"
                            cy={40 - ((chartData[chartData.length - 1] - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData) || 1)) * 40}
                            r="3"
                            fill={color}
                            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}
