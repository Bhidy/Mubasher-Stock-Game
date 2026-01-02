const db = require('./db');

async function check() {
    try {
        const res = await db.query("SELECT to_regclass('public.news') as exists");
        console.log("News table exists:", res.rows[0].exists);
        if (res.rows[0].exists) {
            const cols = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'news'");
            console.log("Columns:", cols.rows.map(r => r.column_name));
        } else {
            console.log("Creating news table...");
            await db.query(`
                CREATE TABLE news (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    summary TEXT,
                    content TEXT,
                    source TEXT,
                    category TEXT,
                    market TEXT,
                    image_url TEXT,
                    is_published BOOLEAN DEFAULT FALSE,
                    is_featured BOOLEAN DEFAULT FALSE,
                    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    author TEXT
                )
            `);
            console.log("News table created.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit();
}
check();
