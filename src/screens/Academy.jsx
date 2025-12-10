import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BurgerMenu from '../components/BurgerMenu';
import { useMarket } from '../context/MarketContext';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../components/shared/Toast';
import { BookOpen, TrendingUp, Target, Award, Lock, Play, CheckCircle, Clock } from 'lucide-react';

export default function Academy() {
    const navigate = useNavigate();
    const { market } = useMarket();
    const { showToast } = useToast();
    const { lessons: cmsLessons, loading } = useCMS();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mock user progress
    const [completedLessons] = useState(['lesson-1', 'lesson-2']);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    // Fallback lessons if CMS is empty
    const fallbackLessons = [
        {
            id: 'lesson-1',
            title: 'Stock Market Basics',
            description: 'Learn the fundamentals of stock trading',
            duration: 10,
            category: 'beginner',
            xpReward: 50,
            coinReward: 25,
            icon: '📚',
            isPublished: true
        },
        {
            id: 'lesson-2',
            title: 'Reading Stock Charts',
            description: 'Understand price movements and trends',
            duration: 15,
            category: 'beginner',
            xpReward: 75,
            coinReward: 30,
            icon: '📊',
            isPublished: true
        },
        {
            id: 'lesson-3',
            title: 'Risk Management',
            description: 'Protect your portfolio and minimize losses',
            duration: 12,
            category: 'intermediate',
            xpReward: 100,
            coinReward: 50,
            icon: '🛡️',
            isPublished: true
        },
        {
            id: 'lesson-4',
            title: 'Technical Indicators',
            description: 'Master RSI, MACD, and moving averages',
            duration: 20,
            category: 'advanced',
            xpReward: 150,
            coinReward: 75,
            icon: '📈',
            isPublished: true
        },
    ];

    // Use CMS lessons if available, otherwise use fallback
    const lessons = useMemo(() => {
        const data = cmsLessons.length > 0 ? cmsLessons : fallbackLessons;
        return data
            .filter(l => l.isPublished)
            .map((l, index) => ({
                id: l.id,
                title: l.title,
                desc: l.description,
                duration: `${l.duration} min`,
                category: l.category.charAt(0).toUpperCase() + l.category.slice(1),
                completed: completedLessons.includes(l.id),
                locked: index > completedLessons.length, // Lock lessons beyond current progress
                xp: l.xpReward,
                icon: l.icon || '📚',
                color: l.category === 'beginner' ? '#10b981' : l.category === 'intermediate' ? '#06b6d4' : '#f59e0b'
            }));
    }, [cmsLessons, completedLessons]);

    const achievements = [
        { id: 1, title: 'First Lesson', desc: 'Complete your first lesson', unlocked: completedLessons.length >= 1, icon: '🎓' },
        { id: 2, title: 'Quick Learner', desc: 'Complete 5 lessons', unlocked: completedLessons.length >= 5, icon: '⚡' },
        { id: 3, title: 'Master Trader', desc: 'Complete all lessons', unlocked: completedLessons.length >= lessons.length, icon: '👑' },
    ];

    const filteredLessons = selectedCategory === 'All'
        ? lessons
        : lessons.filter(l => l.category === selectedCategory);

    const completedCount = lessons.filter(l => l.completed).length;
    const progress = Math.round((completedCount / lessons.length) * 100);

    return (
        <div className="flex-col" style={{ padding: '1.5rem', gap: '1.5rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <h1 className="h1" style={{ fontSize: '2.5rem' }}>{market.flag} Academy</h1>
                    <BurgerMenu />
                </div>
                <p className="body-sm">Master the markets. Level up your skills.</p>
            </div>

            {/* Progress Card */}
            <Card className="animate-slide-up" style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '2px solid #10b981'
            }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <div>
                        <h3 className="h3">Your Progress</h3>
                        <p className="caption" style={{ color: '#065f46' }}>{completedCount} of {lessons.length} lessons completed</p>
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        background: 'white',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}>
                        🎓
                    </div>
                </div>
                <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '2px solid rgba(16, 185, 129, 0.3)'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'white',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }} />
                </div>
                <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                    <span className="caption" style={{ fontWeight: 700, color: '#065f46' }}>{progress}%</span>
                    <span className="caption" style={{ fontWeight: 700, color: '#065f46' }}>+{lessons.filter(l => !l.completed).reduce((sum, l) => sum + l.xp, 0)} XP available</span>
                </div>
            </Card>

            {/* Category Filter */}
            <div className="animate-slide-up">
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.625rem 1.25rem',
                                borderRadius: 'var(--radius-full)',
                                border: selectedCategory === cat ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                background: selectedCategory === cat ? '#d1fae5' : 'white',
                                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                boxShadow: selectedCategory === cat ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lessons */}
            <div className="animate-slide-up">
                <h3 className="h3" style={{ marginBottom: '1rem' }}>Lessons</h3>
                <div className="flex-col" style={{ gap: '1rem' }}>
                    {filteredLessons.map((lesson, index) => (
                        <Card
                            key={lesson.id}
                            onClick={() => {
                                if (!lesson.locked) {
                                    navigate(`/academy/lesson/${lesson.id}`);
                                } else {
                                    showToast('Complete previous lessons to unlock this one! 🔒', 'warning');
                                }
                            }}
                            style={{
                                padding: '1.25rem',
                                opacity: lesson.locked ? 0.6 : 1,
                                cursor: lesson.locked ? 'not-allowed' : 'pointer',
                                border: lesson.completed ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.05)',
                                background: lesson.completed ? 'linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)' : 'white',
                                animationDelay: `${index * 0.05}s`
                            }}
                            className="animate-slide-up"
                        >
                            <div className="flex-between">
                                <div className="flex-center" style={{ gap: '1rem', flex: 1 }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        background: `${lesson.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.75rem',
                                        border: `2px solid ${lesson.color}30`
                                    }}>
                                        {lesson.locked ? <Lock size={24} color="#94a3b8" /> : lesson.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', marginBottom: '0.25rem' }}>
                                            <h3 className="h3" style={{ fontSize: '1.125rem' }}>{lesson.title}</h3>
                                            {lesson.completed && <CheckCircle size={18} color="#10b981" />}
                                        </div>
                                        <p className="caption" style={{ marginBottom: '0.5rem' }}>{lesson.desc}</p>
                                        <div className="flex-center" style={{ gap: '0.75rem', justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
                                            <div className="flex-center" style={{ gap: '0.25rem', whiteSpace: 'nowrap' }}>
                                                <Clock size={14} color="var(--text-muted)" />
                                                <span className="caption">{lesson.duration}</span>
                                            </div>
                                            <Badge color="primary" style={{ whiteSpace: 'nowrap' }}>+{lesson.xp} XP</Badge>
                                            <Badge color="neutral" style={{ whiteSpace: 'nowrap' }}>{lesson.category}</Badge>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Learning Achievements */}
            <div className="animate-slide-up">
                <h3 className="h3" style={{ marginBottom: '1rem' }}>Learning Achievements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {achievements.map(achievement => (
                        <Card key={achievement.id} style={{
                            padding: '1.25rem',
                            textAlign: 'center',
                            opacity: achievement.unlocked ? 1 : 0.6,
                            background: achievement.unlocked ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f8fafc',
                            border: achievement.unlocked ? '2px solid #f59e0b' : '2px dashed #e2e8f0'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                {achievement.unlocked ? achievement.icon : '🔒'}
                            </div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                {achievement.title}
                            </h4>
                            <p className="caption">{achievement.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
