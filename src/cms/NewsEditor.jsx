import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
    Save, ArrowLeft, Tag, Image as ImageIcon,
    Globe, Layout, Send, AlertCircle
} from 'lucide-react';

export const CATEGORIES = ['Market Analysis', 'Company News', 'Economic Data', 'Commodities', 'Forex', 'Technology', 'Banking'];
export const MARKETS = [
    { id: 'all', label: 'Global', flag: '🌍' },
    { id: 'SA', label: 'Saudi Arabia', flag: '🇸🇦' },
    { id: 'EG', label: 'Egypt', flag: '🇪🇬' },
    { id: 'US', label: 'United States', flag: '🇺🇸' }
];
export const SOURCES = ['Stocks Hero', 'Mubasher', 'Argaam', 'Zawya', 'Reuters', 'Bloomberg', 'Yahoo Finance', 'CNBC', 'Enterprise', 'Daily News Egypt', 'Saudi Gazette'];

export default function NewsEditor({ initialData, onClose, onSave, isSaving }) {
    // Lazy Initialization: Compute initial state immediately on mount
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                id: initialData.id,
                title: initialData.title || '',
                summary: initialData.summary || '',
                content: initialData.content || '',
                source: initialData.source || '',
                category: initialData.category || 'Market Analysis',
                market: initialData.market || 'all',
                imageUrl: initialData.imageUrl || '',
                isPublished: initialData.isPublished || false,
                isFeatured: initialData.isFeatured || false,
                publishedAt: initialData.publishedAt || new Date().toISOString(),
                tickers: initialData.tickers || [],
                slug: initialData.slug || ''
            };
        }
        return {
            title: '', summary: '', content: '', source: '', category: 'Market Analysis',
            market: 'all', imageUrl: '', isPublished: false, isFeatured: false,
            publishedAt: new Date().toISOString(), tickers: [], slug: ''
        };
    });

    const [isCustomSource, setIsCustomSource] = useState(() => {
        return initialData ? (!SOURCES.includes(initialData.source) && !!initialData.source) : false;
    });

    const [tickerInput, setTickerInput] = useState('');

    // Keep useEffect for updates if parent passes new props without remounting (fallback)
    useEffect(() => {
        if (initialData && initialData.id !== formData.id) {
            setFormData({
                id: initialData.id,
                title: initialData.title || '',
                summary: initialData.summary || '',
                content: initialData.content || '',
                source: initialData.source || '',
                category: initialData.category || 'Market Analysis',
                market: initialData.market || 'all',
                imageUrl: initialData.imageUrl || '',
                isPublished: initialData.isPublished || false,
                isFeatured: initialData.isFeatured || false,
                publishedAt: initialData.publishedAt || new Date().toISOString(),
                tickers: initialData.tickers || [],
                slug: initialData.slug || generateSlug(initialData.title || '')
            });
            setIsCustomSource(!SOURCES.includes(initialData.source) && !!initialData.source);
        }
    }, [initialData]);

    const generateSlug = (text) => {
        if (!text) return '';
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !initialData && title ? generateSlug(title) : prev.slug
        }));
    };

    const handleAddTicker = (e) => {
        if (e.key === 'Enter' && tickerInput.trim()) {
            e.preventDefault();
            const newTicker = tickerInput.trim().toUpperCase();
            if (!formData.tickers.includes(newTicker)) {
                setFormData(prev => ({ ...prev, tickers: [...prev.tickers, newTicker] }));
            }
            setTickerInput('');
        }
    };

    const removeTicker = (ticker) => {
        setFormData(prev => ({ ...prev, tickers: prev.tickers.filter(t => t !== ticker) }));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    // Calculate source value for select
    const getSourceValue = () => {
        if (!formData.source) return '';
        return SOURCES.includes(formData.source) ? formData.source : 'Other';
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 1000, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Top Bar */}
            <header style={{ height: '64px', background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>{initialData ? 'Edit Article' : 'New Article'}</span>
                        <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '999px', background: formData.isPublished ? '#DCFCE7' : '#FEF3C7', color: formData.isPublished ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                            {formData.isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginRight: '0.5rem' }}>
                        {isSaving ? 'Saving...' : 'Changes saved locally'}
                    </span>
                    <button
                        onClick={() => onSave({ ...formData, isPublished: false })}
                        style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={() => onSave({ ...formData, isPublished: true })}
                        style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: 'white', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <Send size={18} /> Publish
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Center: Content Editor */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                        <input
                            type="text"
                            placeholder="Article Title"
                            value={formData.title || ''}
                            onChange={handleTitleChange}
                            style={{ width: '100%', fontSize: '2.5rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#1E293B', marginBottom: '1.5rem', lineHeight: 1.2 }}
                        />

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executive Summary</label>
                            <textarea
                                placeholder="Brief summary for news feed preview..."
                                value={formData.summary || ''}
                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#475569', minHeight: '100px', resize: 'vertical', lineHeight: 1.6 }}
                            />
                        </div>

                        <div className="editor-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', minHeight: '500px' }}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content || ''}
                                onChange={(content) => setFormData({ ...formData, content })}
                                modules={modules}
                                style={{ height: '450px' }}
                            />
                        </div>
                    </div>
                </main>

                {/* Right: Sidebar Properties */}
                <aside style={{ width: '350px', background: 'white', borderLeft: '1px solid #E2E8F0', overflowY: 'auto', padding: '1.5rem' }}>

                    {/* Publishing Settings */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={16} /> Publishing
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Market Region</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {MARKETS.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setFormData({ ...formData, market: m.id })}
                                        style={{
                                            padding: '0.5rem', borderRadius: '8px', border: formData.market === m.id ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                                            background: formData.market === m.id ? '#F0F9FF' : 'white', cursor: 'pointer', textAlign: 'left',
                                            fontSize: '0.85rem', fontWeight: 500
                                        }}
                                    >
                                        <span style={{ marginRight: '0.5rem' }}>{m.flag}</span> {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Source Attribution</label>
                            {isCustomSource ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text" value={formData.source || ''} onChange={e => setFormData({ ...formData, source: e.target.value })}
                                        placeholder="Enter source name..." autoFocus
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                    />
                                    <button onClick={() => setIsCustomSource(false)} style={{ padding: '0 0.6rem', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                                </div>
                            ) : (
                                <select
                                    value={getSourceValue()}
                                    onChange={e => {
                                        if (e.target.value === 'Other') { setIsCustomSource(true); setFormData({ ...formData, source: '' }); }
                                        else { setFormData({ ...formData, source: e.target.value }); }
                                    }}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                >
                                    <option value="" disabled>Select Source</option>
                                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    <option value="Other">Other...</option>
                                </select>
                            )}
                        </div>

                        <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 500 }}>Featured Story</label>
                                <input type="checkbox" checked={formData.isFeatured || false} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} style={{ transform: 'scale(1.2)' }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Featured stories appear in larger cards at the top of the news feed.</p>
                        </div>
                    </div>

                    {/* Taxonomy */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={16} /> Taxonomy
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Category</label>
                            <select
                                value={formData.category || 'Market Analysis'}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Related Tickers</label>
                            <div style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '6px', background: 'white', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(formData.tickers || []).map(t => (
                                    <span key={t} style={{ background: '#E0E7FF', color: '#4338CA', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        ${t} <button onClick={() => removeTicker(t)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#4338CA' }}>×</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add (e.g. AAPL) + Enter"
                                    value={tickerInput}
                                    onChange={e => setTickerInput(e.target.value)}
                                    onKeyDown={handleAddTicker}
                                    style={{ border: 'none', outline: 'none', fontSize: '0.85rem', flex: 1, minWidth: '100px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={16} /> Media
                        </h3>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Thumbnail Image URL</label>
                            <input
                                type="text"
                                value={formData.imageUrl || ''}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem', marginBottom: '0.5rem' }}
                            />
                            {formData.imageUrl && (
                                <div style={{ width: '100%', height: '150px', borderRadius: '6px', background: '#F1F5F9', overflow: 'hidden' }}>
                                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta / SEO */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Layout size={16} /> Meta Data
                        </h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>URL Slug</label>
                            <input
                                type="text"
                                value={formData.slug || ''}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontFamily: 'monospace', color: '#64748B' }}
                            />
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    );
}
