import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Radio, BookOpen, Users, BarChart3, Briefcase, LineChart, Star, Target } from 'lucide-react';
import Chatbot from './Chatbot';
import { useMode } from '../context/ModeContext';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const { isPlayerMode, isInvestorMode, switchMode } = useMode();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleSidebarChange = (e) => setSidebarOpen(e.detail?.isOpen || false);
        window.addEventListener('sidebarStateChange', handleSidebarChange);
        return () => window.removeEventListener('sidebarStateChange', handleSidebarChange);
    }, []);

    const navItems = useMemo(() => {
        if (isPlayerMode) {
            return [
                { id: 'home', icon: Home, label: 'Home', path: '/player/home', color: '#8B5CF6' },
                { id: 'pick', icon: Target, label: 'Pick', path: '/player/pick', color: '#EC4899' },
                { id: 'live', icon: Radio, label: 'Live', path: '/player/live', color: '#EF4444' },
                { id: 'learn', icon: BookOpen, label: 'Learn', path: '/player/learn', color: '#F59E0B' },
                { id: 'social', icon: Users, label: 'Social', path: '/community', color: '#10B981' },
            ];
        } else {
            return [
                { id: 'home', icon: Home, label: 'Home', path: '/investor/home', color: '#0EA5E9' },
                { id: 'market', icon: BarChart3, label: 'Market', path: '/market', color: '#10B981' },
                { id: 'portfolio', icon: Briefcase, label: 'Portfolio', path: '/investor/portfolio', color: '#6366F1' },
                { id: 'watchlist', icon: Star, label: 'Watchlist', path: '/investor/watchlist', color: '#F59E0B' },
                { id: 'analysis', icon: LineChart, label: 'Analysis', path: '/investor/analysis', color: '#0EA5E9' },
            ];
        }
    }, [isPlayerMode]);

    const isPathActive = (itemPath) => {
        if (location.pathname === itemPath) return true;
        if (itemPath === '/player/home' && location.pathname === '/home' && isPlayerMode) return true;
        if (itemPath === '/investor/home' && location.pathname === '/home' && isInvestorMode) return true;
        return false;
    };

    const navBorder = isPlayerMode ? '#E9E5FF' : '#E2E8F0';

    useEffect(() => {
        if (mainRef.current) mainRef.current.scrollTop = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    if (location.pathname === '/') return <>{children}</>;

    return (
        <>
            <main
                ref={mainRef}
                className="animate-fade-in"
                style={{
                    flex: 1,
                    overflow: 'auto',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: 'calc(var(--nav-height) + 1rem)',
                    position: 'relative',
                    zIndex: 1,
                    background: 'var(--background)',
                }}
            >
                {children}
            </main>

            <Chatbot />

            <nav style={{
                position: 'fixed',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: 'calc(var(--max-width) - 2rem)',
                height: '68px',
                backgroundColor: 'white',
                borderRadius: '2rem',
                border: `2px solid ${navBorder}`,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                pointerEvents: sidebarOpen ? 'none' : 'auto',
                padding: '0 1rem',
                opacity: sidebarOpen ? 0 : 1,
                transition: 'opacity 0.3s ease',
                overflow: 'hidden'
            }}>
                {navItems.map((item) => {
                    const isActive = isPathActive(item.path);
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            style={{
                                background: isActive ? `${item.color}15` : 'transparent',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                color: isActive ? item.color : 'var(--text-muted)',
                                transition: 'all 0.3s',
                                position: 'relative',
                                padding: '0.5rem 0.6rem',
                                borderRadius: '1rem',
                                minWidth: 0,
                                flex: '1 1 0%',
                            }}
                        >
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    top: '4px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: item.color,
                                }} />
                            )}
                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                style={{
                                    filter: isActive ? `drop-shadow(0 2px 4px ${item.color}40)` : 'none',
                                    transition: 'all 0.3s'
                                }}
                            />
                            <span style={{
                                fontSize: '9px',
                                fontWeight: isActive ? 700 : 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div
                onClick={() => {
                    const newMode = isPlayerMode ? 'investor' : 'player';
                    switchMode(newMode);
                    navigate(isPlayerMode ? '/investor/home' : '/player/home');
                }}
                style={{
                    position: 'fixed',
                    bottom: 'calc(68px + 2rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: isPlayerMode
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                        : 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: isPlayerMode
                        ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                        : '0 4px 12px rgba(14, 165, 233, 0.3)',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    cursor: 'pointer',
                    opacity: sidebarOpen ? 0 : 1,
                    pointerEvents: sidebarOpen ? 'none' : 'auto',
                    transition: 'opacity 0.3s ease'
                }}>
                <span>{isPlayerMode ? '🎮' : '📈'}</span>
                <span>{isPlayerMode ? 'Player' : 'Investor'}</span>
            </div>
        </>
    );
}
