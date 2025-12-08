// AI Chatbot API - Powered by Google Gemini
// Version: 1.0.0 - Intelligent Stock Market Assistant
// Deployed: 2025-12-08

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with free API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBvBpDdpgz7V2zGvVeJmCJXzXJNsK8BZ5c';

// System prompt for the AI
const SYSTEM_PROMPT = `You are "Mubasher AI", an expert financial assistant specializing in the Saudi Arabian stock market (TASI/Tadawul), Egyptian stock market (EGX), and global markets. 

Your expertise includes:
- Stock analysis (fundamental & technical)
- Market trends and predictions
- Investment strategies
- Portfolio advice
- Company financial analysis
- Trading recommendations
- Risk assessment
- Economic indicators

Guidelines:
1. Be concise but informative (2-4 paragraphs max)
2. Use specific data when available
3. Always mention risks with recommendations
4. Be helpful and encouraging to investors
5. Use emojis sparingly for key points (📈 📉 💡 ⚠️)
6. If you don't have real-time data, say so and give general guidance
7. Never provide guaranteed predictions - always mention market risks
8. Format responses clearly with line breaks for readability

Key Saudi Stocks to know:
- 2222 (Aramco) - World's largest oil company
- 1120 (Al Rajhi Bank) - Largest Islamic bank
- 2010 (SABIC) - Petrochemicals giant
- 7010 (STC) - Telecom leader
- 2082 (ACWA Power) - Renewable energy
- 1211 (Ma'aden) - Mining company

Key Egyptian Stocks:
- COMI (CIB) - Largest private bank
- HRHO (EFG Hermes) - Investment bank
- TMGH (TMG Holding) - Real estate
- SWDY (Elsewedy Electric)

Always respond in a friendly, professional manner as a trusted financial advisor.`;

// Fetch real stock data from our API
async function fetchStockData(symbol, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/stock-profile?symbol=${encodeURIComponent(symbol)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(`Could not fetch stock data for ${symbol}:`, error.message);
    }
    return null;
}

// Fetch news from our API
async function fetchNews(market, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/news?market=${market}&limit=5`);
        if (response.ok) {
            const data = await response.json();
            return data.articles?.slice(0, 5) || [];
        }
    } catch (error) {
        console.log(`Could not fetch news:`, error.message);
    }
    return [];
}

// Extract stock symbols from user message
function extractStockSymbols(message) {
    const symbols = [];
    const msg = message.toLowerCase();

    // Saudi stocks
    if (msg.includes('aramco') || msg.includes('2222')) symbols.push('2222.SR');
    if (msg.includes('rajhi') || msg.includes('1120')) symbols.push('1120.SR');
    if (msg.includes('sabic') || msg.includes('2010')) symbols.push('2010.SR');
    if (msg.includes('stc') || msg.includes('7010')) symbols.push('7010.SR');
    if (msg.includes('acwa') || msg.includes('2082')) symbols.push('2082.SR');
    if (msg.includes('maaden') || msg.includes('1211')) symbols.push('1211.SR');
    if (msg.includes('alinma') || msg.includes('1150')) symbols.push('1150.SR');
    if (msg.includes('snb') || msg.includes('1180')) symbols.push('1180.SR');

    // Egyptian stocks
    if (msg.includes('cib') || msg.includes('comi')) symbols.push('COMI.CA');
    if (msg.includes('hermes') || msg.includes('hrho')) symbols.push('HRHO.CA');
    if (msg.includes('tmg') || msg.includes('tmgh')) symbols.push('TMGH.CA');
    if (msg.includes('elsewedy') || msg.includes('swdy')) symbols.push('SWDY.CA');

    // US stocks
    if (msg.includes('apple') || msg.includes('aapl')) symbols.push('AAPL');
    if (msg.includes('microsoft') || msg.includes('msft')) symbols.push('MSFT');
    if (msg.includes('tesla') || msg.includes('tsla')) symbols.push('TSLA');
    if (msg.includes('google') || msg.includes('alphabet') || msg.includes('goog')) symbols.push('GOOGL');
    if (msg.includes('amazon') || msg.includes('amzn')) symbols.push('AMZN');
    if (msg.includes('nvidia') || msg.includes('nvda')) symbols.push('NVDA');

    return symbols;
}

// Detect if user is asking about news
function isNewsQuery(message) {
    const msg = message.toLowerCase();
    return msg.includes('news') || msg.includes('headline') || msg.includes('latest') ||
        msg.includes('what happened') || msg.includes('updates') || msg.includes('أخبار');
}

// Detect market from message
function detectMarket(message) {
    const msg = message.toLowerCase();
    if (msg.includes('saudi') || msg.includes('tasi') || msg.includes('tadawul') || msg.includes('سعود')) return 'SA';
    if (msg.includes('egypt') || msg.includes('egx') || msg.includes('cairo') || msg.includes('مصر')) return 'EG';
    if (msg.includes('us') || msg.includes('nasdaq') || msg.includes('sp500') || msg.includes('dow')) return 'US';
    return 'SA'; // Default to Saudi
}

// Format stock data for context
function formatStockContext(stockData) {
    if (!stockData) return '';

    return `
REAL-TIME STOCK DATA for ${stockData.longName || stockData.symbol}:
- Current Price: ${stockData.price?.toFixed(2)} ${stockData.currency}
- Change: ${stockData.change?.toFixed(2)} (${stockData.changePercent?.toFixed(2)}%)
- 52-Week Range: ${stockData.fiftyTwoWeekLow?.toFixed(2)} - ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- Market Cap: ${(stockData.marketCap / 1e9)?.toFixed(2)}B ${stockData.currency}
- Dividend Yield: ${((stockData.trailingAnnualDividendYield || 0) * 100).toFixed(2)}%
- 50-Day MA: ${stockData.fiftyDayAverage?.toFixed(2)}
- Analyst Target: ${stockData.targetMeanPrice?.toFixed(2)} (${stockData.recommendationKey})
`;
}

// Format news for context
function formatNewsContext(articles) {
    if (!articles?.length) return '';

    return `
RECENT NEWS:
${articles.map((a, i) => `${i + 1}. "${a.title}" - ${a.source || 'Unknown'}`).join('\n')}
`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message required' });
    }

    try {
        console.log(`🤖 AI Chatbot processing: "${message.slice(0, 50)}..."`);

        // Determine base URL for internal API calls
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:5001';

        // Gather context based on user query
        let additionalContext = '';

        // Extract and fetch stock data
        const symbols = extractStockSymbols(message);
        for (const symbol of symbols.slice(0, 2)) { // Limit to 2 stocks for speed
            const stockData = await fetchStockData(symbol, baseUrl);
            if (stockData) {
                additionalContext += formatStockContext(stockData);
            }
        }

        // Fetch news if relevant
        if (isNewsQuery(message)) {
            const market = detectMarket(message);
            const news = await fetchNews(market, baseUrl);
            additionalContext += formatNewsContext(news);
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build conversation context
        const conversationContext = conversationHistory
            .slice(-6) // Last 6 messages for context
            .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
            .join('\n');

        // Create the prompt
        const prompt = `${SYSTEM_PROMPT}

${additionalContext ? `CURRENT MARKET DATA:\n${additionalContext}` : ''}

${conversationContext ? `CONVERSATION HISTORY:\n${conversationContext}\n` : ''}

User's question: ${message}

Provide a helpful, accurate response based on the data above. If specific data is provided, reference it in your answer.`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = result.response;
        const aiResponse = response.text();

        console.log(`✅ AI response generated (${aiResponse.length} chars)`);

        return res.status(200).json({
            success: true,
            response: aiResponse,
            stocksAnalyzed: symbols,
            hasRealData: additionalContext.length > 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI Chatbot error:', error.message);

        // Fallback response if AI fails
        const fallbackResponses = [
            "I apologize, but I'm having trouble connecting right now. Based on general market knowledge, I'd recommend checking the latest financial news and technical indicators for specific stocks you're interested in.",
            "I'm experiencing a temporary issue. For immediate help, consider checking the company profiles in the app for real-time data and analyst recommendations.",
            "Let me suggest checking the Market Summary page for current prices and trends while I reconnect. Feel free to ask again in a moment!"
        ];

        return res.status(200).json({
            success: true,
            response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            stocksAnalyzed: [],
            hasRealData: false,
            error: 'AI service temporarily unavailable',
            timestamp: new Date().toISOString()
        });
    }
}
