// AI Insight API - Cloudflare Pages Function
// Provides smart stock movement analysis using Yahoo Finance data

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

const US_STOCKS = {
    'AAPL': { name: 'Apple' },
    'MSFT': { name: 'Microsoft' },
    'GOOGL': { name: 'Alphabet' },
    'AMZN': { name: 'Amazon' },
    'NVDA': { name: 'NVIDIA' },
    'TSLA': { name: 'Tesla' },
    'META': { name: 'Meta' },
};

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    const symbol = url.searchParams.get('symbol');
    if (!symbol) {
        return new Response(JSON.stringify({ error: 'Symbol required' }), { status: 400, headers });
    }

    try {
        // Determine Market & Name
        let market = 'US';
        let stockName = symbol;
        const baseSymbol = symbol.split('.')[0];

        if (symbol.endsWith('.SR')) {
            market = 'SA';
            stockName = SAUDI_STOCKS[baseSymbol]?.name || symbol;
        } else if (symbol.endsWith('.CA')) {
            market = 'EG';
            stockName = EGYPT_STOCKS[baseSymbol]?.name || symbol;
        } else {
            stockName = US_STOCKS[baseSymbol]?.name || symbol;
        }

        // Fetch quote data from Yahoo Finance (via query1.finance.yahoo.com)
        const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;

        let change = 0;
        let price = 0;

        try {
            const quoteRes = await fetch(quoteUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const quoteData = await quoteRes.json();

            if (quoteData?.chart?.result?.[0]?.meta) {
                const meta = quoteData.chart.result[0].meta;
                price = meta.regularMarketPrice || 0;
                const prevClose = meta.chartPreviousClose || meta.previousClose || price;
                if (prevClose > 0 && price > 0) {
                    change = ((price - prevClose) / prevClose) * 100;
                }
            }
        } catch (e) {
            console.error('Quote fetch error:', e);
        }

        // Fetch news from Yahoo Search API
        const searchQuery = market === 'US' ? symbol : stockName;
        const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(searchQuery)}&newsCount=10`;

        let rawNews = [];
        try {
            const searchRes = await fetch(searchUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const searchData = await searchRes.json();

            if (searchData?.news) {
                rawNews = searchData.news.map(n => ({
                    title: n.title,
                    publisher: n.publisher,
                    link: n.link,
                    time: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toISOString() : new Date().toISOString(),
                    source: 'Yahoo'
                }));
            }
        } catch (e) {
            console.error('News fetch error:', e);
        }

        // Filter relevant news
        const stopWords = ['saudi', 'bank', 'group', 'holding', 'company', 'corp', 'inc', 'ltd', 'the', 'al', 'for', 'and'];
        const nameKeywords = stockName.toLowerCase().split(' ')
            .filter(w => w.length > 2 && !stopWords.includes(w));

        let relevantNews = rawNews.filter(n => {
            const t = n.title.toLowerCase();
            if (t.includes(baseSymbol.toLowerCase())) return true;
            if (nameKeywords.length > 0) {
                return nameKeywords.some(k => t.includes(k));
            }
            return true;
        });

        // Sort by time
        relevantNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Apply 7-day filter for US market
        let validNews = relevantNews;
        if (market === 'US') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            validNews = relevantNews.filter(n => new Date(n.time) > sevenDaysAgo);
        }

        // Generate AI-style answer
        let answer = "";

        if (validNews.length === 0) {
            const options = [
                `No fresh news found for ${stockName} today.`,
                "Market sentiment seems neutral with no specific catalyst detected.",
                "Trading appears technically driven as no major headlines were found."
            ];
            answer = options[Math.floor(Math.random() * options.length)];
        } else {
            const topNews = validNews[0];
            const direction = change > 0.5 ? "advancing" : change < -0.5 ? "declining" : "steady";
            const changeText = Math.abs(change).toFixed(2) + "%";
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
            sources: validNews.slice(0, 5),
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(response), { headers });

    } catch (error) {
        console.error('AI Insight error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate insight',
            symbol,
            answer: "Unable to fetch insights at this time. Please try again later.",
            sources: [],
            timestamp: new Date().toISOString()
        }), { status: 500, headers });
    }
}
