import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Trophy, Award, ShoppingBag, Calendar,
    Users, Settings, ChevronRight, TrendingUp, Activity, LogOut,
    Menu, X, Bell, Search, Plus, Newspaper, Megaphone, Smartphone, Monitor
} from 'lucide-react';
import { isAuthenticated, logout, getAuthUser } from './AdminLogin';

const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { divider: true, label: 'Content' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, path: '/admin/lessons' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, path: '/admin/challenges' },
    { id: 'achievements', label: 'Achievements', icon: Award, path: '/admin/achievements' },
    { id: 'shop', label: 'Shop Items', icon: ShoppingBag, path: '/admin/shop' },
    { divider: true, label: 'Publishing' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/admin/news' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    { divider: true, label: 'System' },
    { id: 'contests', label: 'Contests', icon: Calendar, path: '/admin/contests' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobilePreview, setMobilePreview] = useState(false);

    // Check authentication on mount and route changes
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/admin/login');
        }
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
    if (!isAuthenticated()) {
        return null;
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#F1F5F9',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            width: '100vw',
            overflow: 'auto',
        }}>
            {/* Sidebar - Always visible on desktop */}
            <aside style={{
                width: sidebarOpen ? '260px' : '80px',
                background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                transition: 'width 0.3s ease',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                }}>
                    {sidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                            }}>
                                🎮
                            </div>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
                                Admin CMS
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            color: 'white',
                        }}
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
                    {SIDEBAR_ITEMS.map((item, index) => {
                        if (item.divider) {
                            return sidebarOpen ? (
                                <div key={`divider-${index}`} style={{
                                    padding: '1rem 0.75rem 0.5rem',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    {item.label}
                                </div>
                            ) : <div key={`divider-${index}`} style={{ height: '1rem' }} />;
                        }

                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: sidebarOpen ? '0.75rem 1rem' : '0.75rem',
                                    marginBottom: '0.25rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: isActive
                                        ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                                        : 'transparent',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                }}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && (
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Mobile Preview Toggle */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={() => setMobilePreview(!mobilePreview)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: mobilePreview ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: mobilePreview ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        }}
                    >
                        {mobilePreview ? <Smartphone size={18} /> : <Monitor size={18} />}
                        {sidebarOpen && <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{mobilePreview ? 'Mobile Preview' : 'Desktop View'}</span>}
                    </button>
                </div>

                {/* Logout */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.8)',
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
                marginLeft: sidebarOpen ? '260px' : '80px',
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}>
                {/* Top Bar */}
                <header style={{
                    background: 'white',
                    padding: '1rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #E2E8F0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: '#1E293B',
                        }}>
                            {getCurrentSection()}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Search */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.625rem 1rem',
                            background: '#F1F5F9',
                            borderRadius: '10px',
                            minWidth: '280px',
                        }}>
                            <Search size={18} color="#64748B" />
                            <input
                                type="text"
                                placeholder="Search content..."
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    color: '#1E293B',
                                    width: '100%',
                                }}
                            />
                        </div>

                        {/* Notifications */}
                        <button style={{
                            position: 'relative',
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}>
                            <Bell size={20} color="#64748B" />
                            <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                background: '#EF4444',
                                borderRadius: '50%',
                            }} />
                        </button>

                        {/* Profile */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1rem 0.5rem 0.5rem',
                            background: '#F1F5F9',
                            borderRadius: '10px',
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                            }}>
                                A
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>Admin</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Super Admin</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - Desktop or Mobile Preview */}
                <div style={{
                    flex: 1,
                    padding: mobilePreview ? '2rem' : '2rem',
                    display: 'flex',
                    justifyContent: mobilePreview ? 'center' : 'flex-start',
                    background: mobilePreview ? '#1E293B' : '#F1F5F9',
                    overflowY: 'auto',
                    paddingBottom: '3rem',
                }}>
                    {mobilePreview ? (
                        <div style={{
                            width: '390px',
                            height: '844px',
                            background: 'white',
                            borderRadius: '40px',
                            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
                            overflow: 'hidden',
                            border: '8px solid #1F2937',
                            position: 'relative',
                        }}>
                            {/* Phone notch */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '150px',
                                height: '30px',
                                background: '#1F2937',
                                borderRadius: '0 0 20px 20px',
                                zIndex: 10,
                            }} />
                            <div style={{
                                height: '100%',
                                overflow: 'auto',
                                paddingTop: '30px',
                            }}>
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div style={{ width: '100%', maxWidth: '1400px' }}>
                            {children}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
