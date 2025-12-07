import React, { useState, useEffect } from 'react';
import { Share2, Copy, Gift, Users, Check, Star, Trophy, Zap, ArrowRight, ChevronLeft, Sparkles, Crown, Target } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from '../components/BurgerMenu';
import Toast from '../components/Toast';

export default function Invite() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState(null);
    const referralCode = "BHIDY2025";
    const referralLink = "https://bhidy.vercel.app/invite/BHIDY2025";

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setToast('Invite link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Mubasher Stock Game!',
                    text: 'Join me on Mubasher Stock Game and get 500 free coins! 🚀',
                    url: referralLink,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopy();
        }
    };

    // Blue Cola color: #0D85D8
    const blueColor = '#0D85D8';
    const blueDark = '#0A6DB8';
    const blueLight = '#3DA5F0';

    const milestones = [
        { count: 5, reward: 'Mystery Box', icon: Gift, status: 'active', progress: '3/5', color: blueColor, description: 'Unlock exclusive rewards' },
        { count: 10, reward: 'Pro Badge', icon: Star, status: 'locked', color: '#f59e0b', description: 'Show off your status' },
        { count: 25, reward: '10,000 Coins', icon: Trophy, status: 'locked', color: '#ef4444', description: 'Massive coin reward' },
    ];

    return (
        <div className="flex-col" style={{
            minHeight: '100dvh',
            padding: '1.5rem',
            gap: '1.5rem',
            paddingBottom: '6rem',
            background: 'linear-gradient(180deg, #f8fafc 0%, #e8f4fc 100%)'
        }}>

            {/* Header */}
            <div className="flex-col animate-fade-in" style={{ gap: '1rem' }}>
                <div className="flex-between">
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronLeft size={24} color="var(--text-primary)" />
                    </button>
                    <BurgerMenu />
                </div>

                <div className="flex-col flex-center" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <div className="animate-float" style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '28px',
                        background: `linear-gradient(135deg, ${blueColor} 0%, ${blueLight} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 16px 40px ${blueColor}60`,
                        marginBottom: '1.25rem',
                        position: 'relative'
                    }}>
                        {/* Shine effect */}
                        <div style={{
                            position: 'absolute',
                            top: '5px',
                            left: '10px',
                            width: '30px',
                            height: '15px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.4)',
                            filter: 'blur(4px)',
                            transform: 'rotate(-20deg)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            inset: '3px',
                            borderRadius: '25px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            pointerEvents: 'none'
                        }} />
                        <Gift size={42} color="white" strokeWidth={1.5} />
                    </div>

                    <h1 className="h1" style={{
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Invite Friends
                    </h1>
                    <p className="body-lg" style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        Get <span style={{ color: '#f59e0b', fontWeight: 800 }}>500 coins</span> for every friend who joins!
                    </p>
                </div>
            </div>

            {/* Main Reward Card - Blue Cola Color */}
            <div className="animate-slide-up" style={{
                background: `linear-gradient(135deg, ${blueColor} 0%, ${blueLight} 50%, ${blueDark} 100%)`,
                borderRadius: '24px',
                padding: '1.75rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px -10px ${blueColor}70`
            }}>
                {/* Shine overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    filter: 'blur(20px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '-20px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(15px)'
                }} />
                {/* Sparkle effect */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '40px',
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px white, 0 0 20px white',
                    opacity: 0.8
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '60px',
                    width: '5px',
                    height: '5px',
                    background: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px white, 0 0 15px white',
                    opacity: 0.6
                }} />

                <div className="flex-col flex-center" style={{ gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <Sparkles size={14} />
                        Double Reward Weekend
                    </div>

                    <div className="flex-center" style={{ gap: '2rem', width: '100%', justifyContent: 'space-around' }}>
                        <div className="flex-col flex-center">
                            <div style={{
                                fontSize: '2.75rem',
                                fontWeight: 900,
                                lineHeight: 1,
                                textShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }}>500</div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500, marginTop: '0.25rem' }}>For You</span>
                        </div>
                        <div style={{
                            width: '2px',
                            height: '50px',
                            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)',
                            borderRadius: '999px'
                        }} />
                        <div className="flex-col flex-center">
                            <div style={{
                                fontSize: '2.75rem',
                                fontWeight: 900,
                                lineHeight: 1,
                                textShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }}>500</div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500, marginTop: '0.25rem' }}>For Them</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Link Section */}
            <div className="flex-col animate-slide-up" style={{ gap: '0.875rem', animationDelay: '0.1s' }}>
                <div style={{
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        flex: 1,
                        padding: '0.875rem 1rem',
                        background: '#f8fafc',
                        borderRadius: '0.75rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {referralLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: copied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                            color: copied ? 'white' : 'var(--text-secondary)',
                            border: copied ? 'none' : '2px solid #e2e8f0',
                            borderRadius: '0.75rem',
                            width: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: copied ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                    >
                        {copied ? <Check size={22} /> : <Copy size={22} />}
                    </button>
                </div>

                <Button
                    variant="primary"
                    onClick={handleShare}
                    style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                        height: '3.25rem',
                        fontSize: '1rem'
                    }}
                >
                    <Share2 size={20} /> Share Invite Link
                </Button>
            </div>

            {/* Milestones */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem', animationDelay: '0.2s' }}>
                <div className="flex-between">
                    <h3 className="h3" style={{ fontSize: '1.125rem' }}>🎯 Milestones</h3>
                    <Badge style={{
                        background: `linear-gradient(135deg, ${blueColor} 0%, ${blueLight} 100%)`,
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        boxShadow: `0 4px 12px ${blueColor}40`
                    }}>
                        3 Friends Invited
                    </Badge>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                    marginBottom: '0.25rem'
                }}>
                    <div style={{
                        width: '60%',
                        height: '100%',
                        background: `linear-gradient(90deg, ${blueColor}, ${blueLight}, ${blueColor})`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite',
                        borderRadius: '999px'
                    }} />
                </div>

                <div className="flex-col" style={{ gap: '0.875rem' }}>
                    {milestones.map((milestone, index) => {
                        const Icon = milestone.icon;
                        const isLocked = milestone.status === 'locked';
                        const isActive = milestone.status === 'active';

                        return (
                            <Card key={index} style={{
                                padding: '1.25rem',
                                background: isActive
                                    ? `linear-gradient(135deg, ${milestone.color}08 0%, ${milestone.color}15 100%)`
                                    : 'white',
                                border: isActive ? `2px solid ${milestone.color}40` : '1px solid #e2e8f0',
                                opacity: isLocked ? 0.65 : 1,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}80)`
                                    }} />
                                )}
                                <div className="flex-between">
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <div style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: '16px',
                                            background: isLocked ? '#f1f5f9' : `linear-gradient(135deg, ${milestone.color}20 0%, ${milestone.color}10 100%)`,
                                            color: isLocked ? '#94a3b8' : milestone.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: isLocked ? 'none' : `0 4px 12px ${milestone.color}25`
                                        }}>
                                            <Icon size={26} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-col" style={{ gap: '0.2rem' }}>
                                            <span style={{
                                                fontWeight: 800,
                                                color: 'var(--text-primary)',
                                                fontSize: '1.05rem'
                                            }}>
                                                {milestone.count} Friends
                                            </span>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: isActive ? milestone.color : 'var(--text-secondary)',
                                                fontWeight: 600
                                            }}>
                                                Get {milestone.reward}
                                            </span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {milestone.description}
                                            </span>
                                        </div>
                                    </div>
                                    {milestone.progress ? (
                                        <Badge style={{
                                            background: `linear-gradient(135deg, ${milestone.color} 0%, ${milestone.color}cc 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 0.875rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 800,
                                            boxShadow: `0 4px 12px ${milestone.color}40`
                                        }}>
                                            {milestone.progress}
                                        </Badge>
                                    ) : (
                                        isLocked && <div style={{ fontSize: '1.5rem', opacity: 0.4 }}>🔒</div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
