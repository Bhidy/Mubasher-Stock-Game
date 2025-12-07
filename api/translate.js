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
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'auto',
                tl: targetLang,
                dt: 't',
                q: text.substring(0, 2000)
            },
            timeout: 5000
        });

        if (response.data && response.data[0]) {
            const translatedText = response.data[0].map(s => s[0]).join('');
            return res.status(200).json({ translatedText });
        } else {
            return res.status(200).json({ translatedText: text });
        }
    } catch (error) {
        console.error('Translation Error:', error.message);
        res.status(500).json({ error: 'Translation failed' });
    }
}
