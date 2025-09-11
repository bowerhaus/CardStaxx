import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

interface EditableTextOverlayProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  isTextArea?: boolean;
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
  onChange,
  onBlur,
}: EditableTextOverlayProps) => {
  const inputRef = useRef<any>(null); // Changed to any

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = value;
      console.log('EditableTextOverlay: Input focused!', inputRef.current);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTextArea) {
      inputRef.current?.blur();
    }
  };

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: '3px solid red', // Temporary highly visible border
    padding: '0',
    margin: '0',
    background: 'white',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return isTextArea ? (
    <textarea
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      style={{ ...commonStyle, resize: 'none', fontSize: '12px' }}
    />
  ) : (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      style={{ ...commonStyle, fontSize: '16px', fontWeight: 'bold' }}
    />
  );
};

export default EditableTextOverlay;