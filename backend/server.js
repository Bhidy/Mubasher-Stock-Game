
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { updateStockPrices, getStocks, SAUDI_STOCKS, EGYPT_STOCKS, GLOBAL_TICKERS } = require('./jobs/updateStockPrices');
const { updateStockProfiles } = require('./jobs/updateStockProfiles');
const { startScheduler: startNewsScheduler, getCachedNews } = require('./jobs/newsScraper');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy for Images (to bypass CORS/Hotlinking protection)
app.get('/api/proxy-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send('URL required');

        const axios = require('axios');
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': new URL(url).origin
            }
        });

        res.set('Content-Type', response.headers['content-type']);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.send(response.data);
    } catch (e) {
        res.redirect('https://placehold.co/600x400/f1f5f9/475569?text=Image+Error');
    }
});

// Update Jobs
const updateAllData = async () => {
    console.log('⚡ Starting high-frequency price updates (every 5s)...');

    // Initial Price Update
    await updateStockPrices();

    // Profile Update (All Markets) - Run once on startup
    const allSymbols = [...SAUDI_STOCKS, ...EGYPT_STOCKS, ...GLOBAL_TICKERS.filter(s => !s.startsWith('^'))];
    updateStockProfiles(allSymbols);
};

updateAllData();

// Routes
app.get('/', (req, res) => {
    res.send('Mubasher Stock Game API is Live! 🚀');
});

// Get stocks with market filter
app.get('/api/stocks', (req, res) => {
    const { market } = req.query;
    let stocks = getStocks();

    // Filter by market if specified
    if (market === 'SA') {
        stocks = stocks.filter(s => s.symbol.endsWith('.SR') || s.symbol.includes('TASI'));
    } else if (market === 'EG') {
        stocks = stocks.filter(s => s.symbol.endsWith('.CA') || s.symbol.includes('CASE') || s.symbol.includes('EGX'));
    } else if (market === 'Global') {
        stocks = stocks.filter(s => !s.symbol.endsWith('.SR') && !s.symbol.endsWith('.CA'));
    }

    res.json(stocks);
});

// Get Chart Data
app.get('/api/chart', async (req, res) => {
    const { symbol, range = '1d' } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        const yahooFinance = require('yahoo-finance2').default;

        let interval = '1d';
        let queryRange = range;

        // Map frontend ranges to Yahoo API standard
        switch (range) {
            case '1D': queryRange = '1d'; interval = '5m'; break;
            case '5D': queryRange = '5d'; interval = '15m'; break;
            case '1M': queryRange = '1mo'; interval = '60m'; break;
            case '6M': queryRange = '6mo'; interval = '1d'; break;
            case 'YTD': queryRange = 'ytd'; interval = '1d'; break;
            case '1Y': queryRange = '1y'; interval = '1d'; break;
            case '5Y': queryRange = '5y'; interval = '1wk'; break;
            case 'Max': queryRange = 'max'; interval = '1mo'; break;
            default: queryRange = '1d'; interval = '5m';
        }

        const result = await yahooFinance.chart(symbol, {
            period1: '2020-01-01', // Required by validation, overridden by range
            range: queryRange,
            interval: interval,
            includePrePost: false
        });

        // Filter and map only necessary data to save bandwidth
        const data = (result.quotes || []).map(q => ({
            date: q.date,
            price: q.close || q.open // Fallback if close is missing
        })).filter(q => q.price != null);

        res.json({
            symbol: result.meta.symbol,
            currency: result.meta.currency,
            granularity: result.meta.dataGranularity,
            range: result.meta.range,
            quotes: data
        });

    } catch (error) {
        console.error(`Chart fetch error for ${symbol}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

// ============ STOCK PROFILE ENDPOINT - Full Fundamentals ============
app.get('/api/stock-profile', async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        const yahooFinance = require('yahoo-finance2').default;

        console.log(`📊 Fetching full profile for ${symbol}...`);

        // Fetch comprehensive data using quoteSummary
        const modules = [
            'price', 'summaryDetail', 'summaryProfile', 'financialData',
            'defaultKeyStatistics', 'recommendationTrend'
        ];

        const [quoteSummary, quote] = await Promise.all([
            yahooFinance.quoteSummary(symbol, { modules }).catch(() => null),
            yahooFinance.quote(symbol).catch(() => null)
        ]);

        if (!quoteSummary && !quote) {
            return res.status(404).json({ error: 'Stock not found', symbol });
        }

        // Extract all data
        const price = quoteSummary?.price || {};
        const summaryDetail = quoteSummary?.summaryDetail || {};
        const summaryProfile = quoteSummary?.summaryProfile || {};
        const financialData = quoteSummary?.financialData || {};
        const keyStats = quoteSummary?.defaultKeyStatistics || {};
        const recommendation = quoteSummary?.recommendationTrend?.trend || [];

        // Build comprehensive response
        const stockData = {
            symbol,
            shortName: quote?.shortName || price?.shortName || symbol,
            longName: quote?.longName || price?.longName || symbol,
            exchange: quote?.exchange || price?.exchange || 'Unknown',
            currency: quote?.currency || price?.currency || 'SAR',

            // Price Data
            price: quote?.regularMarketPrice || price?.regularMarketPrice || 0,
            change: quote?.regularMarketChange || price?.regularMarketChange || 0,
            changePercent: quote?.regularMarketChangePercent || price?.regularMarketChangePercent || 0,
            prevClose: quote?.regularMarketPreviousClose || summaryDetail?.previousClose || 0,
            open: quote?.regularMarketOpen || summaryDetail?.open || 0,
            high: quote?.regularMarketDayHigh || summaryDetail?.dayHigh || 0,
            low: quote?.regularMarketDayLow || summaryDetail?.dayLow || 0,
            volume: quote?.regularMarketVolume || summaryDetail?.volume || 0,
            averageVolume: summaryDetail?.averageVolume || 0,

            // 52-Week Range
            fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh || keyStats?.fiftyTwoWeekHigh || 0,
            fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow || keyStats?.fiftyTwoWeekLow || 0,
            fiftyTwoWeekChange: keyStats?.['52WeekChange'] || 0,

            // Moving Averages
            fiftyDayAverage: summaryDetail?.fiftyDayAverage || keyStats?.fiftyDayAverage || 0,
            twoHundredDayAverage: summaryDetail?.twoHundredDayAverage || keyStats?.twoHundredDayAverage || 0,

            // Risk & Valuation
            beta: summaryDetail?.beta || keyStats?.beta || 0,
            marketCap: quote?.marketCap || summaryDetail?.marketCap || 0,
            enterpriseValue: keyStats?.enterpriseValue || 0,
            trailingPE: summaryDetail?.trailingPE || keyStats?.trailingPE || 0,
            forwardPE: summaryDetail?.forwardPE || keyStats?.forwardPE || 0,
            priceToBook: keyStats?.priceToBook || 0,
            enterpriseToEbitda: keyStats?.enterpriseToEbitda || 0,

            // Earnings
            trailingEps: keyStats?.trailingEps || 0,
            forwardEps: keyStats?.forwardEps || 0,
            earningsGrowth: financialData?.earningsGrowth || 0,

            // Profitability
            profitMargins: financialData?.profitMargins || 0,
            grossMargins: financialData?.grossMargins || 0,
            operatingMargins: financialData?.operatingMargins || 0,
            ebitdaMargins: financialData?.ebitdaMargins || 0,
            returnOnEquity: financialData?.returnOnEquity || 0,

            // Revenue & Income
            totalRevenue: financialData?.totalRevenue || 0,
            revenuePerShare: financialData?.revenuePerShare || 0,
            revenueGrowth: financialData?.revenueGrowth || 0,
            grossProfits: financialData?.grossProfits || 0,
            ebitda: financialData?.ebitda || 0,
            netIncomeToCommon: keyStats?.netIncomeToCommon || 0,

            // Cash Flow
            operatingCashflow: financialData?.operatingCashflow || 0,
            freeCashflow: financialData?.freeCashflow || 0,
            totalCash: financialData?.totalCash || 0,
            totalCashPerShare: financialData?.totalCashPerShare || 0,

            // Debt
            totalDebt: financialData?.totalDebt || 0,
            debtToEquity: financialData?.debtToEquity || 0,
            currentRatio: financialData?.currentRatio || 0,
            bookValue: keyStats?.bookValue || 0,

            // Dividends
            trailingAnnualDividendRate: summaryDetail?.trailingAnnualDividendRate || 0,
            trailingAnnualDividendYield: summaryDetail?.trailingAnnualDividendYield || 0,
            payoutRatio: summaryDetail?.payoutRatio || 0,
            lastDividendValue: keyStats?.lastDividendValue || 0,

            // Shares
            sharesOutstanding: keyStats?.sharesOutstanding || 0,

            // Analyst Targets
            targetHighPrice: financialData?.targetHighPrice || 0,
            targetLowPrice: financialData?.targetLowPrice || 0,
            targetMeanPrice: financialData?.targetMeanPrice || 0,
            numberOfAnalystOpinions: financialData?.numberOfAnalystOpinions || 0,
            recommendationKey: financialData?.recommendationKey || 'none',
            recommendationTrend: recommendation,

            // Company Profile
            sector: summaryProfile?.sector || quote?.sector || 'Unknown',
            industry: summaryProfile?.industry || 'Unknown',
            country: summaryProfile?.country || 'Unknown',
            website: summaryProfile?.website || '',
            description: summaryProfile?.longBusinessSummary || '',
            fullTimeEmployees: summaryProfile?.fullTimeEmployees || 0,

            lastUpdated: new Date().toISOString()
        };

        res.set('Cache-Control', 'public, max-age=60');
        console.log(`✅ Stock profile fetched for ${symbol}`);
        res.json(stockData);

    } catch (error) {
        console.error(`Stock Profile error for ${symbol}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch stock profile', symbol });
    }
});

// ============ AI CHATBOT ENDPOINT ============
// Powered by Groq (Llama 3.1) with Real-Time Stock Data

const Groq = require('groq-sdk');
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

const CHATBOT_SYSTEM_PROMPT = `You are "Mubasher AI", an expert financial assistant specializing in the Saudi Arabian stock market (TASI/Tadawul), Egyptian stock market (EGX), and global markets.

Your expertise includes:
- Stock analysis (fundamental & technical)
- Market trends and predictions
- Investment strategies and portfolio advice
- Company financial analysis
- Trading recommendations

Guidelines:
1. Be concise but informative (2-4 paragraphs max)
2. When stock data is provided, reference specific numbers
3. Always mention risks with recommendations
4. Be helpful and encouraging to investors
5. Use emojis sparingly for key points (📈 📉 💡 ⚠️ 🎯)
6. Format responses clearly with **bold** for emphasis
7. If you don't have specific data, provide general guidance

Key Saudi Stocks: 2222 (Aramco), 1120 (Al Rajhi), 2010 (SABIC), 7010 (STC), 2082 (ACWA Power)`;

// Extract stock symbols
function extractStockSymbolsFromChat(message) {
    const symbols = [];
    const msg = message.toLowerCase();

    // Saudi stocks
    if (msg.includes('aramco') || msg.includes('2222')) symbols.push('2222.SR');
    if (msg.includes('rajhi') || msg.includes('1120')) symbols.push('1120.SR');
    if (msg.includes('sabic') || msg.includes('2010')) symbols.push('2010.SR');
    if (msg.includes('stc') || msg.includes('7010')) symbols.push('7010.SR');
    if (msg.includes('acwa') || msg.includes('2082')) symbols.push('2082.SR');
    if (msg.includes('maaden') || msg.includes('1211')) symbols.push('1211.SR');
    if (msg.includes('snb') || msg.includes('1180')) symbols.push('1180.SR');
    if (msg.includes('alinma') || msg.includes('1150')) symbols.push('1150.SR');

    // US stocks
    if (msg.includes('apple') || msg.includes('aapl')) symbols.push('AAPL');
    if (msg.includes('tesla') || msg.includes('tsla')) symbols.push('TSLA');

    return symbols;
}

function formatStockContext(stockData) {
    return `
REAL-TIME STOCK DATA for ${stockData.longName || stockData.symbol}:
- Symbol: ${stockData.symbol}
- Current Price: ${stockData.regularMarketPrice?.toFixed(2)} ${stockData.currency}
- Change: ${stockData.regularMarketChange?.toFixed(2)} (${stockData.regularMarketChangePercent?.toFixed(2)}%)
- 52-Week Range: ${stockData.fiftyTwoWeekLow?.toFixed(2)} - ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- Market Cap: ${(stockData.marketCap / 1e9)?.toFixed(2)}B ${stockData.currency}
- Dividend Yield: ${((stockData.dividendYield || 0) * 100).toFixed(2)}%
- Target Price: ${stockData.targetMeanPrice?.toFixed(2) || 'N/A'}
`;
}

app.post('/api/chatbot', async (req, res) => {
    const { message, conversationHistory = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    try {
        console.log(`🤖 AI Chatbot processing: "${message.slice(0, 50)}..."`);

        const yahooFinance = require('yahoo-finance2').default;
        let stockContext = '';
        const symbols = extractStockSymbolsFromChat(message);

        // Fetch real stock data
        for (const symbol of symbols.slice(0, 2)) {
            try {
                const quote = await yahooFinance.quote(symbol);
                if (quote) {
                    stockContext += formatStockContext(quote);
                }
            } catch (e) { console.log(`Could not fetch ${symbol}: ${e.message}`); }
        }

        // Prepare messages for Groq
        const messages = [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT }
        ];

        // Add history
        for (const msg of conversationHistory.slice(-6)) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        }

        // Add current message with data
        let userMessage = message;
        if (stockContext) {
            userMessage = `${message}\n\n[CONTEXT - Use this real-time data:]\n${stockContext}`;
        }
        messages.push({ role: 'user', content: userMessage });

        // Call Groq Llama 3.3
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = completion.choices[0]?.message?.content ||
            "I apologize, I couldn't generate a response. Please try again.";

        console.log(`✅ Groq response generated (${aiResponse.length} chars)`);

        return res.json({
            success: true,
            response: aiResponse,
            stocksAnalyzed: symbols,
            hasRealData: stockContext.length > 0,
            provider: 'Groq',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI Chatbot error:', error.message);

        // Fallback response
        return res.json({
            success: true,
            response: "I apologize, but I'm having trouble connecting to the AI brain right now. Please check the **Market Summary** page for immediate real-time data!",
            stocksAnalyzed: [],
            hasRealData: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Translate text using Google Translate (free API)
app.post('/api/translate', async (req, res) => {
    const { text, targetLang = 'ar' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    try {
        const axios = require('axios');

        // Use Google Translate free API
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            },
            timeout: 10000
        });

        // Parse the response - it's a nested array
        const translations = response.data[0];
        let translatedText = '';

        if (translations) {
            translations.forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }

        res.json({ translatedText: translatedText || text });
    } catch (error) {
        console.error('Translation failed:', error.message);
        res.status(500).json({ error: 'Translation failed', original: text });
    }
});

// Extract full article content
app.get('/api/news/content', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        const axios = require('axios');
        const cheerio = require('cheerio');

        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        const response = await axios.get(url, {
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8'
            },
            timeout: 12000,
            maxRedirects: 5
        });

        const $ = cheerio.load(response.data);
        $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .related, .comments, .social-share').remove();

        let content = '';
        const hostname = new URL(url).hostname.toLowerCase();

        // Source-specific content selectors (prioritized)
        const sourceSelectors = {
            'mubasher': ['.story-body', '.article-body', '.news-details', '.article-content'],
            'argaam': ['#articleContent', '.article-content', '.article-body', '.post-content'],
            'arabnews': ['.article__content', '.article-body', 'article .body'],
            'aleqt': ['.article-body', '.article-content', '.post-content'],
            'dailynewsegypt': ['.entry-content', '.post-content', 'article'],
            'egypttoday': ['.article-text', '.article-body', '.post-body'],
            'zawya': ['.article-body', '.article-content', '.story-content'],
            'arabfinance': ['.news-details-content', '.article-body'],
            'reuters': ['.article-body', '[data-testid="paragraph-"]', 'article'],
            'bloomberg': ['.body-content', '.article-body'],
            'investing': ['.articlePage', '.articleContent', '#leftColumn']
        };

        // Find matching source
        let matchedSelectors = [];
        for (const [source, selectors] of Object.entries(sourceSelectors)) {
            if (hostname.includes(source)) {
                matchedSelectors = selectors;
                break;
            }
        }

        // Add generic selectors as fallback
        matchedSelectors.push(
            '[data-test-id="post-content"]', '.caas-body', 'article',
            '.article-body', '.article-content', '.post-content',
            '.entry-content', 'main', '.content'
        );

        // Try each selector
        for (const selector of matchedSelectors) {
            if ($(selector).length > 0) {
                $(selector).find('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 30 && !text.includes('©') && !text.includes('login')) {
                        content += `<p>${text}</p>`;
                    }
                });
                if (content.length > 300) break;
            }
        }

        // Fallback: Get all paragraphs
        if (content.length < 200) {
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                if (text.length > 40 && !text.includes('Copyright') && !text.includes('©') && !text.includes('login') && !text.includes('register')) {
                    content += `<p>${text}</p>`;
                }
            });
        }

        // NOISE FILTERING: Remove unwanted content patterns
        const noisePatterns = [
            /Argaam Investment Company.*Privacy Policy[^<]*/gi,
            /Privacy Policy[^<]*/gi,
            /You need to log in[^<]*/gi,
            /If you don't have an account[^<]*/gi,
            /register now to take advantage[^<]*/gi,
            /subscribe to (our|the) newsletter[^<]*/gi,
            /cookie(s)? (policy|notice)[^<]*/gi,
            /terms (of use|and conditions)[^<]*/gi,
            /<p>\s*<\/p>/gi
        ];

        for (const pattern of noisePatterns) {
            content = content.replace(pattern, '');
        }

        // Remove empty paragraphs left behind
        content = content.replace(/<p>\s*<\/p>/gi, '').trim();

        // FALLBACK 1: Use og:description or meta description if content is short
        if (content.length < 150) {
            const ogDesc = $('meta[property="og:description"]').attr('content') ||
                $('meta[name="description"]').attr('content') ||
                $('meta[name="twitter:description"]').attr('content');
            if (ogDesc && ogDesc.length > 50) {
                content = `<p>${ogDesc}</p>` + content;
            }
        }

        // FALLBACK 2: Extract from article summary/lead
        if (content.length < 200) {
            const leadSelectors = ['.article-lead', '.article-summary', '.lead', '.intro', '.excerpt', 'article > p:first-of-type'];
            for (const sel of leadSelectors) {
                const lead = $(sel).text().trim();
                if (lead && lead.length > 50 && !content.includes(lead)) {
                    content = `<p>${lead}</p>` + content;
                    break;
                }
            }
        }

        // Translate Arabic content to English
        if (content && /[\u0600-\u06FF]/.test(content)) {
            try {
                const plainText = content.replace(/<[^>]+>/g, '\n').trim();
                const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(plainText.substring(0, 4000))}`;
                const translateRes = await axios.get(translateUrl, { timeout: 5000 });
                if (translateRes.data && translateRes.data[0]) {
                    const translatedText = translateRes.data[0].map(s => s[0]).join('');
                    const paragraphs = translatedText.split('\n').filter(p => p.trim().length > 20);
                    content = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
                }
            } catch (e) {
                console.log('Translation failed, keeping original');
            }
        }

        // FINAL: If still no usable content, create a summary from title and available data
        if (!content || content.length < 100) {
            const title = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
            const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';

            let publisher = hostname.replace('www.', '').replace('english.', '').split('.')[0];
            publisher = publisher.charAt(0).toUpperCase() + publisher.slice(1);

            if (description && description.length > 30) {
                content = `<p>${description}</p><p><a href="${url}" target="_blank" style="color: #0ea5e9;">Read full article on ${publisher} →</a></p>`;
            } else {
                content = `<p>This article from ${publisher} requires viewing on the original website.</p><p><a href="${url}" target="_blank" style="color: #0ea5e9;">Read full article on ${publisher} →</a></p>`;
            }
        }

        res.json({ content });
    } catch (error) {
        console.error('Content extract failed:', error.message);
        let publisher = 'the source';
        try { publisher = new URL(url).hostname.replace('www.', '').split('.')[0]; } catch (e) { }
        res.json({ content: `<p>Unable to load content. Please view the original source.</p><p><a href="${url}" target="_blank" style="color: #0ea5e9;">Read on ${publisher} →</a></p>` });
    }
});

// Get market news
const newsCache = {};

// Helper: Fetch Google News RSS matching Vercel logic
async function fetchGoogleNews(query, count = 5) {
    try {
        const Parser = require('rss-parser');
        const parser = new Parser({
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });

        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            let publisher = 'News';
            let title = item.title;
            const parts = title.split(' - ');
            if (parts.length > 1) {
                publisher = parts.pop();
                title = parts.join(' - ');
            }

            if (publisher.toLowerCase().includes('mubasher')) publisher = 'Mubasher';
            else if (publisher.toLowerCase().includes('argaam')) publisher = 'Argaam';
            else if (publisher.toLowerCase().includes('zawya')) publisher = 'Zawya';

            let image = null;
            let domain = '';
            if (publisher === 'Mubasher') domain = 'english.mubasher.info';
            else if (publisher === 'Argaam') domain = 'argaam.com';
            else if (publisher === 'Zawya') domain = 'zawya.com';

            if (domain) {
                image = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
            }

            return {
                id: item.link,
                title: title,
                publisher: publisher,
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image
            };
        });
    } catch (e) {
        console.error(`Google News Fetch Error (${query}):`, e.message);
        return [];
    }
}

// Helper: Fetch Bing News RSS (Strict Fallback)
async function fetchBingNews(query, count = 5) {
    try {
        const Parser = require('rss-parser');
        const parser = new Parser({
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });

        // Use Bing RSS Search
        const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss`;
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, count).map(item => {
            let publisher = 'News';

            // Extract publisher if possible (Bing doesn't always provide clean source in RSS standard fields, 
            // but usually puts it in title or description? No, just title mostly.)
            // We rely on the STRICT QUERY to filter sources, so publisher name is cosmetic here.

            // Try to map known domains if we can
            if (item.link && item.link.includes('mubasher')) publisher = 'Mubasher';
            else if (item.link && item.link.includes('argaam')) publisher = 'Argaam';
            else if (item.link && item.link.includes('zawya')) publisher = 'Zawya';
            else if (item.link && item.link.includes('bloomberg')) publisher = 'Bloomberg';
            else if (item.link && item.link.includes('reuters')) publisher = 'Reuters';

            let image = null;
            // Bing RSS often has image in 'content' or 'content:encoded' or specific extensions
            // Simple fallback to domain logo for now to keep it fast
            let domain = '';
            if (publisher === 'Mubasher') domain = 'english.mubasher.info';
            else if (publisher === 'Argaam') domain = 'argaam.com';
            else if (publisher === 'Zawya') domain = 'zawya.com';
            else if (publisher === 'Bloomberg') domain = 'bloomberg.com';

            if (domain) {
                image = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
            }

            return {
                id: item.link,
                title: item.title,
                publisher: publisher,
                link: item.link,
                time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                thumbnail: image
            };
        });
    } catch (e) {
        console.error(`Bing Fetch Error (${query}):`, e.message);
        return [];
    }
}

// Batch extract images for news items without thumbnails
async function enrichNewsWithImages(newsItems) {
    const limit = 5; // Limit concurrent requests
    const itemsNeedingEnrichment = newsItems.filter(item =>
        (!item.thumbnail || item.thumbnail.includes('placehold.co') || !item.summary || item.summary.length < 100)
    ).slice(0, 8);

    // Limit concurrent requests
    const limits = 5;
    for (let i = 0; i < itemsNeedingEnrichment.length; i += limits) {
        const batch = itemsNeedingEnrichment.slice(i, i + limits);
        await Promise.all(batch.map(async (item) => {
            try {
                // 1. Resolve URL if it's a Google Redirect
                let targetUrl = item.link;
                if (item.link.includes('news.google.com')) {
                    try {
                        const axios = require('axios'); // Ensure axios is available in scope
                        const response = await axios.get(item.link, {
                            maxRedirects: 5,
                            timeout: 5000,
                            headers: { 'User-Agent': 'Mozilla/5.0' },
                            validateStatus: () => true
                        });
                        targetUrl = response.request?.res?.responseUrl || item.link;
                        item.link = targetUrl;
                    } catch (e) { /* ignore */ }
                }

                // 2. Fetch the actual page
                const axios = require('axios'); // Ensure axios is available in scope
                const cheerio = require('cheerio'); // Ensure cheerio is available in scope
                const response = await axios.get(targetUrl, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });

                const $ = cheerio.load(response.data);

                // 3. Extract Image - Source-specific selectors for Egypt/Saudi sites
                let image = $('meta[property="og:image"]').attr('content');
                if (!image) image = $('meta[name="twitter:image"]').attr('content');

                // Source-specific image selectors
                const hostname = new URL(targetUrl).hostname.toLowerCase();
                if (!image) {
                    if (hostname.includes('mubasher')) {
                        image = $('.article-image img').attr('src') || $('.story-image img').attr('src') || $('figure img').first().attr('src');
                    } else if (hostname.includes('argaam')) {
                        image = $('.article-featured-image img').attr('src') || $('[class*="article"] img').first().attr('src');
                    } else if (hostname.includes('zawya')) {
                        image = $('.article-main-image img').attr('src') || $('picture img').first().attr('src');
                    } else if (hostname.includes('egypttoday')) {
                        image = $('.article-img img').attr('src') || $('.post-thumbnail img').attr('src');
                    } else if (hostname.includes('dailynewsegypt')) {
                        image = $('.featured-image img').attr('src') || $('.wp-post-image').attr('src');
                    } else if (hostname.includes('arabfinance')) {
                        image = $('[class*="news-image"] img').attr('src');
                    } else if (hostname.includes('arabnews')) {
                        image = $('[class*="article-image"] img').attr('src') || $('figure img').first().attr('src');
                    } else if (hostname.includes('aleqt')) {
                        image = $('[class*="article-image"] img').attr('src') || $('article img').first().attr('src');
                    } else if (hostname.includes('investing')) {
                        image = $('[class*="articleImage"] img').attr('src');
                    }
                }

                // Generic fallback
                if (!image) image = $('article img').first().attr('src');
                if (!image) image = $('main img').first().attr('src');

                // Fix relative URLs
                if (image && !image.startsWith('http')) {
                    try {
                        const base = new URL(targetUrl);
                        image = new URL(image, base.origin).href;
                    } catch (e) { }
                }

                // 4. Extract Content (Summary) - Source-specific
                $('script, style, nav, footer, header, .ad, .social, .menu, .related, .comments').remove();
                let text = '';
                if (hostname.includes('mubasher')) {
                    text = $('.story-body').text() || $('.news-details').text();
                } else if (hostname.includes('argaam')) {
                    text = $('#articleContent').text() || $('.article-content').text();
                } else if (hostname.includes('zawya')) {
                    text = $('.article-body').text();
                }
                if (!text) text = $('article').text() || $('main').text() || $('body').text();
                text = text.replace(/\s+/g, ' ').trim();

                if (image && (!item.thumbnail || item.thumbnail.includes('placehold.co'))) {
                    item.thumbnail = image;
                }

                if (text && text.length > 100) {
                    item.summary = text.substring(0, 300) + '...';
                }

            } catch (error) {
                // console.error(`Enrichment failed for ${item.link}: ${error.message}`);
            }
        }));
    }

    return newsItems;
}



// News Fetching Logic (Background)
// Helper: Scrape Mubasher Direct (Mirrors Vercel)
async function scrapeMubasher(market = 'SA') {
    const articles = [];
    const url = market === 'SA'
        ? 'https://english.mubasher.info/markets/TDWL'
        : 'https://english.mubasher.info/countries/eg';

    try {
        console.log(`Scraping Mubasher for ${market}...`);
        const axios = require('axios');
        const cheerio = require('cheerio');

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html'
            },
            timeout: 10000
        });
        const $ = cheerio.load(response.data);
        const links = new Set();

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/\/news\/\d+\//)) {
                const fullUrl = href.startsWith('http') ? href : 'https://english.mubasher.info' + href;
                links.add(fullUrl);
            }
        });

        const uniqueLinks = Array.from(links).slice(0, 8);
        const articlePromises = uniqueLinks.map(async (link) => {
            try {
                const pageRes = await axios.get(link, { timeout: 5000 });
                const $page = cheerio.load(pageRes.data);
                const title = $page('h1').first().text().trim();
                let image = $page('meta[property="og:image"]').attr('content') ||
                    $page('.article-image img').attr('src');
                if (image && !image.startsWith('http')) image = 'https://english.mubasher.info' + image;
                const dateStr = $page('time').attr('datetime') || new Date().toISOString();

                if (title) {
                    return {
                        id: link,
                        title: title,
                        publisher: 'Mubasher',
                        link: link,
                        time: new Date(dateStr).toISOString(),
                        thumbnail: image || 'https://placehold.co/600x400/f1f5f9/475569?text=Mubasher',
                        summary: ''
                    };
                }
            } catch (e) { }
        });

        const results = await Promise.all(articlePromises);
        return results.filter(i => i);
    } catch (e) {
        console.error('Mubasher scrape failed:', e.message);
        return [];
    }
}

// News Fetching Logic (Background) - Using dedicated scrapers
const { fetchAllSaudiNews, fetchAllEgyptNews } = require('./scrapers/newsSources');

async function fetchNewsForMarket(market) {
    console.log('🔄 Background fetching news for: ' + market);
    let allNews = [];

    try {
        if (market === 'SA') {
            // Use dedicated Saudi scrapers (all 7 sources)
            allNews = await fetchAllSaudiNews();

        } else if (market === 'EG') {
            // Use dedicated Egypt scrapers (all 6 sources)
            allNews = await fetchAllEgyptNews();

        } else {
            // Default: Global/US - Use Yahoo Finance
            const yahooFinance = require('yahoo-finance2').default;
            const results = await yahooFinance.search('Stock Market', { newsCount: 15 });
            if (results.news) {
                allNews = results.news.map(n => ({
                    id: n.uuid,
                    title: n.title,
                    publisher: n.publisher || 'Yahoo Finance',
                    link: n.link,
                    time: new Date(n.providerPublishTime * 1000).toISOString(),
                    thumbnail: n.thumbnail?.resolutions?.[0]?.url
                }));
            }
        }

    } catch (e) {
        console.error('Fetch Market News Error:', e);
    }

    // For SA/EG, scrapers already handle deduplication and image enrichment
    // Just sort and cache
    if (market === 'SA' || market === 'EG') {
        // Sort by time (newest first)
        allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Update Cache
        newsCache[market] = { data: allNews, time: Date.now() };
        console.log(`✅ Cached ${allNews.length} articles for ${market}`);

        return allNews;
    }

    // For US/Other markets, apply additional processing
    const seen = new Set();
    const filteredNews = allNews.filter(item => {
        if (!item || !item.title) return false;
        const cleanTitle = item.title.trim().toLowerCase().substring(0, 50);
        if (seen.has(cleanTitle)) return false;
        seen.add(cleanTitle);
        return true;
    });

    // Sort by time
    filteredNews.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Update Cache
    newsCache[market] = { data: filteredNews, time: Date.now() };
    console.log(`✅ Cached ${filteredNews.length} articles for ${market}`);

    return filteredNews;
}



// Background Poller (Updates every 5 minutes)
setTimeout(async () => {
    console.log('⚡ Initializing News Cache...');

    // Start robust scraper
    startNewsScheduler(15); // Run every 15 mins for full scrape

    // Initial fetch staggered to avoid load
    // Initial fetch (likely cached data or empty)
    const fetchAll = async () => {
        fetchNewsForMarket('SA');
        await new Promise(r => setTimeout(r, 2000));
        fetchNewsForMarket('EG');
        await new Promise(r => setTimeout(r, 2000));
        fetchNewsForMarket('US');
    };
    await fetchAll();

    // Retry after 45s to capture fresh scraped data from background job
    setTimeout(() => {
        console.log('🔄 Syncing fresh news data...');
        fetchAll();
    }, 45000);
}, 1000);

setInterval(() => {
    console.log('🔄 Background Refreshing News...');
    fetchNewsForMarket('SA');
    fetchNewsForMarket('EG');
    fetchNewsForMarket('US');
}, 5 * 60 * 1000);

// Get market news (Instant Response)
app.get('/api/news', async (req, res) => {
    const { market } = req.query;

    // Return cached data immediately if available
    if (newsCache[market] && newsCache[market].data) {
        return res.json(newsCache[market].data);
    }

    // If no cache, wait max 3 seconds for background fetch, else return empty
    const startTime = Date.now();
    const maxWait = 3000; // 3 seconds max

    const waitForCache = () => new Promise(resolve => {
        const check = () => {
            if (newsCache[market] && newsCache[market].data) {
                resolve(newsCache[market].data);
            } else if (Date.now() - startTime > maxWait) {
                resolve([]); // Timeout - return empty
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });

    const data = await waitForCache();
    res.json(data);
});

const articleCache = {};

// Helper: Translate Text for Server use
async function translateTextInternal(text, targetLang = 'en') {
    if (!text) return '';
    try {
        const axios = require('axios');
        // Split into chunks if too large (naive split by paragraphs)
        if (text.length > 3000) {
            const parts = text.match(/[\s\S]{1,3000}/g) || [text];
            const translatedParts = await Promise.all(parts.map(p => translateTextInternal(p, targetLang)));
            return translatedParts.join(' ');
        }

        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'auto',
                tl: targetLang,
                dt: 't',
                q: text
            },
            timeout: 8000
        });

        const translations = response.data[0];
        let translatedText = '';
        if (translations) {
            translations.forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }
        return translatedText;
    } catch (error) {
        console.warn('Internal translation failed:', error.message);
        return text;
    }
}

// Get full article content (Scraping)
app.get('/api/news/content', async (req, res) => {
    const { url, title } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Cache check (1 hour)
    if (articleCache[url] && (Date.now() - articleCache[url].time < 3600000)) {
        return res.json({ content: articleCache[url].content });
    }

    try {
        const axios = require('axios');
        const cheerio = require('cheerio');

        let targetUrl = url;

        // Google News links redirect - follow them properly
        if (url.includes('news.google.com')) {
            try {
                // Method 1: Follow redirects with axios
                const response = await axios.get(url, {
                    maxRedirects: 10,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml'
                    },
                    timeout: 12000,
                    validateStatus: () => true
                });

                // Check final URL after redirects
                if (response.request && response.request.res && response.request.res.responseUrl) {
                    targetUrl = response.request.res.responseUrl;
                } else if (response.headers && response.headers.location) {
                    targetUrl = response.headers.location;
                }

                // If still a Google URL, try to extract from HTML
                if (targetUrl.includes('news.google.com') || targetUrl.includes('google.com/rss')) {
                    const $ = cheerio.load(response.data);
                    // Look for canonical or og:url
                    const canonical = $('link[rel="canonical"]').attr('href');
                    const ogUrl = $('meta[property="og:url"]').attr('content');
                    const jsRedirect = response.data.match(/window\.location\s*=\s*["']([^"']+)["']/);

                    targetUrl = canonical || ogUrl || (jsRedirect && jsRedirect[1]) || url;
                }

                console.log('Resolved Google News to: ' + targetUrl);
            } catch (e) {
                console.warn('Google redirect failed:', e.message);
            }
        }

        const https = require('https');
        const agent = new https.Agent({
            rejectUnauthorized: false,
            maxHeaderSize: 64 * 1024 // 64KB for large headers
        });

        let data = '';
        try {
            // Fetch the actual article
            const response = await axios.get(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://news.google.com/'
                },
                timeout: 15000,
                maxRedirects: 10,
                httpsAgent: agent
            });
            data = response.data;
        } catch (fetchErr) {
            console.warn(`Main fetch failed for ${targetUrl}: ${fetchErr.message}. Proceeding to fallback.`);
        }

        const $ = cheerio.load(data || '');

        // Remove unwanted elements BEFORE extraction
        $('script, style, nav, header, footer, aside, .advertisement, .ad, .sidebar, .related-articles, .social-share, .comments, .newsletter, .subscription, [role="navigation"], [role="banner"]').remove();

        // Selectors for major news sites (ordered by specificity)
        // EGYPT/SAUDI SPECIFIC SOURCES FIRST
        let content = data ? (
            // === MUBASHER (English & Arabic) ===
            $('.story-body').html() ||
            $('.news-details').html() ||
            $('.article-body-content').html() ||
            $('.article-details').html() ||
            $('[class*="news-content"]').html() ||

            // === ARGAAM ===
            $('#articleContent').html() ||
            $('.article-content').html() ||
            $('[class*="article-body"]').html() ||
            $('.news-body').html() ||

            // === ZAWYA ===
            $('.article-body').html() ||
            $('[class*="story-content"]').html() ||
            $('.zawya-article-content').html() ||

            // === EGYPT TODAY ===
            $('.article-text').html() ||
            $('.article-content-body').html() ||
            $('[class*="post-content"]').html() ||

            // === DAILY NEWS EGYPT ===
            $('.entry-content').html() ||
            $('article .content').html() ||

            // === ARAB FINANCE ===
            $('.news-details-content').html() ||
            $('[class*="article-text"]').html() ||

            // === ALEQT (الاقتصادية) ===
            $('.article-body').html() ||
            $('[class*="post-body"]').html() ||

            // === ARAB NEWS ===
            $('.article__content').html() ||
            $('[class*="article-content"]').html() ||

            // === INVESTING.COM ===
            $('.articlePage').html() ||
            $('[class*="article_WYSIWYG"]').html() ||

            // === REUTERS ===
            $('.article-body__content').html() ||
            $('[class*="ArticleBody"]').html() ||
            $('[data-testid="article-body"]').html() ||

            // === BLOOMBERG ===
            $('[class*="body-content"]').html() ||
            $('article[class*="body"]').html() ||

            // === YAHOO ===
            $('.caas-body').html() ||

            // === GENERIC FALLBACKS ===
            $('article').html() ||
            $('.post-content').html() ||
            $('[itemprop="articleBody"]').html() ||
            $('main article').html() ||
            $('.main-content').html()
        ) : null;

        // 1. Teaser / junk detection
        const textOnlyVal = (content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const teaserPatterns = [
            /This is a developing story available on/i,
            /Read the full article on/i,
            /Continue reading at/i,
            /requires a subscription/i,
            /To read this article/i,
            /Please enable Javascript/i,
            /Access this article/i,
            /Investor's Business Daily/i,
            /Zacks/i
        ];

        // If content matches a teaser pattern, treat it as empty to force fallback
        if (content && teaserPatterns.some(p => p.test(textOnlyVal))) {
            console.log('Detected teaser content. invalidating...');
            content = null;
        }

        if (!content) {
            const paragraphs = [];
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                // Avoid utility links
                if (text.length > 50 && !text.includes('Copyright') && !text.includes('All rights reserved')) {
                    paragraphs.push('<p>' + text + '</p>');
                }
            });
            if (paragraphs.length > 0) content = paragraphs.join('');
        }

        // --- FALLBACK MECHANISM ---
        // If content is still empty or too short, try to find an alternative source via Bing
        if ((!content || content.length < 500) && title) {
            console.log('Content too short/empty/teaser. Attempting Robust Fallback for:', title);

            const originalDomain = new URL(targetUrl).hostname.replace('www.', '');

            try {
                // 1. Perform a broad search first (Title + -site:original)
                // This finds syndications on Yahoo, MSN, etc.
                const rssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(title + ' -site:' + originalDomain)}&format=rss&mkt=en-us`;
                const rssResp = await axios.get(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
                const $rss = cheerio.load(rssResp.data, { xmlMode: true });

                const items = $rss('item');
                let bestUrl = null;

                // Priority Domains for Full Content
                const priorityDomains = ['finance.yahoo.com', 'msn.com', 'cnbc.com', 'reuters.com', 'bloomberg.com'];

                // Strategy: Find first priority domain, otherwise take first valid result
                items.each((i, el) => {
                    if (bestUrl) return; // Found one already

                    const link = $rss(el).find('link').text();
                    let realLink = link;
                    try {
                        const u = new URL(link);
                        const r = u.searchParams.get('url');
                        if (r) realLink = r;
                    } catch (e) { }

                    const domain = new URL(realLink).hostname;

                    // Check priority
                    if (priorityDomains.some(d => domain.includes(d))) {
                        bestUrl = realLink;
                    }
                });

                // If no priority found, take the first one that isn't the original
                if (!bestUrl && items.length > 0) {
                    const link = items.first().find('link').text();
                    let realLink = link;
                    try {
                        const u = new URL(link);
                        const r = u.searchParams.get('url');
                        if (r) realLink = r;
                    } catch (e) { }
                    if (!realLink.includes(originalDomain)) {
                        bestUrl = realLink;
                    }
                }

                if (bestUrl) {
                    console.log('Fallback found better source:', bestUrl);
                    const fbResp = await axios.get(bestUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                        timeout: 10000
                    });
                    const $fb = cheerio.load(fbResp.data);

                    // Cleanup
                    $fb('script, style, nav, header, footer, aside, .ad, .social, button, .button').remove();

                    // Specific Extractors
                    let fbContent = '';

                    // YAHOO FINANCE
                    if (bestUrl.includes('yahoo.com')) {
                        fbContent = $fb('.caas-body').html() || $fb('.body').html();
                    }
                    // MSN
                    else if (bestUrl.includes('msn.com')) {
                        fbContent = $fb('article').html() || $fb('.article-body').html();
                    }
                    // GENERIC
                    else {
                        fbContent = $fb('article').html() ||
                            $fb('.main-content').html() ||
                            $fb('[itemprop="articleBody"]').html();
                    }

                    // Fallback Text Extraction if HTML fails
                    if (!fbContent) {
                        const ps = [];
                        $fb('p').each((i, el) => {
                            if ($fb(el).text().trim().length > 60) ps.push(`<p>${$fb(el).text().trim()}</p>`);
                        });
                        if (ps.length > 0) fbContent = ps.join('');
                    }

                    if (fbContent && fbContent.length > 200) {
                        content = fbContent;
                        console.log('Replaced content with High Quality Fallback.');
                    }
                }

            } catch (e) {
                console.warn('Fallback loop failed:', e.message);
            }
        }
        // --------------------------

        if (content) {
            // Clean up content - Aggressive Cleaning
            content = content
                // Remove scripts, styles, and empty comments
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<!--[\s\S]*?-->/g, "")

                // Remove specific Mubasher metadata lines (Date/Time patterns)
                .replace(/\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+\d{1,2}:\d{2}\s+(?:AM|PM)/gi, "")
                .replace(/Start typing to search/gi, "")

                // Remove unwanted containers
                .replace(/<div\b[^>]*class="[^"]*mi-article__main-image[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")
                .replace(/<div\b[^>]*id="div-share[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")
                .replace(/<div\b[^>]*class="[^"]*share[^"]*"[^>]*>([\s\S]*?)<\/div>/gim, "")

                // Remove "Related News" and Sources sections
                .replace(/<p\b[^>]*>.*?Source\s*:\s*.*?<\/p>/gim, "")
                .replace(/<p\b[^>]*>.*?Related News.*?<\/p>/gim, "")
                .replace(/<strong>Related News.*?<\/strong>/gim, "")

                // AGGRESSIVE WHITESPACE CLEANING
                // 2. Remove empty paragraphs
                .replace(/<p[^>]*>[\s\u00A0]*<\/p>/gim, "")
                // 3. Remove multiple newlines
                .replace(/\n\s*\n/g, "\n");

            // Valid Title Deduplication
            if (title) {
                // remove strictly match (only if it's the exact start)
                const cleanTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Only remove if it appears at the very beginning or inside a likely header tag at the start
                const titleRegex = new RegExp('^\\s*(<[^>]+>\\s*)*' + cleanTitle + '\\s*(<\\/[^>]+>)*', 'i');
                content = content.replace(titleRegex, "");
            }

            // Trim output
            content = content.trim();

            // Additional Check: Remove leading "subtitle" if it's just the title again
            // often Mubasher puts title in a <div class="news-title"> inside the body
            content = content.replace(/^<div[^>]*class="[^"]*title[^"]*"[^>]*>.*?<\/div>/i, "");

            // --- AUTO-TRANSLATE IF ARABIC DETECTED ---
            // Check for Arabic characters ratio
            const textOnly = content.replace(/<[^>]*>/g, '');
            const arabicCount = (textOnly.match(/[\u0600-\u06FF]/g) || []).length;
            const totalCount = textOnly.length;

            if (totalCount > 0 && (arabicCount / totalCount) > 0.2) {
                console.log('Detected Arabic content. Auto-translating...');

                // We need to translate text node by node to preserve basic formatting? 
                // OR just strip tags, translate, and wrap in Paragraphs (Simpler and often cleaner for translated news)
                // Let's try to preserve Paragraphs.

                const $c = cheerio.load(content);
                const paragraphs = [];
                $c('p, div, h1, h2, h3').each((i, el) => {
                    const txt = $(el).text().trim();
                    if (txt.length > 20) paragraphs.push(txt);
                });

                // If structure is flat text
                if (paragraphs.length === 0 && textOnly.length > 20) {
                    paragraphs.push(textOnly);
                }

                // Translate chunks
                const translatedParagraphs = await Promise.all(paragraphs.map(p => translateTextInternal(p, 'en')));
                content = translatedParagraphs.map(p => `<p>${p}</p>`).join('');

                console.log('Translation complete.');
            }
            // -----------------------------------------

            // Save to Cache
            articleCache[url] = { content, time: Date.now() };

            res.json({ content });
        } else {
            res.status(404).json({ error: 'Content extraction failed' });
        }
    } catch (error) {
        console.error('Scraping failed:', error);
        res.status(500).json({ error: 'Failed to fetch article', details: error.message, stack: error.stack });
    }
});

// AI Insight Endpoint
// AI Insight Endpoint
app.get('/api/ai-insight', async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        const yahoo = require('yahoo-finance2').default;

        // Determine Market & Name
        let market = 'US';
        let stockName = symbol;
        if (symbol.endsWith('.SR')) {
            market = 'SA';
            stockName = SAUDI_STOCKS[symbol.replace('.SR', '')]?.name || symbol;
        } else if (symbol.endsWith('.CA')) {
            market = 'EG';
            stockName = EGYPT_STOCKS[symbol.replace('.CA', '')]?.name || symbol;
        }

        // Simplify name for searching (e.g. "Saudi Aramco" -> "Aramco")
        const searchName = stockName.split(' ')[0].length > 3 ? stockName.split(' ')[0] : stockName;

        // Parallel fetch: Yahoo Quote + Yahoo News + Our Cached News
        const [quote, searchRes] = await Promise.all([
            yahoo.quote(symbol),
            yahoo.search(symbol, { newsCount: 5 })
        ]);

        const change = quote.regularMarketChangePercent || 0;

        // --- 1. Gather Yahoo News ---
        const yahooNews = (searchRes.news || []).map(n => ({
            title: n.title,
            publisher: n.publisher,
            link: n.link,
            time: new Date(n.providerPublishTime).toISOString(),
            source: 'Yahoo'
        }));

        // --- 2. Gather Cached Helper News ---
        const cachedArticles = getCachedNews(market);
        const relevantCached = cachedArticles.filter(n => {
            // Match by Ticker or Name in Title/Content
            const text = (n.title + ' ' + n.content).toLowerCase();
            const symbolBase = symbol.replace(/\.(SR|CA)/, '').toLowerCase();
            return text.includes(searchName.toLowerCase()) || text.includes(symbolBase);
        }).map(n => ({
            title: n.title,
            publisher: n.source || n.publisher,
            link: n.url,
            time: n.published_at,
            source: 'Scraper'
        }));

        // Combine & Sort
        let allNews = [...relevantCached, ...yahooNews];
        allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Use strict 7-day filter ONLY for US market. For Emerging (SA/EG), use all available (or 30 days) as volume is lower.
        // User requested: "full period not only 1 week for saudi and egypt"
        let validNews = allNews;
        if (market === 'US') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            validNews = allNews.filter(n => new Date(n.time) > sevenDaysAgo);
        }

        // GENERATE "AI" RESPONSE
        let answer = "";

        if (validNews.length === 0) {
            // No-News Rule
            const options = [
                "No recent news found. Today’s move may reflect normal market activity.",
                "Market sentiment seems neutral with no specific catalyst detected.",
                "No clear news driver found. Check technical indicators."
            ];
            answer = options[Math.floor(Math.random() * options.length)];
        } else {
            // Smart Template Generation
            const topNews = validNews[0];
            const direction = change > 0.5 ? "advancing" : change < -0.5 ? "declining" : "steady";
            const changeText = Math.abs(change).toFixed(2) + "%";

            // Clean title
            let cleanTitle = topNews.title.split(' - ')[0];

            answer = `${stockName} is ${direction} (${changeText}) today. Investors are reacting to reports that "${cleanTitle}" as highlighted by ${topNews.publisher}.`;

            // Strict word limit
            const words = answer.split(' ');
            if (words.length > 45) {
                answer = words.slice(0, 45).join(' ') + "...";
            }
        }

        const response = {
            symbol,
            answer,
            sources: validNews.slice(0, 5), // Return top 5 sources
            timestamp: new Date().toISOString()
        };

        res.set('Cache-Control', 'public, max-age=60'); // Reduce cache to 60s for freshness
        res.json(response);

    } catch (error) {
        console.error('AI Insight error:', error);
        res.status(500).json({ error: 'Failed to generate insight' });
    }
});

// Manual trigger for price update
app.post('/api/update-prices', async (req, res) => {
    try {
        const result = await updateStockPrices();
        res.json({ success: true, count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Schedule High-Frequency Updates (Every 60 seconds)
console.log('⚡ Starting periodic price updates (every 60s)...');
setInterval(async () => {
    await updateStockPrices();
}, 60000);

// Proxy Image Endpoint (Fix specifically for Mubasher 403 blocking)
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL required');
    try {
        const axios = require('axios');
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': new URL(url).origin
            }
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        console.error("Proxy fail:", e.message);
        res.status(500).send('Image fetch failed');
    }
});

// ============ X COMMUNITY API ============
// Account Categories
const X_CATEGORIES = {
    ELITE_ANALYST: 'Elite Analyst',
    TECHNICAL: 'Technical',
    FUNDAMENTAL: 'Fundamental',
    NEWS: 'News',
    SIGNALS: 'Signals',
    INFLUENCER: 'Influencer',
    CHARTS: 'Charts'
};

// Target accounts for X Community (30+ elite accounts)
const X_COMMUNITY_ACCOUNTS = [
    // Tier 1 - Elite Analysts
    { username: 'THEWOLFOFTASI', displayName: 'The Wolf of TASI', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Anas_S_Alrajhi', displayName: 'Anas Al-Rajhi', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'RiadhAlhumaidan', displayName: 'Riyadh Al-Humaidan', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Reda_Alidarous', displayName: 'Reda Alidarous', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Ezzo_Khrais', displayName: 'Ezzo Khrais', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'malmuqti', displayName: 'M. Al-Muqti', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'SenseiFund', displayName: 'Sensei Fund', category: X_CATEGORIES.FUNDAMENTAL, tier: 1 },
    { username: 'fahadmutadawul', displayName: 'Fahad Mutadawul', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'Drfaresalotaibi', displayName: 'Dr. Fares Al-Otaibi', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'TasiElite', displayName: 'TASI Elite', category: X_CATEGORIES.ELITE_ANALYST, tier: 1 },
    { username: 'pro_chart', displayName: 'Pro Chart', category: X_CATEGORIES.CHARTS, tier: 1 },
    { username: 'Joker_Chart', displayName: 'Joker Chart', category: X_CATEGORIES.CHARTS, tier: 1 },
    { username: 'Equity_Data', displayName: 'Equity Data', category: X_CATEGORIES.FUNDAMENTAL, tier: 1 },
    // Tier 2 - Technical Traders & Charts
    { username: 'ahmadammar1993', displayName: 'Ahmad Ammar', category: X_CATEGORIES.INFLUENCER, tier: 2 },
    { username: 'FutrueGlimpse', displayName: 'Future Glimpse', category: X_CATEGORIES.NEWS, tier: 2 },
    { username: 'AlsagriCapital', displayName: 'Alsagri Capital', category: X_CATEGORIES.FUNDAMENTAL, tier: 2 },
    { username: 'King_night90', displayName: 'King Night', category: X_CATEGORIES.TECHNICAL, tier: 2 },
    { username: 'ABU_KHALED2021', displayName: 'Abu Khaled', category: X_CATEGORIES.SIGNALS, tier: 2 },
    { username: 'oqo888', displayName: 'OQO', category: X_CATEGORIES.TECHNICAL, tier: 2 },
    { username: 'Saad1100110', displayName: 'Saad', category: X_CATEGORIES.TECHNICAL, tier: 2 },
    { username: '29_shg', displayName: '29 SHG', category: X_CATEGORIES.CHARTS, tier: 2 },
    { username: 'Analysis2020', displayName: 'Analysis 2020', category: X_CATEGORIES.CHARTS, tier: 2 },
    { username: 'chartsniper666', displayName: 'Chart Sniper', category: X_CATEGORIES.CHARTS, tier: 2 },
    { username: 'boholaiga', displayName: 'Boholaiga', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'ammarshata', displayName: 'Ammar Shata', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'telmisany', displayName: 'Telmisany', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'FahdAlbogami', displayName: 'Fahd Al-Bogami', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'alfarhan', displayName: 'Al-Farhan', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 },
    { username: 'MR_Stock10', displayName: 'MR Stock', category: X_CATEGORIES.SIGNALS, tier: 2 },
    { username: 'THEONEKSA', displayName: 'The One KSA', category: X_CATEGORIES.ELITE_ANALYST, tier: 2 }
];

// Nitter instances for fetching
const NITTER_INSTANCES = [
    'https://nitter.privacydev.net',
    'https://nitter.poast.org',
    'https://nitter.cz',
    'https://nitter.unixfox.eu',
    'https://nitter.1d4.us'
];

// X Community Cache
const xCommunityCache = {
    data: null,
    timestamp: 0,
    perUser: {}
};
const X_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const X_PER_USER_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// Demo tweets for fallback (when live fetching fails)
const DEMO_TWEETS = [
    {
        id: 'demo_1',
        username: 'THEWOLFOFTASI',
        displayName: 'The Wolf of TASI',
        category: 'Trading',
        content: '🚀 TASI showing strong momentum today! Key sectors to watch: Banking and Petrochemicals. My top picks are performing well. #SaudiStocks #TASI',
        images: [],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        relativeTime: '2h ago',
        url: 'https://x.com/THEWOLFOFTASI',
        source: 'demo'
    },
    {
        id: 'demo_2',
        username: 'Anas_S_Alrajhi',
        displayName: 'Anas Al-Rajhi',
        category: 'Finance',
        content: 'Banking sector update: Al Rajhi Bank continues to show resilience. Q4 earnings expectations remain positive. Stay tuned for detailed analysis. 📊',
        images: [],
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        relativeTime: '3h ago',
        url: 'https://x.com/Anas_S_Alrajhi',
        source: 'demo'
    },
    {
        id: 'demo_3',
        username: 'RiadhAlhumaidan',
        displayName: 'Riyadh Al-Humaidan',
        category: 'Markets',
        content: 'Market outlook for this week: Expecting volatility due to global factors. Keep stop losses tight and focus on quality stocks. 📈 #TradingTips',
        images: [],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        relativeTime: '4h ago',
        url: 'https://x.com/RiadhAlhumaidan',
        source: 'demo'
    },
    {
        id: 'demo_4',
        username: 'ahmadammar1993',
        displayName: 'Ahmad Ammar',
        category: 'Trading',
        content: 'Technical analysis update: SABIC forming a bullish pattern. Watch for breakout above resistance. Entry and exit points shared in channel. 💹',
        images: [],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        relativeTime: '5h ago',
        url: 'https://x.com/ahmadammar1993',
        source: 'demo'
    },
    {
        id: 'demo_5',
        username: 'FutrueGlimpse',
        displayName: 'Future Glimpse',
        category: 'Insights',
        content: 'Vision 2030 stocks continue to outperform. Entertainment and tourism sectors showing promising growth. Long-term investors should take note! 🎯',
        images: [],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        relativeTime: '6h ago',
        url: 'https://x.com/FutrueGlimpse',
        source: 'demo'
    },
    {
        id: 'demo_6',
        username: 'AlsagriCapital',
        displayName: 'Alsagri Capital',
        category: 'Capital',
        content: 'Weekly portfolio review: Defensive positioning paying off. Healthcare and utilities providing stability in current market conditions. 📋',
        images: [],
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        relativeTime: '8h ago',
        url: 'https://x.com/AlsagriCapital',
        source: 'demo'
    },
    {
        id: 'demo_7',
        username: 'Reda_Alidarous',
        displayName: 'Reda Alidarous',
        category: 'Analysis',
        content: 'Oil prices impact on TASI: Aramco and related stocks moving with crude. Keep an eye on $80 support level for Brent. 🛢️ #OilMarkets',
        images: [],
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        relativeTime: '10h ago',
        url: 'https://x.com/Reda_Alidarous',
        source: 'demo'
    },
    {
        id: 'demo_8',
        username: 'Ezzo_Khrais',
        displayName: 'Ezzo Khrais',
        category: 'Markets',
        content: 'IPO watch: New listings expected Q1 2025. Several exciting companies in the pipeline. Will share detailed analysis soon! 🆕',
        images: [],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        relativeTime: '12h ago',
        url: 'https://x.com/Ezzo_Khrais',
        source: 'demo'
    },
    {
        id: 'demo_9',
        username: 'King_night90',
        displayName: 'King Night',
        category: 'Trading',
        content: 'Day trading strategy for tomorrow: Focus on high volume movers at market open. Patience is key - wait for confirmation! ⚡',
        images: [],
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        relativeTime: '14h ago',
        url: 'https://x.com/King_night90',
        source: 'demo'
    },
    {
        id: 'demo_10',
        username: 'ABU_KHALED2021',
        displayName: 'Abu Khaled',
        category: 'Investing',
        content: 'Dividend stocks for 2024: My top 5 high-yield picks in Saudi market. Building passive income one stock at a time! 💰 #DividendInvesting',
        images: [],
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        relativeTime: '16h ago',
        url: 'https://x.com/ABU_KHALED2021',
        source: 'demo'
    }
];

// Helper: Clean tweet text
function cleanTweetText(content) {
    if (!content) return '';
    let text = content.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    return text.replace(/\s+/g, ' ').trim();
}

// Helper: Extract images from tweet content
function extractTweetImages(content) {
    if (!content) return [];
    const images = [];
    const imgMatches = content.match(/<img[^>]+src="([^"]+)"/gi);
    if (imgMatches) {
        imgMatches.forEach(match => {
            const srcMatch = match.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
                let imgUrl = srcMatch[1];
                if (!imgUrl.includes('profile') && !imgUrl.includes('emoji') && !imgUrl.includes('pic/')) {
                    if (imgUrl.startsWith('/pic/')) {
                        const decoded = decodeURIComponent(imgUrl.replace('/pic/', ''));
                        if (decoded.startsWith('http')) images.push(decoded);
                    } else if (imgUrl.startsWith('http')) {
                        images.push(imgUrl);
                    }
                }
            }
        });
    }
    return images;
}

// Helper: Get relative time
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

// Fetch tweets from Twitter Syndication API (Embed endpoint) - REAL TWEETS
async function fetchFromSyndication(username) {
    try {
        console.log(`📡 Fetching @${username} via Twitter Syndication API...`);

        const axios = require('axios');
        const cheerio = require('cheerio');

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

        const account = X_COMMUNITY_ACCOUNTS.find(a => a.username.toLowerCase() === username.toLowerCase());
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

        console.log(`✅ Fetched ${tweets.length} real tweets for @${username}`);
        return tweets;

    } catch (error) {
        console.log(`❌ Failed to fetch @${username}: ${error.message}`);
        return null;
    }
}

// Fetch user tweets with caching
async function fetchXUserTweets(account) {
    const { username } = account;

    // Check per-user cache
    const cached = xCommunityCache.perUser[username];
    if (cached && (Date.now() - cached.timestamp) < X_PER_USER_CACHE_TTL) {
        return cached.data;
    }

    // Fetch from Syndication API
    const tweets = await fetchFromSyndication(username);

    if (tweets && tweets.length > 0) {
        xCommunityCache.perUser[username] = { data: tweets, timestamp: Date.now() };
        return tweets;
    }

    // Return cached data if available (even if stale)
    if (cached) {
        return cached.data;
    }

    return [];
}

// Fetch all X Community tweets
async function fetchAllXCommunityTweets() {
    console.log('🐦 Fetching X Community tweets...');
    const allTweets = [];
    const batchSize = 3;

    for (let i = 0; i < X_COMMUNITY_ACCOUNTS.length; i += batchSize) {
        const batch = X_COMMUNITY_ACCOUNTS.slice(i, i + batchSize);
        const results = await Promise.allSettled(
            batch.map(account => fetchXUserTweets(account))
        );

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allTweets.push(...result.value);
            }
        });

        if (i + batchSize < X_COMMUNITY_ACCOUNTS.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // If no live tweets fetched, use demo data
    if (allTweets.length === 0) {
        console.log('⚠️ No live tweets available, using demo data');
        // Update demo tweets with fresh relative times
        const demoWithFreshTimes = DEMO_TWEETS.map((tweet, index) => ({
            ...tweet,
            id: `demo_${Date.now()}_${index}`,
            timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
            relativeTime: `${(index + 1) * 2}h ago`
        }));
        return demoWithFreshTimes;
    }

    allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    console.log(`✅ Fetched ${allTweets.length} tweets from X Community`);
    return allTweets;
}

// Calculate engagement score
function calculateEngagementScore(tweet) {
    return (tweet.likes || 0) + ((tweet.retweets || 0) * 2) + ((tweet.replies || 0) * 1.5);
}

// Generate leaderboard stats
function generateLeaderboard(tweets) {
    const userStats = {};
    tweets.forEach(tweet => {
        if (!userStats[tweet.username]) {
            userStats[tweet.username] = {
                username: tweet.username,
                displayName: tweet.displayName,
                profileImage: tweet.profileImage,
                category: tweet.category,
                tier: tweet.tier || 3,
                totalPosts: 0,
                totalEngagement: 0
            };
        }
        userStats[tweet.username].totalPosts++;
        userStats[tweet.username].totalEngagement += calculateEngagementScore(tweet);
    });
    return Object.values(userStats)
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 10);
}

// X Community API Endpoint with Tab Support
app.get('/api/x-community', async (req, res) => {
    const { tab = 'fresh', refresh } = req.query;
    const now = Date.now();

    try {
        // Full community feed - check cache
        if (!refresh && xCommunityCache.data && (now - xCommunityCache.timestamp) < X_CACHE_TTL) {
            let tweets = xCommunityCache.data.map(t => ({
                ...t,
                tier: X_COMMUNITY_ACCOUNTS.find(a => a.username.toLowerCase() === t.username.toLowerCase())?.tier || 3,
                engagementScore: calculateEngagementScore(t)
            }));

            // Filter by tab
            switch (tab) {
                case 'trending':
                    const oneDayAgo = now - (24 * 60 * 60 * 1000);
                    tweets = tweets
                        .filter(t => new Date(t.timestamp).getTime() > oneDayAgo)
                        .sort((a, b) => b.engagementScore - a.engagementScore)
                        .slice(0, 20);
                    break;
                case 'top-analysts':
                    tweets = tweets
                        .filter(t => t.tier === 1 || t.category === 'Elite Analyst')
                        .slice(0, 20);
                    break;
                case 'most-engaged':
                    tweets = [...tweets].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 20);
                    break;
                default: // fresh
                    tweets = tweets.slice(0, 30);
            }

            return res.json({
                success: true,
                tab,
                tweets,
                leaderboard: generateLeaderboard(xCommunityCache.data),
                accounts: X_COMMUNITY_ACCOUNTS.length,
                totalTweets: xCommunityCache.data.length,
                cached: true,
                fetchedAt: new Date(xCommunityCache.timestamp).toISOString()
            });
        }

        // Fetch fresh data
        let tweets = await fetchAllXCommunityTweets();

        // Add tier and engagement score
        tweets = tweets.map(t => {
            const account = X_COMMUNITY_ACCOUNTS.find(a => a.username.toLowerCase() === t.username.toLowerCase());
            return {
                ...t,
                tier: account?.tier || 3,
                engagementScore: calculateEngagementScore(t)
            };
        });

        xCommunityCache.data = tweets;
        xCommunityCache.timestamp = now;

        // Filter by tab
        let filteredTweets = tweets;
        switch (tab) {
            case 'trending':
                const oneDayAgo = now - (24 * 60 * 60 * 1000);
                filteredTweets = tweets
                    .filter(t => new Date(t.timestamp).getTime() > oneDayAgo)
                    .sort((a, b) => b.engagementScore - a.engagementScore)
                    .slice(0, 20);
                break;
            case 'top-analysts':
                filteredTweets = tweets
                    .filter(t => t.tier === 1 || t.category === 'Elite Analyst')
                    .slice(0, 20);
                break;
            case 'most-engaged':
                filteredTweets = [...tweets].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 20);
                break;
            default:
                filteredTweets = tweets.slice(0, 30);
        }

        res.json({
            success: true,
            tab,
            tweets: filteredTweets,
            leaderboard: generateLeaderboard(tweets),
            accounts: X_COMMUNITY_ACCOUNTS.length,
            totalTweets: tweets.length,
            cached: false,
            fetchedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ X Community API Error:', error.message);

        if (xCommunityCache.data) {
            return res.json({
                success: true,
                tab,
                tweets: xCommunityCache.data.slice(0, 20),
                leaderboard: generateLeaderboard(xCommunityCache.data),
                accounts: X_COMMUNITY_ACCOUNTS.length,
                totalTweets: xCommunityCache.data.length,
                cached: true,
                stale: true,
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: error.message,
            tweets: [],
            leaderboard: [],
            accounts: X_COMMUNITY_ACCOUNTS.length
        });
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log('\\n🚀 Server running on http://localhost:' + PORT);

    // Initial fetch of static profiles (Fundamentals, etc.)
    await updateStockProfiles();

    // Initial fetch of live prices
    await updateStockPrices();
});
