import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ArrowLeft, TrendingUp, TrendingDown, ChevronDown,
    ChevronRight, ArrowUpRight, ArrowDownRight, X, Check, RotateCcw,
    BarChart3, DollarSign, Percent, Activity
} from 'lucide-react';
import { useToast } from '../../components/shared/Toast';
import Tooltip from '../../components/shared/Tooltip';

// Mock screener results
const SAMPLE_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.72, change: 1.31, marketCap: '2.95T', pe: 28.5, volume: '58M', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -0.32, marketCap: '2.81T', pe: 35.2, volume: '22M', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 2.25, marketCap: '1.78T', pe: 24.5, volume: '28M', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 178.25, change: 1.06, marketCap: '1.84T', pe: 55.8, volume: '45M', sector: 'Consumer' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 1.44, marketCap: '2.16T', pe: 65.2, volume: '35M', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', price: 485.92, change: -1.15, marketCap: '1.24T', pe: 28.9, volume: '18M', sector: 'Technology' },
    { symbol: 'BRK.B', name: 'Berkshire B', price: 408.75, change: 0.45, marketCap: '880B', pe: 8.5, volume: '4M', sector: 'Financial' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 168.50, change: 0.88, marketCap: '485B', pe: 10.2, volume: '12M', sector: 'Financial' },
    { symbol: 'V', name: 'Visa Inc.', price: 278.45, change: 0.62, marketCap: '565B', pe: 29.4, volume: '8M', sector: 'Financial' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 155.25, change: 0.29, marketCap: '375B', pe: 15.8, volume: '7M', sector: 'Healthcare' },
];

const FILTER_PRESETS = [
    { id: 'gainers', label: 'Top Gainers', icon: TrendingUp, color: '#10B981' },
    { id: 'losers', label: 'Top Losers', icon: TrendingDown, color: '#EF4444' },
    { id: 'value', label: 'Value Stocks', icon: DollarSign, color: '#0EA5E9' },
    { id: 'growth', label: 'Growth Stocks', icon: Activity, color: '#8B5CF6' },
];

const SECTORS = ['All Sectors', 'Technology', 'Financial', 'Healthcare', 'Consumer', 'Energy', 'Industrial'];

export default function InvestorScreener() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activePreset, setActivePreset] = useState(null);
    const [filters, setFilters] = useState({
        sector: 'All Sectors',
        minPrice: '',
        maxPrice: '',
        minPE: '',
        maxPE: '',
        minChange: '',
        maxChange: '',
    });

    // Filter and sort stocks
    let filteredStocks = [...SAMPLE_STOCKS];

    // Apply preset
    if (activePreset === 'gainers') {
        filteredStocks = filteredStocks.filter(s => s.change > 0).sort((a, b) => b.change - a.change);
    } else if (activePreset === 'losers') {
        filteredStocks = filteredStocks.filter(s => s.change < 0).sort((a, b) => a.change - b.change);
    } else if (activePreset === 'value') {
        filteredStocks = filteredStocks.filter(s => s.pe < 20).sort((a, b) => a.pe - b.pe);
    } else if (activePreset === 'growth') {
        filteredStocks = filteredStocks.filter(s => s.pe > 25).sort((a, b) => b.change - a.change);
    }

    // Apply sector filter
    if (filters.sector !== 'All Sectors') {
        filteredStocks = filteredStocks.filter(s => s.sector === filters.sector);
    }

    // Apply search
    if (searchQuery) {
        filteredStocks = filteredStocks.filter(s =>
            s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const handlePresetChange = (presetId) => {
        const isActive = activePreset === presetId;
        setActivePreset(isActive ? null : presetId);
        if (!isActive) {
            const presetLabel = FILTER_PRESETS.find(p => p.id === presetId)?.label;
            showToast(`Applied ${presetLabel} filter`, 'info');
        }
    };

    const resetFilters = () => {
        setFilters({
            sector: 'All Sectors',
            minPrice: '',
            maxPrice: '',
            minPE: '',
            maxPE: '',
            minChange: '',
            maxChange: '',
        });
        setActivePreset(null);
        showToast('All filters cleared', 'success');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
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
                        Stock Screener
                    </h1>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            background: showFilters ? 'white' : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Filter size={20} color={showFilters ? '#0EA5E9' : 'white'} />
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
                        placeholder="Search stocks..."
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
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderBottom: '1px solid #E5E7EB',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                    }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Filters</h3>
                        <button
                            onClick={resetFilters}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'none',
                                border: 'none',
                                color: '#0EA5E9',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    </div>

                    {/* Sector */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                            Sector
                        </label>
                        <select
                            value={filters.sector}
                            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.625rem',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '0.85rem',
                                color: '#1F2937',
                                background: 'white',
                            }}
                        >
                            {SECTORS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                                Min Price
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.85rem',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.375rem' }}>
                                Max Price
                            </label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.85rem',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Presets */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
            }}>
                {FILTER_PRESETS.map(preset => {
                    const isActive = activePreset === preset.id;
                    return (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetChange(preset.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.5rem 0.875rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: isActive ? preset.color : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                        >
                            <preset.icon size={14} />
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            {/* Results Count */}
            <div style={{ padding: '0 1rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>
                {filteredStocks.length} stocks found
            </div>

            {/* Stock List */}
            <div style={{ padding: '0 1rem' }}>
                {filteredStocks.map(stock => {
                    const isPositive = stock.change >= 0;
                    return (
                        <div
                            key={stock.symbol}
                            onClick={() => navigate(`/company/${stock.symbol}`)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '12px',
                                marginBottom: '0.625rem',
                                border: '1px solid #E5E7EB',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, color: '#1F2937' }}>{stock.symbol}</span>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.125rem 0.375rem',
                                        background: '#F3F4F6',
                                        borderRadius: '4px',
                                        color: '#6B7280',
                                    }}>
                                        {stock.sector}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{stock.name}</div>
                            </div>

                            <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>P/E</div>
                                <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.85rem' }}>{stock.pe}</div>
                            </div>

                            <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>MCap</div>
                                <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.85rem' }}>{stock.marketCap}</div>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <div style={{ fontWeight: 700, color: '#1F2937' }}>${stock.price.toFixed(2)}</div>
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
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
