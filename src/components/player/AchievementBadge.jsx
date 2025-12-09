import React, { useState } from 'react';
import { Lock, Check, Star, Gift, Trophy, Sparkles } from 'lucide-react';

// Achievement data structure
const ACHIEVEMENTS = [
    // Beginner achievements
    { id: 'first_pick', name: 'First Pick', description: 'Make your first stock pick', icon: '🎯', category: 'beginner', xp: 50, rarity: 'common' },
    { id: 'first_win', name: 'Lucky Start', description: 'Win your first prediction', icon: '🍀', category: 'beginner', xp: 100, rarity: 'common' },
    { id: 'tutorial_done', name: 'Quick Learner', description: 'Complete the tutorial', icon: '📚', category: 'beginner', xp: 75, rarity: 'common' },

    // Streak achievements
    { id: 'streak_3', name: 'Getting Started', description: 'Reach a 3-day streak', icon: '🔥', category: 'streak', xp: 100, rarity: 'common' },
    { id: 'streak_7', name: 'Weekly Warrior', description: 'Reach a 7-day streak', icon: '⚡', category: 'streak', xp: 250, rarity: 'uncommon' },
    { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: '💎', category: 'streak', xp: 1000, rarity: 'epic' },

    // Prediction achievements
    { id: 'win_5', name: 'Winning Streak', description: 'Win 5 predictions in a row', icon: '🎰', category: 'prediction', xp: 200, rarity: 'uncommon' },
    { id: 'win_10', name: 'Market Wizard', description: 'Win 10 predictions in a row', icon: '🧙', category: 'prediction', xp: 500, rarity: 'rare' },
    { id: 'total_50', name: 'Half Century', description: 'Make 50 total predictions', icon: '🎲', category: 'prediction', xp: 300, rarity: 'uncommon' },

    // Social achievements
    { id: 'join_clan', name: 'Team Player', description: 'Join your first clan', icon: '🛡️', category: 'social', xp: 150, rarity: 'common' },
    { id: 'invite_friend', name: 'Friendly Invite', description: 'Invite a friend to play', icon: '👋', category: 'social', xp: 200, rarity: 'uncommon' },
    { id: 'top_100', name: 'Rising Star', description: 'Reach top 100 on leaderboard', icon: '⭐', category: 'social', xp: 500, rarity: 'rare' },

    // Special achievements
    { id: 'perfect_day', name: 'Perfect Day', description: 'Get all predictions right in one day', icon: '💯', category: 'special', xp: 1000, rarity: 'legendary' },
    { id: 'millionaire', name: 'Coin Millionaire', description: 'Earn 1,000,000 total coins', icon: '👑', category: 'special', xp: 2000, rarity: 'legendary' },
];

const RARITY_COLORS = {
    common: { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280', label: 'Common' },
    uncommon: { bg: '#DCFCE7', border: '#86EFAC', text: '#16A34A', label: 'Uncommon' },
    rare: { bg: '#DBEAFE', border: '#93C5FD', text: '#2563EB', label: 'Rare' },
    epic: { bg: '#F3E8FF', border: '#C4B5FD', text: '#7C3AED', label: 'Epic' },
    legendary: { bg: '#FEF3C7', border: '#FCD34D', text: '#D97706', label: 'Legendary' },
};

export function AchievementBadge({
    achievement,
    unlocked = false,
    progress = 0,
    size = 'md',
    onClick,
    showDetails = false
}) {
    const rarity = RARITY_COLORS[achievement.rarity];

    const sizes = {
        sm: { badge: 48, icon: 24, fontSize: '0.7rem' },
        md: { badge: 64, icon: 32, fontSize: '0.8rem' },
        lg: { badge: 80, icon: 40, fontSize: '0.9rem' },
    };

    const s = sizes[size];

    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                cursor: onClick ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.5,
                filter: unlocked ? 'none' : 'grayscale(0.7)',
                transition: 'all 0.2s',
            }}
        >
            {/* Badge */}
            <div style={{
                position: 'relative',
                width: s.badge,
                height: s.badge,
            }}>
                {/* Outer glow for unlocked */}
                {unlocked && achievement.rarity !== 'common' && (
                    <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${rarity.border}60 0%, transparent 70%)`,
                        animation: 'achievementGlow 2s ease-in-out infinite',
                    }} />
                )}

                {/* Badge body */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: unlocked ? rarity.bg : '#F3F4F6',
                    border: `3px solid ${unlocked ? rarity.border : '#D1D5DB'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: unlocked
                        ? `0 4px 12px ${rarity.border}40`
                        : '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                    {unlocked ? (
                        <span style={{ fontSize: s.icon }}>{achievement.icon}</span>
                    ) : (
                        <Lock size={s.icon * 0.6} color="#9CA3AF" />
                    )}
                </div>

                {/* Progress ring for locked achievements */}
                {!unlocked && progress > 0 && (
                    <svg
                        style={{
                            position: 'absolute',
                            inset: '-2px',
                            transform: 'rotate(-90deg)',
                        }}
                        width={s.badge + 4}
                        height={s.badge + 4}
                    >
                        <circle
                            cx={(s.badge + 4) / 2}
                            cy={(s.badge + 4) / 2}
                            r={(s.badge - 2) / 2}
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="3"
                            strokeDasharray={`${progress * Math.PI * (s.badge - 2)} ${Math.PI * (s.badge - 2)}`}
                            strokeLinecap="round"
                        />
                    </svg>
                )}
            </div>

            {/* Name */}
            {showDetails && (
                <div style={{
                    textAlign: 'center',
                    maxWidth: s.badge + 20,
                }}>
                    <div style={{
                        fontSize: s.fontSize,
                        fontWeight: 700,
                        color: unlocked ? '#1F2937' : '#9CA3AF',
                        lineHeight: 1.2,
                    }}>
                        {achievement.name}
                    </div>
                    {unlocked && (
                        <div style={{
                            fontSize: '0.6rem',
                            color: rarity.text,
                            fontWeight: 600,
                            marginTop: '2px',
                        }}>
                            +{achievement.xp} XP
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes achievementGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}

export function AchievementShowcase({ achievements = [], unlockedIds = [], limit = 6 }) {
    const recentUnlocked = achievements
        .filter(a => unlockedIds.includes(a.id))
        .slice(0, limit);

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={20} color="#8B5CF6" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>
                        Achievements
                    </h3>
                    <span style={{
                        padding: '0.125rem 0.5rem',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#8B5CF6',
                    }}>
                        {unlockedIds.length}/{achievements.length}
                    </span>
                </div>
                <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#8B5CF6',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                }}>
                    View All →
                </button>
            </div>

            {/* Achievement Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                gap: '0.75rem',
            }}>
                {recentUnlocked.length > 0 ? (
                    recentUnlocked.map(achievement => (
                        <AchievementBadge
                            key={achievement.id}
                            achievement={achievement}
                            unlocked={true}
                            size="md"
                            showDetails
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '2rem',
                        color: '#9CA3AF',
                    }}>
                        <Trophy size={40} color="#E5E7EB" style={{ marginBottom: '0.5rem' }} />
                        <p>No achievements yet. Start playing to earn badges!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function AchievementUnlockPopup({ achievement, onClose }) {
    const rarity = RARITY_COLORS[achievement.rarity];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease-out',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '28px',
                    padding: '2rem',
                    textAlign: 'center',
                    maxWidth: '320px',
                    width: '90%',
                    animation: 'achievementPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Sparkles */}
                <div style={{
                    position: 'relative',
                    marginBottom: '1rem',
                }}>
                    <Sparkles
                        size={24}
                        color="#F59E0B"
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '30%',
                            animation: 'sparkle 1s ease-in-out infinite',
                        }}
                    />
                    <Sparkles
                        size={20}
                        color="#EC4899"
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '25%',
                            animation: 'sparkle 1s ease-in-out 0.3s infinite',
                        }}
                    />
                </div>

                {/* Badge */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${rarity.bg} 0%, white 100%)`,
                    border: `4px solid ${rarity.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 30px ${rarity.border}60`,
                    animation: 'badgeShine 2s ease-in-out infinite',
                }}>
                    <span style={{ fontSize: '3rem' }}>{achievement.icon}</span>
                </div>

                {/* Title */}
                <div style={{
                    fontSize: '0.75rem',
                    color: rarity.text,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem',
                }}>
                    {rarity.label} Achievement
                </div>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#1F2937',
                    marginBottom: '0.5rem',
                }}>
                    {achievement.name}
                </h2>
                <p style={{
                    color: '#6B7280',
                    fontSize: '0.9rem',
                    marginBottom: '1.25rem',
                }}>
                    {achievement.description}
                </p>

                {/* XP Reward */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                    borderRadius: '999px',
                    marginBottom: '1.5rem',
                }}>
                    <Star size={16} color="#8B5CF6" fill="#8B5CF6" />
                    <span style={{
                        fontWeight: 700,
                        color: '#8B5CF6',
                    }}>
                        +{achievement.xp} XP
                    </span>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '0.875rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                    }}
                >
                    Awesome! 🎉
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes achievementPop {
                    0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                    60% { transform: scale(1.1) rotate(2deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                }
                @keyframes badgeShine {
                    0%, 100% { box-shadow: 0 8px 30px ${rarity.border}40; }
                    50% { box-shadow: 0 8px 40px ${rarity.border}70; }
                }
            `}</style>
        </div>
    );
}

export { ACHIEVEMENTS, RARITY_COLORS };
