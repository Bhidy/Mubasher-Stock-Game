import { useState, useEffect } from 'react';

export function useRealStocks() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stocks');
                if (!response.ok) throw new Error('Failed to fetch stocks');
                const data = await response.json();
                setStocks(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stocks:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStocks();

        // Refresh every minute
        const interval = setInterval(fetchStocks, 60000);
        return () => clearInterval(interval);
    }, []);

    return { stocks, loading, error };
}
