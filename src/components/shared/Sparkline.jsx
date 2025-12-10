import React from 'react';

// Simple SVG Sparkline component
export default function Sparkline({ data = [50, 52, 55, 53, 58, 62, 60, 65, 70, 72, 75], color = '#10b981', width = 100, height = 40, strokeWidth = 2 }) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Scale points to fit dimensions
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height; // Invert Y because SVG origin is top-left
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `${points} L ${width},${height} L 0,${height} Z`;

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={fillPath} fill={`url(#gradient-${color})`} stroke="none" />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
