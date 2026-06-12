import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

let mainWindow: BrowserWindow | null = null;
let db: Database.Database | null = null;

// Initialiser la base de données
function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'worker-man.db');
  db = new Database(dbPath);
  
  // Créer les tables si elles n'existent pas
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      status TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workerId INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      dueDate DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workerId) REFERENCES workers(id)
    );
    
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('✅ Base de données initialisée:', dbPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../assets/icon.ico'),
  });

  const isDev = process.env.ELECTRON_DEV === 'true';
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================
// IPC - Gestion de la base de données
// ============================================

// SELECT - Récupérer tous les workers
ipcMain.handle('db:get-workers', async () => {
  try {
    const stmt = db!.prepare('SELECT * FROM workers ORDER BY createdAt DESC');
    const workers = stmt.all();
    return { success: true, data: workers };
  } catch (error: any) {
    console.error('Erreur:', error);
    return { success: false, error: error.message };
  }
});

// SELECT - Récupérer un worker par ID
ipcMain.handle('db:get-worker', async (event, id: number) => {
  try {
    const stmt = db!.prepare('SELECT * FROM workers WHERE id = ?');
    const worker = stmt.get(id);
    return { success: true, data: worker };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// INSERT - Ajouter un worker
ipcMain.handle('db:add-worker', async (event, worker: any) => {
  try {
    const stmt = db!.prepare(
      'INSERT INTO workers (name, email, phone, status) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(worker.name, worker.email, worker.phone, worker.status || 'actif');
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('ADD_WORKER', JSON.stringify({ id: result.lastInsertRowid, ...worker }));
    
    return { success: true, id: result.lastInsertRowid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// UPDATE - Modifier un worker
ipcMain.handle('db:update-worker', async (event, id: number, worker: any) => {
  try {
    const stmt = db!.prepare(
      'UPDATE workers SET name = ?, email = ?, phone = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(worker.name, worker.email, worker.phone, worker.status, id);
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('UPDATE_WORKER', JSON.stringify({ id, ...worker }));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// DELETE - Supprimer un worker
ipcMain.handle('db:delete-worker', async (event, id: number) => {
  try {
    const stmt = db!.prepare('DELETE FROM workers WHERE id = ?');
    stmt.run(id);
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('DELETE_WORKER', JSON.stringify({ id }));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// ============================================
// IPC - Gestion des tâches
// ============================================

// SELECT - Récupérer les tâches d'un worker
ipcMain.handle('db:get-tasks', async (event, workerId?: number) => {
  try {
    let stmt;
    if (workerId) {
      stmt = db!.prepare('SELECT * FROM tasks WHERE workerId = ? ORDER BY createdAt DESC');
      const tasks = stmt.all(workerId);
      return { success: true, data: tasks };
    } else {
      stmt = db!.prepare('SELECT * FROM tasks ORDER BY createdAt DESC');
      const tasks = stmt.all();
      return { success: true, data: tasks };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// INSERT - Ajouter une tâche
ipcMain.handle('db:add-task', async (event, task: any) => {
  try {
    const stmt = db!.prepare(
      'INSERT INTO tasks (workerId, title, description, status, dueDate) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(task.workerId, task.title, task.description, task.status || 'en attente', task.dueDate);
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('ADD_TASK', JSON.stringify({ id: result.lastInsertRowid, ...task }));
    
    return { success: true, id: result.lastInsertRowid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// UPDATE - Modifier une tâche
ipcMain.handle('db:update-task', async (event, id: number, task: any) => {
  try {
    const stmt = db!.prepare(
      'UPDATE tasks SET title = ?, description = ?, status = ?, dueDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(task.title, task.description, task.status, task.dueDate, id);
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('UPDATE_TASK', JSON.stringify({ id, ...task }));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// DELETE - Supprimer une tâche
ipcMain.handle('db:delete-task', async (event, id: number) => {
  try {
    const stmt = db!.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
    
    // Log l'action
    const logStmt = db!.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
    logStmt.run('DELETE_TASK', JSON.stringify({ id }));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// ============================================
// IPC - Gestion des fichiers
// ============================================

// Lire un fichier
ipcMain.handle('file:read', async (event, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, data: content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Écrire un fichier
ipcMain.handle('file:write', async (event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Supprimer un fichier
ipcMain.handle('file:delete', async (event, filePath: string) => {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Ouvrir un dialogue de sélection de fichier
ipcMain.handle('file:open-dialog', async (event, options?: any) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow!, options || {
      properties: ['openFile']
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Exporter la base de données
ipcMain.handle('db:export', async () => {
  try {
    const result = await dialog.showSaveDialog(mainWindow!, {
      defaultPath: `worker-man-backup-${new Date().toISOString().split('T')[0]}.db`,
      filters: [{ name: 'Database Files', extensions: ['db'] }]
    });
    
    if (!result.canceled && result.filePath) {
      const dbPath = path.join(app.getPath('userData'), 'worker-man.db');
      fs.copyFileSync(dbPath, result.filePath);
      return { success: true, message: 'Base de données exportée avec succès' };
    }
    return { success: false, message: 'Export annulé' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Importer une base de données
ipcMain.handle('db:import', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openFile'],
      filters: [{ name: 'Database Files', extensions: ['db'] }]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const importPath = result.filePaths[0];
      const dbPath = path.join(app.getPath('userData'), 'worker-man.db');
      
      // Fermer la base de données actuelle
      db?.close();
      
      // Copier le fichier importé
      fs.copyFileSync(importPath, dbPath);
      
      // Réinitialiser la base de données
      initDatabase();
      
      return { success: true, message: 'Base de données importée avec succès' };
    }
    return { success: false, message: 'Import annulé' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Obtenir les statistiques de la base de données
ipcMain.handle('db:stats', async () => {
  try {
    const workers = db!.prepare('SELECT COUNT(*) as count FROM workers').get() as any;
    const tasks = db!.prepare('SELECT COUNT(*) as count FROM tasks').get() as any;
    const logs = db!.prepare('SELECT COUNT(*) as count FROM logs').get() as any;
    
    return {
      success: true,
      data: {
        workers: workers.count,
        tasks: tasks.count,
        logs: logs.count,
        dbPath: path.join(app.getPath('userData'), 'worker-man.db')
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// ============================================
// Lifecycle
// ============================================

app.on('ready', () => {
  initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (db) {
    db.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Fermer la base de données proprement
app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});
