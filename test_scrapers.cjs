// Comprehensive QA Test for News Scrapers
const {
    fetchAllSaudiNews,
    fetchAllEgyptNews,
    extractContentFromPage
} = require('./backend/scrapers/newsSources');

async function runQATest() {
    console.log('='.repeat(70));
    console.log('🧪 COMPREHENSIVE QA TEST - News Scrapers');
    console.log('='.repeat(70));
    console.log('Testing that EVERY article has: TITLE, IMAGE, CONTENT ACCESS\n');

    // Test Saudi
    console.log('🇸🇦 TESTING SAUDI ARABIA...');
    const startSA = Date.now();
    const sa = await fetchAllSaudiNews();
    const timeSA = ((Date.now() - startSA) / 1000).toFixed(1);

    // Test Egypt
    console.log('🇪🇬 TESTING EGYPT...');
    const startEG = Date.now();
    const eg = await fetchAllEgyptNews();
    const timeEG = ((Date.now() - startEG) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(70));
    console.log('📊 QA RESULTS');
    console.log('='.repeat(70));

    // Saudi breakdown by source
    console.log('\n🇸🇦 SAUDI ARABIA:');
    const saPublishers = {};
    sa.forEach(a => saPublishers[a.publisher] = (saPublishers[a.publisher] || 0) + 1);
    Object.entries(saPublishers).sort((a, b) => b[1] - a[1]).forEach(([p, c]) => {
        console.log(`   ✅ ${p}: ${c} articles`);
    });
    console.log(`   📈 TOTAL: ${sa.length} articles (${timeSA}s)`);

    // Egypt breakdown by source
    console.log('\n🇪🇬 EGYPT:');
    const egPublishers = {};
    eg.forEach(a => egPublishers[a.publisher] = (egPublishers[a.publisher] || 0) + 1);
    Object.entries(egPublishers).sort((a, b) => b[1] - a[1]).forEach(([p, c]) => {
        console.log(`   ✅ ${p}: ${c} articles`);
    });
    console.log(`   📈 TOTAL: ${eg.length} articles (${timeEG}s)`);

    // Validation checks
    console.log('\n' + '='.repeat(70));
    console.log('✅ VALIDATION CHECKS');
    console.log('='.repeat(70));

    const saNoTitle = sa.filter(a => !a.title || a.title.length < 10).length;
    const saNoImage = sa.filter(a => !a.thumbnail).length;
    const saNoLink = sa.filter(a => !a.link || a.link === '#').length;
    const saGoogleImg = sa.filter(a => a.thumbnail && a.thumbnail.includes('google')).length;

    const egNoTitle = eg.filter(a => !a.title || a.title.length < 10).length;
    const egNoImage = eg.filter(a => !a.thumbnail).length;
    const egNoLink = eg.filter(a => !a.link || a.link === '#').length;
    const egGoogleImg = eg.filter(a => a.thumbnail && a.thumbnail.includes('google')).length;

    console.log('\n🇸🇦 Saudi Validation:');
    console.log(`   Missing title: ${saNoTitle} ${saNoTitle === 0 ? '✅' : '❌'}`);
    console.log(`   Missing image: ${saNoImage} ${saNoImage === 0 ? '✅' : '❌'}`);
    console.log(`   Missing link: ${saNoLink} ${saNoLink === 0 ? '✅' : '❌'}`);
    console.log(`   Google logo img: ${saGoogleImg} ${saGoogleImg === 0 ? '✅' : '⚠️'}`);

    console.log('\n🇪🇬 Egypt Validation:');
    console.log(`   Missing title: ${egNoTitle} ${egNoTitle === 0 ? '✅' : '❌'}`);
    console.log(`   Missing image: ${egNoImage} ${egNoImage === 0 ? '✅' : '❌'}`);
    console.log(`   Missing link: ${egNoLink} ${egNoLink === 0 ? '✅' : '❌'}`);
    console.log(`   Google logo img: ${egGoogleImg} ${egGoogleImg === 0 ? '✅' : '⚠️'}`);

    // Test content extraction on sample articles
    console.log('\n' + '='.repeat(70));
    console.log('📄 CONTENT EXTRACTION TEST');
    console.log('='.repeat(70));

    const testArticles = [...sa.slice(0, 2), ...eg.slice(0, 2)];
    for (const article of testArticles) {
        console.log(`\n📰 Testing: ${article.title.substring(0, 50)}...`);
        console.log(`   Publisher: ${article.publisher}`);
        console.log(`   Link: ${article.link.substring(0, 60)}...`);
        console.log(`   Image: ${article.thumbnail ? '✅ Present' : '❌ Missing'}`);

        try {
            const content = await extractContentFromPage(article.link);
            if (content && content.length > 100) {
                console.log(`   Content: ✅ ${content.length} chars extracted`);
            } else {
                console.log(`   Content: ⚠️ Limited (${content ? content.length : 0} chars)`);
            }
        } catch (e) {
            console.log(`   Content: ❌ Error: ${e.message}`);
        }
    }

    // Final Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 FINAL SUMMARY');
    console.log('='.repeat(70));

    const totalArticles = sa.length + eg.length;
    const totalMissingImage = saNoImage + egNoImage;
    const totalMissingTitle = saNoTitle + egNoTitle;

    console.log(`   Total Articles: ${totalArticles}`);
    console.log(`   Saudi Sources: ${Object.keys(saPublishers).length}/7`);
    console.log(`   Egypt Sources: ${Object.keys(egPublishers).length}/6`);
    console.log(`   Articles with Images: ${totalArticles - totalMissingImage}/${totalArticles}`);
    console.log(`   Articles with Titles: ${totalArticles - totalMissingTitle}/${totalArticles}`);

    const passed = totalMissingImage === 0 && totalMissingTitle === 0 && sa.length >= 10 && eg.length >= 10;
    console.log(`\n   QA STATUS: ${passed ? '✅ PASSED' : '❌ NEEDS ATTENTION'}`);

    console.log('\n' + '='.repeat(70));
}

runQATest().then(() => process.exit(0)).catch(e => {
    console.error('QA Test failed:', e);
    process.exit(1);
});
