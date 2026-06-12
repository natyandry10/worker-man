# 🤝 Guide de Contribution - Worker Man

Merci de votre intérêt pour contribuer à Worker Man! Ce document explique comment contribuer au projet.

## 📋 Table des Matières

- [Code de Conduite](#-code-de-conduite)
- [Comment Commencer](#-comment-commencer)
- [Types de Contributions](#-types-de-contributions)
- [Processus de Contribution](#-processus-de-contribution)
- [Guidelines de Code](#-guidelines-de-code)
- [Commit Messages](#-commit-messages)
- [Pull Requests](#-pull-requests)
- [Signaler des Bugs](#-signaler-des-bugs)
- [Demander des Fonctionnalités](#-demander-des-fonctionnalités)

## 🎯 Code de Conduite

Nous nous engageons à fournir un environnement accueillant pour tous. Veuillez:

- ✅ Être respectueux des autres contributeurs
- ✅ Accepter les critiques constructives
- ✅ Se concentrer sur ce qui est bon pour la communauté
- ✅ Montrer de l'empathie envers les autres membres

**Inacceptable:**
- ❌ Langage harcelant ou discriminatoire
- ❌ Attaques personnelles ou professionnelles
- ❌ Spam ou publicités
- ❌ Révélation d'informations privées

## 🚀 Comment Commencer

### Prérequis
- Git installé
- Node.js 16+
- Compte GitHub
- Connaissances basiques en TypeScript/React (optionnel)

### Setup Local

```bash
# 1. Fork le repository
# (Cliquez sur "Fork" en haut à droite)

# 2. Cloner votre fork
git clone https://github.com/[VotreUsername]/worker-man.git
cd worker-man

# 3. Ajouter le repository original comme upstream
git remote add upstream https://github.com/natyandry10/worker-man.git

# 4. Installer les dépendances
npm install

# 5. Créer une branche de travail
git checkout -b feature/ma-feature

# 6. Lancer l'app en développement
npm run dev
```

## 🎨 Types de Contributions

### 1. **Corrections de Bugs** 🐛
```bash
git checkout -b bugfix/description-du-bug
```
- Testez votre correction
- Documentez le bug dans le commit
- Incluez les étapes de reproduction

### 2. **Nouvelles Fonctionnalités** ✨
```bash
git checkout -b feature/nouvelle-fonctionnalite
```
- Suivez le style de code existant
- Ajoutez de la documentation
- Testez complètement la fonctionnalité

### 3. **Améliorations de Documentation** 📚
```bash
git checkout -b docs/description
```
- Corrigez les typos
- Clarifiez les explications
- Ajoutez des exemples

### 4. **Améliorations de Performance** ⚡
```bash
git checkout -b perf/description
```
- Mesurez les améliorations
- Testez sur plusieurs configurations
- Documentez les optimisations

### 5. **Refactorisation de Code** 🔄
```bash
git checkout -b refactor/description
```
- Pas de changement de fonctionnalité
- Améliorez la lisibilité
- Gardez la compatibilité

## 📝 Processus de Contribution

### Étape 1: Créer une Issue (pour les features majeures)

Avant de commencer un gros travail:

```markdown
## Description
Une description claire de ce que vous voulez faire.

## Motivation
Pourquoi cette change est nécessaire?

## Alternatives Considérées
Avez-vous pensé à d'autres approches?

## Contexte Additionnel
Toute autre information pertinente.
```

### Étape 2: Développer Localement

```bash
# Mettez à jour votre branche locale
git fetch upstream
git rebase upstream/main

# Apportez vos changements
# Testez les changements
npm run lint
npm run build

# Committez vos changements (voir section Commits)
git add .
git commit -m "type: description"
```

### Étape 3: Pusher et Créer une PR

```bash
# Pousser sur votre fork
git push origin feature/ma-feature

# Créer une Pull Request sur GitHub
# (Vous verrez un bouton "Compare & pull request")
```

### Étape 4: Review du Code

- Répondez aux demandes de changements
- Participez à la discussion
- Faites les ajustements nécessaires

### Étape 5: Merge

Une fois approuvée, votre PR sera mergée par un mainteneur.

## 🎯 Guidelines de Code

### Structure des Fichiers

```typescript
// ✅ BON
import { useState } from 'react';

export function MyComponent() {
  const [state, setState] = useState('');
  
  return <div>{state}</div>;
}

// ❌ MAUVAIS
import * as React from 'react';
const MyComponent = () => {
  let state = '';
  return <div>{state}</div>;
};
```

### Nommage

- **Composants**: `PascalCase` (MyComponent.tsx)
- **Variables/Fonctions**: `camelCase` (myFunction)
- **Constantes**: `UPPER_SNAKE_CASE` (MY_CONSTANT)
- **Fichiers**: `kebab-case` (my-file.ts) ou `PascalCase` (MyComponent.tsx)

### Types TypeScript

```typescript
// ✅ Spécifiez les types
interface Worker {
  id: number;
  name: string;
  email: string;
}

const getWorker = (id: number): Worker => {
  // ...
};

// ❌ Évitez 'any'
const getWorker = (id: any): any => {
  // ...
};
```

### Commentaires

```typescript
// ✅ Commentaires utiles
// Récupère les workers actifs uniquement
const activeWorkers = workers.filter(w => w.status === 'active');

// ❌ Commentaires inutiles
// Filtre les workers
const activeWorkers = workers.filter(w => w.status === 'active');
```

### Formatage

- Indentation: 2 espaces
- Longueur ligne: 100 caractères max (recommandé)
- Point-virgule: Oui
- Single quotes: Non, utilisez des backticks

```typescript
// ✅ BON
const message = `Hello ${name}`;

// ❌ MAUVAIS
const message = 'Hello ' + name;
```

### Fonctions

```typescript
// ✅ BON - Lisible et testable
function calculateTotalPrice(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ MAUVAIS - Trop complexe
function c(i: any): any {
  let t = 0;
  for (let x of i) t += x.p;
  return t;
}
```

## 💬 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Changement de documentation
- **style**: Formatage, typos (pas de changement logique)
- **refactor**: Restructuration du code
- **perf**: Amélioration de performance
- **test**: Ajout/modification de tests
- **chore**: Dépendances, configuration

### Exemples

```bash
# Bonne feature
git commit -m "feat(database): add worker export functionality"

# Bonne correction
git commit -m "fix(api): handle null worker IDs correctly"

# Bon refactor
git commit -m "refactor(components): simplify worker list rendering"

# Bonne documentation
git commit -m "docs(api): add database examples"
```

### Structure du Message

**Subject** (première ligne):
- Commencez par un verbe: "add", "fix", "update"
- Pas de point à la fin
- Max 50 caractères
- Minuscules

**Body** (après une ligne vide):
- Explique le **POURQUOI**, pas le **QUOI**
- Wrapped à 72 caractères
- Max 2-3 paragraphes

**Footer**:
- Référencez les issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

```
feat(auth): add user authentication

Implement JWT-based authentication to secure API endpoints.
This allows users to register and login with credentials.

The implementation follows OAuth2 standards and includes
proper token refresh mechanisms.

Closes #45
```

## 🔄 Pull Requests

### Template de PR

```markdown
## Description
Explique les changements dans cette PR.

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Changement cassant (breaking)
- [ ] Changement de documentation

## Changements Liés
Fixes #123
Related to #456

## Comment a été testé?
Décrivez comment vous avez testé les changements.

## Screenshots (si applicable)
Ajoutez des screenshots pour les changements UI.

## Checklist
- [ ] Mon code suit les guidelines de style
- [ ] J'ai effectué une auto-review
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai testé localement
```

### Points Importants

- ✅ Une seule fonctionnalité par PR
- ✅ Tests inclus si applicable
- ✅ Documentation mise à jour
- ✅ Commits propres et logiques
- ✅ Pas de merge conflicts

## 🐛 Signaler des Bugs

### Template de Bug

```markdown
## Description du Bug
Description claire et concise du bug.

## Étapes pour Reproduire
1. Allez à '...'
2. Cliquez sur '...'
3. Descendez à '...'
4. Voir l'erreur

## Comportement Attendu
Décrire ce qui devrait se passer.

## Comportement Actuel
Décrire ce qui se passe réellement.

## Screenshots
Attachez des screenshots si possible.

## Environnement
- OS: [ex. Windows 11]
- Node Version: [ex. 18.0.0]
- npm Version: [ex. 9.0.0]

## Logs Supplémentaires
Collez les logs d'erreur ici.
```

## ✨ Demander des Fonctionnalités

### Template de Feature Request

```markdown
## Description
Description claire de la fonctionnalité demandée.

## Problème Résolu
Décrivez le problème que cette fonctionnalité résoudrait.

## Cas d'Usage
Donnez des exemples d'utilisation.

## Alternatives Considérées
Avez-vous pensé à d'autres solutions?

## Contexte Additionnel
Toute autre information pertinente.
```

## 🧪 Tests

### Lancer les Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:coverage

# Linter
npm run lint

# Type checking
npm run type-check
```

### Écrire des Tests

```typescript
describe('Worker Database', () => {
  it('should add a new worker', async () => {
    const worker = {
      name: 'John',
      email: 'john@example.com',
      status: 'active'
    };
    
    const result = await db.workers.add(worker);
    
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });
});
```

## 📖 Documentation

### Documenter une Fonctionnalité

1. **Code Comments**: Expliquez les **pourquoi**
2. **README**: Mettez à jour si changement majeur
3. **API Docs**: Documentez les API publiques
4. **Examples**: Fournissez des exemples d'utilisation

## 🔐 Sécurité

### Rapporter une Vulnérabilité

**Ne publiez pas les vulnérabilités publiquement!**

Contactez: workerman.rmj@gmail.com

Incluez:
- Description de la vulnérabilité
- Étapes pour reproduire
- Impact potentiel
- Corrections suggérées

## 📞 Support

### Questions?

- 💬 Ouvrez une [Discussion](https://github.com/natyandry10/worker-man/discussions)
- 📧 Email: workerman.rmj@gmail.com
- 🐙 GitHub Issues: [Issues](https://github.com/natyandry10/worker-man/issues)

## 🎓 Ressources Utiles

- [Git Documentation](https://git-scm.com/doc)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Electron Documentation](https://www.electronjs.org/docs)

## ✅ Checklist Finale

Avant de submitter une PR:

- [ ] J'ai lu le CONTRIBUTING.md
- [ ] J'ai créé une branche depuis `main`
- [ ] J'ai testé mon code localement
- [ ] J'ai run `npm run lint`
- [ ] J'ai run `npm run build`
- [ ] J'ai mis à jour la documentation
- [ ] Mon PR a une description claire
- [ ] Je n'ai pas de merge conflicts

## 🎉 Merci!

Vos contributions aident à rendre Worker Man meilleur pour tout le monde!

---

**Dernière mise à jour:** 2026-06-12
