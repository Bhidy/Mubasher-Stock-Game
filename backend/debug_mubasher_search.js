const axios = require('axios');
const cheerio = require('cheerio');

async function debugMubasherSearch() {
    const query = 'Mubasher.info partakes in Biban Forum 2025'; // Recent title
    const searchUrl = `https://english.mubasher.info/search?q=${encodeURIComponent(query)}`;

    console.log(`Searching: ${searchUrl}`);
    try {
        const resp = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(resp.data);

        // Find first result
        const firstLink = $('article a, .search-result a, .news-item a').first().attr('href');
        console.log('First link found:', firstLink);

        if (firstLink) {
            const fullUrl = firstLink.startsWith('http') ? firstLink : 'https://english.mubasher.info' + firstLink;
            console.log('Full URL:', fullUrl);

            // Verify it works
            const pageResp = await axios.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $page = cheerio.load(pageResp.data);
            console.log('Page Title:', $page('h1').text());
            const image = $page('meta[property="og:image"]').attr('content');
            console.log('Page Image:', image);
        } else {
            console.log('No search results found with selectors.');
            console.log('HTML Dump (partial):', $('body').html().substring(0, 500));
        }

    } catch (e) {
        console.log('Failed:', e.message);
    }
}

debugMubasherSearch();
