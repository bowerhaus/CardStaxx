import React from 'react';

interface KonvaMarkdownRendererProps {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  card: any;
  onEditStart?: (cardId: string, field: 'content') => void;
}

// Since Konva doesn't support HTML/DOM elements directly, we need to return null
// and handle markdown rendering at a higher level in the app
const KonvaMarkdownRenderer = (props: KonvaMarkdownRendererProps) => {
  // This component is a placeholder - markdown rendering will be handled 
  // by the parent Stack component or App component
  return null;
};

export default KonvaMarkdownRenderer;