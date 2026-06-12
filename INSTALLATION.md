# 🚀 Guide d'Installation et Configuration - Worker Man

## 📋 Prérequis

- **Node.js** 16.0.0 ou supérieur
- **npm** 7.0.0 ou supérieur (ou yarn)
- **Windows 10/11** pour la version desktop
- **Administrator rights** (optionnel, recommandé pour certaines opérations)

## 📦 Installation du Projet

### Étape 1: Cloner le repository

```bash
git clone https://github.com/natyandry10/worker-man.git
cd worker-man
```

### Étape 2: Installer les dépendances

```bash
npm install
```

Cela installera toutes les dépendances incluant:
- React & React DOM
- Vite (bundler)
- Electron (pour l'app desktop)
- better-sqlite3 (base de données)
- Tailwind CSS
- Google Gemini AI

### Étape 3: Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_api_key_here
```

**Comment obtenir une clé Gemini API:**
1. Allez sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Cliquez sur "Create API Key"
3. Copiez la clé et collez-la dans `.env.local`

## 🔧 Configuration de la Base de Données

La base de données SQLite se crée **automatiquement** au premier lancement:

```
C:\Users\[VotreNom]\AppData\Roaming\Worker Man\worker-man.db
```

### Tables créées automatiquement:
- ✅ `workers` - Gestion des travailleurs
- ✅ `tasks` - Gestion des tâches
- ✅ `logs` - Historique des opérations

**Aucune configuration manuelle requise!**

## 🎯 Lancer l'Application

### Mode Développement Web (Port 3000)

```bash
npm run dev
```

Ouvre automatiquement: `http://localhost:3000`

### Mode Développement Electron (Desktop)

```bash
npm run electron-dev
```

Lance l'application Electron complète avec hot-reload.

## 🏗️ Construire l'Application

### Build Web uniquement

```bash
npm run build
```

Génère les fichiers optimisés dans le dossier `dist/`

### Build Installateur Windows (.exe)

```bash
npm run electron-build
```

Crée deux fichiers exécutables:
1. **Worker-Man-Setup.exe** - Installateur (recommandé)
2. **Worker-Man-portable.exe** - Exécutable portable (sans installation)

Les fichiers se trouvent dans: `dist/`

### Build avec Publication

```bash
npm run electron-publish
```

Prépare la publication sur GitHub ou un serveur.

## 🗂️ Structure du Projet

```
worker-man/
├── electron/
│   ├── main.ts              # Processus principal Electron
│   └── preload.ts           # API sécurisée
├── src/
│   ├── components/
│   │   └── DatabaseExample.tsx  # Composant d'exemple
│   ├── config/
│   │   └── database.config.ts   # Configuration DB
│   └── App.tsx              # Composant principal
├── dist/                    # Build web (généré)
├── dist-electron/           # Build Electron (généré)
├── package.json             # Dépendances
├── vite.config.ts           # Config Vite
├── electron.vite.config.ts  # Config Electron Vite
├── DATABASE_API.md          # Documentation API
└── README.md                # README principal
```

## 📚 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | 🌐 Lancer l'app web en dev |
| `npm run build` | 🏗️ Builder l'app web |
| `npm run preview` | 👀 Prévisualiser le build web |
| `npm run electron-dev` | 🖥️ Lancer Electron en dev |
| `npm run electron-build` | 📦 Créer l'installateur Windows |
| `npm run electron-publish` | 🚀 Publier l'app |
| `npm run lint` | ✅ Vérifier la syntaxe TypeScript |
| `npm run clean` | 🗑️ Supprimer les builds |

## 🔐 Configuration de Sécurité

### Context Isolation ✅
- La fenêtre Electron utilise `contextIsolation: true`
- Seule l'API exposée via preload.ts est accessible

### Node Integration ❌
- Désactivé pour la sécurité: `nodeIntegration: false`

### API Sécurisée ✅
- Toutes les opérations passent par IPC (Inter-Process Communication)
- Pas d'accès direct au système de fichiers depuis le renderer

## 💾 Gestion des Données

### Sauvegarde Automatique
La base de données utilise WAL (Write-Ahead Logging) pour:
- ✅ Meilleure performance
- ✅ Prévention de corruption
- ✅ Transactions sûres

### Backup Manuel

```typescript
// Exporter la base de données
const result = await window.electron.db.export();

// Importer une sauvegarde
const result = await window.electron.db.import();
```

### Localisation des Sauvegardes

```
C:\Users\[VotreNom]\AppData\Roaming\Worker Man\
├── worker-man.db          # Base de données principale
├── worker-man.db-shm      # Fichier mémoire partagée (WAL)
├── worker-man.db-wal      # Fichier journal (WAL)
└── backups/               # Sauvegardes manuelles
```

## 🔧 Dépannage

### "Module not found: better-sqlite3"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### "GEMINI_API_KEY is not defined"

1. Vérifiez que `.env.local` existe
2. Vérifiez que la clé est correctement formatée
3. Redémarrez l'application

### "Cannot create window"

```bash
# Effacer le cache et relancer
npm run clean
npm run electron-dev
```

### "Database locked"

- Fermez complètement l'application
- Attendez 2-3 secondes
- Relancez l'application

## 📱 Utilisation de l'Application

### Accéder à la Base de Données

```typescript
// Dans vos composants React:
const workers = await window.electron.db.workers.getAll();
const newWorker = await window.electron.db.workers.add({
  name: 'Jean',
  email: 'jean@example.com',
  phone: '0123456789',
  status: 'actif'
});
```

Voir [DATABASE_API.md](./DATABASE_API.md) pour la documentation complète.

### Exemples Fournis

Visitez le composant `DatabaseExample.tsx` pour voir des exemples complets:

```bash
npm run dev
# Puis consultez src/components/DatabaseExample.tsx
```

## 🎨 Personnalisation

### Changer le Nom de l'App

Modifiez dans `package.json`:

```json
{
  "name": "worker-man",
  "productName": "Worker Man",
  "build": {
    "productName": "Worker Man"
  }
}
```

### Changer l'Icône

Remplacez `assets/icon.ico` par votre propre icône.

### Changer les Couleurs

Modifiez `tailwind.config.js` (ou utilisez les classes Tailwind directement).

## 📦 Distribution

### Partager l'Installateur

1. Créez l'installateur:
   ```bash
   npm run electron-build
   ```

2. Le fichier se trouve dans: `dist/Worker-Man-Setup.exe`

3. Partagez-le avec vos utilisateurs

### Création d'un Portable

L'installateur NSIS crée automatiquement une version portable:
- `dist/Worker-Man-portable.exe` - Pas d'installation requise

## 🚀 Déploiement

### Serveur Web (React uniquement)

```bash
npm run build
# Téléversez le contenu de 'dist/' sur votre serveur web
```

### Déploiement Electron (Windows)

```bash
npm run electron-build
# Distribuez: dist/Worker-Man-Setup.exe
```

## 🆘 Support et Aide

### Logs et Débogage

Ouvrez la console développeur (F12) pour voir les logs:

```typescript
console.log('Debug info:', data);
```

### Consulter les Logs de la Base de Données

```typescript
const result = await window.electron.db.stats();
console.log('DB Stats:', result.data);
```

### Réinitialiser Complètement

```bash
# Supprimer la base de données
rm C:\Users\[VotreNom]\AppData\Roaming\Worker\ Man\worker-man.db

# Relancer l'app (créera une nouvelle BD)
npm run electron-dev
```

## 📝 Fichiers Importants

- **electron/main.ts** - Logique Electron + API
- **electron/preload.ts** - API sécurisée exposée
- **DATABASE_API.md** - Documentation complète de l'API
- **src/config/database.config.ts** - Configuration BD
- **package.json** - Dépendances et scripts

## ✅ Checklist de Configuration

- [ ] Node.js installé (16+)
- [ ] Repository cloné
- [ ] `npm install` exécuté
- [ ] `.env.local` créé avec GEMINI_API_KEY
- [ ] `npm run dev` fonctionne
- [ ] Base de données accessible
- [ ] Prêt à développer! 🎉

## 🎓 Prochaines Étapes

1. **Lire la documentation API**: [DATABASE_API.md](./DATABASE_API.md)
2. **Consulter les exemples**: `src/components/DatabaseExample.tsx`
3. **Commencer à développer**: Modifiez les composants React
4. **Tester en Electron**: `npm run electron-dev`
5. **Créer l'installateur**: `npm run electron-build`

## 📞 Questions Fréquentes

**Q: Puis-je utiliser cette app sans Electron?**
R: Oui, utilisez `npm run dev` pour une version web uniquement.

**Q: La base de données est-elle chiffrée?**
R: Non par défaut, mais vous pouvez activer le chiffrement dans `database.config.ts`.

**Q: Où sont stockées les données?**
R: `C:\Users\[VotreNom]\AppData\Roaming\Worker Man\`

**Q: Comment mettre à jour l'app pour les utilisateurs?**
R: Créez une nouvelle version, générez un nouvel installateur et distribuez-le.

---

🎉 **Félicitations! Vous êtes prêt à utiliser Worker Man!**
