export interface NotecardData {
  id: string;
  title: string;
  content: string;
  width?: number;  // Optional, defaults to CARD_WIDTH
  height?: number; // Optional, defaults to CARD_HEIGHT
}

export interface StackData {
  id: string;
  x: number;
  y: number;
  cards: NotecardData[];
}

export interface ConnectionData {
  id: string;
  from: string; // stackId
  to: string;   // stackId
}
