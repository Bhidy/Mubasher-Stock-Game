const cheerio = require('cheerio');
const axios = require('axios');

async function testAleqt() {
    // URL provided by user (Markets section)
    const url = 'https://www.aleqt.com/%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%A7%D9%82';
    console.log(`Fetching ${url}...`);

    try {
        const resp = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log(`Status: ${resp.status}`);
        const $ = cheerio.load(resp.data);

        // Try to find news items
        // Aleqt structure usually: .views-row or .node-article or .news-block
        let count = 0;

        $('article, .views-row, .node').slice(0, 5).each((i, el) => {
            const $el = $(el);
            const title = $el.find('h2, h3, .title').text().trim();
            const link = $el.find('a').first().attr('href');
            let image = $el.find('img').attr('src');

            if (title && link) {
                console.log(`\nItem ${i + 1}:`);
                console.log(`Title: ${title}`);
                console.log(`Link: ${link}`);
                console.log(`Image: ${image}`);
                count++;
            }
        });

        console.log(`\nFound ${count} items.`);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

testAleqt();
