import React from 'react';
import { StackData } from '../types';
import { CARD_WIDTH, CARD_HEIGHT, FONT_FAMILY } from '../constants/typography';

// Default card dimensions (imported from constants)
const HEADER_OFFSET = 40;

// Utility function to calculate the center position of a stack (center of most visible card - topmost)
const getStackCenterPosition = (stack: StackData): { x: number; y: number } => {
  if (!stack.cards || stack.cards.length === 0) return { x: stack.x, y: stack.y };
  
  // The topmost visible card is the last one in the array
  const topCard = stack.cards[stack.cards.length - 1];
  const cardWidth = topCard.width || CARD_WIDTH;
  const cardHeight = topCard.height || CARD_HEIGHT;
  
  // Account for stack rendering offsets (from Stack.tsx)
  const borderPadding = 10;
  const headerTextSpace = stack.cards.length > 1 ? 8 : 0;
  const cardIndex = stack.cards.length - 1; // Index of the topmost card
  
  // Calculate the position of the topmost visible card within the stack
  const xOffset = borderPadding + (cardWidth * (1 - 1.0)) / 2; // Scale is 1.0 for top card
  const yOffset = borderPadding + headerTextSpace + cardIndex * HEADER_OFFSET + (cardHeight * (1 - 1.0)) / 2;
  
  return {
    x: stack.x + xOffset + cardWidth / 2,
    y: stack.y + yOffset + cardHeight / 2
  };
};

interface TimelineProps {
  stacks: StackData[];
  onCardClick?: (cardId: string) => void;
  onCardHover?: (cardId: string | null) => void;
  highlightedCardIds?: Set<string>;
  sidebarWidth?: number;
  canvasZoom?: number;
  canvasTranslate?: {x: number; y: number};
}

const Timeline: React.FC<TimelineProps> = ({ 
  stacks,
  onCardClick,
  onCardHover,
  highlightedCardIds,
  sidebarWidth = 320,
  canvasZoom = 1,
  canvasTranslate = {x: 0, y: 0}
}) => {
  // Transform canvas coordinates to viewport coordinates
  // Note: SVG overlay is already positioned at left: sidebarWidth, so no additional offset needed
  const canvasToViewport = (canvasX: number, canvasY: number) => {
    return {
      x: canvasX * canvasZoom + canvasTranslate.x,
      y: canvasY * canvasZoom + canvasTranslate.y
    };
  };

  // Get all cards with dates and sort them
  const allCards = stacks.flatMap(stack => 
    stack.cards.map(card => ({
      ...card,
      stackId: stack.id,
      stackPosition: { x: stack.x, y: stack.y }
    }))
  );

  // Filter out cards without dates and sort by date
  const datedCards = allCards
    .filter(card => card.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Debug logging
  console.log('Timeline - All cards:', allCards.length);
  console.log('Timeline - Cards with dates:', datedCards.length);
  if (datedCards.length > 0) {
    console.log('Timeline - First few cards:', datedCards.slice(0, 3).map(c => ({ id: c.id, title: c.title, date: c.date })));
  }

  if (datedCards.length === 0) {
    return (
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        fontFamily: FONT_FAMILY
      }}>
        No cards with dates found. Add dates to your cards to see them on the timeline.
      </div>
    ); // Show helpful message when no cards have dates
  }

  // Calculate timeline dimensions for viewport-fixed positioning
  const TIMELINE_HEIGHT = 60;
  const TIMELINE_MARGIN = 20;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const timelineLeft = TIMELINE_MARGIN;
  const timelineWidth = viewportWidth - sidebarWidth - (TIMELINE_MARGIN * 2);

  // Get date range
  const earliestDate = new Date(datedCards[0].date);
  const latestDate = new Date(datedCards[datedCards.length - 1].date);
  const dateRange = latestDate.getTime() - earliestDate.getTime();

  // Generate weekly markers (Mondays)
  const getWeeklyMarkers = () => {
    const markers: { date: Date; position: number }[] = [];
    const startDate = new Date(earliestDate);
    
    // Find the first Monday on or before the earliest date
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days to get to Monday
    const firstMonday = new Date(startDate);
    firstMonday.setDate(startDate.getDate() - daysToSubtract);
    
    let currentMonday = new Date(firstMonday);
    
    // Generate Mondays until we exceed the latest date
    while (currentMonday <= latestDate) {
      const relativePosition = dateRange > 0 ? (currentMonday.getTime() - earliestDate.getTime()) / dateRange : 0;
      const x = timelineLeft + (relativePosition * timelineWidth);
      
      // Only include markers that are within the visible timeline area
      if (x >= timelineLeft && x <= timelineLeft + timelineWidth) {
        markers.push({
          date: new Date(currentMonday),
          position: x
        });
      }
      
      // Move to next Monday
      currentMonday.setDate(currentMonday.getDate() + 7);
    }
    
    return markers;
  };

  const weeklyMarkers = getWeeklyMarkers();

  // Position cards on timeline
  const positionedCards = datedCards.map(card => {
    const cardDate = new Date(card.date);
    const relativePosition = dateRange > 0 ? (cardDate.getTime() - earliestDate.getTime()) / dateRange : 0;
    const x = timelineLeft + (relativePosition * timelineWidth);
    
    return {
      ...card,
      timelineX: x,
      timelineY: TIMELINE_HEIGHT / 2 // Position cards in middle of timeline
    };
  });

  // Group cards by date for better visualization
  const cardGroups = positionedCards.reduce((groups, card) => {
    const dateKey = new Date(card.date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(card);
    return groups;
  }, {} as Record<string, typeof positionedCards>);

  return (
    <>
      {/* Connection lines SVG overlay */}
      {highlightedCardIds && highlightedCardIds.size > 0 && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: sidebarWidth,
            width: viewportWidth - sidebarWidth,
            height: viewportHeight,
            pointerEvents: 'none',
            zIndex: 999
          }}
        >
          {Object.entries(cardGroups).map(([dateKey, cards]) => {
            const firstCard = cards[0];
            const isHighlighted = highlightedCardIds.has(firstCard.id);
            
            if (!isHighlighted) return null;
            
            // Calculate timeline icon position
            const timelineIconX = firstCard.timelineX;
            // Timeline Y position needs to be relative to viewport since timeline is fixed at bottom
            const timelineIconY = viewportHeight - TIMELINE_MARGIN - TIMELINE_HEIGHT / 2;
            
            // Find the stack that contains this card and get its center position
            const cardStack = stacks.find(stack => 
              stack.cards.some(c => c.id === firstCard.id)
            );
            const canvasCenterPos = cardStack ? getStackCenterPosition(cardStack) : {
              x: firstCard.stackPosition.x + (firstCard.width || CARD_WIDTH) / 2,
              y: firstCard.stackPosition.y + (firstCard.height || CARD_HEIGHT) / 2
            };
            // Transform canvas coordinates to viewport coordinates
            const centerPos = canvasToViewport(canvasCenterPos.x, canvasCenterPos.y);
            
            return (
              <line
                key={`connection-${dateKey}`}
                x1={timelineIconX}
                y1={timelineIconY}
                x2={centerPos.x}
                y2={centerPos.y}
                stroke="#ffc107"
                strokeWidth="3"
                strokeDasharray="8,4"
                opacity="0.9"
              />
            );
          })}
        </svg>
      )}
      
      {/* Timeline container */}
      <div
        style={{
          position: 'fixed',
          bottom: TIMELINE_MARGIN,
          left: sidebarWidth + TIMELINE_MARGIN,
          width: timelineWidth,
          height: TIMELINE_HEIGHT,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
      {/* Timeline axis line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          right: '10px',
          height: '2px',
          backgroundColor: '#007bff',
          transform: 'translateY(-50%)'
        }}
      />

      {/* Weekly markers (Mondays) */}
      {weeklyMarkers.map((marker, index) => (
        <div
          key={`week-${index}`}
          style={{
            position: 'absolute',
            left: marker.position - timelineLeft - 1,
            top: '25%',
            width: '2px',
            height: '50%',
            backgroundColor: '#28a745',
            opacity: 0.6
          }}
          title={`Week of ${marker.date.toLocaleDateString('en-GB')}`}
        />
      ))}

      {/* Date labels */}
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '5px',
          fontSize: '10px',
          color: '#666',
          fontWeight: 'bold',
          fontFamily: FONT_FAMILY
        }}
      >
        {earliestDate.toLocaleDateString('en-GB')}
      </div>
      <div
        style={{
          position: 'absolute',
          right: '10px',
          top: '5px',
          fontSize: '10px',
          color: '#666',
          fontWeight: 'bold',
          fontFamily: FONT_FAMILY
        }}
      >
        {latestDate.toLocaleDateString('en-GB')}
      </div>

      {/* Card icons on timeline */}
      {Object.entries(cardGroups).map(([dateKey, cards], groupIndex) => {
        const firstCard = cards[0];
        const groupSize = cards.length;
        const isMultiCard = groupSize > 1;
        
        console.log('Timeline marker:', {
          dateKey,
          cardId: firstCard.id,
          backgroundColor: firstCard.backgroundColor,
          groupSize
        });

        return (
          <div
            key={dateKey}
            style={{
              position: 'absolute',
              left: firstCard.timelineX - timelineLeft - 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '18px',
              borderRadius: '2px',
              backgroundColor: firstCard.backgroundColor || '#ffffff',
              border: '1px solid #ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#333',
              fontWeight: 'bold',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            title={`${new Date(firstCard.date).toLocaleDateString('en-GB')} - ${groupSize} card${groupSize > 1 ? 's' : ''}`}
            onClick={() => {
              // Click on first card in group
              onCardClick?.(firstCard.id);
            }}
            onMouseEnter={() => {
              onCardHover?.(firstCard.id);
            }}
            onMouseLeave={() => {
              onCardHover?.(null);
            }}
          >
            {isMultiCard ? groupSize.toString() : ''}
          </div>
        );
      })}
      </div>
    </>
  );
};

export default Timeline;