import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    openExternal: (url: string) => {
        return ipcRenderer.invoke('open-external', url);
    }
});

// Log that preload script is loaded
console.log('Preload script loaded');
