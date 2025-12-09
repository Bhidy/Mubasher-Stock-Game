import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, ShoppingBag, User, Award, Palette, Zap } from 'lucide-react';
import { getAllShopItems, createShopItem, updateShopItem } from './cmsApi';

const CATEGORIES = ['avatars', 'badges', 'themes', 'boosters'];
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const CAT_ICONS = { avatars: User, badges: Award, themes: Palette, boosters: Zap };
const CAT_COLORS = { avatars: '#8B5CF6', badges: '#F59E0B', themes: '#0EA5E9', boosters: '#10B981' };
const RARITY_COLORS = { common: '#6B7280', uncommon: '#16A34A', rare: '#2563EB', epic: '#7C3AED', legendary: '#D97706' };

export default function AdminShop() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: 'avatars', price: 100, icon: '👤', rarity: 'common', isActive: true });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(getAllShopItems());

    const filteredItems = items.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setShowModal(true); };
    const handleToggle = (item) => { updateShopItem(item.id, { isActive: !item.isActive }); loadItems(); };

    const handleSubmit = () => {
        if (editingItem) updateShopItem(editingItem.id, formData);
        else createShopItem(formData);
        setShowModal(false); setEditingItem(null); setFormData({ name: '', category: 'avatars', price: 100, icon: '👤', rarity: 'common', isActive: true }); loadItems();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Shop Items</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage avatars, badges, themes, and boosters</p>
                </div>
                <button onClick={() => { setEditingItem(null); setFormData({ name: '', category: 'avatars', price: 100, icon: '👤', rarity: 'common', isActive: true }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {CATEGORIES.map(cat => {
                    const Icon = CAT_ICONS[cat];
                    const count = items.filter(i => i.category === cat).length;
                    return (
                        <div key={cat} style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${CAT_COLORS[cat]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={20} color={CAT_COLORS[cat]} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{count}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'capitalize' }}>{cat}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {filteredItems.map(item => (
                    <div key={item.id} style={{ background: 'white', borderRadius: '14px', padding: '1rem', border: `2px solid ${RARITY_COLORS[item.rarity]}30`, opacity: item.isActive ? 1 : 0.5, textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '2rem' }}>{item.icon}</div>
                        <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>{item.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
                            <span style={{ padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, background: `${CAT_COLORS[item.category]}15`, color: CAT_COLORS[item.category], textTransform: 'capitalize' }}>{item.category}</span>
                            <span style={{ padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, background: `${RARITY_COLORS[item.rarity]}15`, color: RARITY_COLORS[item.rarity], textTransform: 'capitalize' }}>{item.rarity}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1rem' }}>🪙</span>
                            <span style={{ fontWeight: 800, color: '#D97706' }}>{item.price}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleToggle(item)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: item.isActive ? '#DCFCE7' : '#FEE2E2', color: item.isActive ? '#16A34A' : '#DC2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                {item.isActive ? 'Active' : 'Off'}
                            </button>
                            <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingItem ? 'Edit Item' : 'New Item'}</h2>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Rarity</label>
                                    <select value={formData.rarity} onChange={e => setFormData({ ...formData, rarity: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                                        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Price (coins)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
