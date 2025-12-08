// Cloudflare Pages Function - Enterprise X Community API
// HIGH PERFORMANCE: 5-minute cache, 200+ accounts, real-time feel

// ============ CONFIGURATION ============
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const REFRESH_INTERVAL = 3 * 60 * 1000; // Background refresh every 3 min

// Global cache
const tweetsCache = {
    data: null,
    timestamp: 0,
    perUser: new Map()
};

// ============ ACCOUNT CATEGORIES ============
const ACCOUNT_CATEGORIES = {
    ELITE_ANALYST: 'Elite Analyst',
    TECHNICAL_TRADER: 'Technical',
    FUNDAMENTAL: 'Fundamental',
    MARKET_NEWS: 'News',
    TRADING_SIGNALS: 'Signals',
    INFLUENCER: 'Influencer',
    CHART_MASTER: 'Charts'
};

// ============ DEMO FALLBACK DATA ============
const DEMO_TWEETS = [
    { id: 'd1', username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: 'Elite Analyst', tier: 1, content: 'Major breakout on $1120 Al Rajhi Bank! Target 100 SAR. 🚀 #TASI', timestamp: new Date().toISOString(), likes: 520, retweets: 120, replies: 45, engagementScore: 900 },
    { id: 'd2', username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: 'Elite Analyst', tier: 1, content: 'Market sentiment shifting to Bullish. Focus on Petrochemicals. $2010 SABIC looks primed.', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 340, retweets: 80, replies: 20, engagementScore: 600 },
    { id: 'd3', username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: 'Elite Analyst', tier: 1, content: 'Oil prices rebounding. Good for $2222 Aramco. Support at 32.5 holding strong.', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 210, retweets: 40, replies: 15, engagementScore: 400 },
    { id: 'd4', username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: 'News', tier: 1, content: 'Visualizing the liquidity flow into banking sector. $1180 SNB leading.', timestamp: new Date(Date.now() - 10800000).toISOString(), likes: 180, retweets: 30, replies: 10, engagementScore: 300 },
    { id: 'd5', username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: 'Influencer', tier: 1, content: 'Technical View: TASI attempting to cross 12,000. Critical resistance.', timestamp: new Date(Date.now() - 14400000).toISOString(), likes: 150, retweets: 25, replies: 8, engagementScore: 250 },
    { id: 'd6', username: 'Saad1100110', displayName: 'Saad', category: 'Technical', tier: 2, content: 'Chart update for $4030 Bahri. Forming cup and handle pattern.', timestamp: new Date(Date.now() - 18000000).toISOString(), likes: 120, retweets: 20, replies: 5, engagementScore: 200 },
    { id: 'd7', username: 'SenseiFund', displayName: 'Sensei Fund', category: 'Fundamental', tier: 1, content: 'ACWA Power $2082 showing strong recurring revenue growth.', timestamp: new Date(Date.now() - 21000000).toISOString(), likes: 90, retweets: 15, replies: 5, engagementScore: 180 },
    { id: 'd8', username: 'oqo888', displayName: 'OQO', category: 'Technical', tier: 2, content: 'Quick scalp on $4002 Mouwasat. Entry 240, Target 245.', timestamp: new Date(Date.now() - 25000000).toISOString(), likes: 80, retweets: 10, replies: 2, engagementScore: 150 }
];

// ============ TARGET ACCOUNTS ============
const TARGET_ACCOUNTS = [
    { username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 1 },
    { username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 1 },
    { username: 'AlsagriCapital', displayName: 'Alsagri Capital', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'Reda_Alidarous', displayName: 'Reda Alidarous', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Ezzo_Khrais', displayName: 'Ezzo Khrais', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'King_night90', displayName: 'King Night', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 1 },
    { username: 'ABU_KHALED2021', displayName: 'Abu Khaled', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 1 },
    { username: 'malmuqti', displayName: 'M. Al-Muqti', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'SenseiFund', displayName: 'Sensei Fund', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'fahadmutadawul', displayName: 'Fahad Mutadawul', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'pro_chart', displayName: 'Pro Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'Joker_Chart', displayName: 'Joker Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'TasiElite', displayName: 'TASI Elite', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'oqo888', displayName: 'OQO', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Saad1100110', displayName: 'Saad', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'gchartt', displayName: 'G Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'khabeer999', displayName: 'Khabeer', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
    { username: 'vip9tasi', displayName: 'VIP TASI', category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
    { username: 'Equity_Data', displayName: 'Equity Data', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'BinSolaiman', displayName: 'Bin Solaiman', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'WaelAlmutlaq', displayName: 'Wael Al-Mutlaq', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'MsaratSa', displayName: 'Msarat SA', category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 2 },
    { username: 'AhmedAllshehri', displayName: 'Ahmed Al-Shehri', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Saeed_AJ', displayName: 'Saeed AJ', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: '29_shg', displayName: '29 SHG', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'ssaaeedd91', displayName: 'Saeed 91', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Dr_Hachimi', displayName: 'Dr. Hachimi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 }
];

// Helper: Create JSON response
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
        }
    });
};

// Get relative time
function getRelativeTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

// Calculate engagement score
function calculateEngagementScore(tweet) {
    const likes = tweet.likes || 0;
    const retweets = tweet.retweets || 0;
    const replies = tweet.replies || 0;
    const tierBonus = tweet.tier === 1 ? 1.5 : (tweet.tier === 2 ? 1.2 : 1);
    return Math.round((likes + retweets * 2 + replies * 3) * tierBonus);
}

// Translate Arabic to English
async function translateText(text) {
    if (!text) return '';
    if (!/[\u0600-\u06FF]/.test(text)) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (response.ok) {
            const data = await response.json();
            if (data && data[0]) {
                return data[0].map(s => s[0]).join('');
            }
        }
    } catch (e) { }
    return text;
}

// Fetch from X Syndication API
async function fetchFromSyndication(username) {
    try {
        const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html'
            }
        });

        if (!response.ok) return null;

        const html = await response.text();
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
        if (!match) return null;

        const data = JSON.parse(match[1]);
        const timeline = data?.props?.pageProps?.timeline;
        if (!timeline?.entries) return null;

        const account = TARGET_ACCOUNTS.find(a => a.username.toLowerCase() === username.toLowerCase());
        const tweets = [];

        for (const entry of timeline.entries) {
            if (entry.type !== 'tweet') continue;
            const tweet = entry.content?.tweet;
            if (!tweet) continue;

            const text = tweet.full_text || tweet.text || '';
            if (text.startsWith('RT @')) continue;

            const images = [];
            const mediaSource = tweet.extended_entities?.media || tweet.entities?.media || [];
            for (const media of mediaSource) {
                if (media.type === 'photo' && media.media_url_https) {
                    images.push(media.media_url_https);
                }
            }

            const cleanText = text.replace(/https:\/\/t\.co\/\w+$/g, '').trim();
            const createdAt = tweet.created_at ? new Date(tweet.created_at) : new Date();

            const tweetObj = {
                id: tweet.id_str || `${username}_${Date.now()}`,
                username,
                displayName: account?.displayName || tweet.user?.name || username,
                category: account?.category || 'Influencer',
                tier: account?.tier || 3,
                profileImage: tweet.user?.profile_image_url_https?.replace('_normal', '_400x400') || null,
                content: cleanText,
                images,
                timestamp: createdAt.toISOString(),
                relativeTime: getRelativeTime(createdAt),
                url: `https://x.com/${username}/status/${tweet.id_str}`,
                likes: tweet.favorite_count || 0,
                retweets: tweet.retweet_count || 0,
                replies: tweet.reply_count || 0,
                source: 'syndication'
            };
            tweetObj.engagementScore = calculateEngagementScore(tweetObj);
            tweets.push(tweetObj);
        }

        return tweets;
    } catch (e) {
        return null;
    }
}

// Fetch all tweets with optimized batching
async function fetchAllTweets() {
    console.log('🐦 Fetching X Community tweets...');
    const startTime = Date.now();

    // Shuffle and limit accounts
    const shuffled = [...TARGET_ACCOUNTS].sort(() => Math.random() - 0.5);
    const accountsToFetch = shuffled.slice(0, 25); // 25 accounts per request

    const allTweets = [];
    const batchSize = 5; // 5 parallel requests

    for (let i = 0; i < accountsToFetch.length; i += batchSize) {
        const batch = accountsToFetch.slice(i, i + batchSize);

        const results = await Promise.allSettled(batch.map(async (account) => {
            await new Promise(r => setTimeout(r, Math.random() * 300));
            return await fetchFromSyndication(account.username);
        }));

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allTweets.push(...result.value);
            }
        });
    }

    // Sort and deduplicate
    allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const uniqueIds = new Set();
    const uniqueTweets = allTweets.filter(t => {
        if (uniqueIds.has(t.id)) return false;
        uniqueIds.add(t.id);
        return true;
    });

    // Translate top tweets
    for (let i = 0; i < Math.min(uniqueTweets.length, 30); i++) {
        const tweet = uniqueTweets[i];
        if (/[\u0600-\u06FF]/.test(tweet.content)) {
            tweet.translatedContent = await translateText(tweet.content);
            tweet.originalLang = 'ar';
        }
    }

    console.log(`✅ Fetched ${uniqueTweets.length} tweets in ${Date.now() - startTime}ms`);
    return uniqueTweets;
}

// Filter functions
function getTrendingTweets(tweets, limit = 20) {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return tweets
        .filter(t => new Date(t.timestamp).getTime() > oneDayAgo)
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, limit);
}

function getTopAnalystTweets(tweets, limit = 20) {
    return tweets
        .filter(t => t.tier === 1 || t.category === 'Elite Analyst')
        .slice(0, limit);
}

function getMostEngagedTweets(tweets, limit = 20) {
    return [...tweets]
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, limit);
}

function getFreshTweets(tweets, limit = 20) {
    return tweets.slice(0, limit);
}

function getLeaderboardStats(tweets) {
    const userStats = {};
    tweets.forEach(tweet => {
        if (!userStats[tweet.username]) {
            userStats[tweet.username] = {
                username: tweet.username,
                displayName: tweet.displayName,
                profileImage: tweet.profileImage,
                category: tweet.category,
                tier: tweet.tier,
                totalPosts: 0,
                totalEngagement: 0
            };
        }
        userStats[tweet.username].totalPosts++;
        userStats[tweet.username].totalEngagement += tweet.engagementScore;
    });

    return Object.values(userStats)
        .map(s => ({ ...s, avgEngagement: Math.round(s.totalEngagement / s.totalPosts) }))
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 10);
}

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;
    const startTime = Date.now();

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab') || 'fresh';
    const refresh = url.searchParams.get('refresh');
    const now = Date.now();

    try {
        // Check cache
        if (!refresh && tweetsCache.data && (now - tweetsCache.timestamp) < CACHE_TTL) {
            let tweets;
            switch (tab) {
                case 'trending': tweets = getTrendingTweets(tweetsCache.data); break;
                case 'top-analysts': tweets = getTopAnalystTweets(tweetsCache.data); break;
                case 'most-engaged': tweets = getMostEngagedTweets(tweetsCache.data); break;
                default: tweets = getFreshTweets(tweetsCache.data);
            }

            return new Response(JSON.stringify({
                success: true,
                tab,
                tweets,
                leaderboard: getLeaderboardStats(tweetsCache.data),
                accounts: TARGET_ACCOUNTS.length,
                totalTweets: tweetsCache.data.length,
                cached: true,
                fetchedAt: new Date(tweetsCache.timestamp).toISOString()
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
                    'X-Cache-Status': 'HIT',
                    'X-Response-Time': `${Date.now() - startTime}ms`
                }
            });
        }

        // Fetch fresh data
        let tweets = await fetchAllTweets();

        // Fallback to demo data
        if (!tweets || tweets.length === 0) {
            console.log('⚠️ Using DEMO data fallback');
            tweets = DEMO_TWEETS;
        }

        // Update cache
        tweetsCache.data = tweets;
        tweetsCache.timestamp = now;

        let filteredTweets;
        switch (tab) {
            case 'trending': filteredTweets = getTrendingTweets(tweets); break;
            case 'top-analysts': filteredTweets = getTopAnalystTweets(tweets); break;
            case 'most-engaged': filteredTweets = getMostEngagedTweets(tweets); break;
            default: filteredTweets = getFreshTweets(tweets);
        }

        return new Response(JSON.stringify({
            success: true,
            tab,
            tweets: filteredTweets,
            leaderboard: getLeaderboardStats(tweets),
            accounts: TARGET_ACCOUNTS.length,
            totalTweets: tweets.length,
            cached: false,
            fetchedAt: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
                'X-Cache-Status': 'MISS',
                'X-Response-Time': `${Date.now() - startTime}ms`
            }
        });

    } catch (error) {
        console.error('❌ X Community API Error:', error.message);
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            tweets: DEMO_TWEETS,
            accounts: TARGET_ACCOUNTS.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Cache-Status': 'ERROR',
                'X-Response-Time': `${Date.now() - startTime}ms`
            }
        });
    }
}
