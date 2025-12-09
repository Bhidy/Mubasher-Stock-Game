import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, ArrowLeft, Plus, TrendingUp, TrendingDown, X, Check,
    Settings, Trash2, Edit2, Clock, AlertCircle, Target, Volume2,
    BellOff, ChevronDown
} from 'lucide-react';

// Mock alerts
const SAMPLE_ALERTS = [
    {
        id: 1,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'price_above',
        targetPrice: 195.00,
        currentPrice: 189.72,
        enabled: true,
        triggered: false,
        createdAt: '2024-12-08',
    },
    {
        id: 2,
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        type: 'price_below',
        targetPrice: 850.00,
        currentPrice: 875.28,
        enabled: true,
        triggered: false,
        createdAt: '2024-12-07',
    },
    {
        id: 3,
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'percent_change',
        targetPercent: 5,
        currentPrice: 245.67,
        enabled: true,
        triggered: true,
        triggeredAt: '2024-12-09 10:30',
        createdAt: '2024-12-05',
    },
    {
        id: 4,
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        type: 'price_above',
        targetPrice: 400.00,
        currentPrice: 378.91,
        enabled: false,
        triggered: false,
        createdAt: '2024-12-06',
    },
];

const ALERT_TYPES = [
    { id: 'price_above', label: 'Price Above', icon: TrendingUp, color: '#10B981' },
    { id: 'price_below', label: 'Price Below', icon: TrendingDown, color: '#EF4444' },
    { id: 'percent_change', label: '% Change', icon: Target, color: '#F59E0B' },
    { id: 'volume_spike', label: 'Volume Spike', icon: Volume2, color: '#6366F1' },
];

function AlertCard({ alert, onToggle, onDelete, onEdit }) {
    const alertType = ALERT_TYPES.find(t => t.id === alert.type);
    const progress = alert.type === 'price_above'
        ? (alert.currentPrice / alert.targetPrice) * 100
        : alert.type === 'price_below'
            ? ((alert.targetPrice - (alert.targetPrice - alert.currentPrice)) / alert.targetPrice) * 100
            : 50;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '0.75rem',
            border: alert.triggered ? '2px solid #10B981' : '1px solid #E5E7EB',
            opacity: alert.enabled ? 1 : 0.6,
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${alertType.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <alertType.icon size={20} color={alertType.color} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#1F2937' }}>{alert.symbol}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{alert.name}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {alert.triggered && (
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            background: '#DCFCE7',
                            color: '#16A34A',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                        }}>
                            TRIGGERED
                        </span>
                    )}
                    <button
                        onClick={() => onToggle(alert.id)}
                        style={{
                            background: alert.enabled ? '#DBEAFE' : '#F3F4F6',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        {alert.enabled ? (
                            <Bell size={16} color="#2563EB" />
                        ) : (
                            <BellOff size={16} color="#9CA3AF" />
                        )}
                    </button>
                </div>
            </div>

            {/* Alert Details */}
            <div style={{
                background: '#F9FAFB',
                borderRadius: '10px',
                padding: '0.75rem',
                marginBottom: '0.75rem',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.8rem',
                }}>
                    <span style={{ color: '#6B7280' }}>{alertType.label}</span>
                    <span style={{ fontWeight: 700, color: alertType.color }}>
                        {alert.type === 'percent_change'
                            ? `±${alert.targetPercent}%`
                            : `$${alert.targetPrice?.toFixed(2)}`
                        }
                    </span>
                </div>

                {/* Progress bar for price alerts */}
                {(alert.type === 'price_above' || alert.type === 'price_below') && (
                    <>
                        <div style={{
                            height: '6px',
                            background: '#E5E7EB',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            marginBottom: '0.375rem',
                        }}>
                            <div style={{
                                width: `${Math.min(progress, 100)}%`,
                                height: '100%',
                                background: alertType.color,
                                borderRadius: '999px',
                            }} />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.7rem',
                            color: '#9CA3AF',
                        }}>
                            <span>Current: ${alert.currentPrice.toFixed(2)}</span>
                            <span>Target: ${alert.targetPrice.toFixed(2)}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Actions */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                    <Clock size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                    Created {alert.createdAt}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onEdit(alert)}
                        style={{
                            background: '#F3F4F6',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.375rem 0.625rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#4B5563',
                        }}
                    >
                        <Edit2 size={12} />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(alert.id)}
                        style={{
                            background: '#FEE2E2',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.375rem 0.625rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#DC2626',
                        }}
                    >
                        <Trash2 size={12} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function InvestorAlerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState(SAMPLE_ALERTS);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'triggered'
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleToggle = (id) => {
        setAlerts(prev => prev.map(a =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
        ));
    };

    const handleDelete = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const handleEdit = (alert) => {
        // Would open edit modal
        console.log('Edit:', alert);
    };

    const filteredAlerts = alerts.filter(a => {
        if (filter === 'active') return a.enabled && !a.triggered;
        if (filter === 'triggered') return a.triggered;
        return true;
    });

    const activeCount = alerts.filter(a => a.enabled && !a.triggered).length;
    const triggeredCount = alerts.filter(a => a.triggered).length;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                padding: '1rem 1rem 1.5rem 1rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>
                        Price Alerts
                    </h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Plus size={20} color="white" />
                    </button>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                            {activeCount}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                            Active Alerts
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '1rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                            {triggeredCount}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                            Triggered Today
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
            }}>
                {[
                    { id: 'all', label: `All (${alerts.length})` },
                    { id: 'active', label: `Active (${activeCount})` },
                    { id: 'triggered', label: `Triggered (${triggeredCount})` },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        style={{
                            flex: 1,
                            padding: '0.625rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: filter === tab.id ? '#EF4444' : 'white',
                            color: filter === tab.id ? 'white' : '#6B7280',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div style={{ padding: '0 1rem' }}>
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <Bell size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>No alerts found</h3>
                        <p>Create a price alert to get notified when stocks hit your targets.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1.5rem',
                                background: '#EF4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Create Alert
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div
                    onClick={() => setShowCreateModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'flex-end',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px 24px 0 0',
                            padding: '1.5rem',
                            width: '100%',
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '4px',
                            background: '#E5E7EB',
                            borderRadius: '2px',
                            margin: '0 auto 1rem',
                        }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            Create Alert
                        </h3>

                        {/* Alert Type Selection */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                                Alert Type
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                                {ALERT_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            background: 'white',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <type.icon size={18} color={type.color} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCreateModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: '#EF4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Search for Stock
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
