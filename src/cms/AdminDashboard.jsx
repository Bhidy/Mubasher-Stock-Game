import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, BookOpen, Trophy, Award, ShoppingBag, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity, DollarSign, Target,
    Clock, Calendar, ChevronRight
} from 'lucide-react';
import { getDashboardStats, getContentStats } from './cmsApi';

function StatCard({ title, value, change, icon: Icon, color, onClick }) {
    const isPositive = change >= 0;

    return (
        <div
            onClick={onClick}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: onClick ? 'pointer' : 'default',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={24} color={color} />
                </div>
                {change !== undefined && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '999px',
                        background: isPositive ? '#DCFCE7' : '#FEE2E2',
                        color: isPositive ? '#16A34A' : '#DC2626',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                    }}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' }}>{value}</div>
        </div>
    );
}

function ContentStatCard({ title, stats, icon: Icon, color, path }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={20} color={color} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Manage content</div>
                </div>
                <ChevronRight size={18} color="#94A3B8" style={{ marginLeft: 'auto' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Object.entries(stats).map(([key, val]) => (
                    <div key={key} style={{
                        padding: '0.375rem 0.625rem',
                        background: '#F1F5F9',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#475569',
                    }}>
                        <span style={{ fontWeight: 600 }}>{val}</span> {key}
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentActivityItem({ action, item, time, type }) {
    const colors = {
        create: '#10B981',
        update: '#F59E0B',
        delete: '#EF4444',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 0',
            borderBottom: '1px solid #F1F5F9',
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors[type] || '#94A3B8',
            }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <strong>{action}</strong> {item}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{time}</div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboardStats, setDashboardStats] = useState(null);
    const [contentStats, setContentStats] = useState(null);

    useEffect(() => {
        setDashboardStats(getDashboardStats());
        setContentStats(getContentStats());
    }, []);

    if (!dashboardStats || !contentStats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
            }}>
                <StatCard title="Total Users" value={dashboardStats.totalUsers.toLocaleString()} change={dashboardStats.growthRate} icon={Users} color="#8B5CF6" />
                <StatCard title="Active Today" value={dashboardStats.activeToday} icon={Activity} color="#10B981" />
                <StatCard title="Total Predictions" value={dashboardStats.totalPredictions.toLocaleString()} icon={Target} color="#F59E0B" />
                <StatCard title="Lessons Completed" value={dashboardStats.totalLessonsCompleted.toLocaleString()} icon={BookOpen} color="#0EA5E9" />
            </div>

            {/* Content Management */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
                Content Management
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
            }}>
                <ContentStatCard
                    title="Lessons"
                    stats={{ published: contentStats.lessons.published, draft: contentStats.lessons.draft }}
                    icon={BookOpen}
                    color="#8B5CF6"
                    path="/admin/lessons"
                />
                <ContentStatCard
                    title="Challenges"
                    stats={{ daily: contentStats.challenges.daily, weekly: contentStats.challenges.weekly }}
                    icon={Trophy}
                    color="#F59E0B"
                    path="/admin/challenges"
                />
                <ContentStatCard
                    title="Achievements"
                    stats={{ active: contentStats.achievements.active, total: contentStats.achievements.total }}
                    icon={Award}
                    color="#10B981"
                    path="/admin/achievements"
                />
                <ContentStatCard
                    title="Shop Items"
                    stats={contentStats.shopItems.byCategory}
                    icon={ShoppingBag}
                    color="#EC4899"
                    path="/admin/shop"
                />
            </div>

            {/* Recent Activity */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
                        Recent Activity
                    </h3>
                    <RecentActivityItem action="Created" item="New lesson: Advanced Charts" time="5 min ago" type="create" />
                    <RecentActivityItem action="Updated" item="Daily challenge rewards" time="1 hour ago" type="update" />
                    <RecentActivityItem action="Published" item="3 new achievements" time="2 hours ago" type="create" />
                    <RecentActivityItem action="Modified" item="Shop item prices" time="Yesterday" type="update" />
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0',
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem' }}>
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        <button
                            onClick={() => navigate('/admin/lessons?action=new')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <BookOpen size={18} />
                            Create New Lesson
                        </button>
                        <button
                            onClick={() => navigate('/admin/challenges?action=new')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                background: '#F1F5F9',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#475569',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <Trophy size={18} />
                            Add Challenge
                        </button>
                        <button
                            onClick={() => navigate('/admin/shop?action=new')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                background: '#F1F5F9',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#475569',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <ShoppingBag size={18} />
                            Add Shop Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
