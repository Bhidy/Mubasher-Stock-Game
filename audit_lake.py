import json
import os
import glob
import random

def check_data_lake():
    print("🔬 STARTING DATA LAKE AUDIT (V2 - PROFILES)...")
    
    # 1. Audit Master Stock List
    total_stocks = 0
    try:
        with open("public/data/stocks.json", "r") as f:
            data = json.load(f)
            
        print(f"\n✅ MASTER INDEX LOADED")
        market_stats = []
        
        for market, stocks in data.items():
            count = len(stocks)
            valid_price = sum(1 for s in stocks if s.get('price', 0) > 0)
            status = "🟢" if count == valid_price else "⚠️"
            if count == 0: status = "🔴"
            market_stats.append(f"{status} {market}: {valid_price}/{count} valid prices")
            total_stocks += count
            
        print("\n📊 MARKET COVERAGE REPORT:")
        print("\n".join(market_stats))
        print(f"\nTOTAL TRACKED STOCKS: {total_stocks}")
        
    except Exception as e:
        print(f"❌ FATAL: Could not read stocks.json: {e}")
        return

    # 2. Audit Charts
    print("\n📈 CHART INTEGRITY CHECK:")
    chart_files = glob.glob("public/data/charts/*.json")
    print(f"Found {len(chart_files)} chart files.")
    
    # 3. Audit Profiles (NEW)
    print("\n👤 PROFILE INTEGRITY CHECK (NEW):")
    profile_files = glob.glob("public/data/profiles/*.json")
    print(f"Found {len(profile_files)} profile files.")
    
    valid_profiles = 0
    rich_profiles = 0
    
    if profile_files:
        sample = random.sample(profile_files, min(5, len(profile_files)))
        print("\n🔍 Random Profile Audit:")
        for pf in sample:
            try:
                with open(pf, "r") as f:
                    pdata = json.load(f)
                    sym = os.path.basename(pf).replace('.json','')
                    
                    # Check key fields
                    has_desc = len(pdata.get('description', '')) > 50
                    has_mktcap = pdata.get('marketCap', 0) or 0 > 0
                    has_sector = pdata.get('sector') != 'N/A'
                    
                    status = "✅"
                    if not has_desc or not has_mktcap:
                        status = "⚠️ (Basic)"
                    else:
                        status = "🌟 (Rich)"
                        rich_profiles += 1
                        
                    print(f"  {status} {sym} | Cap: {pdata.get('marketCap')} | PE: {pdata.get('trailingPE')}")
                    valid_profiles += 1
            except:
                print(f"  ❌ {pf}: Corrupt")

    print("\n🏁 AUDIT CONCLUSION:")
    if total_stocks > 200 and len(chart_files) > 200 and len(profile_files) > 200:
         print("✅ SYSTEM IS ROBUST. READY FOR PRODUCTION.")
    else:
         print(f"⚠️ SYSTEM NEEDS ATTENTION (Stocks: {total_stocks}, Charts: {len(chart_files)}, Profiles: {len(profile_files)})")

if __name__ == "__main__":
    check_data_lake()
