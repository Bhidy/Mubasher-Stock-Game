import React, { useState } from 'react';
import { Trophy, Star, Zap, Gift, Shield, ArrowRight, X } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

export default function DailySpin() {
    const navigate = useNavigate();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState(null);

    const prizes = [
        { label: '50 Coins', value: 50, color: '#fbbf24', icon: <Star size={24} color="white" /> },
        { label: '100 Coins', value: 100, color: '#f59e0b', icon: <Star size={24} color="white" /> },
        { label: 'XP Boost', value: '2x', color: '#8b5cf6', icon: <Zap size={24} color="white" /> },
        { label: 'Mystery', value: '???', color: '#ec4899', icon: <Gift size={24} color="white" /> },
        { label: 'Freeze', value: '1 Day', color: '#3b82f6', icon: <Shield size={24} color="white" /> },
        { label: '25 Coins', value: 25, color: '#9ca3af', icon: <Star size={24} color="white" /> },
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
            // Calculate prize based on rotation
            // This is a simple mock logic for visual effect
            const winningIndex = Math.floor(Math.random() * prizes.length);
            setPrize(prizes[winningIndex]);
        }, 3000); // 3 seconds spin time matches CSS transition
    };

    return (
        <div className="flex-col flex-center" style={{
            minHeight: '100dvh',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>

            {/* Close Button */}
            <button
                onClick={() => navigate('/home')}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20
                }}
            >
                <X size={24} color="white" />
            </button>

            {/* Header */}
            <div className="flex-col flex-center animate-fade-in" style={{ marginBottom: '2rem', textAlign: 'center', zIndex: 10 }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    DAILY SPIN
                </h1>
                <p style={{ opacity: 0.8 }}>Spin everyday for free rewards!</p>
            </div>

            {/* Wheel Container */}
            <div style={{
                position: 'relative',
                width: '300px',
                height: '300px',
                marginBottom: '3rem',
                zIndex: 10
            }}>
                {/* Pointer */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '40px',
                    zIndex: 20,
                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))'
                }}>
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '20px solid transparent',
                        borderRight: '20px solid transparent',
                        borderTop: '40px solid white',
                    }} />
                </div>

                {/* The Wheel */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '8px solid white',
                    boxShadow: '0 0 50px rgba(251, 191, 36, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    background: '#1f2937'
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
                                    top: '-150px',
                                    width: '150px',
                                    height: '300px',
                                    background: item.color,
                                    transformOrigin: 'bottom right',
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)', // Simplified wedge shape
                                    transform: `rotate(${angle / 2}deg) skewY(-30deg)`, // Rough approximation for visual
                                    opacity: 0.9
                                }} />
                                <div style={{
                                    transform: `translateX(60px) rotate(0deg)`,
                                    zIndex: 5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 700,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
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
                    width: '60px',
                    height: '60px',
                    background: 'white',
                    borderRadius: '50%',
                    zIndex: 15,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    🎰
                </div>
            </div>

            {/* Action Button */}
            <Button
                onClick={handleSpin}
                disabled={isSpinning}
                style={{
                    background: isSpinning ? '#4b5563' : 'linear-gradient(to right, #fbbf24, #f59e0b)',
                    color: isSpinning ? '#9ca3af' : '#78350f',
                    fontSize: '1.25rem',
                    padding: '1rem 3rem',
                    borderRadius: '999px',
                    fontWeight: 800,
                    boxShadow: isSpinning ? 'none' : '0 0 30px rgba(245, 158, 11, 0.5)',
                    transform: isSpinning ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.2s',
                    border: 'none',
                    zIndex: 10
                }}
            >
                {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
            </Button>

            {/* Prize Modal */}
            {prize && (
                <div className="animate-fade-in" style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(8px)'
                }}>
                    <div className="animate-pulse-scale" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '2rem',
                        textAlign: 'center',
                        maxWidth: '300px',
                        width: '90%',
                        position: 'relative'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>YOU WON!</h2>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: prize.color,
                            marginBottom: '1.5rem'
                        }}>
                            {prize.label}
                        </div>
                        <Button
                            onClick={() => navigate('/home')}
                            style={{ width: '100%', background: '#111827', color: 'white' }}
                        >
                            Claim Reward
                        </Button>
                    </div>
                </div>
            )}

            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.3,
                pointerEvents: 'none'
            }} />

        </div>
    );
}
