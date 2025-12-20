/**
 * AdminCompanyProfile - Robust CMS Web View of Company Profile
 * All 23 markets, 300+ stocks, 5 tabs, 60+ data fields, premium design
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, RefreshCw, TrendingUp, TrendingDown, Building2,
    BarChart3, DollarSign, PieChart as PieChartIcon, Target, Globe, ExternalLink,
    Activity, Clock, Users, ChevronRight, Star, Info
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';

// Import stock data from StockCard
import {
    SAUDI_STOCKS, US_STOCKS, EGYPT_STOCKS, INDIA_STOCKS,
    UK_STOCKS, CANADA_STOCKS, AUSTRALIA_STOCKS, HONGKONG_STOCKS,
    GERMANY_STOCKS, JAPAN_STOCKS, UAE_STOCKS, SOUTHAFRICA_STOCKS,
    QATAR_STOCKS, StockLogo, getStockData
} from '../components/StockCard';
import StockChart from '../components/StockChart';

// Import market configuration
import { MARKETS } from '../context/MarketContext';

import { getEndpoint } from '../config/api';

const API_URL = getEndpoint('/api/stock-profile');

// Additional stocks for Phase 2 markets (not yet in StockCard)
const PHASE2_STOCKS = {
    FR: { // France
        'MC': { name: 'LVMH', initials: 'LV', color: '#8B4513' },
        'OR': { name: 'L\'Oreal', initials: 'LO', color: '#000000' },
        'TTE': { name: 'TotalEnergies', initials: 'TE', color: '#ff0000' },
        'SAN': { name: 'Sanofi', initials: 'SAN', color: '#7b2d8b' },
        'AIR': { name: 'Airbus', initials: 'AIR', color: '#00205b' },
        'BNP': { name: 'BNP Paribas', initials: 'BNP', color: '#00965e' },
        'AI': { name: 'Air Liquide', initials: 'AL', color: '#0055a5' },
        'SU': { name: 'Schneider Electric', initials: 'SE', color: '#3dcd58' },
        'KER': { name: 'Kering', initials: 'KER', color: '#000000' },
        'DG': { name: 'Vinci', initials: 'VIN', color: '#0066b3' },
    },
    CH: { // Switzerland
        'NESN': { name: 'Nestlé', initials: 'NES', color: '#7b868c' },
        'ROG': { name: 'Roche', initials: 'ROC', color: '#0066a1' },
        'NOVN': { name: 'Novartis', initials: 'NOV', color: '#ec6602' },
        'UBSG': { name: 'UBS Group', initials: 'UBS', color: '#e60000' },
        'ZURN': { name: 'Zurich Insurance', initials: 'ZUR', color: '#003399' },
        'ABBN': { name: 'ABB', initials: 'ABB', color: '#ff0000' },
        'CSGN': { name: 'Credit Suisse', initials: 'CS', color: '#000099' },
        'SREN': { name: 'Swiss Re', initials: 'SRE', color: '#003057' },
        'CFR': { name: 'Richemont', initials: 'CFR', color: '#000000' },
        'GIVN': { name: 'Givaudan', initials: 'GIV', color: '#6c2c90' },
    },
    BR: { // Brazil
        'VALE3': { name: 'Vale', initials: 'VAL', color: '#00af50' },
        'PETR4': { name: 'Petrobras', initials: 'PET', color: '#005c37' },
        'ITUB4': { name: 'Itaú Unibanco', initials: 'ITU', color: '#ec7000' },
        'BBDC4': { name: 'Bradesco', initials: 'BBD', color: '#cc092f' },
        'ABEV3': { name: 'Ambev', initials: 'ABV', color: '#ffc72c' },
        'B3SA3': { name: 'B3', initials: 'B3', color: '#00b4d8' },
        'WEGE3': { name: 'WEG', initials: 'WEG', color: '#0066cc' },
        'RENT3': { name: 'Localiza', initials: 'LOC', color: '#00aa4f' },
        'RAIL3': { name: 'Rumo', initials: 'RUM', color: '#005c37' },
        'SUZB3': { name: 'Suzano', initials: 'SUZ', color: '#00aa4f' },
    },
    KR: { // South Korea
        '005930': { name: 'Samsung Electronics', initials: 'SAM', color: '#1428a0' },
        '000660': { name: 'SK Hynix', initials: 'SKH', color: '#ed1c24' },
        '005935': { name: 'Samsung Elec Pref', initials: 'SMP', color: '#1428a0' },
        '035420': { name: 'Naver', initials: 'NAV', color: '#03c75a' },
        '051910': { name: 'LG Chem', initials: 'LGC', color: '#a50034' },
        '006400': { name: 'Samsung SDI', initials: 'SDI', color: '#0066cc' },
        '035720': { name: 'Kakao', initials: 'KKO', color: '#ffe812' },
        '068270': { name: 'Celltrion', initials: 'CTR', color: '#0072bc' },
        '028260': { name: 'Samsung C&T', initials: 'SCT', color: '#1428a0' },
        '003550': { name: 'LG', initials: 'LG', color: '#a50034' },
    },
    SG: { // Singapore
        'D05': { name: 'DBS Group', initials: 'DBS', color: '#d61f26' },
        'O39': { name: 'OCBC Bank', initials: 'OBC', color: '#ed1c24' },
        'U11': { name: 'UOB', initials: 'UOB', color: '#0033a0' },
        'Z74': { name: 'Singtel', initials: 'SGT', color: '#ed1c24' },
        'C6L': { name: 'Singapore Airlines', initials: 'SIA', color: '#007dc3' },
        'BN4': { name: 'Keppel Corp', initials: 'KEP', color: '#0055a5' },
        'A17U': { name: 'CapitaLand Ascendas', initials: 'CAL', color: '#00a4e4' },
        'C38U': { name: 'CapitaLand Integrated', initials: 'CIC', color: '#c8102e' },
        'G13': { name: 'Genting Singapore', initials: 'GEN', color: '#c41e3a' },
        'BS6': { name: 'Yangzijiang Ship', initials: 'YZJ', color: '#0066b3' },
    },
};

// Get stocks for a market
const getMarketStocks = (marketId) => {
    const stockMaps = {
        SA: SAUDI_STOCKS,
        EG: EGYPT_STOCKS,
        US: US_STOCKS,
        IN: INDIA_STOCKS,
        UK: UK_STOCKS,
        CA: CANADA_STOCKS,
        AU: AUSTRALIA_STOCKS,
        HK: HONGKONG_STOCKS,
        DE: GERMANY_STOCKS,
        JP: JAPAN_STOCKS,
        AE: UAE_STOCKS,
        ZA: SOUTHAFRICA_STOCKS,
        QA: QATAR_STOCKS,
        FR: PHASE2_STOCKS.FR,
        CH: PHASE2_STOCKS.CH,
        BR: PHASE2_STOCKS.BR,
        KR: PHASE2_STOCKS.KR,
        SG: PHASE2_STOCKS.SG,
    };
    return stockMaps[marketId] || {};
};

// Format helpers
const formatNumber = (val) => {
    if (val === null || val === undefined || val === 'N/A') return 'N/A';
    const num = parseFloat(val);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
};

const formatPercent = (val) => {
    if (val === null || val === undefined || val === 'N/A') return 'N/A';
    const num = parseFloat(val);
    if (isNaN(num)) return 'N/A';
    return (num * 100).toFixed(2) + '%';
};

const formatPrice = (val) => {
    if (val === null || val === undefined) return 'N/A';
    const num = parseFloat(val);
    if (isNaN(num)) return 'N/A';
    return num.toFixed(2);
};

// Data Cell Component
const DataCell = ({ label, value, highlight = false, currency = '' }) => (
    <div style={{
        padding: '1rem',
        background: highlight ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#F8FAFC',
        borderRadius: '12px',
        border: highlight ? '1px solid #bbf7d0' : '1px solid #E2E8F0'
    }}>
        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem', fontWeight: 600 }}>
            {label}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>
            {value || 'N/A'}{currency && value !== 'N/A' ? ` ${currency}` : ''}
        </div>
    </div>
);

// Card Component
const Card = ({ title, icon, children }) => (
    <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
        {title && (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1.25rem', color: '#1E293B', fontWeight: 700, fontSize: '1rem'
            }}>
                {icon}
                {title}
            </div>
        )}
        {children}
    </div>
);

// 52-Week Range Component
const FiftyTwoWeekRange = ({ current, low, high }) => {
    const position = low && high && current
        ? Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100))
        : 50;

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.875rem' }}>
                    {formatPrice(low)}
                </span>
                <span style={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>
                    Current: {formatPrice(current)}
                </span>
                <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.875rem' }}>
                    {formatPrice(high)}
                </span>
            </div>
            <div style={{
                height: '12px', background: '#E2E8F0', borderRadius: '12px',
                position: 'relative', overflow: 'visible'
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%)',
                    borderRadius: '12px',
                    width: '100%'
                }} />
                <div style={{
                    position: 'absolute',
                    left: `${position}%`,
                    top: '-4px',
                    width: '20px', height: '20px',
                    background: 'white',
                    borderRadius: '50%',
                    border: '3px solid #0EA5E9',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }} />
            </div>
        </div>
    );
};

// Ownership Pie Chart (SVG)
// Ownership Pie Chart (Recharts)
const OwnershipPieChart = ({ sharesOutstanding, floatShares, sharesShort }) => {
    const total = sharesOutstanding || 1;
    const floatPct = floatShares ? (floatShares / total) * 100 : 70;
    const shortPct = sharesShort ? (sharesShort / total) * 100 : 5;
    const insiderPct = Math.max(0, 100 - floatPct);

    const data = [
        { name: 'Float', value: floatPct, color: '#0EA5E9' },
        { name: 'Insider', value: insiderPct, color: '#8B5CF6' },
        { name: 'Short', value: shortPct, color: '#EF4444' },
    ].filter(d => d.value > 0);

    return (
        <div style={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `${value.toFixed(1)}%`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Progress Bar Component
const ProgressBar = ({ label, value, color = '#10B981' }) => {
    const pct = value ? Math.min(100, Math.max(0, value * 100)) : 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
        </div>
    );
};

// Recommendation Gauge (Consensus Chart)
const ConsensusChart = ({ value, label }) => {
    // value: 1 = Strong Buy, 5 = Strong Sell
    // We map 1..5 to 180..0 degrees for needle
    const score = Math.min(5, Math.max(1, value || 3));
    const normalizedScore = (score - 1) / 4; // 0 to 1

    const data = [
        { name: 'Buy', value: 1, color: '#10B981' },
        { name: 'Hold', value: 1, color: '#F59E0B' },
        { name: 'Sell', value: 1, color: '#EF4444' },
    ];

    // Needle rotation: 1=Strong Buy (Left/Green), 5=Strong Sell (Right/Red)
    // Actually standard is: 1=Strong Buy, 5=Strong Sell. 
    // Left side (180deg) should be Green, Right side (0deg) Red? 
    // Usually Gauges go 0 to 180. Let's say 0 is Left (Green), 180 is Right (Red).
    // Recharts Pie starts at 0 (Right). 
    // Let's use simple half-pie 180 to 0.

    // We need custom needle drawing on top of Pie.
    // Easier to just use the SVG I already have? use Recharts for consistency?
    // User asked for Recharts. Let's make a Half-Donut with active Cell highlighting.

    return (
        <div style={{ height: 180, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="70%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={
                                (index === 0 && score <= 2.33) ||
                                    (index === 1 && score > 2.33 && score <= 3.66) ||
                                    (index === 2 && score > 3.66) ? 1 : 0.3
                            } />
                        ))}
                    </Pie>
                    <Tooltip content={<></>} />{/* Hide Tooltip */}
                </PieChart>
            </ResponsiveContainer>
            <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E293B' }}>
                    {score.toFixed(1)}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>
                    {label || 'HOLD'}
                </div>
            </div>
        </div>
    );
};

// Profitability Waterfall
const ProfitabilityChart = ({ revenue, gross, ebitda, net }) => {
    const data = [
        { name: 'Revenue', value: revenue || 0, fill: '#3B82F6' },
        { name: 'Gross', value: gross || 0, fill: '#10B981' },
        { name: 'EBITDA', value: ebitda || 0, fill: '#F59E0B' },
        { name: 'Net', value: net || 0, fill: '#8B5CF6' },
    ];

    return (
        <div style={{ height: 250, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis
                        hide
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => formatNumber(value)}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Valuation Multiples
const ValuationChart = ({ peTrailing, peForward, pb, ps }) => {
    const data = [
        { name: 'P/E Trail', value: peTrailing || 0, color: '#3B82F6' },
        { name: 'P/E Fwd', value: peForward || 0, color: '#60A5FA' },
        { name: 'P/B', value: pb || 0, color: '#10B981' },
        { name: 'P/S', value: ps || 0, color: '#F59E0B' },
    ].filter(d => d.value > 0 && d.value < 100); // Filter out extreme outliers

    return (
        <div style={{ height: 250, width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => value.toFixed(2) + 'x'}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Price Target Chart
const PriceTargetChart = ({ current, low, mean, high }) => {
    const min = Math.min(current || 0, low || 0) * 0.9;
    const max = (high || current || 100) * 1.1;
    const range = max - min;
    const getPos = (val) => val ? ((val - min) / range) * 100 : 0;

    return (
        <div style={{ padding: '1rem 0' }}>
            <div style={{ position: 'relative', height: '60px', marginBottom: '1rem' }}>
                {/* Range bar */}
                <div style={{
                    position: 'absolute', top: '25px', left: `${getPos(low)}%`,
                    width: `${getPos(high) - getPos(low)}%`, height: '10px',
                    background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%)',
                    borderRadius: '5px'
                }} />
                {/* Current price marker */}
                <div style={{
                    position: 'absolute', top: '15px', left: `${getPos(current)}%`,
                    transform: 'translateX(-50%)'
                }}>
                    <div style={{ width: 4, height: 30, background: '#1E293B', borderRadius: 2 }} />
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E293B', marginTop: 4, textAlign: 'center' }}>Current</div>
                </div>
                {/* Mean marker */}
                {mean && (
                    <div style={{
                        position: 'absolute', top: '20px', left: `${getPos(mean)}%`,
                        transform: 'translateX(-50%)'
                    }}>
                        <div style={{ width: 12, height: 12, background: '#0EA5E9', borderRadius: '50%', border: '2px solid white' }} />
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                <span>Low: {formatPrice(low)}</span>
                <span style={{ color: '#0EA5E9', fontWeight: 700 }}>Target: {formatPrice(mean)}</span>
                <span>High: {formatPrice(high)}</span>
            </div>
        </div>
    );
};

// Main Component
export default function AdminCompanyProfile() {
    const [selectedMarket, setSelectedMarket] = useState('SA');
    const [selectedStock, setSelectedStock] = useState('2222');
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const currentMarket = MARKETS.find(m => m.id === selectedMarket) || MARKETS[0];
    const marketStocks = useMemo(() => getMarketStocks(selectedMarket), [selectedMarket]);

    const stocksList = useMemo(() => {
        return Object.entries(marketStocks).map(([symbol, data]) => ({
            symbol,
            name: data.name,
            ...data
        })).filter(s =>
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [marketStocks, searchQuery]);

    // Fetch stock data
    const fetchStockData = async (symbol) => {
        setLoading(true);
        try {
            const fullSymbol = currentMarket.suffix ? `${symbol}${currentMarket.suffix}` : symbol;
            const res = await fetch(`${API_URL}?symbol=${fullSymbol}`);
            if (res.ok) {
                const data = await res.json();
                setStockData(data);
                setLastUpdate(new Date());
            } else {
                setStockData(null);
            }
        } catch (e) {
            console.error('Error fetching stock data:', e);
            setStockData(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedStock) {
            fetchStockData(selectedStock);
        }
    }, [selectedStock, selectedMarket]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedStock) fetchStockData(selectedStock);
        }, 30000);
        return () => clearInterval(interval);
    }, [selectedStock, selectedMarket]);

    const handleMarketChange = (marketId) => {
        setSelectedMarket(marketId);
        setSearchQuery('');
        const stocks = getMarketStocks(marketId);
        const firstStock = Object.keys(stocks)[0];
        if (firstStock) setSelectedStock(firstStock);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'valuation', label: 'Valuation', icon: PieChartIcon },
        { id: 'analysts', label: 'Analysts', icon: Target },
        { id: 'about', label: 'About', icon: Building2 },
    ];

    const stock = stockData || {};
    const stockMeta = getStockData(selectedStock) || marketStocks[selectedStock] || {};
    const isPositive = (stock.change || 0) >= 0;
    const currency = currentMarket.currency;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        Company Profile
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {MARKETS.length} markets • Live stock data • Auto-refresh
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        <Clock size={12} style={{ marginRight: 4 }} />
                        Updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => fetchStockData(selectedStock)}
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                            color: 'white', border: 'none', borderRadius: '10px',
                            fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1
                        }}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>

                {/* Left Panel: Market & Stock Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Market Selector */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        border: '1px solid #E2E8F0', overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1rem', borderBottom: '1px solid #E2E8F0',
                            fontWeight: 700, color: '#1E293B', fontSize: '0.9rem'
                        }}>
                            <Globe size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                            Select Market
                        </div>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px',
                            padding: '0.75rem', maxHeight: '200px', overflowY: 'auto'
                        }}>
                            {MARKETS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => handleMarketChange(m.id)}
                                    title={m.name}
                                    style={{
                                        padding: '0.5rem',
                                        border: selectedMarket === m.id ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                                        background: selectedMarket === m.id ? '#EFF6FF' : 'transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1.25rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {m.flag}
                                </button>
                            ))}
                        </div>
                        <div style={{
                            padding: '0.75rem', background: '#F8FAFC',
                            borderTop: '1px solid #E2E8F0', textAlign: 'center'
                        }}>
                            <span style={{ fontWeight: 700, color: '#1E293B' }}>{currentMarket.flag} {currentMarket.name}</span>
                            <span style={{ color: '#64748B', fontSize: '0.75rem', marginLeft: 8 }}>{currentMarket.exchange}</span>
                        </div>
                    </div>

                    {/* Stock List */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        border: '1px solid #E2E8F0', overflow: 'hidden',
                        flex: 1, display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Search */}
                        <div style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 0.75rem', background: '#F8FAFC',
                                borderRadius: '8px'
                            }}>
                                <Search size={16} color="#94A3B8" />
                                <input
                                    type="text"
                                    placeholder="Search stocks..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{
                                        border: 'none', outline: 'none',
                                        background: 'transparent', width: '100%',
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Stock List */}
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                            {stocksList.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                    No stocks available for this market yet
                                </div>
                            ) : (
                                stocksList.map(s => (
                                    <button
                                        key={s.symbol}
                                        onClick={() => setSelectedStock(s.symbol)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            border: 'none',
                                            borderBottom: '1px solid #F1F5F9',
                                            background: selectedStock === s.symbol ? '#EFF6FF' : 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <StockLogo ticker={s.symbol} logoUrl={s.logo} size={40} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>
                                                {s.symbol}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                {s.name}
                                            </div>
                                        </div>
                                        {selectedStock === s.symbol && (
                                            <div style={{
                                                width: '8px', height: '8px',
                                                borderRadius: '50%', background: '#0EA5E9'
                                            }} />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Stock Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Stock Header */}
                    {/* Premium Web Stock Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {loading && !stockData ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
                                <RefreshCw size={24} className="animate-spin" style={{ marginBottom: '0.5rem' }} />
                                <div>Loading market data...</div>
                            </div>
                        ) : (
                            <>
                                {/* Header Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    {/* Identity */}
                                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{
                                            width: '72px', height: '72px',
                                            background: 'white',
                                            borderRadius: '20px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                            border: '1px solid #F1F5F9'
                                        }}>
                                            <StockLogo ticker={selectedStock} logoUrl={stockMeta.logo} size={56} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#64748B' }}>
                                                    {stock.symbol || selectedStock}
                                                </span>
                                                <span style={{
                                                    background: '#F1F5F9', color: '#475569',
                                                    padding: '2px 8px', borderRadius: '6px',
                                                    fontSize: '0.75rem', fontWeight: 700
                                                }}>
                                                    {currentMarket.exchange}
                                                </span>
                                            </div>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                                                {stockMeta.name || stock.shortName || stock.longName || selectedStock}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Price Block */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '8px' }}>
                                            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.03em' }}>
                                                {formatPrice(stock.price || stock.regularMarketPrice)}
                                            </span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94A3B8' }}>
                                                {currency}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 12px', borderRadius: '10px',
                                            background: isPositive ? '#DCFCE7' : '#FEE2E2',
                                            marginTop: '8px'
                                        }}>
                                            {isPositive ? <TrendingUp size={18} color="#16A34A" /> : <TrendingDown size={18} color="#DC2626" />}
                                            <span style={{ fontWeight: 700, color: isPositive ? '#16A34A' : '#DC2626', fontSize: '1rem' }}>
                                                {isPositive ? '+' : ''}{formatPrice(stock.change)} ({isPositive ? '+' : ''}{formatPrice(stock.changePercent)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Integrated Chart Section */}
                                <div style={{
                                    background: '#F8FAFC',
                                    borderRadius: '20px',
                                    padding: '1.25rem',
                                    border: '1px solid #E2E8F0'
                                }}>
                                    <StockChart
                                        symbol={currentMarket.suffix ? `${selectedStock}${currentMarket.suffix}` : selectedStock}
                                        embedded={true}
                                        height={500}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex', gap: '0.5rem', background: 'white',
                        borderRadius: '12px', padding: '0.5rem', border: '1px solid #E2E8F0'
                    }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: activeTab === tab.id
                                        ? 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
                                        : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#64748B',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1 }}>
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Card title="Trading Information" icon={<BarChart3 size={18} color="#0EA5E9" />}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Open" value={formatPrice(stock.open)} currency={currency} />
                                        <DataCell label="Previous Close" value={formatPrice(stock.prevClose || stock.previousClose)} currency={currency} />
                                        <DataCell label="Day High" value={formatPrice(stock.high || stock.dayHigh)} currency={currency} />
                                        <DataCell label="Day Low" value={formatPrice(stock.low || stock.dayLow)} currency={currency} />
                                        <DataCell label="Volume" value={formatNumber(stock.volume)} />
                                        <DataCell label="Avg Volume" value={formatNumber(stock.averageVolume)} />
                                    </div>
                                </Card>

                                <Card title="52-Week Range">
                                    <FiftyTwoWeekRange
                                        current={stock.price || stock.regularMarketPrice}
                                        low={stock.fiftyTwoWeekLow}
                                        high={stock.fiftyTwoWeekHigh}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                        <DataCell label="50-Day MA" value={formatPrice(stock.fiftyDayAverage)} />
                                        <DataCell label="200-Day MA" value={formatPrice(stock.twoHundredDayAverage)} />
                                        <DataCell label="52W Change" value={formatPercent(stock.fiftyTwoWeekChange)} highlight />
                                        <DataCell label="Beta" value={formatPrice(stock.beta)} />
                                    </div>
                                </Card>

                                <Card title="Key Statistics">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Market Cap" value={formatNumber(stock.marketCap)} highlight />
                                        <DataCell label="P/E Ratio" value={formatPrice(stock.trailingPE || stock.peRatio)} />
                                        <DataCell label="EPS" value={formatPrice(stock.trailingEps || stock.eps)} currency={currency} />
                                        <DataCell label="Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield || stock.dividendYield)} highlight />
                                    </div>
                                </Card>

                                <Card title="Ownership Structure" icon={<Users size={18} color="#8B5CF6" />}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                        <DataCell label="Shares Outstanding" value={formatNumber(stock.sharesOutstanding)} />
                                        <DataCell label="Float Shares" value={formatNumber(stock.floatShares)} />
                                        <DataCell label="Short Interest" value={formatNumber(stock.sharesShort)} />
                                        <DataCell label="Short % Float" value={stock.floatShares && stock.sharesShort ? ((stock.sharesShort / stock.floatShares) * 100).toFixed(2) + '%' : 'N/A'} />
                                    </div>
                                    <OwnershipPieChart
                                        sharesOutstanding={stock.sharesOutstanding}
                                        floatShares={stock.floatShares}
                                        sharesShort={stock.sharesShort}
                                    />
                                </Card>
                            </div>
                        )}

                        {/* Financials Tab */}
                        {activeTab === 'financials' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Card title="Revenue & Profitability" icon={<DollarSign size={18} color="#10B981" />}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Total Revenue" value={formatNumber(stock.totalRevenue)} highlight />
                                        <DataCell label="Revenue Per Share" value={formatPrice(stock.revenuePerShare)} currency={currency} />
                                        <DataCell label="Revenue Growth" value={formatPercent(stock.revenueGrowth)} />
                                        <DataCell label="Gross Profits" value={formatNumber(stock.grossProfits)} />
                                        <DataCell label="EBITDA" value={formatNumber(stock.ebitda)} highlight />
                                        <DataCell label="Net Income" value={formatNumber(stock.netIncomeToCommon)} />
                                    </div>
                                    <ProfitabilityChart
                                        revenue={stock.totalRevenue}
                                        gross={stock.grossProfits}
                                        ebitda={stock.ebitda}
                                        net={stock.netIncomeToCommon}
                                    />
                                </Card>

                                <Card title="Profit Margins">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <ProgressBar label="Profit Margin" value={stock.profitMargins} color="#10B981" />
                                        <ProgressBar label="Gross Margin" value={stock.grossMargins} color="#3B82F6" />
                                        <ProgressBar label="Operating Margin" value={stock.operatingMargins} color="#8B5CF6" />
                                        <ProgressBar label="EBITDA Margin" value={stock.ebitdaMargins} color="#F59E0B" />
                                    </div>
                                </Card>

                                <Card title="Cash Flow">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Operating Cash Flow" value={formatNumber(stock.operatingCashflow)} />
                                        <DataCell label="Free Cash Flow" value={formatNumber(stock.freeCashflow)} highlight />
                                        <DataCell label="Total Cash" value={formatNumber(stock.totalCash)} />
                                        <DataCell label="Cash Per Share" value={formatPrice(stock.totalCashPerShare)} currency={currency} />
                                    </div>
                                </Card>

                                <Card title="Balance Sheet">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Total Debt" value={formatNumber(stock.totalDebt)} />
                                        <DataCell label="Debt to Equity" value={formatPrice(stock.debtToEquity)} />
                                        <DataCell label="Current Ratio" value={formatPrice(stock.currentRatio)} highlight />
                                        <DataCell label="Book Value" value={formatPrice(stock.bookValue)} currency={currency} />
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Valuation Tab */}
                        {activeTab === 'valuation' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Card title="Valuation Metrics" icon={<PieChart size={18} color="#8B5CF6" />}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Market Cap" value={formatNumber(stock.marketCap)} highlight />
                                        <DataCell label="Enterprise Value" value={formatNumber(stock.enterpriseValue)} />
                                        <DataCell label="Trailing P/E" value={formatPrice(stock.trailingPE)} />
                                        <DataCell label="Forward P/E" value={formatPrice(stock.forwardPE)} highlight />
                                        <DataCell label="Price to Book" value={formatPrice(stock.priceToBook)} />
                                        <DataCell label="EV/EBITDA" value={formatPrice(stock.enterpriseToEbitda)} />
                                        <DataCell label="Price to Sales" value={formatPrice(stock.priceToSalesTrailing12Months)} />
                                        <DataCell label="PEG Ratio" value={formatPrice(stock.pegRatio)} />
                                    </div>
                                    <ValuationChart
                                        peTrailing={stock.trailingPE}
                                        peForward={stock.forwardPE}
                                        pb={stock.priceToBook}
                                        ps={stock.priceToSalesTrailing12Months}
                                    />
                                </Card>

                                <Card title="Earnings & Returns">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Trailing EPS" value={formatPrice(stock.trailingEps)} currency={currency} highlight />
                                        <DataCell label="Forward EPS" value={formatPrice(stock.forwardEps)} currency={currency} />
                                        <DataCell label="Earnings Growth" value={formatPercent(stock.earningsGrowth)} />
                                        <DataCell label="ROE" value={formatPercent(stock.returnOnEquity)} highlight />
                                        <DataCell label="ROA" value={formatPercent(stock.returnOnAssets)} />
                                    </div>
                                </Card>

                                <Card title="Dividends">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Dividend Rate" value={formatPrice(stock.trailingAnnualDividendRate)} currency={currency} />
                                        <DataCell label="Dividend Yield" value={formatPercent(stock.trailingAnnualDividendYield)} highlight />
                                        <DataCell label="Payout Ratio" value={formatPercent(stock.payoutRatio)} />
                                        <DataCell label="Last Dividend" value={formatPrice(stock.lastDividendValue)} currency={currency} />
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Analysts Tab */}
                        {activeTab === 'analysts' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <Card title="Analyst Consensus" icon={<Target size={18} color="#F59E0B" />}>
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                                        <ConsensusChart
                                            value={stock.recommendationMean}
                                            label={stock.recommendationKey?.replace('_', ' ').toUpperCase() || 'N/A'}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                        Based on {stock.numberOfAnalystOpinions || 0} analyst opinions
                                    </div>
                                </Card>

                                <Card title="Price Targets">
                                    <PriceTargetChart
                                        current={stock.price || stock.regularMarketPrice}
                                        low={stock.targetLowPrice}
                                        mean={stock.targetMeanPrice}
                                        high={stock.targetHighPrice}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                        <DataCell label="Target Low" value={formatPrice(stock.targetLowPrice)} currency={currency} />
                                        <DataCell label="Target Mean" value={formatPrice(stock.targetMeanPrice)} currency={currency} highlight />
                                        <DataCell label="Target High" value={formatPrice(stock.targetHighPrice)} currency={currency} />
                                    </div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <DataCell
                                            label="Upside Potential"
                                            value={stock.targetMeanPrice && stock.price
                                                ? ((stock.targetMeanPrice - stock.price) / stock.price * 100).toFixed(2) + '%'
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
                                <Card title="Company Profile" icon={<Building2 size={18} color="#0EA5E9" />}>
                                    <p style={{
                                        lineHeight: 1.8, color: '#475569', fontSize: '0.9rem',
                                        marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto'
                                    }}>
                                        {stock.longBusinessSummary || stock.description || 'No company description available.'}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        <DataCell label="Sector" value={stock.sector} />
                                        <DataCell label="Industry" value={stock.industry} />
                                        <DataCell label="Employees" value={stock.fullTimeEmployees?.toLocaleString()} />
                                        <DataCell label="Country" value={stock.country} />
                                        <DataCell label="City" value={stock.city} />
                                        <DataCell label="Exchange" value={stock.exchange || currentMarket.exchange} highlight />
                                    </div>
                                    {stock.website && (
                                        <a
                                            href={stock.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                                marginTop: '1.5rem', padding: '1rem',
                                                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                                                color: 'white', borderRadius: '12px',
                                                textDecoration: 'none', fontWeight: 700
                                            }}
                                        >
                                            <Globe size={18} />
                                            Visit Company Website
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
