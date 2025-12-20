/**
 * AdminNewsFeed - Robust CMS Web View of News Feed
 * All 23 markets, inline article viewer, Arabic translation, premium design
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, RefreshCw, Globe, Newspaper, Clock, Filter, X,
    ExternalLink, Share2, ChevronLeft, Calendar, TrendingUp, ArrowLeft,
    Sparkles, Save, Edit3, Check, AlertCircle, Loader2
} from 'lucide-react';

import { MARKETS } from '../context/MarketContext';
import { useCMS } from '../context/CMSContext';
import { useNotification } from '../context/NotificationContext';

import { getEndpoint } from '../config/api';

const NEWS_API_URL = getEndpoint('/api/news');
const CONTENT_API_URL = getEndpoint('/api/content');
const TRANSLATE_API_URL = getEndpoint('/api/translate');
const AI_REWRITE_API_URL = getEndpoint('/api/ai-rewrite');
const CMS_API_URL = getEndpoint('/api/cms');

const DATE_FILTERS = [
    { id: '1D', label: 'Today', hours: 24 },
    { id: '7D', label: '7 Days', hours: 24 * 7 },
    { id: '30D', label: '30 Days', hours: 24 * 30 },
    { id: 'All', label: 'All Time', hours: Infinity },
];

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

// Clean content: Remove duplicate images and title from content
const cleanArticleContent = (content, title, thumbnailUrl) => {
    if (!content) return content;

    let cleaned = content;

    // 1. Remove title if it appears at the start (common scraper artifact)
    if (title) {
        // Remove exact title match
        cleaned = cleaned.replace(new RegExp(`^\\s*<[^>]*>\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</[^>]*>`, 'i'), '');
        cleaned = cleaned.replace(new RegExp(`^\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '');
    }

    // 2. AGGRESSIVE IMAGE REMOVAL - Since we show hero image, remove ALL images from content
    // This prevents any duplication issues
    let imageCount = 0;
    cleaned = cleaned.replace(/<img[^>]*>/gi, (match) => {
        imageCount++;
        // Remove the first image always (it's the hero image duplicate)
        // Keep subsequent images only if they're likely different content
        if (imageCount <= 1) {
            return ''; // Remove first image - hero already shows it
        }
        // Also check if it's similar to thumbnail
        if (thumbnailUrl) {
            const srcMatch = match.match(/src=["']([^"']+)["']/i);
            if (srcMatch) {
                const src = srcMatch[1].toLowerCase();
                const thumbBase = thumbnailUrl.toLowerCase().split('?')[0].split('/').pop();
                const srcBase = src.split('?')[0].split('/').pop();
                // If the image filename/base is similar, remove it
                if (srcBase === thumbBase || src.includes(thumbnailUrl.split('/').pop()?.split('?')[0] || '')) {
                    return '';
                }
            }
        }
        return match;
    });

    // 3. Remove empty paragraphs
    cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
    cleaned = cleaned.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');

    // 4. Remove excessive line breaks
    cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br/><br/>');

    return cleaned.trim();
};

// Inline Article View Component (not popup)
const ArticleView = ({ article, onBack }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    const [translatedTitle, setTranslatedTitle] = useState(null);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [translating, setTranslating] = useState(false);

    // Fetch full article content
    useEffect(() => {
        if (article?.link && article.link !== '#') {
            setLoading(true);
            fetch(`${CONTENT_API_URL}?url=${encodeURIComponent(article.link)}&title=${encodeURIComponent(article.title)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.content) {
                        // Clean the content to remove duplicates
                        const cleaned = cleanArticleContent(data.content, article.title, article.thumbnail);
                        setFullContent(cleaned);
                    }
                })
                .catch(e => console.error('Content fetch failed:', e))
                .finally(() => setLoading(false));
        } else if (article?.content) {
            const cleaned = cleanArticleContent(article.content, article.title, article.thumbnail);
            setFullContent(cleaned);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }, [article]);

    // Handle translation
    const handleTranslate = async () => {
        if (isTranslated) {
            setIsTranslated(false);
            return;
        }

        setTranslating(true);
        try {
            // Translate title
            const titleRes = await fetch(TRANSLATE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: article.title, targetLang: 'ar' })
            });
            const titleData = await titleRes.json();
            if (titleData.translatedText) setTranslatedTitle(titleData.translatedText);

            // Prepare content for translation - strip HTML, preserve structure
            let textToTranslate = (fullContent || article.summary || '')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/div>/gi, '\n')
                .replace(/<\/li>/gi, '\n')
                .replace(/<[^>]*>/g, ' ')
                .trim()
                .replace(/\n\s*\n/g, '\n\n');

            // Remove title if it appears at start
            if (article.title && textToTranslate.includes(article.title)) {
                textToTranslate = textToTranslate.replace(article.title, '');
            }

            // Deduplicate paragraphs
            const seenParas = new Set();
            textToTranslate = textToTranslate.split('\n\n').filter(p => {
                const cleanP = p.trim();
                if (!cleanP || seenParas.has(cleanP)) return false;
                seenParas.add(cleanP);
                return true;
            }).join('\n\n');

            if (textToTranslate) {
                const contentRes = await fetch(TRANSLATE_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textToTranslate, targetLang: 'ar' })
                });
                const contentData = await contentRes.json();
                if (contentData.translatedText) {
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: article.title, url: article.link });
        } else {
            navigator.clipboard.writeText(article.link);
            alert('Link copied!');
        }
    };

    // AI Rewrite state
    const [showRewriteModal, setShowRewriteModal] = useState(false);
    const [rewriting, setRewriting] = useState(false);
    const [rewrittenData, setRewrittenData] = useState(null);
    const [rewriteMarket, setRewriteMarket] = useState('SA');
    const [rewriteLanguage, setRewriteLanguage] = useState('ar');
    const [savingToCMS, setSavingToCMS] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [editingRewrite, setEditingRewrite] = useState(false);

    // Access CMS Context
    const { createNews } = useCMS();

    // Handle AI Rewrite
    const handleAIRewrite = async () => {
        setRewriting(true);
        setRewrittenData(null);

        try {
            const contentToRewrite = fullContent || article.summary || article.title;

            const response = await fetch(AI_REWRITE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: article.title,
                    content: contentToRewrite.replace(/<[^>]*>/g, ' ').trim(),
                    targetMarket: rewriteMarket,
                    targetLanguage: rewriteLanguage,
                    tone: 'professional'
                })
            });

            if (response.ok) {
                const data = await response.json();

                // DATA CLEANING: Ensure we don't save raw JSON string as content
                let CleanedData = { ...data };

                // If content looks like a JSON string, parse it
                if (typeof data.content === 'string' && data.content.trim().startsWith('{')) {
                    try {
                        const parsedContent = JSON.parse(data.content);
                        if (parsedContent.title) CleanedData.title = parsedContent.title;
                        if (parsedContent.content) CleanedData.content = parsedContent.content;
                        if (parsedContent.summary) CleanedData.summary = parsedContent.summary;
                    } catch (e) {
                        console.warn("Failed to parse inner JSON content:", e);
                    }
                }

                // If the entire data is somehow just the content string (edge case)
                if (typeof data === 'string' && data.startsWith('{')) {
                    try {
                        CleanedData = JSON.parse(data);
                    } catch (e) { }
                }

                setRewrittenData(CleanedData);
            } else {
                throw new Error('Rewrite failed');
            }
        } catch (e) {
            console.error('AI Rewrite failed:', e);
            alert('AI Rewrite failed. Please try again.');
        } finally {
            setRewriting(false);
        }
    };

    // Helper: Nuclear Formatting for Content
    const formatNuclearContent = (content, lang) => {
        if (!content) return '';
        let clean = content
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
            .replace(/<br\s*\/?>/gi, '\n').replace(/\r\n/g, '\n');

        // If already HTML, trust it but ensure spacing
        if (clean.includes('<p>') || clean.includes('</div>')) {
            return clean.replace(/<p>/g, '<p style="margin-bottom: 1.5rem;">');
        }

        // Split strategy
        let chunks = [];

        // 1. Initial split by newlines
        let rawChunks = clean.split('\n').filter(c => c.trim().length > 0);

        // 2. Process each chunk
        rawChunks.forEach(chunk => {
            if (chunk.length < 250) {
                chunks.push(chunk);
            } else {
                // It's a blob. Split by punctuation.
                // English: . ! ? 
                // Arabic: . ! ؟ 
                // We avoid splitting on decimal numbers (e.g. 2.5) by looking for spaces after dot
                let sentences = chunk
                    .replace(/([.!?؟])\s+/g, '$1|') // Standard endings
                    .replace(/([.!?؟])$/g, '$1|')   // End of line
                    .split('|');

                // If only 1 sentence found and it's HUGE (likely no punctuation used)
                if (sentences.length === 1 && chunk.length > 250 && lang === 'ar') {
                    // Fallback: Split by common Arabic logical breaks " حيث " (where/since) " و " (and - risky but needed)
                    // We stick to safer ones first: " حيث " " كما " " لذلك "
                    sentences = chunk
                        .replace(/\s(حيث|كما|لذلك|بينما|في المقابل)\s/g, '|$1 ')
                        .split('|');
                }

                sentences.forEach(s => {
                    if (s.trim()) chunks.push(s.trim());
                });
            }
        });

        // 3. Wrap in paragraphs
        let html = chunks.map(c => `<p style="margin-bottom: 1.5rem;">${c}</p>`).join('');

        // 4. Wrap container for Arabic
        if (lang === 'ar') {
            html = `
                <div style="font-family: 'Cairo', 'Inter', sans-serif; direction: rtl; text-align: right; line-height: 1.8;">
                    ${html}
                </div>
            `;
        }
        return html;
    };

    // Save rewritten article to CMS as pending
    const handleSaveToCMS = async () => {
        if (!rewrittenData) return;

        setSavingToCMS(true);
        setSaveSuccess(false);

        try {
            // Debug Phase 2: Verify Data
            console.log('Saving Data:', rewrittenData);
            // 1. Formatted Content
            const finalContent = formatNuclearContent(rewrittenData.content, rewriteLanguage);

            // 2. Guaranteed Title
            // Priority: Rewrite Title -> Original Title -> Generated Title
            let finalTitle = rewrittenData.title;
            if (!finalTitle || finalTitle.trim().length < 5 || finalTitle === 'Untitled Article') {
                finalTitle = article.title;
            }
            if (!finalTitle || finalTitle.trim() === '') {
                finalTitle = `Market Analysis: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            }

            // 3. Guaranteed Image
            // Priority: Thumbnail -> Original URL -> Stock Fallback
            let finalImage = article.thumbnail;
            const STOCK_IMG = 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop';

            if (!finalImage || finalImage === 'null' || finalImage === 'undefined' || finalImage.trim() === '') {
                finalImage = article.urlToImage;
            }
            if (!finalImage || finalImage === 'null' || finalImage === 'undefined' || finalImage.trim() === '') {
                finalImage = STOCK_IMG;
            }

            // Force Stock Image if still somehow empty
            if (!finalImage) finalImage = STOCK_IMG;

            const newPost = {
                title: finalTitle,
                summary: rewrittenData.summary || finalTitle, // Fallback summary
                content: finalContent,
                imageUrl: finalImage,
                thumbnail: finalImage,
                market: rewriteMarket,
                marketId: rewriteMarket,
                language: rewriteLanguage,
                source: 'rewrite', // This marks it as AI rewritten
                category: 'Market Analysis',
                originalUrl: article.link || '',
                author: 'Hero AI',
                isPublished: false,
                isFeatured: false,
                wordCount: rewrittenData.wordCount || 0,
                readingTime: rewrittenData.readingTime || '2 min'
            };

            // Use Context to save - ensures instant update in News Page
            let savedNews;
            try {
                savedNews = await createNews(newPost);
            } catch (err) {
                console.error("Critical: createNews failed", err);
                alert("Critical Error: createNews failed - " + err.message);
                throw err;
            }

            // Debug Alert - To diagnose persistence issues
            if (savedNews && savedNews._debug) {
                alert(`Debug: Saved successfully!\nItems in DB: ${savedNews._debug.totalCount}\nTime: ${savedNews._debug.persistedAt}\nID: ${savedNews.id}`);
            } else {
                alert('Saved to CMS! (No Debug Info)');
            }

            console.log('Saved result:', savedNews);

            setSaveSuccess(true);
            setTimeout(() => {
                setShowRewriteModal(false);
                setSaveSuccess(false);
                setRewrittenData(null);
            }, 2000);

        } catch (e) {
            console.error('Save to CMS failed:', e);
            alert('Failed to save. Please try again: ' + e.message);
        } finally {
            setSavingToCMS(false);
        }
    };

    if (!article) return null;

    // CSS for article content
    const contentStyles = `
        .article-content {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #334155;
            line-height: 1.8;
            font-size: 1.05rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
        }
        .article-content p {
            margin-bottom: 1.5rem;
            max-width: 100%;
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
            border-radius: 12px;
            margin: 1.5rem 0;
        }
        .article-content a {
            color: #10B981;
            text-decoration: none;
            font-weight: 500;
        }
        .article-content ul, .article-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <style>{contentStyles}</style>

            {/* Top Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                borderRadius: '16px', color: 'white'
            }}>
                <button onClick={onBack} style={{
                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
                    padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    gap: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.9rem',
                    transition: 'all 0.2s'
                }}>
                    <ArrowLeft size={18} /> Back to News
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Translate Button */}
                    <button onClick={handleTranslate} disabled={translating} style={{
                        background: isTranslated ? '#10B981' : 'rgba(255,255,255,0.15)',
                        border: 'none', borderRadius: '10px', padding: '0.75rem 1.25rem',
                        cursor: translating ? 'wait' : 'pointer', display: 'flex',
                        alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 600
                    }}>
                        {translating ? (
                            <div style={{ width: 16, height: 16, border: '2px solid #ccc', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <>🌐 {isTranslated ? 'English' : 'العربية'}</>
                        )}
                    </button>
                    {/* Share Button */}
                    <button onClick={handleShare} style={{
                        background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
                        padding: '0.75rem', cursor: 'pointer', color: 'white'
                    }}>
                        <Share2 size={18} />
                    </button>
                    {/* AI Rewrite Button */}
                    <button onClick={() => setShowRewriteModal(true)} style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        border: 'none', borderRadius: '10px', padding: '0.75rem 1.25rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        gap: '0.5rem', color: 'white', fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <Sparkles size={16} /> AI Rewrite
                    </button>
                    {article.link && article.link !== '#' && (
                        <a href={article.link} target="_blank" rel="noopener noreferrer" style={{
                            background: '#10B981', border: 'none', borderRadius: '10px',
                            padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center',
                            gap: '0.5rem', color: 'white', fontWeight: 600, textDecoration: 'none'
                        }}>
                            <ExternalLink size={16} /> Original
                        </a>
                    )}
                </div>
            </div>

            {/* Article Content */}
            <div style={{
                background: 'white', borderRadius: '20px', padding: '2rem',
                border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                {/* Hero Image - Only show once at top */}
                {article.thumbnail && (
                    <div style={{
                        width: '100%', borderRadius: '16px', overflow: 'hidden',
                        marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={article.thumbnail}
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover', objectPosition: 'top' }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <span style={{
                        padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'white'
                    }}>{article.publisher}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9rem', color: '#64748B' }}>
                        <Clock size={16} /> {timeAgo(article.time)}
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, color: '#0F172A',
                    marginBottom: '2rem', letterSpacing: '-0.02em',
                    direction: isTranslated ? 'rtl' : 'ltr',
                    textAlign: isTranslated ? 'right' : 'left'
                }}>
                    {isTranslated && translatedTitle ? translatedTitle : article.title}
                </h1>

                {/* Content */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                        <div style={{ width: 40, height: 40, margin: '0 auto 1rem', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        Loading article...
                    </div>
                ) : (
                    <div
                        className="article-content"
                        style={{
                            fontSize: '1.1rem', lineHeight: 1.85, color: '#334155',
                            direction: isTranslated ? 'rtl' : 'ltr',
                            textAlign: isTranslated ? 'right' : 'left'
                        }}
                    >
                        {isTranslated && translatedContent ? (
                            <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
                        ) : fullContent ? (
                            <div dangerouslySetInnerHTML={{ __html: fullContent }} />
                        ) : (
                            <p style={{ color: '#64748B' }}>{article.summary || 'This article is available on the original source.'}</p>
                        )}
                    </div>
                )}
            </div>

            {/* AI Rewrite Modal */}
            {showRewriteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px',
                        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.5rem', borderBottom: '1px solid #E2E8F0',
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                            color: 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                                    <Sparkles size={24} /> AI Article Rewriter
                                </h2>
                                <button onClick={() => { setShowRewriteModal(false); setRewrittenData(null); }} style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px',
                                    padding: '0.5rem', cursor: 'pointer', color: 'white'
                                }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.85rem' }}>
                                Rewrite articles with market-specific tone and language
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                            {!rewrittenData ? (
                                <>
                                    {/* Configuration */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                            Target Market
                                        </label>
                                        <select value={rewriteMarket} onChange={e => setRewriteMarket(e.target.value)} style={{
                                            width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0',
                                            fontSize: '1rem', background: '#F8FAFC', cursor: 'pointer'
                                        }}>
                                            {MARKETS.map(m => (
                                                <option key={m.id} value={m.id}>{m.flag} {m.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                            Target Language
                                        </label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {[{ id: 'ar', label: 'العربية', icon: '🇸🇦' }, { id: 'en', label: 'English', icon: '🇺🇸' }].map(lang => (
                                                <button key={lang.id} onClick={() => setRewriteLanguage(lang.id)} style={{
                                                    flex: 1, padding: '1rem', borderRadius: '12px',
                                                    border: rewriteLanguage === lang.id ? '2px solid #8B5CF6' : '1px solid #E2E8F0',
                                                    background: rewriteLanguage === lang.id ? '#F5F3FF' : 'white',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                                    fontSize: '1rem', fontWeight: 600, color: rewriteLanguage === lang.id ? '#7C3AED' : '#64748B'
                                                }}>
                                                    <span>{lang.icon}</span> {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Original Article Preview */}
                                    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase' }}>
                                            Original Article
                                        </h4>
                                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#1E293B' }}>{article.title}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
                                            {(fullContent || article.summary || '').replace(/<[^>]*>/g, ' ').substring(0, 300)}...
                                        </p>
                                    </div>

                                    {/* Generate Button */}
                                    <button onClick={handleAIRewrite} disabled={rewriting} style={{
                                        width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                                        background: rewriting ? '#94A3B8' : 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                                        color: 'white', fontWeight: 700, fontSize: '1rem', cursor: rewriting ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    }}>
                                        {rewriting ? (
                                            <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                                        ) : (
                                            <><Sparkles size={20} /> Generate Rewrite</>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Rewritten Result */}
                                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Check size={20} color="#10B981" />
                                        <span style={{ color: '#10B981', fontWeight: 600 }}>Rewrite Complete</span>
                                        {rewrittenData.fallback && (
                                            <span style={{ fontSize: '0.75rem', color: '#F59E0B', background: '#FEF3C7', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                                Fallback Mode
                                            </span>
                                        )}
                                    </div>

                                    <div style={{
                                        background: '#F0FDF4', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem',
                                        border: '1px solid #BBF7D0', direction: rewriteLanguage === 'ar' ? 'rtl' : 'ltr'
                                    }}>
                                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1E293B', fontWeight: 700 }}>
                                            {rewrittenData.title}
                                        </h3>
                                        <div style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                            {rewrittenData.content}
                                        </div>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                                            <span>📝 {rewrittenData.wordCount} words</span>
                                            <span>⏱️ {rewrittenData.readingTime}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => setRewrittenData(null)} style={{
                                            flex: 1, padding: '0.875rem', borderRadius: '10px', border: '1px solid #E2E8F0',
                                            background: 'white', color: '#64748B', fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                        }}>
                                            <RefreshCw size={18} /> Regenerate
                                        </button>
                                        <button onClick={handleSaveToCMS} disabled={savingToCMS || saveSuccess} style={{
                                            flex: 2, padding: '0.875rem', borderRadius: '10px', border: 'none',
                                            background: saveSuccess ? '#10B981' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                            color: 'white', fontWeight: 700, cursor: savingToCMS ? 'wait' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                        }}>
                                            {saveSuccess ? (
                                                <><Check size={18} /> Saved to CMS!</>
                                            ) : savingToCMS ? (
                                                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                                            ) : (
                                                <><Save size={18} /> Save as Pending Post</>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper: Headless AI Rewrite for Auto-Pilot
const fetchHeadlessRewrite = async (article, market, lang) => {
    try {
        const response = await fetch(AI_REWRITE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: article.title,
                content: (article.summary || article.title).replace(/<[^>]*>/g, ' ').trim(),
                targetMarket: market,
                targetLanguage: lang,
                tone: 'professional'
            })
        });

        if (!response.ok) throw new Error('AI API Error');
        const data = await response.json();

        // Clean Data
        let CleanedData = { ...data };
        if (typeof data.content === 'string' && data.content.trim().startsWith('{')) {
            try { CleanedData = JSON.parse(data.content); } catch (e) { }
        }
        return CleanedData;
    } catch (e) {
        console.error('Headless Rewrite Error:', e);
        return null;
    }
};

// Main Component
export default function AdminNewsFeed() {
    const { news: cmsNews, createNews } = useCMS(); // CMS Context for deduplication & saving

    // Auto-Pilot State
    const [autoPilot, setAutoPilot] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [autoPilotLogs, setAutoPilotLogs] = useState([]);
    const [processedUrls, setProcessedUrls] = useState(new Set());
    const [stats, setStats] = useState({ drafts: 0, aiActions: 0 });
    const { addNotification } = useNotification();

    // Standard State
    const [selectedMarket, setSelectedMarket] = useState('SA');
    const [newsItems, setNewsItems] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSource, setSelectedSource] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sources, setSources] = useState(['All']);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [selectedArticle, setSelectedArticle] = useState(null);

    const currentMarket = MARKETS.find(m => m.id === selectedMarket) || MARKETS[0];

    // Logging Helper
    const addLog = (msg, type = 'info') => {
        setAutoPilotLogs(prev => {
            const newLog = { id: Date.now(), msg, type, time: new Date().toLocaleTimeString() };
            return [newLog, ...prev].slice(0, 50); // Keep last 50
        });
    };

    // Auto-Pilot Effect Loop
    useEffect(() => {
        let interval;
        if (autoPilot) {
            interval = setInterval(async () => {
                if (processingId) return; // Busy

                // Find candidate
                // 1. Must not be in processedUrls (session cache)
                // 2. Must not be in cmsNews (already saved/drafted)
                // 3. Must not be "Junk" (advanced filter)
                const candidate = newsItems.find(item => {
                    const uniqueId = item.link || item.title;
                    if (processedUrls.has(uniqueId)) return false;

                    // CMS Check (Deduplication)
                    const normalizedTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const existsInCMS = cmsNews.some(n =>
                        n.title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTitle ||
                        n.originalUrl === item.link
                    );
                    if (existsInCMS) {
                        // Mark as seen so we don't check again
                        setProcessedUrls(prev => new Set(prev).add(uniqueId));
                        return false;
                    }

                    return true;
                });

                if (candidate) {
                    const uniqueId = candidate.link || candidate.title;
                    setProcessingId(uniqueId);
                    setProcessedUrls(prev => new Set(prev).add(uniqueId));
                    addLog(`Found candidate: "${candidate.title.substring(0, 30)}..."`, 'info');

                    try {
                        // 1. Rewrite
                        addLog(`Rewriting...`, 'pending');
                        const result = await fetchHeadlessRewrite(candidate, selectedMarket, 'ar');

                        if (result) {
                            // 2. Save
                            addLog('Saving to Drafts...', 'pending');

                            // Mock content formatting (simplified for headless)
                            const finalContent = `<div style="direction: rtl; text-align: right;">${result.content}</div>`;

                            const newPost = {
                                title: result.title || candidate.title,
                                summary: result.summary || candidate.title,
                                content: finalContent,
                                imageUrl: candidate.thumbnail || candidate.urlToImage || 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop',
                                thumbnail: candidate.thumbnail,
                                market: selectedMarket,
                                marketId: selectedMarket,
                                language: 'ar',
                                source: 'rewrite',
                                category: 'Market Analysis',
                                originalUrl: candidate.link || '',
                                author: 'Hero AI (Auto)',
                                isPublished: false, // DRAFT status
                                isFeatured: false,
                                wordCount: result.wordCount || 0,
                                readingTime: result.readingTime || '2 min'
                            };

                            await createNews(newPost);
                            addLog(`Success: Rewrote "${candidate.title.substring(0, 30)}..."`, 'success');

                            // Fire Notification
                            addNotification('ai', 'AI Auto-Pilot Success', `Generated: ${result.title}`, {
                                original: candidate.title,
                                market: selectedMarket,
                                wordCount: result.wordCount
                            });

                            setStats(prev => ({ ...prev, drafts: prev.drafts + 1, aiActions: prev.aiActions + 1 }));
                        } else {
                            addLog(`Failed to rewrite: ${candidate.title.substring(0, 20)}...`, 'error');
                            addNotification('error', 'AI Generation Failed', `Failed to rewrite article: ${candidate.title}`, { url: candidate.link });
                        }
                    } catch (e) {
                        addLog(`Error: ${e.message}`, 'error');
                        addNotification('error', 'AI Generation Error', `An error occurred during rewrite: ${e.message}`, { url: candidate.link });
                    } finally {
                        setProcessingId(null);
                    }
                } else {
                    // No candidates found
                    // addLog('Scan complete. No new articles.', 'dim');
                }

            }, 5000); // Check every 5 seconds
        }
        return () => clearInterval(interval);
    }, [autoPilot, newsItems, cmsNews, processedUrls, selectedMarket]);

    // Fetch news from API
    const fetchNews = async (market) => {
        setLoading(true);
        try {
            const res = await fetch(`${NEWS_API_URL}?market=${market}`);
            const data = await res.json();
            setNewsItems(Array.isArray(data) ? data : []);
            setLastUpdate(new Date());
            if (autoPilot) addLog(`Refreshed Feed: ${data.length} articles`, 'info');
        } catch (e) {
            console.error('Error fetching news:', e);
            setNewsItems([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews(selectedMarket);
    }, [selectedMarket]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchNews(selectedMarket), 60000);
        return () => clearInterval(interval);
    }, [selectedMarket]);

    // Date range helper
    const isWithinDateRange = (itemDateStr, filter) => {
        if (filter === 'All') return true;
        if (!itemDateStr) return true;
        const date = new Date(itemDateStr);
        if (isNaN(date.getTime())) return true;
        const now = new Date();
        const diffHours = (now - date) / (1000 * 60 * 60);
        const filterConfig = DATE_FILTERS.find(f => f.id === filter);
        return diffHours <= (filterConfig?.hours || Infinity);
    };

    // Extract sources and apply filters
    useEffect(() => {
        let filtered = newsItems;

        // Date filter
        filtered = filtered.filter(item => isWithinDateRange(item.time, dateFilter));

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.publisher?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Extract unique sources
        const uniqueSources = ['All', ...new Set(filtered.map(item => item.publisher).filter(Boolean))];
        setSources(uniqueSources);

        // Source filter
        if (selectedSource !== 'All') {
            filtered = filtered.filter(item => item.publisher === selectedSource);
        }

        setFilteredNews(filtered);
    }, [newsItems, selectedSource, dateFilter, searchQuery]);

    // Source counts
    const sourceCounts = useMemo(() => {
        const dateFiltered = newsItems.filter(item => isWithinDateRange(item.time, dateFilter));
        const counts = { 'All': dateFiltered.length };
        dateFiltered.forEach(item => {
            const pub = item.publisher || 'Unknown';
            counts[pub] = (counts[pub] || 0) + 1;
        });
        return counts;
    }, [newsItems, dateFilter]);

    // Today's news count
    const todayCount = useMemo(() => {
        return newsItems.filter(item => isWithinDateRange(item.time, '1D')).length;
    }, [newsItems]);

    const handleMarketChange = (marketId) => {
        setSelectedMarket(marketId);
        setSelectedSource('All');
        setSearchQuery('');
    };

    const handleBackToList = () => {
        setSelectedArticle(null);
        window.scrollTo(0, 0);
    };

    // If article is selected, show article view
    if (selectedArticle) {
        return <ArticleView article={selectedArticle} onBack={handleBackToList} />;
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        News Feed
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {MARKETS.length} markets • Live news • Auto-refresh
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* LOGS POPUP (Mini) */}
                    {autoPilot && (
                        <div style={{
                            position: 'relative', height: '40px', background: '#0F172A', padding: '0 1rem',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', border: '1px solid #334155',
                            minWidth: '200px'
                        }}>
                            <div style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%', marginRight: '8px', boxShadow: '0 0 10px #EF4444' }} />
                            <span style={{ color: '#f8fafc', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                {processingId ? 'Processing...' : 'Scanning feed...'}
                            </span>
                        </div>
                    )}

                    {/* Auto Pilot Toggle */}
                    <button
                        onClick={() => setAutoPilot(!autoPilot)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: autoPilot ? '#EF4444' : '#F1F5F9', // Red when ON (Live)
                            color: autoPilot ? 'white' : '#64748B',
                            border: 'none', borderRadius: '10px',
                            fontWeight: 600, cursor: 'pointer',
                            boxShadow: autoPilot ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: autoPilot ? 'white' : '#94A3B8',
                            animation: autoPilot ? 'pulse 1.5s infinite' : 'none'
                        }} />
                        {autoPilot ? 'AI GENERATION ON' : 'Enable AI NEWS Generation'}
                    </button>

                    <div style={{ width: '1px', height: '20px', background: '#E2E8F0' }}></div>

                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        Updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => fetchNews(selectedMarket)}
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white', border: 'none', borderRadius: '10px',
                            fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1
                        }}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Live Console (Visible when Auto-Pilot is ON) */}
            {autoPilot && (
                <div style={{
                    background: '#0F172A', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem',
                    border: '1px solid #334155', fontFamily: 'monospace', fontSize: '0.85rem',
                    maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse'
                }}>
                    {logs.length === 0 && <div style={{ color: '#64748B' }}>Ready to start...</div>}
                    {logs.map(log => (
                        <div key={log.id} style={{ marginBottom: '4px', display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#64748B' }}>[{log.time}]</span>
                            <span style={{
                                color: log.type === 'success' ? '#10B981' :
                                    log.type === 'error' ? '#EF4444' :
                                        log.type === 'pending' ? '#F59E0B' : '#E2E8F0'
                            }}>
                                {log.msg}
                            </span>
                        </div>
                    ))}
                </div>
            )}


            {/* Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Articles', value: newsItems.length, icon: Newspaper, color: '#10B981' },
                    { label: 'Today\'s News', value: todayCount, icon: Calendar, color: '#0EA5E9' },
                    { label: 'Active Sources', value: sources.length - 1, icon: Globe, color: '#8B5CF6' },
                    { label: 'Filtered', value: filteredNews.length, icon: Filter, color: '#F59E0B' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: 'white', borderRadius: '16px', padding: '1.25rem',
                        border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: `${stat.color}15`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <stat.icon size={24} color={stat.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Market Selector - BIGGER FLAGS */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '1.25rem',
                border: '1px solid #E2E8F0', marginBottom: '1rem'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem',
                    fontWeight: 700, color: '#1E293B', fontSize: '0.9rem'
                }}>
                    <Globe size={18} color="#10B981" /> Select Market
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {MARKETS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => handleMarketChange(m.id)}
                            title={m.name}
                            style={{
                                padding: '0.75rem 1rem',
                                border: selectedMarket === m.id ? '2px solid #10B981' : '1px solid #E2E8F0',
                                background: selectedMarket === m.id ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' : 'white',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '1.75rem', // BIGGER FLAG
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                boxShadow: selectedMarket === m.id ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none'
                            }}
                        >
                            {m.flag}
                            {selectedMarket === m.id && (
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>{m.name}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search */}
                <div style={{
                    flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center',
                    gap: '0.5rem', padding: '0.75rem 1rem', background: 'white',
                    borderRadius: '12px', border: '1px solid #E2E8F0'
                }}>
                    <Search size={18} color="#94A3B8" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>

                {/* Date Filter */}
                <div style={{ display: 'flex', gap: '0.25rem', background: 'white', borderRadius: '12px', padding: '0.25rem', border: '1px solid #E2E8F0' }}>
                    {DATE_FILTERS.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setDateFilter(d.id)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: dateFilter === d.id ? '#10B981' : 'transparent',
                                color: dateFilter === d.id ? 'white' : '#64748B',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Source Filter Pills */}
            <div style={{
                display: 'flex', gap: '0.5rem', overflowX: 'auto',
                marginBottom: '1.5rem', paddingBottom: '0.5rem'
            }}>
                {sources.map(source => (
                    <button
                        key={source}
                        onClick={() => setSelectedSource(source)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            background: selectedSource === source ? '#1E293B' : '#fff',
                            color: selectedSource === source ? '#fff' : '#64748B',
                            border: selectedSource === source ? '1px solid #1E293B' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {source} {sourceCounts[source] ? `(${sourceCounts[source]})` : ''}
                    </button>
                ))}
            </div>

            {/* News Grid */}
            {loading ? (
                <div style={{
                    textAlign: 'center', padding: '4rem',
                    color: '#94A3B8', background: 'white',
                    borderRadius: '16px', border: '1px solid #E2E8F0'
                }}>
                    <div style={{ width: 40, height: 40, margin: '0 auto 1rem', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Loading news...
                </div>
            ) : filteredNews.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem',
                    color: '#94A3B8', background: 'white',
                    borderRadius: '16px', border: '1px solid #E2E8F0'
                }}>
                    <Newspaper size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <div>No news found for this filter.</div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {filteredNews.map((news, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedArticle(news)}
                            style={{
                                background: 'white', borderRadius: '16px',
                                overflow: 'hidden', border: '1px solid #E2E8F0',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                            }}
                        >
                            {/* Thumbnail */}
                            {news.thumbnail && (
                                <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={news.thumbnail}
                                        alt={news.title}
                                        referrerPolicy="no-referrer"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: '12px', left: '12px',
                                        background: 'rgba(0,0,0,0.75)', color: '#fff',
                                        padding: '6px 12px', borderRadius: '8px',
                                        fontSize: '0.75rem', fontWeight: 700,
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        {news.publisher}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '0.75rem'
                                }}>
                                    {!news.thumbnail && (
                                        <span style={{
                                            padding: '0.375rem 0.75rem', background: '#10B98115',
                                            borderRadius: '8px', fontSize: '0.75rem',
                                            fontWeight: 700, color: '#10B981'
                                        }}>
                                            {news.publisher}
                                        </span>
                                    )}
                                    <span style={{
                                        display: 'flex', alignItems: 'center',
                                        gap: '0.25rem', fontSize: '0.75rem', color: '#94A3B8',
                                        marginLeft: 'auto'
                                    }}>
                                        <Clock size={12} />
                                        {timeAgo(news.time)}
                                    </span>
                                </div>

                                <h3 style={{
                                    fontSize: '1rem', fontWeight: 700,
                                    marginBottom: '0.75rem', lineHeight: 1.4,
                                    color: '#0F172A',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {news.title}
                                </h3>

                                {news.summary && (
                                    <p style={{
                                        fontSize: '0.85rem', color: '#64748B',
                                        lineHeight: 1.5, marginBottom: '0.75rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {news.summary}
                                    </p>
                                )}

                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '0.5rem', color: '#10B981',
                                    fontSize: '0.8rem', fontWeight: 600
                                }}>
                                    <TrendingUp size={14} />
                                    Read Full Article
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
}
