
import React, { useState } from 'react';
import {
    Save, Lock, Bell, Globe, Smartphone, Database, RefreshCw,
    ToggleLeft, ToggleRight, AlertTriangle, Cpu, Activity, Server,
    Send, Megaphone, CheckCircle2
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function AdminSettings() {
    const { createAnnouncement } = useCMS();

    // Feature Flags State
    const [featureFlags, setFeatureFlags] = useState([
        { id: 'maintenance', label: 'Maintenance Mode', description: 'Disable access for all users', enabled: false, critical: true },
        { id: 'trading_halt', label: 'Halt All Trading', description: 'Suspend all buy/sell orders globally', enabled: false, critical: true },
        { id: 'beta_features', label: 'Beta Features', description: 'Enable experimental features for beta users', enabled: true, critical: false },
        { id: 'new_ui', label: 'New UI v2.0', description: 'Roll out the new dashboard design', enabled: false, critical: false },
        { id: 'signup_bonus', label: 'Signup Bonus', description: 'Double coin reward for new signups', enabled: true, critical: false },
    ]);

    // Marketing OS State
    const [marketingForm, setMarketingForm] = useState({
        title: '',
        message: '',
        type: 'info', // info | promo | warning
        target: 'all' // all | active | inactive
    });
    const [marketingSent, setMarketingSent] = useState(false);

    // Toggle Handler
    const toggleFlag = (id) => {
        setFeatureFlags(prev => prev.map(flag =>
            flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
        ));
    };

    // Marketing Submit
    const handleMarketingSubmit = () => {
        if (!marketingForm.title || !marketingForm.message) return;

        // Use CMS to create a real announcement
        createAnnouncement({
            title: marketingForm.title,
            message: marketingForm.message,
            type: marketingForm.type,
            targetMode: 'all',
            priority: marketingForm.type === 'warning' ? 'high' : 'normal',
            isActive: true,
            createdAt: new Date().toISOString()
        });

        setMarketingSent(true);
        setTimeout(() => {
            setMarketingSent(false);
            setMarketingForm({ title: '', message: '', type: 'info', target: 'all' });
        }, 3000);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        Global System Control
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                        Feature flags, marketing operations, and system health
                    </p>
                </div>
            </div>

            {/* Top Row: System Health (Simulated) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A' }}><Server size={24} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Server Status</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Operational</div>
                        <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>99.99% Uptime</div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB' }}><Activity size={24} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>API Latency</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>24ms</div>
                        <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>Global Average</div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#F3E8FF', color: '#9333EA' }}><Cpu size={24} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>System Load</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>12%</div>
                        <div style={{ fontSize: '0.75rem', color: '#9333EA', fontWeight: 600 }}>Low Traffic</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>

                {/* Left Column: Feature Flags */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ToggleRight size={20} color="#64748B" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Feature Flags</h3>
                    </div>
                    <div>
                        {featureFlags.map((flag, index) => (
                            <div key={flag.id} style={{
                                padding: '1.25rem 1.5rem',
                                borderBottom: index !== featureFlags.length - 1 ? '1px solid #F1F5F9' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: flag.critical && flag.enabled ? '#FEF2F2' : 'transparent',
                                transition: 'background 0.3s'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: flag.critical ? '#991B1B' : '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {flag.label} {flag.critical && <AlertTriangle size={14} color="#EF4444" />}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: flag.critical ? '#B91C1C' : '#64748B' }}>{flag.description}</div>
                                </div>
                                <button
                                    onClick={() => toggleFlag(flag.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    {flag.enabled ?
                                        <ToggleRight size={40} color={flag.critical ? '#DC2626' : '#10B981'} style={{ transition: 'all 0.3s' }} /> :
                                        <ToggleLeft size={40} color="#CBD5E1" style={{ transition: 'all 0.3s' }} />
                                    }
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Marketing OS */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', height: 'fit-content' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Megaphone size={20} color="#64748B" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Marketing OS</h3>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        {marketingSent ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#10B981' }}>
                                <CheckCircle2 size={48} style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Broadcast Sent!</h4>
                                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Your announcement is now live for {marketingForm.target} users.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.375rem', display: 'block' }}>Announcement Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Weekend Challenge Live!"
                                        value={marketingForm.title}
                                        onChange={e => setMarketingForm({ ...marketingForm, title: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.375rem', display: 'block' }}>Message Body</label>
                                    <textarea
                                        placeholder="Write your push notification text here..."
                                        value={marketingForm.message}
                                        onChange={e => setMarketingForm({ ...marketingForm, message: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', minHeight: '100px' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.375rem', display: 'block' }}>Type</label>
                                        <select
                                            value={marketingForm.type}
                                            onChange={e => setMarketingForm({ ...marketingForm, type: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', background: 'white' }}
                                        >
                                            <option value="info">ℹ️ Info</option>
                                            <option value="promo">🎁 Promo</option>
                                            <option value="warning">⚠️ Warning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.375rem', display: 'block' }}>Target Audience</label>
                                        <select
                                            value={marketingForm.target}
                                            onChange={e => setMarketingForm({ ...marketingForm, target: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', background: 'white' }}
                                        >
                                            <option value="all">Everyone</option>
                                            <option value="active">Active Players</option>
                                            <option value="inactive">Churned Users</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleMarketingSubmit}
                                    style={{
                                        marginTop: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', color: 'white',
                                        fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <Send size={18} /> Broadcast Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                Antigravity CMS v2.4.0 • Build ID: {new Date().getTime().toString().slice(-8)}
            </div>

        </div>
    );
}
