import React from 'react';
import { Group } from 'react-konva';
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData } from '../types';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number) => void;
}

const Stack = ({ stack, onDragEnd }: StackProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(stack.id, e.target.x(), e.target.y());
  };

  // For now, we only render the top card of the stack.
  const topCard = stack.cards[0];

  if (!topCard) {
    return null; // Don't render anything if the stack is empty
  }

  return (
    <Group x={stack.x} y={stack.y} draggable onDragEnd={handleDragEnd}>
      <Notecard card={topCard} />
    </Group>
  );
};

export default Stack;
