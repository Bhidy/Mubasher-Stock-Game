// AI Chatbot API - Powered by Groq (Llama 3.1)
// Version: 2.0.0 - Real LLM Integration
// Deployed: 2025-12-08

import Groq from 'groq-sdk';

// ============ GROQ CONFIGURATION ============
// Using Groq's free API with Llama 3.3 70B model
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });

// System prompt for Hero Ai
const SYSTEM_PROMPT = `You are "Hero Ai", an expert financial assistant specializing in the Saudi Arabian stock market (TASI/Tadawul), Egyptian stock market (EGX), and global markets.

Your expertise includes:
- Stock analysis (fundamental & technical)
- Market trends and predictions
- Investment strategies and portfolio advice
- Company financial analysis
- Trading recommendations
- Risk assessment

Guidelines:
1. Be concise but informative (2-4 paragraphs max)
2. When stock data is provided, reference specific numbers
3. Always mention risks with recommendations
4. Be helpful and encouraging to investors
5. Use emojis sparingly for key points (📈 📉 💡 ⚠️ 🎯)
6. Format responses clearly with **bold** for emphasis
7. If you don't have specific data, provide general guidance
8. Never give guaranteed predictions - markets are unpredictable
9. **Use provided NEWS headlines to explain WHY a stock is moving.**

Key Saudi Stocks:
- 2222 (Aramco), 1120 (Al Rajhi), 2010 (SABIC), 7010 (STC), 2082 (ACWA Power)

Respond in a friendly, professional manner as a trusted financial advisor named Hero Ai.`;

// Stock symbol detection
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
    if (msg.includes('snb') || msg.includes('1180')) symbols.push('1180.SR');
    if (msg.includes('alinma') || msg.includes('1150')) symbols.push('1150.SR');

    // US stocks
    if (msg.includes('apple') || msg.includes('aapl')) symbols.push('AAPL');
    if (msg.includes('tesla') || msg.includes('tsla')) symbols.push('TSLA');
    if (msg.includes('nvidia') || msg.includes('nvda')) symbols.push('NVDA');

    return symbols;
}

// Fetch stock data from our API
async function fetchStockData(symbol, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/stock-profile?symbol=${encodeURIComponent(symbol)}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(`Could not fetch stock data for ${symbol}:`, error.message);
    }
    return null;
}

// Fetch relevant news
async function fetchMarketNews(market, baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/api/news?market=${market}&limit=3`);
        if (response.ok) {
            const data = await response.json();
            return data.articles || [];
        }
    } catch (error) {
        console.log(`Could not fetch news for ${market}:`, error.message);
    }
    return [];
}

// Technical Analysis Engine
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    // Calculate initial average
    for (let i = 1; i <= period; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function getTechnicalSignals(quote, historicalData) {
    const price = quote.regularMarketPrice;
    const ma50 = quote.fiftyDayAverage;
    const ma200 = quote.twoHundredDayAverage;
    const signals = [];

    // MA Signals
    if (price > ma50) signals.push("Price above 50-Day MA (Bullish Trend 🟢)");
    else signals.push("Price below 50-Day MA (Bearish Trend 🔴)");

    if (ma50 > ma200) signals.push("50-Day MA above 200-Day MA (Long-term Uptrend 📈)");
    else signals.push("50-Day MA below 200-Day MA (Long-term Downtrend 📉)");

    // RSI Signal
    if (historicalData && historicalData.length > 15) {
        const closes = historicalData.map(d => d.close);
        const rsi = calculateRSI(closes);
        if (rsi) {
            let rsiSignal = `RSI(14): ${rsi.toFixed(1)} - `;
            if (rsi > 70) rsiSignal += "Overbought (Potential Pullback ⚠️)";
            else if (rsi < 30) rsiSignal += "Oversold (Potential Bounce 🚀)";
            else rsiSignal += "Neutral";
            signals.push(rsiSignal);
        }
    }

    return signals;
}

// Format stock data for context with Technicals
function formatStockContext(stockData, technicals) {
    if (!stockData) return '';

    let context = `
REAL-TIME STOCK DATA for ${stockData.longName || stockData.symbol}:
- Symbol: ${stockData.symbol}
- Current Price: ${stockData.price?.toFixed(2)} ${stockData.currency}
- Change: ${stockData.change?.toFixed(2)} (${stockData.changePercent?.toFixed(2)}%)
- 52-Week Range: ${stockData.fiftyTwoWeekLow?.toFixed(2)} - ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
- Market Cap: ${(stockData.marketCap / 1e9)?.toFixed(2)}B ${stockData.currency}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- Dividend Yield: ${((stockData.trailingAnnualDividendYield || 0) * 100).toFixed(2)}%
`;

    if (technicals && technicals.length > 0) {
        context += `\nTECHNICAL SIGNALS:\n${technicals.map(s => `- ${s}`).join('\n')}\n`;
    }

    return context;
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
        console.log(`🤖 Hero Ai (Groq Llama 3.3) processing: "${message.slice(0, 50)}..."`);

        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:5001';

        let contextData = '';
        const symbols = extractStockSymbols(message);
        let market = 'SA'; // Default to Saudi
        const stockDataList = [];

        // Fetch Stock Data & History
        for (const symbol of symbols.slice(0, 2)) {
            const stockData = await fetchStockData(symbol, baseUrl); // Basic Profile

            if (stockData) {
                // Try to fetch historical data for RSI (Optional, handled gracefully if fails)
                let technicals = [];
                try {
                    // We use the chart endpoint if available or just rely on profile MAs
                    // For now, calculating RSI requires history. 
                    // Since we don't have a direct internal history API handy in this file,
                    // We will use the MAs from the profile and a mock RSI if needed or skip history fetch to keep it fast.
                    // IMPORTANT: To make it "Ultimate", I'll infer signals from the rich profile data available.
                    // stockData from /api/stock-profile usually has a LOT of fields.

                    // Construct a quote object for the helper
                    const quote = {
                        regularMarketPrice: stockData.price,
                        fiftyDayAverage: stockData.fiftyDayAverage,
                        twoHundredDayAverage: stockData.twoHundredDayAverage
                    };

                    // Note: Real RSI requires history array. If we can't get it easily, we rely on MAs.
                    technicals = getTechnicalSignals(quote, []);
                } catch (e) {
                    console.log('Technical calc error', e);
                }

                contextData += formatStockContext(stockData, technicals);
                stockDataList.push(stockData); // Save for widget

                if (symbol.endsWith('.CA')) market = 'EG';
                else if (!symbol.includes('.')) market = 'US';
            }
        }

        // Fetch News (The "Why" Engine)
        if (symbols.length > 0 || message.toLowerCase().includes('news')) {
            const newsArticles = await fetchMarketNews(market, baseUrl);
            if (newsArticles.length > 0) {
                contextData += `\nLATEST NEWS HEADLINES (Use to explain price moves):\n`;
                newsArticles.forEach((article, i) => {
                    contextData += `${i + 1}. "${article.title}" - ${article.source} (${article.time || 'Today'})\n`;
                });
            }
        }

        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        for (const msg of conversationHistory.slice(-6)) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        }

        let userMessage = message;
        if (contextData) {
            userMessage = `${message}\n\n[REAL-TIME MARKET DATA & NEWS]\n${contextData}\n\nAnalyze the data above to give a specific answer. Calculate the trend based on the MA signals provided. Explain the price movement using the news headlines if relevant.`;
        }
        messages.push({ role: 'user', content: userMessage });

        // Call Groq API with Llama 3.3 70B
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9,
        });

        const aiResponse = completion.choices[0]?.message?.content ||
            "I apologize, I couldn't generate a response. Please try again!";

        console.log(`✅ Groq Llama 3.1 response generated (${aiResponse.length} chars)`);

        return res.status(200).json({
            success: true,
            response: aiResponse,
            model: 'llama-3.1-70b-versatile',
            provider: 'Groq',
            stocksAnalyzed: symbols,
            hasRealData: stockContext.length > 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI Chatbot error:', error.message);

        // Fallback response
        return res.status(200).json({
            success: true,
            response: "I apologize, but I'm having trouble connecting to the AI service. For immediate help, check the **Market Summary** page for real-time data or view **Company Profiles** for detailed stock analysis!",
            model: 'fallback',
            provider: 'none',
            stocksAnalyzed: [],
            hasRealData: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
