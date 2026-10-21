# Budget Tana — outillage Vite et workflow Git

Projet pédagogique fictif à Antananarivo (Madagascar). Ce jalon reprend les fonctionnalités du support précédent : saisie/suppression, recherche, tri, filtrage, import JSON, gestion des erreurs, stockage local. **Aucune donnée bancaire ni donnée réelle.** Aucun framework et aucun backend ne sont ajoutés. Node.js sert uniquement à lancer des outils de développement et les tests.

## Résultats de référence

| Étape | Dépenses | Montant affiché (MGA) |
|---|---:|---:|
| Avant import JSON, toutes catégories | 10 | 780 000 |
| Après import des 3 entrées fictives | 13 | 864 000 |
| Deuxième import du même JSON | 13 | 864 000 |
| Filtre Repas après import | 3 | 309 000 |
| Bouton erreur 404 | 13 | 864 000 |

Le filtrage est temporaire : le total affiché correspond aux seules lignes visibles. `localStorage` est propre à l'origine du site, non chiffré et réservé aux données fictives. Recharger le navigateur sous **la même origine** conserve les lignes si le stockage est autorisé.

## Prérequis et installation sur ordinateur

1. Installez une version de Node.js adaptée à Vite 8 : **20.19 ou plus dans la branche 20, 22.12 ou plus dans la branche 22**. Sur Windows, macOS ou Linux, utilisez la distribution officielle : https://nodejs.org/. Si la commande n'est pas reconnue après installation, fermez/rouvrez le terminal.
2. Téléchargez et décompressez tout le ZIP. Placez-vous dans le dossier **budget-tana-vite** contenant `package.json` et `index.html`.
3. Dans le terminal : `node --version` et `npm --version` doivent afficher leurs versions. Avec VS Code, utilisez **Fichier → Ouvrir un dossier**, puis **Terminal → Nouveau terminal**.
4. Exécutez **`npm install`** dans ce dossier. Cette étape télécharge Vite, ESLint et Prettier : **Internet est nécessaire au premier lancement**, pas pour le test Node déjà intégré. Un fichier `package-lock.json` est créé : conservez-le et validez-le avec Git pour figer la résolution des dépendances. Ne copiez jamais le dossier `node_modules` dans Git.
5. Exécutez **`npm run dev`**. Dans le terminal, Vite indique normalement une adresse locale (par exemple `http://127.0.0.1:5173/`). Ouvrez **l'adresse effectivement indiquée**. Arrêtez le serveur avec **Ctrl+C**.
6. Exécutez `npm run test` (fonctions métier), `npm run lint` (qualité du JavaScript), `npm run format` (réécriture du formatage si nécessaire), puis `npm run format:check` (contrôle). Ces commandes n'ajoutent ni React ni Angular.
7. Exécutez `npm run build` : Vite doit produire **`dist/index.html`**, `dist/assets/` et `dist/data/depenses-demo.json`. Vérifiez l'existence de ces chemins. Exécutez ensuite `npm run preview` et ouvrez l'adresse réellement indiquée (généralement sur le port 4173) : **ne double-cliquez pas sur `dist/index.html`**.

**Vérification technique effectuée par le producteur :** les 16 tests Node.js issus du projet précédent passent après migration. Les changements de chemin, imports, présence de JSON, CSS, ressources et scripts sont vérifiés. **Limite de validation :** dans l'environnement de production du cours, le registre npm est inaccessible (`EAI_AGAIN`) ; `npm install`, `npm run dev`, `npm run build`, `npm run lint` et `npm run format:check` **n'ont donc pas été exécutés ici**. Ils sont décrits comme étapes à réaliser sur un ordinateur connecté, et non comme résultats déjà observés.

## Comprendre les fichiers

```text
budget-tana-vite/
├── index.html                    # Point d'entrée Vite
├── package.json                  # Scripts npm et versions directes
├── vite.config.js                # base './' pour chemins relatifs
├── eslint.config.js              # Analyse statique
├── .prettierrc.json              # Règles de formatage
├── .gitignore                    # node_modules, dist, secrets
├── src/
│   ├── main.js                  # Point d'entrée JavaScript
│   ├── ui.js                    # DOM et événements
│   ├── etat.js, api.js, ...     # Fonctions métier inchangées
│   ├── styles.css               # CSS importé depuis index.html
│   └── data/depenses.js         # Dix données de départ fictives
├── public/data/
│   └── depenses-demo.json       # Ressource statique copiée vers dist/
├── tests/                        # Tests Node natifs
└── docs/                         # Guide Git et protocole de validation
```

**Pourquoi `public` ?** Vite recopie `public/data/depenses-demo.json` vers `dist/data/depenses-demo.json`. Le JavaScript continue d'appeler `fetch('data/depenses-demo.json')`, chemin **relatif** valable dans le serveur de développement et l'aperçu du build. **Pourquoi `src` ?** Le code métier importé est intégré au graphe des modules par Vite ; il n'est pas servi de la même façon que les fichiers statiques de `public`.

## Scripts npm et rôle

| Commande | Effet observé ou attendu |
|---|---|
| `npm run dev` | Lance le serveur de développement Vite (à exécuter après installation). |
| `npm run build` | Assemble l'application dans `dist/` (non exécuté dans l'environnement de création). |
| `npm run preview` | Sert un aperçu local du build déjà créé. |
| `npm run test` | Exécute **16 tests** Node natifs ; **réussi localement**. |
| `npm run lint` | Lance ESLint en configuration simple recommandée. |
| `npm run format` | Applique Prettier ; modifie les fichiers suivis par Git. |
| `npm run format:check` | Détecte les différences de présentation sans les corriger. |

Les versions exactes des dépendances directes sont définies dans `package.json`. Les dépendances transitives ne peuvent être intégralement figées qu'après génération de `package-lock.json` par `npm install`. Conserver ce fichier et préférer `npm ci` dans un projet disposant déjà d'un verrou.

## Git : étapes de travail

Ouvrez `docs/atelier-git.md` pour une séquence reproductible de `git init`, `git add`, commits, branches, diff et résolution d'un conflit. Le scénario de conflit a été **exécuté et vérifié dans un dépôt local temporaire**, sans modifier les données du projet livré.

## Dépannage

- `npm: commande introuvable` : vérifier Node.js et rouvrir le terminal ; contrôler `node --version`, `npm --version`.
- `ENOENT package.json` : `cd` vers le dossier **budget-tana-vite** et afficher son contenu (`dir` sous Windows, `ls` sous macOS/Linux).
- `EAI_AGAIN`, réseau absent : installer les dépendances lors d'une connexion disponible ; **le ZIP seul ne contient pas `node_modules`** et ne permet pas de lancer Vite sans cette installation.
- Port occupé : Vite peut choisir un autre port ; utilisez l'URL réellement affichée, pas une adresse devinée.
- Écran vide : F12 → Console puis Réseau, vérifier chemins et erreurs ; une erreur `file://` signifie qu'il faut le serveur Vite.
- `404 /data/depenses-demo.json` : vérifier l'emplacement `public/data/` et le serveur ; ne pas confondre un chemin `src/` avec une ressource statique.
- Rechargement sans données : vérifier l'origine/port identique, l'état `localStorage` et le mode privé ; ne pas saisir de données personnelles.
- `npm run format:check` en erreur : lancer `npm run format`, relire le diff avec `git diff`, puis refaire le contrôle.
- Erreur de lint : lire le fichier/la ligne indiqués, corriger la cause, puis relancer le script. **Ne pas masquer toutes les règles**.

## Documentation officielle

- Vite : https://vite.dev/guide/
- npm scripts : https://docs.npmjs.com/cli/using-npm/scripts
- Git : https://git-scm.com/docs/git-merge et https://git-scm.com/docs/git-status
- ESLint : https://eslint.org/docs/latest/use/getting-started
- Prettier : https://prettier.io/docs/install
- Node.js : https://nodejs.org/
