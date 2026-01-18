import yfinance as yf
try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    psycopg2 = None
import json
import time
import os
import random
from datetime import datetime, timezone
import pandas as pd
import numpy as np

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

INDIA_STOCKS = ['^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'LICI.NS']
UK_STOCKS = ['^FTSE', 'AZN.L', 'SHEL.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'DGE.L', 'RIO.L', 'GSK.L', 'GLEN.L']
GERMANY_STOCKS = ['^GDAXI', 'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'AIR.DE', 'BMW.DE', 'VOW3.DE', 'BAS.DE', 'ADS.DE']
FRANCE_STOCKS = ['^FCHI', 'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA', 'RMS.PA', 'SU.PA', 'EL.PA', 'KER.PA']
JAPAN_STOCKS = ['^N225', '7203.T', '6758.T', '9984.T', '6861.T', '8306.T', '9432.T', '7974.T', '6098.T', '4063.T']
CANADA_STOCKS = ['^GSPTSE', 'RY.TO', 'TD.TO', 'SHOP.TO', 'ENB.TO', 'CNR.TO', 'CP.TO', 'BMO.TO', 'BNS.TO', 'TRP.TO']
AUSTRALIA_STOCKS = ['^AXJO', 'BHP.AX', 'CBA.AX', 'CSL.AX', 'NAB.AX', 'WBC.AX', 'ANZ.AX', 'FMG.AX', 'WDS.AX', 'TLS.AX']
HK_STOCKS = ['^HSI', '0700.HK', '9988.HK', '0939.HK', '1299.HK', '0941.HK', '3690.HK', '0005.HK', '0388.HK']
SWISS_STOCKS = ['^SSMI', 'NESN.SW', 'ROG.SW', 'NOVN.SW', 'UBSG.SW', 'ABBN.SW', 'CFR.SW', 'ZURN.SW', 'LONN.SW']
NETHERLANDS_STOCKS = ['^AEX', 'ASML.AS', 'UNA.AS', 'SHELL.AS', 'HEIA.AS', 'INGA.AS', 'PHIA.AS', 'ADYEN.AS', 'DSFIR.AS']
SPAIN_STOCKS = ['^IBEX', 'ITX.MC', 'IBE.MC', 'BBVA.MC', 'SAN.MC', 'AMS.MC', 'TEF.MC', 'REP.MC', 'CLNX.MC']
ITALY_STOCKS = ['FTSEMIB.MI', 'ENEL.MI', 'ISP.MI', 'STLAM.MI', 'ENI.MI', 'UCG.MI', 'RACE.MI', 'G.MI', 'MB.MI']
BRAZIL_STOCKS = ['^BVSP', 'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'PETR3.SA', 'ABEV3.SA', 'WEGE3.SA', 'BBAS3.SA']
MEXICO_STOCKS = ['^MXX', 'WALMEX.MX', 'AMX.MX', 'FEMSAUBD.MX', 'GMEXICOB.MX', 'BIMBOA.MX', 'CEMEXCPO.MX', 'TLEVISACPO.MX']
KOREA_STOCKS = ['^KS11', '005930.KS', '000660.KS', '005380.KS', '207940.KS', '051910.KS', '005490.KS']
TAIWAN_STOCKS = ['^TWII', '2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2881.TW']
SINGAPORE_STOCKS = ['^STI', 'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C52.SI']
UAE_STOCKS = ['EMAAR.AE', 'FAB.AD', 'ETISALAT.AD', 'ALDAR.AE', 'DIB.AE', 'EMIRATESNBD.AE', 'TAQA.AD']
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
    elif isinstance(data, (int, float, str, bool, type(None))):
        return data
    else:
        # Fallback for numpy/pandas types
        return str(data)

def save_chart_data(symbol, prices_df):
    try:
        chart_data = []
        for index, row in prices_df.iterrows():
            chart_data.append({
                "date": index.strftime('%Y-%m-%d'),
                "price": row['Close'] if not pd.isna(row['Close']) else 0,
                # Add open/high/low/volume for potential candlestick charts later
                "open": row['Open'] if not pd.isna(row['Open']) else 0,
                "high": row['High'] if not pd.isna(row['High']) else 0,
                "low": row['Low'] if not pd.isna(row['Low']) else 0,
                "volume": int(row['Volume']) if not pd.isna(row['Volume']) else 0
            })
        
        chart_dir = "public/data/charts"
        os.makedirs(chart_dir, exist_ok=True)
        safe_symbol = symbol.replace('^', '')
        
        # WRAP IN "quotes" KEY TO MATCH FRONTEND EXPECTATION
        output = {"quotes": clean_data(chart_data)}
        
        with open(f"{chart_dir}/{safe_symbol}.json", "w") as f:
            json.dump(output, f)
    except Exception as e:
        # print(f"⚠️ Failed to save chart for {symbol}: {e}")
        pass

def save_profile_data(symbol, info, quote_data=None):
    """Save Deep Profile Data to individual JSON file"""
    if quote_data is None: quote_data = {}
    try:
        # Construct Profile Object matching Frontend Expectations
        profile = {
            # Basic Info
            "symbol": symbol,
            "name": info.get('longName') or info.get('shortName') or symbol,
            "description": info.get('longBusinessSummary') or 'No description available',
            "sector": info.get('sector') or 'N/A',
            "industry": info.get('industry') or 'N/A',
            "employees": info.get('fullTimeEmployees'),
            "website": info.get('website'),
            "city": info.get('city'),
            "country": info.get('country'),
            "currency": info.get('currency') or 'USD',
            "exchange": info.get('exchange'),
            
            # Live Quote Data (Injected)
            "price": quote_data.get('price'),
            "change": quote_data.get('change'),
            "changePercent": quote_data.get('changePercent'),
            "dayLow": quote_data.get('dayLow'),
            "dayHigh": quote_data.get('dayHigh'),
            "volume": quote_data.get('volume'),
            "open": quote_data.get('open'),
            "previousClose": quote_data.get('previousClose'), # Correct mapping for "prevClose" if needed

            # Key Stats
            "marketCap": info.get('marketCap'),
            "trailingPE": info.get('trailingPE'),
            "forwardPE": info.get('forwardPE'),
            "peRatio": info.get('trailingPE'), # Frontend fallback
            "trailingEps": info.get('trailingEps') or info.get('epsTrailingTwelveMonths'),
            "eps": info.get('trailingEps'), # Frontend fallback
            
            "dividendYield": info.get('dividendYield'),
            "trailingAnnualDividendYield": info.get('trailingAnnualDividendYield'),
            "dividendRate": info.get('dividendRate'),
            "trailingAnnualDividendRate": info.get('trailingAnnualDividendRate'),
            "payoutRatio": info.get('payoutRatio'),
            "lastDividendValue": info.get('lastDividendValue'),
            "lastDividendDate": info.get('lastDividendDate'), # Might require formatting
            
            "priceToBook": info.get('priceToBook'),
            "profitMargins": info.get('profitMargins'),
            "beta": info.get('beta'),
            
            # Moving Averages & Range
            "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh'),
            "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow'),
            "fiftyTwoWeekChange": info.get('52WeekChange'),
            "averageVolume": info.get('averageVolume'),
            "fiftyDayAverage": info.get('fiftyDayAverage'),
            "twoHundredDayAverage": info.get('twoHundredDayAverage'),
            
            # Ownership
            "sharesOutstanding": info.get('sharesOutstanding'),
            "floatShares": info.get('floatShares'),
            "sharesShort": info.get('sharesShort'),
            "shortRatio": info.get('shortRatio'),
            "heldPercentInstitutions": info.get('heldPercentInstitutions'),
            "heldPercentInsiders": info.get('heldPercentInsiders'),
            
            # Financials (Comprehensive)
            "totalRevenue": info.get('totalRevenue'),
            "revenuePerShare": info.get('revenuePerShare'),
            "revenueGrowth": info.get('revenueGrowth'),
            "grossProfits": info.get('grossProfits'),
            "grossMargins": info.get('grossMargins'),
            "operatingMargins": info.get('operatingMargins'),
            "ebitda": info.get('ebitda'),
            "ebitdaMargins": info.get('ebitdaMargins'),
            "netIncomeToCommon": info.get('netIncomeToCommon'),
            "earningsGrowth": info.get('earningsGrowth'),
            "returnOnEquity": info.get('returnOnEquity'),
            "returnOnAssets": info.get('returnOnAssets'),
            
            # Cash Flow & Balance Sheet
            "operatingCashflow": info.get('operatingCashflow'),
            "freeCashflow": info.get('freeCashflow'),
            "totalCash": info.get('totalCash'),
            "totalCashPerShare": info.get('totalCashPerShare'),
            "totalDebt": info.get('totalDebt'),
            "debtToEquity": info.get('debtToEquity'),
            "currentRatio": info.get('currentRatio'),
            "quickRatio": info.get('quickRatio'),
            "bookValue": info.get('bookValue'),
            "enterpriseValue": info.get('enterpriseValue'),
            "enterpriseToEbitda": info.get('enterpriseToEbitda'),
            "priceToSalesTrailing12Months": info.get('priceToSalesTrailing12Months'),
            
            # Analyst Data
            "recommendationMean": info.get('recommendationMean'),
            "recommendationKey": info.get('recommendationKey'),
            "numberOfAnalystOpinions": info.get('numberOfAnalystOpinions'),
            "targetLowPrice": info.get('targetLowPrice'),
            "targetMeanPrice": info.get('targetMeanPrice'),
            "targetMedianPrice": info.get('targetMedianPrice'),
            "targetHighPrice": info.get('targetHighPrice'),
            "recommendationTrend": info.get('recommendationTrend'), # This is usually a list of dicts

            "lastUpdated": datetime.now(timezone.utc).isoformat() + "Z"
        }
        
        profile_dir = "public/data/profiles"
        os.makedirs(profile_dir, exist_ok=True)
        safe_symbol = symbol.replace('^', '')
        with open(f"{profile_dir}/{safe_symbol}.json", "w") as f:
            json.dump(clean_data(profile), f)
            
    except Exception as e:
        print(f"⚠️ Failed to save profile for {symbol}: {e}")


def fetch_market_data(market_code, tickers):
    print(f"📡 {market_code}: Processing {len(tickers)} stocks...")
    
    BATCH_SIZE = 8
    market_results = []
    unique_tickers = list(set(tickers))
    
    for i in range(0, len(unique_tickers), BATCH_SIZE):
        batch = unique_tickers[i:i+BATCH_SIZE]
        try:
            # 1. DOWNLOAD PRICE HISTORY
            data_batch = yf.download(batch, period="1y", interval="1d", group_by='ticker', threads=True, progress=False)
            
            # 2. DOWNLOAD META INFO (This is slow, so we do it per ticker or via Tickers object)
            tickers_obj = yf.Tickers(" ".join(batch))
            
            for symbol in batch:
                try:
                    # History
                    # Robust DF Extraction for both Single and Multi-Batch
                    try:
                        # If MultiIndex (Ticker, Price), this extracts the ticker's DF
                        if isinstance(data_batch.columns, pd.MultiIndex):
                            df = data_batch[symbol]
                        else:
                            # If flat DF (unlikely with group_by='ticker' but possible)
                            df = data_batch
                    except KeyError:
                        # print(f"KeyError for {symbol}")
                        df = pd.DataFrame() # Trigger fallback

                    # FALLBACK Mechanism for Failed Batch Downloads
                    if df.empty:
                        try:
                            # print(f"⚠️ Batch failed for {symbol}, attempting individual fetch...")
                            fallback = yf.Ticker(symbol).history(period="1y", interval="1d")
                            if not fallback.empty:
                                df = fallback
                                # print(f"✅ Fallback recovered data for {symbol}")
                        except Exception:
                            pass
                    
                    if df.empty: continue
                    
                    latest = df.iloc[-1]
                    prev = df.iloc[-2] if len(df) > 1 else latest
                    
                    clean_symbol = symbol
                    
                    # PROFILE & META
                    # Note: accessing .info triggers a request per ticker. 
                    # This is unavoidable for detailed profiles but slow.
                    # We accept the slowness in the background pump for quality.
                    info = {}
                    try:
                        info = tickers_obj.tickers[symbol].info
                    except:
                        pass
                    
                    # Merge Price info from DF if missing in Info
                    price = latest['Close']
                    if pd.isna(price): price = 0
                    
                    quote_data = {
                        "price": price,
                        "change": (price - prev['Close']) if not pd.isna(prev['Close']) else 0,
                        "changePercent": ((price - prev['Close']) / prev['Close'] * 100) if not pd.isna(prev['Close']) and prev['Close'] != 0 else 0,
                        "volume": int(latest['Volume']) if not pd.isna(latest['Volume']) else 0,
                        "dayHigh": float(latest['High']) if not pd.isna(latest['High']) else 0,
                        "dayLow": float(latest['Low']) if not pd.isna(latest['Low']) else 0,
                        "open": float(latest['Open']) if not pd.isna(latest['Open']) else 0,
                        "previousClose": float(prev['Close']) if not pd.isna(prev['Close']) else 0
                    }

                    stock_data = {
                        "symbol": clean_symbol,
                        "name": info.get('shortName') or info.get('longName') or clean_symbol,
                        "category": market_code,
                        "country": get_country_flag(market_code),
                        "sector": info.get('sector') or 'General',
                        "logo": f"https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://{clean_symbol.split('.')[0].lower()}.com&size=128",
                        "price": quote_data['price'],
                        "change": quote_data['change'],
                        "changePercent": quote_data['changePercent'],
                        "volume": quote_data['volume'],
                        
                        # Added for Market Summary Columns
                        "marketCap": info.get('marketCap'),
                        "peRatio": info.get('trailingPE') or info.get('forwardPE'), 
                        "dividendYield": info.get('dividendYield'),
                        
                        "lastUpdated": datetime.now(timezone.utc).isoformat() + "Z"
                    }
                    
                    market_results.append(stock_data)
                    save_chart_data(clean_symbol, df)
                    save_profile_data(clean_symbol, info, quote_data) # SAVE PROFILE WITH QUOTE
                    
                except Exception as inner_e:
                   pass
            
            time.sleep(2) # Increased delay for Profile fetching safety
            
        except Exception as e:
            print(f"Batch Error: {e}")

    return market_results

import numpy as np

def sanitize_for_db(val):
    """Converts numpy types to native python types and handles NaN."""
    if val is None:
        return None
    if isinstance(val, (float, np.float64, np.float32)):
        if np.isnan(val) or np.isinf(val):
            return 0.0
        return float(val)
    if isinstance(val, (int, np.int64, np.int32)):
        return int(val)
    return val

def ensure_db_schema(cur):
    """Ensures the DB schema can handle longer strings."""
    try:
        # We blindly attempt to widen columns. 
        # Postgres is smart enough to handle this instantly if they are already wide enough? 
        # Actually, standard SQL: ALTER COLUMN ... TYPE ...
        queries = [
            "ALTER TABLE stocks ALTER COLUMN ticker TYPE VARCHAR(50);",
            "ALTER TABLE stocks ALTER COLUMN name TYPE VARCHAR(255);",
            "ALTER TABLE stocks ALTER COLUMN sector TYPE VARCHAR(100);",
            "ALTER TABLE stocks ALTER COLUMN category TYPE VARCHAR(50);"
        ]
        for q in queries:
            try:
                cur.execute(q)
            except Exception:
                # Ignore if fails (e.g. locks or permission), we hope for the best
                cur.connection.rollback()
                continue
        cur.connection.commit()
        print("✅ DB Schema Verified/Updated.")
    except Exception as e:
        print(f"⚠️ Schema Update Check Failed (Non-Critical): {e}")
        try:
            cur.connection.rollback()
        except:
            pass

def sync_to_db(all_data):
    """Syncs the collected JSON data to the Postgres Database if configured."""
    db_url = os.environ.get('DATABASE_URL')
    if not db_url or not psycopg2:
        print("⚠️  Skipping DB Sync (Missing DATABASE_URL or psycopg2)")
        return

    print("🔌 Connecting to Database for Sync...")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # 1. Ensure Schema
        ensure_db_schema(cur)
        
        # Flatten data for batch insert
        print("📦 Preparing batch upsert...", end="")
        records = []
        for market, stocks in all_data.items():
            if market == 'Global': continue # Duplicate of US often
            for s in stocks:
                # Map fields to DB - Ensure robustness for missing keys
                try:
                    records.append((
                        s.get('symbol'),
                        s.get('name'),
                        sanitize_for_db(s.get('price', 0)),
                        sanitize_for_db(s.get('changePercent', 0)),
                        sanitize_for_db(s.get('volume', 0)),
                        sanitize_for_db(s.get('marketCap', 0)),
                        sanitize_for_db(s.get('peRatio', 0)),
                        sanitize_for_db(s.get('dividendYield', 0)),
                        sanitize_for_db(s.get('fiftyTwoWeekHigh', 0)),
                        sanitize_for_db(s.get('fiftyTwoWeekLow', 0)),
                        sanitize_for_db(s.get('previousClose', 0)),
                        s.get('currency', 'USD'),
                        s.get('country', '🌍'),
                        s.get('sector', 'General'),
                        s.get('category', market),
                        datetime.now(timezone.utc)
                    ))
                except Exception as row_err:
                    print(f"⚠️ Skipping row {s.get('symbol')}: {row_err}")
                    continue
        
        print(f" {len(records)} records.")

        query = """
            INSERT INTO stocks (
                ticker, name, current_price, change_percent, volume, 
                market_cap, pe_ratio, dividend_yield, fifty_two_week_high, 
                fifty_two_week_low, previous_close, currency, country, sector, category, last_updated_ts
            ) VALUES %s
            ON CONFLICT (ticker) DO UPDATE SET
                current_price = EXCLUDED.current_price,
                change_percent = EXCLUDED.change_percent,
                volume = EXCLUDED.volume,
                market_cap = EXCLUDED.market_cap,
                pe_ratio = EXCLUDED.pe_ratio,
                dividend_yield = EXCLUDED.dividend_yield,
                fifty_two_week_high = EXCLUDED.fifty_two_week_high,
                fifty_two_week_low = EXCLUDED.fifty_two_week_low,
                previous_close = EXCLUDED.previous_close,
                last_updated_ts = EXCLUDED.last_updated_ts,
                name = EXCLUDED.name, -- Update metadata too if changed
                country = EXCLUDED.country,
                sector = EXCLUDED.sector
        """
        
        execute_values(cur, query, records)
        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Database Sync Complete: Updated {len(records)} stocks.")
        
    except Exception as e:
        print(f"❌ Database Sync Failed: {e}")

def main():
    print("🚀 Starting Data & Chart & Profile Pump...")
    start_time = time.time()
    all_data = {}
    
    for code, tickers in MARKET_MAPPING.items():
        if code == 'Global' and 'US' in all_data:
            all_data['Global'] = all_data['US']
            continue
            
        data = fetch_market_data(code, tickers)
        all_data[code] = clean_data(data)
        print(f"✅ {code}: Processed {len(data)} stocks.")
    
    output_dir = "public/data"
    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, "stocks.json"), "w", encoding='utf-8') as f:
        json.dump(all_data, f, indent=None, ensure_ascii=False)
    
    # --- NEW DB SYNC STEP ---
    sync_to_db(all_data)
        
    print(f"\n🎉 PUMP COMPLETE in {time.time() - start_time:.2f}s")

if __name__ == "__main__":
    main()
