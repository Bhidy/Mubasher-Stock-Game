
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Archive File Path
const ARCHIVE_FILE = path.join(__dirname, '../data/x_archive.json');
const DATA_DIR = path.dirname(ARCHIVE_FILE);

// ============ CONFIGURATION ============
const ACCOUNT_CATEGORIES = {
    ELITE_ANALYST: 'Elite Analyst',
    TECHNICAL_TRADER: 'Technical',
    FUNDAMENTAL: 'Fundamental',
    MARKET_NEWS: 'News',
    TRADING_SIGNALS: 'Signals',
    INFLUENCER: 'Influencer',
    EDUCATOR: 'Educator',
    CHART_MASTER: 'Charts'
};

const DEMO_TWEETS = [
    { id: 'd1', username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: 'Elite Analyst', tier: 1, content: 'Major breakout on $1120 Al Rajhi Bank! Target 100 SAR. 🚀 #TASI', timestamp: new Date().toISOString(), likes: 520, retweets: 120, replies: 45, engagementScore: 900 },
    { id: 'd2', username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: 'Elite Analyst', tier: 1, content: 'Market sentiment shifting to Bullish. Focus on Petrochemicals. $2010 SABIC looks primed for a move.', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 340, retweets: 80, replies: 20, engagementScore: 600 },
    { id: 'd3', username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: 'Elite Analyst', tier: 1, content: 'Oil prices rebounding. Good for $2222 Aramco. Support at 32.5 holding strong.', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 210, retweets: 40, replies: 15, engagementScore: 400 },
    { id: 'd4', username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: 'News', tier: 1, content: 'Visualizing the liquidity flow into the banking sector. $1180 SNB leading the charge.', timestamp: new Date(Date.now() - 10800000).toISOString(), likes: 180, retweets: 30, replies: 10, engagementScore: 300 },
    { id: 'd5', username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: 'Influencer', tier: 1, content: 'Technical View: TASI attempting to cross 12,000. Critical resistance. $7010 STC defensive play.', timestamp: new Date(Date.now() - 14400000).toISOString(), likes: 150, retweets: 25, replies: 8, engagementScore: 250 },
    { id: 'd6', username: 'Saad1100110', displayName: 'Saad', category: 'Technical', tier: 2, content: 'Chart update for $4030 Bahri. Forming a cup and handle. Watch for volume.', timestamp: new Date(Date.now() - 18000000).toISOString(), likes: 120, retweets: 20, replies: 5, engagementScore: 200 }
];

// FULL TARGET ACCOUNTS (Simplified for Localhost - Top 80 Most Relevant)
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
    { username: 'Drfaresalotaibi', displayName: 'Dr. Fares Al-Otaibi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Dr_Hachimi', displayName: 'Dr. Hachimi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'DrAlhamdan1', displayName: 'Dr. Al-Hamdan', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'oqo888', displayName: 'OQO', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'Saad1100110', displayName: 'Saad', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: '29_shg', displayName: '29 SHG', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    { username: 'ssaaeedd91', displayName: 'Saeed 91', category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
    { username: 'pro_chart', displayName: 'Pro Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'Joker_Chart', displayName: 'Joker Chart', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
    { username: 'TasiElite', displayName: 'TASI Elite', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Equity_Data', displayName: 'Equity Data', category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'm0ajed', displayName: 'M0ajed', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'AbuHusssain', displayName: 'Abu Hussain', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'fsawadi', displayName: 'F. Sawadi', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'moath9419', displayName: 'Moath', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'falolayan1', displayName: 'Falolayan', category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 3 },
    { username: 'Charts_Master', displayName: 'Charts', category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
    // Only keeping high quality 50 for localhost speed
    { username: 'WaelAlmutlaq', displayName: 'Wael Al-Mutlaq', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'MrSultanAbdulla', displayName: 'Sultan Abdullah', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'YasserAlofi', displayName: 'Yasser Alofi', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'alfarhan', displayName: 'Al-Farhan', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'FahdAlbogami', displayName: 'Fahd Al-Bogami', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'ammarshata', displayName: 'Ammar Shata', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'telmisany', displayName: 'Telmisany', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'boholaiga', displayName: 'Boholaiga', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'THEONEKSA', displayName: 'The One KSA', category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 }
];

// ============ MEMORY ENGINE (With File Persistence) ============
const tweetsCache = {
    data: [],
    timestamp: 0,
    perUser: {} // Store { username: { data: [], timestamp: 0 } }
};

// Load Archive on Startup
try {
    if (fs.existsSync(ARCHIVE_FILE)) {
        const fileContent = fs.readFileSync(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(fileContent);

        // Restore perUser cache
        tweetsCache.perUser = archive.perUser || {};
        // Restore main feed (flattened)
        tweetsCache.data = archive.data || [];
        tweetsCache.timestamp = archive.timestamp || Date.now();

        console.log(`📂 Loaded X Archive: ${tweetsCache.data.length} tweets from disk.`);
    }
} catch (e) {
    console.warn('⚠️ Failed to load X Archive:', e.message);
}

// Helper: Save Cache to Disk
function saveToArchive() {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

        // Save the whole state
        fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(tweetsCache, null, 2));
        // console.log('💾 Saved X Archive to disk');
    } catch (e) {
        console.error('❌ Failed to save X Archive:', e.message);
    }
}

// HELPER: Translation
function isArabic(text) { return /[\u0600-\u06FF]/.test(text); }

async function translateText(text) {
    if (!text || text.length < 3) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
        if (response.data && response.data[0]) {
            return response.data[0].map(part => part[0]).filter(Boolean).join('') || text;
        }
        return text;
    } catch { return text; }
}

async function translateTweetContent(tweet) {
    if (!isArabic(tweet.content)) {
        return { ...tweet, originalLang: 'en', isTranslated: false };
    }
    try {
        const translatedContent = await translateText(tweet.content);
        return { ...tweet, content: translatedContent, originalContent: tweet.content, originalLang: 'ar', isTranslated: true };
    } catch {
        return { ...tweet, originalLang: 'ar', isTranslated: false };
    }
}

// HELPER: Fetch Tweet
async function fetchFromSyndication(username) {
    try {
        const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 8000
        });

        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (!nextDataScript) return null;

        const data = JSON.parse(nextDataScript);
        const timeline = data?.props?.pageProps?.timeline?.entries || [];

        const account = TARGET_ACCOUNTS.find(a => a.username.toLowerCase() === username.toLowerCase());
        const tweets = [];

        // === QUALITY FILTER ===
        const isValidTweet = (text, hasMedia) => {
            if (hasMedia) return true;
            if (text.length < 15) return false;
            // Keywords map to financial context
            const KEYWORDS = ['tasi', 'stock', 'market', 'price', 'sar', 'profit', 'chart', 'analy', 'invest', 'fund', 'dividend', 'sector', 'company', 'bull', 'bear', 'support', 'resist', 'target', 'سوق', 'اسهم', 'تاسي', 'سهم', 'تداول', 'تحليل', 'فني', 'مالي', 'ارباح', 'توزيعات', 'نمو', 'محفظة', 'استثمار', 'مضاربة', 'صفقة', 'توصية', 'دعم', 'مقاومة', 'هدف', 'وقف', 'سيولة', 'مؤشر', 'book', 'lesson', 'learn', 'strategy', 'درس', 'تعلم', 'استراتيجية'];

            if (/\b\d{4}\b/.test(text)) return true;
            return KEYWORDS.some(k => text.toLowerCase().includes(k));
        };

        for (const entry of timeline) {
            if (entry.type !== 'tweet') continue;
            const tweet = entry.content?.tweet;
            if (!tweet) continue;

            const images = [];
            const mediaSource = tweet.extended_entities?.media || tweet.entities?.media || [];
            for (const media of mediaSource) { if (media.type === 'photo') images.push(media.media_url_https); }

            const text = tweet.full_text || tweet.text || '';
            if (text.startsWith('RT @')) continue;

            const cleanText = text.replace(/https:\/\/t\.co\/\w+$/g, '').trim();

            const isElite = account?.category === ACCOUNT_CATEGORIES.ELITE_ANALYST;
            // Apply filter unless Elite or Chart Master
            if (!isElite && !isValidTweet(cleanText, images.length > 0)) continue;

            const tweetObj = {
                id: tweet.id_str,
                username,
                displayName: account?.displayName || username,
                category: account?.category || 'Influencer',
                tier: account?.tier || 3,
                profileImage: tweet.user?.profile_image_url_https?.replace('_normal', '_400x400'),
                content: cleanText,
                images,
                timestamp: new Date(tweet.created_at).toISOString(),
                url: `https://x.com/${username}/status/${tweet.id_str}`,
                likes: tweet.favorite_count || 0,
                retweets: tweet.retweet_count || 0,
                replies: tweet.reply_count || 0,
                source: 'syndication'
            };
            tweetObj.engagementScore = tweetObj.likes + (tweetObj.retweets * 2) + (tweetObj.replies * 1.5);
            tweets.push(tweetObj);
        }
        return tweets;
    } catch { return null; }
}

// === CUMULATIVE CACHE (HISTORY ENGINE) ===
async function fetchUserTweets(account) {
    const cached = tweetsCache.perUser[account.username];
    // Cache valid for 10 mins locally
    if (cached && (Date.now() - cached.timestamp) < (10 * 60 * 1000)) return cached.data;

    const newTweets = await fetchFromSyndication(account.username);
    if (newTweets?.length) {
        const existing = cached?.data || [];
        const existingIds = new Set(existing.map(t => t.id));
        const uniqueNew = newTweets.filter(t => !existingIds.has(t.id));
        // Keep last 100 tweets
        const merged = [...uniqueNew, ...existing].slice(0, 100);

        tweetsCache.perUser[account.username] = {
            data: merged,
            timestamp: Date.now()
        };

        // SAVE TO DISK
        saveToArchive();

        return merged;
    }
    return cached?.data || [];
}

// ROUTE HANDLER
router.get('/', async (req, res) => {
    try {
        console.log('🐦 Localhost: Fetching X Community V2...');
        let accounts = [...TARGET_ACCOUNTS];

        // Fisher-Yates Shuffle
        for (let i = accounts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [accounts[i], accounts[j]] = [accounts[j], accounts[i]];
        }

        // Fetch 5 accounts in parallel (Debug Mode)
        const sample = accounts.slice(0, 5);
        const allTweets = [];

        const promises = sample.map(async acc => {
            // Random jitter 0-500ms
            await new Promise(r => setTimeout(r, Math.random() * 500));
            return fetchUserTweets(acc);
        });

        const results = await Promise.allSettled(promises);
        results.forEach(r => { if (r.value) allTweets.push(...r.value); });

        // Sort
        allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Translate Stats (SKIP for debug speed)
        console.log(`Translate skipped for debug`);
        // const topTweets = allTweets.slice(0, 30);
        // const translated = await Promise.all(topTweets.map(translateTweetContent));
        let finalTweets = allTweets; // [...translated, ...allTweets.slice(30)];

        if (finalTweets.length === 0) {
            console.log('⚠️ No live tweets found. Using DEMO data.');
            finalTweets = DEMO_TWEETS;
        }

        // Mock Leaderboard derived from Account List
        const leaderboard = TARGET_ACCOUNTS.filter(a => a.tier === 1).slice(0, 5).map((acc, i) => ({
            ...acc, rank: i + 1, engagementScore: 9000 - (i * 500)
        }));

        res.json({
            tweets: finalTweets,
            leaderboard,
            stats: { total: finalTweets.length }
        });

    } catch (e) {
        console.error("X Community Error:", e.message);
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});

module.exports = router;
