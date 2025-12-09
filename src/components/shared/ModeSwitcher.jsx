import React from 'react';
import { useMode } from '../../context/ModeContext';
import { Gamepad2, TrendingUp, Sparkles } from 'lucide-react';

export default function ModeSwitcher({ variant = 'default', showLabels = true, onModeSwitch }) {
    const { mode, switchMode, isTransitioning, MODES } = useMode();

    const handleModeSwitch = (newMode) => {
        if (newMode !== mode) {
            switchMode(newMode);
            // Call callback after mode switch
            if (onModeSwitch) {
                onModeSwitch(newMode);
            }
        }
    };

    // Compact variant for header/inline use
    if (variant === 'compact') {
        return (
            <div className="mode-switcher-compact" style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                padding: '3px',
                gap: '2px',
                backdropFilter: 'blur(10px)',
            }}>
                <button
                    onClick={() => handleModeSwitch('player')}
                    disabled={isTransitioning}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: mode === 'player' ? 'white' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: isTransitioning ? 0.5 : 1,
                    }}
                    title="Player Mode"
                >
                    <span style={{ fontSize: '1.125rem' }}>🎮</span>
                </button>
                <button
                    onClick={() => handleModeSwitch('investor')}
                    disabled={isTransitioning}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: mode === 'investor' ? 'white' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: isTransitioning ? 0.5 : 1,
                    }}
                    title="Investor Mode"
                >
                    <span style={{ fontSize: '1.125rem' }}>📈</span>
                </button>
            </div>
        );
    }

    // Full variant for burger menu
    return (
        <div style={{ width: '100%' }}>
            {/* Section Label */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingLeft: '0.25rem',
            }}>
                <Sparkles size={14} color="rgba(255,255,255,0.7)" />
                <span style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}>
                    Experience Mode
                </span>
            </div>

            {/* Mode Toggle */}
            <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '4px',
                gap: '4px',
            }}>
                {/* Player Mode Button */}
                <button
                    onClick={() => handleModeSwitch('player')}
                    disabled={isTransitioning}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: mode === 'player'
                            ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                            : 'transparent',
                        color: mode === 'player' ? 'white' : 'rgba(255,255,255,0.7)',
                        fontWeight: mode === 'player' ? 700 : 500,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: mode === 'player'
                            ? '0 4px 15px rgba(139, 92, 246, 0.4)'
                            : 'none',
                        opacity: isTransitioning ? 0.7 : 1,
                        transform: mode === 'player' ? 'scale(1)' : 'scale(0.98)',
                    }}
                >
                    <span style={{ fontSize: '1.25rem' }}>🎮</span>
                    {showLabels && <span>Player</span>}
                </button>

                {/* Investor Mode Button */}
                <button
                    onClick={() => handleModeSwitch('investor')}
                    disabled={isTransitioning}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: mode === 'investor'
                            ? 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)'
                            : 'transparent',
                        color: mode === 'investor' ? 'white' : 'rgba(255,255,255,0.7)',
                        fontWeight: mode === 'investor' ? 700 : 500,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: mode === 'investor'
                            ? '0 4px 15px rgba(14, 165, 233, 0.4)'
                            : 'none',
                        opacity: isTransitioning ? 0.7 : 1,
                        transform: mode === 'investor' ? 'scale(1)' : 'scale(0.98)',
                    }}
                >
                    <span style={{ fontSize: '1.25rem' }}>📈</span>
                    {showLabels && <span>Investor</span>}
                </button>
            </div>

            {/* Mode Description */}
            <div style={{
                marginTop: '0.75rem',
                padding: '0.625rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: mode === 'player'
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                        : 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    {mode === 'player'
                        ? <Gamepad2 size={14} color="white" />
                        : <TrendingUp size={14} color="white" />
                    }
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                    }}>
                        {mode === 'player' ? 'Gamified Experience' : 'Professional Trading'}
                    </div>
                    <div style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.7rem',
                        lineHeight: 1.3,
                    }}>
                        {mode === 'player'
                            ? 'Learn & earn with fun challenges'
                            : 'Advanced tools & analytics'}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export a simple toggle for quick switching
export function ModeToggle({ size = 'md' }) {
    const { mode, switchMode, isTransitioning } = useMode();

    const sizes = {
        sm: { width: '50px', height: '26px', dot: '20px' },
        md: { width: '60px', height: '30px', dot: '24px' },
        lg: { width: '70px', height: '34px', dot: '28px' },
    };

    const s = sizes[size];

    return (
        <button
            onClick={() => switchMode(mode === 'player' ? 'investor' : 'player')}
            disabled={isTransitioning}
            style={{
                width: s.width,
                height: s.height,
                borderRadius: '999px',
                border: 'none',
                background: mode === 'player'
                    ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                    : 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                opacity: isTransitioning ? 0.7 : 1,
            }}
        >
            <div style={{
                position: 'absolute',
                top: '50%',
                left: mode === 'player' ? '3px' : `calc(100% - ${s.dot} - 3px)`,
                transform: 'translateY(-50%)',
                width: s.dot,
                height: s.dot,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
            }}>
                {mode === 'player' ? '🎮' : '📈'}
            </div>
        </button>
    );
}
