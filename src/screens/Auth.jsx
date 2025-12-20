import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    auth
} from '../config/firebase';
import { useUser } from '../context/UserContext';
import { sendPasswordReset } from '../services/authService';
import { Mail, Lock, User, ArrowRight, AlertCircle, Shield, TrendingUp, Zap, Sparkles, CheckCircle } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const navigate = useNavigate();
    const { user, setUser, loginAsGuest } = useUser();

    // Redirect when authenticated or in guest mode
    React.useEffect(() => {
        if (user?.isAuthenticated || user?.isGuestMode) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMessage('');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setError('Please enter your email address');
            return;
        }
        setLoading(true);
        const result = await sendPasswordReset(resetEmail);
        setLoading(false);
        if (result.success) {
            setSuccessMessage(result.message);
            setError('');
            setTimeout(() => setShowForgotPassword(false), 3000);
        } else {
            setError(result.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                await updateProfile(userCredential.user, { displayName: formData.name });
            }
            // Redirection handled by useEffect
        } catch (err) {
            setError(mapAuthError(err.code));
            setLoading(false);
        }
    };

    const mapAuthError = (code) => {
        const errors = {
            'auth/email-already-in-use': 'Email already registered',
            'auth/invalid-email': 'Invalid email',
            'auth/user-not-found': 'Account not found',
            'auth/wrong-password': 'Incorrect password',
            'auth/popup-closed-by-user': 'Cancelled',
            'auth/unauthorized-domain': 'Domain not authorized',
            'auth/operation-not-allowed': 'Method not enabled',
        };
        return errors[code] || 'An error occurred';
    };

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #FAFCFF 0%, #E8FFF5 40%, #E0F7FA 70%, #F0F9FF 100%)',
            overflow: 'hidden',
            fontFamily: 'Outfit, sans-serif',
            position: 'relative',
        }}>
            {/* Animated Floating Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="orb orb-4" />

            {/* Logo with Glow */}
            <div className="logo-container">
                <div className="logo-glow" />
                <div className="logo">SH</div>
            </div>

            {/* Title with Staggered Animation */}
            <h1 className="title animate-in" style={{ animationDelay: '0.1s' }}>
                Stock Hero
            </h1>
            <p className="subtitle animate-in" style={{ animationDelay: '0.2s' }}>
                Trade Smarter. Play Bolder.
            </p>

            {/* Feature Pills with Shimmer */}
            <div className="feature-pills animate-in" style={{ animationDelay: '0.3s' }}>
                <span className="pill pill-green">
                    <TrendingUp size={12} /> Live Markets
                </span>
                <span className="pill pill-cyan">
                    <Zap size={12} /> AI Insights
                </span>
                <span className="pill pill-purple">
                    <Sparkles size={12} /> Fantasy
                </span>
            </div>

            {/* Quick Start Label */}
            <p className="social-label animate-in" style={{ animationDelay: '0.4s' }}>
                Quick start
            </p>

            {/* Guest Button - Large and Prominent */}
            <div className="social-buttons animate-in" style={{ animationDelay: '0.5s' }}>
                <button
                    className="guest-btn-large"
                    onClick={() => loginAsGuest()}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        maxWidth: '280px',
                        padding: '1rem 2rem',
                        borderRadius: '16px',
                        border: '2px solid rgba(16, 185, 129, 0.3)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1))',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
                    }}
                >
                    <User size={24} color="#10B981" />
                    <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#10B981',
                        letterSpacing: '0.02em'
                    }}>
                        Continue as Guest
                    </span>
                </button>
            </div>

            {/* Divider */}
            <div className="divider animate-in" style={{ animationDelay: '0.6s' }} onClick={() => setShowEmailForm(!showEmailForm)}>
                <div className="divider-line" />
                <span className="divider-text">
                    or with email
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showEmailForm ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </span>
                <div className="divider-line" />
            </div>

            {/* Email Form - Collapsible */}
            <div className={`email-form-container ${showEmailForm ? 'expanded' : ''}`}>
                {/* Error */}
                {error && (
                    <div className="error-box">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                {/* Toggle */}
                <div className="toggle-container">
                    <button className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
                        Sign In
                    </button>
                    <button className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
                        Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <User size={16} className="input-icon" />
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required={!isLogin} className="input-field" />
                        </div>
                    )}
                    <div className="input-group">
                        <Mail size={16} className="input-icon" />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="input-field" />
                    </div>
                    <div className="input-group">
                        <Lock size={16} className="input-icon" />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required minLength={6} className="input-field" />
                    </div>
                    {isLogin && (
                        <button
                            type="button"
                            onClick={() => { setShowForgotPassword(true); setResetEmail(formData.email); }}
                            style={{
                                background: 'none', border: 'none', color: '#10B981',
                                fontSize: '0.8rem', cursor: 'pointer', textAlign: 'right',
                                padding: '0.25rem 0', marginTop: '-0.25rem'
                            }}
                        >
                            Forgot Password?
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? '...' : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>

            {/* Trust Badge */}
            <div className="trust-badge animate-in" style={{ animationDelay: '0.7s' }}>
                <Shield size={12} />
                <span>Powered by Mohamed Bhidy</span>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div onClick={() => setShowForgotPassword(false)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '24px', padding: '1.5rem',
                        width: '100%', maxWidth: '360px'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Password</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                            Enter your email and we'll send you a reset link.
                        </p>
                        {error && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={14} />{error}</div>}
                        {successMessage && <div style={{ background: '#D1FAE5', color: '#059669', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={14} />{successMessage}</div>}
                        <form onSubmit={handleForgotPassword}>
                            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Email Address" required style={{
                                width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.95rem', marginBottom: '1rem'
                            }} />
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setShowForgotPassword(false)} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #E5E7EB', background: 'white', fontWeight: 600, cursor: 'pointer'
                                }}>Cancel</button>
                                <button type="submit" disabled={loading} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)', color: 'white', fontWeight: 600, cursor: 'pointer'
                                }}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Embedded Styles */}
            <style>{`
                /* Floating Orbs */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.5;
                    pointer-events: none;
                }
                .orb-1 {
                    width: 200px; height: 200px;
                    background: linear-gradient(135deg, #10B981, #34D399);
                    top: 5%; right: -5%;
                    animation: float1 8s ease-in-out infinite;
                }
                .orb-2 {
                    width: 150px; height: 150px;
                    background: linear-gradient(135deg, #0EA5E9, #38BDF8);
                    bottom: 10%; left: -5%;
                    animation: float2 10s ease-in-out infinite;
                }
                .orb-3 {
                    width: 100px; height: 100px;
                    background: linear-gradient(135deg, #8B5CF6, #A78BFA);
                    top: 40%; left: 5%;
                    animation: float3 6s ease-in-out infinite;
                }
                .orb-4 {
                    width: 80px; height: 80px;
                    background: linear-gradient(135deg, #F59E0B, #FBBF24);
                    bottom: 25%; right: 10%;
                    animation: float1 7s ease-in-out infinite reverse;
                }

                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, -30px) scale(1.1); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.05); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(15px, 20px); }
                }

                /* Logo */
                .logo-container {
                    position: relative;
                    margin-bottom: 1rem;
                }
                .logo-glow {
                    position: absolute;
                    inset: -8px;
                    background: linear-gradient(135deg, #10B981, #0EA5E9);
                    border-radius: 22px;
                    filter: blur(20px);
                    opacity: 0.4;
                    animation: pulse-glow 3s ease-in-out infinite;
                }
                .logo {
                    position: relative;
                    width: 68px; height: 68px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #10B981 0%, #0EA5E9 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    font-weight: 900;
                    color: white;
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.35);
                    animation: logo-float 4s ease-in-out infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes logo-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }

                /* Typography */
                .title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #0F172A;
                    letter-spacing: -0.04em;
                    margin-bottom: 0.25rem;
                }
                .subtitle {
                    font-size: 0.95rem;
                    color: #64748B;
                    margin-bottom: 0.75rem;
                }

                /* Entrance Animation */
                .animate-in {
                    animation: fadeSlideUp 0.6s ease-out both;
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Feature Pills */
                .feature-pills {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .pill {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.3rem 0.7rem;
                    border-radius: 999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    position: relative;
                    overflow: hidden;
                }
                .pill::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    animation: shimmer 3s infinite;
                }
                @keyframes shimmer {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }
                .pill-green { background: #10B98118; color: #10B981; }
                .pill-cyan { background: #0EA5E918; color: #0EA5E9; }
                .pill-purple { background: #8B5CF618; color: #8B5CF6; }

                /* Social */
                .social-label {
                    font-size: 0.8rem;
                    color: #94A3B8;
                    margin-bottom: 0.625rem;
                    font-weight: 500;
                }
                .social-buttons {
                    display: flex;
                    gap: 1.25rem;
                    margin-bottom: 1rem;
                }
                .social-btn-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }
                .social-btn-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #64748B;
                    text-align: center;
                }
                .social-btn {
                    width: 64px; height: 64px;
                    border-radius: 18px;
                    border: 1.5px solid rgba(255,255,255,0.6);
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                }
                .social-btn:hover:not(:disabled) {
                    transform: translateY(-4px) scale(1.05);
                    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.2);
                    border-color: #10B981;
                }
                .social-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                .social-btn-guest {
                    background: linear-gradient(135deg, rgba(248,250,252,0.9), rgba(241,245,249,0.9));
                }
                .social-btn-guest:hover:not(:disabled) {
                    border-color: #64748B;
                    box-shadow: 0 12px 32px rgba(100,116,139,0.15);
                }

                /* Divider */
                .divider {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    width: 100%;
                    max-width: 320px;
                    cursor: pointer;
                    margin-bottom: 0.75rem;
                }
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #E2E8F0, transparent);
                }
                .divider-text {
                    color: #94A3B8;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    transition: color 0.2s;
                }
                .divider:hover .divider-text { color: #64748B; }

                /* Email Form */
                .email-form-container {
                    width: 100%;
                    max-width: 320px;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                }
                .email-form-container.expanded {
                    max-height: 400px;
                    opacity: 1;
                }

                .error-box {
                    background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
                    color: #DC2626;
                    padding: 0.5rem 0.75rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    animation: shake 0.4s ease;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }

                .toggle-container {
                    display: flex;
                    background: rgba(241,245,249,0.8);
                    backdrop-filter: blur(8px);
                    padding: 3px;
                    border-radius: 12px;
                    margin-bottom: 0.625rem;
                }
                .toggle-btn {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    color: #64748B;
                    font-weight: 600;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .toggle-btn.active {
                    background: white;
                    color: #0F172A;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .input-group {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94A3B8;
                    transition: color 0.2s;
                }
                .input-field {
                    width: 100%;
                    padding: 0.75rem 0.875rem 0.75rem 2.5rem;
                    border-radius: 12px;
                    border: 1.5px solid #E2E8F0;
                    font-size: 0.9rem;
                    outline: none;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(8px);
                    transition: all 0.2s;
                }
                .input-field:focus {
                    border-color: #10B981;
                    box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
                    background: white;
                }
                .input-field:focus + .input-icon,
                .input-group:focus-within .input-icon {
                    color: #10B981;
                }

                .submit-btn {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, #10B981 0%, #0EA5E9 100%);
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.375rem;
                    box-shadow: 0 8px 24px rgba(16,185,129,0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-top: 0.25rem;
                }
                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(16,185,129,0.4);
                }
                .submit-btn:active {
                    transform: translateY(0);
                }

                /* Trust Badge */
                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #94A3B8;
                    font-size: 0.65rem;
                    margin-top: 1rem;
                }
            `}</style>
        </div>
    );
}
