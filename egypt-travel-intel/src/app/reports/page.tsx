'use client';

import { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Loader2,
    Check,
    PieChart,
    BarChart3,
    TrendingUp,
    Database,
    Building,
    Globe,
    Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Note: Sidebar is global now

interface ReportConfig {
    type: 'market_overview' | 'competitor_analysis' | 'destination_report' | 'price_comparison';
    dateRange: 'week' | 'month' | 'all';
    format: 'json' | 'csv';
    filters?: {
        destination?: string;
        agency?: string;
    };
}

const reportTypes = [
    {
        id: 'market_overview',
        name: 'Market Overview',
        description: 'Comprehensive summary of all active offers, destination popularity, and pricing trends.',
        icon: PieChart,
        color: 'emerald',
        gradient: 'from-emerald-400 to-teal-500',
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        border: 'border-emerald-100 hover:border-emerald-200',
        vector: <PieChart className="w-64 h-64 text-emerald-500/10 rotate-12" />
    },
    {
        id: 'competitor_analysis',
        name: 'Competitor Intelligence',
        description: 'Deep dive into competitor strategies, volume share, and pricing models.',
        icon: Users,
        color: 'blue',
        gradient: 'from-blue-400 to-indigo-500',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-100 hover:border-blue-200',
        vector: <Users className="w-64 h-64 text-blue-500/10 -rotate-12" />
    },
    {
        id: 'destination_report',
        name: 'Destination Breakdown',
        description: 'Detailed analysis of specific markets including hotel and board type distribution.',
        icon: MapPin,
        color: 'amber',
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        border: 'border-amber-100 hover:border-amber-200',
        vector: <MapPin className="w-64 h-64 text-amber-500/10 rotate-6" />
    },
    {
        id: 'price_comparison',
        name: 'Pricing Landscape',
        description: 'Historical price tracking and volatility analysis across all market segments.',
        icon: DollarSign,
        color: 'purple',
        gradient: 'from-purple-400 to-pink-500',
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        border: 'border-purple-100 hover:border-purple-200',
        vector: <TrendingUp className="w-64 h-64 text-purple-500/10 -rotate-6" />
    },
];

export default function ReportsPage() {
    const [generating, setGenerating] = useState<string | null>(null);
    const [completed, setCompleted] = useState<string[]>([]);

    async function generateReport(type: string) {
        setGenerating(type);

        try {
            const res = await fetch(`/api/reports?type=${type}&format=json`);
            if (res.ok) {
                const data = await res.json();

                // Download as JSON
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `egypt-travel-intel-${type}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                setCompleted([...completed, type]);
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
        } finally {
            setGenerating(null);
        }
    }

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-wide">Business Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Executive Reports</h1>
                    <p className="text-slate-500 mt-2 font-medium">Export raw data and analysis for stakeholder presentations</p>
                </div>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>

                    {/* Background Vector */}
                    <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                        <Database className="w-32 h-32 -rotate-12" />
                    </div>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">Data Points</p>
                    <p className="text-4xl font-extrabold relative z-10">1,240+</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400 relative z-10">
                        <Check className="w-3 h-3" /> Live Verified
                    </div>
                </div>
                <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                    {/* Background Vector */}
                    <div className="absolute -right-6 -bottom-6 text-slate-100 group-hover:text-slate-200/50 transition-colors pointer-events-none">
                        <Building className="w-32 h-32 rotate-12" />
                    </div>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">Active Agencies</p>
                    <p className="text-4xl font-extrabold text-slate-900 relative z-10">14</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 relative z-10">
                        <Users className="w-3 h-3" /> Market Wide
                    </div>
                </div>
                <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                    {/* Background Vector */}
                    <div className="absolute -right-6 -bottom-6 text-slate-100 group-hover:text-slate-200/50 transition-colors pointer-events-none">
                        <Globe className="w-32 h-32 -rotate-6" />
                    </div>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">Destinations</p>
                    <p className="text-4xl font-extrabold text-slate-900 relative z-10">28</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 relative z-10">
                        <MapPin className="w-3 h-3" /> Global Coverage
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden group">
                    {/* Background Vector */}
                    <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                        <Timer className="w-32 h-32 rotate-12" />
                    </div>

                    <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2 relative z-10">Refresh Rate</p>
                    <p className="text-4xl font-extrabold relative z-10">4hr</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/80 relative z-10">
                        <Loader2 className="w-3 h-3 animate-spin" /> Auto-syncing
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reportTypes.map((report) => (
                    <div
                        key={report.id}
                        className={cn(
                            "group relative overflow-hidden rounded-[32px] p-8 border shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300",
                            report.bg,
                            report.border
                        )}
                    >
                        {/* Big Vector Background */}
                        <div className="absolute -right-8 -bottom-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0 pointer-events-none z-0">
                            {report.vector}
                        </div>

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", report.gradient)}>
                                <report.icon className="w-7 h-7" />
                            </div>
                            <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-bold text-slate-400 uppercase border border-white/50">
                                JSON / CSV
                            </span>
                        </div>

                        <div className="relative z-10 mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors">{report.name}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium max-w-md">{report.description}</p>
                        </div>

                        <div className="relative z-10">
                            <button
                                onClick={() => generateReport(report.id)}
                                disabled={generating === report.id}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg",
                                    completed.includes(report.id)
                                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                        : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800 hover:shadow-slate-900/20"
                                )}
                            >
                                {generating === report.id ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Report...
                                    </>
                                ) : completed.includes(report.id) ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Download Complete
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Generate Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">
                    Need a custom report? <a href="mailto:mohamedbhidy@gmail.com" className="text-indigo-600 font-bold hover:underline">Contact Data Team</a>
                </p>
            </div>
        </main>
    );
}
