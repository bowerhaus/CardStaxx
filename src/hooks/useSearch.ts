import { useState, useCallback, useMemo, useEffect } from 'react';
import { StackData, SearchFilters, SearchResult } from '../types';

export const useSearch = (stacks: StackData[]) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchText: '',
    selectedTags: [],
    focusedKey: undefined
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [highlightedCardIds, setHighlightedCardIds] = useState<Set<string>>(new Set());

  const performSearch = useCallback((filters: SearchFilters): SearchResult[] => {
    const { searchText } = filters;
    const results: SearchResult[] = [];
    
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        // Search text matching
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          
          // Title match
          if (card.title.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'title',
              matchText: card.title
            });
          }
          
          // Content match
          if (card.content.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'content',
              matchText: card.content.substring(0, 100) + '...'
            });
          }
          
          // Tags match
          if (card.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
            const matchingTags = card.tags.filter(tag => tag.toLowerCase().includes(searchLower));
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'tags',
              matchText: matchingTags.join(', ')
            });
          }
          
          // Key match
          if (card.key?.toLowerCase().includes(searchLower)) {
            results.push({
              cardId: card.id,
              stackId: stack.id,
              matchType: 'key',
              matchText: card.key
            });
          }
        }
      });
    });
    
    return results;
  }, [stacks]);

  const getFilteredStacks = useCallback((): StackData[] => {
    const { searchText, selectedTags, focusedKey } = searchFilters;
    
    // If no filters are active, return all stacks
    if (!searchText.trim() && selectedTags.length === 0 && !focusedKey) {
      return stacks;
    }
    
    return stacks.map(stack => ({
      ...stack,
      cards: stack.cards.filter(card => {
        // Text search filter
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          const matchesText = 
            card.title.toLowerCase().includes(searchLower) ||
            card.content.toLowerCase().includes(searchLower) ||
            card.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
            card.key?.toLowerCase().includes(searchLower);
          
          if (!matchesText) return false;
        }
        
        // Tag filter (AND logic)
        if (selectedTags.length > 0) {
          const cardTags = card.tags || [];
          const hasAllTags = selectedTags.every(tag => 
            cardTags.some(cardTag => cardTag.toLowerCase() === tag.toLowerCase())
          );
          if (!hasAllTags) return false;
        }
        
        // Key filter
        if (focusedKey && card.key?.toLowerCase() !== focusedKey.toLowerCase()) {
          return false;
        }
        
        return true;
      })
    })).filter(stack => stack.cards.length > 0); // Remove empty stacks
  }, [stacks, searchFilters]);

  const getAllTags = useCallback((): string[] => {
    const tagSet = new Set<string>();
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        if (card.tags) {
          card.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [stacks]);

  const getAllKeys = useCallback((): string[] => {
    const keySet = new Set<string>();
    stacks.forEach(stack => {
      stack.cards.forEach(card => {
        if (card.key) {
          keySet.add(card.key.toLowerCase());
        }
      });
    });
    return Array.from(keySet).sort();
  }, [stacks]);

  const handleSearchChange = useCallback((searchText: string) => {
    setSearchFilters(prev => ({ ...prev, searchText }));
  }, []);

  const handleTagFilterChange = useCallback((tags: string[]) => {
    setSearchFilters(prev => ({ ...prev, selectedTags: tags }));
  }, []);

  const handleKeyFilterChange = useCallback((key?: string) => {
    setSearchFilters(prev => ({ ...prev, focusedKey: key }));
  }, []);

  // Update search results when filters or stacks change
  useEffect(() => {
    const results = performSearch(searchFilters);
    setSearchResults(results);
    setHighlightedCardIds(new Set(results.map(r => r.cardId)));
  }, [searchFilters, performSearch]);

  return {
    // State
    searchFilters,
    searchResults,
    highlightedCardIds,
    
    // Computed values
    filteredStacks: getFilteredStacks(),
    availableTags: getAllTags(),
    availableKeys: getAllKeys(),
    
    // Actions
    handleSearchChange,
    handleTagFilterChange,
    handleKeyFilterChange,
    setHighlightedCardIds,
    getFilteredStacks,
    performSearch,
  };
};