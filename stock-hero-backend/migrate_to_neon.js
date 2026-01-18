const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = 'postgresql://neondb_owner:npg_x0gTXb1yuMwU@ep-tiny-glade-ah8rueuq-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function migrate() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Connecting to Neon...');
        await client.connect();
        console.log('✅ Connected.');

        const files = [
            'schema.sql',
            'migrations/001_add_stock_details.sql',
            'migrations/002_add_cache_tables.sql'
        ];

        for (const file of files) {
            console.log(`\n📄 Applying ${file}...`);
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                let sql = fs.readFileSync(filePath, 'utf8');

                // Fix: Remove "CREATE DATABASE" and "\c" commands if executing on a single DB connection
                // Neon gives us a DB, we don't create one.
                sql = sql.replace(/CREATE DATABASE.*;/g, '')
                    .replace(/\\c.*;/g, '')
                    .replace(/CREATE DATABASE mubasher_stock_game;/g, '') // Specific check
                    .replace(/\\c mubasher_stock_game;/g, '');

                await client.query(sql);
                console.log('✅ Applied.');
            } else {
                console.warn(`⚠️ File not found: ${file}`);
            }
        }

        console.log('\n🎉 All migrations applied successfully!');

    } catch (err) {
        console.error('❌ Migration Failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
