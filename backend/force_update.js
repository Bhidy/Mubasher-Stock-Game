const { updateStockPrices } = require('./jobs/updateStockPrices');

async function run() {
    console.log("Starting forced update...");
    try {
        const results = await updateStockPrices();
        console.log(`Update complete. Got ${results.length} records.`);
        const saudi = results.find(r => r.symbol === '^TASI.SR');
        if (saudi) console.log("Found ^TASI.SR:", saudi.price);
        else console.log("Missing ^TASI.SR in results!");
    } catch (e) {
        console.error("Update failed:", e);
    }
}

run();
