import React, { useState } from 'react';
import {
    Search, Filter, MoreVertical, Shield, Mail, Calendar,
    ArrowUpRight, Ban, CheckCircle
} from 'lucide-react';

export default function AdminUsers() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Users Data
    const users = [
        { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'User', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Premium', status: 'Active', joined: '2024-02-01' },
        { id: 3, name: 'Admin User', email: 'admin@bhidy.com', role: 'Admin', status: 'Active', joined: '2023-12-01' },
        { id: 4, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Suspended', joined: '2024-03-10' },
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
                        placeholder="Search users..."
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
                        background: '#1E293B',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
                    }}>
                        <Mail size={18} />
                        Invite User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>User</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Role</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Joined</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr key={user.id} style={{ borderBottom: i !== users.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#F1F5F9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            color: '#64748B',
                                            fontSize: '0.85rem',
                                        }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>{user.name}</div>
                                            <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.25rem 0.625rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: user.role === 'Admin' ? '#F3E8FF' : user.role === 'Premium' ? '#FEF3C7' : '#F1F5F9',
                                        color: user.role === 'Admin' ? '#7C3AED' : user.role === 'Premium' ? '#D97706' : '#475569',
                                    }}>
                                        {user.role === 'Admin' && <Shield size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.625rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: user.status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                                        color: user.status === 'Active' ? '#166534' : '#991B1B',
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#64748B', fontSize: '0.85rem' }}>
                                    {user.joined}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button style={{
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: '#94A3B8',
                                    }}>
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
