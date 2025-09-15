import { useState, useEffect, useCallback } from 'react';
import { StackData, ConnectionData, WorkspaceData } from '../types';
import { migrateWorkspaceData } from '../services/workspaceService';

export const useWorkspace = (
  setStacks: (stacks: StackData[]) => void,
  setConnections: (connections: ConnectionData[]) => void
) => {
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-load last opened file on startup
  useEffect(() => {
    const autoLoadLastFile = async () => {
      try {
        const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
        if (!ipcRenderer) return;

        const lastFilePath = await ipcRenderer.invoke('get-last-opened-file');
        if (lastFilePath) {
          try {
            const fileResult = await ipcRenderer.invoke('load-file', lastFilePath);
            if (fileResult.success && fileResult.data) {
              const rawData = JSON.parse(fileResult.data);
              const workspaceData = migrateWorkspaceData(rawData);
              
              // Clear default welcome card when loading a workspace
              setStacks(workspaceData.stacks);
              setConnections(workspaceData.connections);
              setCurrentFilePath(lastFilePath);
              setHasUnsavedChanges(false);
              
              console.log('Auto-loaded workspace:', lastFilePath);
            } else {
              console.log('Failed to auto-load workspace:', fileResult.error);
              // Keep the default welcome card if auto-load fails
            }
          } catch (error) {
            console.log('Error parsing workspace file:', error);
            // Keep the default welcome card if file is corrupted
          }
        } else {
          console.log('No previous workspace to auto-load');
          // Keep the default welcome card for new users
        }
      } catch (error) {
        console.log('Auto-load not available:', error);
      }
    };

    autoLoadLastFile();
  }, [setStacks, setConnections]);

  const saveWorkspace = useCallback(async (filePath?: string | null, stacks?: StackData[], connections?: ConnectionData[]) => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      let targetPath: string | undefined = filePath ?? undefined;
      
      if (!targetPath) {
        const result = await ipcRenderer.invoke('save-workspace-dialog');
        if (result.canceled) return;
        targetPath = result.filePath;
      }

      if (!targetPath) {
        alert('No file path specified');
        return;
      }

      // Use provided stacks/connections or get from current state
      if (!stacks || !connections) {
        throw new Error('Stacks and connections must be provided to saveWorkspace');
      }

      const workspaceData: WorkspaceData = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        stacks,
        connections,
      };

      const result = await ipcRenderer.invoke('save-file', targetPath, JSON.stringify(workspaceData, null, 2));
      
      if (result.success) {
        setCurrentFilePath(targetPath || null);
        setHasUnsavedChanges(false);
        // Record as last opened file
        await ipcRenderer.invoke('set-last-opened-file', targetPath);
        alert('Workspace saved successfully!');
      } else {
        alert(`Failed to save workspace: ${result.error}`);
      }
    } catch (error) {
      alert(`Error saving workspace: ${error}`);
    }
  }, []);

  const loadWorkspace = useCallback(async () => {
    try {
      // Check if we're in Electron environment
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      
      if (!ipcRenderer) {
        alert('File operations not available - running in browser mode');
        return;
      }

      const result = await ipcRenderer.invoke('open-workspace-dialog');
      if (result.canceled) return;

      const filePath = result.filePaths[0];
      if (!filePath) {
        alert('No file selected');
        return;
      }

      const fileResult = await ipcRenderer.invoke('load-file', filePath);
      
      if (fileResult.success && fileResult.data) {
        const rawData = JSON.parse(fileResult.data);
        const workspaceData = migrateWorkspaceData(rawData);
        
        setStacks(workspaceData.stacks);
        setConnections(workspaceData.connections);
        setCurrentFilePath(filePath);
        setHasUnsavedChanges(false);
        
        // Note: Last opened file is already recorded by the main process load-file handler
        alert('Workspace loaded successfully!');
      } else {
        alert(`Failed to load workspace: ${fileResult.error}`);
      }
    } catch (error) {
      alert(`Error loading workspace: ${error}`);
    }
  }, [setStacks, setConnections]);

  const newWorkspace = useCallback((currentStacks: StackData[], currentConnections: ConnectionData[]) => {
    if (hasUnsavedChanges) {
      const save = confirm('You have unsaved changes. Save before creating a new workspace?');
      if (save) {
        saveWorkspace(currentFilePath, currentStacks, currentConnections);
        return;
      }
    }
    
    setStacks([]);
    setConnections([]);
    setCurrentFilePath(null);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges, saveWorkspace, currentFilePath, setStacks, setConnections]);

  return {
    // State
    currentFilePath,
    hasUnsavedChanges,
    
    // Actions
    saveWorkspace,
    loadWorkspace,
    newWorkspace,
    setHasUnsavedChanges,
  };
};