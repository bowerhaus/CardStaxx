import { useState, useCallback, useEffect } from 'react';
import { StackData, SearchFilters } from '../types';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';
import { LAYOUT } from '../constants/layout';

interface ViewSettings {
  scale: number;
  x: number;
  y: number;
}

export const useFocusMode = (
  stacks: StackData[],
  searchFilters: SearchFilters,
  getFilteredStacks: () => StackData[]
) => {
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [canvasTranslate, setCanvasTranslate] = useState<{x: number; y: number}>({x: 0, y: 0});
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState<boolean>(false);
  const [shouldEnableFocusOnDemoLoad, setShouldEnableFocusOnDemoLoad] = useState<boolean>(false);
  
  // Dual view settings - separate for normal and focus modes
  const [normalViewSettings, setNormalViewSettings] = useState<ViewSettings>({
    scale: 1,
    x: 0,
    y: 0
  });
  const [focusViewSettings, setFocusViewSettings] = useState<ViewSettings>({
    scale: 1,
    x: 0,
    y: 0
  });

  // Extracted focus calculation logic
  const calculateFocusTransform = useCallback(() => {
    const filteredStacks = getFilteredStacks();
    console.log('Focus mode: filteredStacks', filteredStacks.length);
    if (filteredStacks.length === 0) {
      console.log('No filtered stacks, resetting to default');
      return { zoom: 1, translate: { x: 0, y: 0 } };
    }

    // Calculate bounding box of all visible cards using exact same logic as Stack.tsx
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const SIDEBAR_WIDTH = LAYOUT.SIDEBAR_WIDTH;
    const CANVAS_MARGIN = 100; // Margin around focused area
    
    filteredStacks.forEach(stack => {
      if (stack.cards && stack.cards.length > 0) {
        const topCard = stack.cards[stack.cards.length - 1]; // Most visible card
        const cardWidth = topCard.width || CARD_WIDTH;
        const cardHeight = topCard.height || CARD_HEIGHT;
        
        // Calculate stack bounds using EXACT same logic as Stack.tsx
        const borderPadding = 10;
        const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
        const totalCards = stack.cards.length;
        const topCardIndex = totalCards - 1; // Index of the topmost card
        const scale = 1.0; // Top card is always full scale
        const HEADER_OFFSET = 40;
        
        // Exact calculation from Stack.tsx
        const xOffset = borderPadding + (cardWidth * (1 - scale)) / 2;
        const yOffset = borderPadding + headerTextSpace + topCardIndex * HEADER_OFFSET + (cardHeight * (1 - scale)) / 2;
        
        const stackLeft = stack.x + xOffset;
        const stackTop = stack.y + yOffset;
        const stackRight = stackLeft + cardWidth;
        const stackBottom = stackTop + cardHeight;
        
        console.log(`Focus calc - Stack ${stack.id}:`, {
          stackX: stack.x, stackY: stack.y,
          xOffset, yOffset,
          stackLeft, stackTop, stackRight, stackBottom,
          cardWidth, cardHeight,
          borderPadding, headerTextSpace, topCardIndex, HEADER_OFFSET
        });
        
        minX = Math.min(minX, stackLeft);
        minY = Math.min(minY, stackTop);
        maxX = Math.max(maxX, stackRight);
        maxY = Math.max(maxY, stackBottom);
      }
    });
    
    // Calculate canvas dimensions (excluding sidebar)
    const canvasWidth = window.innerWidth - SIDEBAR_WIDTH;
    const canvasHeight = window.innerHeight;
    
    // Calculate content dimensions
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    console.log('Content bounds:', {minX, minY, maxX, maxY, contentWidth, contentHeight});
    console.log('Canvas dimensions:', {canvasWidth, canvasHeight});
    
    // Calculate scale to fit content with margin
    const scaleX = (canvasWidth - CANVAS_MARGIN * 2) / contentWidth;
    const scaleY = (canvasHeight - CANVAS_MARGIN * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Max 200% zoom
    
    // Calculate translation to center content using correct Konva transformation formula
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Konva transformation: finalPos = (originalPos * scale) + translate
    const translateX = (canvasWidth / 2) - (centerX * scale);
    const translateY = (canvasHeight / 2) - (centerY * scale);
    
    // Bounds checking using correct transformation formula
    const transformedMinY = (minY * scale) + translateY;
    const transformedMaxY = (maxY * scale) + translateY;
    
    // Only adjust if content goes beyond margins
    let finalTranslateY = translateY;
    if (transformedMinY < CANVAS_MARGIN) {
      finalTranslateY = CANVAS_MARGIN - (minY * scale);
    } else if (transformedMaxY > canvasHeight - CANVAS_MARGIN) {
      finalTranslateY = (canvasHeight - CANVAS_MARGIN) - (maxY * scale);
    }
    
    // Check X bounds as well
    const transformedMinX = (minX * scale) + translateX;
    const transformedMaxX = (maxX * scale) + translateX;
    
    let finalTranslateX = translateX;
    if (transformedMinX < CANVAS_MARGIN) {
      finalTranslateX = CANVAS_MARGIN - (minX * scale);
    } else if (transformedMaxX > canvasWidth - CANVAS_MARGIN) {
      finalTranslateX = (canvasWidth - CANVAS_MARGIN) - (maxX * scale);
    }
    
    console.log('=== FOCUS CALCULATION DETAILS ===');
    console.log('Content bounds:', {minX, minY, maxX, maxY, contentWidth, contentHeight});
    console.log('Canvas dimensions:', {canvasWidth, canvasHeight});
    console.log('Scale calculation:', {scaleX, scaleY, finalScale: scale});
    console.log('Center calculation:', {centerX, centerY});
    console.log('Initial translate:', {translateX, translateY});
    console.log('Final translate:', {x: finalTranslateX, y: finalTranslateY});
    console.log('================================');
    
    return { zoom: scale, translate: { x: finalTranslateX, y: finalTranslateY } };
  }, [getFilteredStacks]);

  // Zoom handlers that update appropriate settings based on mode
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(canvasZoom + 0.1, 2); // Max 200%
    setCanvasZoom(newZoom);
    
    if (isFocusModeEnabled) {
      setFocusViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    } else {
      setNormalViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    }
  }, [canvasZoom, isFocusModeEnabled]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(canvasZoom - 0.1, 0.5); // Min 50%
    setCanvasZoom(newZoom);
    
    if (isFocusModeEnabled) {
      setFocusViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    } else {
      setNormalViewSettings(prev => ({
        ...prev,
        scale: newZoom
      }));
    }
  }, [canvasZoom, isFocusModeEnabled]);

  const handleFocusToggle = useCallback(() => {
    if (isFocusModeEnabled) {
      // Turn off focus mode - restore normal view settings
      setCanvasZoom(normalViewSettings.scale);
      setCanvasTranslate({x: normalViewSettings.x, y: normalViewSettings.y});
      setIsFocusModeEnabled(false);
    } else {
      // Save current normal view settings before switching to focus mode
      setNormalViewSettings({
        scale: canvasZoom,
        x: canvasTranslate.x,
        y: canvasTranslate.y
      });
      
      // Turn on focus mode - calculate and apply focus transform
      const { zoom, translate } = calculateFocusTransform();
      setCanvasZoom(zoom);
      setCanvasTranslate(translate);
      
      // Save the focus view settings
      setFocusViewSettings({
        scale: zoom,
        x: translate.x,
        y: translate.y
      });
      
      setIsFocusModeEnabled(true);
    }
  }, [isFocusModeEnabled, normalViewSettings, canvasZoom, canvasTranslate, calculateFocusTransform]);

  const handleCanvasTranslationChange = useCallback((newTranslate: {x: number; y: number}) => {
    setCanvasTranslate(newTranslate);
    
    // Update the appropriate view settings based on current mode
    if (isFocusModeEnabled) {
      setFocusViewSettings(prev => ({
        ...prev,
        x: newTranslate.x,
        y: newTranslate.y
      }));
    } else {
      setNormalViewSettings(prev => ({
        ...prev,
        x: newTranslate.x,
        y: newTranslate.y
      }));
    }
  }, [isFocusModeEnabled]);

  // Auto-update focus transform when filters change and focus mode is enabled
  useEffect(() => {
    if (isFocusModeEnabled) {
      console.log('Focus mode is enabled, recalculating transform due to filter change');
      const { zoom, translate } = calculateFocusTransform();
      setCanvasZoom(zoom);
      setCanvasTranslate(translate);
      
      // Update focus view settings with new calculated values
      setFocusViewSettings({
        scale: zoom,
        x: translate.x,
        y: translate.y
      });
    }
  }, [searchFilters, stacks, isFocusModeEnabled, calculateFocusTransform]);

  // Handle enabling focus mode after demo is loaded
  useEffect(() => {
    if (shouldEnableFocusOnDemoLoad && stacks.length > 0) {
      console.log('Demo loaded, enabling focus mode');
      
      // Save current normal view settings before switching to focus mode
      setNormalViewSettings({
        scale: canvasZoom,
        x: canvasTranslate.x,
        y: canvasTranslate.y
      });
      
      // Calculate and apply focus transform
      const { zoom, translate } = calculateFocusTransform();
      setCanvasZoom(zoom);
      setCanvasTranslate(translate);
      
      // Save the focus view settings
      setFocusViewSettings({
        scale: zoom,
        x: translate.x,
        y: translate.y
      });
      
      setIsFocusModeEnabled(true);
      
      // Reset the flag
      setShouldEnableFocusOnDemoLoad(false);
    }
  }, [shouldEnableFocusOnDemoLoad, stacks, canvasZoom, canvasTranslate, calculateFocusTransform]);

  return {
    // State
    canvasZoom,
    canvasTranslate,
    isFocusModeEnabled,
    shouldEnableFocusOnDemoLoad,
    normalViewSettings,
    focusViewSettings,
    
    // Actions
    handleZoomIn,
    handleZoomOut,
    handleFocusToggle,
    handleCanvasTranslationChange,
    setShouldEnableFocusOnDemoLoad,
    calculateFocusTransform,
  };
};