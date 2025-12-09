import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, ShoppingBag, Tag, Package } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const CATEGORIES = ['avatars', 'badges', 'themes', 'boosters'];

export default function AdminShop() {
    const { shopItems, createShopItem, updateShopItem, deleteShopItem } = useCMS();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', category: 'avatars', price: 100, rarity: 'common',
        icon: '👤', isAvailable: true, discount: 0,
    });

    const filteredItems = shopItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedItems = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = filteredItems.filter(i => i.category === cat);
        return acc;
    }, {});

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this item?')) {
            deleteShopItem(id);
        }
    };

    const handleToggleAvailable = (item) => {
        updateShopItem(item.id, { isAvailable: !item.isAvailable });
    };

    const handleSubmit = () => {
        if (editingItem) {
            updateShopItem(editingItem.id, formData);
        } else {
            createShopItem(formData);
        }
        setShowModal(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', category: 'avatars', price: 100, rarity: 'common', icon: '👤', isAvailable: true, discount: 0 });
    };

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'avatars': return '👤';
            case 'badges': return '🏅';
            case 'themes': return '🎨';
            case 'boosters': return '⚡';
            default: return '📦';
        }
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'avatars': return '#8B5CF6';
            case 'badges': return '#F59E0B';
            case 'themes': return '#EC4899';
            case 'boosters': return '#10B981';
            default: return '#64748B';
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return { bg: '#F1F5F9', text: '#64748B' };
            case 'rare': return { bg: '#DBEAFE', text: '#2563EB' };
            case 'epic': return { bg: '#F3E8FF', text: '#7C3AED' };
            case 'legendary': return { bg: '#FEF3C7', text: '#D97706' };
            default: return { bg: '#F1F5F9', text: '#64748B' };
        }
    };

    // Stats
    const totalItems = shopItems.length;
    const availableItems = shopItems.filter(i => i.isAvailable).length;
    const totalValue = shopItems.reduce((sum, i) => sum + i.price, 0);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>Shop Items</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage avatars, badges, themes, and boosters • Changes sync instantly</p>
                </div>
                <button onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', category: 'avatars', price: 100, rarity: 'common', icon: '👤', isAvailable: true, discount: 0 }); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={20} color="#8B5CF6" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{totalItems}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Items</div>
                    </div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={20} color="#16A34A" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>{availableItems}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Available</div>
                    </div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>🪙</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>{totalValue.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Value</div>
                    </div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={20} color="#DC2626" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626' }}>{shopItems.filter(i => i.discount > 0).length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>On Sale</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                </div>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
                        style={{
                            padding: '0.625rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: filterCategory === cat ? getCategoryColor(cat) : 'white',
                            color: filterCategory === cat ? 'white' : '#64748B',
                            fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize',
                            display: 'flex', alignItems: 'center', gap: '0.375rem',
                        }}>
                        {getCategoryIcon(cat)} {cat}
                    </button>
                ))}
            </div>

            {/* Items by Category */}
            {Object.entries(groupedItems).map(([cat, items]) => (
                items.length > 0 && (
                    <div key={cat} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.375rem 0.75rem', borderRadius: '999px',
                                background: `${getCategoryColor(cat)}15`, color: getCategoryColor(cat),
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem'
                            }}>
                                {getCategoryIcon(cat)} {cat}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({items.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {items.map(item => {
                                const rarityStyle = getRarityColor(item.rarity);
                                return (
                                    <div key={item.id} style={{
                                        background: 'white', borderRadius: '16px', padding: '1.25rem',
                                        border: `1px solid ${item.isAvailable ? '#E2E8F0' : '#FEE2E2'}`,
                                        opacity: item.isAvailable ? 1 : 0.7, position: 'relative'
                                    }}>
                                        {item.discount > 0 && (
                                            <div style={{
                                                position: 'absolute', top: '10px', right: '10px',
                                                background: '#EF4444', color: 'white', padding: '0.25rem 0.5rem',
                                                borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700
                                            }}>-{item.discount}%</div>
                                        )}
                                        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                                            <div style={{
                                                width: '60px', height: '60px', margin: '0 auto', borderRadius: '16px',
                                                background: `${getCategoryColor(item.category)}15`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                                            }}>{item.icon}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{item.description}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <span style={{ padding: '0.25rem 0.5rem', background: rarityStyle.bg, borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, color: rarityStyle.text, textTransform: 'capitalize' }}>{item.rarity}</span>
                                            <span style={{ padding: '0.25rem 0.5rem', background: '#FEF3C7', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>🪙 {item.price}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleToggleAvailable(item)}
                                                style={{ flex: 1, padding: '0.5rem', background: item.isAvailable ? '#FEF3C7' : '#DCFCE7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, color: item.isAvailable ? '#92400E' : '#16A34A' }}>
                                                {item.isAvailable ? 'Disable' : 'Enable'}
                                            </button>
                                            <button onClick={() => handleEdit(item)}
                                                style={{ padding: '0.5rem', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                                <Edit2 size={14} color="#64748B" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)}
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

            {filteredItems.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', background: 'white', borderRadius: '16px' }}>
                    No items found. Click "Add Item" to create one.
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingItem ? 'Edit Item' : 'New Item'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
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
                                        <option value="common">Common</option>
                                        <option value="rare">Rare</option>
                                        <option value="epic">Epic</option>
                                        <option value="legendary">Legendary</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Price (coins)</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Discount %</label>
                                    <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="available" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} />
                                <label htmlFor="available" style={{ fontSize: '0.9rem', color: '#475569' }}>Available for purchase</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSubmit} style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
