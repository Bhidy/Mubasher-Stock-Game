import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import {
    TrendingUp, TrendingDown, Globe, BarChart3,
    Activity, Clock, Building, DollarSign,
    Target, PieChart, LayoutGrid, Globe2, Newspaper, Flag,
    ChevronRight, ArrowUpRight, ArrowDownRight, Search, X, ExternalLink
} from 'lucide-react';
import { usePrices } from '../context/PriceContext';
import IndexChart from '../components/IndexChart';
import { StockLogo, SAUDI_STOCKS } from '../components/StockCard';
import { getEndpoint } from '../config/api';

// --- Premium UI Components ---

// --- News Image Component ---


// --- News Detail Modal ---
// --- News Detail Modal (Enhanced) ---
const NewsDetailModal = ({ article, onClose }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!article) return;

        // Reset state
        setFullContent(null);
        setLoading(false);

        if (article.content) {
            setFullContent(article.content);
        } else if (article.link || article.url) {
            setLoading(true);
            const targetUrl = article.link || article.url;
            fetch(getEndpoint(`/api/content?url=${encodeURIComponent(targetUrl)}&title=${encodeURIComponent(article.title)}`))
                .then(res => res.json())
                .then(data => {
                    if (data.content) setFullContent(data.content);
                })
                .catch(e => console.error("Content fetch failed:", e))
                .finally(() => setLoading(false));
        }
    }, [article]);

    if (!article) return null;

    // Frontend text styles
    const contentStyles = {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#334155",
        lineHeight: "1.8",
        fontSize: "1.05rem",
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }} onClick={onClose}>
            <div style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh',
                background: 'white', borderRadius: '24px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'pulse-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #E2E8F0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)',
                    position: 'sticky', top: 0, zIndex: 10
                }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Badge style={{ background: '#f1f5f9', color: '#64748b' }}>{article.publisher || article.source}</Badge>
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                            {new Date(article.time || article.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Link to source */}
                        {(article.url || article.link) && (
                            <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" style={{
                                padding: '0.5rem', borderRadius: '50%', background: '#F1F5F9', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#64748B'
                            }}>
                                <ExternalLink size={20} />
                            </a>
                        )}
                        <button onClick={onClose} style={{
                            padding: '0.5rem', borderRadius: '50%', background: '#F1F5F9', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <X size={20} color="#64748B" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem', overflowY: 'auto' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                        {article.title}
                    </h1>

                    {(article.thumbnail || article.imageUrl) && (
                        <div style={{ width: '100%', height: 'auto', maxHeight: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
                            <img
                                src={article.thumbnail || article.imageUrl}
                                alt={article.title}
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    <div style={contentStyles}>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', color: '#94a3b8' }}>
                                <div className="spin" style={{ width: '30px', height: '30px', border: '3px solid #f1f5f9', borderTopColor: '#0D85D8', borderRadius: '50%', marginBottom: '1rem' }} />
                                Loading full content...
                            </div>
                        ) : fullContent ? (
                            <div dangerouslySetInnerHTML={{ __html: fullContent }} />
                        ) : (
                            <p>{article.summary || article.description || "No preview available."}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ children, style, className = '', onClick }) => (
    <div
        className={`admin-card ${className}`}
        onClick={onClick}
        style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            border: '1px solid white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            ...style
        }}
        onMouseEnter={e => {
            if (onClick) e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(16, 185, 129, 0.1)';
        }}
        onMouseLeave={e => {
            if (onClick) e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.05)';
        }}
    >
        {children}
    </div>
);

const Badge = ({ children, color = 'neutral', style }) => {
    const colors = {
        success: { bg: 'rgba(220, 252, 231, 0.6)', text: '#15803d', border: '#86efac' },
        danger: { bg: 'rgba(254, 226, 226, 0.6)', text: '#b91c1c', border: '#fca5a5' },
        neutral: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
        blue: { bg: 'rgba(219, 234, 254, 0.6)', text: '#1d4ed8', border: '#93c5fd' },
        warning: { bg: 'rgba(254, 243, 199, 0.6)', text: '#b45309', border: '#fcd34d' }
    };
    const c = colors[color] || colors.neutral;
    return (
        <span style={{
            background: c.bg, color: c.text,
            padding: '4px 10px', borderRadius: '12px',
            fontSize: '0.75rem', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            border: `1px solid ${c.border}`,
            backdropFilter: 'blur(4px)',
            ...style
        }}>
            {children}
        </span>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.875rem 1.5rem',
            border: 'none',
            background: active ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'white',
            color: active ? 'white' : '#64748B',
            borderRadius: '16px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: active ? '0 10px 25px -5px rgba(15, 23, 42, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
            transform: active ? 'scale(1.02)' : 'scale(1)',
        }}
    >
        {Icon && <Icon size={18} strokeWidth={2.5} />}
        {label}
    </button>
);

// --- Sub-Components ---

const TopMoversSection = ({ gainers, losers }) => {
    const [subTab, setSubTab] = useState('gainers');
    const items = subTab === 'gainers' ? gainers : losers;
    const isGainers = subTab === 'gainers';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        padding: '10px', borderRadius: '14px',
                        background: isGainers ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        color: isGainers ? '#15803d' : '#b91c1c',
                        boxShadow: isGainers ? '0 4px 12px rgba(22, 163, 74, 0.2)' : '0 4px 12px rgba(220, 38, 38, 0.2)'
                    }}>
                        {isGainers ? <TrendingUp size={22} strokeWidth={2.5} /> : <TrendingDown size={22} strokeWidth={2.5} />}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.01em' }}>
                        {isGainers ? 'Top Gainers' : 'Top Losers'}
                    </h3>
                </div>
                <div style={{ background: '#f1f5f9', padding: '5px', borderRadius: '14px', display: 'flex' }}>
                    {['gainers', 'losers'].map(t => (
                        <button
                            key={t}
                            onClick={() => setSubTab(t)}
                            style={{
                                padding: '8px 20px', borderRadius: '10px', border: 'none',
                                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                background: subTab === t ? 'white' : 'transparent',
                                color: subTab === t ? (t === 'gainers' ? '#16a34a' : '#dc2626') : '#64748b',
                                boxShadow: subTab === t ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.length > 0 ? items.map((stock, i) => {
                    const ticker = stock.symbol?.split('.')[0];
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1rem', background: '#ffffff', borderRadius: '16px',
                            border: '1px solid #f1f5f9', transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.borderColor = isGainers ? '#86efac' : '#fca5a5';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <span style={{ fontWeight: 800, color: '#cbd5e1', width: '24px', fontSize: '1.1rem' }}>#{i + 1}</span>
                                <StockLogo ticker={ticker} logoUrl={stock.logo} size={44} />
                                <div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{ticker}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{stock.name}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{stock.price?.toFixed(2)}</div>
                                <Badge color={isGainers ? 'success' : 'danger'}>
                                    {isGainers ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                </Badge>
                            </div>
                        </div>
                    );
                }) : <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No data</div>}
            </div>
        </div>
    );
};

const StockList = ({ items, type, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.length > 0 ? items.map((stock, i) => {
            const ticker = stock.symbol?.split('.')[0];
            let valueDisplay = '';
            if (type === 'dividend') valueDisplay = ((stock.dividendYield || 0) * 100).toFixed(2) + '%';
            else if (type === 'active') valueDisplay = (stock.volume ? (stock.volume / 1e6).toFixed(2) + 'M' : '0');
            else if (type === 'marketCap') valueDisplay = (stock.marketCap ? (stock.marketCap / 1e9).toFixed(2) + 'B' : '0');
            else if (type === 'value') valueDisplay = (stock.peRatio || 0).toFixed(2) + 'x';

            return (
                <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem', background: 'white', borderRadius: '12px',
                    border: '1px solid #F1F5F9', cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: '#CBD5E1', width: '20px' }}>#{i + 1}</span>
                        <StockLogo ticker={ticker} logoUrl={stock.logo} size={40} />
                        <div>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{ticker}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{stock.name}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{stock.price?.toFixed(2)}</div>
                        <span style={{
                            color: color, fontWeight: 700, fontSize: '0.75rem',
                            background: `${color}15`, padding: '2px 8px', borderRadius: '6px'
                        }}>
                            {valueDisplay}
                        </span>
                    </div>
                </div>
            );
        }) : <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No data</div>}
    </div>
);

// --- Main Page Component ---

export default function AdminMarketProfile() {
    const navigate = useNavigate();
    const { prices } = usePrices();
    const { market, selectMarket } = useMarket();
    const activeMarket = market.id;
    const [activeTab, setActiveTab] = useState('overview');
    const [activeCategory, setActiveCategory] = useState('movers');
    const [showMarketDropdown, setShowMarketDropdown] = useState(false);

    // News state
    const [newsItems, setNewsItems] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [selectedSource, setSelectedSource] = useState('All');
    const [selectedNews, setSelectedNews] = useState(null); // Add this line

    // Market Config (Same as frontend + explicit styling)
    const marketConfig = {
        'SA': { name: 'Saudi Arabia', indexTicker: '^TASI.SR', flag: 'https://flagcdn.com/w40/sa.png', currency: 'SAR', chartColor: '#0D85D8', filter: s => s.category === 'SA' || s.symbol?.endsWith('.SR') },
        'EG': { name: 'Egypt', indexTicker: '^CASE30', flag: 'https://flagcdn.com/w40/eg.png', currency: 'EGP', chartColor: '#C0392B', filter: s => s.category === 'EG' || s.symbol?.endsWith('.CA') },
        'US': { name: 'United States', indexTicker: '^DJI', flag: 'https://flagcdn.com/w40/us.png', currency: 'USD', chartColor: '#2C3E50', filter: s => s.category === 'Global' || s.category === 'US' || (!s.symbol?.includes('.') && !s.symbol?.startsWith('^')) },
        'IN': { name: 'India', indexTicker: '^NSEI', flag: 'https://flagcdn.com/w40/in.png', currency: 'INR', chartColor: '#ff6b35', filter: s => s.category === 'IN' || s.symbol?.endsWith('.NS') },
        'UK': { name: 'United Kingdom', indexTicker: '^FTSE', flag: 'https://flagcdn.com/w40/gb.png', currency: 'GBP', chartColor: '#1e3a8a', filter: s => s.category === 'UK' || s.symbol?.endsWith('.L') },
        'CA': { name: 'Canada', indexTicker: '^GSPTSE', flag: 'https://flagcdn.com/w40/ca.png', currency: 'CAD', chartColor: '#ef4444', filter: s => s.category === 'CA' || s.symbol?.endsWith('.TO') },
        'AU': { name: 'Australia', indexTicker: '^AXJO', flag: 'https://flagcdn.com/w40/au.png', currency: 'AUD', chartColor: '#1e40af', filter: s => s.category === 'AU' || s.symbol?.endsWith('.AX') },
        'HK': { name: 'Hong Kong', indexTicker: '^HSI', flag: 'https://flagcdn.com/w40/hk.png', currency: 'HKD', chartColor: '#dc2626', filter: s => s.category === 'HK' || s.symbol?.endsWith('.HK') },
        'DE': { name: 'Germany', indexTicker: '^GDAXI', flag: 'https://flagcdn.com/w40/de.png', currency: 'EUR', chartColor: '#000000', filter: s => s.category === 'DE' || s.symbol?.endsWith('.DE') },
        'JP': { name: 'Japan', indexTicker: '^N225', flag: 'https://flagcdn.com/w40/jp.png', currency: 'JPY', chartColor: '#dc2626', filter: s => s.category === 'JP' || s.symbol?.endsWith('.T') },
        'AE': { name: 'UAE', indexTicker: 'EMAAR.AE', flag: 'https://flagcdn.com/w40/ae.png', currency: 'AED', chartColor: '#00732f', filter: s => s.category === 'AE' || s.symbol?.endsWith('.AE') },
        'ZA': { name: 'South Africa', indexTicker: 'JSE.JO', flag: 'https://flagcdn.com/w40/za.png', currency: 'ZAR', chartColor: '#007749', filter: s => s.category === 'ZA' || s.symbol?.endsWith('.JO') },
        'QA': { name: 'Qatar', indexTicker: 'QNBK.QA', flag: 'https://flagcdn.com/w40/qa.png', currency: 'QAR', chartColor: '#8b1538', filter: s => s.category === 'QA' || s.symbol?.endsWith('.QA') },
        'FR': { name: 'France', indexTicker: '^FCHI', flag: 'https://flagcdn.com/w40/fr.png', currency: 'EUR', chartColor: '#002654', filter: s => s.category === 'FR' || s.symbol?.endsWith('.PA') },
        'CH': { name: 'Switzerland', indexTicker: '^SSMI', flag: 'https://flagcdn.com/w40/ch.png', currency: 'CHF', chartColor: '#ff0000', filter: s => s.category === 'CH' || s.symbol?.endsWith('.SW') },
        'NL': { name: 'Netherlands', indexTicker: '^AEX', flag: 'https://flagcdn.com/w40/nl.png', currency: 'EUR', chartColor: '#ff6600', filter: s => s.category === 'NL' || s.symbol?.endsWith('.AS') },
        'ES': { name: 'Spain', indexTicker: '^IBEX', flag: 'https://flagcdn.com/w40/es.png', currency: 'EUR', chartColor: '#c60b1e', filter: s => s.category === 'ES' || s.symbol?.endsWith('.MC') },
        'IT': { name: 'Italy', indexTicker: 'FTSEMIB.MI', flag: 'https://flagcdn.com/w40/it.png', currency: 'EUR', chartColor: '#008c45', filter: s => s.category === 'IT' || s.symbol?.endsWith('.MI') },
        'BR': { name: 'Brazil', indexTicker: '^BVSP', flag: 'https://flagcdn.com/w40/br.png', currency: 'BRL', chartColor: '#009c3b', filter: s => s.category === 'BR' || s.symbol?.endsWith('.SA') },
        'MX': { name: 'Mexico', indexTicker: '^MXX', flag: 'https://flagcdn.com/w40/mx.png', currency: 'MXN', chartColor: '#006847', filter: s => s.category === 'MX' || s.symbol?.endsWith('.MX') },
        'KR': { name: 'South Korea', indexTicker: '^KS11', flag: 'https://flagcdn.com/w40/kr.png', currency: 'KRW', chartColor: '#003478', filter: s => s.category === 'KR' || s.symbol?.endsWith('.KS') },
        'TW': { name: 'Taiwan', indexTicker: '^TWII', flag: 'https://flagcdn.com/w40/tw.png', currency: 'TWD', chartColor: '#fe0000', filter: s => s.category === 'TW' || s.symbol?.endsWith('.TW') },
        'SG': { name: 'Singapore', indexTicker: '^STI', flag: 'https://flagcdn.com/w40/sg.png', currency: 'SGD', chartColor: '#ee2536', filter: s => s.category === 'SG' || s.symbol?.endsWith('.SI') }
    };

    const currentMarket = marketConfig[activeMarket];
    const indexData = prices[currentMarket.indexTicker] || {};
    const indexValue = indexData.price || indexData.regularMarketPrice || 0;
    const indexChange = indexData.changePercent || indexData.regularMarketChangePercent || 0;

    const stocks = Object.values(prices)
        .filter(stocks => currentMarket.filter(stocks) && stocks.symbol !== currentMarket.indexTicker)
        .map(stocks => ({ symbol: stocks.symbol, ...stocks }));

    const sortedStocks = [...stocks].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
    const topGainers = sortedStocks.filter(s => (s.changePercent || 0) > 0).slice(0, 5);
    const topLosers = sortedStocks.filter(s => (s.changePercent || 0) < 0).reverse().slice(0, 5);
    const totalVolume = stocks.reduce((sum, s) => sum + (s.volume || 0), 0);

    // Sectors Logic
    // Sectors Logic
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

    const sectorMap = {};
    stocks.forEach(stock => {
        const sector = stock.sector || (activeMarket === 'US' ? 'Technology' : 'General');
        if (!sectorMap[sector]) sectorMap[sector] = { count: 0, totalChange: 0 };
        sectorMap[sector].count++;
        sectorMap[sector].totalChange += (stock.changePercent || 0);
    });

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

    // News Fetching
    useEffect(() => {
        if (activeTab === 'news') {
            const fetchNews = async () => {
                setNewsLoading(true);
                try {
                    const response = await fetch(getEndpoint(`/api/news?market=${activeMarket}`));
                    const data = await response.json();
                    if (Array.isArray(data)) setNewsItems(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setNewsLoading(false);
                }
            };
            fetchNews();

            const interval = setInterval(fetchNews, 60000);
            return () => clearInterval(interval);
        }
    }, [activeTab, activeMarket]);

    const sources = ['All', ...new Set(newsItems.map(item => item.publisher).filter(Boolean))];
    const filteredNews = selectedSource === 'All' ? newsItems : newsItems.filter(item => item.publisher === selectedSource);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '100px' }}>

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                        Market Profile
                    </h1>
                    <div style={{ fontSize: '1rem', color: '#64748B', marginTop: '0.25rem' }}>
                        In-depth analysis of {currentMarket.name}
                    </div>
                </div>

                {/* Market Selector */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowMarketDropdown(!showMarketDropdown)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'white', border: '1px solid #E2E8F0',
                            borderRadius: '12px', padding: '0.75rem 1.25rem',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <img src={currentMarket.flag} style={{ width: '24px', borderRadius: '4px' }} alt="" />
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{currentMarket.name}</span>
                        <ChevronRight size={18} color="#94A3B8" style={{ transform: showMarketDropdown ? 'rotate(90deg)' : 'none' }} />
                    </button>
                    {showMarketDropdown && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowMarketDropdown(false)} />
                            <div style={{
                                position: 'absolute', top: '110%', right: 0,
                                background: 'white', borderRadius: '16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '0.5rem',
                                zIndex: 50, minWidth: '240px', maxHeight: '400px', overflowY: 'auto',
                                border: '1px solid #E2E8F0'
                            }}>
                                {Object.entries(marketConfig).map(([id, config]) => (
                                    <button key={id} onClick={() => { selectMarket(id); setShowMarketDropdown(false); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                                            padding: '0.75rem', border: 'none', background: market.id === id ? '#F1F5F9' : 'transparent',
                                            borderRadius: '10px', cursor: 'pointer', textAlign: 'left'
                                        }}>
                                        <img src={config.flag} style={{ width: '24px', borderRadius: '4px' }} alt="" />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{config.name}</span>
                                        {market.id === id && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Main Tabs */}
            <div style={{
                display: 'flex', gap: '0.5rem', background: '#F8FAFC',
                padding: '0.5rem', borderRadius: '16px', border: '1px solid #E2E8F0',
                width: 'fit-content'
            }}>
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutGrid },
                    { id: 'sectors', label: 'Sectors', icon: PieChart },
                    { id: 'global', label: 'Global Markets', icon: Globe2 },
                    { id: 'news', label: 'News', icon: Newspaper }
                ].map(tab => (
                    <TabButton
                        key={tab.id}
                        active={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        icon={tab.icon}
                        label={tab.label}
                    />
                ))}
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', animation: 'fadeIn 0.6s ease-out backwards' }}>
                        {/* Left: Index & Highlights */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Index Card */}
                            <div style={{ animation: 'fadeIn 0.6s ease-out backwards' }}>
                                <Card style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748B', margin: 0 }}>
                                                    {currentMarket.name} Index
                                                </h2>
                                                <Badge color={indexChange >= 0 ? 'success' : 'danger'}>
                                                    {indexChange >= 0 ? '+' : ''}{indexChange.toFixed(2)}%
                                                </Badge>
                                            </div>
                                            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                                                {indexValue ? indexValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Status</span>
                                                <Badge color="success">Open</Badge>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <IndexChart symbol={currentMarket.indexTicker} color={currentMarket.chartColor} height={350} />
                                    </div>
                                </Card>
                            </div>

                            {/* Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out 0.2s backwards' }}>
                                <Card style={{ padding: '1.5rem' }}>
                                    <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Market Breadth</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>
                                            {stocks.filter(s => (s.changePercent || 0) > 0).length}
                                        </span>
                                        <span style={{ color: '#64748B' }}>Advancing</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                                        <div style={{ width: `${stocks.length ? (stocks.filter(s => (s.changePercent || 0) > 0).length / stocks.length) * 100 : 0}%`, height: '100%', background: '#16A34A' }} />
                                    </div>
                                </Card>
                                <Card style={{ padding: '1.5rem' }}>
                                    <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Total Volume</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6' }}>
                                            {(totalVolume / 1e6).toFixed(1)}M
                                        </span>
                                        <span style={{ color: '#64748B' }}>Shares</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#16A34A', marginTop: '0.5rem', fontWeight: 600 }}>
                                        High Activity Level
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Right: Lists */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out 0.4s backwards' }}>
                            {/* Category Selector Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                {[
                                    { id: 'movers', label: 'Top Movers', icon: TrendingUp, color: '#64748b' },
                                    { id: 'dividend', label: 'Dividend', icon: DollarSign, color: '#3b82f6' },
                                    { id: 'active', label: 'Most Active', icon: Activity, color: '#ec4899' },
                                    { id: 'value', label: 'Best Value', icon: Target, color: '#f97316' }
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveCategory(item.id)}
                                        style={{
                                            padding: '1rem', borderRadius: '16px', border: '1px solid',
                                            borderColor: activeCategory === item.id ? item.color : '#E2E8F0',
                                            background: activeCategory === item.id ? `${item.color}10` : 'white',
                                            color: activeCategory === item.id ? item.color : '#64748B',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <item.icon size={24} />
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            <Card style={{ padding: '1.25rem' }}>
                                {activeCategory === 'movers' ? (
                                    <TopMoversSection gainers={topGainers} losers={topLosers} />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>
                                            {activeCategory === 'dividend' ? 'Top Dividend Yields' :
                                                activeCategory === 'active' ? 'Most Active Stocks' : 'Best Value Stocks'}
                                        </h3>
                                        <StockList items={(() => {
                                            const base = [...stocks];
                                            if (activeCategory === 'dividend') return base.sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0)).slice(0, 5);
                                            if (activeCategory === 'active') return base.sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
                                            if (activeCategory === 'value') return base.filter(s => (s.peRatio || 0) > 0).sort((a, b) => (a.peRatio || 0) - (b.peRatio || 0)).slice(0, 5);
                                            return [];
                                        })()}
                                            type={activeCategory}
                                            color={activeCategory === 'dividend' ? '#3b82f6' : activeCategory === 'active' ? '#ec4899' : '#f97316'}
                                        />
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div >
                )}

                {
                    activeTab === 'sectors' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out backwards' }}>
                            {sectors.length > 0 ? sectors.map((sector, i) => (
                                <div key={i} style={{ animation: `fadeIn 0.6s ease-out ${(i * 0.1)}s backwards` }}>
                                    <Card style={{ padding: '1.5rem', borderLeft: `5px solid ${sector.color}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '2rem' }}>{sector.icon}</span>
                                            <Badge color={sector.change >= 0 ? 'success' : 'danger'}>
                                                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                                            </Badge>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.25rem 0' }}>{sector.name}</h3>
                                        <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{sector.count} companies</div>
                                    </Card>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <PieChartIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1e293b' }}>No Sector Data</h3>
                                    <p style={{ margin: 0 }}>There is no sector classification available for this market.</p>
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    activeTab === 'global' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out backwards' }}>
                            {[
                                { ticker: '^GSPC', name: 'S&P 500', country: '🇺🇸', marketId: 'US' },
                                { ticker: '^DJI', name: 'Dow Jones', country: '🇺🇸', marketId: 'US' },
                                { ticker: '^IXIC', name: 'Nasdaq 100', country: '🇺🇸', marketId: 'US' },
                                { ticker: '^FTSE', name: 'FTSE 100', country: '🇬🇧', marketId: 'UK' },
                                { ticker: '^GDAXI', name: 'DAX', country: '🇩🇪', marketId: 'DE' },
                                { ticker: '^N225', name: 'Nikkei 225', country: '🇯🇵', marketId: 'JP' },
                                { ticker: 'BZ=F', name: 'Brent Crude', country: '🛢️' },
                                { ticker: 'GC=F', name: 'Gold', country: '🥇' },
                            ].map((idx, i) => {
                                const data = prices[idx.ticker] || {};
                                const price = data.price || data.regularMarketPrice || 0;
                                const change = data.changePercent || data.regularMarketChangePercent || 0;
                                return (
                                    <Card
                                        key={i}
                                        style={{ padding: '1.5rem', cursor: idx.marketId ? 'pointer' : 'default' }}
                                        onClick={() => {
                                            if (idx.marketId) {
                                                selectMarket(idx.marketId);
                                                setActiveTab('overview');
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{idx.country}</span>
                                                <span style={{ fontWeight: 700, color: '#0F172A' }}>{idx.name}</span>
                                            </div>
                                            <Badge color={change >= 0 ? 'success' : 'danger'}>
                                                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                                            </Badge>
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                                            {price ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}
                                        </div>
                                        {idx.marketId && (
                                            <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '0.5rem', fontWeight: 600 }}>
                                                Click to view profile →
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )
                }

                {
                    activeTab === 'news' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                                {sources.map(source => (
                                    <button key={source} onClick={() => setSelectedSource(source)}
                                        style={{
                                            padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid',
                                            borderColor: selectedSource === source ? currentMarket.chartColor : '#E2E8F0',
                                            background: selectedSource === source ? currentMarket.chartColor : 'white',
                                            color: selectedSource === source ? 'white' : '#64748B',
                                            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                                            whiteSpace: 'nowrap'
                                        }}>
                                        {source}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>


                                {filteredNews.map((news, i) => (
                                    <Card
                                        key={i}
                                        onClick={() => setSelectedNews(news)}
                                        style={{ padding: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                                            {news.thumbnail ? (
                                                <img
                                                    src={news.thumbnail}
                                                    alt={news.title}
                                                    referrerPolicy="no-referrer"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={e => { e.target.style.display = 'none'; }} // Hide if fails
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Newspaper size={40} color="#cbd5e1" />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Badge>{news.publisher || news.source}</Badge>
                                                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{new Date(news.time || news.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>
                                                {news.title}
                                            </h3>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div >
            {selectedNews && <NewsDetailModal article={selectedNews} onClose={() => setSelectedNews(null)} />}
        </div >
    );
}
