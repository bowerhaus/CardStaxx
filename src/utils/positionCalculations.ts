import Konva from 'konva';
import { NotecardData, StackData } from '../types';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/typography';
import { LAYOUT } from '../constants/layout';

const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

export interface CardPosition {
  card: NotecardData;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  isEditing: boolean;
}

// Function to get card positions for markdown rendering
export const getCardScreenPositions = (
  stacks: StackData[],
  canvasZoom: number,
  canvasTranslate: {x: number; y: number},
  editingCardId: string | null,
  editingField: string | null,
  sidebarWidth: number
): CardPosition[] => {
  const positions: CardPosition[] = [];

  const SIDEBAR_WIDTH = sidebarWidth; // Match the Canvas component sidebar offset

  stacks.forEach(stack => {
    if (stack.cards && stack.cards.length > 0) {
      // Only render markdown for the top (most visible) card in each stack
      const topCard = stack.cards[stack.cards.length - 1];
      const cardWidth = topCard.width || CARD_WIDTH;
      const cardHeight = topCard.height || CARD_HEIGHT;
      const borderPadding = 10;
      const HEADER_OFFSET = 40; // Match Stack component constant
      
      // Calculate the position of the top card within the stack (same logic as Stack component)
      const totalCards = stack.cards.length;
      const topCardIndex = totalCards - 1;
      const cardScale = 1.0; // Top card is always full scale within the stack
      const xOffset = borderPadding + (cardWidth * (1 - cardScale)) / 2;
      const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
      const yOffset = borderPadding + headerTextSpace + topCardIndex * HEADER_OFFSET + (cardHeight * (1 - cardScale)) / 2;
      
      // Apply canvas transformation (zoom and translation)
      const canvasX = stack.x + xOffset;
      const canvasY = stack.y + yOffset;
      
      console.log(`Screen pos - Stack ${stack.id}:`, {
        stackX: stack.x, stackY: stack.y,
        xOffset, yOffset,
        canvasX, canvasY,
        cardWidth, cardHeight,
        borderPadding, headerTextSpace, topCardIndex,
        canvasZoom, canvasTranslate
      });
      
      // Apply the same transformation as the Konva Stage:
      // Konva Stage has: x={canvasTranslate.x}, y={canvasTranslate.y}, scaleX={canvasZoom}, scaleY={canvasZoom}
      // In Konva's transformation matrix: final = (original * scale) + translation
      const screenX = SIDEBAR_WIDTH + (canvasX * canvasZoom) + canvasTranslate.x;
      const screenY = (canvasY * canvasZoom) + canvasTranslate.y;
      
      console.log(`Screen transform - Stack ${stack.id}:`, {
        canvasX, canvasY, canvasZoom,
        translateX: canvasTranslate.x, translateY: canvasTranslate.y,
        screenX, screenY,
        'expected_screenY_check': (canvasY * canvasZoom) + canvasTranslate.y,
        'calculation': `screenY = (${canvasY} * ${canvasZoom}) + ${canvasTranslate.y} = ${screenY}`
      });
      const screenWidth = cardWidth * canvasZoom;
      const screenHeight = cardHeight * canvasZoom;
      
      positions.push({
        card: topCard,
        x: screenX,
        y: screenY,
        width: screenWidth,
        height: screenHeight,
        scale: canvasZoom, // Pass the canvas zoom as scale for font sizing
        isEditing: editingCardId === topCard.id && editingField === 'content'
      });
    }
  });

  return positions;
};

export const getOverlayPosition = (
  editingKonvaNode: Konva.Node | null,
  editingCardId: string | null,
  editingField: string | null,
  editingConnectionId: string | null,
  editingTextValue: string,
  cardPositions: CardPosition[],
  sidebarWidth?: number
) => {
  // Handle MarkdownRenderer-triggered editing
  if (!editingKonvaNode && editingCardId && editingField === 'content') {
    // Find the card position from cardPositions
    const cardPos = cardPositions.find(pos => pos.card.id === editingCardId);
    if (cardPos) {
      // Use the same positioning logic as MarkdownRenderer
      const CONTENT_PADDING_TOP = 35;
      let baseContentY = CONTENT_PADDING_TOP;
      if (cardPos.card.date) baseContentY = Math.max(baseContentY, 56);
      baseContentY = Math.max(baseContentY, cardPos.card.date ? 82 : 64);
      const TITLE_PADDING = 10;
      
      return {
        x: cardPos.x + TITLE_PADDING * cardPos.scale,
        y: cardPos.y + baseContentY * cardPos.scale,
        width: cardPos.width - TITLE_PADDING * 2 * cardPos.scale,
        height: cardPos.height - baseContentY * cardPos.scale - 40 * cardPos.scale,
      };
    }
  }
  
  if (!editingKonvaNode) return { x: 0, y: 0, width: 0, height: 0 };

  const stage = editingKonvaNode.getStage();
  if (!stage) return { x: 0, y: 0, width: 0, height: 0 };

  const stageRect = stage.container().getBoundingClientRect();
  const nodeAbsolutePosition = editingKonvaNode.getAbsolutePosition();

  // Handle connection editing separately
  if (editingConnectionId) {
    const labelText = editingTextValue || 'Label';
    const minWidth = Math.max(labelText.length * 8 + 16, 80); // Minimum 80px width
    
    const calculatedPos = {
      x: stageRect.left + nodeAbsolutePosition.x - minWidth / 2,
      y: stageRect.top + nodeAbsolutePosition.y - 9,
      width: minWidth,
      height: 18,
    };
    console.log('Connection Overlay Position:', calculatedPos);
    return calculatedPos;
  }

  // Handle stack title editing
  if (editingField === 'stack-title') {
    const stackTitlePos = {
      x: stageRect.left + nodeAbsolutePosition.x,
      y: stageRect.top + nodeAbsolutePosition.y,
      width: Math.max(120, editingKonvaNode.width() || 120), // Minimum width for stack titles
      height: 20,
    };
    console.log('Stack Title Overlay Position:', stackTitlePos);
    return stackTitlePos;
  }

  // Handle card field editing
  const calculatedPos = {
    x: stageRect.left + nodeAbsolutePosition.x + TITLE_PADDING,
    y: stageRect.top + nodeAbsolutePosition.y + (editingField === 'title' ? TITLE_PADDING : TITLE_PADDING),
    width: editingKonvaNode.width() - TITLE_PADDING * 2,
    height: editingField === 'title' ? 20 : editingKonvaNode.height() - TITLE_PADDING * 2,
  };
  console.log('Card Overlay Position:', calculatedPos, 'Field:', editingField);
  return calculatedPos;
};