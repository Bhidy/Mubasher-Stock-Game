'use client';

import React, { Component, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * GOO MODE: Global Error Boundary
 * Catches React render errors and displays a premium fallback UI
 * instead of crashing the entire application.
 */
export default class GooErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to console for debugging
        console.error('🚨 GOO ERROR BOUNDARY CAUGHT:', error);
        console.error('Component Stack:', errorInfo.componentStack);

        // TODO: Send to external error tracking service (e.g., Sentry)
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
                    <div className="max-w-md w-full">
                        {/* Error Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-center">
                                <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-white/80 text-sm">
                                    Atlas Intel encountered an unexpected error
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                {/* Error Details (Collapsed) */}
                                <details className="group">
                                    <summary className="cursor-pointer text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                        <span>View technical details</span>
                                    </summary>
                                    <div className="mt-3 p-3 bg-slate-800 rounded-xl text-xs text-rose-400 font-mono overflow-x-auto">
                                        {this.state.error?.message || 'Unknown error'}
                                    </div>
                                </details>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={this.handleReload}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reload Page
                                    </button>
                                    <button
                                        onClick={this.handleGoHome}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10"
                                    >
                                        <Home className="w-4 h-4" />
                                        Go Home
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/5 text-center">
                                <p className="text-xs text-slate-500">
                                    If this keeps happening, please contact support
                                </p>
                            </div>
                        </div>

                        {/* Branding */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600 text-xs font-medium">
                                Atlas Intel • Intelligence Suite
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
