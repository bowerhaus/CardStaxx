import { useState, useEffect, useCallback } from 'react';

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 300;
const STORAGE_KEY = 'cardstaxx_sidebar_width';

export const useSidebarResize = () => {
  // Initialize width from localStorage or use default
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem(STORAGE_KEY);
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
        return parsed;
      }
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });

  const [isResizing, setIsResizing] = useState(false);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  const startResize = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback((clientX: number) => {
    if (!isResizing) return;

    // Calculate new width based on mouse position
    const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, clientX));
    setSidebarWidth(newWidth);
  }, [isResizing]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        handleResize(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        stopResize();
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleResize, stopResize]);

  return {
    sidebarWidth,
    isResizing,
    startResize,
    minWidth: MIN_SIDEBAR_WIDTH,
    maxWidth: MAX_SIDEBAR_WIDTH
  };
};