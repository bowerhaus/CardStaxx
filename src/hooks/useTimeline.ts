import { useState, useCallback } from 'react';

export const useTimeline = () => {
  const [isTimelineVisible, setIsTimelineVisible] = useState<boolean>(false);

  // Timeline toggle handler
  const handleTimelineToggle = useCallback(() => {
    setIsTimelineVisible(prev => !prev);
  }, []);

  // Timeline card interaction handlers
  const handleTimelineCardClick = useCallback((cardId: string, setHighlightedCardIds: (ids: Set<string>) => void) => {
    // Highlight the clicked card
    setHighlightedCardIds(new Set([cardId]));
  }, []);

  const handleTimelineCardHover = useCallback((cardId: string | null, setHighlightedCardIds: (ids: Set<string>) => void) => {
    if (cardId) {
      setHighlightedCardIds(new Set([cardId]));
    } else {
      setHighlightedCardIds(new Set());
    }
  }, []);

  return {
    // State
    isTimelineVisible,
    
    // Actions
    handleTimelineToggle,
    handleTimelineCardClick,
    handleTimelineCardHover,
  };
};