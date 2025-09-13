import React, { useState } from 'react';
import { NotecardData, SearchFilters, SearchResult } from '../types';

interface SidebarProps {
  onCreateCard: (cardData?: Partial<NotecardData>) => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  onNew: () => void;
  hasUnsavedChanges: boolean;
  currentFilePath: string | null;
  searchFilters: SearchFilters;
  onSearchChange: (searchText: string) => void;
  onTagFilterChange: (tags: string[]) => void;
  onKeyFilterChange: (key?: string) => void;
  availableTags: string[];
  availableKeys: string[];
  searchResults: SearchResult[];
  totalCards: number;
  filteredCards: number;
  isTimelineVisible: boolean;
  onTimelineToggle: () => void;
}

const Sidebar = ({ 
  onCreateCard, 
  onSave, 
  onSaveAs, 
  onLoad, 
  onNew, 
  hasUnsavedChanges, 
  currentFilePath,
  searchFilters,
  onSearchChange,
  onTagFilterChange,
  onKeyFilterChange,
  availableTags,
  availableKeys,
  searchResults,
  totalCards,
  filteredCards,
  isTimelineVisible,
  onTimelineToggle
}: SidebarProps) => {
  const getFileName = () => {
    if (!currentFilePath) return 'Untitled';
    return currentFilePath.split('/').pop()?.replace('.cardstaxx', '') || 'Untitled';
  };

  const handleNewCard = () => {
    // Create card with smart defaults
    const cardData: Partial<NotecardData> = {
      title: 'New Card',
      content: 'This is a new notecard.',
      date: new Date().toISOString(), // Today's date
      key: 'general', // Default key
      tags: ['note'] // Default tag
    };
    onCreateCard(cardData);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = searchFilters.selectedTags.includes(tag)
      ? searchFilters.selectedTags.filter(t => t !== tag)
      : [...searchFilters.selectedTags, tag];
    onTagFilterChange(newTags);
  };

  const handleKeySelect = (key: string) => {
    const newKey = searchFilters.focusedKey === key ? undefined : key;
    onKeyFilterChange(newKey);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTagFilterChange([]);
    onKeyFilterChange(undefined);
  };

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', height: '100vh', backgroundColor: '#f7f7f7', overflowY: 'auto', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <h2 style={{ fontFamily: 'inherit' }}>CardStaxx</h2>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', fontFamily: 'inherit' }}>
        {getFileName()}{hasUnsavedChanges ? ' *' : ''}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={onNew} style={{ marginRight: '5px' }}>New</button>
        <button onClick={onLoad} style={{ marginRight: '5px' }}>Load</button>
        <button onClick={onSave} style={{ marginRight: '5px' }} disabled={!hasUnsavedChanges}>
          Save
        </button>
        <button onClick={onSaveAs}>Save As</button>
      </div>
      
      <hr />
      <button onClick={handleNewCard} style={{ width: '100%', marginBottom: '10px' }}>
        New Card
      </button>
      <hr />
      
      {/* Search Section */}
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="search" 
          placeholder="Search cards..." 
          style={{ width: '100%', marginBottom: '5px' }}
          value={searchFilters.searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {(searchFilters.searchText || searchFilters.selectedTags.length > 0 || searchFilters.focusedKey) && (
          <button 
            onClick={clearAllFilters}
            style={{ fontSize: '11px', padding: '2px 6px' }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Statistics */}
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', fontFamily: 'inherit' }}>
        Showing {filteredCards} of {totalCards} cards
        {searchResults.length > 0 && (
          <div>{searchResults.length} search matches</div>
        )}
      </div>

      {/* Key Filter Section */}
      <div style={{ marginBottom: '10px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontFamily: 'inherit' }}>Key Cloud</h4>
        <div style={{ 
          maxHeight: '120px', 
          overflowY: 'auto', 
          border: '1px solid #ddd', 
          padding: '8px', 
          backgroundColor: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'flex-start'
        }}>
          {availableKeys.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#999', width: '100%', fontFamily: 'inherit' }}>No keys available</div>
          ) : (
            availableKeys.map(key => {
              const isSelected = searchFilters.focusedKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleKeySelect(key)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px', // Rectangle shape (less rounded than pills)
                    border: isSelected ? 'none' : '1px solid #ccc',
                    backgroundColor: isSelected ? '#28a745' : '#f8f9fa', // Green for keys vs blue for tags
                    color: isSelected ? 'white' : '#333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 4px rgba(40,167,69,0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = '#e9ecef';
                      target.style.borderColor = '#28a745';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = '#f8f9fa';
                      target.style.borderColor = '#ccc';
                    }
                  }}
                >
                  🔑 {key}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Tag Filter Section */}
      <div style={{ marginBottom: '10px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontFamily: 'inherit' }}>Tag Cloud</h4>
        <div style={{ 
          maxHeight: '150px', 
          overflowY: 'auto', 
          border: '1px solid #ddd', 
          padding: '8px', 
          backgroundColor: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'flex-start'
        }}>
          {availableTags.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#999', width: '100%', fontFamily: 'inherit' }}>No tags available</div>
          ) : (
            availableTags.map(tag => {
              const isSelected = searchFilters.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: isSelected ? 'none' : '1px solid #ccc',
                    backgroundColor: isSelected ? '#007bff' : '#f8f9fa',
                    color: isSelected ? 'white' : '#333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 4px rgba(0,123,255,0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = '#e9ecef';
                      target.style.borderColor = '#007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = '#f8f9fa';
                      target.style.borderColor = '#ccc';
                    }
                  }}
                >
                  🏷️ {tag}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontFamily: 'inherit' }}>Search Results</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '5px', backgroundColor: '#fff' }}>
            {searchResults.map((result, index) => (
              <div key={`${result.cardId}-${result.matchType}-${index}`} style={{ marginBottom: '5px', padding: '3px', border: '1px solid #eee', borderRadius: '3px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', fontFamily: 'inherit' }}>
                  {result.matchType.toUpperCase()} MATCH
                </div>
                <div style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  {result.matchText}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Toggle */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontFamily: 'inherit' }}>Timeline View</h4>
        <button
          onClick={onTimelineToggle}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: isTimelineVisible ? '#007bff' : '#f8f9fa',
            color: isTimelineVisible ? 'white' : '#333',
            border: `1px solid ${isTimelineVisible ? '#007bff' : '#ccc'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isTimelineVisible ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => {
            if (!isTimelineVisible) {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#e9ecef';
              target.style.borderColor = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isTimelineVisible) {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#f8f9fa';
              target.style.borderColor = '#ccc';
            }
          }}
        >
          📅 {isTimelineVisible ? 'Hide Timeline' : 'Show Timeline'}
        </button>
      </div>
      <div>
        <h4 style={{ fontFamily: 'inherit' }}>Canvas Zoom</h4>
        {/* Zoom controls will go here */}
      </div>
    </div>
  );
};

export default Sidebar;
