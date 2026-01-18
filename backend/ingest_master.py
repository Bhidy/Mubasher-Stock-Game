import yfinance as yf
import json
import time
import os
import random
from datetime import datetime

# ==========================================
# 1. MARKET CATALOG
# ==========================================

SAUDI_STOCKS = [
    '2222.SR', '1120.SR', '2010.SR', '7010.SR', '2082.SR', '1180.SR',
    '2380.SR', '4030.SR', '2350.SR', '4200.SR', '1211.SR', '4001.SR',
    '2310.SR', '4003.SR', '2050.SR', '1150.SR', '4190.SR', '2290.SR',
    '4002.SR', '1010.SR', '2020.SR', '2280.SR', '5110.SR', '1140.SR',
    '1060.SR', '7200.SR', '4220.SR', '4090.SR', '4040.SR', '^TASI.SR'
]

EGYPT_STOCKS = [
    'COMI.CA', 'EAST.CA', 'HRHO.CA', 'TMGH.CA', 'SWDY.CA', 'ETEL.CA',
    'AMOC.CA', 'EKHO.CA', 'HELI.CA', 'ORAS.CA', 'ESRS.CA', 'ABUK.CA',
    'MFPC.CA', 'ISPH.CA', 'PHDC.CA', 'AUTO.CA', 'CIEB.CA', 'FWRY.CA',
    'ADIB.CA', '^CASE30'
]

US_STOCKS = [
    '^GSPC', '^DJI', '^IXIC',
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
    'JPM', 'V', 'MA', 'WMT', 'HD', 'PG', 'KO', 'PEP', 'DIS', 'NKE', 'BRK-B', 'LLY'
]

# Standard Arrays for other markets (Trimming for brevity in this view, effectively same as before)
INDIA_STOCKS = ['^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'LICI.NS']
UK_STOCKS = ['^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'DGE.L', 'RIO.L', 'GSK.L', 'GLEN.L']
GERMANY_STOCKS = ['^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE', 'VOW3.DE', 'BAS.DE', 'ADS.DE']
FRANCE_STOCKS = ['^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA', 'SU.PA', 'EL.PA', 'KER.PA']
JAPAN_STOCKS = ['^N225', '7203.T', '6758.T', '9984.T', '6861.T', '8306.T', '9432.T', '7974.T', '6098.T', '4063.T']
CANADA_STOCKS = ['^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO', 'BMO.TO', 'BNS.TO', 'TRP.TO']
AUSTRALIA_STOCKS = ['^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'FMG.AX', 'WDS.AX', 'TLS.AX']
HK_STOCKS = ['^HSI', '0700.HK', '09988.HK', '0939.HK', '01299.HK', '0941.HK', '03690.HK', '00005.HK', '00388.HK']
SWISS_STOCKS = ['^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW', 'CFR.SW', 'ZURN.SW', 'LONN.SW']
NETHERLANDS_STOCKS = ['^AEX', 'ASML.AS', 'UNA.AS', 'SHELL.AS', 'HEIA.AS', 'INGA.AS', 'PHIA.AS', 'ADYEN.AS', 'DSM.AS']
SPAIN_STOCKS = ['^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC', 'REP.MC', 'CLNX.MC']
ITALY_STOCKS = ['FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'ENI.MI', 'UCG.MI', 'RACE.MI', 'G.MI', 'MB.MI']
BRAZIL_STOCKS = ['^BVSP', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA', 'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA']
MEXICO_STOCKS = ['^MXX', 'WALMEX.MX', 'AMXL.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'BIMBOA.MX', 'CEMEXCPO.MX', 'TLEVISACPO.MX']
KOREA_STOCKS = ['^KS11', '005930.KS', '000660.KS', '005380.KS', '207940.KS', '051910.KS', '005490.KS']
TAIWAN_STOCKS = ['^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2881.TW']
SINGAPORE_STOCKS = ['^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C52.SI']
UAE_STOCKS = ['EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AD', 'DIB.AE', 'ENBD.AE', 'TAQA.AD']
SOUTH_AFRICA_STOCKS = ['JSE.JO', 'NPN.JO', 'FSR.JO', 'SBK.JO', 'ABG.JO', 'SOL.JO', 'MTN.JO']
QATAR_STOCKS = ['QNBK.QA', 'IQCD.QA', 'QIBK.QA', 'CBQK.QA', 'MARK.QA']

MARKET_MAPPING = {
    'SA': SAUDI_STOCKS, 'EG': EGYPT_STOCKS, 'US': US_STOCKS, 'Global': US_STOCKS,
    'IN': INDIA_STOCKS, 'UK': UK_STOCKS, 'DE': GERMANY_STOCKS, 'FR': FRANCE_STOCKS,
    'JP': JAPAN_STOCKS, 'CA': CANADA_STOCKS, 'AU': AUSTRALIA_STOCKS, 'HK': HK_STOCKS,
    'CH': SWISS_STOCKS, 'NL': NETHERLANDS_STOCKS, 'ES': SPAIN_STOCKS, 'IT': ITALY_STOCKS,
    'BR': BRAZIL_STOCKS, 'MX': MEXICO_STOCKS, 'KR': KOREA_STOCKS, 'TW': TAIWAN_STOCKS,
    'SG': SINGAPORE_STOCKS, 'AE': UAE_STOCKS, 'ZA': SOUTH_AFRICA_STOCKS, 'QA': QATAR_STOCKS
}

COUNTRY_FLAGS = {
    'SA': '🇸🇦', 'EG': '🇪🇬', 'US': '🇺🇸', 'IN': '🇮🇳', 'UK': '🇬🇧',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'CA': '🇨🇦', 'AU': '🇦🇺',
    'HK': '🇭🇰', 'CH': '🇨🇭', 'NL': '🇳🇱', 'ES': '🇪🇸', 'IT': '🇮🇹',
    'BR': '🇧🇷', 'MX': '🇲🇽', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬',
    'AE': '🇦🇪', 'ZA': '🇿🇦', 'QA': '🇶🇦'
}

# ==========================================
# 2. INGESTION ENGINE
# ==========================================

def get_country_flag(market_code):
    return COUNTRY_FLAGS.get(market_code, '🌍')

def clean_data(data):
    if isinstance(data, dict):
        return {k: clean_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_data(v) for v in data]
    elif isinstance(data, float):
        if data != data: return 0.0
        if data == float('inf') or data == float('-inf'): return 0.0
        return data
    return data

def save_chart_data(symbol, prices_df):
    """Save Chart Data (1Y) to individual JSON file"""
    try:
        # Format: [{ date: "2024-01-01", price: 100.5 }, ...]
        # Yahoo DF index is Date
        chart_data = []
        for index, row in prices_df.iterrows():
            chart_data.append({
                "date": index.strftime('%Y-%m-%d'),
                "price": row['Close'] if not row['Close'] != row['Close'] else row['Open'] or 0
            })
        
        # Ensure charts directory
        chart_dir = "public/data/charts"
        os.makedirs(chart_dir, exist_ok=True)
        
        # Save File (Sanitize symbol for filename)
        safe_symbol = symbol.replace('^', '')
        with open(f"{chart_dir}/{safe_symbol}.json", "w") as f:
            json.dump(clean_data(chart_data), f)
            
    except Exception as e:
        print(f"⚠️ Failed to save chart for {symbol}: {e}")

def fetch_market_data(market_code, tickers):
    print(f"📡 {market_code}: Processing {len(tickers)} stocks...")
    
    BATCH_SIZE = 8
    market_results = []
    
    unique_tickers = list(set(tickers)) # Deduplicate
    
    for i in range(0, len(unique_tickers), BATCH_SIZE):
        batch = unique_tickers[i:i+BATCH_SIZE]
        
        try:
            # 1. DOWNLOAD PRICE HISTORY (Last 365 Days)
            # We download history to get the latest close AND generate the chart
            data_batch = yf.download(batch, period="1y", interval="1d", group_by='ticker', threads=True, progress=False)
            
            # 2. Process each symbol
            for symbol in batch:
                try:
                    # Handle yfinance structure (MultiIndex if multiple, single DF if one)
                    if len(batch) > 1:
                        try:
                            df = data_batch[symbol]
                        except KeyError:
                            continue # Failed download
                    else:
                        df = data_batch
                    
                    if df.empty: continue
                    
                    # Extract Latest Data (Last Row)
                    latest = df.iloc[-1]
                    prev = df.iloc[-2] if len(df) > 1 else latest
                    
                    price = latest['Close']
                    prev_close = prev['Close']
                    open_price = latest['Open']
                    high = latest['High']
                    low = latest['Low']
                    volume = latest['Volume']
                    
                    change = price - prev_close
                    change_percent = (change / prev_close) * 100 if prev_close > 0 else 0
                    
                    # Clean Symbol
                    clean_symbol = symbol
                    if symbol == 'CASE30.CA': clean_symbol = '^CASE30'
                    
                    # Construct Stock Object
                    stock_data = {
                        "symbol": clean_symbol,
                        "name": clean_symbol, # Shortname hard to get from bulk download efficiently, fallback to symbol
                        "category": market_code,
                        "country": get_country_flag(market_code),
                        "sector": 'General',
                        "logo": f"https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://{clean_symbol.split('.')[0].lower()}.com&size=128",
                        
                        "price": price,
                        "change": change,
                        "changePercent": change_percent,
                        "prevClose": prev_close,
                        "high": high,
                        "low": low,
                        "open": open_price,
                        "volume": volume,
                        
                        "lastUpdated": datetime.utcnow().isoformat() + "Z"
                    }
                    
                    # Try to get better metadata (name/sector) individually?
                    # Too slow. We stick to price data for bulk updates.
                    # Or use Ticker info carefully.
                    
                    market_results.append(stock_data)
                    
                    # SAVE CHART DATA
                    save_chart_data(clean_symbol, df)
                    
                except Exception as inner_e:
                   # print(f"Skipped {symbol}: {inner_e}")
                   pass
            
            time.sleep(1) # Polite delay
            
        except Exception as e:
            print(f"Batch Error: {e}")

    return market_results

def main():
    start_time = time.time()
    all_data = {}
    
    print("🚀 Starting Data & Chart Pump...")
    
    # Process all markets
    for code, tickers in MARKET_MAPPING.items():
        # Optimization: Don't re-fetch Global if we fetched US
        if code == 'Global' and 'US' in all_data:
            all_data['Global'] = all_data['US'] # Logic: US stocks are Global
            continue
            
        data = fetch_market_data(code, tickers)
        all_data[code] = clean_data(data)
        print(f"✅ {code}: Processed {len(data)} stocks.")
    
    # Ensure Public Data Directory Exists
    output_dir = "public/data"
    os.makedirs(output_dir, exist_ok=True)
    
    # Save Master JSON
    output_file = os.path.join(output_dir, "stocks.json")
    with open(output_file, "w", encoding='utf-8') as f:
        json.dump(all_data, f, indent=None, ensure_ascii=False)
        
    print(f"\n🎉 PUMP COMPLETE in {time.time() - start_time:.2f}s")

if __name__ == "__main__":
    main()
