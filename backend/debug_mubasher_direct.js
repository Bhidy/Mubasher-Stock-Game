const axios = require('axios');
const cheerio = require('cheerio');

async function debugMubasherDirect() {
    const url = 'http://english.mubasher.info/news/3981674/Pachin-receives-non-binding-takeover-offer-from-industrial-investment-firm';
    console.log(`Fetching ${url}...`);
    try {
        const resp = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(resp.data);

        console.log('Title:', $('h1').text().trim());
        console.log('Image:', $('img').attr('src') || $('meta[property="og:image"]').attr('content'));

        // Try to find content
        const content = $('[class*="content"], article, .main-content').text().trim().substring(0, 200);
        console.log('Content (Snippet):', content);

    } catch (e) {
        console.log('Failed:', e.message);
    }
}

debugMubasherDirect();
