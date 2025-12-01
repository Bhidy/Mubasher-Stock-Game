import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { TrendingUp, Award, Users, ChevronRight, Zap, Target, Trophy, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const slides = [
        {
            icon: TrendingUp,
            title: "Pick 3 Stocks Daily",
            desc: "Choose your top performers before market close. Build your winning strategy.",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            accentColor: "#10b981",
            lightBg: "#d1fae5",
            particles: [
                { top: '15%', left: '10%', size: '80px', delay: '0s' },
                { top: '60%', right: '15%', size: '60px', delay: '1s' },
                { top: '75%', left: '20%', size: '40px', delay: '2s' },
            ]
        },
        {
            icon: Users,
            title: "Compete & Climb",
            desc: "Battle thousands of players. Rise through the ranks and prove your skills.",
            gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            accentColor: "#06b6d4",
            lightBg: "#dbeafe",
            particles: [
                { top: '20%', right: '10%', size: '70px', delay: '0.5s' },
                { top: '50%', left: '10%', size: '90px', delay: '1.5s' },
                { top: '80%', right: '20%', size: '50px', delay: '2.5s' },
            ]
        },
        {
            icon: Award,
            title: "Earn Rewards",
            desc: "Collect coins, unlock badges, level up. Pure skill, zero risk.",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            accentColor: "#f59e0b",
            lightBg: "#fef3c7",
            particles: [
                { top: '10%', left: '15%', size: '65px', delay: '0.3s' },
                { top: '55%', right: '10%', size: '75px', delay: '1.3s' },
                { top: '85%', left: '25%', size: '55px', delay: '2.3s' },
            ]
        }
    ];

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        }
    };

    const currentSlide = slides[step];

    return (
        <div className="flex-col" style={{
            height: '100dvh',
            padding: '0.75rem', /* Reduced padding */
            paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            background: 'white',
            transition: 'all 0.5s ease'
        }}>

            {/* Animated Particles */}
            {currentSlide.particles.map((particle, i) => (
                <div
                    key={i}
                    className="animate-float"
                    style={{
                        position: 'absolute',
                        top: particle.top,
                        left: particle.left,
                        right: particle.right,
                        width: particle.size,
                        height: particle.size,
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        background: `${currentSlide.accentColor}15`,
                        filter: 'blur(25px)',
                        animationDelay: particle.delay,
                        animationDuration: '8s',
                        transition: 'all 0.5s ease'
                    }}
                />
            ))}

            {/* Header with Logo - Restored Size, Minimal Spacing */}
            <div className="flex-center flex-col animate-fade-in" style={{
                marginTop: '0.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    width: '80px', /* Restored Size */
                    height: '80px', /* Restored Size */
                    borderRadius: '24px',
                    background: currentSlide.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 15px 40px ${currentSlide.accentColor}40`,
                    marginBottom: '0.5rem', /* Reduced Margin */
                    position: 'relative',
                    transition: 'all 0.5s ease',
                    border: '3px solid white'
                }} className="animate-pulse-scale">
                    {/* Inner glow */}
                    <div style={{
                        position: 'absolute',
                        inset: '6px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none'
                    }} />
                    <Zap size={36} color="white" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                </div>
                <h1 style={{
                    fontSize: '1.75rem', /* Restored Size */
                    fontWeight: 900,
                    textAlign: 'center',
                    marginBottom: '0',
                    color: currentSlide.accentColor,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    transition: 'color 0.5s ease'
                }}>
                    Mubasher<br />Stock Game
                </h1>
                <p style={{
                    color: currentSlide.accentColor,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    marginTop: '0.25rem'
                }}>
                    Trade Smart. Win Big.
                </p>
            </div>

            {/* Carousel Content - Restored Size, Minimal Spacing */}
            <div className="flex-col flex-center" style={{ flex: 1, textAlign: 'center', maxWidth: '360px', margin: '0 auto', position: 'relative', zIndex: 10, justifyContent: 'center', gap: '0.25rem' }}>
                {/* Icon Circle */}
                <div style={{
                    width: '120px', /* Restored Size */
                    height: '120px', /* Restored Size */
                    borderRadius: '50%',
                    background: currentSlide.lightBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem', /* Reduced Margin */
                    boxShadow: `0 30px 80px ${currentSlide.accentColor}20`,
                    border: `6px solid ${currentSlide.accentColor}20`,
                    position: 'relative',
                    transition: 'all 0.5s ease'
                }} className="animate-pulse-scale">
                    {/* Rotating ring */}
                    <div style={{
                        position: 'absolute',
                        inset: '-12px',
                        borderRadius: '50%',
                        border: `3px dashed ${currentSlide.accentColor}30`,
                        animation: 'spin 20s linear infinite'
                    }} />

                    {/* Icon with gradient background */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: currentSlide.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 24px ${currentSlide.accentColor}40`
                    }}>
                        {React.createElement(currentSlide.icon, {
                            size: 40,
                            color: 'white',
                            strokeWidth: 2.5,
                            style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
                        })}
                    </div>
                </div>

                {/* Text Content */}
                <div>
                    <h2 className="h2" style={{
                        marginBottom: '0.25rem',
                        fontSize: '1.75rem', /* Restored Size */
                        color: currentSlide.accentColor,
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        transition: 'color 0.5s ease'
                    }}>
                        {currentSlide.title}
                    </h2>
                    <p className="body-lg" style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        fontSize: '1rem', /* Restored Size */
                        maxWidth: '300px',
                        margin: '0 auto'
                    }}>
                        {currentSlide.desc}
                    </p>
                </div>

                {/* Progress Dots */}
                <div className="flex-center" style={{ gap: '0.5rem', marginTop: '0.75rem' }}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setStep(i)}
                            style={{
                                width: i === step ? '48px' : '12px',
                                height: '12px',
                                borderRadius: '6px',
                                background: i === step ? currentSlide.gradient : '#cbd5e1',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                boxShadow: i === step ? `0 4px 12px ${currentSlide.accentColor}40` : 'none',
                                border: 'none',
                                padding: 0
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-col" style={{ gap: '0.5rem', width: '100%', position: 'relative', zIndex: 10 }}>
                {step < slides.length - 1 ? (
                    <>
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            style={{
                                background: currentSlide.gradient,
                                boxShadow: `0 8px 24px ${currentSlide.accentColor}40`,
                                fontSize: '1rem',
                                padding: '1rem 2rem',
                                borderRadius: '9999px',
                                fontWeight: 700,
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            Continue <ArrowRight size={20} strokeWidth={2.5} />
                        </Button>
                        <Button
                            onClick={() => navigate('/home')}
                            variant="outline"
                            style={{
                                color: currentSlide.accentColor,
                                borderColor: currentSlide.accentColor,
                                background: 'white',
                                fontSize: '1rem',
                                padding: '1rem 2rem',
                                borderRadius: '9999px',
                                fontWeight: 700,
                                border: `2px solid ${currentSlide.accentColor}`
                            }}
                        >
                            Skip Tutorial
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => navigate('/home')}
                            variant="primary"
                            style={{
                                background: currentSlide.gradient,
                                boxShadow: `0 8px 24px ${currentSlide.accentColor}40`,
                                fontSize: '1rem',
                                padding: '1rem 2rem',
                                borderRadius: '9999px',
                                fontWeight: 700,
                                color: 'white'
                            }}
                        >
                            Start Playing <Zap size={20} strokeWidth={2.5} />
                        </Button>
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.25rem',
                            fontWeight: 600
                        }}>
                            No real money. Just pure skill & fun. 🎮
                        </div>
                    </>
                )}
            </div>

            {/* Add rotation animation */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
