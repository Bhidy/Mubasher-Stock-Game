import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

// Simple admin credentials (in production, use proper auth service)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'bhidy2024',
};

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Store auth token in localStorage
            const token = btoa(JSON.stringify({
                user: username,
                role: 'admin',
                exp: Date.now() + 86400000 // 24 hours
            }));
            localStorage.setItem('cms_auth_token', token);
            navigate('/admin');
        } else {
            setError('Invalid username or password');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
                {/* Logo/Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Lock size={28} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#1E293B',
                        marginBottom: '0.5rem'
                    }}>
                        CMS Admin Login
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        background: '#FEE2E2',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        color: '#DC2626',
                        fontSize: '0.875rem',
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#475569',
                            marginBottom: '0.5rem',
                        }}>
                            Username
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '0 1rem',
                            transition: 'border-color 0.2s',
                        }}>
                            <User size={20} color="#94A3B8" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    padding: '0.875rem 0.75rem',
                                    fontSize: '0.95rem',
                                    background: 'transparent',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#475569',
                            marginBottom: '0.5rem',
                        }}>
                            Password
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '0 1rem',
                            transition: 'border-color 0.2s',
                        }}>
                            <Lock size={20} color="#94A3B8" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    padding: '0.875rem 0.75rem',
                                    fontSize: '0.95rem',
                                    background: 'transparent',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#94A3B8" />
                                ) : (
                                    <Eye size={20} color="#94A3B8" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !username || !password}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: loading ? '#94A3B8' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                }}>
                    Bhidy CMS • Admin Access Only
                </div>
            </div>
        </div>
    );
}

// Auth helper functions
export const isAuthenticated = () => {
    const token = localStorage.getItem('cms_auth_token');
    if (!token) return false;

    try {
        const decoded = JSON.parse(atob(token));
        return decoded.exp > Date.now();
    } catch {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('cms_auth_token');
};

export const getAuthUser = () => {
    const token = localStorage.getItem('cms_auth_token');
    if (!token) return null;

    try {
        return JSON.parse(atob(token));
    } catch {
        return null;
    }
};
