const axios = require('axios');
const xml2js = require('xml2js');

async function testBingFallback(query) {
    const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&mkt=en-us`;
    console.log('Fetching Bing RSS:', url);

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        const items = result.rss.channel[0].item;
        if (items && items.length > 0) {
            const first = items[0];
            console.log('--- Bing Result ---');
            console.log('Title:', first.title[0]);
            console.log('Link:', first.link[0]);
            console.log('Description:', first.description[0]);
            return first.description[0];
        } else {
            console.log('No items found.');
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

testBingFallback('CPC Cuts Fail to Lift Brent as Saudi Pricing Undercuts Rally');
