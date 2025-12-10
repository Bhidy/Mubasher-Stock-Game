import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Plus, Search, Star, Trash2, Edit2, Tag, Clock, X, MoreVertical } from 'lucide-react';
import { useToast } from '../../components/shared/Toast';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Tooltip from '../../components/shared/Tooltip';

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
    const { showToast } = useToast();
    const [notes, setNotes] = useState(SAMPLE_NOTES);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Create form state
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        symbol: '',
        tags: [],
    });

    const handleStar = (id) => {
        setNotes(prev => prev.map(n => {
            if (n.id === id) {
                showToast(n.starred ? 'Note unstarred' : 'Note starred ⭐', n.starred ? 'info' : 'success');
                return { ...n, starred: !n.starred };
            }
            return n;
        }));
    };

    const handleDeleteClick = (id) => setConfirmDelete(id);

    const handleConfirmDelete = () => {
        setNotes(prev => prev.filter(n => n.id !== confirmDelete));
        showToast('Note deleted', 'success');
        setConfirmDelete(null);
    };

    const handleCreateNote = () => {
        if (!newNote.title.trim()) {
            showToast('Please enter a title', 'error');
            return;
        }
        if (!newNote.content.trim()) {
            showToast('Please enter some content', 'error');
            return;
        }

        const newId = Math.max(...notes.map(n => n.id), 0) + 1;
        const noteObj = {
            id: newId,
            title: newNote.title,
            content: newNote.content,
            symbol: newNote.symbol.toUpperCase() || null,
            tags: newNote.tags,
            starred: false,
            updatedAt: new Date().toISOString().split('T')[0],
        };

        setNotes(prev => [noteObj, ...prev]);
        showToast('Note created! 📝', 'success');
        setShowCreateModal(false);
        setNewNote({ title: '', content: '', symbol: '', tags: [] });
    };

    const toggleTag = (tagId) => {
        setNewNote(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    let filteredNotes = filter === 'starred' ? notes.filter(n => n.starred) : notes;
    if (searchQuery) filteredNotes = filteredNotes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '120px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', padding: '1rem 1rem 1.5rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Tooltip text="Go back">
                        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '0.625rem', cursor: 'pointer' }}>
                            <ArrowLeft size={20} color="white" />
                        </button>
                    </Tooltip>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>Research Notes</h1>
                    <Tooltip text="Create a new note">
                        <button onClick={() => setShowCreateModal(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '0.625rem', cursor: 'pointer' }}>
                            <Plus size={20} color="white" />
                        </button>
                    </Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}>
                    <Search size={18} color="#9CA3AF" />
                    <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', background: 'transparent' }} />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <X size={16} color="#9CA3AF" />
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
                <button onClick={() => setFilter('all')} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', background: filter === 'all' ? '#4B5563' : 'white', color: filter === 'all' ? 'white' : '#6B7280', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>All ({notes.length})</button>
                <button onClick={() => setFilter('starred')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', background: filter === 'starred' ? '#F59E0B' : 'white', color: filter === 'starred' ? 'white' : '#6B7280', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Star size={14} fill={filter === 'starred' ? 'white' : 'none'} /> Starred
                </button>
            </div>

            <div style={{ padding: '0 1rem' }}>
                {filteredNotes.length > 0 ? filteredNotes.map(note => (
                    <div key={note.id} style={{ background: 'white', borderRadius: '14px', padding: '1rem', marginBottom: '0.75rem', border: note.starred ? '2px solid #F59E0B' : '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>{note.title}</h4>
                                {note.symbol && <span style={{ padding: '0.125rem 0.375rem', background: '#DBEAFE', color: '#2563EB', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>{note.symbol}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <Tooltip text={note.starred ? 'Unstar note' : 'Star note'}>
                                    <button onClick={() => handleStar(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                                        <Star size={18} color={note.starred ? '#F59E0B' : '#D1D5DB'} fill={note.starred ? '#F59E0B' : 'none'} />
                                    </button>
                                </Tooltip>
                                <Tooltip text="Delete note">
                                    <button onClick={() => handleDeleteClick(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                                        <Trash2 size={16} color="#DC2626" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>{note.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                                {note.tags.map(tagId => { const tag = TAGS.find(t => t.id === tagId); return tag ? <span key={tagId} style={{ padding: '0.125rem 0.5rem', background: `${tag.color}15`, color: tag.color, borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600 }}>{tag.label}</span> : null; })}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{note.updatedAt}</span>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                        <FileText size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>No notes found</h3>
                        <p>Create your first research note to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Note Modal */}
            {showCreateModal && (
                <div onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'flex-end' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '1.5rem', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>New Note 📝</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Title *</label>
                            <input
                                type="text"
                                placeholder="e.g., AAPL Earnings Analysis"
                                value={newNote.title}
                                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Stock Symbol (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., AAPL"
                                value={newNote.symbol}
                                onChange={(e) => setNewNote(prev => ({ ...prev, symbol: e.target.value }))}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Content *</label>
                            <textarea
                                placeholder="Write your research notes here..."
                                value={newNote.content}
                                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Tags</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {TAGS.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        style={{
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '999px',
                                            border: newNote.tags.includes(tag.id) ? `2px solid ${tag.color}` : '2px solid #E5E7EB',
                                            background: newNote.tags.includes(tag.id) ? `${tag.color}15` : 'white',
                                            color: newNote.tags.includes(tag.id) ? tag.color : '#6B7280',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCreateNote}
                            style={{ width: '100%', padding: '0.875rem', background: '#4B5563', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete !== null}
                title="Delete Note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                confirmType="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </div>
    );
}
