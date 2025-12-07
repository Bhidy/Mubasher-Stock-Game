import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the HTML
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 8000 // 8s timeout
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove script, style, nav, footer, etc.
        $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share, .related-articles').remove();

        // Attempt to find the main article body using common selectors
        let content = '';
        const selectors = [
            'article',
            '.caas-body', // Yahoo
            '.article-body',
            '.story-content',
            '.ArticleBody',
            '.main-content',
            'main'
        ];

        for (const selector of selectors) {
            if ($(selector).length > 0) {
                // Get paragraphs
                $(selector).find('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 50) { // Filter short snippets
                        content += `<p>${text}</p>`;
                    }
                });
                if (content.length > 200) break; // Found enough content
            }
        }

        // Fallback: heuristic search for largest block of text
        if (content.length < 200) {
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                // Avoid utility links/copyrights
                if (text.length > 60 && !text.includes('Copyright') && !text.includes('Rights Reserved')) {
                    content += `<p>${text}</p>`;
                }
            });
        }

        if (!content) {
            return res.status(200).json({
                content: '<p>Could not extract article content automatically. Please view the original source.</p>'
            });
        }

        // Cache for 1 hour
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
        res.status(200).json({ content });

    } catch (error) {
        console.error('Content Fetch Error:', error.message);
        // Return structured error/fallback so frontend handles it gracefully
        res.status(200).json({
            content: `<p>Unable to load content (Source restricted or paywalled).</p>`
        });
    }
}
