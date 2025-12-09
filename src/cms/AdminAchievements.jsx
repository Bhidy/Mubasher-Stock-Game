import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Award, Star, Crown, Gem } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const RARITIES = ['common', 'rare', 'epic', 'legendary'];
const CATEGORIES = ['prediction', 'learning', 'social', 'streak', 'special'];
const ICONS = ['🎯', '🏆', '📚', '🔥', '⚡', '🌟', '💎', '🚀', '🏅', '🎮', '💰', '📈', '🎓', '👥'];

export default function AdminAchievements() {
    const { achievements, createAchievement, updateAchievement, deleteAchievement } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRarity, setFilterRarity] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', icon: '🏆', rarity: 'common', category: 'prediction',
        xpReward: 100, coinReward: 50, requirement: 1, requirementType: 'predictions_made',
    });

    const filteredAchievements = achievements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRarity = filterRarity === 'all' || a.rarity === filterRarity;
        return matchesSearch && matchesRarity;
    });

    const groupedAchievements = RARITIES.reduce((acc, rarity) => {
        acc[rarity] = filteredAchievements.filter(a => a.rarity === rarity);
        return acc;
    }, {});

    const handleEdit = (achievement) => {
        setEditingAchievement(achievement);
        setFormData({ ...achievement });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this achievement?')) {
            deleteAchievement(id);
        }
    };

    const handleSubmit = () => {
        if (editingAchievement) {
            updateAchievement(editingAchievement.id, formData);
        } else {
            createAchievement(formData);
        }
        setShowModal(false);
        setEditingAchievement(null);
        setFormData({ title: '', description: '', icon: '🏆', rarity: 'common', category: 'prediction', xpReward: 100, coinReward: 50, requirement: 1, requirementType: 'predictions_made' });
    };

    const getRarityStyle = (rarity) => {
        switch (rarity) {
            case 'common': return { bg: '#F1F5F9', border: '#E2E8F0', text: '#64748B', gradient: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)' };
            case 'rare': return { bg: '#DBEAFE', border: '#93C5FD', text: '#2563EB', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' };
            case 'epic': return { bg: '#F3E8FF', border: '#C4B5FD', text: '#7C3AED', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' };
            case 'legendary': return { bg: '#FEF3C7', border: '#FCD34D', text: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' };
            default: return { bg: '#F1F5F9', border: '#E2E8F0', text: '#64748B', gradient: '#64748B' };
        }
    };

    const getRarityIcon = (rarity) => {
        switch (rarity) {
            case 'common': return <Star size={14} />;
            case 'rare': return <Award size={14} />;
            case 'epic': return <Gem size={14} />;
            case 'legendary': return <Crown size={14} />;
            default: return <Star size={14} />;
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Achievements</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage badges and milestones • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingAchievement(null); setFormData({ title: '', description: '', icon: '🏆', rarity: 'common', category: 'prediction', xpReward: 100, coinReward: 50, requirement: 1, requirementType: 'predictions_made' }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Achievement
                </button>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {RARITIES.map(rarity => {
                    const style = getRarityStyle(rarity);
                    const count = achievements.filter(a => a.rarity === rarity).length;
                    return (
                        <div key={rarity} style={{
                            background: style.bg, borderRadius: '12px', padding: '1rem',
                            border: `1px solid ${style.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: style.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                            }}>{getRarityIcon(rarity)}</div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: style.text }}>{count}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: style.text, textTransform: 'capitalize' }}>{rarity}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search achievements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                {RARITIES.map(rarity => {
                    const style = getRarityStyle(rarity);
                    return (
                        <button key={rarity} onClick={() => setFilterRarity(filterRarity === rarity ? 'all' : rarity)}
                            style={{
                                padding: '0.625rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                background: filterRarity === rarity ? style.gradient : 'white',
                                color: filterRarity === rarity ? 'white' : style.text,
                                fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize',
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                            }}>
                            {getRarityIcon(rarity)} {rarity}
                        </button>
                    );
                })}
            </div>

            {/* Achievements by Rarity */}
            {Object.entries(groupedAchievements).map(([rarity, rarityAchievements]) => (
                rarityAchievements.length > 0 && (
                    <div key={rarity} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.375rem 0.75rem', borderRadius: '999px',
                                background: getRarityStyle(rarity).gradient, color: 'white',
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem'
                            }}>
                                {getRarityIcon(rarity)} {rarity}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({rarityAchievements.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {rarityAchievements.map(achievement => {
                                const style = getRarityStyle(achievement.rarity);
                                return (
                                    <div key={achievement.id} style={{
                                        background: 'white', borderRadius: '16px', padding: '1.25rem',
                                        border: `2px solid ${style.border}`, position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: 0, right: 0,
                                            width: '60px', height: '60px',
                                            background: style.gradient, opacity: 0.1,
                                            borderRadius: '0 0 0 60px'
                                        }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '12px',
                                                background: style.bg, border: `2px solid ${style.border}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                            }}>{achievement.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{achievement.title}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{achievement.category}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                            {achievement.description}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <span style={{ padding: '0.25rem 0.5rem', background: '#FEF3C7', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#92400E' }}>🪙 {achievement.coinReward}</span>
                                            <span style={{ padding: '0.25rem 0.5rem', background: '#F3E8FF', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#7C3AED' }}>⚡ {achievement.xpReward} XP</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(achievement)}
                                                style={{ flex: 1, padding: '0.5rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(achievement.id)}
                                                style={{ padding: '0.5rem', background: '#FEE2E2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                                <Trash2 size={14} color="#DC2626" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            ))}

            {filteredAchievements.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', background: 'white', borderRadius: '16px' }}>
                    No achievements found. Click "Add Achievement" to create one.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingAchievement ? 'Edit Achievement' : 'New Achievement'}</h2>
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
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Rarity</label>
                                    <select value={formData.rarity} onChange={e => setFormData({ ...formData, rarity: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Icon</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {ICONS.map(icon => (
                                        <button key={icon} onClick={() => setFormData({ ...formData, icon })}
                                            style={{
                                                width: '40px', height: '40px', fontSize: '1.25rem', border: 'none', borderRadius: '10px', cursor: 'pointer',
                                                background: formData.icon === icon ? getRarityStyle(formData.rarity).gradient : '#F1F5F9',
                                                color: formData.icon === icon ? 'white' : 'inherit',
                                            }}>{icon}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Coin Reward</label>
                                    <input type="number" value={formData.coinReward} onChange={e => setFormData({ ...formData, coinReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Reward</label>
                                    <input type="number" value={formData.xpReward} onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
