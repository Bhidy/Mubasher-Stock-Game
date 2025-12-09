import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, Target, Flame, Trophy, Gift, BookOpen,
    TrendingUp, Zap, Star, Users, Clock, Play, Sparkles,
    ArrowRight, Check, Lock, Award, Gamepad2, Bell
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';
import { useMode } from '../../context/ModeContext';
import { useCMS } from '../../context/CMSContext';
import BurgerMenu from '../../components/BurgerMenu';
import XPProgressBar from '../../components/player/XPProgressBar';
import CoinDisplay from '../../components/player/CoinDisplay';
import StreakDisplay from '../../components/player/StreakDisplay';
import { AchievementShowcase, ACHIEVEMENTS } from '../../components/player/AchievementBadge';

// Daily Challenges Data
const DAILY_CHALLENGES = [
    { id: 1, title: 'Make 3 Predictions', icon: '🎯', reward: 50, progress: 2, total: 3, type: 'coins' },
    { id: 2, title: 'Win 2 Predictions', icon: '🏆', reward: 100, progress: 1, total: 2, type: 'xp' },
    { id: 3, title: 'Complete a Lesson', icon: '📚', reward: 75, progress: 0, total: 1, type: 'coins' },
];

// Quick Actions for Player Mode
const QUICK_ACTIONS = [
    { id: 'pick', icon: Target, label: 'Pick Stocks', path: '/player/pick', color: '#8B5CF6', emoji: '🎯' },
    { id: 'live', icon: Play, label: 'Live Contest', path: '/player/live', color: '#EF4444', emoji: '🔴' },
    { id: 'learn', icon: BookOpen, label: 'Academy', path: '/player/learn', color: '#F59E0B', emoji: '📚' },
    { id: 'social', icon: Users, label: 'Clans', path: '/clans', color: '#10B981', emoji: '🛡️' },
];

export default function PlayerHome() {
    const { user, setUser } = useContext(UserContext);
    const { market } = useMarket();
    const { currentMode } = useMode();
    const { announcements, loading: cmsLoading } = useCMS();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    const [showDailyReward, setShowDailyReward] = useState(false);

    // Set greeting based on time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Mock user data for player mode
    const playerData = {
        level: user.level || 7,
        xp: user.xp || 2750,
        xpToNext: 3500,
        coins: user.coins || 1250,
        streak: user.streak || 5,
        rank: user.rank || 147,
        totalPicks: 42,
        winRate: 68,
        unlockedAchievements: ['first_pick', 'first_win', 'tutorial_done', 'streak_3'],
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 20%, #FFFFFF 100%)',
            paddingBottom: '120px',
            position: 'relative',
            zIndex: 0,
            isolation: 'isolate',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
                padding: '1rem 1rem 3rem 1rem',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                // overflow: 'hidden' removed
            }}>
                {/* Background Clipper */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    borderRadius: '0 0 32px 32px',
                }}>
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-30px',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '10%',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }} />

                </div>

                {/* Top bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    position: 'relative',
                }}>
                    <BurgerMenu variant="glass" />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CoinDisplay coins={playerData.coins} size="sm" variant="glass" />
                        <StreakDisplay streak={playerData.streak} compact />

                        {/* Notifications */}
                        <button
                            onClick={() => navigate('/notifications')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <Bell size={18} color="white" />
                            <span style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '8px',
                                height: '8px',
                                background: '#EF4444',
                                borderRadius: '50%',
                            }} />
                        </button>

                        {/* Profile */}
                        <button
                            onClick={() => navigate('/profile')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                color: 'white',
                                fontWeight: 700,
                            }}>
                                {user.name?.charAt(0)?.toUpperCase() || '👤'}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Greeting and user info */}
                <div style={{
                    position: 'relative',
                    color: 'white',
                    paddingLeft: '0.25rem',
                }}>
                    <div style={{
                        fontSize: '0.85rem',
                        opacity: 0.9,
                        marginBottom: '0.25rem',
                    }}>
                        {greeting}, {user.name || 'Trader'} 👋
                    </div>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        marginBottom: '0.25rem',
                    }}>
                        Ready to Predict?
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <span>{market.flag} {market.name}</span>
                        <span>•</span>
                        <span>Rank #{playerData.rank}</span>
                    </div>
                </div>
            </div>

            {/* XP Progress Bar - Overlapping header */}
            <div style={{
                margin: '-2rem 1rem 0 1rem',
                position: 'relative',
            }}>
                <XPProgressBar
                    currentXP={playerData.xp}
                    level={playerData.level}
                />
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem 1rem' }}>

                {/* Quick Actions */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                }}>
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 0.5rem',
                                background: 'white',
                                borderRadius: '16px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}10 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <span style={{ fontSize: '1.25rem' }}>{action.emoji}</span>
                            </div>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: '#4B5563',
                                textAlign: 'center',
                            }}>
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Announcements Banner */}
                {announcements && announcements
                    .filter(a => a.isActive && (a.targetMode === 'player' || a.targetMode === 'all'))
                    .map((ann, i) => (
                        <div
                            key={ann.id}
                            style={{
                                marginBottom: '1.5rem',
                                background: ann.type === 'promo' ? 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' : 'white',
                                borderRadius: '20px',
                                padding: '1.25rem',
                                color: ann.type === 'promo' ? 'white' : '#1F2937',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 8px 16px rgba(124, 58, 237, 0.15)',
                                border: ann.type !== 'promo' ? '1px solid #F3F4F6' : 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Decorative background needed for promo */}
                            {ann.type === 'promo' && (
                                <>
                                    <div style={{
                                        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                                        background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                                    }} />
                                    <div style={{
                                        position: 'absolute', bottom: -10, left: -10, width: 60, height: 60,
                                        background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                                    }} />
                                </>
                            )}

                            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    marginBottom: '0.25rem',
                                    color: ann.type === 'promo' ? 'rgba(255,255,255,0.8)' : '#7C3AED',
                                    display: 'flex', alignItems: 'center', gap: '0.375rem'
                                }}>
                                    {ann.type === 'promo' ? <Sparkles size={12} /> : <Bell size={12} />}
                                    {ann.type}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{ann.title}</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4 }}>{ann.message}</p>

                                {ann.buttonText && (
                                    <button
                                        onClick={() => navigate(ann.buttonLink)}
                                        style={{
                                            marginTop: '0.75rem',
                                            padding: '0.5rem 1rem',
                                            background: ann.type === 'promo' ? 'white' : '#7C3AED',
                                            color: ann.type === 'promo' ? '#7C3AED' : 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {ann.buttonText}
                                    </button>
                                )}
                            </div>

                            {ann.type === 'promo' && (
                                <div style={{ position: 'relative', zIndex: 1, marginLeft: '1rem', opacity: 0.9 }}>
                                    <Gift size={48} color="white" strokeWidth={1.5} />
                                </div>
                            )}
                        </div>
                    ))}

                {/* Featured Contest Card */}
                <div
                    onClick={() => navigate('/player/live')}
                    style={{
                        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                    }}
                >
                    {/* Sparkle decorations */}
                    <Sparkles
                        size={32}
                        color="rgba(255,255,255,0.2)"
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '60px',
                        }}
                    />
                    <Sparkles
                        size={20}
                        color="rgba(255,255,255,0.15)"
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                    }}>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            borderRadius: '999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'white',
                                animation: 'pulse 2s infinite',
                            }} />
                            <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>LIVE NOW</span>
                        </div>
                    </div>

                    <h3 style={{
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        marginBottom: '0.375rem',
                    }}>
                        Today's Market Challenge 🏆
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                    }}>
                        Predict 5 stocks and win up to 500 coins
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                color: 'rgba(255,255,255,0.9)',
                            }}>
                                <Users size={16} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>1,247 playing</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                color: 'rgba(255,255,255,0.9)',
                            }}>
                                <Clock size={16} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>2h left</span>
                            </div>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ArrowRight size={18} color="white" />
                        </div>
                    </div>

                    <style>{`
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    `}</style>
                </div>

                {/* Daily Challenges */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #E5E7EB',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Target size={20} color="#8B5CF6" />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>
                                Daily Challenges
                            </h3>
                        </div>
                        <div style={{
                            padding: '0.25rem 0.625rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#92400E',
                        }}>
                            ⏰ 14h left
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {DAILY_CHALLENGES.map((challenge) => {
                            const isComplete = challenge.progress >= challenge.total;
                            const progressPercent = (challenge.progress / challenge.total) * 100;

                            return (
                                <div
                                    key={challenge.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        padding: '0.875rem',
                                        background: isComplete ? '#F0FDF4' : '#F9FAFB',
                                        borderRadius: '14px',
                                        border: isComplete ? '1px solid #86EFAC' : '1px solid transparent',
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: isComplete
                                            ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                                            : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        border: isComplete ? 'none' : '1px solid #E5E7EB',
                                    }}>
                                        {isComplete ? (
                                            <Check size={20} color="white" strokeWidth={3} />
                                        ) : (
                                            <span style={{ fontSize: '1.25rem' }}>{challenge.icon}</span>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: '#1F2937',
                                            marginBottom: '0.375rem',
                                        }}>
                                            {challenge.title}
                                        </div>
                                        {!isComplete && (
                                            <div style={{
                                                height: '6px',
                                                background: '#E5E7EB',
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
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.375rem 0.625rem',
                                        background: isComplete
                                            ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                                            : 'white',
                                        borderRadius: '999px',
                                        boxShadow: isComplete ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
                                        border: isComplete ? 'none' : '1px solid #E5E7EB',
                                    }}>
                                        {challenge.type === 'coins' ? (
                                            <span style={{ fontSize: '0.8rem' }}>🪙</span>
                                        ) : (
                                            <Zap size={12} color={isComplete ? 'white' : '#8B5CF6'} fill={isComplete ? 'white' : '#8B5CF6'} />
                                        )}
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: isComplete ? 'white' : (challenge.type === 'coins' ? '#92400E' : '#8B5CF6'),
                                        }}>
                                            {isComplete ? 'Claimed' : `+${challenge.reward}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Your Stats */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #E5E7EB',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                    }}>
                        <TrendingUp size={20} color="#8B5CF6" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>
                            Your Stats
                        </h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem',
                    }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem 0.5rem',
                            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                            borderRadius: '14px',
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#7C3AED',
                            }}>
                                {playerData.totalPicks}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                                Total Picks
                            </div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem 0.5rem',
                            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                            borderRadius: '14px',
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#059669',
                            }}>
                                {playerData.winRate}%
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                                Win Rate
                            </div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem 0.5rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            borderRadius: '14px',
                        }}>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#D97706',
                            }}>
                                #{playerData.rank}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                                Rank
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Showcase */}
                <AchievementShowcase
                    achievements={ACHIEVEMENTS}
                    unlockedIds={playerData.unlockedAchievements}
                    limit={6}
                />

                {/* Learn More Card */}
                <div
                    onClick={() => navigate('/player/learn')}
                    style={{
                        marginTop: '1.5rem',
                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                        borderRadius: '20px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        border: '2px solid #F59E0B',
                    }}
                >
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                    }}>
                        <span style={{ fontSize: '1.75rem' }}>📚</span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#92400E',
                            marginBottom: '0.25rem',
                        }}>
                            Continue Learning
                        </h4>
                        <p style={{
                            fontSize: '0.8rem',
                            color: '#B45309',
                        }}>
                            Complete your next lesson and earn 50 XP! 🎓
                        </p>
                    </div>
                    <ChevronRight size={20} color="#92400E" />
                </div>

            </div>
        </div>
    );
}
