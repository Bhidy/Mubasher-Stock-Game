import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMarket, MARKETS } from './MarketContext';
import { getEndpoint } from '../config/api';

const PriceContext = createContext();

export function PriceProvider({ children }) {
    const [prices, setPrices] = useState({}); // { "2222.SR": { price: 28.5, change: ... } }
    const [loading, setLoading] = useState(true);
    const { market } = useMarket();

    const fetchPrices = async () => {
        try {
            // Fetch prices for current market + US + Global indices
            const marketsToFetch = [market.id];

            // Always also fetch US for index data
            if (market.id !== 'US') {
                marketsToFetch.push('US');
            }

            // Fetch additional markets for Global tab
            // Europe
            if (!marketsToFetch.includes('UK')) marketsToFetch.push('UK');
            if (!marketsToFetch.includes('DE')) marketsToFetch.push('DE');
            if (!marketsToFetch.includes('FR')) marketsToFetch.push('FR');
            if (!marketsToFetch.includes('ES')) marketsToFetch.push('ES');
            if (!marketsToFetch.includes('CH')) marketsToFetch.push('CH');
            if (!marketsToFetch.includes('NL')) marketsToFetch.push('NL');
            if (!marketsToFetch.includes('IT')) marketsToFetch.push('IT');

            // Asia
            if (!marketsToFetch.includes('JP')) marketsToFetch.push('JP');
            if (!marketsToFetch.includes('HK')) marketsToFetch.push('HK');
            if (!marketsToFetch.includes('KR')) marketsToFetch.push('KR');
            if (!marketsToFetch.includes('TW')) marketsToFetch.push('TW');
            if (!marketsToFetch.includes('SG')) marketsToFetch.push('SG');
            if (!marketsToFetch.includes('AU')) marketsToFetch.push('AU');

            // Americas
            if (!marketsToFetch.includes('CA')) marketsToFetch.push('CA');
            if (!marketsToFetch.includes('BR')) marketsToFetch.push('BR');
            if (!marketsToFetch.includes('MX')) marketsToFetch.push('MX');

            // MENA
            if (!marketsToFetch.includes('SA')) marketsToFetch.push('SA');
            if (!marketsToFetch.includes('EG')) marketsToFetch.push('EG');
            if (!marketsToFetch.includes('AE')) marketsToFetch.push('AE');
            if (!marketsToFetch.includes('QA')) marketsToFetch.push('QA');
            if (!marketsToFetch.includes('ZA')) marketsToFetch.push('ZA');

            const EXTRA_TICKERS = [
                // Constants for Global Tab
                '^GSPC', '^DJI', '^IXIC', '^FTSE', '^GDAXI', '^N225',
                // Commodities
                'GC=F', 'SI=F', 'BZ=F', 'CL=F', 'NG=F', 'HG=F',
                // FX
                'EURUSD=X', 'GBPUSD=X', 'JPY=X', 'CHF=X', 'AUDUSD=X', 'CAD=X', 'SAR=X', 'EGP=X',
                // Crypto
                'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'BNB-USD', 'ADA-USD',
                // Indices
                '^VIX'
            ];

            const fetchYahooPrice = (symbol) =>
                fetch(getEndpoint(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`))
                    .then(r => r.json())
                    .catch(() => null);

            const results = await Promise.allSettled([
                ...marketsToFetch.map(m =>
                    fetch(getEndpoint(`/api/stocks?market=${m}`))
                        .then(r => r.json())
                        .catch(() => [])
                ),
                ...EXTRA_TICKERS.map(t => fetchYahooPrice(t))
            ]);

            const priceMap = {};

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    const value = result.value;

                    if (Array.isArray(value)) {
                        // Standard market array response
                        value.forEach(stock => {
                            priceMap[stock.symbol] = {
                                ...stock,
                                price: stock.regularMarketPrice || stock.price,
                                change: stock.regularMarketChange || stock.change,
                                changePercent: stock.regularMarketChangePercent || stock.changePercent || 0,
                                name: stock.name,
                                lastUpdated: stock.lastUpdated
                            };
                        });
                    } else if (value && value.symbol) {
                        // Single Yahoo proxy response
                        priceMap[value.symbol] = {
                            symbol: value.symbol,
                            price: value.price,
                            change: value.change,
                            changePercent: value.changePercent,
                            currency: value.currency,
                            name: value.symbol, // Yahoo proxy returns minimal data
                            lastUpdated: value.lastUpdated
                        };
                    }
                }
            });

            setPrices(prev => ({ ...prev, ...priceMap })); // Merge to keep old values if fetch fails partly
            setLoading(false);
        } catch (error) {
            console.error('Price update failed:', error);
            // Keep previous prices on error
        }
    };

    // Re-fetch when market changes
    useEffect(() => {
        setLoading(true);
        fetchPrices();
    }, [market.id]);

    useEffect(() => {
        fetchPrices(); // Initial fetch

        const interval = setInterval(fetchPrices, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, [market.id]);

    return (
        <PriceContext.Provider value={{ prices, loading, refetch: fetchPrices }}>
            {children}
        </PriceContext.Provider>
    );
}

export function usePrices() {
    return useContext(PriceContext);
}
