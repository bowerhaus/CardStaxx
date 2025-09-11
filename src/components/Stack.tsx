import React from 'react';
import { Group, Rect } from 'react-konva'; // Removed Circle
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData } from '../types';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number) => void;
  onWheel: (id: string, deltaY: number) => void;
  onClick: (id: string) => void;
  // Removed connection-related props
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const HEADER_OFFSET = 40;
// Removed HANDLE_SIZE

const Stack = ({ stack, onDragEnd, onWheel, onClick }: StackProps) => { // Removed connection-related props
  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.target.moveToTop();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(stack.id, e.target.x(), e.target.y());
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault(); // Prevent page scrolling
    onWheel(stack.id, e.evt.deltaY);
  };

  const handleClick = () => {
    onClick(stack.id);
  };

  // Removed handleHandleDragStart and handleHandleDragEnd

  if (!stack.cards || stack.cards.length === 0) {
    return null; // Don't render anything if the stack is empty
  }

  return (
    <Group
      name="stack-group" // Added name for identification
      id={stack.id} // Added id for identification
      x={stack.x}
      y={stack.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* Bounding box for the whole stack */}
      <Rect
        width={CARD_WIDTH}
        height={CARD_HEIGHT + (stack.cards.length - 1) * HEADER_OFFSET}
        fill="rgba(0,0,0,0)" // Added transparent fill for hit detection
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={1}
        cornerRadius={5}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.3}
      />
      {stack.cards.map((card, index) => (
        <Group key={card.id} y={index * HEADER_OFFSET}>
          <Notecard card={card} />
        </Group>
      ))}

      {/* Connection Handle removed */}
    </Group>
  );
};

export default Stack;
