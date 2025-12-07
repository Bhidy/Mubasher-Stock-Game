import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Globe, RefreshCw } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

export default function StockMovementCard({ symbol }) {
    const [activeTab, setActiveTab] = useState('answer'); // 'answer' or 'sources'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchInsight = async () => {
            if (!symbol) return;
            setLoading(true);
            try {
                // Fetch from our new smart endpoint
                // Fetch from relative API endpoint
                const res = await fetch(`/api/ai-insight?symbol=${symbol}`);
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();

                if (isMounted) {
                    setData(json);
                }
            } catch (err) {
                console.error("Insight fetch fail", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchInsight();
        return () => { isMounted = false; };
    }, [symbol]);

    if (error || (!loading && !data)) return null;

    // Time updated formatting
    const updatedTime = data ? new Date(data.timestamp) : new Date();
    const timeString = `Updated ${Math.floor((new Date() - updatedTime) / 60000)} min ago`;

    return (
        <Card style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            {/* Header */}
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    <Sparkles size={18} className="animate-pulse" style={{ color: '#8b5cf6' }} />
                    <h3 className="h3" style={{ fontSize: '1rem' }}>
                        Why is {symbol.split('.')[0]} moving today?
                    </h3>
                </div>
                {loading && <RefreshCw className="spin" size={14} color="#94a3b8" />}
            </div>

            {/* Toggle Tabs */}
            <div style={{
                background: '#f1f5f9',
                padding: '4px',
                borderRadius: '8px',
                display: 'inline-flex',
                marginBottom: '1rem'
            }}>
                <button
                    onClick={() => setActiveTab('answer')}
                    style={{
                        padding: '0.375rem 1rem',
                        fontSize: '0.8175rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        background: activeTab === 'answer' ? 'white' : 'transparent',
                        color: activeTab === 'answer' ? '#0f172a' : '#64748b',
                        boxShadow: activeTab === 'answer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Answer
                </button>
                <div style={{ width: '1px', background: '#cbd5e1', margin: '4px 0' }} />
                <button
                    onClick={() => setActiveTab('sources')}
                    style={{
                        padding: '0.375rem 1rem',
                        fontSize: '0.8175rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        background: activeTab === 'sources' ? 'white' : 'transparent',
                        color: activeTab === 'sources' ? '#0f172a' : '#64748b',
                        boxShadow: activeTab === 'sources' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
                >
                    Sources
                    <span style={{
                        background: activeTab === 'sources' ? '#e2e8f0' : '#cbd5e1',
                        padding: '0 4px',
                        borderRadius: '4px',
                        fontSize: '0.625rem'
                    }}>
                        {data?.sources?.length || 0}
                    </span>
                </button>
            </div>

            {/* Content Content - Answer */}
            {activeTab === 'answer' && (
                <div className="animate-fade-in" style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: '#334155'
                }}>
                    {loading ? (
                        <div style={{ height: '40px', background: '#f1f5f9', borderRadius: '4px' }} className="skeleton" />
                    ) : (
                        data?.answer
                    )}

                    {!loading && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {timeString} • AI-generated summary
                        </div>
                    )}
                </div>
            )}

            {/* Content Content - Sources */}
            {activeTab === 'sources' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {!loading && data?.sources?.length === 0 && (
                        <div style={{ color: '#64748b', fontSize: '0.875rem', padding: '0.5rem 0' }}>
                            No recent news available for this stock.
                        </div>
                    )}

                    {!loading && data?.sources?.map((source, idx) => (
                        <a
                            key={idx}
                            href={source.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                width: '2rem',
                                height: '2rem',
                                background: '#e2e8f0',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Globe size={14} color="#64748b" />
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {source.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {source.publisher} • {new Date(source.time).toLocaleDateString()}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </Card>
    );
}
