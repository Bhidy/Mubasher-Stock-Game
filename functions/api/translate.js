/**
 * Cloudflare Pages Function: /api/translate
 * Proxy to Google Translate API
 */

const VERCEL_API_URL = 'https://bhidy.vercel.app/api/translate';

export async function onRequestPost(context) {
    try {
        const { text, targetLang } = await context.request.json();

        if (!text || !targetLang) {
            return new Response(JSON.stringify({ error: 'Missing text or targetLang' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // Forward to Vercel API which has the translation implementation
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLang })
        });

        if (!response.ok) {
            // Fallback: Use Google Translate URL (simple fetch)
            const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

            const googleRes = await fetch(googleUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (googleRes.ok) {
                const data = await googleRes.json();
                // Extract translated text from Google's response format
                let translatedText = '';
                if (data && data[0]) {
                    data[0].forEach(item => {
                        if (item[0]) translatedText += item[0];
                    });
                }

                return new Response(JSON.stringify({ translatedText }), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }

            throw new Error('Translation failed');
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error('Translation error:', error);
        return new Response(JSON.stringify({
            error: 'Translation failed',
            translatedText: null
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
