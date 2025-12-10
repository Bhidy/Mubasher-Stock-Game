import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, TrendingUp, TrendingDown, Zap, Calendar, ArrowRight, Activity, Layers, BarChart3, PieChart } from 'lucide-react';
import BurgerMenu from '../../components/BurgerMenu';
import { useMarket } from '../../context/MarketContext';

export default function InvestorMarkets() {
    const navigate = useNavigate();
    const { setMarket } = useMarket();

    // Visual Sparkline (SVG)
    const Sparkline = ({ color, trend = 'up' }) => (
        <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path
                d={trend === 'up' ? "M0 35 Q 25 35, 35 20 T 70 20 T 100 5" : "M0 5 Q 25 5, 35 20 T 70 20 T 100 35"}
                fill="none"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d={trend === 'up'
                    ? "M0 35 Q 25 35, 35 20 T 70 20 T 100 5 V 40 H 0 Z"
                    : "M0 5 Q 25 5, 35 20 T 70 20 T 100 35 V 40 H 0 Z"}
                fill={color}
                fillOpacity="0.1"
            />
        </svg>
    );

    return (
        <div className="screen-container" style={{ paddingBottom: '6rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* --- HERO SECTION --- */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                padding: '1.5rem 1.5rem 3rem 1.5rem',
                borderBottomLeftRadius: '30px',
                borderBottomRightRadius: '30px',
                position: 'relative'
            }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <BurgerMenu dark />
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Global Markets</h1>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }}></div>
                                Live Session
                            </div>
                        </div>
                    </div>
                </div>

                {/* Major Indices Cards */}
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                    {/* Saudi Arabia */}
                    <div
                        onClick={() => { setMarket('sa'); navigate('/market'); }}
                        style={{ minWidth: '200px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>🇸🇦</span>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>TASI</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>OPEN</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>12,450.20</div>
                        <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingUp size={14} /> +0.65%
                        </div>
                        <div style={{ marginTop: '0.75rem' }}>
                            <Sparkline color="#10b981" trend="up" />
                        </div>
                    </div>

                    {/* US */}
                    <div
                        onClick={() => { setMarket('us'); navigate('/market'); }}
                        style={{ minWidth: '200px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>🇺🇸</span>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>S&P 500</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(251,191,36,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>PRE</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>5,105.30</div>
                        <div style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingUp size={14} /> +0.10%
                        </div>
                        <div style={{ marginTop: '0.75rem' }}>
                            <Sparkline color="#fbbf24" trend="up" />
                        </div>
                    </div>

                    {/* Egypt */}
                    <div
                        onClick={() => { setMarket('eg'); navigate('/market'); }}
                        style={{ minWidth: '200px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>🇪🇬</span>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>EGX 30</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>CLOSED</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>28,950.00</div>
                        <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingDown size={14} /> -1.25%
                        </div>
                        <div style={{ marginTop: '0.75rem' }}>
                            <Sparkline color="#ef4444" trend="down" />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', marginTop: '-1.5rem', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* --- 2. MARKET ANALYTICS DASHBOARD --- */}

                {/* Market Breadth & Sentiment */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Fear & Greed Gauge */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Activity size={14} /> Sentiment
                        </div>
                        <div style={{ position: 'relative', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden' }}>
                            <div style={{ width: '100px', height: '50px', borderTopLeftRadius: '60px', borderTopRightRadius: '60px', background: '#e2e8f0', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, borderRadius: '60px 60px 0 0', background: 'conic-gradient(from 180deg at 50% 100%, #ef4444 0deg, #eab308 90deg, #10b981 180deg)', transform: 'rotate(0deg)' }}></div>
                                <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '4px', height: '40px', background: '#1e293b', transform: 'translateX(-50%) rotate(45deg)', transformOrigin: 'bottom center', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>Greed (72)</div>
                    </div>

                    {/* Sector Leader */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Layers size={14} /> Top Sector
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>Banking</div>
                        <div style={{ color: '#10b981', fontWeight: 700 }}>+1.45%</div>
                        <div style={{ height: '4px', width: '100%', background: '#f1f5f9', marginTop: '0.75rem', borderRadius: '4px' }}>
                            <div style={{ width: '75%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                </div>

                {/* --- 3. SECTOR HEATMAP (CREATIVE) --- */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Sector Heatmap</h3>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time</span>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gridTemplateRows: 'repeat(2, 80px)',
                        gap: '0.5rem'
                    }}>
                        {/* Big Block */}
                        <div style={{
                            gridRow: '1 / span 2',
                            background: '#10b981',
                            borderRadius: '16px',
                            padding: '1rem', color: 'white',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                        }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Banks</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>+1.2%</span>
                        </div>

                        {/* Small Blocks */}
                        <div style={{ background: '#f87171', borderRadius: '16px', padding: '0.75rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Energy</span>
                            <span style={{ fontSize: '1rem', fontWeight: 800 }}>-0.5%</span>
                        </div>
                        <div style={{ background: '#34d399', borderRadius: '16px', padding: '0.75rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Tech</span>
                            <span style={{ fontSize: '1rem', fontWeight: 800 }}>+0.8%</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div style={{ background: '#94a3b8', borderRadius: '12px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>Real Est.</div>
                        <div style={{ background: '#10b981', borderRadius: '12px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>+0.4%</div>
                        <div style={{ background: '#f87171', borderRadius: '12px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>-0.2%</div>
                    </div>
                </div>

                {/* --- 4. TRADING EVENTS TIMELINE --- */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '12px' }}>
                                <Calendar size={20} color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Impact Events</h3>
                        </div>
                    </div>

                    <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #f1f5f9' }}>
                        {[
                            { time: '14:30', title: 'US CPI Data', region: 'US', impact: 'High', color: '#ef4444' },
                            { time: 'Tomorrow', title: 'Aramco Dividends', region: 'SA', impact: 'Med', color: '#f59e0b' },
                            { time: 'Thu', title: 'CBE Rate Decision', region: 'EG', impact: 'High', color: '#ef4444' }
                        ].map((event, i) => (
                            <div key={i} style={{ marginBottom: i === 2 ? 0 : '1.5rem', position: 'relative' }}>
                                {/* Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-21px',
                                    top: '0',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: event.color,
                                    boxShadow: `0 0 0 4px white`
                                }}></div>

                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{event.time}</div>
                                <div style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.95rem' }}>{event.title}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#475569' }}>{event.region}</span>
                                    <span style={{ fontSize: '0.7rem', color: event.color, fontWeight: 600 }}>{event.impact} Impact</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 5. COMMODITIES STRIP --- */}
                <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <CommodityCard name="Gold" price="2,150.40" change="+0.4%" isUp={true} color="#eab308" />
                        <CommodityCard name="Oil (Brent)" price="85.20" change="-0.2%" isUp={false} color="#1e293b" />
                        <CommodityCard name="Bitcoin" price="69,420" change="+2.5%" isUp={true} color="#f97316" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function CommodityCard({ name, price, change, isUp, color }) {
    return (
        <div style={{
            minWidth: '140px',
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{name}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{price}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isUp ? '#10b981' : '#ef4444' }}>{change}</div>
        </div>
    );
}
