const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_x0gTXb1yuMwU@ep-tiny-glade-ah8rueuq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function verify() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Check AAPL as a representative sample
        const res = await client.query("SELECT * FROM stocks WHERE ticker = 'AAPL'");
        const stock = res.rows[0];

        console.log('\n📊 VERIFICATION REPORT: AAPL');
        console.log('--------------------------------');
        console.log(`Price:      $${stock.current_price}`);
        console.log(`Change:     ${stock.change_percent}%`);
        console.log(`PE Ratio:   ${stock.pe_ratio}`);
        console.log(`Dividend:   ${stock.dividend_yield * 100}%`);
        console.log(`52W High:   $${stock.fifty_two_week_high}`);
        console.log(`52W Low:    $${stock.fifty_two_week_low}`);
        console.log(`Market Cap: $${(parseInt(stock.market_cap) / 1e9).toFixed(2)}B`);
        console.log(`Country:    ${stock.country}`);
        console.log(`Updated:    ${stock.last_updated_ts}`);
        console.log('--------------------------------');

        if (stock.pe_ratio && stock.country) {
            console.log('✅ SUCCESS: Deep data fields are populated.');
        } else {
            console.error('❌ FAILURE: Critical deep data logic missing.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

verify();
