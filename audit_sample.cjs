
const axios = require('axios');
const cheerio = require('cheerio');

// Sample of "Influencer" accounts to audit
const ACCOUNTS_TO_AUDIT = [
    'Mohmed123654', 'm0ajed', 'eafggy', 'AbuHusssain', 'fsawadi',
    'moath9419', 'falolayan1', 'll2020ll2', 'Luqman14001400', 'HMMH11111'
];

async function fetchTweets(username) {
    try {
        const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 5000
        });

        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (!nextDataScript) return [];

        const data = JSON.parse(nextDataScript);
        const timeline = data?.props?.pageProps?.timeline?.entries || [];

        return timeline
            .filter(e => e.type === 'tweet')
            .map(e => e.content?.tweet?.full_text || e.content?.tweet?.text || '')
            .slice(0, 3);

    } catch (e) {
        return ['Error fetching'];
    }
}

async function audit() {
    console.log("🔍 Auditing Sample Accounts for Relevance...\n");

    for (const user of ACCOUNTS_TO_AUDIT) {
        const tweets = await fetchTweets(user);

        // Simple keyword check
        const financialKeywords = ['tasi', 'stock', 'profit', 'market', 'price', 'dividend', 'company', 'sector', 'chart', 'analysis', 'p/e', 'sar', 'aramco', 'rajhi', 'sabic', 'bull', 'bear', 'support', 'resist', 'سوق', 'اسهم', 'تاسي', 'أرباح', 'توزيعات', 'تحليل', 'فني', 'مالي', 'شركة', 'قطاع'];

        let score = 0;
        tweets.forEach(t => {
            if (financialKeywords.some(k => t.toLowerCase().includes(k))) score++;
        });

        console.log(`👤 @${user}`);
        console.log(`   📝 Recent Tweets:`);
        tweets.forEach(t => console.log(`      - "${t.slice(0, 50)}..."`));
        console.log(`   📊 Relevance Score: ${score}/3`);
        console.log("---------------------------------------------------");

        // Random delay
        await new Promise(r => setTimeout(r, 1000));
    }
}

audit();
