const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = {
    '2222': 'https://s3-symbol-logo.tradingview.com/saudi-arabian-oil--600.png',
    '1120': 'https://s3-symbol-logo.tradingview.com/al-rajhi-bank--600.png',
    '2010': 'https://s3-symbol-logo.tradingview.com/sabic--600.png',
    '7010': 'https://s3-symbol-logo.tradingview.com/saudi-telecom--600.png',
    '2082': 'https://s3-symbol-logo.tradingview.com/acwa-power--600.png',
    '1180': 'https://s3-symbol-logo.tradingview.com/saudi-national-bank--600.png',
    '2380': 'https://s3-symbol-logo.tradingview.com/rabigh-refining-and-petrochemical--600.png',
    '4200': 'https://s3-symbol-logo.tradingview.com/aldrees-petroleum-and-transport-services--600.png',
    '1211': 'https://s3-symbol-logo.tradingview.com/alinma-bank--600.png',
    '4001': 'https://s3-symbol-logo.tradingview.com/abdullah-al-othaim-markets--600.png',
    '2310': 'https://s3-symbol-logo.tradingview.com/sahara-international-petrochemical--600.png',
    '4003': 'https://s3-symbol-logo.tradingview.com/united-electronics--600.png',
    '2050': 'https://s3-symbol-logo.tradingview.com/savola-group--600.png',
    '1150': 'https://s3-symbol-logo.tradingview.com/amlak-international-for-real-estate-finance--600.png',
    '4190': 'https://s3-symbol-logo.tradingview.com/jarir-marketing--600.png',
    '2290': 'https://s3-symbol-logo.tradingview.com/yanbu-cement--600.png',
    '4002': 'https://s3-symbol-logo.tradingview.com/mouwasat-medical-services--600.png',
    '1010': 'https://s3-symbol-logo.tradingview.com/riyad-bank--600.png',
    // Fallbacks for those without direct TradingView URLs in previous list
    '4030': 'https://s3-symbol-logo.tradingview.com/al-babtain-power-and-telecommunication--600.png',
    '2350': 'https://s3-symbol-logo.tradingview.com/saudi-industrial-development--600.png'
};

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

async function downloadAll() {
    console.log('Starting logo downloads...');
    for (const [ticker, url] of Object.entries(logos)) {
        try {
            const filepath = path.join(__dirname, 'public/assets/logos', `${ticker}.png`);
            await downloadImage(url, filepath);
            console.log(`✅ Downloaded ${ticker}`);
        } catch (error) {
            console.error(`❌ Failed ${ticker}: ${error.message}`);
        }
    }
    console.log('Done!');
}

downloadAll();
