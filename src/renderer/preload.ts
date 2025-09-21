import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    openExternal: (url: string) => {
        return ipcRenderer.invoke('open-external', url);
    },
    openFile: () => {
        return ipcRenderer.invoke('dialog:openFile');
    },
    saveFile: (args: { filePath?: string; content: string }) => {
        return ipcRenderer.invoke('dialog:saveFile', args);
    }
});

// Log that preload script is loaded
console.log('Preload script loaded');
