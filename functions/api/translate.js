// Cloudflare Pages Function - Translate API
// Converted from Vercel to Cloudflare Workers format

// Helper: Create JSON response with CORS headers
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

// Translate a chunk of text using Google Translate API
const translateChunk = async (chunk, targetLang) => {
    if (!chunk.trim()) return '';

    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'auto');
    url.searchParams.set('tl', targetLang);
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', chunk);

    const response = await fetch(url.toString(), {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) return chunk;

    const data = await response.json();
    if (data && data[0]) {
        return data[0].map(s => s[0]).join('');
    }
    return chunk;
};

// Cloudflare Pages Function Handler
export async function onRequest(context) {
    const { request } = context;

    // Handle CORS preflight
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
        const { text, targetLang = 'ar' } = body;

        if (!text) {
            return jsonResponse({ error: 'Text required' }, 400);
        }

        // Split text into paragraphs
        const paragraphs = text.split(/\n+/);
        const translatedParagraphs = [];

        // Process in smaller chunks (~1500 chars)
        let currentChunk = '';
        for (const para of paragraphs) {
            if (currentChunk.length + para.length < 1500) {
                currentChunk += para + '\n\n';
            } else {
                if (currentChunk.trim()) {
                    translatedParagraphs.push(await translateChunk(currentChunk, targetLang));
                }
                currentChunk = para + '\n\n';
            }
        }

        // Last chunk
        if (currentChunk.trim()) {
            translatedParagraphs.push(await translateChunk(currentChunk, targetLang));
        }

        const finalTranslation = translatedParagraphs.join('\n\n');
        return jsonResponse({ translatedText: finalTranslation });

    } catch (error) {
        console.error('Translation Error:', error.message);
        // Fallback: return original text
        try {
            const body = await request.json();
            return jsonResponse({ translatedText: body.text || '' });
        } catch {
            return jsonResponse({ translatedText: '' });
        }
    }
}
