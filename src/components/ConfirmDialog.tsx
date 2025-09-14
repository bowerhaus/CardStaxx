import React from 'react';
import { FONT_FAMILY } from '../constants/typography';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  x: number;
  y: number;
}

const ConfirmDialog = ({
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  x,
  y,
}: ConfirmDialogProps) => {
  const dialogStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    backgroundColor: 'white',
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 10000, // High z-index to appear above everything
    minWidth: '200px',
    maxWidth: '300px',
    fontFamily: FONT_FAMILY,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    marginBottom: '16px',
    color: '#666',
    lineHeight: '1.4',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const confirmButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#ff4444',
    color: 'white',
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f0f0f0',
    color: '#333',
  };

  return (
    <div style={dialogStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={messageStyle}>{message}</div>
      <div style={buttonContainerStyle}>
        <button
          style={cancelButtonStyle}
          onClick={onCancel}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
        >
          {cancelText}
        </button>
        <button
          style={confirmButtonStyle}
          onClick={onConfirm}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dd3333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff4444';
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;