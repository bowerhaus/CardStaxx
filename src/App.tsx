import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { NotecardData, StackData, ConnectionData } from './types';

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;

function App() {
  const [stacks, setStacks] = useState<StackData[]>([
    {
      id: 'stack-1',
      x: 50,
      y: 50,
      cards: [
        { id: 'card-1', title: 'Welcome!', content: 'This is a card in a stack.' },
      ],
    },
  ]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [connectionMode, setConnectionMode] = useState(false);
  const [sourceStackId, setSourceStackId] = useState<string | null>(null);

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

  const handleStackDragEnd = (draggedStackId: string, x: number, y: number) => {
    const draggedStack = stacks.find((s) => s.id === draggedStackId);
    if (!draggedStack) return;

    const targetStack = stacks.find(stack => {
      if (stack.id === draggedStackId) return false;
      return (
        x < stack.x + CARD_WIDTH &&
        x + CARD_WIDTH > stack.x &&
        y < stack.y + CARD_HEIGHT &&
        y + CARD_HEIGHT > stack.y
      );
    });

    if (targetStack) {
      const newStacks = stacks
        .map(s => {
          if (s.id === targetStack.id) {
            return { ...s, cards: [...s.cards, ...draggedStack.cards] };
          }
          return s;
        })
        .filter(s => s.id !== draggedStackId);
      setStacks(newStacks);
    } else {
      setStacks(
        stacks.map((stack) => {
          if (stack.id === draggedStackId) {
            return { ...stack, x, y };
          }
          return stack;
        })
      );
    }
  };

  const handleStackWheel = (stackId: string, deltaY: number) => {
    setStacks(
      stacks.map(stack => {
        if (stack.id === stackId && stack.cards.length > 1) {
          const newCards = [...stack.cards];
          if (deltaY > 0) {
            const topCard = newCards.shift();
            if (topCard) newCards.push(topCard);
          } else {
            const bottomCard = newCards.pop();
            if (bottomCard) newCards.unshift(bottomCard);
          }
          return { ...stack, cards: newCards };
        }
        return stack;
      })
    );
  };

  const handleStackClick = (stackId: string) => {
    if (!connectionMode) return;

    if (!sourceStackId) {
      setSourceStackId(stackId);
    } else {
      const newConnection: ConnectionData = {
        id: `conn-${Date.now()}`,
        from: sourceStackId,
        to: stackId,
      };
      setConnections([...connections, newConnection]);
      setSourceStackId(null);
      setConnectionMode(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        onCreateCard={handleCreateCard}
        onConnectFrom={() => {
          setConnectionMode(true);
          setSourceStackId(null);
        }}
      />
      <Canvas
        stacks={stacks}
        connections={connections}
        onStackDragEnd={handleStackDragEnd}
        onStackWheel={handleStackWheel}
        onStackClick={handleStackClick}
      />
    </div>
  );
}

export default App;
