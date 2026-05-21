import sys
import os
import time

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

import ingest_master

def run_sa_only():
    print("🚀 Triggering Quick Pump for Saudi Market...")
    # Override mapping to just SA
    ingest_master.MARKET_MAPPING = {'SA': ingest_master.SAUDI_STOCKS}
    ingest_master.main()

if __name__ == "__main__":
    run_sa_only()
