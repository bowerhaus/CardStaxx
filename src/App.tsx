import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { NotecardData, StackData } from './types';

function App() {
  const [stacks, setStacks] = useState<StackData[]>([
    // Start with one stack containing one sample card
    {
      id: 'stack-1',
      x: 50,
      y: 50,
      cards: [
        {
          id: 'card-1',
          title: 'Welcome!',
          content: 'This is a card in a stack.',
        },
      ],
    },
  ]);

  const handleCreateCard = () => {
    const newCard: NotecardData = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      content: 'This is a new notecard.',
    };
    const newStack: StackData = {
      id: `stack-${Date.now()}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      cards: [newCard],
    };
    setStacks([...stacks, newStack]);
  };

  const handleStackDragEnd = (id: string, x: number, y: number) => {
    setStacks(
      stacks.map((stack) => {
        if (stack.id === id) {
          return { ...stack, x, y };
        }
        return stack;
      })
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onCreateCard={handleCreateCard} />
      <Canvas stacks={stacks} onStackDragEnd={handleStackDragEnd} />
    </div>
  );
}

export default App;
