import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { UserContext } from '../../App';
import BurgerMenu from '../BurgerMenu';
import { useMarket, MARKETS } from '../../context/MarketContext';

export default function InvestorHeader({ alertsCount, marketStatus, portfolioData, greeting }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { market, selectMarket } = useMarket();
    const [showMarkets, setShowMarkets] = useState(false);
    // market is already the full object from context
    const currentMarket = market;

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

                    {/* Market Selector Button with Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowMarkets(!showMarkets)}
                            style={{
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                                borderRadius: '999px',
                                padding: '0.4rem 0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: 'none',
                                color: 'white',
                                height: '42px',
                                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                                {currentMarket?.flag || '🌍'}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                                {currentMarket?.id || 'ALL'}
                            </span>
                            <ChevronRight size={16} strokeWidth={3} style={{ transform: showMarkets ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMarkets && (
                            <div style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                background: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '16px',
                                padding: '0.5rem',
                                minWidth: '180px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                maxHeight: '280px', // Limit to ~5 items
                                overflowY: 'auto',
                            }}>
                                {MARKETS.map(m => {
                                    // 3-Char Mapping
                                    const ISO3 = {
                                        SA: 'KSA', EG: 'EGY', US: 'USA', IN: 'IND', UK: 'GBR', CA: 'CAN',
                                        AU: 'AUS', HK: 'HKG', DE: 'DEU', JP: 'JPN', AE: 'UAE', ZA: 'ZAF',
                                        QA: 'QAT', FR: 'FRA', CH: 'CHE', NL: 'NLD', ES: 'ESP', IT: 'ITA',
                                        BR: 'BRA', MX: 'MEX', KR: 'KOR', TW: 'TWN', SG: 'SGP'
                                    };
                                    const shortName = ISO3[m.id] || m.id;

                                    return (
                                        <div
                                            key={m.id}
                                            onClick={() => {
                                                selectMarket(m.id);
                                                setShowMarkets(false);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.625rem 0.875rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                background: market?.id === m.id ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                                                color: 'white',
                                                transition: 'background 0.2s',
                                                flexShrink: 0, // Prevent shrinking
                                            }}
                                            onMouseEnter={e => {
                                                if (market?.id !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }}
                                            onMouseLeave={e => {
                                                if (market?.id !== m.id) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>{m.flag}</span>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{shortName}</span>
                                            {market?.id === m.id && (
                                                <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
