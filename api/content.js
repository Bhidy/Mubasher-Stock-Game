import axios from 'axios';
import * as cheerio from 'cheerio';

// Helper: Fetch with Googlebot user agent
const fetchWithGooglebot = async (url) => {
    const userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    const response = await axios.get(url, {
        headers: { 'User-Agent': userAgent, 'Accept': 'text/html,application/xhtml+xml' },
        timeout: 8000
    });
    return response.data;
};

// Helper: Extract content with Cheerio
const extractWithCheerio = (html) => {
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share, .related-articles, .secondary-content').remove();

    let content = '';
    const selectors = [
        '#articleBody', // Argaam
        '.article-body', // Arab News, Egypt Today, Mubasher
        '.td-post-content', // Daily News Egypt
        '.details-body', // Zawya (Alternative)
        '.article-text', // Zawya
        '.WYSIWYG.articlePage', // Investing.com
        '#article', // Investing.com (Alternative)
        '[data-test-id="post-content"]', // Simply Wall St
        '.caas-body', // Yahoo
        '.news-details', // Mubasher
        '.ArticleBody', // Bloomberg
        '.story-text', // Reuters
        '.story-content',
        'article',
        '.main-content',
        'main'
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

    if (content.length < 200) {
        $('p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 60 && /^[A-Z"']/.test(text) && /[.!?]$/.test(text)) {
                if (!text.includes('Copyright') && !text.includes('Rights Reserved')) {
                    content += `<p>${text}</p>`;
                }
            }
        });
    }

    return content;
};

// Helper: Use a free public Reader API (12ft.io bypass or Outline.com style)
const tryReaderService = async (url) => {
    try {
        // Use the free 12ft.io service to bypass soft paywalls and get text
        // This works by fetching the Google Cache or AMP version
        const readerUrl = `https://12ft.io/api/proxy?q=${encodeURIComponent(url)}`;
        const response = await axios.get(readerUrl, { timeout: 8000 });

        if (response.data && typeof response.data === 'string') {
            return extractWithCheerio(response.data);
        }
        return '';
    } catch (e) {
        console.error('Reader service failed:', e.message);
        return '';
    }
};

// Helper: Build "View Original" link with nice UI
const buildOriginalLink = (url, publisher) => {
    return `<p style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 12px; text-align: center;">
        <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0D85D8; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
            📰 Read full article on ${publisher || 'source'} →
        </a>
    </p>`;
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url, title } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // --- Strategy 1: Direct fetch with Googlebot ---
        let html = await fetchWithGooglebot(url);
        let $ = cheerio.load(html);

        // Check for "Read full article" redirect links
        const readMoreLink = $('a:contains("Read the full article")').attr('href') ||
            $('a:contains("Continue reading")').attr('href') ||
            $('a:contains("View full article")').attr('href');

        if (readMoreLink && readMoreLink.startsWith('http')) {
            console.log('Following redirect to:', readMoreLink);
            html = await fetchWithGooglebot(readMoreLink);
        }

        let content = extractWithCheerio(html);

        // --- Strategy 2: Reader Service (if content is too short) ---
        if (content.length < 200) {
            console.log('Trying reader service for:', url);
            const readerContent = await tryReaderService(url);
            if (readerContent.length > content.length) {
                content = readerContent;
            }
        }

        // --- Strategy 3: If still nothing, provide a graceful fallback ---
        if (!content || content.length < 100) {
            // Extract publisher from URL
            let publisher = 'the source';
            try {
                publisher = new URL(url).hostname.replace('www.', '');
            } catch (e) { }

            content = `<p>This article requires JavaScript or is behind a paywall.</p>` + buildOriginalLink(url, publisher);
        }

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
        res.status(200).json({ content });

    } catch (error) {
        console.error('Content Fetch Error:', error.message);

        // Extract publisher from URL for fallback
        let publisher = 'the original source';
        try {
            publisher = new URL(url).hostname.replace('www.', '');
        } catch (e) { }

        res.status(200).json({
            content: `<p>Unable to load content automatically.</p>` + buildOriginalLink(url, publisher)
        });
    }
}
