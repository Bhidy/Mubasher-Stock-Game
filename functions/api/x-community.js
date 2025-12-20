// Cloudflare Pages Function - X Community API (Scraper & Aggregator)
// V3.3: Backend Tickers + Enhanced Translation + Keyword Fixes

// ============ CONFIGURATION ============
const CACHE_TTL_SECONDS = 300;
const BATCH_SIZE = 25;

// ============ IN-MEMORY STORAGE ============
let TWEET_STORE = new Map();
let LAST_FETCH_TIMESTAMP = 0;

// ============ TARGET ACCOUNTS ============
const TARGET_ACCOUNTS = [
    // --- ELITE ANALYSTS (Tier 1) ---
    { username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: 'Elite Analyst', tier: 1 },
    { username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: 'Elite Analyst', tier: 1 },
    { username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: 'Elite Analyst', tier: 1 },
    { username: 'Reda_Alidarous', displayName: 'Reda Alidarous', category: 'Elite Analyst', tier: 1 },
    { username: 'Ezzo_Khrais', displayName: 'Ezzo Khrais', category: 'Elite Analyst', tier: 1 },
    { username: 'malmuqti', displayName: 'M. Al-Muqti', category: 'Elite Analyst', tier: 1 },
    { username: 'fahadmutadawul', displayName: 'Fahad Mutadawul', category: 'Elite Analyst', tier: 1 },
    { username: 'Drfaresalotaibi', displayName: 'Dr. Fares Al-Otaibi', category: 'Elite Analyst', tier: 1 },
    { username: 'Dr_Hachimi', displayName: 'Dr. Hachimi', category: 'Elite Analyst', tier: 1 },
    { username: 'TasiElite', displayName: 'TASI Elite', category: 'Elite Analyst', tier: 1 },

    // --- NEWS & FUNDAMENTALS (Tier 1) ---
    { username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: 'News', tier: 1 },
    { username: 'AlsagriCapital', displayName: 'Alsagri Capital', category: 'Fundamental', tier: 1 },
    { username: 'SenseiFund', displayName: 'Sensei Fund', category: 'Fundamental', tier: 1 },
    { username: 'DrAlhamdan1', displayName: 'Dr. Al-Hamdan', category: 'Fundamental', tier: 1 },
    { username: 'Equity_Data', displayName: 'Equity Data', category: 'Fundamental', tier: 1 },

    // --- TECHNICAL TRADERS (Tier 2) ---
    { username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: 'Technical', tier: 2 },
    { username: 'King_night90', displayName: 'King Night', category: 'Technical', tier: 2 },
    { username: 'oqo888', displayName: 'OQO', category: 'Technical', tier: 2 },
    { username: 'Saad1100110', displayName: 'Saad', category: 'Technical', tier: 2 },
    { username: 'ssaaeedd91', displayName: 'Saeed 91', category: 'Technical', tier: 2 },
    { username: 'sadoon72', displayName: 'Sadoon', category: 'Technical', tier: 2 },
    { username: 'AhmedAllshehri', displayName: 'Ahmed Al-Shehri', category: 'Technical', tier: 2 },
    { username: 'Saeed_AJ', displayName: 'Saeed AJ', category: 'Technical', tier: 2 },
    { username: 'saud_almutair', displayName: 'Saud Al-Mutair', category: 'Technical', tier: 2 },
    { username: '_doje_', displayName: 'Doje', category: 'Technical', tier: 2 },
    { username: 'alomar66664', displayName: 'Al-Omar', category: 'Technical', tier: 2 },

    // --- CHART MASTERS (Tier 2) ---
    { username: '29_shg', displayName: '29 SHG', category: 'Charts', tier: 2 },
    { username: 'LAMMMAH', displayName: 'LAMMMAH', category: 'Charts', tier: 2 },
    { username: 'S3Dwave', displayName: 'S3D Wave', category: 'Charts', tier: 2 },
    { username: 'Analysis2020', displayName: 'Analysis 2020', category: 'Charts', tier: 2 },
    { username: 'pro_chart', displayName: 'Pro Chart', category: 'Charts', tier: 2 },
    { username: 'Joker_Chart', displayName: 'Joker Chart', category: 'Charts', tier: 2 },
    { username: 'Chart511', displayName: 'Chart 511', category: 'Charts', tier: 2 },
    { username: 'gchartt', displayName: 'G Chart', category: 'Charts', tier: 2 },
    { username: 'ociechart', displayName: 'OCIE Chart', category: 'Charts', tier: 2 },
    { username: 'chartsniper666', displayName: 'Chart Sniper', category: 'Charts', tier: 2 },

    // --- SIGNALS & INFLUENCERS (Tier 3 - Large Pool) ---
    { username: 'ABU_KHALED2021', displayName: 'Abu Khaled', category: 'Signals', tier: 3 },
    { username: 'khabeer999', displayName: 'Khabeer', category: 'Signals', tier: 3 },
    { username: 'vip9tasi', displayName: 'VIP TASI', category: 'Signals', tier: 3 },
    { username: 'hamdjy2479', displayName: 'Hamdjy', category: 'Signals', tier: 3 },
    { username: 'ADEL7i', displayName: 'Adel 7i', category: 'Signals', tier: 3 },
    { username: 'haddaj11', displayName: 'Haddaj', category: 'Signals', tier: 3 },
    { username: 'fnfefn', displayName: 'FNFEFN', category: 'Signals', tier: 3 },
    { username: 'moshaks1111', displayName: 'Moshaks', category: 'Signals', tier: 3 },
    { username: 'amerALshehri6', displayName: 'Amer Al-Shehri', category: 'Signals', tier: 3 },
    { username: 'vip_2000_vip', displayName: 'VIP 2000', category: 'Signals', tier: 3 },
    { username: 'Sahmm404', displayName: 'Sahmm 404', category: 'Signals', tier: 3 },
    { username: 'saudsend', displayName: 'Saud Send', category: 'Signals', tier: 3 },
    { username: 'mesk_tdl', displayName: 'Mesk TDL', category: 'Signals', tier: 3 },
    { username: 'stocktrad1', displayName: 'Stock Trad', category: 'Signals', tier: 3 },
    { username: 'MR_Stock10', displayName: 'MR Stock', category: 'Signals', tier: 3 },

    // --- GENERAL INFLUENCERS ---
    { username: 'Mohmed123654', displayName: 'Mohammed', category: 'Influencer', tier: 3 },
    { username: 'm0ajed', displayName: 'M0ajed', category: 'Influencer', tier: 3 },
    { username: 'AbuHusssain', displayName: 'Abu Hussain', category: 'Influencer', tier: 3 },
    { username: 'fsawadi', displayName: 'F. Sawadi', category: 'Influencer', tier: 3 },
    { username: 'Albasatah2030', displayName: 'Al-Basatah 2030', category: 'Influencer', tier: 3 },
    { username: 'ph_moklaf', displayName: 'PH Moklaf', category: 'Influencer', tier: 3 },
    { username: 'moath9419', displayName: 'Moath', category: 'Influencer', tier: 3 },
    { username: 'falolayan1', displayName: 'Falolayan', category: 'Influencer', tier: 3 },
    { username: 'cheef_sonson', displayName: 'Cheef Sonson', category: 'Influencer', tier: 3 },
    { username: 'obunawaf2', displayName: 'Obunawaf', category: 'Influencer', tier: 3 },
    { username: 'abu_khalid111', displayName: 'Abu Khalid 111', category: 'Influencer', tier: 3 },
    { username: 'kh_alkhayari', displayName: 'KH Al-Khayari', category: 'Influencer', tier: 3 },
    { username: 'al3a9ef', displayName: 'Al3a9ef', category: 'Influencer', tier: 3 },
    { username: 'Jamalaa11', displayName: 'Jamalaa', category: 'Influencer', tier: 3 },
    { username: 'alghaziw', displayName: 'Al-Ghazi', category: 'Influencer', tier: 3 },
    { username: 'el2aham', displayName: 'El2aham', category: 'Influencer', tier: 3 },
    { username: 'alnagem60', displayName: 'Al-Nagem 60', category: 'Influencer', tier: 3 },
    { username: 'heshamnaser2012', displayName: 'Hesham Naser', category: 'Influencer', tier: 3 }
];
// ============ FALLBACK DEMO DATA ============
// Simulates "Translated" state: Content is English, Original is Arabic
const DEMO_TWEETS = [
    {
        id: 'd1', username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: 'Elite Analyst', tier: 1,
        content: 'Major breakout on $1120 Al Rajhi Bank! Target 100 SAR. 🚀 #TASI',
        originalContent: 'اختراق كبير لسهم الراجحي 1120! الهدف 100 ريال. 🚀 #تاسي',
        timestamp: new Date().toISOString(), likes: 520, retweets: 120, replies: 45, engagementScore: 900, images: [],
        isTranslated: true
    },
    {
        id: 'd2', username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: 'Elite Analyst', tier: 1,
        content: 'Market sentiment shifting to Bullish on SABIC $2010. Accumulation zone.',
        originalContent: 'مشاعر السوق تتحول إلى إيجابية على سابك 2010. منطقة تجميع.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 340, retweets: 80, replies: 20, engagementScore: 600, images: [],
        isTranslated: true
    },
    {
        id: 'd3', username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: 'Elite Analyst', tier: 1,
        content: 'Oil prices rebounding ($CL_F). Good for $2222 Aramco and Petrochemicals.',
        originalContent: 'أسعار النفط ترتفع ($CL_F). جيد لأرامكو 2222 والبتروكيماويات.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 210, retweets: 40, replies: 15, engagementScore: 400, images: [],
        isTranslated: true
    },
];

// ============ SENTIMENT LOGIC ============
function calculateSentiment(tweets) {
    let bull = 0, bear = 0, neut = 0;

    // Comprehensive Keywords (Detailed per User Request)
    const bullishKeywords = [
        'bull', 'buy', 'long', 'profit', 'green', 'breakout', 'support', 'positive', 'target', 'entry', 'potential',
        'شراء', 'صعود', 'ارتفاع', 'تحرك للاعلي', // User Priorities
        'ايجابي', 'دعم', 'اختراق', 'اهداف', 'فرصة', 'ربح', 'ممتاز', 'دخول', 'فوق', 'قمة'
    ];
    const bearishKeywords = [
        'bear', 'sell', 'short', 'loss', 'red', 'breakdown', 'resistance', 'negative', 'drop', 'crash', 'avoid',
        'بيع', 'هبوط', 'انخفاض', 'تحرك للاسفل', // User Priorities
        'سلبي', 'نزول', 'مقاومة', 'كسر', 'خسارة', 'حذر', 'سلبية', 'تراجع', 'تصحيح', 'تحت', 'قاع'
    ];

    tweets.forEach(t => {
        // Check both original and translated content
        // Normalize: remove special chars, lowercase
        const text = (t.content + ' ' + (t.originalContent || '')).toLowerCase();

        const isBull = bullishKeywords.some(k => text.includes(k));
        const isBear = bearishKeywords.some(k => text.includes(k));

        if (isBull && !isBear) bull++;
        else if (isBear && !isBull) bear++;
        else neut++;
    });

    const total = bull + bear + neut;
    const score = total > 0 ? Math.round(((bull + (0.5 * neut)) / total) * 100) : 50;

    return {
        score,
        bullish: bull,
        bearish: bear,
        neutral: neut,
        total
    };
}

// ============ HOT TICKERS LOGIC (BACKEND) ============
function calculateHotTickers(tweets) {
    const mentionCounts = {};

    tweets.forEach(t => {
        // Match TASI codes (4 digits) and $TICKER
        // Regex: 4 digits word boundary OR $ followed by 2-5 chars
        const matches = t.content.match(/\b\d{4}\b|\$[A-Z]{2,5}/g);
        if (matches) {
            matches.forEach(m => {
                const ticker = m.toUpperCase();
                mentionCounts[ticker] = (mentionCounts[ticker] || 0) + 1;
            });
        }

        // Also check original content for Arabic tweets that might have numbers
        if (t.originalContent) {
            const matchesOrig = t.originalContent.match(/\b\d{4}\b/g); // Just codes in Arabic text
            if (matchesOrig) {
                matchesOrig.forEach(m => {
                    mentionCounts[m] = (mentionCounts[m] || 0) + 1;
                });
            }
        }
    });

    return Object.entries(mentionCounts)
        .sort((a, b) => b[1] - a[1]) // Sort desc by count
        .slice(0, 5) // Top 5
        .map(([s, c]) => ({ symbol: s, name: s, count: c }));
}

// ============ HELPER: Translate Text ============
function isArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// Robust Translation
async function translateText(text) {
    if (!text || text.length < 3) return text;
    try {
        // Use a random generic User-Agent to avoid simple blocking
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!res.ok) return text;

        const data = await res.json();
        if (data && data[0]) {
            const translatedText = data[0].map(part => part[0]).filter(Boolean).join('');
            return translatedText || text;
        }
        return text;
    } catch (e) {
        // console.error(e); 
        return text; // Fail safe
    }
}

// ============ HELPER: Scrape User Tweets ============
async function fetchUserTweets(account) {
    try {
        const syndicationUrl = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${account.username}`;

        const agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
        ];
        const agent = agents[Math.floor(Math.random() * agents.length)];

        const res = await fetch(syndicationUrl, {
            headers: {
                'User-Agent': agent,
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache'
            }
        });

        if (!res.ok) return [];

        const html = await res.text();
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
        if (!match || !match[1]) return [];

        const data = JSON.parse(match[1]);
        const timeline = data?.props?.pageProps?.timeline?.entries;
        if (!timeline || !Array.isArray(timeline)) return [];

        // Pre-process tweets
        const tweets = timeline
            .filter(entry => entry.type === 'tweet')
            .map(entry => {
                const t = entry.content?.tweet;
                if (!t) return null;

                const text = t.full_text || t.text || '';
                if (text.startsWith('RT @')) return null;

                const images = (t.entities?.media || [])
                    .filter(m => m.type === 'photo')
                    .map(m => m.media_url_https);

                const createdAt = t.created_at ? new Date(t.created_at) : new Date();

                return {
                    id: t.id_str,
                    username: account.username,
                    displayName: account.displayName,
                    category: account.category,
                    tier: account.tier,
                    profileImage: t.user?.profile_image_url_https?.replace('_normal', '_400x400'),
                    content: text,
                    originalContent: text,
                    images: images,
                    timestamp: createdAt.toISOString(),
                    relativeTime: getRelativeTime(createdAt),
                    url: `https://x.com/${account.username}/status/${t.id_str}`,
                    likes: t.favorite_count || 0,
                    retweets: t.retweet_count || 0,
                    replies: t.reply_count || 0,
                    engagementScore: (t.favorite_count || 0) + ((t.retweet_count || 0) * 2) + ((t.reply_count || 0) * 3),
                    market: 'SA',
                    isTranslated: false
                };
            })
            .filter(Boolean);

        return tweets;
    } catch (e) {
        return [];
    }
}

function getRelativeTime(date) {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
}

// ============ MAIN HANDLER ============
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    const { tab = 'fresh', refresh, market = 'SA' } = Object.fromEntries(url.searchParams);

    try {
        const shuffled = [...TARGET_ACCOUNTS].sort(() => 0.5 - Math.random());
        const batch = shuffled.slice(0, BATCH_SIZE);

        const results = await Promise.allSettled(batch.map(fetchUserTweets));
        let newTweets = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value);

        // --- TRANSLATION STEP ---
        // Force translation attempt on ALL NEW Arabic tweets in batch, not just top 15
        // Just be careful with timing. Let's do top 20.
        const tweetsToTranslate = newTweets.slice(0, 20);
        const translatedBatch = await Promise.all(tweetsToTranslate.map(async (t) => {
            if (isArabic(t.content) && !t.isTranslated) {
                const translated = await translateText(t.content);
                // Check if translation actually changed anything
                if (translated !== t.content) {
                    return {
                        ...t,
                        content: translated,
                        // Preserve original if not already set (it is set in fetch)
                        isTranslated: true
                    };
                }
            }
            return t;
        }));

        const processedTweets = [
            ...translatedBatch,
            ...newTweets.slice(20)
        ];

        // Update Store
        processedTweets.forEach(t => {
            TWEET_STORE.set(t.id, t);
        });

        if (TWEET_STORE.size < 5) {
            DEMO_TWEETS.forEach(t => TWEET_STORE.set(t.id, t));
        }

        let allTweets = Array.from(TWEET_STORE.values());
        allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // --- BACKEND ANALYTICS (ON ALL DATA) ---
        const sentiment = calculateSentiment(allTweets);
        const hotTickers = calculateHotTickers(allTweets); // New: Calculate tickers backend

        let filteredTweets = allTweets;
        if (tab === 'trending') {
            filteredTweets = allTweets
                .filter(t => t.engagementScore > 10)
                .sort((a, b) => b.engagementScore - a.engagementScore);
        } else if (tab === 'top-analysts') {
            filteredTweets = allTweets.filter(t => t.tier === 1);
        } else if (tab === 'most-engaged') {
            filteredTweets = [...allTweets].sort((a, b) => b.engagementScore - a.engagementScore);
        } else {
            filteredTweets = allTweets;
        }

        const finalTweets = filteredTweets.slice(0, 100);

        const leaderboardStats = {};
        allTweets.forEach(t => {
            if (!leaderboardStats[t.username]) {
                leaderboardStats[t.username] = {
                    username: t.username,
                    displayName: t.displayName,
                    profileImage: t.profileImage,
                    totalPosts: 0,
                    totalEngagement: 0
                };
            }
            leaderboardStats[t.username].totalPosts++;
            leaderboardStats[t.username].totalEngagement += t.engagementScore;
        });

        const leaderboard = Object.values(leaderboardStats)
            .sort((a, b) => b.totalEngagement - a.totalEngagement)
            .slice(0, 10);

        return new Response(JSON.stringify({
            success: true,
            tab,
            tweets: finalTweets,
            leaderboard: leaderboard,
            sentiment: sentiment,
            hotTickers: hotTickers, // Sending backend calculated tickers
            analystsTracked: TARGET_ACCOUNTS.length,
            batchSize: batch.length,
            totalStored: TWEET_STORE.size,
            fetchedAt: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: err.message,
            tweets: DEMO_TWEETS
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}
