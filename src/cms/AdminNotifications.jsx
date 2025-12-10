
import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import {
    Bell, Send, Plus, Search, Trash2, Edit, Check, X,
    Calendar, Users, Smartphone, Globe, Image as ImageIcon,
    ExternalLink, MessageSquare, Clock
} from 'lucide-react';

export default function AdminNotifications() {
    const { notifications, createNotification, deleteNotification, loading } = useCMS();
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('history'); // history, scheduled

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'in-app', // in-app, push, both
        target: 'all', // all, user, segment
        targetId: '', // if user
        imageUrl: '',
        actionUrl: '',
        scheduledAt: '',
    });

    const handleCreate = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.message) return;

        const newNotif = {
            ...formData,
            status: formData.scheduledAt ? 'scheduled' : 'sent',
            sentAt: formData.scheduledAt ? null : new Date().toISOString(),
        };

        await createNotification(newNotif);
        setIsCreating(false);
        setFormData({
            title: '',
            message: '',
            type: 'in-app',
            target: 'all',
            targetId: '',
            imageUrl: '',
            actionUrl: '',
            scheduledAt: '',
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this notification log?')) {
            await deleteNotification(id);
        }
    };

    const filteredNotifications = (notifications || []).filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                        Push Notifications
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Send alerts to users on the app or via system push.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        transition: 'transform 0.2s',
                    }}
                >
                    <Send size={18} />
                    Send New
                </button>
            </div>

            {/* Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Main List */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: '#F8FAFC',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0'
                        }}>
                            <Search size={18} color="#94A3B8" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading...</div>
                        ) : filteredNotifications.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                                <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No notifications sent yet</p>
                            </div>
                        ) : (
                            filteredNotifications.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onDelete={() => handleDelete(notification.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Info / Preview Panel */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        color: 'white',
                        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Smartphone size={20} className="text-purple-400" />
                            Live Preview
                        </h3>
                        {/* Fake Phone Screen */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1rem',
                            color: '#1E293B',
                            minHeight: '120px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                            }}>
                                🎮
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                                    {isCreating && formData.title ? formData.title : 'Notification Title'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>
                                    {isCreating && formData.message ? formData.message : 'This is how your message will appear to users on their devices.'}
                                </div>
                                {(isCreating && formData.imageUrl) && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        style={{ marginTop: '0.5rem', width: '100%', borderRadius: '6px', maxHeight: '100px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>now</div>
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
                            Stats Overview
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <StatBox
                                label="Total Sent"
                                value={notifications?.length || 0}
                                icon={Send}
                                color="#8B5CF6"
                            />
                            <StatBox
                                label="Scheduled"
                                value={notifications?.filter(n => n.status === 'scheduled').length || 0}
                                icon={Calendar}
                                color="#F59E0B"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2rem',
                        width: '90%',
                        maxWidth: '600px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Compose Message</h2>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#64748B" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="in-app">In-App Only</option>
                                        <option value="push">Push Only</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Target</label>
                                    <select
                                        value={formData.target}
                                        onChange={e => setFormData({ ...formData, target: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="segment">Active Users (Last 7d)</option>
                                        <option value="user">Specific User ID</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Check out this update!"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Message Body</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Write your engaging message here..."
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Image URL (Optional)</label>
                                    <div style={{ position: 'relative' }}>
                                        <ImageIcon size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                                        <input
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="https://..."
                                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Action / Deep Link</label>
                                    <div style={{ position: 'relative' }}>
                                        <ExternalLink size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                                        <input
                                            value={formData.actionUrl}
                                            onChange={e => setFormData({ ...formData, actionUrl: e.target.value })}
                                            placeholder="/market/TSLA"
                                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Option */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                <div style={{
                                    padding: '0.5rem', borderRadius: '8px',
                                    background: formData.scheduledAt ? '#EFF6FF' : '#F8FAFC',
                                    color: formData.scheduledAt ? '#3B82F6' : '#94A3B8',
                                    cursor: 'pointer'
                                }}>
                                    <Calendar size={20} />
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#64748B' }}>
                                    {formData.scheduledAt ? 'Scheduled for later' : 'Send Immediately'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                                }}
                            >
                                <Send size={20} />
                                {formData.scheduledAt ? 'Schedule Notification' : 'Send Notification'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const NotificationItem = ({ notification, onDelete }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        background: 'white',
        gap: '1rem',
        transition: 'all 0.2s',
    }}>
        <div style={{
            width: '48px', height: '48px',
            borderRadius: '12px',
            background: notification.type === 'push' ? '#FFF7ED' : notification.type === 'in-app' ? '#EFF6FF' : '#F0FDF4',
            color: notification.type === 'push' ? '#EA580C' : notification.type === 'in-app' ? '#2563EB' : '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0
        }}>
            {notification.type === 'push' ? <Smartphone size={24} /> : notification.type === 'in-app' ? <MessageSquare size={24} /> : <Globe size={24} />}
        </div>

        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h4 style={{ margin: 0, color: '#1E293B', fontWeight: 600 }}>{notification.title}</h4>
                <span style={{
                    fontSize: '0.7rem', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '12px',
                    background: '#F1F5F9', color: '#64748B',
                    textTransform: 'uppercase'
                }}>
                    {notification.type}
                </span>
            </div>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {notification.message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(notification.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={12} />
                    {notification.target}
                </span>
            </div>
        </div>

        <button
            onClick={onDelete}
            style={{
                background: '#FEF2F2',
                color: '#EF4444',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = 1}
            onMouseOut={e => e.currentTarget.style.opacity = 0.8}
        >
            <Trash2 size={18} />
        </button>
    </div>
);

const StatBox = ({ label, value, icon: Icon, color }) => (
    <div style={{
        background: '#F8FAFC',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
            <Icon size={16} color={color} />
            {label}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>
            {value}
        </div>
    </div>
);

const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    fontSize: '0.95rem',
    color: '#1E293B',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
};
