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
  onStackDragMove: (id: string, x: number, y: number) => void; // Added
  onStackWheel: (id: string, deltaY: number) => void;
  onConnectionDragStart: (fromStackId: string, startX: number, startY: number) => void;
  onConnectionDragMove: (currentX: number, currentY: number) => void;
  onConnectionDragEnd: (endX: number, endY: number) => void;
}

const Canvas = ({
  stacks,
  connections,
  isConnecting,
  currentConnection,
  onStackDragEnd,
  onStackDragMove, // Added
  onStackWheel,
  onConnectionDragStart,
  onConnectionDragMove,
  onConnectionDragEnd,
}: CanvasProps) => {
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
              onDragMove={onStackDragMove} // Added
              onWheel={onStackWheel}
              onClick={() => {}} // onClick is no longer used for connections
            />
          ))}
        </Layer>

        {/* Layer for Connections (foreground) */}
        <Layer>
          {connections.map((connection) => {
            const fromStack = stacks.find((s) => s.id === connection.from);
            const toStack = stacks.find((s) => s.id === connection.to);

            if (!fromStack || !toStack) return null;

            const fromX = fromStack.x + CARD_WIDTH / 2;
            const fromY = fromStack.y + CARD_HEIGHT / 2;
            const toX = toStack.x + CARD_WIDTH / 2;
            const toY = toStack.y + CARD_HEIGHT / 2;

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
          {isConnecting && currentConnection && (
            <Line
              points={[
                stacks.find(s => s.id === currentConnection.fromStackId)!.x + CARD_WIDTH / 2,
                stacks.find(s => s.id === currentConnection.fromStackId)!.y + CARD_HEIGHT / 2,
                currentConnection.toX,
                currentConnection.toY,
              ]}
              stroke="grey" // Changed to grey
              strokeWidth={1} // Changed to 1
              dash={[5, 5]} // Changed to dotted
              opacity={0.75} // Added opacity
            />
          )}

          {/* Connection Handles */}
          {stacks.map((stack) => {
            const handleX = stack.x + CARD_WIDTH / 2;
            const handleY = stack.y + (CARD_HEIGHT + (stack.cards.length - 1) * HEADER_OFFSET) / 2;
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
                zIndex={100} // Ensure handle is on top
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
