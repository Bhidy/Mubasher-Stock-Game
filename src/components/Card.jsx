import React from 'react';

export default function Card({ children, className = '', padding = '1.5rem', variant = 'default', ...props }) {
    const variants = {
        default: {
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(0,0,0,0.05)'
        },
        gradient: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid rgba(99, 102, 241, 0.1)'
        },
        elevated: {
            background: 'white',
            boxShadow: 'var(--shadow-xl)',
            border: 'none'
        }
    };

    const style = variants[variant] || variants.default;

    return (
        <div
            className={`card ${className}`}
            style={{
                ...style,
                borderRadius: 'var(--radius-lg)',
                padding: padding,
                color: 'var(--text-primary)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                ...props.style
            }}
            {...props}
        >
            {children}
        </div>
    );
}
