import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NotecardData, CARD_COLORS } from '../types';
import Konva from 'konva';

interface NotecardProps {
  card: NotecardData;
  onEditStart: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
  onResize?: (cardId: string, newWidth: number, newHeight: number) => void;
  onColorPickerOpen?: (cardId: string, x: number, y: number) => void;
  isResizing?: boolean;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

const Notecard = ({ card, onEditStart, onResize, onColorPickerOpen, isResizing = false }: NotecardProps) => {
  const titleTextRef = useRef<Konva.Text>(null);
  const contentTextRef = useRef<Konva.Text>(null);
  const dateTextRef = useRef<Konva.Text>(null);
  const keyTextRef = useRef<Konva.Text>(null);
  const tagsTextRef = useRef<Konva.Text>(null);
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

  const getContentY = () => {
    let y = CONTENT_PADDING_TOP;
    if (card.date) y = Math.max(y, 56); // Space for date
    // Key icon is always present, so always reserve space for it
    y = Math.max(y, card.date ? 82 : 64); // Space for key icon (with or without date)
    return y;
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
      
      {/* Date field with calendar icon */}
      {card.date && (
        <>
          <Text
            text="📅"
            fontSize={12}
            x={TITLE_PADDING}
            y={32}
            listening={false}
          />
          <Text
            ref={dateTextRef}
            text={new Date(card.date).toLocaleDateString('en-GB')}
            fontSize={12}
            fill="#666"
            x={TITLE_PADDING + 18}
            y={34}
            width={cardWidth - TITLE_PADDING * 2 - 18}
            listening={false}
          />
        </>
      )}
      
      {/* Hit area for date editing */}
      {card.date && (
        <Rect
          x={TITLE_PADDING}
          y={32}
          width={cardWidth - TITLE_PADDING * 2}
          height={16}
          fill="rgba(0,0,0,0)"
          onMouseEnter={(e) => {
            e.target.getStage()!.container().style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            e.target.getStage()!.container().style.cursor = 'default';
          }}
          onClick={() => {
            dateTextRef.current && onEditStart(card.id, 'date', dateTextRef.current);
          }}
        />
      )}
      
      {/* Key field with icon - always visible */}
      {/* Key icon (🔑 unicode) - always clickable */}
      <Text
        text="🔑"
        fontSize={12}
        x={TITLE_PADDING}
        y={card.date ? 56 : 40}
        listening={false}
      />
      {/* Key text - always create ref for positioning, only show text if key exists */}
      <Text
        ref={keyTextRef}
        text={card.key || ''}
        fontSize={12}
        fill="#666"
        x={TITLE_PADDING + 18}
        y={card.date ? 58 : 42}
        width={cardWidth - TITLE_PADDING * 2 - 18}
        listening={false}
        visible={!!card.key}
      />
      
      {/* Clickable area for key icon */}
      <Rect
        x={TITLE_PADDING}
        y={card.date ? 56 : 40}
        width={16}
        height={18}
        fill="rgba(0,0,0,0)"
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onClick={() => {
          // Always use the key text ref for proper positioning
          if (keyTextRef.current) {
            onEditStart(card.id, 'key', keyTextRef.current);
          }
        }}
      />
      
      {/* Tags field with icon - always visible */}
      {/* Tags icon (🏷️ unicode) - always clickable */}
      <Text
        text="🏷️"
        fontSize={12}
        x={TITLE_PADDING}
        y={cardHeight - 25}
        listening={false}
      />
      {/* Tags text - always create ref for positioning, only show text if tags exist */}
      <Text
        ref={tagsTextRef}
        text={card.tags && card.tags.length > 0 ? `#${card.tags.map(tag => tag.toLowerCase()).join(' #')}` : ''}
        fontSize={12}
        fill="#007bff"
        x={TITLE_PADDING + 18}
        y={cardHeight - 26}
        width={cardWidth - TITLE_PADDING * 2 - 18}
        listening={false}
        visible={!!(card.tags && card.tags.length > 0)}
      />
      
      {/* Clickable area for tags icon */}
      <Rect
        x={TITLE_PADDING}
        y={cardHeight - 25}
        width={16}
        height={15}
        fill="rgba(0,0,0,0)"
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onClick={() => {
          // Always use the tags text ref for proper positioning
          if (tagsTextRef.current) {
            onEditStart(card.id, 'tags', tagsTextRef.current);
          }
        }}
      />
      
      
      <Text
        ref={contentTextRef}
        text={card.content}
        fontSize={14}
        x={TITLE_PADDING}
        y={getContentY()}
        width={cardWidth - TITLE_PADDING * 2}
        height={cardHeight - getContentY() - 40}
        listening={false}
      />
      {/* Transparent Rect for content hit detection */}
      <Rect
        x={TITLE_PADDING}
        y={getContentY()}
        width={cardWidth - TITLE_PADDING * 2}
        height={cardHeight - getContentY() - 40}
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

      {/* Color picker button - permanent at bottom-right */}
      {onColorPickerOpen && (
        <>
          <Text
            text="🎨"
            fontSize={16}
            x={cardWidth - 30}
            y={cardHeight - 25}
            listening={false}
          />
          <Rect
            x={cardWidth - 30}
            y={cardHeight - 25}
            width={20}
            height={20}
            fill="rgba(0,0,0,0)"
            onMouseEnter={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              e.target.getStage()!.container().style.cursor = 'default';
            }}
            onClick={(e) => {
              e.cancelBubble = true; // Prevent propagation to card
              const stage = e.target.getStage();
              if (stage && groupRef.current) {
                // Get absolute position for color picker placement
                const transform = groupRef.current.getAbsoluteTransform();
                const stageRect = stage.container().getBoundingClientRect();
                const absolutePos = transform.point({ x: cardWidth - 30, y: cardHeight - 25 });
                const screenX = stageRect.left + absolutePos.x;
                const screenY = stageRect.top + absolutePos.y;
                onColorPickerOpen(card.id, screenX, screenY);
              }
            }}
          />
        </>
      )}
    </Group>
  );
};

export default Notecard;
