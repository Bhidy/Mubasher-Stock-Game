import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import StockCard from '../components/StockCard';
import Button from '../components/Button';
import { Search, Lock, X, Filter, Sparkles } from 'lucide-react';
import BurgerMenu from '../components/BurgerMenu';

const MOCK_STOCKS = [
    { id: 1, ticker: '2222', name: 'Saudi Aramco', price: 32.50, change: 1.2, popularity: 42, isTrending: true, category: 'Safe', rarity: 'legendary', logo: 'https://logo.clearbit.com/aramco.com' },
    { id: 2, ticker: '1120', name: 'Al Rajhi Bank', price: 88.20, change: 0.8, popularity: 25, isTrending: false, category: 'Safe', rarity: 'common', logo: 'https://logo.clearbit.com/alrajhibank.com.sa' },
    { id: 3, ticker: '2010', name: 'SABIC', price: 78.90, change: -1.5, popularity: 18, isTrending: false, category: 'Volatile', rarity: 'rare', logo: 'https://logo.clearbit.com/sabic.com' },
    { id: 4, ticker: '7010', name: 'Saudi Telecom (STC)', price: 41.30, change: 2.4, popularity: 15, isTrending: true, category: 'Safe', rarity: 'common', logo: 'https://logo.clearbit.com/stc.com.sa' },
    { id: 5, ticker: '1180', name: 'Saudi National Bank', price: 39.80, change: 1.5, popularity: 12, isTrending: true, category: 'Safe', rarity: 'rare', logo: 'https://logo.clearbit.com/alahli.com' },
    { id: 6, ticker: '4061', name: 'ACWA Power', price: 125.40, change: 5.6, popularity: 20, isTrending: true, category: 'Volatile', rarity: 'epic', logo: 'https://logo.clearbit.com/acwapower.com' },
    { id: 7, ticker: '2030', name: 'Saudi Kayan', price: 14.50, change: 3.2, popularity: 8, isTrending: false, category: 'Volatile', rarity: 'epic', logo: 'https://logo.clearbit.com/saudikayan.com' },
    { id: 8, ticker: '2380', name: 'Petrochemical', price: 22.80, change: -0.9, popularity: 10, isTrending: false, category: 'Volatile', rarity: 'rare', logo: 'https://logo.clearbit.com/sipchem.com' },
];

export default function Pick() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showConfirm, setShowConfirm] = useState(false);

    const filters = ['All', '🔥 Trending', '🛡️ Safe', '⚡ Volatile'];

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

    const filteredStocks = MOCK_STOCKS.filter(stock => {
        if (filter === 'All') return true;
        if (filter === '🔥 Trending') return stock.isTrending;
        if (filter === '🛡️ Safe') return stock.category === 'Safe';
        if (filter === '⚡ Volatile') return stock.category === 'Volatile';
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
                }} className="animate-slide-up">
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
