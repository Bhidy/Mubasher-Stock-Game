import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag, Coins, ArrowLeft, Star, Lock, Check, Sparkles,
    Crown, Palette, User, Image, Trophy, Gift, Zap, Heart
} from 'lucide-react';
import { UserContext } from '../../App';
import { useCMS } from '../../context/CMSContext';
import CoinDisplay from '../../components/player/CoinDisplay';
import { useToast } from '../../components/shared/Toast';
import Tooltip from '../../components/shared/Tooltip';

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

function ShopItem({ item, onBuy, userCoins, ownedItems = [] }) {
    const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
    const canAfford = userCoins >= item.price;
    const isOwned = ownedItems.includes(item.id);

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            border: `2px solid ${rarityStyle.border}`,
            boxShadow: isOwned ? rarityStyle.glow : '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
            opacity: item.isAvailable !== false ? 1 : 0.5,
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

            {/* Discount badge */}
            {item.discount > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#EF4444',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '0.125rem 0.375rem',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                }}>
                    -{item.discount}%
                </div>
            )}

            {/* Icon */}
            <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 0.75rem',
                borderRadius: '16px',
                background: rarityStyle.bg,
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

            {/* Description */}
            {item.description && (
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: '#9CA3AF',
                    marginBottom: '0.5rem',
                }}>
                    {item.description}
                </div>
            )}

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

            {/* Buy Button */}
            <button
                onClick={() => onBuy(item)}
                disabled={isOwned || !item.isAvailable}
                style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isOwned
                        ? '#E5E7EB'
                        : canAfford
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : '#F3F4F6',
                    color: isOwned
                        ? '#9CA3AF'
                        : canAfford ? 'white' : '#9CA3AF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: isOwned ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    boxShadow: canAfford && !isOwned
                        ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                        : 'none',
                }}
            >
                {isOwned ? (
                    'Owned'
                ) : (
                    <>
                        <span>🪙</span>
                        {item.discount > 0 ? (
                            <>
                                <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{item.price}</span>
                                <span>{Math.round(item.price * (1 - item.discount / 100))}</span>
                            </>
                        ) : (
                            item.price.toLocaleString()
                        )}
                    </>
                )}
            </button>
        </div>
    );
}

export default function PlayerShop() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { shopItems, getAvailableShopItems, loading } = useCMS();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('avatars');
    const [purchaseModal, setPurchaseModal] = useState(null);
    const [ownedItems, setOwnedItems] = useState(['shop-1']); // Mock owned items
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handleBuy = (item) => {
        const finalPrice = item.discount > 0
            ? Math.round(item.price * (1 - item.discount / 100))
            : item.price;

        if (user.coins >= finalPrice) {
            setPurchaseModal({ ...item, finalPrice });
        } else {
            showToast(`Not enough coins! You need ${finalPrice - user.coins} more coins.`, 'error');
        }
    };

    const confirmPurchase = async () => {
        if (purchaseModal) {
            setIsPurchasing(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUser(prev => ({
                ...prev,
                coins: (prev.coins || 0) - purchaseModal.finalPrice,
            }));
            setOwnedItems(prev => [...prev, purchaseModal.id]);

            showToast(`🎉 Successfully purchased ${purchaseModal.name}!`, 'success');
            setPurchaseModal(null);
            setIsPurchasing(false);
        }
    };

    // Get items from CMS filtered by category
    const items = getAvailableShopItems(activeTab);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading shop...
            </div>
        );
    }

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
                    const count = shopItems.filter(i => i.isAvailable && i.category === tab.id).length;
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
                            {count > 0 && <span style={{ opacity: 0.8 }}>({count})</span>}
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
                {items.length > 0 ? (
                    items.map(item => (
                        <ShopItem
                            key={item.id}
                            item={item}
                            onBuy={handleBuy}
                            userCoins={user.coins}
                            ownedItems={ownedItems}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: 'span 2',
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <ShoppingBag size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <p>No items available in this category yet.</p>
                    </div>
                )}
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
                            background: RARITY_STYLES[purchaseModal.rarity]?.bg || '#F3F4F6',
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
                            This will cost <strong style={{ color: '#D97706' }}>🪙 {purchaseModal.finalPrice}</strong> coins
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
