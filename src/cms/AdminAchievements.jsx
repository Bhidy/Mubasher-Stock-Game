import React, { useState, useEffect } from 'react';
import { Search, Edit2, X, Save, Award, Lock, Unlock } from 'lucide-react';
import { getAllAchievements, updateAchievement } from './cmsApi';

const RARITY_OPTIONS = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const CATEGORY_OPTIONS = ['beginner', 'streak', 'prediction', 'social', 'special'];

const RARITY_COLORS = {
    common: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
    uncommon: { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' },
    rare: { bg: '#DBEAFE', text: '#2563EB', border: '#93C5FD' },
    epic: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
    legendary: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
};

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRarity, setFilterRarity] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '🏆', rarity: 'common', xp: 50, category: 'beginner', isActive: true });

    useEffect(() => { loadAchievements(); }, []);
    const loadAchievements = () => setAchievements(getAllAchievements());

    const filteredAchievements = achievements.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRarity = filterRarity === 'all' || a.rarity === filterRarity;
        return matchesSearch && matchesRarity;
    });

    const handleEdit = (achievement) => { setEditingAchievement(achievement); setFormData({ ...achievement }); setShowModal(true); };
    const handleToggle = (achievement) => { updateAchievement(achievement.id, { isActive: !achievement.isActive }); loadAchievements(); };

    const handleSubmit = () => {
        if (editingAchievement) updateAchievement(editingAchievement.id, formData);
        setShowModal(false); setEditingAchievement(null); loadAchievements();
    };

    const groupedByRarity = {};
    RARITY_OPTIONS.forEach(r => { groupedByRarity[r] = filteredAchievements.filter(a => a.rarity === r); });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Achievements</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage Player Mode achievements and badges</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search achievements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                <select value={filterRarity} onChange={e => setFilterRarity(e.target.value)} style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">All Rarities</option>
                    {RARITY_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            {RARITY_OPTIONS.map(rarity => {
                const items = groupedByRarity[rarity];
                if (items.length === 0) return null;
                const colors = RARITY_COLORS[rarity];
                return (
                    <div key={rarity} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, textTransform: 'uppercase' }}>{rarity}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({items.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                            {items.map(achievement => (
                                <div key={achievement.id} style={{ background: 'white', borderRadius: '14px', padding: '1rem', border: `2px solid ${colors.border}`, opacity: achievement.isActive ? 1 : 0.5, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleEdit(achievement)}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem' }}>{achievement.icon}</div>
                                    <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{achievement.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '0.5rem' }}>{achievement.description}</div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <span style={{ padding: '0.125rem 0.375rem', background: '#F3E8FF', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, color: '#7C3AED' }}>⚡{achievement.xp} XP</span>
                                        <button onClick={e => { e.stopPropagation(); handleToggle(achievement); }} style={{ padding: '0.125rem 0.375rem', background: achievement.isActive ? '#DCFCE7' : '#FEE2E2', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, color: achievement.isActive ? '#16A34A' : '#DC2626', border: 'none', cursor: 'pointer' }}>
                                            {achievement.isActive ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Achievement</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
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
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Rarity</label>
                                    <select value={formData.rarity} onChange={e => setFormData({ ...formData, rarity: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {RARITY_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Reward</label>
                                    <input type="number" value={formData.xp} onChange={e => setFormData({ ...formData, xp: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
