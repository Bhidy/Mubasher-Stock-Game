
// Cloudflare Pages Function for AI Chatbot
// Replaces previous Vercel function, uses direct Groq API fetch (no SDK dependency)

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

// 1. Helper: Extract symbols
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

// 2. Helper: Signals
function getTechnicalSignals(quote) {
    const price = quote.regularMarketPrice;
    const ma50 = quote.fiftyDayAverage;
    const ma200 = quote.twoHundredDayAverage;
    const signals = [];

    // MA Signals
    if (price && ma50) {
        if (price > ma50) signals.push("Price above 50-Day MA (Bullish Trend 🟢)");
        else signals.push("Price below 50-Day MA (Bearish Trend 🔴)");
    }

    if (ma50 && ma200) {
        if (ma50 > ma200) signals.push("50-Day MA above 200-Day MA (Long-term Uptrend 📈)");
        else signals.push("50-Day MA below 200-Day MA (Long-term Downtrend 📉)");
    }

    return signals;
}

// 3. Helper: Format context
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

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    try {
        const { message, conversationHistory = [] } = await request.json();

        if (!message) {
            return new Response(JSON.stringify({ error: 'Message required' }), { status: 400, headers: corsHeaders });
        }

        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("Missing GROQ_API_KEY in environment variables.");
            return new Response(JSON.stringify({
                success: true, // Return success so frontend displays the message
                response: "**Configuration Error ⚠️**\n\nThe `GROQ_API_KEY` is missing from the server settings. \n\nPlease add it in the Cloudflare Dashboard > Settings > Environment Variables.",
                hasRealData: false
            }), { status: 200, headers: corsHeaders });
        }

        // Build Context
        let contextData = '';
        const symbols = extractStockSymbols(message);
        let market = 'SA'; // Default to Saudi
        const stockDataList = [];

        // Fetch Data from internal endpoints
        // Note: In Cloudflare Workers, fetch to internal URL requires absolute URL
        for (const symbol of symbols.slice(0, 2)) {
            try {
                const stockRes = await fetch(`${url.origin}/api/stock-profile?symbol=${encodeURIComponent(symbol)}`);
                if (stockRes.ok) {
                    const stockData = await stockRes.json();

                    const quote = {
                        regularMarketPrice: stockData.price,
                        fiftyDayAverage: stockData.fiftyDayAverage,
                        twoHundredDayAverage: stockData.twoHundredDayAverage
                    };
                    const technicals = getTechnicalSignals(quote);

                    contextData += formatStockContext(stockData, technicals);
                    stockDataList.push(stockData);

                    if (symbol.endsWith('.CA')) market = 'EG';
                    else if (!symbol.includes('.')) market = 'US';
                }
            } catch (err) {
                console.error(`Failed to fetch stock data for ${symbol}:`, err);
            }
        }

        // Fetch News
        if (symbols.length > 0 || message.toLowerCase().includes('news')) {
            try {
                const newsRes = await fetch(`${url.origin}/api/news?market=${market}&limit=3`);
                if (newsRes.ok) {
                    const newsData = await newsRes.json();
                    if (newsData.articles && newsData.articles.length > 0) {
                        contextData += `\nLATEST NEWS HEADLINES (Use to explain price moves):\n`;
                        newsData.articles.forEach((article, i) => {
                            contextData += `${i + 1}. "${article.title}" - ${article.source} (${article.time || 'Today'})\n`;
                        });
                    }
                }
            } catch (err) {
                console.error(`Failed to fetch news for ${market}:`, err);
            }
        }

        // Prepare messages for LLM
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        // Add minimal history
        for (const msg of conversationHistory.slice(-6)) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        }

        // Add user message with context
        let finalUserContent = message;
        if (contextData) {
            finalUserContent = `${message}\n\n[REAL-TIME MARKET DATA & NEWS]\n${contextData}\n\nAnalyze the data above to give a specific answer. Calculate the trend based on the MA signals provided. Explain the price movement using the news headlines if relevant.`;
        }
        messages.push({ role: 'user', content: finalUserContent });

        // Call Groq API directly
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 0.9
            })
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            throw new Error(`Groq API Error: ${groqResponse.status} - ${errorText}`);
        }

        const groqData = await groqResponse.json();
        const aiResponse = groqData.choices?.[0]?.message?.content || "I couldn't generate a response.";

        return new Response(JSON.stringify({
            success: true,
            response: aiResponse,
            model: 'llama-3.3-70b-versatile',
            provider: 'Groq',
            stocksAnalyzed: symbols,
            hasRealData: contextData.length > 0,
            timestamp: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('Chatbot Function Error:', error);
        return new Response(JSON.stringify({
            success: true, // Fail gracefully to frontend
            response: "I apologize, but I'm having trouble connecting to the AI service. The system might be missing configuration. Please try checking the Market Summary page instead!",
            error: error.message
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}
