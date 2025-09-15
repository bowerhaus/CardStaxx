import React, { useState } from 'react';

interface DebugButtonProps {}

const DebugButton: React.FC<DebugButtonProps> = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Check if we're in Electron environment and development mode
  const isElectronDev = () => {
    try {
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      return !!ipcRenderer;
    } catch {
      return false;
    }
  };

  // Don't render the button if not in Electron development environment
  if (!isElectronDev()) {
    return null;
  }

  const handleClick = async () => {
    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke('toggle-devtools');
      
      if (result.error) {
        console.log('DevTools not available:', result.error);
      } else {
        setIsDevToolsOpen(result.opened);
        console.log('DevTools toggled:', result.opened ? 'opened' : 'closed');
      }
    } catch (error) {
      console.error('Failed to toggle DevTools:', error);
    }
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 9999,
    width: '36px',
    height: '36px',
    backgroundColor: isDevToolsOpen 
      ? (isHovered ? 'rgba(34, 197, 94, 0.9)' : 'rgba(34, 197, 94, 0.8)') // Green when active
      : (isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'), // White when inactive
    border: isDevToolsOpen 
      ? '2px solid rgba(34, 197, 94, 1)' // Green border when active
      : '1px solid rgba(0, 0, 0, 0.2)', // Gray border when inactive
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: isDevToolsOpen
      ? (isHovered ? '0 4px 16px rgba(34, 197, 94, 0.4)' : '0 2px 12px rgba(34, 197, 94, 0.3)') // Green glow when active
      : (isHovered ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'), // Regular shadow when inactive
    transition: 'all 0.2s ease',
    userSelect: 'none',
    backdropFilter: 'blur(4px)',
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Toggle Developer Tools (Development Mode)"
      aria-label="Toggle Developer Tools"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Ladybird/Ladybug SVG Icon */}
        {/* Body - classic red */}
        <ellipse cx="12" cy="16" rx="8" ry="6" fill="#E53E3E" />
        {/* Head - black */}
        <ellipse cx="12" cy="8" rx="4" ry="3" fill="#1A202C" />
        {/* Wing division line */}
        <line x1="12" y1="11" x2="12" y2="22" stroke="#1A202C" strokeWidth="1.2" />
        {/* Black spots on red body */}
        <circle cx="8" cy="14" r="1.5" fill="#1A202C" />
        <circle cx="16" cy="14" r="1.5" fill="#1A202C" />
        <circle cx="10" cy="18" r="1" fill="#1A202C" />
        <circle cx="14" cy="18" r="1" fill="#1A202C" />
        <circle cx="12" cy="20" r="0.8" fill="#1A202C" />
        {/* Antennae - black */}
        <line x1="10" y1="5" x2="9" y2="3" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="5" x2="15" y2="3" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="3" r="0.8" fill="#1A202C" />
        <circle cx="15" cy="3" r="0.8" fill="#1A202C" />
        {/* Small highlight on head for dimension */}
        <ellipse cx="11" cy="7" rx="1.5" ry="1" fill="#2D3748" opacity="0.6" />
        {/* Body highlight for dimension */}
        <ellipse cx="10" cy="14" rx="2" ry="1.5" fill="#F56565" opacity="0.7" />
      </svg>
    </button>
  );
};

export default DebugButton;