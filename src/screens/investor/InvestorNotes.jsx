import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Plus, Search, Star, Trash2, Edit2, Tag, Clock, X, MoreVertical } from 'lucide-react';

const SAMPLE_NOTES = [
    { id: 1, title: 'AAPL Analysis', symbol: 'AAPL', content: 'Strong momentum heading into earnings. Support at $180.', tags: ['earnings'], starred: true, updatedAt: '2024-12-09' },
    { id: 2, title: 'Portfolio Rebalancing', symbol: null, content: 'Consider reducing tech exposure from 60% to 45%.', tags: ['strategy'], starred: false, updatedAt: '2024-12-08' },
    { id: 3, title: 'NVDA Entry Strategy', symbol: 'NVDA', content: 'Wait for pullback to $800 zone. AI demand strong.', tags: ['tech'], starred: true, updatedAt: '2024-12-07' },
    { id: 4, title: 'Fed Meeting Notes', symbol: null, content: 'Expect rates to hold. Markets pricing in cuts.', tags: ['macro'], starred: false, updatedAt: '2024-12-06' },
];

const TAGS = [
    { id: 'earnings', label: 'Earnings', color: '#8B5CF6' },
    { id: 'tech', label: 'Tech', color: '#0EA5E9' },
    { id: 'strategy', label: 'Strategy', color: '#10B981' },
    { id: 'macro', label: 'Macro', color: '#6366F1' },
];

export default function InvestorNotes() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState(SAMPLE_NOTES);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const handleStar = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
    const handleDelete = (id) => setNotes(prev => prev.filter(n => n.id !== id));

    let filteredNotes = filter === 'starred' ? notes.filter(n => n.starred) : notes;
    if (searchQuery) filteredNotes = filteredNotes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '120px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', padding: '1rem 1rem 1.5rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '0.625rem', cursor: 'pointer' }}>
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>Research Notes</h1>
                    <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '0.625rem', cursor: 'pointer' }}>
                        <Plus size={20} color="white" />
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}>
                    <Search size={18} color="#9CA3AF" />
                    <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', background: 'transparent' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
                <button onClick={() => setFilter('all')} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', background: filter === 'all' ? '#4B5563' : 'white', color: filter === 'all' ? 'white' : '#6B7280', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>All ({notes.length})</button>
                <button onClick={() => setFilter('starred')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', background: filter === 'starred' ? '#F59E0B' : 'white', color: filter === 'starred' ? 'white' : '#6B7280', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Star size={14} fill={filter === 'starred' ? 'white' : 'none'} /> Starred
                </button>
            </div>

            <div style={{ padding: '0 1rem' }}>
                {filteredNotes.map(note => (
                    <div key={note.id} style={{ background: 'white', borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem', border: note.starred ? '2px solid #F59E0B' : '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>{note.title}</h4>
                                {note.symbol && <span style={{ padding: '0.125rem 0.375rem', background: '#DBEAFE', color: '#2563EB', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>{note.symbol}</span>}
                            </div>
                            <button onClick={() => handleStar(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Star size={18} color={note.starred ? '#F59E0B' : '#D1D5DB'} fill={note.starred ? '#F59E0B' : 'none'} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>{note.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                                {note.tags.map(tagId => { const tag = TAGS.find(t => t.id === tagId); return tag ? <span key={tagId} style={{ padding: '0.125rem 0.5rem', background: `${tag.color}15`, color: tag.color, borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600 }}>{tag.label}</span> : null; })}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{note.updatedAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
