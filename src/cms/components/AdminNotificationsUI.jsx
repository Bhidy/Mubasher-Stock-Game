import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import {
    Bell, Check, X, Info, AlertTriangle, CheckCircle, Smartphone,
    Bot, Database, Terminal, ChevronRight, Clock, Trash2, Filter
} from 'lucide-react';

// Icon mapper
const getIcon = (type) => {
    switch (type) {
        case 'ai': return <Bot size={18} color="#8B5CF6" />;
        case 'success': return <CheckCircle size={18} color="#10B981" />;
        case 'warning': return <AlertTriangle size={18} color="#F59E0B" />;
        case 'error': return <X size={18} color="#EF4444" />;
        case 'system': return <Terminal size={18} color="#64748B" />;
        default: return <Info size={18} color="#3B82F6" />;
    }
};

// 1. The Bell Trigger
export const NotificationBell = () => {
    const { unreadCount } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none'
                }}
            >
                <Bell size={20} color={isOpen ? '#10B981' : '#64748B'} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px', right: '-5px',
                        background: '#EF4444', color: 'white',
                        fontSize: '0.65rem', fontWeight: 700,
                        minWidth: '18px', height: '18px',
                        borderRadius: '9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white',
                        animation: 'pulse 2s infinite'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            <style>{`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>

            {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
        </div>
    );
};

// 2. The Panel (Dropdown)
const NotificationPanel = ({ onClose }) => {
    const { notifications, markAllAsRead, clearAll, markAsRead } = useNotification();
    const [filter, setFilter] = useState('all'); // all, ai, system, alerts
    const [selectedItem, setSelectedItem] = useState(null);

    const filtered = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'ai') return n.type === 'ai';
        if (filter === 'alerts') return n.type === 'warning' || n.type === 'error';
        return true;
    });

    return (
        <>
            <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: -10,
                width: '380px',
                maxHeight: '80vh',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>Notifications</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={markAllAsRead} title="Mark all read" style={{ padding: '6px', cursor: 'pointer', background: 'none', border: 'none', color: '#64748B' }}>
                            <CheckCircle size={16} />
                        </button>
                        <button onClick={clearAll} title="Clear all" style={{ padding: '6px', cursor: 'pointer', background: 'none', border: 'none', color: '#EF4444' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', padding: '0.5rem 1rem', gap: '0.5rem', borderBottom: '1px solid #F1F5F9', overflowX: 'auto' }}>
                    {['all', 'ai', 'alerts'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '4px 10px',
                                borderRadius: '20px',
                                border: 'none',
                                background: filter === f ? '#F1F5F9' : 'transparent',
                                color: filter === f ? '#1E293B' : '#94A3B8',
                                fontSize: '0.75rem', fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                            <Bell size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        filtered.map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => { markAsRead(notif.id); setSelectedItem(notif); }}
                                style={{
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: notif.read ? 'transparent' : '#F8FAFC',
                                    borderLeft: notif.read ? '3px solid transparent' : `3px solid ${notif.type === 'error' ? '#EF4444' : '#10B981'}`,
                                    marginBottom: '4px',
                                    display: 'flex', gap: '1rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                                onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'transparent' : '#F8FAFC'}
                            >
                                <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{notif.title}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>{notif.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </div>

            {/* Modal Inspector */}
            {selectedItem && (
                <NotificationModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </>
    );
};

// 3. The Inspector Modal
const NotificationModal = ({ item, onClose }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div style={{
                width: '100%', maxWidth: '500px',
                background: 'white', borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        padding: '12px', borderRadius: '16px',
                        background: '#F1F5F9', display: 'flex'
                    }}>
                        {getIcon(item.type)}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{item.title}</h2>
                        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            {new Date(item.timestamp).toLocaleString()}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#94A3B8" />
                    </button>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, color: '#334155', fontSize: '1rem', lineHeight: '1.6' }}>
                        {item.message}
                    </p>
                </div>

                {item.metadata && (
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Event Payload</h4>
                        <div style={{
                            background: '#1E293B', borderRadius: '12px', padding: '1rem',
                            color: '#10B981', fontFamily: 'monospace', fontSize: '0.8rem',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: 0 }}>{JSON.stringify(item.metadata, null, 2)}</pre>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{
                        padding: '0.75rem 2rem', background: '#1E293B', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Close
                    </button>
                </div>
            </div>
            <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
    );
};
