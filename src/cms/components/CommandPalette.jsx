import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, User, FileText, Globe, BookOpen,
    Settings, LogOut, ArrowRight, Command
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { usePrices } from '../../context/PriceContext';
import { getAllUsers } from '../../services/userService';
import { getAllLessons, getAllChallenges } from '../cmsApi';

// ============================================================================
// COMMAND PALETTE COMPONENT
// ============================================================================

export default function CommandPalette({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { news } = useCMS();
    const { prices } = usePrices();
    const inputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch users only once when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getAllUsers(50);
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const newResults = [];

        // 1. Pages
        const pages = [
            { id: 'p1', type: 'Page', title: 'Dashboard', path: '/admin', icon: Globe },
            { id: 'p2', type: 'Page', title: 'News', path: '/admin/news', icon: FileText },
            { id: 'p3', type: 'Page', title: 'Global Markets', path: '/admin/global-markets', icon: Globe },
            { id: 'p4', type: 'Page', title: 'Users', path: '/admin/users', icon: User },
            { id: 'p5', type: 'Page', title: 'Settings', path: '/admin/settings', icon: Settings },
        ];
        pages.forEach(p => {
            if (p.title.toLowerCase().includes(query)) newResults.push(p);
        });

        // 2. Markets (Live Data)
        Object.values(prices).forEach(p => {
            if (
                p.symbol?.toLowerCase().includes(query) ||
                p.shortName?.toLowerCase().includes(query)
            ) {
                newResults.push({
                    id: `m_${p.symbol}`,
                    type: 'Market',
                    title: p.shortName || p.symbol,
                    subtitle: p.symbol,
                    path: `/admin/companyprofile?symbol=${p.symbol}`,
                    icon: Globe
                });
            }
            // Limit market results
            if (newResults.filter(r => r.type === 'Market').length > 5) return;
        });

        // 3. News
        news.forEach(n => {
            if (n.title.toLowerCase().includes(query)) {
                newResults.push({
                    id: `n_${n.id}`,
                    type: 'News',
                    title: n.title,
                    subtitle: n.category,
                    action: () => navigate(`/admin/news?action=edit&id=${n.id}`), // Or navigate to news
                    path: '/admin/news', // Fallback
                    icon: FileText
                });
            }
        });

        // 4. Users
        users.forEach(u => {
            if (
                u.displayName?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query)
            ) {
                newResults.push({
                    id: `u_${u.id}`,
                    type: 'User',
                    title: u.displayName || 'Unknown',
                    subtitle: u.email,
                    path: `/admin/users`, // In real app, would go to /admin/users/${u.id}
                    icon: User
                });
            }
        });

        setResults(newResults.slice(0, 10)); // Limit total results
        setSelectedIndex(0);

    }, [searchQuery, users, news, prices]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleSelect = (item) => {
        if (item.action) {
            item.action();
        } else if (item.path) {
            navigate(item.path);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '15vh'
        }} onClick={onClose}>
            <div style={{
                width: '600px',
                maxWidth: '90%',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'scaleIn 0.2s ease-out',
                display: 'flex',
                flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>

                {/* Input Area */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.25rem',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <Search size={22} color="#94a3b8" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for pages, stocks, users, news..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '1.1rem',
                            paddingLeft: '1rem',
                            color: '#1e293b'
                        }}
                    />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        background: '#f1f5f9',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px'
                    }}>
                        <span style={{ fontSize: '1rem' }}>␛</span> ESC
                    </div>
                </div>

                {/* Results List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
                    {results.length === 0 && searchQuery ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No results found for "{searchQuery}"
                        </div>
                    ) : results.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Type to search across the entire platform...
                        </div>
                    ) : (
                        results.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    gap: '1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: index === selectedIndex ? '#f1f5f9' : 'transparent',
                                    transition: 'background 0.1s'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: index === selectedIndex ? '#fff' : '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #e2e8f0',
                                    color: index === selectedIndex ? '#10b981' : '#64748b'
                                }}>
                                    <item.icon size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                                        {item.title}
                                    </div>
                                    {item.subtitle && (
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {item.subtitle}
                                        </div>
                                    )}
                                </div>
                                {item.type && (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        color: '#94a3b8',
                                        background: '#fff',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0',
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.type}
                                    </div>
                                )}
                                {index === selectedIndex && (
                                    <ArrowRight size={16} color="#94a3b8" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '0.75rem 1.25rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    fontSize: '0.75rem',
                    color: '#64748b'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <kbd style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.15rem 0.4rem', fontFamily: 'inherit' }}>↵</kbd>
                        to select
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <kbd style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.15rem 0.4rem', fontFamily: 'inherit' }}>↑↓</kbd>
                        to navigate
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        Smart Index Active
                    </div>
                </div>
            </div>
        </div>
    );
}
