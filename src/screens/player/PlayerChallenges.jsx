import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, Clock, Trophy, Gift, Star, ChevronRight, Check, Lock,
    Zap, Flame, TrendingUp, Users, Calendar, ArrowLeft, Sparkles,
    Award, Crown, Timer, CheckCircle
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMode } from '../../context/ModeContext';
import { useCMS } from '../../context/CMSContext';
import BurgerMenu from '../../components/BurgerMenu';
import { PageLoading, EmptyState } from '../../components/shared/LoadingStates';

const DIFFICULTY_COLORS = {
    easy: { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
    medium: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
    hard: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    legendary: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
};

// Challenge type icons
const TYPE_ICONS = {
    daily: '🎯',
    weekly: '🏆',
    special: '⭐',
};

function ChallengeCard({ challenge, onClaim, userProgress = 0 }) {
    const progress = userProgress;
    const total = challenge.targetValue || 1;
    const isComplete = progress >= total;
    const progressPercent = Math.min((progress / total) * 100, 100);
    const difficulty = challenge.difficulty || 'medium';
    const diffColors = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '0.75rem',
            border: isComplete ? '2px solid #86EFAC' : '1px solid #E5E7EB',
            boxShadow: isComplete ? '0 4px 15px rgba(34, 197, 94, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                {/* Icon */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: isComplete
                        ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                        : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    {isComplete ? (
                        <Check size={24} color="white" strokeWidth={3} />
                    ) : (
                        <span style={{ fontSize: '1.5rem' }}>{challenge.icon || TYPE_ICONS[challenge.type] || '🎯'}</span>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#1F2937',
                            margin: 0,
                        }}>
                            {challenge.title}
                        </h4>
                        <span style={{
                            padding: '0.125rem 0.375rem',
                            borderRadius: '999px',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: diffColors.bg,
                            color: diffColors.text,
                            border: `1px solid ${diffColors.border}`,
                        }}>
                            {difficulty}
                        </span>
                    </div>
                    <p style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        margin: '0 0 0.75rem 0',
                    }}>
                        {challenge.description}
                    </p>

                    {/* Progress Bar */}
                    {!isComplete && (
                        <div style={{ marginBottom: '0.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.25rem',
                                fontSize: '0.7rem',
                                color: '#9CA3AF',
                            }}>
                                <span>Progress</span>
                                <span>{progress} / {total}</span>
                            </div>
                            <div style={{
                                height: '8px',
                                background: '#F3F4F6',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${progressPercent}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
                                    borderRadius: '999px',
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Rewards */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            background: '#FEF3C7',
                            borderRadius: '999px',
                        }}>
                            <span style={{ fontSize: '0.75rem' }}>🪙</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
                                +{challenge.coinReward || 0}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            background: '#F3E8FF',
                            borderRadius: '999px',
                        }}>
                            <Zap size={12} color="#8B5CF6" fill="#8B5CF6" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED' }}>
                                +{challenge.xpReward || 0} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Claim Button */}
                {isComplete && (
                    <button
                        onClick={() => onClaim(challenge)}
                        style={{
                            padding: '0.625rem 1rem',
                            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            flexShrink: 0,
                        }}
                    >
                        Claim! 🎉
                    </button>
                )}
            </div>
        </div>
    );
}

export default function PlayerChallenges() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { challenges, getActiveChallenges, loading } = useCMS();
    const [activeTab, setActiveTab] = useState('daily');
    const [claimedIds, setClaimedIds] = useState([]);

    // Mock user progress - in production, this would come from user context/API
    const [userProgress] = useState({
        'prediction_made': 2,
        'streak_achieved': 1,
        'lesson_completed': 3,
        'weekend_prediction': 0,
    });

    const handleClaim = (challenge) => {
        setClaimedIds([...claimedIds, challenge.id]);
        // Update user coins/xp
        setUser(prev => ({
            ...prev,
            coins: prev.coins + (challenge.coinReward || 0),
            xp: (prev.xp || 0) + (challenge.xpReward || 0),
        }));
    };

    const tabs = [
        { id: 'daily', label: 'Daily', icon: Calendar },
        { id: 'weekly', label: 'Weekly', icon: Trophy },
        { id: 'special', label: 'Special', icon: Sparkles },
    ];

    // Get active challenges from CMS filtered by type
    const activeChallenges = getActiveChallenges(activeTab);
    const filteredChallenges = activeChallenges.filter(c => !claimedIds.includes(c.id));

    const getProgress = (challenge) => userProgress[challenge.triggerEvent] || 0;
    const completedCount = activeChallenges.filter(c =>
        getProgress(c) >= (c.targetValue || 1) || claimedIds.includes(c.id)
    ).length;

    if (loading) {
        return <PageLoading message="Loading challenges..." />;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 20%)',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
                padding: '1rem 1rem 2rem 1rem',
                borderRadius: '0 0 32px 32px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                        Challenges 🎯
                    </h1>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '0.875rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                            {completedCount}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Completed
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '0.875rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                            {activeChallenges.length}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Available
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '0.875rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                            {user.coins?.toLocaleString() || 0}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Coins Earned
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                marginTop: '-1rem',
            }}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const count = challenges.filter(c => c.isActive && c.type === tab.id).length;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.375rem',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: isActive
                                    ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                                    : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: isActive
                                    ? '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {count > 0 && <span style={{ opacity: 0.8 }}>({count})</span>}
                        </button>
                    );
                })}
            </div>

            {/* Challenge List */}
            <div style={{ padding: '0 1rem' }}>
                {filteredChallenges.length > 0 ? (
                    filteredChallenges.map(challenge => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            onClaim={handleClaim}
                            userProgress={getProgress(challenge)}
                        />
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <CheckCircle size={48} color="#22C55E" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>All Done! 🎉</h3>
                        <p>You've completed all {activeTab} challenges. Check back later for more!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
