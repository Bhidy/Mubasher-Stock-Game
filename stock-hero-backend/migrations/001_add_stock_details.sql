-- Migration: Add detailed stock data columns
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS volume BIGINT;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS market_cap BIGINT;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS pe_ratio DECIMAL(10, 2);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS dividend_yield DECIMAL(5, 2);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS fifty_two_week_high DECIMAL(10, 2);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS fifty_two_week_low DECIMAL(10, 2);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS previous_close DECIMAL(10, 2);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS country VARCHAR(10);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS currency VARCHAR(10);
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS last_updated_ts TIMESTAMP DEFAULT NOW();

-- Create index for faster category/market lookups if we add a market column or reuse sector/category
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS category VARCHAR(10); -- To store 'SA', 'US', etc.
CREATE INDEX IF NOT EXISTS idx_stocks_category ON stocks(category);
