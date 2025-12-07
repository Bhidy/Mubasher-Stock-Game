import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { ChevronLeft, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';

export default function DiscussionDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [likedReplies, setLikedReplies] = useState([]);

    // Sample discussion data
    const discussion = {
        id: id,
        title: 'Best stocks for beginners?',
        author: 'Khalid',
        time: '1h ago',
        category: 'Strategy',
        content: 'I\'m new to the Saudi stock market and looking for some advice on which stocks are best for beginners. Should I focus on blue-chip stocks like Aramco and SABIC, or are there other options I should consider?',
        likes: 45,
        replies: 23
    };

    const replies = [
        {
            id: 1,
            author: 'Yasser Al-Qahtani',
            avatar: '👑',
            time: '45m ago',
            content: 'Welcome! I\'d recommend starting with blue-chip stocks like 2222 (Aramco) and 1120 (Al Rajhi Bank). They\'re stable and less volatile.',
            likes: 12
        },
        {
            id: 2,
            author: 'Saad Al-Harbi',
            avatar: '💎',
            time: '30m ago',
            content: 'Great advice above! Also consider diversifying across sectors. Don\'t put all your eggs in one basket.',
            likes: 8
        },
        {
            id: 3,
            author: 'Noura',
            avatar: '⭐',
            time: '20m ago',
            content: 'I started with SABIC (2010) and it\'s been a good learning experience. The key is to start small and learn as you go.',
            likes: 15
        },
        {
            id: 4,
            author: 'Faisal',
            avatar: '🎯',
            time: '10m ago',
            content: 'Don\'t forget to check the Academy section! There are great lessons on stock fundamentals.',
            likes: 6
        }
    ];

    return (
        <div className="flex-col" style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Header */}
            <div style={{
                padding: '1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'linear-gradient(180deg, #f8fafc 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderBottom: '2px solid #e2e8f0'
            }}>
                <div className="flex-center" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronLeft size={24} color="var(--text-primary)" />
                    </button>
                    <h2 className="h2" style={{ fontSize: '1.5rem', margin: 0, flex: 1 }}>
                        Discussion
                    </h2>
                </div>
            </div>

            <div style={{ padding: '1.5rem', gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                {/* Original Post */}
                <Card style={{ padding: '1.5rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <div className="flex-center" style={{ gap: '0.75rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                border: '2px solid white',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                            }}>
                                {discussion.author[0]}
                            </div>
                            <div>
                                <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                                    <span style={{ fontWeight: 700 }}>{discussion.author}</span>
                                    <Badge color="info" style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>
                                        {discussion.category}
                                    </Badge>
                                </div>
                                <span className="caption">{discussion.time}</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="h2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{discussion.title}</h2>
                    <p style={{ lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        {discussion.content}
                    </p>

                    <div className="flex-center" style={{ gap: '1.5rem', justifyContent: 'flex-start', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                        <div className="flex-center" style={{ gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            <ThumbsUp size={18} />
                            <span style={{ fontWeight: 600 }}>{discussion.likes}</span>
                        </div>
                        <div className="flex-center" style={{ gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            <MessageCircle size={18} />
                            <span style={{ fontWeight: 600 }}>{discussion.replies} replies</span>
                        </div>
                    </div>
                </Card>

                {/* Replies */}
                <div>
                    <h3 className="h3" style={{ marginBottom: '1rem' }}>Replies ({replies.length})</h3>
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        {replies.map((reply) => (
                            <Card key={reply.id} style={{ padding: '1.25rem' }}>
                                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'var(--gradient-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                                        }}>
                                            {reply.avatar}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 700 }}>{reply.author}</span>
                                            <div>
                                                <span className="caption">{reply.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ lineHeight: 1.6, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {reply.content}
                                </p>

                                <div className="flex-center" style={{ gap: '1.5rem', justifyContent: 'flex-start', paddingTop: '0.5rem' }}>
                                    <button
                                        onClick={() => {
                                            setLikedReplies(prev =>
                                                prev.includes(reply.id)
                                                    ? prev.filter(id => id !== reply.id)
                                                    : [...prev, reply.id]
                                            );
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            cursor: 'pointer',
                                            color: likedReplies.includes(reply.id) ? 'var(--primary)' : 'var(--text-secondary)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <ThumbsUp size={16} fill={likedReplies.includes(reply.id) ? 'currentColor' : 'none'} />
                                        {reply.likes + (likedReplies.includes(reply.id) ? 1 : 0)}
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Add Reply */}
                <Card style={{ padding: '1.25rem' }}>
                    <h3 className="h3" style={{ marginBottom: '1rem' }}>Add Your Reply</h3>
                    <textarea
                        placeholder="Share your thoughts..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                    <button style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        Post Reply
                    </button>
                </Card>
            </div>
        </div>
    );
}
