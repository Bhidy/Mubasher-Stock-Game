import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

/**
 * SwipeablePages - Instagram-like horizontal swipe navigation
 * 
 * Features:
 * - Smooth spring animations
 * - Partial swipe preview
 * - Edge bounce effect
 * - Scroll position preservation
 * - Conflict detection for nested scrollables
 */

// Memoized page wrapper to prevent unnecessary re-renders
const PageWrapper = memo(({ children, isActive, pageIndex, scrollPositions }) => {
    const pageRef = useRef(null);

    // Restore scroll position when page becomes active
    useEffect(() => {
        if (isActive && pageRef.current) {
            const savedPosition = scrollPositions.current[pageIndex] || 0;
            pageRef.current.scrollTop = savedPosition;
        }
    }, [isActive, pageIndex]);

    // Save scroll position when scrolling
    const handleScroll = useCallback((e) => {
        scrollPositions.current[pageIndex] = e.target.scrollTop;
    }, [pageIndex]);

    return (
        <div
            ref={pageRef}
            onScroll={handleScroll}
            style={{
                width: '100%',
                height: '100%',
                flexShrink: 0,
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                // Only allow interaction on active page
                pointerEvents: isActive ? 'auto' : 'none',
                // GPU acceleration
                willChange: isActive ? 'auto' : 'transform',
            }}
        >
            {children}
        </div>
    );
});

PageWrapper.displayName = 'PageWrapper';

export default function SwipeablePages({
    children,
    activeIndex,
    onPageChange,
    disabled = false,
    threshold = 0.2, // 20% of screen width
    springConfig = { tension: 300, friction: 30 },
}) {
    const containerRef = useRef(null);
    const scrollPositions = useRef({});
    const [containerWidth, setContainerWidth] = useState(0);
    const totalPages = React.Children.count(children);

    // Track if we're currently dragging
    const [isDragging, setIsDragging] = useState(false);

    // Spring animation for the container position
    const [{ x }, api] = useSpring(() => ({
        x: 0,
        config: springConfig,
    }));

    // Update container width on mount and resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Update position when activeIndex changes externally (e.g., nav click)
    useEffect(() => {
        if (!isDragging && containerWidth > 0) {
            api.start({ x: -activeIndex * containerWidth });
        }
    }, [activeIndex, containerWidth, isDragging, api]);

    // Check if touch started on a horizontally scrollable element
    const isHorizontalScrollable = useCallback((element) => {
        while (element && element !== containerRef.current) {
            const style = window.getComputedStyle(element);
            const overflowX = style.getPropertyValue('overflow-x');
            const scrollWidth = element.scrollWidth;
            const clientWidth = element.clientWidth;

            // If element has horizontal scroll capability
            if (
                (overflowX === 'auto' || overflowX === 'scroll') &&
                scrollWidth > clientWidth
            ) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }, []);

    // Drag gesture handler
    const bind = useDrag(
        ({
            movement: [mx],
            velocity: [vx],
            direction: [dx],
            down,
            cancel,
            event,
            first,
            last
        }) => {
            // Skip if disabled
            if (disabled) return;

            // On first touch, check if we should cancel for nested scrollables
            if (first) {
                const target = event.target;
                if (isHorizontalScrollable(target)) {
                    cancel();
                    return;
                }
                setIsDragging(true);
            }

            if (last) {
                setIsDragging(false);
            }

            // Calculate the current position
            const baseX = -activeIndex * containerWidth;

            if (down) {
                // During drag: follow finger with resistance at edges
                let newX = baseX + mx;

                // Add resistance at edges (rubber band effect)
                if (activeIndex === 0 && mx > 0) {
                    // At first page, trying to go back
                    newX = baseX + mx * 0.3;
                } else if (activeIndex === totalPages - 1 && mx < 0) {
                    // At last page, trying to go forward
                    newX = baseX + mx * 0.3;
                }

                api.start({ x: newX, immediate: true });
            } else {
                // On release: determine if we should navigate
                // iOS PWA FIX: Increase thresholds to prevent ghost swipes
                const swipeThreshold = containerWidth * threshold;
                const velocityThreshold = 0.8; // Increased from 0.5 for iOS stability
                const minSwipeDistance = 50; // Minimum pixels to consider a swipe

                let newIndex = activeIndex;

                // iOS PWA FIX: Require BOTH minimum distance AND (threshold OR velocity)
                // This prevents ghost swipes from accidental touches
                const hasMinDistance = Math.abs(mx) > minSwipeDistance;
                const hasEnoughSwipe = Math.abs(mx) > swipeThreshold;
                const hasEnoughVelocity = Math.abs(vx) > velocityThreshold;

                // Check if swipe was strong enough to trigger navigation
                if (hasMinDistance && (hasEnoughSwipe || hasEnoughVelocity)) {
                    if (mx > 0 && activeIndex > 0) {
                        // Swipe right - go to previous page
                        newIndex = activeIndex - 1;
                    } else if (mx < 0 && activeIndex < totalPages - 1) {
                        // Swipe left - go to next page
                        newIndex = activeIndex + 1;
                    }
                }

                // Animate to final position
                api.start({ x: -newIndex * containerWidth });

                // Notify parent of page change
                if (newIndex !== activeIndex) {
                    onPageChange(newIndex);
                }
            }
        },
        {
            axis: 'x',
            filterTaps: true,
            from: () => [x.get(), 0],
            rubberband: true,
            bounds: {
                left: -(totalPages - 1) * containerWidth,
                right: 0,
            },
            // iOS PWA FIX: Increase the threshold before gesture is recognized
            threshold: 10, // Require at least 10px movement before gesture starts
        }
    );

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'pan-y pinch-zoom', // Allow vertical scroll, horizontal handled by gesture
            }}
        >
            <animated.div
                {...(!disabled ? bind() : {})}
                style={{
                    display: 'flex',
                    height: '100%',
                    x,
                    touchAction: 'pan-y',
                    cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
                }}
            >
                {React.Children.map(children, (child, index) => (
                    <PageWrapper
                        key={index}
                        pageIndex={index}
                        isActive={index === activeIndex}
                        scrollPositions={scrollPositions}
                    >
                        {child}
                    </PageWrapper>
                ))}
            </animated.div>
        </div>
    );
}

// Export a hook for pages that need to know swipe state
export function useSwipeContext() {
    // This can be extended with a context provider if needed
    return { isSwipeEnabled: true };
}
