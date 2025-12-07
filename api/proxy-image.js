export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL required');
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!response.ok) throw new Error('Fetch failed');

        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(Buffer.from(buffer));
    } catch {
        res.redirect('https://placehold.co/600x400?text=Image+Error');
    }
}
