import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, ArrowLeft, ChevronLeft, ChevronRight, Clock,
    AlertCircle, TrendingUp, DollarSign, Globe, Flag, Filter, Download
} from 'lucide-react';
import { useToast } from '../../components/shared/Toast';
import Tooltip from '../../components/shared/Tooltip';

// Mock economic events
const ECONOMIC_EVENTS = [
    {
        id: 1,
        date: '2024-12-09',
        time: '08:30',
        title: 'Non-Farm Payrolls',
        country: 'US',
        flag: '🇺🇸',
        impact: 'high',
        previous: '150K',
        forecast: '180K',
        actual: null,
        category: 'employment'
    },
    {
        id: 2,
        date: '2024-12-09',
        time: '10:00',
        title: 'Consumer Sentiment',
        country: 'US',
        flag: '🇺🇸',
        impact: 'medium',
        previous: '61.3',
        forecast: '62.0',
        actual: '63.8',
        category: 'sentiment'
    },
    {
        id: 3,
        date: '2024-12-10',
        time: '14:00',
        title: 'Fed Interest Rate Decision',
        country: 'US',
        flag: '🇺🇸',
        impact: 'high',
        previous: '5.50%',
        forecast: '5.50%',
        actual: null,
        category: 'rates'
    },
    {
        id: 4,
        date: '2024-12-10',
        time: '08:30',
        title: 'CPI YoY',
        country: 'US',
        flag: '🇺🇸',
        impact: 'high',
        previous: '3.2%',
        forecast: '3.1%',
        actual: null,
        category: 'inflation'
    },
    {
        id: 5,
        date: '2024-12-11',
        time: '07:00',
        title: 'GDP Growth Rate QoQ',
        country: 'UK',
        flag: '🇬🇧',
        impact: 'high',
        previous: '0.2%',
        forecast: '0.3%',
        actual: null,
        category: 'gdp'
    },
    {
        id: 6,
        date: '2024-12-11',
        time: '10:00',
        title: 'Crude Oil Inventories',
        country: 'US',
        flag: '🇺🇸',
        impact: 'medium',
        previous: '-2.1M',
        forecast: '+0.5M',
        actual: null,
        category: 'commodities'
    },
    {
        id: 7,
        date: '2024-12-12',
        time: '13:45',
        title: 'ECB Interest Rate Decision',
        country: 'EU',
        flag: '🇪🇺',
        impact: 'high',
        previous: '4.50%',
        forecast: '4.50%',
        actual: null,
        category: 'rates'
    },
];

const IMPACT_STYLES = {
    high: { bg: '#FEE2E2', color: '#DC2626', label: 'High Impact' },
    medium: { bg: '#FEF3C7', color: '#D97706', label: 'Medium' },
    low: { bg: '#DCFCE7', color: '#16A34A', label: 'Low' },
};

const CATEGORIES = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'rates', label: 'Interest Rates', icon: TrendingUp },
    { id: 'employment', label: 'Employment', icon: Globe },
    { id: 'inflation', label: 'Inflation', icon: DollarSign },
];

function EventCard({ event }) {
    const impact = IMPACT_STYLES[event.impact];
    const isPast = event.actual !== null;

    return (
        <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '0.75rem',
            border: '1px solid #E5E7EB',
            opacity: isPast ? 0.7 : 1,
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                {/* Time */}
                <div style={{
                    background: '#F3F4F6',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    textAlign: 'center',
                    minWidth: '60px',
                }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937' }}>
                        {event.time}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>
                        {event.flag} {event.country}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                            {event.title}
                        </h4>
                        <span style={{
                            padding: '0.125rem 0.375rem',
                            borderRadius: '999px',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            background: impact.bg,
                            color: impact.color,
                        }}>
                            {impact.label}
                        </span>
                    </div>

                    {/* Data Row */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.75rem',
                    }}>
                        <div>
                            <span style={{ color: '#9CA3AF' }}>Previous: </span>
                            <span style={{ fontWeight: 600, color: '#4B5563' }}>{event.previous}</span>
                        </div>
                        <div>
                            <span style={{ color: '#9CA3AF' }}>Forecast: </span>
                            <span style={{ fontWeight: 600, color: '#4B5563' }}>{event.forecast}</span>
                        </div>
                        {event.actual && (
                            <div>
                                <span style={{ color: '#9CA3AF' }}>Actual: </span>
                                <span style={{
                                    fontWeight: 700,
                                    color: parseFloat(event.actual) > parseFloat(event.forecast) ? '#10B981' : '#EF4444'
                                }}>
                                    {event.actual}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status */}
                {isPast ? (
                    <div style={{
                        padding: '0.25rem 0.5rem',
                        background: '#F3F4F6',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        color: '#6B7280',
                        fontWeight: 600,
                    }}>
                        RELEASED
                    </div>
                ) : (
                    <div style={{
                        padding: '0.25rem 0.5rem',
                        background: '#DBEAFE',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        color: '#2563EB',
                        fontWeight: 600,
                    }}>
                        UPCOMING
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InvestorCalendar() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeCategory, setActiveCategory] = useState('all');
    const [impactFilter, setImpactFilter] = useState('all');

    // Get dates for week view
    const getWeekDates = () => {
        const dates = [];
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Filter events
    const filteredEvents = ECONOMIC_EVENTS.filter(e => {
        const matchesCategory = activeCategory === 'all' || e.category === activeCategory;
        const matchesImpact = impactFilter === 'all' || e.impact === impactFilter;
        return matchesCategory && matchesImpact;
    });

    // Group by date
    const groupedEvents = {};
    filteredEvents.forEach(e => {
        if (!groupedEvents[e.date]) groupedEvents[e.date] = [];
        groupedEvents[e.date].push(e);
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingBottom: '120px',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                padding: '1rem 1rem 1.5rem 1rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.625rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </button>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0, flex: 1 }}>
                        Economic Calendar
                    </h1>
                    <Tooltip text="Sync to your calendar">
                        <button
                            onClick={() => showToast('Events synced to calendar! 📅', 'success')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.625rem',
                                cursor: 'pointer',
                            }}
                        >
                            <Download size={20} color="white" />
                        </button>
                    </Tooltip>
                </div>

                {/* Week Navigation */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                }}>
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() - 7);
                            setSelectedDate(newDate);
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronLeft size={18} color="white" />
                    </button>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() + 7);
                            setSelectedDate(newDate);
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronRight size={18} color="white" />
                    </button>
                </div>

                {/* Week Days */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.375rem',
                }}>
                    {weekDates.map((date, i) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const hasEvents = ECONOMIC_EVENTS.some(e => e.date === date.toISOString().split('T')[0]);

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                style={{
                                    background: isSelected ? 'white' : 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '0.5rem 0.25rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    fontSize: '0.65rem',
                                    color: isSelected ? '#6366F1' : 'rgba(255,255,255,0.7)',
                                    marginBottom: '0.125rem',
                                }}>
                                    {dayNames[i]}
                                </div>
                                <div style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: isSelected ? '#1F2937' : 'white',
                                }}>
                                    {date.getDate()}
                                </div>
                                {hasEvents && (
                                    <div style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: isSelected ? '#6366F1' : 'white',
                                        margin: '0.25rem auto 0',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '1rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
            }}>
                {CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.5rem 0.875rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: isActive ? '#6366F1' : 'white',
                                color: isActive ? 'white' : '#6B7280',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <cat.icon size={14} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Impact Filter */}
            <div style={{ padding: '0 1rem 0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'high', 'medium', 'low'].map(impact => (
                        <button
                            key={impact}
                            onClick={() => setImpactFilter(impact)}
                            style={{
                                padding: '0.375rem 0.625rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: impactFilter === impact ? '#1F2937' : '#F3F4F6',
                                color: impactFilter === impact ? 'white' : '#6B7280',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {impact === 'all' ? 'All Impact' : impact}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events List */}
            <div style={{ padding: '0 1rem' }}>
                {Object.keys(groupedEvents).length > 0 ? (
                    Object.entries(groupedEvents).map(([date, events]) => (
                        <div key={date} style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#6B7280',
                                marginBottom: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <Calendar size={14} />
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            {events.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#9CA3AF',
                    }}>
                        <Calendar size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>No events found</h3>
                        <p>Try adjusting your filters or selecting a different date.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
