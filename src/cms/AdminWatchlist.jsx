/**
 * AdminWatchlist - Ultra Premium Watchlist Management
 * Real-time stock data from 23 global markets with 20+ configurable columns
 * 
 * @version 1.0.0
 * @author GOO MODE - Expert Protocol v3.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Star, Search, RefreshCw, Download, Settings2, Eye, EyeOff,
    TrendingUp, TrendingDown, ArrowUpDown, Filter, Grid3X3, List,
    ChevronDown, Check, X, Loader2, AlertCircle, Globe, BarChart3,
    Building2, Wallet, Target, Users, Clock, Percent, DollarSign
} from 'lucide-react';
import { getEndpoint } from '../config/api';
import { MARKETS } from '../context/MarketContext';

// ============================================================================
// COLUMN CONFIGURATION - All Available Data Fields
// ============================================================================

const ALL_COLUMNS = [
    // Core Data (Always Available from /api/stocks)
    { key: 'logo', label: '', width: 48, sortable: false, group: 'core', format: 'logo' },
    { key: 'symbol', label: 'Symbol', width: 90, sortable: true, group: 'core', format: 'text' },
    { key: 'name', label: 'Name', width: 180, sortable: true, group: 'core', format: 'text' },
    { key: 'sector', label: 'Sector', width: 120, sortable: true, group: 'core', format: 'badge' },
    { key: 'price', label: 'Price', width: 100, sortable: true, group: 'core', format: 'currency' },
    { key: 'change', label: 'Change', width: 90, sortable: true, group: 'core', format: 'change' },
    { key: 'changePercent', label: 'Change %', width: 95, sortable: true, group: 'core', format: 'changePercent' },
    { key: 'volume', label: 'Volume', width: 110, sortable: true, group: 'core', format: 'compact' },
    { key: 'marketCap', label: 'Market Cap', width: 120, sortable: true, group: 'core', format: 'compact' },

    // Valuation Metrics
    { key: 'peRatio', label: 'P/E', width: 80, sortable: true, group: 'valuation', format: 'decimal' },
    { key: 'forwardPE', label: 'Fwd P/E', width: 85, sortable: true, group: 'valuation', format: 'decimal' },
    { key: 'trailingEps', label: 'EPS', width: 80, sortable: true, group: 'valuation', format: 'currency' },
    { key: 'priceToBook', label: 'P/B', width: 75, sortable: true, group: 'valuation', format: 'decimal' },
    { key: 'enterpriseToEbitda', label: 'EV/EBITDA', width: 95, sortable: true, group: 'valuation', format: 'decimal' },

    // 52-Week Performance
    { key: 'fiftyTwoWeekHigh', label: '52W High', width: 100, sortable: true, group: 'performance', format: 'currency' },
    { key: 'fiftyTwoWeekLow', label: '52W Low', width: 100, sortable: true, group: 'performance', format: 'currency' },
    { key: 'fiftyDayAverage', label: '50D Avg', width: 95, sortable: true, group: 'performance', format: 'currency' },
    { key: 'twoHundredDayAverage', label: '200D Avg', width: 100, sortable: true, group: 'performance', format: 'currency' },
    { key: 'beta', label: 'Beta', width: 70, sortable: true, group: 'performance', format: 'decimal' },

    // Dividend Data
    { key: 'dividendYield', label: 'Div Yield', width: 95, sortable: true, group: 'dividend', format: 'percent' },
    { key: 'payoutRatio', label: 'Payout', width: 85, sortable: true, group: 'dividend', format: 'percent' },
    { key: 'trailingAnnualDividendRate', label: 'Div Rate', width: 90, sortable: true, group: 'dividend', format: 'currency' },

    // Profitability
    { key: 'profitMargins', label: 'Profit Margin', width: 110, sortable: true, group: 'profitability', format: 'percent' },
    { key: 'grossMargins', label: 'Gross Margin', width: 110, sortable: true, group: 'profitability', format: 'percent' },
    { key: 'returnOnEquity', label: 'ROE', width: 80, sortable: true, group: 'profitability', format: 'percent' },
    { key: 'revenueGrowth', label: 'Rev Growth', width: 100, sortable: true, group: 'profitability', format: 'percent' },

    // Analyst Ratings
    { key: 'targetMeanPrice', label: 'Target', width: 90, sortable: true, group: 'analyst', format: 'currency' },
    { key: 'recommendationKey', label: 'Rating', width: 100, sortable: true, group: 'analyst', format: 'rating' },
    { key: 'numberOfAnalystOpinions', label: 'Analysts', width: 85, sortable: true, group: 'analyst', format: 'number' },
];

const COLUMN_GROUPS = {
    core: { label: 'Core Data', icon: BarChart3, default: true, color: '#10B981' },
    valuation: { label: 'Valuation', icon: DollarSign, default: false, color: '#3B82F6' },
    performance: { label: '52-Week', icon: TrendingUp, default: false, color: '#8B5CF6' },
    dividend: { label: 'Dividend', icon: Wallet, default: false, color: '#F59E0B' },
    profitability: { label: 'Profitability', icon: Percent, default: false, color: '#EC4899' },
    analyst: { label: 'Analyst', icon: Users, default: false, color: '#06B6D4' },
};

const DEFAULT_VISIBLE_COLUMNS = ALL_COLUMNS.filter(c => c.group === 'core').map(c => c.key);

// Sector color mapping
const SECTOR_COLORS = {
    'Technology': { bg: '#DBEAFE', text: '#1D4ED8' },
    'Financial': { bg: '#D1FAE5', text: '#065F46' },
    'Healthcare': { bg: '#FCE7F3', text: '#9D174D' },
    'Consumer': { bg: '#FEF3C7', text: '#92400E' },
    'Energy': { bg: '#FEE2E2', text: '#991B1B' },
    'Industrial': { bg: '#E0E7FF', text: '#3730A3' },
    'Materials': { bg: '#CFFAFE', text: '#0E7490' },
    'Telecom': { bg: '#F3E8FF', text: '#6B21A8' },
    'Utilities': { bg: '#ECFDF5', text: '#047857' },
    'Real Estate': { bg: '#FFF7ED', text: '#C2410C' },
    'Index': { bg: '#F1F5F9', text: '#475569' },
    'default': { bg: '#F1F5F9', text: '#475569' },
};

// ============================================================================
// FORMAT HELPERS
// ============================================================================

const formatValue = (value, format, currency = 'USD') => {
    if (value === null || value === undefined || value === '') return '—';

    switch (format) {
        case 'currency':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);

        case 'compact':
            if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
            if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
            if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
            if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
            return value.toLocaleString();

        case 'change':
            const sign = value >= 0 ? '+' : '';
            return `${sign}${value.toFixed(2)}`;

        case 'changePercent':
            const pSign = value >= 0 ? '+' : '';
            return `${pSign}${value.toFixed(2)}%`;

        case 'percent':
            if (typeof value === 'number') {
                return `${(value * 100).toFixed(2)}%`;
            }
            return '—';

        case 'decimal':
            return typeof value === 'number' ? value.toFixed(2) : '—';

        case 'number':
            return typeof value === 'number' ? value.toLocaleString() : '—';

        case 'rating':
            const ratings = {
                'buy': { label: 'Buy', color: '#10B981', bg: '#D1FAE5' },
                'strong_buy': { label: 'Strong Buy', color: '#059669', bg: '#A7F3D0' },
                'hold': { label: 'Hold', color: '#F59E0B', bg: '#FEF3C7' },
                'sell': { label: 'Sell', color: '#EF4444', bg: '#FEE2E2' },
                'strong_sell': { label: 'Strong Sell', color: '#DC2626', bg: '#FECACA' },
            };
            const rating = ratings[value?.toLowerCase()] || { label: value || '—', color: '#6B7280', bg: '#F3F4F6' };
            return rating;

        default:
            return String(value);
    }
};

// ============================================================================
// CSS ANIMATIONS
// ============================================================================

const animationStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .watchlist-row {
        animation: fadeInUp 0.3s ease-out forwards;
        opacity: 0;
    }
    .watchlist-row:nth-child(1) { animation-delay: 0.02s; }
    .watchlist-row:nth-child(2) { animation-delay: 0.04s; }
    .watchlist-row:nth-child(3) { animation-delay: 0.06s; }
    .watchlist-row:nth-child(4) { animation-delay: 0.08s; }
    .watchlist-row:nth-child(5) { animation-delay: 0.10s; }
    .watchlist-row:nth-child(6) { animation-delay: 0.12s; }
    .watchlist-row:nth-child(7) { animation-delay: 0.14s; }
    .watchlist-row:nth-child(8) { animation-delay: 0.16s; }
    .watchlist-row:nth-child(9) { animation-delay: 0.18s; }
    .watchlist-row:nth-child(10) { animation-delay: 0.20s; }
    .skeleton {
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
    }
    .refresh-spin {
        animation: spin 1s linear infinite;
    }
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminWatchlist() {
    // Market & Data State
    const [selectedMarket, setSelectedMarket] = useState('US');
    const [stocks, setStocks] = useState([]);
    const [stockDetails, setStockDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // View State
    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [showMarketDropdown, setShowMarketDropdown] = useState(false);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sectorFilter, setSectorFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' });

    // ========================================================================
    // DATA FETCHING
    // ========================================================================

    const fetchStocks = useCallback(async (market, showLoadingState = true) => {
        if (showLoadingState) setIsLoading(true);
        setError(null);

        try {
            const url = getEndpoint(`/api/stocks?market=${market}`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch stocks: ${response.status}`);
            }

            const data = await response.json();
            setStocks(data);
            setLastUpdated(new Date());

            // Fetch detailed profiles for all stocks
            fetchStockDetails(data.map(s => s.symbol));
        } catch (err) {
            console.error('Error fetching stocks:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const fetchStockDetails = async (symbols) => {
        // Fetch detailed data for up to 10 symbols at a time
        const batchSize = 5;
        const details = {};

        for (let i = 0; i < Math.min(symbols.length, 30); i += batchSize) {
            const batch = symbols.slice(i, i + batchSize);

            await Promise.all(batch.map(async (symbol) => {
                try {
                    const url = getEndpoint(`/api/stock-profile?symbol=${symbol}`);
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        details[symbol] = data;
                    }
                } catch (err) {
                    console.error(`Error fetching details for ${symbol}:`, err);
                }
            }));
        }

        setStockDetails(prev => ({ ...prev, ...details }));
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchStocks(selectedMarket, false);
    };

    // Initial fetch
    useEffect(() => {
        fetchStocks(selectedMarket);
    }, [selectedMarket, fetchStocks]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStocks(selectedMarket, false);
        }, 60000);

        return () => clearInterval(interval);
    }, [selectedMarket, fetchStocks]);

    // ========================================================================
    // DATA PROCESSING
    // ========================================================================

    // Merge stock data with detailed profiles
    const enrichedStocks = useMemo(() => {
        return stocks.map(stock => ({
            ...stock,
            ...(stockDetails[stock.symbol] || {}),
        }));
    }, [stocks, stockDetails]);

    // Get unique sectors for filter
    const sectors = useMemo(() => {
        const sectorSet = new Set(stocks.map(s => s.sector).filter(Boolean));
        return ['all', ...Array.from(sectorSet).sort()];
    }, [stocks]);

    // Filter and sort stocks
    const filteredStocks = useMemo(() => {
        let filtered = enrichedStocks;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.symbol?.toLowerCase().includes(query) ||
                s.name?.toLowerCase().includes(query)
            );
        }

        // Sector filter
        if (sectorFilter !== 'all') {
            filtered = filtered.filter(s => s.sector === sectorFilter);
        }

        // Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                if (typeof aVal === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }

                return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            });
        }

        return filtered;
    }, [enrichedStocks, searchQuery, sectorFilter, sortConfig]);

    // Column visibility helpers
    const visibleColumnConfigs = useMemo(() => {
        return ALL_COLUMNS.filter(c => visibleColumns.includes(c.key));
    }, [visibleColumns]);

    const toggleColumnGroup = (group) => {
        const groupColumns = ALL_COLUMNS.filter(c => c.group === group).map(c => c.key);
        const allVisible = groupColumns.every(c => visibleColumns.includes(c));

        if (allVisible) {
            setVisibleColumns(prev => prev.filter(c => !groupColumns.includes(c)));
        } else {
            setVisibleColumns(prev => [...new Set([...prev, ...groupColumns])]);
        }
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = visibleColumnConfigs.filter(c => c.format !== 'logo').map(c => c.label);
        const rows = filteredStocks.map(stock =>
            visibleColumnConfigs.filter(c => c.format !== 'logo').map(c => {
                const value = stock[c.key];
                if (value === null || value === undefined) return '';
                return String(value);
            })
        );

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `watchlist_${selectedMarket}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get current market info
    const currentMarket = MARKETS.find(m => m.id === selectedMarket) || MARKETS[0];

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div style={{ minHeight: '100%' }}>
            <style>{animationStyles}</style>

            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderRadius: '20px',
                padding: '1.5rem 2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                border: '1px solid #E2E8F0',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        }}>
                            <Star size={24} color="white" fill="white" />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                color: '#1E293B',
                                margin: 0,
                                letterSpacing: '-0.02em',
                            }}>
                                Watchlist
                            </h1>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748B',
                                margin: '0.25rem 0 0 0',
                            }}>
                                Real-time market data • {filteredStocks.length} stocks
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {lastUpdated && (
                            <span style={{
                                fontSize: '0.75rem',
                                color: '#94A3B8',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                            }}>
                                <Clock size={14} />
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1rem',
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#64748B',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'refresh-spin' : ''} />
                            Refresh
                        </button>

                        <button
                            onClick={exportToCSV}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1rem',
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#64748B',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <Download size={16} />
                            Export
                        </button>

                        <button
                            onClick={() => setShowColumnSettings(!showColumnSettings)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1rem',
                                background: showColumnSettings ? '#10B981' : 'white',
                                border: '1px solid',
                                borderColor: showColumnSettings ? '#10B981' : '#E2E8F0',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: showColumnSettings ? 'white' : '#64748B',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <Settings2 size={16} />
                            Columns
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    {/* Market Selector */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowMarketDropdown(!showMarketDropdown)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                padding: '0.625rem 1rem',
                                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: 'white',
                                cursor: 'pointer',
                                minWidth: '180px',
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{currentMarket.flag}</span>
                            <span>{currentMarket.name}</span>
                            <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
                        </button>

                        {showMarketDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '0.5rem',
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                border: '1px solid #E2E8F0',
                                zIndex: 100,
                                minWidth: '280px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                padding: '0.5rem',
                            }}>
                                {MARKETS.map(market => (
                                    <button
                                        key={market.id}
                                        onClick={() => {
                                            setSelectedMarket(market.id);
                                            setShowMarketDropdown(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: selectedMarket === market.id
                                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                                                : 'transparent',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '0.875rem',
                                            fontWeight: selectedMarket === market.id ? 700 : 500,
                                            color: selectedMarket === market.id ? '#10B981' : '#1E293B',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>{market.flag}</span>
                                        <span style={{ flex: 1 }}>{market.name}</span>
                                        {selectedMarket === market.id && (
                                            <Check size={16} color="#10B981" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.625rem 1rem',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        flex: 1,
                        maxWidth: '320px',
                    }}>
                        <Search size={18} color="#94A3B8" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: '0.875rem',
                                color: '#1E293B',
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                }}
                            >
                                <X size={16} color="#94A3B8" />
                            </button>
                        )}
                    </div>

                    {/* Sector Filter */}
                    <select
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        style={{
                            padding: '0.625rem 1rem',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#1E293B',
                            cursor: 'pointer',
                            minWidth: '140px',
                        }}
                    >
                        {sectors.map(sector => (
                            <option key={sector} value={sector}>
                                {sector === 'all' ? 'All Sectors' : sector}
                            </option>
                        ))}
                    </select>

                    {/* View Mode Toggle */}
                    <div style={{
                        display: 'flex',
                        background: '#F1F5F9',
                        borderRadius: '10px',
                        padding: '4px',
                    }}>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '32px',
                                background: viewMode === 'table' ? 'white' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                boxShadow: viewMode === 'table' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <List size={18} color={viewMode === 'table' ? '#10B981' : '#94A3B8'} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '32px',
                                background: viewMode === 'grid' ? 'white' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <Grid3X3 size={18} color={viewMode === 'grid' ? '#10B981' : '#94A3B8'} />
                        </button>
                    </div>
                </div>

                {/* Column Group Toggles */}
                {showColumnSettings && (
                    <div style={{
                        marginTop: '1.25rem',
                        padding: '1rem',
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#64748B',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            alignSelf: 'center',
                            marginRight: '0.5rem',
                        }}>
                            Column Groups:
                        </span>
                        {Object.entries(COLUMN_GROUPS).map(([groupKey, group]) => {
                            const GroupIcon = group.icon;
                            const groupColumns = ALL_COLUMNS.filter(c => c.group === groupKey).map(c => c.key);
                            const isActive = groupColumns.every(c => visibleColumns.includes(c));
                            const isPartial = groupColumns.some(c => visibleColumns.includes(c)) && !isActive;

                            return (
                                <button
                                    key={groupKey}
                                    onClick={() => toggleColumnGroup(groupKey)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: isActive ? group.color : isPartial ? `${group.color}15` : 'white',
                                        border: `1px solid ${isActive || isPartial ? group.color : '#E2E8F0'}`,
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: isActive ? 'white' : isPartial ? group.color : '#64748B',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <GroupIcon size={14} />
                                    {group.label}
                                    {isActive && <Check size={14} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
            }}>
                {isLoading ? (
                    // Loading State
                    <div style={{ padding: '2rem' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem 0',
                                borderBottom: '1px solid #F1F5F9',
                            }}>
                                <div className="skeleton" style={{ width: 40, height: 40 }} />
                                <div className="skeleton" style={{ width: 80, height: 20 }} />
                                <div className="skeleton" style={{ width: 150, height: 20 }} />
                                <div className="skeleton" style={{ width: 100, height: 20, marginLeft: 'auto' }} />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error State
                    <div style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                    }}>
                        <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1E293B', marginBottom: '0.5rem' }}>Failed to load data</h3>
                        <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>{error}</p>
                        <button
                            onClick={() => fetchStocks(selectedMarket)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#10B981',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : viewMode === 'table' ? (
                    // Table View
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                        }}>
                            <thead>
                                <tr>
                                    {visibleColumnConfigs.map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => col.sortable && handleSort(col.key)}
                                            style={{
                                                padding: '1rem',
                                                background: '#F8FAFC',
                                                borderBottom: '2px solid #E2E8F0',
                                                textAlign: col.format === 'logo' ? 'center' : 'left',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: sortConfig.key === col.key ? '#10B981' : '#64748B',
                                                cursor: col.sortable ? 'pointer' : 'default',
                                                whiteSpace: 'nowrap',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 10,
                                                minWidth: col.width,
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                justifyContent: col.format === 'logo' ? 'center' : 'flex-start',
                                            }}>
                                                {col.label}
                                                {col.sortable && sortConfig.key === col.key && (
                                                    <ArrowUpDown size={12} />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.map((stock, index) => (
                                    <tr
                                        key={stock.symbol}
                                        className="watchlist-row"
                                        style={{
                                            borderBottom: '1px solid #F1F5F9',
                                            transition: 'background 0.15s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {visibleColumnConfigs.map(col => (
                                            <td
                                                key={col.key}
                                                style={{
                                                    padding: '0.875rem 1rem',
                                                    fontSize: '0.875rem',
                                                    color: '#1E293B',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {renderCell(stock, col)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Grid View
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.25rem',
                        padding: '1.5rem',
                    }}>
                        {filteredStocks.map((stock, index) => (
                            <StockCard key={stock.symbol} stock={stock} />
                        ))}
                    </div>
                )}
            </div>

            {/* Click outside to close dropdowns */}
            {showMarketDropdown && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 50,
                    }}
                    onClick={() => setShowMarketDropdown(false)}
                />
            )}
        </div>
    );
}

// ============================================================================
// CELL RENDERER
// ============================================================================

function renderCell(stock, col) {
    const value = stock[col.key];

    switch (col.format) {
        case 'logo':
            return (
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                }}>
                    {stock.logo ? (
                        <img
                            src={stock.logo}
                            alt={stock.symbol}
                            style={{ width: 28, height: 28, objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div style={{
                        display: stock.logo ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#64748B',
                    }}>
                        {stock.symbol?.slice(0, 2)}
                    </div>
                </div>
            );

        case 'text':
            return (
                <span style={{ fontWeight: col.key === 'symbol' ? 700 : 400 }}>
                    {value || '—'}
                </span>
            );

        case 'badge':
            const sectorColors = SECTOR_COLORS[value] || SECTOR_COLORS.default;
            return value ? (
                <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.625rem',
                    background: sectorColors.bg,
                    color: sectorColors.text,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                }}>
                    {value}
                </span>
            ) : '—';

        case 'change':
        case 'changePercent':
            const isPositive = value >= 0;
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: isPositive ? '#D1FAE5' : '#FEE2E2',
                    color: isPositive ? '#059669' : '#DC2626',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                }}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {formatValue(value, col.format)}
                </span>
            );

        case 'rating':
            const rating = formatValue(value, 'rating');
            return (
                <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.625rem',
                    background: rating.bg,
                    color: rating.color,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                }}>
                    {rating.label}
                </span>
            );

        default:
            return formatValue(value, col.format);
    }
}

// ============================================================================
// STOCK CARD (Grid View)
// ============================================================================

function StockCard({ stock }) {
    const isPositive = (stock.changePercent || 0) >= 0;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    flexShrink: 0,
                }}>
                    {stock.logo ? (
                        <img src={stock.logo} alt={stock.symbol} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    ) : (
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B' }}>
                            {stock.symbol?.slice(0, 2)}
                        </span>
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E293B' }}>{stock.symbol}</div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: '#64748B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {stock.name}
                    </div>
                </div>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.625rem',
                    background: isPositive ? '#D1FAE5' : '#FEE2E2',
                    color: isPositive ? '#059669' : '#DC2626',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                }}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {formatValue(stock.changePercent, 'changePercent')}
                </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>
                    {formatValue(stock.price, 'currency')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    Vol: {formatValue(stock.volume, 'compact')}
                </div>
            </div>

            {/* Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid #F1F5F9',
            }}>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                        Mkt Cap
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                        {formatValue(stock.marketCap, 'compact')}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                        P/E
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                        {formatValue(stock.peRatio, 'decimal')}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                        Div Yield
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                        {formatValue(stock.dividendYield, 'percent')}
                    </div>
                </div>
            </div>
        </div>
    );
}
