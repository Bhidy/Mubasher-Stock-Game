import yahooFinance from 'yahoo-finance2';

// Version: 4.0.1 - Fixed 403 Errors
// Deployed: 2026-01-02

// Configure for avoiding blocks
yahooFinance.setGlobalConfig({
    reqOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        }
    }
});

// === ALL MARKET STOCK LISTS ===

// Saudi Arabia (Tadawul) - .SR suffix
const SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
];

// Egypt (EGX) - .CA suffix
const EGYPT_STOCKS = [
    'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
    'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
    'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
    'ADIB.CA', '^CASE30'
];

// US (NYSE/NASDAQ) - no suffix
const US_STOCKS = [
    '^GSPC', '^DJI', '^IXIC',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE'
];

// India (NSE) - .NS suffix
const INDIA_STOCKS = [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS', 'ITC.NS',
    'LT.NS', 'AXISBANK.NS', 'WIPRO.NS', 'SUNPHARMA.NS', 'MARUTI.NS',
    'TATAMOTORS.NS', 'HCLTECH.NS', 'BAJFINANCE.NS', 'ASIANPAINT.NS', '^NSEI'
];

// UK (LSE) - .L suffix
const UK_STOCKS = [
    'BP.L', 'HSBA.L', 'SHEL.L', 'AZN.L', 'ULVR.L', 'GSK.L', 'RIO.L', 'DGE.L',
    'LSEG.L', 'BATS.L', 'LLOY.L', 'VOD.L', 'BARC.L', 'NWG.L', 'REL.L',
    'GLEN.L', 'NG.L', 'PRU.L', 'CPG.L', '^FTSE'
];

// Canada (TSX) - .TO suffix
const CANADA_STOCKS = [
    'SHOP.TO', 'RY.TO', 'TD.TO', 'ENB.TO', 'CNR.TO', 'BNS.TO', 'BMO.TO',
    'CP.TO', 'SU.TO', 'TRP.TO', 'BCE.TO', 'CNQ.TO', 'MFC.TO', 'ATD.TO',
    'CSU.TO', 'CM.TO', 'ABX.TO', 'T.TO', 'WCN.TO', '^GSPTSE'
];

// Australia (ASX) - .AX suffix
const AUSTRALIA_STOCKS = [
    'BHP.AX', 'CBA.AX', 'CSL.AX', 'WBC.AX', 'NAB.AX', 'ANZ.AX', 'WES.AX',
    'MQG.AX', 'FMG.AX', 'WOW.AX', 'TLS.AX', 'RIO.AX', 'GMG.AX', 'ALL.AX',
    'TCL.AX', 'COL.AX', 'REA.AX', 'JHX.AX', 'STO.AX', '^AXJO'
];

// Hong Kong (HKEX) - .HK suffix
const HONGKONG_STOCKS = [
    '0700.HK', '9988.HK', '0005.HK', '0941.HK', '1299.HK', '0883.HK',
    '2318.HK', '0939.HK', '1398.HK', '3988.HK', '0011.HK', '0016.HK',
    '0001.HK', '0027.HK', '1810.HK', '9618.HK', '3690.HK', '0066.HK',
    '0002.HK', '^HSI'
];

// Germany (XETRA) - .DE suffix
const GERMANY_STOCKS = [
    'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'MBG.DE', 'BMW.DE', 'BAS.DE',
    'DBK.DE', 'VOW3.DE', 'ADS.DE', 'MRK.DE', 'DPW.DE', 'IFX.DE', 'RWE.DE',
    'ENR.DE', 'HEN3.DE', 'MUV2.DE', 'CON.DE', 'FRE.DE', '^GDAXI'
];

// Japan (TSE) - .T suffix
const JAPAN_STOCKS = [
    '7203.T', '6758.T', '9984.T', '6861.T', '9432.T', '8306.T', '6098.T',
    '7974.T', '4502.T', '8035.T', '6501.T', '4063.T', '7267.T', '9433.T',
    '8766.T', '6902.T', '4661.T', '7751.T', '4503.T', '^N225'
];

// UAE (ADX/DFM) - Using .AE suffix (works with Yahoo Finance)
const UAE_STOCKS = [
    'EMAAR.AE', 'DU.AE', 'DIB.AE', 'ADCB.AE', 'FAB.AE',
    'ETISALAT.AE', 'ADNOCDIST.AE', 'ALDAR.AE', 'TAQA.AE', 'ADPORTS.AE',
    'DAMACPROP.AE', 'DEWA.AE', 'ENBD.AE', 'CB.AE', 'EMAAR.AE'
];

// South Africa (JSE) - .JO suffix - Using JSE.JO (JSE Ltd) as index proxy
const SOUTHAFRICA_STOCKS = [
    'NPN.JO', 'SOL.JO', 'BTI.JO', 'SBK.JO', 'FSR.JO', 'AGL.JO', 'MTN.JO',
    'ABG.JO', 'CFR.JO', 'BID.JO', 'VOD.JO', 'SHP.JO', 'AMS.JO', 'IMP.JO',
    'NED.JO', 'JSE.JO'
];

// Qatar (QSE) - .QA suffix - Using QNBK.QA as index proxy (largest bank)
const QATAR_STOCKS = [
    'QNBK.QA', 'QEWS.QA', 'QGTS.QA', 'QIBK.QA', 'IQCD.QA', 'MARK.QA',
    'BRES.QA', 'CBQK.QA', 'ORDS.QA', 'QFLS.QA', 'UDCD.QA', 'DHBK.QA', 'QNBK.QA'
];

// ============= PHASE 2 TIER 1 MARKETS =============

// France (Euronext Paris) - .PA suffix
const FRANCE_STOCKS = [
    'MC.PA', 'OR.PA', 'SAN.PA', 'AI.PA', 'TTE.PA', 'SU.PA', 'BNP.PA',
    'AIR.PA', 'DG.PA', 'KER.PA', 'CS.PA', 'RI.PA', 'CAP.PA', 'SAF.PA',
    'VIV.PA', 'ORA.PA', 'SGO.PA', 'EN.PA', 'WLN.PA', '^FCHI'
];

// Switzerland (SIX) - .SW suffix
const SWITZERLAND_STOCKS = [
    'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'CSGN.SW', 'ABBN.SW',
    'ZURN.SW', 'SREN.SW', 'GIVN.SW', 'LONN.SW', 'SCMN.SW', 'SIKA.SW',
    'GEBN.SW', 'BAER.SW', 'PGHN.SW', '^SSMI'
];

// Netherlands (Euronext Amsterdam) - .AS suffix
const NETHERLANDS_STOCKS = [
    'ASML.AS', 'SHELL.AS', 'UNA.AS', 'INGA.AS', 'ABN.AS', 'HEIA.AS',
    'AD.AS', 'PHIA.AS', 'KPN.AS', 'WKL.AS', 'RAND.AS', 'DSM.AS',
    'AKZA.AS', 'MT.AS', 'AGN.AS', '^AEX'
];

// Spain (BME) - .MC suffix
const SPAIN_STOCKS = [
    'SAN.MC', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'TEF.MC', 'REP.MC',
    'FER.MC', 'AMS.MC', 'AENA.MC', 'ELE.MC', 'GRF.MC', 'CABK.MC',
    'REE.MC', 'MEL.MC', 'MAP.MC', '^IBEX'
];

// Italy (Borsa Italiana) - .MI suffix - Using FTSEMIB.MI as index
const ITALY_STOCKS = [
    'ENEL.MI', 'ENI.MI', 'ISP.MI', 'UCG.MI', 'STMMI.MI', 'G.MI',
    'RACE.MI', 'TEN.MI', 'MONC.MI', 'SFER.MI', 'AMP.MI', 'LDO.MI',
    'MB.MI', 'PST.MI', 'BAMI.MI', 'FTSEMIB.MI'
];

// Brazil (B3) - .SA suffix
const BRAZIL_STOCKS = [
    'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'ABEV3.SA', 'WEGE3.SA',
    'RENT3.SA', 'SUZB3.SA', 'JBSS3.SA', 'GGBR4.SA', 'CSNA3.SA', 'LREN3.SA',
    'MGLU3.SA', 'CSAN3.SA', 'EQTL3.SA', 'RADL3.SA', 'RAIL3.SA', '^BVSP'
];

// Mexico (BMV) - .MX suffix
const MEXICO_STOCKS = [
    'WALMEX.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'GFNORTEO.MX', 'TLOVIS.A.MX',
    'CEMEXCPO.MX', 'BIMBOA.MX', 'KOFUBL.MX', 'AC.MX', 'ALSEA.MX',
    'OMAB.MX', 'GRUMAB.MX', 'LIVEPOLC-1.MX', 'GAPB.MX', 'ASURB.MX', '^MXX'
];

// South Korea (KRX) - .KS suffix
const KOREA_STOCKS = [
    '005930.KS', '000660.KS', '035420.KS', '005380.KS', '051910.KS',
    '006400.KS', '035720.KS', '005490.KS', '068270.KS', '055550.KS',
    '028260.KS', '034730.KS', '003670.KS', '012330.KS', '096770.KS', '^KS11'
];

// Taiwan (TWSE) - .TW suffix
const TAIWAN_STOCKS = [
    '2330.TW', '2317.TW', '2454.TW', '2412.TW', '1301.TW', '2882.TW',
    '2881.TW', '2303.TW', '3711.TW', '2886.TW', '1303.TW', '2308.TW',
    '2891.TW', '3008.TW', '2002.TW', '^TWII'
];

// Singapore (SGX) - .SI suffix
const SINGAPORE_STOCKS = [
    'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C6L.SI', 'BN4.SI',
    'G13.SI', 'C38U.SI', 'A17U.SI', 'Y92.SI', 'F34.SI', 'V03.SI',
    'U14.SI', 'C52.SI', 'S63.SI', '^STI'
];

// Legacy global (for backward compatibility)
const GLOBAL_TICKERS = US_STOCKS;

// Company domains for logo generation
const COMPANY_DOMAINS = {
    // Saudi
    '2222.SR': 'aramco.com', '1120.SR': 'alrajhibank.com.sa', '2010.SR': 'sabic.com',
    '7010.SR': 'stc.com.sa', '2082.SR': 'acwapower.com', '1180.SR': 'alahli.com',
    '2050.SR': 'savola.com', '1150.SR': 'alinma.com', '1010.SR': 'riyadbank.com',
    '4002.SR': 'mouwasat.com', '^TASI.SR': 'saudiexchange.sa',
    // Egypt
    'COMI.CA': 'cibeg.com', 'HRHO.CA': 'efghermes.com', 'SWDY.CA': 'elsewedyelectric.com',
    'ETEL.CA': 'te.eg', 'FWRY.CA': 'fawry.com', '^CASE30': 'egx.com.eg',
    // US
    'AAPL': 'apple.com', 'MSFT': 'microsoft.com', 'GOOG': 'google.com', 'AMZN': 'amazon.com',
    'TSLA': 'tesla.com', 'NVDA': 'nvidia.com', 'META': 'meta.com', 'NFLX': 'netflix.com',
    'AMD': 'amd.com', 'INTC': 'intel.com', 'JPM': 'jpmorganchase.com', 'V': 'visa.com',
    // India
    'RELIANCE.NS': 'ril.com', 'TCS.NS': 'tcs.com', 'HDFCBANK.NS': 'hdfcbank.com',
    'INFY.NS': 'infosys.com', 'ICICIBANK.NS': 'icicibank.com', '^NSEI': 'nseindia.com',
    // UK
    'BP.L': 'bp.com', 'HSBA.L': 'hsbc.com', 'SHEL.L': 'shell.com', 'AZN.L': 'astrazeneca.com',
    'ULVR.L': 'unilever.com', 'GSK.L': 'gsk.com', 'VOD.L': 'vodafone.com', '^FTSE': 'lseg.com',
    // Canada
    'SHOP.TO': 'shopify.com', 'RY.TO': 'rbc.com', 'TD.TO': 'td.com', 'ENB.TO': 'enbridge.com',
    '^GSPTSE': 'tsx.com',
    // Australia
    'BHP.AX': 'bhp.com', 'CBA.AX': 'commbank.com.au', 'CSL.AX': 'csl.com', '^AXJO': 'asx.com.au',
    // Hong Kong
    '0700.HK': 'tencent.com', '9988.HK': 'alibaba.com', '1810.HK': 'mi.com', '^HSI': 'hsi.com.hk',
    // Germany
    'SAP.DE': 'sap.com', 'SIE.DE': 'siemens.com', 'BMW.DE': 'bmw.com', 'MBG.DE': 'mercedes-benz.com',
    'ADS.DE': 'adidas.com', '^GDAXI': 'deutsche-boerse.com',
    // Japan
    '7203.T': 'toyota.com', '6758.T': 'sony.com', '7974.T': 'nintendo.com', '^N225': 'jpx.co.jp',
    // UAE
    'ETISALAT.AE': 'eand.com', 'FAB.AE': 'bankfab.com', '^ADI': 'adx.ae',
    // South Africa
    'NPN.JO': 'naspers.com', 'MTN.JO': 'mtn.com', '^J203': 'jse.co.za',
    // Qatar
    'QNBK.QA': 'qnb.com', 'ORDS.QA': 'ooredoo.qa'
};

const getLogoUrl = (symbol) => {
    const domain = COMPANY_DOMAINS[symbol];
    if (domain) {
        return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
    }
    return null;
};

// Metadata mapping for all markets
const STOCK_META = {
    // Saudi Arabia - COMPLETE LIST with sectors
    '2222.SR': { name: 'Saudi Aramco', country: '🇸🇦', sector: 'Energy' },
    '1120.SR': { name: 'Al Rajhi Bank', country: '🇸🇦', sector: 'Financial' },
    '2010.SR': { name: 'SABIC', country: '🇸🇦', sector: 'Materials' },
    '7010.SR': { name: 'STC', country: '🇸🇦', sector: 'Telecom' },
    '2082.SR': { name: 'ACWA Power', country: '🇸🇦', sector: 'Utilities' },
    '1180.SR': { name: 'SNB', country: '🇸🇦', sector: 'Financial' },
    '2380.SR': { name: 'PETRORABIGH', country: '🇸🇦', sector: 'Energy' },
    '4030.SR': { name: 'Almarai', country: '🇸🇦', sector: 'Consumer' },
    '2350.SR': { name: 'SIPCHEM', country: '🇸🇦', sector: 'Materials' },
    '4200.SR': { name: 'Aldrees', country: '🇸🇦', sector: 'Consumer' },
    '1211.SR': { name: 'Alinma Bank', country: '🇸🇦', sector: 'Financial' },
    '4001.SR': { name: 'Abdullah Al Othaim', country: '🇸🇦', sector: 'Consumer' },
    '2310.SR': { name: 'Saudi Industrial', country: '🇸🇦', sector: 'Industrial' },
    '4003.SR': { name: 'Extra', country: '🇸🇦', sector: 'Consumer' },
    '2050.SR': { name: 'Savola', country: '🇸🇦', sector: 'Consumer' },
    '1150.SR': { name: 'SABB', country: '🇸🇦', sector: 'Financial' },
    '4190.SR': { name: 'Jarir', country: '🇸🇦', sector: 'Consumer' },
    '2290.SR': { name: 'Yanbu Cement', country: '🇸🇦', sector: 'Materials' },
    '4002.SR': { name: 'Mouwasat', country: '🇸🇦', sector: 'Healthcare' },
    '1010.SR': { name: 'Riyad Bank', country: '🇸🇦', sector: 'Financial' },
    '2020.SR': { name: 'Saudi Basic', country: '🇸🇦', sector: 'Materials' },
    '2280.SR': { name: 'Saudi Cement', country: '🇸🇦', sector: 'Materials' },
    '5110.SR': { name: 'Saudi Electricity', country: '🇸🇦', sector: 'Utilities' },
    '1140.SR': { name: 'Bank AlBilad', country: '🇸🇦', sector: 'Financial' },
    '1060.SR': { name: 'Banque Saudi Fransi', country: '🇸🇦', sector: 'Financial' },
    '7200.SR': { name: 'Rabigh Refining', country: '🇸🇦', sector: 'Energy' },
    '4220.SR': { name: 'EMAAR EC', country: '🇸🇦', sector: 'Real Estate' },
    '4090.SR': { name: 'Taiba Holding', country: '🇸🇦', sector: 'Real Estate' },
    '4040.SR': { name: 'Saudi Research', country: '🇸🇦', sector: 'Technology' },
    '^TASI.SR': { name: 'TASI', country: '🇸🇦', sector: 'Index' },
    // Egypt - Complete list
    'COMI.CA': { name: 'CIB Bank', country: '🇪🇬', sector: 'Financial' },
    'EAST.CA': { name: 'Eastern Company', country: '🇪🇬', sector: 'Consumer' },
    'HRHO.CA': { name: 'EFG Hermes', country: '🇪🇬', sector: 'Financial' },
    'TMGH.CA': { name: 'Talaat Moustafa', country: '🇪🇬', sector: 'Real Estate' },
    'SWDY.CA': { name: 'Elsewedy Electric', country: '🇪🇬', sector: 'Industrial' },
    'ETEL.CA': { name: 'Telecom Egypt', country: '🇪🇬', sector: 'Telecom' },
    'AMOC.CA': { name: 'Alexandria MO', country: '🇪🇬', sector: 'Energy' },
    'EKHO.CA': { name: 'E-Finance', country: '🇪🇬', sector: 'Technology' },
    'HELI.CA': { name: 'Heliopolis Housing', country: '🇪🇬', sector: 'Real Estate' },
    'ORAS.CA': { name: 'Orascom Construction', country: '🇪🇬', sector: 'Industrial' },
    'ESRS.CA': { name: 'Ezz Steel', country: '🇪🇬', sector: 'Materials' },
    'ABUK.CA': { name: 'Abu Qir Fertilizers', country: '🇪🇬', sector: 'Materials' },
    'MFPC.CA': { name: 'Misr Fertilizers', country: '🇪🇬', sector: 'Materials' },
    'ISPH.CA': { name: 'Ibnsina Pharma', country: '🇪🇬', sector: 'Healthcare' },
    'PHDC.CA': { name: 'Palm Hills', country: '🇪🇬', sector: 'Real Estate' },
    'AUTO.CA': { name: 'GB Auto', country: '🇪🇬', sector: 'Consumer' },
    'CIEB.CA': { name: 'CIE Automotive', country: '🇪🇬', sector: 'Industrial' },
    'FWRY.CA': { name: 'Fawry', country: '🇪🇬', sector: 'Technology' },
    'ADIB.CA': { name: 'Abu Dhabi Islamic Bank', country: '🇪🇬', sector: 'Financial' },
    '^CASE30': { name: 'EGX 30', country: '🇪🇬', sector: 'Index' },
    // US
    '^GSPC': { name: 'S&P 500', country: '🇺🇸', sector: 'Index' },
    '^DJI': { name: 'Dow Jones', country: '🇺🇸', sector: 'Index' },
    '^IXIC': { name: 'Nasdaq', country: '🇺🇸', sector: 'Index' },
    'AAPL': { name: 'Apple', country: '🇺🇸', sector: 'Technology' },
    'MSFT': { name: 'Microsoft', country: '🇺🇸', sector: 'Technology' },
    'NVDA': { name: 'Nvidia', country: '🇺🇸', sector: 'Technology' },
    'TSLA': { name: 'Tesla', country: '🇺🇸', sector: 'Consumer' },
    // India
    'RELIANCE.NS': { name: 'Reliance Industries', country: '🇮🇳', sector: 'Energy' },
    'TCS.NS': { name: 'Tata Consultancy', country: '🇮🇳', sector: 'Technology' },
    'HDFCBANK.NS': { name: 'HDFC Bank', country: '🇮🇳', sector: 'Financial' },
    'INFY.NS': { name: 'Infosys', country: '🇮🇳', sector: 'Technology' },
    'ICICIBANK.NS': { name: 'ICICI Bank', country: '🇮🇳', sector: 'Financial' },
    '^NSEI': { name: 'Nifty 50', country: '🇮🇳', sector: 'Index' },
    // UK
    'BP.L': { name: 'BP plc', country: '🇬🇧', sector: 'Energy' },
    'HSBA.L': { name: 'HSBC Holdings', country: '🇬🇧', sector: 'Financial' },
    'SHEL.L': { name: 'Shell plc', country: '🇬🇧', sector: 'Energy' },
    'AZN.L': { name: 'AstraZeneca', country: '🇬🇧', sector: 'Healthcare' },
    '^FTSE': { name: 'FTSE 100', country: '🇬🇧', sector: 'Index' },
    // Canada
    'SHOP.TO': { name: 'Shopify', country: '🇨🇦', sector: 'Technology' },
    'RY.TO': { name: 'Royal Bank', country: '🇨🇦', sector: 'Financial' },
    'TD.TO': { name: 'TD Bank', country: '🇨🇦', sector: 'Financial' },
    '^GSPTSE': { name: 'TSX Composite', country: '🇨🇦', sector: 'Index' },
    // Australia
    'BHP.AX': { name: 'BHP Group', country: '🇦🇺', sector: 'Mining' },
    'CBA.AX': { name: 'Commonwealth Bank', country: '🇦🇺', sector: 'Financial' },
    'CSL.AX': { name: 'CSL Limited', country: '🇦🇺', sector: 'Healthcare' },
    '^AXJO': { name: 'ASX 200', country: '🇦🇺', sector: 'Index' },
    // Hong Kong
    '0700.HK': { name: 'Tencent', country: '🇭🇰', sector: 'Technology' },
    '9988.HK': { name: 'Alibaba', country: '🇭🇰', sector: 'Technology' },
    '0005.HK': { name: 'HSBC Holdings', country: '🇭🇰', sector: 'Financial' },
    '^HSI': { name: 'Hang Seng', country: '🇭🇰', sector: 'Index' },
    // Germany
    'SAP.DE': { name: 'SAP SE', country: '🇩🇪', sector: 'Technology' },
    'SIE.DE': { name: 'Siemens', country: '🇩🇪', sector: 'Industrial' },
    'BMW.DE': { name: 'BMW', country: '🇩🇪', sector: 'Automotive' },
    '^GDAXI': { name: 'DAX', country: '🇩🇪', sector: 'Index' },
    // Japan
    '7203.T': { name: 'Toyota Motor', country: '🇯🇵', sector: 'Automotive' },
    '6758.T': { name: 'Sony Group', country: '🇯🇵', sector: 'Technology' },
    '7974.T': { name: 'Nintendo', country: '🇯🇵', sector: 'Consumer' },
    '^N225': { name: 'Nikkei 225', country: '🇯🇵', sector: 'Index' },
    // UAE - Using EMAAR.AE as market index proxy
    'EMAAR.AE': { name: 'Emaar Properties', country: '🇦🇪', sector: 'Real Estate' },
    'DU.AE': { name: 'EITC (Du)', country: '🇦🇪', sector: 'Telecom' },
    'DIB.AE': { name: 'Dubai Islamic Bank', country: '🇦🇪', sector: 'Financial' },
    'FAB.AE': { name: 'First Abu Dhabi Bank', country: '🇦🇪', sector: 'Financial' },
    // South Africa - Using JSE.JO as market index proxy
    'NPN.JO': { name: 'Naspers', country: '🇿🇦', sector: 'Technology' },
    'SOL.JO': { name: 'Sasol', country: '🇿🇦', sector: 'Energy' },
    'MTN.JO': { name: 'MTN Group', country: '🇿🇦', sector: 'Telecom' },
    'JSE.JO': { name: 'JSE Index', country: '🇿🇦', sector: 'Index' },
    // Qatar - Using QNBK.QA as market index proxy
    'QNBK.QA': { name: 'QNB Group', country: '🇶🇦', sector: 'Financial' },
    'ORDS.QA': { name: 'Ooredoo', country: '🇶🇦', sector: 'Telecom' },
    'QFLS.QA': { name: 'Qatar Fuel', country: '🇶🇦', sector: 'Energy' },
    // ============= PHASE 2 TIER 1 STOCK_META =============
    // France
    'MC.PA': { name: 'LVMH', country: '🇫🇷', sector: 'Consumer' },
    'OR.PA': { name: "L'Oréal", country: '🇫🇷', sector: 'Consumer' },
    'TTE.PA': { name: 'TotalEnergies', country: '🇫🇷', sector: 'Energy' },
    'SAN.PA': { name: 'Sanofi', country: '🇫🇷', sector: 'Healthcare' },
    'BNP.PA': { name: 'BNP Paribas', country: '🇫🇷', sector: 'Financial' },
    'AIR.PA': { name: 'Airbus', country: '🇫🇷', sector: 'Industrial' },
    '^FCHI': { name: 'CAC 40', country: '🇫🇷', sector: 'Index' },
    // Switzerland
    'NESN.SW': { name: 'Nestlé', country: '🇨🇭', sector: 'Consumer' },
    'ROG.SW': { name: 'Roche', country: '🇨🇭', sector: 'Healthcare' },
    'NOVN.SW': { name: 'Novartis', country: '🇨🇭', sector: 'Healthcare' },
    'UBSG.SW': { name: 'UBS Group', country: '🇨🇭', sector: 'Financial' },
    '^SSMI': { name: 'SMI', country: '🇨🇭', sector: 'Index' },
    // Netherlands
    'ASML.AS': { name: 'ASML Holding', country: '🇳🇱', sector: 'Technology' },
    'SHELL.AS': { name: 'Shell', country: '🇳🇱', sector: 'Energy' },
    'UNA.AS': { name: 'Unilever', country: '🇳🇱', sector: 'Consumer' },
    'INGA.AS': { name: 'ING Group', country: '🇳🇱', sector: 'Financial' },
    '^AEX': { name: 'AEX', country: '🇳🇱', sector: 'Index' },
    // Spain
    'SAN.MC': { name: 'Banco Santander', country: '🇪🇸', sector: 'Financial' },
    'ITX.MC': { name: 'Inditex', country: '🇪🇸', sector: 'Consumer' },
    'IBE.MC': { name: 'Iberdrola', country: '🇪🇸', sector: 'Utilities' },
    'BBVA.MC': { name: 'BBVA', country: '🇪🇸', sector: 'Financial' },
    '^IBEX': { name: 'IBEX 35', country: '🇪🇸', sector: 'Index' },
    // Italy
    'ENEL.MI': { name: 'Enel', country: '🇮🇹', sector: 'Utilities' },
    'ENI.MI': { name: 'Eni', country: '🇮🇹', sector: 'Energy' },
    'ISP.MI': { name: 'Intesa Sanpaolo', country: '🇮🇹', sector: 'Financial' },
    'RACE.MI': { name: 'Ferrari', country: '🇮🇹', sector: 'Automotive' },
    'FTSEMIB.MI': { name: 'FTSE MIB', country: '🇮🇹', sector: 'Index' },
    // Brazil
    'PETR4.SA': { name: 'Petrobras', country: '🇧🇷', sector: 'Energy' },
    'VALE3.SA': { name: 'Vale', country: '🇧🇷', sector: 'Mining' },
    'ITUB4.SA': { name: 'Itaú Unibanco', country: '🇧🇷', sector: 'Financial' },
    'ABEV3.SA': { name: 'Ambev', country: '🇧🇷', sector: 'Consumer' },
    '^BVSP': { name: 'Bovespa', country: '🇧🇷', sector: 'Index' },
    // Mexico
    'WALMEX.MX': { name: 'Walmart Mexico', country: '🇲🇽', sector: 'Consumer' },
    'FEMSAUBD.MX': { name: 'FEMSA', country: '🇲🇽', sector: 'Consumer' },
    'CEMEXCPO.MX': { name: 'Cemex', country: '🇲🇽', sector: 'Industrial' },
    'GFNORTEO.MX': { name: 'Banorte', country: '🇲🇽', sector: 'Financial' },
    '^MXX': { name: 'IPC Mexico', country: '🇲🇽', sector: 'Index' },
    // South Korea
    '005930.KS': { name: 'Samsung Electronics', country: '🇰🇷', sector: 'Technology' },
    '000660.KS': { name: 'SK Hynix', country: '🇰🇷', sector: 'Technology' },
    '005380.KS': { name: 'Hyundai Motor', country: '🇰🇷', sector: 'Automotive' },
    '035420.KS': { name: 'Naver', country: '🇰🇷', sector: 'Technology' },
    '^KS11': { name: 'KOSPI', country: '🇰🇷', sector: 'Index' },
    // Taiwan
    '2330.TW': { name: 'TSMC', country: '🇹🇼', sector: 'Technology' },
    '2317.TW': { name: 'Hon Hai (Foxconn)', country: '🇹🇼', sector: 'Technology' },
    '2454.TW': { name: 'MediaTek', country: '🇹🇼', sector: 'Technology' },
    '2882.TW': { name: 'Cathay Financial', country: '🇹🇼', sector: 'Financial' },
    '^TWII': { name: 'TAIEX', country: '🇹🇼', sector: 'Index' },
    // Singapore
    'D05.SI': { name: 'DBS Group', country: '🇸🇬', sector: 'Financial' },
    'O39.SI': { name: 'OCBC Bank', country: '🇸🇬', sector: 'Financial' },
    'U11.SI': { name: 'UOB', country: '🇸🇬', sector: 'Financial' },
    'Z74.SI': { name: 'Singtel', country: '🇸🇬', sector: 'Telecom' },
    '^STI': { name: 'STI', country: '🇸🇬', sector: 'Index' }
};

// Market category detection
const getMarketCategory = (symbol) => {
    if (symbol.endsWith('.SR') || SAUDI_STOCKS.includes(symbol)) return 'SA';
    if (symbol.endsWith('.CA') || symbol === '^CASE30' || EGYPT_STOCKS.includes(symbol)) return 'EG';
    if (symbol.endsWith('.NS') || symbol === '^NSEI' || INDIA_STOCKS.includes(symbol)) return 'IN';
    if (symbol.endsWith('.L') || symbol === '^FTSE' || UK_STOCKS.includes(symbol)) return 'UK';
    if (symbol.endsWith('.TO') || symbol === '^GSPTSE' || CANADA_STOCKS.includes(symbol)) return 'CA';
    if (symbol.endsWith('.AX') || symbol === '^AXJO' || AUSTRALIA_STOCKS.includes(symbol)) return 'AU';
    if (symbol.endsWith('.HK') || symbol === '^HSI' || HONGKONG_STOCKS.includes(symbol)) return 'HK';
    if (symbol.endsWith('.DE') || symbol === '^GDAXI' || GERMANY_STOCKS.includes(symbol)) return 'DE';
    if (symbol.endsWith('.T') || symbol === '^N225' || JAPAN_STOCKS.includes(symbol)) return 'JP';
    if (symbol.endsWith('.AE') || symbol.endsWith('.DU') || symbol === '^ADI' || UAE_STOCKS.includes(symbol)) return 'AE';
    if (symbol.endsWith('.JO') || symbol === '^J203' || SOUTHAFRICA_STOCKS.includes(symbol)) return 'ZA';
    if (symbol.endsWith('.QA') || symbol === '^QSI' || QATAR_STOCKS.includes(symbol)) return 'QA';
    // Phase 2 Tier 1 Markets
    if (symbol.endsWith('.PA') || symbol === '^FCHI' || FRANCE_STOCKS.includes(symbol)) return 'FR';
    if (symbol.endsWith('.SW') || symbol === '^SSMI' || SWITZERLAND_STOCKS.includes(symbol)) return 'CH';
    if (symbol.endsWith('.AS') || symbol === '^AEX' || NETHERLANDS_STOCKS.includes(symbol)) return 'NL';
    if (symbol.endsWith('.MC') || symbol === '^IBEX' || SPAIN_STOCKS.includes(symbol)) return 'ES';
    if (symbol.endsWith('.MI') || ITALY_STOCKS.includes(symbol)) return 'IT';
    if (symbol.endsWith('.SA') || symbol === '^BVSP' || BRAZIL_STOCKS.includes(symbol)) return 'BR';
    if (symbol.endsWith('.MX') || symbol === '^MXX' || MEXICO_STOCKS.includes(symbol)) return 'MX';
    if (symbol.endsWith('.KS') || symbol === '^KS11' || KOREA_STOCKS.includes(symbol)) return 'KR';
    if (symbol.endsWith('.TW') || symbol === '^TWII' || TAIWAN_STOCKS.includes(symbol)) return 'TW';
    if (symbol.endsWith('.SI') || symbol === '^STI' || SINGAPORE_STOCKS.includes(symbol)) return 'SG';
    return 'US';
};

const getCountryFlag = (category) => {
    const flags = {
        'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧',
        'CA': '🇨🇦', 'AU': '🇦🇺', 'HK': '🇭🇰', 'DE': '🇩🇪', 'JP': '🇯🇵',
        'AE': '🇦🇪', 'ZA': '🇿🇦', 'QA': '🇶🇦', 'Global': '🌍',
        // Phase 2 Tier 1
        'FR': '🇫🇷', 'CH': '🇨🇭', 'NL': '🇳🇱', 'ES': '🇪🇸', 'IT': '🇮🇹',
        'BR': '🇧🇷', 'MX': '🇲🇽', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬'
    };
    return flags[category] || '🌍';
};

const mapStockData = (quote) => {
    if (!quote || !quote.symbol) return null;

    const symbol = quote.symbol;
    const category = getMarketCategory(symbol);
    const meta = STOCK_META[symbol] || {};

    const price = quote.regularMarketPrice || quote.regularMarketOpen || quote.previousClose || 0;
    const prevClose = quote.regularMarketPreviousClose || quote.previousClose || price;

    let change = quote.regularMarketChange;
    let changePercent = quote.regularMarketChangePercent;

    if ((change === undefined || change === 0) && prevClose > 0 && price > 0) {
        change = price - prevClose;
        changePercent = (change / prevClose) * 100;
    }

    return {
        symbol: symbol,
        name: meta.name || quote.shortName || quote.longName || symbol,
        category: category,
        country: meta.country || getCountryFlag(category),
        sector: meta.sector || quote.sector || null,
        logo: getLogoUrl(symbol),
        price: price,
        regularMarketPrice: price,
        change: change || 0,
        regularMarketChange: change || 0,
        changePercent: changePercent || 0,
        regularMarketChangePercent: changePercent || 0,
        prevClose: prevClose,
        volume: quote.regularMarketVolume || quote.averageDailyVolume3Month || 0,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.trailingAnnualDividendYield,
        lastUpdated: new Date().toISOString()
    };
};

// Market to ticker list mapping
const MARKET_STOCKS = {
    'SA': SAUDI_STOCKS,
    'EG': EGYPT_STOCKS,
    'US': US_STOCKS,
    'Global': US_STOCKS,  // Legacy support
    'IN': INDIA_STOCKS,
    'UK': UK_STOCKS,
    'CA': CANADA_STOCKS,
    'AU': AUSTRALIA_STOCKS,
    'HK': HONGKONG_STOCKS,
    'DE': GERMANY_STOCKS,
    'JP': JAPAN_STOCKS,
    'AE': UAE_STOCKS,
    'ZA': SOUTHAFRICA_STOCKS,
    'QA': QATAR_STOCKS,
    // Phase 2 Tier 1 Markets
    'FR': FRANCE_STOCKS,
    'CH': SWITZERLAND_STOCKS,
    'NL': NETHERLANDS_STOCKS,
    'ES': SPAIN_STOCKS,
    'IT': ITALY_STOCKS,
    'BR': BRAZIL_STOCKS,
    'MX': MEXICO_STOCKS,
    'KR': KOREA_STOCKS,
    'TW': TAIWAN_STOCKS,
    'SG': SINGAPORE_STOCKS
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (typeof yahooFinance.suppressNotices === 'function') {
            yahooFinance.suppressNotices(['yahooSurvey', 'nonsensical', 'deprecated']);
        }

        const { market } = req.query;

        // Get ticker list for the requested market
        let allTickers = MARKET_STOCKS[market];

        // If market not found, return US stocks as default
        if (!allTickers) {
            console.log(`Unknown market: ${market}, defaulting to US`);
            allTickers = US_STOCKS;
        }

        console.log(`Fetching ${market || 'default'} market: ${allTickers.length} tickers`);

        // Process in smaller chunks with RETRY logic
        const chunkSize = 5;
        const results = [];

        for (let i = 0; i < allTickers.length; i += chunkSize) {
            const chunk = allTickers.slice(i, i + chunkSize);

            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const chunkResult = await Promise.race([
                        yahooFinance.quote(chunk),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
                    ]);

                    if (Array.isArray(chunkResult)) {
                        results.push(...chunkResult);
                    } else if (chunkResult) {
                        results.push(chunkResult);
                    }
                    break;
                } catch (err) {
                    console.error(`Batch ${i} attempt ${attempt} failed:`, err.message);
                    if (attempt < 2) {
                        await new Promise(r => setTimeout(r, 300));
                    }
                }
            }

            if (i + chunkSize < allTickers.length) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        const data = results.map(mapStockData).filter(item => item !== null);

        if (data.length === 0) {
            console.error('No stock data fetched - all requests failed');
            return res.status(200).json([]);
        }

        res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=10');
        res.status(200).json(data);
    } catch (e) {
        console.error("Stocks API Error:", e);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
}
