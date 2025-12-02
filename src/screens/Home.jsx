import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Clock, Trophy, TrendingUp, Zap, Star, Gift, Target, Award, Flame, BookOpen, Users, Info, X, Shield } from 'lucide-react';

import BurgerMenu from '../components/BurgerMenu';

export default function Home() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [showStreakInfo, setShowStreakInfo] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Tooltip component - matches streak info style
    const TooltipIcon = ({ id, content, title, icon, color = '#6b7280' }) => {
        const tooltipContent = activeTooltip === id && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1rem',
                backdropFilter: 'blur(8px)'
            }} onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(null);
            }}>
                <div className="animate-pulse-scale" style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '24px',
                    padding: '2rem',
                    maxWidth: '340px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    position: 'relative',
                    width: '100%',
                    border: '1px solid rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(12px)'
                }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setActiveTooltip(null)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0,0,0,0.05)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={18} color="#64748b" />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        {icon && <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>{icon}</div>}
                        {title && <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>{title}</h2>}
                        <div style={{
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            color: '#475569'
                        }}>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip(activeTooltip === id ? null : id);
                    }}
                    style={{
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Info size={16} color={color} />
                </div>
                {tooltipContent && ReactDOM.createPortal(tooltipContent, document.body)}
            </>
        );
    };

    return (
        <div className="flex-col" style={{
            padding: '1.5rem',
            gap: '1.5rem',
            paddingBottom: '6rem',
            minHeight: '100dvh',
            background: 'var(--bg-primary)'
        }}>

            {/* Header with Avatar */}
            <div className="flex-between animate-fade-in">
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '18px',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                        border: '3px solid white',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <p className="caption" style={{ marginBottom: '2px', color: 'var(--text-secondary)' }}>Welcome back,</p>
                        <h2 className="h3" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{user.name}</h2>
                    </div>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div className="coin-shine" style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <span style={{ fontSize: '1.25rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>🪙</span>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{user.coins}</span>
                        <TooltipIcon
                            id="coins"
                            title="Mubasher Coins"
                            icon="🪙"
                            content="Coins are earned by making successful stock picks, maintaining streaks, and completing challenges. Use them to unlock premium features and rewards!"
                            color="rgba(255,255,255,0.8)"
                        />
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* Streak Card */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(253, 230, 138, 0.8) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                position: 'relative',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px -5px rgba(245, 158, 11, 0.15)'
            }}>
                <div
                    onClick={() => setShowStreakInfo(true)}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.7
                    }}
                >
                    <Info size={16} color="#9a3412" />
                </div>
                <div className="flex-between">
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(234, 88, 12, 0.3))' }} className="streak-fire">🔥</div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ea580c', lineHeight: 1.1 }}>{user.streak} Day Streak!</div>
                            <p className="caption" style={{ color: '#9a3412', fontWeight: 600 }}>Keep it going! +10 bonus coins daily</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Today's Contest */}
            <Card className="animate-slide-up" style={{
                gap: '1rem',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(255,255,255,0.6)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '4px',
                    background: 'linear-gradient(90deg, #10b981, #34d399)'
                }} />

                <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge color="success" style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}>🔴 LIVE NOW</Badge>
                        <TooltipIcon
                            id="contest"
                            title="Daily Contest"
                            icon="🏆"
                            content="The daily contest runs from 9:00 AM to 4:00 PM. Pick 3 stocks before market close and compete with thousands of players for the prize pool!"
                        />
                    </div>
                    <div className="flex-center" style={{ gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} />
                        <span>Closes in 5h 23m</span>
                    </div>
                </div>

                <div>
                    <h1 className="h2" style={{ marginBottom: '0.5rem', fontSize: '2rem', letterSpacing: '-0.02em' }}>Today's Contest</h1>
                    <p className="body-sm" style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        Pick 3 stocks and compete for the daily prize pool of <span style={{ fontWeight: 800, color: 'var(--warning)' }}>10,000 coins</span>
                    </p>
                </div>

                <div style={{
                    background: 'rgba(241, 245, 249, 0.5)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'space-around',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <span className="caption" style={{ color: 'var(--text-secondary)' }}>Players</span>
                            <TooltipIcon
                                id="players"
                                title="Active Players"
                                icon="👥"
                                content="Total number of players competing in today's contest. The more players, the bigger the prize pool!"
                            />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>47,291</span>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }} />
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <span className="caption" style={{ color: 'var(--text-secondary)' }}>Prize Pool</span>
                            <TooltipIcon
                                id="prize"
                                title="Prize Pool"
                                icon="💰"
                                content="Total coins distributed to top performers. Top 100 players share the prize pool based on their ranking!"
                            />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>10K 🪙</span>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }} />
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <span className="caption" style={{ color: 'var(--text-secondary)' }}>Your Rank</span>
                            <TooltipIcon
                                id="rank"
                                title="Your Rank"
                                icon="📊"
                                content="Your current position in today's contest. Rankings update in real-time based on your stock picks' performance!"
                            />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>#{user.rank}</span>
                    </div>
                </div>

                {user.isLocked ? (
                    <Button variant="outline" onClick={() => navigate('/live')} style={{ width: '100%', justifyContent: 'center' }}>
                        View Live Status 📊
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/pick')} style={{ width: '100%', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)' }}>
                        Pick Your 3 Stocks 🎯
                    </Button>
                )}
            </Card>

            {/* Daily Challenge */}
            <Card
                className="animate-slide-up"
                onClick={() => alert('Daily Challenge accepted! 🎯\n\nPick a stock that gains +5% today to earn 100 coins!')}
                style={{
                    background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer'
                }}>
                <div className="flex-between">
                    <div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Target size={20} color="#2563eb" />
                            <h3 className="h3" style={{ fontSize: '1.125rem', color: '#1e40af' }}>Daily Challenge</h3>
                            <TooltipIcon
                                id="challenge"
                                title="Daily Challenge"
                                icon="🎯"
                                content="Complete daily challenges to earn bonus coins! Challenges reset every 24 hours at midnight."
                                color="#2563eb"
                            />
                        </div>
                        <p className="body-sm" style={{ color: '#1e40af' }}>Pick a stock that gains +5% today</p>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
                    }}>
                        +100 🪙
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card className="flex-col animate-slide-up" padding="1.25rem" style={{
                    background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(253, 230, 138, 0.6) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <TooltipIcon
                            id="bestrank"
                            title="Best Rank"
                            icon="👑"
                            content="Your highest ranking achieved in any daily contest. Keep improving to reach the top!"
                            color="#d97706"
                        />
                    </div>
                    <Trophy size={24} color="#d97706" style={{ marginBottom: '0.5rem' }} />
                    <span className="caption" style={{ color: '#92400e' }}>Best Rank</span>
                    <span className="h2" style={{ color: '#78350f' }}>#{Math.floor(user.rank * 0.8)}</span>
                </Card>

                <Card className="flex-col animate-slide-up" padding="1.25rem" style={{
                    background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.6) 0%, rgba(187, 247, 208, 0.6) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <TooltipIcon
                            id="winrate"
                            title="Win Rate"
                            icon="📈"
                            content="Percentage of contests where your picks outperformed the market average. Higher is better!"
                            color="#059669"
                        />
                    </div>
                    <Award size={24} color="#059669" style={{ marginBottom: '0.5rem' }} />
                    <span className="caption" style={{ color: '#065f46' }}>Win Rate</span>
                    <span className="h2" style={{ color: '#064e3b' }}>67%</span>
                </Card>
            </div>

            {/* Invite Friends Banner */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.4)'
            }} onClick={() => navigate('/invite')}>
                {/* Glass Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none'
                }} />

                <div className="flex-between" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <Gift size={24} color="white" />
                        </div>
                        <div>
                            <h3 className="h3" style={{ color: 'white', marginBottom: '0.25rem' }}>Get Free Coins!</h3>
                            <p style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: 500 }}>Invite friends & earn 500 coins each 🚀</p>
                        </div>
                    </div>
                    <div style={{
                        background: 'white',
                        color: '#6366f1',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        Invite
                    </div>
                </div>
            </Card>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.8) 0%, rgba(216, 180, 254, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/leaderboard')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="leaderboard"
                            title="Leaderboard"
                            icon="🏆"
                            content="View top players and see how you rank against the competition. Updated in real-time!"
                            color="#9333ea"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)'
                    }}>
                        <Trophy size={28} color="#9333ea" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#6b21a8' }}>Leaderboard</span>
                </Card>

                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(254, 202, 202, 0.8) 0%, rgba(252, 165, 165, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/clans')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="clans"
                            title="Clans"
                            icon="🛡️"
                            content="Join or create a clan with friends! Compete in weekly wars for massive prize pools and climb the clan leaderboard together!"
                            color="#dc2626"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                    }}>
                        <Shield size={28} color="#dc2626" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#991b1b' }}>Clans</span>
                </Card>

                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/rewards')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="rewards"
                            title="Rewards Shop"
                            icon="🎁"
                            content="Redeem your coins for exclusive rewards, premium features, and real prizes!"
                            color="#0891b2"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)'
                    }}>
                        <Star size={28} color="#06b6d4" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#075985' }}>Rewards</span>
                </Card>

                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(255, 228, 230, 0.8) 0%, rgba(253, 164, 175, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(225, 29, 72, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/academy')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="academy"
                            title="Academy"
                            icon="📚"
                            content="Learn stock market basics, trading strategies, and analysis techniques through interactive lessons!"
                            color="#e11d48"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)'
                    }}>
                        <BookOpen size={28} color="#e11d48" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#9f1239' }}>Academy</span>
                </Card>

                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.8) 0%, rgba(167, 243, 208, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/community')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="community"
                            title="Community"
                            icon="💬"
                            content="Connect with other players, share strategies, and discuss market trends in the community!"
                            color="#10b981"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}>
                        <Users size={28} color="#10b981" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#065f46' }}>Community</span>
                </Card>

                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(252, 211, 77, 0.8) 100%)',
                    position: 'relative',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => navigate('/spin')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon
                            id="spin"
                            title="Daily Spin"
                            icon="🎰"
                            content="Spin the wheel every day for a chance to win free coins, XP boosts, and mystery rewards!"
                            color="#d97706"
                        />
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }}>
                        <Zap size={28} color="#d97706" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#92400e' }}>Daily Spin</span>
                </Card>
            </div>

            {/* Streak Info Modal */}
            {showStreakInfo && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div className="animate-pulse-scale" style={{
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <button
                            onClick={() => setShowStreakInfo(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <X size={24} color="#64748b" />
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>🔥</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>Streak Rewards</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Keep your streak alive to earn bonus coins!</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.8)', borderRadius: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#475569' }}>3 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+10 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.8)', borderRadius: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#475569' }}>7 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+25 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.8)', borderRadius: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#475569' }}>14 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+50 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(249, 250, 251, 0.8)', borderRadius: '12px' }}>
                                <span style={{ fontWeight: 600, color: '#475569' }}>30 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+100 🪙</span>
                            </div>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                            Play at least once per day to maintain your streak!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
