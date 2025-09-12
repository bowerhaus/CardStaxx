import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NotecardData, CARD_COLORS } from '../types';
import Konva from 'konva';

interface NotecardProps {
  card: NotecardData;
  onEditStart: (cardId: string, field: 'title' | 'content', konvaNode: Konva.Node) => void;
  onResize?: (cardId: string, newWidth: number, newHeight: number) => void;
  isResizing?: boolean;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

const Notecard = ({ card, onEditStart, onResize, isResizing = false }: NotecardProps) => {
  const titleTextRef = useRef<Konva.Text>(null);
  const contentTextRef = useRef<Konva.Text>(null);
  const titleHitRectRef = useRef<Konva.Rect>(null);
  const groupRef = useRef<Konva.Group>(null);
  
  // Use card dimensions if available, otherwise fall back to defaults
  const cardWidth = card.width || CARD_WIDTH;
  const cardHeight = card.height || CARD_HEIGHT;
  
  const handleResize = (newWidth: number, newHeight: number) => {
    if (onResize && newWidth >= 100 && newHeight >= 80) { // Minimum sizes
      onResize(card.id, Math.round(newWidth), Math.round(newHeight));
    }
  };

  return (
    <Group ref={groupRef}>
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill={card.backgroundColor || CARD_COLORS.DEFAULT}
        stroke="black"
        strokeWidth={1}
        cornerRadius={5}
        shadowBlur={5}
        shadowOpacity={0.5}
      />
      <Text
        ref={titleTextRef}
        text={card.title}
        fontSize={16}
        fontStyle="bold"
        padding={TITLE_PADDING}
        width={cardWidth}
        listening={false} // Disable listening on Text to prevent default selection
      />
      {/* Transparent Rect for title hit detection */}
      <Rect
        ref={titleHitRectRef}
        x={TITLE_PADDING}
        y={TITLE_PADDING}
        width={cardWidth - TITLE_PADDING * 2}
        height={20} // Match approximate height of title text
        fill="rgba(0,0,0,0)" // Transparent fill
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'text';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onDblClick={() => {
          console.log('Title hit rect double-clicked!');
          titleTextRef.current && onEditStart(card.id, 'title', titleTextRef.current);
        }}
      />
      
      {/* Date and Key fields */}
      {(card.date || card.key) && (
        <Text
          text={[
            card.date ? new Date(card.date).toLocaleDateString() : '',
            card.key ? `Key: ${card.key}` : ''
          ].filter(Boolean).join(' | ')}
          fontSize={10}
          fill="#666"
          x={TITLE_PADDING}
          y={30}
          width={cardWidth - TITLE_PADDING * 2}
          listening={false}
        />
      )}
      
      {/* Tags display */}
      {card.tags && card.tags.length > 0 && (
        <Text
          text={`#${card.tags.join(' #')}`}
          fontSize={9}
          fill="#007bff"
          x={TITLE_PADDING}
          y={cardHeight - 25}
          width={cardWidth - TITLE_PADDING * 2}
          listening={false}
        />
      )}
      
      
      <Text
        ref={contentTextRef}
        text={card.content}
        fontSize={12}
        x={TITLE_PADDING}
        y={card.date || card.key ? 50 : CONTENT_PADDING_TOP}
        width={cardWidth - TITLE_PADDING * 2}
        height={cardHeight - (card.date || card.key ? 50 : CONTENT_PADDING_TOP) - (card.tags && card.tags.length > 0 ? 35 : TITLE_PADDING)}
        listening={false}
      />
      {/* Transparent Rect for content hit detection */}
      <Rect
        x={TITLE_PADDING}
        y={card.date || card.key ? 50 : CONTENT_PADDING_TOP}
        width={cardWidth - TITLE_PADDING * 2}
        height={cardHeight - (card.date || card.key ? 50 : CONTENT_PADDING_TOP) - (card.tags && card.tags.length > 0 ? 35 : TITLE_PADDING)}
        fill="rgba(0,0,0,0)" // Transparent fill
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'text';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onDblClick={() => {
          console.log('Content hit rect double-clicked!');
          contentTextRef.current && onEditStart(card.id, 'content', contentTextRef.current);
        }}
      />
      
      {/* Resize handle - bottom-right corner */}
      {onResize && (
        <Rect
          x={cardWidth - 10}
          y={cardHeight - 10}
          width={10}
          height={10}
          fill="rgba(0,123,255,0.8)"
          stroke="rgba(0,123,255,1)"
          strokeWidth={1}
          cornerRadius={2}
          onMouseEnter={(e) => {
            e.target.getStage()!.container().style.cursor = 'se-resize';
          }}
          onMouseLeave={(e) => {
            e.target.getStage()!.container().style.cursor = 'default';
          }}
          onMouseDown={(e) => {
            // Stop propagation to prevent card dragging
            e.cancelBubble = true;
            
            const stage = e.target.getStage();
            if (!stage || !groupRef.current) return;
            
            // Start tracking mouse movements for resize
            const handleMouseMove = () => {
              const pointerPos = stage.getPointerPosition();
              if (!pointerPos || !groupRef.current) return;
              
              // Get the absolute position and transform of the card group
              const groupTransform = groupRef.current.getAbsoluteTransform();
              
              // Account for any scaling or transformations by using the inverse transform
              const localPoint = groupTransform.copy().invert().point(pointerPos);
              
              const newWidth = localPoint.x;
              const newHeight = localPoint.y;
              
              handleResize(newWidth, newHeight);
            };
            
            const handleMouseUp = () => {
              stage.off('mousemove', handleMouseMove);
              stage.off('mouseup', handleMouseUp);
              document.body.style.cursor = 'default';
            };
            
            stage.on('mousemove', handleMouseMove);
            stage.on('mouseup', handleMouseUp);
            document.body.style.cursor = 'se-resize';
          }}
        />
      )}
    </Group>
  );
};

export default Notecard;
