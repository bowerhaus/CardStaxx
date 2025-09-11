import React from 'react';
import { Group, Rect } from 'react-konva';
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData } from '../types';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number) => void;
  onWheel: (id: string, deltaY: number) => void;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const HEADER_OFFSET = 40;

const Stack = ({ stack, onDragEnd, onWheel }: StackProps) => {
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

  if (!stack.cards || stack.cards.length === 0) {
    return null; // Don't render anything if the stack is empty
  }

  return (
    <Group
      x={stack.x}
      y={stack.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onWheel={handleWheel}
    >
      {/* Bounding box for the whole stack */}
      <Rect
        width={CARD_WIDTH}
        height={CARD_HEIGHT + (stack.cards.length - 1) * HEADER_OFFSET}
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
    </Group>
  );
};

export default Stack;
