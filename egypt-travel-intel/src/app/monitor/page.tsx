'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, AlertTriangle, CheckCircle, Clock, Database, Globe,
    RefreshCw, Server, TrendingUp, Users, Zap, XCircle, Pause,
    ArrowUpRight, BarChart3, Eye, Shield, Cpu, HardDrive, Wifi,
    Calendar, Timer, Target, AlertCircle, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatus {
    timestamp: string;
    period: string;
    totals: {
        posts: number;
        offers: number;
        accounts: number;
        activeAccounts: number;
        offersWithPrice: number;
        priceDetectionRate: string;
    };
    recent8h: {
        postsScraped: number;
        offersCreated: number;
    };
    ingestionRuns: {
        count: number;
        logs: Array<{
            id: string;
            runAt: string;
            status: 'success' | 'partial' | 'failed';
            accountsProcessed: number;
            postsCollected: number;
            offersDetected: number;
            duration: string;
            errorsCount: number;
            emailStatus?: string;
            emailSentAt?: string;
        }>;
        totalPostsCollected: number;
        totalOffersDetected: number;
    };
    topSources: Array<{
        handle: string;
        name: string;
        posts: number;
    }>;
    topDestinations: Array<{
        name: string;
        count: number;
    }>;
}

const DOMESTIC_DESTINATIONS = ['Cairo', 'Aswan', 'Luxor', 'Siwa', 'Sharm El Sheikh', 'Hurghada', 'Alexandria', 'Dahab'];

export default function MonitorPage() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/admin/status');
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
                setLastRefresh(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch status:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            if (autoRefresh) {
                setRefreshing(true);
                fetchStatus();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleManualRefresh = () => {
        setRefreshing(true);
        fetchStatus();
    };

    // Calculate health metrics
    const getHealthScore = () => {
        if (!status) return 0;
        const successRate = status.ingestionRuns.logs.filter(l => l.status === 'success').length / status.ingestionRuns.logs.length;
        const hasRecentData = status.recent8h.postsScraped > 0;
        const priceRate = parseInt(status.totals.priceDetectionRate) / 100;

        return Math.round((successRate * 50 + (hasRecentData ? 30 : 0) + priceRate * 20));
    };

    const getHealthStatus = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-500' };
        if (score >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-500' };
        if (score >= 40) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-500' };
        return { label: 'Critical', color: 'text-rose-500', bg: 'bg-rose-500' };
    };

    const healthScore = getHealthScore();
    const healthStatus = getHealthStatus(healthScore);

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'partial': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'failed': return <XCircle className="w-4 h-4 text-rose-500" />;
            default: return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600';
            case 'partial': return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
            case 'failed': return 'bg-rose-500/10 border-rose-500/20 text-rose-600';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
                            <Activity className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -inset-2 bg-indigo-500/20 rounded-3xl blur-xl animate-pulse" />
                    </div>
                    <p className="text-slate-400 font-medium">Loading System Monitor...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                <Activity className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
                                System Monitor
                            </h1>
                            <p className="text-sm text-slate-500 font-medium">Real-time scraping & ingestion health</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Auto-refresh toggle */}
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all",
                                autoRefresh
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                            )}
                        >
                            {autoRefresh ? <Wifi className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            {autoRefresh ? 'Live' : 'Paused'}
                        </button>

                        {/* Manual refresh */}
                        <button
                            onClick={handleManualRefresh}
                            disabled={refreshing}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Last update indicator */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    Last updated: {lastRefresh.toLocaleTimeString()}
                    {refreshing && <span className="text-indigo-500 animate-pulse ml-2">• Refreshing...</span>}
                </div>
            </motion.div>

            {/* Health Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
                        {/* Health Score */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="64" cy="64" r="56"
                                        stroke="url(#healthGradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${healthScore * 3.52} 352`}
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#10B981" />
                                            <stop offset="100%" stopColor="#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">{healthScore}</span>
                                    <span className="text-xs text-slate-400 font-medium">Score</span>
                                </div>
                            </div>
                            <div>
                                <div className={cn("text-2xl font-bold", healthStatus.color)}>{healthStatus.label}</div>
                                <p className="text-slate-400 text-sm">System Health Status</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-black text-white">{status?.totals.posts || 0}</div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-emerald-400">{status?.totals.offers || 0}</div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Offers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-blue-400">{status?.totals.activeAccounts || 0}</div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Active Sources</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-amber-400">{status?.totals.priceDetectionRate || '0%'}</div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Price Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Grid - Both columns match height */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Ingestion Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-fit lg:h-[580px]"
                >
                    <div className="p-6 border-b border-slate-100 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Timer className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Ingestion Timeline</h2>
                                    <p className="text-xs text-slate-500">Last 24 hours activity</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-900">{status?.ingestionRuns.count || 0}</div>
                                <div className="text-xs text-slate-500">Total Runs</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-3">
                            {status?.ingestionRuns.logs.slice(0, 15).map((log, index) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md",
                                        getStatusColor(log.status)
                                    )}
                                >
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(log.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm">{formatTime(log.runAt)}</span>
                                            <span className="text-xs opacity-60">{formatDate(log.runAt)}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {log.accountsProcessed} accounts
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Database className="w-3 h-3" />
                                                {log.postsCollected} posts
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                {log.offersDetected} offers
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-bold">{log.duration}</div>
                                        {log.errorsCount > 0 && (
                                            <div className="text-xs text-rose-500 flex items-center gap-1 justify-end">
                                                <AlertCircle className="w-3 h-3" />
                                                {log.errorsCount} errors
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Side Panel - Height matches timeline */}
                <div className="space-y-6 h-fit lg:h-[580px] flex flex-col">

                    {/* Email Reporting Card - Replaces Spacer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-200/50 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Email Reporting</h3>
                                <p className="text-xs text-slate-500">Digest & Pulse Status</p>
                            </div>
                        </div>

                        {(() => {
                            const latestEmailRun = status?.ingestionRuns.logs.find(l => l.emailStatus && l.emailStatus !== 'pending');
                            const isSuccess = latestEmailRun?.emailStatus === 'sent';
                            const statusColor = isSuccess ? 'text-emerald-600' : latestEmailRun?.emailStatus === 'failed' ? 'text-rose-600' : 'text-slate-400';

                            return (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-medium text-slate-600">Last Status</span>
                                        <div className={cn("flex items-center gap-2 text-sm font-bold capitalize", statusColor)}>
                                            {isSuccess ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {latestEmailRun?.emailStatus || 'No Data'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-medium text-slate-600">Last Sent</span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {latestEmailRun?.emailSentAt ? formatTime(latestEmailRun.emailSentAt) : 'Pending...'}
                                        </span>
                                    </div>

                                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-3 h-3 text-sky-600" />
                                            <span className="text-xs font-bold text-sky-700">Next Schedule</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-sky-800 font-medium">
                                            <span>Morning Digest</span>
                                            <span>10:00 AM</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-sky-800 font-medium mt-1">
                                            <span>Evening Pulse</span>
                                            <span>8:00 PM</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Last 8 Hours</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="text-3xl font-black">{status?.recent8h.postsScraped || 0}</div>
                                <div className="text-xs opacity-80 font-medium">Posts Scraped</div>
                            </div>
                            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="text-3xl font-black">{status?.recent8h.offersCreated || 0}</div>
                                <div className="text-xs opacity-80 font-medium">Offers Created</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
