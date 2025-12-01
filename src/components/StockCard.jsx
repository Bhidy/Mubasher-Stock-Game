import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Users, TrendingUp, TrendingDown, Sparkles, Info } from 'lucide-react';

export default function StockCard({ stock, isSelected, onToggle }) {
    const navigate = useNavigate();
    const rarityColors = {
        common: { border: '#94a3b8', bg: '#f1f5f9', glow: 'rgba(148, 163, 184, 0.1)' },
        rare: { border: '#3b82f6', bg: '#dbeafe', glow: 'rgba(59, 130, 246, 0.15)' },
        epic: { border: '#a855f7', bg: '#f3e8ff', glow: 'rgba(168, 85, 247, 0.15)' },
        legendary: { border: '#f59e0b', bg: '#fef3c7', glow: 'rgba(245, 158, 11, 0.2)' }
    };

    const rarity = rarityColors[stock.rarity] || rarityColors.common;

    const handleInfoClick = (e) => {
        e.stopPropagation();
        navigate(`/company/${stock.ticker}`);
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
            {/* Rarity Indicator */}
            {stock.rarity !== 'common' && (
                <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: rarity.bg,
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    color: rarity.border,
                    textTransform: 'uppercase',
                    border: `1px solid ${rarity.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    {stock.rarity === 'legendary' && <Sparkles size={10} />}
                    {stock.rarity}
                </div>
            )}

            <div className="flex-between">
                <div className="flex-center" style={{ gap: '1rem', flex: 1 }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${rarity.bg} 0%, white 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: rarity.border,
                        border: `2px solid ${rarity.border}`,
                        boxShadow: `0 4px 12px ${rarity.glow}`,
                        overflow: 'hidden'
                    }}>
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.ticker} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                        ) : (
                            stock.ticker.slice(0, 2)
                        )}
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
                        <p className="caption" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stock.name}</p>
                        <div className="flex-center" style={{ gap: '0.75rem' }}>
                            <div className="flex-center" style={{ gap: '0.375rem' }}>
                                <Users size={12} color="var(--text-muted)" />
                                <span className="caption">{stock.popularity}% picked</span>
                            </div>
                            <button
                                onClick={handleInfoClick}
                                style={{
                                    background: 'var(--gradient-info)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-full)',
                                    padding: '0.25rem 0.625rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Info size={12} />
                                View
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-col" style={{ alignItems: 'flex-end', marginTop: stock.rarity !== 'common' ? '1.5rem' : '0' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{stock.price}</span>
                    <div className="flex-center" style={{
                        gap: '0.375rem',
                        background: stock.change >= 0 ? '#dcfce7' : '#fee2e2',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        border: stock.change >= 0 ? '1px solid #bbf7d0' : '1px solid #fecaca'
                    }}>
                        {stock.change >= 0 ? <TrendingUp size={14} color="var(--success)" /> : <TrendingDown size={14} color="var(--danger)" />}
                        <span style={{
                            color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </span>
                    </div>
                </div>
            </div>

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
