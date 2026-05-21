import sys
import os
import json
import pandas as pd
from datetime import datetime

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

import ingest_master

def test_single_stock_ingestion():
    symbol = "7010.SR" # STC (Saudi Telecom) - likely to have good data
    print(f"🧪 Testing ingestion for {symbol}...")
    
    # Run fetch just for this stock
    # We can invoke fetch_market_data directly
    results = ingest_master.fetch_market_data('SA', [symbol])
    
    print(f"✅ Fetch complete. Results: {len(results)}")
    
    # Check Profile Data
    profile_path = f"public/data/profiles/{symbol}.json"
    if not os.path.exists(profile_path):
        print("❌ Profile file not created!")
        return
        
    with open(profile_path, 'r') as f:
        data = json.load(f)
        
    print("\n📊 Profile Data Check:")
    keys_to_check = [
        "sharesOutstanding", "floatShares", "sharesShort", 
        "fiftyDayAverage", "twoHundredDayAverage", 
        "totalRevenue", "operatingCashflow", "returnOnEquity",
        "recommendationMean"
    ]
    
    missing = []
    for k in keys_to_check:
        val = data.get(k)
        print(f"   - {k}: {val}")
        if val is None: missing.append(k)
        
    # Check Chart Data
    chart_path = f"public/data/charts/{symbol}.json"
    if not os.path.exists(chart_path):
        print("❌ Chart file not created!")
        return
        
    with open(chart_path, 'r') as f:
        chart_json = json.load(f)
        
    print("\n📈 Chart Data Check:")
    if "quotes" in chart_json:
        print(f"   ✅ 'quotes' key found. Count: {len(chart_json['quotes'])}")
        if len(chart_json['quotes']) > 0:
            print(f"   - Sample: {chart_json['quotes'][0]}")
    else:
        print("   ❌ 'quotes' key MISSING in chart JSON!")

if __name__ == "__main__":
    test_single_stock_ingestion()
