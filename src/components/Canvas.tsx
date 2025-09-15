import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Group, Rect } from 'react-konva'; // Import Circle, Text, Group, Rect
import { StackData, ConnectionData, NotecardData } from '../types';
import { FONT_FAMILY, CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';
import { LAYOUT } from '../constants/layout';
import Stack from './Stack';
import Konva from 'konva'; // Import Konva for event types

const HANDLE_SIZE = 10; // Size of the connection handle
const HEADER_OFFSET = 40; // Added HEADER_OFFSET

// Utility function to calculate the center position of a stack (center of most visible card - topmost)
const getStackCenterPosition = (stack: StackData): { x: number; y: number } => {
  if (!stack.cards || stack.cards.length === 0) return { x: stack.x, y: stack.y };
  
  // The topmost visible card is the last one in the array
  const topCard = stack.cards[stack.cards.length - 1];
  const cardWidth = topCard.width || CARD_WIDTH;
  const cardHeight = topCard.height || CARD_HEIGHT;
  
  // Account for stack rendering offsets (from Stack.tsx)
  const borderPadding = 10;
  const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
  const cardIndex = stack.cards.length - 1; // Index of the topmost card
  
  // Calculate the position of the topmost visible card within the stack
  const xOffset = borderPadding + (cardWidth * (1 - 1.0)) / 2; // Scale is 1.0 for top card
  const yOffset = borderPadding + headerTextSpace + cardIndex * HEADER_OFFSET + (cardHeight * (1 - 1.0)) / 2;
  
  return {
    x: stack.x + xOffset + cardWidth / 2,
    y: stack.y + yOffset + cardHeight / 2
  };
};

interface CanvasProps {
  stacks: StackData[];
  connections: ConnectionData[];
  isConnecting: boolean;
  currentConnection: { fromStackId: string; toX: number; toY: number } | null;
  onStackDragEnd: (id: string, x: number, y: number, mouseX?: number, mouseY?: number) => void;
  onStackDragMove: (id: string, x: number, y: number) => void;
  onStackWheel: (id: string, deltaY: number) => void;
  onConnectionDragStart: (fromStackId: string, startX: number, startY: number) => void;
  onConnectionDragMove: (currentX: number, currentY: number) => void;
  onConnectionDragEnd: (endX: number, endY: number) => void;
  onUpdateCard: (cardId: string, updates: Partial<NotecardData>) => void;
  onEditStart: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
  onStackTitleEditStart: (stackId: string, konvaNode: Konva.Node) => void;
  onCardResize: (cardId: string, newWidth: number, newHeight: number) => void;
  onColorPickerOpen: (cardId: string, x: number, y: number) => void;
  onCardDelete: (cardId: string, x: number, y: number) => void;
  onCardBreakOut: (cardId: string) => void;
  onConnectionLabelEdit: (connectionId: string, konvaNode: Konva.Node) => void;
  onConnectionDelete: (connectionId: string) => void;
  editingCardId?: string | null;
  editingField?: 'title' | 'content' | 'date' | 'key' | 'tags' | 'stack-title' | null;
  editingStackId?: string | null;
  editingConnectionId?: string | null;
  highlightedCardIds?: Set<string>;
  canvasZoom?: number;
  canvasTranslate?: {x: number; y: number};
  onCanvasTranslationChange?: (newTranslate: {x: number; y: number}) => void;
}

const Canvas = React.memo(({
  stacks,
  connections,
  isConnecting,
  currentConnection,
  onStackDragEnd,
  onStackDragMove,
  onStackWheel,
  onConnectionDragStart,
  onConnectionDragMove,
  onConnectionDragEnd,
  onUpdateCard,
  onEditStart,
  onStackTitleEditStart,
  onCardResize,
  onColorPickerOpen,
  onCardDelete,
  onCardBreakOut,
  onConnectionLabelEdit,
  onConnectionDelete,
  editingCardId,
  editingField,
  editingStackId,
  editingConnectionId,
  highlightedCardIds,
  canvasZoom = 1,
  canvasTranslate = {x: 0, y: 0},
  onCanvasTranslationChange
}: CanvasProps) => {
  console.log('Canvas received onEditStart:', onEditStart);
  
  // Canvas dimensions with resize listener
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - LAYOUT.SIDEBAR_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  // Canvas drag state for panning
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [lastCanvasMousePos, setLastCanvasMousePos] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth - LAYOUT.SIDEBAR_WIDTH);
      setCanvasHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isConnecting && currentConnection) {
      const stage = e.target.getStage();
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          onConnectionDragMove(pointerPos.x, pointerPos.y);
        }
      }
    } else if (isDraggingCanvas && lastCanvasMousePos && onCanvasTranslationChange) {
      // Handle canvas panning
      const stage = e.target.getStage();
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          const deltaX = pointerPos.x - lastCanvasMousePos.x;
          const deltaY = pointerPos.y - lastCanvasMousePos.y;
          
          const newTranslate = {
            x: canvasTranslate.x + deltaX,
            y: canvasTranslate.y + deltaY
          };
          
          onCanvasTranslationChange(newTranslate);
          setLastCanvasMousePos(pointerPos);
        }
      }
    }
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start canvas dragging if clicking on empty space (the stage itself)
    if (e.target === e.target.getStage() && !isConnecting && onCanvasTranslationChange) {
      const stage = e.target.getStage();
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          setIsDraggingCanvas(true);
          setLastCanvasMousePos(pointerPos);
          
          // Change cursor to grabbing
          const container = stage.container();
          if (container) {
            container.style.cursor = 'grabbing';
          }
        }
      }
    }
  };

  const handleStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      setLastCanvasMousePos(null);
      
      // Reset cursor to grab (since mouse is still over the stage)
      const stage = e.target.getStage();
      if (stage) {
        const container = stage.container();
        if (container) {
          container.style.cursor = e.target === stage ? 'grab' : 'default';
        }
      }
    }
  };

  const handleStageMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Show grab cursor when hovering over empty space (the stage itself)
    if (e.target === e.target.getStage() && !isConnecting && !isDraggingCanvas && onCanvasTranslationChange) {
      const stage = e.target.getStage();
      if (stage) {
        const container = stage.container();
        if (container) {
          container.style.cursor = 'grab';
        }
      }
    }
  };

  const handleStageMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Reset cursor when leaving the stage
    const stage = e.target.getStage();
    if (stage && !isDraggingCanvas) {
      const container = stage.container();
      if (container) {
        container.style.cursor = 'default';
      }
    }
  };

  return (
    <div style={{ width: canvasWidth, height: canvasHeight }}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        scaleX={canvasZoom}
        scaleY={canvasZoom}
        x={canvasTranslate.x}
        y={canvasTranslate.y}
        onMouseMove={handleMouseMove}
        onMouseDown={handleStageMouseDown}
        onMouseUp={handleStageMouseUp}
        onMouseEnter={handleStageMouseEnter}
        onMouseLeave={handleStageMouseLeave}
      >
        {/* Layer for Stacks (background) */}
        <Layer>
          {stacks.map((stack) => (
            <Stack
              key={stack.id}
              stack={stack}
              onDragEnd={onStackDragEnd}
              onDragMove={onStackDragMove}
              onWheel={onStackWheel}
              onClick={() => {}} // onClick is no longer used for connections
              onUpdateCard={onUpdateCard}
              onEditStart={onEditStart}
              onStackTitleEditStart={onStackTitleEditStart}
              onCardResize={onCardResize}
              onColorPickerOpen={onColorPickerOpen}
              onCardDelete={onCardDelete}
              onCardBreakOut={onCardBreakOut}
              editingCardId={editingCardId}
              editingField={editingField}
              editingStackId={editingStackId}
              highlightedCardIds={highlightedCardIds}
            />
          ))}
        </Layer>

        {/* Layer for Connections (foreground) */}
        <Layer>
          {connections.map((connection) => {
            const fromStack = stacks.find((s) => s.id === connection.from);
            const toStack = stacks.find((s) => s.id === connection.to);

            if (!fromStack || !toStack) return null;

            // Use centralized center position calculation (same as red handles)
            const fromCenter = getStackCenterPosition(fromStack);
            const toCenter = getStackCenterPosition(toStack);
            const fromX = fromCenter.x;
            const fromY = fromCenter.y;
            const toX = toCenter.x;
            const toY = toCenter.y;

            // Calculate midpoint for label positioning
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;

            return (
              <Group key={connection.id}>
                <Line
                  points={[fromX, fromY, toX, toY]}
                  stroke="grey"
                  strokeWidth={1}
                  opacity={0.75}
                  tension={0}
                />
                
                {/* Connection Label */}
                <Group
                  x={midX}
                  y={midY}
                >
                  {/* Background rectangle for better readability */}
                  <Rect
                    x={-(connection.label ? Math.max(connection.label.length * 5 + 8, 24) : 24) / 2}
                    y={-9}
                    width={connection.label ? Math.max(connection.label.length * 5 + 8, 24) : 24}
                    height={18}
                    fill="white"
                    stroke="grey"
                    strokeWidth={1}
                    opacity={0.9}
                    onClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                    onDblClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                  />
                  
                  {/* Label text */}
                  <Text
                    text={connection.label || '+'}
                    fontSize={10}
                    fontFamily={FONT_FAMILY}
                    fontStyle="normal"
                    fill={connection.label ? "black" : "grey"}
                    align="center"
                    verticalAlign="middle"
                    offsetX={connection.label ? (connection.label.length * 2.5) : 3}
                    offsetY={5}
                    onClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                    onDblClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                  />
                  
                  {/* Delete button (small X) - shown when editing */}
                  <Text
                    text="×"
                    fontSize={12}
                    fontFamily={FONT_FAMILY}
                    fill="red"
                    align="center"
                    verticalAlign="middle"
                    offsetX={6}
                    offsetY={-12}
                    onMouseDown={(e) => {
                      e.cancelBubble = true;
                      e.evt.preventDefault();
                      onConnectionDelete(connection.id);
                    }}
                    visible={editingConnectionId === connection.id}
                  />
                </Group>
              </Group>
            );
          })}

          {/* Dynamic Connection Line */}
          {isConnecting && currentConnection && (() => {
            const fromStack = stacks.find(s => s.id === currentConnection.fromStackId);
            if (!fromStack) return null;
            
            // Use the same center position calculation as the red handles
            const fromCenter = getStackCenterPosition(fromStack);
            
            return (
              <Line
                points={[
                  fromCenter.x,
                  fromCenter.y,
                  currentConnection.toX,
                  currentConnection.toY,
                ]}
                stroke="grey" // Changed to grey
                strokeWidth={1} // Changed to 1
                dash={[5, 5]} // Changed to dotted
                opacity={0.75} // Added opacity
              />
            );
          })()}

          {/* Connection Handles */}
          {stacks.map((stack) => {
            const centerPos = getStackCenterPosition(stack);
            const handleX = centerPos.x;
            const handleY = centerPos.y;
            return (
              <Circle
                key={`handle-${stack.id}`}
                x={handleX}
                y={handleY}
                radius={HANDLE_SIZE * 0.75} // 25% smaller
                fill="red"
                // stroke="black" // Removed border
                // strokeWidth={1} // Removed border
                draggable
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'default';
                  }
                }}
                onDragStart={(e) => {
                  e.target.moveToTop(); // Bring handle to top
                  onConnectionDragStart(stack.id, e.target.x(), e.target.y());
                }}
                onDragMove={(e) => {
                  onConnectionDragMove(e.target.x(), e.target.y());
                }}
                onDragEnd={(e) => {
                  // Use e.target.x() and e.target.y() directly
                  onConnectionDragEnd(e.target.x(), e.target.y());
                  // Reset handle position after drag
                  e.target.x(handleX);
                  e.target.y(handleY);
                }}
                // zIndex={100} // Removed
              />
            );
          })}
        </Layer>

      </Stage>
    </div>
  );
});

export default Canvas;
