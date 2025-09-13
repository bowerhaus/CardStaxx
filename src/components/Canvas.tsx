import React from 'react';
import { Stage, Layer, Line, Circle, Text, Group, Rect } from 'react-konva'; // Import Circle, Text, Group, Rect
import { StackData, ConnectionData, NotecardData } from '../types';
import Stack from './Stack';
import Konva from 'konva'; // Import Konva for event types

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const HANDLE_SIZE = 10; // Size of the connection handle
const HEADER_OFFSET = 40; // Added HEADER_OFFSET

interface CanvasProps {
  stacks: StackData[];
  connections: ConnectionData[];
  isConnecting: boolean;
  currentConnection: { fromStackId: string; toX: number; toY: number } | null;
  onStackDragEnd: (id: string, x: number, y: number) => void;
  onStackDragMove: (id: string, x: number, y: number) => void;
  onStackWheel: (id: string, deltaY: number) => void;
  onConnectionDragStart: (fromStackId: string, startX: number, startY: number) => void;
  onConnectionDragMove: (currentX: number, currentY: number) => void;
  onConnectionDragEnd: (endX: number, endY: number) => void;
  onUpdateCard: (cardId: string, updates: Partial<NotecardData>) => void;
  onEditStart: (cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => void;
  onCardResize: (cardId: string, newWidth: number, newHeight: number) => void;
  onColorPickerOpen: (cardId: string, x: number, y: number) => void;
  onCardDelete: (cardId: string, x: number, y: number) => void;
  onConnectionLabelEdit: (connectionId: string, konvaNode: Konva.Node) => void;
  onConnectionDelete: (connectionId: string) => void;
  editingCardId?: string | null;
  editingField?: 'title' | 'content' | 'date' | 'key' | 'tags' | null;
  editingConnectionId?: string | null;
  highlightedCardIds?: Set<string>;
  isTimelineVisible?: boolean;
  onTimelineCardClick?: (cardId: string) => void;
  onTimelineCardHover?: (cardId: string | null) => void;
}

const Canvas = React.memo(({
  stacks,
  connections,
  isConnecting,
  currentConnection,
  onStackDragEnd,
  onStackDragMove,
  onStackWheel,
  onConnectionDragStart,
  onConnectionDragMove,
  onConnectionDragEnd,
  onUpdateCard,
  onEditStart,
  onCardResize,
  onColorPickerOpen,
  onCardDelete,
  onConnectionLabelEdit,
  onConnectionDelete,
  editingCardId,
  editingField,
  editingConnectionId,
  highlightedCardIds,
  isTimelineVisible,
  onTimelineCardClick,
  onTimelineCardHover
}: CanvasProps) => {
  console.log('Canvas received onEditStart:', onEditStart);
  const canvasWidth = window.innerWidth - 270;
  const canvasHeight = window.innerHeight;

  // Timeline logic
  const allCards = stacks.flatMap(stack => 
    stack.cards.map(card => ({
      ...card,
      stackId: stack.id,
      stackPosition: { x: stack.x, y: stack.y }
    }))
  );

  const datedCards = allCards
    .filter(card => card.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Timeline dimensions
  const TIMELINE_HEIGHT = 60;
  const TIMELINE_MARGIN = 20;
  const timelineY = canvasHeight - TIMELINE_HEIGHT - TIMELINE_MARGIN;
  const timelineX = TIMELINE_MARGIN;
  const timelineWidth = canvasWidth - (TIMELINE_MARGIN * 2);

  // Define types for timeline cards
  type TimelineCard = {
    id: string;
    title: string;
    date: string;
    stackId: string;
    stackPosition: { x: number; y: number };
    timelineX: number;
    timelineY: number;
  };

  type TimelineCardGroup = {
    dateKey: string;
    cards: TimelineCard[];
    x: number;
    y: number;
    count: number;
  };

  // Calculate card positions on timeline
  let timelineCards: TimelineCardGroup[] = [];
  if (datedCards.length > 0 && isTimelineVisible) {
    const earliestDate = new Date(datedCards[0].date);
    const latestDate = new Date(datedCards[datedCards.length - 1].date);
    const dateRange = latestDate.getTime() - earliestDate.getTime();

    const positionedCards: TimelineCard[] = datedCards.map(card => {
      const cardDate = new Date(card.date);
      const relativePosition = dateRange > 0 ? (cardDate.getTime() - earliestDate.getTime()) / dateRange : 0;
      const x = timelineX + (relativePosition * timelineWidth);
      
      return {
        ...card,
        timelineX: x,
        timelineY: timelineY + TIMELINE_HEIGHT / 2
      };
    });

    // Group cards by date
    const cardGroups = positionedCards.reduce((groups, card) => {
      const dateKey = new Date(card.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(card);
      return groups;
    }, {} as Record<string, TimelineCard[]>);

    timelineCards = Object.entries(cardGroups).map(([dateKey, cards]) => ({
      dateKey,
      cards,
      x: cards[0].timelineX,
      y: cards[0].timelineY,
      count: cards.length
    }));
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isConnecting && currentConnection) {
      const stage = e.target.getStage();
      if (stage) {
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
          onConnectionDragMove(pointerPos.x, pointerPos.y);
        }
      }
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
      >
        {/* Layer for Stacks (background) */}
        <Layer>
          {stacks.map((stack) => (
            <Stack
              key={stack.id}
              stack={stack}
              onDragEnd={onStackDragEnd}
              onDragMove={onStackDragMove}
              onWheel={onStackWheel}
              onClick={() => {}} // onClick is no longer used for connections
              onUpdateCard={onUpdateCard}
              onEditStart={onEditStart}
              onCardResize={onCardResize}
              onColorPickerOpen={onColorPickerOpen}
              onCardDelete={onCardDelete}
              editingCardId={editingCardId}
              editingField={editingField}
              highlightedCardIds={highlightedCardIds}
            />
          ))}
        </Layer>

        {/* Layer for Connections (foreground) */}
        <Layer>
          {connections.map((connection) => {
            const fromStack = stacks.find((s) => s.id === connection.from);
            const toStack = stacks.find((s) => s.id === connection.to);

            if (!fromStack || !toStack) return null;

            // Use dynamic card dimensions for connection points (stack center)
            const fromTopCard = fromStack.cards[0];
            const fromWidth = fromTopCard?.width || CARD_WIDTH;
            const fromStackHeight = (fromTopCard?.height || CARD_HEIGHT) + (fromStack.cards.length - 1) * HEADER_OFFSET;
            const fromX = fromStack.x + fromWidth / 2;
            const fromY = fromStack.y + fromStackHeight / 2;

            const toTopCard = toStack.cards[0];
            const toWidth = toTopCard?.width || CARD_WIDTH;
            const toStackHeight = (toTopCard?.height || CARD_HEIGHT) + (toStack.cards.length - 1) * HEADER_OFFSET;
            const toX = toStack.x + toWidth / 2;
            const toY = toStack.y + toStackHeight / 2;

            // Calculate midpoint for label positioning
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;

            return (
              <Group key={connection.id}>
                <Line
                  points={[fromX, fromY, toX, toY]}
                  stroke="grey"
                  strokeWidth={1}
                  opacity={0.75}
                  tension={0}
                />
                
                {/* Connection Label */}
                <Group
                  x={midX}
                  y={midY}
                >
                  {/* Background rectangle for better readability */}
                  <Rect
                    x={-(connection.label ? Math.max(connection.label.length * 5 + 8, 24) : 24) / 2}
                    y={-9}
                    width={connection.label ? Math.max(connection.label.length * 5 + 8, 24) : 24}
                    height={18}
                    fill="white"
                    stroke="grey"
                    strokeWidth={1}
                    opacity={0.9}
                    onClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                    onDblClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                  />
                  
                  {/* Label text */}
                  <Text
                    text={connection.label || '+'}
                    fontSize={10}
                    fontFamily="Arial"
                    fontStyle="normal"
                    fill={connection.label ? "black" : "grey"}
                    align="center"
                    verticalAlign="middle"
                    offsetX={connection.label ? (connection.label.length * 2.5) : 3}
                    offsetY={5}
                    onClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                    onDblClick={(e) => onConnectionLabelEdit(connection.id, e.target)}
                  />
                  
                  {/* Delete button (small X) - shown when editing */}
                  <Text
                    text="×"
                    fontSize={12}
                    fontFamily="Arial"
                    fill="red"
                    align="center"
                    verticalAlign="middle"
                    offsetX={6}
                    offsetY={-12}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      onConnectionDelete(connection.id);
                    }}
                    visible={editingConnectionId === connection.id}
                  />
                </Group>
              </Group>
            );
          })}

          {/* Dynamic Connection Line */}
          {isConnecting && currentConnection && (() => {
            const fromStack = stacks.find(s => s.id === currentConnection.fromStackId);
            if (!fromStack) return null;
            
            const fromTopCard = fromStack.cards[0];
            const fromWidth = fromTopCard?.width || CARD_WIDTH;
            const fromStackHeight = (fromTopCard?.height || CARD_HEIGHT) + (fromStack.cards.length - 1) * HEADER_OFFSET;
            
            return (
              <Line
                points={[
                  fromStack.x + fromWidth / 2,
                  fromStack.y + fromStackHeight / 2,
                  currentConnection.toX,
                  currentConnection.toY,
                ]}
                stroke="grey" // Changed to grey
                strokeWidth={1} // Changed to 1
                dash={[5, 5]} // Changed to dotted
                opacity={0.75} // Added opacity
              />
            );
          })()}

          {/* Connection Handles */}
          {stacks.map((stack) => {
            const topCard = stack.cards[0];
            const stackWidth = topCard?.width || CARD_WIDTH;
            const stackHeight = (topCard?.height || CARD_HEIGHT) + (stack.cards.length - 1) * HEADER_OFFSET;
            const handleX = stack.x + stackWidth / 2;
            const handleY = stack.y + stackHeight / 2;
            return (
              <Circle
                key={`handle-${stack.id}`}
                x={handleX}
                y={handleY}
                radius={HANDLE_SIZE * 0.75} // 25% smaller
                fill="red"
                // stroke="black" // Removed border
                // strokeWidth={1} // Removed border
                draggable
                onDragStart={(e) => {
                  e.target.moveToTop(); // Bring handle to top
                  onConnectionDragStart(stack.id, e.target.x(), e.target.y());
                }}
                onDragMove={(e) => {
                  onConnectionDragMove(e.target.x(), e.target.y());
                }}
                onDragEnd={(e) => {
                  // Use e.target.x() and e.target.y() directly
                  onConnectionDragEnd(e.target.x(), e.target.y());
                  // Reset handle position after drag
                  e.target.x(handleX);
                  e.target.y(handleY);
                }}
                // zIndex={100} // Removed
              />
            );
          })}
        </Layer>

        {/* Timeline Layer */}
        {isTimelineVisible && datedCards.length > 0 && (
          <Layer>
            {/* Timeline background bar */}
            <Rect
              x={timelineX}
              y={timelineY}
              width={timelineWidth}
              height={TIMELINE_HEIGHT}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#ddd"
              strokeWidth={1}
              cornerRadius={8}
              shadowBlur={5}
              shadowOpacity={0.3}
              shadowColor="black"
            />

            {/* Timeline axis line */}
            <Line
              points={[timelineX + 10, timelineY + TIMELINE_HEIGHT / 2, timelineX + timelineWidth - 10, timelineY + TIMELINE_HEIGHT / 2]}
              stroke="#007bff"
              strokeWidth={2}
            />

            {/* Date labels */}
            <Text
              text={new Date(datedCards[0].date).toLocaleDateString('en-GB')}
              fontSize={10}
              fill="#666"
              fontStyle="bold"
              x={timelineX + 10}
              y={timelineY + 5}
            />
            <Text
              text={new Date(datedCards[datedCards.length - 1].date).toLocaleDateString('en-GB')}
              fontSize={10}
              fill="#666"
              fontStyle="bold"
              x={timelineX + timelineWidth - 80}
              y={timelineY + 5}
            />

            {/* Timeline card icons */}
            {timelineCards.map((cardGroup, index) => (
              <Group key={`timeline-${cardGroup.dateKey}`}>
                {/* Card icon */}
                <Rect
                  x={cardGroup.x - 6}
                  y={cardGroup.y - 9}
                  width={12}
                  height={18}
                  cornerRadius={2}
                  fill={cardGroup.cards[0].backgroundColor || '#ffffff'}
                  stroke="#ccc"
                  strokeWidth={1}
                  onClick={() => {
                    if (onTimelineCardClick && cardGroup.cards.length > 0) {
                      onTimelineCardClick(cardGroup.cards[0].id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (onTimelineCardHover && cardGroup.cards.length > 0) {
                      onTimelineCardHover(cardGroup.cards[0].id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (onTimelineCardHover) {
                      onTimelineCardHover(null);
                    }
                  }}
                />
                
                {/* Count indicator for multi-card groups */}
                <Text
                  text={cardGroup.count > 1 ? cardGroup.count.toString() : "●"}
                  fontSize={cardGroup.count > 1 ? 8 : 6}
                  fill="white"
                  fontStyle="bold"
                  x={cardGroup.x}
                  y={cardGroup.y}
                  offsetX={cardGroup.count > 1 ? 4 : 2}
                  offsetY={cardGroup.count > 1 ? 6 : 3}
                  listening={false}
                />

                {/* Connection lines to highlighted cards */}
                {highlightedCardIds && cardGroup.cards.some(card => highlightedCardIds.has(card.id)) && (
                  cardGroup.cards
                    .filter(card => highlightedCardIds.has(card.id))
                    .map(card => (
                      <Line
                        key={`connection-${card.id}`}
                        points={[
                          cardGroup.x,
                          cardGroup.y,
                          card.stackPosition.x + 100, // Card center approximation
                          card.stackPosition.y + 75   // Card center approximation
                        ]}
                        stroke="#ffc107"
                        strokeWidth={2}
                        dash={[5, 5]}
                        opacity={0.8}
                        listening={false}
                      />
                    ))
                )}
              </Group>
            ))}
          </Layer>
        )}
      </Stage>
    </div>
  );
});

export default Canvas;
