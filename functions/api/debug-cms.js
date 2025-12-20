export async function onRequest(context) {
    const BLOB_ID = '019b0ddc-4ee6-704c-a45a-1e5484206a91';
    const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

    try {
        const res = await fetch(BLOB_URL);
        const data = await res.json();

        return new Response(JSON.stringify({
            status: res.status,
            ok: res.ok,
            data_preview: {
                news_count: data.news ? data.news.length : 0,
                news_ids: data.news ? data.news.map(n => n.id) : [],
                first_news: data.news ? data.news[0] : null
            },
            raw_keys: Object.keys(data)
        }, null, 2), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
