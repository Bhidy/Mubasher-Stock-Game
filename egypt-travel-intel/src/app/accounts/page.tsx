'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
// Note: Sidebar is global

interface Account {
    id: string;
    handle: string;
    displayName: string | null;
    profileUrl: string | null;
    isActive: boolean;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [newHandle, setNewHandle] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [adding, setAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            if (res.ok) {
                const data = await res.json();
                setAccounts(data.accounts || []);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
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
                setShowAddForm(false);
                fetchAccounts();
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

    const handleToggleActive = async (account: Account) => {
        try {
            const res = await fetch('/api/accounts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: account.id,
                    isActive: !account.isActive,
                }),
            });

            if (res.ok) {
                fetchAccounts();
            }
        } catch (error) {
            alert('Failed to update account');
        }
    };

    const handleDeleteAccount = async (account: Account) => {
        if (!confirm(`Delete @${account.handle}? This will also delete all associated posts and offers.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/accounts?id=${account.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchAccounts();
            }
        } catch (error) {
            alert('Failed to delete account');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                        <div className="relative w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center animate-spin">
                            <RefreshCw className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading profiles...</p>
                </div>
            </div>
        );
    }

    const activeCount = accounts.filter(a => a.isActive).length;
    const totalPosts = accounts.reduce((sum, a) => sum + a.postsCount, 0);

    return (
        <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-wide">System Admin</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Source Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Configure and monitor {accounts.length} intelligence sources</p>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Source
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <Smartphone className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900">{accounts.length}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Accounts</p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Monitoring</p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <RefreshCw className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900">{totalPosts.toLocaleString()}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Posts Ingested</p>
                    </div>
                </div>
            </div>

            {/* Add Account Panel (Glass) */}
            {showAddForm && (
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-[32px] p-8 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-emerald-400" /> Add New Source
                    </h3>
                    <form onSubmit={handleAddAccount} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Instagram Handle</label>
                            <input
                                type="text"
                                placeholder="e.g. travistaegypt"
                                value={newHandle}
                                onChange={(e) => setNewHandle(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/30 font-medium"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Display Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Travista"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/30 font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={adding || !newHandle.trim()}
                            className="w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {adding ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify & Add"}
                        </button>
                    </form>
                </div>
            )}

            {/* Accounts Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-100/50">
                        <tr>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Account Profile</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Posts</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Sync Date</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {accounts.map((account, i) => (
                            <tr key={account.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {account.handle[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <a
                                                href={account.profileUrl || `https://instagram.com/${account.handle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                                            >
                                                @{account.handle}
                                                <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            <p className="text-sm font-medium text-slate-500">{account.displayName || 'No display name'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                                        {account.postsCount} posts
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleActive(account)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                            account.isActive
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 ring-2 ring-emerald-500/10"
                                                : "bg-slate-50 text-slate-500 border-slate-200"
                                        )}
                                    >
                                        {account.isActive ? (
                                            <>
                                                <ToggleRight className="w-4 h-4 fill-emerald-700" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft className="w-4 h-4 text-slate-400" />
                                                Paused
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <RefreshCw className="w-3 h-3" />
                                        {formatRelativeTime(account.updatedAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteAccount(account)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Account"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {accounts.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/50 backdrop-blur-xl rounded-[32px] border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Sources Configured</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">Add an Instagram account to start ingesting data and generating market intelligence.</p>
                    <button onClick={() => setShowAddForm(true)} className="btn bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Add First Source</button>
                </div>
            )}
        </main>
    );
}
