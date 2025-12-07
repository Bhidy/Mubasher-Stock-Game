const { updateStockPrices } = require('./jobs/updateStockPrices');

(async () => {
    try {
        await updateStockPrices();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
