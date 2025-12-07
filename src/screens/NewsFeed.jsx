import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Filter, Newspaper, Search, ChevronDown } from 'lucide-react';
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

export default function NewsFeed() {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize state from navigation state if available (for Back button support)
    const [market, setMarket] = useState(location.state?.market || 'EG');
    const [newsItems, setNewsItems] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sources, setSources] = useState(['All']);
    const [selectedSource, setSelectedSource] = useState(location.state?.source || 'All');

    // Use relative path for production (Vercel) to let proxy or same-origin handle it
    const API_URL = import.meta.env.VITE_API_BASE_URL || '';

    // Fetch News when market changes + auto-refresh every 60s
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/news?market=${market}`);
                const data = await res.json();

                // Sort by time desc
                const sorted = (data || []).sort((a, b) => new Date(b.time) - new Date(a.time));
                setNewsItems(sorted);

                // Extract unique sources
                const uniqueSources = ['All', ...new Set(sorted.map(item => item.publisher).filter(Boolean))];
                setSources(uniqueSources);

                // Only reset filter if the selected source is invalid for this market, 
                // OR if it wasn't restored from state.
                if (!uniqueSources.includes(selectedSource)) {
                    setSelectedSource('All');
                }

            } catch (err) {
                console.error('Failed to fetch news', err);
                setNewsItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();

        // Auto-refresh news every 60 seconds
        const interval = setInterval(fetchNews, 60000);
        return () => clearInterval(interval);
    }, [market]);

    // Filter news when Source changes
    useEffect(() => {
        if (selectedSource === 'All') {
            setFilteredNews(newsItems);
        } else {
            setFilteredNews(newsItems.filter(item => item.publisher === selectedSource));
        }
    }, [selectedSource, newsItems]);

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
            </div>

            {/* Market Switcher */}
            <div style={{ padding: '0 1.5rem 1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                {[
                    { id: 'EG', label: 'Egypt' },
                    { id: 'SA', label: 'Saudi' },
                    { id: 'US', label: 'US' }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => {
                            setMarket(m.id);
                            setSelectedSource('All'); // Reset filter on market switch
                        }}
                        className={`flex-center animate-scale`}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            background: market === m.id ? 'linear-gradient(135deg, #2ae0b3 0%, #17c89b 100%)' : '#f1f5f9',
                            color: market === m.id ? '#fff' : '#64748b',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: market === m.id ? '0 4px 12px rgba(42, 224, 179, 0.25)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Source Filter */}
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
                            {source}
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
                                            src={news.thumbnail.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(news.thumbnail)}` : news.thumbnail}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt=""
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
