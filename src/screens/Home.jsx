import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Clock, Trophy, TrendingUp, Zap, Star, Gift, Target, Award, Flame, BookOpen, Users, Info, X, Shield, ChevronLeft, ChevronRight, PieChart } from 'lucide-react';

import BurgerMenu from '../components/BurgerMenu';
import DailySpinModal from '../components/DailySpinModal';

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [showStreakInfo, setShowStreakInfo] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [showDailySpin, setShowDailySpin] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Auto-slide carousel every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCloseDailySpin = () => {
        setShowDailySpin(false);
        setUser({ ...user, hasSeenDailySpin: true });
    };

    // Tooltip component
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
                backdropFilter: 'blur(4px)'
            }} onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(null);
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    maxWidth: '320px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative',
                    width: '100%'
                }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setActiveTooltip(null)}
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
                        <X size={24} />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        {icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>}
                        {title && <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>{title}</h2>}
                        <div style={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.6,
                            color: '#4b5563'
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
                        opacity: 0.7,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Info size={16} color={color} />
                </div>
                {tooltipContent && ReactDOM.createPortal(tooltipContent, document.body)}
            </>
        );
    };

    // Blue Cola color scheme
    const blueColor = '#0D85D8';
    const blueLight = '#3DA5F0';
    const blueDark = '#0A6DB8';

    // Carousel slides data
    const carouselSlides = [
        {
            id: 'spin',
            icon: '🎰',
            title: 'Spin & Win',
            subtitle: 'Daily chance for free rewards!',
            action: 'Spin Now',
            bgGradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            borderColor: 'transparent',
            titleColor: 'white',
            subtitleColor: 'rgba(255,255,255,0.9)',
            isDark: true
        },
        {
            id: 'streak',
            icon: '🔥',
            title: `${user.streak} Day Streak!`,
            subtitle: 'Keep it going! +10 bonus coins daily',
            bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
            borderColor: '#f59e0b',
            titleColor: '#ea580c',
            subtitleColor: '#9a3412'
        },
        {
            id: 'challenge',
            icon: '🎯',
            title: 'Daily Challenge',
            subtitle: 'Pick a stock that gains +5% today',
            reward: '+100 🪙',
            bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            borderColor: '#0D85D8',
            titleColor: '#0D85D8',
            subtitleColor: '#1e40af'
        },
        {
            id: 'invite',
            icon: <Gift size={32} color="white" />,
            title: 'Get Free Coins!',
            subtitle: 'Invite friends & earn 500 coins each 🚀',
            action: 'Invite',
            bgGradient: `linear-gradient(135deg, ${blueColor} 0%, ${blueLight} 50%, ${blueDark} 100%)`,
            borderColor: 'transparent',
            titleColor: 'white',
            subtitleColor: 'rgba(255,255,255,0.9)',
            isDark: true
        }
    ];

    const handleSlideClick = (slideId) => {
        if (slideId === 'spin') setShowDailySpin(true);
        if (slideId === 'streak') setShowStreakInfo(true);
        if (slideId === 'invite') navigate('/invite');
    };

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header with Avatar */}
            <div className="flex-between animate-fade-in">
                <div
                    className="flex-center"
                    style={{ gap: '1rem', cursor: 'pointer' }}
                    onClick={() => navigate('/rewards')}
                >
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        border: '3px solid white',
                        overflow: 'hidden'
                    }}>
                        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <p className="caption" style={{ marginBottom: '2px' }}>Welcome back,</p>
                        <h2 className="h3" style={{ fontSize: '1.25rem' }}>{user.name}</h2>
                    </div>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div
                        className="coin-shine"
                        onClick={() => navigate('/rewards')}
                        style={{
                            background: 'var(--gradient-gold)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '1.25rem' }}>🪙</span>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>{user.coins}</span>
                        <TooltipIcon
                            id="coins"
                            title="Mubasher Coins"
                            icon="🪙"
                            content="Coins are earned by making successful stock picks, maintaining streaks, and completing challenges. Use them to unlock premium features and rewards!"
                        />
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* Market Summary Entry - MOVED TO TOP */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #0D85D8 0%, #0ea5e9 100%)',
                color: 'white',
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(13, 133, 216, 0.3)'
            }} onClick={() => navigate('/market')}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.3
                }} />

                <div className="flex-between" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex-col" style={{ gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '0.5rem',
                                borderRadius: '12px',
                                display: 'flex',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <PieChart size={20} color="white" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Market Summary</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, paddingLeft: '0.25rem' }}>
                            Global indices, sectors & top movers
                        </p>
                    </div>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <ChevronRight size={20} color="white" />
                    </div>
                </div>
            </Card>

            {/* Today's Contest */}
            <Card className="card-gradient animate-slide-up" style={{
                gap: '1rem',
                background: 'white',
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)',
                border: '2px solid #d1fae5'
            }}>
                <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge color="success">🔴 LIVE NOW</Badge>
                        <TooltipIcon
                            id="contest"
                            title="Daily Contest"
                            icon="🏆"
                            content="The daily contest runs from 9:00 AM to 4:00 PM. Pick 3 stocks before market close and compete with thousands of players for the prize pool!"
                        />
                    </div>
                    <div className="flex-center" style={{ gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} />
                        <span>Closes in 5h 23m</span>
                    </div>
                </div>

                <div>
                    <h1 className="h2" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Today's Contest</h1>
                    <p className="body-sm" style={{ lineHeight: 1.6 }}>Pick 3 stocks and compete for the daily prize pool of <span style={{ fontWeight: 700, color: 'var(--warning)' }}>10,000 coins</span></p>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="caption">Players</span>
                            <TooltipIcon id="players" title="Active Players" icon="👥" content="Total number of players competing in today's contest." />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>47,291</span>
                    </div>
                    <div style={{ width: '1px', background: '#cbd5e1' }} />
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="caption">Prize Pool</span>
                            <TooltipIcon id="prize" title="Prize Pool" icon="💰" content="Total coins distributed to top performers!" />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning)' }}>10K 🪙</span>
                    </div>
                    <div style={{ width: '1px', background: '#cbd5e1' }} />
                    <div className="flex-col flex-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span className="caption">Your Rank</span>
                            <TooltipIcon id="rank" title="Your Rank" icon="📊" content="Your current position in today's contest." />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>#{user.rank}</span>
                    </div>
                </div>

                {user.isLocked ? (
                    <Button variant="outline" onClick={() => navigate('/live')} style={{ marginTop: '1rem' }}>
                        View Live Status 📊
                    </Button>
                ) : (
                    <Button onClick={() => navigate('/pick')} style={{ marginTop: '1rem' }}>
                        Pick Your 3 Stocks 🎯
                    </Button>
                )}
            </Card>

            {/* Streak & Daily Challenge & Invite Carousel - MOVED BELOW CONTEST */}
            <div className="animate-slide-up" style={{ position: 'relative' }}>
                <div style={{
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        display: 'flex',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(-${activeSlide * 100}%)`
                    }}>
                        {carouselSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                onClick={() => handleSlideClick(slide.id)}
                                style={{
                                    minWidth: '100%',
                                    background: slide.bgGradient,
                                    border: slide.borderColor !== 'transparent' ? `2px solid ${slide.borderColor}` : 'none',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1rem 1.25rem',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    height: '100px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                {/* Shine effects for Invite slide */}
                                {slide.id === 'invite' && (
                                    <>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '50%',
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                                            pointerEvents: 'none'
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '40px',
                                            width: '6px',
                                            height: '6px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 10px white',
                                            opacity: 0.7
                                        }} />
                                    </>
                                )}

                                {slide.id !== 'invite' && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (slide.id === 'streak') setShowStreakInfo(true);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            opacity: 0.7,
                                            zIndex: 2
                                        }}
                                    >
                                        <Info size={16} color={slide.subtitleColor} />
                                    </div>
                                )}

                                <div className="flex-between" style={{ position: 'relative', zIndex: 1 }}>
                                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                                        <div style={{
                                            fontSize: typeof slide.icon === 'string' ? '2rem' : 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }} className={slide.id === 'streak' ? 'streak-fire' : ''}>
                                            {slide.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: slide.titleColor, lineHeight: 1.2 }}>
                                                {slide.title}
                                            </div>
                                            <p className="caption" style={{ color: slide.subtitleColor, fontSize: '0.8rem', marginTop: '2px' }}>{slide.subtitle}</p>
                                        </div>
                                    </div>

                                    {slide.reward && (
                                        <div style={{
                                            background: `linear-gradient(135deg, ${blueColor} 0%, ${blueLight} 100%)`,
                                            color: 'white',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            boxShadow: `0 4px 12px ${blueColor}40`,
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {slide.reward}
                                        </div>
                                    )}

                                    {slide.action && (
                                        <div style={{
                                            background: 'white',
                                            color: blueColor,
                                            padding: '0.375rem 0.875rem',
                                            borderRadius: '999px',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}>
                                            {slide.action}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carousel Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.75rem'
                }}>
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            style={{
                                width: activeSlide === index ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '999px',
                                background: activeSlide === index
                                    ? `linear-gradient(90deg, ${blueColor}, ${blueLight})`
                                    : '#e2e8f0',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card className="flex-col animate-slide-up" padding="1.25rem" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <TooltipIcon id="bestrank" title="Best Rank" icon="👑" content="Your highest ranking achieved in any daily contest." />
                    </div>
                    <Trophy size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                    <span className="caption">Best Rank</span>
                    <span className="h2" style={{ color: '#92400e' }}>#{Math.floor(user.rank * 0.8)}</span>
                </Card>

                <Card className="flex-col animate-slide-up" padding="1.25rem" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <TooltipIcon id="winrate" title="Win Rate" icon="📈" content="Percentage of contests where your picks outperformed the market average." />
                    </div>
                    <Award size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                    <span className="caption">Win Rate</span>
                    <span className="h2" style={{ color: '#065f46' }}>67%</span>
                </Card>
            </div>



            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Card className="flex-col flex-center animate-slide-up" style={{
                    gap: '0.75rem',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)',
                    position: 'relative'
                }} onClick={() => navigate('/leaderboard')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon id="leaderboard" title="Leaderboard" icon="🏆" content="View top players and see how you rank!" />
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
                    background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
                    position: 'relative'
                }} onClick={() => navigate('/clans')}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <TooltipIcon id="clans" title="Clans" icon="🛡️" content="Join or create a clan with friends!" />
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
                    backdropFilter: 'blur(4px)'
                }} onClick={() => setShowStreakInfo(false)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
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
                            <X size={24} />
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🔥</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Streak Rewards</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Keep your streak alive to earn bonus coins!</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>3 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+10 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>7 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+25 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>14 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+50 🪙</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>30 Days</span>
                                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+100 🪙</span>
                            </div>
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
                            Play at least once per day to maintain your streak!
                        </p>
                    </div>
                </div>
            )}

            {/* Daily Spin Modal */}
            <DailySpinModal isOpen={showDailySpin} onClose={handleCloseDailySpin} />
        </div >
    );
}
