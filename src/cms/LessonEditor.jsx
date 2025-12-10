
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
    Save, ArrowLeft, Book, Clock, Layout, Type, Send,
    HelpCircle, Plus, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';

const CATEGORIES = ['beginner', 'intermediate', 'advanced'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function LessonEditor({ initialData, onClose, onSave, isSaving }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '', // This will be the main rich text content
        category: 'beginner',
        difficulty: 'easy',
        duration: 5,
        xpReward: 50,
        coinReward: 25,
        isPublished: false,
        quiz: [] // Array of { question, options, correctIndex }
    });

    const [activeTab, setActiveTab] = useState('content'); // content | quiz
    const [quizQuestion, setQuizQuestion] = useState('');
    const [quizOptions, setQuizOptions] = useState(['', '', '']);
    const [quizCorrect, setQuizCorrect] = useState(0);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                quiz: initialData.quiz || []
            });
        }
    }, [initialData]);

    const handleAddQuizQuestion = () => {
        if (!quizQuestion.trim() || quizOptions.some(o => !o.trim())) {
            alert("Please fill in question and all options.");
            return;
        }

        setFormData(prev => ({
            ...prev,
            quiz: [...prev.quiz, { question: quizQuestion, options: [...quizOptions], correctIndex: quizCorrect }]
        }));

        // Reset inputs
        setQuizQuestion('');
        setQuizOptions(['', '', '']);
        setQuizCorrect(0);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header style={{ height: '64px', background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>{initialData ? 'Edit Lesson' : 'New Lesson'}</span>
                        <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '999px', background: formData.isPublished ? '#DCFCE7' : '#FEF3C7', color: formData.isPublished ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                            {formData.isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginRight: '0.5rem' }}>
                        {isSaving ? 'Saving...' : 'Changes saved locally'}
                    </span>
                    <button
                        onClick={() => onSave({ ...formData, isPublished: false })}
                        style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={() => onSave({ ...formData, isPublished: true })}
                        style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <Send size={18} /> Publish
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left: Content Editor */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => setActiveTab('content')}
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: activeTab === 'content' ? '#EDE9FE' : 'transparent', color: activeTab === 'content' ? '#7C3AED' : '#64748B', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                                Content
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: activeTab === 'quiz' ? '#EDE9FE' : 'transparent', color: activeTab === 'quiz' ? '#7C3AED' : '#64748B', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                                Quiz Builder ({formData.quiz.length})
                            </button>
                        </div>

                        {activeTab === 'content' ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Lesson Title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', fontSize: '2.5rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#1E293B', marginBottom: '1.5rem', lineHeight: 1.2 }}
                                />

                                <div className="editor-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', minHeight: '500px' }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description || ''}
                                        onChange={(content) => setFormData({ ...formData, description: content })}
                                        modules={modules}
                                        style={{ height: '450px' }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quiz Questions</h3>

                                {formData.quiz.map((q, qIndex) => (
                                    <div key={qIndex} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontWeight: 600 }}>{qIndex + 1}. {q.question}</h4>
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, quiz: prev.quiz.filter((_, i) => i !== qIndex) }))}
                                                style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                            {q.options.map((opt, i) => (
                                                <div key={i} style={{ padding: '0.5rem', background: i === q.correctIndex ? '#DCFCE7' : '#F8FAFC', borderRadius: '6px', fontSize: '0.9rem', color: i === q.correctIndex ? '#16A34A' : '#64748B' }}>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div style={{ background: '#F8FAFC', border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Add New Question</h4>
                                    <input
                                        type="text"
                                        placeholder="Question text..."
                                        value={quizQuestion}
                                        onChange={e => setQuizQuestion(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}
                                    />
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>Options (Select correct answer)</label>
                                        {quizOptions.map((opt, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={quizCorrect === i}
                                                    onChange={() => setQuizCorrect(i)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${i + 1}`}
                                                    value={opt}
                                                    onChange={e => {
                                                        const newOpts = [...quizOptions];
                                                        newOpts[i] = e.target.value;
                                                        setQuizOptions(newOpts);
                                                    }}
                                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleAddQuizQuestion}
                                        style={{ width: '100%', padding: '0.75rem', background: '#7C3AED', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right: Sidebar Properties */}
                <aside style={{ width: '320px', background: 'white', borderLeft: '1px solid #E2E8F0', overflowY: 'auto', padding: '1.5rem' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Book size={16} /> Lesson Details
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Difficulty</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {DIFFICULTIES.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setFormData({ ...formData, difficulty: d })}
                                        style={{
                                            flex: 1, padding: '0.5rem', borderRadius: '6px',
                                            border: formData.difficulty === d ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                                            background: formData.difficulty === d ? '#F3E8FF' : 'white',
                                            color: formData.difficulty === d ? '#7C3AED' : '#64748B',
                                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Estimated Duration (min)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HelpCircle size={16} /> Rewards
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>XP Points</label>
                                <input
                                    type="number"
                                    value={formData.xpReward}
                                    onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>Coins</label>
                                <input
                                    type="number"
                                    value={formData.coinReward}
                                    onChange={e => setFormData({ ...formData, coinReward: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    );
}
