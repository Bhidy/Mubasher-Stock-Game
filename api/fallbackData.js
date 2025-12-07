export const FALLBACK_STOCKS = [
    // Saudi
    { symbol: '2222.SR', regularMarketPrice: 27.25, regularMarketChange: -0.05, regularMarketChangePercent: -0.18, name: 'Aramco', regularMarketVolume: 5432000, marketCap: 7100000000000, trailingPE: 15.4, trailingAnnualDividendYield: 0.045, sector: 'Energy' },
    { symbol: '1120.SR', regularMarketPrice: 88.40, regularMarketChange: 1.20, regularMarketChangePercent: 1.38, name: 'Al Rajhi', regularMarketVolume: 1250000, marketCap: 350000000000, trailingPE: 18.2, trailingAnnualDividendYield: 0.032, sector: 'Financials' },
    { symbol: '2010.SR', regularMarketPrice: 72.50, regularMarketChange: -0.80, regularMarketChangePercent: -1.09, name: 'SABIC', regularMarketVolume: 980000, marketCap: 217000000000, trailingPE: 22.1, trailingAnnualDividendYield: 0.041, sector: 'Materials' },
    { symbol: '7010.SR', regularMarketPrice: 39.85, regularMarketChange: -0.15, regularMarketChangePercent: -0.37, name: 'STC', regularMarketVolume: 2100000, marketCap: 199000000000, trailingPE: 14.8, trailingAnnualDividendYield: 0.048, sector: 'Communication' },
    { symbol: '1180.SR', regularMarketPrice: 34.65, regularMarketChange: 0.45, regularMarketChangePercent: 1.31, name: 'SNB', regularMarketVolume: 3400000, marketCap: 205000000000, trailingPE: 13.5, trailingAnnualDividendYield: 0.052, sector: 'Financials' },
    { symbol: '1150.SR', regularMarketPrice: 24.32, regularMarketChange: 0.10, regularMarketChangePercent: 0.41, name: 'Alinma', regularMarketVolume: 4500000, marketCap: 60000000000, trailingPE: 16.0, trailingAnnualDividendYield: 0.035, sector: 'Financials' },
    { symbol: '^TASI.SR', regularMarketPrice: 11850.25, regularMarketChange: 45.10, regularMarketChangePercent: 0.38, name: 'TASI', regularMarketVolume: 150000000, marketCap: 0, trailingPE: 0, trailingAnnualDividendYield: 0, sector: 'Index' },

    // Egypt
    { symbol: 'COMI.CA', regularMarketPrice: 85.50, regularMarketChange: 1.20, regularMarketChangePercent: 1.42, name: 'CIB', regularMarketVolume: 3200000, marketCap: 180000000000, trailingPE: 9.5, trailingAnnualDividendYield: 0.00, sector: 'Financials' },
    { symbol: 'EAST.CA', regularMarketPrice: 24.10, regularMarketChange: -0.50, regularMarketChangePercent: -2.03, name: 'Eastern Co', regularMarketVolume: 5120000, marketCap: 50000000000, trailingPE: 8.2, trailingAnnualDividendYield: 0.12, sector: 'Consumer' },
    { symbol: 'HRHO.CA', regularMarketPrice: 18.20, regularMarketChange: 0.30, regularMarketChangePercent: 1.67, name: 'EFG Hermes', regularMarketVolume: 2100000, marketCap: 20000000000, trailingPE: 11.0, trailingAnnualDividendYield: 0.05, sector: 'Financials' },
    { symbol: 'TMGH.CA', regularMarketPrice: 55.40, regularMarketChange: 2.10, regularMarketChangePercent: 3.94, name: 'Talaat Moustafa', regularMarketVolume: 1800000, marketCap: 65000000000, trailingPE: 14.2, trailingAnnualDividendYield: 0.015, sector: 'Real Estate' },
    { symbol: 'CASE30.CA', regularMarketPrice: 26500.20, regularMarketChange: 120.50, regularMarketChangePercent: 0.45, name: 'EGX 30', regularMarketVolume: 0, marketCap: 0, trailingPE: 0, trailingAnnualDividendYield: 0, sector: 'Index' },
    { symbol: '^EGX30.CA', regularMarketPrice: 26500.20, regularMarketChange: 120.50, regularMarketChangePercent: 0.45, name: 'EGX 30', regularMarketVolume: 0, marketCap: 0, trailingPE: 0, trailingAnnualDividendYield: 0, sector: 'Index' },

    // Global
    { symbol: '^GSPC', regularMarketPrice: 5670.40, regularMarketChange: 13.28, regularMarketChangePercent: 0.23, name: 'S&P 500', regularMarketVolume: 0, marketCap: 0, trailingPE: 24.5, trailingAnnualDividendYield: 0, sector: 'Index' },
    { symbol: '^DJI', regularMarketPrice: 42954.99, regularMarketChange: -120.40, regularMarketChangePercent: -0.28, name: 'Dow Jones', regularMarketVolume: 0, marketCap: 0, trailingPE: 22.0, trailingAnnualDividendYield: 0, sector: 'Index' },
    { symbol: '^IXIC', regularMarketPrice: 18450.20, regularMarketChange: 80.50, regularMarketChangePercent: 0.44, name: 'Nasdaq', regularMarketVolume: 0, marketCap: 0, trailingPE: 30.1, trailingAnnualDividendYield: 0, sector: 'Index' },
    { symbol: 'AAPL', regularMarketPrice: 228.40, regularMarketChange: 1.50, regularMarketChangePercent: 0.66, name: 'Apple', regularMarketVolume: 45000000, marketCap: 3400000000000, trailingPE: 32.5, trailingAnnualDividendYield: 0.005, sector: 'Technology' },
    { symbol: 'MSFT', regularMarketPrice: 445.20, regularMarketChange: -2.10, regularMarketChangePercent: -0.47, name: 'Microsoft', regularMarketVolume: 18000000, marketCap: 3100000000000, trailingPE: 35.2, trailingAnnualDividendYield: 0.007, sector: 'Technology' },
    { symbol: 'NVDA', regularMarketPrice: 138.50, regularMarketChange: 4.20, regularMarketChangePercent: 3.12, name: 'NVIDIA', regularMarketVolume: 250000000, marketCap: 3000000000000, trailingPE: 60.5, trailingAnnualDividendYield: 0.0003, sector: 'Technology' },
    { symbol: 'TSLA', regularMarketPrice: 245.80, regularMarketChange: -5.40, regularMarketChangePercent: -2.15, name: 'Tesla', regularMarketVolume: 89000000, marketCap: 780000000000, trailingPE: 75.0, trailingAnnualDividendYield: 0, sector: 'Consumer' }
];
