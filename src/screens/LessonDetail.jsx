import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Play, CheckCircle, Lock, BookOpen, Trophy, Star, ChevronRight, Award } from 'lucide-react';

export default function LessonDetail() {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState([]);

    // Lesson data (in a real app, this would come from props or API)
    const lessonsData = {
        1: {
            id: 1,
            title: 'Stock Market Basics',
            desc: 'Learn the fundamentals of stock trading',
            duration: '10 min',
            xp: 50,
            icon: '📚',
            color: '#10b981',
            sections: [
                {
                    id: 1,
                    title: 'What is the Stock Market?',
                    content: 'The stock market is a marketplace where investors buy and sell shares of publicly traded companies. When you buy a stock, you become a partial owner of that company.',
                    keyPoints: [
                        'Stocks represent ownership in a company',
                        'Markets operate during trading hours (9:00 AM - 4:00 PM)',
                        'Prices fluctuate based on supply and demand'
                    ]
                },
                {
                    id: 2,
                    title: 'How Stock Prices Work',
                    content: 'Stock prices change throughout the day based on how many people want to buy versus how many want to sell. High demand drives prices up, while low demand drives prices down.',
                    keyPoints: [
                        'Price = what buyers are willing to pay',
                        'Market cap = share price × total shares',
                        'Volatility measures price fluctuations'
                    ]
                },
                {
                    id: 3,
                    title: 'Making Your First Trade',
                    content: 'To start trading, you need to open a brokerage account, deposit funds, research companies, and place buy or sell orders. Always start small and learn as you go.',
                    keyPoints: [
                        'Choose a reputable broker',
                        'Start with small amounts',
                        'Research before investing',
                        'Diversify your portfolio'
                    ]
                }
            ]
        },
        2: {
            id: 2,
            title: 'Reading Stock Charts',
            desc: 'Understand price movements and trends',
            duration: '15 min',
            xp: 75,
            icon: '📊',
            color: '#06b6d4',
            sections: [
                {
                    id: 1,
                    title: 'Chart Types',
                    content: 'There are three main chart types: line charts show simple price movement, bar charts show open/high/low/close, and candlestick charts provide detailed price action.',
                    keyPoints: [
                        'Line charts: simplest view',
                        'Bar charts: OHLC data',
                        'Candlesticks: most detailed'
                    ]
                },
                {
                    id: 2,
                    title: 'Identifying Trends',
                    content: 'Trends show the general direction of price movement. An uptrend has higher highs and higher lows. A downtrend has lower highs and lower lows.',
                    keyPoints: [
                        'Uptrend = bullish market',
                        'Downtrend = bearish market',
                        'Sideways = consolidation'
                    ]
                },
                {
                    id: 3,
                    title: 'Support and Resistance',
                    content: 'Support is a price level where buying pressure prevents further decline. Resistance is where selling pressure prevents further rise. These levels are crucial for entry and exit points.',
                    keyPoints: [
                        'Support = price floor',
                        'Resistance = price ceiling',
                        'Breakouts signal strong moves'
                    ]
                }
            ]
        },
        3: {
            id: 3,
            title: 'Risk Management',
            desc: 'Protect your portfolio and minimize losses',
            duration: '12 min',
            xp: 100,
            icon: '🛡️',
            color: '#f59e0b',
            sections: [
                {
                    id: 1,
                    title: 'Never Risk More Than You Can Afford',
                    content: 'The golden rule of trading is to only invest money you can afford to lose. Set aside an emergency fund first, and never use borrowed money for trading.',
                    keyPoints: [
                        'Build emergency fund first',
                        'Only use disposable income',
                        'Never trade on margin initially'
                    ]
                },
                {
                    id: 2,
                    title: 'Stop-Loss Orders',
                    content: 'A stop-loss is an automatic sell order that triggers when a stock reaches a certain price. This limits your potential loss on any trade.',
                    keyPoints: [
                        'Set stop-loss before entering',
                        'Typical range: 5-10% below buy price',
                        'Protects from emotional decisions'
                    ]
                },
                {
                    id: 3,
                    title: 'Portfolio Diversification',
                    content: 'Don\'t put all your eggs in one basket. Spread your investments across different sectors, industries, and asset classes to reduce risk.',
                    keyPoints: [
                        'Own 10-15 different stocks',
                        'Diversify across sectors',
                        'Balance growth and stability'
                    ]
                }
            ]
        }
    };

    const lesson = lessonsData[lessonId] || lessonsData[1];
    const progress = (completedSections.length / lesson.sections.length) * 100;
    const isCompleted = completedSections.length === lesson.sections.length;

    const handleNext = () => {
        if (!completedSections.includes(currentSection)) {
            setCompletedSections([...completedSections, currentSection]);
        }
        if (currentSection < lesson.sections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };

    const handleComplete = () => {
        if (!completedSections.includes(currentSection)) {
            setCompletedSections([...completedSections, currentSection]);
        }
        // Show completion animation/modal
        setTimeout(() => {
            navigate('/academy');
        }, 1500);
    };

    const currentSectionData = lesson.sections[currentSection];

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="animate-fade-in">
                <button
                    onClick={() => navigate('/academy')}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Academy</span>
                </button>

                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <div>
                        <h1 className="h2" style={{ marginBottom: '0.5rem' }}>{lesson.icon} {lesson.title}</h1>
                        <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>{lesson.desc}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <Card style={{ padding: '1rem', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                        <span className="caption" style={{ fontWeight: 700, color: '#1e40af' }}>
                            Section {currentSection + 1} of {lesson.sections.length}
                        </span>
                        <span className="caption" style={{ fontWeight: 700, color: '#1e40af' }}>
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </Card>
            </div>

            {/* Section Content */}
            <Card className="animate-slide-up" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-block',
                        background: `${lesson.color}15`,
                        color: lesson.color,
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        marginBottom: '1rem'
                    }}>
                        Section {currentSection + 1}
                    </div>
                    <h2 className="h2" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                        {currentSectionData.title}
                    </h2>
                    <p className="body" style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {currentSectionData.content}
                    </p>
                </div>

                {/* Key Points */}
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid #10b981'
                }}>
                    <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '1rem', justifyContent: 'flex-start' }}>
                        <Star size={20} color="#10b981" fill="#10b981" />
                        <h3 className="h3" style={{ color: '#065f46' }}>Key Takeaways</h3>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {currentSectionData.keyPoints.map((point, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                marginBottom: '0.75rem',
                                fontSize: '0.9375rem',
                                color: '#064e3b'
                            }}>
                                <CheckCircle size={20} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

            {/* Navigation Sections */}
            <div className="animate-slide-up">
                <h3 className="h3" style={{ marginBottom: '1rem' }}>All Sections</h3>
                <div className="flex-col" style={{ gap: '0.75rem' }}>
                    {lesson.sections.map((section, index) => (
                        <Card
                            key={section.id}
                            onClick={() => setCurrentSection(index)}
                            style={{
                                padding: '1rem',
                                cursor: 'pointer',
                                border: index === currentSection ? `2px solid ${lesson.color}` : '1px solid #e2e8f0',
                                background: completedSections.includes(index) ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div className="flex-between">
                                <div className="flex-center" style={{ gap: '0.75rem' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: completedSections.includes(index) ? '#10b981' : index === currentSection ? `${lesson.color}30` : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        color: completedSections.includes(index) ? 'white' : index === currentSection ? lesson.color : '#64748b'
                                    }}>
                                        {completedSections.includes(index) ? <CheckCircle size={18} /> : index + 1}
                                    </div>
                                    <span style={{
                                        fontWeight: 600,
                                        color: index === currentSection ? lesson.color : 'var(--text-primary)'
                                    }}>
                                        {section.title}
                                    </span>
                                </div>
                                <ChevronRight size={20} color={index === currentSection ? lesson.color : '#cbd5e1'} />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-center" style={{ gap: '1rem', marginTop: '1rem' }}>
                {currentSection < lesson.sections.length - 1 ? (
                    <>
                        {currentSection > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setCurrentSection(currentSection - 1)}
                                style={{ flex: 1 }}
                            >
                                Previous
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            style={{ flex: 1 }}
                        >
                            Next Section
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleComplete}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            fontSize: '1.1rem',
                            padding: '1rem'
                        }}
                    >
                        <div className="flex-center" style={{ gap: '0.5rem' }}>
                            <Trophy size={20} />
                            <span>Complete Lesson & Earn {lesson.xp} XP</span>
                        </div>
                    </Button>
                )}
            </div>

            {/* Completion Badge */}
            {isCompleted && (
                <Card className="animate-bounce-subtle" style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h3 className="h3" style={{ color: '#92400e', marginBottom: '0.25rem' }}>
                        Lesson Complete!
                    </h3>
                    <p className="body-sm" style={{ color: '#78350f' }}>
                        You've earned {lesson.xp} XP! Keep learning to unlock more rewards.
                    </p>
                </Card>
            )}
        </div>
    );
}
