'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  RefreshCw, Settings, ExternalLink, TrendingUp, Users, Package, Clock,
  Filter, ChevronDown, Search, ArrowUpRight, ArrowDownRight, Activity, MapPin, Sparkles, X,
  PieChart as LucidePieChart, BarChart3, LayoutGrid, LayoutList, Plane, Hotel, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import { formatRelativeTime, formatPrice, getOfferTypeIcon, getDestinationEmoji, cn } from '@/lib/utils';
import { PostImage } from '@/components/PostImage';
import { StatsOverview, StatCardItem } from '@/components/StatsOverview';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces ---

interface Offer {
  id: string;
  agency: string;
  destination: string | null;
  destinationType: string | null;
  offerType: string | null;
  price: number | null;
  currency: string | null;
  duration: string | null;
  hotel: string | null;
  starRating: string | null;
  boardType: string | null;
  bookingContact: string | null;
  confidence: number;
  keywords: string[];
  postUrl: string;
  postDate: string | null;
  thumbnail: string | null;
  likes: number | null;
  comments: number | null;
  caption: string | null;
  createdAt: string;
}

interface Stats {
  overview: {
    totalPosts: number;
    totalOffers: number;
    activeAccounts: number;
    lastSync: string | null;
    lastSyncStatus: string | null;
    recentPostsWeek: number;
    recentOffersWeek: number;
  };
  destinations: Array<{ name: string; count: number }>;
  offerTypes: Array<{ type: string; count: number }>;
  agencies: Array<{ handle: string; postsCount: number; likes?: number; comments?: number }>;
  pricing: {
    avgPrice: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    offersWithPrice: number;
    currency: string;
  };
  recentLogs: Array<{
    id: string;
    runAt: string;
    status: string;
    postsCollected: number;
    offersDetected: number;
    duration: number;
    errorsCount: number;
  }>;
}

interface Filters {
  agency: string;
  destination: string;
  offerType: string;
  period: string;
  hasPrice: boolean;
  hasContact: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// --- Main Component ---

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    agency: '',
    destination: '',
    offerType: '',
    period: 'all',
    hasPrice: false,
    hasContact: false,
    sortBy: 'confidence', // Smart Default
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedPost, setSelectedPost] = useState<Offer | null>(null);

  // Destination chart toggle: 'international' (outbound) or 'domestic' (inbound)
  const [destChartType, setDestChartType] = useState<'international' | 'domestic'>('international');

  // Egyptian domestic destinations list
  const DOMESTIC_DESTINATIONS = [
    'Sharm El Sheikh', 'Hurghada', 'Dahab', 'Ain Sokhna', 'Aswan', 'Luxor',
    'Siwa', 'Cairo', 'Alexandria', 'Marsa Alam', 'El Gouna', 'Ras Sudr',
    'Nuweiba', 'Taba', 'Fayoum', 'Nile Cruise'
  ];

  // Filter destinations based on toggle
  const filteredDestinations = stats?.destinations.filter(d => {
    const isDomestic = DOMESTIC_DESTINATIONS.some(dom =>
      d.name.toLowerCase().includes(dom.toLowerCase())
    );
    return destChartType === 'domestic' ? isDomestic : !isDomestic;
  }).slice(0, 5) || [];

  // --- Period Filter Logic ---
  const getStartDate = (period: string): string | undefined => {
    const now = new Date();
    // Reset time portion to ensure full days are covered if needed, 
    // but typically we want "Last 24h", "Last 7 days" relative to current moment.

    switch (period) {
      case '1D': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '1W': return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '1M': return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case '3M': return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case '6M': return new Date(now.setMonth(now.getMonth() - 6)).toISOString();
      case '1Y': return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default: return undefined;
    }
  };

  const handlePeriodChange = (p: string) => {
    if (filters.period === p) return;
    setIsUpdating(true); // Trigger loading state
    setFilters(prev => ({ ...prev, period: p }));
  };

  const handleDestinationClick = (destName: string) => {
    setIsUpdating(true);
    setFilters(prev => ({ ...prev, destination: destName === filters.destination ? '' : destName }));
  };

  // --- Sorting Handler ---
  const handleSort = (field: string) => {
    setIsUpdating(true); // Trigger loading state immediately to prevent UI jitter
    setFilters(prev => {
      // If clicking same field, toggle order
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' };
      }
      // If new field, set to 'desc' (high to low) by default for numbers, or 'asc' for text
      const defaultOrder = ['price', 'confidence', 'engagement', 'createdAt'].includes(field) ? 'desc' : 'asc';
      return { ...prev, sortBy: field, sortOrder: defaultOrder };
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const dateFrom = getStartDate(filters.period);
      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);

      // Fetch Stats with Date Filter
      const statsRes = await fetch(`/api/stats?${queryParams.toString()}`);

      // Fetch Offers with Date Filter & Other Filters
      const offersParams = new URLSearchParams({
        ...(filters.agency && { agency: filters.agency }),
        ...(filters.destination && { destination: filters.destination }),
        ...(filters.offerType && { offerType: filters.offerType }),
        ...(filters.hasPrice && { hasPrice: 'true' }),
        ...(filters.hasContact && { hasContact: 'true' }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: '100',
      });
      if (dateFrom) offersParams.append('dateFrom', dateFrom);

      const offersRes = await fetch(`/api/offers?${offersParams.toString()}`);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(offersData.offers || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsUpdating(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTriggerIngestion = async () => {
    if (!confirm('Start a new data ingestion run?')) return;
    setRefreshing(true);
    await fetch('/api/ingest', { method: 'POST' });
    setTimeout(() => {
      handleRefresh();
      alert('Ingestion started. Data will update shortly.');
    }, 2000);
  };

  // ============================================================================
  // 🔥 GOO MODE: Advanced Filtering & Sorting System
  // ============================================================================
  const filteredOffers = offers
    .filter(offer => {
      // 1. Search Query - searches multiple fields
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const searchableText = [
          offer.agency,
          offer.destination,
          offer.hotel,
          offer.caption,
          offer.offerType,
          offer.duration,
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchableText.includes(query)) return false;
      }

      // 2. Destination Filter
      if (filters.destination && offer.destination !== filters.destination) {
        return false;
      }

      // 3. Offer Type Filter
      if (filters.offerType && offer.offerType !== filters.offerType) {
        return false;
      }

      // 4. Agency Filter
      if (filters.agency && offer.agency !== filters.agency) {
        return false;
      }

      // 5. Has Price Filter (Quick Filter)
      if (filters.hasPrice && !offer.price) {
        return false;
      }

      // 6. Has Contact Filter (Quick Filter)
      if (filters.hasContact && !offer.bookingContact) {
        return false;
      }

      return true;
    });
  // NOTE: Sorting removes client-side sorting as server handles it.
  // This prevents the "jump" effect where old data is re-sorted before new data arrives.

  // --- Render Helpers ---

  const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'All'];

  // Define Dashboard Stats for new generic component
  const dashboardCards: StatCardItem[] = [
    {
      title: "Total Posts",
      value: stats?.overview.totalPosts || 0,
      icon: Package,
      colorClass: "text-blue-600",
      subValue: `${stats?.overview.recentPostsWeek || 0} recent uploads`
    },
    {
      title: "Offers",
      value: stats?.overview.totalOffers || 0,
      icon: Sparkles,
      colorClass: "text-emerald-500",
      subValue: "Detected with AI"
    },
    {
      title: "Avg. Price",
      value: stats?.pricing.avgPrice ? formatPrice(stats.pricing.avgPrice, 'EGP') : 'N/A',
      icon: TrendingUp,
      colorClass: "text-amber-500",
      subValue: "Market Average"
    },
    {
      title: "Last Sync",
      value: stats?.overview.lastSync ? formatRelativeTime(stats.overview.lastSync) : 'Never',
      icon: Clock,
      colorClass: "text-slate-600",
      subValue: stats?.overview.lastSync ? 'System Healthy' : 'Pending'
    }
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center animate-spin">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing Ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* --- Preview Modal --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedPost(null)}>
          <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/20 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-all scale-100 ring-1 ring-black/5" onClick={e => e.stopPropagation()}>
            {/* Image Side */}
            <div className="w-full md:w-[45%] bg-slate-100 flex items-center justify-center relative group overflow-hidden">
              <PostImage src={selectedPost.thumbnail} alt="Post" />

              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="badge bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-sm px-3 py-1.5 mb-2">
                  {selectedPost.offerType ? selectedPost.offerType.replace('_', ' ') : 'General Offer'}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-[55%] flex flex-col h-full bg-white relative">
              <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 z-10">
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 border-b border-slate-100 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-0.5 shadow-lg shadow-slate-900/10">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl font-bold text-slate-800">
                    {selectedPost.agency.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-900 tracking-tight">@{selectedPost.agency}</h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Posted {formatRelativeTime(selectedPost.postDate || selectedPost.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                {/* Intelligence Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">AI Confidence</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-emerald-700">{Math.round((selectedPost.confidence || 0) * 100)}<span className="text-2xl">%</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedPost.confidence || 0) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Engagement</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-2xl font-bold text-indigo-900">{selectedPost.likes || 0}</span>
                        <span className="text-xs text-indigo-400 block font-medium">Likes</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-indigo-900">{selectedPost.comments || 0}</span>
                        <span className="text-xs text-indigo-400 block font-medium">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Block */}
                {selectedPost.price && (
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-slate-900/20">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Detected Price</p>
                      <div className="text-2xl font-bold text-emerald-400">
                        {formatPrice(selectedPost.price, selectedPost.currency)}
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Offer Details</h4>
                  <div
                    dir="auto"
                    className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-[320px] overflow-y-auto pr-3 custom-scrollbar"
                    style={{
                      unicodeBidi: 'plaintext',
                      textAlign: 'start'
                    }}
                  >
                    {selectedPost.caption}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {selectedPost.destination || 'Egypt'}
                  </span>
                </div>
                <a
                  href={selectedPost.postUrl}
                  target="_blank"
                  className="btn border-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 font-bold"
                >
                  View on Instagram <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Header Area --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          {/* Dynamic Greeting */}
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 tracking-tight">
              Market Intelligence
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              {loading || isUpdating ? (
                <span className="flex items-center gap-1.5 text-indigo-600"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Live Updating...</span>
              ) : (
                <span>Real-time analysis of {stats?.overview.activeAccounts || 0} active agencies</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-stretch gap-3">
          {/* Glassy Period Selector */}
          <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm flex items-center">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p === 'All' ? 'all' : p)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 relative",
                  (filters.period === p || (filters.period === 'all' && p === 'All'))
                    ? "text-slate-900 shadow-sm bg-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                {p}
                {(filters.period === p || (filters.period === 'all' && p === 'All')) && (
                  <span className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-xl pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTriggerIngestion}
              className="flex flex-col items-center justify-center px-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white hover:shadow-md transition-all group"
            >
              <ArrowDownRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <button
              onClick={handleRefresh}
              className={cn(
                "flex flex-col items-center justify-center px-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white hover:shadow-md transition-all group",
                refreshing && "cursor-wait"
              )}
            >
              <RefreshCw className={cn("w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors", refreshing && "animate-spin text-indigo-500")} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Filter Feedback Overlay --- */}
      {isUpdating && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="w-4 h-4 border-2 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-sm font-bold tracking-wide">Updating Intelligence...</span>
          </div>
        </div>
      )}

      {/* --- Stats Overview --- */}
      <StatsOverview cards={dashboardCards} />

      {/* --- Detailed Sections Grid (Top Row) --- */}
      {/* --- Charts Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]"
      >

        {/* 1. Top Destinations (Pie Chart with Toggle) */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-4 z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Destination Trends</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Market Share</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Domestic/International Toggle */}
              <div className="flex items-center bg-slate-100 rounded-full p-0.5">
                <button
                  onClick={() => setDestChartType('domestic')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full transition-all",
                    destChartType === 'domestic'
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Domestic
                </button>
                <button
                  onClick={() => setDestChartType('international')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full transition-all",
                    destChartType === 'international'
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  International
                </button>
              </div>
              <a href="/destinations" className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            {filteredDestinations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
                            <p className="font-bold mb-1">{payload[0].name}</p>
                            <p className="font-medium text-emerald-400">{payload[0].value} Offers</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={filteredDestinations}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    cornerRadius={8}
                    stroke="none"
                  >
                    {filteredDestinations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={destChartType === 'domestic'
                        ? ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]
                        : ['#6366F1', '#EC4899', '#F59E0B', '#14B8A6', '#8B5CF6'][index % 5]
                      } />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wide ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                No {destChartType} destinations found
              </div>
            )}
          </div>
        </div>

        {/* 2. Agency Activity (Bar Chart) */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-4 z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Top Publishers</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Post Volume</p>
            </div>
            <a href="/competitors" className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.agencies.slice(0, 7)} layout="vertical" margin={{ left: 0, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="handle" type="category" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} tickFormatter={(val) => `@${val.substring(0, 8)}..`} />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
                          <p className="font-bold mb-1">@{payload[0].payload.handle}</p>
                          <p className="font-medium text-indigo-400">{Number(payload[0].value).toLocaleString()} Posts</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="postsCount" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={16}>
                  <LabelList dataKey="postsCount" position="right" fontSize={10} fontWeight="bold" fill="#6366F1" formatter={(val: any) => Number(val).toLocaleString()} />
                  {stats?.agencies.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366F1', '#8B5CF6', '#EC4899', '#D946EF', '#A855F7'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Agency Engagement (Bar Chart) - REPLACING Offer Types */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-sm p-6 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-center mb-4 z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Highest Engagement</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Most Loved Sources</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-full">
              <Activity className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...(stats?.agencies || [])].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 7)} margin={{ top: 20 }}>
                <defs>
                  <linearGradient id="fireGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="handle" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} tickFormatter={(val) => val.substring(0, 4)} />
                <Tooltip
                  cursor={{ fill: '#FFF1F2' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
                          <p className="font-bold mb-1">@{payload[0].payload.handle}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-rose-400">{Number(payload[0].value).toLocaleString()} Likes</span>
                            <span className="text-slate-400">|</span>
                            <span className="font-medium text-blue-400">{Number(payload[0].payload.comments).toLocaleString()} Comments</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="likes" fill="url(#fireGradient)" radius={[6, 6, 0, 0]} barSize={24}>
                  <LabelList dataKey="likes" position="top" fontSize={10} fontWeight="bold" fill="#F43F5E" formatter={(val: any) => Number(val).toLocaleString()} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </motion.div>

      {/* --- Intelligence Table / Grid --- */}
      <div id="data-section" className={cn(
        "bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-slate-200/40 flex flex-col relative mt-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50",
        viewMode === 'table' ? "h-[800px] overflow-hidden" : "min-h-[800px] bg-transparent border-0 shadow-none hover:shadow-none"
      )}>

        {/* Enhanced Filter Bar (Goo Style) */}
        <div className={cn(
          "p-5 border-b border-slate-100/50 flex flex-col gap-4 z-20 transition-all",
          viewMode === 'table' ? "bg-white/50" : "bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg mb-6"
        )}>

          {/* Top Row: Title & Search */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isUpdating ? <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50"></div> : <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>}
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Latest Intelligence</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-4">Real-time market feed • {filteredOffers.length} results</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <div className="relative group w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 w-full text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: All Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Destination Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-600 shadow-sm transition-all cursor-pointer"
                value={filters.destination}
                onChange={e => setFilters({ ...filters, destination: e.target.value })}
              >
                <option value="">🌍 All Destinations</option>
                {stats?.destinations.map(d => <option key={d.name} value={d.name}>{getDestinationEmoji(d.name)} {d.name}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Offer Type Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-600 shadow-sm transition-all cursor-pointer"
                value={filters.offerType}
                onChange={e => setFilters({ ...filters, offerType: e.target.value })}
              >
                <option value="">📦 All Types</option>
                {stats?.offerTypes.map(t => <option key={t.type} value={t.type}>{getOfferTypeIcon(t.type)} {t.type.replace('_', ' ')}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Agency Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-600 shadow-sm transition-all cursor-pointer"
                value={filters.agency}
                onChange={e => setFilters({ ...filters, agency: e.target.value })}
              >
                <option value="">🏢 All Agencies</option>
                {stats?.agencies.map(a => <option key={a.handle} value={a.handle}>@{a.handle}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* Sort By */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 focus:outline-none focus:border-indigo-500 text-slate-600 shadow-sm transition-all cursor-pointer"
                value={filters.sortBy}
                onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}
              >
                <option value="createdAt">📅 Newest First</option>
                <option value="price">💰 Price (Low to High)</option>
                <option value="confidence">🤖 AI Confidence</option>
                <option value="engagement">🔥 Engagement</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* 🔥 GOO MODE: Quick Filter Chips */}
            <button
              onClick={() => setFilters(f => ({ ...f, hasPrice: !f.hasPrice }))}
              className={cn(
                "px-3 h-9 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5",
                filters.hasPrice
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              💰 With Price
              {filters.hasPrice && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>

            <button
              onClick={() => setFilters(f => ({ ...f, hasContact: !f.hasContact }))}
              className={cn(
                "px-3 h-9 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5",
                filters.hasContact
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              📞 With Contact
              {filters.hasContact && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
            </button>

            {/* Clear Filters Button */}
            {(filters.destination || filters.offerType || filters.agency || filters.hasPrice || filters.hasContact || searchQuery) && (
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    destination: '',
                    offerType: '',
                    agency: '',
                    hasPrice: false,
                    hasContact: false,
                    sortBy: 'createdAt'
                  }));
                  setSearchQuery('');
                }}
                className="ml-auto btn btn-sm h-9 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 border-none rounded-xl text-xs font-bold transition-colors flex items-center gap-1 pl-2 pr-3"
              >
                <X className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        {viewMode === 'table' && (
          <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] sticky top-0 z-10 backdrop-blur-md shadow-sm h-12">
                <tr>
                  <th className="px-6 py-3 w-[15%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('offerType')}>
                    Source {filters.sortBy === 'offerType' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[10%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('createdAt')}>
                    Published {filters.sortBy === 'createdAt' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[15%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('hotel')}>
                    Hotel {filters.sortBy === 'hotel' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[12%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('destination')}>
                    Dest. {filters.sortBy === 'destination' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[8%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('duration')}>
                    Dur. {filters.sortBy === 'duration' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[8%]">Flight</th>
                  <th className="px-4 py-3 w-[10%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('price')}>
                    Price {filters.sortBy === 'price' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[10%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('confidence')}>
                    Conf. {filters.sortBy === 'confidence' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[8%] text-center cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('engagement')}>
                    Eng. {filters.sortBy === 'engagement' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 w-[4%]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, index) => (
                  <tr
                    key={offer.id}
                    className={cn(
                      "group transition-all duration-200 cursor-pointer border-b border-slate-100",
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                      "hover:bg-indigo-50/60 hover:shadow-sm hover:z-10 relative"
                    )}
                    onClick={() => setSelectedPost(offer)}
                  >

                    {/* Source */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110",
                          "bg-white"
                        )}>
                          {getOfferTypeIcon(offer.offerType)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-xs capitalize truncate flex items-center gap-1.5">
                            {offer.offerType?.replace('_', ' ') || 'General'}
                            {offer.offerType === 'flight' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                            {offer.offerType === 'hotel' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            {offer.offerType === 'package' && <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>}
                          </div>
                          <div className="text-[10px] text-indigo-500 font-medium truncate opacity-80 group-hover:opacity-100">@{offer.agency}</div>
                        </div>
                      </div>
                    </td>

                    {/* Published */}
                    <td className="px-4 py-5">
                      <span className="font-bold text-slate-600 text-[11px] whitespace-nowrap bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-100">
                        {formatRelativeTime(offer.postDate || offer.createdAt)}
                      </span>
                    </td>

                    {/* Hotel */}
                    <td className="px-4 py-5">
                      {offer.hotel ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs shrink-0 opacity-60">🏨</span>
                          <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]" title={offer.hotel}>{offer.hotel}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Not specified</span>
                      )}
                    </td>

                    {/* Destination */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0 drop-shadow-sm">{getDestinationEmoji(offer.destination)}</span>
                        <span className="text-xs font-bold text-slate-700 truncate" title={offer.destination || 'Unspecified'}>{offer.destination || 'Unspecified'}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-5">
                      {offer.duration ? (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold whitespace-nowrap border border-slate-200">
                          {offer.duration}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300">-</span>
                      )}
                    </td>

                    {/* Flight */}
                    <td className="px-4 py-5">
                      {(offer as any).flightIncluded || offer.offerType === 'flight' ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-extrabold border border-blue-100 uppercase tracking-wide flex items-center gap-1 w-fit shadow-sm">
                          <span className="w-1 h-1 rounded-full bg-blue-500"></span> YES
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 pl-1">No</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-5">
                      {offer.price ? (
                        <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block whitespace-nowrap shadow-sm">
                          {formatPrice(offer.price, offer.currency)}
                        </span>
                      ) : <span className="text-[10px] text-slate-300">-</span>}
                    </td>

                    {/* Confidence */}
                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-1 w-20">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                          <span>AI</span>
                          <span className={(offer.confidence || 0) > 0.8 ? "text-emerald-600" : "text-amber-600"}>{Math.round((offer.confidence || 0) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", (offer.confidence || 0) > 0.7 ? "bg-emerald-500" : "bg-amber-500")}
                            style={{ width: `${(offer.confidence || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Engagement */}
                    <td className="px-4 py-5 text-center">
                      <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600 bg-white rounded-lg py-1 px-2 border border-slate-200 hover:border-blue-200 transition-colors">
                        <Users className="w-3 h-3 text-blue-400" /> {offer.likes || 0}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-right">
                      <span className="p-2 bg-white rounded-full text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all inline-block shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid Content */}
        {viewMode === 'grid' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
              {filteredOffers.map((offer) => {
                const getTheme = (type: string | undefined | null) => {
                  switch (type) {
                    case 'flight': return {
                      bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
                      border: "border-cyan-100 hover:border-cyan-300",
                      glow: "shadow-cyan-500/20",
                      iconColor: "text-cyan-600",
                      vector: <Plane className="w-64 h-64 text-cyan-500/10 -rotate-12" />
                    };
                    case 'hotel': return {
                      bg: "bg-gradient-to-br from-rose-50 to-pink-50",
                      border: "border-rose-100 hover:border-rose-300",
                      glow: "shadow-rose-500/20",
                      iconColor: "text-rose-600",
                      vector: <Hotel className="w-64 h-64 text-rose-500/10 rotate-6" />
                    };
                    case 'package': return {
                      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                      border: "border-emerald-100 hover:border-emerald-300",
                      glow: "shadow-emerald-500/20",
                      iconColor: "text-emerald-600",
                      vector: <Package className="w-64 h-64 text-emerald-500/10 -rotate-6" />
                    };
                    default: return {
                      bg: "bg-gradient-to-br from-indigo-50 to-violet-50",
                      border: "border-indigo-100 hover:border-indigo-300",
                      glow: "shadow-indigo-500/20",
                      iconColor: "text-indigo-600",
                      vector: <Sparkles className="w-64 h-64 text-indigo-500/10 rotate-12" />
                    };
                  }
                };

                const theme = getTheme(offer.offerType);

                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedPost(offer)}
                    className={cn(
                      "group relative isolate rounded-[32px] border p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between h-[340px]",
                      theme.bg, theme.border, theme.glow
                    )}
                  >
                    {/* Big Vector Background */}
                    <div className="absolute -right-12 -bottom-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0 pointer-events-none z-0">
                      {theme.vector}
                    </div>

                    {/* Flex Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl shadow-sm border border-white/50 flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 backdrop-blur-sm",
                          "bg-white/80"
                        )}>
                          {getOfferTypeIcon(offer.offerType)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-slate-900 text-sm truncate max-w-[100px] block">@{offer.agency}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                          </div>
                          <div className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 text-slate-500 font-bold w-fit backdrop-blur-sm border border-white/20">
                            {formatRelativeTime(offer.postDate || offer.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 mb-2 relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{getDestinationEmoji(offer.destination)}</span>
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900 leading-tight line-clamp-1 group-hover:text-indigo-900 transition-colors" title={offer.destination || undefined}>{offer.destination || 'Global'}</h3>
                          <p className={cn("text-xs font-bold capitalize", theme.iconColor)}>{(offer.offerType || 'general').replace('_', ' ')}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        {offer.hotel && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/60 p-2.5 rounded-xl border border-white/40 backdrop-blur-sm">
                            <span>🏨</span>
                            <span className="truncate line-clamp-1" title={offer.hotel}>{offer.hotel}</span>
                          </div>
                        )}
                        {!offer.hotel && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/30 p-2.5 rounded-xl border border-white/20 border-dashed">
                            <span>🏨</span>
                            <span className="italic">Not specified</span>
                          </div>
                        )}

                        {offer.duration && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 px-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{offer.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Price</p>
                        <div className="text-xl font-black text-slate-900 tracking-tight">
                          {offer.price ? formatPrice(offer.price, offer.currency) : <span className="text-slate-300">-</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={cn("text-xs font-black", (offer.confidence || 0) > 0.8 ? "text-emerald-600" : "text-amber-600")}>
                            {Math.round((offer.confidence || 0) * 100)}%
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">AI Score</div>
                        </div>
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform bg-slate-900")}>
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
