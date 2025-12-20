import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight, Shield, Zap, Sparkles, Hexagon, Activity } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

// Simple admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'bhidy2024',
};

// EMERALD LIGHT STYLES
const lightStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    
    * { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; }
    
    @keyframes float-shape {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes breathe {
        0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
        50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3); }
    }

    @keyframes entry-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    .light-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        box-shadow: 
            0 25px 50px -12px rgba(15, 23, 42, 0.05),
            0 10px 15px -3px rgba(15, 23, 42, 0.02);
    }

    .gradient-text {
        background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .input-group:focus-within {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1);
        border-color: #10B981;
        background: #ffffff;
    }

    .btn-emerald {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .btn-emerald:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.3);
        filter: brightness(1.05);
    }
    
    .btn-emerald:active {
        transform: translateY(0);
    }

    .nav-pill {
        transition: all 0.2s ease;
        background: rgba(15, 23, 42, 0.03);
        border: 1px solid rgba(15, 23, 42, 0.05);
        color: #64748B;
    }
    .nav-pill:hover {
        background: rgba(15, 23, 42, 0.05);
        color: #0F172A;
        transform: translateY(-1px);
    }
`;

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { addNotification } = useNotification();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Cinematic delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const token = btoa(JSON.stringify({
                user: username,
                role: 'admin',
                exp: Date.now() + 86400000
            }));
            localStorage.setItem('cms_auth_token', token);
            navigate('/admin');
        } else {
            setError('ACCESS DENIED');
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #FAFCFF 0%, #F0FDF9 100%)', // Splash Screen Base
        }}>
            <style>{lightStyles}</style>

            {/* --- BACKGROUND ELEMENTS --- */}

            {/* 1. Subtle Grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* 2. Floating Shapes (Matching Splash) */}
            <div style={{
                position: 'absolute',
                top: '10%', right: '10%',
                width: '300px', height: '300px',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
                animation: 'float-shape 20s ease-in-out infinite',
                filter: 'blur(40px)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%', left: '5%',
                width: '400px', height: '400px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
                animation: 'float-shape 25s ease-in-out infinite reverse',
                filter: 'blur(50px)',
                zIndex: 1
            }} />


            {/* --- GLASS CARD CONTAINER --- */}
            <div className={`light-card ${mounted ? 'animate-in' : ''}`} style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '420px',
                padding: '3.5rem 3rem',
                borderRadius: '32px',
                animation: 'entry-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                opacity: 0,
            }}>

                {/* --- HEADER --- */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>

                    {/* Brand Icon */}
                    <div style={{
                        width: '72px', height: '72px',
                        margin: '0 auto 1.5rem',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 15px 35px -5px rgba(16, 185, 129, 0.3)',
                        animation: 'breathe 4s infinite ease-in-out'
                    }}>
                        <Activity size={36} color="white" strokeWidth={2} />
                    </div>

                    <h1 className="gradient-text" style={{
                        fontSize: '2.25rem',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        marginBottom: '0.25rem',
                        lineHeight: 1
                    }}>
                        HERO
                    </h1>
                    <p style={{
                        color: '#64748B',
                        fontSize: '0.8rem',
                        letterSpacing: '0.15em',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        ECO SYSTEM
                    </p>
                </div>


                {/* --- LOGIN FORM --- */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Username Field */}
                    <div className="input-group" style={{
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.2s ease'
                    }}>
                        <User size={18} style={{
                            position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                            color: '#94A3B8'
                        }} />
                        <input
                            type="text"
                            placeholder="Operator ID"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.1rem 1.1rem 1.1rem 3.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#0F172A',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="input-group" style={{
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.2s ease'
                    }}>
                        <Lock size={18} style={{
                            position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                            color: '#94A3B8'
                        }} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Access Key"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.1rem 3.25rem 1.1rem 3.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#0F172A',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                outline: 'none'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                                color: '#94A3B8', transition: 'color 0.2s'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: '#FEF2F2',
                            border: '1px solid #FECaca',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            color: '#DC2626',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            animation: 'entry-up 0.3s ease-out'
                        }}>
                            <Shield size={14} /> {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading || !username || !password}
                        className="btn-emerald"
                        style={{
                            marginTop: '0.5rem',
                            padding: '1.1rem',
                            borderRadius: '16px',
                            border: 'none',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            cursor: (loading || !username || !password) ? 'not-allowed' : 'pointer',
                            opacity: (loading || !username || !password) ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: '18px', height: '18px',
                                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }} />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                Verifying...
                            </>
                        ) : (
                            <>
                                Authenticate
                                <ArrowRight size={18} strokeWidth={2.5} />
                            </>
                        )}
                    </button>

                </form>

                {/* --- FOOTER --- */}
                <div style={{
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="nav-pill" style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 0.8rem', borderRadius: '100px', cursor: 'pointer'
                        }}>
                            <Zap size={12} color="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>v3.2.1</span>
                        </div>
                        <div className="nav-pill" style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 0.8rem', borderRadius: '100px', cursor: 'pointer'
                        }}>
                            <Sparkles size={12} color="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Encrypted</span>
                        </div>
                    </div>

                    <span style={{
                        color: '#94A3B8',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        opacity: 0.8
                    }}>
                        Powered by Bhidy
                    </span>
                </div>

            </div>
        </div>
    );
}

// Auth Helper functions
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
