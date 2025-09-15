import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FONT_FAMILY } from '../constants/typography';
import { NotecardData } from '../types';

interface MarkdownRendererProps {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  backgroundColor?: string;
  cardPadding?: number;
  card: NotecardData;
  onEditStart?: (cardId: string, field: 'content') => void;
}

const MarkdownRenderer = ({ 
  content, 
  x, 
  y, 
  width, 
  height, 
  scale = 1,
  backgroundColor = '#ffffff',
  cardPadding = 10,
  card,
  onEditStart
}: MarkdownRendererProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverContent, setIsOverContent] = useState(false);
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  // Calculate content area position and size (exactly matching Notecard getContentY logic)
  // All measurements need to be scaled to match the canvas zoom
  const CONTENT_PADDING_TOP = 35;
  let baseContentY = CONTENT_PADDING_TOP;
  if (card.date) baseContentY = Math.max(baseContentY, 56); // Space for date
  // Key icon is always present, so always reserve space for it
  baseContentY = Math.max(baseContentY, card.date ? 82 : 64); // Space for key icon (with or without date)
  const baseBottomSpace = 40; // Bottom space for tags and icons at 100% scale
  const basePadding = cardPadding; // Card padding at 100% scale
  const TITLE_PADDING = 10; // This should match Notecard TITLE_PADDING
  
  const scaledContentY = baseContentY * scale;
  const scaledBottomSpace = baseBottomSpace * scale;
  const scaledPadding = basePadding * scale;
  const scaledTitlePadding = TITLE_PADDING * scale;
  
  const contentHeight = height - scaledContentY - scaledBottomSpace;
  
  // Check if content is scrollable
  useEffect(() => {
    if (contentRef.current) {
      const isScrollable = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setHasScrollableContent(isScrollable);
    }
  }, [content, contentHeight]);
  
  // Handle wheel events: scroll content when over text, allow stack scroll when outside
  const handleWheel = (e: React.WheelEvent) => {
    if (isOverContent && contentRef.current) {
      const canScrollDown = contentRef.current.scrollTop < contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const canScrollUp = contentRef.current.scrollTop > 0;
      
      // Only prevent propagation (stack scroll) if we can actually scroll in the intended direction
      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
        e.stopPropagation();
        // Let the default scroll behavior happen
      }
    }
    // If we can't scroll or mouse isn't over content, let the event propagate to stack
  };

  // Track mouse enter/leave for content area
  const handleMouseEnter = () => setIsOverContent(true);
  const handleMouseLeave = () => setIsOverContent(false);
  
  // Calculate content positioning to match Notecard exactly
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y + scaledContentY}px`,
    left: `${x + scaledTitlePadding}px`,
    width: `${width - scaledTitlePadding * 2}px`,
    height: `${contentHeight}px`,
    backgroundColor: 'transparent', // Transparent background to match card
    border: 'none',
    borderRadius: '0',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    overflow: 'auto', // Enable scrolling
    zIndex: 100, // Below editing overlays but above canvas
    fontSize: `${14 * scale}px`,
    fontFamily: FONT_FAMILY,
    lineHeight: '1.4',
    // pointerEvents handled inline to enable wheel while allowing clicks through
  };

  const markdownStyles: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontSize: `${14 * scale}px`,
    lineHeight: '1.4',
    color: '#333',
    height: '100%',
    minHeight: '100%', // Ensure content can expand
  };

  // Custom scrollbar styling
  const scrollbarStyles = `
    .markdown-content::-webkit-scrollbar {
      width: ${Math.max(8, 8 * scale)}px;
    }
    .markdown-content::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.1);
      border-radius: 4px;
    }
    .markdown-content::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.3);
      border-radius: 4px;
    }
    .markdown-content::-webkit-scrollbar-thumb:hover {
      background: rgba(0,0,0,0.5);
    }
  `;

  // Don't render if content is empty
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div 
        style={{
          ...overlayStyle,
          // Enable pointer events for scrollable content
          pointerEvents: hasScrollableContent ? 'auto' : 'none',
        }}
        {...(hasScrollableContent && {
          onWheel: handleWheel,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onMouseMove: (e) => {
            // Check if mouse is over the connection handle area and update cursor accordingly
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from center
            const distanceFromCenter = Math.sqrt(
              Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );
            
            // Change cursor based on whether we're over the connection handle area
            const target = e.currentTarget as HTMLElement;
            if (distanceFromCenter <= 15) {
              target.style.cursor = 'pointer';
            } else {
              target.style.cursor = 'auto';
            }
          },
          onMouseDown: (e) => {
            // Check if click is near the center (connection handle area)
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from center
            const distanceFromCenter = Math.sqrt(
              Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );
            
            // If click is within handle area (15px radius), prevent this event and allow it to pass through
            if (distanceFromCenter <= 15) {
              e.preventDefault();
              e.stopPropagation();
              
              // Temporarily disable pointer events to let the handle event through
              const target = e.currentTarget as HTMLElement;
              const originalPointerEvents = target.style.pointerEvents;
              target.style.pointerEvents = 'none';
              
              // Trigger the mousedown event on the element below
              const elementBelow = document.elementFromPoint(mouseX, mouseY);
              if (elementBelow) {
                const mouseEvent = new MouseEvent('mousedown', {
                  bubbles: true,
                  cancelable: true,
                  clientX: mouseX,
                  clientY: mouseY,
                  button: e.button
                });
                elementBelow.dispatchEvent(mouseEvent);
              }
              
              // Re-enable pointer events after a short delay
              setTimeout(() => {
                target.style.pointerEvents = originalPointerEvents;
              }, 50);
            }
          },
          onDoubleClick: () => {
            if (onEditStart) {
              onEditStart(card.id, 'content');
            }
          },
        })}
      >
        <div 
          style={markdownStyles}
          ref={contentRef}
          className="markdown-content"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default MarkdownRenderer;