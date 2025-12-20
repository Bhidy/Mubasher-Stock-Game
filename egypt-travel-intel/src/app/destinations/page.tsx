'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Plane,
    Building,
    DollarSign,
    Users,
    MapPin,
    Search,
    ArrowUpRight,
    Sparkles,
    Hotel
} from 'lucide-react';
import { cn, formatPrice, getDestinationEmoji } from '@/lib/utils';
import { StatsOverview, StatCardItem } from '@/components/StatsOverview';
// Note: Sidebar is now global in layout.tsx

interface DestinationStats {
    name: string;
    type: 'inbound' | 'outbound';
    offerCount: number;
    avgPrice: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    topAgencies: string[];
    topHotels: string[];
    topOfferTypes: string[];
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<DestinationStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
    const [selectedDestination, setSelectedDestination] = useState<DestinationStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchDestinations() {
            try {
                const res = await fetch('/api/destinations');
                if (res.ok) {
                    const data = await res.json();
                    setDestinations(data.destinations || []);
                }
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDestinations();
    }, []);

    const filteredDestinations = destinations.filter(d => {
        const matchesFilter = filter === 'all' || d.type === filter;
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const inboundCount = destinations.filter(d => d.type === 'inbound').length;
    const outboundCount = destinations.filter(d => d.type === 'outbound').length;

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-xs uppercase tracking-wide">Global Coverage</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Destinations Hub</h1>
                    <p className="text-slate-500 mt-2 font-medium">Market intelligence across {destinations.length} tracked locations</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 shadow-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Global Stats Overview */}
            {
                !loading && (
                    <StatsOverview
                        cards={[
                            {
                                title: 'Total Volume',
                                value: destinations.reduce((acc, curr) => acc + curr.offerCount, 0),
                                icon: MapPin,
                                colorClass: 'text-indigo-600',
                                subValue: 'Tracked Locations'
                            },
                            {
                                title: 'Active Offers',
                                value: destinations.reduce((acc, curr) => acc + curr.offerCount, 0),
                                icon: TrendingUp,
                                colorClass: 'text-emerald-500',
                                subValue: 'Live Opportunities'
                            },
                            {
                                title: 'Global Avg. Price',
                                value: formatPrice(destinations.reduce((acc, curr) => acc + (curr.avgPrice || 0), 0) / (destinations.filter(c => c.avgPrice).length || 1), 'EGP'),
                                icon: DollarSign,
                                colorClass: 'text-amber-500',
                                subValue: 'Market Index'
                            },
                            {
                                title: 'Market Status',
                                value: 'Live',
                                icon: Sparkles,
                                colorClass: 'text-slate-600',
                                subValue: 'Real-time sync'
                            }
                        ]}
                    />
                )
            }

            {/* Filter Pills */}
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 w-fit shdow-sm">
                <button
                    onClick={() => setFilter('all')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                        filter === 'all' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    All Markets
                </button>
                <button
                    onClick={() => setFilter('inbound')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                        filter === 'inbound' ? "bg-amber-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <Building className="w-4 h-4" /> Domestic (Egypt)
                </button>
                <button
                    onClick={() => setFilter('outbound')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                        filter === 'outbound' ? "bg-blue-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <Plane className="w-4 h-4" /> International
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{destinations.length}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Mkts</p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <Building className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{inboundCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Domestic</p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{outboundCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Overseas</p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">
                            {destinations.filter(d => d.trend === 'up').length}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Trending Up</p>
                    </div>
                </div>
            </div>

            {/* Destinations Grid */}
            {
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDestinations.map((dest, i) => {
                            // "Goo Mode" Themes - Destination Edition
                            const themes = [
                                {
                                    bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
                                    border: "border-cyan-100 hover:border-cyan-300",
                                    glow: "shadow-cyan-500/20",
                                    iconColor: "text-cyan-600",
                                    vector: <Plane className="w-64 h-64 text-cyan-500/5 -rotate-12" />
                                },
                                {
                                    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                                    border: "border-amber-100 hover:border-amber-300",
                                    glow: "shadow-amber-500/20",
                                    iconColor: "text-amber-600",
                                    vector: <MapPin className="w-64 h-64 text-amber-500/5 rotate-12" />
                                },
                                {
                                    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                                    border: "border-emerald-100 hover:border-emerald-300",
                                    glow: "shadow-emerald-500/20",
                                    iconColor: "text-emerald-600",
                                    vector: <Building className="w-64 h-64 text-emerald-500/5 -rotate-6" />
                                },
                                {
                                    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
                                    border: "border-rose-100 hover:border-rose-300",
                                    glow: "shadow-rose-500/20",
                                    iconColor: "text-rose-600",
                                    vector: <Sparkles className="w-64 h-64 text-rose-500/5 rotate-6" />
                                },
                                {
                                    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
                                    border: "border-violet-100 hover:border-violet-300",
                                    glow: "shadow-violet-500/20",
                                    iconColor: "text-violet-600",
                                    vector: <Hotel className="w-64 h-64 text-violet-500/5 -rotate-12" />
                                },
                                {
                                    bg: "bg-gradient-to-br from-indigo-50 to-slate-50",
                                    border: "border-indigo-100 hover:border-indigo-300",
                                    glow: "shadow-indigo-500/20",
                                    iconColor: "text-indigo-600",
                                    vector: <TrendingUp className="w-64 h-64 text-indigo-500/5 rotate-12" />
                                },
                            ];
                            const theme = themes[i % themes.length];

                            return (
                                <div
                                    key={dest.name}
                                    className={cn(
                                        "group relative isolate bg-white rounded-[32px] border p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden",
                                        theme.bg, theme.border, theme.glow
                                    )}
                                    onClick={() => setSelectedDestination(dest)}
                                >
                                    {/* Big Vector Background */}
                                    <div className="absolute -right-12 -bottom-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0 pointer-events-none z-0">
                                        {theme.vector}
                                    </div>

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl group-hover:scale-125 transition-transform duration-500 drop-shadow-sm filter">{getDestinationEmoji(dest.name)}</span>
                                            <div>
                                                <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">{dest.name}</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full ring-2 ring-white/50",
                                                        dest.type === 'outbound' ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                                                    )}></div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-800 transition-colors">
                                                        {dest.type === 'outbound' ? 'International' : 'Domestic'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2.5 bg-white/60 backdrop-blur-md rounded-2xl group-hover:bg-white group-hover:text-blue-600 transition-all shadow-sm">
                                            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        </div>
                                    </div>

                                    {/* Key Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                        <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 hover:bg-white transition-colors group-hover:border-white/80">
                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Low Price</p>
                                            <p className="text-xl font-black text-emerald-600 tracking-tight">
                                                {dest.minPrice ? formatPrice(dest.minPrice, 'EGP') : '-'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 hover:bg-white transition-colors group-hover:border-white/80">
                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Volume</p>
                                            <p className="text-xl font-black text-slate-900 tracking-tight">{dest.offerCount?.toLocaleString()} <span className="text-sm font-bold text-slate-400">Offers</span></p>
                                        </div>
                                    </div>

                                    {/* Top Agencies */}
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Suppliers</p>
                                            <div className="h-px flex-1 bg-slate-200/60 ml-3"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {dest.topAgencies.slice(0, 3).map((agency, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-600 rounded-xl text-xs font-bold shadow-sm group-hover:scale-105 transition-transform delay-[50ms]">
                                                    @{agency}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            }

            {
                filteredDestinations.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No destinations found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                )
            }

            {/* Destination Detail Modal */}
            {
                selectedDestination && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in-95 duration-200"
                        onClick={() => setSelectedDestination(null)}
                    >
                        <div
                            className="bg-white rounded-[32px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                {/* Header Gradient */}
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                                <div className="relative px-8 pt-12 pb-8">
                                    <button
                                        onClick={() => setSelectedDestination(null)}
                                        className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md"
                                    >
                                        ✕
                                    </button>

                                    <div className="flex items-end gap-6 mb-8">
                                        <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center text-7xl border-4 border-white">
                                            {getDestinationEmoji(selectedDestination.name)}
                                        </div>
                                        <div className="mb-2">
                                            <h2 className="text-4xl font-extrabold text-white drop-shadow-md">{selectedDestination.name}</h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/20 shadow-sm backdrop-blur-md",
                                                    selectedDestination.type === 'outbound' ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800 border-0"
                                                )}>
                                                    {selectedDestination.type === 'outbound' ? '✈️ International' : '🏛️ Domestic'}
                                                </span>
                                                <span className="text-white/80 font-medium text-sm drop-shadow-sm">{selectedDestination.offerCount} Active Offers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Starting From</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {selectedDestination.minPrice ? formatPrice(selectedDestination.minPrice, 'EGP') : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-5 h-5 text-indigo-600" />
                                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Avg Price</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {selectedDestination.avgPrice ? formatPrice(Math.round(selectedDestination.avgPrice), 'EGP') : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-5 h-5 text-orange-600" />
                                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Trend</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-2xl font-bold text-slate-900">{selectedDestination.trendPercentage}%</p>
                                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded", selectedDestination.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                                                    {selectedDestination.trend === 'up' ? 'Rising' : 'Stable'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Building className="w-5 h-5 text-slate-400" /> Top Agencies
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDestination.topAgencies.map((agency, i) => (
                                                    <a
                                                        key={i}
                                                        href={`https://instagram.com/${agency}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md text-slate-600 hover:text-blue-600 rounded-xl text-sm font-medium transition-all"
                                                    >
                                                        @{agency}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Hotel className="w-5 h-5 text-slate-400" /> Popular Hotels
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDestination.topHotels.map((hotel, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                                                        {hotel}
                                                    </span>
                                                ))}
                                                {selectedDestination.topHotels.length === 0 && <span className="text-slate-400 italic text-sm">No hotel data yet</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </main>
    );
}
