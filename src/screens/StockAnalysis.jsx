import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Target, Building2, Globe, ChevronRight, Bot } from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import StockMovementCard from '../components/StockMovementCard';

export default function StockAnalysis() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const { prices, loading } = usePrices();
    const [activeTab, setActiveTab] = useState('overview');

    // Get stock data - focus on Aramco (2222.SR)
    const stockKey = Object.keys(prices).find(k => k.includes(symbol)) || symbol;
    const stock = prices[stockKey] || {};

    // Check if this is Aramco
    const isAramco = symbol === '2222' || stockKey === '2222.SR';

    const isPositive = (stock.change || 0) >= 0;

    // Format helpers - 2 decimal places for percentages
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

    const formatChange = (val) => {
        if (!val && val !== 0) return 'N/A';
        const num = Number(val);
        return num.toFixed(2);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'valuation', label: 'Valuation', icon: PieChart },
        { id: 'analysts', label: 'Analysts', icon: Target },
        { id: 'about', label: 'About', icon: Building2 },
    ];

    // Show loading or not available for non-Aramco stocks
    if (!isAramco) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
                    <h2 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Coming Soon</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        Detailed analysis for this stock will be available in Phase 2
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !stock.price) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#1f2937', textAlign: 'center' }}>
                    <div className="loader" style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p>Loading Aramco Analysis...</p>
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

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Company Info */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            background: 'white',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}>
                            <img
                                src="https://logo.clearbit.com/aramco.com"
                                alt="Aramco"
                                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600 }}>
                                {stock.symbol || '2222.SR'}
                            </div>
                            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                {stock.longName || stock.name || 'Saudi Aramco'}
                            </h1>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                            {formatChange(stock.price)} <span style={{ fontSize: '1.25rem', opacity: 0.8 }}>SAR</span>
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
                            {isPositive ? '+' : ''}{formatChange(stock.change)} ({isPositive ? '+' : ''}{formatChange(stock.changePercent)}%)
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs - Floating Style */}
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
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Icon size={18} />
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

                        {/* AI Insights Card */}
                        <StockMovementCard symbol={stockKey} />

                        {/* Trading Info Card */}
                        <Card title="Trading Information" icon={<BarChart3 size={20} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Open" value={formatChange(stock.open || stock.regularMarketOpen)} />
                                <DataCell label="Previous Close" value={formatChange(stock.prevClose)} />
                                <DataCell label="Day High" value={formatChange(stock.high)} />
                                <DataCell label="Day Low" value={formatChange(stock.low)} />
                                <DataCell label="Volume" value={formatNumber(stock.volume)} />
                                <DataCell label="Avg Volume" value={formatNumber(stock.averageVolume)} />
                            </div>
                        </Card>

                        {/* 52-Week Range */}
                        <Card title="52-Week Range">
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.875rem' }}>{formatChange(stock.fiftyTwoWeekLow)}</span>
                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>{formatChange(stock.fiftyTwoWeekHigh)}</span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)',
                                        borderRadius: '10px',
                                        width: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100}%`
                                            : '50%'
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        left: stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                                            ? `${((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100}%`
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
                                <DataCell label="50-Day MA" value={formatChange(stock.fiftyDayAverage)} />
                                <DataCell label="200-Day MA" value={formatChange(stock.twoHundredDayAverage)} />
                                <DataCell label="52-Week Change" value={formatPercent(stock.fiftyTwoWeekChange)} highlight />
                                <DataCell label="Beta" value={formatChange(stock.beta)} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Financials Tab */}
                {activeTab === 'financials' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title="Revenue & Profitability" icon={<DollarSign size={20} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Total Revenue" value={formatCurrency(stock.totalRevenue)} highlight />
                                <DataCell label="Revenue Per Share" value={formatChange(stock.revenuePerShare) + ' SAR'} />
                                <DataCell label="Revenue Growth" value={formatPercent(stock.revenueGrowth)} />
                                <DataCell label="Gross Profits" value={formatCurrency(stock.grossProfits)} />
                                <DataCell label="EBITDA" value={formatCurrency(stock.ebitda)} highlight />
                                <DataCell label="Net Income" value={formatCurrency(stock.netIncomeToCommon)} />
                            </div>
                        </Card>

                        <Card title="Profit Margins">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Profit Margin" value={formatPercent(stock.profitMargins)} highlight />
                                <DataCell label="Gross Margin" value={formatPercent(stock.grossMargins)} />
                                <DataCell label="Operating Margin" value={formatPercent(stock.operatingMargins)} />
                                <DataCell label="EBITDA Margin" value={formatPercent(stock.ebitdaMargins)} />
                            </div>
                        </Card>

                        <Card title="Cash Flow">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Operating Cash Flow" value={formatCurrency(stock.operatingCashflow)} />
                                <DataCell label="Free Cash Flow" value={formatCurrency(stock.freeCashflow)} highlight />
                                <DataCell label="Total Cash" value={formatCurrency(stock.totalCash)} />
                                <DataCell label="Cash Per Share" value={formatChange(stock.totalCashPerShare) + ' SAR'} />
                            </div>
                        </Card>

                        <Card title="Balance Sheet">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Total Debt" value={formatCurrency(stock.totalDebt)} />
                                <DataCell label="Debt to Equity" value={formatChange(stock.debtToEquity) + '%'} />
                                <DataCell label="Current Ratio" value={formatChange(stock.currentRatio)} />
                                <DataCell label="Book Value" value={formatChange(stock.bookValue) + ' SAR'} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Valuation Tab */}
                {activeTab === 'valuation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <Card title="Valuation Metrics" icon={<PieChart size={20} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Market Cap" value={formatCurrency(stock.marketCap)} highlight />
                                <DataCell label="Enterprise Value" value={formatCurrency(stock.enterpriseValue)} />
                                <DataCell label="Trailing P/E" value={formatChange(stock.trailingPE)} />
                                <DataCell label="Forward P/E" value={formatChange(stock.forwardPE)} highlight />
                                <DataCell label="Price to Book" value={formatChange(stock.priceToBook)} />
                                <DataCell label="EV/EBITDA" value={formatChange(stock.enterpriseToEbitda)} />
                            </div>
                        </Card>

                        <Card title="Earnings Per Share">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Trailing EPS" value={formatChange(stock.trailingEps) + ' SAR'} highlight />
                                <DataCell label="Forward EPS" value={formatChange(stock.forwardEps) + ' SAR'} />
                                <DataCell label="Earnings Growth" value={formatPercent(stock.earningsGrowth)} />
                                <DataCell label="ROE" value={formatPercent(stock.returnOnEquity)} highlight />
                            </div>
                        </Card>

                        <Card title="Dividends">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Dividend Rate" value={formatChange(stock.trailingAnnualDividendRate) + ' SAR'} />
                                <DataCell label="Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield)} highlight />
                                <DataCell label="Payout Ratio" value={formatPercent(stock.payoutRatio)} />
                                <DataCell label="Last Dividend" value={formatChange(stock.lastDividendValue) + ' SAR'} />
                            </div>
                        </Card>
                    </div>
                )}

                {/* Analysts Tab */}
                {activeTab === 'analysts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Recommendation Badge */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                            borderRadius: '20px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                        }}>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Analyst Recommendation
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>
                                {stock.recommendationKey?.replace('_', ' ') || 'N/A'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                                Based on {stock.numberOfAnalystOpinions || 0} analysts
                            </div>
                        </div>

                        {/* Recommendation Breakdown */}
                        {stock.recommendationTrend && stock.recommendationTrend[0] && (
                            <Card title="Recommendation Breakdown">
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[
                                        { label: 'Strong Buy', key: 'strongBuy', color: '#10b981' },
                                        { label: 'Buy', key: 'buy', color: '#34d399' },
                                        { label: 'Hold', key: 'hold', color: '#94a3b8' },
                                        { label: 'Sell', key: 'sell', color: '#f87171' },
                                        { label: 'Strong Sell', key: 'strongSell', color: '#ef4444' }
                                    ].map(item => (
                                        <div key={item.key} style={{ flex: 1, textAlign: 'center' }}>
                                            <div style={{
                                                background: item.color,
                                                padding: '1rem 0.25rem',
                                                borderRadius: '12px',
                                                marginBottom: '0.5rem',
                                                fontWeight: 800,
                                                fontSize: '1.25rem',
                                                color: 'white',
                                                boxShadow: `0 4px 12px ${item.color}40`
                                            }}>
                                                {stock.recommendationTrend[0][item.key] || 0}
                                            </div>
                                            <div style={{ fontSize: '0.625rem', color: '#64748b', fontWeight: 600 }}>
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Price Targets */}
                        <Card title="Price Targets" icon={<Target size={20} />}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Current Price" value={formatChange(stock.currentPrice || stock.price) + ' SAR'} />
                                <DataCell label="Target Mean" value={formatChange(stock.targetMeanPrice) + ' SAR'} highlight />
                                <DataCell label="Target High" value={formatChange(stock.targetHighPrice) + ' SAR'} />
                                <DataCell label="Target Low" value={formatChange(stock.targetLowPrice) + ' SAR'} />
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
                            <p style={{
                                color: '#4b5563',
                                fontSize: '0.9375rem',
                                lineHeight: 1.7,
                                marginBottom: '1.5rem'
                            }}>
                                {stock.description || 'Saudi Arabian Oil Company, doing business as Saudi Aramco, is a petroleum and natural gas company and is one of the largest companies in the world.'}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <InfoBadge label="Sector" value={stock.sector || 'Energy'} />
                                <InfoBadge label="Industry" value={stock.industry || 'Oil & Gas'} />
                                <InfoBadge label="Country" value={stock.country || 'Saudi Arabia'} />
                            </div>
                        </Card>

                        <Card title="Key Facts">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <DataCell label="Exchange" value={stock.exchange || 'TADAWUL'} />
                                <DataCell label="Currency" value={stock.currency || 'SAR'} />
                                <DataCell label="Employees" value={formatNumber(stock.fullTimeEmployees) || 'N/A'} />
                                <DataCell label="Shares Outstanding" value={formatNumber(stock.sharesOutstanding)} />
                            </div>
                        </Card>

                        {stock.website && stock.website !== 'N/A' && (
                            <a
                                href={stock.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                    color: 'white',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                <Globe size={20} />
                                Visit Company Website
                                <ChevronRight size={18} />
                            </a>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// Card Component - White Background
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

// Data Cell Component - Light Theme
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

// Info Badge Component - Light Theme
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
