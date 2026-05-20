/**
 * News API v3 - Direct GitHub Data Lake Proxy
 *
 * ARCHITECTURE: No KV cache, no Vercel dependency, no stale data ever.
 * - Always reads fresh from GitHub Data Lake (updated every 10 min by GitHub Actions)
 * - Normalizes field names (published_at → time)
 * - Sorts newest-first
 * - CORS headers for mobile + web
 *
 * GitHub Data Lake fields: title, url, image_url, published_at, source, content
 */

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const market = (url.searchParams.get('market') || 'SA').toUpperCase();

    // Allowed markets
    const VALID_MARKETS = ['SA', 'EG', 'US'];
    const safeMarket = VALID_MARKETS.includes(market) ? market : 'SA';

    // CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    const REPO = 'Bhidy/Mubasher-Stock-Game';
    const BRANCH = 'main';
    const githubUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/data/news_${safeMarket}.json`;

    try {
        const res = await fetch(githubUrl, {
            headers: {
                'User-Agent': 'BhidyApp-Edge/3.0',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        if (!res.ok) {
            console.error(`[News API] GitHub fetch failed: ${res.status} for ${safeMarket}`);
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const rawArticles = await res.json();

        if (!Array.isArray(rawArticles)) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // Normalize: GitHub uses published_at (RFC 2822), we need ISO time
        const normalize = (a) => {
            let time = null;
            // Try all possible date fields in priority order
            const raw = a.published_at || a.time || a.pubDate || a.publishedAt;
            if (raw) {
                try {
                    const d = new Date(raw);
                    if (!isNaN(d.getTime())) time = d.toISOString();
                } catch (e) { /* skip */ }
            }

            return {
                id: a.url || a.link || a.id || null,
                title: (a.title || '').trim(),
                publisher: a.source || a.publisher || 'Market News',
                link: a.url || a.link || null,
                time,
                thumbnail: a.image_url || a.imageUrl || a.thumbnail || null,
                content: a.content || a.summary || '',
                market: safeMarket
            };
        };

        // Normalize + filter out empty titles
        const articles = rawArticles
            .map(normalize)
            .filter(a => a.title && a.title.length > 5);

        // Sort newest first (articles with null time go to end)
        articles.sort((a, b) => {
            if (!a.time && !b.time) return 0;
            if (!a.time) return 1;
            if (!b.time) return -1;
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });

        const latestDate = articles[0]?.time || 'unknown';
        console.log(`[News API] ${safeMarket}: ${articles.length} articles, latest: ${latestDate}`);

        return new Response(JSON.stringify(articles), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // Cache 5 minutes at edge — GitHub updates every 10 min so this is safe
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
                'X-News-Count': String(articles.length),
                'X-Latest-Date': latestDate,
                'X-Market': safeMarket,
                'X-Source': 'github-data-lake'
            }
        });

    } catch (error) {
        console.error('[News API] Critical error:', error.message);
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Error': error.message
            }
        });
    }
}
