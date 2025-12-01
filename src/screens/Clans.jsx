import React, { useState } from 'react';
import { Shield, Users, Trophy, Sword, Target, Plus, Search, MessageCircle, Crown, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Clans() {
    const [activeTab, setActiveTab] = useState('explore'); // explore, my-clan

    const topClans = [
        { rank: 1, name: "Wall Street Wolves", members: 48, score: "2.4M", trend: "+12%" },
        { rank: 2, name: "Diamond Hands", members: 50, score: "2.1M", trend: "+8%" },
        { rank: 3, name: "The Bull Run", members: 42, score: "1.9M", trend: "+15%" },
        { rank: 4, name: "Crypto Kings", members: 35, score: "1.5M", trend: "-2%" },
        { rank: 5, name: "Alpha Squad", members: 28, score: "1.2M", trend: "+5%" },
    ];

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="flex-between animate-fade-in" style={{ marginTop: '0.5rem' }}>
                <div>
                    <h1 className="h1">Clans</h1>
                    <p className="body-md" style={{ color: 'var(--text-secondary)' }}>Join forces. Win together.</p>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Shield size={24} color="var(--primary)" />
                </div>
            </div>

            {/* Clan Wars Banner */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)',
                    pointerEvents: 'none'
                }} />

                <div className="flex-between" style={{ position: 'relative', zIndex: 1, marginBottom: '1rem' }}>
                    <Badge style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                        ⚔️ WEEKLY WAR
                    </Badge>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', opacity: 0.9 }}>Ends in 2d 14h</span>
                </div>

                <div className="flex-between" style={{ position: 'relative', zIndex: 1 }}>
                    <div>
                        <h2 className="h2" style={{ color: 'white', marginBottom: '0.25rem' }}>Prize Pool</h2>
                        <div style={{ fontSize: '2rem', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            1,000,000 🪙
                        </div>
                    </div>
                    <Trophy size={48} color="#fbbf24" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex-center animate-slide-up" style={{ gap: '1rem' }}>
                <Button variant="primary" style={{ flex: 1, height: '3.5rem' }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Clan
                </Button>
                <Button variant="outline" style={{ flex: 1, height: '3.5rem', background: 'white' }}>
                    <Search size={20} style={{ marginRight: '0.5rem' }} /> Find Clan
                </Button>
            </div>

            {/* Top Clans List */}
            <div className="flex-col animate-slide-up" style={{ gap: '1rem' }}>
                <div className="flex-between">
                    <h3 className="h3">Top Clans</h3>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>View All</span>
                </div>

                <div className="flex-col" style={{ gap: '0.75rem' }}>
                    {topClans.map((clan) => (
                        <Card key={clan.rank} padding="1rem" style={{ border: '1px solid var(--border-color)' }}>
                            <div className="flex-between">
                                <div className="flex-center" style={{ gap: '1rem' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: clan.rank <= 3 ? '#fef3c7' : '#f1f5f9',
                                        color: clan.rank <= 3 ? '#d97706' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800
                                    }}>
                                        #{clan.rank}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{clan.name}</div>
                                        <div className="flex-center" style={{ gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <span className="flex-center" style={{ gap: '0.25rem' }}>
                                                <Users size={12} /> {clan.members}/50
                                            </span>
                                            <span>•</span>
                                            <span style={{ color: clan.trend.includes('+') ? 'var(--success)' : 'var(--danger)' }}>
                                                {clan.trend}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{clan.score}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Points</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Clan Chat Preview (Teaser) */}
            <Card className="animate-slide-up" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: 'none' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <MessageCircle size={20} color="#2563eb" />
                        <h3 className="h3" style={{ color: '#1e40af' }}>Clan Chat</h3>
                    </div>
                    <Badge color="primary">LIVE</Badge>
                </div>
                <div className="flex-col" style={{ gap: '0.75rem' }}>
                    <ChatMessage user="Alex" text="Just bought TSLA! 🚀" time="2m ago" />
                    <ChatMessage user="Sarah" text="Nice move! I'm holding AAPL." time="1m ago" />
                    <ChatMessage user="Mike" text="We need 5k more points to hit #1!" time="Just now" />
                </div>
                <Button variant="outline" style={{ marginTop: '1rem', background: 'white', border: 'none', color: '#2563eb' }}>
                    Join a Clan to Chat
                </Button>
            </Card>

        </div>
    );
}

function ChatMessage({ user, text, time }) {
    return (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e40af',
                flexShrink: 0
            }}>
                {user[0]}
            </div>
            <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '0 12px 12px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div className="flex-between" style={{ gap: '0.5rem', marginBottom: '0.125rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>{user}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{time}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0 }}>{text}</p>
            </div>
        </div>
    );
}
