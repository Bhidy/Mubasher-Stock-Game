import React, { useState } from 'react';
import { X, Shield, Users, Globe } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

export default function CreateClan({ onClose }) {
    const [clanName, setClanName] = useState('');
    const [clanTag, setClanTag] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [toast, setToast] = useState(null);

    const handleCreate = () => {
        if (!clanName.trim()) {
            setToast('Please enter a clan name');
            return;
        }
        if (!clanTag.trim()) {
            setToast('Please enter a clan tag');
            return;
        }
        setToast('Clan created successfully! 🎉');
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <Card style={{
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '1.5rem',
                position: 'relative'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex-center" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        background: 'var(--gradient-primary)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        <Shield size={24} color="white" />
                    </div>
                    <h2 className="h2" style={{ fontSize: '1.5rem' }}>Create Your Clan</h2>
                </div>

                {/* Form */}
                <div className="flex-col" style={{ gap: '1.25rem' }}>
                    {/* Clan Name */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Clan Name *
                        </label>
                        <input
                            type="text"
                            value={clanName}
                            onChange={(e) => setClanName(e.target.value)}
                            placeholder="Enter clan name"
                            maxLength={30}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {clanName.length}/30 characters
                        </div>
                    </div>

                    {/* Clan Tag */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Clan Tag *
                        </label>
                        <input
                            type="text"
                            value={clanTag}
                            onChange={(e) => setClanTag(e.target.value.toUpperCase())}
                            placeholder="e.g., RYD"
                            maxLength={5}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                textTransform: 'uppercase'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {clanTag.length}/5 characters
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell others about your clan..."
                            maxLength={200}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {description.length}/200 characters
                        </div>
                    </div>

                    {/* Privacy Toggle */}
                    <div style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <div className="flex-center" style={{ gap: '0.5rem' }}>
                                {isPrivate ? <Shield size={18} color="var(--primary)" /> : <Globe size={18} color="var(--primary)" />}
                                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                    {isPrivate ? 'Private Clan' : 'Public Clan'}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsPrivate(!isPrivate)}
                                style={{
                                    width: '48px',
                                    height: '28px',
                                    borderRadius: '14px',
                                    background: isPrivate ? 'var(--primary)' : '#cbd5e1',
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    position: 'absolute',
                                    top: '3px',
                                    left: isPrivate ? '23px' : '3px',
                                    transition: 'left 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                            {isPrivate ? 'Only invited members can join' : 'Anyone can find and join your clan'}
                        </p>
                    </div>

                    {/* Create Button */}
                    <Button
                        onClick={handleCreate}
                        style={{
                            background: 'var(--gradient-primary)',
                            color: 'white',
                            height: '3rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        <Shield size={20} style={{ marginRight: '0.5rem' }} />
                        Create Clan
                    </Button>
                </div>

                {/* Toast */}
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </Card>
        </div>
    );
}
