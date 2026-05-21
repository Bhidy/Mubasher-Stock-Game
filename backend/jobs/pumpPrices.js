/**
 * pumpPrices.js — Global Price Pump v1
 *
 * Fetches live quotes for ALL markets via yahoo-finance2 and writes
 * public/data/stocks.json in the keyed-by-market format the Cloudflare
 * proxy (functions/api/stocks.js) expects.
 *
 * Rate-limiting: batches of 5 tickers, 600 ms between batches.
 * Total run time for ~240 tickers: ~3 minutes.
 * GitHub Actions schedule: every 30 minutes.
 *
 * NOTE: No `logo` field is emitted. The frontend's StockLogo component
 * (src/components/StockCard.jsx) has a per-symbol static mapping with
 * real logos (local PNGs for Saudi, Wikimedia SVGs for US, etc.) plus a
 * multi-step fallback chain. Omitting `logo` here lets that mapping take
 * priority correctly.
 */

// yahoo-finance2: support both v2 (backend/node_modules) and v3 (root node_modules)
// v2 exports an object instance; v3 exports a class (function) that must be instantiated.
const _yf2 = require('yahoo-finance2').default;
const yahooFinance = (typeof _yf2 === 'function') ? new _yf2({ suppressNotices: ['yahooSurvey'] }) : _yf2;

const fs   = require('fs');
const path = require('path');

const OUTPUT_FILE  = path.join(__dirname, '../../public/data/stocks.json');
const BATCH_SIZE   = 5;
const BATCH_DELAY  = 1200; // ms between batches — conservative to avoid Yahoo rate limits

// ─── Market Catalogs ──────────────────────────────────────────────────────────
// Keep in sync with ingest_master.py so the same tickers are covered.

const MARKETS = {
    SA: [
        '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
        '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
        '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
        '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
        '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR',
    ],
    EG: [
        'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
        'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
        'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
        'ADIB.CA', '^CASE30',
    ],
    US: [
        '^GSPC', '^DJI', '^IXIC',
        'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
        'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE', 'BRK-B', 'LLY',
    ],
    IN: ['^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'LICI.NS'],
    UK: ['^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'DGE.L', 'RIO.L', 'GSK.L', 'GLEN.L'],
    DE: ['^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE', 'VOW3.DE', 'BAS.DE', 'ADS.DE'],
    FR: ['^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA', 'SU.PA', 'EL.PA', 'KER.PA'],
    JP: ['^N225', '7203.T', '6758.T', '9984.T', '6861.T', '8306.T', '9432.T', '7974.T', '6098.T', '4063.T'],
    CA: ['^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO', 'BMO.TO', 'BNS.TO', 'TRP.TO'],
    AU: ['^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'FMG.AX', 'WDS.AX', 'TLS.AX'],
    HK: ['^HSI', '0700.HK', '9988.HK', '0939.HK', '1299.HK', '0941.HK', '3690.HK', '0005.HK', '0388.HK'],
    CH: ['^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW', 'CFR.SW', 'ZURN.SW', 'LONN.SW'],
    NL: ['^AEX', 'ASML.AS', 'UNA.AS', 'SHELL.AS', 'HEIA.AS', 'INGA.AS', 'PHIA.AS', 'ADYEN.AS', 'DSFIR.AS'],
    ES: ['^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC', 'REP.MC', 'CLNX.MC'],
    IT: ['FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'ENI.MI', 'UCG.MI', 'RACE.MI', 'G.MI', 'MB.MI'],
    BR: ['^BVSP', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA', 'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA'],
    MX: ['^MXX', 'WALMEX.MX', 'AMX.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'BIMBOA.MX', 'CEMEXCPO.MX', 'TLEVISACPO.MX'],
    KR: ['^KS11', '005930.KS', '000660.KS', '005380.KS', '207940.KS', '051910.KS', '005490.KS'],
    TW: ['^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2881.TW'],
    SG: ['^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C52.SI'],
    AE: ['EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AE', 'DIB.AE', 'EMIRATESNBD.AE', 'TAQA.AD'],
    ZA: ['JSE.JO', 'NPN.JO', 'FSR.JO', 'SBK.JO', 'ABG.JO', 'SOL.JO', 'MTN.JO'],
    QA: ['QNBK.QA', 'IQCD.QA', 'QIBK.QA', 'CBQK.QA', 'MARK.QA'],
};

const FLAGS = {
    SA: '🇸🇦', EG: '🇪🇬', US: '🇺🇸', IN: '🇮🇳', UK: '🇬🇧',
    DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', CA: '🇨🇦', AU: '🇦🇺',
    HK: '🇭🇰', CH: '🇨🇭', NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹',
    BR: '🇧🇷', MX: '🇲🇽', KR: '🇰🇷', TW: '🇹🇼', SG: '🇸🇬',
    AE: '🇦🇪', ZA: '🇿🇦', QA: '🇶🇦',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/**
 * Fetch a batch of tickers in parallel (all at once) then apply delay.
 * Returns array of {symbol, quote|null} pairs.
 */
async function fetchBatch(symbols) {
    const results = await Promise.allSettled(
        symbols.map(sym =>
            yahooFinance.quote(sym).catch(e => {
                if (e.message && e.message.includes('Too Many Requests')) {
                    process.stderr.write(`  ⚠ Rate limited on ${sym}\n`);
                }
                return null;
            })
        )
    );
    return symbols.map((sym, i) => ({
        symbol: sym,
        quote: results[i].status === 'fulfilled' ? results[i].value : null,
    }));
}

/**
 * Build a normalized stock object from a Yahoo Finance quote response.
 * @param {string} symbol  - original ticker
 * @param {object} quote   - yahoo-finance2 quote result
 * @param {string} market  - market code (SA, EG, US, …)
 */
function buildStockEntry(symbol, quote, market) {
    if (!quote) return null;

    const price      = quote.regularMarketPrice || quote.regularMarketPreviousClose || 0;
    const prevClose  = quote.regularMarketPreviousClose || price;
    let   change     = quote.regularMarketChange ?? (price - prevClose);
    let   changePct  = quote.regularMarketChangePercent ?? (prevClose > 0 ? (change / prevClose) * 100 : 0);

    // Normalise tiny float drift
    if (!change)     change    = 0;
    if (!changePct)  changePct = 0;

    return {
        symbol:         symbol,
        name:           quote.shortName || quote.longName || symbol,
        category:       market,
        country:        FLAGS[market] || '🌍',
        sector:         quote.sector || null,
        // logo intentionally omitted → StockLogo component uses its built-in
        // static mapping (local SA PNGs, Wikimedia SVGs for US, etc.)
        price:          price,
        change:         change,
        changePercent:  changePct,
        prevClose:      prevClose,
        open:           quote.regularMarketOpen  || price,
        high:           quote.regularMarketDayHigh || price,
        low:            quote.regularMarketDayLow  || price,
        volume:         quote.regularMarketVolume  || quote.averageDailyVolume3Month || 0,
        marketCap:      quote.marketCap      || null,
        peRatio:        quote.trailingPE     || null,
        dividendYield:  quote.trailingAnnualDividendYield || null,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || null,
        fiftyTwoWeekLow:  quote.fiftyTwoWeekLow  || null,
        lastUpdated:    new Date().toISOString(),
    };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('📈 Price Pump v1 — All Markets\n');

    // Collect ALL unique tickers across every market so we don't double-fetch
    const allTickers = [...new Set(Object.values(MARKETS).flat())];
    console.log(`📊 ${allTickers.length} unique tickers across ${Object.keys(MARKETS).length} markets\n`);

    // Fetch in batches
    const quoteMap = {}; // symbol → quote
    let done = 0;
    for (let i = 0; i < allTickers.length; i += BATCH_SIZE) {
        const batch   = allTickers.slice(i, i + BATCH_SIZE);
        const results = await fetchBatch(batch);
        results.forEach(({ symbol, quote }) => { quoteMap[symbol] = quote; });
        done += batch.length;
        process.stdout.write(`  Fetched ${done}/${allTickers.length}...\r`);
        if (i + BATCH_SIZE < allTickers.length) await sleep(BATCH_DELAY);
    }
    console.log(`\n✅ Quotes received (${Object.values(quoteMap).filter(Boolean).length}/${allTickers.length} succeeded)\n`);

    // Build market-keyed output
    const output = {};
    for (const [market, tickers] of Object.entries(MARKETS)) {
        const entries = [];
        for (const sym of tickers) {
            const entry = buildStockEntry(sym, quoteMap[sym], market);
            if (entry) entries.push(entry);
        }
        output[market] = entries;
        console.log(`  ${FLAGS[market] || ''} ${market}: ${entries.length}/${tickers.length} stocks`);
    }

    // Global = same as US (mirrors ingest_master.py behaviour)
    output['Global'] = output['US'] || [];
    console.log(`  🌍 Global: aliased to US (${output['Global'].length} stocks)`);

    // Write
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output));

    const totalStocks = Object.values(output).reduce((s, arr) => s + arr.length, 0);
    console.log(`\n✅ Done — ${totalStocks} entries written to ${OUTPUT_FILE}`);
    console.log(`   Latest SA price: ${output.SA?.[0]?.price ?? 'n/a'} (${output.SA?.[0]?.symbol ?? 'n/a'})`);
    console.log(`   Latest US price: ${output.US?.[0]?.price ?? 'n/a'} (${output.US?.[0]?.symbol ?? 'n/a'})`);
}

main().catch(err => {
    console.error('❌ FATAL:', err.message);
    process.exit(1);
});
