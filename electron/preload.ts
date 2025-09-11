import { contextBridge, ipcRenderer } from 'electron';

// Expose file operations to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  saveWorkspaceDialog: () => ipcRenderer.invoke('save-workspace-dialog'),
  openWorkspaceDialog: () => ipcRenderer.invoke('open-workspace-dialog'),
  saveFile: (filePath: string, data: string) => ipcRenderer.invoke('save-file', filePath, data),
  loadFile: (filePath: string) => ipcRenderer.invoke('load-file', filePath),
});