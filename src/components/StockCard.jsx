import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Users, TrendingUp, TrendingDown, Sparkles, Info, Flame, Shield, Zap } from 'lucide-react';

// 20 Saudi Stocks with local logo paths
export const SAUDI_STOCKS = {
    '2222': { name: 'Saudi Aramco', initials: 'AR', color: '#00a651', tag: 'safe', users: 4291, logo: '/assets/logos/2222.png' },
    '1120': { name: 'Al Rajhi Bank', initials: 'ARB', color: '#004c97', tag: 'safe', users: 3847, logo: '/assets/logos/1120.png' },
    '2010': { name: 'SABIC', initials: 'SAB', color: '#0072bc', tag: 'trending', users: 2156, logo: '/assets/logos/2010.png' },
    '7010': { name: 'STC', initials: 'STC', color: '#4f2d7f', tag: 'safe', users: 1892, logo: '/assets/logos/7010.png' },
    '2082': { name: 'ACWA Power', initials: 'ACW', color: '#00a3e0', tag: 'volatile', users: 1534, logo: '/assets/logos/2082.png' },
    '1180': { name: 'SNB', initials: 'SNB', color: '#00573f', tag: 'safe', users: 1423, logo: '/assets/logos/1180.png' },
    '2380': { name: 'Petro Rabigh', initials: 'PR', color: '#e31937', tag: 'volatile', users: 1287, logo: '/assets/logos/2380.png' },
    '4030': { name: 'Al Babtain', initials: 'BAB', color: '#1a75cf', tag: 'trending', users: 1156, logo: '/assets/logos/4030.png' },
    '2350': { name: 'SIDC', initials: 'SID', color: '#f7941d', tag: 'volatile', users: 1089, logo: '/assets/logos/2350.png' },
    '4200': { name: 'Aldrees', initials: 'ALD', color: '#cc0000', tag: 'trending', users: 998, logo: '/assets/logos/4200.png' },
    '1211': { name: 'Alinma Bank', initials: 'ALI', color: '#7ab41d', tag: 'safe', users: 934, logo: '/assets/logos/1211.png' },
    '4001': { name: 'Abdullah Al-Othaim', initials: 'OTH', color: '#e4002b', tag: 'trending', users: 876, logo: '/assets/logos/4001.png' },
    '2310': { name: 'Sipchem', initials: 'SIP', color: '#00468b', tag: 'volatile', users: 823, logo: '/assets/logos/2310.png' },
    '4003': { name: 'Extra', initials: 'EXT', color: '#ff6600', tag: 'trending', users: 789, logo: '/assets/logos/4003.png' },
    '2050': { name: 'Savola', initials: 'SAV', color: '#ed1c24', tag: 'safe', users: 756, logo: '/assets/logos/2050.png' },
    '1150': { name: 'Amlak', initials: 'AML', color: '#0066b3', tag: 'volatile', users: 712, logo: '/assets/logos/1150.png' },
    '4190': { name: 'Jarir', initials: 'JAR', color: '#ffc20e', tag: 'trending', users: 689, logo: '/assets/logos/4190.png' },
    '2290': { name: 'Yanbu Cement', initials: 'YAN', color: '#003366', tag: 'safe', users: 645, logo: '/assets/logos/2290.png' },
    '4002': { name: 'Mouwasat', initials: 'MOU', color: '#009639', tag: 'safe', users: 612, logo: '/assets/logos/4002.png' },
    '1010': { name: 'Riyad Bank', initials: 'RYD', color: '#003087', tag: 'safe', users: 578, logo: '/assets/logos/1010.png' },
};

// Tag configurations for filtering
const TAG_CONFIG = {
    trending: { icon: Flame, label: 'Trending', color: '#f59e0b', bg: '#fef3c7' },
    safe: { icon: Shield, label: 'Safe', color: '#10b981', bg: '#dcfce7' },
    volatile: { icon: Zap, label: 'Volatile', color: '#ef4444', bg: '#fee2e2' },
};

// Stock Logo component with real TradingView logos and fallback to initials
function StockLogo({ ticker, size = 56, logoUrl = null }) {
    const [imgError, setImgError] = useState(false);
    // Merge passed logoUrl with local definition if needed, but prioritize passed url
    const stock = SAUDI_STOCKS[ticker] || null;
    const effectiveLogo = logoUrl || (stock ? stock.logo : null);

    // Initial fallback if not a known Saudi stock and no logo
    if (!stock && !effectiveLogo) {
        return (
            <div style={{
                width: size,
                height: size,
                borderRadius: size * 0.28,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: size * 0.3
            }}>
                {ticker.slice(0, 2)}
            </div>
        );
    }

    // Try to load logo
    if (effectiveLogo && !imgError) {
        return (
            <div style={{
                width: size,
                height: size,
                borderRadius: size * 0.28,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                position: 'relative' // For containing the image
            }}>
                <img
                    src={effectiveLogo}
                    alt={ticker}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // Changed to contain to avoid cutting off
                        padding: '4px' // Add padding for better look
                    }}
                    onError={(e) => {
                        console.warn('Logo failed to load:', effectiveLogo);
                        setImgError(true);
                        e.target.style.display = 'none';
                    }}
                    loading="lazy"
                />
            </div>
        );
    }

    // Fallback to brand-colored initials
    const color = stock?.color || '#6366f1';
    const initials = stock?.initials || ticker.slice(0, 2);

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.28,
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: size * 0.28,
            boxShadow: `0 4px 12px ${color}40`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Shine effect */}
            <div style={{
                position: 'absolute',
                top: '3px',
                left: '6px',
                width: size * 0.4,
                height: size * 0.2,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                filter: 'blur(2px)',
                transform: 'rotate(-20deg)'
            }} />
            {initials}
        </div>
    );
}

export default function StockCard({ stock, isSelected, onToggle }) {
    const navigate = useNavigate();
    const isAramco = stock.ticker === '2222';
    const stockData = SAUDI_STOCKS[stock.ticker]; // Local metadata

    const rarityColors = {
        common: { border: '#94a3b8', bg: '#f1f5f9', glow: 'rgba(148, 163, 184, 0.1)' },
        rare: { border: '#3b82f6', bg: '#dbeafe', glow: 'rgba(59, 130, 246, 0.15)' },
        epic: { border: '#a855f7', bg: '#f3e8ff', glow: 'rgba(168, 85, 247, 0.15)' },
        legendary: { border: '#f59e0b', bg: '#fef3c7', glow: 'rgba(245, 158, 11, 0.2)' }
    };

    const rarity = rarityColors[stock.rarity] || rarityColors.common;

    const handleViewClick = (e) => {
        e.stopPropagation();
        navigate(`/company/${stock.ticker}`);
    };

    const pickedUsers = stockData?.users || 0;

    // Get tag config
    const tag = stock.tag ? TAG_CONFIG[stock.tag] : (stockData?.tag ? TAG_CONFIG[stockData.tag] : null);
    const TagIcon = tag?.icon;

    // Format price with 2 decimals and SAR
    const formatPrice = (price) => {
        return `${Number(price).toFixed(2)} SAR`;
    };

    return (
        <div
            onClick={onToggle}
            style={{
                position: 'relative',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                border: isSelected ? `3px solid var(--primary)` : `2px solid ${rarity.border}`,
                boxShadow: isSelected
                    ? '0 8px 24px rgba(99, 102, 241, 0.25)'
                    : `0 4px 12px ${rarity.glow}`,
            }}
        >
            {/* Top row: Tag on left, View button on right (Aramco only) */}
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                {/* Tag badge (Trending/Safe/Volatile) */}
                {tag && (
                    <div style={{
                        background: tag.bg,
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        color: tag.color,
                        textTransform: 'uppercase',
                        border: `1px solid ${tag.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <TagIcon size={10} />
                        {tag.label}
                    </div>
                )}
                {!tag && <div />}

                {/* View button - For all stocks */}
                <button
                    onClick={handleViewClick}
                    style={{
                        background: 'var(--gradient-info)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.375rem 0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.35)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Info size={14} />
                    View
                </button>
            </div>

            <div className="flex-between">
                <div className="flex-center" style={{ gap: '1rem', flex: 1 }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${rarity.border}`,
                        boxShadow: `0 4px 12px ${rarity.glow}`,
                        overflow: 'hidden'
                    }}>
                        <StockLogo ticker={stock.ticker} logoUrl={stock.logo} size={52} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', marginBottom: '0.25rem' }}>
                            <h3 className="h3" style={{ fontSize: '1.125rem' }}>{stock.ticker}</h3>
                            {stock.isTrending && (
                                <span style={{
                                    fontSize: '0.875rem',
                                    background: '#fef3c7',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700,
                                    color: '#f59e0b',
                                    border: '1px solid #fde68a'
                                }}>
                                    🔥 HOT
                                </span>
                            )}
                        </div>
                        <p className="caption" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stock.name || stockData?.name}</p>
                        <div className="flex-center" style={{ gap: '0.375rem' }}>
                            <Users size={12} color="var(--text-muted)" />
                            <span className="caption">{pickedUsers.toLocaleString()} users picked</span>
                        </div>
                    </div>
                </div>

                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                        {formatPrice(stock.price)}
                    </span>
                    <div className="flex-center" style={{
                        gap: '0.375rem',
                        background: (stock.change || 0) >= 0 ? '#dcfce7' : '#fee2e2',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        border: (stock.change || 0) >= 0 ? '1px solid #bbf7d0' : '1px solid #fecaca'
                    }}>
                        {(stock.change || 0) >= 0 ? <TrendingUp size={14} color="var(--success)" /> : <TrendingDown size={14} color="var(--danger)" />}
                        <span style={{
                            color: (stock.change || 0) >= 0 ? 'var(--success)' : 'var(--danger)',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}>
                            {(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Selection indicator - checkmark badge */}
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    border: '3px solid white'
                }}>
                    <Check size={18} strokeWidth={3} />
                </div>
            )}
        </div>
    );
}

// Export StockLogo and SAUDI_STOCKS for use in other components
export { StockLogo };
