import React, { createContext, useContext, useState, useEffect } from 'react';

const PriceContext = createContext();

export function PriceProvider({ children }) {
    const [prices, setPrices] = useState({}); // { "2222.SR": { price: 28.5, change: ... } }
    const [loading, setLoading] = useState(true);

    const fetchPrices = async () => {
        try {
            // Parallel fetch for different markets to avoid timeouts
            const markets = ['SA', 'EG', 'Global'];
            const results = await Promise.allSettled(
                markets.map(m => fetch(`/api/stocks?market=${m}`).then(r => r.json()))
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

    useEffect(() => {
        fetchPrices(); // Initial fetch

        const interval = setInterval(fetchPrices, 15000); // Poll every 15 seconds (matches Vercel cache)
        return () => clearInterval(interval);
    }, []);

    return (
        <PriceContext.Provider value={{ prices, loading }}>
            {children}
        </PriceContext.Provider>
    );
}

export function usePrices() {
    return useContext(PriceContext);
}
