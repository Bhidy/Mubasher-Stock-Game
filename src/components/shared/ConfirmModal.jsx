import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Confirmation Modal Component
 * 
 * Usage:
 * <ConfirmModal
 *   isOpen={showConfirm}
 *   title="Delete Item?"
 *   message="This action cannot be undone."
 *   confirmText="Delete"
 *   confirmType="danger"
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */

export default function ConfirmModal({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmType = 'danger', // 'danger', 'warning', 'primary'
    icon: CustomIcon = null,
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            iconBg: '#FEE2E2',
            iconColor: '#DC2626',
            buttonBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            Icon: CustomIcon || Trash2,
        },
        warning: {
            iconBg: '#FEF3C7',
            iconColor: '#D97706',
            buttonBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            Icon: CustomIcon || AlertTriangle,
        },
        primary: {
            iconBg: '#DBEAFE',
            iconColor: '#2563EB',
            buttonBg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            Icon: CustomIcon || AlertTriangle,
        },
    };

    const style = typeStyles[confirmType] || typeStyles.danger;
    const Icon = style.Icon;

    return (
        <div
            onClick={onCancel}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.2s ease-out',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    maxWidth: '340px',
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'scaleIn 0.2s ease-out',
                }}
            >
                {/* Icon */}
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: style.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                }}>
                    <Icon size={28} color={style.iconColor} />
                </div>

                {/* Title */}
                <h3 style={{
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#1F2937',
                    marginBottom: '0.5rem',
                }}>
                    {title}
                </h3>

                {/* Message */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#6B7280',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                }}>
                    {message}
                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            background: 'white',
                            color: '#4B5563',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: style.buttonBg,
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
