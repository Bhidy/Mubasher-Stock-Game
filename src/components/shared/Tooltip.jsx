import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip Component - Displays contextual help text on hover
 * 
 * Usage:
 * <Tooltip text="This is helpful info">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export default function Tooltip({
    children,
    text,
    position = 'top', // 'top', 'bottom', 'left', 'right'
    delay = 300,
    maxWidth = 200
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top, left;

            switch (position) {
                case 'bottom':
                    top = triggerRect.bottom + 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + 8;
                    break;
                default: // top
                    top = triggerRect.top - tooltipRect.height - 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            }

            // Keep within viewport
            left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
            top = Math.max(8, top);

            setCoords({ top, left });
        }
    }, [isVisible, position]);

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                style={{ display: 'inline-block' }}
            >
                {children}
            </span>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        zIndex: 999999,
                        maxWidth,
                        padding: '0.5rem 0.75rem',
                        background: '#1E293B',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                        pointerEvents: 'none',
                        animation: 'fadeIn 0.15s ease-out',
                        lineHeight: 1.4,
                    }}
                >
                    {text}
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        ...(position === 'top' ? {
                            bottom: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid #1E293B',
                        } : position === 'bottom' ? {
                            top: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderBottom: '6px solid #1E293B',
                        } : position === 'left' ? {
                            right: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderLeft: '6px solid #1E293B',
                        } : {
                            left: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderRight: '6px solid #1E293B',
                        })
                    }} />
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
