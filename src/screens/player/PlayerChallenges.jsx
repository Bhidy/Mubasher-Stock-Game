import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, Clock, Trophy, Gift, Star, ChevronRight, Check, Lock,
    Zap, Flame, TrendingUp, Users, Calendar, ArrowLeft, Sparkles,
    Award, Crown, Timer, CheckCircle
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMode } from '../../context/ModeContext';
import BurgerMenu from '../../components/BurgerMenu';

// Challenge types and data
const DAILY_CHALLENGES = [
    {
        id: 'd1',
        title: 'Make 3 Predictions',
        description: 'Pick 3 stocks for today\'s contest',
        icon: '🎯',
        reward: 50,
        rewardType: 'coins',
        progress: 2,
        total: 3,
        xp: 25,
        difficulty: 'easy'
    },
    {
        id: 'd2',
        title: 'Win 2 Predictions',
        description: 'Get 2 correct predictions',
        icon: '🏆',
        reward: 100,
        rewardType: 'xp',
        progress: 1,
        total: 2,
        xp: 50,
        difficulty: 'medium'
    },
    {
        id: 'd3',
        title: 'Complete a Lesson',
        description: 'Finish any Academy lesson',
        icon: '📚',
        reward: 75,
        rewardType: 'coins',
        progress: 0,
        total: 1,
        xp: 30,
        difficulty: 'easy'
    },
    {
        id: 'd4',
        title: 'Visit Community',
        description: 'Check out what others are saying',
        icon: '👥',
        reward: 25,
        rewardType: 'coins',
        progress: 1,
        total: 1,
        xp: 10,
        difficulty: 'easy'
    },
];

const WEEKLY_CHALLENGES = [
    {
        id: 'w1',
        title: 'Prediction Master',
        description: 'Make 20 predictions this week',
        icon: '🎲',
        reward: 500,
        rewardType: 'coins',
        progress: 12,
        total: 20,
        xp: 200,
        difficulty: 'hard'
    },
    {
        id: 'w2',
        title: '7-Day Streak',
        description: 'Maintain a 7-day login streak',
        icon: '🔥',
        reward: 300,
        rewardType: 'coins',
        progress: 5,
        total: 7,
        xp: 150,
        difficulty: 'medium'
    },
    {
        id: 'w3',
        title: 'Top 100',
        description: 'Reach top 100 on the leaderboard',
        icon: '⭐',
        reward: 1000,
        rewardType: 'coins',
        progress: 0,
        total: 1,
        xp: 500,
        difficulty: 'legendary'
    },
];

const SPECIAL_CHALLENGES = [
    {
        id: 's1',
        title: 'Perfect Day',
        description: 'Get all predictions right in one day',
        icon: '💯',
        reward: 1000,
        rewardType: 'coins',
        progress: 0,
        total: 1,
        xp: 1000,
        difficulty: 'legendary',
        expires: 'End of day'
    },
    {
        id: 's2',
        title: 'Early Bird',
        description: 'Make predictions before 9 AM',
        icon: '🌅',
        reward: 100,
        rewardType: 'coins',
        progress: 0,
        total: 3,
        xp: 75,
        difficulty: 'medium',
        expires: 'Daily'
    },
];

const DIFFICULTY_COLORS = {
    easy: { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
    medium: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
    hard: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    legendary: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
};

function ChallengeCard({ challenge, onClaim }) {
    const isComplete = challenge.progress >= challenge.total;
    const progressPercent = (challenge.progress / challenge.total) * 100;
    const diffColors = DIFFICULTY_COLORS[challenge.difficulty];

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
                        <span style={{ fontSize: '1.5rem' }}>{challenge.icon}</span>
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
                            {challenge.difficulty}
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
                                <span>{challenge.progress} / {challenge.total}</span>
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
                                +{challenge.reward}
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
                                +{challenge.xp} XP
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
    const [activeTab, setActiveTab] = useState('daily');
    const [claimedIds, setClaimedIds] = useState(['d4']);

    const handleClaim = (challenge) => {
        setClaimedIds([...claimedIds, challenge.id]);
        // Update user coins/xp
        setUser(prev => ({
            ...prev,
            coins: prev.coins + challenge.reward,
            xp: (prev.xp || 0) + challenge.xp,
        }));
    };

    const tabs = [
        { id: 'daily', label: 'Daily', icon: Calendar, count: DAILY_CHALLENGES.length },
        { id: 'weekly', label: 'Weekly', icon: Trophy, count: WEEKLY_CHALLENGES.length },
        { id: 'special', label: 'Special', icon: Sparkles, count: SPECIAL_CHALLENGES.length },
    ];

    const getChallenges = () => {
        switch (activeTab) {
            case 'weekly': return WEEKLY_CHALLENGES;
            case 'special': return SPECIAL_CHALLENGES;
            default: return DAILY_CHALLENGES;
        }
    };

    const challenges = getChallenges().filter(c => !claimedIds.includes(c.id));
    const completedCount = getChallenges().filter(c => c.progress >= c.total || claimedIds.includes(c.id)).length;

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
                            14h
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Time Left
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
                            1,250
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
                        </button>
                    );
                })}
            </div>

            {/* Challenge List */}
            <div style={{ padding: '0 1rem' }}>
                {challenges.length > 0 ? (
                    challenges.map(challenge => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            onClaim={handleClaim}
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
