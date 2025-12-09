import React, { useState } from 'react';
import {
    Save, Lock, Bell, Globe, Smartphone, Database, RefreshCw,
    ToggleLeft, ToggleRight, AlertTriangle
} from 'lucide-react';

export default function AdminSettings() {

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                        System Settings
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Manage application configuration and maintenance
                    </p>
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: '#0F172A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                }}>
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            {/* General Settings */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                marginBottom: '1.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Globe size={20} color="#64748B" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>General</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            App Name
                        </label>
                        <input
                            type="text"
                            defaultValue="BHIDY"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                outline: 'none',
                                color: '#1E293B',
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            Support Email
                        </label>
                        <input
                            type="email"
                            defaultValue="support@bhidy.com"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                outline: 'none',
                                color: '#1E293B',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Maintenance Mode */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                marginBottom: '1.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Lock size={20} color="#64748B" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Access Control</h3>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#FEF2F2',
                    borderRadius: '12px',
                    border: '1px solid #FECACA',
                }}>
                    <div>
                        <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: '0.25rem' }}>Maintenance Mode</div>
                        <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>
                            Disable access to the mobile app for all users
                        </div>
                    </div>
                    <div style={{ cursor: 'pointer' }}>
                        <ToggleLeft size={32} color="#991B1B" />
                    </div>
                </div>
            </div>

            {/* API Configuration */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Database size={20} color="#64748B" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>API Configuration</h3>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '0.75rem 0', fontSize: '0.85rem', color: '#64748B' }}>Backend API Version</td>
                                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 600 }}>v2.4.0</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '0.75rem 0', fontSize: '0.85rem', color: '#64748B' }}>Market Data Source</td>
                                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 600, color: '#10B981' }}>Live (WebSocket)</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.75rem 0', fontSize: '0.85rem', color: '#64748B' }}>Cache Status</td>
                                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', color: '#0EA5E9', cursor: 'pointer' }}>
                                        <RefreshCw size={14} /> Clear Cache
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                Antigravity CMS v1.2.0 • Build 2024.12.09
            </div>
        </div>
    );
}
