// AI Chatbot API - Powered by Groq (Llama 3.1)
// Version: 2.0.0 - Real LLM Integration
// Deployed: 2025-12-08

import Groq from 'groq-sdk';

// ============ GROQ CONFIGURATION ============
// Using Groq's free API with Llama 3.1 70B model
// Get your free API key at: https://console.groq.com/
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_placeholder_get_from_groq';

const groq = new Groq({ apiKey: GROQ_API_KEY });

// System prompt for Mubasher AI
const SYSTEM_PROMPT = `You are "Mubasher AI", an expert financial assistant specializing in the Saudi Arabian stock market (TASI/Tadawul), Egyptian stock market (EGX), and global markets.

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
3. Always mention risks with any recommendations
4. Be helpful and encouraging to investors
5. Use emojis sparingly for key points (📈 📉 💡 ⚠️ 🎯)
6. Format responses clearly with **bold** for emphasis
7. If you don't have specific data, provide general guidance
8. Never give guaranteed predictions - markets are unpredictable

Key Saudi Stocks:
- 2222 (Aramco) - World's largest oil company
- 1120 (Al Rajhi Bank) - Largest Islamic bank
- 2010 (SABIC) - Petrochemicals giant
- 7010 (STC) - Telecom leader
- 2082 (ACWA Power) - Renewable energy
- 1180 (SNB) - Saudi National Bank

Key Egyptian Stocks:
- COMI (CIB) - Commercial International Bank
- HRHO (EFG Hermes) - Investment bank

Respond in a friendly, professional manner as a trusted financial advisor.`;

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

// Format stock data for context
function formatStockContext(stockData) {
    if (!stockData) return '';

    return `
REAL-TIME STOCK DATA for ${stockData.longName || stockData.symbol}:
- Symbol: ${stockData.symbol}
- Current Price: ${stockData.price?.toFixed(2)} ${stockData.currency}
- Today's Change: ${stockData.change?.toFixed(2)} (${stockData.changePercent?.toFixed(2)}%)
- Previous Close: ${stockData.prevClose?.toFixed(2)}
- Day Range: ${stockData.low?.toFixed(2)} - ${stockData.high?.toFixed(2)}
- 52-Week Range: ${stockData.fiftyTwoWeekLow?.toFixed(2)} - ${stockData.fiftyTwoWeekHigh?.toFixed(2)}
- 50-Day MA: ${stockData.fiftyDayAverage?.toFixed(2)}
- 200-Day MA: ${stockData.twoHundredDayAverage?.toFixed(2)}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- Forward P/E: ${stockData.forwardPE?.toFixed(2) || 'N/A'}
- Market Cap: ${(stockData.marketCap / 1e9)?.toFixed(2)}B ${stockData.currency}
- Volume: ${stockData.volume?.toLocaleString()}
- Avg Volume: ${stockData.averageVolume?.toLocaleString()}
- Dividend Yield: ${((stockData.trailingAnnualDividendYield || 0) * 100).toFixed(2)}%
- Beta: ${stockData.beta?.toFixed(3) || 'N/A'}
- Analyst Rating: ${stockData.recommendationKey?.toUpperCase() || 'N/A'}
- Target Price: ${stockData.targetMeanPrice?.toFixed(2) || 'N/A'}
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
        console.log(`🤖 AI Chatbot (Groq Llama 3.1) processing: "${message.slice(0, 50)}..."`);

        // Determine base URL
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:5001';

        // Gather real stock data context
        let stockContext = '';
        const symbols = extractStockSymbols(message);

        for (const symbol of symbols.slice(0, 2)) {
            const stockData = await fetchStockData(symbol, baseUrl);
            if (stockData) {
                stockContext += formatStockContext(stockData);
            }
        }

        // Build conversation messages for Groq
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
        ];

        // Add conversation history (last 6 messages)
        for (const msg of conversationHistory.slice(-6)) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        }

        // Add current message with stock context
        let userMessage = message;
        if (stockContext) {
            userMessage = `${message}\n\n[CONTEXT - Use this real-time data in your response:]\n${stockContext}`;
        }
        messages.push({ role: 'user', content: userMessage });

        // Call Groq API with Llama 3.1 70B
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-70b-versatile',
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
