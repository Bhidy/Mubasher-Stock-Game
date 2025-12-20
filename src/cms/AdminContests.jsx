import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, MoreVertical, Calendar, Trophy, Users,
    CheckCircle, Clock, AlertCircle, Trash2, Edit2, ArrowUpRight,
    Target, Zap, TrendingUp, Award, DollarSign, Star
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

// Animation styles
const animationStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
        50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
    }
    .contest-card {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
    .contest-card:nth-child(1) { animation-delay: 0.1s; }
    .contest-card:nth-child(2) { animation-delay: 0.2s; }
    .contest-card:nth-child(3) { animation-delay: 0.3s; }
    .contest-card:nth-child(4) { animation-delay: 0.4s; }
    .contest-card:nth-child(5) { animation-delay: 0.5s; }
    .contest-card:nth-child(6) { animation-delay: 0.6s; }
`;

// Progress Bar Component
const ProgressBar = ({ value, max, color }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setWidth((value / max) * 100), 300);
        return () => clearTimeout(timer);
    }, [value, max]);

    return (
        <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
                width: `${width}%`, height: '100%', background: color, borderRadius: '3px',
                transition: 'width 1s ease-out'
            }} />
        </div>
    );
};

// Countdown Component
const CountdownTimer = ({ endsIn }) => {
    const [time, setTime] = useState(endsIn || '—');
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            padding: '0.375rem 0.75rem', borderRadius: '8px',
            fontSize: '0.8rem', fontWeight: 700, color: '#92400E'
        }}>
            <Clock size={14} />
            {time}
        </div>
    );
};

export default function AdminContests() {
    const { contests } = useCMS();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data with safe defaults
    const displayContests = (contests && contests.length > 0) ? contests : [
        {
            id: 1,
            title: 'Weekly Alpha Challenge',
            description: 'Predict daily market movements for 7 days straight',
            participants: 1240,
            maxParticipants: 2000,
            prizePool: 5000,
            status: 'Active',
            endsIn: '2d 4h',
            type: 'Weekly',
            featured: true
        },
        {
            id: 2,
            title: 'Market Master Tournament',
            description: 'Top 10 accuracy wins the grand prize',
            participants: 450,
            maxParticipants: 1000,
            prizePool: 10000,
            status: 'Upcoming',
            endsIn: '5d 12h',
            type: 'Monthly',
            featured: false
        },
        {
            id: 3,
            title: 'Sector Showdown',
            description: 'Pick winning sectors across 5 markets',
            participants: 890,
            maxParticipants: 1500,
            prizePool: 7500,
            status: 'Active',
            endsIn: '1d 8h',
            type: 'Special',
            featured: true
        },
        {
            id: 4,
            title: 'Earnings Season Sprint',
            description: 'Predict earnings beats and misses',
            participants: 320,
            maxParticipants: 500,
            prizePool: 3000,
            status: 'Ended',
            endsIn: 'Ended',
            type: 'Limited',
            featured: false
        },
    ];

    const filteredContests = displayContests.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return { bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)', text: '#166534', icon: CheckCircle };
            case 'Upcoming': return { bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', text: '#1E40AF', icon: Clock };
            case 'Ended': return { bg: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', text: '#64748B', icon: AlertCircle };
            default: return { bg: '#F1F5F9', text: '#64748B', icon: AlertCircle };
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Weekly': return '#10B981';
            case 'Monthly': return '#8B5CF6';
            case 'Special': return '#F59E0B';
            case 'Limited': return '#EC4899';
            default: return '#64748B';
        }
    };

    // Stats summary
    const stats = {
        total: displayContests.length,
        active: displayContests.filter(c => c.status === 'Active').length,
        totalParticipants: displayContests.reduce((sum, c) => sum + (c.participants || 0), 0),
        totalPrizePool: displayContests.reduce((sum, c) => sum + (c.prizePool || 0), 0),
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <style>{animationStyles}</style>

            {/* Stats Row */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'
            }}>
                {[
                    { label: 'Total Contests', value: stats.total, icon: Trophy, color: '#8B5CF6' },
                    { label: 'Active Now', value: stats.active, icon: Zap, color: '#10B981' },
                    { label: 'Participants', value: stats.totalParticipants.toLocaleString(), icon: Users, color: '#0EA5E9' },
                    { label: 'Prize Pool', value: `${stats.totalPrizePool.toLocaleString()} 🪙`, icon: Award, color: '#F59E0B' },
                ].map((stat, i) => (
                    <div key={stat.label} className="contest-card" style={{
                        background: 'white', borderRadius: '16px', padding: '1.25rem',
                        border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: `${stat.color}15`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <stat.icon size={24} color={stat.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Header Actions */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: 'white', padding: '0.75rem 1rem', borderRadius: '12px',
                    border: '1px solid #E2E8F0', minWidth: '300px'
                }}>
                    <Search size={18} color="#94A3B8" />
                    <input
                        type="text"
                        placeholder="Search contests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%', color: '#1E293B' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.25rem', background: 'white',
                        border: '1px solid #E2E8F0', borderRadius: '12px',
                        fontWeight: 600, fontSize: '0.9rem', color: '#64748B', cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                        <Filter size={18} /> Filter
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none', borderRadius: '12px',
                        fontWeight: 700, fontSize: '0.9rem', color: 'white', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s'
                    }}>
                        <Plus size={18} /> New Contest
                    </button>
                </div>
            </div>

            {/* Contests Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {filteredContests.map((contest, index) => {
                    const statusStyle = getStatusColor(contest.status);
                    const StatusIcon = statusStyle.icon;
                    const participantPercent = ((contest.participants || 0) / (contest.maxParticipants || 1)) * 100;

                    return (
                        <div
                            key={contest.id}
                            className="contest-card"
                            style={{
                                background: 'white', borderRadius: '20px',
                                border: contest.featured ? '2px solid #10B981' : '1px solid #E2E8F0',
                                overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer', position: 'relative'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Featured Badge */}
                            {contest.featured && (
                                <div style={{
                                    position: 'absolute', top: '12px', right: '12px',
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                    padding: '0.25rem 0.625rem', borderRadius: '6px',
                                    fontSize: '0.65rem', fontWeight: 700, color: 'white',
                                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                                }}>
                                    <Star size={10} fill="white" /> Featured
                                </div>
                            )}

                            {/* Header Gradient */}
                            <div style={{
                                height: '6px',
                                background: contest.status === 'Active'
                                    ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                                    : contest.status === 'Upcoming'
                                        ? 'linear-gradient(90deg, #0EA5E9 0%, #38BDF8 100%)'
                                        : 'linear-gradient(90deg, #94A3B8 0%, #CBD5E1 100%)'
                            }} />

                            <div style={{ padding: '1.5rem' }}>
                                {/* Status & Type */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                                        padding: '0.375rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                                        background: statusStyle.bg, color: statusStyle.text
                                    }}>
                                        <StatusIcon size={12} />
                                        {contest.status}
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.625rem', borderRadius: '6px',
                                        fontSize: '0.7rem', fontWeight: 600,
                                        background: `${getTypeColor(contest.type)}15`,
                                        color: getTypeColor(contest.type)
                                    }}>
                                        {contest.type}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                                    {contest.title}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                    {contest.description}
                                </p>

                                {/* Participants Progress */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#64748B' }}>Participants</span>
                                        <span style={{ fontWeight: 700, color: '#1E293B' }}>
                                            {(contest.participants || 0).toLocaleString()} / {(contest.maxParticipants || 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <ProgressBar value={contest.participants || 0} max={contest.maxParticipants || 1} color="#10B981" />
                                </div>

                                {/* Stats Row */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1rem', background: '#F8FAFC', borderRadius: '12px', marginBottom: '1rem'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                                            {(contest.prizePool || 0).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>🪙 Prize</div>
                                    </div>
                                    <div style={{ width: '1px', height: '30px', background: '#E2E8F0' }} />
                                    <CountdownTimer endsIn={contest.endsIn} />
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button style={{
                                        flex: 1, padding: '0.75rem', background: 'white',
                                        border: '1px solid #E2E8F0', borderRadius: '10px',
                                        fontWeight: 600, fontSize: '0.85rem', color: '#64748B',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '0.375rem'
                                    }}>
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button style={{
                                        flex: 1, padding: '0.75rem',
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        border: 'none', borderRadius: '10px',
                                        fontWeight: 600, fontSize: '0.85rem', color: 'white',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '0.375rem'
                                    }}>
                                        <ArrowUpRight size={14} /> Manage
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredContests.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '4rem',
                    background: 'white', borderRadius: '20px',
                    border: '1px solid #E2E8F0'
                }}>
                    <Trophy size={48} color="#E2E8F0" style={{ marginBottom: '1rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem' }}>
                        No contests found
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
                        Try adjusting your search or create a new contest
                    </div>
                </div>
            )}
        </div>
    );
}
