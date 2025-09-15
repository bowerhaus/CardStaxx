import { useState, useCallback } from 'react';
import { NotecardData, StackData, CARD_COLORS } from '../types';

export const useCardOperations = (
  stacks: StackData[],
  setStacks: (stacks: StackData[] | ((prev: StackData[]) => StackData[])) => void,
  setHasUnsavedChanges: (changed: boolean) => void
) => {
  const [colorPickerCardId, setColorPickerCardId] = useState<string | null>(null);
  const [colorPickerPosition, setColorPickerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [deleteConfirmCardId, setDeleteConfirmCardId] = useState<string | null>(null);

  const handleCreateCard = useCallback((cardData?: Partial<NotecardData>) => {
    const newCard: NotecardData = {
      id: `card-${Date.now()}`,
      title: cardData?.title || 'New Card',
      content: cardData?.content || 'This is a new notecard.',
      date: new Date().toISOString(),
      backgroundColor: cardData?.backgroundColor || CARD_COLORS.DEFAULT,
      tags: cardData?.tags,
      key: cardData?.key,
      width: cardData?.width,
      height: cardData?.height,
    };
    const newStack: StackData = {
      id: `stack-${Date.now()}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      cards: [newCard],
    };
    setStacks([...stacks, newStack]);
    setHasUnsavedChanges(true);
  }, [stacks, setStacks, setHasUnsavedChanges]);

  const handleUpdateCard = useCallback((cardId: string, updates: Partial<NotecardData>) => {
    setStacks(
      stacks.map(stack => ({
        ...stack,
        cards: stack.cards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }))
    );
    setHasUnsavedChanges(true);
  }, [stacks, setStacks, setHasUnsavedChanges]);

  const handleCardResize = useCallback((cardId: string, newWidth: number, newHeight: number) => {
    setStacks(
      stacks.map(stack => {
        // Check if this stack contains the card being resized
        const hasCard = stack.cards.some(card => card.id === cardId);
        
        if (hasCard) {
          // If this stack contains the card, resize ALL cards in the stack
          return {
            ...stack,
            cards: stack.cards.map(card => ({
              ...card,
              width: newWidth,
              height: newHeight
            }))
          };
        }
        
        // Otherwise, leave the stack unchanged
        return stack;
      })
    );
    setHasUnsavedChanges(true);
  }, [stacks, setStacks, setHasUnsavedChanges]);

  const handleColorChange = useCallback((cardId: string, newColor: string) => {
    handleUpdateCard(cardId, { backgroundColor: newColor });
    setColorPickerCardId(null); // Close color picker after selection
  }, [handleUpdateCard]);

  const handleColorPickerOpen = useCallback((cardId: string, x: number, y: number) => {
    setColorPickerCardId(cardId);
    setColorPickerPosition({ x, y });
  }, []);

  const handleColorPickerClose = useCallback(() => {
    setColorPickerCardId(null);
  }, []);

  const handleCardDeleteRequest = useCallback((cardId: string, x?: number, y?: number) => {
    setDeleteConfirmCardId(cardId);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmCardId) {
      // Find and remove the card from its stack, tracking which stacks get deleted
      let deletedStackIds: string[] = [];
      
      setStacks(prevStacks => {
        const originalStackIds = new Set(prevStacks.map(s => s.id));
        
        const updatedStacks = prevStacks.map(stack => {
          // Check if this stack contains the card to delete
          const cardIndex = stack.cards.findIndex(card => card.id === deleteConfirmCardId);
          
          if (cardIndex !== -1) {
            // Remove the card from the stack
            const updatedCards = stack.cards.filter(card => card.id !== deleteConfirmCardId);
            
            // Return updated stack with remaining cards
            return {
              ...stack,
              cards: updatedCards
            };
          }
          
          return stack;
        }).filter(stack => stack.cards.length > 0); // Remove empty stacks
        
        // Track which stacks were deleted
        const remainingStackIds = new Set(updatedStacks.map(s => s.id));
        deletedStackIds = Array.from(originalStackIds).filter(id => !remainingStackIds.has(id));
        
        return updatedStacks;
      });
      
      setHasUnsavedChanges(true);
    }
    
    setDeleteConfirmCardId(null);
  }, [deleteConfirmCardId, setStacks, setHasUnsavedChanges]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmCardId(null);
  }, []);

  const handleCardBreakOut = useCallback((cardId: string) => {
    setStacks(prevStacks => {
      let cardToBreakOut: NotecardData | null = null;
      let sourceStackId: string | null = null;
      
      // Find the card and its source stack
      for (const stack of prevStacks) {
        const cardIndex = stack.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          cardToBreakOut = stack.cards[cardIndex];
          sourceStackId = stack.id;
          break;
        }
      }
      
      if (!cardToBreakOut || !sourceStackId) {
        return prevStacks; // Card not found
      }
      
      // Find source stack position for offset
      const sourceStack = prevStacks.find(s => s.id === sourceStackId);
      if (!sourceStack) {
        return prevStacks;
      }
      
      // Remove card from source stack
      const updatedStacks = prevStacks.map(stack => {
        if (stack.id === sourceStackId) {
          return {
            ...stack,
            cards: stack.cards.filter(card => card.id !== cardId)
          };
        }
        return stack;
      }).filter(stack => stack.cards.length > 0); // Remove empty stacks
      
      // Create new single-card stack at an offset position
      const newStack: StackData = {
        id: `stack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: sourceStack.x + 50, // Offset to the right
        y: sourceStack.y + 50, // Offset down
        cards: [cardToBreakOut]
      };
      
      return [...updatedStacks, newStack];
    });
    
    setHasUnsavedChanges(true);
  }, [setStacks, setHasUnsavedChanges]);

  return {
    // State
    colorPickerCardId,
    colorPickerPosition,
    deleteConfirmCardId,
    
    // Actions
    handleCreateCard,
    handleUpdateCard,
    handleCardResize,
    handleColorChange,
    handleColorPickerOpen,
    handleColorPickerClose,
    handleCardDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCardBreakOut,
  };
};