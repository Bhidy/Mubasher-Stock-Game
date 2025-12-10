/**
 * CMS API - Unified endpoint for all CMS operations
 * Handles: lessons, challenges, achievements, shop items, news, announcements, contests, users, notifications
 * 
 * PERSISTENCE: Now uses JSONBlob.com as a lightweight database.
 * Blob ID: 019b0534-29ba-7c7d-92f7-afd3ac34b85e
 * 
 * Last Deploy: 2025-12-10T12:15:00Z - Force rebuild with notifications entity
 */

import axios from 'axios';

// The Persistent Store ID
const BLOB_ID = '019b0534-29ba-7c7d-92f7-afd3ac34b85e';
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

// RICH, COMPREHENSIVE SEED DATA (Minimum 6 items per category)
const INITIAL_DATA = {
    lessons: [
        // BASICS
        { id: 'l-101', title: 'What is a Stock?', description: 'Concept of ownership.', content: '<h2>Ownership</h2><p>Owning a stock means owning a piece of a company.</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 1, createdAt: new Date().toISOString() },
        { id: 'l-102', title: 'Stock Exchanges', description: 'Where trading happens.', content: '<h2>The Market</h2><p>Stocks trade on exchanges like NYSE and Tadawul.</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 2, createdAt: new Date().toISOString() },
        { id: 'l-103', title: 'Market Orders vs Limit', description: 'Execution types.', content: '<h2>Order Types</h2><p><strong>Market:</strong> Now. <strong>Limit:</strong> Specific price.</p>', category: 'basics', difficulty: 'intermediate', duration: 10, xpReward: 75, coinReward: 35, isPublished: true, order: 3, createdAt: new Date().toISOString() },
        { id: 'l-104', title: 'Bull & Bear Markets', description: 'Market cycles.', content: '<h2>Cycles</h2><p>Markets move in cycles of optimism (Bull) and pessimism (Bear).</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 4, createdAt: new Date().toISOString() },
        { id: 'l-105', title: 'Dividends Explained', description: 'Getting paid to hold.', content: '<h2>Cash Flow</h2><p>Dividends are profits shared with shareholders.</p>', category: 'basics', difficulty: 'intermediate', duration: 8, xpReward: 60, coinReward: 30, isPublished: true, order: 5, createdAt: new Date().toISOString() },
        { id: 'l-106', title: 'IPO Process', description: 'Going public.', content: '<h2>Initial Public Offering</h2><p>When a private company sells shares to the public for the first time.</p>', category: 'basics', difficulty: 'advanced', duration: 12, xpReward: 100, coinReward: 50, isPublished: true, order: 6, createdAt: new Date().toISOString() },
        // TECHNICAL ANALYSIS
        { id: 'l-201', title: 'Candlestick Charts', description: 'Reading price action.', content: '<h2>Visualizing Price</h2><p>Candlesticks show Open, High, Low, Close.</p>', category: 'technical', difficulty: 'intermediate', duration: 10, xpReward: 100, coinReward: 50, isPublished: true, order: 7, createdAt: new Date().toISOString() },
    ],
    challenges: [
        { id: 'c-1', title: 'Early Bird', description: 'Login before 9 AM', type: 'daily', coinReward: 20, xpReward: 10, targetValue: 1, triggerEvent: 'login', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-2', title: 'News Buff', description: 'Read 3 articles', type: 'daily', coinReward: 30, xpReward: 15, targetValue: 3, triggerEvent: 'read_news', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-3', title: 'First Trade', description: 'Place 1 trade', type: 'daily', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'trade', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-4', title: 'Diversifier', description: 'Trade 3 sectors', type: 'weekly', coinReward: 100, xpReward: 50, targetValue: 3, triggerEvent: 'sector_trade', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-5', title: 'Profit Week', description: 'End week positive', type: 'weekly', coinReward: 200, xpReward: 100, targetValue: 1, triggerEvent: 'positive_pnl', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-6', title: 'Volume Trader', description: 'Trade > $10k volume', type: 'weekly', coinReward: 150, xpReward: 75, targetValue: 10000, triggerEvent: 'volume', isActive: true, createdAt: new Date().toISOString() },
    ],
    achievements: [
        { id: 'a-1', title: 'Newbie', description: 'Registered account', rarity: 'common', category: 'general', xpReward: 10, coinReward: 0, requirement: 1, requirementType: 'register', createdAt: new Date().toISOString() },
        { id: 'a-2', title: 'First Blood', description: 'First profitable trade', rarity: 'common', category: 'trading', xpReward: 50, coinReward: 25, requirement: 1, requirementType: 'profit_trade', createdAt: new Date().toISOString() },
        { id: 'a-3', title: 'Student', description: 'Complete 5 lessons', rarity: 'common', category: 'education', xpReward: 100, coinReward: 50, requirement: 5, requirementType: 'lessons', createdAt: new Date().toISOString() },
        { id: 'a-4', title: 'Diamond Hands', description: 'Hold for 30 days', rarity: 'rare', category: 'trading', xpReward: 300, coinReward: 150, requirement: 30, requirementType: 'hold_days', createdAt: new Date().toISOString() },
        { id: 'a-5', title: 'Whale', description: 'Portfolio > $1M', rarity: 'legendary', category: 'wealth', xpReward: 5000, coinReward: 2000, requirement: 1000000, requirementType: 'net_worth', createdAt: new Date().toISOString() },
        { id: 'a-6', title: 'Influencer', description: 'Invited 10 friends', rarity: 'epic', category: 'social', xpReward: 1000, coinReward: 500, requirement: 10, requirementType: 'invites', createdAt: new Date().toISOString() },
    ],
    shopItems: [
        // Avatars
        { id: 's-1', name: 'Bull', category: 'avatars', price: 500, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-2', name: 'Bear', category: 'avatars', price: 500, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-3', name: 'Robot', category: 'avatars', price: 1000, rarity: 'rare', isAvailable: true, createdAt: new Date().toISOString() },
        // Frames
        { id: 's-4', name: 'Gold', category: 'frames', price: 2000, rarity: 'epic', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-5', name: 'Neon', category: 'frames', price: 1500, rarity: 'rare', isAvailable: true, createdAt: new Date().toISOString() },
        // Boosters
        { id: 's-6', name: '2x XP', category: 'boosters', price: 100, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() },
    ],
    news: [
        { id: 'n-1', title: 'Fed Keeps Rates Steady', summary: 'Federal Reserve holds interest rates stable.', content: '<p>The Federal Reserve announced today...</p>', source: 'Bloomberg', category: 'Economic Data', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-2', title: 'Oil Surge Continues', summary: 'Crude oil prices hit new yearly highs.', content: '<p>Brent crude futures rose...</p>', source: 'Reuters', category: 'Commodities', market: 'Global', imageUrl: 'https://images.unsplash.com/photo-1587309503204-6bd12a02b4d9?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-3', title: 'Tech Stocks Rally', summary: 'Nasdaq leads gains on AI optimism.', content: '<p>Technology shares outperformed...</p>', source: 'CNBC', category: 'Technology', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-4', title: 'Saudi GDP Growth', summary: 'Non-oil sector drives expansion.', content: '<p>The Kingdom reported robust growth...', source: 'Argaam', category: 'Economic Data', market: 'SA', imageUrl: 'https://images.unsplash.com/photo-1565514020176-dbf2277e3c66?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-5', title: 'Egypt Inflation Dips', summary: 'Consumer prices ease surprisingly.', content: '<p>Inflation rates in Egypt dropped...', source: 'Enterprise', category: 'Economic Data', market: 'EG', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-6', title: 'Tesla Delivers', summary: 'Record deliveries for Q4 reported.', content: '<p>Electric vehicle maker Tesla...', source: 'Yahoo Finance', category: 'Company News', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    ],
    announcements: [
        { id: 'an-1', title: 'Welcome!', message: 'Thanks for joining.', type: 'info', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-2', title: 'Update Live', message: 'New features added.', type: 'update', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-3', title: 'Market Holidy', message: 'Markets closed tomorrow.', type: 'warning', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-4', title: 'Contest Winners', message: 'Congrats to top traders.', type: 'success', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-5', title: 'Server Maint', message: 'Downtime expected.', type: 'warning', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-6', title: 'New Lessons', message: 'Check out the academy.', type: 'promo', isActive: true, createdAt: new Date().toISOString() },
    ],
    contests: [
        { id: 'co-1', name: 'Daily Sprint', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-2', name: 'Weekly Marathon', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-3', name: 'Crypto Cup', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-4', name: 'Saudi Market Challenge', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-5', name: 'US Tech Battle', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-6', name: 'Global macro', isActive: true, createdAt: new Date().toISOString() },
    ],
    users: [
        { id: 'u-1', name: 'Admin', role: 'admin', status: 'active' },
        { id: 'u-2', name: 'User 1', role: 'user', status: 'active' },
        { id: 'u-3', name: 'User 2', role: 'user', status: 'active' },
        { id: 'u-4', name: 'User 3', role: 'user', status: 'banned' },
        { id: 'u-5', name: 'VIP User', role: 'vip', status: 'active' },
        { id: 'u-6', name: 'New User', role: 'user', status: 'pending' },
    ],
    notifications: [
        { id: 'not-1', title: 'Welcome to Notifications', message: 'This is a test notification.', type: 'in-app', target: 'all', status: 'sent', sentAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    ]
};

// Helper to generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper: Fetch Data from Blob
async function getCMSData() {
    try {
        const res = await axios.get(BLOB_URL);
        const data = res.data;

        // Safety Check: If data exists but is effectively empty (e.g. user deleted everything or bad state)
        // We enforce a minimum population for key entities
        const seemsEmpty = !data ||
            !data.lessons || data.lessons.length < 3 ||
            !data.news || data.news.length < 3;

        if (seemsEmpty) {
            console.log("⚠️ CMS Data seems empty or stale. Forcing re-seed from INITIAL_DATA.");
            await saveCMSData(INITIAL_DATA);
            return INITIAL_DATA;
        }
        return data;
    } catch (e) {
        console.error('Failed to fetch CMS data:', e.message);
        // Fallback to initial data if blob fails
        return INITIAL_DATA;
    }
}

// Helper: Save Data to Blob
async function saveCMSData(data) {
    try {
        await axios.put(BLOB_URL, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return true;
    } catch (e) {
        console.error('Failed to save CMS data:', e.message);
        return false;
    }
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // DISABLE CACHING: Ensure clients always get the latest data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { entity, id } = req.query;
    const method = req.method;

    try {
        // Validate entity
        const validEntities = ['lessons', 'challenges', 'achievements', 'shopItems', 'news', 'announcements', 'contests', 'dashboard', 'users', 'notifications'];
        if (!validEntities.includes(entity)) {
            return res.status(400).json({ error: `Invalid entity: ${entity}. Valid entities: ${validEntities.join(', ')}` });
        }

        // LOAD DATA
        let cmsData = await getCMSData();
        let needsSave = false;

        // Force reset conditional: If specific query param is sent (for dev use)
        if (req.query.reset === 'true') {
            cmsData = INITIAL_DATA;
            needsSave = true;
        }

        // Dashboard stats (special case) - Read Only
        if (entity === 'dashboard') {
            return res.status(200).json({
                stats: {
                    totalLessons: cmsData.lessons?.length || 0,
                    publishedLessons: cmsData.lessons?.filter(l => l.isPublished).length || 0,
                    totalChallenges: cmsData.challenges?.length || 0,
                    activeChallenges: cmsData.challenges?.filter(c => c.isActive).length || 0,
                    totalAchievements: cmsData.achievements?.length || 0,
                    totalShopItems: cmsData.shopItems?.length || 0,
                    availableShopItems: cmsData.shopItems?.filter(i => i.isAvailable).length || 0,
                    totalNews: cmsData.news?.length || 0,
                    publishedNews: cmsData.news?.filter(n => n.isPublished).length || 0,
                    totalAnnouncements: cmsData.announcements?.length || 0,
                    activeAnnouncements: cmsData.announcements?.filter(a => a.isActive).length || 0,
                    totalContests: cmsData.contests?.length || 0,
                    activeContests: cmsData.contests?.filter(c => c.isActive).length || 0,
                    totalUsers: cmsData.users?.length || 0,
                    activeUsers: cmsData.users?.filter(u => u.status === 'active').length || 0,
                },
                recentActivity: [
                    { type: 'stats_updated', message: 'System stats loaded', time: 'Just now' },
                ],
                activeAnnouncements: cmsData.announcements?.filter(a => a.isActive) || [],
            });
        }

        const dataKey = entity;
        const prefixMap = {
            lessons: 'lesson',
            challenges: 'chal',
            achievements: 'ach',
            shopItems: 'shop',
            news: 'news',
            announcements: 'ann',
            contests: 'contest',
            users: 'user',
            notifications: 'not',
        };

        // Ensure array exists
        if (!cmsData[dataKey]) cmsData[dataKey] = [];

        let result;

        switch (method) {
            case 'GET':
                if (id) {
                    const item = cmsData[dataKey].find(i => i.id === id);
                    if (!item) return res.status(404).json({ error: `${entity} not found` });
                    result = item;
                } else {
                    let items = [...cmsData[dataKey]];
                    const { category, type, rarity, market, isActive, isPublished, targetMode, status, role } = req.query;

                    if (category) items = items.filter(i => i.category === category);
                    if (type) items = items.filter(i => i.type === type);
                    if (rarity) items = items.filter(i => i.rarity === rarity);
                    if (market) items = items.filter(i => i.market === market || i.market === 'all');
                    if (isActive !== undefined) items = items.filter(i => i.isActive === (isActive === 'true'));
                    if (isPublished !== undefined) items = items.filter(i => i.isPublished === (isPublished === 'true'));
                    if (targetMode) items = items.filter(i => i.targetMode === targetMode || i.targetMode === 'all');
                    if (status) items = items.filter(i => i.status === status);
                    if (role) items = items.filter(i => i.role === role);

                    result = items;
                }
                return res.status(200).json(result);

            case 'POST':
                const newItem = {
                    id: generateId(prefixMap[dataKey]),
                    ...req.body,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                cmsData[dataKey].push(newItem);
                needsSave = true;
                result = newItem;
                break;

            case 'PUT':
                if (!id) return res.status(400).json({ error: 'ID required' });
                const updateIndex = cmsData[dataKey].findIndex(i => i.id === id);
                if (updateIndex === -1) return res.status(404).json({ error: 'Not found' });

                cmsData[dataKey][updateIndex] = {
                    ...cmsData[dataKey][updateIndex],
                    ...req.body,
                    updatedAt: new Date().toISOString(),
                };
                needsSave = true;
                result = cmsData[dataKey][updateIndex];
                break;

            case 'DELETE':
                if (!id) return res.status(400).json({ error: 'ID required' });
                const deleteIndex = cmsData[dataKey].findIndex(i => i.id === id);
                if (deleteIndex === -1) return res.status(404).json({ error: 'Not found' });

                const deleted = cmsData[dataKey].splice(deleteIndex, 1)[0];
                needsSave = true;
                result = { message: 'Deleted', item: deleted };
                break;

            default:
                return res.status(405).json({ error: `Method ${method} not allowed` });
        }

        // SAVE IF MODIFIED
        if (needsSave) {
            await saveCMSData(cmsData);
            if (method === 'POST') return res.status(201).json(result);
            return res.status(200).json(result);
        }

    } catch (error) {
        console.error('CMS API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
