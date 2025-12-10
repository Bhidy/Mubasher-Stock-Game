/**
 * CMS Context - Centralized state management for CMS data
 * Connects to /api/cms for persistent storage
 * Provides real-time sync between CMS admin and mobile frontend
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CMSContext = createContext(null);

// API base URL - uses relative path for same-origin requests
const API_BASE = '/api/cms';

export function CMSProvider({ children }) {
    // State for all CMS entities
    const [lessons, setLessons] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [shopItems, setShopItems] = useState([]);
    const [news, setNews] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [contests, setContests] = useState([]);
    const [users, setUsers] = useState([]); // Phase 2: CRM Users
    const [notifications, setNotifications] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API helper function
    const apiCall = useCallback(async (entity, method = 'GET', id = null, data = null) => {
        try {
            let url = `${API_BASE}?entity=${entity}`;
            if (id) url += `&id=${id}`;

            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API request failed');
            }

            return await response.json();
        } catch (err) {
            console.error(`CMS API Error (${entity}/${method}):`, err);
            throw err;
        }
    }, []);

    // Fallback mock data for development when API is unavailable
    const FALLBACK_DATA = {
        lessons: [
            { id: 'lesson-1', title: 'Introduction to Stocks', description: 'Learn what stocks are and why people invest in them', category: 'beginner', difficulty: 'easy', duration: 5, xpReward: 50, coinReward: 25, icon: '📈', isPublished: true, order: 1 },
            { id: 'lesson-2', title: 'Reading Stock Charts', description: 'Master the art of technical analysis', category: 'intermediate', difficulty: 'medium', duration: 10, xpReward: 100, coinReward: 50, icon: '📊', isPublished: true, order: 2 },
            { id: 'lesson-3', title: 'Market Orders vs Limit Orders', description: 'Understanding different order types', category: 'beginner', difficulty: 'easy', duration: 7, xpReward: 75, coinReward: 35, icon: '🎯', isPublished: true, order: 3 },
        ],
        challenges: [
            { id: 'chal-1', title: 'First Prediction', description: 'Make your first stock prediction', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'prediction_made', isActive: true },
            { id: 'chal-2', title: 'Hot Streak', description: 'Get 3 correct predictions in a row', type: 'weekly', icon: '🔥', coinReward: 200, xpReward: 100, targetValue: 3, triggerEvent: 'streak_achieved', isActive: true },
            { id: 'chal-3', title: 'Market Scholar', description: 'Complete 5 lessons this week', type: 'weekly', icon: '📚', coinReward: 150, xpReward: 75, targetValue: 5, triggerEvent: 'lesson_completed', isActive: true },
        ],
        achievements: [
            { id: 'ach-1', title: 'First Steps', description: 'Make your first prediction', icon: '👣', rarity: 'common', category: 'prediction', xpReward: 50, coinReward: 25, requirement: 1, requirementType: 'predictions_made' },
            { id: 'ach-2', title: 'Lucky Streak', description: 'Get 5 correct predictions in a row', icon: '🍀', rarity: 'rare', category: 'streak', xpReward: 200, coinReward: 100, requirement: 5, requirementType: 'consecutive_wins' },
            { id: 'ach-3', title: 'Market Master', description: 'Reach level 10', icon: '👑', rarity: 'epic', category: 'special', xpReward: 500, coinReward: 250, requirement: 10, requirementType: 'level_reached' },
        ],
        shopItems: [
            { id: 'shop-1', name: 'Golden Avatar', description: 'A prestigious golden frame', category: 'avatars', price: 500, rarity: 'rare', icon: '👤', isAvailable: true, discount: 0 },
            { id: 'shop-2', name: 'Pro Trader Badge', description: 'Show everyone you mean business', category: 'badges', price: 300, rarity: 'common', icon: '🏅', isAvailable: true, discount: 0 },
            { id: 'shop-3', name: 'Dark Theme', description: 'Easy on the eyes', category: 'themes', price: 200, rarity: 'common', icon: '🌙', isAvailable: true, discount: 10 },
        ],
        news: [
            { id: 'news-1', title: 'Markets Rally on Strong Earnings', summary: 'Major indices closed higher as tech giants beat expectations', content: 'The stock market closed significantly higher today...', source: 'Market Wire', category: 'Market Analysis', market: 'US', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString() },
            { id: 'news-2', title: 'Saudi Aramco Announces Dividend', summary: 'Oil giant declares quarterly dividend amid strong oil prices', content: 'Saudi Aramco announced its quarterly dividend...', source: 'Gulf Business', category: 'Company News', market: 'SA', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString() },
        ],
        announcements: [
            { id: 'ann-1', title: 'Welcome to Bhidy!', message: 'Start your trading journey with us. Make predictions, earn rewards, and learn about the markets!', type: 'info', priority: 'high', targetMode: 'all', buttonText: 'Get Started', buttonLink: '/player/home', isActive: true },
            { id: 'ann-2', title: 'Weekend Contest!', message: 'Join our special weekend prediction contest. Top 10 win exclusive prizes!', type: 'promo', priority: 'high', targetMode: 'player', buttonText: 'Join Now', buttonLink: '/player/live', isActive: true },
        ],
        contests: [
            { id: 'contest-1', name: 'Daily Challenge', description: 'Compete daily for top spot', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString(), prizePool: 1000, entryFee: 0, maxParticipants: 1000, isActive: true },
        ],
        users: [
            { id: 'u-1', name: 'Ahmed Ali', email: 'ahmed@example.com', avatar: '', netWorth: 54000, level: 12, status: 'active', joinDate: '2024-01-15' },
            { id: 'u-2', name: 'Sarah Jones', email: 'sarah@example.com', avatar: '', netWorth: 12500, level: 5, status: 'active', joinDate: '2024-03-10' },
            { id: 'u-3', name: 'M. Ibrahim', email: 'ibrahim@example.com', avatar: '', netWorth: 1500, level: 2, status: 'banned', joinDate: '2024-05-20' },
            { id: 'u-4', name: 'Stock Whale', email: 'whale@example.com', avatar: '', netWorth: 1200000, level: 50, status: 'active', joinDate: '2023-11-01' },
        ],
        notifications: [
            { id: 'not-1', title: 'Welcome', message: 'Welcome to the new notification system', type: 'in-app', target: 'all', status: 'sent', sentAt: new Date().toISOString() },
        ]
    };

    // Fetch all data on mount
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [
                    lessonsData,
                    challengesData,
                    achievementsData,
                    shopItemsData,
                    newsData,
                    announcementsData,
                    contestsData,
                    notificationsData,
                ] = await Promise.all([
                    apiCall('lessons'),
                    apiCall('challenges'),
                    apiCall('achievements'),
                    apiCall('shopItems'),
                    apiCall('news'),
                    apiCall('announcements'),
                    apiCall('contests'),
                    apiCall('notifications'),
                ]);

                setLessons(lessonsData);
                setChallenges(challengesData);
                setAchievements(achievementsData);
                setShopItems(shopItemsData);
                setNews(newsData);
                setAnnouncements(announcementsData);
                setContests(contestsData);
                setUsers(FALLBACK_DATA.users); // Mock users for Phase 2
                setNotifications(notificationsData);
                setError(null);
            } catch (err) {
                console.warn('API unavailable, using fallback data:', err.message);
                // Use fallback data when API is not available
                setLessons(FALLBACK_DATA.lessons);
                setChallenges(FALLBACK_DATA.challenges);
                setAchievements(FALLBACK_DATA.achievements);
                setShopItems(FALLBACK_DATA.shopItems);
                setNews(FALLBACK_DATA.news);
                setAnnouncements(FALLBACK_DATA.announcements);
                setContests(FALLBACK_DATA.contests);
                setUsers(FALLBACK_DATA.users);
                setNotifications(FALLBACK_DATA.notifications);
                setError(null); // Don't show error when using fallback
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [apiCall]);

    // Helper to generate local IDs
    const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ============================================
    // LESSONS CRUD
    // ============================================
    const createLesson = useCallback(async (lessonData) => {
        try {
            const newLesson = await apiCall('lessons', 'POST', null, lessonData);
            setLessons(prev => [...prev, newLesson]);
            return newLesson;
        } catch (err) {
            // Fallback: create locally
            const localLesson = { id: generateId('lesson'), ...lessonData, createdAt: new Date().toISOString() };
            setLessons(prev => [...prev, localLesson]);
            return localLesson;
        }
    }, [apiCall]);

    const updateLesson = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('lessons', 'PUT', id, updates);
            setLessons(prev => prev.map(l => l.id === id ? updated : l));
            return updated;
        } catch (err) {
            // Fallback: update locally
            setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteLesson = useCallback(async (id) => {
        try {
            await apiCall('lessons', 'DELETE', id);
        } catch (err) {
            // Continue with local delete even if API fails
        }
        setLessons(prev => prev.filter(l => l.id !== id));
    }, [apiCall]);

    // ============================================
    // CHALLENGES CRUD
    // ============================================
    const createChallenge = useCallback(async (challengeData) => {
        try {
            const newChallenge = await apiCall('challenges', 'POST', null, challengeData);
            setChallenges(prev => [...prev, newChallenge]);
            return newChallenge;
        } catch (err) {
            const localChallenge = { id: generateId('chal'), ...challengeData, createdAt: new Date().toISOString() };
            setChallenges(prev => [...prev, localChallenge]);
            return localChallenge;
        }
    }, [apiCall]);

    const updateChallenge = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('challenges', 'PUT', id, updates);
            setChallenges(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteChallenge = useCallback(async (id) => {
        try {
            await apiCall('challenges', 'DELETE', id);
        } catch (err) { }
        setChallenges(prev => prev.filter(c => c.id !== id));
    }, [apiCall]);

    // ============================================
    // ACHIEVEMENTS CRUD
    // ============================================
    const createAchievement = useCallback(async (achievementData) => {
        try {
            const newAchievement = await apiCall('achievements', 'POST', null, achievementData);
            setAchievements(prev => [...prev, newAchievement]);
            return newAchievement;
        } catch (err) {
            const localAchievement = { id: generateId('ach'), ...achievementData, createdAt: new Date().toISOString() };
            setAchievements(prev => [...prev, localAchievement]);
            return localAchievement;
        }
    }, [apiCall]);

    const updateAchievement = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('achievements', 'PUT', id, updates);
            setAchievements(prev => prev.map(a => a.id === id ? updated : a));
            return updated;
        } catch (err) {
            setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteAchievement = useCallback(async (id) => {
        try {
            await apiCall('achievements', 'DELETE', id);
        } catch (err) { }
        setAchievements(prev => prev.filter(a => a.id !== id));
    }, [apiCall]);

    // ============================================
    // SHOP ITEMS CRUD
    // ============================================
    const createShopItem = useCallback(async (itemData) => {
        try {
            const newItem = await apiCall('shopItems', 'POST', null, itemData);
            setShopItems(prev => [...prev, newItem]);
            return newItem;
        } catch (err) {
            const localItem = { id: generateId('shop'), ...itemData, createdAt: new Date().toISOString() };
            setShopItems(prev => [...prev, localItem]);
            return localItem;
        }
    }, [apiCall]);

    const updateShopItem = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('shopItems', 'PUT', id, updates);
            setShopItems(prev => prev.map(i => i.id === id ? updated : i));
            return updated;
        } catch (err) {
            setShopItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteShopItem = useCallback(async (id) => {
        try {
            await apiCall('shopItems', 'DELETE', id);
        } catch (err) { }
        setShopItems(prev => prev.filter(i => i.id !== id));
    }, [apiCall]);

    // ============================================
    // NEWS CRUD
    // ============================================
    const createNews = useCallback(async (newsData) => {
        try {
            const newNews = await apiCall('news', 'POST', null, newsData);
            setNews(prev => [...prev, newNews]);
            return newNews;
        } catch (err) {
            const localNews = { id: generateId('news'), ...newsData, createdAt: new Date().toISOString(), publishedAt: new Date().toISOString() };
            setNews(prev => [...prev, localNews]);
            return localNews;
        }
    }, [apiCall]);

    const updateNews = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('news', 'PUT', id, updates);
            setNews(prev => prev.map(n => n.id === id ? updated : n));
            return updated;
        } catch (err) {
            setNews(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteNews = useCallback(async (id) => {
        try {
            await apiCall('news', 'DELETE', id);
        } catch (err) { }
        setNews(prev => prev.filter(n => n.id !== id));
    }, [apiCall]);

    // ============================================
    // ANNOUNCEMENTS CRUD
    // ============================================
    const createAnnouncement = useCallback(async (announcementData) => {
        try {
            const newAnnouncement = await apiCall('announcements', 'POST', null, announcementData);
            setAnnouncements(prev => [...prev, newAnnouncement]);
            return newAnnouncement;
        } catch (err) {
            const localAnnouncement = { id: generateId('ann'), ...announcementData, createdAt: new Date().toISOString() };
            setAnnouncements(prev => [...prev, localAnnouncement]);
            return localAnnouncement;
        }
    }, [apiCall]);

    const updateAnnouncement = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('announcements', 'PUT', id, updates);
            setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
            return updated;
        } catch (err) {
            setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteAnnouncement = useCallback(async (id) => {
        try {
            await apiCall('announcements', 'DELETE', id);
        } catch (err) { }
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, [apiCall]);

    // ============================================
    // CONTESTS CRUD
    // ============================================
    const createContest = useCallback(async (contestData) => {
        try {
            const newContest = await apiCall('contests', 'POST', null, contestData);
            setContests(prev => [...prev, newContest]);
            return newContest;
        } catch (err) {
            const localContest = { id: generateId('contest'), ...contestData, createdAt: new Date().toISOString() };
            setContests(prev => [...prev, localContest]);
            return localContest;
        }
    }, [apiCall]);

    const updateContest = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('contests', 'PUT', id, updates);
            setContests(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            setContests(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteContest = useCallback(async (id) => {
        try {
            await apiCall('contests', 'DELETE', id);
        } catch (err) { }
        setContests(prev => prev.filter(c => c.id !== id));
    }, [apiCall]);

    // ============================================
    // NOTIFICATIONS CRUD
    // ============================================
    const createNotification = useCallback(async (notificationData) => {
        try {
            const newNotif = await apiCall('notifications', 'POST', null, notificationData);
            setNotifications(prev => [...prev, newNotif]);
            return newNotif;
        } catch (err) {
            const localNotif = { id: generateId('not'), ...notificationData, createdAt: new Date().toISOString() };
            setNotifications(prev => [...prev, localNotif]);
            return localNotif;
        }
    }, [apiCall]);

    const updateNotification = useCallback(async (id, updates) => {
        try {
            const updated = await apiCall('notifications', 'PUT', id, updates);
            setNotifications(prev => prev.map(n => n.id === id ? updated : n));
            return updated;
        } catch (err) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
            return { id, ...updates };
        }
    }, [apiCall]);

    const deleteNotification = useCallback(async (id) => {
        try {
            await apiCall('notifications', 'DELETE', id);
        } catch (err) { }
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, [apiCall]);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const getDashboardStats = useCallback(async () => {
        try {
            const data = await apiCall('dashboard');
            return data.stats;
        } catch (err) {
            // Fallback to computed stats from state
            return {
                totalLessons: lessons.length,
                publishedLessons: lessons.filter(l => l.isPublished).length,
                totalChallenges: challenges.length,
                activeChallenges: challenges.filter(c => c.isActive).length,
                totalAchievements: achievements.length,
                totalShopItems: shopItems.length,
                availableShopItems: shopItems.filter(i => i.isAvailable).length,
                totalNews: news.length,
                publishedNews: news.filter(n => n.isPublished).length,
                totalAnnouncements: announcements.length,
                activeAnnouncements: announcements.filter(a => a.isActive).length,
                totalContests: contests.length,
                activeContests: contests.filter(c => c.isActive).length,
                totalNotifications: notifications.length,
            };
        }
    }, [apiCall, lessons, challenges, achievements, shopItems, news, announcements, contests, notifications]);

    const getActiveAnnouncements = useCallback((targetMode = 'all') => {
        return announcements.filter(a =>
            a.isActive && (a.targetMode === targetMode || a.targetMode === 'all')
        );
    }, [announcements]);

    const getPublishedLessons = useCallback((category = null) => {
        let filtered = lessons.filter(l => l.isPublished);
        if (category) filtered = filtered.filter(l => l.category === category);
        return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [lessons]);

    const getActiveChallenges = useCallback((type = null) => {
        let filtered = challenges.filter(c => c.isActive);
        if (type) filtered = filtered.filter(c => c.type === type);
        return filtered;
    }, [challenges]);

    const getPublishedNews = useCallback((market = null) => {
        let filtered = news.filter(n => n.isPublished);
        if (market) filtered = filtered.filter(n => n.market === market || n.market === 'all');
        return filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }, [news]);

    const getAvailableShopItems = useCallback((category = null) => {
        let filtered = shopItems.filter(i => i.isAvailable);
        if (category) filtered = filtered.filter(i => i.category === category);
        return filtered;
    }, [shopItems]);

    // Refresh all data
    const refreshAll = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [
                lessonsData,
                challengesData,
                achievementsData,
                shopItemsData,
                newsData,
                announcementsData,
                contestsData,
                notificationsData,
            ] = await Promise.all([
                apiCall('lessons'),
                apiCall('challenges'),
                apiCall('achievements'),
                apiCall('shopItems'),
                apiCall('news'),
                apiCall('announcements'),
                apiCall('contests'),
                apiCall('notifications'),
            ]);

            setLessons(lessonsData);
            setChallenges(challengesData);
            setAchievements(achievementsData);
            setShopItems(shopItemsData);
            setNews(newsData);
            setAnnouncements(announcementsData);
            setContests(contestsData);
            setNotifications(notificationsData);
            setError(null);
        } catch (err) {
            if (!silent) setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [apiCall]);

    // Live Sync: Poll for updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshAll(true); // Silent refresh
        }, 30000);
        return () => clearInterval(interval);
    }, [refreshAll]);

    const value = {
        // Data
        lessons,
        challenges,
        achievements,
        shopItems,
        news,
        announcements,
        contests,
        notifications,

        // State
        loading,
        error,

        // Lessons CRUD
        createLesson,
        updateLesson,
        deleteLesson,

        // Challenges CRUD
        createChallenge,
        updateChallenge,
        deleteChallenge,

        // Achievements CRUD
        createAchievement,
        updateAchievement,
        deleteAchievement,

        // Shop Items CRUD
        createShopItem,
        updateShopItem,
        deleteShopItem,

        // News CRUD
        createNews,
        updateNews,
        deleteNews,

        // Announcements CRUD
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,

        // Contests CRUD
        createContest,
        updateContest,
        deleteContest,

        // Notifications CRUD
        createNotification,
        updateNotification,
        deleteNotification,

        // Utilities
        getDashboardStats,
        getActiveAnnouncements,
        getPublishedLessons,
        getActiveChallenges,
        getPublishedNews,
        getAvailableShopItems,
        refreshAll,

        // User Management (CRM) - Phase 2
        users,
        updateUser: useCallback(async (id, updates) => {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        }, []),
        deleteUser: useCallback(async (id) => {
            setUsers(prev => prev.filter(u => u.id !== id));
        }, []),
    };

    return (
        <CMSContext.Provider value={value} >
            {children}
        </CMSContext.Provider >
    );
}

export function useCMS() {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
}

export default CMSContext;
