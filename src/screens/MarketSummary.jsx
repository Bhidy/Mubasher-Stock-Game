import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, TrendingUp, TrendingDown, Globe, BarChart3,
    Activity, Clock, RefreshCw, Building, DollarSign, Briefcase,
    ArrowUpRight, ArrowDownRight, Zap, Target, PieChart, Sparkles,
    LineChart, Layers, Star, Award, ChevronRight, Map, LayoutGrid, Globe2, Newspaper, Flag
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { usePrices } from '../context/PriceContext';
import IndexChart from '../components/IndexChart';
import { StockLogo, SAUDI_STOCKS } from '../components/StockCard';

// ... (other imports)

// ...



const TopMoversSection = ({ gainers, losers, navigate }) => {
    const [activeTab, setActiveTab] = useState('gainers');
    const items = activeTab === 'gainers' ? gainers : losers;
    const isGainers = activeTab === 'gainers';

    return (
        <div className="flex-col" style={{ gap: '1rem' }}>
            {/* Header + Tabs */}
            <div className="flex-between" style={{ alignItems: 'center' }}>
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    {isGainers ? <TrendingUp size={24} color="#10b981" /> : <TrendingDown size={24} color="#ef4444" />}
                    <h3 className="h3" style={{ margin: 0 }}>{isGainers ? 'Top Gainers' : 'Top Losers'}</h3>
                </div>

                {/* Custom Toggle */}
                <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '12px', display: 'flex' }}>
                    <button
                        onClick={() => setActiveTab('gainers')}
                        style={{
                            padding: '6px 12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                            background: isGainers ? '#fff' : 'transparent',
                            color: isGainers ? '#10b981' : '#64748b',
                            boxShadow: isGainers ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Gainers
                    </button>
                    <button
                        onClick={() => setActiveTab('losers')}
                        style={{
                            padding: '6px 12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                            background: !isGainers ? '#fff' : 'transparent',
                            color: !isGainers ? '#ef4444' : '#64748b',
                            boxShadow: !isGainers ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Losers
                    </button>
                </div>
            </div>

            {/* List */}
            <Card style={{ padding: 0, overflow: 'hidden', border: isGainers ? '2px solid #dcfce7' : '2px solid #fee2e2' }}>
                {items.length > 0 ? items.map((stock, i) => {
                    const ticker = stock.symbol?.split('.')[0];
                    const stockData = SAUDI_STOCKS[ticker] || stock;
                    return (
                        <div key={i} onClick={() => navigate(`/company/${stock.symbol}`)} className="flex-between" style={{ padding: '1rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                            <div className="flex-center" style={{ gap: '0.75rem' }}>
                                <div style={{ fontWeight: 800, color: isGainers ? '#10b981' : '#ef4444', width: '24px' }}>#{i + 1}</div>
                                <StockLogo ticker={ticker} logoUrl={stock.logo} size={40} />
                                <div>
                                    <div style={{ fontWeight: 700 }}>{ticker}</div>
                                    <div className="caption" style={{ fontSize: '0.75rem' }}>{stockData.name || stock.name}</div>
                                </div>
                            </div>
                            <div style={{
                                background: isGainers ? '#dcfce7' : '#fee2e2',
                                padding: '0.375rem 0.875rem',
                                borderRadius: '999px',
                                color: isGainers ? '#10b981' : '#ef4444',
                                fontWeight: 800
                            }}>
                                {isGainers ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                            </div>
                        </div>
                    );
                }) : <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No data</div>}
            </Card>
        </div>
    );
};

const StockList = ({ items, navigate, color, type }) => (
    <Card style={{ padding: 0, overflow: 'hidden', border: `2px solid ${color}30` }}>
        {items.length > 0 ? items.map((stock, i) => {
            const ticker = stock.symbol?.split('.')[0];
            const stockData = SAUDI_STOCKS[ticker] || stock;
            let valueRaw = 0;
            let valueDisplay = '';

            if (type === 'dividend') {
                valueRaw = (stock.dividendYield || 0) * 100;
                valueDisplay = valueRaw.toFixed(2) + '%';
            } else if (type === 'active') {
                valueDisplay = (stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : '0');
            } else if (type === 'marketCap') {
                valueDisplay = (stock.marketCap ? (stock.marketCap / 1000000000).toFixed(2) + 'B' : '0');
            } else if (type === 'value') {
                valueDisplay = (stock.peRatio || 0).toFixed(2) + 'x';
            }

            return (
                <div key={i} onClick={() => navigate(`/company/${stock.symbol}`)} className="flex-between" style={{ padding: '1rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <div style={{ fontWeight: 800, color: '#64748b', width: '24px' }}>#{i + 1}</div>
                        <StockLogo ticker={ticker} logoUrl={stock.logo} size={40} />
                        <div>
                            <div style={{ fontWeight: 700 }}>{ticker}</div>
                            <div className="caption" style={{ fontSize: '0.75rem' }}>{stockData.name || stock.name}</div>
                        </div>
                    </div>
                    <div style={{
                        background: `${color}15`,
                        padding: '0.375rem 0.875rem',
                        borderRadius: '999px',
                        color: color,
                        fontWeight: 800,
                        fontSize: '0.875rem'
                    }}>
                        {valueDisplay}
                    </div>
                </div>
            );
        }) : <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No data available</div>}
    </Card>
);

export default function MarketSummary() {
    const navigate = useNavigate();
    const { prices, loading } = usePrices();
    const [activeTab, setActiveTab] = useState('overview');
    const [activeCategory, setActiveCategory] = useState('movers'); // movers, dividend, active, marketCap, value
    const [activeMarket, setActiveMarket] = useState(() => localStorage.getItem('activeMarket') || 'SA'); // Persist selection
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Persist market selection
    useEffect(() => {
        localStorage.setItem('activeMarket', activeMarket);
    }, [activeMarket]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getMarketStatus = (market) => {
        const now = new Date();
        const getMinutes = (d) => d.getHours() * 60 + d.getMinutes();

        if (market === 'SA') {
            const saudiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
            const day = saudiTime.getDay();
            const mins = getMinutes(saudiTime);
            const isOpen = day >= 0 && day <= 4 && mins >= 600 && mins <= 920;
            return { isOpen, text: isOpen ? 'Market Open' : 'Market Closed', time: saudiTime };
        }
        if (market === 'EG') {
            const egyptTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
            const day = egyptTime.getDay();
            const mins = getMinutes(egyptTime);
            const isOpen = day >= 0 && day <= 4 && mins >= 600 && mins <= 870;
            return { isOpen, text: isOpen ? 'Market Open' : 'Market Closed', time: egyptTime };
        }
        if (market === 'US') {
            const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
            const day = nyTime.getDay();
            const mins = getMinutes(nyTime);
            const isOpen = day >= 1 && day <= 5 && mins >= 570 && mins <= 960;
            return { isOpen, text: isOpen ? 'Market Open' : 'Market Closed', time: nyTime };
        }
        return { isOpen: true, text: 'Market Open', time: now };
    };

    const marketConfig = {
        'SA': {
            name: 'Saudi',
            indexTicker: '^TASI.SR',
            flag: 'https://flagcdn.com/w40/sa.png',
            currency: 'SAR',
            color: 'linear-gradient(135deg, #0D85D8 0%, #0ea5e9 100%)',
            chartColor: '#0D85D8',
            filter: (s) => s.category === 'SA' || s.symbol.endsWith('.SR')
        },
        'EG': {
            name: 'EGX',
            indexTicker: '^CASE30',
            flag: 'https://flagcdn.com/w40/eg.png',
            currency: 'EGP',
            color: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
            chartColor: '#c0392b',
            filter: (s) => s.category === 'EG' || s.symbol.endsWith('.CA')
        },
        'US': {
            name: 'US',
            indexTicker: '^DJI',
            flag: 'https://flagcdn.com/w40/us.png',
            currency: 'USD',
            color: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
            chartColor: '#2c3e50',
            filter: (s) => s.category === 'Global' && !s.symbol.startsWith('^')
        }
    };

    const currentMarket = marketConfig[activeMarket];

    const indexData = prices[currentMarket.indexTicker] || {};
    const indexValue = indexData.price || indexData.regularMarketPrice || 0;
    const indexChange = indexData.changePercent || indexData.regularMarketChangePercent || 0;
    const indexVolume = indexData.volume || indexData.regularMarketVolume || 0;

    const stocks = Object.values(prices)
        .filter(s => currentMarket.filter(s) && s.symbol !== currentMarket.indexTicker)
        .map(s => ({ symbol: s.symbol, ...s }));

    const totalVolume = stocks.reduce((sum, s) => sum + (s.volume || 0), 0);
    const sortedStocks = [...stocks].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));

    // Increased slice for better list view
    const topGainers = sortedStocks.filter(s => (s.changePercent || 0) > 0).slice(0, 5);
    const topLosers = sortedStocks.filter(s => (s.changePercent || 0) < 0).reverse().slice(0, 5);

    const sectorMap = {};
    stocks.forEach(stock => {
        const sector = stock.sector || (activeMarket === 'US' ? 'Technology' : 'General');
        if (!sectorMap[sector]) sectorMap[sector] = { count: 0, totalChange: 0 };
        sectorMap[sector].count++;
        sectorMap[sector].totalChange += (stock.changePercent || 0);
    });

    // Sector icon and color mapping
    const sectorStyles = {
        'Energy': { icon: '⛽', color: '#f59e0b' },
        'Financial Services': { icon: '🏦', color: '#3b82f6' },
        'Basic Materials': { icon: '🧱', color: '#78716c' },
        'Communication Services': { icon: '📡', color: '#8b5cf6' },
        'Utilities': { icon: '💡', color: '#10b981' },
        'Technology': { icon: '💻', color: '#06b6d4' },
        'Consumer Defensive': { icon: '🛒', color: '#22c55e' },
        'Consumer Cyclical': { icon: '🛍️', color: '#ec4899' },
        'Healthcare': { icon: '🏥', color: '#ef4444' },
        'Industrials': { icon: '🏭', color: '#64748b' },
        'Real Estate': { icon: '🏠', color: '#f97316' },
        'General': { icon: '📊', color: '#64748b' }
    };

    const sectors = Object.entries(sectorMap).map(([name, data]) => {
        const style = sectorStyles[name] || sectorStyles['General'];
        return {
            name,
            count: data.count,
            change: data.totalChange / data.count,
            icon: style.icon,
            color: style.color
        };
    }).sort((a, b) => b.change - a.change);

    const [newsItems, setNewsItems] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [selectedSource, setSelectedSource] = useState('All');

    useEffect(() => {
        const fetchNews = async () => {
            setNewsLoading(true);
            try {
                const response = await fetch(`/api/news?market=${activeMarket}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setNewsItems(data);
                    setSelectedSource('All'); // Reset filter on market change
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setNewsLoading(false);
            }
        };
        fetchNews();
    }, [activeMarket]);

    const sources = ['All', ...new Set(newsItems.map(item => item.publisher).filter(Boolean))];
    const filteredNews = selectedSource === 'All' ? newsItems : newsItems.filter(item => item.publisher === selectedSource);


    const formatNumber = (num) => {
        if (!num) return '0.00';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    const timeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 50%, #ecfdf5 100%)',
            paddingBottom: '6rem'
        }}>
            <div style={{ padding: '1rem 1rem 0.5rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#f1f5f9',
                    padding: '4px',
                    borderRadius: '16px'
                }}>
                    {Object.entries(marketConfig).map(([key, config]) => {
                        const words = config.name.split(' ');
                        const firstLine = words[0];
                        const secondLine = words.slice(1).join(' ');
                        const isActive = activeMarket === key;

                        return (
                            <button
                                key={key}
                                onClick={() => setActiveMarket(key)}
                                style={{
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isActive ? '#0284c7' : 'transparent',
                                    color: isActive ? 'white' : '#475569',
                                    fontWeight: 700,
                                    boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <img src={config.flag} style={{ width: '20px', borderRadius: '3px' }} alt="" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{config.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <Card className="animate-fade-in" style={{ padding: '1.5rem', background: 'white', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {currentMarket.flag ? <img src={currentMarket.flag} width="20" style={{ borderRadius: '4px' }} /> : <Globe size={16} />}
                            {currentMarket.name} Index
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700,
                            color: getMarketStatus(activeMarket).isOpen ? '#10b981' : '#ef4444',
                            background: getMarketStatus(activeMarket).isOpen ? '#e6fffa' : '#fef2f2',
                            padding: '4px 10px', borderRadius: '8px'
                        }}>
                            {getMarketStatus(activeMarket).isOpen ? <Activity size={14} /> : <Clock size={14} />}
                            {getMarketStatus(activeMarket).text}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div>
                        <div className="h1" style={{ fontSize: '2.5rem', lineHeight: 1, letterSpacing: '-1px' }}>
                            {indexValue ? indexValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}
                        </div>
                        <div className="flex-center" style={{ gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-start' }}>
                            <Badge color={indexChange >= 0 ? 'success' : 'danger'} style={{ fontSize: '1rem', padding: '0.35rem 0.85rem' }}>
                                {indexChange >= 0 ? '+' : ''}{indexChange.toFixed(2)}%
                            </Badge>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>
                                {((indexData.change || 0) > 0 ? '+' : '')}{(indexData.change || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <IndexChart
                        symbol={currentMarket.indexTicker}
                        color={currentMarket.chartColor}
                        visibleRanges={activeMarket === 'EG' ? ['1D', '5D', '1M'] : undefined}
                    />
                </Card>
            </div>

            <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{
                    background: 'white', padding: '0.5rem', borderRadius: '16px', display: 'flex', gap: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflowX: 'auto'
                }}>
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutGrid },
                        { id: 'movers', label: 'Movers', icon: TrendingUp },
                        { id: 'sectors', label: 'Sectors', icon: PieChart },
                        { id: 'global', label: 'Global', icon: Globe2 },
                        { id: 'news', label: 'News', icon: Newspaper },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1, minWidth: '80px', padding: '0.75rem', borderRadius: '12px', border: 'none',
                                    background: isActive ? currentMarket.color : 'transparent',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                                    fontWeight: isActive ? 700 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: '0.875rem',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                                    position: 'relative', overflow: 'hidden'
                                }}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activeTab === 'overview' && (
                    <div className="flex-col animate-slide-up" style={{ gap: '1.5rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Card style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Market Breadth</div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#10b981' }}>{stocks.filter(s => (s.changePercent || 0) > 0).length}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', paddingBottom: '4px' }}>Advancing</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(stocks.filter(s => (s.changePercent || 0) > 0).length / stocks.length) * 100}%`, height: '100%', background: '#10b981' }} />
                                </div>
                            </Card>
                            <Card style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Total Liquidity</div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#3b82f6' }}>{formatNumber(totalVolume)}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', paddingBottom: '4px' }}>Vol</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>High Activity</div>
                            </Card>
                        </div>



                        {/* Highlights Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {[
                                { id: 'dividend', label: 'Top Dividend', icon: DollarSign, color: '#3b82f6', bg: '#eff6ff' },
                                { id: 'active', label: 'Most Active', icon: Activity, color: '#ec4899', bg: '#fdf2f8' },
                                { id: 'marketCap', label: 'Market Cap', icon: Building, color: '#10b981', bg: '#ecfdf5' },
                                { id: 'value', label: 'Best Value', icon: Target, color: '#f97316', bg: '#fff7ed' }
                            ].map(item => {
                                const Icon = item.icon;
                                const isActive = activeCategory === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveCategory(isActive ? 'movers' : item.id)}
                                        style={{
                                            border: isActive ? `2px solid ${item.color}` : '1px solid #e2e8f0',
                                            background: isActive ? item.bg : 'white',
                                            padding: '1rem',
                                            borderRadius: '16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            boxShadow: isActive ? `0 4px 12px ${item.color}20` : 'none'
                                        }}
                                    >
                                        <Icon size={20} color={item.color} />
                                        <span style={{ fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>{item.label}</span>
                                        {isActive && <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `6px solid ${item.color}` }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dynamic List Section */}
                        {activeCategory === 'movers' ? (
                            <TopMoversSection gainers={topGainers} losers={topLosers} navigate={navigate} />
                        ) : (
                            <div className="animate-fade-in flex-col" style={{ gap: '1rem' }}>
                                <div className="flex-between">
                                    <h3 className="h3" style={{ margin: 0 }}>
                                        {activeCategory === 'dividend' && 'Top Dividend Yields'}
                                        {activeCategory === 'active' && 'Most Active Stocks'}
                                        {activeCategory === 'marketCap' && 'Top Market Cap'}
                                        {activeCategory === 'value' && 'Best Value (PE)'}
                                    </h3>
                                    <button onClick={() => setActiveCategory('movers')} style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                                        <Activity size={16} />
                                    </button>
                                </div>
                                <StockList
                                    items={(() => {
                                        const base = [...stocks];
                                        if (activeCategory === 'dividend') return base.sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0)).slice(0, 5);
                                        if (activeCategory === 'active') return base.sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
                                        if (activeCategory === 'marketCap') return base.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, 5);
                                        if (activeCategory === 'value') return base.filter(s => (s.peRatio || 0) > 0).sort((a, b) => (a.peRatio || 0) - (b.peRatio || 0)).slice(0, 5);
                                        return [];
                                    })()}
                                    navigate={navigate}
                                    type={activeCategory}
                                    color={
                                        activeCategory === 'dividend' ? '#3b82f6' :
                                            activeCategory === 'active' ? '#ec4899' :
                                                activeCategory === 'marketCap' ? '#10b981' : '#f97316'
                                    }
                                />
                            </div>
                        )}

                        {/* Recent News Preview */}
                        <div>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <h3 className="h3">News Headlines</h3>
                                <button onClick={() => setActiveTab('news')} style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                            </div>
                            {newsItems.length > 0 ? (
                                <Card style={{ padding: '0', overflow: 'hidden' }}>
                                    {newsItems.slice(0, 5).map((news, i) => (
                                        <div key={i} onClick={() => navigate('/news', { state: { article: news } })} style={{ padding: '1rem', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', display: 'flex', gap: '1rem' }}>
                                            {news.thumbnail && <img src={news.thumbnail.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(news.thumbnail)}` : news.thumbnail} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} alt="" />}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{news.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{news.publisher} • {timeAgo(news.time)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            ) : (
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>Loading news...</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'movers' && (
                    <div className="flex-col animate-slide-up" style={{ gap: '1.5rem' }}>
                        <TopMoversSection gainers={topGainers} losers={topLosers} navigate={navigate} />
                    </div>
                )}

                {activeTab === 'sectors' && (
                    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {sectors.length > 0 ? sectors.map((sector, i) => (
                            <Card key={i} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="flex-between">
                                    <span style={{ fontSize: '1.5rem' }}>{sector.icon}</span>
                                    <Badge color={sector.change >= 0 ? 'success' : 'danger'}>
                                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                                    </Badge>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{sector.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sector.count} companies</div>
                            </Card>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Sector data gathering...</div>
                        )}
                    </div>
                )}

                {/* GLOBAL TAB - Dynamic Data */}
                {activeTab === 'global' && (
                    <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>
                        {[
                            { ticker: '^GSPC', name: 'S&P 500', country: '🇺🇸' },
                            { ticker: '^DJI', name: 'Dow Jones', country: '🇺🇸' },
                            { ticker: '^IXIC', name: 'Nasdaq 100', country: '🇺🇸' },
                            { ticker: '^FTSE', name: 'FTSE 100', country: '🇬🇧' },
                            { ticker: '^GDAXI', name: 'DAX', country: '🇩🇪' },
                            { ticker: '^N225', name: 'Nikkei 225', country: '🇯🇵' },
                            { ticker: 'BZ=F', name: 'Brent Crude', country: '🛢️' },
                            { ticker: 'GC=F', name: 'Gold', country: '🥇' },
                        ].map((idx, i) => {
                            const data = prices[idx.ticker] || {};
                            const price = data.price || data.regularMarketPrice || 0;
                            const change = data.changePercent || data.regularMarketChangePercent || 0;

                            return (
                                <Card key={i} style={{ padding: '1.25rem' }}>
                                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                        <div className="flex-center" style={{ gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{idx.country}</span>
                                            <span style={{ fontWeight: 700 }}>{idx.name}</span>
                                        </div>
                                        <div style={{ color: change >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                        {price ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                        {price ? 'Live Data' : 'Fetching...'}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* NEWS TAB */}
                {activeTab === 'news' && (
                    <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>

                        {/* Source Filter */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }} className="no-scrollbar">
                            {sources.map(source => (
                                <button
                                    key={source}
                                    onClick={() => setSelectedSource(source)}
                                    style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        background: selectedSource === source ? currentMarket.color : 'white',
                                        color: selectedSource === source ? 'white' : '#64748b',
                                        border: selectedSource === source ? 'none' : '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedSource === source ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    {source}
                                </button>
                            ))}
                        </div>

                        {filteredNews.map((news, i) => (
                            <Card key={i}
                                onClick={() => navigate('/news', { state: { article: news } })}
                                className="flex-col"
                                style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                            >
                                {news.thumbnail && (
                                    <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                                        <img
                                            src={news.thumbnail.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(news.thumbnail)}` : news.thumbnail}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt=""
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '1rem' }}>
                                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                        <Badge style={{ background: '#f1f5f9', color: '#64748b' }}>{news.publisher}</Badge>
                                        <div className="flex-center" style={{ gap: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            <Clock size={12} />
                                            {timeAgo(news.time)}
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                        {news.title}
                                    </h3>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>


        </div >
    );
}
