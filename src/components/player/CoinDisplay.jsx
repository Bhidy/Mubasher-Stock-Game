import React, { useEffect, useState, useContext } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { UserContext } from '../../App';

export default function CoinDisplay({
    coins,
    size = 'md',
    showAddButton = false,
    onClick,
    animated = true,
    variant = 'default'
}) {
    const [displayCoins, setDisplayCoins] = useState(coins);
    const [isAnimating, setIsAnimating] = useState(false);

    // Animate coin count changes
    useEffect(() => {
        if (!animated || displayCoins === coins) return;

        setIsAnimating(true);
        const diff = coins - displayCoins;
        const steps = 30;
        const increment = diff / steps;
        let current = displayCoins;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
                setDisplayCoins(coins);
                setIsAnimating(false);
                clearInterval(timer);
            } else {
                setDisplayCoins(Math.round(current));
            }
        }, 20);

        return () => clearInterval(timer);
    }, [coins, animated]);

    const sizes = {
        sm: {
            padding: '0.375rem 0.625rem',
            fontSize: '0.8rem',
            coinSize: 18,
            gap: '0.375rem',
            iconPadding: '0.25rem',
        },
        md: {
            padding: '0.5rem 0.875rem',
            fontSize: '0.95rem',
            coinSize: 24,
            gap: '0.5rem',
            iconPadding: '0.375rem',
        },
        lg: {
            padding: '0.625rem 1rem',
            fontSize: '1.125rem',
            coinSize: 28,
            gap: '0.625rem',
            iconPadding: '0.5rem',
        },
    };

    const s = sizes[size];

    const containerStyles = {
        default: {
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '2px solid #FCD34D',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
        solid: {
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
        },
    };

    const textColor = variant === 'solid' ? 'white' : '#92400E';

    return (
        <div
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: s.gap,
                padding: s.padding,
                borderRadius: '999px',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                ...containerStyles[variant],
                transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
            }}
        >
            {/* Coin Icon */}
            <div style={{
                position: 'relative',
                width: s.coinSize,
                height: s.coinSize,
            }}>
                {/* Glow effect */}
                <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                    animation: 'coinGlow 2s ease-in-out infinite',
                }} />

                {/* Coin body */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isAnimating ? 'coinBounce 0.3s ease-out' : 'none',
                }}>
                    {/* Coin symbol */}
                    <span style={{
                        fontSize: s.coinSize * 0.5,
                        fontWeight: 900,
                        color: '#78350F',
                        textShadow: '0 1px 0 rgba(255, 255, 255, 0.3)',
                    }}>
                        ₿
                    </span>

                    {/* Shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '20%',
                        width: '30%',
                        height: '30%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 100%)',
                    }} />
                </div>
            </div>

            {/* Coin Amount */}
            <span style={{
                fontSize: s.fontSize,
                fontWeight: 800,
                color: textColor,
                letterSpacing: '-0.02em',
            }}>
                {displayCoins.toLocaleString()}
            </span>

            {/* Add Button */}
            {showAddButton && (
                <div style={{
                    width: s.coinSize * 0.9,
                    height: s.coinSize * 0.9,
                    borderRadius: '50%',
                    background: variant === 'solid'
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.25rem',
                    boxShadow: variant === 'solid' ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}>
                    <Plus size={s.coinSize * 0.5} color="white" strokeWidth={3} />
                </div>
            )}

            <style>{`
                @keyframes coinGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                @keyframes coinBounce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

// Coin reward popup animation
export function CoinRewardPopup({ amount, onComplete }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            animation: 'rewardPopup 2s ease-out forwards',
            pointerEvents: 'none',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
            }}>
                {/* Sparkle effects */}
                <div style={{
                    position: 'absolute',
                    inset: '-40px',
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                    animation: 'sparkleGlow 1s ease-out',
                }} />

                {/* Coins */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
                    boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5), inset 0 4px 8px rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'coinSpin 0.5s ease-out',
                }}>
                    <span style={{ fontSize: '2rem', color: '#78350F' }}>🪙</span>
                </div>

                {/* Amount */}
                <div style={{
                    background: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '999px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        +{amount.toLocaleString()}
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes rewardPopup {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    40% { transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -60%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -80%) scale(0.8); }
                }
                @keyframes coinSpin {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
                @keyframes sparkleGlow {
                    0% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.5); }
                }
            `}</style>
        </div>
    );
}
