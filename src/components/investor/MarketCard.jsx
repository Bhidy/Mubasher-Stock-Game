import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Premium Market Card Component - Light Frosted Glass Design
 * Beautiful, clean, and modern with vibrant accents
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

    const statusConfig = {
        open: { bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', color: '#059669', text: 'OPEN', dot: '#10B981' },
        closed: { bg: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)', color: '#DC2626', text: 'CLOSED', dot: '#EF4444' },
        pre: { bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', color: '#D97706', text: 'PRE', dot: '#F59E0B' },
    };

    const currentStatus = statusConfig[status] || statusConfig.open;

    return (
        <div
            onClick={onClick}
            style={{
                minWidth: '175px',
                maxWidth: '175px',
                padding: '1.125rem',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
                borderRadius: '22px',
                border: '1px solid rgba(255,255,255,0.8)',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: `
                    0 4px 24px rgba(0, 0, 0, 0.06),
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    inset 0 1px 0 rgba(255,255,255,1),
                    0 0 0 1px rgba(0,0,0,0.02)
                `,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseOver={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `
                        0 20px 40px rgba(0, 0, 0, 0.12),
                        0 8px 16px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255,255,255,1),
                        0 0 0 1px ${color}30
                    `;
                }
            }}
            onMouseOut={e => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `
                        0 4px 24px rgba(0, 0, 0, 0.06),
                        0 1px 3px rgba(0, 0, 0, 0.04),
                        inset 0 1px 0 rgba(255,255,255,1),
                        0 0 0 1px rgba(0,0,0,0.02)
                    `;
                }
            }}
        >
            {/* Colored accent line at top */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                borderRadius: '0 0 3px 3px',
            }} />

            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {flag && (
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
                        }}>
                            {flag}
                        </div>
                    )}
                    <div>
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#1E293B',
                            letterSpacing: '0.01em',
                            display: 'block',
                        }}>{name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                            <div style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: currentStatus.dot,
                                boxShadow: `0 0 6px ${currentStatus.dot}`,
                            }} />
                            <span style={{
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: currentStatus.color,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}>{currentStatus.text}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value */}
            <div style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1,
            }}>{value}</div>

            {/* Change Indicator */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                background: isPositive
                    ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                    : 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
                color: isPositive ? '#059669' : '#DC2626',
                fontWeight: 700,
                fontSize: '0.8rem',
                width: 'fit-content',
                boxShadow: isPositive
                    ? '0 2px 8px rgba(16, 185, 129, 0.15)'
                    : '0 2px 8px rgba(239, 68, 68, 0.15)',
            }}>
                {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
                {change}
            </div>

            {/* Mini Chart */}
            <div style={{
                height: '38px',
                width: '100%',
                marginTop: 'auto',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(241,245,249,0.8) 100%)',
            }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        <linearGradient id={`chartGrad-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={`${generatePath()} L100,40 L0,40 Z`}
                        fill={`url(#chartGrad-${name.replace(/\s/g, '')})`}
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

                    {/* End dot with glow */}
                    {chartData.length > 0 && (
                        <>
                            <circle
                                cx="100"
                                cy={40 - ((chartData[chartData.length - 1] - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData) || 1)) * 40}
                                r="5"
                                fill={color}
                                opacity="0.2"
                            />
                            <circle
                                cx="100"
                                cy={40 - ((chartData[chartData.length - 1] - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData) || 1)) * 40}
                                r="3"
                                fill="white"
                                stroke={color}
                                strokeWidth="2"
                            />
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
}
