// CMS API Routes for Admin Content Management
// This module provides API endpoints for managing app content

import { ACHIEVEMENTS } from '../components/player/AchievementBadge.jsx';

// =====================================================
// IN-MEMORY DATA STORE (Replace with database in production)
// =====================================================

// Lessons Data
let lessonsData = [
    {
        id: 'lesson_1',
        title: 'What is the Stock Market?',
        description: 'Learn the basics of how stock markets work',
        category: 'beginner',
        difficulty: 'easy',
        duration: 5, // minutes
        xpReward: 50,
        coinReward: 25,
        order: 1,
        isPublished: true,
        content: [
            { type: 'text', value: 'The stock market is where buyers and sellers trade shares of companies...' },
            { type: 'image', value: '/lessons/stock-market-intro.png' },
            { type: 'quiz', question: 'What is a stock?', options: ['A piece of a company', 'A type of bond', 'A bank account'], correct: 0 },
        ],
        createdAt: '2024-12-01',
        updatedAt: '2024-12-09',
    },
    {
        id: 'lesson_2',
        title: 'Understanding Stock Prices',
        description: 'How stock prices move up and down',
        category: 'beginner',
        difficulty: 'easy',
        duration: 7,
        xpReward: 75,
        coinReward: 35,
        order: 2,
        isPublished: true,
        content: [],
        createdAt: '2024-12-02',
        updatedAt: '2024-12-09',
    },
    {
        id: 'lesson_3',
        title: 'Reading Stock Charts',
        description: 'Learn to read and understand price charts',
        category: 'intermediate',
        difficulty: 'medium',
        duration: 10,
        xpReward: 100,
        coinReward: 50,
        order: 3,
        isPublished: true,
        content: [],
        createdAt: '2024-12-03',
        updatedAt: '2024-12-09',
    },
];

// Challenges Data
let challengesData = [
    {
        id: 'challenge_daily_1',
        type: 'daily',
        title: 'Make 3 Predictions',
        description: 'Pick 3 stocks for today\'s contest',
        icon: '🎯',
        coinReward: 50,
        xpReward: 25,
        targetValue: 3,
        triggerEvent: 'prediction_made',
        isActive: true,
        order: 1,
    },
    {
        id: 'challenge_daily_2',
        type: 'daily',
        title: 'Win 2 Predictions',
        description: 'Get 2 correct predictions',
        icon: '🏆',
        coinReward: 100,
        xpReward: 50,
        targetValue: 2,
        triggerEvent: 'prediction_won',
        isActive: true,
        order: 2,
    },
    {
        id: 'challenge_weekly_1',
        type: 'weekly',
        title: 'Prediction Master',
        description: 'Make 20 predictions this week',
        icon: '🎲',
        coinReward: 500,
        xpReward: 200,
        targetValue: 20,
        triggerEvent: 'prediction_made',
        isActive: true,
        order: 1,
    },
];

// Achievements Data (from component, but editable)
let achievementsData = ACHIEVEMENTS.map(a => ({ ...a, isActive: true }));

// Shop Items Data
let shopItemsData = [
    { id: 'avatar_gold', name: 'Golden Trader', category: 'avatars', price: 500, icon: '👑', rarity: 'rare', isActive: true },
    { id: 'avatar_ninja', name: 'Stock Ninja', category: 'avatars', price: 300, icon: '🥷', rarity: 'uncommon', isActive: true },
    { id: 'badge_fire', name: 'Fire Badge', category: 'badges', price: 200, icon: '🔥', rarity: 'common', isActive: true },
    { id: 'theme_neon', name: 'Neon Night', category: 'themes', price: 600, icon: '🌃', rarity: 'rare', isActive: true },
];

// Contests Data
let contestsData = [
    {
        id: 'contest_daily',
        name: 'Daily Challenge',
        type: 'daily',
        startTime: '09:00',
        endTime: '16:00',
        maxPicks: 5,
        prizes: [
            { rank: 1, coins: 500, xp: 250 },
            { rank: 2, coins: 300, xp: 150 },
            { rank: 3, coins: 200, xp: 100 },
        ],
        isActive: true,
    },
];

// =====================================================
// API HANDLERS
// =====================================================

export function getLessons() {
    return lessonsData.filter(l => l.isPublished);
}

export function getAllLessons() {
    return lessonsData;
}

export function getLesson(id) {
    return lessonsData.find(l => l.id === id);
}

export function createLesson(lesson) {
    const newLesson = {
        ...lesson,
        id: `lesson_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
    };
    lessonsData.push(newLesson);
    return newLesson;
}

export function updateLesson(id, updates) {
    const index = lessonsData.findIndex(l => l.id === id);
    if (index !== -1) {
        lessonsData[index] = {
            ...lessonsData[index],
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0],
        };
        return lessonsData[index];
    }
    return null;
}

export function deleteLesson(id) {
    lessonsData = lessonsData.filter(l => l.id !== id);
    return true;
}

export function getChallenges(type = null) {
    if (type) {
        return challengesData.filter(c => c.type === type && c.isActive);
    }
    return challengesData.filter(c => c.isActive);
}

export function getAllChallenges() {
    return challengesData;
}

export function updateChallenge(id, updates) {
    const index = challengesData.findIndex(c => c.id === id);
    if (index !== -1) {
        challengesData[index] = { ...challengesData[index], ...updates };
        return challengesData[index];
    }
    return null;
}

export function getAchievements() {
    return achievementsData.filter(a => a.isActive);
}

export function getAllAchievements() {
    return achievementsData;
}

export function updateAchievement(id, updates) {
    const index = achievementsData.findIndex(a => a.id === id);
    if (index !== -1) {
        achievementsData[index] = { ...achievementsData[index], ...updates };
        return achievementsData[index];
    }
    return null;
}

export function getShopItems(category = null) {
    if (category) {
        return shopItemsData.filter(i => i.category === category && i.isActive);
    }
    return shopItemsData.filter(i => i.isActive);
}

export function getAllShopItems() {
    return shopItemsData;
}

export function createShopItem(item) {
    const newItem = {
        ...item,
        id: `${item.category}_${Date.now()}`,
    };
    shopItemsData.push(newItem);
    return newItem;
}

export function updateShopItem(id, updates) {
    const index = shopItemsData.findIndex(i => i.id === id);
    if (index !== -1) {
        shopItemsData[index] = { ...shopItemsData[index], ...updates };
        return shopItemsData[index];
    }
    return null;
}

export function getContests() {
    return contestsData.filter(c => c.isActive);
}

export function getAllContests() {
    return contestsData;
}

export function updateContest(id, updates) {
    const index = contestsData.findIndex(c => c.id === id);
    if (index !== -1) {
        contestsData[index] = { ...contestsData[index], ...updates };
        return contestsData[index];
    }
    return null;
}

// =====================================================
// STATS & ANALYTICS
// =====================================================

export function getDashboardStats() {
    return {
        totalUsers: 1247,
        activeToday: 342,
        totalPredictions: 15892,
        totalLessonsCompleted: 4521,
        revenue: 0, // Free app
        topMarket: 'US',
        growthRate: 12.5,
    };
}

export function getContentStats() {
    return {
        lessons: {
            total: lessonsData.length,
            published: lessonsData.filter(l => l.isPublished).length,
            draft: lessonsData.filter(l => !l.isPublished).length,
        },
        challenges: {
            daily: challengesData.filter(c => c.type === 'daily').length,
            weekly: challengesData.filter(c => c.type === 'weekly').length,
            special: challengesData.filter(c => c.type === 'special').length,
        },
        achievements: {
            total: achievementsData.length,
            active: achievementsData.filter(a => a.isActive).length,
        },
        shopItems: {
            total: shopItemsData.length,
            byCategory: {
                avatars: shopItemsData.filter(i => i.category === 'avatars').length,
                badges: shopItemsData.filter(i => i.category === 'badges').length,
                themes: shopItemsData.filter(i => i.category === 'themes').length,
                boosters: shopItemsData.filter(i => i.category === 'boosters').length,
            },
        },
    };
}
