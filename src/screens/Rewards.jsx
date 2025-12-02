import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Trophy, Target, Zap, Lock, ShoppingBag, Star, Award, TrendingUp, Info, X } from 'lucide-react';
import mubasherInfoPlusLogo from '../assets/mubasher-info-plus-logo.png';

export default function Rewards() {
    const { user } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState('achievements');
    const [showStreakInfo, setShowStreakInfo] = useState(false);

    const badges = [
        { id: 1, name: 'Sniper', desc: 'Top 1% gain in a day', icon: Target, unlocked: true, color: '#10b981', rarity: 'epic' },
        { id: 2, name: 'Hot Start', desc: 'Win your first contest', icon: Zap, unlocked: true, color: '#f59e0b', rarity: 'common' },
        { id: 3, name: 'Diamond Hands', desc: 'Hold volatile stock to +10%', icon: Lock, unlocked: false, color: '#94a3b8', rarity: 'rare' },
        { id: 4, name: 'Moon Shot', desc: 'Pick a stock that gains +20%', icon: Trophy, unlocked: false, color: '#94a3b8', rarity: 'legendary' },
        { id: 5, name: 'Streak Master', desc: '7-day win streak', icon: Award, unlocked: false, color: '#94a3b8', rarity: 'epic' },
        { id: 6, name: 'Market Guru', desc: 'Reach level 10', icon: Star, unlocked: false, color: '#94a3b8', rarity: 'rare' },
    ];

    const rewards = [
        { id: 1, name: 'Mubasher Info Plus Subscription', cost: 5000, image: mubasherInfoPlusLogo, type: 'subscription' },
        { id: 2, name: 'TradingView Analysis Subscription', cost: 2000, image: 'https://logo.clearbit.com/tradingview.com', type: 'feature' },
        { id: 3, name: 'No Ads (1 Month)', cost: 1500, icon: Zap, type: 'feature', color: '#f59e0b' },
        { id: 4, name: 'Exclusive Avatar Frame', cost: 1000, icon: Star, type: 'cosmetic', color: '#06b6d4' }
    ];

    const xpProgress = 70; // 70%

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Profile Header */}
            <Card className="animate-fade-in" style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)',
                border: '2px solid var(--primary)'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '30px',
                    background: 'var(--gradient-primary)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: 900,
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                    border: '4px solid white',
                    overflow: 'hidden'
                }}>
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2 className="h2" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{user.name}</h2>
                <div className="flex-center" style={{ gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Badge color="primary">Level {user.level}</Badge>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{user.levelTitle}</span>
                </div>

                {/* XP Progress */}
                <div>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span className="caption" style={{ fontWeight: 700 }}>LEVEL PROGRESS</span>
                        <span className="caption" style={{ fontWeight: 700, color: 'var(--primary)' }}>{xpProgress}%</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        border: '2px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <div style={{
                            width: `${xpProgress}%`,
                            height: '100%',
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease',
                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                        }} />
                    </div>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span className="caption">1,450 XP</span>
                        <span className="caption">2,000 XP</span>
                    </div>
                </div>
            </Card>

            {/* Stats Summary */}
            <div className="animate-slide-up">
                <h3 className="h3" style={{ marginBottom: '1rem' }}>Today's Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <Card style={{
                        padding: '1.25rem 0.75rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        border: '2px solid #fde68a'
                    }}>
                        <Trophy size={24} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
                        <span className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>Rank</span>
                        <span className="h3" style={{ color: '#92400e' }}>#{user.rank}</span>
                    </Card>

                    <Card style={{
                        padding: '1.25rem 0.75rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                        border: '2px solid #bbf7d0'
                    }}>
                        <div style={{ fontSize: '1.5rem', margin: '0 auto 0.5rem' }}>🪙</div>
                        <span className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>Coins</span>
                        <span className="h3" style={{ color: '#065f46' }}>+50</span>
                    </Card>

                    <Card style={{
                        padding: '1.25rem 0.75rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                        border: '2px solid #fdba74',
                        position: 'relative'
                    }}>
                        <div
                            onClick={() => setShowStreakInfo(true)}
                            style={{
                                position: 'absolute',
                                top: '0.25rem',
                                right: '0.25rem',
                                cursor: 'pointer',
                                padding: '4px',
                                opacity: 0.7
                            }}
                        >
                            <Info size={14} color="#9a3412" />
                        </div>
                        <div style={{ fontSize: '1.5rem', margin: '0 auto 0.5rem' }} className="streak-fire">🔥</div>
                        <span className="caption" style={{ display: 'block', marginBottom: '0.25rem' }}>Streak</span>
                        <span className="h3" style={{ color: '#9a3412' }}>{user.streak}</span>
                    </Card>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '0.25rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.5rem'
            }}>
                {['Achievements', 'Redeem'].map(tab => {
                    const key = tab.toLowerCase();
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                background: isActive ? 'white' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: 700,
                                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab === 'Redeem' ? 'Redeem Shop' : tab}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'achievements' ? (
                <div className="animate-slide-up">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 className="h3">Achievements</h3>
                        <span className="caption" style={{ fontWeight: 700 }}>
                            {badges.filter(b => b.unlocked).length}/{badges.length} Unlocked
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {badges.map((badge, index) => (
                            <Card key={badge.id} className="flex-col animate-slide-up" style={{
                                gap: '1rem',
                                textAlign: 'center',
                                opacity: badge.unlocked ? 1 : 0.6,
                                background: badge.unlocked
                                    ? 'linear-gradient(135deg, white 0%, #f8fafc 100%)'
                                    : '#f8fafc',
                                border: badge.unlocked ? `2px solid ${badge.color}` : '2px dashed #e2e8f0',
                                padding: '1.5rem 1rem',
                                animationDelay: `${index * 0.1}s`
                            }}>


                                <div style={{
                                    padding: '1.25rem',
                                    borderRadius: '50%',
                                    background: badge.unlocked ? `${badge.color}15` : '#e2e8f0',
                                    margin: '0 auto',
                                    boxShadow: badge.unlocked ? `0 4px 16px ${badge.color}30` : 'none'
                                }} className={badge.unlocked ? 'badge-glow' : ''}>
                                    <badge.icon
                                        size={32}
                                        color={badge.unlocked ? badge.color : '#94a3b8'}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                                        {badge.name}
                                    </h4>
                                    <p className="caption" style={{ lineHeight: 1.4 }}>{badge.desc}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-slide-up">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 className="h3">Redeem Your Coins</h3>
                        <div style={{
                            background: '#fef3c7',
                            padding: '0.375rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            color: '#b45309',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}>
                            Balance: {user.coins} 🪙
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {rewards.map((reward, index) => (
                            <Card key={reward.id} className="flex-col animate-slide-up" style={{
                                gap: '1rem',
                                padding: '1.5rem 1rem',
                                animationDelay: `${index * 0.1}s`,
                                border: '2px solid #e2e8f0'
                            }}>
                                <div style={{
                                    height: '64px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    {reward.image ? (
                                        <img src={reward.image} alt={reward.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                    ) : (
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: `${reward.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <reward.icon size={32} color={reward.color} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9375rem', minHeight: '42px' }}>
                                        {reward.name}
                                    </h4>
                                    <button style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        borderRadius: 'var(--radius-full)',
                                        border: 'none',
                                        background: user.coins >= reward.cost ? 'var(--primary)' : '#e2e8f0',
                                        color: user.coins >= reward.cost ? 'white' : '#94a3b8',
                                        fontWeight: 700,
                                        cursor: user.coins >= reward.cost ? 'pointer' : 'not-allowed',
                                        fontSize: '0.875rem'
                                    }} onClick={() => user.coins >= reward.cost && alert(`Redeemed ${reward.name}!`)}>
                                        {reward.cost} 🪙
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {/* Streak Info Modal */}
            {showStreakInfo && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(4px)'
                }} onClick={() => setShowStreakInfo(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="animate-slide-up"
                        style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: 'var(--radius-xl)',
                            maxWidth: '320px',
                            textAlign: 'center',
                            position: 'relative',
                            boxShadow: 'var(--shadow-xl)'
                        }}
                    >
                        <button
                            onClick={() => setShowStreakInfo(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: '#ffedd5',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            color: '#ea580c'
                        }}>
                            <div style={{ fontSize: '2rem' }}>🔥</div>
                        </div>
                        <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Daily Streak</h3>
                        <p className="body" style={{ color: 'var(--text-secondary)' }}>
                            Open the app every day to keep your streak going and claim extra daily rewards.
                        </p>
                        <button
                            onClick={() => setShowStreakInfo(false)}
                            style={{
                                marginTop: '1.5rem',
                                width: '100%',
                                padding: '0.875rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
