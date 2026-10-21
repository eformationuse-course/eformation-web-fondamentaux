# Architecture lisible : qui décide quoi ?

**Entrée utilisateur :** `index.html` → `src/main.ts` → `src/ui/controller.ts` → `src/ui/form.ts` → `src/services/depenses.ts` → `src/domain/etat.ts` → `src/storage/local.ts`. Le contrôleur déclenche ensuite `src/ui/vue.ts` pour afficher une copie de l'état.

**Import JSON :** bouton → contrôleur → `services/depenses.ts` → `services/json.ts` → `fetch()` → `unknown` → `domain/validation.ts` → calculs et état → stockage → vue.

**Donnée corrompue :** stockage → `storage/local.ts` (résultat `invalide`) → service (bloque les écritures et continue en mémoire) → message accessible dans le DOM. La sauvegarde incorrecte ne doit pas être écrasée automatiquement. Le bouton **Restaurer** l'efface explicitement ; si l'effacement échoue, l'application reste en mémoire avec un message explicite.

Le domaine n'importe jamais le DOM et n'effectue pas de requête réseau. Les formats MGA sont isolés des calculs en nombres entiers. La validation de `unknown` à l'exécution reste nécessaire même après la vérification de `tsc`.

## Conventions

- Un seul module orchestre les changements de l'état : `services/depenses.ts`.
- Un seul module vérifie les données de l'extérieur : `domain/validation.ts`.
- Seul `ui/vue.ts` crée les lignes HTML, avec `textContent` pour la saisie.
- Le service accepte des dépendances injectées (`Storage | null`, `typeof fetch`) afin de rendre les scénarios reproductibles.
- `public/data/depenses-demo.json` reste un fichier statique fictif, non une API externe.
