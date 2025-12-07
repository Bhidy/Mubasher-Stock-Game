import axios from 'axios';

async function testHelp() {
    const title = "These 7 Stocks Are Analyst Favorites For Magnificent Earnings Growth; Lam Research, Google Among Winners";
    // We don't have the exact URL, but the backend search relies heavily on title for fallback if URL content fails.
    // However, the initial scrape uses the URL. 
    // Let's assume the user clicked an item from the feed. 
    // We'll search for this item in the feed first to get its URL.

    try {
        console.log('1. Fetching US news to find the article...');
        const feedRes = await axios.get('http://localhost:5001/api/news?market=US');
        const articles = feedRes.data;

        const article = articles.find(a => a.title.includes("These 7 Stocks") || a.title.includes("Lam Research"));

        if (!article) {
            console.log('Could not find the specific article in the live feed. Using a mock URL if needed, or testing with the top article.');
            // Fallback for testing: pick the first one from Investor's Business Daily if possible
            const ibd = articles.find(a => a.publisher.includes("Investor"));
            if (ibd) {
                console.log(`Found IBD article: ${ibd.title}`);
                await checkContent(ibd.link, ibd.title);
            } else {
                console.log('No IBD article found. Testing with top article.');
                if (articles.length > 0) await checkContent(articles[0].link, articles[0].title);
            }
            return;
        }

        console.log(`Found Target Article: ${article.title}`);
        console.log(`URL: ${article.link}`);
        await checkContent(article.link, article.title);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

async function checkContent(url, title) {
    console.log(`\n2. Fetching content for: "${title}"\nURL: ${url}`);
    try {
        const res = await axios.get(`http://localhost:5001/api/news/content`, {
            params: { url, title }
        });

        const content = res.data.content;
        console.log('\n--- CONTENT START ---');
        console.log(content ? content.substring(0, 500) + '...' : 'NULL/EMPTY');
        console.log('--- CONTENT END ---');

        if (content && content.includes("This is a developing story available on")) {
            console.log("FAIL: Teaser detected in output!");
        } else {
            console.log("SUCCESS: Content seems valid (checked for specific teaser phrase).");
        }
    } catch (e) {
        console.error('Content fetch error:', e.message);
        if (e.response && e.response.data) {
            console.error('SERVER ERROR DETAILS:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

testHelp();
