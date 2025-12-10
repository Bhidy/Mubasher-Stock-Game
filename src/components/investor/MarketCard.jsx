import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Premium Market Card - Pure White Stunning Design
 * Clean, crisp, and visually striking
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
    status = 'open',
}) {
    // Generate smooth bezier path from chart data
    const generatePath = () => {
        if (!chartData.length) return '';
        const max = Math.max(...chartData);
        const min = Math.min(...chartData);
        const range = max - min || 1;
        const height = 45;
        const width = 100;
        const step = width / (chartData.length - 1);

        const points = chartData.map((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height * 0.9;
            return { x, y };
        });

        // Create smooth bezier curve
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            path += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
        }
        return path;
    };

    const statusColors = {
        open: { text: '#059669', bg: '#D1FAE5' },
        closed: { text: '#DC2626', bg: '#FEE2E2' },
        pre: { text: '#D97706', bg: '#FEF3C7' },
    };
    const currentStatus = statusColors[status] || statusColors.open;

    return (
        <div
            onClick={onClick}
            style={{
                width: '170px',
                minWidth: '170px',
                padding: '1.25rem',
                background: '#FFFFFF',
                borderRadius: '24px',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseOver={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 24px 48px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.08)';
                }
            }}
            onMouseOut={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
                }
            }}
        >
            {/* Top Row - Flag & Name */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                marginBottom: '0.875rem',
            }}>
                {flag && (
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(145deg, #F8FAFC, #F1F5F9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        {flag}
                    </div>
                )}
                <div>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                    }}>{name}</div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.2rem',
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: currentStatus.text,
                            boxShadow: `0 0 8px ${currentStatus.text}80`,
                        }} />
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: currentStatus.text,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>{status}</span>
                    </div>
                </div>
            </div>

            {/* Value - Big and Bold */}
            <div style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: '0.75rem',
            }}>{value}</div>

            {/* Change Badge */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.65rem',
                borderRadius: '10px',
                background: isPositive
                    ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                    : 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
                color: isPositive ? '#059669' : '#DC2626',
                fontWeight: 800,
                fontSize: '0.85rem',
                width: 'fit-content',
                marginBottom: '0.875rem',
            }}>
                {isPositive ? <TrendingUp size={15} strokeWidth={2.5} /> : <TrendingDown size={15} strokeWidth={2.5} />}
                {change}
            </div>

            {/* Chart Area */}
            <div style={{
                height: '50px',
                width: 'calc(100% + 2.5rem)',
                marginLeft: '-1.25rem',
                marginRight: '-1.25rem',
                marginBottom: '-1.25rem',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent 0%, rgba(248,250,252,0.5) 100%)',
                borderRadius: '0 0 24px 24px',
                overflow: 'hidden',
            }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', bottom: 0, left: 0 }}
                >
                    <defs>
                        <linearGradient id={`fill-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={`${generatePath()} L100,50 L0,50 Z`}
                        fill={`url(#fill-${name.replace(/\s/g, '')})`}
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
                </svg>
            </div>
        </div>
    );
}
