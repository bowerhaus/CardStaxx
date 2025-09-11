import React from 'react';
import { Group, Rect } from 'react-konva';
import Konva from 'konva';
import Notecard from './Notecard';
import { StackData } from '../types';

interface StackProps {
  stack: StackData;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  onWheel: (id: string, deltaY: number) => void;
  onClick: (id: string) => void;
  onUpdateCard: (cardId: string, newTitle: string, newContent: string) => void; // Added
  onEditStart: (cardId: string, field: 'title' | 'content', konvaNode: Konva.Node) => void; // Added
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
}: StackProps) => {
  console.log('Stack received onEditStart:', onEditStart);

  const handleNotecardEditStart = (field: 'title' | 'content', konvaNode: Konva.Node) => {
    onEditStart(stack.cards[0].id, field, konvaNode); // Pass the ID of the top card in the stack
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
          <Notecard card={card} onEditStart={handleNotecardEditStart} />
        </Group>
      ))}
    </Group>
  );
});

export default Stack;
