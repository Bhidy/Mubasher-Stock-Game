import YahooFinance from 'yahoo-finance2';

// Version: 1.0.0 - AI Insights for Stock Analysis
// Deployed: 2025-12-08

// Initialize Yahoo Finance (v3 requirement)
const yahooFinance = new YahooFinance();

// Stock names for context
const SAUDI_STOCKS = {
    '2222': { name: 'Saudi Aramco' },
    '1120': { name: 'Al Rajhi Bank' },
    '2010': { name: 'SABIC' },
    '7010': { name: 'STC' },
    '2082': { name: 'ACWA Power' },
    '1180': { name: 'Saudi National Bank' },
    '2380': { name: 'Petrochemical' },
    '4030': { name: 'Al Babtain' },
    '2350': { name: 'Kwanif' },
    '4200': { name: 'Aldrees' },
    '1211': { name: "Ma'aden" },
    '4001': { name: 'Rawabi' },
    '2310': { name: 'SIG' },
    '4003': { name: 'Extra' },
    '2050': { name: 'Savola' },
    '1150': { name: 'Alinma' },
    '4190': { name: 'Jarir' },
    '2290': { name: 'Yanbu Cement' },
    '4002': { name: 'Mouwasat' },
    '1010': { name: 'Riyad Bank' },
    '2020': { name: 'SABIC Agri' },
    '2280': { name: 'Almarai' },
    '5110': { name: 'Saudi Elec' },
    '1140': { name: 'Albilad' },
    '1060': { name: 'SAB' },
    '7200': { name: 'Rabigh' },
    '4220': { name: 'Emaar' },
    '4090': { name: 'Tasnee' },
    '4040': { name: 'SPCC' }
};

const EGYPT_STOCKS = {
    'COMI': { name: 'CIB Bank' },
    'EAST': { name: 'Eastern Co' },
    'HRHO': { name: 'EFG Hermes' },
    'TMGH': { name: 'TMG Holding' },
    'SWDY': { name: 'Elsewedy' },
    'ETEL': { name: 'Telecom Egypt' },
    'AMOC': { name: 'AMOC' },
    'EKHO': { name: 'Egypt Kuwait' },
    'HELI': { name: 'Heliopolis' },
    'ORAS': { name: 'Orascom' },
    'ESRS': { name: 'Ezz Steel' },
    'ABUK': { name: 'Abu Qir' },
    'MFPC': { name: 'MOPCO' },
    'ISPH': { name: 'Ibnsina' },
    'PHDC': { name: 'Palm Hills' },
    'AUTO': { name: 'GB Auto' },
    'CIEB': { name: 'Crédit Agricole' },
    'FWRY': { name: 'Fawry' },
    'ADIB': { name: 'ADIB Egypt' }
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });

    try {
        // Suppress warnings
        if (typeof yahooFinance.suppressNotices === 'function') {
            yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        }

        // Determine Market & Name
        let market = 'US';
        let stockName = symbol;
        if (symbol.endsWith('.SR')) {
            market = 'SA';
            const base = symbol.replace('.SR', '');
            stockName = SAUDI_STOCKS[base]?.name || symbol;
        } else if (symbol.endsWith('.CA')) {
            market = 'EG';
            const base = symbol.replace('.CA', '');
            stockName = EGYPT_STOCKS[base]?.name || symbol;
        }

        // SMART QUERY: Use Name for SA/EG, Symbol for US
        const query = (market === 'US') ? symbol : stockName;

        // Parallel fetch: Yahoo Quote + Yahoo News (Fetch more to allow filtering)
        const [quote, searchRes] = await Promise.all([
            yahooFinance.quote(symbol),
            yahooFinance.search(query, { newsCount: 15 })
        ]);

        const change = quote?.regularMarketChangePercent || 0;

        // Gather Yahoo News
        const rawNews = (searchRes?.news || []).map(n => ({
            title: n.title,
            publisher: n.publisher,
            link: n.link,
            time: new Date(n.providerPublishTime).toISOString(),
            source: 'Yahoo'
        }));

        // STRICT FILTERING (The "Must" Requirement)
        // Ensure article actually mentions the stock
        const stopWords = ['saudi', 'bank', 'group', 'holding', 'company', 'corp', 'inc', 'ltd', 'the', 'al', 'for', 'and'];
        const nameKeywords = stockName.toLowerCase().split(' ')
            .filter(w => w.length > 2 && !stopWords.includes(w));

        // If no unique keywords (common), fall back to checking strict full name match or Symbol match
        const strictMode = nameKeywords.length > 0;

        let relevantNews = rawNews.filter(n => {
            const t = n.title.toLowerCase();
            // 1. Check if Symbol appears (e.g. "AAPL")
            if (t.includes(symbol.toLowerCase().split('.')[0])) return true;

            // 2. Check Name Keywords
            if (strictMode) {
                // At least one unique keyword must be present
                return nameKeywords.some(k => t.includes(k));
            }

            return true; // Fallback if name is generic (rare)
        });

        // Combine & Sort
        let allNews = [...relevantNews];
        allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Use strict 7-day filter ONLY for US market
        let validNews = allNews;
        if (market === 'US') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            validNews = allNews.filter(n => new Date(n.time) > sevenDaysAgo);
        }

        // GENERATE "AI" RESPONSE
        let answer = "";

        if (validNews.length === 0) {
            // No-News Rule
            const options = [
                `No fresh news found for ${stockName} today.`,
                "Market sentiment seems neutral with no specific catalyst detected.",
                "Trading appears technically driven as no major headlines were found."
            ];
            answer = options[Math.floor(Math.random() * options.length)];
        } else {
            // Smart Template Generation
            const topNews = validNews[0];
            const direction = change > 0.5 ? "advancing" : change < -0.5 ? "declining" : "steady";
            const changeText = Math.abs(change).toFixed(2) + "%";

            // Clean title
            let cleanTitle = topNews.title.split(' - ')[0];

            answer = `${stockName} is ${direction} (${changeText}) today. Investors are reacting to reports that "${cleanTitle}" as highlighted by ${topNews.publisher}.`;

            // Strict word limit
            const words = answer.split(' ');
            if (words.length > 45) {
                answer = words.slice(0, 45).join(' ') + "...";
            }
        }

        const response = {
            symbol,
            answer,
            sources: validNews.slice(0, 5), // Return top 5 sources
            timestamp: new Date().toISOString()
        };

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
        res.status(200).json(response);

    } catch (error) {
        console.error('AI Insight error:', error);
        res.status(500).json({
            error: 'Failed to generate insight',
            symbol,
            answer: "Unable to fetch insights at this time. Please try again later.",
            sources: [],
            timestamp: new Date().toISOString()
        });
    }
}
