import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMarket, MARKETS } from './MarketContext';

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

            // Fetch additional markets for Global tab (UK, Germany, Japan indices)
            // These will be available for the Global tab
            if (!marketsToFetch.includes('UK')) marketsToFetch.push('UK');
            if (!marketsToFetch.includes('DE')) marketsToFetch.push('DE');
            if (!marketsToFetch.includes('JP')) marketsToFetch.push('JP');

            const results = await Promise.allSettled(
                marketsToFetch.map(m =>
                    fetch(`/api/stocks?market=${m}`)
                        .then(r => r.json())
                        .catch(() => [])
                )
            );

            const priceMap = {};

            results.forEach(result => {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    result.value.forEach(stock => {
                        priceMap[stock.symbol] = {
                            ...stock,
                            price: stock.regularMarketPrice || stock.price,
                            change: stock.regularMarketChange || stock.change,
                            changePercent: stock.regularMarketChangePercent || stock.changePercent || 0,
                            name: stock.name,
                            lastUpdated: stock.lastUpdated
                        };
                    });
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
