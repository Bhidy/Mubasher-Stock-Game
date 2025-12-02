import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Trophy, Star, Zap, Gift, Shield, X } from 'lucide-react';
import Button from './Button';

export default function DailySpinModal({ isOpen, onClose }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState(null);

    const prizes = [
        { label: '50 Coins', value: 50, color: '#fbbf24', icon: <Star size={24} color="white" fill="white" /> },
        { label: '100 Coins', value: 100, color: '#f59e0b', icon: <Star size={24} color="white" fill="white" /> },
        { label: 'XP Boost', value: '2x', color: '#8b5cf6', icon: <Zap size={24} color="white" fill="white" /> },
        { label: 'Mystery', value: '???', color: '#ec4899', icon: <Gift size={24} color="white" /> },
        { label: 'Freeze', value: '1 Day', color: '#3b82f6', icon: <Shield size={24} color="white" fill="white" /> },
        { label: '25 Coins', value: 25, color: '#9ca3af', icon: <Star size={24} color="white" fill="white" /> },
    ];

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setPrize(null);

        // Random rotation between 5 and 10 full spins (1800-3600 degrees) + random segment
        const randomSpins = 1800 + Math.random() * 1800;
        const newRotation = rotation + randomSpins;

        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const winningIndex = Math.floor(Math.random() * prizes.length);
            setPrize(prizes[winningIndex]);
        }, 3000);
    };

    const handleClaim = () => {
        setPrize(null);
        setRotation(0);
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
                padding: '1rem'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !prize && !isSpinning) {
                    onClose();
                }
            }}
        >
            <div
                className="animate-slide-up"
                style={{
                    background: 'radial-gradient(circle at 50% 30%, #4338ca 0%, #1e1b4b 100%)',
                    borderRadius: '1.5rem',
                    padding: '1.5rem 1.25rem',
                    maxWidth: '380px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 25px 100px rgba(0,0,0,0.5)',
                    color: 'white'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    opacity: 0.3,
                    pointerEvents: 'none',
                    borderRadius: '2rem'
                }} />

                {/* Close Button */}
                {!prize && !isSpinning && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10,
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} color="white" />
                    </button>
                )}

                {/* Header */}
                <div className="flex-col flex-center" style={{ marginBottom: '1.25rem', textAlign: 'center', zIndex: 1, position: 'relative' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#78350f',
                        marginBottom: '0.75rem',
                        boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)'
                    }}>
                        ✨ DAILY BONUS
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        marginBottom: '0.375rem',
                        background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        SPIN & WIN
                    </h1>
                    <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Your daily chance for free rewards!</p>
                </div>

                {/* Wheel Container */}
                <div style={{
                    position: 'relative',
                    width: '240px',
                    height: '240px',
                    margin: '0 auto 2rem',
                    zIndex: 1
                }}>
                    {/* Pointer */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                    }}>
                        <div style={{
                            width: 0,
                            height: 0,
                            borderLeft: '16px solid transparent',
                            borderRight: '16px solid transparent',
                            borderTop: '32px solid #fbbf24',
                        }} />
                    </div>

                    {/* The Wheel */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '10px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 60px rgba(67, 56, 202, 0.6), inset 0 0 30px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 3s cubic-bezier(0.15, 0.85, 0.35, 1)',
                        background: '#0f172a'
                    }}>
                        {prizes.map((item, index) => {
                            const angle = 360 / prizes.length;
                            return (
                                <div key={index} style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '50%',
                                    height: '2px',
                                    background: 'transparent',
                                    transformOrigin: 'left center',
                                    transform: `rotate(${index * angle}deg)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '-120px',
                                        width: '120px',
                                        height: '240px',
                                        background: `conic-gradient(from 0deg, ${item.color} 0deg, ${item.color} 60deg)`,
                                        transformOrigin: 'bottom right',
                                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                                        transform: `rotate(${angle / 2}deg) skewY(-30deg)`,
                                        opacity: 0.9,
                                        borderRight: '2px solid rgba(255,255,255,0.2)'
                                    }} />
                                    <div style={{
                                        transform: `translateX(50px) rotate(90deg)`,
                                        zIndex: 5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontWeight: 800,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                                        color: 'white'
                                    }}>
                                        {item.icon}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center Hub */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px',
                        background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e2e8f0 100%)',
                        borderRadius: '50%',
                        zIndex: 15,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '3px solid #cbd5e1'
                    }}>
                        🎰
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    style={{
                        background: isSpinning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                        color: isSpinning ? 'rgba(255,255,255,0.5)' : 'white',
                        fontSize: '1.1rem',
                        padding: '1rem 2.5rem',
                        borderRadius: '999px',
                        fontWeight: 800,
                        boxShadow: isSpinning ? 'none' : '0 0 40px rgba(245, 158, 11, 0.4), 0 4px 0 #b45309',
                        transform: isSpinning ? 'scale(0.95)' : 'translateY(0)',
                        transition: 'all 0.2s',
                        border: 'none',
                        textShadow: isSpinning ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
                </Button>

                {/* Prize Modal */}
                {prize && (
                    <div className="animate-fade-in" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                        backdropFilter: 'blur(12px)',
                        borderRadius: '2rem'
                    }}>
                        <div className="animate-pulse-scale" style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '2.5rem',
                            borderRadius: '2rem',
                            textAlign: 'center',
                            maxWidth: '320px',
                            width: '90%',
                            position: 'relative',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '5rem',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                            }}>
                                🎉
                            </div>

                            <h2 style={{
                                color: 'white',
                                fontSize: '2rem',
                                fontWeight: 900,
                                marginBottom: '0.5rem',
                                marginTop: '2rem',
                                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                                YOU WON!
                            </h2>

                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 900,
                                color: prize.color,
                                marginBottom: '2rem',
                                textShadow: `0 0 30px ${prize.color}80`
                            }}>
                                {prize.label}
                            </div>

                            <Button
                                onClick={handleClaim}
                                style={{
                                    width: '100%',
                                    background: 'white',
                                    color: '#1e1b4b',
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    boxShadow: '0 8px 20px rgba(255,255,255,0.2)'
                                }}
                            >
                                Claim Reward
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}
