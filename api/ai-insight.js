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

        // Simplify name for searching (e.g. "Saudi Aramco" -> "Aramco")
        const searchName = stockName.split(' ')[0].length > 3 ? stockName.split(' ')[0] : stockName;

        // Parallel fetch: Yahoo Quote + Yahoo News
        const [quote, searchRes] = await Promise.all([
            yahooFinance.quote(symbol),
            yahooFinance.search(symbol, { newsCount: 5 })
        ]);

        const change = quote?.regularMarketChangePercent || 0;

        // Gather Yahoo News
        const yahooNews = (searchRes?.news || []).map(n => ({
            title: n.title,
            publisher: n.publisher,
            link: n.link,
            time: new Date(n.providerPublishTime).toISOString(),
            source: 'Yahoo'
        }));

        // Combine & Sort
        let allNews = [...yahooNews];
        allNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Use strict 7-day filter ONLY for US market. For Emerging (SA/EG), use all available.
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
                "No recent news found. Today's move may reflect normal market activity.",
                "Market sentiment seems neutral with no specific catalyst detected.",
                "No clear news driver found. Check technical indicators."
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
