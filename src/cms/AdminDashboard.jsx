import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Award, ShoppingBag, Users, TrendingUp,
    Activity, Plus, ArrowRight, Zap, Eye, Calendar, Megaphone,
    Newspaper, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

// API endpoints to monitor (read-only status)
const API_ENDPOINTS = [
    { name: 'Stock Prices', endpoint: '/api/stocks', market: 'all' },
    { name: 'Company Profiles', endpoint: '/api/stock-profile', market: 'all' },
    { name: 'Charts', endpoint: '/api/chart', market: 'all' },
    { name: 'News Feed', endpoint: '/api/news', market: 'all' },
    { name: 'AI Insights', endpoint: '/api/ai-insight', market: 'all' },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const {
        lessons, challenges, achievements, shopItems, news, announcements,
        loading, error, getDashboardStats
    } = useCMS();

    const [stats, setStats] = useState(null);
    const [apiStatus, setApiStatus] = useState({});
    const [checkingApis, setCheckingApis] = useState(false);

    // Load dashboard stats
    useEffect(() => {
        const loadStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        loadStats();
    }, [getDashboardStats]);

    // Check API status (read-only health check)
    const checkApiStatus = async () => {
        setCheckingApis(true);
        const newStatus = {};

        for (const api of API_ENDPOINTS) {
            try {
                const start = Date.now();
                const response = await fetch(`${api.endpoint}?symbol=AAPL&market=US`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(10000),
                });
                const latency = Date.now() - start;

                if (response.ok) {
                    newStatus[api.name] = { status: 'active', latency, lastCheck: new Date().toLocaleTimeString() };
                } else {
                    newStatus[api.name] = { status: 'error', error: `HTTP ${response.status}`, lastCheck: new Date().toLocaleTimeString() };
                }
            } catch (err) {
                newStatus[api.name] = {
                    status: err.name === 'TimeoutError' ? 'timeout' : 'error',
                    error: err.message,
                    lastCheck: new Date().toLocaleTimeString()
                };
            }
        }

        setApiStatus(newStatus);
        setCheckingApis(false);
    };

    // Quick stats from context
    const quickStats = [
        { label: 'Lessons', value: lessons.length, active: lessons.filter(l => l.isPublished).length, icon: BookOpen, color: '#8B5CF6', path: '/admin/lessons' },
        { label: 'Challenges', value: challenges.length, active: challenges.filter(c => c.isActive).length, icon: Trophy, color: '#F59E0B', path: '/admin/challenges' },
        { label: 'Achievements', value: achievements.length, active: achievements.length, icon: Award, color: '#10B981', path: '/admin/achievements' },
        { label: 'Shop Items', value: shopItems.length, active: shopItems.filter(i => i.isAvailable).length, icon: ShoppingBag, color: '#EC4899', path: '/admin/shop' },
        { label: 'News Articles', value: news.length, active: news.filter(n => n.isPublished).length, icon: Newspaper, color: '#0EA5E9', path: '/admin/news' },
        { label: 'Announcements', value: announcements.length, active: announcements.filter(a => a.isActive).length, icon: Megaphone, color: '#7C3AED', path: '/admin/announcements' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'timeout': return '#F59E0B';
            case 'error': return '#EF4444';
            default: return '#94A3B8';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle size={16} />;
            case 'timeout': return <Clock size={16} />;
            case 'error': return <XCircle size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                Loading dashboard data...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Manage content and monitor system status
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div style={{
                    padding: '1rem',
                    background: '#FEE2E2',
                    borderRadius: '12px',
                    color: '#DC2626',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <AlertTriangle size={20} />
                    Error loading CMS data: {error}
                </div>
            )}

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {quickStats.map(stat => (
                    <div
                        key={stat.label}
                        onClick={() => navigate(stat.path)}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            border: '1px solid #E2E8F0',
                            transition: 'all 0.2s',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `${stat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <stat.icon size={22} color={stat.color} />
                            </div>
                            <ArrowRight size={18} color="#94A3B8" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                            {stat.value}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{stat.label}</span>
                            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                                {stat.active} active
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Quick Actions */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={18} color="#F59E0B" />
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Add New Lesson', path: '/admin/lessons?action=new', color: '#8B5CF6' },
                            { label: 'Create Challenge', path: '/admin/challenges?action=new', color: '#F59E0B' },
                            { label: 'Post News Article', path: '/admin/news?action=new', color: '#0EA5E9' },
                            { label: 'New Announcement', path: '/admin/announcements?action=new', color: '#7C3AED' },
                        ].map(action => (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    background: `${action.color}10`,
                                    border: `1px solid ${action.color}30`,
                                    borderRadius: '10px',
                                    color: action.color,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Plus size={16} />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Status Monitor (Read-Only) */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} color="#10B981" />
                            API Status
                        </h3>
                        <button
                            onClick={checkApiStatus}
                            disabled={checkingApis}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.375rem 0.75rem',
                                background: '#F1F5F9',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: checkingApis ? 'not-allowed' : 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#64748B',
                            }}
                        >
                            <RefreshCw size={14} className={checkingApis ? 'animate-spin' : ''} />
                            {checkingApis ? 'Checking...' : 'Check Now'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {API_ENDPOINTS.map(api => {
                            const status = apiStatus[api.name];
                            return (
                                <div
                                    key={api.name}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.625rem 0.75rem',
                                        background: '#F8FAFC',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>{api.name}</span>
                                    {status ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: getStatusColor(status.status) }}>
                                            {getStatusIcon(status.status)}
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                {status.status === 'active' ? `${status.latency}ms` : status.status}
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Not checked</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center' }}>
                        Read-only status monitor • APIs managed separately
                    </div>
                </div>
            </div>

            {/* Active Announcements */}
            <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Megaphone size={18} color="#7C3AED" />
                    Active Announcements ({announcements.filter(a => a.isActive).length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {announcements.filter(a => a.isActive).slice(0, 3).map(ann => (
                        <div
                            key={ann.id}
                            style={{
                                padding: '1rem',
                                background: ann.type === 'promo' ? '#F3E8FF' : ann.type === 'update' ? '#DCFCE7' : '#E0F2FE',
                                borderRadius: '12px',
                            }}
                        >
                            <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.375rem', fontSize: '0.9rem' }}>
                                {ann.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                {ann.message.substring(0, 60)}...
                            </div>
                        </div>
                    ))}
                    {announcements.filter(a => a.isActive).length === 0 && (
                        <div style={{ gridColumn: 'span 3', padding: '1rem', textAlign: 'center', color: '#94A3B8' }}>
                            No active announcements
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
