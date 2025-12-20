'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    MapPin,
    TrendingUp,

    FileText,
    Package,
    Settings,
    Bell,
    BarChart3,
    Search,
    LogOut,
    Globe,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Competitors', href: '/competitors', icon: Users },
    { name: 'Destinations', href: '/destinations', icon: MapPin },

    { name: 'Market Trends', href: '/trends', icon: TrendingUp },
    { name: 'My Offers', href: '/my-offers', icon: Package },
];

const secondaryNav = [
    { name: 'System Monitor', href: '/monitor', icon: BarChart3 },
    { name: 'Performance Reports', href: '/reports', icon: FileText },
    { name: 'Account Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    collapsed?: boolean;
    setCollapsed?: (val: boolean) => void;
}

export default function Sidebar({ collapsed = false, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Load avatar from localStorage
    useEffect(() => {
        const savedAvatar = localStorage.getItem('user_avatar');
        if (savedAvatar) {
            setAvatarUrl(savedAvatar);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-50 h-screen backdrop-blur-3xl bg-slate-900/95 border-r border-white/10 text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out",
            collapsed ? "w-20" : "w-72"
        )}>
            {/* Logo Area */}
            <div className={cn(
                "h-20 flex items-center border-b border-white/5 bg-slate-900/50 transition-all duration-300",
                collapsed ? "justify-center px-0" : "px-6 justify-between"
            )}>
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl overflow-hidden ring-1 ring-white/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
                                <Globe className="w-6 h-6 text-indigo-400 z-10" />
                            </div>
                        </div>
                        <div className="whitespace-nowrap">
                            <h1 className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ATLAS</h1>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Intel Suite</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed?.(!collapsed)}
                    className={cn(
                        "rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center",
                        collapsed ? "w-12 h-12" : "p-1.5"
                    )}
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {collapsed ? (
                        <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl ring-1 ring-white/10 group">
                            <Globe className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full border border-white/10 p-0.5">
                                <PanelLeftOpen className="w-3 h-3 text-emerald-400" />
                            </div>
                        </div>
                    ) : (
                        <PanelLeftClose className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Platform Navigation */}
            <div className={cn("flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar transition-all font-medium", collapsed ? "px-2" : "px-4")}>

                {/* Main Section */}
                <div>
                    {!collapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 whitespace-nowrap overflow-hidden">Intelligence Platform</h3>}
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200 relative",
                                        collapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "px-3",
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                            : "text-white hover:bg-white/5 hover:text-white",
                                        isActive && !collapsed && "translate-x-1",
                                        !isActive && !collapsed && "hover:translate-x-1"
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-white" : "text-white group-hover:text-indigo-400")} />
                                    {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                    {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                                    {isActive && collapsed && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400 border-2 border-slate-900"></div>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Secondary Section */}
                <div>
                    {!collapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 whitespace-nowrap overflow-hidden">Management</h3>}
                    <nav className="space-y-1">
                        {secondaryNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200 relative",
                                        collapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "px-3",
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                                            : "text-white hover:bg-white/5 hover:text-white",
                                        isActive && !collapsed && "translate-x-1",
                                        !isActive && !collapsed && "hover:translate-x-1"
                                    )}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-white" : "text-white group-hover:text-blue-400")} />
                                    {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* User Profile / Footer */}
            <div className={cn("border-t border-white/5 bg-slate-900/50 transition-all", collapsed ? "p-2" : "p-4")}>
                <Link
                    href="/settings"
                    className={cn(
                        "block bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer",
                        collapsed ? "p-1.5" : "p-4"
                    )}
                >
                    <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                        {/* Profile Picture */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner border-2 border-white/20 shrink-0 group-hover:border-indigo-400/50 transition-colors">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>MB</span>
                            )}
                        </div>
                        {!collapsed && (
                            <>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">Bhidy</p>
                                    <p className="text-xs text-slate-500 truncate">mohamedbhidy@gmail.com</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLogout();
                                    }}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                                </button>
                            </>
                        )}
                    </div>

                    {!collapsed && (
                        /* Live Indicator */
                        <div className="mt-3 flex items-center gap-2 px-1">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                            </div>
                            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">System Live</span>
                        </div>
                    )}
                </Link>
            </div>
        </aside>
    );
}
