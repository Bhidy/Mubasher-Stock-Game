import React, { useState, useContext, useEffect, useRef } from 'react';
import { Menu, X, Home, TrendingUp, Activity, Award, BookOpen, Users, LogOut, Trophy, Bot, Gift, Shield, Zap, BarChart3, Newspaper, Gamepad2, ChevronDown, ChevronUp, Check, MessageCircle, Sparkles, Globe, Settings, Bell, User, Briefcase, Target, PieChart, LineChart, AlertCircle, Calendar, FileText, Star, Wallet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { useMarket, MARKETS } from '../context/MarketContext';
import { useMode } from '../context/ModeContext';
import ModeSwitcher from './shared/ModeSwitcher';

// X Logo SVG Component for menu
const XLogoIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function BurgerMenu({ variant = 'default' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setShowChat, userProfile } = useContext(UserContext);
    const { market, selectMarket } = useMarket();
    const { mode, isPlayerMode, isInvestorMode, currentMode } = useMode();
    const dropdownRef = useRef(null);

    // Listen for openSidebar event (from Market Summary page)
    useEffect(() => {
        const handleOpenSidebar = () => setIsOpen(true);
        window.addEventListener('openSidebar', handleOpenSidebar);
        return () => window.removeEventListener('openSidebar', handleOpenSidebar);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMarketDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Dynamic menu items based on mode
    const getMenuItems = () => {
        const commonItems = [
            { icon: BarChart3, label: 'Market Summary', path: '/market' },
            { icon: Newspaper, label: 'News Feed', path: '/news-feed' },
            { icon: XLogoIcon, label: 'X Intelligence', path: '/x-community' },
            { icon: Bot, label: 'AI Assistant', action: () => setShowChat(true) },
        ];

        if (isPlayerMode) {
            return [
                { icon: Home, label: 'Home', path: '/player/home', highlight: true },
                ...commonItems,
                { divider: true, label: 'Game' },
                { icon: TrendingUp, label: 'Pick Stocks', path: '/player/pick' },
                { icon: Activity, label: 'Live Contest', path: '/player/live' },
                { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
                { icon: Target, label: 'Challenges', path: '/player/challenges' },
                { divider: true, label: 'Progress' },
                { icon: Star, label: 'Achievements', path: '/player/achievements' },
                { icon: Gift, label: 'Rewards', path: '/rewards' },
                { icon: Wallet, label: 'Coin Shop', path: '/player/shop' },
                { divider: true, label: 'Social' },
                { icon: Shield, label: 'Clans', path: '/clans' },
                { icon: Users, label: 'Community', path: '/community' },
                { icon: Gift, label: 'Invite Friends', path: '/invite' },
                { divider: true, label: 'Learn' },
                { icon: BookOpen, label: 'Academy', path: '/player/learn' },
                { divider: true, label: 'Account' },
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Bell, label: 'Notifications', path: '/notifications' },
                { icon: Settings, label: 'Settings', path: '/profile' },
            ];
        } else {
            // Investor Mode
            return [
                { icon: Home, label: 'Dashboard', path: '/investor/home', highlight: true },
                ...commonItems,
                { divider: true, label: 'Portfolio' },
                { icon: Briefcase, label: 'My Portfolio', path: '/investor/portfolio' },
                { icon: Star, label: 'Watchlist', path: '/investor/watchlist' },
                { icon: AlertCircle, label: 'Price Alerts', path: '/investor/alerts' },
                { divider: true, label: 'Analysis' },
                { icon: LineChart, label: 'Stock Screener', path: '/investor/screener' },
                { icon: PieChart, label: 'Technical Analysis', path: '/investor/analysis' },
                { icon: Calendar, label: 'Economic Calendar', path: '/investor/calendar' },
                { divider: true, label: 'Research' },
                { icon: FileText, label: 'Research Notes', path: '/investor/notes' },
                { icon: BookOpen, label: 'Education', path: '/academy' },
                { divider: true, label: 'Competition' },
                { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
                { divider: true, label: 'Account' },
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Bell, label: 'Notifications', path: '/notifications' },
                { icon: Settings, label: 'Settings', path: '/profile' },
            ];
        }
    };

    const menuItems = getMenuItems();

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleSelectMarket = (marketId) => {
        selectMarket(marketId);
        setMarketDropdownOpen(false);
        setTimeout(() => setIsOpen(false), 50);
    };

    // Get header gradient based on mode
    const getHeaderGradient = () => {
        if (isPlayerMode) {
            return 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)';
        }
        return 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #10B981 100%)';
    };

    const menuContent = isOpen && (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999998,
                    backdropFilter: 'blur(4px)',
                }}
                className="animate-fade-in"
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '320px',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                zIndex: 999999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 30px rgba(0,0,0,0.12)',
            }} className="animate-slide-in-left">

                {/* Header - Mode-aware gradient */}
                <div style={{
                    padding: '1.5rem',
                    paddingBottom: '1rem',
                    background: getHeaderGradient(),
                    position: 'relative',
                    zIndex: 20
                }}>
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                    {/* User Info & Close */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}>
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                                    {userProfile?.displayName || 'Welcome!'}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500 }}>
                                    Mohamed Bhidy
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '10px',
                                color: 'white',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mode Switcher */}
                    <div style={{ marginTop: '1.25rem', position: 'relative', zIndex: 25 }}>
                        <ModeSwitcher
                            onModeSwitch={(newMode) => {
                                setIsOpen(false);
                                navigate(newMode === 'player' ? '/player/home' : '/investor/home');
                            }}
                        />
                    </div>

                    {/* Market Dropdown */}
                    <div ref={dropdownRef} style={{ marginTop: '1rem', position: 'relative', zIndex: 30 }}>
                        <button
                            onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.625rem 0.875rem',
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: marketDropdownOpen ? '10px 10px 0 0' : '10px',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ fontSize: '1.125rem' }}>{market.flag}</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{market.name}</div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Selected Market</div>
                                </div>
                            </div>
                            <ChevronDown
                                size={16}
                                style={{
                                    transform: marketDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </button>

                        {/* Dropdown Options */}
                        {marketDropdownOpen && (
                            <div style={{
                                background: 'white',
                                borderRadius: '0 0 10px 10px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                overflow: 'hidden',
                                maxHeight: '240px',
                                overflowY: 'auto'
                            }} className="animate-fade-in">
                                {MARKETS.map((m, idx) => {
                                    const isActive = market.id === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => handleSelectMarket(m.id)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.75rem 0.875rem',
                                                background: isActive ? (isPlayerMode ? '#FAF5FF' : '#F0F9FF') : 'white',
                                                border: 'none',
                                                borderBottom: idx < MARKETS.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <span style={{ fontSize: '1.25rem' }}>{m.flag}</span>
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.85rem' }}>{m.name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{m.exchange || m.name}</div>
                                                </div>
                                            </div>
                                            {isActive && <Check size={16} color={isPlayerMode ? '#8B5CF6' : '#0EA5E9'} strokeWidth={3} />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Items - Scrollable */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.75rem',
                    scrollbarWidth: 'thin'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                        {menuItems.map((item, index) => {
                            // Divider
                            if (item.divider) {
                                return (
                                    <div key={`divider-${index}`} style={{
                                        padding: '0.75rem 0.75rem 0.375rem',
                                        marginTop: index > 0 ? '0.25rem' : 0,
                                    }}>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: '#94a3b8',
                                        }}>{item.label}</span>
                                    </div>
                                );
                            }

                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            const activeColor = isPlayerMode ? '#8B5CF6' : '#0EA5E9';
                            const activeBg = isPlayerMode
                                ? 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)'
                                : 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)';

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (item.action) {
                                            item.action();
                                            setIsOpen(false);
                                        } else {
                                            handleNavigate(item.path);
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.7rem 0.875rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: isActive ? activeBg : 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        width: '100%',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }
                                    }}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '20%',
                                            bottom: '20%',
                                            width: '3px',
                                            background: isPlayerMode
                                                ? 'linear-gradient(180deg, #8B5CF6, #EC4899)'
                                                : 'linear-gradient(180deg, #0EA5E9, #10B981)',
                                            borderRadius: '0 3px 3px 0'
                                        }} />
                                    )}

                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: isActive ? 'white' : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isActive ? `0 2px 6px ${activeColor}20` : 'none',
                                        transition: 'all 0.15s'
                                    }}>
                                        <Icon
                                            size={16}
                                            color={isActive ? activeColor : '#64748b'}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </div>
                                    <span style={{
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? (isPlayerMode ? '#7C3AED' : '#0284C7') : '#475569',
                                        fontSize: '0.875rem'
                                    }}>
                                        {item.label}
                                    </span>

                                    {/* Highlight badge for main home */}
                                    {item.highlight && (
                                        <div style={{
                                            marginLeft: 'auto',
                                            background: isPlayerMode
                                                ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                                                : 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            fontWeight: 700,
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '999px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.03em',
                                        }}>
                                            {isPlayerMode ? 'Play' : 'Pro'}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '0.875rem 1rem',
                    borderTop: '1px solid #e2e8f0',
                    background: '#f8fafc'
                }}>
                    <button
                        onClick={() => {
                            navigate('/');
                            setIsOpen(false);
                        }}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid #fecaca',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#dc2626',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                        }}
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '0.625rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            v3.1.1 • {isPlayerMode ? '🎮 Player' : '📈 Investor'} Mode
                        </span>
                    </div>
                </div>
            </div>
        </>
    );

    const buttonStyles = {
        default: {
            background: 'white',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '50%',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--text-primary)'
        },
        glass: {
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.5rem',
            borderRadius: '50%',
            backdropFilter: 'blur(4px)',
            color: 'white',
            boxShadow: 'none'
        }
    };

    const currentStyle = buttonStyles[variant] || buttonStyles.default;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    ...currentStyle,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Menu size={24} color={currentStyle.color} />
            </button>

            {menuContent}

            <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
}
