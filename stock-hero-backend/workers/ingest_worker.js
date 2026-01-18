require('dotenv').config();
const { Pool } = require('pg');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// DB Connection
const pool = new Pool({
    user: process.env.DB_USER || 'home',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mubasher_stock_game',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
});

// Reuse the market definitions from the original file to ensure consistency
// Ideally this should be a shared config, but for now we duplicate to ensure standalone reliable execution
// Full Global Market Configuration (23 Markets)
const MARKETS = {
    // === MENA ===
    'SA': [ // Saudi Arabia
        '^TASI.SR', '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
        '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR', '2310.SR',
        '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR', '4002.SR', '1010.SR'
    ],
    'EG': [ // Egypt
        '^CASE30', 'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
        'AMOC.CA', 'HELI.CA', 'ORWE.CA', 'ESRS.CA', 'JUFO.CA', 'EKHO.CA', 'MFPC.CA'
    ],
    'AE': [ // UAE
        'EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AD', 'DIB.AE', 'ADCB.AD',
        'DEWA.AE', 'ADNOCGAS.AD', 'REL.AD', 'DIC.AE'
    ],
    'QA': [ // Qatar
        'QNBK.QA', 'QIBK.QA', 'IQCD.QA', 'MARK.QA', 'ODHN.QA', 'QGTS.QA',
        'CBQK.QA', 'QFLS.QA', 'QIIK.QA', 'QOIS.QA'
    ],

    // === AMERICAS ===
    'US': [ // United States
        '^GSPC', '^DJI', '^IXIC', 'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META',
        'NFLX', 'BRK-B', 'LLY', 'V', 'JPM', 'WMT', 'MA', 'XOM', 'UNH', 'AVGO'
    ],
    'CA': [ // Canada
        '^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO',
        'BMO.TO', 'BNS.TO', 'TRI.TO', 'ATD.TO', 'CSU.TO', 'NTR.TO'
    ],
    'BR': [ // Brazil
        '^BVSP', 'VALE3.SA', 'PETR4.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA',
        'BBAS3.SA', 'WEGE3.SA', 'ABEV3.SA', 'BPAC11.SA', 'ELET3.SA'
    ],
    'MX': [ // Mexico
        '^MXX', 'AMXL.MX', 'FEMSAUBD.MX', 'GFNORTEO.MX', 'GMEXICOB.MX',
        'WALMEX.MX', 'CEMEXCPO.MX', 'BIMBOA.MX', 'AC.MX', 'GRUMAB.MX'
    ],

    // === EUROPE ===
    'UK': [ // United Kingdom
        '^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'RIO.L',
        'DGE.L', 'GSK.L', 'LSEG.L', 'BATS.L', 'REL.L', 'GLEN.L'
    ],
    'DE': [ // Germany
        '^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE',
        'DHL.DE', 'MBG.DE', 'BAS.DE', 'IFX.DE', 'MUV2.DE', 'VOW3.DE'
    ],
    'FR': [ // France
        '^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA',
        'SU.PA', 'AI.PA', 'BNP.PA', 'EL.PA', 'KER.PA', 'SGO.PA'
    ],
    'CH': [ // Switzerland
        '^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW',
        'CFR.SW', 'ZURN.SW', 'HOLN.SW', 'SIKA.SW', 'LONN.SW', 'GIVN.SW'
    ],
    'NL': [ // Netherlands
        '^AEX', 'ASML.AS', 'UNA.AS', 'INGA.AS', 'PRX.AS', 'AD.AS', 'HEIA.AS',
        'DSFIR.AS', 'ASM.AS', 'WKL.AS', 'PHIA.AS', 'AKZA.AS'
    ],
    'ES': [ // Spain
        '^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC',
        'CABK.MC', 'AENA.MC', 'NTGY.MC', 'REP.MC', 'FER.MC'
    ],
    'IT': [ // Italy
        'FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'UCG.MI', 'ENI.MI',
        'RACE.MI', 'G.MI', 'STM.MI', 'TRN.MI', 'MONC.MI', 'PRY.MI'
    ],

    // === ASIA / PACIFIC ===
    'JP': [ // Japan
        '^N225', '7203.T', '6758.T', '6861.T', '9983.T', '8306.T', '8035.T',
        '6501.T', '9432.T', '4063.T', '6098.T', '4502.T', '7974.T'
    ],
    'CN': [ // China (Added for catch-all, though not explicit on frontend)
        '000001.SS', '600519.SS', '601398.SS', '601288.SS', '601857.SS'
    ],
    'HK': [ // Hong Kong
        '^HSI', '0700.HK', '9988.HK', '0939.HK', '1299.HK', '0941.HK',
        '3690.HK', '1398.HK', '0388.HK', '0005.HK', '2318.HK', '0883.HK'
    ],
    'IN': [ // India
        '^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'ICICIBANK.NS',
        'INFY.NS', 'BHARTIARTL.NS', 'ITC.NS', 'SBIN.NS', 'LICI.NS', 'HINDUNILVR.NS'
    ],
    'KR': [ // South Korea
        '^KS11', '005930.KS', '000660.KS', '373220.KS', '207940.KS',
        '005380.KS', '000270.KS', '005490.KS', '035420.KS', '051910.KS'
    ],
    'TW': [ // Taiwan
        '^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2303.TW',
        '2881.TW', '2882.TW', '2412.TW', '1303.TW', '2002.TW'
    ],
    'SG': [ // Singapore
        '^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C38U.SI',
        'C09.SI', 'A17U.SI', 'Y92.SI', 'S68.SI'
    ],
    'AU': [ // Australia
        '^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX',
        'ANZ.AX', 'FMG.AX', 'WES.AX', 'MQG.AX', 'TLS.AX', 'WOW.AX'
    ],
    'ZA': [ // South Africa
        'JSE.JO', 'NPN.JO', 'FSR.JO', 'SBK.JO', 'AGL.JO', 'SOL.JO',
        'MTN.JO', 'VOD.JO', 'CPI.JO', 'ABG.JO', 'DSY.JO'
    ]
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAndUpsert(marketCode, tickers) {
    console.log(`\nProcessing ${marketCode} (${tickers.length} tickers)...`);

    // Process in chunks to avoid massive batch failures
    const CHUNK_SIZE = 10;

    for (let i = 0; i < tickers.length; i += CHUNK_SIZE) {
        const chunk = tickers.slice(i, i + CHUNK_SIZE);
        console.log(`  Fetching chunk ${i / CHUNK_SIZE + 1}...`);

        try {
            const results = await yahooFinance.quote(chunk);
            const quotes = Array.isArray(results) ? results : [results];

            for (const q of quotes) {
                if (!q || !q.symbol) continue;

                const price = q.regularMarketPrice || q.regularMarketPreviousClose || 0;
                const change = q.regularMarketChange || 0;
                const changePercent = q.regularMarketChangePercent || 0;
                const name = q.shortName || q.longName || q.symbol;

                // Upsert Query
                const query = `
                    INSERT INTO stocks (
                        ticker, name, current_price, change_percent, 
                        volume, market_cap, pe_ratio, dividend_yield,
                        fifty_two_week_high, fifty_two_week_low, previous_close,
                        category, currency, last_updated_ts, updated_at
                    ) VALUES (
                        $1, $2, $3, $4, 
                        $5, $6, $7, $8, 
                        $9, $10, $11, 
                        $12, $13, NOW(), NOW()
                    )
                    ON CONFLICT (ticker) 
                    DO UPDATE SET 
                        current_price = EXCLUDED.current_price,
                        change_percent = EXCLUDED.change_percent,
                        volume = EXCLUDED.volume,
                        market_cap = EXCLUDED.market_cap,
                        last_updated_ts = NOW(),
                        updated_at = NOW();
                `;

                const values = [
                    q.symbol,
                    name,
                    price,
                    changePercent,
                    q.regularMarketVolume || 0,
                    q.marketCap || 0,
                    q.trailingPE || 0,
                    q.dividendYield || 0,
                    q.fiftyTwoWeekHigh || 0,
                    q.fiftyTwoWeekLow || 0,
                    q.regularMarketPreviousClose || 0,
                    marketCode,
                    q.currency || 'USD'
                ];

                await pool.query(query, values);
            }
            console.log(`  ✅ Chunk saved.`);

        } catch (err) {
            console.error(`  ❌ Chunk failed: ${err.message}`);
        }

        // Polite delay
        await sleep(2000);
    }
}

async function run() {
    try {
        console.log('🚀 Starting Stock Ingestion Job...');

        // Config: Yahoo Finance (Skipping Global Config due to type error in worker)
        // yahooFinance.setGlobalConfig({...}); 


        // Run for all defined markets dynamically
        for (const [marketCode, tickers] of Object.entries(MARKETS)) {
            await fetchAndUpsert(marketCode, tickers);
        }

        console.log('\n✅ Global Ingestion Complete.');
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
}

run();
