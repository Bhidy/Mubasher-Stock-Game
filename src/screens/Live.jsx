import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { TrendingUp, TrendingDown, Clock, Activity, ChevronRight, Trophy, BarChart3, HelpCircle, X } from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import { useMarket } from '../context/MarketContext';
import { StockLogo } from '../components/StockCard';

import BurgerMenu from '../components/BurgerMenu';

import { useToast } from '../components/shared/Toast';
import Tooltip from '../components/shared/Tooltip';

export default function Live() {
    const { user } = useContext(UserContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('performance');
    const [showTooltip, setShowTooltip] = useState(false);

    const { prices, loading } = usePrices();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Convert prices object to array for display
    const { market } = useMarket();

    // Market-specific default decks (Simulating user picks)
    const MARKET_DECKS = {
        'SA': ['2222', '1120', '2010'],
        'EG': ['COMI', 'HRHO', 'EAST'],
        'US': ['AAPL', 'NVDA', 'TSLA'],
        'IN': ['RELIANCE', 'TCS', 'HDFCBANK'],
        'UK': ['BP', 'HSBA', 'SHEL'],
        'CA': ['SHOP', 'RY', 'TD'],
        'AU': ['BHP', 'CBA', 'CSL'],
        'HK': ['0700', '9988', '0005'],
        'DE': ['SAP', 'SIE', 'ALV'],
        'JP': ['7203', '6758', '9984'],
        'AE': ['EMAAR', 'FAB', 'ETISALAT'],
        'ZA': ['NPN', 'SOL', 'SBK'],
        'QA': ['QNBK', 'QEWS', 'QGTS']
    };

    // Fallback names for all markets
    const FALLBACK_NAMES = {
        // Saudi
        '2222': 'Saudi Aramco', '1120': 'Al Rajhi Bank', '2010': 'SABIC',
        // Egypt
        'COMI': 'CIB Egypt', 'HRHO': 'EFG Hermes', 'EAST': 'Eastern Company',
        // US
        'AAPL': 'Apple Inc.', 'NVDA': 'NVIDIA Corp.', 'TSLA': 'Tesla Inc.',
        // India
        'RELIANCE': 'Reliance Industries', 'TCS': 'Tata Consultancy', 'HDFCBANK': 'HDFC Bank',
        // UK
        'BP': 'BP plc', 'HSBA': 'HSBC Holdings', 'SHEL': 'Shell plc',
        // Canada
        'SHOP': 'Shopify', 'RY': 'Royal Bank of Canada', 'TD': 'TD Bank',
        // Australia
        'BHP': 'BHP Group', 'CBA': 'Commonwealth Bank', 'CSL': 'CSL Limited',
        // Hong Kong
        '0700': 'Tencent', '9988': 'Alibaba Group', '0005': 'HSBC Holdings',
        // Germany
        'SAP': 'SAP SE', 'SIE': 'Siemens', 'ALV': 'Allianz',
        // Japan
        '7203': 'Toyota Motor', '6758': 'Sony Group', '9984': 'SoftBank Group',
        // UAE
        'EMAAR': 'Emaar Properties', 'FAB': 'First Abu Dhabi Bank', 'ETISALAT': 'e& (Etisalat)',
        // South Africa
        'NPN': 'Naspers', 'SOL': 'Sasol', 'SBK': 'Standard Bank',
        // Qatar
        'QNBK': 'QNB Group', 'QEWS': 'Qatar Electricity', 'QGTS': 'Qatar Gas Transport'
    };

    const targetDeck = MARKET_DECKS[market.id] || MARKET_DECKS['SA'];
    const stockSuffix = market.suffix || '';

    // Determine which picks to show: User's actual picks OR fallback mock deck
    const currentPicks = user.picks && user.picks.length > 0
        ? user.picks
        : targetDeck.map((ticker, index) => ({ id: ticker, symbol: ticker, prediction: 'UP' }));

    // Enhance picks with real-time price data
    const picks = currentPicks.map((pick, index) => {
        const ticker = pick.symbol || pick.ticker; // Handle both structures

        // Try to find in prices
        const priceKey = Object.keys(prices).find(k =>
            k === ticker || k === `${ticker}${stockSuffix}` || k.startsWith(ticker)
        );
        const stockData = priceKey ? prices[priceKey] : null;

        // Calculate logical change based on prediction
        // If they predicted UP, real change is correct. If DOWN, inverse it? 
        // For simplicity, we just show the stock's performance. 
        // Later we can add points logic: if (pred == UP && change > 0) -> Points ++

        return {
            id: index + 1,
            ticker: ticker,
            name: stockData?.name || FALLBACK_NAMES[ticker] || ticker,
            price: stockData?.price || (50 + Math.random() * 100),
            change: stockData?.changePercent || ((Math.random() - 0.5) * 2),
            prediction: pick.prediction || 'UP' // Default to UP if missing
        };
    });

    const topPlayers = [
        { rank: 1, name: 'Yasser Al-Qahtani', gain: 5.4, avatar: '👑' },
        { rank: 2, name: 'Saad Al-Harbi', gain: 4.8, avatar: '💎' },
        { rank: 3, name: 'Majed Abdullah', gain: 4.2, avatar: '🚀' },
        { rank: 4, name: 'Faisal', gain: 3.9, avatar: '⭐' },
        { rank: 5, name: 'Noura', gain: 3.7, avatar: '🎯' },
        { rank: 6, name: 'Ahmed', gain: 3.5, avatar: '💫' },
        { rank: 7, name: 'Sara', gain: 3.2, avatar: '🌟' },
        { rank: 8, name: 'Khalid', gain: 2.9, avatar: '🏆' },
    ];

    // Calculate average of 3 stocks only
    const totalGain = picks.reduce((sum, stock) => sum + (stock.change || 0), 0) / picks.length;

    const handleStockClick = (stock) => {
        navigate(`/company/${stock.ticker}`);
    };

    const tabs = [
        { id: 'performance', label: 'My Deck', icon: BarChart3 },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    ];

    // Format price with 2 decimals and dynamic currency
    const formatPrice = (price) => {
        return `${Number(price).toFixed(2)} ${market.currency}`;
    };

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Live Header */}
            <div className="flex-between animate-fade-in">
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    {/* Blinking/Twinkling Live Dot */}
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--danger)',
                        boxShadow: '0 0 12px var(--danger)',
                        animation: 'blink 1s ease-in-out infinite'
                    }} />
                    <span style={{
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'var(--danger)',
                        fontSize: '0.875rem'
                    }}>
                        LIVE CONTEST
                    </span>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div style={{
                        background: '#fee2e2',
                        padding: '0.375rem 0.875rem',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        border: '1.5px solid #fecaca'
                    }}>
                        <Clock size={14} color="var(--danger)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>Ends in 2h 15m</span>
                    </div>
                    <BurgerMenu />
                </div>
            </div>

            {/* CSS for blinking animation */}
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px var(--danger); }
                    50% { opacity: 0.4; transform: scale(0.85); box-shadow: 0 0 4px var(--danger); }
                }
            `}</style>

            {/* Performance Hero */}
            <Card className="animate-slide-up" style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: totalGain >= 0
                    ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                    : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: totalGain >= 0 ? '3px solid var(--success)' : '3px solid var(--danger)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Enhanced Title with Info Icon - NO left emoji */}
                    <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <span style={{
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            fontSize: '0.75rem',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            background: 'white',
                            padding: '0.375rem 0.875rem',
                            borderRadius: 'var(--radius-full)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            Your Performance
                        </span>
                        <button
                            onClick={() => setShowTooltip(!showTooltip)}
                            style={{
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '26px',
                                height: '26px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <HelpCircle size={14} color="#64748b" />
                        </button>
                    </div>

                    {/* Tooltip - Full page centered modal like other tooltips */}
                    {showTooltip && ReactDOM.createPortal(
                        <div
                            onClick={() => setShowTooltip(false)}
                            style={{
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
                            }}
                            className="animate-fade-in"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    maxWidth: '320px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    position: 'relative',
                                    width: '100%'
                                }}
                                className="animate-scale-in"
                            >
                                <button
                                    onClick={() => setShowTooltip(false)}
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
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
                                        How it's calculated
                                    </h2>
                                    <div style={{
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.6,
                                        color: '#4b5563',
                                        marginBottom: '1rem'
                                    }}>
                                        Your performance is the <strong>average percentage change</strong> of your 3 picked stocks today.
                                    </div>
                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '0.875rem',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        color: '#64748b'
                                    }}>
                                        <strong>Formula:</strong><br />
                                        (Stock 1 % + Stock 2 % + Stock 3 %) ÷ 3
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        color: totalGain >= 0 ? 'var(--success)' : 'var(--danger)',
                        marginBottom: '0.75rem',
                        lineHeight: 1,
                    }}>
                        {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)}%
                    </h1>
                    <div style={{
                        background: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        marginBottom: '0.75rem'
                    }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>Rank #{user.rank}</span>
                        <div style={{
                            background: '#dcfce7',
                            color: 'var(--success)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1px solid #bbf7d0'
                        }}>
                            ↑ 35
                        </div>
                    </div>
                    <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                        <Activity size={14} color="var(--text-muted)" />
                        <p className="caption">47,291 players competing</p>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="animate-slide-up">
                <div style={{
                    background: '#f1f5f9',
                    padding: '0.375rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    border: '2px solid #e2e8f0'
                }}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    background: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                    boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Performance Tab */}
            {activeTab === 'performance' && (
                <div className="animate-slide-up">
                    <h3 className="h3" style={{ marginBottom: '1rem' }}>Your Deck Performance</h3>
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        {picks.map((stock, index) => (
                            <Card
                                key={stock.id}
                                onClick={() => handleStockClick(stock)}
                                style={{
                                    padding: '1.25rem',
                                    background: (stock.change || 0) >= 0
                                        ? 'linear-gradient(90deg, white 0%, #dcfce7 100%)'
                                        : 'linear-gradient(90deg, white 0%, #fee2e2 100%)',
                                    borderLeft: `5px solid ${(stock.change || 0) >= 0 ? 'var(--success)' : 'var(--danger)'} `,
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                            >
                                {index === 0 && (stock.change || 0) > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        right: '0.75rem',
                                        background: '#fef3c7',
                                        color: '#f59e0b',
                                        padding: '0.25rem 0.625rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.625rem',
                                        fontWeight: 700,
                                        border: '1px solid #fde68a'
                                    }}>
                                        💰 BEST PICK
                                    </div>
                                )}
                                <div className="flex-between">
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '14px',
                                            background: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid #e2e8f0',
                                            overflow: 'hidden'
                                        }}>
                                            <StockLogo ticker={stock.ticker} size={44} />
                                        </div>
                                        <div>
                                            <div className="flex-center" style={{ gap: '0.5rem' }}>
                                                <h3 className="h3" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{stock.ticker}</h3>
                                                {stock.prediction && (
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        fontWeight: 800,
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: stock.prediction === 'UP' ? '#dcfce7' : '#fee2e2',
                                                        color: stock.prediction === 'UP' ? '#16a34a' : '#dc2626',
                                                        border: `1px solid ${stock.prediction === 'UP' ? '#bbf7d0' : '#fecaca'}`
                                                    }}>
                                                        {stock.prediction}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="caption">{stock.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                            {formatPrice(stock.price)}
                                        </span>
                                        <span style={{
                                            color: (stock.change || 0) >= 0 ? 'var(--success)' : 'var(--danger)',
                                            fontWeight: 800,
                                            fontSize: '1.25rem',
                                            lineHeight: 1
                                        }}>
                                            {(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="animate-slide-up">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 className="h3">Top Players Right Now</h3>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <Card style={{ padding: '0', overflow: 'hidden' }}>
                        {topPlayers.map((player, i) => (
                            <div key={i} className="flex-between" style={{
                                padding: '1rem 1.25rem',
                                borderBottom: i < topPlayers.length - 1 ? '1px solid #f1f5f9' : 'none',
                                background: i === 0 ? 'linear-gradient(90deg, #fef3c7 0%, white 100%)' :
                                    i === 1 ? 'linear-gradient(90deg, #f1f5f9 0%, white 100%)' :
                                        i === 2 ? 'linear-gradient(90deg, #fed7aa 0%, white 100%)' : 'white'
                            }}>
                                <div className="flex-center" style={{ gap: '1rem' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: i === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' :
                                            i === 1 ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' :
                                                i === 2 ? 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)' : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: i < 3 ? '1.25rem' : '0.875rem',
                                        fontWeight: 800,
                                        color: i < 3 ? 'white' : 'var(--text-secondary)',
                                        boxShadow: i < 3 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                                    }}>
                                        {i < 3 ? player.avatar : player.rank}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{player.name}</span>
                                        {i < 3 && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {i === 0 ? '🏆 Champion' : i === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span style={{
                                    color: 'var(--success)',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    background: '#dcfce7',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid #bbf7d0'
                                }}>
                                    +{player.gain}%
                                </span>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
        </div>
    );
}
