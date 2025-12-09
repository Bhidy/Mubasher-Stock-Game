import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy, Star, Lock, Check, ArrowLeft, Filter, Search,
    Sparkles, Crown, Medal, Shield, Target, Flame, Zap, Award
} from 'lucide-react';
import { UserContext } from '../../App';
import { useCMS } from '../../context/CMSContext';
import { ACHIEVEMENTS as FALLBACK_ACHIEVEMENTS, RARITY_COLORS, AchievementBadge, AchievementUnlockPopup } from '../../components/player/AchievementBadge';

// Extended achievements with categories
const ACHIEVEMENT_CATEGORIES = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'beginner', label: 'Beginner', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'prediction', label: 'Predictions', icon: Trophy },
    { id: 'social', label: 'Social', icon: Shield },
    { id: 'special', label: 'Special', icon: Crown },
];

export default function PlayerAchievements() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { achievements: cmsAchievements, loading } = useCMS();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [showUnlockPopup, setShowUnlockPopup] = useState(false);

    // Mock unlocked achievements
    const unlockedIds = ['first_pick', 'first_win', 'tutorial_done', 'streak_3', 'streak_7', 'join_clan', 'ach-1'];

    // Merge CMS achievements with fallback
    const ACHIEVEMENTS = useMemo(() => {
        if (cmsAchievements.length > 0) {
            // Transform CMS achievements to match expected format
            return cmsAchievements.map(a => ({
                id: a.id,
                name: a.title,
                description: a.description,
                icon: a.icon || '🏆',
                category: a.category || 'special',
                xp: a.xpReward || 100,
                coins: a.coinReward || 0,
                rarity: a.rarity || 'common',
            }));
        }
        return FALLBACK_ACHIEVEMENTS;
    }, [cmsAchievements]);

    // Filter achievements
    const filteredAchievements = ACHIEVEMENTS.filter(a => {
        const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Stats
    const totalUnlocked = unlockedIds.length;
    const totalXP = ACHIEVEMENTS
        .filter(a => unlockedIds.includes(a.id))
        .reduce((sum, a) => sum + (a.xp || 0), 0);

    // Group by rarity
    const rarityGroups = {
        common: filteredAchievements.filter(a => a.rarity === 'common'),
        uncommon: filteredAchievements.filter(a => a.rarity === 'uncommon'),
        rare: filteredAchievements.filter(a => a.rarity === 'rare'),
        epic: filteredAchievements.filter(a => a.rarity === 'epic'),
        legendary: filteredAchievements.filter(a => a.rarity === 'legendary'),
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                padding: '1rem 1rem 2rem 1rem',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative */}
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-20px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                }} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                        Achievements 🏆
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
                        padding: '1rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            color: 'white',
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                        }}>
                            <Trophy size={20} />
                            {totalUnlocked}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Unlocked
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '1rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900 }}>
                            {ACHIEVEMENTS.length}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            Total
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '1rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            color: 'white',
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                        }}>
                            <Zap size={18} />
                            {totalXP.toLocaleString()}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 500 }}>
                            XP Earned
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div style={{ padding: '1rem', paddingBottom: 0 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                }}>
                    <Search size={18} color="#9CA3AF" />
                    <input
                        type="text"
                        placeholder="Search achievements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.9rem',
                            color: '#1F2937',
                        }}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
            }}>
                {ACHIEVEMENT_CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: isActive
                                    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                                    : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                boxShadow: isActive
                                    ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                                    : '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                        >
                            <cat.icon size={14} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Achievement Grid */}
            <div style={{ padding: '0 1rem' }}>
                {Object.entries(rarityGroups).map(([rarity, achievements]) => {
                    if (achievements.length === 0) return null;
                    const rarityInfo = RARITY_COLORS[rarity];

                    return (
                        <div key={rarity} style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.75rem',
                            }}>
                                <span style={{
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    background: rarityInfo.bg,
                                    color: rarityInfo.text,
                                    border: `1px solid ${rarityInfo.border}`,
                                }}>
                                    {rarityInfo.label}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                    {achievements.filter(a => unlockedIds.includes(a.id)).length}/{achievements.length}
                                </span>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: '1rem',
                            }}>
                                {achievements.map(achievement => (
                                    <div
                                        key={achievement.id}
                                        onClick={() => {
                                            setSelectedAchievement(achievement);
                                            if (unlockedIds.includes(achievement.id)) {
                                                setShowUnlockPopup(true);
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <AchievementBadge
                                            achievement={achievement}
                                            unlocked={unlockedIds.includes(achievement.id)}
                                            size="lg"
                                            showDetails
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Achievement Detail Popup */}
            {showUnlockPopup && selectedAchievement && (
                <AchievementUnlockPopup
                    achievement={selectedAchievement}
                    onClose={() => {
                        setShowUnlockPopup(false);
                        setSelectedAchievement(null);
                    }}
                />
            )}
        </div>
    );
}
