const axios = require('axios');
const cheerio = require('cheerio');

async function debugLanding() {
    const urls = [
        'https://english.mubasher.info/countries/eg',
        'https://www.arabfinance.com/en/news/catcompany'
    ];

    for (const url of urls) {
        console.log(`\nFetching ${url}...`);
        try {
            const resp = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            console.log('Status:', resp.status);
            const $ = cheerio.load(resp.data);
            console.log('Title:', $('title').text());

            console.log('\n--- Article Links ---');
            let count = 0;
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.includes('/news/')) {
                    if (count < 3) console.log(href);
                    count++;
                }
            });
            console.log(`Found ${count} news links.`);
        } catch (e) {
            console.log('Failed:', e.message);
        }
    }
}

debugLanding();
