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

// Helper: Extract content with Cheerio - Enhanced for better coverage
const extractWithCheerio = (html, sourceUrl = '') => {
    const $ = cheerio.load(html);

    // Remove non-content elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .social-share, .related-articles, .secondary-content, .comments, .sidebar, .widget, .share-buttons, .breadcrumb, .promo, [role="banner"], [role="navigation"]').remove();

    // Extract Main Image (og:image) to prepend if needed
    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');

    let content = '';

    // If found main image, add it at top
    if (ogImage) {
        content += `<img src="${ogImage}" style="width:100%; border-radius:12px; margin-bottom:1rem;" alt="Article Image" /><br/>`;
    }

    // Enhanced selectors - ordered by specificity
    const selectors = [
        // Mubasher specific
        '.news-content', '.news-body', '.news-details', '.article-details-content',
        '[class*="article-content"]', '[class*="news-content"]', '[class*="post-content"]',
        // Argaam
        '#articleBody', '.articleBody', '.article-content',
        // Arab News, Egypt Today
        '.article-body', '.entry-content', '.post-body',
        // Daily News Egypt
        '.td-post-content', '.post-content',
        // Zawya
        '.details-body', '.article-text', '.story-body',
        // Investing.com
        '.WYSIWYG.articlePage', '#article', '.articlePage',
        // Simply Wall St
        '[data-test-id="post-content"]',
        // Yahoo
        '.caas-body', '.caas-content',
        // Bloomberg, Reuters
        '.ArticleBody', '.story-text', '.story-content',
        // Generic fallbacks
        'article .content', 'article', '.main-content', 'main', '.content'
    ];

    for (const selector of selectors) {
        const $section = $(selector);
        if ($section.length > 0) {
            // Get ALL paragraphs, lists, and headings
            $section.find('p, h2, h3, h4, li').each((i, el) => {
                const text = $(el).text().trim();
                const tagName = el.tagName?.toLowerCase() || 'p';

                // Skip short or irrelevant content
                if (text.length < 30) return;
                if (text.includes('©') || text.includes('Copyright')) return;
                if (text.includes('Terms of Use') || text.includes('Privacy Policy')) return;
                if (text.includes('Subscribe') || text.includes('Sign up')) return;

                if (tagName === 'li') {
                    content += `<p>• ${text}</p>`;
                } else if (tagName.startsWith('h')) {
                    content += `<h3 style="font-weight:700; margin-top:1rem;">${text}</h3>`;
                } else {
                    content += `<p>${text}</p>`;
                }
            });

            if (content.length > 500) break;
        }
    }

    // Fallback: scan all paragraphs if still not enough content
    if (content.length < 300) {
        $('p').each((i, el) => {
            const text = $(el).text().trim();
            // Accept paragraphs that look like article content
            if (text.length > 50 && text.length < 2000) {
                if (!text.includes('Copyright') && !text.includes('©') &&
                    !text.includes('Terms of Use') && !text.includes('Subscribe')) {
                    content += `<p>${text}</p>`;
                }
            }
        });
    }

    return content;
};

// Helper: Translate Arabic content to English
const translateArabic = async (content) => {
    if (!content || !/[\u0600-\u06FF]/.test(content)) return content;

    try {
        const plainText = content.replace(/<[^>]+>/g, '\n').trim();
        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(plainText.substring(0, 4000))}`;
        const translateRes = await axios.get(translateUrl, { timeout: 5000 });
        if (translateRes.data && translateRes.data[0]) {
            const translatedText = translateRes.data[0].map(s => s[0]).join('');
            const paragraphs = translatedText.split('\n').filter(p => p.trim().length > 20);
            return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
        }
    } catch (e) {
        console.log('Translation failed, keeping original');
    }
    return content;
};
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

        // --- Strategy 2.5: Translate Arabic content to English ---
        if (content && content.length > 100) {
            content = await translateArabic(content);
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
