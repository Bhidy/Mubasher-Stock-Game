'use client';

import { useEffect, useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertCircle,
    Bell,
    Calendar,
    MapPin,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { cn, formatPrice, getDestinationEmoji } from '@/lib/utils';
// Sidebar global

interface PriceData {
    destination: string;
    type: 'inbound' | 'outbound';
    currentAvg: number;
    previousAvg: number;
    change: number;
    changePercent: number;
    minPrice: number;
    maxPrice: number;
    offerCount: number;
    priceHistory: Array<{ date: string; price: number }>;
}

interface PriceAlert {
    id: string;
    destination: string;
    type: 'drop' | 'increase';
    percentage: number;
    agency: string;
    price: number;
    timestamp: string;
}

export default function PricesPage() {
    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'change' | 'price' | 'offers'>('change');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchPrices() {
            try {
                const res = await fetch('/api/prices');
                if (res.ok) {
                    const data = await res.json();
                    setPriceData(data.prices || []);
                    setAlerts(data.alerts || []);
                }
            } catch (error) {
                console.error('Failed to fetch prices:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPrices();
    }, []);

    const filteredData = priceData.filter(item =>
        item.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'change') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
        if (sortBy === 'price') return (b.currentAvg || 0) - (a.currentAvg || 0);
        return b.offerCount - a.offerCount;
    });

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold text-xs uppercase tracking-wide">Market Monitor</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Price Tracker</h1>
                    <p className="text-slate-500 mt-2 font-medium">Live pricing analysis across {priceData.length} destinations</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-64 shadow-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Alerts Section (Glassmorphism) */}
            {alerts.length > 0 && (
                <div className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <Bell className="w-5 h-5 text-amber-400" />
                            </div>
                            Recent Price Movements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {alerts.slice(0, 3).map((alert) => (
                                <div
                                    key={alert.id}
                                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">{getDestinationEmoji(alert.destination)}</span>
                                            <span className="font-bold">{alert.destination}</span>
                                        </div>
                                        <p className="text-xs text-slate-300">@{alert.agency}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg mb-1",
                                            alert.type === 'drop' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                        )}>
                                            {alert.type === 'drop' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                            {alert.percentage}%
                                        </div>
                                        <p className="text-lg font-bold">{formatPrice(alert.price, 'EGP')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl w-fit border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide px-3">Sort By</span>
                {[
                    { value: 'change', label: 'Volatility' },
                    { value: 'price', label: 'Price' },
                    { value: 'offers', label: 'Volume' },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            sortBy === option.value
                                ? "bg-white text-slate-900 shadow-md"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Price Table Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-100/50">
                            <tr>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Price</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Change (7d)</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Range (Min-Max)</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Volume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-100 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-12 bg-slate-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : (
                                sortedData.map((item) => (
                                    <tr key={item.destination} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                                                    {getDestinationEmoji(item.destination)}
                                                </div>
                                                <span className="font-bold text-slate-900">{item.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border",
                                                item.type === 'outbound' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                            )}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-lg">
                                                {item.currentAvg ? formatPrice(Math.round(item.currentAvg), 'EGP') : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.changePercent !== 0 ? (
                                                <div className={cn(
                                                    "flex items-center gap-1.5 font-bold text-sm",
                                                    item.changePercent < 0 ? "text-emerald-600" : "text-red-500"
                                                )}>
                                                    {item.changePercent < 0 ?
                                                        <TrendingDown className="w-4 h-4" /> :
                                                        <TrendingUp className="w-4 h-4" />
                                                    }
                                                    {Math.abs(item.changePercent)}%
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 font-medium text-sm">Stable</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    {item.minPrice ? formatPrice(item.minPrice, 'EGP').replace('EGP ', '') : '-'}
                                                </span>
                                                <span className="text-slate-300">→</span>
                                                <span className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                    {item.maxPrice ? formatPrice(item.maxPrice, 'EGP').replace('EGP ', '') : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full font-bold text-slate-600 text-sm">
                                                <ArrowUpRight className="w-3 h-3 text-slate-400" /> {item.offerCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
