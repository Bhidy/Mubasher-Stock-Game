import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification System
 * 
 * Usage:
 * 1. Wrap app with <ToastProvider>
 * 2. Use hook: const { showToast } = useToast();
 * 3. Call: showToast('Success!', 'success');
 */

const ToastContext = createContext(null);

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: 'white',
    },
    error: {
        icon: XCircle,
        bg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        color: 'white',
    },
    warning: {
        icon: AlertCircle,
        bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: 'white',
    },
    info: {
        icon: Info,
        bg: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
        color: 'white',
    },
};

function Toast({ id, message, type = 'success', onDismiss }) {
    const config = TOAST_TYPES[type] || TOAST_TYPES.info;
    const Icon = config.icon;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: config.bg,
                color: config.color,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                marginBottom: '0.625rem',
                animation: 'slideInRight 0.3s ease-out',
                maxWidth: '320px',
            }}
        >
            <Icon size={20} style={{ flexShrink: 0 }} />
            <span style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                lineHeight: 1.4
            }}>
                {message}
            </span>
            <button
                onClick={() => onDismiss(id)}
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'inherit',
                }}
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();

        setToasts(prev => [...prev, { id, message, type }]);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }

        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, dismissToast }}>
            {children}

            {/* Toast Container */}
            <div
                style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 9999999,
                    pointerEvents: toasts.length > 0 ? 'auto' : 'none',
                }}
            >
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onDismiss={dismissToast}
                    />
                ))}
            </div>

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Convenience methods
export const toast = {
    success: (message) => window.__showToast?.(message, 'success'),
    error: (message) => window.__showToast?.(message, 'error'),
    warning: (message) => window.__showToast?.(message, 'warning'),
    info: (message) => window.__showToast?.(message, 'info'),
};
