
const axios = require('axios');

async function testBlocking() {
    console.log("Fetching news...");
    const res = await axios.get('https://bhidy.vercel.app/api/news?market=SA');
    const articles = res.data;

    const BLOCKED_KEYWORDS = ['maaal', 'asharq', 'borsa', 'daily news egypt', 'okaz', 'aleqt'];

    console.log(`\nTesting ${articles.length} articles against keywords: ${BLOCKED_KEYWORDS.join(', ')}\n`);

    let blockedCount = 0;
    let maaalCount = 0;

    articles.forEach((article, i) => {
        const isBlocked = BLOCKED_KEYWORDS.some(key =>
            (article.publisher || '').toLowerCase().includes(key) ||
            (article.link || '').toLowerCase().includes(key)
        );

        const isMaaal = (article.publisher || '').toLowerCase().includes('maaal') || (article.link || '').toLowerCase().includes('maaal');

        if (isMaaal) maaalCount++;

        if (isBlocked) {
            blockedCount++;
            console.log(`✅ BLOCKED: [${article.publisher}] ${article.title.substring(0, 30)}...`);
        } else if (isMaaal) {
            console.log(`❌ FAILED TO BLOCK MAAAL: [${article.publisher}] ${article.link}`);
        }
    });

    console.log(`\nSummary: Blocked ${blockedCount} articles.`);
    console.log(`Total Maaal Articles found: ${maaalCount}`);
}

testBlocking();
