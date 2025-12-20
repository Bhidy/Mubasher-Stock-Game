import React, { useContext, useState, useEffect } from 'react';
import SafePortal from '../components/shared/SafePortal';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useMarket } from '../context/MarketContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Clock, Trophy, TrendingUp, Zap, Star, Gift, Target, Award, Flame, BookOpen, Users, Info, X, Shield, ChevronLeft, ChevronRight, PieChart, Newspaper, Twitter, Check, Globe } from 'lucide-react';

import BurgerMenu from '../components/BurgerMenu';
import DailySpinModal from '../components/DailySpinModal';

const MARKET_CODES = {
    'SA': 'KSA', 'EG': 'EGY', 'US': 'USA', 'IN': 'IND', 'UK': 'GBR', 'CA': 'CAN', 'AU': 'AUS',
    'HK': 'HKG', 'DE': 'DEU', 'JP': 'JPN', 'AE': 'UAE', 'ZA': 'RSA', 'QA': 'QAT', 'FR': 'FRA',
    'CH': 'SUI', 'NL': 'NLD', 'ES': 'ESP', 'IT': 'ITA', 'BR': 'BRA', 'MX': 'MEX', 'KR': 'KOR',
    'TW': 'TWN', 'SG': 'SGP'
};

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const { market, selectMarket, MARKETS } = useMarket();
    const navigate = useNavigate();
    const [showStreakInfo, setShowStreakInfo] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [showDailySpin, setShowDailySpin] = useState(false);
    const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
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
                {tooltipContent && <SafePortal>{tooltipContent}</SafePortal>}
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
        <div className="flex-col" style={{ padding: '1rem', gap: '1rem', paddingBottom: '6rem' }}>

            {/* Header with Avatar & Coins */}
            <div className="flex-between animate-fade-in" style={{ marginBottom: '0.5rem' }}>
                <div className="flex-center" style={{ gap: '12px' }}>
                    <BurgerMenu />
                    <div
                        onClick={() => navigate('/rewards')}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            padding: '2px', // White border gap
                            background: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%'
                            }}
                        />
                    </div>
                    <div>
                        <p className="caption" style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2px' }}>Welcome back,</p>
                        <h2 className="h2" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{user.name}</h2>
                    </div>
                </div>

                <div className="flex-center" style={{ gap: '10px' }}>
                    {/* Market Selection Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
                            style={{
                                background: 'white',
                                padding: '6px 16px 6px 10px',
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                height: '42px',
                                minWidth: 'auto',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{market.flag}</span>
                            <span style={{ color: '#1f2937', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                {MARKET_CODES[market.id] || market.id}
                            </span>
                            <ChevronRight
                                size={16}
                                color="#94a3b8"
                                style={{
                                    transform: marketDropdownOpen ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.2s',
                                    marginLeft: 'auto'
                                }}
                            />
                        </div>

                        {/* Dropdown Menu */}
                        {marketDropdownOpen && (
                            <>
                                <div
                                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                                    onClick={() => setMarketDropdownOpen(false)}
                                />
                                <div className="animate-fade-in" style={{
                                    position: 'absolute',
                                    top: '110%',
                                    right: 0,
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    padding: '0.5rem',
                                    zIndex: 100,
                                    minWidth: '220px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Select Market</div>
                                    {MARKETS.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                selectMarket(m.id);
                                                setMarketDropdownOpen(false);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: 'none',
                                                background: market.id === m.id ? '#f0f9ff' : 'transparent',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'background 0.2s',
                                                marginBottom: '2px'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (market.id !== m.id) e.currentTarget.style.background = '#f8fafc';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (market.id !== m.id) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{m.flag}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: market.id === m.id ? '#0284c7' : '#1f2937' }}>{m.name}</span>
                                            {market.id === m.id && <Check size={16} color="#0284c7" style={{ marginLeft: 'auto' }} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Navigation Carousel */}
            <div className="animate-slide-up">
                <NavigationCarousel market={market} navigate={navigate} />
            </div>

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
                    <h1 className="h2" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Today's {market.name} Contest</h1>
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

                {
                    user.isLocked ? (
                        <Button variant="outline" onClick={() => navigate('/live')} style={{ marginTop: '1rem' }}>
                            View Live Status 📊
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/pick')} style={{ marginTop: '1rem' }}>
                            Pick Your 3 Stocks 🎯
                        </Button>
                    )
                }
            </Card>

            {/* Streak & Daily Challenge & Invite Carousel */}
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
                    marginTop: '0.5rem'
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

                <Card
                    className="flex-col animate-slide-up"
                    padding="1.25rem"
                    style={{
                        background: 'var(--gradient-gold)',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                    }}
                    onClick={() => navigate('/rewards')}
                >
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <TooltipIcon id="points" title="Stock Hero Points" icon="🪙" content="Use points to unlock rewards and climb the leaderboard!" />
                    </div>
                    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🪙</span>
                    <span className="caption" style={{ color: 'white', opacity: 0.9 }}>Points</span>
                    <span className="h2" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{user.coins.toLocaleString()}</span>
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
            {
                showStreakInfo && (
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
                )
            }

            {/* Daily Spin Modal */}
            <DailySpinModal isOpen={showDailySpin} onClose={handleCloseDailySpin} />
        </div>
    );
}
// Helper Component: Navigation Carousel
function NavigationCarousel({ market, navigate }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Market Themes (Matched with MarketSummary.jsx)
    const MARKET_THEMES = {
        'SA': 'linear-gradient(135deg, #0D85D8 0%, #0ea5e9 100%)',
        'EG': 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
        'US': 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
        'IN': 'linear-gradient(135deg, #ff6b35 0%, #f7c45f 100%)',
        'UK': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        'CA': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'AU': 'linear-gradient(135deg, #1e40af 0%, #60a5fa 100%)',
        'HK': 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
        'DE': 'linear-gradient(135deg, #000000 0%, #ffc107 100%)',
        'JP': 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', // Adjusted slightly for white text visibility
        'AE': 'linear-gradient(135deg, #00732f 0%, #ef4444 100%)',
        'ZA': 'linear-gradient(135deg, #007749 0%, #ffd700 100%)',
        'QA': 'linear-gradient(135deg, #8b1538 0%, #a02040 100%)', // Adjusted end color for text readability
    };

    const slides = [
        {
            id: 'market',
            title: `${market.name} Market Summary`,
            subtitle: 'View Global & Local Indices',
            icon: <span style={{ fontSize: '32px' }}>{market.flag}</span>,
            bg: MARKET_THEMES[market.id] || 'linear-gradient(135deg, #0D85D8 0%, #0ea5e9 100%)',
            onClick: () => navigate('/market')
        },
        {
            id: 'community',
            title: 'X Community',
            subtitle: 'Join the Conversation',
            icon: <Twitter size={24} color="white" />,
            bg: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            onClick: () => navigate('/x-community')
        },
        {
            id: 'news',
            title: 'News Feed',
            subtitle: 'Latest Market Updates',
            icon: <Newspaper size={24} color="white" />,
            bg: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)',
            onClick: () => navigate('/news-feed')
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <div style={{
                display: 'flex',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentIndex * 100}%)`
            }}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        onClick={slide.onClick}
                        style={{
                            minWidth: '100%',
                            background: slide.bg,
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.2)',
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {slide.icon}
                            </div>
                            <div>
                                <h3 className="h3" style={{ color: 'white', marginBottom: '0.125rem', fontSize: '1.125rem' }}>{slide.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{slide.subtitle}</p>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ChevronRight size={18} color="white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.375rem'
            }}>
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: idx === currentIndex ? '16px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: 'rgba(255,255,255,0.8)',
                            opacity: idx === currentIndex ? 1 : 0.4,
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
