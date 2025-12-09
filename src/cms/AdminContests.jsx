import React, { useState } from 'react';
import {
    Search, Plus, Filter, MoreVertical, Calendar, Trophy, Users,
    CheckCircle, Clock, AlertCircle, Trash2, Edit2, ArrowUpRight
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function AdminContests() {
    const { contests } = useCMS(); // Assuming useCMS handles contests or we will mock it
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data if not in CMS context yet
    const displayContests = contests || [
        { id: 1, title: 'Weekly Alpha', participants: 1240, prizePool: '5,000 Coins', status: 'Active', endsIn: '2d 4h' },
        { id: 2, title: 'Market Master', participants: 450, prizePool: '10,000 Coins', status: 'Upcoming', endsIn: '5d' },
    ];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header Actions */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}>
                    <Search size={20} color="#64748B" style={{ marginLeft: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search contests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '0.9rem',
                            minWidth: '240px',
                            color: '#1E293B',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#64748B',
                        cursor: 'pointer',
                    }}>
                        <Filter size={18} />
                        Filter
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: '#8B5CF6',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                    }}>
                        <Plus size={18} />
                        New Contest
                    </button>
                </div>
            </div>

            {/* Contests Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
            }}>
                {displayContests.map(contest => (
                    <div key={contest.id} style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                    }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: contest.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                                    color: contest.status === 'Active' ? '#166534' : '#92400E',
                                }}>
                                    {contest.status}
                                </span>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <MoreVertical size={18} color="#94A3B8" />
                                </button>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                                {contest.title}
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Users size={14} />
                                    {contest.participants.toLocaleString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Trophy size={14} />
                                    {contest.prizePool}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: '1rem',
                                borderTop: '1px solid #F1F5F9',
                            }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    Ends in <span style={{ fontWeight: 600, color: '#1E293B' }}>{contest.endsIn}</span>
                                </span>
                                <button style={{
                                    color: '#8B5CF6',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}>
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
