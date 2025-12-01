import React from 'react';

export default function Badge({ children, color = 'primary' }) {
    const colors = {
        primary: { bg: '#d1fae5', text: '#10b981', border: '#a7f3d0' },
        success: { bg: '#dcfce7', text: '#10b981', border: '#bbf7d0' },
        danger: { bg: '#fee2e2', text: '#ef4444', border: '#fecaca' },
        warning: { bg: '#fef3c7', text: '#f59e0b', border: '#fde68a' },
        info: { bg: '#dbeafe', text: '#06b6d4', border: '#bfdbfe' },
        neutral: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
    };

    const style = colors[color] || colors.neutral;

    return (
        <span style={{
            backgroundColor: style.bg,
            color: style.text,
            padding: '0.375rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            border: `1.5px solid ${style.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {children}
        </span>
    );
}
