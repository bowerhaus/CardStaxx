import React from 'react';
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
  card
}: MarkdownRendererProps) => {
  // Calculate content area position and size (exactly matching Notecard getContentY logic)
  // All measurements need to be scaled to match the canvas zoom
  const CONTENT_PADDING_TOP = 35;
  let baseContentY = CONTENT_PADDING_TOP;
  if (card.date) baseContentY = Math.max(baseContentY, 56); // Space for date
  // Key icon is always present, so always reserve space for it
  baseContentY = Math.max(baseContentY, card.date ? 82 : 64); // Space for key icon (with or without date)
  const baseBottomSpace = 40; // Bottom space for tags and icons at 100% scale
  const basePadding = cardPadding; // Card padding at 100% scale
  
  const scaledContentY = baseContentY * scale;
  const scaledBottomSpace = baseBottomSpace * scale;
  const scaledPadding = basePadding * scale;
  
  const contentHeight = height - scaledContentY - scaledBottomSpace;
  
  // Calculate content positioning to match Notecard exactly
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y + scaledContentY}px`,
    left: `${x + scaledPadding}px`,
    width: `${width - scaledPadding * 2}px`,
    height: `${contentHeight}px`,
    backgroundColor: 'transparent', // Transparent background to match card
    border: 'none',
    borderRadius: '0',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    overflow: 'hidden', // Hide overflow like Konva text
    zIndex: 100, // Below editing overlays but above canvas
    fontSize: `${14 * scale}px`,
    fontFamily: FONT_FAMILY,
    lineHeight: '1.4',
    pointerEvents: 'none', // Don't interfere with double-click to edit
  };

  const markdownStyles: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontSize: `${14 * scale}px`,
    lineHeight: '1.4',
    color: '#333',
    height: '100%',
    overflow: 'hidden',
  };

  // Don't render if content is empty
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <div style={overlayStyle}>
      <div style={markdownStyles}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;