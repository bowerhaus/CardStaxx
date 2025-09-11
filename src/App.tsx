import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import EditableTextOverlay from './components/EditableTextOverlay'; // Import new component
import { NotecardData, StackData, ConnectionData, WorkspaceData } from './types';
import Konva from 'konva'; // Import Konva for Node type

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

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

  // State for file management
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for card editing
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'content' | null>(null);
  const [editingKonvaNode, setEditingKonvaNode] = useState<Konva.Node | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>('');

  // Auto-load last opened file on startup
  useEffect(() => {
    const autoLoadLastFile = async () => {
      try {
        const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
        if (!ipcRenderer) return;

        const lastFilePath = await ipcRenderer.invoke('get-last-opened-file');
        if (lastFilePath) {
          try {
            const fileResult = await ipcRenderer.invoke('load-file', lastFilePath);
            if (fileResult.success && fileResult.data) {
              const workspaceData: WorkspaceData = JSON.parse(fileResult.data);
              
              // Clear default welcome card when loading a workspace
              setStacks(workspaceData.stacks);
              setConnections(workspaceData.connections);
              setCurrentFilePath(lastFilePath);
              setHasUnsavedChanges(false);
              
              console.log('Auto-loaded workspace:', lastFilePath);
            } else {
              console.log('Failed to auto-load workspace:', fileResult.error);
              // Keep the default welcome card if auto-load fails
            }
          } catch (error) {
            console.log('Error parsing workspace file:', error);
            // Keep the default welcome card if file is corrupted
          }
        } else {
          console.log('No previous workspace to auto-load');
          // Keep the default welcome card for new users
        }
      } catch (error) {
        console.log('Auto-load not available:', error);
      }
    };

    autoLoadLastFile();
  }, []);

  // Workspace save/load functions
  const saveWorkspace = async (filePath?: string | null) => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      let targetPath: string | undefined = filePath ?? undefined;
      
      if (!targetPath) {
        const result = await ipcRenderer.invoke('save-workspace-dialog');
        if (result.canceled) return;
        targetPath = result.filePath;
      }

      if (!targetPath) {
        alert('No file path specified');
        return;
      }

      const workspaceData: WorkspaceData = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        stacks,
        connections,
      };

      const result = await ipcRenderer.invoke('save-file', targetPath, JSON.stringify(workspaceData, null, 2));
      
      if (result.success) {
        setCurrentFilePath(targetPath || null);
        setHasUnsavedChanges(false);
        // Record as last opened file
        await ipcRenderer.invoke('set-last-opened-file', targetPath);
        alert('Workspace saved successfully!');
      } else {
        alert(`Failed to save workspace: ${result.error}`);
      }
    } catch (error) {
      alert(`Error saving workspace: ${error}`);
    }
  };

  const loadWorkspace = async () => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      const result = await ipcRenderer.invoke('open-workspace-dialog');
      if (result.canceled) return;

      const filePath = result.filePaths[0];
      if (!filePath) {
        alert('No file selected');
        return;
      }

      const fileResult = await ipcRenderer.invoke('load-file', filePath);
      
      if (fileResult.success && fileResult.data) {
        const workspaceData: WorkspaceData = JSON.parse(fileResult.data);
        
        setStacks(workspaceData.stacks);
        setConnections(workspaceData.connections);
        setCurrentFilePath(filePath);
        setHasUnsavedChanges(false);
        
        // Note: Last opened file is already recorded by the main process load-file handler
        alert('Workspace loaded successfully!');
      } else {
        alert(`Failed to load workspace: ${fileResult.error}`);
      }
    } catch (error) {
      alert(`Error loading workspace: ${error}`);
    }
  };

  const newWorkspace = () => {
    if (hasUnsavedChanges) {
      const save = confirm('You have unsaved changes. Save before creating a new workspace?');
      if (save) {
        saveWorkspace();
        return;
      }
    }
    
    setStacks([]);
    setConnections([]);
    setCurrentFilePath(null);
    setHasUnsavedChanges(false);
  };

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
    setHasUnsavedChanges(true);
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
      const topCard = stack.cards[0];
      const stackWidth = topCard?.width || CARD_WIDTH;
      const stackHeight = topCard?.height || CARD_HEIGHT;
      const draggedTopCard = draggedStack.cards[0];
      const draggedWidth = draggedTopCard?.width || CARD_WIDTH;
      const draggedHeight = draggedTopCard?.height || CARD_HEIGHT;
      
      return (
        x < stack.x + stackWidth &&
        x + draggedWidth > stack.x &&
        y < stack.y + stackHeight &&
        y + draggedHeight > stack.y
      );
    });

    if (targetStack) {
      // Get dimensions for size adoption logic
      const targetTopCard = targetStack.cards[0];
      const targetWidth = targetTopCard?.width || CARD_WIDTH;
      const targetHeight = targetTopCard?.height || CARD_HEIGHT;
      
      const draggedTopCard = draggedStack.cards[0];
      const draggedWidth = draggedTopCard?.width || CARD_WIDTH;
      const draggedHeight = draggedTopCard?.height || CARD_HEIGHT;
      
      // Determine final size: use larger dimensions
      const finalWidth = Math.max(targetWidth, draggedWidth);
      const finalHeight = Math.max(targetHeight, draggedHeight);
      
      const newStacks = stacks
        .map(s => {
          if (s.id === targetStack.id) {
            // Resize all cards in target stack to match final size
            const resizedTargetCards = s.cards.map(card => ({
              ...card,
              width: finalWidth,
              height: finalHeight
            }));
            
            // Resize dragged cards to match final size
            const resizedDraggedCards = draggedStack.cards.map(card => ({
              ...card,
              width: finalWidth,
              height: finalHeight
            }));
            
            return { 
              ...s, 
              cards: [...resizedTargetCards, ...resizedDraggedCards] 
            };
          }
          return s;
        })
        .filter(s => s.id !== draggedStackId);
      setStacks(newStacks);
      setHasUnsavedChanges(true);
    } else {
      setStacks(
        stacks.map((stack) => {
          if (stack.id === draggedStackId) {
            return { ...stack, x, y };
          }
          return stack;
        })
      );
      setHasUnsavedChanges(true);
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
        const newConnection: ConnectionData = {
          id: `conn-${Date.now()}`,
          from: currentConnection.fromStackId,
          to: targetStack.id,
        };
        setConnections([...connections, newConnection]);
        setHasUnsavedChanges(true);
        console.log('Connection created:', newConnection);
      } else {
        console.log('No target stack found at drop point.');
      }
    }
    setIsConnecting(false);
    setCurrentConnection(null);
    console.log('--- End handleConnectionDragEnd ---');
  };

  const handleUpdateCard = (cardId: string, newTitle: string, newContent: string) => {
    setStacks(
      stacks.map(stack => ({
        ...stack,
        cards: stack.cards.map(card =>
          card.id === cardId ? { ...card, title: newTitle, content: newContent } : card
        ),
      }))
    );
    setHasUnsavedChanges(true);
  };

  const handleCardResize = (cardId: string, newWidth: number, newHeight: number) => {
    setStacks(
      stacks.map(stack => ({
        ...stack,
        cards: stack.cards.map(card =>
          card.id === cardId ? { ...card, width: newWidth, height: newHeight } : card
        ),
      }))
    );
    setHasUnsavedChanges(true);
  };

  const handleEditStart = useCallback((cardId: string, field: 'title' | 'content', konvaNode: Konva.Node) => {
    console.log('handleEditStart received field:', field);
    setEditingCardId(cardId);
    setEditingField(field);
    setEditingKonvaNode(konvaNode);

    const card = stacks.flatMap(s => s.cards).find(c => c.id === cardId);
    if (card) {
      setEditingTextValue(field === 'title' ? card.title : card.content);
    }
  }, [setEditingCardId, setEditingField, setEditingKonvaNode, stacks, setEditingTextValue]);

  const handleEditBlur = () => {
    if (editingCardId && editingField) {
      const currentCard = stacks.flatMap(s => s.cards).find(c => c.id === editingCardId);
      if (currentCard) {
        // Only update if the text actually changed
        const newValue = editingTextValue.trim();
        if (newValue !== (editingField === 'title' ? currentCard.title : currentCard.content)) {
          handleUpdateCard(
            editingCardId,
            editingField === 'title' ? newValue : currentCard.title,
            editingField === 'content' ? newValue : currentCard.content
          );
        }
      }
    }
    setEditingCardId(null);
    setEditingField(null);
    setEditingKonvaNode(null);
    setEditingTextValue('');
  };

  const getOverlayPosition = () => {
    if (!editingKonvaNode) return { x: 0, y: 0, width: 0, height: 0 };

    const stage = editingKonvaNode.getStage();
    if (!stage) return { x: 0, y: 0, width: 0, height: 0 };

    const stageRect = stage.container().getBoundingClientRect();
    const nodeAbsolutePosition = editingKonvaNode.getAbsolutePosition();

    // The Text nodes already have internal padding, so we need to align with that
    // The padding is already built into the Text node's rendering
    const calculatedPos = {
      x: stageRect.left + nodeAbsolutePosition.x + TITLE_PADDING,
      y: stageRect.top + nodeAbsolutePosition.y + (editingField === 'title' ? TITLE_PADDING : TITLE_PADDING),
      width: editingKonvaNode.width() - TITLE_PADDING * 2,
      height: editingField === 'title' ? 20 : editingKonvaNode.height() - TITLE_PADDING * 2,
    };
    console.log('Calculated Overlay Position:', calculatedPos, 'Field:', editingField);
    return calculatedPos;
  };

  const overlayPos = getOverlayPosition();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        onCreateCard={handleCreateCard}
        onSave={() => saveWorkspace(currentFilePath ?? undefined)}
        onSaveAs={() => saveWorkspace()}
        onLoad={loadWorkspace}
        onNew={newWorkspace}
        hasUnsavedChanges={hasUnsavedChanges}
        currentFilePath={currentFilePath}
      />
      <Canvas
        stacks={stacks}
        connections={connections}
        isConnecting={isConnecting}
        currentConnection={currentConnection}
        onStackDragEnd={handleStackDragEnd}
        onStackDragMove={handleStackDragMove}
        onStackWheel={handleStackWheel}
        onConnectionDragMove={handleConnectionDragMove}
        onConnectionDragEnd={handleConnectionDragEnd}
        onConnectionDragStart={handleConnectionDragStart}
        onUpdateCard={handleUpdateCard} // Pass onUpdateCard
        onEditStart={handleEditStart} // Pass onEditStart
        onCardResize={handleCardResize} // Pass onCardResize
      />
      {editingCardId && editingField && editingKonvaNode && (
        <EditableTextOverlay
          x={overlayPos.x}
          y={overlayPos.y}
          width={overlayPos.width}
          height={overlayPos.height}
          value={editingTextValue}
          isTextArea={editingField === 'content'}
          onChange={setEditingTextValue}
          onBlur={handleEditBlur}
        />
      )}
    </div>
  );
}

export default App;
