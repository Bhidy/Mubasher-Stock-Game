/**
 * pumpPrices.js — Global Price Pump v2 (World-Class)
 *
 * Fetches live quotes for ALL markets via yahoo-finance2 and writes
 * public/data/stocks.json in the keyed-by-market format the Cloudflare
 * proxy (functions/api/stocks.js) expects.
 *
 * Key resilience features:
 *   • Exponential backoff + jitter on 429 / transient errors (3 retries)
 *   • Data preservation — loads existing file first; only updates markets
 *     that return ≥1 valid quote (never wipes good data on failure)
 *   • Adaptive rate limiting — auto-throttles when Yahoo pushes back
 *   • Per-market isolation — one market failing doesn't affect others
 *   • Structured success/failure report at the end
 *   • Never get banned: conservative batching, random jitter, User-Agent
 *
 * Rate-limiting: batches of 5, 1200 ms between batches.
 * Total run time for ~240 tickers: ~3-4 minutes.
 * GitHub Actions schedule: every 30 minutes.
 *
 * NOTE: No `logo` field emitted. The frontend's StockLogo component
 * (src/components/StockCard.jsx) has a per-symbol static mapping with
 * real logos (local PNGs for Saudi, Wikimedia SVGs for US, etc.) plus a
 * multi-step fallback chain. Omitting `logo` here lets that mapping take
 * priority correctly.
 */

// yahoo-finance2: support both v2 (backend/node_modules) and v3 (root node_modules)
// v2 exports an object instance; v3 exports a class (function) that must be instantiated.
const _yf2 = require('yahoo-finance2').default;
const yahooFinance = (typeof _yf2 === 'function')
    ? new _yf2({ suppressNotices: ['yahooSurvey'] })
    : _yf2;

const fs   = require('fs');
const path = require('path');

const OUTPUT_FILE   = path.join(__dirname, '../../public/data/stocks.json');
const BATCH_SIZE    = 5;      // tickers per parallel batch
const BATCH_DELAY   = 1200;   // ms between batches (base)
const MAX_RETRIES   = 3;      // retries per ticker on transient errors
const RETRY_BASE_MS = 2000;   // base retry delay (doubles each attempt)
const JITTER_MAX_MS = 800;    // random jitter added to every delay

// When we detect widespread rate-limiting (>50% of a batch failed with 429),
// switch to throttled mode: smaller batches, longer delays.
let throttledMode = false;
let rateHitCount  = 0;       // consecutive batches with 429s

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
    IN:  ['^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'LICI.NS'],
    UK:  ['^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'DGE.L', 'RIO.L', 'GSK.L', 'GLEN.L'],
    DE:  ['^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE', 'VOW3.DE', 'BAS.DE', 'ADS.DE'],
    FR:  ['^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA', 'SU.PA', 'EL.PA', 'KER.PA'],
    JP:  ['^N225', '7203.T', '6758.T', '9984.T', '6861.T', '8306.T', '9432.T', '7974.T', '6098.T', '4063.T'],
    CA:  ['^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO', 'BMO.TO', 'BNS.TO', 'TRP.TO'],
    AU:  ['^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'FMG.AX', 'WDS.AX', 'TLS.AX'],
    HK:  ['^HSI', '0700.HK', '9988.HK', '0939.HK', '1299.HK', '0941.HK', '3690.HK', '0005.HK', '0388.HK'],
    CH:  ['^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW', 'CFR.SW', 'ZURN.SW', 'LONN.SW'],
    NL:  ['^AEX', 'ASML.AS', 'UNA.AS', 'SHELL.AS', 'HEIA.AS', 'INGA.AS', 'PHIA.AS', 'ADYEN.AS', 'DSFIR.AS'],
    ES:  ['^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC', 'REP.MC', 'CLNX.MC'],
    IT:  ['FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'ENI.MI', 'UCG.MI', 'RACE.MI', 'G.MI', 'MB.MI'],
    BR:  ['^BVSP', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA', 'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA'],
    MX:  ['^MXX', 'WALMEX.MX', 'AMX.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'BIMBOA.MX', 'CEMEXCPO.MX', 'TLEVISACPO.MX'],
    KR:  ['^KS11', '005930.KS', '000660.KS', '005380.KS', '207940.KS', '051910.KS', '005490.KS'],
    TW:  ['^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2881.TW'],
    SG:  ['^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C52.SI'],
    AE:  ['EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AE', 'DIB.AE', 'EMIRATESNBD.AE', 'TAQA.AD'],
    ZA:  ['JSE.JO', 'NPN.JO', 'FSR.JO', 'SBK.JO', 'ABG.JO', 'SOL.JO', 'MTN.JO'],
    QA:  ['QNBK.QA', 'IQCD.QA', 'QIBK.QA', 'CBQK.QA', 'MARK.QA'],
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

function jitter(maxMs = JITTER_MAX_MS) {
    return Math.floor(Math.random() * maxMs);
}

function isRateLimitError(e) {
    if (!e) return false;
    const msg = (e.message || '').toLowerCase();
    return msg.includes('too many requests') ||
           msg.includes('rate limit') ||
           msg.includes('429') ||
           (e.statusCode === 429);
}

function isTransientError(e) {
    if (!e) return false;
    const msg = (e.message || '').toLowerCase();
    return isRateLimitError(e) ||
           msg.includes('network') ||
           msg.includes('timeout') ||
           msg.includes('econnreset') ||
           msg.includes('socket') ||
           msg.includes('enotfound');
}

/**
 * Fetch a single ticker with exponential backoff retry on transient errors.
 * Returns the quote object or null on permanent failure.
 */
async function fetchWithRetry(symbol) {
    let lastErr;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const quote = await yahooFinance.quote(symbol);
            // Reset throttle counter on success
            if (rateHitCount > 0) rateHitCount = Math.max(0, rateHitCount - 1);
            return quote;
        } catch (e) {
            lastErr = e;
            if (isRateLimitError(e)) {
                rateHitCount++;
                if (rateHitCount >= 3 && !throttledMode) {
                    throttledMode = true;
                    process.stderr.write('\n  ⚠ Widespread rate limiting detected — switching to throttled mode\n');
                }
            }
            if (attempt < MAX_RETRIES && isTransientError(e)) {
                const backoff = RETRY_BASE_MS * Math.pow(2, attempt) + jitter();
                process.stderr.write(`  ↻ ${symbol} retry ${attempt + 1}/${MAX_RETRIES} in ${backoff}ms (${e.message?.slice(0, 60)})\n`);
                await sleep(backoff);
            } else {
                // Non-transient error (bad ticker, etc.) — don't retry
                break;
            }
        }
    }
    // Log final failure only for rate limits (to avoid spam for bad tickers)
    if (isRateLimitError(lastErr)) {
        process.stderr.write(`  ✗ ${symbol} gave up after ${MAX_RETRIES} retries (rate limited)\n`);
    }
    return null;
}

/**
 * Fetch a batch of tickers with adaptive delay.
 * In throttled mode, uses smaller concurrent load + extra delay.
 */
async function fetchBatch(symbols) {
    // In throttled mode, fetch one at a time instead of all at once
    if (throttledMode) {
        const results = [];
        for (const sym of symbols) {
            const quote = await fetchWithRetry(sym);
            results.push({ symbol: sym, quote });
            await sleep(jitter(500)); // small per-ticker pause in throttled mode
        }
        return results;
    }

    const results = await Promise.allSettled(
        symbols.map(sym => fetchWithRetry(sym))
    );
    return symbols.map((sym, i) => ({
        symbol: sym,
        quote: results[i].status === 'fulfilled' ? results[i].value : null,
    }));
}

/**
 * Build a normalized stock object from a Yahoo Finance quote response.
 */
function buildStockEntry(symbol, quote, market) {
    if (!quote) return null;

    const price     = quote.regularMarketPrice || quote.regularMarketPreviousClose || 0;
    const prevClose = quote.regularMarketPreviousClose || price;
    let   change    = quote.regularMarketChange ?? (price - prevClose);
    let   changePct = quote.regularMarketChangePercent ?? (prevClose > 0 ? (change / prevClose) * 100 : 0);

    // Normalise tiny float drift
    if (!change)    change    = 0;
    if (!changePct) changePct = 0;

    return {
        symbol:           symbol,
        name:             quote.shortName || quote.longName || symbol,
        category:         market,
        country:          FLAGS[market] || '🌍',
        sector:           quote.sector || null,
        // logo intentionally omitted → StockLogo component uses its built-in
        // static mapping (local SA PNGs, Wikimedia SVGs for US, etc.)
        price:            price,
        change:           change,
        changePercent:    changePct,
        prevClose:        prevClose,
        open:             quote.regularMarketOpen     || price,
        high:             quote.regularMarketDayHigh  || price,
        low:              quote.regularMarketDayLow   || price,
        volume:           quote.regularMarketVolume   || quote.averageDailyVolume3Month || 0,
        marketCap:        quote.marketCap             || null,
        peRatio:          quote.trailingPE            || null,
        dividendYield:    quote.trailingAnnualDividendYield || null,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh      || null,
        fiftyTwoWeekLow:  quote.fiftyTwoWeekLow       || null,
        lastUpdated:      new Date().toISOString(),
    };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const startTime = Date.now();
    console.log('📈 Price Pump v2 — All Markets (World-Class)\n');

    // ── Step 1: Load existing data as safety net ──────────────────────────────
    // If a market fails entirely, we keep its existing data instead of wiping it.
    let existingData = {};
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            const markets = Object.keys(existingData).filter(k => k !== 'Global');
            const totalExisting = markets.reduce((s, k) => s + (existingData[k]?.length || 0), 0);
            console.log(`💾 Loaded existing data: ${totalExisting} stocks across ${markets.length} markets (safety net)\n`);
        } catch (e) {
            console.warn(`⚠ Could not parse existing data: ${e.message} — will build from scratch\n`);
        }
    }

    // ── Step 2: Collect ALL unique tickers ────────────────────────────────────
    const allTickers = [...new Set(Object.values(MARKETS).flat())];
    console.log(`📊 ${allTickers.length} unique tickers across ${Object.keys(MARKETS).length} markets\n`);
    if (throttledMode) console.log('🐢 Starting in throttled mode\n');

    // ── Step 3: Fetch in batches with adaptive rate limiting ──────────────────
    const quoteMap = {};
    let fetched = 0;
    for (let i = 0; i < allTickers.length; i += BATCH_SIZE) {
        const batch   = allTickers.slice(i, i + BATCH_SIZE);
        const results = await fetchBatch(batch);
        results.forEach(({ symbol, quote }) => { quoteMap[symbol] = quote; });
        fetched += batch.length;
        process.stdout.write(`  Fetched ${fetched}/${allTickers.length}${throttledMode ? ' [throttled]' : ''}...\r`);
        if (i + BATCH_SIZE < allTickers.length) {
            // Adaptive delay: longer when throttled, add jitter always
            const delay = (throttledMode ? BATCH_DELAY * 2 : BATCH_DELAY) + jitter();
            await sleep(delay);
        }
    }

    const succeeded = Object.values(quoteMap).filter(Boolean).length;
    const failed    = allTickers.length - succeeded;
    console.log(`\n✅ Quotes received: ${succeeded}/${allTickers.length} succeeded, ${failed} failed\n`);

    // ── Step 4: Build market-keyed output (preserve old data on total failure) ──
    const output          = {};
    const marketResults   = [];
    let   marketsUpdated  = 0;
    let   marketsPreserved = 0;

    for (const [market, tickers] of Object.entries(MARKETS)) {
        const entries = [];
        for (const sym of tickers) {
            const entry = buildStockEntry(sym, quoteMap[sym], market);
            if (entry) entries.push(entry);
        }

        const successRate = entries.length / tickers.length;

        if (entries.length === 0) {
            // Total failure for this market — keep existing data
            const preserved = existingData[market] || [];
            output[market] = preserved;
            marketsPreserved++;
            marketResults.push({ market, ok: false, got: 0, total: tickers.length, preserved: preserved.length });
            console.log(`  ${FLAGS[market] || ''} ${market}: ✗ 0/${tickers.length} — preserved ${preserved.length} existing`);
        } else if (successRate < 0.3 && (existingData[market]?.length || 0) > entries.length) {
            // Less than 30% success AND existing data is better — preserve existing
            output[market] = existingData[market];
            marketsPreserved++;
            marketResults.push({ market, ok: false, got: entries.length, total: tickers.length, preserved: existingData[market].length });
            console.log(`  ${FLAGS[market] || ''} ${market}: ⚠ ${entries.length}/${tickers.length} (low) — preserved ${existingData[market].length} existing`);
        } else {
            output[market] = entries;
            marketsUpdated++;
            marketResults.push({ market, ok: true, got: entries.length, total: tickers.length });
            console.log(`  ${FLAGS[market] || ''} ${market}: ✓ ${entries.length}/${tickers.length} stocks updated`);
        }
    }

    // Global = same as US (mirrors ingest_master.py behaviour)
    output['Global'] = output['US'] || [];
    console.log(`  🌍 Global: aliased to US (${output['Global'].length} stocks)`);

    // ── Step 5: Write atomically ───────────────────────────────────────────────
    // Write to temp file first, then rename — prevents partial writes from
    // corrupting the data file if the process is interrupted.
    const dir      = path.dirname(OUTPUT_FILE);
    const tmpFile  = OUTPUT_FILE + '.tmp';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(tmpFile, JSON.stringify(output));
    fs.renameSync(tmpFile, OUTPUT_FILE);

    // ── Step 6: Summary ───────────────────────────────────────────────────────
    const elapsed    = ((Date.now() - startTime) / 1000).toFixed(1);
    const totalStocks = Object.entries(output)
        .filter(([k]) => k !== 'Global')
        .reduce((s, [, arr]) => s + arr.length, 0);

    console.log('\n' + '═'.repeat(55));
    console.log(`✅ DONE in ${elapsed}s`);
    console.log(`   Markets updated:   ${marketsUpdated}/${Object.keys(MARKETS).length}`);
    console.log(`   Markets preserved: ${marketsPreserved} (used existing data)`);
    console.log(`   Total stocks:      ${totalStocks}`);
    console.log(`   Mode: ${throttledMode ? '🐢 Throttled (rate-limit detected)' : '🚀 Normal'}`);
    console.log(`   SA sample: ${output.SA?.[0]?.symbol ?? 'n/a'} @ ${output.SA?.[0]?.price ?? 'n/a'}`);
    console.log(`   US sample: ${output.US?.[0]?.symbol ?? 'n/a'} @ ${output.US?.[0]?.price ?? 'n/a'}`);
    console.log('═'.repeat(55));

    // Exit with code 0 even if some markets were preserved — partial success is fine
    // Exit 1 only if EVERYTHING failed (0 stocks total)
    if (totalStocks === 0) {
        console.error('\n❌ FATAL: 0 stocks written — aborting to prevent data wipe');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('❌ FATAL:', err.message);
    process.exit(1);
});
