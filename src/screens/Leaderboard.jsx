import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import Card from '../components/Card';
import { Trophy, ChevronUp, ChevronDown, Crown, Medal } from 'lucide-react';

import BurgerMenu from '../components/BurgerMenu';

export default function Leaderboard() {
    const { user } = useContext(UserContext);
    const [period, setPeriod] = useState('Today');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const top3Data = {
        Today: [
            { rank: 2, name: 'Saad Al-Harbi', gain: 4.8, avatar: '💎', color: '#94a3b8' },
            { rank: 1, name: 'Yasser Al-Qahtani', gain: 5.4, avatar: '👑', color: '#f59e0b' },
            { rank: 3, name: 'Majed Abdullah', gain: 4.2, avatar: '🚀', color: '#cd7f32' },
        ],
        Yesterday: [
            { rank: 2, name: 'Fahad Al-Saud', gain: 12.5, avatar: '🦁', color: '#94a3b8' },
            { rank: 1, name: 'Ahmed Ali', gain: 15.2, avatar: '🐺', color: '#f59e0b' },
            { rank: 3, name: 'Omar Khalid', gain: 10.8, avatar: '🐂', color: '#cd7f32' },
        ]
    };

    const top3 = top3Data[period];

    const saudiNames = [
        'Faisal', 'Noura', 'Salem', 'Abdullah', 'Khalid',
        'Mohammed', 'Sara', 'Fatima', 'Sultan', 'Bandar',
        'Turki', 'Hassan', 'Ali', 'Ibrahim', 'Yousef',
        'Huda', 'Layla', 'Maha', 'Reem', 'Zaid'
    ];

    const list = Array.from({ length: 20 }, (_, i) => ({
        rank: i + 4,
        name: saudiNames[i % saudiNames.length],
        gain: (period === 'Today' ? 4.0 - i * 0.1 : 8.5 - i * 0.2).toFixed(1),
        trend: (i + (period === 'Today' ? 0 : 1)) % 3 === 0 ? 'up' : 'down',
        avatar: ['🎯', '⭐', '🔥', '💪', '🎮'][i % 5]
    }));

    return (
        <div className="flex-col" style={{ minHeight: '100vh', paddingBottom: '100px' }}>

            {/* Header */}
            <div style={{
                padding: '1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'linear-gradient(180deg, #f8fafc 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderBottom: '2px solid #e2e8f0'
            }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h2 className="h2" style={{ fontSize: '2rem', margin: 0 }}>
                        🏆 Global Rankings
                    </h2>
                    <BurgerMenu />
                </div>
                <div style={{
                    background: '#f1f5f9',
                    padding: '0.375rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    border: '2px solid #e2e8f0'
                }}>
                    {['Today', 'Yesterday'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{
                                flex: 1,
                                padding: '0.625rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                background: period === p ? 'white' : 'transparent',
                                color: period === p ? 'var(--primary)' : 'var(--text-secondary)',
                                boxShadow: period === p ? 'var(--shadow-md)' : 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Podium */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '2rem 1rem',
                background: 'linear-gradient(180deg, #fef3c7 0%, #f8fafc 100%)'
            }}>
                {top3.map((player) => (
                    <div key={player.rank} className="flex-col flex-center animate-slide-up" style={{
                        width: '30%',
                        animationDelay: `${player.rank * 0.1}s`
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: player.rank === 1 ? '72px' : '56px',
                            height: player.rank === 1 ? '72px' : '56px',
                            borderRadius: '50%',
                            background: player.rank === 1 ? 'var(--gradient-gold)' : `linear-gradient(135deg, ${player.color} 0%, white 100%)`,
                            border: `4px solid ${player.color}`,
                            boxShadow: `0 8px 24px ${player.color}40`,
                            marginBottom: '-16px',
                            zIndex: 2,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: player.rank === 1 ? '2rem' : '1.5rem'
                        }}>
                            {player.avatar}
                        </div>

                        {/* Podium */}
                        <div style={{
                            width: '100%',
                            height: player.rank === 1 ? '180px' : player.rank === 2 ? '150px' : '130px',
                            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                            background: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: '28px',
                            border: `2px solid ${player.color}`,
                            borderBottom: 'none',
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                            position: 'relative'
                        }}>
                            {/* Rank Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '-14px',
                                background: player.color,
                                color: 'white',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.875rem',
                                boxShadow: `0 2px 8px ${player.color}60`
                            }}>
                                {player.rank}
                            </div>

                            <span style={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                marginBottom: '0.375rem',
                                marginTop: '0.5rem',
                                textAlign: 'center'
                            }}>
                                {player.name}
                            </span>
                            <span style={{
                                color: 'var(--success)',
                                fontWeight: 800,
                                fontSize: '1.125rem'
                            }}>
                                +{player.gain}%
                            </span>

                            {/* Large Rank Number */}
                            <div style={{
                                marginTop: 'auto',
                                marginBottom: '1rem',
                                fontSize: '3.5rem',
                                fontWeight: 900,
                                color: `${player.color}20`,
                                lineHeight: 1
                            }}>
                                {player.rank}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="flex-col" style={{ padding: '0 1rem 1rem', gap: '0.75rem' }}>
                {list.map((player, index) => (
                    <Card key={player.rank} className="animate-slide-up" style={{
                        padding: '1rem 1.25rem',
                        animationDelay: `${index * 0.03}s`
                    }}>
                        <div className="flex-between">
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {player.rank}
                                </div>
                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>{player.avatar}</span>
                                    <span style={{ fontWeight: 600 }}>{player.name}</span>
                                </div>
                            </div>
                            <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1rem' }}>
                                    +{player.gain}%
                                </span>
                                {player.trend === 'up' ?
                                    <div className="flex-center" style={{ gap: '0.25rem', color: 'var(--success)', fontSize: '0.75rem' }}>
                                        <ChevronUp size={12} /> Rising
                                    </div> :
                                    <div className="flex-center" style={{ gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        <ChevronDown size={12} /> Falling
                                    </div>
                                }
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* User Position */}
            <div style={{
                position: 'fixed',
                bottom: 'calc(var(--nav-height) + 1rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: 'calc(var(--max-width) - 2rem)',
                background: 'var(--gradient-primary)',
                padding: '1.25rem',
                zIndex: 20,
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)'
            }}>
                <div className="flex-between">
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: 'var(--primary)',
                            overflow: 'hidden'
                        }}>
                            <img src={user.avatar} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="flex-col">
                            <div className="flex-center" style={{ gap: '0.5rem' }}>
                                <span style={{ fontWeight: 800, color: 'white', fontSize: '1.125rem' }}>You</span>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'white'
                                }}>
                                    #{user.rank}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Top 8% • Keep climbing!</span>
                        </div>
                    </div>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', marginRight: '3.5rem' }}>
                        +{user.gain}%
                    </span>
                </div>
            </div>
        </div>
    );
}
