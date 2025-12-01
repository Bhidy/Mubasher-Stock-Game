import React, { useState } from 'react';

export default function Button({ children, variant = 'primary', onClick, className = '', disabled = false, ...props }) {
    const [isPressed, setIsPressed] = useState(false);

    const baseStyle = {
        padding: '1rem 2rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        letterSpacing: '0.02em',
        position: 'relative',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
    };

    const variants = {
        primary: {
            background: 'var(--gradient-primary)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            textTransform: 'none',
        },
        secondary: {
            background: 'white',
            color: 'var(--text-primary)',
            border: '2px solid var(--bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            boxShadow: 'none',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            boxShadow: 'none',
        }
    };

    const handleMouseDown = () => {
        if (!disabled) setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleClick = (e) => {
        if (!disabled && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            style={{
                ...baseStyle,
                ...variants[variant],
                transform: isPressed ? 'scale(0.96)' : 'scale(1)',
                ...props.style
            }}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={className}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
