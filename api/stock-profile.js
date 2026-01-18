// Cloudflare/Vercel Proxy for Stock Profiles
// Version: GITHUB-PROFILE-LAKE-V1

const PROFILE_BASE_URL = 'https://raw.githubusercontent.com/Bhidy/Mubasher-Stock-Game/main/public/data/profiles';

// Helper: Normalize Symbol (Must match ingest_master.py logic)
const normalizeSymbol = (sym) => {
    let s = sym.toUpperCase();
    if (s === 'CASE30.CA') return '^CASE30';
    if (s === '^CASE30.CA') return '^CASE30';
    return s.replace('^', '');
};

export default async function handler(req, res) {
    const { symbol } = req.query;

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    try {
        const safeSymbol = normalizeSymbol(symbol);
        console.log(`👤 Fetching profile for ${symbol} (${safeSymbol}) from Data Lake...`);

        const response = await fetch(`${PROFILE_BASE_URL}/${safeSymbol}.json`, {
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            throw new Error(`Profile not found in Lake (Status ${response.status})`);
        }

        const profileData = await response.json();

        // Cache control
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // Cache for 5 min

        res.status(200).json(profileData);

    } catch (error) {
        console.error(`❌ Profile Error for ${symbol}:`, error.message);

        // Return valid but empty structure to prevent frontend crash
        res.status(200).json({
            symbol: symbol,
            name: symbol,
            description: "Profile data currently updating. Please try again shortly.",
            sector: "N/A",
            price: 0,
            error: "Data Lake miss"
        });
    }
}
