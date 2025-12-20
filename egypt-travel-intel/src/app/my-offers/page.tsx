'use client';

import { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    DollarSign,
    TrendingUp,
    TrendingDown,
    MapPin,
    Check,
    X,
    AlertCircle,
    Package,
    Compass,
    Sparkles
} from 'lucide-react';
import { cn, formatPrice, getDestinationEmoji } from '@/lib/utils';
import { StatsOverview, StatCardItem } from '@/components/StatsOverview';
// Sidebar global

interface MyOffer {
    id: string;
    destination: string;
    price: number;
    duration: string;
    hotel?: string;
    boardType?: string;
    notes?: string;
}

interface MarketComparison {
    marketAvg: number;
    marketMin: number;
    marketMax: number;
    position: 'below' | 'average' | 'above';
    percentDiff: number;
    competitorCount: number;
    recommendation: string;
}

export default function MyOffersPage() {
    const [myOffers, setMyOffers] = useState<MyOffer[]>([]);
    const [comparisons, setComparisons] = useState<Record<string, MarketComparison>>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newOffer, setNewOffer] = useState<Partial<MyOffer>>({});
    const [loading, setLoading] = useState(false);

    // Load offers from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('myOffers');
        if (saved) {
            setMyOffers(JSON.parse(saved));
        }
    }, []);

    // Save offers to localStorage
    useEffect(() => {
        localStorage.setItem('myOffers', JSON.stringify(myOffers));
        if (myOffers.length > 0) {
            fetchComparisons();
        }
    }, [myOffers]);

    async function fetchComparisons() {
        setLoading(true);
        try {
            const res = await fetch('/api/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offers: myOffers }),
            });
            if (res.ok) {
                const data = await res.json();
                setComparisons(data.comparisons || {});
            }
        } catch (error) {
            console.error('Failed to fetch comparisons:', error);
        } finally {
            setLoading(false);
        }
    }

    function addOffer() {
        if (!newOffer.destination || !newOffer.price) return;
        const offer: MyOffer = {
            id: Date.now().toString(),
            destination: newOffer.destination,
            price: Number(newOffer.price),
            duration: newOffer.duration || '3N/4D',
            hotel: newOffer.hotel,
            boardType: newOffer.boardType,
            notes: newOffer.notes,
        };
        setMyOffers([...myOffers, offer]);
        setNewOffer({});
        setShowAddForm(false);
    }

    function removeOffer(id: string) {
        setMyOffers(myOffers.filter(o => o.id !== id));
    }

    const statsCards: StatCardItem[] = [
        {
            title: 'Total Packages',
            value: myOffers.length,
            icon: Package,
            colorClass: 'text-indigo-600',
            subValue: 'Active Listings'
        },
        {
            title: 'Average Price',
            value: formatPrice(myOffers.length > 0 ? myOffers.reduce((a, b) => a + b.price, 0) / myOffers.length : 0, 'EGP'),
            icon: DollarSign,
            colorClass: 'text-amber-600',
            subValue: 'Portfolio Average'
        },
        {
            title: 'Portfolio Status',
            value: 'Local',
            icon: Sparkles,
            colorClass: 'text-emerald-600',
            subValue: 'Synced'
        }
    ];

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-xs uppercase tracking-wide">Benchmarking</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Packages</h1>
                    <p className="text-slate-500 mt-2 font-medium">Analyze your pricing against market averages</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 transition-colors hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Package
                </button>
            </div>

            {/* Portfolio Stats */}
            <StatsOverview cards={statsCards} />

            {/* Add Form Modal (Glass) */}
            {showAddForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl border border-white/20 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <span className="p-2 bg-indigo-50 rounded-xl"><Package className="w-6 h-6 text-indigo-600" /></span>
                                Add Package
                            </h2>
                            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Destination *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={newOffer.destination || ''}
                                        onChange={(e) => setNewOffer({ ...newOffer, destination: e.target.value })}
                                        placeholder="Sharm El Sheikh, Dubai, etc."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Price (EGP) *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        value={newOffer.price || ''}
                                        onChange={(e) => setNewOffer({ ...newOffer, price: Number(e.target.value) })}
                                        placeholder="e.g. 15000"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Duration</label>
                                    <div className="relative">
                                        <Compass className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                        <select
                                            value={newOffer.duration || '3N/4D'}
                                            onChange={(e) => setNewOffer({ ...newOffer, duration: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none"
                                        >
                                            <option value="2N/3D">2 Nights</option>
                                            <option value="3N/4D">3 Nights</option>
                                            <option value="4N/5D">4 Nights</option>
                                            <option value="5N/6D">5 Nights</option>
                                            <option value="6N/7D">6 Nights</option>
                                            <option value="7N/8D">7 Nights</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Board Type</label>
                                    <select
                                        value={newOffer.boardType || ''}
                                        onChange={(e) => setNewOffer({ ...newOffer, boardType: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="All Inclusive">All Inclusive</option>
                                        <option value="Full Board">Full Board</option>
                                        <option value="Half Board">Half Board</option>
                                        <option value="Bed & Breakfast">Bed & Breakfast</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Hotel (optional)</label>
                                <input
                                    type="text"
                                    value={newOffer.hotel || ''}
                                    onChange={(e) => setNewOffer({ ...newOffer, hotel: e.target.value })}
                                    placeholder="Hotel name"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button
                                onClick={() => { setShowAddForm(false); setNewOffer({}); }}
                                className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addOffer}
                                disabled={!newOffer.destination || !newOffer.price}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                Add Package
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {myOffers.length === 0 && (
                <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-dashed border-slate-300 p-16 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <Package className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Build Your Inventory</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Add your travel packages to see how your pricing stacks up against real-time market data.</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 transition-all hover:-translate-y-1"
                    >
                        Create First Package
                    </button>
                </div>
            )}

            {/* Offers Grid */}
            {myOffers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myOffers.map((offer) => {
                        const comp = comparisons[offer.id];
                        return (
                            <div key={offer.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative group">
                                <button
                                    onClick={() => removeOffer(offer.id)}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                                        {getDestinationEmoji(offer.destination)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">{offer.destination}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{offer.duration}</span>
                                            {offer.hotel && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{offer.hotel}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 mb-5 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Pricing</p>
                                        <span className="text-xs font-bold text-indigo-600">{offer.boardType || 'Std. Board'}</span>
                                    </div>
                                    <p className="text-3xl font-extrabold text-slate-900">{formatPrice(offer.price, 'EGP')}</p>
                                </div>

                                {/* Comparison Logic */}
                                {comp ? (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-500 font-medium">Market Average</span>
                                                <span className="font-bold text-slate-700">{formatPrice(Math.round(comp.marketAvg), 'EGP')}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full w-1/2", comp.position === 'below' ? "bg-emerald-500" : "bg-amber-500")}
                                                    style={{ width: '50%' }} // Simplified for visual
                                                ></div>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border",
                                            comp.position === 'below' ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" :
                                                comp.position === 'above' ? "bg-amber-50/50 border-amber-100 text-amber-800" :
                                                    "bg-slate-50 border-slate-100 text-slate-600"
                                        )}>
                                            <div className={cn(
                                                "p-2 rounded-full",
                                                comp.position === 'below' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                            )}>
                                                {comp.position === 'below' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase opacity-80">Insight</p>
                                                <p className="font-bold text-sm">{Math.abs(comp.percentDiff)}% {comp.position === 'above' ? 'Higher' : 'Lower'} than avg</p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-400 text-center font-medium">
                                            Based on {comp.competitorCount} similar competitor offers
                                        </p>
                                    </div>
                                ) : loading ? (
                                    <div className="animate-pulse space-y-3">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        <div className="h-12 bg-slate-100 rounded w-full"></div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400 font-medium">Not enough market data yet</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
