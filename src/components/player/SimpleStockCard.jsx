import React from 'react';
import { TrendingUp, TrendingDown, Minus, Star, Clock, Target, Zap } from 'lucide-react';

// Emoji indicators for stock status
const getStockEmoji = (changePercent) => {
    if (changePercent >= 5) return '🚀';
    if (changePercent >= 3) return '🔥';
    if (changePercent >= 1) return '📈';
    if (changePercent >= 0) return '😊';
    if (changePercent >= -1) return '😐';
    if (changePercent >= -3) return '📉';
    return '💀';
};

const getChangeColor = (changePercent) => {
    if (changePercent >= 3) return '#22C55E';
    if (changePercent >= 0) return '#4ADE80';
    if (changePercent >= -3) return '#EF4444';
    return '#DC2626';
};

export default function SimpleStockCard({
    symbol,
    name,
    price,
    change,
    changePercent,
    logo,
    picked = false,
    prediction = null, // 'up' or 'down'
    xpReward = 0,
    onClick,
    variant = 'default', // 'default', 'compact', 'picked'
}) {
    const isPositive = changePercent >= 0;
    const emoji = getStockEmoji(changePercent);
    const changeColor = getChangeColor(changePercent);

    if (variant === 'compact') {
        return (
            <div
                onClick={onClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'white',
                    borderRadius: '12px',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    border: '1px solid #E5E7EB',
                }}
            >
                {/* Logo */}
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}>
                    {logo ? (
                        <img src={logo} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '1rem' }}>{emoji}</span>
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.9rem' }}>{symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{name}</div>
                </div>

                {/* Price & Change */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.9rem' }}>
                        ${price?.toFixed(2)}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: changeColor,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        justifyContent: 'flex-end',
                    }}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {changePercent?.toFixed(2)}%
                    </div>
                </div>
            </div>
        );
    }

    // Default or picked variant
    return (
        <div
            onClick={onClick}
            style={{
                background: picked
                    ? 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)'
                    : 'white',
                borderRadius: '20px',
                padding: '1.25rem',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                border: picked ? '2px solid #C4B5FD' : '1px solid #E5E7EB',
                boxShadow: picked
                    ? '0 8px 25px rgba(139, 92, 246, 0.15)'
                    : '0 4px 15px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Picked badge */}
            {picked && (
                <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    borderRadius: '999px',
                }}>
                    <Star size={12} color="white" fill="white" />
                    <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>PICKED</span>
                </div>
            )}

            {/* Main content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Logo with emoji overlay */}
                <div style={{
                    position: 'relative',
                    width: '52px',
                    height: '52px',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '14px',
                        background: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '2px solid #E5E7EB',
                    }}>
                        {logo ? (
                            <img src={logo} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '1.5rem', color: '#6B7280' }}>{symbol.charAt(0)}</span>
                        )}
                    </div>
                    {/* Emoji indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        fontSize: '1.25rem',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}>
                        {emoji}
                    </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '1.125rem',
                        fontWeight: 800,
                        color: '#1F2937',
                    }}>
                        {symbol}
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        marginBottom: '0.5rem',
                    }}>
                        {name?.length > 25 ? name.substring(0, 25) + '...' : name}
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: '#1F2937',
                        }}>
                            ${price?.toFixed(2)}
                        </span>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: isPositive ? '#DCFCE7' : '#FEE2E2',
                            color: changeColor,
                        }}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {changePercent?.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Prediction indicator */}
            {prediction && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: prediction === 'up'
                        ? 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)'
                        : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={16} color={prediction === 'up' ? '#16A34A' : '#DC2626'} />
                        <span style={{
                            fontWeight: 700,
                            color: prediction === 'up' ? '#16A34A' : '#DC2626',
                            fontSize: '0.85rem',
                        }}>
                            Your prediction: {prediction === 'up' ? '📈 Going UP' : '📉 Going DOWN'}
                        </span>
                    </div>
                    {xpReward > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}>
                            <Zap size={14} color="#8B5CF6" fill="#8B5CF6" />
                            <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '0.8rem' }}>
                                +{xpReward} XP
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Quick pick button component
export function QuickPickButton({ direction, selected, onClick, disabled }) {
    const isUp = direction === 'up';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                flex: 1,
                padding: '0.875rem 1rem',
                borderRadius: '14px',
                border: selected ? 'none' : '2px solid #E5E7EB',
                background: selected
                    ? (isUp
                        ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                        : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)')
                    : 'white',
                color: selected ? 'white' : (isUp ? '#16A34A' : '#DC2626'),
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                boxShadow: selected
                    ? (isUp
                        ? '0 4px 15px rgba(34, 197, 94, 0.3)'
                        : '0 4px 15px rgba(239, 68, 68, 0.3)')
                    : 'none',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {isUp ? (
                <>
                    <TrendingUp size={18} />
                    Going Up 📈
                </>
            ) : (
                <>
                    <TrendingDown size={18} />
                    Going Down 📉
                </>
            )}
        </button>
    );
}
