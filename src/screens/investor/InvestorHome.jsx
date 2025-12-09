import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, Briefcase, LineChart, Star, Bell,
    ChevronRight, ArrowUpRight, ArrowDownRight, Clock, BarChart3,
    PieChart, Calendar, AlertCircle, Globe, Newspaper, DollarSign,
    Activity, Target, FileText, Eye
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMarket } from '../../context/MarketContext';
import { useMode } from '../../context/ModeContext';
import BurgerMenu from '../../components/BurgerMenu';

// Format currency
const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Format percentage
const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

// Quick Stats Widget
function StatWidget({ icon: Icon, label, value, change, changeType = 'percent', color }) {
    const isPositive = change >= 0;
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #E5E7EB',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
            }}>
                <Icon size={18} color={color || '#0EA5E9'} />
                {change !== undefined && (
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: isPositive ? '#10B981' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                    }}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {changeType === 'percent' ? formatPercent(change) : formatCurrency(change)}
                    </span>
                )}
            </div>
            <div style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1F2937',
                marginBottom: '0.125rem',
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '0.7rem',
                color: '#6B7280',
                fontWeight: 500,
            }}>
                {label}
            </div>
        </div>
    );
}

// Watchlist Item
function WatchlistItem({ symbol, name, price, change, changePercent, onClick }) {
    const isPositive = changePercent >= 0;
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.875rem 0',
                borderBottom: '1px solid #F3F4F6',
                cursor: 'pointer',
            }}
        >
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>{symbol}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                    ${price?.toFixed(2)}
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
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {formatPercent(changePercent)}
                </div>
            </div>
        </div>
    );
}

export default function InvestorHome() {
    const { user } = useContext(UserContext);
    const { market } = useMarket();
    const navigate = useNavigate();
    const [marketStatus, setMarketStatus] = useState('closed');

    // Check market status
    useEffect(() => {
        const checkMarket = () => {
            const now = new Date();
            const hour = now.getHours();
            // Simple check - refine based on actual market hours
            if (hour >= 9 && hour < 16) {
                setMarketStatus('open');
            } else if (hour >= 8 && hour < 9) {
                setMarketStatus('pre');
            } else {
                setMarketStatus('closed');
            }
        };
        checkMarket();
        const interval = setInterval(checkMarket, 60000);
        return () => clearInterval(interval);
    }, []);

    // Mock investor data
    const investorData = {
        portfolioValue: 125000,
        portfolioChange: 2847.50,
        portfolioChangePercent: 2.33,
        dayPL: 847.50,
        dayPLPercent: 0.68,
        totalGain: 15420.00,
        totalGainPercent: 14.07,
        watchlistCount: 12,
        alertsActive: 3,
        openPositions: 8,
    };

    // Mock watchlist
    const watchlist = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 189.72, change: 2.45, changePercent: 1.31 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.23, changePercent: -0.32 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.12, changePercent: 2.25 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.87, changePercent: 1.06 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, changePercent: 1.44 },
    ];

    // Market indices
    const indices = [
        { name: 'S&P 500', value: '5,123.41', change: 0.42 },
        { name: 'NASDAQ', value: '16,091.92', change: 0.68 },
        { name: 'DOW', value: '39,069.11', change: -0.12 },
    ];

    const quickActions = [
        { icon: BarChart3, label: 'Market', path: '/market', color: '#10B981' },
        { icon: Star, label: 'Watchlist', path: '/investor/watchlist', color: '#F59E0B' },
        { icon: LineChart, label: 'Screener', path: '/investor/screener', color: '#0EA5E9' },
        { icon: Bell, label: 'Alerts', path: '/investor/alerts', color: '#EF4444', badge: investorData.alertsActive },
    ];

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
                position: 'relative',
            }}>
                {/* Top bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                }}>
                    <BurgerMenu variant="glass" />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '999px',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: marketStatus === 'open' ? '#22C55E' :
                                marketStatus === 'pre' ? '#F59E0B' : '#EF4444',
                            boxShadow: marketStatus === 'open' ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
                        }} />
                        <span style={{
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}>
                            {marketStatus === 'open' ? 'Market Open' :
                                marketStatus === 'pre' ? 'Pre-Market' : 'Market Closed'}
                        </span>
                    </div>
                </div>

                {/* Portfolio Summary */}
                <div style={{ color: 'white' }}>
                    <div style={{
                        fontSize: '0.8rem',
                        opacity: 0.85,
                        marginBottom: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                    }}>
                        <span>{market.flag}</span>
                        <span>Portfolio Value</span>
                    </div>
                    <div style={{
                        fontSize: '2.25rem',
                        fontWeight: 900,
                        marginBottom: '0.25rem',
                        letterSpacing: '-0.02em',
                    }}>
                        {formatCurrency(investorData.portfolioValue)}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.625rem',
                            background: investorData.portfolioChangePercent >= 0
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                            borderRadius: '999px',
                        }}>
                            {investorData.portfolioChangePercent >= 0 ? (
                                <ArrowUpRight size={14} />
                            ) : (
                                <ArrowDownRight size={14} />
                            )}
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                {formatPercent(investorData.portfolioChangePercent)}
                            </span>
                        </div>
                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                            {investorData.portfolioChange >= 0 ? '+' : ''}
                            {formatCurrency(investorData.portfolioChange)} today
                        </span>
                    </div>
                </div>
            </div>

            {/* Market Indices Ticker */}
            <div style={{
                background: 'white',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-around',
            }}>
                {indices.map((index) => (
                    <div key={index.name} style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '0.65rem',
                            color: '#6B7280',
                            fontWeight: 500,
                            marginBottom: '0.125rem',
                        }}>
                            {index.name}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                        }}>
                            <span style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#1F2937',
                            }}>
                                {index.value}
                            </span>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: index.change >= 0 ? '#10B981' : '#EF4444',
                            }}>
                                {formatPercent(index.change)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: '1rem' }}>

                {/* Quick Actions */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.625rem',
                    marginBottom: '1.25rem',
                }}>
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.875rem 0.5rem',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            <action.icon size={22} color={action.color} strokeWidth={1.75} />
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: '#4B5563',
                            }}>
                                {action.label}
                            </span>
                            {action.badge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: '#EF4444',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {action.badge}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                }}>
                    <StatWidget
                        icon={DollarSign}
                        label="Today's P/L"
                        value={`$${investorData.dayPL.toLocaleString()}`}
                        change={investorData.dayPLPercent}
                        color="#10B981"
                    />
                    <StatWidget
                        icon={Activity}
                        label="Total Gain"
                        value={`$${investorData.totalGain.toLocaleString()}`}
                        change={investorData.totalGainPercent}
                        color="#0EA5E9"
                    />
                    <StatWidget
                        icon={Briefcase}
                        label="Open Positions"
                        value={investorData.openPositions}
                        color="#6366F1"
                    />
                    <StatWidget
                        icon={Eye}
                        label="Watching"
                        value={investorData.watchlistCount}
                        color="#F59E0B"
                    />
                </div>

                {/* Watchlist */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: '1px solid #E5E7EB',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star size={18} color="#F59E0B" fill="#F59E0B" />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                                Watchlist
                            </h3>
                        </div>
                        <button
                            onClick={() => navigate('/investor/watchlist')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0EA5E9',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>

                    {watchlist.slice(0, 4).map((stock) => (
                        <WatchlistItem
                            key={stock.symbol}
                            {...stock}
                            onClick={() => navigate(`/company/${stock.symbol}`)}
                        />
                    ))}
                </div>

                {/* Economic Calendar Preview */}
                <div
                    onClick={() => navigate('/investor/calendar')}
                    style={{
                        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                        borderRadius: '16px',
                        padding: '1rem',
                        marginBottom: '1.25rem',
                        border: '1px solid #BAE6FD',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.15)',
                    }}>
                        <Calendar size={24} color="#0EA5E9" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#0C4A6E',
                            marginBottom: '0.125rem',
                        }}>
                            Economic Calendar
                        </h4>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#0369A1',
                        }}>
                            3 events today • Fed Rate Decision upcoming
                        </p>
                    </div>
                    <ChevronRight size={20} color="#0369A1" />
                </div>

                {/* News Preview */}
                <div
                    onClick={() => navigate('/news-feed')}
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1rem',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Newspaper size={18} color="#6366F1" />
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                                Market News
                            </h3>
                        </div>
                        <span style={{
                            fontSize: '0.7rem',
                            color: '#10B981',
                            fontWeight: 600,
                        }}>
                            5 min ago
                        </span>
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        color: '#1F2937',
                        fontWeight: 500,
                        lineHeight: 1.5,
                    }}>
                        Fed signals potential rate cuts in 2024, markets react positively...
                    </div>
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#0EA5E9',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        Read more <ChevronRight size={14} />
                    </div>
                </div>

            </div>
        </div>
    );
}
