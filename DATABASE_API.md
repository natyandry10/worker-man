# 📚 Documentation API Electron - Worker Man

## 🎯 Vue d'ensemble

Cette documentation explique comment utiliser l'API Electron pour accéder et manipuler la base de données SQLite et les fichiers du système.

## 🗄️ Structure de la Base de Données

### Table: `workers`
```sql
CREATE TABLE workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `tasks`
```sql
CREATE TABLE tasks (
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
```

### Table: `logs`
```sql
CREATE TABLE logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 💾 API Database

### Workers

#### 📖 Récupérer tous les workers
```typescript
const result = await window.electron.db.workers.getAll();
// Retour: { success: boolean, data: Worker[], error?: string }
```

#### 📖 Récupérer un worker par ID
```typescript
const result = await window.electron.db.workers.getById(1);
// Retour: { success: boolean, data: Worker, error?: string }
```

#### ➕ Ajouter un worker
```typescript
const result = await window.electron.db.workers.add({
  name: 'Jean Dupont',
  email: 'jean@example.com',
  phone: '0612345678',
  status: 'actif'
});
// Retour: { success: boolean, id: number, error?: string }
```

#### ✏️ Modifier un worker
```typescript
const result = await window.electron.db.workers.update(1, {
  name: 'Jean Dupont',
  email: 'jean.new@example.com',
  phone: '0687654321',
  status: 'inactif'
});
// Retour: { success: boolean, error?: string }
```

#### 🗑️ Supprimer un worker
```typescript
const result = await window.electron.db.workers.delete(1);
// Retour: { success: boolean, error?: string }
```

### Tasks

#### 📖 Récupérer toutes les tâches
```typescript
const result = await window.electron.db.tasks.getAll();
// Retour: { success: boolean, data: Task[], error?: string }
```

#### 📖 Récupérer les tâches d'un worker
```typescript
const result = await window.electron.db.tasks.getAll(1); // workerId = 1
// Retour: { success: boolean, data: Task[], error?: string }
```

#### ➕ Ajouter une tâche
```typescript
const result = await window.electron.db.tasks.add({
  workerId: 1,
  title: 'Nouvelle tâche',
  description: 'Description de la tâche',
  status: 'en attente',
  dueDate: new Date().toISOString()
});
// Retour: { success: boolean, id: number, error?: string }
```

#### ✏️ Modifier une tâche
```typescript
const result = await window.electron.db.tasks.update(1, {
  title: 'Tâche modifiée',
  description: 'Nouvelle description',
  status: 'en cours',
  dueDate: new Date().toISOString()
});
// Retour: { success: boolean, error?: string }
```

#### 🗑️ Supprimer une tâche
```typescript
const result = await window.electron.db.tasks.delete(1);
// Retour: { success: boolean, error?: string }
```

### Gestion de la Base de Données

#### 📊 Obtenir les statistiques
```typescript
const result = await window.electron.db.stats();
// Retour: {
//   success: boolean,
//   data: {
//     workers: number,
//     tasks: number,
//     logs: number,
//     dbPath: string
//   },
//   error?: string
// }
```

#### 📥 Exporter la base de données
```typescript
const result = await window.electron.db.export();
// Ouvre un dialogue pour choisir le chemin de sauvegarde
// Retour: { success: boolean, message: string, error?: string }
```

#### 📤 Importer une base de données
```typescript
const result = await window.electron.db.import();
// Ouvre un dialogue pour choisir le fichier à importer
// Retour: { success: boolean, message: string, error?: string }
```

## 📁 API Files

### 📖 Lire un fichier
```typescript
const result = await window.electron.file.read('/path/to/file.txt');
// Retour: { success: boolean, data: string, error?: string }
```

### ✍️ Écrire un fichier
```typescript
const result = await window.electron.file.write('/path/to/file.txt', 'contenu');
// Retour: { success: boolean, error?: string }
```

### 🗑️ Supprimer un fichier
```typescript
const result = await window.electron.file.delete('/path/to/file.txt');
// Retour: { success: boolean, error?: string }
```

### 📂 Ouvrir un dialogue de sélection
```typescript
const result = await window.electron.file.openDialog({
  properties: ['openFile'], // ou ['openDirectory']
  filters: [
    { name: 'Fichiers texte', extensions: ['txt'] },
    { name: 'Tous les fichiers', extensions: ['*'] }
  ]
});
// Retour: {
//   success: boolean,
//   data: {
//     canceled: boolean,
//     filePaths: string[]
//   },
//   error?: string
// }
```

## 🔒 Permissions et Sécurité

### ✅ Accès Autorisé
- ✔️ Tous les fichiers du dossier utilisateur (`C:\Users\votreNom\...`)
- ✔️ Documents, Downloads, Desktop, etc.
- ✔️ Fichiers créés par l'application
- ✔️ Droits d'administrateur (si l'app est lancée en administrateur)

### ❌ Accès Refusé
- ✘ Dossiers système (`C:\Windows\`, `C:\Program Files\...`)
- ✘ Fichiers d'autres utilisateurs
- ✘ Opérations sans les permissions requises

## 📍 Localisation de la Base de Données

La base de données SQLite se trouve automatiquement à:
```
C:\Users\[VotreNom]\AppData\Roaming\Worker Man\worker-man.db
```

Vous pouvez vérifier le chemin exact avec:
```typescript
const result = await window.electron.db.stats();
console.log(result.data.dbPath);
```

## 🧪 Exemple Complet

```typescript
import React, { useEffect, useState } from 'react';

export function MyComponent() {
  const [workers, setWorkers] = useState([]);

  // Charger les workers au montage
  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    const result = await window.electron.db.workers.getAll();
    if (result.success) {
      setWorkers(result.data);
    }
  };

  const addNewWorker = async () => {
    const result = await window.electron.db.workers.add({
      name: 'Nouveau Worker',
      email: 'new@example.com',
      phone: '0123456789',
      status: 'actif'
    });
    if (result.success) {
      alert(`Worker ajouté avec l'ID: ${result.id}`);
      loadWorkers(); // Recharger la liste
    }
  };

  return (
    <div>
      <button onClick={addNewWorker}>Ajouter un Worker</button>
      <ul>
        {workers.map(w => (
          <li key={w.id}>{w.name} - {w.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🚨 Gestion des Erreurs

Toujours vérifier `result.success`:

```typescript
const result = await window.electron.db.workers.getAll();

if (result.success) {
  // Succès
  console.log(result.data);
} else {
  // Erreur
  console.error('Erreur:', result.error);
  alert(`Une erreur est survenue: ${result.error}`);
}
```

## 📝 Logs des Opérations

Toutes les opérations CRUD sont enregistrées dans la table `logs`:

```typescript
// Voir les statistiques incluant le nombre de logs
const result = await window.electron.db.stats();
console.log(`Total des logs: ${result.data.logs}`);
```

## 🔄 Transactions

Pour les opérations multiples critiques, utilisez les transactions:

```typescript
// Exemple: Ajouter un worker et sa première tâche
const workerResult = await window.electron.db.workers.add({
  name: 'Jean',
  email: 'jean@example.com',
  phone: '0123456789',
  status: 'actif'
});

if (workerResult.success) {
  await window.electron.db.tasks.add({
    workerId: workerResult.id,
    title: 'Première tâche',
    description: 'Bienvenue',
    status: 'en attente'
  });
}
```

## 🆘 Dépannage

### La base de données ne se connecte pas
- Vérifiez que l'app a les permissions d'écriture dans `AppData/Roaming`
- Vérifiez que le fichier `worker-man.db` n'est pas verrouillé

### Les fichiers ne peuvent pas être lus/écrits
- Vérifiez les chemins absolus
- Vérifiez les permissions du dossier
- Utilisez `file:openDialog()` pour naviguer

### Données perdues après mise à jour
- Toujours faire un backup avec `db:export()` avant les updates
- Gardez au moins une copie de sauvegarde

## 📞 Support

Pour plus d'informations ou pour signaler des bugs, consultez le README principal.
