import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Menu, X, Home, TrendingUp, Activity, Award, BookOpen, Users, LogOut, Trophy, Bot, Gift, Shield, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

export default function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setShowChat } = useContext(UserContext);

    const menuItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: TrendingUp, label: 'Pick Stocks', path: '/pick' },
        { icon: Activity, label: 'Live Contest', path: '/live' },
        { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
        { icon: Trophy, label: 'Rewards & Shop', path: '/rewards' },
        { icon: Bot, label: 'Mubasher AI', action: () => setShowChat(true) },
        { icon: BookOpen, label: 'Academy', path: '/academy' },
        { icon: Users, label: 'Community', path: '/community' },
        { icon: Shield, label: 'Clans', path: '/clans' },
        { icon: Gift, label: 'Invite Friends', path: '/invite' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
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
                boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
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
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={index}
                                className="flex-center"
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-lg)',
                                    background: isActive ? 'var(--bg-secondary)' : 'transparent',
                                    cursor: 'pointer',
                                    gap: '1rem',
                                    justifyContent: 'flex-start',
                                    transition: 'background 0.2s'
                                }}
                                onClick={() => {
                                    if (item.action) {
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

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Menu size={24} color="var(--text-primary)" />
            </button>

            {/* Render menu using Portal to escape stacking context */}
            {menuContent && ReactDOM.createPortal(menuContent, document.body)}
        </>
    );
}
