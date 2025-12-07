import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, TrendingUp, TrendingDown, Star, Share2, Plus, Bell,
    BarChart3, DollarSign, PieChart, Target, Building2, Globe, ChevronRight,
    Users, MessageCircle, Heart, Repeat2, Info, X
} from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import { StockLogo, SAUDI_STOCKS } from '../components/StockCard';
import ProgressBar from '../components/ProgressBar';
import StockMovementCard from '../components/StockMovementCard';

// Static content (news, posts) - these would come from a content API in production
const STATIC_CONTENT = {
    '2222': {
        news: [
            {
                title: "Aramco's First Quarterly Dividend Gain in Breaks Billions",
                time: '2h ago',
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
            },
            {
                title: "Aramco strikes capital deal to open Paris office",
                time: '5h ago',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Ahmed Al-Saud',
                avatar: 'https://i.pravatar.cc/150?img=12',
                time: '2h ago',
                content: 'Aramco looking strong! Great dividend yield and solid fundamentals. 🚀',
                likes: 24,
                comments: 5,
                shares: 2
            },
        ],
    },
    '1120': {
        news: [
            {
                title: "Al Rajhi Bank Reports Strong Q4 Earnings",
                time: '1h ago',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop'
            },
        ],
        communityPosts: [
            {
                user: 'Mohammed Investor',
                avatar: 'https://i.pravatar.cc/150?img=8',
                time: '1h ago',
                content: 'Al Rajhi continues to dominate Islamic banking. Strong results! 💪',
                likes: 42,
                comments: 12,
                shares: 5
            }
        ],
    }
};

// Format helpers - always 2 decimal places
const formatNumber = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    if (typeof val === 'string') return val;
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
    return Number(val).toFixed(2);
};

const formatPercent = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    return (val * 100).toFixed(2) + '%';
};

const formatCurrency = (val) => {
    if (!val || val === 'N/A') return 'N/A';
    return formatNumber(val) + ' SAR';
};

const formatPrice = (val) => {
    if (!val && val !== 0) return 'N/A';
    return Number(val).toFixed(2);
};

export default function CompanyProfile() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const { prices, loading } = usePrices();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get real-time stock data from API
    // Get real-time stock data from API
    const stockKey = Object.keys(prices).find(k => k === symbol || k.split('.')[0] === symbol) || `${symbol}.SR`;
    const stock = prices[stockKey] || {};
    const stockMeta = SAUDI_STOCKS[symbol] || {};
    const staticContent = STATIC_CONTENT[symbol] || {};

    const isPositive = (stock.change || stock.changePercent || 0) >= 0;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'valuation', label: 'Valuation', icon: PieChart },
        { id: 'analysts', label: 'Analysts', icon: Target },
        { id: 'about', label: 'About', icon: Building2 },
    ];

    // Tooltip component
    const TooltipIcon = ({ id, content, title, icon, color = '#94a3b8' }) => {
        const tooltipContent = activeTooltip === id && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1rem',
                backdropFilter: 'blur(4px)'
            }} onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(null);
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    maxWidth: '320px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative',
                    width: '100%'
                }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setActiveTooltip(null)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <div style={{ textAlign: 'center' }}>
                        {icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>}
                        {title && <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>{title}</h2>}
                        <div style={{
                            fontSize: '0.9375rem',
                            lineHeight: 1.6,
                            color: '#4b5563'
                        }}>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip(activeTooltip === id ? null : id);
                    }}
                    style={{
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.7,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '4px'
                    }}
                >
                    <Info size={14} color={color} />
                </div>
                {tooltipContent && ReactDOM.createPortal(tooltipContent, document.body)}
            </>
        );
    };

    // Helper to inject tooltip into Card title
    const CardTitleWithTooltip = ({ title, tooltipId, tooltipContent, tooltipIcon, icon }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon}
            <span>{title}</span>
            <TooltipIcon id={tooltipId} title={title} content={tooltipContent} icon={tooltipIcon} />
        </div>
    );

    if (loading && !stock.price) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#1f2937', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p>Loading stock data...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Premium Header with Gradient */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #0891b2 50%, #6366f1 100%)',
                padding: '1.5rem',
                paddingTop: '2rem',
                paddingBottom: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.5
                }} />

                {/* Navigation Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setIsWatchlisted(!isWatchlisted)}
                            style={{
                                background: isWatchlisted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Star size={20} color="white" fill={isWatchlisted ? 'white' : 'none'} />
                        </button>
                        <button
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Share2 size={20} color="white" />
                        </button>
                    </div>
                </div>

                {/* Company Info */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '60px', height: '60px',
                            background: 'white',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden'
                        }}>
                            <StockLogo ticker={symbol.split('.')[0]} logoUrl={stock.logo} size={52} />
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600 }}>
                                {stockKey}
                            </div>
                            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                {stockMeta.name || stock.name || stock.longName || symbol}
                            </h1>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                            {formatPrice(stock.price)} <span style={{ fontSize: '1.25rem', opacity: 0.8 }}>SAR</span>
                        </div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.75rem',
                            padding: '0.5rem 1rem',
                            background: isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {isPositive ? '+' : ''}{formatPrice(stock.change)} ({isPositive ? '+' : ''}{formatPrice(stock.changePercent)}%)
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        marginTop: '1.5rem'
                    }}>
                        <button
                            onClick={() => navigate('/pick')}
                            style={{
                                background: 'white',
                                color: '#10b981',
                                border: 'none',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Plus size={18} />
                            Pick Stock
                        </button>
                        <button
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '2px solid white',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Bell size={18} />
                            Set Alert
                        </button>
                    </div>
                </div>
            </div>

            {/* Modern Pill Tabs */}
            <div style={{
                margin: '-1.5rem 1rem 0',
                background: 'white',
                borderRadius: '16px',
                padding: '0.5rem',
                display: 'flex',
                gap: '0.25rem',
                overflowX: 'auto',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
            }}>
                <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 0.5rem',
                                background: isActive ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'transparent',
                                border: 'none',
                                borderRadius: '12px',
                                color: isActive ? 'white' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                transition: 'all 0.2s',
                                minWidth: 'fit-content'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1.5rem', paddingBottom: '6rem' }}>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* AI Insight Card - Highlights the "Why is this moving?" */}
                        <StockMovementCard symbol={symbol} />

                        {/* Trading Info */}
                        <Card title={<CardTitleWithTooltip title="Trading Information" tooltipId="trading" tooltipIcon="📊" tooltipContent="Key trading data for the current session, including opening price, highs, lows, and volume traded." icon={<BarChart3 size={20} />} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Open" value={formatPrice(stock.open) + ' SAR'} />
                                <DataCell label="Previous Close" value={formatPrice(stock.prevClose) + ' SAR'} />
                                <DataCell label="Day High" value={formatPrice(stock.high) + ' SAR'} />
                                <DataCell label="Day Low" value={formatPrice(stock.low) + ' SAR'} />
                                <DataCell label="Volume" value={formatNumber(stock.volume)} />
                                <DataCell label="Avg Volume" value={formatNumber(stock.averageVolume)} />
                            </div>
                        </Card>

                        {/* 52-Week Range */}
                        <Card title={<CardTitleWithTooltip title="52-Week Range" tooltipId="52w" tooltipIcon="📅" tooltipContent="The lowest and highest price at which this stock has traded in the previous 52 weeks." />}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.875rem' }}>
                                        {formatPrice(stock.fiftyTwoWeekLow)}
                                    </span>
                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>
                                        {formatPrice(stock.fiftyTwoWeekHigh)}
                                    </span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)',
                                        borderRadius: '10px',
                                        width: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100))}%`
                                            : '50%'
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        left: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100))}%`
                                            : '50%',
                                        top: '-2px',
                                        width: '14px', height: '14px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        border: '3px solid #10b981',
                                        transform: 'translateX(-50%)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="50-Day MA" value={formatPrice(stock.fiftyDayAverage)} />
                                <DataCell label="200-Day MA" value={formatPrice(stock.twoHundredDayAverage)} />
                                <DataCell label="52-Week Change" value={formatPercent(stock.fiftyTwoWeekChange)} highlight />
                                <DataCell label="Beta" value={formatPrice(stock.beta)} />
                            </div>
                        </Card>

                        {/* Key Statistics Quick View */}
                        <Card title={<CardTitleWithTooltip title="Key Statistics" tooltipId="keystats" tooltipIcon="🔑" tooltipContent="Essential financial metrics. Market Cap is total value. P/E Ratio measures valuation. Dividend Yield is the return on investment from dividends." />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Market Cap" value={formatCurrency(stock.marketCap)} highlight />
                                <DataCell label="P/E Ratio" value={formatPrice(stock.trailingPE || stock.peRatio)} />
                                <DataCell label="EPS" value={formatPrice(stock.trailingEps || stock.eps) + ' SAR'} />
                                <DataCell label="Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield || stock.dividendYield)} highlight />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Financials Tab */}
                {activeTab === 'financials' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title={<CardTitleWithTooltip title="Revenue & Profitability" tooltipId="revenue" tooltipIcon="💰" tooltipContent="Revenue is the total income. EBITDA is earnings before interest, taxes, depreciation, and amortization. Net Income is the final profit." icon={<DollarSign size={20} />} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Total Revenue" value={formatCurrency(stock.totalRevenue)} highlight />
                                <DataCell label="Revenue Per Share" value={formatPrice(stock.revenuePerShare) + ' SAR'} />
                                <DataCell label="Revenue Growth" value={formatPercent(stock.revenueGrowth)} />
                                <DataCell label="Gross Profits" value={formatCurrency(stock.grossProfits)} />
                                <DataCell label="EBITDA" value={formatCurrency(stock.ebitda)} highlight />
                                <DataCell label="Net Income" value={formatCurrency(stock.netIncomeToCommon)} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Profit Margins" tooltipId="margins" tooltipIcon="📉" tooltipContent="Margins represent the percentage of revenue that becomes profit at different stages. Higher margins generally indicate better efficiency." />}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <ProgressBar label="Profit Margin" value={stock.profitMargins} color="#10b981" />
                                <ProgressBar label="Gross Margin" value={stock.grossMargins} color="#3b82f6" />
                                <ProgressBar label="Operating Margin" value={stock.operatingMargins} color="#8b5cf6" />
                                <ProgressBar label="EBITDA Margin" value={stock.ebitdaMargins} color="#f59e0b" />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Cash Flow" tooltipId="cashflow" tooltipIcon="💸" tooltipContent="Operating Cash Flow is cash from normal business. Free Cash Flow is cash available after capital expenditures. Total Cash is current cash holdings." />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Operating Cash Flow" value={formatCurrency(stock.operatingCashflow)} />
                                <DataCell label="Free Cash Flow" value={formatCurrency(stock.freeCashflow)} highlight />
                                <DataCell label="Total Cash" value={formatCurrency(stock.totalCash)} />
                                <DataCell label="Cash Per Share" value={formatPrice(stock.totalCashPerShare) + ' SAR'} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Balance Sheet" tooltipId="balancesheet" tooltipIcon="📄" tooltipContent="A snapshot of a company's financial health. Total Debt indicates liabilities, while Book Value represents the equity value per share." />}>
                            <SimpleBarChart
                                data={[
                                    { label: 'Total Cash', value: stock.totalCash || 0, displayValue: formatNumber(stock.totalCash), color: '#10b981' },
                                    { label: 'Total Debt', value: stock.totalDebt || 0, displayValue: formatNumber(stock.totalDebt), color: '#ef4444' }
                                ]}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <DataCell label="Total Debt" value={formatCurrency(stock.totalDebt)} />
                                <DataCell label="Debt to Equity" value={formatPrice(stock.debtToEquity) + '%'} />
                                <DataCell label="Current Ratio" value={formatPrice(stock.currentRatio)} />
                                <DataCell label="Book Value" value={formatPrice(stock.bookValue) + ' SAR'} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Valuation Tab */}
                {activeTab === 'valuation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title={<CardTitleWithTooltip title="Valuation Metrics" tooltipId="valuation" tooltipIcon="⚖️" tooltipContent="Metrics to evaluate if a stock is overvalued or undervalued. P/E and EV/EBITDA are common multiples used for comparison." icon={<PieChart size={20} />} />}>
                            {/* P/E Comparison Visualization */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>P/E Ratio vs Market Avg</div>
                                <div style={{ height: '40px', background: '#f1f5f9', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    {/* Market Avg Marker (approx 20) */}
                                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#94a3b8', zIndex: 1 }}></div>
                                    <div style={{ position: 'absolute', left: '50%', top: '-20px', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#64748b' }}>Mkt: 20x</div>

                                    {/* Stock P/E Bar */}
                                    <div style={{
                                        width: `${Math.min(100, ((stock.trailingPE || 0) / 40) * 100)}%`,
                                        height: '24px',
                                        background: (stock.trailingPE || 0) > 20 ? '#ef4444' : '#10b981',
                                        borderRadius: '0 4px 4px 0',
                                        marginLeft: '0',
                                        transition: 'width 1s ease'
                                    }} />
                                    <div style={{ marginLeft: '10px', fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                                        {formatPrice(stock.trailingPE)}x
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Market Cap" value={formatCurrency(stock.marketCap)} highlight />
                                <DataCell label="Enterprise Value" value={formatCurrency(stock.enterpriseValue)} />
                                <DataCell label="Trailing P/E" value={formatPrice(stock.trailingPE)} />
                                <DataCell label="Forward P/E" value={formatPrice(stock.forwardPE)} highlight />
                                <DataCell label="Price to Book" value={formatPrice(stock.priceToBook)} />
                                <DataCell label="EV/EBITDA" value={formatPrice(stock.enterpriseToEbitda)} />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Earnings Per Share" tooltipId="eps" tooltipIcon="📈" tooltipContent="EPS indicates a company's profitability. Higher EPS and earnings growth are generally positive signs." />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Trailing EPS" value={formatPrice(stock.trailingEps) + ' SAR'} highlight />
                                <DataCell label="Forward EPS" value={formatPrice(stock.forwardEps) + ' SAR'} />
                                <DataCell label="Earnings Growth" value={formatPercent(stock.earningsGrowth)} />
                                <DataCell label="ROE" value={formatPercent(stock.returnOnEquity)} highlight />
                            </div>
                        </Card>

                        <Card title={<CardTitleWithTooltip title="Dividends" tooltipId="dividends" tooltipIcon="💸" tooltipContent="Information on dividend payments. Dividend Yield is the annual dividend income relative to the stock's price." />}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '4px solid #10b981',
                                    fontSize: '1rem', fontWeight: 800, color: '#10b981'
                                }}>
                                    {formatPercent(stock.trailingAnnualDividendYield).replace('%', '')}<span style={{ fontSize: '0.6rem' }}>%</span>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#166534' }}>Annual Yield</div>
                                    <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                                        Pays {formatPrice(stock.trailingAnnualDividendRate)} SAR per share
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Dividend Rate" value={formatPrice(stock.trailingAnnualDividendRate) + ' SAR'} />
                                <DataCell label="Payout Ratio" value={formatPercent(stock.payoutRatio)} />
                                <DataCell label="Last Dividend" value={formatPrice(stock.lastDividendValue) + ' SAR'} />
                                <DataCell label="Ex-Div Date" value={stock.exDividendDate ? new Date(stock.exDividendDate * 1000).toLocaleDateString() : 'N/A'} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Analysts Tab */}
                {activeTab === 'analysts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Recommendation Gauge */}
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>
                                Analyst Consensus
                            </div>

                            <TechnicalGauge
                                value={stock.recommendationMean || 3}
                                inverse={true} // For Yahoo, 1 is Buy, 5 is Sell
                                label={stock.recommendationKey?.replace('_', ' ').toUpperCase() || 'NEUTRAL'}
                            />

                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem' }}>
                                Based on {stock.numberOfAnalystOpinions || 0} analysts
                            </div>
                        </div>

                        {/* Recommendation Breakdown */}
                        {stock.recommendationTrend && stock.recommendationTrend[0] && (
                            <Card title={<CardTitleWithTooltip title="Recommendation Breakdown" tooltipId="rec_breakdown" tooltipIcon="📊" tooltipContent="Distribution of analyst recommendations. Shows how many analysts rate the stock as Buy, Hold, or Sell." />}>
                                <div style={{ display: 'flex', gap: '0.5rem', height: '160px', alignItems: 'flex-end', paddingTop: '20px' }}>
                                    {[
                                        { label: 'Strong Buy', key: 'strongBuy', color: '#10b981' },
                                        { label: 'Buy', key: 'buy', color: '#34d399' },
                                        { label: 'Hold', key: 'hold', color: '#94a3b8' },
                                        { label: 'Sell', key: 'sell', color: '#f87171' },
                                        { label: 'Strong Sell', key: 'strongSell', color: '#ef4444' }
                                    ].map(item => {
                                        const val = stock.recommendationTrend[0][item.key] || 0;
                                        const max = Math.max(...Object.values(stock.recommendationTrend[0]).filter(v => typeof v === 'number'));
                                        const height = max > 0 ? (val / max) * 100 : 0;

                                        return (
                                            <div key={item.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1rem', color: item.color, marginBottom: '4px' }}>{val}</div>
                                                <div style={{
                                                    width: '40%',
                                                    minWidth: '20px',
                                                    height: `${Math.max(height, 2)}%`,
                                                    background: item.color,
                                                    borderRadius: '8px 8px 8px 8px',
                                                    opacity: 1,
                                                    transition: 'height 0.5s ease'
                                                }} />
                                                <div style={{ fontSize: '0.625rem', color: '#64748b', fontWeight: 600, textAlign: 'center', lineHeight: 1.2, marginTop: '4px' }}>
                                                    {item.label.replace(' ', '\n')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        {/* Price Targets Chart */}
                        <Card title={<CardTitleWithTooltip title="Price Targets" tooltipId="targets" tooltipIcon="🎯" tooltipContent="Analyst price targets for the next 12 months. Shows the Low, Average (Mean), and High price predictions compared to the current price." icon={<Target size={20} />} />}>
                            <PriceTargetChart
                                current={stock.price}
                                low={stock.targetLowPrice}
                                mean={stock.targetMeanPrice}
                                high={stock.targetHighPrice}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <DataCell label="Current Price" value={formatPrice(stock.price) + ' SAR'} />
                                <DataCell label="Target Mean" value={formatPrice(stock.targetMeanPrice) + ' SAR'} highlight />
                                <DataCell label="Target High" value={formatPrice(stock.targetHighPrice) + ' SAR'} />
                                <DataCell label="Target Low" value={formatPrice(stock.targetLowPrice) + ' SAR'} />
                                <DataCell
                                    label="Upside Potential"
                                    value={stock.targetMeanPrice && stock.price
                                        ? (((stock.targetMeanPrice - stock.price) / stock.price) * 100).toFixed(2) + '%'
                                        : 'N/A'
                                    }
                                    highlight
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Card title="Company Profile" icon={<Building2 size={20} />}>
                            <p style={{ lineHeight: 1.8, color: '#475569', fontSize: '0.9375rem' }}>
                                {stock.longBusinessSummary || "Saudi Aramco is the world's largest integrated oil and gas company. It explores, produces, refines, and distributes petroleum and chemical products. The company is a key player in the global energy market and is expanding into renewables and advanced materials."}
                            </p>

                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Sector" value={stock.sector || 'Energy'} />
                                <DataCell label="Industry" value={stock.industry || 'Oil & Gas Integrated'} />
                                <DataCell label="Employees" value={stock.fullTimeEmployees?.toLocaleString() || 'N/A'} />
                                <DataCell label="Country" value={stock.country || 'Saudi Arabia'} />
                            </div>

                            {stock.website && (
                                <a
                                    href={stock.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        background: 'var(--gradient-primary)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: 700
                                    }}
                                >
                                    <Globe size={18} />
                                    Visit Company Website
                                    <ChevronRight size={18} />
                                </a>
                            )}
                        </Card>

                        {/* News Feed */}
                        <Card title="Latest News">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(staticContent.news || []).map((news, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={news.image} alt="" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.25rem' }}>{news.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{news.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {(!staticContent.news || staticContent.news.length === 0) && (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>No recent news</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

// Card Component
function Card({ title, icon, children }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
            {title && (
                <h3 style={{
                    color: '#1f2937',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {icon && <span style={{ color: '#10b981' }}>{icon}</span>}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

// Data Cell Component
function DataCell({ label, value, highlight }) {
    return (
        <div style={{
            background: highlight
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                : '#f8fafc',
            padding: '1rem',
            borderRadius: '12px',
            border: highlight
                ? '1px solid rgba(16, 185, 129, 0.2)'
                : '1px solid #e2e8f0'
        }}>
            <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '0.25rem',
                fontWeight: 600
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: highlight ? '#10b981' : '#1f2937'
            }}>
                {value}
            </div>
        </div>
    );
}

// Info Badge Component
function InfoBadge({ label, value }) {
    return (
        <div style={{
            background: '#f1f5f9',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            display: 'inline-flex',
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid #e2e8f0'
        }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{label}:</span>
            <span style={{ color: '#1f2937', fontWeight: 700, fontSize: '0.875rem' }}>{value}</span>
        </div>
    );
}

// Technical Gauge Component
function TechnicalGauge({ value, inverse = false, label }) {
    // Value is 1-5. If inverse, 1 is Buy (Green), 5 is Sell (Red).
    // If not inverse, 1 is Sell (Red), 5 is Buy (Green).

    const normalizedValue = Math.max(1, Math.min(5, value));
    const percentage = ((normalizedValue - 1) / 4) * 100;

    // Calculate color
    const getColor = (val) => {
        if (inverse) {
            if (val <= 1.5) return '#10b981'; // Strong Buy
            if (val <= 2.5) return '#34d399'; // Buy
            if (val <= 3.5) return '#fbbf24'; // Hold
            if (val <= 4.5) return '#f87171'; // Sell
            return '#ef4444'; // Strong Sell
        } else {
            if (val <= 1.5) return '#ef4444'; // Strong Sell
            if (val <= 2.5) return '#f87171'; // Sell
            if (val <= 3.5) return '#fbbf24'; // Hold
            if (val <= 4.5) return '#34d399'; // Buy
            return '#10b981'; // Strong Buy
        }
    };

    const color = getColor(normalizedValue);

    // SVG Path for arc
    const radius = 80;
    const stroke = 12;
    const circumference = Math.PI * radius;
    const offset = circumference - ((inverse ? (100 - percentage) : percentage) / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: '200px', height: '120px', display: 'flex', justifyContent: 'center' }}>
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Background Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
                {/* Filled Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // We'll animate this or set it static for now
                    style={{
                        strokeDashoffset: circumference * (1 - (inverse ? (5 - normalizedValue) / 4 : (normalizedValue - 1) / 4)),
                        transition: 'stroke-dashoffset 1s ease-out'
                    }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                bottom: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: color }}>
                    {normalizedValue.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

// Price Target Chart Component
function PriceTargetChart({ current, low, mean, high }) {
    if (!current || !low || !high) return null;

    // Normalize values to 0-100 range based on low and high with some padding
    const min = Math.min(current, low) * 0.9;
    const max = Math.max(current, high) * 1.1;
    const range = max - min;

    const getPos = (val) => ((val - min) / range) * 100;

    return (
        <div style={{ position: 'relative', height: '60px', marginTop: '20px' }}>
            {/* Range Bar */}
            <div style={{
                position: 'absolute',
                left: `${getPos(low)}%`,
                right: `${100 - getPos(high)}%`,
                top: '25px',
                height: '10px',
                background: '#e2e8f0',
                borderRadius: '5px'
            }} />

            {/* Low Marker */}
            <div style={{ position: 'absolute', left: `${getPos(low)}%`, top: '10px', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{low}</div>
                <div style={{ width: '2px', height: '40px', background: '#94a3b8', margin: '0 auto' }} />
            </div>

            {/* High Marker */}
            <div style={{ position: 'absolute', left: `${getPos(high)}%`, top: '10px', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{high}</div>
                <div style={{ width: '2px', height: '40px', background: '#94a3b8', margin: '0 auto' }} />
            </div>

            {/* Mean Marker */}
            <div style={{ position: 'absolute', left: `${getPos(mean)}%`, top: '15px', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 1 }}>
                <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, marginTop: '4px' }}>Avg</div>
            </div>

            {/* Current Price Marker */}
            <div style={{ position: 'absolute', left: `${getPos(current)}%`, top: '0', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 2 }}>
                <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {current}
                </div>
                <div style={{ width: '2px', height: '30px', background: '#10b981', margin: '0 auto' }} />
            </div>
        </div>
    );
}



// Simple Bar Chart Component
function SimpleBarChart({ data, height = 100 }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: height + 'px', paddingTop: '20px' }}>
            {data.map((item, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: item.color }}>{item.displayValue}</div>
                    <div style={{
                        width: '40px',
                        height: maxValue > 0 ? `${Math.max((item.value / maxValue) * 100, 5)}%` : '5%',
                        background: item.color,
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'height 0.5s ease'
                    }} />
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
