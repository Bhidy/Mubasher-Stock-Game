import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Check, Lock, AlertTriangle, X } from 'lucide-react';
import { UserContext } from '../App';
import { usePrices } from '../context/PriceContext';
import StockCard from '../components/StockCard';
import BurgerMenu from '../components/BurgerMenu';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Toast from '../components/Toast';

export default function Pick() {
    const { user, setUser } = useContext(UserContext);
    const { prices } = usePrices();
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showConfirm, setShowConfirm] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const filters = ['All', '🔥 Trending', '🛡️ Safe', '⚡ Volatile'];

    // Import stock data from StockCard
    const STOCK_DATA = {
        '2222': { name: 'Saudi Aramco', tag: 'safe' },
        '1120': { name: 'Al Rajhi Bank', tag: 'safe' },
        '2010': { name: 'SABIC', tag: 'trending' },
        '7010': { name: 'STC', tag: 'safe' },
        '2082': { name: 'ACWA Power', tag: 'volatile' },
        '1180': { name: 'SNB', tag: 'safe' },
        '2380': { name: 'Petro Rabigh', tag: 'volatile' },
        '4030': { name: 'Al Babtain', tag: 'trending' },
        '2350': { name: 'SIDC', tag: 'volatile' },
        '4200': { name: 'Aldrees', tag: 'trending' },
        '1211': { name: 'Alinma Bank', tag: 'safe' },
        '4001': { name: 'Abdullah Al-Othaim', tag: 'trending' },
        '2310': { name: 'Sipchem', tag: 'volatile' },
        '4003': { name: 'Extra', tag: 'trending' },
        '2050': { name: 'Savola', tag: 'safe' },
        '1150': { name: 'Amlak', tag: 'volatile' },
        '4190': { name: 'Jarir', tag: 'trending' },
        '2290': { name: 'Yanbu Cement', tag: 'safe' },
        '4002': { name: 'Mouwasat', tag: 'safe' },
        '1010': { name: 'Riyad Bank', tag: 'safe' },
    };

    // Map context prices to component format (20 stocks)
    // Merge API prices with static data to ensure all 20 stocks are shown
    const availableStocks = Object.entries(STOCK_DATA)
        .sort(([tickerA], [tickerB]) => {
            if (tickerA === '2222') return -1;
            if (tickerB === '2222') return 1;
            return 0;
        })
        .map(([ticker, data], index) => {
            // Find price data for this ticker if available
            const priceKey = Object.keys(prices).find(k => k.startsWith(ticker));
            const priceData = priceKey ? prices[priceKey] : null;

            return {
                id: index + 1,
                ticker: ticker,
                name: data.name,
                price: priceData ? priceData.price : (50 + Math.random() * 150), // Fallback price
                change: priceData ? priceData.changePercent : ((Math.random() - 0.5) * 4), // Fallback change
                tag: data.tag
            };
        });

    const toggleStock = (stock) => {
        if (selected.find(s => s.id === stock.id)) {
            setSelected(selected.filter(s => s.id !== stock.id));
        } else {
            if (selected.length < 3) {
                setSelected([...selected, stock]);
            }
        }
    };

    const handleLock = () => {
        setUser({ ...user, picks: selected, isLocked: true });
        navigate('/live');
    };

    const filteredStocks = availableStocks.filter(stock => {
        if (filter === 'All') return true;
        if (filter === '🔥 Trending') return stock.tag === 'trending';
        if (filter === '🛡️ Safe') return stock.tag === 'safe';
        if (filter === '⚡ Volatile') return stock.tag === 'volatile';
        return true;
    });

    return (
        <div className="flex-col" style={{ minHeight: '100vh', paddingBottom: '180px', position: 'relative' }}>

            {/* Header */}
            <div style={{
                padding: '1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'linear-gradient(180deg, #f8fafc 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderBottom: '2px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>


                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <div>
                        <h2 className="h2" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Build Your Deck</h2>
                        <p className="caption">Choose wisely. Lock before 4:00 PM ET</p>
                    </div>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <div style={{
                            background: selected.length === 3 ? 'var(--gradient-success)' : 'var(--bg-secondary)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 800,
                            fontSize: '1.125rem',
                            color: selected.length === 3 ? 'white' : 'var(--text-secondary)',
                            boxShadow: selected.length === 3 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                            minWidth: '60px',
                            textAlign: 'center'
                        }}>
                            {selected.length}/3
                        </div>
                        <BurgerMenu />
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.625rem 1.25rem',
                                borderRadius: 'var(--radius-full)',
                                border: filter === f ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                background: filter === f ? '#ede9fe' : 'white',
                                color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                boxShadow: filter === f ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock List */}
            <div className="flex-col" style={{ padding: '1rem', gap: '1rem' }}>
                {filteredStocks.map((stock, index) => (
                    <div key={stock.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <StockCard
                            stock={stock}
                            isSelected={!!selected.find(s => s.id === stock.id)}
                            onToggle={() => toggleStock(stock)}
                        />
                    </div>
                ))}
            </div>

            {/* Selected Deck Bar */}
            {selected.length > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: 'calc(var(--nav-height) + 1rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 2rem)',
                    maxWidth: 'calc(var(--max-width) - 2rem)',
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem',
                    zIndex: 20,
                    border: '2px solid var(--primary)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.25)'
                }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>YOUR DECK</span>
                        <div className="flex-center" style={{ gap: '0.5rem' }}>
                            {selected.map(s => (
                                <div key={s.id} onClick={() => toggleStock(s)} style={{
                                    background: 'var(--gradient-primary)',
                                    padding: '0.375rem 0.875rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                }}>
                                    {s.ticker} <X size={14} strokeWidth={3} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        disabled={selected.length !== 3}
                        onClick={() => setShowConfirm(true)}
                        variant="primary"
                        style={{
                            opacity: selected.length === 3 ? 1 : 0.5,
                            pointerEvents: selected.length === 3 ? 'auto' : 'none',
                            width: '100%',
                            justifyContent: 'center',
                            borderRadius: '9999px',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: 700
                        }}
                    >
                        {selected.length === 3 ? '🔒 Lock My Deck' : `Pick ${3 - selected.length} More Stock${3 - selected.length > 1 ? 's' : ''}`}
                    </Button>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(8px)'
                }} className="animate-fade-in">
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '360px',
                        borderRadius: '2rem',
                        padding: '2rem',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        border: '2px solid var(--primary)'
                    }} className="animate-slide-up">
                        <div className="flex-col flex-center" style={{ gap: '1.5rem', textAlign: 'center' }}>
                            <div style={{
                                background: 'var(--gradient-primary)',
                                padding: '1.5rem',
                                borderRadius: '50%',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
                            }}>
                                <Lock size={48} color="white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="h2" style={{ marginBottom: '0.75rem' }}>Lock Your Deck?</h3>
                                <p className="body-sm" style={{ lineHeight: 1.7 }}>Once locked, you can't change your picks until tomorrow's contest.</p>
                            </div>
                            <div className="flex-col" style={{ gap: '0.75rem', width: '100%' }}>
                                <Button onClick={handleLock}>Confirm & Lock 🚀</Button>
                                <Button variant="ghost" onClick={() => setShowConfirm(false)}>Go Back</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
