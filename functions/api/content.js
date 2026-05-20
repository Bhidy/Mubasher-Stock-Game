import * as cheerio from 'cheerio';

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

    try {
        // Fetch article HTML
        const response = await fetch(articleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove junk elements
        $('script, style, nav, header, footer, aside, .ad, .advertisement, .social, .share, .comments, .related, iframe').remove();

        // Target likely content containers based on typical news sites
        let content = '';
        const selectors = [
            'article .article-body',
            'article .content',
            '.main-content',
            'div[class*="content"]',
            'article',
            '[itemprop="articleBody"]',
            '.post-content',
            '.entry-content',
            'main'
        ];

        for (const selector of selectors) {
            const el = $(selector);
            if (el.length > 0) {
                content = el.html() || '';
                break;
            }
        }

        // Fallback: grab all paragraphs
        if (!content || content.length < 200) {
            let pText = [];
            $('p').each((i, el) => {
                pText.push($(el).html());
            });
            if (pText.length > 0) {
                content = '<p>' + pText.join('</p><p>') + '</p>';
            }
        }

        // Basic HTML cleanup to prevent XSS and broken layouts
        if (content) {
             const $content = cheerio.load(content, null, false);
             $content('a').removeAttr('onclick').removeAttr('onmouseover');
             $content('img').removeAttr('onerror');
             content = $content.html();
        }

        return new Response(JSON.stringify({ content: content || '<p>Content extraction failed or article is very short.</p>' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('Content Extraction Error:', error);
        return new Response(JSON.stringify({
            content: `<p>Unable to load content. Please view the original source.</p>`,
            error: error.message
        }), {
            status: 200, // Returning 200 so UI doesn't crash
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
