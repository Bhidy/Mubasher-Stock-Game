const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

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
        fs.writeFileSync('aleqt_dump.html', resp.data);
        console.log('Saved to aleqt_dump.html');

    } catch (e) {
        console.error('Error debugging Aleqt:', e.message);
    }
}

testAleqt();
