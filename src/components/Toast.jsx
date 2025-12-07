import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            animation: 'slideDown 0.3s ease-out',
            maxWidth: '90%',
            minWidth: '300px'
        }}>
            <CheckCircle size={20} />
            <span style={{ flex: 1, fontWeight: 600, fontSize: '0.875rem' }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={18} />
            </button>
        </div>
    );
}
