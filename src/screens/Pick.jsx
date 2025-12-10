import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Check, Lock, AlertTriangle, X, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { usePrices } from '../context/PriceContext';
import StockCard, {
    SAUDI_STOCKS,
    US_STOCKS,
    EGYPT_STOCKS,
    INDIA_STOCKS,
    UK_STOCKS,
    CANADA_STOCKS,
    AUSTRALIA_STOCKS,
    HONGKONG_STOCKS,
    GERMANY_STOCKS,
    JAPAN_STOCKS,
    UAE_STOCKS,
    SOUTHAFRICA_STOCKS,
    QATAR_STOCKS,
    StockLogo
} from '../components/StockCard';
import BurgerMenu from '../components/BurgerMenu';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useMarket } from '../context/MarketContext';
import { useToast } from '../components/shared/Toast';
import Tooltip from '../components/shared/Tooltip';
import ConfirmModal from '../components/shared/ConfirmModal';

export default function Pick() {
    const { user, setUser } = useContext(UserContext);
    const { prices } = usePrices();
    const { market } = useMarket();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]); // Now stores {stock, prediction: 'up'|'down'}
    const [filter, setFilter] = useState('All');
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLocking, setIsLocking] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reset selection when market changes
    useEffect(() => {
        setSelected([]);
        setFilter('All');
    }, [market.id]);

    const filters = ['All', '🔥 Trending', '🛡️ Safe', '⚡ Volatile'];

    // Get stock data for current market
    const getStockDataForMarket = (marketId) => {
        const marketStockMap = {
            'SA': SAUDI_STOCKS,
            'EG': EGYPT_STOCKS,
            'US': US_STOCKS,
            'IN': INDIA_STOCKS,
            'UK': UK_STOCKS,
            'CA': CANADA_STOCKS,
            'AU': AUSTRALIA_STOCKS,
            'HK': HONGKONG_STOCKS,
            'DE': GERMANY_STOCKS,
            'JP': JAPAN_STOCKS,
            'AE': UAE_STOCKS,
            'ZA': SOUTHAFRICA_STOCKS,
            'QA': QATAR_STOCKS
        };
        return marketStockMap[marketId] || SAUDI_STOCKS;
    };

    const STOCK_DATA = getStockDataForMarket(market.id);

    // Map context prices to component format
    const availableStocks = Object.entries(STOCK_DATA)
        .map(([ticker, data], index) => {
            const priceKey = Object.keys(prices).find(k => k.startsWith(ticker) || k === ticker + market.suffix);
            const priceData = priceKey ? prices[priceKey] : null;

            return {
                id: getMarketIdPrefix(market.id) + index,
                ticker: ticker,
                name: data.name,
                price: priceData ? priceData.price : (50 + Math.random() * 150),
                change: priceData ? priceData.changePercent : ((Math.random() - 0.5) * 4),
                tag: data.tag || 'safe'
            };
        });

    function getMarketIdPrefix(marketId) {
        const prefixMap = {
            'SA': 0, 'EG': 1000, 'US': 2000, 'IN': 3000, 'UK': 4000,
            'CA': 5000, 'AU': 6000, 'HK': 7000, 'DE': 8000, 'JP': 9000,
            'AE': 10000, 'ZA': 11000, 'QA': 12000
        };
        return prefixMap[marketId] || 0;
    }

    const selectStock = (stock, prediction) => {
        const existing = selected.find(s => s.stock.id === stock.id);

        if (existing) {
            // If same prediction, remove. Otherwise update prediction
            if (existing.prediction === prediction) {
                setSelected(selected.filter(s => s.stock.id !== stock.id));
                showToast(`${stock.ticker} removed from deck`, 'info');
            } else {
                setSelected(selected.map(s =>
                    s.stock.id === stock.id ? { ...s, prediction } : s
                ));
                showToast(`${stock.ticker} prediction changed to ${prediction.toUpperCase()}`, 'info');
            }
        } else if (selected.length < 3) {
            setSelected([...selected, { stock, prediction }]);
            showToast(`${stock.ticker} added - predicting ${prediction.toUpperCase()}! 🎯`, 'success');
        } else {
            showToast('Maximum 3 stocks allowed. Remove one first!', 'warning');
        }
    };

    const removeFromDeck = (stockId) => {
        const removed = selected.find(s => s.stock.id === stockId);
        setSelected(selected.filter(s => s.stock.id !== stockId));
        if (removed) {
            showToast(`${removed.stock.ticker} removed from deck`, 'info');
        }
    };

    const handleLock = async () => {
        setIsLocking(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save picks to user context
        setUser({
            ...user,
            picks: selected.map(s => ({ ...s.stock, prediction: s.prediction })),
            isLocked: true,
            lastPickDate: new Date().toISOString()
        });

        showToast('🔒 Deck locked! Good luck in the contest!', 'success');
        setShowConfirm(false);
        setIsLocking(false);

        // Navigate to live after a brief moment
        setTimeout(() => navigate('/player/live'), 500);
    };

    const filteredStocks = availableStocks.filter(stock => {
        if (filter === 'All') return true;
        if (filter === '🔥 Trending') return stock.tag === 'trending';
        if (filter === '🛡️ Safe') return stock.tag === 'safe';
        if (filter === '⚡ Volatile') return stock.tag === 'volatile';
        return true;
    });

    const getStockSelection = (stockId) => {
        return selected.find(s => s.stock.id === stockId);
    };

    return (
        <div className="flex-col" style={{ minHeight: '100vh', paddingBottom: '200px', position: 'relative' }}>

            {/* Header */}
            <div style={{
                padding: '1.25rem',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
                borderRadius: '0 0 24px 24px',
                marginBottom: '1rem',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>
                            🎯 Pick Your Stocks
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                            Predict UP or DOWN for 3 stocks
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tooltip text="Select 3 stocks and predict if they'll go UP or DOWN">
                            <div style={{
                                background: selected.length === 3 ? '#22C55E' : 'rgba(255,255,255,0.2)',
                                padding: '0.5rem 1rem',
                                borderRadius: '999px',
                                fontWeight: 800,
                                fontSize: '1.125rem',
                                color: 'white',
                                minWidth: '60px',
                                textAlign: 'center'
                            }}>
                                {selected.length}/3
                            </div>
                        </Tooltip>
                        <BurgerMenu variant="glass" />
                    </div>
                </div>

                {/* Market Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    width: 'fit-content',
                }}>
                    <span style={{ fontSize: '1.1rem' }}>{market.flag}</span>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{market.name}</span>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1rem', overflowX: 'auto', marginBottom: '1rem' }}>
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.625rem 1rem',
                            borderRadius: '999px',
                            border: 'none',
                            background: filter === f
                                ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                                : 'white',
                            color: filter === f ? 'white' : '#6B7280',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            boxShadow: filter === f
                                ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                                : '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Stock List */}
            <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredStocks.map((stock) => {
                    const selection = getStockSelection(stock.id);
                    const isSelected = !!selection;

                    return (
                        <div
                            key={stock.id}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1rem',
                                border: isSelected ? '2px solid #8B5CF6' : '1px solid #E5E7EB',
                                boxShadow: isSelected
                                    ? '0 4px 20px rgba(139, 92, 246, 0.2)'
                                    : '0 2px 8px rgba(0,0,0,0.04)',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {/* Logo */}
                                <StockLogo ticker={stock.ticker} size={48} />

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem' }}>
                                            {stock.ticker}
                                        </span>
                                        {stock.tag === 'trending' && <span style={{ fontSize: '0.8rem' }}>🔥</span>}
                                        {stock.tag === 'volatile' && <span style={{ fontSize: '0.8rem' }}>⚡</span>}
                                    </div>
                                    <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                        {stock.name}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        <span style={{ fontWeight: 700, color: '#1F2937' }}>
                                            ${stock.price.toFixed(2)}
                                        </span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: stock.change >= 0 ? '#10B981' : '#EF4444'
                                        }}>
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Prediction Buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Tooltip text="Predict stock will go UP">
                                        <button
                                            onClick={() => selectStock(stock, 'up')}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: selection?.prediction === 'up'
                                                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                                    : '#F0FDF4',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                boxShadow: selection?.prediction === 'up'
                                                    ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                                                    : 'none',
                                            }}
                                        >
                                            <TrendingUp
                                                size={24}
                                                color={selection?.prediction === 'up' ? 'white' : '#10B981'}
                                                strokeWidth={2.5}
                                            />
                                        </button>
                                    </Tooltip>
                                    <Tooltip text="Predict stock will go DOWN">
                                        <button
                                            onClick={() => selectStock(stock, 'down')}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: selection?.prediction === 'down'
                                                    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                                                    : '#FEF2F2',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                boxShadow: selection?.prediction === 'down'
                                                    ? '0 4px 12px rgba(239, 68, 68, 0.4)'
                                                    : 'none',
                                            }}
                                        >
                                            <TrendingDown
                                                size={24}
                                                color={selection?.prediction === 'down' ? 'white' : '#EF4444'}
                                                strokeWidth={2.5}
                                            />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected Deck Bar */}
            {selected.length > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 'calc(68px + 1rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 2rem)',
                    maxWidth: '400px',
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1rem',
                    zIndex: 20,
                    border: '2px solid #8B5CF6',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.25)'
                }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Your Deck
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selected.map(({ stock, prediction }) => (
                                <div
                                    key={stock.id}
                                    onClick={() => removeFromDeck(stock.id)}
                                    style={{
                                        background: prediction === 'up'
                                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                            : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                    }}
                                >
                                    {prediction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {stock.ticker}
                                    <X size={14} strokeWidth={3} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        disabled={selected.length !== 3}
                        onClick={() => setShowConfirm(true)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: selected.length === 3
                                ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                                : '#E5E7EB',
                            color: selected.length === 3 ? 'white' : '#9CA3AF',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: selected.length === 3 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        {selected.length === 3 ? (
                            <>
                                <Lock size={18} />
                                Lock My Deck
                            </>
                        ) : (
                            `Pick ${3 - selected.length} More Stock${3 - selected.length > 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        maxWidth: '340px',
                        width: '100%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                        }}>
                            <Lock size={32} color="white" />
                        </div>

                        <h3 style={{
                            textAlign: 'center',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            marginBottom: '0.5rem'
                        }}>
                            Lock Your Deck?
                        </h3>
                        <p style={{
                            textAlign: 'center',
                            color: '#6B7280',
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                            lineHeight: 1.5
                        }}>
                            Once locked, you can't change your picks until tomorrow's contest.
                        </p>

                        {/* Show picks */}
                        <div style={{
                            background: '#F9FAFB',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            marginBottom: '1.5rem'
                        }}>
                            {selected.map(({ stock, prediction }) => (
                                <div
                                    key={stock.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid #E5E7EB',
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>{stock.ticker}</span>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.625rem',
                                        borderRadius: '999px',
                                        background: prediction === 'up' ? '#DCFCE7' : '#FEE2E2',
                                        color: prediction === 'up' ? '#16A34A' : '#DC2626',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                    }}>
                                        {prediction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {prediction.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isLocking}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    background: 'white',
                                    color: '#4B5563',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLock}
                                disabled={isLocking}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    cursor: isLocking ? 'wait' : 'pointer',
                                    opacity: isLocking ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                {isLocking ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                        }} />
                                        Locking...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} />
                                        Confirm
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
