import axios from 'axios';

async function testParams(symbol, range) {
    const url = `http://localhost:5001/api/chart?symbol=${encodeURIComponent(symbol)}&range=${range}`;
    console.log(`Fetching: ${url}`);
    try {
        const res = await axios.get(url);
        const quotes = res.data.quotes || [];
        console.log(`✅ Success ${symbol} ${range}: ${quotes.length} quotes`);
        if (quotes.length > 0) {
            console.log('Sample:', quotes[0]);
        }
    } catch (e) {
        console.error(`❌ Failed ${symbol} ${range}: ${e.message}`);
        if (e.response) {
            console.error('Data:', JSON.stringify(e.response.data));
        }
    }
}

async function run() {
    await testParams('^TASI.SR', '1D');
    await testParams('^TASI.SR', '1M');
    await testParams('^CASE30', '1D');
    await testParams('^DJI', '1D');
}
run();
