import { contextBridge, ipcRenderer } from 'electron';

// Expose une API sécurisée pour communiquer avec Electron
contextBridge.exposeInMainWorld('electron', {
  // ============================================
  // API Database - Workers
  // ============================================
  
  db: {
    workers: {
      getAll: () => ipcRenderer.invoke('db:get-workers'),
      getById: (id: number) => ipcRenderer.invoke('db:get-worker', id),
      add: (worker: any) => ipcRenderer.invoke('db:add-worker', worker),
      update: (id: number, worker: any) => ipcRenderer.invoke('db:update-worker', id, worker),
      delete: (id: number) => ipcRenderer.invoke('db:delete-worker', id),
    },
    
    tasks: {
      getAll: (workerId?: number) => ipcRenderer.invoke('db:get-tasks', workerId),
      add: (task: any) => ipcRenderer.invoke('db:add-task', task),
      update: (id: number, task: any) => ipcRenderer.invoke('db:update-task', id, task),
      delete: (id: number) => ipcRenderer.invoke('db:delete-task', id),
    },
    
    // Gestion de la base de données
    export: () => ipcRenderer.invoke('db:export'),
    import: () => ipcRenderer.invoke('db:import'),
    stats: () => ipcRenderer.invoke('db:stats'),
  },
  
  // ============================================
  // API Files - Gestion des fichiers
  // ============================================
  
  file: {
    read: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
    write: (filePath: string, content: string) => ipcRenderer.invoke('file:write', filePath, content),
    delete: (filePath: string) => ipcRenderer.invoke('file:delete', filePath),
    openDialog: (options?: any) => ipcRenderer.invoke('file:open-dialog', options),
  },
});

// Types TypeScript pour l'API
declare global {
  interface Window {
    electron: {
      db: {
        workers: {
          getAll: () => Promise<any>;
          getById: (id: number) => Promise<any>;
          add: (worker: any) => Promise<any>;
          update: (id: number, worker: any) => Promise<any>;
          delete: (id: number) => Promise<any>;
        };
        tasks: {
          getAll: (workerId?: number) => Promise<any>;
          add: (task: any) => Promise<any>;
          update: (id: number, task: any) => Promise<any>;
          delete: (id: number) => Promise<any>;
        };
        export: () => Promise<any>;
        import: () => Promise<any>;
        stats: () => Promise<any>;
      };
      file: {
        read: (filePath: string) => Promise<any>;
        write: (filePath: string, content: string) => Promise<any>;
        delete: (filePath: string) => Promise<any>;
        openDialog: (options?: any) => Promise<any>;
      };
    };
  }
}

export {};
