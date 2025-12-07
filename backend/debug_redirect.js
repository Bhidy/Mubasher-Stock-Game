const axios = require('axios');
const cheerio = require('cheerio');

async function debugRedirect() {
    const googleLink = 'https://news.google.com/rss/articles/CBMipgFBVV95cUxPeEhRYlR1cURlZjhmQ3d5NHNxWm11b0lYU3R2Z2JacnRUd19wNnZKczdOeXV1OUdVNmlwV0VzNTRZYVpESEUwa2QxVVI5N3R3Y09WakkxNFhZT1hKbjc1NU9ZUGx0WDhtSl9ZYXBNbFpFWVAyeWRGN1Ytd29VeG8xUWFqbWRiOFhIdm52bW03cEJZNEVFTG52d05mUHdJX1Awd2xKZl9B?oc=5';

    console.log('Fetching Google Link to inspect HTML...');
    const resp = await axios.get(googleLink, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    const html = resp.data;
    const $ = cheerio.load(html);

    console.log('Title:', $('title').text());

    // Look for links that might be the destination
    console.log('Links found:');
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.startsWith('./') && !href.startsWith('https://support.google.com') && !href.startsWith('https://accounts.google.com')) {
            console.log(`- ${href}`);
        }
    });

    // Look for data-n-url or specific attributes Google uses
    const cLink = $('c-wiz a[rel="nofollow"]').attr('href');
    if (cLink) console.log('Found c-wiz link:', cLink);

    // Look for JS redirection
    const scriptContent = $('script').text();
    if (scriptContent.includes('window.location')) {
        console.log('Found window.location in script');
    }
}

debugRedirect();
