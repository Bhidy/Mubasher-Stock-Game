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
        // 1. Spoof Googlebot Mobile to bypass basic paywalls & lazy loading
        const userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

        // Helper to fetch
        const fetchHtml = async (targetUrl) => {
            const r = await axios.get(targetUrl, {
                headers: { 'User-Agent': userAgent, 'Accept': 'text/html,application/xhtml+xml' },
                timeout: 8000
            });
            return r.data;
        };

        let html = await fetchHtml(url);
        let $ = cheerio.load(html);

        // 2. Check for "Continue Reading" or Redirects (common in Yahoo/Simply Wall St)
        // Simply Wall St often has a link: <a href="...">Read the full article...</a>
        const readMoreLink = $('a:contains("Read the full article")').attr('href') ||
            $('a:contains("Continue reading")').attr('href');

        if (readMoreLink && readMoreLink.startsWith('http')) {
            console.log('Followed redirect to:', readMoreLink);
            html = await fetchHtml(readMoreLink);
            $ = cheerio.load(html);
        }

        // Remove junk
        $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share, .related-articles, .secondary-content').remove();

        let content = '';
        const selectors = [
            '[data-test-id="post-content"]', // Simply Wall St specific
            '.caas-body', // Yahoo
            'article',
            '.article-body',
            '.story-content',
            '.ArticleBody',
            '.main-content',
            'main',
            '#root' // Last resort for SPA
        ];

        for (const selector of selectors) {
            if ($(selector).length > 0) {
                $(selector).find('p').each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.length > 40) content += `<p>${text}</p>`;
                });
                if (content.length > 500) break;
            }
        }

        // Fallback: If still short, try stricter p-tag scrape
        if (content.length < 200) {
            $('p').each((i, el) => {
                const text = $(el).text().trim();
                // Heuristic: valid paragraphs usually end in punctuation and aren't too short
                if (text.length > 60 && /^[A-Z"']/.test(text) && /[.!?]$/.test(text)) {
                    if (!text.includes('Copyright') && !text.includes('Rights Reserved')) {
                        content += `<p>${text}</p>`;
                    }
                }
            });
        }

        if (!content || content.length < 100) {
            return res.status(200).json({
                content: '<p>Content is protected or requires login. Please view the original source.</p>'
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
