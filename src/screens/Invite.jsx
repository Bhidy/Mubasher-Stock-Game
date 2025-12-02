import React, { useState } from 'react';
import { Share2, Copy, Gift, Users, Check, Star, Trophy, Zap, ArrowRight, ChevronLeft } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useNavigate } from 'react-router-dom';

export default function Invite() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const referralCode = "BHIDY2025";
    const referralLink = "https://bhidy.vercel.app/invite/BHIDY2025";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
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

    return (
        <div className="flex-col" style={{
            minHeight: '100dvh',
            padding: '1.5rem',
            gap: '2rem',
            paddingBottom: '6rem',
            background: 'var(--bg-primary)'
        }}>

            {/* Header */}
            <div className="flex-col animate-fade-in" style={{ gap: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                    }}
                >
                    <ChevronLeft size={24} color="var(--text-primary)" />
                </button>

                <div className="flex-col flex-center" style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <div className="animate-float" style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
                        marginBottom: '1.5rem',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: '4px',
                            borderRadius: '26px',
                            border: '2px solid rgba(255,255,255,0.2)',
                            pointerEvents: 'none'
                        }} />
                        <Gift size={48} color="white" strokeWidth={1.5} />
                    </div>

                    <h1 className="h1" style={{
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Invite Friends
                    </h1>
                    <p className="body-lg" style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        Get <span style={{ color: '#f59e0b', fontWeight: 800 }}>500 coins</span> for every friend who joins & plays!
                    </p>
                </div>
            </div>

            {/* Main Reward Card */}
            <div className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                borderRadius: '24px',
                padding: '2rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.5)'
            }}>
                {/* Glass Effect Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Decorative Circles */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(20px)'
                }} />

                <div className="flex-col flex-center" style={{ gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        🚀 Double Reward
                    </div>

                    <div className="flex-center" style={{ gap: '2rem', width: '100%', justifyContent: 'space-around' }}>
                        <div className="flex-col flex-center">
                            <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>500</span>
                            <span style={{ fontSize: '0.875rem', opacity: 0.8, fontWeight: 500 }}>For You</span>
                        </div>
                        <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)' }} />
                        <div className="flex-col flex-center">
                            <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>500</span>
                            <span style={{ fontSize: '0.875rem', opacity: 0.8, fontWeight: 500 }}>For Them</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Link Section */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem', animationDelay: '0.1s' }}>
                <div style={{
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '1.25rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
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
                            background: copied ? 'var(--success)' : 'white',
                            color: copied ? 'white' : 'var(--text-secondary)',
                            border: copied ? 'none' : '1px solid var(--border-color)',
                            borderRadius: '1rem',
                            width: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: copied ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                    >
                        {copied ? <Check size={24} /> : <Copy size={24} />}
                    </button>
                </div>

                <Button
                    variant="primary"
                    onClick={handleShare}
                    style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                        height: '3.5rem',
                        fontSize: '1.125rem'
                    }}
                >
                    <Share2 size={22} style={{ marginRight: '0.75rem' }} /> Share Link
                </Button>
            </div>

            {/* Milestones */}
            <div className="flex-col animate-slide-up" style={{ gap: '1.25rem', animationDelay: '0.2s' }}>
                <div className="flex-between">
                    <h3 className="h3">Milestones</h3>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>3 Friends Invited</span>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '10px',
                    background: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        width: '30%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                        borderRadius: '999px',
                        boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                    }} />
                </div>

                <div className="flex-col" style={{ gap: '1rem' }}>
                    <MilestoneCard
                        count={5}
                        reward="Mystery Box"
                        icon={<Gift size={24} />}
                        status="active"
                        progress="3/5"
                        color="#8b5cf6"
                    />
                    <MilestoneCard
                        count={10}
                        reward="Pro Badge"
                        icon={<Star size={24} />}
                        status="locked"
                        color="#f59e0b"
                    />
                    <MilestoneCard
                        count={25}
                        reward="10,000 Coins"
                        icon={<Trophy size={24} />}
                        status="locked"
                        color="#ef4444"
                    />
                </div>
            </div>
        </div>
    );
}

function MilestoneCard({ count, reward, icon, status, progress, color }) {
    const isLocked = status === 'locked';

    return (
        <div className="flex-between" style={{
            padding: '1.25rem',
            background: 'white',
            borderRadius: '1.25rem',
            border: isLocked ? '1px solid var(--border-color)' : `2px solid ${color}30`,
            opacity: isLocked ? 0.6 : 1,
            position: 'relative',
            boxShadow: isLocked ? 'none' : `0 8px 20px ${color}15`,
            transition: 'all 0.3s ease'
        }}>
            <div className="flex-center" style={{ gap: '1rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    background: isLocked ? '#f1f5f9' : `${color}15`,
                    color: isLocked ? '#94a3b8' : color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isLocked ? 'none' : `0 4px 10px ${color}20`
                }}>
                    {icon}
                </div>
                <div className="flex-col" style={{ gap: '0.25rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{count} Friends</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Get {reward}</span>
                </div>
            </div>
            {progress ? (
                <Badge style={{ background: color, color: 'white', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>{progress}</Badge>
            ) : (
                isLocked && <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>🔒</div>
            )}
        </div>
    );
}
