import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Vous pouvez ajouter des APIs ici si nécessaire
});
