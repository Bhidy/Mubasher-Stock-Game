import React from 'react';

export default function SplashScreen() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(180deg, #FAFCFF 0%, #F0FDF9 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflow: 'hidden',
        }}>
            {/* Subtle Floating Geometric Shapes */}
            <div style={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: '120px',
                height: '120px',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
                animation: 'floatShape 8s ease-in-out infinite',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '5%',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                animation: 'floatShape 6s ease-in-out infinite 1s',
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '15%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.06)',
                animation: 'floatShape 7s ease-in-out infinite 0.5s',
            }} />

            {/* Logo Container */}
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 900,
                color: 'white',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.35), 0 8px 24px rgba(14, 165, 233, 0.2)',
                animation: 'breathe 3s ease-in-out infinite',
                marginBottom: '2rem',
                fontFamily: 'Outfit, sans-serif',
            }}>
                SH
            </div>

            {/* Brand Name */}
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.04em',
                marginBottom: '0.5rem',
                animation: 'fadeSlideUp 0.8s ease-out 0.3s both',
                fontFamily: 'Outfit, sans-serif',
            }}>
                STOCK HERO
            </h1>

            {/* Tagline */}
            <p style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#64748B',
                letterSpacing: '0.02em',
                animation: 'fadeSlideUp 0.8s ease-out 0.5s both',
                fontFamily: 'Outfit, sans-serif',
            }}>
                Trade Smarter. Play Bolder.
            </p>

            {/* Loading Dots */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '3rem',
                animation: 'fadeSlideUp 0.8s ease-out 0.7s both',
            }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    animation: 'dotPulse 1.4s ease-in-out infinite',
                }} />
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#0EA5E9',
                    animation: 'dotPulse 1.4s ease-in-out infinite 0.2s',
                }} />
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#3B82F6',
                    animation: 'dotPulse 1.4s ease-in-out infinite 0.4s',
                }} />
            </div>

            {/* Embedded Keyframes */}
            <style>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1); box-shadow: 0 20px 60px rgba(16, 185, 129, 0.35), 0 8px 24px rgba(14, 165, 233, 0.2); }
                    50% { transform: scale(1.05); box-shadow: 0 25px 70px rgba(16, 185, 129, 0.45), 0 10px 30px rgba(14, 165, 233, 0.3); }
                }

                @keyframes fadeSlideUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes dotPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(0.7); opacity: 0.5; }
                }

                @keyframes floatShape {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
            `}</style>

            {/* Version Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '10px',
                color: 'rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                pointerEvents: 'none'
            }}>
                v2.6 MOBILE FIX
            </div>
        </div>
    );
}
