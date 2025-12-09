import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, TrendingUp, TrendingDown, ArrowLeft, Plus, MoreVertical,
    PieChart, BarChart3, ChevronRight, DollarSign, ArrowUpRight, ArrowDownRight,
    Filter, Settings, Edit2, Trash2, Eye, EyeOff
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';
import BurgerMenu from '../../components/BurgerMenu';

// Mock portfolio data
const PORTFOLIO_HOLDINGS = [
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
    const totalGainPercent = ((totalValue - totalCost) / totalCost) * 100;

    return { totalValue, totalCost, totalGain, totalGainPercent };
};

function HoldingRow({ holding, onClick }) {
    const marketValue = holding.shares * holding.currentPrice;
    const costBasis = holding.shares * holding.avgCost;
    const gain = marketValue - costBasis;
    const gainPercent = ((marketValue - costBasis) / costBasis) * 100;
    const isPositive = gain >= 0;

    return (
        <div
            onClick={onClick}
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
            {/* Symbol & Name */}
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                    {holding.symbol}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {holding.shares} shares @ ${holding.avgCost.toFixed(2)}
                </div>
            </div>

            {/* Market Value */}
            <div style={{ textAlign: 'right', marginRight: '1rem' }}>
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
    const { market } = useMarket();
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'chart'
    const [sortBy, setSortBy] = useState('value'); // 'value', 'gain', 'name'

    const metrics = calculateMetrics(PORTFOLIO_HOLDINGS);

    // Sort holdings
    const sortedHoldings = [...PORTFOLIO_HOLDINGS].sort((a, b) => {
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
    PORTFOLIO_HOLDINGS.forEach(h => {
        const value = h.shares * h.currentPrice;
        sectorAllocation[h.sector] = (sectorAllocation[h.sector] || 0) + value;
    });

    const sectorColors = {
        'Technology': '#0EA5E9',
        'Consumer': '#F59E0B',
        'Financial': '#10B981',
        'Healthcare': '#EF4444',
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
                        Portfolio
                    </h1>
                    <button style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.625rem',
                        cursor: 'pointer',
                    }}>
                        <Plus size={20} color="white" />
                    </button>
                </div>

                {/* Portfolio Value */}
                <div style={{ color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                        Total Portfolio Value
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                        ${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.75rem',
                        background: metrics.totalGain >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '999px',
                    }}>
                        {metrics.totalGain >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span style={{ fontWeight: 700 }}>
                            ${Math.abs(metrics.totalGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span style={{ opacity: 0.9 }}>
                            ({metrics.totalGain >= 0 ? '+' : ''}{metrics.totalGainPercent.toFixed(2)}%)
                        </span>
                    </div>
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
                            <div key={sector} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.375rem 0.625rem',
                                background: '#F3F4F6',
                                borderRadius: '999px',
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
                    Holdings ({PORTFOLIO_HOLDINGS.length})
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
                    />
                ))}
            </div>
        </div>
    );
}
