import React, { useRef, useEffect, useCallback } from 'react';
import Konva from 'konva';
import { FONT_FAMILY } from '../constants/typography';

interface EditableTextOverlayProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  isTextArea?: boolean;
  inputType?: string;
  fieldType?: 'title' | 'content' | 'date' | 'key' | 'tags' | 'connection' | 'stack-title';
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
  const overlayRef = useRef<HTMLDivElement>(null);
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
    }
  }, []); // Remove dependencies to prevent re-running

  // Handle click outside to close overlay
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Only handle mousedown events
    if (event.type !== 'mousedown') return;

    // Check if the click is actually outside our overlay
    if (overlayRef.current && event.target instanceof Node && !overlayRef.current.contains(event.target)) {
      // Close the editor for any outside click
      onBlur();
    }
  }, [onBlur]);


  useEffect(() => {
    // Add a delay before listening for click outside events
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 200); // Longer delay to ensure editor is fully initialized

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTextArea) {
      // For input fields, Enter submits
      e.preventDefault();
      onBlur();
    } else if (e.key === 'Escape') {
      // Escape cancels editing without saving - reset to original value
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.value = value; // Reset to original value
      }
      onBlur();
    } else if (e.key === 'Enter' && e.ctrlKey && isTextArea) {
      // Ctrl+Enter submits textarea
      e.preventDefault();
      onBlur();
    }
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex: 200, // Ensure it renders above MarkdownRenderer (zIndex: 100)
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: '2px solid #007acc', // Blue border to indicate active editing
    padding: '2px',
    margin: '0',
    background: 'white',
    backgroundColor: 'white', // Ensure background is white for all browsers
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius: '3px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    opacity: '1', // Ensure the input is not transparent
    fontFamily: FONT_FAMILY,
  };

  return (
    <div ref={overlayRef} style={wrapperStyle}>
      {isTextArea ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            ...inputStyle,
            resize: 'none',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        />
      ) : (
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            ...inputStyle,
            fontSize: fieldType === 'connection' ? '10px' : fieldType === 'key' ? '12px' : fieldType === 'tags' ? '12px' : inputType === 'date' ? '14px' : fieldType === 'content' ? '14px' : '16px',
            fontWeight: fieldType === 'connection' || fieldType === 'key' || fieldType === 'tags' || fieldType === 'content' || inputType === 'date' ? 'normal' : 'bold',
            lineHeight: '1',
          }}
        />
      )}
    </div>
  );
};

export default EditableTextOverlay;