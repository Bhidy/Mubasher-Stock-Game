-- Migration: Add Chart and Profile Caching

-- 1. Fix Categories for major US stocks (if they exist as null)
UPDATE stocks SET category = 'US' WHERE ticker IN ('AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC') AND category IS NULL;
UPDATE stocks SET category = 'SA' WHERE ticker LIKE '%.SR' AND category IS NULL;
UPDATE stocks SET category = 'EG' WHERE ticker LIKE '%.CA' AND category IS NULL;

-- 2. Chart Cache Table
CREATE TABLE IF NOT EXISTS chart_cache (
    symbol VARCHAR(20) NOT NULL,
    range VARCHAR(10) NOT NULL, -- 1d, 5d, 1mo, etc.
    interval VARCHAR(10) NOT NULL, -- 5m, 1h, 1d
    data JSONB NOT NULL,        -- The full 'quotes' array
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (symbol, range, interval)
);

-- 3. Profile Cache Table
CREATE TABLE IF NOT EXISTS profile_cache (
    symbol VARCHAR(20) PRIMARY KEY,
    data JSONB NOT NULL,        -- The full profile object
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for speed
CREATE INDEX IF NOT EXISTS idx_stocks_ticker ON stocks(ticker);
