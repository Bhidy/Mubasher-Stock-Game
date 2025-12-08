// Cloudflare Pages Function - Translate API
// Hybrid approach: Proxy to Vercel for reliable translation

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

// Translate using Google Translate API
const translateText = async (text, targetLang = 'en') => {
    if (!text?.trim()) return '';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) return text;

    const data = await response.json();
    if (data && data[0]) {
        return data[0].map(s => s[0]).join('');
    }
    return text;
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
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    try {
        const body = await request.json();
        const { text, targetLang = 'en', target = 'en' } = body;
        const lang = targetLang || target;

        if (!text) {
            return jsonResponse({ error: 'Text required' }, 400);
        }

        // Try Vercel proxy first
        try {
            const vercelResponse = await fetch(`${VERCEL_API_BASE}/api/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Cloudflare-Pages-Proxy'
                },
                body: JSON.stringify({ text, targetLang: lang })
            });

            if (vercelResponse.ok) {
                const data = await vercelResponse.json();
                if (data.translatedText) {
                    return jsonResponse(data);
                }
            }
        } catch (e) {
            console.log('Vercel proxy failed, using direct translation');
        }

        // Direct translation
        const translatedText = await translateText(text, lang);
        return jsonResponse({ translatedText });

    } catch (error) {
        console.error('Translation Error:', error.message);
        return jsonResponse({ error: 'Translation failed', translatedText: '' }, 500);
    }
}
