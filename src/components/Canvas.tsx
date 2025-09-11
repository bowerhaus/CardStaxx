import React from 'react';
import { Stage, Layer } from 'react-konva';
import { StackData } from '../types';
import Stack from './Stack';

interface CanvasProps {
  stacks: StackData[];
  onStackDragEnd: (id: string, x: number, y: number) => void;
  onStackWheel: (id: string, deltaY: number) => void;
}

const Canvas = ({ stacks, onStackDragEnd, onStackWheel }: CanvasProps) => {
  // Adjust canvas size dynamically based on window size, accounting for sidebar width
  const canvasWidth = window.innerWidth - 270; // 250px sidebar + 20px padding
  const canvasHeight = window.innerHeight;

  return (
    <div style={{ flex: 1 }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {stacks.map((stack) => (
            <Stack
              key={stack.id}
              stack={stack}
              onDragEnd={onStackDragEnd}
              onWheel={onStackWheel}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
