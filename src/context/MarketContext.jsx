import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

// Complete market configurations for 23 markets
export const MARKETS = [
    // === CURRENT MARKETS ===
    { id: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', suffix: '.SR', index: '^TASI.SR', exchange: 'Tadawul', timezone: 'Asia/Riyadh' },
    { id: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', suffix: '.CA', index: '^CASE30', exchange: 'EGX', timezone: 'Africa/Cairo' },
    { id: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', suffix: '', index: '^DJI', exchange: 'NYSE/NASDAQ', timezone: 'America/New_York' },

    // === PHASE 1 MARKETS ===
    { id: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', suffix: '.NS', index: '^NSEI', exchange: 'NSE', timezone: 'Asia/Kolkata' },
    { id: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', suffix: '.L', index: '^FTSE', exchange: 'LSE', timezone: 'Europe/London' },
    { id: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', suffix: '.TO', index: '^GSPTSE', exchange: 'TSX', timezone: 'America/Toronto' },
    { id: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', suffix: '.AX', index: '^AXJO', exchange: 'ASX', timezone: 'Australia/Sydney' },
    { id: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', suffix: '.HK', index: '^HSI', exchange: 'HKEX', timezone: 'Asia/Hong_Kong' },
    { id: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', suffix: '.DE', index: '^GDAXI', exchange: 'XETRA', timezone: 'Europe/Berlin' },
    { id: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', suffix: '.T', index: '^N225', exchange: 'TSE', timezone: 'Asia/Tokyo' },
    { id: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', suffix: '.AE', index: 'EMAAR.AE', exchange: 'ADX/DFM', timezone: 'Asia/Dubai' },
    { id: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', suffix: '.JO', index: 'JSE.JO', exchange: 'JSE', timezone: 'Africa/Johannesburg' },
    { id: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', suffix: '.QA', index: 'QNBK.QA', exchange: 'QSE', timezone: 'Asia/Qatar' },

    // === PHASE 2 TIER 1 MARKETS ===
    { id: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', suffix: '.PA', index: '^FCHI', exchange: 'Euronext Paris', timezone: 'Europe/Paris' },
    { id: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', suffix: '.SW', index: '^SSMI', exchange: 'SIX', timezone: 'Europe/Zurich' },
    { id: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', suffix: '.AS', index: '^AEX', exchange: 'Euronext Amsterdam', timezone: 'Europe/Amsterdam' },
    { id: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', suffix: '.MC', index: '^IBEX', exchange: 'BME', timezone: 'Europe/Madrid' },
    { id: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', suffix: '.MI', index: 'FTSEMIB.MI', exchange: 'Borsa Italiana', timezone: 'Europe/Rome' },
    { id: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', suffix: '.SA', index: '^BVSP', exchange: 'B3', timezone: 'America/Sao_Paulo' },
    { id: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', suffix: '.MX', index: '^MXX', exchange: 'BMV', timezone: 'America/Mexico_City' },
    { id: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', suffix: '.KS', index: '^KS11', exchange: 'KRX', timezone: 'Asia/Seoul' },
    { id: 'TW', name: 'Taiwan', flag: '🇹🇼', currency: 'TWD', suffix: '.TW', index: '^TWII', exchange: 'TWSE', timezone: 'Asia/Taipei' },
    { id: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', suffix: '.SI', index: '^STI', exchange: 'SGX', timezone: 'Asia/Singapore' },
];

// Market trading hours (in local time)
export const MARKET_HOURS = {
    'SA': { open: '10:00', close: '15:00', days: [0, 1, 2, 3, 4] }, // Sun-Thu
    'EG': { open: '10:00', close: '14:30', days: [0, 1, 2, 3, 4] }, // Sun-Thu
    'US': { open: '09:30', close: '16:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'IN': { open: '09:15', close: '15:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'UK': { open: '08:00', close: '16:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'CA': { open: '09:30', close: '16:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'AU': { open: '10:00', close: '16:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'HK': { open: '09:30', close: '16:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'DE': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'JP': { open: '09:00', close: '15:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'AE': { open: '10:00', close: '15:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri (Changed Jan 2022)
    'ZA': { open: '09:00', close: '17:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'QA': { open: '09:30', close: '13:15', days: [0, 1, 2, 3, 4] }, // Sun-Thu
    // Phase 2 Tier 1
    'FR': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'CH': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'NL': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'ES': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'IT': { open: '09:00', close: '17:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'BR': { open: '10:00', close: '17:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'MX': { open: '08:30', close: '15:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'KR': { open: '09:00', close: '15:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'TW': { open: '09:00', close: '13:30', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    'SG': { open: '09:00', close: '17:00', days: [1, 2, 3, 4, 5] }, // Mon-Fri
};

export function MarketProvider({ children }) {
    // Default to Saudi Arabia if no saved preference
    const [market, setMarket] = useState(() => {
        const saved = localStorage.getItem('selectedMarket');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Verify the market still exists in our list
                const found = MARKETS.find(m => m.id === parsed.id);
                return found || MARKETS[0];
            } catch {
                return MARKETS[0];
            }
        }
        return MARKETS[0];
    });

    useEffect(() => {
        localStorage.setItem('selectedMarket', JSON.stringify(market));
    }, [market]);

    const selectMarket = (marketId) => {
        const selected = MARKETS.find(m => m.id === marketId);
        if (selected) {
            setMarket(selected);
        }
    };

    // Helper function to check if market is currently open
    const isMarketOpen = (marketId) => {
        const hours = MARKET_HOURS[marketId];
        const marketConfig = MARKETS.find(m => m.id === marketId);
        if (!hours || !marketConfig) return false;

        const now = new Date();
        const options = { timeZone: marketConfig.timezone, hour: '2-digit', minute: '2-digit', hour12: false };
        const localTime = now.toLocaleTimeString('en-US', options);
        const dayOfWeek = new Date().toLocaleDateString('en-US', { timeZone: marketConfig.timezone, weekday: 'short' });
        const dayNum = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayOfWeek);

        if (!hours.days.includes(dayNum)) return false;

        const [h, m] = localTime.split(':').map(Number);
        const currentMinutes = h * 60 + m;
        const [openH, openM] = hours.open.split(':').map(Number);
        const [closeH, closeM] = hours.close.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    return (
        <MarketContext.Provider value={{ market, selectMarket, MARKETS, isMarketOpen, MARKET_HOURS }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket() {
    return useContext(MarketContext);
}
