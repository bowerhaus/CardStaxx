import React, { useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NotecardData } from '../types';
import Konva from 'konva';

interface NotecardProps {
  card: NotecardData;
  onEditStart: (field: 'title' | 'content', konvaNode: Konva.Node) => void;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const TITLE_PADDING = 10;
const CONTENT_PADDING_TOP = 35;

const Notecard = ({ card, onEditStart }: NotecardProps) => {
  const titleTextRef = useRef<Konva.Text>(null);
  const contentTextRef = useRef<Konva.Text>(null);
  const titleHitRectRef = useRef<Konva.Rect>(null); // Ref for the transparent hit rect

  return (
    <Group>
      <Rect
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        fill="white"
        stroke="black"
        strokeWidth={1}
        cornerRadius={5}
        shadowBlur={5}
        shadowOpacity={0.5}
      />
      <Text
        ref={titleTextRef}
        text={card.title}
        fontSize={16}
        fontStyle="bold"
        padding={TITLE_PADDING}
        width={CARD_WIDTH}
        listening={false} // Disable listening on Text to prevent default selection
      />
      {/* Transparent Rect for title hit detection */}
      <Rect
        ref={titleHitRectRef}
        x={TITLE_PADDING}
        y={TITLE_PADDING}
        width={CARD_WIDTH - TITLE_PADDING * 2}
        height={20} // Match approximate height of title text
        fill="rgba(0,0,0,0)" // Transparent fill
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'text';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onDblClick={() => {
          console.log('Title hit rect double-clicked!');
          titleTextRef.current && onEditStart('title', titleTextRef.current);
        }}
      />
      <Text
        ref={contentTextRef}
        text={card.content}
        fontSize={12}
        padding={CONTENT_PADDING_TOP}
        width={CARD_WIDTH}
        height={CARD_HEIGHT - CONTENT_PADDING_TOP - TITLE_PADDING}
        listening={false} // Disable listening on Text to prevent default selection
      />
      {/* Transparent Rect for content hit detection */}
      <Rect
        x={TITLE_PADDING}
        y={CONTENT_PADDING_TOP}
        width={CARD_WIDTH - TITLE_PADDING * 2}
        height={CARD_HEIGHT - CONTENT_PADDING_TOP - TITLE_PADDING}
        fill="rgba(0,0,0,0)" // Transparent fill
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'text';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
        onDblClick={() => {
          console.log('Content hit rect double-clicked!');
          contentTextRef.current && onEditStart('content', contentTextRef.current);
        }}
      />
    </Group>
  );
};

export default Notecard;
