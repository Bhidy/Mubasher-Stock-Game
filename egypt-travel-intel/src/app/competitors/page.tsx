'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    ExternalLink,
    Package,
    MapPin,
    Hotel,
    DollarSign,
    Calendar,
    ArrowRight,
    Search,
    Plus,
    Trash2,
    Power,
    RefreshCw,
    MoreHorizontal,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    PlayCircle,
    PauseCircle,
    X,
    BarChart3,
    Users
} from 'lucide-react';
import { cn, formatPrice, getDestinationEmoji } from '@/lib/utils';
import { StatsOverview, StatCardItem } from '@/components/StatsOverview';

interface CompetitorStats {
    id: string;
    isActive: boolean;
    handle: string;
    displayName: string;
    profileUrl: string | null;
    totalPosts: number;
    totalOffers: number;
    avgPrice: number | null;
    topDestinations: Array<{ name: string; count: number }>;
    topOfferTypes: Array<{ type: string; count: number }>;
    hotels: string[];
    recentActivity: number;
    priceRange: { min: number | null; max: number | null };
    outboundRatio: number;
}

export default function CompetitorsPage() {
    const [competitors, setCompetitors] = useState<CompetitorStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorStats | null>(null);

    // Filters & Sort
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
    const [sortBy, setSortBy] = useState<'offers' | 'activity' | 'price'>('offers');

    // Add Form State
    const [newHandle, setNewHandle] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [adding, setAdding] = useState(false);

    // Delete Confirmation Modal
    const [deleteTarget, setDeleteTarget] = useState<CompetitorStats | null>(null);

    const fetchCompetitors = async () => {
        try {
            const res = await fetch('/api/competitors');
            if (res.ok) {
                const data = await res.json();
                setCompetitors(data.competitors || []);
            }
        } catch (error) {
            console.error('Failed to fetch competitors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompetitors();
    }, []);

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHandle.trim()) return;

        setAdding(true);
        try {
            const res = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: newHandle.trim(),
                    displayName: newDisplayName.trim() || undefined,
                }),
            });

            if (res.ok) {
                setNewHandle('');
                setNewDisplayName('');
                setShowAddModal(false);
                setLoading(true);
                setTimeout(fetchCompetitors, 2000);
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add account');
            }
        } catch (error) {
            alert('Failed to add account');
        } finally {
            setAdding(false);
        }
    };

    const handleToggleActive = async (comp: CompetitorStats, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setCompetitors(prev => prev.map(c =>
                c.id === comp.id ? { ...c, isActive: !c.isActive } : c
            ));

            await fetch('/api/accounts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: comp.id,
                    isActive: !comp.isActive,
                }),
            });
        } catch (error) {
            fetchCompetitors();
            alert('Failed to update status');
        }
    };

    const handleDeleteAccount = async (comp: CompetitorStats, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget(comp);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            setCompetitors(prev => prev.filter(c => c.id !== deleteTarget.id));
            await fetch(`/api/accounts?id=${deleteTarget.id}`, {
                method: 'DELETE',
            });
            setDeleteTarget(null);
        } catch (error) {
            fetchCompetitors();
            setDeleteTarget(null);
        }
    };

    // Filter Logic
    const filteredCompetitors = competitors
        .filter(comp => {
            const matchesSearch = comp.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                comp.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all'
                ? true
                : statusFilter === 'active' ? comp.isActive : !comp.isActive;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'offers') return b.totalOffers - a.totalOffers;
            if (sortBy === 'activity') return b.recentActivity - a.recentActivity;
            if (sortBy === 'price') return (b.avgPrice || 0) - (a.avgPrice || 0);
            return 0;
        });

    return (
        <main className="max-w-[1800px] mx-auto px-6 py-8 space-y-10">

            {/* Delete Confirmation Modal - Goo Mode */}
            {deleteTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setDeleteTarget(null)}
                >
                    <div
                        className="bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/20 w-full max-w-md p-8 ring-1 ring-black/5 animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>

                        {/* Content */}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Account?</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-slate-900">@{deleteTarget.handle}</span>?
                                <br />
                                <span className="text-red-500 text-sm font-medium">This will remove all their data permanently.</span>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-white/50 backdrop-blur-sm p-6 rounded-[40px] border border-white/50 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 tracking-tight pb-2">
                            Source Intelligence
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl">
                            Real-time monitoring on <span className="font-bold text-slate-900">{competitors.length} agencies</span>.
                            Managing <span className="font-bold text-emerald-600">{competitors.reduce((acc, c) => acc + c.totalOffers, 0)} offers</span> across
                            the market ecosystem.
                        </p>
                    </div>

                    {/* Filters Pill */}
                    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit">
                        {['all', 'active', 'paused'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300",
                                    statusFilter === status
                                        ? "bg-white text-slate-900 shadow-md shadow-slate-200 transform scale-105"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-3 shadow-sm group-focus-within:ring-2 group-focus-within:ring-emerald-500/20 transition-all">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search sources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-slate-700 font-bold placeholder:text-slate-400 w-full sm:w-64"
                            />
                        </div>
                    </div>

                    {/* New Source Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="relative group overflow-hidden px-6 py-3.5 bg-slate-900 rounded-2xl text-white font-bold shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-100 group-hover:opacity-90 transition-opacity" />
                        <div className="relative flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5 stroke-[3]" />
                            <span>Add</span>
                        </div>
                    </button>
                </div>
            </div>


            {/* Global Stats Overview */}
            {!loading && (
                <StatsOverview
                    cards={[
                        {
                            title: 'Total Tracked Posts',
                            value: competitors.reduce((acc, curr) => acc + curr.totalPosts, 0),
                            icon: Package,
                            colorClass: 'text-blue-600',
                            subValue: 'Historical Data'
                        },
                        {
                            title: 'Active Offers',
                            value: competitors.reduce((acc, curr) => acc + curr.totalOffers, 0),
                            icon: TrendingUp,
                            colorClass: 'text-emerald-500',
                            subValue: 'Live Opportunities'
                        },
                        {
                            title: 'Global Avg. Price',
                            value: formatPrice(competitors.reduce((acc, curr) => acc + (curr.avgPrice || 0), 0) / (competitors.filter(c => c.avgPrice).length || 1), 'EGP'),
                            icon: DollarSign,
                            colorClass: 'text-amber-500',
                            subValue: 'Market Index'
                        },
                        {
                            title: 'System Status',
                            value: 'Just now',
                            icon: RefreshCw,
                            colorClass: 'text-slate-600',
                            subValue: 'Sync Healthy'
                        }
                    ]}
                />
            )}

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-[420px] bg-slate-100/50 rounded-[40px] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredCompetitors.map((comp, i) => {
                        // "Goo Mode" Themes - Enhanced Vibrancy
                        const themes = [
                            {
                                bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
                                border: "border-indigo-100 hover:border-indigo-300",
                                glow: "shadow-indigo-500/20",
                                iconColor: "text-indigo-600",
                                vector: <TrendingUp className="w-64 h-64 text-indigo-500/5 rotate-12" />
                            },
                            {
                                bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                                border: "border-emerald-100 hover:border-emerald-300",
                                glow: "shadow-emerald-500/20",
                                iconColor: "text-emerald-600",
                                vector: <Package className="w-64 h-64 text-emerald-500/5 -rotate-12" />
                            },
                            {
                                bg: "bg-gradient-to-br from-rose-50 to-pink-50",
                                border: "border-rose-100 hover:border-rose-300",
                                glow: "shadow-rose-500/20",
                                iconColor: "text-rose-600",
                                vector: <Hotel className="w-64 h-64 text-rose-500/5 rotate-6" />
                            },
                            {
                                bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                                border: "border-amber-100 hover:border-amber-300",
                                glow: "shadow-amber-500/20",
                                iconColor: "text-amber-600",
                                vector: <DollarSign className="w-64 h-64 text-amber-500/5 -rotate-6" />
                            },
                            {
                                bg: "bg-gradient-to-br from-violet-50 to-purple-50",
                                border: "border-violet-100 hover:border-violet-300",
                                glow: "shadow-violet-500/20",
                                iconColor: "text-violet-600",
                                vector: <Users className="w-64 h-64 text-violet-500/5 rotate-12" />
                            },
                            {
                                bg: "bg-gradient-to-br from-cyan-50 to-sky-50",
                                border: "border-cyan-100 hover:border-cyan-300",
                                glow: "shadow-cyan-500/20",
                                iconColor: "text-cyan-600",
                                vector: <MapPin className="w-64 h-64 text-cyan-500/5 -rotate-12" />
                            },
                        ];
                        const theme = themes[i % themes.length];
                        const isInactive = !comp.isActive;

                        return (
                            <div
                                key={comp.id}
                                onClick={() => setSelectedCompetitor(comp)}
                                className={cn(
                                    "group relative isolate flex flex-col items-center p-8 transition-all duration-500 cursor-pointer rounded-[40px] border overflow-hidden",
                                    isInactive
                                        ? "bg-slate-50 border-slate-100 opacity-60 grayscale-[0.8]"
                                        : cn(theme.bg, theme.border, "hover:-translate-y-2 hover:shadow-2xl", theme.glow)
                                )}
                            >
                                {/* Active Status Dot (Pulsing) */}
                                {comp.isActive && (
                                    <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
                                        <div className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider font-mono">LIVE</span>
                                    </div>
                                )}

                                {/* Big Vector Background */}
                                <div className="absolute -right-12 -bottom-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0 pointer-events-none z-0">
                                    {theme.vector}
                                </div>

                                {/* Card Actions (Hover) */}
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
                                    <button
                                        onClick={(e) => handleToggleActive(comp, e)}
                                        className="p-2.5 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                                        title={comp.isActive ? "Pause Tracking" : "Resume Tracking"}
                                    >
                                        <Power className={cn("w-4 h-4", comp.isActive ? "text-emerald-500 fill-emerald-500/20" : "")} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteAccount(comp, e)}
                                        className="p-2.5 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                                        title="Delete Source"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Placeholder / Image */}
                                <div className="mt-4 mb-6 relative group-hover:scale-110 transition-transform duration-500 ease-out z-10">
                                    <div className={cn("absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300", theme.bg.replace('to-', 'from-'))} />
                                    <ProfileImage src={comp.profileUrl} alt={comp.handle} handle={comp.handle} active={comp.isActive} />
                                </div>

                                {/* Text Info */}
                                <div className="text-center space-y-1 mb-8 z-10 w-full relative">
                                    <h3 className="font-extrabold text-xl text-slate-900 truncate px-2">{comp.displayName || `@${comp.handle}`}</h3>
                                    <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-1.5">
                                        @{comp.handle}
                                        {comp.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-slate-300" />}
                                    </p>
                                </div>

                                {/* Modern Stats Row */}
                                <div className="grid grid-cols-2 gap-4 w-full mb-8 z-10">
                                    <div className="relative overflow-hidden bg-white/60 p-4 rounded-3xl border border-white/50 hover:bg-white transition-colors">
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{comp.totalOffers?.toLocaleString()}</p>
                                        <p className="text-[10px] uppercase tracking-bold font-bold text-slate-400">Total Offers</p>
                                    </div>
                                    <div className="relative overflow-hidden bg-white/60 p-4 rounded-3xl border border-white/50 hover:bg-white transition-colors">
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{comp.recentActivity?.toLocaleString()}</p>
                                        <p className="text-[10px] uppercase tracking-bold font-bold text-slate-400">Active (7d)</p>
                                    </div>
                                </div>

                                {/* Destinations Pill Cloud */}
                                <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-auto z-10">
                                    {comp.topDestinations.slice(0, 3).map((dest, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600 group-hover:scale-105 transition-transform delay-[50ms]">
                                            <span>{getDestinationEmoji(dest.name)}</span>
                                            <span>{dest.name}</span>
                                        </div>
                                    ))}
                                    {comp.topDestinations.length > 3 && (
                                        <div className="px-2 py-1.5 text-xs font-bold text-slate-400 bg-white/50 rounded-xl">
                                            +{comp.topDestinations.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] p-10 w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-300 border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                        <div className="relative">
                            <h3 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                                <Plus className="w-8 h-8 text-emerald-600 bg-emerald-100 p-1.5 rounded-xl" />
                                New Source
                            </h3>
                            <p className="text-slate-500 font-medium mb-8">Start tracking a new competitor on Instagram.</p>

                            <form onSubmit={handleAddAccount} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Instagram Handle</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="@"
                                            value={newHandle}
                                            onChange={(e) => setNewHandle(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-0 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        placeholder="Agency Name"
                                        value={newDisplayName}
                                        onChange={(e) => setNewDisplayName(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-0 transition-colors"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={adding || !newHandle.trim()}
                                        className="flex-[2] px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-3"
                                    >
                                        {adding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><span>Start Tracking</span> <ArrowRight className="w-5 h-5 opacity-50" /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Reuse Detailed Modal logic if needed, omitted here for brevity as layout is same, just improved entry point */}
            {selectedCompetitor && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedCompetitor(null)}
                >
                    <div
                        className="bg-white/95 backdrop-blur-2xl rounded-[48px] border border-white/40 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl scale-100 animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Content - Reusing the structure but with better classes */}
                        <div className="p-10">
                            {/* ... (Keeping existing modal detail structure) ... */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-[32px] bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner">
                                        <ProfileImage src={selectedCompetitor.profileUrl} alt={selectedCompetitor.handle} handle={selectedCompetitor.handle} active={selectedCompetitor.isActive} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 mb-2">{selectedCompetitor.displayName || `@${selectedCompetitor.handle}`}</h2>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide border",
                                                selectedCompetitor.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {selectedCompetitor.isActive ? "Active Monitoring" : "Paused"}
                                            </span>
                                            <a
                                                href={`https://instagram.com/${selectedCompetitor.handle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 font-bold text-xs hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all flex items-center gap-1.5"
                                            >
                                                @{selectedCompetitor.handle} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCompetitor(null)}
                                    className="p-3 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-2xl transition-all"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            {/* KPI Cards - "Stats Cards" Style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {/* Card 1: Total Posts */}
                                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[200px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Posts</p>
                                        <p className="text-4xl font-black text-slate-900">{selectedCompetitor.totalPosts}</p>
                                    </div>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                                            {selectedCompetitor.totalPosts} recent uploads
                                        </span>
                                    </div>
                                </div>

                                {/* Card 2: Offers */}
                                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[200px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="p-1.5 bg-slate-50 rounded-full border border-slate-100">
                                            <ExternalLink className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Offers</p>
                                        <p className="text-4xl font-black text-slate-900">{selectedCompetitor.totalOffers}</p>
                                    </div>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                                            Detected with AI
                                        </span>
                                    </div>
                                </div>

                                {/* Card 3: Avg Price */}
                                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[200px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                            <DollarSign className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Price</p>
                                        <p className="text-3xl font-black text-slate-900 truncate" title={selectedCompetitor.avgPrice ? formatPrice(selectedCompetitor.avgPrice, 'EGP') : 'N/A'}>
                                            {selectedCompetitor.avgPrice ? formatPrice(Math.round(selectedCompetitor.avgPrice), 'EGP') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                                            Market Average
                                        </span>
                                    </div>
                                </div>

                                {/* Card 4: Last Sync */}
                                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[200px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/30">
                                            <RefreshCw className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                                        <p className="text-4xl font-black text-slate-900">1h ago</p>
                                    </div>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Healthy
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">Top Destinations</h3>
                                    <div className="space-y-4">
                                        {selectedCompetitor.topDestinations.slice(0, 5).map((dest, i) => (
                                            <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                                                <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{getDestinationEmoji(dest.name)}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-slate-700">{dest.name}</span>
                                                        <span className="text-xs font-bold text-slate-400">{dest.count} offers</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${(dest.count / Math.max(1, ...selectedCompetitor.topDestinations.map(d => d.count))) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">Hotel Portfolio</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCompetitor.hotels.slice(0, 20).map((hotel, i) => (
                                            <span key={i} className="px-4 py-2 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-default shadow-sm hover:shadow-md">
                                                {hotel}
                                            </span>
                                        ))}
                                        {selectedCompetitor.hotels.length === 0 && (
                                            <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center w-full">
                                                <p className="text-slate-400 font-medium">No hotels detected yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function ProfileImage({ src, alt, handle, active }: { src: string | null; alt: string; handle: string; active?: boolean }) {
    // Optimized: Static vivid gradient
    return (
        <div className={cn(
            "w-20 h-20 rounded-[28px] flex items-center justify-center text-2xl font-black text-white shadow-xl relative overflow-hidden",
            "bg-gradient-to-br from-slate-900 to-slate-700"
        )}>
            {/* Dynamic "Goo" Glow */}
            {active && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent animate-pulse" />}

            <span className="relative z-10">{handle.substring(0, 2).toUpperCase()}</span>

            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-white/10 rounded-full blur-lg" />
        </div>
    );
}
