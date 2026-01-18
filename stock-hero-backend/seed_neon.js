const { Client } = require('pg');
const YahooFinancePkg = require('yahoo-finance2').default;
const yahooFinance = new YahooFinancePkg({ suppressNotices: ['yahooSurvey'] });

const DATABASE_URL = 'postgresql://neondb_owner:npg_x0gTXb1yuMwU@ep-tiny-glade-ah8rueuq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function seed() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Connecting to Neon...');
        await client.connect();

        // 1. Check if stocks exist
        const res = await client.query('SELECT ticker FROM stocks');
        console.log(`📊 Found ${res.rowCount} stocks in DB.`);

        if (res.rowCount === 0) {
            console.log('⚠️ No stocks found! Inserting defaults...');
            // Fallback insert if schema.sql didn't run correctly
            await client.query(`
                INSERT INTO stocks (ticker, name, sector, category) VALUES
                ('AAPL', 'Apple Inc.', 'Technology', 'US'),
                ('NVDA', 'NVIDIA Corp.', 'Technology', 'US'),
                ('TSLA', 'Tesla Inc.', 'Automotive', 'US'),
                ('MSFT', 'Microsoft Corp.', 'Technology', 'US'),
                ('GOOGL', 'Alphabet Inc.', 'Technology', 'US'),
                ('AMZN', 'Amazon.com Inc.', 'E-commerce', 'US'),
                ('META', 'Meta Platforms', 'Technology', 'US'),
                ('AMD', 'Advanced Micro Devices', 'Technology', 'US'),
                ('NFLX', 'Netflix Inc.', 'Entertainment', 'US'),
                ('DIS', 'Walt Disney Co.', 'Entertainment', 'US'),
                ('2222.SR', 'Saudi Aramco', 'Energy', 'SA'),
                ('1120.SR', 'Al Rajhi Bank', 'Financials', 'SA'),
                ('COMI.CA', 'CIB Egypt', 'Financials', 'EG')
            ON CONFLICT (ticker) DO NOTHING;
            `);
        }

        // 2. Update with Live Data
        console.log('🌍 Fetching Live Data from Yahoo...');
        const stocks = (await client.query('SELECT ticker FROM stocks')).rows;

        for (const s of stocks) {
            try {
                const quote = await yahooFinance.quote(s.ticker);
                if (quote) {
                    await client.query(`
                        UPDATE stocks SET
                            current_price = $1,
                            change_percent = $2,
                            volume = $3,
                            market_cap = $4,
                            pe_ratio = $5,
                            dividend_yield = $6,
                            fifty_two_week_high = $7,
                            fifty_two_week_low = $8,
                            previous_close = $9,
                            currency = $10,
                            last_updated_ts = NOW()
                        WHERE ticker = $11
                    `, [
                        quote.regularMarketPrice,
                        quote.regularMarketChangePercent,
                        quote.regularMarketVolume,
                        quote.marketCap,
                        quote.trailingPE,
                        quote.dividendYield,
                        quote.fiftyTwoWeekHigh,
                        quote.fiftyTwoWeekLow,
                        quote.regularMarketPreviousClose,
                        quote.currency,
                        s.ticker
                    ]);
                    console.log(`✅ Updated ${s.ticker}: $${quote.regularMarketPrice}`);
                }
            } catch (err) {
                console.error(`❌ Failed ${s.ticker}:`, err.message);
            }
            await new Promise(r => setTimeout(r, 500)); // Rate limit niceness
        }

        console.log('🎉 Database Seeded & Ready!');

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

seed();
