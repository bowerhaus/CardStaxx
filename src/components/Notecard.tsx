import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NotecardData } from '../types';

interface NotecardProps {
  card: NotecardData;
}

const Notecard = ({ card }: NotecardProps) => {
  const cardWidth = 200;
  const cardHeight = 150;

  return (
    <Group>
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill="white"
        stroke="black"
        strokeWidth={1}
        cornerRadius={5}
        shadowBlur={5}
        shadowOpacity={0.5}
      />
      <Text
        text={card.title}
        fontSize={16}
        fontStyle="bold"
        padding={10}
        width={cardWidth}
      />
      <Text
        text={card.content}
        fontSize={12}
        padding={35}
        width={cardWidth}
      />
    </Group>
  );
};

export default Notecard;
