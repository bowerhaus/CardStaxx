import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData, NotecardData } from '../types';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onWheel: (id: string, deltaY: number) => void;
  onClick: (id: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<NotecardData>) => void;
  onEditStart: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
  onCardResize: (cardId: string, newWidth: number, newHeight: number) => void;
  onColorPickerOpen: (cardId: string, x: number, y: number) => void;
  onCardDelete: (cardId: string, x: number, y: number) => void;
  editingCardId?: string | null;
  editingField?: 'title' | 'content' | 'date' | 'key' | 'tags' | null;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const HEADER_OFFSET = 40;

const Stack = React.memo(({
  stack,
  onDragEnd,
  onDragMove,
  onWheel,
  onClick,
  onUpdateCard,
  onEditStart,
  onCardResize,
  onColorPickerOpen,
  onCardDelete,
  editingCardId,
  editingField,
}: StackProps) => {
  console.log('Stack received onEditStart:', onEditStart);


  const handleCardResize = (cardId: string, newWidth: number, newHeight: number) => {
    onCardResize(cardId, newWidth, newHeight);
  };


  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.target.moveToTop();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(stack.id, e.target.x(), e.target.y());
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragMove(stack.id, e.target.x(), e.target.y());
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault(); // Prevent page scrolling
    onWheel(stack.id, e.evt.deltaY);
  };

  const handleClick = () => {
    onClick(stack.id);
  };

  if (!stack.cards || stack.cards.length === 0) {
    return null; // Don't render anything if the stack is empty
  }

  // Calculate stack dimensions based on the top card (which might be resized)
  const topCard = stack.cards[0];
  const baseCardWidth = topCard.width || CARD_WIDTH;
  const baseCardHeight = topCard.height || CARD_HEIGHT;
  
  // Make stack border slightly larger than the top card
  const borderPadding = 10;
  const headerTextSpace = stack.cards.length > 1 ? 8 : 0; // Extra space for header text
  const stackWidth = baseCardWidth + borderPadding * 2;
  const stackHeight = baseCardHeight + (stack.cards.length - 1) * HEADER_OFFSET + borderPadding * 2 + headerTextSpace;

  return (
    <Group
      name="stack-group" // Added name for identification
      id={stack.id} // Added id for identification
      x={stack.x}
      y={stack.y}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* Dotted border around the whole stack */}
      <Rect
        width={stackWidth}
        height={stackHeight}
        fill="rgba(0,0,0,0)" // Transparent fill for hit detection
        stroke="rgba(100,100,100,0.45)" // Adjusted opacity
        strokeWidth={1}
        dash={[3, 3]} // Smaller dashes: 3px dash, 3px gap
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={4}
        shadowOpacity={0.5}
      />
      
      {/* "Card X of Y" header for multi-card stacks */}
      {stack.cards.length > 1 && (() => {
        // The top visible card is the last card in the array (highest index)
        // Since scrolling rearranges the array, we need a better way to track position
        // For now, let's use a simpler approach: sort cards by ID to get stable ordering
        const sortedCards = [...stack.cards].sort((a, b) => a.id.localeCompare(b.id));
        const topCard = stack.cards[stack.cards.length - 1];
        const currentCardNumber = sortedCards.findIndex(card => card.id === topCard.id) + 1;
        
        return (
          <>
            {/* Header text - minimal spacing */}
            <Text
              text={`Card ${currentCardNumber} of ${stack.cards.length}`}
              fontSize={10}
              fill="#666"
              x={borderPadding + 1}
              y={2}
              fontFamily="Arial, sans-serif"
              listening={false}
            />
          </>
        );
      })()}
      
      {stack.cards.map((card, index) => {
        // Progressive scaling for rolodex perspective effect
        const totalCards = stack.cards.length;
        const isTopCard = index === totalCards - 1; // Last card is the "top" visible card
        const depthFromTop = totalCards - 1 - index; // How far back from the top visible card
        
        // Progressive scaling (top visible card largest, cards get smaller going back) - very subtle
        const scale = isTopCard ? 1.0 : Math.max(0.99 - depthFromTop * 0.01, 0.95);
        
        // Calculate offset to keep scaling centered around the card's center
        // Add extra space for the "Card X of Y" header text
        const headerTextSpace = stack.cards.length > 1 ? 8 : 0; // Extra space for header
        const cardWidth = card.width || CARD_WIDTH;
        const cardHeight = card.height || CARD_HEIGHT;
        const xOffset = borderPadding + (cardWidth * (1 - scale)) / 2;
        const yOffset = borderPadding + headerTextSpace + index * HEADER_OFFSET + (cardHeight * (1 - scale)) / 2;
        
        return (
          <Group 
            key={card.id} 
            x={xOffset}
            y={yOffset}
            scaleX={scale}
            scaleY={scale}
          >
            <Notecard 
              card={card} 
              onEditStart={onEditStart}
              onResize={isTopCard ? handleCardResize : undefined} // Only top (most visible) card can be resized
              onColorPickerOpen={isTopCard ? onColorPickerOpen : undefined} // Only top card can open color picker
              onDelete={isTopCard ? onCardDelete : undefined} // Only top card can be deleted
              isEditing={editingCardId === card.id && editingField === 'content'} // Pass editing state
            />
          </Group>
        );
      })}
    </Group>
  );
});

export default Stack;
