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
                stroke="blue"
                strokeWidth={2}
                tension={0}
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
              stroke="red"
              strokeWidth={2}
              dash={[10, 5]}
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
                radius={HANDLE_SIZE}
                fill="red"
                stroke="black"
                strokeWidth={1}
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
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;