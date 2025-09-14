import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData, NotecardData } from '../types';
import { FONT_FAMILY, CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number, mouseX?: number, mouseY?: number) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onWheel: (id: string, deltaY: number) => void;
  onClick: (id: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<NotecardData>) => void;
  onEditStart: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
  onStackTitleEditStart: (stackId: string, konvaNode: Konva.Node) => void;
  onCardResize: (cardId: string, newWidth: number, newHeight: number) => void;
  onColorPickerOpen: (cardId: string, x: number, y: number) => void;
  onCardDelete: (cardId: string, x: number, y: number) => void;
  editingCardId?: string | null;
  editingField?: 'title' | 'content' | 'date' | 'key' | 'tags' | 'stack-title' | null;
  editingStackId?: string | null;
  highlightedCardIds?: Set<string>;
}

const HEADER_OFFSET = 40;

const Stack = React.memo(({
  stack,
  onDragEnd,
  onDragMove,
  onWheel,
  onClick,
  onUpdateCard,
  onEditStart,
  onStackTitleEditStart,
  onCardResize,
  onColorPickerOpen,
  onCardDelete,
  editingCardId,
  editingField,
  editingStackId,
  highlightedCardIds,
}: StackProps) => {
  console.log('Stack received onEditStart:', onEditStart);


  const handleCardResize = (cardId: string, newWidth: number, newHeight: number) => {
    onCardResize(cardId, newWidth, newHeight);
  };


  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.target.moveToTop();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Get the mouse position at the time of drag end
    const stage = e.target.getStage();
    let mouseX: number | undefined;
    let mouseY: number | undefined;
    
    if (stage) {
      const pointerPos = stage.getPointerPosition();
      if (pointerPos) {
        // Convert screen coordinates to canvas coordinates (accounting for zoom and translation)
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        const canvasPos = transform.point(pointerPos);
        mouseX = canvasPos.x;
        mouseY = canvasPos.y;
      }
    }
    
    onDragEnd(stack.id, e.target.x(), e.target.y(), mouseX, mouseY);
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
      
      {/* Stack title and card count for multi-card stacks */}
      {stack.cards.length > 1 && (() => {
        // The top visible card is the last card in the array (highest index)
        // Since scrolling rearranges the array, we need a better way to track position
        // For now, let's use a simpler approach: sort cards by ID to get stable ordering
        const sortedCards = [...stack.cards].sort((a, b) => a.id.localeCompare(b.id));
        const topCard = stack.cards[stack.cards.length - 1];
        const currentCardNumber = sortedCards.findIndex(card => card.id === topCard.id) + 1;
        const stackTitle = stack.title || 'Untitled Stack';
        const isEditingTitle = editingStackId === stack.id && editingField === 'stack-title';
        
        return (
          <>
            {/* Stack title - left aligned, editable */}
            <Text
              text={stackTitle}
              fontSize={10}
              fill={isEditingTitle ? "#0066cc" : "#333"}
              fontWeight={isEditingTitle ? "bold" : "normal"}
              x={borderPadding + 1}
              y={2}
              fontFamily={FONT_FAMILY}
              listening={true}
              onDblClick={(e) => {
                if (!isEditingTitle) {
                  e.cancelBubble = true;
                  onStackTitleEditStart(stack.id, e.target);
                }
              }}
              onMouseEnter={(e) => {
                if (!isEditingTitle) {
                  e.target.getStage()!.container().style.cursor = 'text';
                }
              }}
              onMouseLeave={(e) => {
                if (!isEditingTitle) {
                  e.target.getStage()!.container().style.cursor = 'default';
                }
              }}
            />
            
            {/* Card count - right aligned */}
            <Text
              text={`${currentCardNumber}/${stack.cards.length}`}
              fontSize={10}
              fill="#666"
              x={stackWidth - borderPadding - 30} // Position from right edge
              y={2}
              fontFamily={FONT_FAMILY}
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
              onColorPickerOpen={isTopCard ? onColorPickerOpen : undefined} // Only top card can open color picker
              onDelete={isTopCard ? onCardDelete : undefined} // Only top card can be deleted
              isEditing={editingCardId === card.id && editingField === 'content'} // Pass editing state
              isHighlighted={highlightedCardIds?.has(card.id) || false} // Pass highlighting state
            />
          </Group>
        );
      })}
      
      {/* Stack resize handles - at stack edges */}
      {/* Bottom edge resize */}
      <Rect
        x={borderPadding}
        y={stackHeight - 5}
        width={stackWidth - borderPadding * 2}
        height={10}
        fill="rgba(0,0,0,0)" // Invisible
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 's-resize';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          const stage = e.target.getStage();
          if (!stage) return;
          
          const startHeight = baseCardHeight;
          const startY = e.evt.clientY;
          
          const handleMouseMove = (e: any) => {
            const deltaY = e.evt.clientY - startY;
            const newHeight = Math.max(80, startHeight + deltaY); // Minimum height 80px
            // Resize all cards in the stack
            stack.cards.forEach(card => {
              handleCardResize(card.id, card.width || baseCardWidth, newHeight);
            });
          };
          
          const handleMouseUp = () => {
            stage.off('mousemove', handleMouseMove);
            stage.off('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
          };
          
          stage.on('mousemove', handleMouseMove);
          stage.on('mouseup', handleMouseUp);
          document.body.style.cursor = 's-resize';
        }}
      />
      
      {/* Right edge resize */}
      <Rect
        x={stackWidth - 5}
        y={borderPadding + headerTextSpace}
        width={10}
        height={stackHeight - borderPadding * 2 - headerTextSpace}
        fill="rgba(0,0,0,0)" // Invisible
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'e-resize';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          const stage = e.target.getStage();
          if (!stage) return;
          
          const startWidth = baseCardWidth;
          const startX = e.evt.clientX;
          
          const handleMouseMove = (e: any) => {
            const deltaX = e.evt.clientX - startX;
            const newWidth = Math.max(100, startWidth + deltaX); // Minimum width 100px
            // Resize all cards in the stack
            stack.cards.forEach(card => {
              handleCardResize(card.id, newWidth, card.height || baseCardHeight);
            });
          };
          
          const handleMouseUp = () => {
            stage.off('mousemove', handleMouseMove);
            stage.off('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
          };
          
          stage.on('mousemove', handleMouseMove);
          stage.on('mouseup', handleMouseUp);
          document.body.style.cursor = 'e-resize';
        }}
      />
      
      {/* Bottom-right corner resize */}
      <Rect
        x={stackWidth - 15}
        y={stackHeight - 15}
        width={15}
        height={15}
        fill="rgba(0,0,0,0)" // Invisible
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'se-resize';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          const stage = e.target.getStage();
          if (!stage) return;
          
          const startWidth = baseCardWidth;
          const startHeight = baseCardHeight;
          const startX = e.evt.clientX;
          const startY = e.evt.clientY;
          
          const handleMouseMove = (e: any) => {
            const deltaX = e.evt.clientX - startX;
            const deltaY = e.evt.clientY - startY;
            const newWidth = Math.max(100, startWidth + deltaX);
            const newHeight = Math.max(80, startHeight + deltaY);
            // Resize all cards in the stack
            stack.cards.forEach(card => {
              handleCardResize(card.id, newWidth, newHeight);
            });
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
    </Group>
  );
});

export default Stack;
