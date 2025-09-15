import React, { useEffect, useState, useRef } from 'react';
import { Image as KonvaImage, Group, Rect } from 'react-konva';
import { markdownToImageService } from '../services/markdownToImageService';
import { NotecardData } from '../types';
import Konva from 'konva';

interface KonvaMarkdownImageProps {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  card: NotecardData;
  onEditStart?: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
}

const KonvaMarkdownImage = ({
  content,
  x,
  y,
  width,
  height,
  card,
  onEditStart
}: KonvaMarkdownImageProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [frozenDimensions, setFrozenDimensions] = useState<{ width: number; height: number } | null>(null);
  const groupRef = useRef<Konva.Group>(null);

  // Calculate content area position and size (matching MarkdownRenderer logic)
  // Content should start right after the key field
  const keyFieldY = card.date ? 56 : 40; // Same as key icon position in Notecard
  const keyFieldHeight = 16; // Height needed for key field
  const baseContentY = keyFieldY + keyFieldHeight + 8; // 8px padding after key field
  const baseBottomSpace = 35; // Extra padding between content area and tags
  const TITLE_PADDING = 10;

  const scaledContentY = baseContentY;
  const scaledBottomSpace = baseBottomSpace;
  const scaledTitlePadding = TITLE_PADDING;

  const contentHeight = height - scaledContentY - scaledBottomSpace;
  const contentWidth = width - scaledTitlePadding * 2;

  // Use frozen dimensions for image generation and sizing, but current dimensions for clipping
  const imageContentWidth = isResizing && frozenDimensions ? frozenDimensions.width : contentWidth;
  const imageContentHeight = isResizing && frozenDimensions ? frozenDimensions.height : contentHeight;

  // Always use current dimensions for clipping area
  const clipContentWidth = contentWidth;
  const clipContentHeight = contentHeight;

  // Generate image when content or dimensions change, but not during resize
  useEffect(() => {
    if (isResizing) {
      return; // Don't regenerate image while resizing
    }

    const generateImage = async () => {
      if (!content || content.trim() === '') {
        setImage(null);
        return;
      }

      setIsLoading(true);
      try {
        const generatedImage = await markdownToImageService.convertMarkdownToImage(
          content,
          imageContentWidth,
          imageContentHeight,
          1,
          card
        );
        setImage(generatedImage);
      } catch (error) {
        console.error('Failed to generate markdown image:', error);
        setImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [content, imageContentWidth, imageContentHeight, card.id, card.date, card.backgroundColor, isResizing]);

  // Handle global mouse events for scrollbar dragging
  useEffect(() => {
    if (!isDragging || !image) return;

    const stage = groupRef.current?.getStage();
    if (!stage) return;

    const maxScrollY = Math.max(0, image.height - contentHeight);

    const handleGlobalMouseMove = (e: any) => {
      if (!isDragging) return;

      e.evt.preventDefault();
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();

      // Calculate relative position within the content area
      const relativeY = pointerPosition.y - (y + scaledContentY);
      const normalizedY = Math.max(0, Math.min(relativeY, contentHeight));
      const scrollRatio = normalizedY / contentHeight;

      setScrollY(scrollRatio * maxScrollY);
    };

    const handleGlobalMouseUp = (e: any) => {
      e.evt.preventDefault();
      setIsDragging(false);
    };

    stage.on('mousemove', handleGlobalMouseMove);
    stage.on('mouseup', handleGlobalMouseUp);

    return () => {
      stage.off('mousemove', handleGlobalMouseMove);
      stage.off('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, image, y, scaledContentY, contentHeight]);

  // Listen for global resize state changes
  useEffect(() => {
    const handleResizeStart = () => {
      // Freeze current dimensions when resize starts
      setFrozenDimensions({ width: contentWidth, height: contentHeight });
      setIsResizing(true);
    };
    const handleResizeEnd = () => {
      setIsResizing(false);
      // Clear frozen dimensions when resize ends, allowing new image generation
      setFrozenDimensions(null);
    };

    // Listen for resize events on the document
    document.addEventListener('cardresizestart', handleResizeStart);
    document.addEventListener('cardresizeend', handleResizeEnd);

    return () => {
      document.removeEventListener('cardresizestart', handleResizeStart);
      document.removeEventListener('cardresizeend', handleResizeEnd);
    };
  }, [contentWidth, contentHeight]);

  // Handle double-click for editing
  const handleDblClick = (e: any) => {
    console.log('KonvaMarkdownImage handleDblClick called', {
      detail: e.evt?.detail,
      type: e.evt?.type,
      target: e.target
    });

    // Stop any ongoing drag operation immediately
    const stage = e.target.getStage();
    if (stage) {
      // Find the draggable stack group
      let draggableParent = e.target.findAncestor('Group');
      while (draggableParent && !draggableParent.draggable()) {
        draggableParent = draggableParent.findAncestor('Group');
      }

      if (draggableParent && draggableParent.isDragging && draggableParent.isDragging()) {
        console.log('Stopping ongoing drag operation on', draggableParent.name());
        draggableParent.stopDrag();
      }

      // Also check all draggable nodes on the stage
      stage.find('Group').forEach((group: any) => {
        if (group.draggable && group.draggable() && group.isDragging && group.isDragging()) {
          console.log('Stopping drag on stage group', group.name());
          group.stopDrag();
        }
      });
    }

    // Prevent the double-click from propagating to drag handlers and other systems
    e.evt?.preventDefault();
    e.evt?.stopPropagation();
    e.cancelBubble = true;

    if (onEditStart) {
      console.log('Calling onEditStart for content editing');
      onEditStart(card.id, 'content', e.target);
    }
  };

  // Don't render anything if no content or still loading
  if (!content || content.trim() === '' || !image || isLoading) {
    return null;
  }

  // Calculate scroll bounds using clip dimensions (current size)
  const maxScrollY = Math.max(0, image.height - clipContentHeight);
  const clampedScrollY = Math.max(0, Math.min(scrollY, maxScrollY));

  // Calculate proportional thumb size
  const thumbRatio = Math.max(0.1, Math.min(1, clipContentHeight / image.height));
  const thumbHeight = Math.max(15, thumbRatio * clipContentHeight); // Minimum 15px thumb

  // Handle wheel scroll
  const handleWheel = (e: any) => {
    const delta = e.evt.deltaY;
    const canScrollDown = scrollY < maxScrollY;
    const canScrollUp = scrollY > 0;

    // Only handle (and prevent propagation) if we can scroll in the intended direction
    if ((delta > 0 && canScrollDown) || (delta < 0 && canScrollUp)) {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      setScrollY(prev => Math.max(0, Math.min(prev + delta * 0.5, maxScrollY)));
    }
    // If we can't scroll in the intended direction, let the event bubble up to the stack
  };

  // Handle scrollbar drag
  const handleScrollbarDragStart = (e: any) => {
    e.evt.preventDefault();
    setIsDragging(true);
  };

  return (
    <Group ref={groupRef}>
      {/* Clipped content group */}
      <Group
        clipX={x + scaledTitlePadding}
        clipY={y + scaledContentY}
        clipWidth={clipContentWidth}
        clipHeight={clipContentHeight}
      >
        {/* Scrollable markdown image */}
        <KonvaImage
          image={image}
          x={x + scaledTitlePadding}
          y={y + scaledContentY - clampedScrollY}
          width={imageContentWidth}
          height={image.height}
          onDblClick={handleDblClick}
          onWheel={handleWheel}
          listening={true}
        />
      </Group>
      {/* Scrollbar track - show only if content overflows */}
      {maxScrollY > 0 && (
        <>
          {/* Scrollbar track background */}
          <Rect
            x={x + scaledTitlePadding + clipContentWidth - 8}
            y={y + scaledContentY}
            width={6}
            height={clipContentHeight}
            fill="rgba(0,0,0,0.1)"
            cornerRadius={3}
            onWheel={handleWheel}
            listening={true}
          />
          {/* Scrollbar thumb */}
          <Rect
            x={x + scaledTitlePadding + clipContentWidth - 8}
            y={y + scaledContentY + (clampedScrollY / maxScrollY) * (clipContentHeight - thumbHeight)}
            width={6}
            height={thumbHeight}
            fill={isDragging ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)"}
            cornerRadius={3}
            onWheel={handleWheel}
            onMouseDown={handleScrollbarDragStart}
            onMouseEnter={(e) => {
              e.target.getStage()!.container().style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              e.target.getStage()!.container().style.cursor = 'default';
            }}
            listening={true}
            draggable={false}
          />
        </>
      )}
    </Group>
  );
};

export default KonvaMarkdownImage;