import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, PieChart, ChevronRight, ArrowUpRight, ArrowDownRight,
    Edit2, Trash2, TrendingUp, TrendingDown, Activity, Layers, Wallet, MoreHorizontal,
    Share2, Download, ShieldCheck, Zap, AlertCircle
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ReTooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as ReRadar,
    ScatterChart, Scatter, ZAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { useMarket } from '../../context/MarketContext';
import { StockLogo } from '../../components/StockCard';
import { useToast } from '../../components/shared/Toast';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Tooltip from '../../components/shared/Tooltip';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

// Mock portfolio data
const INITIAL_HOLDINGS = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 175.00, currentPrice: 189.72, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 25, avgCost: 360.00, currentPrice: 378.91, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 30, avgCost: 135.00, currentPrice: 141.80, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, avgCost: 165.00, currentPrice: 178.25, sector: 'Consumer' },
    { symbol: 'JPM', name: 'JPMorgan Chase', shares: 40, avgCost: 145.00, currentPrice: 168.50, sector: 'Financial' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 35, avgCost: 158.00, currentPrice: 155.25, sector: 'Healthcare' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 10, avgCost: 450.00, currentPrice: 690.12, sector: 'Technology' },
];

// Mock Performance Data
const PERFORMANCE_DATA = [
    { date: 'Jan', value: 110000 },
    { date: 'Feb', value: 115000 },
    { date: 'Mar', value: 112000 },
    { date: 'Apr', value: 118000 },
    { date: 'May', value: 121000 },
    { date: 'Jun', value: 125847 },
];

const SECTOR_COLORS = {
    'Technology': '#0EA5E9',
    'Consumer': '#F59E0B',
    'Financial': '#10B981',
    'Healthcare': '#EF4444',
    'Energy': '#6366F1',
    'Other': '#94A3B8'
};

const COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

// Metric Calculation Helper
const calculateMetrics = (holdings) => {
    let totalValue = 0;
    let totalCost = 0;
    let maxGain = { symbol: '', amount: -Infinity };
    let maxLoss = { symbol: '', amount: Infinity };

    holdings.forEach(h => {
        const value = h.shares * h.currentPrice;
        const cost = h.shares * h.avgCost;
        const gain = value - cost;

        totalValue += value;
        totalCost += cost;

        if (gain > maxGain.amount) maxGain = { symbol: h.symbol, amount: gain, percent: (gain / cost) * 100 };
        if (gain < maxLoss.amount) maxLoss = { symbol: h.symbol, amount: gain, percent: (gain / cost) * 100 };
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    // Health Score based on diversity + performance (Mock logic)
    const uniqueSectors = new Set(holdings.map(h => h.sector)).size;
    const healthScore = Math.min(100, Math.max(0, 50 + (uniqueSectors * 10) + (totalGainPercent > 0 ? 10 : 0)));

    return { totalValue, totalCost, totalGain, totalGainPercent, maxGain, maxLoss, healthScore, uniqueSectors };
};

export default function InvestorPortfolio() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list' for diversity
    const [activeTab, setActiveTab] = useState('holdings'); // 'holdings', 'analysis'
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPosition, setNewPosition] = useState({ symbol: '', shares: '', avgCost: '' });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, symbol: null });

    const metrics = useMemo(() => calculateMetrics(holdings), [holdings]);

    // Sector Data for Pie Chart
    const sectorData = useMemo(() => {
        const allocation = {};
        holdings.forEach(h => {
            const value = h.shares * h.currentPrice;
            allocation[h.sector] = (allocation[h.sector] || 0) + value;
        });
        return Object.entries(allocation).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [holdings]);

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
            currentPrice: parseFloat(newPosition.avgCost) * 1.02, // Just a mock starter price
            sector: 'Other'
        }]);
        showToast(`${symbol} added!`, 'success');
        setShowAddModal(false);
        setNewPosition({ symbol: '', shares: '', avgCost: '' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>

            {/* --- Premium Header --- */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                padding: '1.5rem 1.5rem 2.5rem 1.5rem',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '12px', border: 'none', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>My Portfolio</div>
                    <button onClick={() => setShowAddModal(true)} style={{ background: '#10B981', padding: '0.6rem', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                        <Plus size={20} color="white" />
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Balance</div>
                    <div style={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.75rem', letterSpacing: '-1px' }}>
                        ${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                        {metrics.totalGain >= 0 ? <TrendingUp size={16} color="#4ade80" /> : <TrendingDown size={16} color="#f87171" />}
                        <span style={{ color: metrics.totalGain >= 0 ? '#4ade80' : '#f87171', fontWeight: 700 }}>
                            {metrics.totalGain >= 0 ? '+' : ''}{metrics.totalGainPercent.toFixed(2)}%
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            (${Math.abs(metrics.totalGain).toLocaleString()})
                        </span>
                    </div>
                </div>

                {/* Mini Performance Graph */}
                <div style={{ height: '60px', opacity: 0.8, marginBottom: '-1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
                {/* --- Quick Stats Grid --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Activity size={14} /> Health Score
                        </div>
                        <div className="flex-between">
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{metrics.healthScore}</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(#10b981 ${metrics.healthScore}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShieldCheck size={16} color="#10b981" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Layers size={14} /> Diversity
                        </div>
                        <div className="flex-between">
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{metrics.uniqueSectors}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>Sectors<br />Invested</div>
                        </div>
                    </Card>
                </div>

                {/* --- Tabs --- */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '0.3rem', display: 'flex', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    {['holdings', 'analysis'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: activeTab === tab ? '#0f172a' : 'transparent',
                                color: activeTab === tab ? 'white' : '#64748b',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'analysis' && (
                    <div className="animate-fade-in">
                        {/* --- 1. Portfolio DNA (Radar) --- */}
                        <Card style={{ padding: '1.5rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                    <Activity size={18} color="#8b5cf6" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Portfolio DNA</h3>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Style Analysis</div>
                            </div>
                            <div style={{ height: '260px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                        { subject: 'Growth', A: 120, fullMark: 150 },
                                        { subject: 'Value', A: 98, fullMark: 150 },
                                        { subject: 'Dividend', A: 86, fullMark: 150 },
                                        { subject: 'Momentum', A: 99, fullMark: 150 },
                                        { subject: 'Stability', A: 85, fullMark: 150 },
                                        { subject: 'ESG', A: 65, fullMark: 150 },
                                    ]}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                                        <ReRadar
                                            name="My Portfolio"
                                            dataKey="A"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            fill="#8b5cf6"
                                            fillOpacity={0.3}
                                        />
                                        <ReTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                                Your portfolio leans heavily towards <span style={{ color: '#8b5cf6', fontWeight: 700 }}>Growth</span> & <span style={{ color: '#8b5cf6', fontWeight: 700 }}>Momentum</span>.
                            </div>
                        </Card>

                        {/* --- 2. Allocation & Performers --- */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <Card style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>Sector Allocation</h3>
                                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={sectorData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {sectorData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ReTooltip
                                                formatter={(value) => `$${value.toLocaleString()}`}
                                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', padding: '10px' }}
                                                itemStyle={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}
                                                labelStyle={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                                    {sectorData.map((sector, i) => (
                                        <div key={sector.name} className="flex-between" style={{ fontSize: '0.85rem' }}>
                                            <div className="flex-center" style={{ gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                                <span style={{ color: '#475569', fontWeight: 500 }}>{sector.name}</span>
                                            </div>
                                            <span style={{ fontWeight: 700, color: '#1e293b' }}>
                                                {((sector.value / metrics.totalValue) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* --- 3. Risk vs Reward (Scatter) --- */}
                        <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                    <Zap size={18} color="#f59e0b" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Risk vs Reward Efficiency</h3>
                                </div>
                            </div>
                            <div style={{ height: '250px', marginLeft: '-20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" dataKey="risk" name="Risk (Beta)" unit="β" tick={{ fontSize: 10 }} domain={[0.5, 2.0]} />
                                        <YAxis type="number" dataKey="return" name="Return" unit="%" tick={{ fontSize: 10 }} />
                                        <ReTooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Holdings" data={holdings.map(h => ({
                                            risk: Math.random() * 1.5 + 0.5, // Mock Beta
                                            return: ((h.currentPrice - h.avgCost) / h.avgCost) * 100,
                                            name: h.symbol
                                        }))} fill="#f59e0b">
                                            {holdings.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#3b82f6'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '10px' }}>
                                * Measures holding return against volatility (Beta). Ideally, high-risk assets should yield high returns (Top-Right).
                            </div>
                        </Card>

                        {/* --- 4. Projected Income (Bar) --- */}
                        <Card style={{ padding: '1.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div className="flex-center" style={{ gap: '0.5rem' }}>
                                    <TrendingUp size={18} color="#10b981" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Projected Income (2025)</h3>
                                </div>
                            </div>
                            <div style={{ height: '200px', marginLeft: '-20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { month: 'Q1', amount: 120 }, { month: 'Q2', amount: 145 }, { month: 'Q3', amount: 130 }, { month: 'Q4', amount: 160 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <ReTooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none' }}
                                        />
                                        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'holdings' && (
                    <div className="animate-slide-up">
                        {holdings.map((h, i) => {
                            const value = h.shares * h.currentPrice;
                            const gain = value - (h.shares * h.avgCost);
                            const gainP = (gain / (h.shares * h.avgCost)) * 100;
                            const isPos = gain >= 0;

                            return (
                                <div
                                    key={i}
                                    onClick={() => navigate(`/company/${h.symbol}`)}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '1.25rem',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        border: '1px solid rgba(0,0,0,0.02)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <StockLogo ticker={h.symbol} size={48} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{h.symbol}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{h.shares} shares @ ${h.avgCost}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            color: isPos ? '#10b981' : '#ef4444',
                                            fontWeight: 700, background: isPos ? '#dcfce7' : '#fee2e2',
                                            padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', marginTop: '4px'
                                        }}>
                                            {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {gainP.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Button at bottom list */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '16px',
                                color: '#64748b', fontWeight: 700, background: 'transparent',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            <Plus size={20} /> Add Manual Position
                        </button>
                    </div>
                )}
            </div>

            {/* --- Modals Component Reuse --- */}
            {showAddModal && (
                <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div onClick={e => e.stopPropagation()} className="animate-slide-up" style={{ background: 'white', width: '100%', borderRadius: '32px 32px 0 0', padding: '2rem' }}>
                        <h3 className="h3" style={{ marginBottom: '1.5rem' }}>Add New Holding</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }} placeholder="Symbol (e.g. AAPL)" value={newPosition.symbol} onChange={e => setNewPosition({ ...newPosition, symbol: e.target.value })} />
                            <input style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }} type="number" placeholder="Shares" value={newPosition.shares} onChange={e => setNewPosition({ ...newPosition, shares: e.target.value })} />
                            <input style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }} type="number" placeholder="Avg Cost ($)" value={newPosition.avgCost} onChange={e => setNewPosition({ ...newPosition, avgCost: e.target.value })} />
                            <button className="btn-primary" onClick={handleAddPosition} style={{ marginTop: '1rem' }}>Add to Portfolio</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Remove Position"
                message={`Remove ${confirmModal.symbol}?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmModal({ isOpen: false, symbol: null })}
            />
        </div>
    );
}
