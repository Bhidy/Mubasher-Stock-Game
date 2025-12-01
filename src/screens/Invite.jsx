import React, { useState } from 'react';
import { Share2, Copy, Gift, Users, Check, Star, Trophy, Zap, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Invite() {
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
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header Section */}
            <div className="flex-col flex-center animate-fade-in" style={{ textAlign: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                    marginBottom: '0.5rem'
                }} className="animate-float">
                    <Gift size={40} color="white" />
                </div>
                <h1 className="h1" style={{ fontSize: '2rem' }}>Invite Friends</h1>
                <p className="body-lg" style={{ color: 'var(--text-secondary)' }}>
                    Get <span style={{ color: '#f59e0b', fontWeight: 700 }}>500 coins</span> for every friend who joins!
                </p>
            </div>

            {/* Main Reward Card */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                color: 'white',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                <div className="flex-col flex-center" style={{ gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        🚀 Double Reward
                    </div>
                    <div className="flex-center" style={{ gap: '2rem' }}>
                        <div className="flex-col flex-center">
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>500</span>
                            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>For You</span>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                        <div className="flex-col flex-center">
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>500</span>
                            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>For Them</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Referral Link Section */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>
                <h3 className="h3">Your Referral Link</h3>
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '0.75rem',
                        color: '#475569',
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {referralLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: copied ? '#10b981' : '#f1f5f9',
                            color: copied ? 'white' : '#475569',
                            border: 'none',
                            borderRadius: '0.75rem',
                            width: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>

                <Button variant="primary" onClick={handleShare} style={{
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                    <Share2 size={20} style={{ marginRight: '0.5rem' }} /> Share Link
                </Button>
            </div>

            {/* Milestones */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>
                <div className="flex-between">
                    <h3 className="h3">Milestones</h3>
                    <span className="caption" style={{ color: 'var(--primary)', fontWeight: 600 }}>3 Friends Invited</span>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{
                        width: '30%',
                        height: '100%',
                        background: 'var(--gradient-primary)',
                        borderRadius: '4px'
                    }} />
                </div>

                <div className="flex-col" style={{ gap: '0.75rem' }}>
                    <MilestoneCard
                        count={5}
                        reward="Mystery Box"
                        icon={<Gift size={20} />}
                        status="active"
                        progress="3/5"
                    />
                    <MilestoneCard
                        count={10}
                        reward="Pro Badge"
                        icon={<Star size={20} />}
                        status="locked"
                    />
                    <MilestoneCard
                        count={25}
                        reward="10,000 Coins"
                        icon={<Trophy size={20} />}
                        status="locked"
                    />
                </div>
            </div>

            {/* How it Works */}
            <Card className="animate-slide-up" style={{ background: '#f8fafc', border: 'none' }}>
                <h3 className="h3" style={{ marginBottom: '1rem' }}>How it works</h3>
                <div className="flex-col" style={{ gap: '1rem' }}>
                    <Step number="1" text="Share your unique link with friends" />
                    <Step number="2" text="They sign up and play their first game" />
                    <Step number="3" text="You both get 500 coins instantly!" />
                </div>
            </Card>

        </div>
    );
}

function MilestoneCard({ count, reward, icon, status, progress }) {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';

    return (
        <div className="flex-between" style={{
            padding: '1rem',
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid',
            borderColor: isLocked ? '#e2e8f0' : 'var(--primary)',
            opacity: isLocked ? 0.7 : 1,
            position: 'relative'
        }}>
            <div className="flex-center" style={{ gap: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: isLocked ? '#f1f5f9' : '#dbeafe',
                    color: isLocked ? '#94a3b8' : '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <div className="flex-col">
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{count} Friends</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Get {reward}</span>
                </div>
            </div>
            {progress ? (
                <Badge color="primary">{progress}</Badge>
            ) : (
                isLocked && <div style={{ fontSize: '1.2rem' }}>🔒</div>
            )}
        </div>
    );
}

function Step({ number, text }) {
    return (
        <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
            <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                flexShrink: 0
            }}>
                {number}
            </div>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</span>
        </div>
    );
}
