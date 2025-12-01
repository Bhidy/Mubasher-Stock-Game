import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Card from '../components/Card';
import Button from '../components/Button';
import { Clock, TrendingUp, TrendingDown, ChevronRight, Activity, Zap } from 'lucide-react';

import BurgerMenu from '../components/BurgerMenu';

export default function Live() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const picks = user.picks.length > 0 ? user.picks : [
        { id: 1, ticker: '2222', name: 'Saudi Aramco', price: 32.50, change: 1.2 },
        { id: 2, ticker: '1120', name: 'Al Rajhi Bank', price: 88.20, change: 0.8 },
        { id: 3, ticker: '2010', name: 'SABIC', price: 78.90, change: -1.5 },
    ];

    const topPlayers = [
        { rank: 1, name: 'StockMaster', gain: 5.4, avatar: '👑' },
        { rank: 2, name: 'DiamondHands', gain: 4.8, avatar: '💎' },
        { rank: 3, name: 'MoonShot', gain: 4.2, avatar: '🚀' },
        { rank: 4, name: 'RocketMan', gain: 3.9, avatar: '⭐' },
        { rank: 5, name: 'HODLer', gain: 3.7, avatar: '🎯' },
    ];

    const totalGain = picks.reduce((sum, stock) => sum + stock.change, 0) / picks.length;

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Live Header */}
            <div className="flex-between animate-fade-in">
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    <div className="animate-pulse-scale" style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--danger)',
                        boxShadow: '0 0 12px var(--danger)'
                    }} />
                    <span style={{
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'var(--danger)',
                        fontSize: '0.875rem'
                    }}>
                        LIVE CONTEST
                    </span>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div style={{
                        background: '#fee2e2',
                        padding: '0.375rem 0.875rem',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        border: '1.5px solid #fecaca'
                    }}>
                        <Clock size={14} color="var(--danger)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>Ends in 2h 15m</span>
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* Performance Hero */}
            <Card className="animate-slide-up" style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                background: totalGain >= 0
                    ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                    : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: totalGain >= 0 ? '3px solid var(--success)' : '3px solid var(--danger)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p className="caption" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>YOUR PERFORMANCE</p>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 900,
                        color: totalGain >= 0 ? 'var(--success)' : 'var(--danger)',
                        marginBottom: '1rem',
                        lineHeight: 1,
                        textShadow: totalGain >= 0
                            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                            : '0 4px 12px rgba(239, 68, 68, 0.2)'
                    }}>
                        {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)}%
                    </h1>
                    <div style={{
                        background: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        marginBottom: '1rem'
                    }}>
                        <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Rank #{user.rank}</span>
                        <div style={{
                            background: '#dcfce7',
                            color: 'var(--success)',
                            padding: '0.25rem 0.625rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            border: '1px solid #bbf7d0'
                        }}>
                            ↑ 35
                        </div>
                    </div>
                    <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                        <Activity size={14} color="var(--text-muted)" />
                        <p className="caption">47,291 players competing</p>
                    </div>
                </div>
            </Card>

            {/* Your Picks */}
            <div className="animate-slide-up">
                <h3 className="h3" style={{ marginBottom: '1rem' }}>Your Deck Performance</h3>
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {picks.map((stock, index) => (
                        <Card key={stock.id} style={{
                            padding: '1.25rem',
                            background: stock.change >= 0
                                ? 'linear-gradient(90deg, white 0%, #dcfce7 100%)'
                                : 'linear-gradient(90deg, white 0%, #fee2e2 100%)',
                            borderLeft: `5px solid ${stock.change >= 0 ? 'var(--success)' : 'var(--danger)'}`,
                            position: 'relative'
                        }}>
                            {index === 0 && stock.change > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0.75rem',
                                    right: '0.75rem',
                                    background: '#fef3c7',
                                    color: '#f59e0b',
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.625rem',
                                    fontWeight: 700,
                                    border: '1px solid #fde68a'
                                }}>
                                    💰 BEST PICK
                                </div>
                            )}
                            <div className="flex-between">
                                <div className="flex-center" style={{ gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: stock.change >= 0 ? '#dcfce7' : '#fee2e2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.875rem',
                                        color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)',
                                        border: `2px solid ${stock.change >= 0 ? '#bbf7d0' : '#fecaca'}`
                                    }}>
                                        {stock.ticker.slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="h3" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{stock.ticker}</h3>
                                        <p className="caption">{stock.name}</p>
                                    </div>
                                </div>
                                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                    <span style={{
                                        color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)',
                                        fontWeight: 800,
                                        fontSize: '1.5rem',
                                        lineHeight: 1
                                    }}>
                                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Live Leaderboard */}
            <div className="animate-slide-up">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h3 className="h3">Top Players Right Now</h3>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        View All <ChevronRight size={16} />
                    </button>
                </div>
                <Card style={{ padding: '0', overflow: 'hidden' }}>
                    {topPlayers.map((player, i) => (
                        <div key={i} className="flex-between" style={{
                            padding: '1rem 1.25rem',
                            borderBottom: i < topPlayers.length - 1 ? '1px solid #f1f5f9' : 'none',
                            background: i === 0 ? 'linear-gradient(90deg, #fef3c7 0%, white 100%)' : 'white'
                        }}>
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: i === 0 ? 'var(--gradient-gold)' : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.125rem',
                                    fontWeight: 800,
                                    color: i === 0 ? 'white' : 'var(--text-secondary)'
                                }}>
                                    {i === 0 ? player.avatar : player.rank}
                                </div>
                                <span style={{ fontWeight: 600 }}>{player.name}</span>
                            </div>
                            <span style={{
                                color: 'var(--success)',
                                fontWeight: 700,
                                fontSize: '1rem'
                            }}>
                                +{player.gain}%
                            </span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
