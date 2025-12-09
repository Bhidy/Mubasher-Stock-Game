import React, { useEffect, useState } from 'react';
import { Zap, Star, Trophy, Crown } from 'lucide-react';

// Level titles based on level number
const LEVEL_TITLES = {
    1: 'Rookie Trader',
    2: 'Market Watcher',
    3: 'Stock Scout',
    4: 'Chart Reader',
    5: 'Trend Spotter',
    6: 'Market Analyst',
    7: 'Portfolio Builder',
    8: 'Stock Strategist',
    9: 'Trading Expert',
    10: 'Market Master',
    11: 'Investment Guru',
    12: 'Wall Street Pro',
    13: 'Trading Legend',
    14: 'Market Titan',
    15: 'Stock Mogul',
};

const getLevelTitle = (level) => LEVEL_TITLES[level] || `Level ${level} Trader`;

// Calculate XP needed for next level
const getXPForLevel = (level) => Math.floor(500 * Math.pow(1.5, level - 1));

export default function XPProgressBar({
    currentXP = 750,
    level = 7,
    showDetails = true,
    compact = false,
    animated = true
}) {
    const [displayXP, setDisplayXP] = useState(0);
    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);

    // Animate XP counter on mount
    useEffect(() => {
        if (!animated) {
            setDisplayXP(currentXP);
            return;
        }

        const duration = 1500;
        const steps = 60;
        const increment = currentXP / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= currentXP) {
                setDisplayXP(currentXP);
                clearInterval(timer);
            } else {
                setDisplayXP(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [currentXP, animated]);

    if (compact) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                borderRadius: '999px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '0.7rem' }}>{level}</span>
                </div>
                <div style={{
                    width: '60px',
                    height: '6px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
                        borderRadius: '999px',
                        transition: 'width 1s ease-out',
                    }} />
                </div>
                <Zap size={14} color="#8B5CF6" />
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Level Badge */}
                    <div style={{
                        position: 'relative',
                        width: '52px',
                        height: '52px',
                    }}>
                        {/* Outer glow ring */}
                        <div style={{
                            position: 'absolute',
                            inset: '-4px',
                            borderRadius: '50%',
                            background: 'conic-gradient(from 0deg, #8B5CF6, #EC4899, #F59E0B, #8B5CF6)',
                            animation: 'spin 4s linear infinite',
                            opacity: 0.3,
                        }} />
                        {/* Inner badge */}
                        <div style={{
                            position: 'absolute',
                            inset: '0',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                            border: '3px solid white',
                        }}>
                            <span style={{
                                color: 'white',
                                fontWeight: 900,
                                fontSize: '1.25rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}>
                                {level}
                            </span>
                        </div>
                        {/* Crown for high levels */}
                        {level >= 10 && (
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}>
                                <Crown size={16} color="#F59E0B" fill="#F59E0B" />
                            </div>
                        )}
                    </div>

                    <div>
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: '#1F2937',
                            marginBottom: '2px',
                        }}>
                            Level {level}
                        </div>
                        <div style={{
                            fontSize: '0.8rem',
                            color: '#8B5CF6',
                            fontWeight: 600,
                        }}>
                            {getLevelTitle(level)}
                        </div>
                    </div>
                </div>

                {/* XP Counter */}
                <div style={{
                    textAlign: 'right',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        justifyContent: 'flex-end',
                    }}>
                        <Zap size={16} color="#8B5CF6" fill="#8B5CF6" />
                        <span style={{
                            fontSize: '1.125rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {displayXP.toLocaleString()} XP
                        </span>
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        color: '#9CA3AF',
                        marginTop: '2px',
                    }}>
                        {Math.max(0, xpForNextLevel - currentXP).toLocaleString()} to Level {level + 1}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                position: 'relative',
                height: '12px',
                background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                borderRadius: '999px',
                overflow: 'hidden',
            }}>
                {/* Animated background stripes */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                    )`,
                    animation: 'moveStripes 1s linear infinite',
                }} />

                {/* Progress fill */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
                    borderRadius: '999px',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
                }}>
                    {/* Shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                        borderRadius: '999px 999px 0 0',
                    }} />

                    {/* Sparkle at end */}
                    <div style={{
                        position: 'absolute',
                        right: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        background: 'radial-gradient(circle, white 0%, transparent 70%)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* Milestones */}
            {showDetails && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                    fontSize: '0.7rem',
                    color: '#9CA3AF',
                }}>
                    <span>Level {level}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={10} color="#F59E0B" fill="#F59E0B" />
                        <span>{Math.round(progressPercent)}% Complete</span>
                    </div>
                    <span>Level {level + 1}</span>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes moveStripes {
                    from { transform: translateX(0); }
                    to { transform: translateX(20px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: translateY(-50%) scale(1); }
                    50% { opacity: 1; transform: translateY(-50%) scale(1.2); }
                }
            `}</style>
        </div>
    );
}

// Mini XP display for headers
export function XPBadge({ xp = 750, size = 'md' }) {
    const sizes = {
        sm: { padding: '0.25rem 0.5rem', fontSize: '0.7rem', iconSize: 10 },
        md: { padding: '0.375rem 0.75rem', fontSize: '0.8rem', iconSize: 12 },
        lg: { padding: '0.5rem 1rem', fontSize: '0.9rem', iconSize: 14 },
    };

    const s = sizes[size];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: s.padding,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
            borderRadius: '999px',
            border: '1px solid rgba(139, 92, 246, 0.25)',
        }}>
            <Zap size={s.iconSize} color="#8B5CF6" fill="#8B5CF6" />
            <span style={{
                fontSize: s.fontSize,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                {xp.toLocaleString()} XP
            </span>
        </div>
    );
}
