import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  cardPadding?: number;
}

const MarkdownRenderer = ({ 
  content, 
  x, 
  y, 
  width, 
  height, 
  backgroundColor = '#ffffff',
  cardPadding = 10
}: MarkdownRendererProps) => {
  // Calculate content area position and size (similar to Notecard getContentY logic)
  const contentY = Math.max(82, 64); // Space for date and key fields
  const contentHeight = height - contentY - 40; // Bottom space for tags and icons
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y + contentY}px`,
    left: `${x + cardPadding}px`,
    width: `${width - cardPadding * 2}px`,
    height: `${contentHeight}px`,
    backgroundColor: 'transparent', // Transparent background to match card
    border: 'none',
    borderRadius: '0',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    overflow: 'hidden', // Hide overflow like Konva text
    zIndex: 100, // Below editing overlays but above canvas
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.4',
    pointerEvents: 'none', // Don't interfere with double-click to edit
  };

  const markdownStyles: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontSize: '14px',
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