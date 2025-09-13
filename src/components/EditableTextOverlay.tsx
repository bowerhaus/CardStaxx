import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

interface EditableTextOverlayProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  isTextArea?: boolean;
  inputType?: string;
  fieldType?: 'title' | 'content' | 'date' | 'key' | 'tags';
  onChange: (newValue: string) => void;
  onBlur: () => void;
}

const EditableTextOverlay = ({
  x,
  y,
  width,
  height,
  value,
  isTextArea = false,
  inputType = 'text',
  fieldType,
  onChange,
  onBlur,
}: EditableTextOverlayProps) => {
  const inputRef = useRef<any>(null); // Changed to any
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (inputRef.current && !hasInitialized.current) {
      inputRef.current.focus();
      inputRef.current.value = value;
      // Auto-select all text when editing starts (only on first render)
      if (!isTextArea) {
        inputRef.current.select();
      } else {
        // For textarea, select all text
        inputRef.current.setSelectionRange(0, value.length);
      }
      hasInitialized.current = true;
      console.log('EditableTextOverlay: Input focused and text selected!', inputRef.current);
    }
  }, []); // Remove dependencies to prevent re-running

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTextArea) {
      // For input fields, Enter submits
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      // Escape cancels editing without saving
      if (inputRef.current) {
        inputRef.current.value = value; // Reset to original value
        inputRef.current.blur();
      }
    } else if (e.key === 'Enter' && e.ctrlKey && isTextArea) {
      // Ctrl+Enter submits textarea
      inputRef.current?.blur();
    }
  };

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: '2px solid #007acc', // Blue border to indicate active editing
    padding: '2px',
    margin: '0',
    background: 'white',
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius: '3px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  return isTextArea ? (
    <textarea
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      style={{ 
        ...commonStyle, 
        resize: 'none', 
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.2',
      }}
    />
  ) : (
    <input
      ref={inputRef}
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      style={{ 
        ...commonStyle, 
        fontSize: fieldType === 'key' ? '12px' : fieldType === 'tags' ? '12px' : inputType === 'date' ? '14px' : fieldType === 'content' ? '14px' : '16px', 
        fontWeight: fieldType === 'key' || fieldType === 'tags' || fieldType === 'content' || inputType === 'date' ? 'normal' : 'bold',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1',
      }}
    />
  );
};

export default EditableTextOverlay;