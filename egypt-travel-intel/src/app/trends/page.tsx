'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    Flame,
    MapPin,
    Hotel,
    Plane,
    Calendar,
    Users,
    DollarSign,
    ArrowUpRight,
    Sparkles,
    Activity
} from 'lucide-react';
import { cn, formatPrice, getDestinationEmoji } from '@/lib/utils';
import { StatsOverview, StatCardItem } from '@/components/StatsOverview';
// Sidebar global

interface TrendData {
    hotDestinations: Array<{
        name: string;
        type: 'inbound' | 'outbound';
        growth: number;
        offerCount: number;
    }>;
    hotOfferTypes: Array<{
        type: string;
        growth: number;
        count: number;
    }>;
    hotHotels: Array<{
        name: string;
        count: number;
        destinations: string[];
    }>;
    marketInsights: {
        totalOffers: number;
        avgPrice: number;
        outboundShare: number;
        topPriceRange: string;
    };
    weeklyActivity: Array<{
        day: string;
        offers: number;
    }>;
}

export default function TrendsPage() {
    const [trends, setTrends] = useState<TrendData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrends() {
            try {
                const res = await fetch('/api/trends');
                if (res.ok) {
                    const data = await res.json();
                    setTrends(data);
                }
            } catch (error) {
                console.error('Failed to fetch trends:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTrends();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Hot Right Now
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Market Trends</h1>
                <p className="text-slate-500 mt-2 font-medium">Deep dive into the latest Egyptian travel shifts</p>
            </div>

            {/* Global Comparison Stats */}
            {!loading && trends && (
                <StatsOverview
                    cards={[
                        {
                            title: 'Market Volume',
                            value: trends.marketInsights.totalOffers,
                            icon: TrendingUp,
                            colorClass: 'text-blue-600',
                            subValue: 'Active Listings'
                        },
                        {
                            title: 'Tracked Offers',
                            value: trends.marketInsights.totalOffers,
                            icon: Activity,
                            colorClass: 'text-emerald-500',
                            subValue: 'AI Verified'
                        },
                        {
                            title: 'Market Average',
                            value: formatPrice(Math.round(trends.marketInsights.avgPrice), 'EGP'),
                            icon: DollarSign,
                            colorClass: 'text-amber-500',
                            subValue: 'Price Index'
                        },
                        {
                            title: 'Trend Status',
                            value: 'Real-time',
                            icon: Sparkles,
                            colorClass: 'text-slate-600',
                            subValue: 'Live Feed'
                        }
                    ]}
                />
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : trends && (
                <>
                    {/* Market Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[24px] p-6 text-white shadow-lg hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><DollarSign className="w-6 h-6" /></div>
                            </div>
                            <p className="text-4xl font-extrabold">{trends.marketInsights.totalOffers}</p>
                            <p className="text-emerald-100 font-medium text-sm mt-1">Active Market Offers</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[24px] p-6 text-white shadow-lg hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><TrendingUp className="w-6 h-6" /></div>
                            </div>
                            <p className="text-4xl font-extrabold">{formatPrice(Math.round(trends.marketInsights.avgPrice), 'EGP')}</p>
                            <p className="text-amber-100 font-medium text-sm mt-1">Average Market Price</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[24px] p-6 text-white shadow-lg hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><Plane className="w-6 h-6" /></div>
                            </div>
                            <p className="text-4xl font-extrabold">{Math.round(trends.marketInsights.outboundShare * 100)}%</p>
                            <p className="text-blue-100 font-medium text-sm mt-1">International Share</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-[24px] p-6 text-white shadow-lg hover:translate-y-[-2px] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><Users className="w-6 h-6" /></div>
                            </div>
                            <p className="text-4xl font-extrabold tracking-tight">{trends.marketInsights.topPriceRange}</p>
                            <p className="text-purple-100 font-medium text-sm mt-1">Most Popular Range</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Hot Destinations */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                Trending Destinations
                            </h2>
                            <div className="space-y-4">
                                {trends.hotDestinations.slice(0, 5).map((dest, i) => (
                                    <div key={i} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-md cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl shadow-inner">
                                                {getDestinationEmoji(dest.name)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900">{dest.name}</h3>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide",
                                                        dest.type === 'outbound' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                                    )}>
                                                        {dest.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">{dest.offerCount} active offers</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "flex items-center justify-end gap-1 font-bold",
                                                dest.growth > 0 ? "text-emerald-600" : "text-slate-400"
                                            )}>
                                                {dest.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                                {dest.growth > 0 ? `+${dest.growth}%` : 'Stable'}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">Growth (7d)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Hotels & Types */}
                        <div className="space-y-6">
                            {/* Hot Hotels */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Hotel className="w-5 h-5 text-purple-500" />
                                    Top Hotels
                                </h2>
                                <div className="space-y-3">
                                    {trends.hotHotels.slice(0, 4).map((hotel, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900 text-sm">{hotel.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{hotel.destinations.join(', ')}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-white rounded-lg border border-slate-100 text-xs font-bold text-slate-600 shadow-sm">
                                                {hotel.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hot Offer Types */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    Offer Types
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {trends.hotOfferTypes.slice(0, 4).map((type, i) => (
                                        <div key={i} className="bg-white/50 rounded-2xl p-4 border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 capitalize mb-1">{type.type.replace('_', ' ')}</p>
                                            <div className="flex items-end justify-between">
                                                <span className="text-xl font-bold text-slate-900">{type.count}</span>
                                                {type.growth > 0 && (
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                        +{type.growth}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                </>
            )}
        </main>
    );
}
