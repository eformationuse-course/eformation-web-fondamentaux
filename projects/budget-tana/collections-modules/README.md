# Budget Tana — Collections, objets et modules

**Projet pédagogique fictif à Antananarivo.** Aucun compte, aucune donnée bancaire, aucun paiement, aucune connexion externe. Les montants en ariary (MGA) sont inventés.

## Ce que montre le projet

Par rapport au premier cours JavaScript, qui additionnait cinq montants fixés dans des variables, ce jalon utilise **dix dépenses**, sous forme d'un **tableau d'objets**. Le code apprend à filtrer, trouver, transformer, totaliser, trier sans modifier la source, vérifier les entrées et répartir le programme en **modules ES**.

| Mois | Logement | Repas | Transport | Internet | Fournitures | Total | Revenu fictif | Reste |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2026-09 | 180000 | 120000 | 40000 | 25000 | 10000 | 375000 | 450000 | 75000 |
| 2026-10 | 180000 | 135000 | 45000 | 25000 | 20000 | 405000 | 450000 | 45000 |

Total deux mois : **780000 MGA**, dont **255000 MGA de repas**, **360000 MGA de logement**, **85000 MGA de transport**, **50000 MGA d'Internet** et **30000 MGA de fournitures**.

## Arborescence

```text
collections-modules/
├── index.html            # Une page expliquant comment voir les résultats
├── data/depenses.js      # Dix enregistrements fictifs
├── src/
│   ├── validation.js     # Vérification des montants, dates et identifiants
│   ├── calculs.js        # Filtrage, recherche, sommes, bilans et tris
│   ├── formatage.js      # Présentation d'un nombre en MGA
│   └── main.js           # Point d'entrée, affiche le bilan dans la console
├── exemples/
│   ├── 01-tableaux-objets.mjs
│   ├── 02-methodes.mjs
│   └── 03-erreurs.mjs
└── tests/verification.mjs
```

## Option A : exécuter dans le terminal avec Node.js

Installer Node.js (20+ conseillé) depuis https://nodejs.org/ puis ouvrir un terminal dans le dossier `collections-modules`.

```bash
node src/main.js
node exemples/01-tableaux-objets.mjs
node exemples/02-methodes.mjs
node exemples/03-erreurs.mjs
node tests/verification.mjs
```

Les `.mjs` sont reconnus comme modules ES. Les `.js` importés par `src/main.js` sont également traités comme modules ES dans Node.js récent lorsqu'il détecte leur syntaxe `import/export`, mais ce comportement dépend de la version. Pour rendre la configuration explicite et robuste, le dossier comprend un `package.json` avec `"type": "module"` (aucune bibliothèque à installer).

## Option B : dans un navigateur (serveur local obligatoire)

Les navigateurs modernes peuvent bloquer les imports ES depuis `file://` ; **ne pas double-cliquer sur `index.html` pour exécuter les modules**.

Dans le dossier `collections-modules`, lancer :

```bash
python -m http.server 8000
```

Sous Windows, si `python` n'est pas reconnu, essayer `py -m http.server 8000`. Ouvrir ensuite **http://localhost:8000/** dans le navigateur et afficher **F12 → Console**. Arrêter le serveur avec **Ctrl+C**. Python ne sert qu'à distribuer des fichiers locaux ; aucune base de données ni API n'est ajoutée. Une extension de serveur local VS Code peut aussi convenir si elle sert tous les fichiers du dossier.

**Résultat attendu** : septembre 375000 MGA, octobre 405000 MGA, restant 75000 et 45000 MGA ; cumul deux mois 780000 MGA ; aucun résultat pour un identifiant inconnu.

## Cas limites

- `calculerTotal([])` vaut `0` grâce à la valeur initiale `0` de `reduce`.
- `trouverDepense()` retourne `undefined` pour un identifiant absent : tester ce cas avant de lire une propriété.
- `verifierCollection()` lève une erreur lorsqu'une date est impossible, qu'un montant est négatif ou décimal, qu'une catégorie est inconnue ou qu'un identifiant est dupliqué.
- Une date s'écrit `AAAA-MM-JJ`, un mois `AAAA-MM` ; montants en **entiers MGA**.
- `[...liste].sort(...)` copie le tableau avant le tri, mais les objets restent partagés (copie superficielle).
- Les modules ne construisent **pas encore** d'interface de saisie : DOM, événements, formulaires interactifs sont abordés plus tard.

## Vérification de l'auteur

```bash
node tests/verification.mjs
```

Ce contrôle utilise les assertions intégrées à Node.js, sans bibliothèque externe ni connexion Internet.

## Documentation officielle

- https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch
