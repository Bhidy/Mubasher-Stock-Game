import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Menu, X, Home, TrendingUp, Activity, Award, BookOpen, Users, LogOut, Trophy, Bot, Gift, Shield, Zap, BarChart3, Newspaper, Gamepad2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

// X Logo SVG Component for menu
const XLogoIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function BurgerMenu({ variant = 'default' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState(null); // Default closed
    const navigate = useNavigate();
    const location = useLocation();
    const { setShowChat } = useContext(UserContext);

    const menuItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: BarChart3, label: 'Market Summary', path: '/market' },
        { icon: Newspaper, label: 'News Feed', path: '/news-feed' },
        { icon: XLogoIcon, label: 'X Community', path: '/x-community', highlight: true },
        {
            icon: Gamepad2,
            label: 'Play & Win',
            subItems: [
                { icon: TrendingUp, label: 'Pick Stocks', path: '/pick' },
                { icon: Activity, label: 'Live Contest', path: '/live' },
                { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
                { icon: Trophy, label: 'Rewards & Shop', path: '/rewards' },
                { icon: Shield, label: 'Clans', path: '/clans' },
            ]
        },
        { icon: Bot, label: 'Mubasher AI', action: () => setShowChat(true) },
        { icon: BookOpen, label: 'Academy', path: '/academy' },
        { icon: Users, label: 'Community', path: '/community' },
        { icon: Gift, label: 'Invite Friends', path: '/invite' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const toggleExpand = (label) => {
        setExpanded(expanded === label ? null : label);
    };

    const menuContent = isOpen && (
        <>
            <div
                onClick={() => setIsOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999998,
                    backdropFilter: 'blur(4px)'
                }}
                className="animate-fade-in"
            />

            {/* Menu Drawer */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '280px',
                background: 'white',
                zIndex: 999999,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
                overflowY: 'auto'
            }} className="animate-slide-in-right">
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <h2 className="h3">Menu</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-col" style={{ gap: '0.5rem' }}>
                    {menuItems.map((item, index) => {
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const isExpanded = expanded === item.label;
                        const isActive = location.pathname === item.path || (hasSubItems && item.subItems.some(sub => location.pathname === sub.path));

                        return (
                            <React.Fragment key={index}>
                                <div
                                    className="flex-center"
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-lg)',
                                        background: isActive && !hasSubItems ? 'var(--bg-secondary)' : 'transparent',
                                        cursor: 'pointer',
                                        gap: '1rem',
                                        justifyContent: 'space-between',
                                        transition: 'background 0.2s'
                                    }}
                                    onClick={() => {
                                        if (hasSubItems) {
                                            toggleExpand(item.label);
                                        } else if (item.action) {
                                            item.action();
                                            setIsOpen(false);
                                        } else {
                                            handleNavigate(item.path);
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.background = '#f8fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <item.icon
                                            size={20}
                                            color={isActive ? 'var(--primary)' : 'var(--text-secondary)'}
                                        />
                                        <span style={{
                                            fontWeight: isActive ? 700 : 600,
                                            color: isActive ? 'var(--primary)' : 'var(--text-primary)'
                                        }}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {hasSubItems && (
                                        isExpanded ?
                                            <ChevronUp size={16} color="#94a3b8" /> :
                                            <ChevronDown size={16} color="#94a3b8" />
                                    )}
                                </div>

                                {/* Sub Menu */}
                                {hasSubItems && isExpanded && (
                                    <div className="flex-col animate-fade-in" style={{ paddingLeft: '1rem', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                        {item.subItems.map((sub, j) => {
                                            const isSubActive = location.pathname === sub.path;
                                            return (
                                                <div
                                                    key={j}
                                                    onClick={() => handleNavigate(sub.path)}
                                                    className="flex-center"
                                                    style={{
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: 'var(--radius-lg)',
                                                        background: isSubActive ? 'var(--bg-secondary)' : 'transparent',
                                                        cursor: 'pointer',
                                                        gap: '1rem',
                                                        justifyContent: 'flex-start'
                                                    }}
                                                >
                                                    <sub.icon size={18} color={isSubActive ? 'var(--primary)' : '#94a3b8'} />
                                                    <span style={{
                                                        fontWeight: isSubActive ? 600 : 500,
                                                        color: isSubActive ? 'var(--primary)' : '#64748b',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {sub.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Logout */}
                <div
                    className="flex-center"
                    style={{
                        marginTop: 'auto',
                        padding: '1rem',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        gap: '1rem',
                        justifyContent: 'flex-start',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '1.5rem'
                    }}
                    onClick={() => {
                        navigate('/');
                        setIsOpen(false);
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogOut size={20} color="var(--danger)" />
                    <span style={{ fontWeight: 600, color: 'var(--danger)' }}>Log Out</span>
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


            {/* Render menu using Portal to escape stacking context */}
            {menuContent && ReactDOM.createPortal(menuContent, document.body)}
        </>
    );
}
