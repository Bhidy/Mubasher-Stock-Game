import React from 'react';

/**
 * A simple progress bar component.
 * @param {string} label - The label text above the bar.
 * @param {number} value - The progress value between 0 and 1 (e.g., 0.45 for 45%).
 * @param {string} color - The fill color of the progress bar.
 */
export default function ProgressBar({ label, value, color = '#3b82f6' }) {
    // Value is typically 0.x (e.g. 0.45 for 45%)
    const percentage = Math.min(100, Math.max(0, (value || 0) * 100));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 700 }}>{percentage.toFixed(2)}%</span>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
        </div>
    );
}
