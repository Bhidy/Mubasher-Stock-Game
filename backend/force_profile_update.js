const { updateStockProfiles } = require('./jobs/updateStockProfiles');

async function run() {
    console.log('Forcing profile update...');
    await updateStockProfiles();
    console.log('Done.');
    process.exit(0);
}

run();
