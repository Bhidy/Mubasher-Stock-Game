
const axios = require('axios');

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019b0534-29ba-7c7d-92f7-afd3ac34b85e';

const SEED_DATA = {
    lessons: [
        { id: 'l-101', title: 'What is a Stock?', description: 'Concept of ownership.', content: '<h2>Ownership</h2><p>Owning a stock means owning a piece of a company.</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 1, createdAt: new Date().toISOString() },
        { id: 'l-102', title: 'Stock Exchanges', description: 'Where trading happens.', content: '<h2>The Market</h2><p>Stocks trade on exchanges like NYSE and Tadawul.</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 2, createdAt: new Date().toISOString() },
        { id: 'l-103', title: 'Market Orders vs Limit', description: 'Execution types.', content: '<h2>Order Types</h2><p><strong>Market:</strong> Now. <strong>Limit:</strong> Specific price.</p>', category: 'basics', difficulty: 'intermediate', duration: 10, xpReward: 75, coinReward: 35, isPublished: true, order: 3, createdAt: new Date().toISOString() },
        { id: 'l-104', title: 'Bull & Bear Markets', description: 'Market cycles.', content: '<h2>Cycles</h2><p>Markets move in cycles of optimism (Bull) and pessimism (Bear).</p>', category: 'basics', difficulty: 'beginner', duration: 5, xpReward: 50, coinReward: 25, isPublished: true, order: 4, createdAt: new Date().toISOString() },
        { id: 'l-105', title: 'Dividends Explained', description: 'Getting paid to hold.', content: '<h2>Cash Flow</h2><p>Dividends are profits shared with shareholders.</p>', category: 'basics', difficulty: 'intermediate', duration: 8, xpReward: 60, coinReward: 30, isPublished: true, order: 5, createdAt: new Date().toISOString() },
        { id: 'l-106', title: 'IPO Process', description: 'Going public.', content: '<h2>Initial Public Offering</h2><p>When a private company sells shares to the public for the first time.</p>', category: 'basics', difficulty: 'advanced', duration: 12, xpReward: 100, coinReward: 50, isPublished: true, order: 6, createdAt: new Date().toISOString() },
        { id: 'l-201', title: 'Candlestick Charts', description: 'Reading price action.', content: '<h2>Visualizing Price</h2><p>Candlesticks show Open, High, Low, Close.</p>', category: 'technical', difficulty: 'intermediate', duration: 10, xpReward: 100, coinReward: 50, isPublished: true, order: 7, createdAt: new Date().toISOString() }
    ],
    challenges: [
        { id: 'c-1', title: 'Early Bird', description: 'Login before 9 AM', type: 'daily', coinReward: 20, xpReward: 10, targetValue: 1, triggerEvent: 'login', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-2', title: 'News Buff', description: 'Read 3 articles', type: 'daily', coinReward: 30, xpReward: 15, targetValue: 3, triggerEvent: 'read_news', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-3', title: 'First Trade', description: 'Place 1 trade', type: 'daily', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'trade', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-4', title: 'Diversifier', description: 'Trade 3 sectors', type: 'weekly', coinReward: 100, xpReward: 50, targetValue: 3, triggerEvent: 'sector_trade', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-5', title: 'Profit Week', description: 'End week positive', type: 'weekly', coinReward: 200, xpReward: 100, targetValue: 1, triggerEvent: 'positive_pnl', isActive: true, createdAt: new Date().toISOString() },
        { id: 'c-6', title: 'Volume Trader', description: 'Trade > $10k volume', type: 'weekly', coinReward: 150, xpReward: 75, targetValue: 10000, triggerEvent: 'volume', isActive: true, createdAt: new Date().toISOString() }
    ],
    achievements: [
        { id: 'a-1', title: 'Newbie', description: 'Registered account', rarity: 'common', category: 'general', xpReward: 10, coinReward: 0, requirement: 1, requirementType: 'register', createdAt: new Date().toISOString() },
        { id: 'a-2', title: 'First Blood', description: 'First profitable trade', rarity: 'common', category: 'trading', xpReward: 50, coinReward: 25, requirement: 1, requirementType: 'profit_trade', createdAt: new Date().toISOString() },
        { id: 'a-3', title: 'Student', description: 'Complete 5 lessons', rarity: 'common', category: 'education', xpReward: 100, coinReward: 50, requirement: 5, requirementType: 'lessons', createdAt: new Date().toISOString() },
        { id: 'a-4', title: 'Diamond Hands', description: 'Hold for 30 days', rarity: 'rare', category: 'trading', xpReward: 300, coinReward: 150, requirement: 30, requirementType: 'hold_days', createdAt: new Date().toISOString() },
        { id: 'a-5', title: 'Whale', description: 'Portfolio > $1M', rarity: 'legendary', category: 'wealth', xpReward: 5000, coinReward: 2000, requirement: 1000000, requirementType: 'net_worth', createdAt: new Date().toISOString() },
        { id: 'a-6', title: 'Influencer', description: 'Invited 10 friends', rarity: 'epic', category: 'social', xpReward: 1000, coinReward: 500, requirement: 10, requirementType: 'invites', createdAt: new Date().toISOString() }
    ],
    shopItems: [
        { id: 's-1', name: 'Bull', category: 'avatars', price: 500, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-2', name: 'Bear', category: 'avatars', price: 500, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-3', name: 'Robot', category: 'avatars', price: 1000, rarity: 'rare', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-4', name: 'Gold', category: 'frames', price: 2000, rarity: 'epic', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-5', name: 'Neon', category: 'frames', price: 1500, rarity: 'rare', isAvailable: true, createdAt: new Date().toISOString() },
        { id: 's-6', name: '2x XP', category: 'boosters', price: 100, rarity: 'common', isAvailable: true, createdAt: new Date().toISOString() }
    ],
    news: [
        { id: 'n-1', title: 'Fed Keeps Rates Steady', summary: 'Federal Reserve holds interest rates stable.', content: '<p>The Federal Reserve announced today...</p>', source: 'Bloomberg', category: 'Economic Data', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-2', title: 'Oil Surge Continues', summary: 'Crude oil prices hit new yearly highs.', content: '<p>Brent crude futures rose...</p>', source: 'Reuters', category: 'Commodities', market: 'Global', imageUrl: 'https://images.unsplash.com/photo-1587309503204-6bd12a02b4d9?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: true, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-3', title: 'Tech Stocks Rally', summary: 'Nasdaq leads gains on AI optimism.', content: '<p>Technology shares outperformed...</p>', source: 'CNBC', category: 'Technology', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-4', title: 'Saudi GDP Growth', summary: 'Non-oil sector drives expansion.', content: '<p>The Kingdom reported robust growth...', source: 'Argaam', category: 'Economic Data', market: 'SA', imageUrl: 'https://images.unsplash.com/photo-1565514020176-dbf2277e3c66?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-5', title: 'Egypt Inflation Dips', summary: 'Consumer prices ease surprisingly.', content: '<p>Inflation rates in Egypt dropped...', source: 'Enterprise', category: 'Economic Data', market: 'EG', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: 'n-6', title: 'Tesla Delivers', summary: 'Record deliveries for Q4 reported.', content: '<p>Electric vehicle maker Tesla...', source: 'Yahoo Finance', category: 'Company News', market: 'US', imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000', isPublished: true, isFeatured: false, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
    ],
    announcements: [
        { id: 'an-1', title: 'Welcome!', message: 'Thanks for joining.', type: 'info', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-2', title: 'Update Live', message: 'New features added.', type: 'update', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-3', title: 'Market Holidy', message: 'Markets closed tomorrow.', type: 'warning', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-4', title: 'Contest Winners', message: 'Congrats to top traders.', type: 'success', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-5', title: 'Server Maint', message: 'Downtime expected.', type: 'warning', isActive: true, createdAt: new Date().toISOString() },
        { id: 'an-6', title: 'New Lessons', message: 'Check out the academy.', type: 'promo', isActive: true, createdAt: new Date().toISOString() }
    ],
    contests: [
        { id: 'co-1', name: 'Daily Sprint', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-2', name: 'Weekly Marathon', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-3', name: 'Crypto Cup', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-4', name: 'Saudi Market Challenge', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-5', name: 'US Tech Battle', isActive: true, createdAt: new Date().toISOString() },
        { id: 'co-6', name: 'Global macro', isActive: true, createdAt: new Date().toISOString() }
    ],
    users: [
        { id: 'u-1', name: 'Admin', role: 'admin', status: 'active' },
        { id: 'u-2', name: 'User 1', role: 'user', status: 'active' },
        { id: 'u-3', name: 'User 2', role: 'user', status: 'active' },
        { id: 'u-4', name: 'User 3', role: 'user', status: 'banned' },
        { id: 'u-5', name: 'VIP User', role: 'vip', status: 'active' },
        { id: 'u-6', name: 'New User', role: 'user', status: 'pending' }
    ]
};

console.log('Seeding CMS data...');
axios.put(BLOB_URL, SEED_DATA, {
    headers: { 'Content-Type': 'application/json' }
})
    .then(() => console.log('✅ CMS Seeding Complete'))
    .catch(err => {
        console.error('❌ CMS Seeding Failed:', err.message);
        process.exit(1);
    });
