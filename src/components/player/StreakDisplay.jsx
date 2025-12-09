import React, { useState } from 'react';
import { Flame, Calendar, Gift, X, Check } from 'lucide-react';

export default function StreakDisplay({
    streak = 3,
    showModal = false,
    onModalClose,
    compact = false,
}) {
    const [modalOpen, setModalOpen] = useState(showModal);

    // Calculate streak rewards
    const getStreakReward = (days) => {
        if (days >= 30) return 100;
        if (days >= 14) return 50;
        if (days >= 7) return 25;
        if (days >= 3) return 10;
        return 5;
    };

    const getNextMilestone = (current) => {
        const milestones = [3, 7, 14, 30];
        return milestones.find(m => m > current) || 30;
    };

    const currentReward = getStreakReward(streak);
    const nextMilestone = getNextMilestone(streak);
    const daysToMilestone = nextMilestone - streak;

    // Fire intensity based on streak
    const getFireIntensity = () => {
        if (streak >= 30) return { color: '#DC2626', size: 'lg', flames: 3 };
        if (streak >= 14) return { color: '#EA580C', size: 'md', flames: 2 };
        if (streak >= 7) return { color: '#F59E0B', size: 'md', flames: 2 };
        if (streak >= 3) return { color: '#FBBF24', size: 'sm', flames: 1 };
        return { color: '#FCD34D', size: 'sm', flames: 1 };
    };

    const fireIntensity = getFireIntensity();

    if (compact) {
        return (
            <div
                onClick={() => setModalOpen(true)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    borderRadius: '999px',
                    border: '2px solid #F59E0B',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
            >
                <div className="streak-fire" style={{ display: 'flex', alignItems: 'center' }}>
                    <Flame size={18} color={fireIntensity.color} fill={fireIntensity.color} />
                </div>
                <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#EA580C',
                }}>
                    {streak}
                </span>

                <style>{`
                    .streak-fire {
                        animation: fireFlicker 0.5s ease-in-out infinite alternate;
                    }
                    @keyframes fireFlicker {
                        0% { transform: scale(1) translateY(0); }
                        100% { transform: scale(1.1) translateY(-1px); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            {/* Streak Card */}
            <div
                onClick={() => setModalOpen(true)}
                style={{
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    border: '2px solid #F59E0B',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                }}
            >
                {/* Background flames */}
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    opacity: 0.1,
                }}>
                    <Flame size={120} color="#F59E0B" fill="#F59E0B" />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Fire Icon with animation */}
                        <div style={{
                            position: 'relative',
                            width: '56px',
                            height: '56px',
                        }}>
                            {/* Glow */}
                            <div style={{
                                position: 'absolute',
                                inset: '-8px',
                                background: `radial-gradient(circle, ${fireIntensity.color}40 0%, transparent 70%)`,
                                animation: 'fireGlow 1s ease-in-out infinite alternate',
                            }} />

                            {/* Fire stack */}
                            <div className="fire-container" style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {fireIntensity.flames >= 2 && (
                                    <>
                                        <Flame
                                            size={28}
                                            color={fireIntensity.color}
                                            fill={fireIntensity.color}
                                            style={{
                                                position: 'absolute',
                                                left: '4px',
                                                bottom: '8px',
                                                opacity: 0.6,
                                                animation: 'fireFlicker 0.6s ease-in-out infinite alternate',
                                            }}
                                        />
                                        <Flame
                                            size={28}
                                            color={fireIntensity.color}
                                            fill={fireIntensity.color}
                                            style={{
                                                position: 'absolute',
                                                right: '4px',
                                                bottom: '8px',
                                                opacity: 0.6,
                                                animation: 'fireFlicker 0.4s ease-in-out infinite alternate-reverse',
                                            }}
                                        />
                                    </>
                                )}
                                <Flame
                                    size={fireIntensity.size === 'lg' ? 44 : 36}
                                    color={fireIntensity.color}
                                    fill={fireIntensity.color}
                                    style={{
                                        animation: 'fireFlicker 0.5s ease-in-out infinite alternate',
                                        filter: `drop-shadow(0 0 8px ${fireIntensity.color}80)`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Streak Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '1.75rem',
                                fontWeight: 900,
                                color: '#EA580C',
                                lineHeight: 1,
                            }}>
                                {streak} Day Streak!
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                color: '#9A3412',
                                marginTop: '0.25rem',
                            }}>
                                +{currentReward} 🪙 daily bonus
                            </div>
                        </div>

                        {/* Arrow */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(234, 88, 12, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Gift size={18} color="#EA580C" />
                        </div>
                    </div>

                    {/* Progress to next milestone */}
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.375rem',
                            fontSize: '0.7rem',
                            color: '#9A3412',
                        }}>
                            <span>Next milestone</span>
                            <span>{daysToMilestone} days to {nextMilestone} day streak</span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(234, 88, 12, 0.2)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${((streak % nextMilestone) / nextMilestone) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)',
                                borderRadius: '999px',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fireFlicker {
                        0% { transform: scale(1) translateY(0); }
                        100% { transform: scale(1.05) translateY(-2px); }
                    }
                    @keyframes fireGlow {
                        0% { opacity: 0.5; transform: scale(1); }
                        100% { opacity: 1; transform: scale(1.1); }
                    }
                `}</style>
            </div>

            {/* Streak Details Modal */}
            {modalOpen && (
                <div
                    onClick={() => { setModalOpen(false); onModalClose?.(); }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            maxWidth: '380px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Flame size={24} color="#EA580C" fill="#EA580C" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
                                    Streak Rewards
                                </h2>
                            </div>
                            <button
                                onClick={() => { setModalOpen(false); onModalClose?.(); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.375rem',
                                }}
                            >
                                <X size={24} color="#6B7280" />
                            </button>
                        </div>

                        {/* Current Streak Display */}
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            borderRadius: '16px',
                            marginBottom: '1.5rem',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🔥</div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 900,
                                color: '#EA580C',
                            }}>
                                {streak} Days
                            </div>
                            <div style={{ color: '#9A3412', fontSize: '0.9rem' }}>
                                Keep it going!
                            </div>
                        </div>

                        {/* Milestone Rewards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { days: 3, reward: 10 },
                                { days: 7, reward: 25 },
                                { days: 14, reward: 50 },
                                { days: 30, reward: 100 },
                            ].map(({ days, reward }) => {
                                const achieved = streak >= days;
                                return (
                                    <div key={days} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.875rem 1rem',
                                        background: achieved ? '#F0FDF4' : '#F9FAFB',
                                        borderRadius: '12px',
                                        border: achieved ? '1px solid #86EFAC' : '1px solid #E5E7EB',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: achieved
                                                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                                    : '#E5E7EB',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {achieved ? (
                                                    <Check size={16} color="white" strokeWidth={3} />
                                                ) : (
                                                    <Flame size={14} color="#9CA3AF" />
                                                )}
                                            </div>
                                            <span style={{
                                                fontWeight: 600,
                                                color: achieved ? '#059669' : '#6B7280',
                                            }}>
                                                {days} Day Streak
                                            </span>
                                        </div>
                                        <span style={{
                                            fontWeight: 700,
                                            color: achieved ? '#F59E0B' : '#9CA3AF',
                                        }}>
                                            +{reward} 🪙
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Info */}
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            background: '#F3F4F6',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            textAlign: 'center',
                        }}>
                            💡 Play at least once per day to maintain your streak!
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
