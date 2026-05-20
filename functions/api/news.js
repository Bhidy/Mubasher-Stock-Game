/**
 * News API - Cumulative Storage v2.1
 *
 * Root-cause fix for stale KV archive:
 * - GitHub Data Lake uses "published_at" (snake_case) — NOT "publishedAt"
 * - Previously, all GitHub articles were stored with wrong time (new Date().toISOString()),
 *   causing January 2026 timestamps to appear. Now correctly reads published_at.
 * - Sort uses actual publication date, with graceful fallbacks.
 * - ?forceFresh=true clears the KV archive and rebuilds from scratch.
 */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const market = url.searchParams.get('market') || 'SA';
    const forceFresh = url.searchParams.get('forceFresh') === 'true';

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

    const KV = env.CMS_DATA;
    const storageKey = `news_archive_${market}`;

    if (!KV) {
        console.error("[News API] CRITICAL: 'CMS_DATA' KV binding is missing!");
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Parse any date string (ISO, RFC 2822, Unix ms) to ISO string.
     * Returns null if unparseable.
     */
    const parseDate = (val) => {
        if (!val) return null;
        try {
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d.toISOString();
        } catch (e) { /* ignore */ }
        return null;
    };

    /**
     * Map GitHub Data Lake format → canonical article.
     * GitHub fields: title, url, image_url, published_at, source, country, market, content
     */
    const fromGitHub = (a) => ({
        id: a.url || a.link || a.id || null,
        title: a.title || '',
        publisher: a.source || a.publisher || 'Market News',
        link: a.url || a.link || null,
        // FIX: published_at is the correct field (snake_case, RFC date format)
        time: parseDate(a.published_at) || parseDate(a.time) || parseDate(a.pubDate) || parseDate(a.publishedAt) || null,
        thumbnail: a.image_url || a.imageUrl || a.thumbnail || 'https://placehold.co/600x400/f1f5f9/475569?text=News',
        content: a.content || a.summary || ''
    });

    /**
     * Map Vercel API format → canonical article.
     */
    const fromVercel = (a) => ({
        id: a.id || a.link || a.url || null,
        title: a.title || '',
        publisher: a.publisher || a.source || 'Market News',
        link: a.link || a.url || null,
        time: parseDate(a.time) || parseDate(a.pubDate) || parseDate(a.publishedAt) || null,
        thumbnail: a.thumbnail || a.image_url || a.imageUrl || 'https://placehold.co/600x400/f1f5f9/475569?text=News',
        content: a.content || a.summary || ''
    });

    /** Stable sort key: use time if available, else use archivedAt, else 0 */
    const getSortMs = (a) => {
        const t = parseDate(a.time) || parseDate(a.archivedAt);
        return t ? new Date(t).getTime() : 0;
    };

    // ─── Step 1: Fetch fresh news ────────────────────────────────────────────────

    let freshNews = [];

    // Try Vercel first
    try {
        const vercelUrl = `https://bhidy.vercel.app/api/news?market=${encodeURIComponent(market)}`;
        const res = await fetch(vercelUrl, {
            headers: { 'User-Agent': 'StocksHero-Cloudflare/2.0', 'Accept': 'application/json' }
        });
        if (res.ok) {
            const raw = await res.json();
            if (Array.isArray(raw) && raw.length > 0) {
                freshNews = raw.map(fromVercel);
                console.log(`[News API] Vercel: ${freshNews.length} articles for ${market}`);
            }
        }
    } catch (e) {
        console.error('[News API] Vercel fetch failed:', e.message);
    }

    // Fall back to GitHub Data Lake (raw JSON)
    if (freshNews.length === 0) {
        try {
            const githubUrl = `https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/news_${market}.json`;
            const res = await fetch(githubUrl, {
                headers: {
                    'User-Agent': 'StocksHero-Cloudflare/2.0',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const raw = await res.json();
                if (Array.isArray(raw) && raw.length > 0) {
                    freshNews = raw.map(fromGitHub).filter(a => a.title && a.title.length > 5);
                    console.log(`[News API] GitHub Data Lake: ${freshNews.length} articles for ${market}, latest: ${freshNews[0]?.time}`);
                }
            }
        } catch (e) {
            console.error('[News API] GitHub Data Lake fetch failed:', e.message);
        }
    }

    // ─── Step 2: Load existing KV archive ────────────────────────────────────────

    let archive = [];
    if (KV && !forceFresh) {
        try {
            const raw = await KV.get(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) archive = parsed;
            }
        } catch (e) {
            console.error('[News API] KV load failed:', e.message);
        }
    } else if (forceFresh) {
        console.log(`[News API] forceFresh=true — rebuilding ${market} archive from scratch`);
    }

    // ─── Step 3: Merge ────────────────────────────────────────────────────────────

    // For dedup, index existing archive by URL and normalized title
    const existingByUrl = new Map(archive.map(a => [a.link || a.url, a]));
    const existingByTitle = new Set(archive.map(a => (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')));

    let newCount = 0;
    for (const article of freshNews) {
        const normTitle = (article.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const articleUrl = article.link || article.id;

        // Update existing record if URL matches but time was wrong (fixes old stale records)
        if (articleUrl && existingByUrl.has(articleUrl)) {
            const existing = existingByUrl.get(articleUrl);
            if (!existing.time && article.time) {
                // Patch the missing time
                existing.time = article.time;
            }
            continue;
        }

        if (normTitle && existingByTitle.has(normTitle)) continue;

        archive.unshift({
            ...article,
            archivedAt: new Date().toISOString()
        });
        if (articleUrl) existingByUrl.set(articleUrl, article);
        if (normTitle) existingByTitle.add(normTitle);
        newCount++;
    }

    // ─── Step 4: Sort by publication date (newest first) ─────────────────────────

    archive.sort((a, b) => getSortMs(b) - getSortMs(a));

    // ─── Step 5: Trim ─────────────────────────────────────────────────────────────

    if (archive.length > 2000) {
        archive = archive.slice(0, 2000);
    }

    // ─── Step 6: Save to KV ───────────────────────────────────────────────────────

    if (KV) {
        try {
            await KV.put(storageKey, JSON.stringify(archive));
            console.log(`[News API] KV saved: ${archive.length} total, ${newCount} new, latest: ${archive[0]?.time}`);
        } catch (e) {
            console.error('[News API] KV save failed:', e.message);
        }
    }

    // ─── Step 7: Return ───────────────────────────────────────────────────────────

    return new Response(JSON.stringify(archive), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'X-News-Count': String(archive.length),
            'X-New-Articles': String(newCount),
            'X-Latest-Date': archive[0]?.time || 'unknown',
            'X-Market': market
        }
    });
}
