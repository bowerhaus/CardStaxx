import React, { useState } from 'react';
import { NotecardData, SearchFilters, SearchResult } from '../types';
import { FONT_FAMILY } from '../constants/typography';

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
  canvasZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusToggle: () => void;
  isFocusModeEnabled: boolean;
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
  onTimelineToggle,
  canvasZoom,
  onZoomIn,
  onZoomOut,
  onFocusToggle,
  isFocusModeEnabled
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
    <div style={{ 
      width: '280px', 
      borderRight: '1px solid #e0e0e0', 
      padding: '20px', 
      height: '100vh', 
      backgroundColor: '#fafafa', 
      overflowY: 'auto', 
      fontFamily: FONT_FAMILY,
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{ 
            width: '28px',
            height: '28px',
            backgroundColor: '#ff7b00',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            📚
          </div>
          <h2 style={{ 
            fontFamily: 'inherit', 
            margin: '0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}>
            Knowledge Cards
          </h2>
        </div>
        <div style={{ 
          fontSize: '13px', 
          color: '#888', 
          fontFamily: 'inherit',
          marginLeft: '40px'
        }}>
          Personal knowledge database
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '8px', 
          fontFamily: 'inherit',
          marginLeft: '40px'
        }}>
          {getFileName()}{hasUnsavedChanges ? ' *' : ''}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <button 
          onClick={onNew} 
          style={{ 
            flex: '1',
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#f5f5f5';
            target.style.borderColor = '#ccc';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#fff';
            target.style.borderColor = '#ddd';
          }}
        >
          🔄 New
        </button>
        <button 
          onClick={onLoad} 
          style={{ 
            flex: '1',
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#f5f5f5';
            target.style.borderColor = '#ccc';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#fff';
            target.style.borderColor = '#ddd';
          }}
        >
          📁 Load
        </button>
        <button 
          onClick={onSave} 
          disabled={!hasUnsavedChanges}
          style={{ 
            flex: '1',
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: hasUnsavedChanges ? '#fff' : '#f8f8f8',
            color: hasUnsavedChanges ? '#333' : '#999',
            border: `1px solid ${hasUnsavedChanges ? '#ddd' : '#e8e8e8'}`,
            borderRadius: '6px',
            cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (hasUnsavedChanges) {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#f5f5f5';
              target.style.borderColor = '#ccc';
            }
          }}
          onMouseLeave={(e) => {
            if (hasUnsavedChanges) {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#fff';
              target.style.borderColor = '#ddd';
            }
          }}
        >
          💾 Save
        </button>
        <button 
          onClick={onSaveAs}
          style={{ 
            flex: '1',
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#f5f5f5';
            target.style.borderColor = '#ccc';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.backgroundColor = '#fff';
            target.style.borderColor = '#ddd';
          }}
        >
          📋 Save As
        </button>
      </div>
      
      <button 
        onClick={handleNewCard} 
        style={{ 
          width: '100%', 
          padding: '12px 16px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#ff7b00',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(255,123,0,0.2)'
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLElement;
          target.style.backgroundColor = '#e66a00';
          target.style.transform = 'translateY(-1px)';
          target.style.boxShadow = '0 4px 8px rgba(255,123,0,0.3)';
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLElement;
          target.style.backgroundColor = '#ff7b00';
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = '0 2px 4px rgba(255,123,0,0.2)';
        }}
      >
        ➕ Create New Card
      </button>
      
      {/* Search Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          position: 'relative',
          marginBottom: '12px'
        }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
            color: '#888',
            pointerEvents: 'none'
          }}>
            🔍
          </div>
          <input 
            type="search" 
            placeholder="Search cards..." 
            style={{ 
              width: '100%',
              padding: '10px 12px 10px 36px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            value={searchFilters.searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={(e) => {
              const target = e.target as HTMLElement;
              target.style.borderColor = '#ff7b00';
              target.style.boxShadow = '0 0 0 3px rgba(255,123,0,0.1)';
            }}
            onBlur={(e) => {
              const target = e.target as HTMLElement;
              target.style.borderColor = '#ddd';
              target.style.boxShadow = 'none';
            }}
          />
        </div>
        {(searchFilters.searchText || searchFilters.selectedTags.length > 0 || searchFilters.focusedKey) && (
          <button 
            onClick={clearAllFilters}
            style={{ 
              fontSize: '12px', 
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#e9ecef';
              target.style.borderColor = '#ccc';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = '#f8f9fa';
              target.style.borderColor = '#ddd';
            }}
          >
            🗑️ Clear All Filters
          </button>
        )}
      </div>

      {/* Statistics */}
      <div style={{ 
        fontSize: '13px', 
        color: '#777', 
        marginBottom: '20px', 
        fontFamily: 'inherit',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
          📊 Showing {filteredCards} of {totalCards} cards
        </div>
        {searchResults.length > 0 && (
          <div style={{ fontSize: '12px', color: '#999' }}>
            🎯 {searchResults.length} search matches
          </div>
        )}
      </div>

      {/* Key Filter Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontFamily: 'inherit',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🔑 Filter by Key
        </h4>
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
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontFamily: 'inherit',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🏷️ Filter by Tags
        </h4>
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
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '15px', 
            fontFamily: 'inherit',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🎯 Search Results
          </h4>
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
      <div style={{ marginTop: '24px', marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontFamily: 'inherit',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          📅 Timeline View
        </h4>
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
          {isTimelineVisible ? '👁️ Hide Timeline' : '📅 Show Timeline'}
        </button>
      </div>
      {/* Canvas Zoom Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontFamily: 'inherit',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🔍 Canvas Zoom
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#666', fontFamily: 'inherit' }}>Zoom: {Math.round(canvasZoom * 100)}%</span>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={onZoomOut}
              disabled={canvasZoom <= 0.5}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '12px',
                backgroundColor: canvasZoom <= 0.5 ? '#f0f0f0' : '#f8f9fa',
                color: canvasZoom <= 0.5 ? '#999' : '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: canvasZoom <= 0.5 ? 'not-allowed' : 'pointer'
              }}
            >
              🔍− Zoom Out
            </button>
            <button
              onClick={onZoomIn}
              disabled={canvasZoom >= 2}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '12px',
                backgroundColor: canvasZoom >= 2 ? '#f0f0f0' : '#f8f9fa',
                color: canvasZoom >= 2 ? '#999' : '#333',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: canvasZoom >= 2 ? 'not-allowed' : 'pointer'
              }}
            >
              🔍+ Zoom In
            </button>
          </div>
          <button
            onClick={onFocusToggle}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '12px',
              backgroundColor: isFocusModeEnabled ? '#007bff' : '#f8f9fa',
              color: isFocusModeEnabled ? 'white' : '#333',
              border: `1px solid ${isFocusModeEnabled ? '#007bff' : '#ccc'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: isFocusModeEnabled ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (!isFocusModeEnabled) {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#e9ecef';
                target.style.borderColor = '#007bff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isFocusModeEnabled) {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = '#f8f9fa';
                target.style.borderColor = '#ccc';
              }
            }}
          >
            {isFocusModeEnabled ? '🎯 Focus: ON' : '🎯 Focus Visible Cards'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
