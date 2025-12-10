import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Radar, Zap, Target, TrendingUp, BarChart2, Filter, Layers, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/shared/Toast';
import BurgerMenu from '../../components/BurgerMenu';

export default function InvestorAnalysis() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/analysis/${searchQuery.toUpperCase()}`);
        }
    };

    return (
        <div className="screen-container" style={{ paddingBottom: '6rem', background: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* Header Area */}
            <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <BurgerMenu />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
                            Analysis Center
                        </h1>
                    </div>
                </div>

                {/* SEARCH BAR (Primary Action) */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <form onSubmit={handleSearch}>
                        <div style={{
                            position: 'relative',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem',
                            border: '1px solid #f1f5f9'
                        }}>
                            <Search color="#64748b" style={{ marginLeft: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Search symbol, company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    width: '100%',
                                    marginLeft: '0.75rem',
                                    color: '#1e293b'
                                }}
                            />
                            <button type="submit" style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.6rem 1rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}>
                                Analyze
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- DASHBOARD CONTENT --- */}
            <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* 1. Technical Radar (Visual Feature) */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
                }}>
                    <div className="flex-between" style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
                                <Radar size={20} color="white" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Technical Radar</h2>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Live Market Scan</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>12</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 600 }}>Bullish Breakouts</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>Top Pick</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>2222.SR</div>
                            <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>+2.4% Today</div>
                        </div>
                    </div>
                </div>

                {/* 2. Opportunity Scanner (List/Grid) */}
                <div>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Opportunity Scanner</h3>
                        <button style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700, background: 'none', border: 'none' }}>View All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Undervalued Growth', count: 5, color: '#10b981', icon: TrendingUp },
                            { name: 'RSI Oversold (<30)', count: 12, color: '#f59e0b', icon: Zap },
                            { name: 'Golden Cross (SMA)', count: 3, color: '#8b5cf6', icon: Target }
                        ].map((scan, i) => (
                            <div key={i} style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        background: `${scan.color}15`,
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        color: scan.color
                                    }}>
                                        <scan.icon size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>{scan.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Technical Strategy</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{scan.count}</span>
                                    <ArrowRight size={16} color="#cbd5e1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Deep Dive Tools Grid */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Deep Analysis Tools</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <ToolCard
                            title="Fundamental"
                            desc="Balance Sheets & Ratios"
                            color="#3b82f6"
                            icon={<BarChart2 size={24} />}
                        />
                        <ToolCard
                            title="Technical"
                            desc="Charts & Patterns"
                            color="#10b981"
                            icon={<Layers size={24} />}
                        />
                        <ToolCard
                            title="Valuation"
                            desc="Fair Value Models"
                            color="#f59e0b"
                            icon={<Target size={24} />}
                        />
                        <ToolCard
                            title="Compare"
                            desc="Stock vs Peers"
                            color="#8b5cf6"
                            icon={<ArrowUpRight size={24} />}
                        />
                    </div>
                </div>

                {/* 4. AI Analyst Insight */}
                <div style={{
                    background: '#1e293b',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(30, 41, 59, 0.4)'
                }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={18} color="#fbbf24" fill="#fbbf24" />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24' }}>AI Insight of the Day</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
                        "Banking sector in KSA showing strong accumulation patterns ahead of earnings season. Watch for breakouts above 12,600."
                    </p>
                    <button style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        Read Full Report
                    </button>
                </div>

            </div>
        </div>
    );
}

function ToolCard({ title, desc, color, icon }) {
    const { showToast } = useToast();
    return (
        <div
            onClick={() => showToast(`Opening ${title} tool...`, 'info')}
            style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
        >
            <div style={{
                width: '48px', height: '48px',
                borderRadius: '14px',
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color,
                marginBottom: '1rem'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{desc}</div>
        </div>
    );
}
