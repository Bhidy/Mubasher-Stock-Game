/**
 * CMS API - Unified endpoint for all CMS operations
 * Handles: lessons, challenges, achievements, shop items, news, announcements, contests
 * 
 * For staging/production, this uses Vercel KV (Redis) for persistence
 * Falls back to in-memory storage for development
 */

// In-memory storage for development (will be replaced by Vercel KV in production)
let cmsData = {
    lessons: [
        { id: 'lesson-1', title: 'Introduction to Stocks', description: 'Learn what stocks are and why people invest in them', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, icon: '📈', isPublished: true, order: 1, content: 'Stocks represent ownership in a company...', createdAt: new Date().toISOString() },
        { id: 'lesson-2', title: 'Reading Stock Charts', description: 'Master the art of technical analysis', category: 'technical', difficulty: 'intermediate', duration: 10, xpReward: 100, coinReward: 50, icon: '📊', isPublished: true, order: 2, content: 'Charts help visualize price movements...', createdAt: new Date().toISOString() },
        { id: 'lesson-3', title: 'Market Orders vs Limit Orders', description: 'Understanding different order types', category: 'trading', difficulty: 'beginner', duration: 7, xpReward: 75, coinReward: 35, icon: '🎯', isPublished: true, order: 3, content: 'Market orders execute immediately...', createdAt: new Date().toISOString() },
    ],
    challenges: [
        { id: 'chal-1', title: 'First Prediction', description: 'Make your first stock prediction', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'prediction_made', isActive: true, createdAt: new Date().toISOString() },
        { id: 'chal-2', title: 'Hot Streak', description: 'Get 3 correct predictions in a row', type: 'weekly', icon: '🔥', coinReward: 200, xpReward: 100, targetValue: 3, triggerEvent: 'streak_achieved', isActive: true, createdAt: new Date().toISOString() },
        { id: 'chal-3', title: 'Market Scholar', description: 'Complete 5 lessons this week', type: 'weekly', icon: '📚', coinReward: 150, xpReward: 75, targetValue: 5, triggerEvent: 'lesson_completed', isActive: true, createdAt: new Date().toISOString() },
        { id: 'chal-4', title: 'Weekend Warrior', description: 'Make predictions on Saturday and Sunday', type: 'special', icon: '⚡', coinReward: 300, xpReward: 150, targetValue: 2, triggerEvent: 'weekend_prediction', isActive: true, createdAt: new Date().toISOString() },
    ],
    achievements: [
        { id: 'ach-1', title: 'First Steps', description: 'Make your first prediction', icon: '👣', rarity: 'common', category: 'prediction', xpReward: 50, coinReward: 25, requirement: 1, requirementType: 'predictions_made', createdAt: new Date().toISOString() },
        { id: 'ach-2', title: 'Lucky Streak', description: 'Get 5 correct predictions in a row', icon: '🍀', rarity: 'rare', category: 'streak', xpReward: 200, coinReward: 100, requirement: 5, requirementType: 'consecutive_wins', createdAt: new Date().toISOString() },
        { id: 'ach-3', title: 'Market Master', description: 'Reach level 10', icon: '👑', rarity: 'epic', category: 'special', xpReward: 500, coinReward: 250, requirement: 10, requirementType: 'level_reached', createdAt: new Date().toISOString() },
        { id: 'ach-4', title: 'Legend', description: 'Achieve 100 correct predictions', icon: '🏆', rarity: 'legendary', category: 'prediction', xpReward: 1000, coinReward: 500, requirement: 100, requirementType: 'total_wins', createdAt: new Date().toISOString() },
    ],
    shopItems: [
        { id: 'shop-1', name: 'Golden Avatar', description: 'A prestigious golden frame', category: 'avatars', price: 500, rarity: 'rare', icon: '👤', isAvailable: true, discount: 0, createdAt: new Date().toISOString() },
        { id: 'shop-2', name: 'Pro Trader Badge', description: 'Show everyone you mean business', category: 'badges', price: 300, rarity: 'common', icon: '🏅', isAvailable: true, discount: 0, createdAt: new Date().toISOString() },
        { id: 'shop-3', name: 'Dark Theme', description: 'Easy on the eyes', category: 'themes', price: 200, rarity: 'common', icon: '🌙', isAvailable: true, discount: 10, createdAt: new Date().toISOString() },
        { id: 'shop-4', name: '2x XP Booster', description: 'Double XP for 24 hours', category: 'boosters', price: 150, rarity: 'common', icon: '⚡', isAvailable: true, discount: 0, createdAt: new Date().toISOString() },
    ],
    news: [
        { id: 'news-1', title: 'Markets Rally on Strong Earnings', summary: 'Major indices closed higher as tech giants beat expectations', content: 'The stock market closed significantly higher today as major technology companies reported earnings that exceeded analyst expectations...', source: 'Market Wire', category: 'Market Analysis', market: 'US', imageUrl: '', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'news-2', title: 'Saudi Aramco Announces Dividend', summary: 'Oil giant declares quarterly dividend amid strong oil prices', content: 'Saudi Aramco, the world\'s largest oil company, announced its quarterly dividend...', source: 'Gulf Business', category: 'Company News', market: 'SA', imageUrl: '', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'news-3', title: 'EGX30 Hits New High', summary: 'Egyptian market reaches record levels', content: 'The Egyptian Stock Exchange main index EGX30 closed at a new all-time high...', source: 'Daily News Egypt', category: 'Market Analysis', market: 'EG', imageUrl: '', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    ],
    announcements: [
        { id: 'ann-1', title: 'Welcome to Bhidy!', message: 'Start your trading journey with us. Make predictions, earn rewards, and learn about the markets!', type: 'info', priority: 'high', targetMode: 'all', buttonText: 'Get Started', buttonLink: '/player/home', isActive: true, expiresAt: '', createdAt: new Date().toISOString() },
        { id: 'ann-2', title: 'Weekend Contest!', message: 'Join our special weekend prediction contest. Top 10 win exclusive prizes!', type: 'promo', priority: 'high', targetMode: 'player', buttonText: 'Join Now', buttonLink: '/player/live', isActive: true, expiresAt: '', createdAt: new Date().toISOString() },
        { id: 'ann-3', title: 'New Feature: Price Alerts', message: 'Set up price alerts for your favorite stocks and never miss a move!', type: 'update', priority: 'medium', targetMode: 'investor', buttonText: 'Try It', buttonLink: '/investor/alerts', isActive: true, expiresAt: '', createdAt: new Date().toISOString() },
    ],
    contests: [
        { id: 'contest-1', name: 'Daily Challenge', description: 'Compete daily for top spot', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString(), prizePool: 1000, entryFee: 0, maxParticipants: 1000, isActive: true, createdAt: new Date().toISOString() },
        { id: 'contest-2', name: 'Weekly Tournament', description: 'Week-long competition with big prizes', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 604800000).toISOString(), prizePool: 5000, entryFee: 50, maxParticipants: 500, isActive: true, createdAt: new Date().toISOString() },
    ],
};

// Helper to generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

    const { entity, id, action } = req.query;
    const method = req.method;

    try {
        // Validate entity
        const validEntities = ['lessons', 'challenges', 'achievements', 'shopItems', 'news', 'announcements', 'contests', 'dashboard'];
        if (!validEntities.includes(entity)) {
            return res.status(400).json({ error: `Invalid entity: ${entity}. Valid entities: ${validEntities.join(', ')}` });
        }

        // Dashboard stats (special case)
        if (entity === 'dashboard') {
            return res.status(200).json({
                stats: {
                    totalLessons: cmsData.lessons.length,
                    publishedLessons: cmsData.lessons.filter(l => l.isPublished).length,
                    totalChallenges: cmsData.challenges.length,
                    activeChallenges: cmsData.challenges.filter(c => c.isActive).length,
                    totalAchievements: cmsData.achievements.length,
                    totalShopItems: cmsData.shopItems.length,
                    availableShopItems: cmsData.shopItems.filter(i => i.isAvailable).length,
                    totalNews: cmsData.news.length,
                    publishedNews: cmsData.news.filter(n => n.isPublished).length,
                    totalAnnouncements: cmsData.announcements.length,
                    activeAnnouncements: cmsData.announcements.filter(a => a.isActive).length,
                    totalContests: cmsData.contests.length,
                    activeContests: cmsData.contests.filter(c => c.isActive).length,
                },
                recentActivity: [
                    { type: 'lesson_created', message: 'New lesson added', time: 'Just now' },
                    { type: 'challenge_updated', message: 'Challenge rewards updated', time: '5 min ago' },
                ],
                activeAnnouncements: cmsData.announcements.filter(a => a.isActive),
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
        };

        switch (method) {
            case 'GET':
                if (id) {
                    // Get single item
                    const item = cmsData[dataKey].find(i => i.id === id);
                    if (!item) {
                        return res.status(404).json({ error: `${entity} with id ${id} not found` });
                    }
                    return res.status(200).json(item);
                } else {
                    // Get all items (with optional filters)
                    let items = [...cmsData[dataKey]];

                    // Apply filters from query params
                    const { category, type, rarity, market, isActive, isPublished, targetMode } = req.query;
                    if (category) items = items.filter(i => i.category === category);
                    if (type) items = items.filter(i => i.type === type);
                    if (rarity) items = items.filter(i => i.rarity === rarity);
                    if (market) items = items.filter(i => i.market === market || i.market === 'all');
                    if (isActive !== undefined) items = items.filter(i => i.isActive === (isActive === 'true'));
                    if (isPublished !== undefined) items = items.filter(i => i.isPublished === (isPublished === 'true'));
                    if (targetMode) items = items.filter(i => i.targetMode === targetMode || i.targetMode === 'all');

                    return res.status(200).json(items);
                }

            case 'POST':
                // Create new item
                const newItem = {
                    id: generateId(prefixMap[dataKey]),
                    ...req.body,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                cmsData[dataKey].push(newItem);
                return res.status(201).json(newItem);

            case 'PUT':
                if (!id) {
                    return res.status(400).json({ error: 'ID is required for update' });
                }
                const updateIndex = cmsData[dataKey].findIndex(i => i.id === id);
                if (updateIndex === -1) {
                    return res.status(404).json({ error: `${entity} with id ${id} not found` });
                }
                cmsData[dataKey][updateIndex] = {
                    ...cmsData[dataKey][updateIndex],
                    ...req.body,
                    updatedAt: new Date().toISOString(),
                };
                return res.status(200).json(cmsData[dataKey][updateIndex]);

            case 'DELETE':
                if (!id) {
                    return res.status(400).json({ error: 'ID is required for delete' });
                }
                const deleteIndex = cmsData[dataKey].findIndex(i => i.id === id);
                if (deleteIndex === -1) {
                    return res.status(404).json({ error: `${entity} with id ${id} not found` });
                }
                const deleted = cmsData[dataKey].splice(deleteIndex, 1)[0];
                return res.status(200).json({ message: 'Deleted successfully', item: deleted });

            default:
                return res.status(405).json({ error: `Method ${method} not allowed` });
        }
    } catch (error) {
        console.error('CMS API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
