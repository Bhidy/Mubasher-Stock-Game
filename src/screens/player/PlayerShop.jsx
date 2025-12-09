import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag, Coins, ArrowLeft, Star, Lock, Check, Sparkles,
    Crown, Palette, User, Image, Trophy, Gift, Zap, Heart
} from 'lucide-react';
import { UserContext } from '../../App';
import CoinDisplay from '../../components/player/CoinDisplay';

// Shop items
const SHOP_ITEMS = {
    avatars: [
        { id: 'avatar_gold', name: 'Golden Trader', price: 500, icon: '👑', rarity: 'rare', owned: false },
        { id: 'avatar_ninja', name: 'Stock Ninja', price: 300, icon: '🥷', rarity: 'uncommon', owned: false },
        { id: 'avatar_rocket', name: 'Moon Shooter', price: 750, icon: '🚀', rarity: 'epic', owned: false },
        { id: 'avatar_diamond', name: 'Diamond Hands', price: 1000, icon: '💎', rarity: 'legendary', owned: true },
        { id: 'avatar_bull', name: 'Bull Rider', price: 400, icon: '🐂', rarity: 'uncommon', owned: false },
        { id: 'avatar_bear', name: 'Bear Tamer', price: 400, icon: '🐻', rarity: 'uncommon', owned: false },
    ],
    badges: [
        { id: 'badge_fire', name: 'Fire Badge', price: 200, icon: '🔥', rarity: 'common', owned: true },
        { id: 'badge_star', name: 'Star Badge', price: 350, icon: '⭐', rarity: 'uncommon', owned: false },
        { id: 'badge_crown', name: 'Crown Badge', price: 800, icon: '👑', rarity: 'rare', owned: false },
        { id: 'badge_lightning', name: 'Lightning Badge', price: 500, icon: '⚡', rarity: 'rare', owned: false },
    ],
    themes: [
        { id: 'theme_neon', name: 'Neon Night', price: 600, icon: '🌃', rarity: 'rare', owned: false, preview: 'linear-gradient(135deg, #FF006E 0%, #8338EC 100%)' },
        { id: 'theme_ocean', name: 'Ocean Breeze', price: 450, icon: '🌊', rarity: 'uncommon', owned: false, preview: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' },
        { id: 'theme_forest', name: 'Forest Vibes', price: 450, icon: '🌲', rarity: 'uncommon', owned: false, preview: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' },
        { id: 'theme_sunset', name: 'Sunset Glow', price: 500, icon: '🌅', rarity: 'rare', owned: true, preview: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
    ],
    boosters: [
        { id: 'boost_2x', name: '2x XP (1 day)', price: 150, icon: '⚡', rarity: 'common', owned: false, quantity: 0, type: 'consumable' },
        { id: 'boost_coins', name: 'Coin Magnet', price: 200, icon: '🧲', rarity: 'uncommon', owned: false, quantity: 0, type: 'consumable' },
        { id: 'boost_streak', name: 'Streak Shield', price: 300, icon: '🛡️', rarity: 'rare', owned: false, quantity: 2, type: 'consumable' },
    ],
};

const RARITY_STYLES = {
    common: { bg: '#F3F4F6', border: '#D1D5DB', glow: 'none' },
    uncommon: { bg: '#DCFCE7', border: '#86EFAC', glow: '0 0 15px rgba(34, 197, 94, 0.3)' },
    rare: { bg: '#DBEAFE', border: '#93C5FD', glow: '0 0 15px rgba(59, 130, 246, 0.3)' },
    epic: { bg: '#F3E8FF', border: '#C4B5FD', glow: '0 0 15px rgba(139, 92, 246, 0.4)' },
    legendary: { bg: '#FEF3C7', border: '#FCD34D', glow: '0 0 20px rgba(245, 158, 11, 0.5)' },
};

const TABS = [
    { id: 'avatars', label: 'Avatars', icon: User },
    { id: 'badges', label: 'Badges', icon: Trophy },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'boosters', label: 'Boosters', icon: Zap },
];

function ShopItem({ item, onBuy, userCoins }) {
    const rarityStyle = RARITY_STYLES[item.rarity];
    const canAfford = userCoins >= item.price;
    const isOwned = item.owned || (item.quantity && item.quantity > 0);

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            border: `2px solid ${rarityStyle.border}`,
            boxShadow: isOwned ? rarityStyle.glow : '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Owned badge */}
            {isOwned && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    borderRadius: '999px',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Check size={12} color="white" strokeWidth={3} />
                </div>
            )}

            {/* Icon */}
            <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 0.75rem',
                borderRadius: '16px',
                background: item.preview || rarityStyle.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
            }}>
                {item.icon}
            </div>

            {/* Name */}
            <h4 style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#1F2937',
                textAlign: 'center',
                marginBottom: '0.25rem',
            }}>
                {item.name}
            </h4>

            {/* Rarity */}
            <div style={{
                textAlign: 'center',
                marginBottom: '0.75rem',
            }}>
                <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                }}>
                    {item.rarity}
                </span>
            </div>

            {/* Quantity for consumables */}
            {item.type === 'consumable' && item.quantity > 0 && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                }}>
                    You have: <strong>{item.quantity}</strong>
                </div>
            )}

            {/* Buy Button */}
            <button
                onClick={() => onBuy(item)}
                disabled={isOwned && item.type !== 'consumable'}
                style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isOwned && item.type !== 'consumable'
                        ? '#E5E7EB'
                        : canAfford
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : '#F3F4F6',
                    color: isOwned && item.type !== 'consumable'
                        ? '#9CA3AF'
                        : canAfford ? 'white' : '#9CA3AF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: isOwned && item.type !== 'consumable' ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    boxShadow: canAfford && (!isOwned || item.type === 'consumable')
                        ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                        : 'none',
                }}
            >
                {isOwned && item.type !== 'consumable' ? (
                    'Owned'
                ) : (
                    <>
                        <span>🪙</span>
                        {item.price.toLocaleString()}
                    </>
                )}
            </button>
        </div>
    );
}

export default function PlayerShop() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('avatars');
    const [purchaseModal, setPurchaseModal] = useState(null);

    const handleBuy = (item) => {
        if (user.coins >= item.price) {
            setPurchaseModal(item);
        }
    };

    const confirmPurchase = () => {
        if (purchaseModal) {
            setUser(prev => ({
                ...prev,
                coins: prev.coins - purchaseModal.price,
            }));
            // In real app, would update item ownership
            setPurchaseModal(null);
        }
    };

    const items = SHOP_ITEMS[activeTab] || [];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #FEF3C7 0%, #FFFFFF 20%)',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
                padding: '1rem 1rem 2rem 1rem',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative coins */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '40px',
                    fontSize: '2rem',
                    opacity: 0.3,
                }}>🪙</div>
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    fontSize: '1.5rem',
                    opacity: 0.2,
                }}>💎</div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.625rem',
                                cursor: 'pointer',
                            }}
                        >
                            <ArrowLeft size={20} color="white" />
                        </button>
                        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                            Coin Shop 🛒
                        </h1>
                    </div>
                    <CoinDisplay coins={user.coins} size="md" variant="glass" />
                </div>

                {/* Featured */}
                <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                    }}>
                        🎁
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Daily Free Spin Available!
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                            Win up to 500 coins
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/spin')}
                        style={{
                            padding: '0.625rem 1rem',
                            background: 'white',
                            color: '#D97706',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        Spin!
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
            }}>
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.625rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: isActive
                                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                                    : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                boxShadow: isActive
                                    ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                                    : '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Items Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.875rem',
                padding: '0 1rem',
            }}>
                {items.map(item => (
                    <ShopItem
                        key={item.id}
                        item={item}
                        onBuy={handleBuy}
                        userCoins={user.coins}
                    />
                ))}
            </div>

            {/* Purchase Modal */}
            {purchaseModal && (
                <div
                    onClick={() => setPurchaseModal(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            maxWidth: '320px',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1rem',
                            borderRadius: '20px',
                            background: RARITY_STYLES[purchaseModal.rarity].bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                        }}>
                            {purchaseModal.icon}
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Buy {purchaseModal.name}?
                        </h3>
                        <p style={{ color: '#6B7280', marginBottom: '1.25rem' }}>
                            This will cost <strong style={{ color: '#D97706' }}>🪙 {purchaseModal.price}</strong> coins
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setPurchaseModal(null)}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '2px solid #E5E7EB',
                                    background: 'white',
                                    color: '#6B7280',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPurchase}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                                }}
                            >
                                Buy Now! 🛒
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
