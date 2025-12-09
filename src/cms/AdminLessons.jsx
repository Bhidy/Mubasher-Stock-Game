import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, ChevronDown, X, Save, BookOpen, Clock, Award, Coins } from 'lucide-react';
import { getAllLessons, createLesson, updateLesson, deleteLesson } from './cmsApi';

const CATEGORIES = ['beginner', 'intermediate', 'advanced'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function AdminLessons() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [lessons, setLessons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'beginner', difficulty: 'easy',
        duration: 5, xpReward: 50, coinReward: 25, isPublished: false,
    });

    useEffect(() => {
        loadLessons();
        if (searchParams.get('action') === 'new') setShowModal(true);
    }, []);

    const loadLessons = () => setLessons(getAllLessons());

    const filteredLessons = lessons.filter(l => {
        const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || l.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (lesson) => {
        setEditingLesson(lesson);
        setFormData({ ...lesson });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this lesson?')) {
            deleteLesson(id);
            loadLessons();
        }
    };

    const handleTogglePublish = (lesson) => {
        updateLesson(lesson.id, { isPublished: !lesson.isPublished });
        loadLessons();
    };

    const handleSubmit = () => {
        if (editingLesson) {
            updateLesson(editingLesson.id, formData);
        } else {
            createLesson(formData);
        }
        setShowModal(false);
        setEditingLesson(null);
        setFormData({ title: '', description: '', category: 'beginner', difficulty: 'easy', duration: 5, xpReward: 50, coinReward: 25, isPublished: false });
        loadLessons();
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Lessons</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage educational content for Player Mode</p>
                </div>
                <button onClick={() => { setEditingLesson(null); setFormData({ title: '', description: '', category: 'beginner', difficulty: 'easy', duration: 5, xpReward: 50, coinReward: 25, isPublished: false }); setShowModal(true); }}
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
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map(lesson => (
                            <tr key={lesson.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{lesson.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{lesson.description}</div>
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
            </div>

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingLesson ? 'Edit Lesson' : 'New Lesson'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', minHeight: '80px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Difficulty</label>
                                    <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Duration (min)</label>
                                    <input type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Reward</label>
                                    <input type="number" value={formData.xpReward} onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Coins</label>
                                    <input type="number" value={formData.coinReward} onChange={e => setFormData({ ...formData, coinReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="published" checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} />
                                <label htmlFor="published" style={{ fontSize: '0.9rem', color: '#475569' }}>Publish immediately</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
