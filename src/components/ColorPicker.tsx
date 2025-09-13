import React from 'react';
import { CARD_COLORS, CardColor } from '../types';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
  x: number;
  y: number;
}

const ColorPicker = ({ selectedColor, onColorSelect, onClose, x, y }: ColorPickerProps) => {
  const colorEntries = Object.entries(CARD_COLORS);

  const handleColorClick = (color: string) => {
    onColorSelect(color);
    onClose();
  };

  const getColorDisplayName = (key: string): string => {
    return key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: `${y + 30}px`,
        left: `${x}px`,
        backgroundColor: 'white',
        border: '2px solid #007acc',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 1000,
        minWidth: '250px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        Background Color
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '6px',
        marginBottom: '8px'
      }}>
        {colorEntries.map(([key, color]) => (
          <div
            key={key}
            onClick={() => handleColorClick(color)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: color,
              border: selectedColor === color ? '3px solid #007acc' : '2px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: selectedColor === color ? '0 2px 4px rgba(0,122,204,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = selectedColor === color ? '0 2px 4px rgba(0,122,204,0.3)' : '0 1px 2px rgba(0,0,0,0.1)';
            }}
            title={getColorDisplayName(key)}
          >
            {selectedColor === color && (
              <span style={{ color: color === '#ffffff' ? '#333' : '#fff', fontSize: '16px' }}>✓</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '6px 12px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          color: '#666',
          fontFamily: 'Arial, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ColorPicker;