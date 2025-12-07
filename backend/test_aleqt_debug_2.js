const cheerio = require('cheerio');
const axios = require('axios');

async function testAleqt() {
    const url = 'https://www.aleqt.com/%D8%A7%D9%84%D8%A3%D8%B3%D9%88%D8%A7%D9%82';
    console.log(`Fetching ${url}...`);

    try {
        const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(resp.data);

        console.log('--- Headings H2/H3 ---');
        $('h2, h3').each((i, el) => {
            const text = $(el).text().trim();
            const link = $(el).find('a').attr('href');
            if (text.length > 5) {
                console.log(`Heading: ${text} | Link: ${link || 'None'}`);
            }
        });

    } catch (e) {
        console.error(e.message);
    }
}
testAleqt();
