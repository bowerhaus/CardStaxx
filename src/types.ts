export interface NotecardData {
  id: string;
  title: string;
  content: string;
  width?: number;  // Optional, defaults to CARD_WIDTH
  height?: number; // Optional, defaults to CARD_HEIGHT
  tags?: string[]; // Optional array of tags
  key?: string;    // Optional key field for categorization
  date: string;    // Creation date in ISO format (mandatory, defaults to creation time)
  backgroundColor?: string; // Optional background color
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
  label?: string; // Optional connection name/label
}

export interface WorkspaceData {
  version: string;
  createdAt: string;
  lastModified: string;
  stacks: StackData[];
  connections: ConnectionData[];
}

// Color palette constants
export const CARD_COLORS = {
  DEFAULT: '#ffffff',
  LIGHT_BLUE: '#e3f2fd',
  LIGHT_GREEN: '#e8f5e8',
  LIGHT_YELLOW: '#fff9c4',
  LIGHT_ORANGE: '#fff3e0',
  LIGHT_PINK: '#fce4ec',
  LIGHT_PURPLE: '#f3e5f5',
  LIGHT_GRAY: '#f5f5f5',
  LIGHT_RED: '#ffebee'
} as const;

export type CardColor = typeof CARD_COLORS[keyof typeof CARD_COLORS];

// Color utility functions
export const getCardColorName = (color: string): string => {
  const entry = Object.entries(CARD_COLORS).find(([_, value]) => value === color);
  return entry ? entry[0].replace('_', ' ').toLowerCase() : 'custom';
};

export const isValidCardColor = (color: string): boolean => {
  return Object.values(CARD_COLORS).includes(color as CardColor) || /^#[0-9A-F]{6}$/i.test(color);
};

// Global window API extensions
declare global {
  interface Window {
    electronAPI?: {
      saveWorkspaceDialog: () => Promise<Electron.SaveDialogReturnValue>;
      openWorkspaceDialog: () => Promise<Electron.OpenDialogReturnValue>;
      saveFile: (filePath: string, data: string) => Promise<{success: boolean, error?: string}>;
      loadFile: (filePath: string) => Promise<{success: boolean, data?: string, error?: string}>;
      getLastOpenedFile: () => Promise<string | null>;
      setLastOpenedFile: (filePath: string) => Promise<boolean>;
    };
    require?: (moduleName: string) => any;
  }
}
