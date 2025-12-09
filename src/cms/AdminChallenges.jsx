import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Trophy, Calendar, Flame, Star } from 'lucide-react';
import { getAllChallenges, updateChallenge } from './cmsApi';

const CHALLENGE_TYPES = ['daily', 'weekly', 'special'];
const TRIGGER_EVENTS = ['prediction_made', 'prediction_won', 'lesson_completed', 'login', 'streak', 'community_post'];

export default function AdminChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 3, triggerEvent: 'prediction_made', isActive: true });

    useEffect(() => { loadChallenges(); }, []);
    const loadChallenges = () => setChallenges(getAllChallenges());

    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || c.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleEdit = (challenge) => { setEditingChallenge(challenge); setFormData({ ...challenge }); setShowModal(true); };
    const handleToggle = (challenge) => { updateChallenge(challenge.id, { isActive: !challenge.isActive }); loadChallenges(); };

    const handleSubmit = () => {
        if (editingChallenge) updateChallenge(editingChallenge.id, formData);
        setShowModal(false); setEditingChallenge(null); loadChallenges();
    };

    const getTypeIcon = (type) => ({ daily: Calendar, weekly: Flame, special: Star }[type] || Trophy);
    const getTypeColor = (type) => ({ daily: '#0EA5E9', weekly: '#F59E0B', special: '#8B5CF6' }[type] || '#6B7280');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Challenges</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage daily, weekly, and special challenges</p>
                </div>
                <button onClick={() => { setEditingChallenge(null); setFormData({ title: '', description: '', type: 'daily', icon: '🎯', coinReward: 50, xpReward: 25, targetValue: 3, triggerEvent: 'prediction_made', isActive: true }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Challenge
                </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search challenges..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">All Types</option>
                    {CHALLENGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {filteredChallenges.map(challenge => {
                    const TypeIcon = getTypeIcon(challenge.type);
                    const typeColor = getTypeColor(challenge.type);
                    return (
                        <div key={challenge.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0', opacity: challenge.isActive ? 1 : 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${typeColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{challenge.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, color: '#1E293B' }}>{challenge.title}</span>
                                        <span style={{ padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600, background: `${typeColor}15`, color: typeColor, textTransform: 'uppercase' }}>{challenge.type}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>{challenge.description}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ padding: '0.25rem 0.5rem', background: '#F3E8FF', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#7C3AED' }}>⚡{challenge.xpReward} XP</span>
                                <span style={{ padding: '0.25rem 0.5rem', background: '#FEF3C7', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>🪙{challenge.coinReward}</span>
                                <span style={{ padding: '0.25rem 0.5rem', background: '#F1F5F9', borderRadius: '6px', fontSize: '0.75rem', color: '#64748B' }}>Target: {challenge.targetValue}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button onClick={() => handleToggle(challenge)} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', border: 'none', background: challenge.isActive ? '#DCFCE7' : '#FEE2E2', color: challenge.isActive ? '#16A34A' : '#DC2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                    {challenge.isActive ? 'Active' : 'Inactive'}
                                </button>
                                <button onClick={() => handleEdit(challenge)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '0.375rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#64748B' }}>
                                    <Edit2 size={14} /> Edit
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingChallenge ? 'Edit Challenge' : 'New Challenge'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Icon</label>
                                    <input type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1.25rem', textAlign: 'center' }} />
                                </div>
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
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Target Value</label>
                                    <input type="number" value={formData.targetValue} onChange={e => setFormData({ ...formData, targetValue: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Reward</label>
                                    <input type="number" value={formData.xpReward} onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Coin Reward</label>
                                    <input type="number" value={formData.coinReward} onChange={e => setFormData({ ...formData, coinReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
