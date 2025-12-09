import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Zap, Trophy, Target, Calendar, Star } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const CHALLENGE_TYPES = ['daily', 'weekly', 'special'];
const ICONS = ['🎯', '🏆', '📚', '🔥', '⚡', '🌟', '💎', '🚀', '🏅', '🎮'];

export default function AdminChallenges() {
    const { challenges, createChallenge, updateChallenge, deleteChallenge } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', type: 'daily', icon: '🎯',
        coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'prediction_made', isActive: true,
    });

    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || c.type === filterType;
        return matchesSearch && matchesType;
    });

    const groupedChallenges = {
        daily: filteredChallenges.filter(c => c.type === 'daily'),
        weekly: filteredChallenges.filter(c => c.type === 'weekly'),
        special: filteredChallenges.filter(c => c.type === 'special'),
    };

    const handleEdit = (challenge) => {
        setEditingChallenge(challenge);
        setFormData({ ...challenge });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this challenge?')) {
            deleteChallenge(id);
        }
    };

    const handleToggleActive = (challenge) => {
        updateChallenge(challenge.id, { isActive: !challenge.isActive });
    };

    const handleSubmit = () => {
        if (editingChallenge) {
            updateChallenge(editingChallenge.id, formData);
        } else {
            createChallenge(formData);
        }
        setShowModal(false);
        setEditingChallenge(null);
        setFormData({ title: '', description: '', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'prediction_made', isActive: true });
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'daily': return '#8B5CF6';
            case 'weekly': return '#0EA5E9';
            case 'special': return '#F59E0B';
            default: return '#64748B';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'daily': return <Target size={16} />;
            case 'weekly': return <Calendar size={16} />;
            case 'special': return <Star size={16} />;
            default: return <Trophy size={16} />;
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Challenges</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage daily, weekly, and special challenges • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingChallenge(null); setFormData({ title: '', description: '', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 1, triggerEvent: 'prediction_made', isActive: true }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Challenge
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search challenges..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                {CHALLENGE_TYPES.map(type => (
                    <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
                        style={{
                            padding: '0.625rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: filterType === type ? getTypeColor(type) : 'white',
                            color: filterType === type ? 'white' : '#64748B',
                            fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize',
                            display: 'flex', alignItems: 'center', gap: '0.375rem',
                        }}>
                        {getTypeIcon(type)} {type}
                    </button>
                ))}
            </div>

            {/* Challenges Grid by Type */}
            {Object.entries(groupedChallenges).map(([type, typeChalls]) => (
                typeChalls.length > 0 && (
                    <div key={type} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.375rem 0.75rem', borderRadius: '999px',
                                background: `${getTypeColor(type)}15`, color: getTypeColor(type),
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem'
                            }}>
                                {getTypeIcon(type)} {type} Challenges
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({typeChalls.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {typeChalls.map(challenge => (
                                <div key={challenge.id} style={{
                                    background: 'white', borderRadius: '16px', padding: '1.25rem',
                                    border: `1px solid ${challenge.isActive ? '#E2E8F0' : '#FEE2E2'}`,
                                    opacity: challenge.isActive ? 1 : 0.7,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.75rem' }}>{challenge.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '1rem' }}>{challenge.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{challenge.description}</div>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 700,
                                            background: challenge.isActive ? '#DCFCE7' : '#FEE2E2',
                                            color: challenge.isActive ? '#16A34A' : '#DC2626',
                                        }}>{challenge.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: '#FEF3C7', borderRadius: '6px' }}>
                                            <span style={{ fontSize: '0.85rem' }}>🪙</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>{challenge.coinReward}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: '#F3E8FF', borderRadius: '6px' }}>
                                            <Zap size={12} color="#8B5CF6" fill="#8B5CF6" />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED' }}>{challenge.xpReward} XP</span>
                                        </div>
                                        <div style={{ padding: '0.25rem 0.5rem', background: '#F1F5F9', borderRadius: '6px' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Target: {challenge.targetValue}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleToggleActive(challenge)}
                                            style={{ flex: 1, padding: '0.5rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                            {challenge.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => handleEdit(challenge)}
                                            style={{ padding: '0.5rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                            <Edit2 size={14} color="#64748B" />
                                        </button>
                                        <button onClick={() => handleDelete(challenge.id)}
                                            style={{ padding: '0.5rem', background: '#FEE2E2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                            <Trash2 size={14} color="#DC2626" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            {filteredChallenges.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', background: 'white', borderRadius: '16px' }}>
                    No challenges found. Click "Add Challenge" to create one.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingChallenge ? 'Edit Challenge' : 'New Challenge'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {CHALLENGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Icon</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                        {ICONS.map(icon => (
                                            <button key={icon} onClick={() => setFormData({ ...formData, icon })}
                                                style={{
                                                    width: '36px', height: '36px', fontSize: '1.25rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                    background: formData.icon === icon ? '#8B5CF6' : '#F1F5F9',
                                                }}>{icon}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Coin Reward</label>
                                    <input type="number" value={formData.coinReward} onChange={e => setFormData({ ...formData, coinReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Reward</label>
                                    <input type="number" value={formData.xpReward} onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Target</label>
                                    <input type="number" value={formData.targetValue} onChange={e => setFormData({ ...formData, targetValue: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="active" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                <label htmlFor="active" style={{ fontSize: '0.9rem', color: '#475569' }}>Active immediately</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save Challenge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
