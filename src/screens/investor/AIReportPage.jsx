import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2, Bookmark, Target, Brain, TrendingUp, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function AIReportPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('summary');

    // Default mock data if none provided (for safety)
    const reportData = location.state?.data || {
        title: "Banking Sector Accumulation Pattern",
        ticker: "KSA:BANKS",
        price: "12,450.20",
        change: "+1.2%",
        confidence: 88,
        summary: "Institutional accumulation detected across major KSA banking stocks. Order flow analysis suggests a breakout above 12,600 is imminent.",
        drivers: [
            "Strong Q3 earnings anticipation",
            "Oil price stability supporting credit growth",
            "Foreign institutional inflow increasing"
        ],
        action: "Buy on dip to 12,400 with stop loss at 12,250. Target 13,000.",
        risk: "Medium",
        horizon: "2-4 Weeks"
    };

    // Mock chart data
    const chartData = [
        { time: '10:00', value: 12400 },
        { time: '11:00', value: 12420 },
        { time: '12:00', value: 12380 },
        { time: '13:00', value: 12450 },
        { time: '14:00', value: 12500 },
        { time: '15:00', value: 12480 },
    ];

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{
            background: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 'safe-area-inset-bottom'
        }}>
            {/* Header */}
            <div style={{
                padding: '1.5rem 1.5rem 1rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 10,
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{ width: '100%' }}>
                    {/* Back Button & Badge Row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                    }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: '#f8fafc',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#475569'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div style={{
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 100%)',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #f0fdf4'
                        }}>
                            <Brain size={16} className="text-indigo-600" color="#4f46e5" />
                            <span style={{
                                color: '#4f46e5',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }}>AI Insight</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{
                                color: '#1e293b',
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                lineHeight: 1.1,
                                marginBottom: '8px',
                                background: 'linear-gradient(to right, #1e293b, #475569)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                maxWidth: '90%'
                            }}>{reportData.title}</h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>{reportData.ticker}</span>
                                <span style={{ color: '#cbd5e1' }}>|</span>
                                <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>{reportData.price}</span>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f0fdf4',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid #dcfce7'
                        }}>
                            <TrendingUp size={16} color="#16a34a" />
                            <span style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 700 }}>{reportData.change}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                paddingBottom: '100px' // Space for fixed footer
            }}>
                {/* Confidence Score Card - PREMIUM GRADIENT */}
                <div style={{
                    marginBottom: '32px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 10px 30px -10px rgba(79, 70, 229, 0.4)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative background circles */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', position: 'relative' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '4px' }}>AI Confidence Score</div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{reportData.confidence}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                            Very High
                        </div>
                    </div>

                    <div style={{
                        height: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${reportData.confidence}%`,
                            height: '100%',
                            background: 'white',
                            borderRadius: '4px',
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                        }} />
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    padding: '4px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    position: 'sticky',
                    top: '170px', // Adjust based on header height approximation
                    zIndex: 5
                }}>
                    {['summary', 'drivers', 'action'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab ? 'white' : 'transparent',
                                color: activeTab === tab ? '#0f172a' : '#64748b',
                                fontSize: '0.95rem',
                                fontWeight: activeTab === tab ? 700 : 500,
                                textTransform: 'capitalize',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: activeTab === tab ? '0 4px 12px -2px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ minHeight: '300px' }}>
                    {activeTab === 'summary' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <p style={{
                                color: '#334155',
                                lineHeight: '1.8',
                                fontSize: '1.1rem',
                                marginBottom: '24px',
                                paddingLeft: '16px',
                                borderLeft: '4px solid #6366f1'
                            }}>
                                {reportData.summary}
                            </p>
                            {/* Mini Chart */}
                            <div style={{
                                height: '240px',
                                width: '100%',
                                marginTop: '20px',
                                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                                borderRadius: '24px',
                                border: '1px solid #f1f5f9',
                                padding: '16px 0',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', top: 16, left: 24, fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>INTRA-DAY FORECAST</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fill="url(#colorValue)"
                                        />
                                        <XAxis hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'drivers' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {reportData.drivers.map((driver, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start',
                                        background: '#f8fafc',
                                        padding: '20px',
                                        borderRadius: '20px',
                                        border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{
                                            background: '#dcfce7',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            marginTop: '2px',
                                            flexShrink: 0
                                        }}>
                                            <TrendingUp size={18} color="#16a34a" />
                                        </div>
                                        <span style={{ color: '#334155', lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}>{driver}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'action' && (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
                                border: '1px solid #e0e7ff',
                                borderRadius: '24px',
                                padding: '24px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                                    <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                                        <Target size={22} color="#4f46e5" />
                                    </div>
                                    <h4 style={{ color: '#1e293b', fontWeight: 700, margin: 0, fontSize: '1.2rem' }}>Strategic Action</h4>
                                </div>
                                <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '1.05rem' }}>{reportData.action}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{
                                    flex: 1,
                                    background: '#fff7ed',
                                    border: '1px solid #ffedd5',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ color: '#9a3412', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Risk Level</div>
                                    <div style={{ color: '#c2410c', fontWeight: 800, fontSize: '1.25rem' }}>{reportData.risk}</div>
                                </div>
                                <div style={{
                                    flex: 1,
                                    background: '#f0fdf4',
                                    border: '1px solid #dcfce7',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ color: '#166534', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Time Horizon</div>
                                    <div style={{ color: '#15803d', fontWeight: 800, fontSize: '1.25rem' }}>{reportData.horizon}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons - Floating Glassmorphism */}
            <div style={{
                padding: '20px 24px calc(20px + safe-area-inset-bottom) 24px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: '12px',
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                zIndex: 20
            }}>
                <button style={{
                    flex: 1,
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                }}>
                    <Share2 size={20} />
                    Share
                </button>
                <button style={{
                    flex: 2,
                    background: '#0f172a', // Dark primary button for contrast
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px -6px rgba(15, 23, 42, 0.4)'
                }}>
                    <Bookmark size={20} />
                    Save Insight
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
