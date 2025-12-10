import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Bell, Check, Trash2, Filter, TrendingUp, TrendingDown,
    Trophy, Gift, Newspaper, AlertCircle, Settings, ChevronRight, Zap, MessageSquare
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMode } from '../../context/ModeContext';

import { useCMS } from '../../context/CMSContext';
import { useToast } from '../../components/shared/Toast';
import Tooltip from '../../components/shared/Tooltip';

// Notification types
const NOTIFICATION_TYPES = {
    price_alert: { icon: TrendingUp, color: '#10B981', label: 'Price Alert' },
    achievement: { icon: Trophy, color: '#F59E0B', label: 'Achievement' },
    challenge: { icon: Zap, color: '#8B5CF6', label: 'Challenge' },
    reward: { icon: Gift, color: '#EC4899', label: 'Reward' },
    news: { icon: Newspaper, color: '#0EA5E9', label: 'News' },
    system: { icon: AlertCircle, color: '#64748B', label: 'System' },
    'in-app': { icon: MessageSquare, color: '#3B82F6', label: 'Message' },
};

// Mock notifications data
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'price_alert',
        title: 'AAPL Price Alert',
        message: 'Apple Inc. is up 3.5% today, reaching $195.20',
        time: '5 min ago',
        read: false,
    },
    // ... existing mocks kept for demo volume ...
];

export default function Notifications() {
    const navigate = useNavigate();
    const { mode, isPlayerMode } = useMode();
    const { notifications: cmsNotifications } = useCMS();
    const { showToast } = useToast();

    // Transform CMS notifications to local format
    const transformedCMS = (cmsNotifications || [])
        .filter(n => (n.type === 'in-app' || n.type === 'both') && n.status === 'sent')
        .map(n => ({
            id: n.id,
            type: 'system', // Use system icon for admin messages
            title: n.title,
            message: n.message,
            time: new Date(n.sentAt || n.createdAt).toLocaleDateString(),
            read: false, // Default to unread for now (persistence requires local storage or user object update)
            isCms: true
        }));

    const [notifications, setNotifications] = useState([...transformedCMS, ...MOCK_NOTIFICATIONS]);

    // Update local state when CMS updates (simple effects for demo)
    React.useEffect(() => {
        const mapped = (cmsNotifications || [])
            .filter(n => (n.type === 'in-app' || n.type === 'both') && n.status === 'sent')
            .map(n => ({
                id: n.id,
                type: 'system',
                title: n.title,
                message: n.message,
                time: new Date(n.sentAt || n.createdAt).toLocaleDateString(),
                read: false,
                isCms: true
            }));
        // Merge strategy: Keep existing modified state (e.g. read status) if IDs match
        setNotifications(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newItems = mapped.filter(m => !existingIds.has(m.id));
            if (newItems.length > 0) return [...newItems, ...prev];
            return prev;
        });
    }, [cmsNotifications]);

    const [filter, setFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'alerts') return n.type === 'price_alert';
        if (filter === 'activity') return n.type !== 'price_alert';
        return true;
    });

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read', 'success');
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast('Notification deleted', 'info');
    };

    const clearAll = () => {
        setNotifications([]);
        showToast('All notifications cleared', 'success');
    };

    const gradientColor = isPlayerMode
        ? 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)'
        : 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #10B981 100%)';

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            paddingBottom: '100px',
        }}>
            {/* Header */}
            <div style={{
                background: gradientColor,
                padding: '1rem 1rem 1.5rem 1rem',
                borderRadius: '0 0 24px 24px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.625rem',
                                cursor: 'pointer',
                            }}
                        >
                            <ArrowLeft size={20} color="white" />
                        </button>
                        <div>
                            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: 0 }}>
                                    {unreadCount} unread
                                </p>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => navigate('/profile')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            <Settings size={18} color="white" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '4px',
                    marginTop: '1rem',
                }}>
                    {['all', 'alerts', 'activity'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: filter === tab ? 'white' : 'transparent',
                                color: filter === tab ? (isPlayerMode ? '#7C3AED' : '#0EA5E9') : 'rgba(255,255,255,0.7)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                                boxShadow: filter === tab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            {filter === 'alerts' && !isPlayerMode && (
                <div style={{ padding: '0 1rem 0.5rem' }}>
                    <button
                        onClick={() => navigate('/investor/alerts')}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: '#0EA5E9',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Settings size={16} /> Manage Price Alerts
                    </button>
                </div>
            )}

            {notifications.length > 0 && filter !== 'alerts' && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                }}>
                    <button
                        onClick={markAllAsRead}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8B5CF6',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                    <button
                        onClick={clearAll}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#DC2626',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}
                    >
                        <Trash2 size={16} /> Clear all
                    </button>
                </div>
            )}

            {/* Notifications List */}
            <div style={{ padding: '0 1rem' }}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => {
                        const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
                        const Icon = typeConfig.icon;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                style={{
                                    display: 'flex',
                                    gap: '0.875rem',
                                    padding: '1rem',
                                    background: notification.read ? 'white' : '#F0F9FF',
                                    borderRadius: '14px',
                                    marginBottom: '0.75rem',
                                    cursor: 'pointer',
                                    border: notification.read ? '1px solid #E5E7EB' : '1px solid #0EA5E9',
                                    position: 'relative',
                                }}
                            >
                                {/* Unread indicator */}
                                {!notification.read && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#0EA5E9',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: `${typeConfig.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={22} color={typeConfig.color} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{
                                        fontSize: '0.95rem',
                                        fontWeight: notification.read ? 500 : 700,
                                        color: '#1F2937',
                                        margin: 0,
                                        marginBottom: '0.25rem',
                                    }}>
                                        {notification.title}
                                    </h4>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        color: '#6B7280',
                                        margin: 0,
                                        marginBottom: '0.375rem',
                                        lineHeight: 1.4,
                                    }}>
                                        {notification.message}
                                    </p>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: '#9CA3AF',
                                    }}>
                                        {notification.time}
                                    </span>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '0.25rem',
                                        cursor: 'pointer',
                                        opacity: 0.5,
                                    }}
                                >
                                    <Trash2 size={16} color="#9CA3AF" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <Bell size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#6B7280', marginBottom: '0.5rem' }}>No notifications</h3>
                        <p style={{ fontSize: '0.85rem' }}>You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
