const { Pool } = require('pg');
require('dotenv').config({ path: 'stock-hero-backend/.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'home',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mubasher_stock_game',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
});

async function seedCache() {
    try {
        console.log('Inserting into chart_cache...');
        const dummyChart = { quotes: [{ price: 420.69, date: new Date().toISOString() }] };

        await pool.query(
            `INSERT INTO chart_cache (symbol, range, interval, data, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (symbol, range, interval) 
             DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
            ['AAPL', '1d', '2m', dummyChart]
        );

        console.log('Inserting into profile_cache...');
        const dummyProfile = {
            symbol: 'AAPL',
            description: 'HARDENED: This profile came from the DB Cache!',
            currentPrice: 999.99
        };

        await pool.query(
            `INSERT INTO profile_cache (symbol, data, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (symbol) 
             DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
            ['AAPL', dummyProfile]
        );

        console.log('✅ Cache Seeded Successfully.');
    } catch (err) {
        console.error('❌ Cache Seed Failed:', err);
    } finally {
        await pool.end();
    }
}

seedCache();
