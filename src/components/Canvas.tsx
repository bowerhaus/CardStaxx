import React from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva'; // Import Circle
import { StackData, ConnectionData } from '../types';
import Stack from './Stack';
import Konva from 'konva'; // Import Konva for event types

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const HANDLE_SIZE = 10; // Size of the connection handle
const HEADER_OFFSET = 40; // Added HEADER_OFFSET

interface CanvasProps {
  stacks: StackData[];
  connections: ConnectionData[];
  isConnecting: boolean;
  currentConnection: { fromStackId: string; toX: number; toY: number } | null;
  onStackDragEnd: (id: string, x: number, y: number) => void;
  onStackDragMove: (id: string, x: number, y: number) => void;
  onStackWheel: (id: string, deltaY: number) => void;
  onConnectionDragStart: (fromStackId: string, startX: number, startY: number) => void;
  onConnectionDragMove: (currentX: number, currentY: number) => void;
  onConnectionDragEnd: (endX: number, endY: number) => void;
  onUpdateCard: (cardId: string, newTitle: string, newContent: string) => void;
  onEditStart: (cardId: string, field: 'title' | 'content', konvaNode: Konva.Node) => void;
  onCardResize: (cardId: string, newWidth: number, newHeight: number) => void;
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
  onCardResize,
}: CanvasProps) => {
  console.log('Canvas received onEditStart:', onEditStart);
  const canvasWidth = window.innerWidth - 270;
  const canvasHeight = window.innerHeight;

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isConnecting && currentConnection) {
      const stage = e.target.getStage();
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          onConnectionDragMove(pointerPos.x, pointerPos.y);
        }
      }
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
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
              onCardResize={onCardResize}
            />
          ))}
        </Layer>

        {/* Layer for Connections (foreground) */}
        <Layer>
          {connections.map((connection) => {
            const fromStack = stacks.find((s) => s.id === connection.from);
            const toStack = stacks.find((s) => s.id === connection.to);

            if (!fromStack || !toStack) return null;

            // Use dynamic card dimensions for connection points (stack center)
            const fromTopCard = fromStack.cards[0];
            const fromWidth = fromTopCard?.width || CARD_WIDTH;
            const fromStackHeight = (fromTopCard?.height || CARD_HEIGHT) + (fromStack.cards.length - 1) * HEADER_OFFSET;
            const fromX = fromStack.x + fromWidth / 2;
            const fromY = fromStack.y + fromStackHeight / 2;

            const toTopCard = toStack.cards[0];
            const toWidth = toTopCard?.width || CARD_WIDTH;
            const toStackHeight = (toTopCard?.height || CARD_HEIGHT) + (toStack.cards.length - 1) * HEADER_OFFSET;
            const toX = toStack.x + toWidth / 2;
            const toY = toStack.y + toStackHeight / 2;

            return (
              <Line
                key={connection.id}
                points={[fromX, fromY, toX, toY]}
                stroke="grey" // Changed to grey
                strokeWidth={1} // Changed to 1
                opacity={0.75} // Added opacity
                tension={0} // Straight line
              />
            );
          })}

          {/* Dynamic Connection Line */}
          {isConnecting && currentConnection && (() => {
            const fromStack = stacks.find(s => s.id === currentConnection.fromStackId);
            if (!fromStack) return null;
            
            const fromTopCard = fromStack.cards[0];
            const fromWidth = fromTopCard?.width || CARD_WIDTH;
            const fromStackHeight = (fromTopCard?.height || CARD_HEIGHT) + (fromStack.cards.length - 1) * HEADER_OFFSET;
            
            return (
              <Line
                points={[
                  fromStack.x + fromWidth / 2,
                  fromStack.y + fromStackHeight / 2,
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
            const topCard = stack.cards[0];
            const stackWidth = topCard?.width || CARD_WIDTH;
            const stackHeight = (topCard?.height || CARD_HEIGHT) + (stack.cards.length - 1) * HEADER_OFFSET;
            const handleX = stack.x + stackWidth / 2;
            const handleY = stack.y + stackHeight / 2;
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
