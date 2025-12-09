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
                ] = await Promise.all([
                    apiCall('lessons'),
                    apiCall('challenges'),
                    apiCall('achievements'),
                    apiCall('shopItems'),
                    apiCall('news'),
                    apiCall('announcements'),
                    apiCall('contests'),
                ]);

                setLessons(lessonsData);
                setChallenges(challengesData);
                setAchievements(achievementsData);
                setShopItems(shopItemsData);
                setNews(newsData);
                setAnnouncements(announcementsData);
                setContests(contestsData);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch CMS data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [apiCall]);

    // ============================================
    // LESSONS CRUD
    // ============================================
    const createLesson = useCallback(async (lessonData) => {
        const newLesson = await apiCall('lessons', 'POST', null, lessonData);
        setLessons(prev => [...prev, newLesson]);
        return newLesson;
    }, [apiCall]);

    const updateLesson = useCallback(async (id, updates) => {
        const updated = await apiCall('lessons', 'PUT', id, updates);
        setLessons(prev => prev.map(l => l.id === id ? updated : l));
        return updated;
    }, [apiCall]);

    const deleteLesson = useCallback(async (id) => {
        await apiCall('lessons', 'DELETE', id);
        setLessons(prev => prev.filter(l => l.id !== id));
    }, [apiCall]);

    // ============================================
    // CHALLENGES CRUD
    // ============================================
    const createChallenge = useCallback(async (challengeData) => {
        const newChallenge = await apiCall('challenges', 'POST', null, challengeData);
        setChallenges(prev => [...prev, newChallenge]);
        return newChallenge;
    }, [apiCall]);

    const updateChallenge = useCallback(async (id, updates) => {
        const updated = await apiCall('challenges', 'PUT', id, updates);
        setChallenges(prev => prev.map(c => c.id === id ? updated : c));
        return updated;
    }, [apiCall]);

    const deleteChallenge = useCallback(async (id) => {
        await apiCall('challenges', 'DELETE', id);
        setChallenges(prev => prev.filter(c => c.id !== id));
    }, [apiCall]);

    // ============================================
    // ACHIEVEMENTS CRUD
    // ============================================
    const createAchievement = useCallback(async (achievementData) => {
        const newAchievement = await apiCall('achievements', 'POST', null, achievementData);
        setAchievements(prev => [...prev, newAchievement]);
        return newAchievement;
    }, [apiCall]);

    const updateAchievement = useCallback(async (id, updates) => {
        const updated = await apiCall('achievements', 'PUT', id, updates);
        setAchievements(prev => prev.map(a => a.id === id ? updated : a));
        return updated;
    }, [apiCall]);

    const deleteAchievement = useCallback(async (id) => {
        await apiCall('achievements', 'DELETE', id);
        setAchievements(prev => prev.filter(a => a.id !== id));
    }, [apiCall]);

    // ============================================
    // SHOP ITEMS CRUD
    // ============================================
    const createShopItem = useCallback(async (itemData) => {
        const newItem = await apiCall('shopItems', 'POST', null, itemData);
        setShopItems(prev => [...prev, newItem]);
        return newItem;
    }, [apiCall]);

    const updateShopItem = useCallback(async (id, updates) => {
        const updated = await apiCall('shopItems', 'PUT', id, updates);
        setShopItems(prev => prev.map(i => i.id === id ? updated : i));
        return updated;
    }, [apiCall]);

    const deleteShopItem = useCallback(async (id) => {
        await apiCall('shopItems', 'DELETE', id);
        setShopItems(prev => prev.filter(i => i.id !== id));
    }, [apiCall]);

    // ============================================
    // NEWS CRUD
    // ============================================
    const createNews = useCallback(async (newsData) => {
        const newNews = await apiCall('news', 'POST', null, newsData);
        setNews(prev => [...prev, newNews]);
        return newNews;
    }, [apiCall]);

    const updateNews = useCallback(async (id, updates) => {
        const updated = await apiCall('news', 'PUT', id, updates);
        setNews(prev => prev.map(n => n.id === id ? updated : n));
        return updated;
    }, [apiCall]);

    const deleteNews = useCallback(async (id) => {
        await apiCall('news', 'DELETE', id);
        setNews(prev => prev.filter(n => n.id !== id));
    }, [apiCall]);

    // ============================================
    // ANNOUNCEMENTS CRUD
    // ============================================
    const createAnnouncement = useCallback(async (announcementData) => {
        const newAnnouncement = await apiCall('announcements', 'POST', null, announcementData);
        setAnnouncements(prev => [...prev, newAnnouncement]);
        return newAnnouncement;
    }, [apiCall]);

    const updateAnnouncement = useCallback(async (id, updates) => {
        const updated = await apiCall('announcements', 'PUT', id, updates);
        setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
        return updated;
    }, [apiCall]);

    const deleteAnnouncement = useCallback(async (id) => {
        await apiCall('announcements', 'DELETE', id);
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, [apiCall]);

    // ============================================
    // CONTESTS CRUD
    // ============================================
    const createContest = useCallback(async (contestData) => {
        const newContest = await apiCall('contests', 'POST', null, contestData);
        setContests(prev => [...prev, newContest]);
        return newContest;
    }, [apiCall]);

    const updateContest = useCallback(async (id, updates) => {
        const updated = await apiCall('contests', 'PUT', id, updates);
        setContests(prev => prev.map(c => c.id === id ? updated : c));
        return updated;
    }, [apiCall]);

    const deleteContest = useCallback(async (id) => {
        await apiCall('contests', 'DELETE', id);
        setContests(prev => prev.filter(c => c.id !== id));
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
            };
        }
    }, [apiCall, lessons, challenges, achievements, shopItems, news, announcements, contests]);

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
    const refreshAll = useCallback(async () => {
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
            ] = await Promise.all([
                apiCall('lessons'),
                apiCall('challenges'),
                apiCall('achievements'),
                apiCall('shopItems'),
                apiCall('news'),
                apiCall('announcements'),
                apiCall('contests'),
            ]);

            setLessons(lessonsData);
            setChallenges(challengesData);
            setAchievements(achievementsData);
            setShopItems(shopItemsData);
            setNews(newsData);
            setAnnouncements(announcementsData);
            setContests(contestsData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    const value = {
        // Data
        lessons,
        challenges,
        achievements,
        shopItems,
        news,
        announcements,
        contests,

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

        // Utilities
        getDashboardStats,
        getActiveAnnouncements,
        getPublishedLessons,
        getActiveChallenges,
        getPublishedNews,
        getAvailableShopItems,
        refreshAll,
    };

    return (
        <CMSContext.Provider value={value}>
            {children}
        </CMSContext.Provider>
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
