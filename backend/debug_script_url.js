const axios = require('axios');
const cheerio = require('cheerio');

async function extractScriptUrl() {
    const googleLink = 'https://news.google.com/rss/articles/CBMipgFBVV95cUxPeEhRYlR1cURlZjhmQ3d5NHNxWm11b0lYU3R2Z2JacnRUd19wNnZKczdOeXV1OUdVNmlwV0VzNTRZYVpESEUwa2QxVVI5N3R3Y09WakkxNFhZT1hKbjc1NU9ZUGx0WDhtSl9ZYXBNbFpFWVAyeWRGN1Ytd29VeG8xUWFqbWRiOFhIdm52bW03cEJZNEVFTG52d05mUHdJX1Awd2xKZl9B?oc=5';

    console.log('Fetching...');
    const resp = await axios.get(googleLink, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cookie': 'CONSENT=YES+US.en+20220101-00-0'
        }
    });

    const html = resp.data;
    const $ = cheerio.load(html);

    console.log('--- Script Tags ---');
    $('script').each((i, el) => {
        const txt = $(el).html();
        if (txt && (txt.includes('http') || txt.includes('location'))) {
            // Log only relevant parts
            const match = txt.match(/(https:\/\/[^"]+)/);
            if (match) console.log(`Potential URL found in script ${i}: ${match[1]}`);
        }
    });

    // Check for "opening..." text which often accompanies the link
    const bodyText = $('body').text().substring(0, 200);
    console.log('Body Text:', bodyText);
}

extractScriptUrl();
