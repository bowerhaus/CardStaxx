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

export interface WorkspaceData {
  version: string;
  createdAt: string;
  lastModified: string;
  stacks: StackData[];
  connections: ConnectionData[];
}

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
