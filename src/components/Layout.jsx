import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Radio, Trophy, BookOpen, Users } from 'lucide-react';
import Chatbot from './Chatbot';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

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

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/home', color: '#10b981' },
    { id: 'pick', icon: TrendingUp, label: 'Pick', path: '/pick', color: '#06b6d4' },
    { id: 'live', icon: Radio, label: 'Live', path: '/live', color: '#ef4444' },
    { id: 'academy', icon: BookOpen, label: 'Academy', path: '/academy', color: '#f59e0b' },
    { id: 'community', icon: Users, label: 'Community', path: '/community', color: '#10b981' },
  ];

  if (location.pathname === '/') return <Outlet />;

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
          position: 'relative'
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
        border: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '0 0.5rem'
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
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
                padding: '0.75rem 1.25rem',
                borderRadius: '1.25rem',
                minWidth: '70px'
              }}
            >
              <item.icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                style={{
                  filter: isActive ? `drop-shadow(0 2px 4px ${item.color}40)` : 'none',
                  transition: 'all 0.3s'
                }}
              />
              <span style={{
                fontSize: '10px',
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
    </>
  );
}
