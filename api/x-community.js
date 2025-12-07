import axios from 'axios';
import * as cheerio from 'cheerio';

// Version: 1.0.0 - X Community API with Twitter Syndication
// Deployed: 2025-12-08

// ============ CONFIGURATION ============
const TARGET_ACCOUNTS = [
    { username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: 'Trading' },
    { username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: 'Finance' },
    { username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: 'Markets' },
    { username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: 'Trading' },
    { username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: 'Insights' },
    { username: 'AlsagriCapital', displayName: 'Alsagri Capital', category: 'Capital' },
    { username: 'Reda_Alidarous', displayName: 'Reda Alidarous', category: 'Analysis' },
    { username: 'Ezzo_Khrais', displayName: 'Ezzo Khrais', category: 'Markets' },
    { username: 'King_night90', displayName: 'King Night', category: 'Trading' },
    { username: 'ABU_KHALED2021', displayName: 'Abu Khaled', category: 'Investing' }
];

// ============ IN-MEMORY CACHE ============
const tweetsCache = {
    data: null,
    timestamp: 0,
    perUser: {}
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PER_USER_CACHE_TTL = 3 * 60 * 1000; // 3 minutes per user

// ============ HELPER FUNCTIONS ============

// Check if text contains Arabic characters
function isArabic(text) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
}

// Translate text using Google Translate (free method)
async function translateText(text, targetLang = 'en') {
    if (!text || text.length < 3) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });

        if (response.data && response.data[0]) {
            const translated = response.data[0]
                .map(part => part[0])
                .filter(Boolean)
                .join('');
            return translated || text;
        }
        return text;
    } catch (error) {
        console.log(`⚠️ Translation failed: ${error.message}`);
        return text; // Return original on error
    }
}

// Translate Arabic content to English
async function translateTweetContent(tweet) {
    if (!isArabic(tweet.content)) {
        return { ...tweet, originalLang: 'en', isTranslated: false };
    }

    try {
        const translatedContent = await translateText(tweet.content, 'en');
        return {
            ...tweet,
            content: translatedContent,
            originalContent: tweet.content, // Keep original for reference
            originalLang: 'ar',
            isTranslated: true
        };
    } catch (error) {
        return { ...tweet, originalLang: 'ar', isTranslated: false };
    }
}

// Calculate relative time
function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fetch tweets using Twitter Syndication API (Embed endpoint)
async function fetchFromSyndication(username) {
    try {
        console.log(`📡 Fetching @${username} via Twitter Syndication API...`);

        const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 15000
        });

        // Parse the HTML to extract __NEXT_DATA__ JSON
        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();

        if (!nextDataScript) {
            console.log(`❌ No __NEXT_DATA__ found for @${username}`);
            return null;
        }

        const data = JSON.parse(nextDataScript);
        const timeline = data?.props?.pageProps?.timeline;

        if (!timeline || !timeline.entries || timeline.entries.length === 0) {
            console.log(`❌ No timeline entries for @${username}`);
            return null;
        }

        const account = TARGET_ACCOUNTS.find(a => a.username.toLowerCase() === username.toLowerCase());
        const tweets = [];

        for (const entry of timeline.entries) {
            if (entry.type !== 'tweet') continue;

            const tweet = entry.content?.tweet;
            if (!tweet) continue;

            // Extract images
            const images = [];
            if (tweet.extended_entities?.media) {
                for (const media of tweet.extended_entities.media) {
                    if (media.type === 'photo' && media.media_url_https) {
                        images.push(media.media_url_https);
                    }
                }
            } else if (tweet.entities?.media) {
                for (const media of tweet.entities.media) {
                    if (media.type === 'photo' && media.media_url_https) {
                        images.push(media.media_url_https);
                    }
                }
            }

            // Get tweet text (prefer full_text)
            const text = tweet.full_text || tweet.text || '';

            // Skip retweets
            if (text.startsWith('RT @')) continue;

            // Parse the created_at date
            const createdAt = tweet.created_at ? new Date(tweet.created_at) : new Date();

            tweets.push({
                id: tweet.id_str || entry.entry_id?.replace('tweet-', '') || `${username}_${Date.now()}`,
                username: username,
                displayName: account?.displayName || tweet.user?.name || username,
                category: account?.category || 'Trading',
                profileImage: tweet.user?.profile_image_url_https?.replace('_normal', '_400x400') || null,
                content: text.replace(/https:\/\/t\.co\/\w+$/g, '').trim(), // Remove trailing t.co links
                images: images,
                timestamp: createdAt.toISOString(),
                relativeTime: getRelativeTime(createdAt),
                url: `https://x.com/${username}/status/${tweet.id_str}`,
                likes: tweet.favorite_count || 0,
                retweets: tweet.retweet_count || 0,
                replies: tweet.reply_count || 0,
                source: 'syndication'
            });
        }

        console.log(`✅ Fetched ${tweets.length} tweets for @${username}`);
        return tweets;

    } catch (error) {
        console.log(`❌ Failed to fetch @${username}: ${error.message}`);
        return null;
    }
}

// Fetch tweets for a user with caching
async function fetchUserTweets(account) {
    const { username } = account;

    // Check per-user cache first
    const cached = tweetsCache.perUser[username];
    if (cached && (Date.now() - cached.timestamp) < PER_USER_CACHE_TTL) {
        return cached.data;
    }

    // Fetch from Syndication API
    const tweets = await fetchFromSyndication(username);

    if (tweets && tweets.length > 0) {
        tweetsCache.perUser[username] = {
            data: tweets,
            timestamp: Date.now()
        };
        return tweets;
    }

    // Return cached data if available (even if stale)
    if (cached) {
        return cached.data;
    }

    return [];
}

// Fetch all tweets from all accounts
async function fetchAllTweets() {
    console.log('🐦 Fetching X Community tweets via Syndication API...');

    const allTweets = [];
    const batchSize = 2; // Process 2 users at a time to avoid rate limits

    for (let i = 0; i < TARGET_ACCOUNTS.length; i += batchSize) {
        const batch = TARGET_ACCOUNTS.slice(i, i + batchSize);
        const results = await Promise.allSettled(
            batch.map(account => fetchUserTweets(account))
        );

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allTweets.push(...result.value);
            }
        });

        // Small delay between batches
        if (i + batchSize < TARGET_ACCOUNTS.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Sort by timestamp (newest first)
    allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Translate Arabic tweets to English (in batches to avoid rate limits)
    console.log('🌐 Translating Arabic content to English...');
    const translatedTweets = [];
    const translateBatchSize = 3;

    for (let i = 0; i < allTweets.length; i += translateBatchSize) {
        const batch = allTweets.slice(i, i + translateBatchSize);
        const translated = await Promise.all(
            batch.map(tweet => translateTweetContent(tweet))
        );
        translatedTweets.push(...translated);

        // Small delay between translation batches
        if (i + translateBatchSize < allTweets.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    console.log(`✅ Total: ${translatedTweets.length} tweets from X Community (translated)`);
    return translatedTweets;
}

// ============ API HANDLER ============
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { username, refresh } = req.query;
    const now = Date.now();

    try {
        // Single user request
        if (username) {
            const account = TARGET_ACCOUNTS.find(a =>
                a.username.toLowerCase() === username.toLowerCase()
            );

            if (!account) {
                return res.status(404).json({
                    error: 'User not found',
                    availableUsers: TARGET_ACCOUNTS.map(a => a.username)
                });
            }

            const tweets = await fetchUserTweets(account);
            return res.status(200).json({
                success: true,
                user: account,
                tweets: tweets,
                count: tweets.length,
                cached: false,
                fetchedAt: new Date().toISOString()
            });
        }

        // Full community feed - check cache
        if (!refresh && tweetsCache.data && (now - tweetsCache.timestamp) < CACHE_TTL) {
            console.log(`📦 Serving X Community from cache (${Math.round((now - tweetsCache.timestamp) / 1000)}s old)`);
            res.setHeader('X-Cache', 'HIT');
            res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');
            return res.status(200).json({
                success: true,
                tweets: tweetsCache.data,
                accounts: TARGET_ACCOUNTS,
                count: tweetsCache.data.length,
                cached: true,
                cacheAge: Math.round((now - tweetsCache.timestamp) / 1000),
                nextRefresh: Math.round((CACHE_TTL - (now - tweetsCache.timestamp)) / 1000),
                fetchedAt: new Date(tweetsCache.timestamp).toISOString()
            });
        }

        // Fetch fresh data
        const tweets = await fetchAllTweets();

        // Update cache
        tweetsCache.data = tweets;
        tweetsCache.timestamp = now;

        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');

        return res.status(200).json({
            success: true,
            tweets: tweets,
            accounts: TARGET_ACCOUNTS,
            count: tweets.length,
            cached: false,
            fetchedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ X Community API Error:', error.message);

        // Return cached data if available
        if (tweetsCache.data) {
            res.setHeader('X-Cache', 'STALE');
            return res.status(200).json({
                success: true,
                tweets: tweetsCache.data,
                accounts: TARGET_ACCOUNTS,
                count: tweetsCache.data.length,
                cached: true,
                stale: true,
                error: error.message,
                fetchedAt: new Date(tweetsCache.timestamp).toISOString()
            });
        }

        return res.status(500).json({
            success: false,
            error: error.message,
            tweets: [],
            accounts: TARGET_ACCOUNTS
        });
    }
}
