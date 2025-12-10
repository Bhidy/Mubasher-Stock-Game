import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, Award, ShoppingBag, Users, TrendingUp,
    Activity, Plus, ArrowRight, Zap, Eye, Calendar, Megaphone,
    Newspaper, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw,
    BarChart2, PieChart, Info
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

// API endpoints to monitor (read-only status)
const API_ENDPOINTS = [
    { name: 'Stock Prices', endpoint: '/api/stocks', market: 'all' },
    { name: 'Company Profiles', endpoint: '/api/stock-profile', market: 'all' },
    { name: 'Charts', endpoint: '/api/chart', market: 'all' },
    { name: 'News Feed', endpoint: '/api/news', market: 'all' },
    { name: 'AI Insights', endpoint: '/api/ai-insight', market: 'all' },
];

// Mock Data for Charts (Simulating Historical Data)
const TRAFFIC_DATA = [
    { time: '00:00', users: 120, investors: 45 },
    { time: '04:00', users: 80, investors: 30 },
    { time: '08:00', users: 450, investors: 210 },
    { time: '12:00', users: 950, investors: 450 },
    { time: '16:00', users: 1200, investors: 600 },
    { time: '20:00', users: 850, investors: 380 },
    { time: '23:59', users: 300, investors: 120 },
];

const ECONOMY_DATA = [
    { day: 'Mon', earned: 5000, spent: 4200 },
    { day: 'Tue', earned: 5500, spent: 4800 },
    { day: 'Wed', earned: 6200, spent: 5100 },
    { day: 'Thu', earned: 5800, spent: 5900 },
    { day: 'Fri', earned: 7500, spent: 6500 },
    { day: 'Sat', earned: 8200, spent: 7800 },
    { day: 'Sun', earned: 7800, spent: 7200 },
];

const SENTIMENT_DATA = [
    { name: 'Bullish', value: 65, color: '#10B981' },
    { name: 'Bearish', value: 35, color: '#EF4444' },
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
        <div style={{ paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        Command Center
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                        Real-time system monitoring and content management
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#DCFCE7', color: '#16A34A', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 2px #DCFCE7' }} />
                        System Optimal
                    </span>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '12px', color: '#DC2626', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} />
                    Error loading CMS data: {error}
                </div>
            )}

            {/* Top Row: Key Metrics Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Traffic Chart */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Live Traffic Pulse</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Active users over last 24h</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0EA5E9' }}>1,245</div>
                            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>+12.5% vs yesterday</div>
                        </div>
                    </div>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TRAFFIC_DATA}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '0.85rem', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Line type="monotone" dataKey="investors" stroke="#6366F1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Pie */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Market Sentiment</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Bullish vs Bearish Predictions</p>
                    </div>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={SENTIMENT_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {SENTIMENT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                        {SENTIMENT_DATA.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                                {d.name} ({d.value}%)
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {quickStats.map(stat => (
                    <div key={stat.label} onClick={() => navigate(stat.path)}
                        style={{ background: 'white', borderRadius: '16px', padding: '1rem', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                            <stat.icon size={18} color={stat.color} />
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>

                {/* Economy Chart */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Economy Health</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Coins Distribution vs Spends</p>
                    </div>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ECONOMY_DATA} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="earned" name="Minted" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="spent" name="Burned" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* API & Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* API Monitor */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={18} color="#6366F1" /> API Status
                            </h3>
                            <button onClick={checkApiStatus} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                                <RefreshCw size={14} className={checkingApis ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {API_ENDPOINTS.map(api => {
                                const status = apiStatus[api.name];
                                return (
                                    <div key={api.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem 0.6rem', background: '#F8FAFC', borderRadius: '6px' }}>
                                        <span style={{ color: '#475569' }}>{api.name}</span>
                                        {status ? (
                                            <span style={{ color: getStatusColor(status.status), fontWeight: 600 }}>
                                                {status.status === 'active' ? `${status.latency}ms` : 'Error'}
                                            </span>
                                        ) : <span style={{ color: '#94A3B8' }}>-</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Announcements */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0', flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Megaphone size={18} color="#7C3AED" /> Active Alerts
                        </h3>
                        {announcements.filter(a => a.isActive).length > 0 ? (
                            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                                {announcements.filter(a => a.isActive).slice(0, 2).map(a => (
                                    <div key={a.id} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                                        <strong>{a.title}</strong>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', padding: '1rem' }}>No active alerts</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
