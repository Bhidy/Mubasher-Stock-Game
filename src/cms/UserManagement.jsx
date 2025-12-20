import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import {
    Search, User, Shield, Ban, Award, CheckCircle,
    XCircle, MoreHorizontal, Filter, Download, Mail
} from 'lucide-react';

export default function UserManagement() {
    const { users, updateUser, deleteUser } = useCMS();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredUsers = users.filter(user => {
        const name = user.name || '';
        const email = user.email || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleBanUser = (id, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        if (confirm(`Are you sure you want to ${newStatus === 'banned' ? 'BAN' : 'UNBAN'} this user?`)) {
            updateUser(id, { status: newStatus });
        }
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        User Intelligence
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                        Manage {users.length.toLocaleString()} registered investors
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                        <Download size={18} /> Export CSV
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: '#0EA5E9', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                        <Mail size={18} /> Broadcast
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Search size={20} color="#94A3B8" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Filter size={18} color="#64748B" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>User</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>Join Date</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>Net Worth</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>Level</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', overflow: 'hidden' }}>
                                            {user.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1E293B' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569' }}>
                                    {new Date(user.joinDate || user.createdAt || Date.now()).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#10B981' }}>
                                    ${(user.netWorth || user.coins || 0).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', background: '#F1F5F9', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                                        {user.level || 1}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        background: (user.status || 'active') === 'active' ? '#DCFCE7' : '#FEE2E2',
                                        color: (user.status || 'active') === 'active' ? '#16A34A' : '#DC2626'
                                    }}>
                                        {(user.status || 'active') === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        {(user.status || 'active').toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button
                                            title="View Profile"
                                            onClick={() => setSelectedUser(user)}
                                            style={{ padding: '0.5rem', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', color: '#64748B' }}
                                        >
                                            <User size={16} />
                                        </button>
                                        <button
                                            title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                                            onClick={() => handleBanUser(user.id, user.status)}
                                            style={{ padding: '0.5rem', background: user.status === 'banned' ? '#DCFCE7' : '#FEE2E2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: user.status === 'banned' ? '#16A34A' : '#DC2626' }}
                                        >
                                            <Ban size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                        No users found matching your criteria.
                    </div>
                )}
            </div>

            {/* Pagination Mock */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
                <button disabled style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', color: '#CBD5E1' }}>Previous</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#0EA5E9', color: 'white', fontWeight: 600 }}>1</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', color: '#64748B' }}>2</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', color: '#64748B' }}>3</button>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', color: '#64748B' }}>Next</button>
            </div>
        </div>
    );
}
