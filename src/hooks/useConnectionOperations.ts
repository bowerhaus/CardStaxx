import { useState, useCallback } from 'react';
import { ConnectionData, StackData } from '../types';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';
import Konva from 'konva';

export const useConnectionOperations = (
  stacks: StackData[],
  connections: ConnectionData[],
  setConnections: (connections: ConnectionData[] | ((prev: ConnectionData[]) => ConnectionData[])) => void,
  setHasUnsavedChanges: (changed: boolean) => void
) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<{ fromStackId: string; toX: number; toY: number } | null>(null);

  const handleConnectionDragStart = useCallback((fromStackId: string, startX: number, startY: number) => {
    setIsConnecting(true);
    setCurrentConnection({ fromStackId, toX: startX, toY: startY });
  }, []);

  const handleConnectionDragMove = useCallback((currentX: number, currentY: number) => {
    if (currentConnection) {
      setCurrentConnection({ ...currentConnection, toX: currentX, toY: currentY });
    }
  }, [currentConnection]);

  const handleConnectionDragEnd = useCallback((endX: number, endY: number) => {
    console.log('--- handleConnectionDragEnd ---');
    console.log('Dropped at:', { endX, endY });
    if (currentConnection) {
      console.log('From Stack ID:', currentConnection.fromStackId);
      const targetStack = stacks.find(stack => {
        if (stack.id === currentConnection.fromStackId) {
          console.log('Skipping source stack:', stack.id);
          return false;
        }

        const topCard = stack.cards[0];
        const stackWidth = topCard?.width || CARD_WIDTH;
        const stackHeight = (topCard?.height || CARD_HEIGHT) + (stack.cards.length - 1) * 40; // Assuming HEADER_OFFSET is 40
        const collision = (
          endX > stack.x &&
          endX < stack.x + stackWidth &&
          endY > stack.y &&
          endY < stack.y + stackHeight
        );
        console.log(`Checking stack ${stack.id} at (${stack.x}, ${stack.y}) with size (${stackWidth}, ${stackHeight}). Collision: ${collision}`);
        return collision;
      });

      if (targetStack) {
        console.log('Target Stack Found:', targetStack.id);
        
        // Check if connection already exists (in either direction)
        const existingConnection = connections.find(conn => 
          (conn.from === currentConnection.fromStackId && conn.to === targetStack.id) ||
          (conn.from === targetStack.id && conn.to === currentConnection.fromStackId)
        );
        
        if (existingConnection) {
          console.log('Connection already exists between these stacks:', existingConnection);
        } else {
          const newConnection: ConnectionData = {
            id: `conn-${Date.now()}`,
            from: currentConnection.fromStackId,
            to: targetStack.id,
          };
          setConnections([...connections, newConnection]);
          setHasUnsavedChanges(true);
          console.log('Connection created:', newConnection);
        }
      } else {
        console.log('No target stack found at drop point.');
      }
    }
    setIsConnecting(false);
    setCurrentConnection(null);
    console.log('--- End handleConnectionDragEnd ---');
  }, [currentConnection, stacks, connections, setConnections, setHasUnsavedChanges]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
    setHasUnsavedChanges(true);
  }, [setConnections, setHasUnsavedChanges]);

  const handleConnectionUpdate = useCallback((connectionId: string, label: string) => {
    setConnections(prevConnections => 
      prevConnections.map(conn => 
        conn.id === connectionId ? { ...conn, label: label.trim() || undefined } : conn
      )
    );
    setHasUnsavedChanges(true);
  }, [setConnections, setHasUnsavedChanges]);

  return {
    // State
    isConnecting,
    currentConnection,
    
    // Actions
    handleConnectionDragStart,
    handleConnectionDragMove,
    handleConnectionDragEnd,
    handleConnectionDelete,
    handleConnectionUpdate,
  };
};