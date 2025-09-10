export interface NotecardData {
  id: string;
  title: string;
  content: string;
}

export interface StackData {
  id: string;
  x: number;
  y: number;
  cards: NotecardData[];
}
