import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, ExternalLink, Globe, Tag, Languages } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { usePrices } from '../context/PriceContext';
import { StockLogo } from '../components/StockCard';

export default function NewsArticle() {
    const location = useLocation();
    const navigate = useNavigate();
    const { prices } = usePrices();

    // Get news data passed from navigation state
    const article = location.state?.article;

    const [fullContent, setFullContent] = React.useState(null);
    const [fullContentLoading, setFullContentLoading] = React.useState(false);
    const [isTranslated, setIsTranslated] = React.useState(false);
    const [translatedContent, setTranslatedContent] = React.useState(null);
    const [translatedTitle, setTranslatedTitle] = React.useState(null);
    const [translating, setTranslating] = React.useState(false);

    // Translate content in-app
    const handleTranslate = async () => {
        if (isTranslated) {
            // Toggle back to English
            setIsTranslated(false);
            return;
        }

        setTranslating(true);
        try {
            // Translate title
            const titleRes = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: article.title, targetLang: 'ar' })
            });
            const titleData = await titleRes.json();
            if (titleData.translatedText) setTranslatedTitle(titleData.translatedText);

            // Translate content (preserve paragraph structure)
            // 1. Replace block tags with newlines
            let textToTranslate = (fullContent || article.summary || '')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/div>/gi, '\n')
                .replace(/<\/li>/gi, '\n');

            // 2. Strip remaining tags
            textToTranslate = textToTranslate.replace(/<[^>]*>/g, ' ').trim();

            // 3. Remove excessive newlines
            textToTranslate = textToTranslate.replace(/\n\s*\n/g, '\n\n');

            // 4. CLEANUP: Remove title if it appears at the start (common scraper artifact)
            if (article.title && textToTranslate.includes(article.title)) {
                textToTranslate = textToTranslate.replace(article.title, '');
            }

            // 5. CLEANUP: Deduplicate paragraphs (remove repeated sentences/lines)
            const seenParas = new Set();
            textToTranslate = textToTranslate.split('\n\n').filter(p => {
                const cleanP = p.trim();
                if (!cleanP || seenParas.has(cleanP)) return false;
                seenParas.add(cleanP);
                return true;
            }).join('\n\n');

            if (textToTranslate) {
                const contentRes = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textToTranslate, targetLang: 'ar' })
                });
                const contentData = await contentRes.json();
                if (contentData.translatedText) {
                    // 4. Wrap translated paragraphs with proper styling
                    const formattedHtml = contentData.translatedText
                        .split('\n\n')
                        .filter(p => p.trim())
                        .map(p => `<p style="direction: rtl; text-align: right; margin-bottom: 1.5rem; line-height: 1.8;">${p.trim()}</p>`)
                        .join('');

                    setTranslatedContent(formattedHtml);
                }
            }

            setIsTranslated(true);
        } catch (e) {
            console.error('Translation failed:', e);
        } finally {
            setTranslating(false);
        }
    };

    useEffect(() => {
        // Scroll top on mount
        window.scrollTo(0, 0);

        // Fetch full content if link is available
        if (article?.link) {
            setFullContentLoading(true);
            fetch(`/api/news/content?url=${encodeURIComponent(article.link)}&title=${encodeURIComponent(article.title)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.content) {
                        setFullContent(data.content);
                    }
                })
                .catch(e => console.error("Content fetch failed:", e))
                .finally(() => setFullContentLoading(false));
        }
    }, [article]);

    if (!article) {
        return (
            <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <p>Article not found.</p>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 700
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Format time
    const timeAgo = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    // Find related stock data
    const relatedStocks = (article.relatedTickers || [])
        .map(ticker => prices[ticker] || prices[`${ticker}.SR`] || prices[`${ticker}.CA`]) // Try exact or sufficed
        .filter(Boolean);
    // Style for injected HTML content
    const contentStyles = `
        .article-content {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #334155;
            line-height: 1.8;
            font-size: 1.05rem;
        }
        .article-content p {
            margin-bottom: 1.5rem;
        }
        .article-content h1, .article-content h2, .article-content h3 {
            color: #0f172a;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .article-content a {
            color: #0D85D8;
            text-decoration: none;
            font-weight: 500;
        }
        .article-content ul, .article-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }
    `;
    return (
        <div className="screen-container" style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '6rem' }}>
            <style>{contentStyles}</style>

            {/* Navbar */}
            <div className="flex-between" style={{
                padding: '1rem 1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <button
                    onClick={() => {
                        if (location.state?.returnState) {
                            navigate('/news-feed', { state: location.state.returnState });
                        } else {
                            navigate(-1);
                        }
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#0f172a',
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="animate-fade-in" style={{ padding: '0 1.5rem' }}>
                {/* Hero Image */}
                {article.thumbnail && (
                    <div style={{
                        width: '100%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                        <img
                            src={article.thumbnail?.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(article.thumbnail)}` : article.thumbnail}
                            alt="News"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                            }}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                )}

                {/* Title & Meta */}
                <div style={{ marginBottom: '2rem' }}>
                    {/* Publisher and Date row with Translate button */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
                                {article.publisher}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                {timeAgo(article.time)}
                            </span>
                        </div>
                        {/* Action buttons: Translate and Share */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {/* Sahm-style Translate Button */}
                            <button
                                onClick={handleTranslate}
                                disabled={translating}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.35rem 0.6rem',
                                    background: isTranslated ? '#10b981' : 'transparent',
                                    border: isTranslated ? 'none' : '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    cursor: translating ? 'wait' : 'pointer',
                                    color: isTranslated ? 'white' : '#334155',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {translating ? (
                                    <div className="spin" style={{ width: 16, height: 16, border: '2px solid #ccc', borderTopColor: '#0D85D8', borderRadius: '50%' }} />
                                ) : (
                                    <>
                                        <span style={{ fontSize: '1rem' }}>🌐</span>
                                        <span>{isTranslated ? 'English' : 'العربية'}</span>
                                    </>
                                )}
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: article.title,
                                            url: article.link
                                        });
                                    } else {
                                        navigator.clipboard.writeText(article.link);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.35rem 0.6rem',
                                    background: 'transparent',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: '#334155',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}
                            >
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        lineHeight: 1.3,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        direction: isTranslated ? 'rtl' : 'ltr',
                        textAlign: isTranslated ? 'right' : 'left'
                    }}>
                        {isTranslated && translatedTitle ? translatedTitle : article.title}
                    </h1>
                </div>

                {/* Article Body */}
                {fullContentLoading ? (
                    <div className="flex-center" style={{ padding: '4rem 0', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
                        <div className="spin" style={{ width: '30px', height: '30px', border: '3px solid #f1f5f9', borderTopColor: '#0D85D8', borderRadius: '50%' }} />
                        <span>Loading article...</span>
                    </div>
                ) : (
                    <div className="article-content" style={{ direction: isTranslated ? 'rtl' : 'ltr', textAlign: isTranslated ? 'right' : 'left' }}>
                        {isTranslated && translatedContent ? (
                            <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
                        ) : fullContent ? (
                            <div dangerouslySetInnerHTML={{ __html: fullContent }} />
                        ) : (
                            <p>
                                {article.summary || <>This is a developing story available on {article.publisher}.</>}
                            </p>
                        )}
                    </div>
                )}

                {/* Related Assets */}
                {relatedStocks.length > 0 && (
                    <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={20} color="#0D85D8" /> Mentioned Assets
                        </h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {relatedStocks.map((stock, i) => (
                                <Card
                                    key={i}
                                    onClick={() => navigate(`/company/${stock.symbol.split('.')[0]}`)}
                                    className="flex-between"
                                    style={{ padding: '1rem', cursor: 'pointer', border: '1px solid #f1f5f9' }}
                                >
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <StockLogo ticker={stock.symbol.split('.')[0]} size={42} />
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{stock.symbol}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stock.name}</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        color: stock.changePercent >= 0 ? '#10b981' : '#ef4444',
                                        fontWeight: 600
                                    }}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
