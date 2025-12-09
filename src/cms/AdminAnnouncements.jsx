import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, X, Save, Megaphone, Users, Gamepad2, TrendingUp, Bell, Clock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const TYPES = ['info', 'promo', 'update', 'warning'];
const PRIORITIES = ['low', 'medium', 'high'];
const TARGET_MODES = ['all', 'player', 'investor'];

export default function AdminAnnouncements() {
    const [searchParams] = useSearchParams();
    const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingAnn, setEditingAnn] = useState(null);
    const [formData, setFormData] = useState({
        title: '', message: '', type: 'info', priority: 'medium', targetMode: 'all',
        buttonText: '', buttonLink: '', isActive: false, expiresAt: '',
    });

    React.useEffect(() => {
        if (searchParams.get('action') === 'new') setShowModal(true);
    }, [searchParams]);

    const filteredAnnouncements = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || a.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleEdit = (ann) => {
        setEditingAnn(ann);
        setFormData({ ...ann });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this announcement?')) {
            deleteAnnouncement(id);
        }
    };

    const handleToggleActive = (ann) => {
        updateAnnouncement(ann.id, { isActive: !ann.isActive });
    };

    const handleSubmit = () => {
        if (editingAnn) {
            updateAnnouncement(editingAnn.id, formData);
        } else {
            createAnnouncement({ ...formData, createdAt: new Date().toISOString() });
        }
        setShowModal(false);
        setEditingAnn(null);
        setFormData({ title: '', message: '', type: 'info', priority: 'medium', targetMode: 'all', buttonText: '', buttonLink: '', isActive: false, expiresAt: '' });
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case 'info': return { bg: '#E0F2FE', color: '#0284C7', icon: '📢' };
            case 'promo': return { bg: '#F3E8FF', color: '#7C3AED', icon: '🎁' };
            case 'update': return { bg: '#DCFCE7', color: '#16A34A', icon: '🚀' };
            case 'warning': return { bg: '#FEF3C7', color: '#D97706', icon: '⚠️' };
            default: return { bg: '#F1F5F9', color: '#64748B', icon: '📋' };
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'high': return { bg: '#FEE2E2', color: '#DC2626' };
            case 'medium': return { bg: '#FEF3C7', color: '#D97706' };
            case 'low': return { bg: '#F1F5F9', color: '#64748B' };
            default: return { bg: '#F1F5F9', color: '#64748B' };
        }
    };

    const getTargetIcon = (mode) => {
        switch (mode) {
            case 'player': return <Gamepad2 size={14} />;
            case 'investor': return <TrendingUp size={14} />;
            default: return <Users size={14} />;
        }
    };

    const activeCount = announcements.filter(a => a.isActive).length;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Announcements</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage in-app notifications and promotions • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingAnn(null); setFormData({ title: '', message: '', type: 'info', priority: 'medium', targetMode: 'all', buttonText: '', buttonLink: '', isActive: false, expiresAt: '' }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> New Announcement
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total', value: announcements.length, icon: Megaphone, color: '#7C3AED' },
                    { label: 'Active', value: activeCount, icon: Bell, color: '#10B981' },
                    { label: 'Scheduled', value: announcements.filter(a => a.expiresAt && new Date(a.expiresAt) > new Date()).length, icon: Clock, color: '#F59E0B' },
                    { label: 'Expired', value: announcements.filter(a => a.expiresAt && new Date(a.expiresAt) <= new Date()).length, icon: Clock, color: '#64748B' },
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
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search announcements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                {TYPES.map(type => {
                    const style = getTypeStyle(type);
                    return (
                        <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
                            style={{
                                padding: '0.625rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                background: filterType === type ? style.color : 'white',
                                color: filterType === type ? 'white' : style.color,
                                fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize',
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                            }}>
                            {style.icon} {type}
                        </button>
                    );
                })}
            </div>

            {/* Announcements Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {filteredAnnouncements.map(ann => {
                    const typeStyle = getTypeStyle(ann.type);
                    const priorityStyle = getPriorityStyle(ann.priority);
                    return (
                        <div key={ann.id} style={{
                            background: 'white', borderRadius: '16px', padding: '1.25rem',
                            border: `2px solid ${ann.isActive ? typeStyle.color : '#E2E8F0'}`,
                            opacity: ann.isActive ? 1 : 0.7, position: 'relative'
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: typeStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                                    }}>{typeStyle.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '1rem' }}>{ann.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', color: '#64748B' }}>
                                            {getTargetIcon(ann.targetMode)}
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {ann.targetMode === 'all' ? 'All Users' : `${ann.targetMode} Mode`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.375rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 700,
                                        background: priorityStyle.bg, color: priorityStyle.color, textTransform: 'uppercase'
                                    }}>{ann.priority}</span>
                                    <span style={{
                                        padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 700,
                                        background: ann.isActive ? '#DCFCE7' : '#FEE2E2',
                                        color: ann.isActive ? '#16A34A' : '#DC2626'
                                    }}>{ann.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>

                            {/* Message */}
                            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                {ann.message}
                            </div>

                            {/* Button Preview */}
                            {ann.buttonText && (
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.375rem 0.75rem', background: typeStyle.color, color: 'white',
                                        borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600
                                    }}>{ann.buttonText}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleToggleActive(ann)}
                                    style={{ flex: 1, padding: '0.5rem', background: ann.isActive ? '#FEF3C7' : '#DCFCE7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: ann.isActive ? '#92400E' : '#16A34A' }}>
                                    {ann.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleEdit(ann)}
                                    style={{ padding: '0.5rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    <Edit2 size={14} color="#64748B" />
                                </button>
                                <button onClick={() => handleDelete(ann.id)}
                                    style={{ padding: '0.5rem', background: '#FEE2E2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    <Trash2 size={14} color="#DC2626" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredAnnouncements.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', background: 'white', borderRadius: '16px' }}>
                    No announcements found. Click "New Announcement" to create one.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingAnn ? 'Edit Announcement' : 'New Announcement'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Message</label>
                                <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Target</label>
                                    <select value={formData.targetMode} onChange={e => setFormData({ ...formData, targetMode: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {TARGET_MODES.map(m => <option key={m} value={m}>{m === 'all' ? 'All Users' : m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Button Text (optional)</label>
                                    <input type="text" value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Button Link</label>
                                    <input type="text" value={formData.buttonLink} onChange={e => setFormData({ ...formData, buttonLink: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="active" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                <label htmlFor="active" style={{ fontSize: '0.9rem', color: '#475569' }}>Activate immediately</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
