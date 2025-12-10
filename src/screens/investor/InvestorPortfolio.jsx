import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, PieChart, ChevronRight, ArrowUpRight, ArrowDownRight,
    Edit2, Trash2, TrendingUp
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { StockLogo } from '../../components/StockCard';
import { useToast } from '../../components/shared/Toast';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Tooltip from '../../components/shared/Tooltip';

// Mock portfolio data
const INITIAL_HOLDINGS = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 175.00, currentPrice: 189.72, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 25, avgCost: 360.00, currentPrice: 378.91, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 30, avgCost: 135.00, currentPrice: 141.80, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, avgCost: 165.00, currentPrice: 178.25, sector: 'Consumer' },
    { symbol: 'JPM', name: 'JPMorgan Chase', shares: 40, avgCost: 145.00, currentPrice: 168.50, sector: 'Financial' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 35, avgCost: 158.00, currentPrice: 155.25, sector: 'Healthcare' },
];

// Calculate portfolio metrics
const calculateMetrics = (holdings) => {
    let totalValue = 0;
    let totalCost = 0;

    holdings.forEach(h => {
        totalValue += h.shares * h.currentPrice;
        totalCost += h.shares * h.avgCost;
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    return { totalValue, totalCost, totalGain, totalGainPercent };
};

function HoldingRow({ holding, onClick, onEdit, onDelete }) {
    const marketValue = holding.shares * holding.currentPrice;
    const costBasis = holding.shares * holding.avgCost;
    const gain = marketValue - costBasis;
    const gainPercent = costBasis > 0 ? ((marketValue - costBasis) / costBasis) * 100 : 0;
    const isPositive = gain >= 0;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: 'white',
                borderRadius: '12px',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                border: '1px solid #E5E7EB',
                transition: 'all 0.2s',
            }}
        >
            {/* Logo & Symbol */}
            <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <StockLogo ticker={holding.symbol} size={44} />
                <div>
                    <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                        {holding.symbol}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {holding.shares} shares @ ${holding.avgCost.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Market Value */}
            <div onClick={onClick} style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                    ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    color: isPositive ? '#10B981' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '2px',
                }}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isPositive ? '+' : ''}{gainPercent.toFixed(2)}%
                </div>
            </div>

            <ChevronRight size={18} color="#9CA3AF" />
        </div>
    );
}

export default function InvestorPortfolio() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
    const [sortBy, setSortBy] = useState('value');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPosition, setNewPosition] = useState({ symbol: '', shares: '', avgCost: '' });

    // Confirmation modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, symbol: null });

    const metrics = calculateMetrics(holdings);

    // Sort holdings
    const sortedHoldings = [...holdings].sort((a, b) => {
        if (sortBy === 'value') {
            return (b.shares * b.currentPrice) - (a.shares * a.currentPrice);
        } else if (sortBy === 'gain') {
            const gainA = ((a.currentPrice - a.avgCost) / a.avgCost) * 100;
            const gainB = ((b.currentPrice - b.avgCost) / b.avgCost) * 100;
            return gainB - gainA;
        }
        return a.symbol.localeCompare(b.symbol);
    });

    // Group by sector for pie chart
    const sectorAllocation = {};
    holdings.forEach(h => {
        const value = h.shares * h.currentPrice;
        sectorAllocation[h.sector] = (sectorAllocation[h.sector] || 0) + value;
    });

    const sectorColors = {
        'Technology': '#0EA5E9',
        'Consumer': '#F59E0B',
        'Financial': '#10B981',
        'Healthcare': '#EF4444',
    };

    const handleDeleteClick = (symbol) => {
        setConfirmModal({ isOpen: true, symbol });
    };

    const handleConfirmDelete = () => {
        const { symbol } = confirmModal;
        setHoldings(prev => prev.filter(h => h.symbol !== symbol));
        showToast(`${symbol} removed from portfolio`, 'success');
        setConfirmModal({ isOpen: false, symbol: null });
    };

    const handleAddPosition = () => {
        if (!newPosition.symbol || !newPosition.shares || !newPosition.avgCost) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        const symbol = newPosition.symbol.toUpperCase();
        if (holdings.find(h => h.symbol === symbol)) {
            showToast(`${symbol} is already in your portfolio`, 'warning');
            return;
        }

        setHoldings(prev => [...prev, {
            symbol,
            name: symbol,
            shares: parseFloat(newPosition.shares),
            avgCost: parseFloat(newPosition.avgCost),
            currentPrice: parseFloat(newPosition.avgCost) * 1.05, // Mock current price
            sector: 'Other'
        }]);

        showToast(`${symbol} added to portfolio!`, 'success');
        setShowAddModal(false);
        setNewPosition({ symbol: '', shares: '', avgCost: '' });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #06B6D4 100%)',
                padding: '1rem 1rem 2rem 1rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                }}>
                    <Tooltip text="Go back">
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
                    </Tooltip>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>
                        Portfolio
                    </h1>
                    <Tooltip text="Add a new position">
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
                    </Tooltip>
                </div>

                {/* Portfolio Value */}
                <div style={{ color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                        Total Portfolio Value
                    </div>
                    <Tooltip text="Combined value of all your holdings" position="bottom">
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                            ${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </Tooltip>
                    <Tooltip text={`Total profit/loss since purchase: $${Math.abs(metrics.totalGain).toFixed(2)}`} position="bottom">
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem 0.75rem',
                            background: metrics.totalGain >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            borderRadius: '999px',
                            cursor: 'help',
                        }}>
                            {metrics.totalGain >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span style={{ fontWeight: 700 }}>
                                ${Math.abs(metrics.totalGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span style={{ opacity: 0.9 }}>
                                ({metrics.totalGain >= 0 ? '+' : ''}{metrics.totalGainPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </Tooltip>
                </div>
            </div>

            {/* Sector Allocation */}
            <div style={{
                margin: '-1rem 1rem 1rem 1rem',
                background: 'white',
                borderRadius: '16px',
                padding: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={18} color="#0EA5E9" />
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                            Sector Allocation
                        </h3>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {Object.entries(sectorAllocation).map(([sector, value]) => {
                        const percent = (value / metrics.totalValue) * 100;
                        return (
                            <Tooltip key={sector} text={`${sector}: $${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.625rem',
                                    background: '#F3F4F6',
                                    borderRadius: '999px',
                                    cursor: 'help',
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: sectorColors[sector] || '#6B7280',
                                    }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B5563' }}>
                                        {sector}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                        {percent.toFixed(0)}%
                                    </span>
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>

            {/* Sort Options */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem 0.75rem 1rem',
            }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                    Holdings ({holdings.length})
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '0.8rem',
                        color: '#4B5563',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <option value="value">By Value</option>
                    <option value="gain">By Gain %</option>
                    <option value="name">By Name</option>
                </select>
            </div>

            {/* Holdings List */}
            <div style={{ padding: '0 1rem' }}>
                {sortedHoldings.map(holding => (
                    <HoldingRow
                        key={holding.symbol}
                        holding={holding}
                        onClick={() => navigate(`/company/${holding.symbol}`)}
                        onDelete={() => handleDeleteClick(holding.symbol)}
                    />
                ))}
            </div>

            {/* Add Position Modal */}
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
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '4px',
                            background: '#E5E7EB',
                            borderRadius: '2px',
                            margin: '0 auto 1rem',
                        }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            Add Position
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.375rem', color: '#4B5563' }}>
                                Stock Symbol
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., AAPL"
                                value={newPosition.symbol}
                                onChange={(e) => setNewPosition(p => ({ ...p, symbol: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.375rem', color: '#4B5563' }}>
                                Number of Shares
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 50"
                                value={newPosition.shares}
                                onChange={(e) => setNewPosition(p => ({ ...p, shares: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.375rem', color: '#4B5563' }}>
                                Average Cost per Share ($)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 175.00"
                                value={newPosition.avgCost}
                                onChange={(e) => setNewPosition(p => ({ ...p, avgCost: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <button
                            onClick={handleAddPosition}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Add Position
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Remove Position?"
                message={`Are you sure you want to remove ${confirmModal.symbol} from your portfolio?`}
                confirmText="Remove"
                confirmType="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModal({ isOpen: false, symbol: null })}
            />
        </div>
    );
}
