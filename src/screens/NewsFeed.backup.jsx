
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Filter, Newspaper, Search, ChevronDown, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';

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

const NEWS_API_URL = import.meta.env.PROD
    ? '/api/news'
    : 'http://localhost:5001/api/news';

export default function NewsFeed() {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize state from navigation state if available (for Back button support)
    const [market, setMarket] = useState(location.state?.market || 'EG');
    const [newsItems, setNewsItems] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sources, setSources] = useState(['All']);
    const [selectedSource, setSelectedSource] = useState('All');
    const [dateFilter, setDateFilter] = useState('All'); // '1D', '7D', '30D', 'All'
    const [showDateMenu, setShowDateMenu] = useState(false);

    // Helper: Check date range
    const isWithinDateRange = (itemDateStr, filter) => {
        if (!itemDateStr) return false;
        if (filter === 'All') return true;

        const date = new Date(itemDateStr);
        const now = new Date();
        const diffTime = now - date; // millis
        const diffHours = diffTime / (1000 * 60 * 60);

        if (filter === '1D') return diffHours <= 24;
        if (filter === '7D') return diffHours <= (24 * 7);
        if (filter === '30D') return diffHours <= (24 * 30);
        return true;
    };

    // Reuse fetch logic from original file...
    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${NEWS_API_URL}?market=${market}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setNewsItems(data);
                // Initial filter will trigger via useEffect
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Fetch News when market changes + auto-refresh every 60s
    useEffect(() => {
        fetchNews();

        // Auto-refresh news every 60 seconds
        const interval = setInterval(fetchNews, 60000);
        return () => clearInterval(interval);
    }, [market]);

    // Calculate source counts based on CURRENT Date Filter
    const sourceCounts = React.useMemo(() => {
        const dateFiltered = newsItems.filter(item => isWithinDateRange(item.time, dateFilter));
        const counts = { 'All': dateFiltered.length };
        dateFiltered.forEach(item => {
            const pub = item.publisher || 'Unknown';
            counts[pub] = (counts[pub] || 0) + 1;
        });
        return counts;
    }, [newsItems, dateFilter]);

    useEffect(() => {
        let filtered = newsItems;

        // 1. Date Filter
        filtered = filtered.filter(item => isWithinDateRange(item.time, dateFilter));

        // 2. Source Filter
        if (selectedSource !== 'All') {
            filtered = filtered.filter(item => item.publisher === selectedSource);
        } else {
            // For 'All' source, we just show date filtered
        }

        setFilteredNews(filtered);

        // Update available sources list based on date-filtered items
        // We only show sources that have at least 1 article in the selected date range
        // But wait, if we filter by source, we lose other sources.
        // The sources list should be based on date-filtered items ONLY, not double filtered.
        const dateFilteredOnly = newsItems.filter(item => isWithinDateRange(item.time, dateFilter));
        const availableSources = ['All', ...new Set(dateFilteredOnly.map(item => item.publisher).filter(Boolean))];

        // SORT SOURCES: 'All' first, then by Count (High -> Low), then Alphabetical
        const sortedSources = availableSources.sort((a, b) => {
            if (a === 'All') return -1;
            if (b === 'All') return 1;
            const countA = sourceCounts[a] || 0;
            const countB = sourceCounts[b] || 0;
            if (countB !== countA) return countB - countA; // Descending Count
            return a.localeCompare(b); // Alphabetical tie-breaker
        });

        setSources(sortedSources);

    }, [selectedSource, dateFilter, newsItems, sourceCounts]);

    return (
        <div className="screen-container" style={{ paddingBottom: '6rem' }}>
            {/* Header */}
            <div className="flex-between" style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <BurgerMenu />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Market News
                    </h1>
                </div>

                {/* Date Filter Icon */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowDateMenu(!showDateMenu)}
                        style={{
                            padding: '0.6rem',
                            borderRadius: '12px',
                            background: '#f1f5f9',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: '#334155',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    >
                        <Calendar size={18} />
                        <span>{dateFilter === 'All' ? 'Hist' : dateFilter}</span>
                        <ChevronDown size={14} />
                    </button>

                    {/* Date Dropdown */}
                    {showDateMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            padding: '0.5rem',
                            zIndex: 100,
                            minWidth: '120px',
                            border: '1px solid #f1f5f9'
                        }}>
                            {['1D', '7D', '30D', 'All'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => {
                                        setDateFilter(d);
                                        setShowDateMenu(false);
                                    }}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '8px',
                                        background: dateFilter === d ? '#f1f5f9' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: dateFilter === d ? '#0D85D8' : '#334155',
                                        fontWeight: dateFilter === d ? 700 : 500
                                    }}
                                >
                                    {d === 'All' ? 'All History' : d}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Market Switcher - Reordered SA, EG, US + Flags */}
            <div style={{ padding: '0 1.5rem 1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                {[
                    { id: 'SA', label: 'Saudi', flag: 'https://flagcdn.com/w40/sa.png', color: '#17c89b' },
                    { id: 'EG', label: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png', color: '#e74c3c' },
                    { id: 'US', label: 'US', flag: 'https://flagcdn.com/w40/us.png', color: '#2c3e50' }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => {
                            setMarket(m.id);
                            setSelectedSource('All'); // Reset filter on market switch
                        }}
                        className="flex-center animate-scale"
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            background: market === m.id ? m.color : '#f1f5f9',
                            color: market === m.id ? '#fff' : '#64748b',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: market === m.id ? `0 4px 12px ${m.color}40` : 'none',
                            transition: 'all 0.2s ease',
                            gap: '0.5rem'
                        }}
                    >
                        <img src={m.flag} alt={m.label} style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} />
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Source Filter with Counts */}
            <div style={{ padding: '0 1.5rem 0.5rem 1.5rem' }}>
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
                                background: selectedSource === source ? '#1e293b' : '#fff',
                                color: selectedSource === source ? '#fff' : '#64748b',
                                border: selectedSource === source ? '1px solid #1e293b' : '1px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {/* Display Count next to Source Name */}
                            {source}{sourceCounts[source] ? ` (${sourceCounts[source]})` : ''}
                        </button>
                    ))}
                </div>
            </div>
            {/* News List */}
            <div className="animate-fade-in" style={{ padding: '1rem 1.5rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        Loading news...
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        {filteredNews.map((news, i) => (
                            <Card key={i}
                                onClick={() => navigate('/news', {
                                    state: {
                                        article: news,
                                        // Pass current state to allow restoring later
                                        returnState: { market, source: selectedSource }
                                    }
                                })}
                                className="flex-col"
                                style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f1f5f9' }}
                            >
                                {/* Thumbnail with Proxy Logic */}
                                {news.thumbnail && (
                                    <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={news.thumbnail}
                                            referrerPolicy="no-referrer"
                                            alt={news.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                // Fallback to Publisher Logo if main image fails
                                                e.target.onerror = null;
                                                const domainMap = {
                                                    'Mubasher': 'english.mubasher.info',
                                                    'Argaam': 'argaam.com',
                                                    'Zawya': 'zawya.com',
                                                    'Bloomberg': 'bloomberg.com',
                                                    'Reuters': 'reuters.com',
                                                    'Investing.com': 'investing.com',
                                                    'Egypt Today': 'egypttoday.com'
                                                };
                                                const domain = domainMap[news.publisher] || 'google.com'; // Default
                                                e.target.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
                                                e.target.style.objectFit = 'contain';
                                                e.target.style.padding = '2rem';
                                                e.target.style.backgroundColor = '#f8fafc';
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600
                                        }}>
                                            {news.publisher}
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: '1.25rem' }}>
                                    <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                                        <Badge style={{ background: '#f0f9ff', color: '#0284c7' }}>{news.publisher}</Badge>
                                        <div className="flex-center" style={{ gap: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            <Clock size={12} />
                                            {timeAgo(news.time)}
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4, color: '#0f172a' }}>
                                        {news.title}
                                    </h3>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No news found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}
