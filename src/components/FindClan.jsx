import React, { useState } from 'react';
import { X, Search, Users, Crown, TrendingUp, Shield } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

export default function FindClan({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    const allClans = [
        { id: 1, name: "Riyadh Traders", tag: "RYD", members: 48, maxMembers: 50, score: "2.4M", trend: "+12%", isPrivate: false },
        { id: 2, name: "Jeddah Investors", tag: "JED", members: 50, maxMembers: 50, score: "2.1M", trend: "+8%", isPrivate: false },
        { id: 3, name: "Dammam Bulls", tag: "DMM", members: 42, maxMembers: 50, score: "1.9M", trend: "+15%", isPrivate: false },
        { id: 4, name: "Saudi Stocks", tag: "SAU", members: 35, maxMembers: 50, score: "1.5M", trend: "-2%", isPrivate: false },
        { id: 5, name: "Mecca Elites", tag: "MEC", members: 28, maxMembers: 50, score: "1.2M", trend: "+5%", isPrivate: true },
        { id: 6, name: "Medina Masters", tag: "MED", members: 45, maxMembers: 50, score: "1.8M", trend: "+10%", isPrivate: false },
        { id: 7, name: "Tabuk Titans", tag: "TBK", members: 30, maxMembers: 50, score: "950K", trend: "+7%", isPrivate: false },
    ];

    const filteredClans = allClans.filter(clan =>
        clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clan.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoinClan = (clan) => {
        if (clan.members >= clan.maxMembers) {
            setToast(`${clan.name} is full!`);
            return;
        }
        if (clan.isPrivate) {
            setToast(`Join request sent to ${clan.name}!`);
        } else {
            setToast(`Successfully joined ${clan.name}! 🎉`);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
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
                overflow: 'hidden',
                padding: '1.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
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
                        cursor: 'pointer',
                        zIndex: 1
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
                        <Search size={24} color="white" />
                    </div>
                    <h2 className="h2" style={{ fontSize: '1.5rem' }}>Find a Clan</h2>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search size={20} color="#94a3b8" style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or tag..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {filteredClans.length} clan{filteredClans.length !== 1 ? 's' : ''} found
                </div>

                {/* Clans List */}
                <div style={{ flex: 1, overflow: 'auto', marginRight: '-1.5rem', paddingRight: '1.5rem' }}>
                    <div className="flex-col" style={{ gap: '0.75rem' }}>
                        {filteredClans.map(clan => (
                            <div key={clan.id} style={{
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                                    <div>
                                        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{clan.name}</span>
                                            {clan.isPrivate && <Shield size={14} color="#64748b" />}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                            [{clan.tag}]
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                                            {clan.score}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            Points
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-between" style={{ alignItems: 'center' }}>
                                    <div className="flex-center" style={{ gap: '1rem', fontSize: '0.75rem' }}>
                                        <span className="flex-center" style={{ gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                            <Users size={14} /> {clan.members}/{clan.maxMembers}
                                        </span>
                                        <span style={{
                                            color: clan.trend.includes('+') ? 'var(--success)' : 'var(--danger)',
                                            background: clan.trend.includes('+') ? '#dcfce7' : '#fee2e2',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontWeight: 600
                                        }}>
                                            {clan.trend}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={() => handleJoinClan(clan)}
                                        disabled={clan.members >= clan.maxMembers}
                                        style={{
                                            background: clan.members >= clan.maxMembers ? '#e2e8f0' : 'var(--gradient-primary)',
                                            color: clan.members >= clan.maxMembers ? '#94a3b8' : 'white',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: clan.members >= clan.maxMembers ? 'not-allowed' : 'pointer',
                                            border: 'none',
                                            borderRadius: 'var(--radius-full)',
                                            boxShadow: clan.members >= clan.maxMembers ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        {clan.members >= clan.maxMembers ? 'Full' : clan.isPrivate ? 'Request' : 'Join'}
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {filteredClans.length === 0 && (
                            <div style={{
                                padding: '3rem 1rem',
                                textAlign: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                <Search size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No clans found</p>
                                <p style={{ fontSize: '0.875rem' }}>Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toast */}
                {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </Card>
        </div>
    );
}
