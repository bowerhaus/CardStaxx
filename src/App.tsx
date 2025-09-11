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
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<{ fromStackId: string; toX: number; toY: number } | null>(null);

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

  const handleStackDragMove = (id: string, x: number, y: number) => {
    setStacks(
      stacks.map((stack) => {
        if (stack.id === id) {
          return { ...stack, x, y };
        }
        return stack;
      })
    );
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

  const handleConnectionDragStart = (fromStackId: string, startX: number, startY: number) => {
    setIsConnecting(true);
    setCurrentConnection({ fromStackId, toX: startX, toY: startY });
  };

  const handleConnectionDragMove = (currentX: number, currentY: number) => {
    if (currentConnection) {
      setCurrentConnection({ ...currentConnection, toX: currentX, toY: currentY });
    }
  };

  const handleConnectionDragEnd = (endX: number, endY: number) => {
    console.log('--- handleConnectionDragEnd ---');
    console.log('Dropped at:', { endX, endY });
    if (currentConnection) {
      console.log('From Stack ID:', currentConnection.fromStackId);
      const targetStack = stacks.find(stack => {
        if (stack.id === currentConnection.fromStackId) {
          console.log('Skipping source stack:', stack.id);
          return false;
        }

        const stackHeight = CARD_HEIGHT + (stack.cards.length - 1) * 40; // Assuming HEADER_OFFSET is 40
        const collision = (
          endX > stack.x &&
          endX < stack.x + CARD_WIDTH &&
          endY > stack.y &&
          endY < stack.y + stackHeight
        );
        console.log(`Checking stack ${stack.id} at (${stack.x}, ${stack.y}) with size (${CARD_WIDTH}, ${stackHeight}). Collision: ${collision}`);
        return collision;
      });

      if (targetStack) {
        console.log('Target Stack Found:', targetStack.id);
        const newConnection: ConnectionData = {
          id: `conn-${Date.now()}`,
          from: currentConnection.fromStackId,
          to: targetStack.id,
        };
        setConnections([...connections, newConnection]);
        console.log('Connection created:', newConnection);
      } else {
        console.log('No target stack found at drop point.');
      }
    }
    setIsConnecting(false);
    setCurrentConnection(null);
    console.log('--- End handleConnectionDragEnd ---');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onCreateCard={handleCreateCard} />
      <Canvas
        stacks={stacks}
        connections={connections}
        isConnecting={isConnecting}
        currentConnection={currentConnection}
        onStackDragEnd={handleStackDragEnd}
        onStackDragMove={handleStackDragMove} // Added
        onStackWheel={handleStackWheel}
        onConnectionDragMove={handleConnectionDragMove}
        onConnectionDragEnd={handleConnectionDragEnd}
        onConnectionDragStart={handleConnectionDragStart}
      />
    </div>
  );
}

export default App;