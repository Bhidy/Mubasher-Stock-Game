
import handler from '../api/news.js';

const reqSA = { query: { market: 'SA' } };
const reqEG = { query: { market: 'EG' } };

const res = {
    status: (code) => ({
        json: (data) => { } // Suppress JSON output to CLI, let logs show
    }),
    setHeader: () => { }
};

async function run() {
    console.log("\n\n=== RUNNING ANALYSIS: SAUDI MARKET ===");
    try { await handler(reqSA, res); } catch (e) { console.error(e); }

    console.log("\n\n=== RUNNING ANALYSIS: EGYPT MARKET ===");
    try { await handler(reqEG, res); } catch (e) { console.error(e); }
}

run();
