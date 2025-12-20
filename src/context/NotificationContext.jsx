import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // Initialize from localStorage or empty
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('cms_notifications');
        return saved ? JSON.parse(saved) : [];
    });

    const [unreadCount, setUnreadCount] = useState(0);

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem('cms_notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Add a new notification
    // type: 'success' | 'warning' | 'error' | 'info' | 'ai'
    const addNotification = (type, title, message, metadata = null) => {
        const newNotif = {
            id: crypto.randomUUID(),
            type,
            title,
            message,
            metadata,
            timestamp: Date.now(),
            read: false
        };
        // Add to top, keep max 50
        setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
