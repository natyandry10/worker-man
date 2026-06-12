# Worker Man - Desktop Application

Une application desktop Windows pour gérer vos workers avec intégration Google Gemini AI.

## 🚀 Fonctionnalités

- Interface moderne avec React et Tailwind CSS
- Intégration Google Gemini AI
- Génération d'Excel
- Export en images
- Application desktop native Windows

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn

### Développement

1. **Cloner le repository:**
   ```bash
   git clone https://github.com/natyandry10/worker-man.git
   cd worker-man
   ```

2. **Installer les dépendances:**
   ```bash
   npm install
   ```

3. **Configurer l'API Key:**
   - Créer un fichier `.env.local`
   - Ajouter: `VITE_GEMINI_API_KEY=votre_cle_api`

4. **Lancer en développement:**
   ```bash
   npm run dev
   ```

### Build Desktop (Windows)

**Option 1: Installer (NSIS)**
```bash
npm run electron-build
```
Crée un fichier `.exe` installable dans le dossier `dist`.

**Option 2: Exécutable Portable**
```bash
npm run electron-build
```
Génère aussi une version portable (sans installation requise).

## 🛠️ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lancer l'app web localement |
| `npm run build` | Builder la version web |
| `npm run electron-dev` | Lancer l'app Electron en dev |
| `npm run electron-build` | Créer les installateurs Windows |
| `npm run lint` | Vérifier la syntaxe TypeScript |

## 📋 Structure du Projet

```
worker-man/
├── electron/           # Code Electron
│   ├── main.ts        # Processus principal
│   └── preload.ts     # Préchargement sécurisé
├── src/               # Code React
├── dist/              # Build web
├── dist-electron/     # Build Electron
└── package.json       # Config du projet
```

## 🔑 Variables d'Environnement

Créer `.env.local`:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📥 Distribution

L'exécutable Windows se trouve dans:
- `dist/` - Installateur NSIS (.exe)
- `dist/` - Version portable (.exe)

## 🤝 Contribution

Les contributions sont bienvenues!

## 📄 License

MIT
