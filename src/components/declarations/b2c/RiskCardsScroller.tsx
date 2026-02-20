import React, { useRef, useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { WarningOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { RiskFinding } from './types';
import { RiskCard } from './RiskCard';

interface RiskCardsScrollerProps {
    riskFindings: RiskFinding[];
}

export const RiskCardsScroller: React.FC<RiskCardsScrollerProps> = ({ riskFindings }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

    // Gentle auto-scroll hint animation
    useEffect(() => {
        if (!isExpanded) return; // Don't animate if collapsed

        const timer = setTimeout(() => {
            if (!scrollRef.current) return;

            const scrollContainer = scrollRef.current;
            let startTime: number | null = null;
            const duration = 2000; // 2 seconds for smooth animation
            const distance = 150; // Scroll 150px to hint

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Smooth ease-in-out function
                const easeInOutCubic = (t: number) =>
                    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

                const scrollPosition = distance * easeInOutCubic(progress);
                scrollContainer.scrollLeft = scrollPosition;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Smoothly scroll back to start after a brief pause
                    setTimeout(() => {
                        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 500);
                }
            };

            requestAnimationFrame(animate);
        }, 800); // Wait 800ms before starting hint animation

        return () => clearTimeout(timer);
    }, [isExpanded]);

    const checkScrollButtons = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftButton(scrollLeft > 10);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        checkScrollButtons();
        scrollContainer.addEventListener('scroll', checkScrollButtons);
        window.addEventListener('resize', checkScrollButtons);

        return () => {
            scrollContainer.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [isExpanded]); // Re-run when expanded

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const scrollAmount = 360; // Scroll by one card width + gap
        const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

        scrollRef.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <Card
            size="small"
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #f0f0f0'
            }}
            headStyle={{
                padding: '0 16px' // Ensure 16px padding in header
            }}
            bodyStyle={{
                padding: isExpanded ? 16 : 0, // Restore 16px padding when expanded
                display: isExpanded ? 'block' : 'none',
                transition: 'all 0.3s ease'
            }}
            title={
                <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <WarningOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                        <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
                            Risk Analiz Bulguları ({riskFindings.length})
                        </span>
                    </div>
                    {isExpanded ? <span style={{ fontSize: 12 }}>▼</span> : <span style={{ fontSize: 12 }}>▲</span>}
                </div>
            }
        >
            <div style={{ position: 'relative' }}>
                {/* Left Scroll Button */}
                {showLeftButton && (
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<LeftOutlined />}
                        onClick={() => scroll('left')}
                        className="scroll-button-breathing"
                        style={{
                            position: 'absolute',
                            left: -12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    />
                )}

                {/* Right Scroll Button */}
                {showRightButton && (
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<RightOutlined />}
                        onClick={() => scroll('right')}
                        className="scroll-button-breathing"
                        style={{
                            position: 'absolute',
                            right: -12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    />
                )}

                {/* Left fade gradient - positioned outside scroll container */}
                {showLeftButton && (
                    <div style={{
                        position: 'absolute',
                        left: -16, // Extend to edge
                        top: 0,
                        bottom: 8,
                        width: 60,
                        background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))',
                        zIndex: 5,
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Right fade gradient - positioned outside scroll container */}
                {showRightButton && (
                    <div style={{
                        position: 'absolute',
                        right: -16, // Extend to edge
                        top: 0,
                        bottom: 8,
                        width: 100,
                        background: 'linear-gradient(to left, rgba(255,255,255,1) 10%, rgba(255,255,255,0))',
                        zIndex: 5,
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        gap: 16,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        paddingBottom: 16, // Space for scrollbar
                        // Full bleed scrolling:
                        marginLeft: -16,
                        marginRight: -16,
                        paddingLeft: 16,
                        paddingRight: 16,
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#1677ff #f0f0f0',
                        WebkitOverflowScrolling: 'touch',
                        position: 'relative'
                    }}
                    className="risk-cards-scroller"
                >
                    {riskFindings.map(risk => (
                        <RiskCard key={risk.id} risk={risk} />
                    ))}
                </div>
            </div>

            {/* Custom scrollbar and breathing animation styles */}
            <style>
                {`
          .risk-cards-scroller::-webkit-scrollbar {
            height: 8px;
          }
          .risk-cards-scroller::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
            margin: 0 4px;
          }
          .risk-cards-scroller::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 4px;
          }
          .risk-cards-scroller::-webkit-scrollbar-thumb:hover {
            background: #bfbfbf;
          }

          /* Breathing animation for scroll buttons */
          @keyframes breathing {
            0%, 100% {
              transform: translateY(-50%) scale(1);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            50% {
              transform: translateY(-50%) scale(1.08);
              box-shadow: 0 6px 20px rgba(22, 119, 255, 0.4);
            }
          }

          .scroll-button-breathing {
            animation: breathing 2s ease-in-out infinite;
          }

          .scroll-button-breathing:hover {
            animation: none;
          }
        `}
            </style>
        </Card>
    );
};
