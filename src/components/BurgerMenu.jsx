import React, { useState, useContext, useEffect, useRef } from 'react';
import { Menu, X, Home, TrendingUp, Activity, Award, BookOpen, Users, LogOut, Trophy, Bot, Gift, Shield, Zap, BarChart3, Newspaper, Gamepad2, ChevronDown, ChevronUp, Check, MessageCircle, Sparkles, Globe, Settings, Bell, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { useMarket, MARKETS } from '../context/MarketContext';

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

    // Flat menu items - no headers, clean list
    const menuItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: BarChart3, label: 'Market Summary', path: '/market' },
        { icon: Newspaper, label: 'News Feed', path: '/news-feed' },
        { icon: TrendingUp, label: 'Pick Stocks', path: '/pick' },
        { icon: Activity, label: 'Live Contest', path: '/live' },
        { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
        { icon: Users, label: 'Community', path: '/community' },
        { icon: XLogoIcon, label: 'X Intelligence', path: '/x-community' },
        { icon: Bot, label: 'AI Assistant', action: () => setShowChat(true) },
        { icon: BookOpen, label: 'Academy', path: '/academy' },
        { icon: Trophy, label: 'Rewards', path: '/rewards' },
        { icon: Shield, label: 'Clans', path: '/clans' },
        { icon: Gift, label: 'Invite Friends', path: '/invite' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleSelectMarket = (marketId) => {
        selectMarket(marketId);
        setMarketDropdownOpen(false);
        setIsOpen(false);
        navigate('/market');
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

                {/* Header - User Profile Style */}
                <div style={{
                    padding: '1.5rem',
                    paddingBottom: marketDropdownOpen ? '0.5rem' : '1.5rem',
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)',
                    position: 'relative',
                    zIndex: 20
                }}>
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

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
                                    Stock Game Player
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

                    {/* Market Dropdown - Premium Style */}
                    <div ref={dropdownRef} style={{ marginTop: '1.25rem', position: 'relative', zIndex: 30 }}>
                        <button
                            onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                borderRadius: marketDropdownOpen ? '12px 12px 0 0' : '12px',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>{market.flag}</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{market.name}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Selected Market</div>
                                </div>
                            </div>
                            <ChevronDown
                                size={18}
                                style={{
                                    transform: marketDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </button>

                        {/* Dropdown Options - Inline below the button */}
                        {marketDropdownOpen && (
                            <div style={{
                                background: 'white',
                                borderRadius: '0 0 12px 12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                overflow: 'hidden'
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
                                                padding: '0.875rem 1rem',
                                                background: isActive ? '#eff6ff' : 'white',
                                                border: 'none',
                                                borderBottom: idx < MARKETS.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{m.flag}</span>
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>{m.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{m.exchange || m.name}</div>
                                                </div>
                                            </div>
                                            {isActive && <Check size={18} color="#3b82f6" strokeWidth={3} />}
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
                    padding: '1rem',
                    scrollbarWidth: 'thin'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

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
                                        gap: '0.875rem',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: isActive ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'transparent',
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
                                            width: '4px',
                                            background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                                            borderRadius: '0 4px 4px 0'
                                        }} />
                                    )}

                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: isActive ? 'white' : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.15)' : 'none',
                                        transition: 'all 0.15s'
                                    }}>
                                        <Icon
                                            size={18}
                                            color={isActive ? '#3b82f6' : '#64748b'}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </div>
                                    <span style={{
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? '#1e40af' : '#475569',
                                        fontSize: '0.925rem'
                                    }}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.25rem',
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
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: '1px solid #fecaca',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#dc2626',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                        }}
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>v2.5.0 • Stock Game</span>
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
