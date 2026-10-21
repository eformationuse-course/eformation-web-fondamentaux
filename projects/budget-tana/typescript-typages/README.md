# Budget Tana — TypeScript : fondamentaux, types et diagnostics

**Projet pédagogique fictif** à Antananarivo, Madagascar. Ce jalon prolonge le projet Vite/JavaScript du support précédent ; il **conserve l'interface**, les dix dépenses fictives et les calculs, mais traduit l'application en TypeScript strict. Aucun compte réel, donnée bancaire ni API distante.

## Résultat observable

Au démarrage : 10 dépenses, 780 000 MGA. Septembre 2026 : 375 000 MGA ; octobre 2026 : 405 000 MGA, dont 255 000 MGA de repas sur deux mois. Un ajout de 12 000 MGA donne 11 dépenses et 792 000 MGA. L'import du JSON local apporte **3 nouvelles dépenses / 84 000 MGA**, et donne 13 dépenses / 864 000 MGA depuis l'état initial. Une seconde importation de ces trois lignes n'ajoute rien. Les montants sont inventés ; ni coût de la vie ni budget conseillé.

## Prérequis et installation

- Un ordinateur (Windows, macOS, Linux), un éditeur de texte comme Visual Studio Code et un navigateur récent.
- Installer **Node.js 22.12+** (ou 20.19+) sur https://nodejs.org/ ; ces versions répondent aux prérequis de Vite 8. Vérifier les commandes `node --version` et `npm --version` dans un terminal rouvert.
- Une connexion est nécessaire une fois pour télécharger les dépendances npm. Les calculs peuvent être étudiés ensuite hors ligne avec l'archive et un compilateur déjà installé.
- Télécharger l'archive du projet puis **extraire tous ses fichiers**. Ouvrir dans VS Code **le dossier contenant `package.json`, `index.html`, `tsconfig.json` et `src/`**, et non seulement un fichier isolé.

Depuis ce dossier :

```bash
npm install
npm run typecheck
npm run dev
```

Le serveur Vite annonce son URL dans le terminal, normalement **http://127.0.0.1:5173/** ; ouvrir l'URL réellement affichée. Dans l'interface : ajouter une dépense, filtrer « Repas », charger le JSON fictif et voir le total se mettre à jour. Pour arrêter le serveur, `Ctrl+C`.

Le build de production est lancé par :

```bash
npm run build
npm run preview
```

Le script `build` effectue **d'abord la vérification stricte TypeScript**, ensuite `vite build`. Le preview sert le résultat construit, à une adresse indiquée dans le terminal. L'application n'envoie rien à un serveur applicatif ; la sauvegarde utilise seulement **localStorage**, non chiffré et lié à ce navigateur.

## Vérifier et comprendre les erreurs

```bash
npm run typecheck
npm test
```

`npm test` compile les modules de métier vers le dossier temporaire `dist/` puis exécute les tests Node.js. `dist/` et `node_modules/` ne doivent pas être copiés dans Git.

Les trois fichiers du dossier `docs/erreurs/` sont **volontairement incorrects** et exclus des configurations normales. Pour observer individuellement les diagnostics :

```bash
npx tsc --strict --noEmit --target ES2022 docs/erreurs/01-texte-au-lieu-du-montant.ts
npx tsc --strict --noEmit --target ES2022 docs/erreurs/02-categorie-inconnue.ts
npx tsc --strict --noEmit --target ES2022 docs/erreurs/03-null-possible.ts
```

Les diagnostics attendus sont respectivement **TS2322**, **TS2322** et **TS18048**. Ces commandes doivent échouer intentionnellement : elles démontrent ce que détecte le compilateur.

## Architecture du projet

- `src/types.ts` : catégorie, `Expense`, entrée de formulaire, union de statut.
- `src/data/depenses.ts` : dix dépenses fictives, comme dans le projet précédent.
- `src/validation.ts` : contrôle **à l'exécution** des données inconnues, dates, montants et identifiants.
- `src/calculs.ts` : calculs strictement typés, `Record<Category, number>`, fonction générique `copierListe`.
- `src/etat.ts` : ajout, suppression, restauration et import sans doublon.
- `src/api.ts` : `fetch` d'un JSON local, réponse analysée comme `unknown` puis validée.
- `src/stockage.ts` : lecture/sauvegarde locale avec statuts discriminés.
- `src/dom.ts` et `src/ui.ts` : références DOM typées, événements et erreurs `unknown`.
- `public/data/depenses-demo.json` : trois dépenses supplémentaires, **fictives**.
- `tests/` : contrôle du modèle, des calculs, des erreurs réseau simulées et des diagnostics réels du compilateur.

## Pourquoi TypeScript ne remplace pas la validation métier

Une annotation `const montant: number` n'interdit pas qu'un serveur ou un fichier JSON fournisse le texte `"12000"`. Après compilation, les annotations de TypeScript n'existent plus. Nous traitons donc **JSON.parse** et **response.json()** comme des valeurs `unknown`, vérifions **réellement** la date, la catégorie, les entiers sûrs, les doublons et le total, puis seulement les traitons comme `Expense[]`.

Les fonctions `verifierCollection` et `verifierDepense` affichent des erreurs explicites en cas de données invalides. Ce contrôle pédagogique reste insuffisant pour un véritable produit financier : validation côté serveur, authentification, chiffrement et conformité seraient indispensables selon le contexte.

## Dépannage

| Symptôme | Cause possible | Réaction |
|---|---|---|
| `node` ou `npm` introuvable | Node.js absent, terminal ancien | Installer Node.js, rouvrir le terminal, vérifier `node --version` |
| `tsc` introuvable | `npm install` absent | Exécuter `npm install` dans le dossier avec `package.json` |
| `Cannot find module 'vite'` | dépendances non téléchargées | Vérifier Internet, relancer `npm install`; ne pas inventer de build réussi |
| `index.html` en `file://` | modules TS non transformés | Utiliser `npm run dev` puis l'URL de Vite |
| erreur `TS2322` | types incompatibles | Comparer type annoncé et valeur transmise ; éviter `as any` |
| erreur `TS18048` | résultat potentiellement absent | Vérifier `undefined` avant de lire la propriété |
| aucun résultat de filtre | recherche trop restrictive | Réinitialiser recherche et filtres |
| sauvegarde non retrouvée | origine/navigateur différents | Garder le même navigateur et la même adresse HTTP ; ne pas utiliser `file://` |

## Périmètre réellement testé pendant la production

- **Exécuté :** `tsc` version 5.8.3 avec configuration stricte, émission JS Node, tests de données/erreurs, trois diagnostics `tsc` réellement observés, test Chromium de l'interface avec **JavaScript compilé injecté**.
- **Non exécuté dans l'environnement de production :** `npm install` et `vite build`, car le registre npm est inaccessible ici (`EAI_AGAIN`). La navigation Chromium vers une adresse locale est également bloquée par la politique du banc d'essai. Le navigateur a testé les interactions à partir des fichiers JS compilés intégrés dans une page, **sans serveur Vite**.
- **À vérifier sur ordinateur connecté :** `npm install`, `npm run typecheck`, `npm run build`, `npm run dev`, rechargement de `localStorage` depuis l'URL Vite, import du JSON réel et erreur 404.

## Documentation officielle

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- https://www.typescriptlang.org/tsconfig/
- https://vite.dev/guide/
- https://nodejs.org/en
