import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// App settings storage
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

const getSettings = () => {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
  return {};
};

const saveSettings = (settings: any) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// This is a global variable provided by the Webpack plugin.
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for file operations
ipcMain.handle('save-workspace-dialog', async () => {
  const result = await dialog.showSaveDialog({
    title: 'Save CardStaxx Workspace',
    filters: [
      { name: 'CardStaxx Files', extensions: ['cardstaxx'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    defaultPath: path.join(app.getPath('documents'), 'workspace.cardstaxx')
  });
  return result;
});

ipcMain.handle('open-workspace-dialog', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Open CardStaxx Workspace',
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'JSON Files', extensions: ['json'] }
    ],
    properties: ['openFile'],
    defaultPath: app.getPath('documents')
  });
  console.log('Open dialog result:', result);
  return result;
});

ipcMain.handle('save-file', async (event, filePath: string, data: string) => {
  try {
    await fs.promises.writeFile(filePath, data, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('load-file', async (event, filePath: string) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    
    // Save as last opened file
    const settings = getSettings();
    settings.lastOpenedFile = filePath;
    saveSettings(settings);
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-last-opened-file', async () => {
  const settings = getSettings();
  const lastFile = settings.lastOpenedFile;
  
  // Check if the last opened file still exists
  if (lastFile && fs.existsSync(lastFile)) {
    return lastFile;
  } else if (lastFile) {
    // File no longer exists, clear it from settings
    console.log('Last opened file no longer exists:', lastFile);
    settings.lastOpenedFile = null;
    saveSettings(settings);
  }
  
  return null;
});

ipcMain.handle('set-last-opened-file', async (event, filePath: string) => {
  const settings = getSettings();
  settings.lastOpenedFile = filePath;
  saveSettings(settings);
  return true;
});
