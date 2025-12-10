import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Save, ExternalLink, Newspaper, Star, Clock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import NewsEditor from './NewsEditor';
import DebugErrorBoundary from '../components/DebugErrorBoundary';

const CATEGORIES = ['Market Analysis', 'Company News', 'Economic Data', 'Commodities', 'Forex', 'Technology', 'Banking'];
const MARKETS = ['all', 'SA', 'EG', 'US'];
const SOURCES = ['Stocks Hero', 'Mubasher', 'Argaam', 'Zawya', 'Reuters', 'Bloomberg', 'Yahoo Finance', 'CNBC', 'Enterprise', 'Daily News Egypt', 'Saudi Gazette'];

export default function AdminNews() {
    const [searchParams] = useSearchParams();
    const { news, createNews, updateNews, deleteNews } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterMarket, setFilterMarket] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [isCustomSource, setIsCustomSource] = useState(false);
    const [formData, setFormData] = useState({
        title: '', summary: '', content: '', source: '', category: 'Market Analysis',
        market: 'all', imageUrl: '', isPublished: false, isFeatured: false,
    });

    React.useEffect(() => {
        if (searchParams.get('action') === 'new') setShowModal(true);
    }, [searchParams]);

    const filteredNews = news.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMarket = filterMarket === 'all' || n.market === filterMarket || n.market === 'all';
        const matchesCategory = filterCategory === 'all' || n.category === filterCategory;
        return matchesSearch && matchesMarket && matchesCategory;
    });

    const handleEdit = (article) => {
        setEditingNews(article);
        setFormData({ ...article });
        setIsCustomSource(!SOURCES.includes(article.source));
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this article?')) {
            deleteNews(id);
        }
    };

    const handleTogglePublish = (article) => {
        updateNews(article.id, { isPublished: !article.isPublished });
    };

    const handleToggleFeatured = (article) => {
        updateNews(article.id, { isFeatured: !article.isFeatured });
    };

    const handleSubmit = () => {
        if (editingNews) {
            updateNews(editingNews.id, formData);
        } else {
            createNews({ ...formData, publishedAt: new Date().toISOString() });
        }
        setShowModal(false);
        setEditingNews(null);
        setFormData({ title: '', summary: '', content: '', source: '', category: 'Market Analysis', market: 'all', imageUrl: '', isPublished: false, isFeatured: false });
        setIsCustomSource(false);
    };

    const getMarketFlag = (market) => {
        switch (market) {
            case 'SA': return '🇸🇦';
            case 'EG': return '🇪🇬';
            case 'US': return '🇺🇸';
            default: return '🌍';
        }
    };

    const featuredArticles = filteredNews.filter(n => n.isFeatured && n.isPublished);
    const regularArticles = filteredNews.filter(n => !n.isFeatured || !n.isPublished);

    const handleSave = (data) => {
        if (editingNews) {
            updateNews(editingNews.id, data);
        } else {
            createNews({ ...data, publishedAt: new Date().toISOString() });
        }
        setShowModal(false);
        setEditingNews(null);
    };

    if (showModal) {
        return (
            <DebugErrorBoundary>
                <NewsEditor
                    initialData={editingNews ? editingNews : null}
                    onClose={() => { setShowModal(false); setEditingNews(null); }}
                    onSave={handleSave}
                    isSaving={false}
                />
            </DebugErrorBoundary>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>News Management</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage market news across all regions • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingNews(null); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Post News
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Articles', value: news.length, icon: Newspaper, color: '#0EA5E9' },
                    { label: 'Published', value: news.filter(n => n.isPublished).length, icon: Eye, color: '#10B981' },
                    { label: 'Featured', value: news.filter(n => n.isFeatured).length, icon: Star, color: '#F59E0B' },
                    { label: 'Drafts', value: news.filter(n => !n.isPublished).length, icon: Clock, color: '#64748B' },
                ].map(stat => (
                    <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <stat.icon size={20} color={stat.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search news..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                <select value={filterMarket} onChange={e => setFilterMarket(e.target.value)}
                    style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">🌍 All Markets</option>
                    <option value="SA">🇸🇦 Saudi Arabia</option>
                    <option value="EG">🇪🇬 Egypt</option>
                    <option value="US">🇺🇸 United States</option>
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Star size={16} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>Featured Articles</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {featuredArticles.map(article => (
                            <div key={article.id} style={{
                                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                borderRadius: '16px', padding: '1.25rem', border: '2px solid #FCD34D'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.5rem', background: 'white', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>
                                            {getMarketFlag(article.market)} {article.market === 'all' ? 'Global' : article.market}
                                        </span>
                                        <span style={{ padding: '0.25rem 0.5rem', background: '#E0F2FE', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#0284C7' }}>
                                            {article.category}
                                        </span>
                                    </div>
                                    <button onClick={() => handleToggleFeatured(article)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Star size={18} color="#F59E0B" fill="#F59E0B" />
                                    </button>
                                </div>
                                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '1rem', marginBottom: '0.5rem' }}>{article.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>{article.summary}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{article.source}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(article)} style={{ padding: '0.375rem', background: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                            <Edit2 size={14} color="#64748B" />
                                        </button>
                                        <button onClick={() => handleDelete(article.id)} style={{ padding: '0.375rem', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                            <Trash2 size={14} color="#DC2626" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Articles Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Article</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Market</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regularArticles.map(article => (
                            <tr key={article.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '1rem', maxWidth: '400px' }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>{article.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.summary}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem' }}>
                                        {getMarketFlag(article.market)} {article.market === 'all' ? 'Global' : article.market}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.625rem', background: '#E0F2FE', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#0284C7' }}>
                                        {article.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.625rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                                        background: article.isPublished ? '#DCFCE7' : '#FEF3C7',
                                        color: article.isPublished ? '#16A34A' : '#D97706'
                                    }}>
                                        {article.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button onClick={() => handleToggleFeatured(article)} style={{ background: article.isFeatured ? '#FEF3C7' : '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            <Star size={14} color={article.isFeatured ? '#F59E0B' : '#94A3B8'} fill={article.isFeatured ? '#F59E0B' : 'none'} />
                                        </button>
                                        <button onClick={() => handleTogglePublish(article)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            {article.isPublished ? <EyeOff size={14} color="#64748B" /> : <Eye size={14} color="#64748B" />}
                                        </button>
                                        <button onClick={() => handleEdit(article)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            <Edit2 size={14} color="#64748B" />
                                        </button>
                                        <button onClick={() => handleDelete(article.id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            <Trash2 size={14} color="#DC2626" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {regularArticles.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                        No articles found. Click "Post News" to create one.
                    </div>
                )}
            </div>

            {/* Modal Remove */}
        </div>
    );
}
