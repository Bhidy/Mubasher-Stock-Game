/**
 * CMS Seed API - Populates Lessons, Challenges, Achievements, Shop with realistic content
 * Run once: GET /api/cms-seed
 */

export async function onRequest(context) {
    const { request, env } = context;

    // CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    const CMS_DATA = env.CMS_DATA;

    // Check if KV binding exists
    if (!CMS_DATA) {
        return new Response(JSON.stringify({
            success: false,
            error: 'CMS_DATA KV namespace not bound. Check wrangler.toml or Pages dashboard bindings.'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Fetch existing data
    let existing = {};
    try {
        const raw = await CMS_DATA.get('cms_data');
        existing = raw ? JSON.parse(raw) : {};
    } catch (e) {
        existing = {};
    }

    // --- LESSONS ---
    const lessons = [
        {
            id: 'lesson-1',
            title: 'Introduction to Stock Markets',
            description: 'Learn the basics of how stock markets work, including exchanges, trading hours, and market participants.',
            category: 'beginner',
            duration: 15,
            content: '# What is a Stock Market?\n\nA stock market is where buyers and sellers trade shares of publicly listed companies. The main exchanges include NYSE, NASDAQ, and regional markets like Tadawul (Saudi Arabia) and EGX (Egypt).\n\n## Key Concepts\n- **Equities**: Ownership shares in a company\n- **Bid/Ask**: Price buyers are willing to pay vs sellers request\n- **Volume**: Number of shares traded\n\n## Why It Matters\nUnderstanding markets helps you make informed investment decisions.',
            isPublished: true,
            order: 1,
            xp: 50,
            createdAt: new Date().toISOString()
        },
        {
            id: 'lesson-2',
            title: 'Understanding Price Charts',
            description: 'Master candlestick patterns, support/resistance levels, and trend identification techniques.',
            category: 'beginner',
            duration: 20,
            content: '# Reading Price Charts\n\nPrice charts visualize market movements over time. The most common type is the **candlestick chart**.\n\n## Candlestick Anatomy\n- **Body**: Opening to closing price\n- **Wick/Shadow**: High and low of the period\n- **Green**: Price closed higher (bullish)\n- **Red**: Price closed lower (bearish)\n\n## Key Patterns\n1. Doji - Indecision\n2. Hammer - Potential reversal\n3. Engulfing - Strong momentum shift',
            isPublished: true,
            order: 2,
            xp: 75,
            createdAt: new Date().toISOString()
        },
        {
            id: 'lesson-3',
            title: 'Fundamental Analysis 101',
            description: 'Evaluate companies using financial statements, ratios, and economic indicators.',
            category: 'intermediate',
            duration: 30,
            content: '# Fundamental Analysis\n\nFundamental analysis examines a company\'s financial health to determine its intrinsic value.\n\n## Key Financial Statements\n1. **Income Statement**: Revenue, expenses, profit\n2. **Balance Sheet**: Assets, liabilities, equity\n3. **Cash Flow Statement**: Operating, investing, financing activities\n\n## Important Ratios\n- P/E Ratio: Price vs Earnings\n- P/B Ratio: Price vs Book Value\n- ROE: Return on Equity\n- Debt/Equity: Leverage indicator',
            isPublished: true,
            order: 3,
            xp: 100,
            createdAt: new Date().toISOString()
        },
        {
            id: 'lesson-4',
            title: 'Technical Indicators Deep Dive',
            description: 'Learn to use RSI, MACD, Bollinger Bands, and moving averages for trading decisions.',
            category: 'intermediate',
            duration: 25,
            content: '# Technical Indicators\n\n## Moving Averages\n- **SMA**: Simple Moving Average\n- **EMA**: Exponential Moving Average (more weight on recent prices)\n\n## RSI (Relative Strength Index)\n- Range: 0-100\n- Above 70: Overbought\n- Below 30: Oversold\n\n## MACD\n- Signal line crossovers indicate momentum changes\n- Histogram shows strength of trend\n\n## Bollinger Bands\n- Upper/Lower bands = 2 standard deviations from SMA\n- Price touching bands indicates potential reversal',
            isPublished: true,
            order: 4,
            xp: 125,
            createdAt: new Date().toISOString()
        },
        {
            id: 'lesson-5',
            title: 'Risk Management Strategies',
            description: 'Protect your portfolio with position sizing, stop losses, and diversification techniques.',
            category: 'advanced',
            duration: 35,
            content: '# Risk Management\n\n## The 2% Rule\nNever risk more than 2% of your portfolio on a single trade.\n\n## Stop Loss Orders\n- **Fixed**: Set percentage below entry\n- **Trailing**: Moves with price\n- **Volatility-based**: ATR multiplier\n\n## Position Sizing\n```\nPosition Size = (Account Risk) / (Trade Risk)\n```\n\n## Diversification\n- Spread across sectors\n- Mix asset classes\n- Geographic diversification',
            isPublished: true,
            order: 5,
            xp: 150,
            createdAt: new Date().toISOString()
        }
    ];

    // --- CHALLENGES ---
    const challenges = [
        {
            id: 'chal-1',
            title: 'Daily Market Prediction',
            description: 'Predict whether the market will close higher or lower today. Earn XP for correct predictions!',
            type: 'daily',
            icon: '🎯',
            xpReward: 25,
            requirements: 'Make at least 1 prediction today',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'chal-2',
            title: 'Weekly Learning Sprint',
            description: 'Complete 3 lessons this week to earn bonus XP and a special badge.',
            type: 'weekly',
            icon: '📚',
            xpReward: 150,
            requirements: 'Complete 3 lessons before Sunday',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'chal-3',
            title: 'Prediction Streak',
            description: 'Get 5 correct predictions in a row. Can you maintain your winning streak?',
            type: 'special',
            icon: '🔥',
            xpReward: 200,
            requirements: '5 consecutive correct predictions',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'chal-4',
            title: 'Sector Master',
            description: 'Make predictions across 5 different sectors in one week.',
            type: 'weekly',
            icon: '🏆',
            xpReward: 175,
            requirements: 'Predict stocks in 5 different sectors',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'chal-5',
            title: 'Early Bird Trader',
            description: 'Make your first prediction within 30 minutes of market open.',
            type: 'daily',
            icon: '⚡',
            xpReward: 30,
            requirements: 'Predict between 9:30-10:00 AM',
            isActive: true,
            createdAt: new Date().toISOString()
        }
    ];

    // --- ACHIEVEMENTS ---
    const achievements = [
        {
            id: 'ach-1',
            title: 'First Steps',
            description: 'Complete your first lesson in Stock Hero.',
            icon: '🎓',
            category: 'learning',
            rarity: 'common',
            xpReward: 25,
            requirement: 'Complete 1 lesson',
            createdAt: new Date().toISOString()
        },
        {
            id: 'ach-2',
            title: 'Market Prophet',
            description: 'Correctly predict 10 stock movements.',
            icon: '🔮',
            category: 'prediction',
            rarity: 'rare',
            xpReward: 100,
            requirement: '10 correct predictions',
            createdAt: new Date().toISOString()
        },
        {
            id: 'ach-3',
            title: 'Consistency King',
            description: 'Log in for 7 consecutive days.',
            icon: '👑',
            category: 'streak',
            rarity: 'rare',
            xpReward: 150,
            requirement: '7-day login streak',
            createdAt: new Date().toISOString()
        },
        {
            id: 'ach-4',
            title: 'Diamond Hands',
            description: 'Make 50 correct predictions without giving up.',
            icon: '💎',
            category: 'prediction',
            rarity: 'legendary',
            xpReward: 500,
            requirement: '50 correct predictions',
            createdAt: new Date().toISOString()
        },
        {
            id: 'ach-5',
            title: 'Scholar',
            description: 'Complete all beginner lessons.',
            icon: '📖',
            category: 'learning',
            rarity: 'epic',
            xpReward: 200,
            requirement: 'All beginner lessons completed',
            createdAt: new Date().toISOString()
        },
        {
            id: 'ach-6',
            title: 'Social Butterfly',
            description: 'Invite 3 friends to join Stock Hero.',
            icon: '🦋',
            category: 'social',
            rarity: 'rare',
            xpReward: 125,
            requirement: '3 successful referrals',
            createdAt: new Date().toISOString()
        }
    ];

    // --- SHOP ITEMS ---
    const shopItems = [
        {
            id: 'shop-1',
            name: 'Golden Bull Avatar',
            description: 'Show your bullish spirit with this premium golden bull avatar frame.',
            category: 'avatars',
            price: 500,
            rarity: 'epic',
            imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=bull&backgroundColor=fbbf24',
            isAvailable: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'shop-2',
            name: 'Top Predictor Badge',
            description: 'Exclusive badge for traders in the top 10% of predictions.',
            category: 'badges',
            price: 750,
            rarity: 'legendary',
            imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=badge',
            isAvailable: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'shop-3',
            name: 'Dark Mode Pro Theme',
            description: 'A sleek, professional dark theme with emerald accents.',
            category: 'themes',
            price: 300,
            rarity: 'rare',
            imageUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=dark',
            isAvailable: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'shop-4',
            name: '2x XP Booster (24h)',
            description: 'Double your XP earnings for the next 24 hours.',
            category: 'boosters',
            price: 150,
            rarity: 'common',
            imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=booster&backgroundColor=10b981',
            isAvailable: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'shop-5',
            name: 'Diamond Bear Avatar',
            description: 'For those who profit in bear markets. Ultra rare collectible.',
            category: 'avatars',
            price: 1000,
            rarity: 'legendary',
            imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=bear&backgroundColor=6366f1',
            isAvailable: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'shop-6',
            name: 'Streak Shield',
            description: 'Protect your prediction streak from one wrong guess.',
            category: 'boosters',
            price: 400,
            rarity: 'epic',
            imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield',
            isAvailable: true,
            createdAt: new Date().toISOString()
        }
    ];

    // Merge with existing data (don't overwrite existing items)
    const mergedData = {
        ...existing,
        lessons: [...(existing.lessons || []), ...lessons].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        challenges: [...(existing.challenges || []), ...challenges].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        achievements: [...(existing.achievements || []), ...achievements].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        shopItems: [...(existing.shopItems || []), ...shopItems].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    };

    // Save to KV
    await CMS_DATA.put('cms_data', JSON.stringify(mergedData));

    return new Response(JSON.stringify({
        success: true,
        message: 'Seed data added successfully',
        counts: {
            lessons: mergedData.lessons.length,
            challenges: mergedData.challenges.length,
            achievements: mergedData.achievements.length,
            shopItems: mergedData.shopItems.length
        }
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
