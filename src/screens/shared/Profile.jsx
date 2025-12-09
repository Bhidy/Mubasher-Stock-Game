import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Settings, Bell, Shield, HelpCircle, LogOut,
    Moon, Sun, ChevronRight, Edit3, Camera, Mail, Phone, Globe,
    Lock, Eye, EyeOff, Award, Star, Zap, Coins, TrendingUp
} from 'lucide-react';
import { UserContext } from '../../App';
import { useMode } from '../../context/ModeContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const { mode, isPlayerMode, toggleMode } = useMode();

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        priceAlerts: true,
        newsAlerts: false,
    });

    const [formData, setFormData] = useState({
        name: user.name || 'Stock Trader',
        email: 'trader@example.com',
        phone: '+966 5X XXX XXXX',
    });

    const handleUpdateProfile = () => {
        setUser(prev => ({ ...prev, name: formData.name }));
        setIsEditing(false);
    };

    const stats = isPlayerMode ? [
        { icon: Zap, label: 'Level', value: user.level || 5, color: '#8B5CF6' },
        { icon: Star, label: 'XP', value: `${user.xp || 1250}`, color: '#F59E0B' },
        { icon: Coins, label: 'Coins', value: user.coins?.toLocaleString() || '2,500', color: '#10B981' },
        { icon: Award, label: 'Rank', value: `#${user.rank || 156}`, color: '#EC4899' },
    ] : [
        { icon: TrendingUp, label: 'Value', value: '$125K', color: '#10B981' },
        { icon: Star, label: 'Watchlist', value: '12', color: '#F59E0B' },
        { icon: Bell, label: 'Alerts', value: '5', color: '#EF4444' },
        { icon: Award, label: 'Accuracy', value: '72%', color: '#8B5CF6' },
    ];

    const settingsSections = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', action: () => setIsEditing(true) },
                { icon: Lock, label: 'Change Password', action: () => { } },
                { icon: Shield, label: 'Privacy Settings', action: () => { } },
            ]
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: Moon,
                    label: 'Dark Mode',
                    toggle: true,
                    value: darkMode,
                    action: () => setDarkMode(!darkMode)
                },
                { icon: Globe, label: 'Language', value: 'English', action: () => { } },
                { icon: Bell, label: 'Notifications', action: () => navigate('/notifications') },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', action: () => { } },
                { icon: Mail, label: 'Contact Us', action: () => { } },
            ]
        }
    ];

    const gradientColor = isPlayerMode
        ? 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)'
        : 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #10B981 100%)';

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            paddingBottom: '100px',
        }}>
            {/* Header */}
            <div style={{
                background: gradientColor,
                padding: '1rem 1rem 3rem 1rem',
                borderRadius: '0 0 32px 32px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}>
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
                        Profile
                    </h1>
                </div>

                {/* Profile Card */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            border: '3px solid rgba(255,255,255,0.3)',
                        }}>
                            {user.avatar || '👤'}
                        </div>
                        <button style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}>
                            <Camera size={14} color="#6B7280" />
                        </button>
                    </div>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                            {user.name || 'Stock Trader'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 }}>
                            {isPlayerMode ? `Level ${user.level || 5} Player` : 'Pro Investor'}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                            Member since Dec 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                margin: '0 1rem',
                marginTop: '-1.5rem',
            }}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}>
                        <stat.icon size={20} color={stat.color} style={{ marginBottom: '0.25rem' }} />
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Settings Sections */}
            <div style={{ padding: '1rem' }}>
                {settingsSections.map((section, sIdx) => (
                    <div key={sIdx} style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#64748B',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem',
                            paddingLeft: '0.25rem',
                        }}>
                            {section.title}
                        </h3>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}>
                            {section.items.map((item, iIdx) => (
                                <button
                                    key={iIdx}
                                    onClick={item.action}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: iIdx < section.items.length - 1 ? '1px solid #F1F5F9' : 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: '#F1F5F9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <item.icon size={18} color="#64748B" />
                                    </div>
                                    <span style={{ flex: 1, fontSize: '0.95rem', color: '#1F2937' }}>
                                        {item.label}
                                    </span>
                                    {item.toggle ? (
                                        <div style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            background: item.value ? '#8B5CF6' : '#E5E7EB',
                                            padding: '2px',
                                            transition: 'background 0.2s',
                                        }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '10px',
                                                background: 'white',
                                                transform: item.value ? 'translateX(20px)' : 'translateX(0)',
                                                transition: 'transform 0.2s',
                                            }} />
                                        </div>
                                    ) : item.value ? (
                                        <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{item.value}</span>
                                    ) : (
                                        <ChevronRight size={18} color="#D1D5DB" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '1rem',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                    }}
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div
                    onClick={() => setIsEditing(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
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
                            width: '100%',
                            maxWidth: '360px',
                        }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            Edit Profile
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.95rem',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.95rem',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    background: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: gradientColor,
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
