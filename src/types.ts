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
  LIGHT_RED: '#ffebee',
  LIGHT_CYAN: '#e0f7fa',
  LIGHT_INDIGO: '#e8eaf6',
  LIGHT_TEAL: '#b2dfdb',
  LIGHT_LIME: '#f9fbe7',
  LIGHT_AMBER: '#fff8e1',
  LIGHT_BROWN: '#efebe9',
  LIGHT_DEEP_ORANGE: '#fbe9e7',
  LIGHT_BLUE_GREY: '#eceff1',
  LIGHT_LAVENDER: '#e1bee7',
  LIGHT_MINT: '#c8e6c9',
  LIGHT_PEACH: '#ffe0b2'
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

// Generate a darker shade of a color for headers
export const getDarkerShade = (color: string): string => {
  // If it's white (default), return a light gray
  if (color === '#ffffff') {
    return '#e0e0e0';
  }
  
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Make it 30% darker
  const darkerR = Math.max(0, Math.floor(r * 0.7));
  const darkerG = Math.max(0, Math.floor(g * 0.7));
  const darkerB = Math.max(0, Math.floor(b * 0.7));
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(darkerR)}${toHex(darkerG)}${toHex(darkerB)}`;
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
