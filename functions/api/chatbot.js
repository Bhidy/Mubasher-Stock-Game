// Cloudflare Pages Function - AI Chatbot API
// Hybrid approach: Proxy to Vercel for Groq API access

const VERCEL_API_BASE = 'https://mubasher-stock-game.vercel.app';

// Helper: Create JSON response
const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};

// Fallback responses for common questions
const FALLBACK_RESPONSES = {
    default: `I'm Hero Ai, your financial assistant! 📈

I can help you with:
• Stock analysis and recommendations
• Market trends and insights  
• Investment strategies
• Portfolio guidance

Currently I'm working with limited connectivity, but I'm still here to help! What would you like to know about the markets today?`,

    aramco: `**Saudi Aramco (2222.SR)** 🛢️

Saudi Aramco is the world's largest oil company and a cornerstone of the Saudi economy. Here's what to consider:

📊 **Key Points:**
• World's most profitable company
• Strong dividend history
• Tied closely to oil prices
• Government ownership provides stability

⚠️ **Risks:** Oil price volatility, energy transition trends

💡 **Tip:** Consider your overall energy sector exposure before investing.`,

    rajhi: `**Al Rajhi Bank (1120.SR)** 🏦

Al Rajhi is the world's largest Islamic bank and a leading Saudi financial institution.

📊 **Key Points:**
• Strong retail banking presence
• Consistent dividend payer
• Benefits from Saudi Vision 2030
• Digital banking expansion

💡 **Tip:** Banks typically perform well with rising interest rates.`
};

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const body = await request.json();
        const { message, stockData } = body;

        if (!message) {
            return jsonResponse({ error: 'Message required' }, 400);
        }

        // Proxy to Vercel
        console.log('🤖 Proxying chatbot request to Vercel...');

        try {
            const vercelResponse = await fetch(`${VERCEL_API_BASE}/api/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Cloudflare-Pages-Proxy'
                },
                body: JSON.stringify({ message, stockData })
            });

            if (vercelResponse.ok) {
                const data = await vercelResponse.json();
                if (data && data.message) {
                    console.log('✅ Got response from Vercel chatbot');
                    return jsonResponse(data);
                }
            }
        } catch (proxyError) {
            console.error('Vercel proxy error:', proxyError.message);
        }

        // Fallback: Simple keyword matching
        const lowerMessage = message.toLowerCase();
        let response = FALLBACK_RESPONSES.default;

        if (lowerMessage.includes('aramco') || lowerMessage.includes('2222')) {
            response = FALLBACK_RESPONSES.aramco;
        } else if (lowerMessage.includes('rajhi') || lowerMessage.includes('1120')) {
            response = FALLBACK_RESPONSES.rajhi;
        }

        return jsonResponse({
            message: response,
            model: 'fallback'
        });

    } catch (error) {
        console.error('Chatbot error:', error.message);
        return jsonResponse({
            message: FALLBACK_RESPONSES.default,
            error: error.message
        });
    }
}
