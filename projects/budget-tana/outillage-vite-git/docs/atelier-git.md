# Atelier guidé : branches, diff et conflit de fusion

Il s'agit d'un **exemple local fictif** sans modification du projet Budget Tana ni publication automatique de branches sur GitHub. Les commandes `git` ont été rejouées dans un dépôt temporaire sur l'ordinateur du producteur. Remplacez `git` par son chemin complet s'il n'est pas reconnu ; installation officielle : https://git-scm.com/downloads.

## Démarrage professionnel

Dans le dossier du projet, après extraction du ZIP :

```bash
git init
git branch -M main
git config user.name "Auteur formation"
git config user.email "formation@example.invalid"
git status
git add .
git commit -m "chore: initialiser Budget Tana outillé"
git log --oneline -n 3
```

L'identité ci-dessus est **une identité d'exemple locale et non un vrai compte GitHub**. Sur un projet personnel, renseignez votre propre nom et e-mail. Si Git indique qu'aucun fichier n'a changé, aucun nouveau commit n'est nécessaire.

Avant `git add .`, vérifiez que `.gitignore` évite `node_modules/`, `dist/`, `.env` et les journaux. `package.json` et le futur `package-lock.json` **doivent** être suivis. Pour expliquer un changement : `git status`, `git diff`, puis `git diff --staged` après `git add` ; les fichiers modifiés sont différents des fichiers déjà prêts à valider.

## Deux branches modifient la même ligne

La démonstration utilise un **petit fichier distinct**, `titre.js`, pour ne pas casser l'application.

```bash
git switch -c feature/recherche
# remplacer dans titre.js : const titre = "Budget Tana";
# par : const titre = "Budget Tana - recherche";
git add titre.js
git commit -m "feat: préciser le titre recherche"
git switch main
# remplacer la même ligne par : const titre = "Budget Tana - suivi";
git add titre.js
git commit -m "docs: préciser le titre suivi"
git merge feature/recherche
```

Le merge doit signaler un conflit, **pas une destruction des fichiers**. Dans `titre.js`, les marqueurs affichent deux propositions entre `<<<<<<< HEAD`, `=======` et `>>>>>>> feature/recherche`. Ne les laissez jamais dans le fichier final. Décidez ensemble de la bonne chaîne :

```js
const titre = 'Budget Tana - recherche et suivi';
```

Enregistrez le fichier puis :

```bash
git status
git add titre.js
git commit -m "merge: combiner les titres de Budget Tana"
git log --graph --oneline --all -n 7
```

**Résultat réellement vérifié** lors du test producteur : `git merge` signale `CONFLICT (content)` ; `git status --short` indique `UU titre.js` ; après résolution, la commande de commit réussit et l'historique comporte la fusion. Ce sont des commandes reproductibles, mais les SHA du dépôt local temporaire ne sont pas ceux du dépôt GitHub publié.

## Pourquoi préférer des commits clairs ?

- `feat:` nouvelle fonctionnalité ; `fix:` correction ; `docs:` documentation ; `chore:` outillage ; cette convention est **une méthode d'équipe choisie**, pas une obligation Git.
- Garder un commit = une intention. Tester avant de fusionner. Expliquer une correction dans un message plutôt que faire `git add .` sans lire le diff.
- Pour mettre à jour le projet GitHub : créer le dépôt distant seulement après configuration du compte et permission d'écriture ; `git remote add origin URL_REELLE`, puis `git push -u origin main`. **N'inventez pas d'URL GitHub personnelle** ; aucune branche ou tag distant n'est prétendue créé par les commandes de ce document.
