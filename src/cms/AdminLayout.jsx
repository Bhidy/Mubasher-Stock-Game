import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Trophy, Award, ShoppingBag, Calendar,
    Users, Settings, ChevronRight, TrendingUp, Activity, LogOut,
    Menu, X, Bell, Search, Plus, Newspaper, Megaphone, Smartphone, Monitor,
    Building2, Rss, Globe, Twitter, Star
} from 'lucide-react';
import { isAuthenticated, logout, getAuthUser } from './AdminLogin';

// Stock Market SVG Icon Component - Premium animated design
const HeroEcoIcon = ({ size = 40, animate = true }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
    >
        {/* Animated glow effect */}
        <defs>
            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Background circle with pulse animation */}
        <circle
            cx="24" cy="24" r="22"
            fill="url(#heroGradient)"
            filter="url(#glow)"
            style={animate ? { animation: 'pulse 2s ease-in-out infinite' } : {}}
        />

        {/* Candlestick chart lines */}
        <g stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none">
            {/* Rising candlestick 1 */}
            <line x1="14" y1="32" x2="14" y2="20" style={animate ? { animation: 'barGrow 1.5s ease-out 0.2s both' } : {}} />
            <rect x="12" y="22" width="4" height="6" rx="1" fill="white" style={animate ? { animation: 'fadeIn 0.5s ease-out 0.3s both' } : {}} />

            {/* Rising candlestick 2 (taller) */}
            <line x1="22" y1="34" x2="22" y2="16" style={animate ? { animation: 'barGrow 1.5s ease-out 0.4s both' } : {}} />
            <rect x="20" y="18" width="4" height="8" rx="1" fill="white" style={animate ? { animation: 'fadeIn 0.5s ease-out 0.5s both' } : {}} />

            {/* Rising candlestick 3 (tallest) */}
            <line x1="30" y1="36" x2="30" y2="12" style={animate ? { animation: 'barGrow 1.5s ease-out 0.6s both' } : {}} />
            <rect x="28" y="14" width="4" height="12" rx="1" fill="white" style={animate ? { animation: 'fadeIn 0.5s ease-out 0.7s both' } : {}} />
        </g>

        {/* Trend arrow */}
        <path
            d="M12 30 L22 22 L28 26 L36 14"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={animate ? {
                strokeDasharray: 50,
                strokeDashoffset: 50,
                animation: 'drawLine 1s ease-out 0.8s forwards'
            } : {}}
        />
        <path
            d="M32 14 L36 14 L36 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={animate ? { animation: 'fadeIn 0.3s ease-out 1.2s both' } : {}}
        />
    </svg>
);

const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { divider: true, label: 'Publishing' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/admin/news' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { divider: true, label: 'Live Preview' },
    { id: 'watchlist', label: 'Watchlist', icon: Star, path: '/admin/watchlist' },
    { id: 'newsfeed', label: 'News Feed', icon: Rss, path: '/admin/newsfeed' },
    { id: 'xcommunity', label: 'X Community', icon: Twitter, path: '/admin/x-community' },
    { id: 'globalmarkets', label: 'Global Markets', icon: Globe, path: '/admin/global-markets' },
    { id: 'aidashboard', label: 'AI Dashboard', icon: LayoutDashboard, path: '/admin/ai-dashboard' },
    { id: 'companyprofile', label: 'Company Profile', icon: Building2, path: '/admin/companyprofile' },
    { id: 'marketprofile', label: 'Market Profile', icon: Activity, path: '/admin/marketprofile' },
    { divider: true, label: 'Content' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, path: '/admin/lessons' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, path: '/admin/challenges' },
    { id: 'achievements', label: 'Achievements', icon: Award, path: '/admin/achievements' },
    { id: 'shop', label: 'Shop Items', icon: ShoppingBag, path: '/admin/shop' },
    { divider: true, label: 'System' },
    { id: 'contests', label: 'Contests', icon: Calendar, path: '/admin/contests' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

// CSS Animations for the entire admin panel
const globalAnimationStyles = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
    }
    @keyframes barGrow {
        from { transform: scaleY(0); transform-origin: bottom; }
        to { transform: scaleY(1); transform-origin: bottom; }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes drawLine {
        to { stroke-dashoffset: 0; }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
    }
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3), 0 0 10px rgba(16, 185, 129, 0.2); }
        50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5), 0 0 25px rgba(16, 185, 129, 0.3); }
    }
    .admin-card {
        animation: slideInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    .admin-card:nth-child(1) { animation-delay: 0.1s; }
    .admin-card:nth-child(2) { animation-delay: 0.15s; }
    .admin-card:nth-child(3) { animation-delay: 0.2s; }
    .admin-card:nth-child(4) { animation-delay: 0.25s; }
    .admin-card:nth-child(5) { animation-delay: 0.3s; }
    .admin-card:nth-child(6) { animation-delay: 0.35s; }
    .sidebar-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar-item:hover {
        transform: translateX(4px);
        background: rgba(16, 185, 129, 0.1) !important;
    }
    .hero-logo {
        animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
    }
    .content-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
    }
`;

import CommandPalette from './components/CommandPalette';
import { NotificationBell } from './components/AdminNotificationsUI';

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    // Keyboard shortcut for Command Palette (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Check authentication on mount and route changes
    // Check authentication on mount and route changes
    useEffect(() => {
        /*
        if (!isAuthenticated()) {
            navigate('/admin/login');
        }
        */
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const getCurrentSection = () => {
        const item = SIDEBAR_ITEMS.find(i => !i.divider && (location.pathname === i.path || location.pathname.startsWith(i.path + '/')));
        return item?.label || 'Dashboard';
    };

    // If not authenticated, don't render the layout
    /*
    if (!isAuthenticated()) {
        return null;
    }
    */

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#F1F5F9',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            width: '100vw',
            overflow: 'auto',
        }}>
            <style>{globalAnimationStyles}</style>

            {/* Sidebar - Always visible on desktop */}
            <aside style={{
                width: sidebarOpen ? '280px' : '80px',
                background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
                transition: 'width 0.3s ease',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                borderRight: '1px solid rgba(16, 185, 129, 0.1)',
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.5rem 1.25rem',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)',
                }}>
                    {sidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div className="hero-logo" style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                            }}>
                                <HeroEcoIcon size={40} animate={true} />
                            </div>
                            <div>
                                <span style={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    display: 'block',
                                    letterSpacing: '-0.02em'
                                }}>
                                    HERO
                                </span>
                                <span style={{
                                    color: '#10B981',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    Eco System
                                </span>
                                <span style={{
                                    color: 'white',
                                    fontWeight: 500,
                                    fontSize: '0.55rem',
                                    display: 'block',
                                    marginTop: '2px',
                                    opacity: 0.6
                                }}>
                                    Powered by Bhidy
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '10px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                            color: '#10B981',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
                    {SIDEBAR_ITEMS.map((item, index) => {
                        if (item.divider) {
                            return sidebarOpen ? (
                                <div key={`divider-${index}`} style={{
                                    padding: '1.25rem 0.75rem 0.5rem',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: '#10B981',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    opacity: 0.7,
                                }}>
                                    {item.label}
                                </div>
                            ) : <div key={`divider-${index}`} style={{ height: '1.25rem' }} />;
                        }

                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className="sidebar-item"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
                                    marginBottom: '0.375rem',
                                    borderRadius: '12px',
                                    border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                                        : 'transparent',
                                    color: isActive ? '#10B981' : 'rgba(255,255,255,0.6)',
                                    cursor: 'pointer',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    boxShadow: isActive ? '0 2px 10px rgba(16, 185, 129, 0.15)' : 'none',
                                }}
                            >
                                <item.icon size={20} style={{
                                    color: isActive ? '#10B981' : 'rgba(255,255,255,0.5)',
                                }} />
                                {sidebarOpen && (
                                    <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.875rem' }}>
                                        {item.label}
                                    </span>
                                )}
                                {isActive && sidebarOpen && (
                                    <div style={{
                                        marginLeft: 'auto',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#10B981',
                                        boxShadow: '0 0 8px #10B981',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <button
                        onClick={handleLogout}
                        className="sidebar-item"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            cursor: 'pointer',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        }}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content - Full desktop width */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? '280px' : '80px',
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}>
                {/* Top Bar */}
                <header style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E2E8F0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {getCurrentSection()}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Search Trigger */}
                        <div
                            onClick={() => setIsCommandOpen(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                background: 'white',
                                borderRadius: '12px',
                                minWidth: '300px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                            <Search size={18} color="#94A3B8" />
                            <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
                                Search anything... (Cmd + K)
                            </span>
                        </div>

                        {/* Notifications */}
                        <NotificationBell />

                        {/* Profile */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                            padding: '0.5rem 1.25rem 0.5rem 0.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            }}>
                                H
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>Hero Admin</div>
                                <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>Super Admin</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="content-fade-in" style={{
                    flex: 1,
                    padding: '2rem',
                    display: 'flex',
                    background: 'linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%)',
                    overflowY: 'auto',
                    paddingBottom: '3rem',
                }}>
                    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
                        {children}
                    </div>
                </div>
            </main>
            {/* Command Palette Overlay */}
            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </div>
    );
}
