import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Radio, Trophy, BookOpen, Users, BarChart3, Briefcase, LineChart, Star, Target } from 'lucide-react';
import Chatbot from './Chatbot';
import { useMode } from '../context/ModeContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const { mode, isPlayerMode, isInvestorMode, currentMode } = useMode();

  // Scroll to top on every route change
  useEffect(() => {
    // Scroll the main container to top
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    // Also scroll window (for browsers that might use window scroll)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Also scroll document element
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Also scroll #root element (used on desktop)
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.scrollTop = 0;
    }
  }, [location.pathname]);

  // Get nav items based on mode
  const getNavItems = () => {
    if (isPlayerMode) {
      return [
        { id: 'home', icon: Home, label: 'Home', path: '/player/home', color: '#8B5CF6' },
        { id: 'pick', icon: Target, label: 'Pick', path: '/player/pick', color: '#EC4899' },
        { id: 'live', icon: Radio, label: 'Live', path: '/player/live', color: '#EF4444' },
        { id: 'learn', icon: BookOpen, label: 'Learn', path: '/player/learn', color: '#F59E0B' },
        { id: 'social', icon: Users, label: 'Social', path: '/community', color: '#10B981' },
      ];
    } else {
      // Investor Mode
      return [
        { id: 'home', icon: Home, label: 'Home', path: '/investor/home', color: '#0EA5E9' },
        { id: 'market', icon: BarChart3, label: 'Market', path: '/market', color: '#10B981' },
        { id: 'portfolio', icon: Briefcase, label: 'Portfolio', path: '/investor/portfolio', color: '#6366F1' },
        { id: 'watchlist', icon: Star, label: 'Watchlist', path: '/investor/watchlist', color: '#F59E0B' },
        { id: 'analysis', icon: LineChart, label: 'Analysis', path: '/investor/analysis', color: '#0EA5E9' },
      ];
    }
  };

  const navItems = getNavItems();

  // Check if current path matches or is a child of the nav item path
  const isPathActive = (itemPath) => {
    if (location.pathname === itemPath) return true;
    // For home paths, also check the root redirects
    if (itemPath === '/player/home' && location.pathname === '/home' && isPlayerMode) return true;
    if (itemPath === '/investor/home' && location.pathname === '/home' && isInvestorMode) return true;
    return false;
  };

  if (location.pathname === '/') return <Outlet />;

  // Get the accent colors based on mode
  const navBorder = isPlayerMode ? '#E9E5FF' : '#E2E8F0';
  const navShadow = isPlayerMode
    ? '0 10px 40px rgba(139, 92, 246, 0.12)'
    : '0 10px 40px rgba(14, 165, 233, 0.1)';

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
          background: 'var(--background)',
        }}
      >
        <Outlet />
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
        zIndex: 50,
        boxShadow: navShadow,
        padding: '0 0.5rem'
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
                padding: '0.75rem 1rem',
                borderRadius: '1.25rem',
                minWidth: '60px'
              }}
            >
              {/* Active indicator dot */}
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
                  boxShadow: `0 0 8px ${item.color}`,
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

      {/* Mode indicator pill */}
      <div style={{
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
        zIndex: 49,
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
      }}>
        <span>{isPlayerMode ? '🎮' : '📈'}</span>
        <span>{isPlayerMode ? 'Player' : 'Investor'}</span>
      </div>
    </>
  );
}
