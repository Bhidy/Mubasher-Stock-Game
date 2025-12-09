import React from 'react';

/**
 * Loading skeleton component for placeholder content while data loads
 */
export function Skeleton({
    width = '100%',
    height = '1rem',
    borderRadius = '8px',
    className = '',
    style = {},
}) {
    return (
        <div
            className={className}
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                ...style,
            }}
        />
    );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton({ height = '120px' }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div style={{ flex: 1 }}>
                    <Skeleton height="1rem" width="60%" style={{ marginBottom: '0.5rem' }} />
                    <Skeleton height="0.8rem" width="80%" />
                </div>
            </div>
        </div>
    );
}

/**
 * List skeleton for multiple items
 */
export function ListSkeleton({ count = 3, gap = '0.75rem' }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Full page loading state
 */
export function PageLoading({ message = 'Loading...' }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1rem',
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #E5E7EB',
                borderTopColor: '#8B5CF6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <span style={{ color: '#64748B', fontSize: '0.9rem' }}>{message}</span>
        </div>
    );
}

/**
 * Empty state component
 */
export function EmptyState({
    icon = '📭',
    title = 'Nothing here yet',
    description = 'Check back later',
    actionLabel,
    onAction,
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#374151',
                marginBottom: '0.5rem',
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '0.9rem',
                color: '#6B7280',
                marginBottom: actionLabel ? '1.5rem' : 0,
            }}>
                {description}
            </p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

// Add CSS keyframes for animations (add this to your index.css or inject it)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
if (!document.querySelector('style[data-loading-states]')) {
    styleSheet.setAttribute('data-loading-states', 'true');
    document.head.appendChild(styleSheet);
}
