/**
 * Configuration de la Base de Données
 * Ce fichier contient les paramètres de configuration pour SQLite
 */

export const DATABASE_CONFIG = {
  // Nom du fichier de base de données
  filename: 'worker-man.db',
  
  // Options SQLite
  options: {
    // Activer les clés étrangères
    foreignKeys: true,
    
    // Journalisation
    journal: 'WAL', // Write-Ahead Logging pour meilleure performance
    
    // Timeout en millisecondes
    timeout: 5000,
    
    // Mode verbeux
    verbose: process.env.NODE_ENV === 'development',
  },

  // Paramètres de performance
  performance: {
    // Activer le cache
    cache: true,
    
    // Taille du cache en pages
    cacheSize: 10000,
    
    // Activer la synchronisation asynchrone
    synchronous: 0, // 0 = OFF, 1 = NORMAL, 2 = FULL
  },

  // Paramètres de sécurité
  security: {
    // Activer le chiffrement (optionnel)
    encrypted: false,
    
    // Backup automatique
    autoBackup: true,
    
    // Intervalle de backup en millisecondes (1 heure)
    backupInterval: 3600000,
  },

  // Tables et schémas
  tables: {
    workers: {
      name: 'workers',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { name: 'name', type: 'TEXT NOT NULL' },
        { name: 'email', type: 'TEXT' },
        { name: 'phone', type: 'TEXT' },
        { name: 'status', type: 'TEXT' },
        { name: 'createdAt', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
        { name: 'updatedAt', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
      ],
    },
    tasks: {
      name: 'tasks',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { name: 'workerId', type: 'INTEGER' },
        { name: 'title', type: 'TEXT NOT NULL' },
        { name: 'description', type: 'TEXT' },
        { name: 'status', type: 'TEXT' },
        { name: 'dueDate', type: 'DATETIME' },
        { name: 'createdAt', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
        { name: 'updatedAt', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
      ],
      foreignKeys: [
        { column: 'workerId', references: 'workers(id)' },
      ],
    },
    logs: {
      name: 'logs',
      columns: [
        { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { name: 'action', type: 'TEXT' },
        { name: 'details', type: 'TEXT' },
        { name: 'timestamp', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
      ],
    },
  },

  // Indices pour optimiser les requêtes
  indices: [
    { table: 'workers', column: 'name', unique: false },
    { table: 'workers', column: 'email', unique: true },
    { table: 'workers', column: 'status', unique: false },
    { table: 'tasks', column: 'workerId', unique: false },
    { table: 'tasks', column: 'status', unique: false },
    { table: 'tasks', column: 'dueDate', unique: false },
    { table: 'logs', column: 'action', unique: false },
    { table: 'logs', column: 'timestamp', unique: false },
  ],

  // Valeurs par défaut
  defaults: {
    workerStatus: 'actif',
    taskStatus: 'en attente',
  },

  // Validation
  validation: {
    worker: {
      name: { required: true, minLength: 2, maxLength: 100 },
      email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { required: false, pattern: /^[0-9\s\-\+\(\)]{10,}$/ },
      status: { required: false, enum: ['actif', 'inactif', 'en attente'] },
    },
    task: {
      workerId: { required: true, type: 'number' },
      title: { required: true, minLength: 3, maxLength: 200 },
      description: { required: false, maxLength: 1000 },
      status: { required: false, enum: ['en attente', 'en cours', 'terminée', 'annulée'] },
      dueDate: { required: false, type: 'datetime' },
    },
  },

  // Messages d'erreur
  errors: {
    CONNECTION_FAILED: 'Impossible de se connecter à la base de données',
    TABLE_EXISTS: 'La table existe déjà',
    TABLE_NOT_FOUND: 'La table n\'existe pas',
    INVALID_ID: 'ID invalide',
    DUPLICATE_EMAIL: 'Cet email existe déjà',
    FOREIGN_KEY_VIOLATION: 'Violation de clé étrangère',
    UNKNOWN: 'Une erreur inconnue est survenue',
  },

  // Chemins
  paths: {
    // Sera défini dynamiquement à l'exécution
    userDataPath: '', // app.getPath('userData')
    dbPath: '', // path.join(userDataPath, 'worker-man.db')
    backupPath: '', // path.join(userDataPath, 'backups')
    exportsPath: '', // path.join(userDataPath, 'exports')
  },

  // Versioning de la base de données
  version: '1.0.0',
  migrations: [
    {
      version: '1.0.0',
      description: 'Migration initiale - création des tables',
      up: `
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
        
        CREATE INDEX idx_workers_name ON workers(name);
        CREATE UNIQUE INDEX idx_workers_email ON workers(email);
        CREATE INDEX idx_workers_status ON workers(status);
        CREATE INDEX idx_tasks_workerId ON tasks(workerId);
        CREATE INDEX idx_tasks_status ON tasks(status);
        CREATE INDEX idx_tasks_dueDate ON tasks(dueDate);
        CREATE INDEX idx_logs_action ON logs(action);
        CREATE INDEX idx_logs_timestamp ON logs(timestamp);
      `,
    },
  ],
};

export default DATABASE_CONFIG;
