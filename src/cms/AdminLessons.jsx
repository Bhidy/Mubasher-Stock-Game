import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Save, Clock, Book, AlertCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import LessonEditor from './LessonEditor';

const CATEGORIES = ['beginner', 'intermediate', 'advanced'];

export default function AdminLessons() {
    const [searchParams] = useSearchParams();
    const { lessons, createLesson, updateLesson, deleteLesson } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    useEffect(() => {
        if (searchParams.get('action') === 'new') setShowModal(true);
    }, [searchParams]);

    const filteredLessons = lessons.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || l.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (lesson) => {
        setEditingLesson(lesson);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this lesson?')) {
            deleteLesson(id);
        }
    };

    const handleTogglePublish = (lesson) => {
        updateLesson(lesson.id, { isPublished: !lesson.isPublished });
    };

    const handleSave = (data) => {
        if (editingLesson) {
            updateLesson(editingLesson.id, data);
        } else {
            createLesson({ ...data, createdAt: new Date().toISOString() });
        }
        setShowModal(false);
        setEditingLesson(null);
    };

    if (showModal) {
        return (
            <LessonEditor
                initialData={editingLesson || null}
                onClose={() => { setShowModal(false); setEditingLesson(null); }}
                onSave={handleSave}
                isSaving={false}
            />
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Lessons</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage educational content for Player Mode • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingLesson(null); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Lesson
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search lessons..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Lessons Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Lesson</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Duration</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Rewards</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Quiz</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map(lesson => (
                            <tr key={lesson.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{lesson.title}</div>
                                    <div
                                        style={{ fontSize: '0.8rem', color: '#94A3B8', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        dangerouslySetInnerHTML={{ __html: lesson.description?.replace(/<[^>]+>/g, '') || '' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.625rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>{lesson.category}</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#64748B' }}><Clock size={14} /> {lesson.duration}m</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', fontSize: '0.8rem', color: '#8B5CF6' }}>⚡{lesson.xpReward}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', fontSize: '0.8rem', color: '#F59E0B' }}>🪙{lesson.coinReward}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', color: '#64748B' }}>
                                    {lesson.quiz?.length || 0} Qs
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{ padding: '0.25rem 0.625rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: lesson.isPublished ? '#DCFCE7' : '#FEF3C7', color: lesson.isPublished ? '#16A34A' : '#D97706' }}>
                                        {lesson.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button onClick={() => handleTogglePublish(lesson)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            {lesson.isPublished ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                                        </button>
                                        <button onClick={() => handleEdit(lesson)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            <Edit2 size={16} color="#64748B" />
                                        </button>
                                        <button onClick={() => handleDelete(lesson.id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: '6px', padding: '0.375rem', cursor: 'pointer' }}>
                                            <Trash2 size={16} color="#DC2626" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLessons.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                        No lessons found. Click "Add Lesson" to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
