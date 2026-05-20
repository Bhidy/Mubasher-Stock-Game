import * as cheerio from 'cheerio';

/**
 * Content Extraction API v2
 *
 * Site-specific selectors first, then generic article body fallbacks.
 * Never returns full-page HTML — always extracts just the article body.
 */

// Per-domain selector map for precise extraction
const SITE_SELECTORS = {
    'mubasher.info':    ['.news-body', '.article-body', '.news-content', '.mi-article-content', '[class*="article-body"]', '[class*="news-body"]'],
    'argaam.com':       ['.article-content', '.story-body', '.full-article', 'article .body', '.post-body'],
    'zawya.com':        ['.article-body', '.zm-article-body', '[class*="article__body"]', '.story-content'],
    'aleqt.com':        ['.article-body', '.content-area', '.news-content', '[itemprop="articleBody"]'],
    'maaal.com':        ['.article-text', '.post-content', '.news-text', 'article .body'],
    'enterprise.press': ['.article-body', '.content', '.post-content', 'article'],
    'arabfinance.com':  ['.articleBody', '.news-content', '.post-body', '[class*="article"]'],
    'egx.com.eg':       ['.article-content', '.page-content', 'main .content'],
    'reuters.com':      ['[class*="article-body"]', '.StandardArticleBody_body', '[data-testid="article-body"]'],
    'bloomberg.com':    ['.body-content', '.article-body', '[class*="ArticleBody"]'],
    'cnbc.com':         ['.ArticleBody-articleBody', '.article-body', '[class*="article"]'],
    'marketwatch.com':  ['.article__body', '.story__body', '.article-content'],
    'yahoo.com':        ['.caas-body', '.article-content', '[class*="article"]'],
};

// Generic fallback selectors (ordered from most-specific to least)
const GENERIC_SELECTORS = [
    '[itemprop="articleBody"]',
    '.article-body',
    '.article__body',
    '.articleBody',
    '.post-body',
    '.post-content',
    '.entry-content',
    '.story-body',
    '.news-body',
    '.news-content',
    'article',
];

// Junk elements to always remove before extraction
const JUNK_SELECTORS = [
    'script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside',
    '.ad', '.advertisement', '.social', '.share', '.comments', '.related',
    '.recommended', '.newsletter', '.subscribe', '.popup', '.modal',
    'iframe', 'form', 'figure.related', '.tags', '.breadcrumb',
    '[class*="sidebar"]', '[class*="widget"]', '[class*="promo"]',
    '[class*="banner"]', '[id*="sidebar"]', '[id*="ad"]',
    // Schema.org markup not needed in rendered content
    'meta[itemprop]', '.scroll-anchor',
];

function getDomain(urlStr) {
    try {
        return new URL(urlStr).hostname.replace(/^www\./, '');
    } catch (e) {
        return '';
    }
}

function extractContent($, articleUrl) {
    const domain = getDomain(articleUrl);

    // 1. Site-specific selectors (try matching domain suffix)
    const matchedKey = Object.keys(SITE_SELECTORS).find(k => domain.includes(k));
    if (matchedKey) {
        for (const sel of SITE_SELECTORS[matchedKey]) {
            const el = $(sel).first();
            if (el.length && el.text().trim().length > 150) {
                return el.html() || '';
            }
        }
    }

    // 2. Generic selectors
    for (const sel of GENERIC_SELECTORS) {
        const el = $(sel).first();
        if (el.length && el.text().trim().length > 150) {
            return el.html() || '';
        }
    }

    // 3. Paragraph harvest (reliable final fallback — avoids full page dump)
    const paragraphs = [];
    $('p').each((i, el) => {
        const text = $(el).text().trim();
        // Skip very short/boilerplate paragraphs
        if (text.length > 40 && !text.match(/^(cookie|privacy|copyright|©|all rights|subscribe)/i)) {
            paragraphs.push(`<p>${$(el).html()}</p>`);
        }
    });

    if (paragraphs.length >= 2) {
        return paragraphs.join('\n');
    }

    return '';
}

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const articleUrl = url.searchParams.get('url');
    const title = url.searchParams.get('title') || '';

    if (!articleUrl) {
        return new Response(JSON.stringify({ error: 'URL required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    try {
        // Fetch article HTML
        const response = await fetch(articleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove all junk BEFORE extraction
        $(JUNK_SELECTORS.join(', ')).remove();

        let content = extractContent($, articleUrl);

        // Remove duplicate title from start of content
        if (title && content) {
            const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content
                .replace(new RegExp(`^\\s*<[^>]*>\\s*${escapedTitle}\\s*</[^>]*>\\s*`, 'i'), '')
                .replace(new RegExp(`^\\s*${escapedTitle}\\s*`, 'i'), '');
        }

        // Remove all images from content (hero image is already shown above)
        content = (content || '').replace(/<img[^>]*>/gi, '');

        // Final XSS cleanup
        if (content) {
            const $c = cheerio.load(content, null, false);
            $c('a').removeAttr('onclick').removeAttr('onmouseover').removeAttr('onload');
            $c('[onload], [onerror], [onclick]').removeAttr('onload').removeAttr('onerror').removeAttr('onclick');
            content = $c.html() || content;
        }

        const finalContent = (content && content.trim().length > 50)
            ? content
            : '<p>Content is available on the original source. Click the source link above to read the full article.</p>';

        return new Response(JSON.stringify({ content: finalContent }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
                'X-Content-Domain': getDomain(articleUrl),
            }
        });

    } catch (error) {
        console.error('[Content API] Error:', error.message);
        return new Response(JSON.stringify({
            content: `<p>Unable to load article content. Please <a href="${articleUrl}" target="_blank" rel="noopener noreferrer">view the original source</a>.</p>`,
            error: error.message
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}
