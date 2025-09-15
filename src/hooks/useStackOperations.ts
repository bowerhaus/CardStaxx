import { useCallback } from 'react';
import { StackData } from '../types';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';

export const useStackOperations = (
  stacks: StackData[],
  setStacks: (stacks: StackData[] | ((prev: StackData[]) => StackData[])) => void,
  setHasUnsavedChanges: (changed: boolean) => void
) => {
  const handleStackDragMove = useCallback((id: string, x: number, y: number) => {
    setStacks(
      stacks.map((stack) => {
        if (stack.id === id) {
          return { ...stack, x, y };
        }
        return stack;
      })
    );
  }, [stacks, setStacks]);

  const handleStackDragEnd = useCallback((draggedStackId: string, x: number, y: number, mouseX?: number, mouseY?: number) => {
    const draggedStack = stacks.find((s) => s.id === draggedStackId);
    if (!draggedStack) return;

    // Use mouse position for collision detection if provided, otherwise fall back to stack position
    const checkX = mouseX !== undefined ? mouseX : x;
    const checkY = mouseY !== undefined ? mouseY : y;

    const targetStack = stacks.find(stack => {
      if (stack.id === draggedStackId) return false;
      
      // Calculate the visual bounds of the target stack (same as Stack component)
      const topCard = stack.cards[0];
      const baseCardWidth = topCard?.width || CARD_WIDTH;
      const baseCardHeight = topCard?.height || CARD_HEIGHT;
      const borderPadding = 10;
      const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
      const HEADER_OFFSET = 40;
      
      const stackWidth = baseCardWidth + borderPadding * 2;
      const stackHeight = baseCardHeight + (stack.cards.length - 1) * HEADER_OFFSET + borderPadding * 2 + headerTextSpace;
      
      // Check if mouse position is within the target stack's visual boundaries
      return (
        checkX >= stack.x &&
        checkX <= stack.x + stackWidth &&
        checkY >= stack.y &&
        checkY <= stack.y + stackHeight
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
  }, [stacks, setStacks, setHasUnsavedChanges]);

  const handleStackWheel = useCallback((stackId: string, deltaY: number) => {
    // Direct scroll handling without throttling for maximum responsiveness
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
  }, [stacks, setStacks]);

  const handleUpdateStack = useCallback((stackId: string, updates: Partial<StackData>) => {
    setStacks(
      stacks.map(stack =>
        stack.id === stackId ? { ...stack, ...updates } : stack
      )
    );
    setHasUnsavedChanges(true);
  }, [stacks, setStacks, setHasUnsavedChanges]);

  return {
    handleStackDragMove,
    handleStackDragEnd,
    handleStackWheel,
    handleUpdateStack,
  };
};