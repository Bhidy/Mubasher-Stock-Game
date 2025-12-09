import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Star, TrendingUp, TrendingDown, ArrowLeft, Plus, Search,
    MoreVertical, Bell, BellOff, Trash2, ChevronRight, ArrowUpRight,
    ArrowDownRight, Filter, X, Check, Folder
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';

// Mock watchlist data
const WATCHLIST_GROUPS = [
    { id: 'favorites', name: 'Favorites', icon: '⭐', color: '#F59E0B' },
    { id: 'tech', name: 'Tech Stocks', icon: '💻', color: '#0EA5E9' },
    { id: 'dividend', name: 'Dividend Plays', icon: '💰', color: '#10B981' },
    { id: 'volatile', name: 'High Volatility', icon: '📈', color: '#EF4444' },
];

const WATCHLIST_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.72, change: 2.45, changePercent: 1.31, alertSet: true, groups: ['favorites', 'tech'] },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.23, changePercent: -0.32, alertSet: false, groups: ['favorites', 'tech'] },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.12, changePercent: 2.25, alertSet: false, groups: ['tech'] },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.87, changePercent: 1.06, alertSet: true, groups: ['tech'] },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, changePercent: 1.44, alertSet: true, groups: ['favorites', 'volatile'] },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -5.32, changePercent: -2.12, alertSet: false, groups: ['volatile'] },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 155.25, change: 0.45, changePercent: 0.29, alertSet: false, groups: ['dividend'] },
    { symbol: 'KO', name: 'Coca-Cola Co.', price: 58.92, change: 0.23, changePercent: 0.39, alertSet: false, groups: ['dividend'] },
];

function WatchlistItem({ stock, onToggleAlert, onRemove, onClick }) {
    const isPositive = stock.changePercent >= 0;
    const [showActions, setShowActions] = useState(false);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            background: 'white',
            borderRadius: '12px',
            marginBottom: '0.625rem',
            border: '1px solid #E5E7EB',
            position: 'relative',
        }}>
            <div
                onClick={onClick}
                style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
                {/* Symbol */}
                <div style={{ minWidth: '70px' }}>
                    <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                        {stock.symbol}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                        {stock.name.length > 15 ? stock.name.substring(0, 15) + '...' : stock.name}
                    </div>
                </div>

                {/* Mini chart placeholder */}
                <div style={{
                    flex: 1,
                    height: '32px',
                    margin: '0 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                        <path
                            d={isPositive
                                ? "M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8"
                                : "M0,5 L10,10 L20,8 L30,15 L40,12 L50,18 L60,16"
                            }
                            fill="none"
                            stroke={isPositive ? '#10B981' : '#EF4444'}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* Price & Change */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                        ${stock.price.toFixed(2)}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isPositive ? '#10B981' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '2px',
                    }}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.75rem' }}>
                <button
                    onClick={() => onToggleAlert(stock.symbol)}
                    style={{
                        background: stock.alertSet ? '#FEF3C7' : '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                    }}
                >
                    {stock.alertSet ? (
                        <Bell size={16} color="#D97706" fill="#D97706" />
                    ) : (
                        <BellOff size={16} color="#9CA3AF" />
                    )}
                </button>
                <button
                    onClick={() => setShowActions(!showActions)}
                    style={{
                        background: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                    }}
                >
                    <MoreVertical size={16} color="#6B7280" />
                </button>
            </div>

            {/* Action dropdown */}
            {showActions && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '1rem',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    padding: '0.5rem',
                    zIndex: 100,
                    minWidth: '150px',
                }}>
                    <button
                        onClick={() => { onRemove(stock.symbol); setShowActions(false); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.625rem 0.75rem',
                            border: 'none',
                            background: 'none',
                            color: '#EF4444',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            borderRadius: '8px',
                        }}
                    >
                        <Trash2 size={16} />
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}

export default function InvestorWatchlist() {
    const navigate = useNavigate();
    const [activeGroup, setActiveGroup] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [stocks, setStocks] = useState(WATCHLIST_STOCKS);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleToggleAlert = (symbol) => {
        setStocks(prev => prev.map(s =>
            s.symbol === symbol ? { ...s, alertSet: !s.alertSet } : s
        ));
    };

    const handleRemove = (symbol) => {
        setStocks(prev => prev.filter(s => s.symbol !== symbol));
    };

    // Filter stocks
    const filteredStocks = stocks.filter(s => {
        const matchesGroup = activeGroup === 'all' || s.groups.includes(activeGroup);
        const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGroup && matchesSearch;
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                padding: '1rem 1rem 1.5rem 1rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>
                        Watchlist
                    </h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Plus size={20} color="white" />
                    </button>
                </div>

                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                }}>
                    <Search size={18} color="#9CA3AF" />
                    <input
                        type="text"
                        placeholder="Search watchlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.9rem',
                            color: '#1F2937',
                            background: 'transparent',
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            <X size={16} color="#9CA3AF" />
                        </button>
                    )}
                </div>
            </div>

            {/* Group Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
            }}>
                <button
                    onClick={() => setActiveGroup('all')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 0.875rem',
                        borderRadius: '999px',
                        border: 'none',
                        background: activeGroup === 'all'
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : 'white',
                        color: activeGroup === 'all' ? 'white' : '#6B7280',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    All ({stocks.length})
                </button>
                {WATCHLIST_GROUPS.map(group => {
                    const count = stocks.filter(s => s.groups.includes(group.id)).length;
                    const isActive = activeGroup === group.id;
                    return (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.5rem 0.875rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: isActive ? group.color : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span>{group.icon}</span>
                            {group.name} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Stocks List */}
            <div style={{ padding: '0 1rem' }}>
                {filteredStocks.length > 0 ? (
                    filteredStocks.map(stock => (
                        <WatchlistItem
                            key={stock.symbol}
                            stock={stock}
                            onToggleAlert={handleToggleAlert}
                            onRemove={handleRemove}
                            onClick={() => navigate(`/company/${stock.symbol}`)}
                        />
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <Star size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>No stocks found</h3>
                        <p>Add stocks to your watchlist to track them here.</p>
                    </div>
                )}
            </div>

            {/* Add Stock Modal */}
            {showAddModal && (
                <div
                    onClick={() => setShowAddModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'flex-end',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px 24px 0 0',
                            padding: '1.5rem',
                            width: '100%',
                            maxHeight: '70vh',
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '4px',
                            background: '#E5E7EB',
                            borderRadius: '2px',
                            margin: '0 auto 1rem',
                        }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Add to Watchlist
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: '#F3F4F6',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                        }}>
                            <Search size={18} color="#9CA3AF" />
                            <input
                                type="text"
                                placeholder="Search for stocks..."
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    background: 'transparent',
                                }}
                                autoFocus
                            />
                        </div>
                        <p style={{ color: '#9CA3AF', fontSize: '0.85rem', textAlign: 'center' }}>
                            Search for a stock symbol or company name to add it to your watchlist.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
