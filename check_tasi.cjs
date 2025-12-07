const yahooFinance = require('yahoo-finance2').default;

async function checkTasi() {
    try {
        const result = await yahooFinance.quote('^TASI.SR');
        console.log('TASI Data:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

checkTasi();
