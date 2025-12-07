import axios from 'axios';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, targetLang = 'ar' } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text required' });
    }

    try {
        // 1. Split text into chunks to handle long articles (>2000 chars)
        // We split by newlines to preserve paragraph structure
        const paragraphs = text.split(/\n+/);
        const translatedParagraphs = [];

        // Chunk processing function
        const translateChunk = async (chunk) => {
            if (!chunk.trim()) return '';
            const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: {
                    client: 'gtx',
                    sl: 'auto',
                    tl: targetLang,
                    dt: 't',
                    q: chunk
                },
                timeout: 8000
            });
            if (res.data && res.data[0]) {
                return res.data[0].map(s => s[0]).join('');
            }
            return chunk;
        };

        // Process in smaller batches to match API limits
        // We group paragraphs into chunks of ~1500 chars safely
        let currentChunk = '';
        for (const para of paragraphs) {
            if (currentChunk.length + para.length < 1500) {
                currentChunk += para + '\n\n';
            } else {
                // Translate accumulated chunk
                if (currentChunk.trim()) {
                    translatedParagraphs.push(await translateChunk(currentChunk));
                }
                currentChunk = para + '\n\n';
            }
        }
        // Last chunk
        if (currentChunk.trim()) {
            translatedParagraphs.push(await translateChunk(currentChunk));
        }

        const finalTranslation = translatedParagraphs.join('\n\n');
        return res.status(200).json({ translatedText: finalTranslation });

    } catch (error) {
        console.error('Translation Error:', error.message);
        // Fallback: return original text if translation fails completely
        return res.status(200).json({ translatedText: text });
    }
}
