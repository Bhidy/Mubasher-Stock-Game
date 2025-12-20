const fs = require('fs');

const raw = fs.readFileSync('./backend/data/scraped_news.json', 'utf8');
const articles = JSON.parse(raw);

const sa = [];
const eg = [];
const us = [];

articles.forEach(a => {
    // Normalize country code
    const country = (a.country || '').toUpperCase();
    const market = (a.market || '').toUpperCase();

    if (country === 'SA' || market === 'TDWL' || market === 'SAUDI') {
        sa.push(a);
    } else if (country === 'EG' || market === 'EGX' || market === 'EGYPT') {
        eg.push(a);
    } else if (country === 'US' || market === 'NASDAQ' || market === 'NYSE') {
        us.push(a);
    } else {
        // Default based on source if possible, or skip
        if (a.source === 'Argaam' || a.source === 'Okaz') sa.push(a);
        else if (a.source === 'Mubasher' && a.url.includes('english.mubasher.info')) {
            // Heuristic: check content or title? defaulting to SA if unclear, but let's be safe
            // Mubasher covers both. Let's look for simple clues
            if (JSON.stringify(a).includes('Egypt') || JSON.stringify(a).includes('Cairo')) eg.push(a);
            else sa.push(a);
        }
    }
});

fs.writeFileSync('news_archive_SA.json', JSON.stringify(sa));
fs.writeFileSync('news_archive_EG.json', JSON.stringify(eg));
fs.writeFileSync('news_archive_US.json', JSON.stringify(us));

console.log(`Prepared archives: SA=${sa.length}, EG=${eg.length}, US=${us.length}`);
