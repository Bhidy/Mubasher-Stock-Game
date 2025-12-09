import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { UserContext } from '../../App';
import BurgerMenu from '../BurgerMenu';

export default function InvestorHeader({ alertsCount, marketStatus, portfolioData, greeting }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
            padding: '1.25rem 1rem 2rem 1rem',
            borderRadius: '0 0 32px 32px',
            position: 'relative',
            // Overflow removed to allow BurgerMenu to pop out
        }}>
            {/* Background Effects Container - Clipped */}
            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                borderRadius: '0 0 32px 32px',
            }}>
                {/* Subtle grid pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.5,
                }} />

                {/* Gradient orbs */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-40px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '-20px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
                }} />

            </div>

            {/* Top bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                position: 'relative',
            }}>
                <BurgerMenu variant="glass" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>

                    {/* Notifications - Single Bell Icon */}
                    <button
                        onClick={() => navigate('/notifications')}
                        style={{
                            position: 'relative',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '42px', height: '42px',
                        }}
                    >
                        <Bell size={20} color="white" />
                        {alertsCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#EF4444', // Red Dot
                                border: '1px solid rgba(255,255,255,0.2)'
                            }} />
                        )}
                    </button>

                    {/* Profile - Image Enforced */}
                    <button
                        onClick={() => navigate('/profile')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '0',
                            width: '42px',
                            height: '42px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', color: 'white', fontWeight: 700,
                            }}>
                                {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                    </button>

                    {/* Market Status Pill */}
                    <div style={{
                        padding: '0.5rem 0.875rem',
                        background: marketStatus.bg,
                        borderRadius: '999px',
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        height: '42px',
                    }}>
                        <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: marketStatus.color,
                            animation: marketStatus.status === 'Open' ? 'pulse 2s infinite' : 'none',
                        }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: marketStatus.color }}>
                            {marketStatus.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Greeting & Portfolio Value */}
            <div style={{ position: 'relative', color: 'white' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                    {greeting}, {user.name}
                </div>
                <div style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    marginBottom: '0.25rem',
                }}>
                    ${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: portfolioData.dayChange >= 0 ? '#4ADE80' : '#F87171',
                    }}>
                        {portfolioData.dayChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            ${Math.abs(portfolioData.dayChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                            ({portfolioData.dayChange >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
                        </span>
                    </div>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Today</span>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}
