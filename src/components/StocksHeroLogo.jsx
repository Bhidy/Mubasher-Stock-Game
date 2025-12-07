import React from 'react';

export default function StocksHeroLogo({ color = '#10b981', size = 100, style, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            className={className}
        >
            {/* Dynamic Gradient based on color prop */}
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="200" y2="200">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </linearGradient>
                <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Main Shape: Stylized 'S' / Chart / Trophy Fusion */}
            <g filter="url(#soft-glow)">
                {/* Outer Hex/Shield Shape - Modern Container */}
                <path
                    d="M100 20 L170 60 V140 L100 180 L30 140 V60 L100 20 Z"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="white"
                    fillOpacity="0.05"
                />

                {/* Inner Chart / Arrow / Victory Symbol */}
                {/* Starting low left, zigzag up to high right */}
                <path
                    d="M60 130 L90 100 L110 120 L150 70"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Arrow Head */}
                <path
                    d="M120 70 H150 V100"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Decorative Elements (Coins/Points) */}
                <circle cx="90" cy="100" r="6" fill={color} />
                <circle cx="110" cy="120" r="6" fill={color} />
            </g>
        </svg>
    );
}
