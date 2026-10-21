# Budget Tana — TypeScript appliqué et architecture frontend

**Projet pédagogique fictif à Antananarivo, Madagascar.** Cette étape refactorise l'application TypeScript du support précédent. Elle conserve exactement les dix dépenses initiales et les fonctionnalités de l'interface (ajout, suppression, filtres, recherche, tri, JSON local, sauvegarde). Aucune donnée bancaire ni connexion à un service de paiement.

## Résultat attendu, vérifié sur les sources

- Situation initiale : **10 dépenses ; 780 000 MGA**, dont 375 000 en septembre et 405 000 en octobre 2026. La catégorie Repas totalise 255 000 MGA.
- Ajout fictif : Cahiers novembre, 12 000 MGA, Fournitures, 2026-11-05 → **11 dépenses ; 792 000 MGA**.
- Import depuis la situation initiale : trois dépenses de novembre représentant 84 000 MGA → **13 dépenses ; 864 000 MGA** ; le second import n'ajoute aucune ligne. Si l'ajout de 12 000 MGA précède l'import, on obtient **14 dépenses ; 876 000 MGA**.
- Stockage corrompu : l'interface revient aux exemples fictifs **sans écraser** la chaîne locale invalide ; seul le clic sur **Restaurer** l'efface (si autorisé).

## Démarrage pas à pas

1. Sur un ordinateur Windows/macOS/Linux, installer **Node.js 22.12+ ou 20.19+** depuis <https://nodejs.org/>. Fermer puis rouvrir le terminal. Vérifier `node --version` et `npm --version`.
2. Télécharger **l'archive ZIP** de ce jalon et **extraire tous les fichiers**. Dans VS Code, ouvrir le dossier contenant à la fois `package.json`, `index.html`, `src/` et `public/` ; sélectionner *Terminal → Nouveau terminal*.
3. Avec Internet disponible pour la première installation, saisir exactement :

   ```bash
   npm install
   npm run typecheck
   npm test
   npm run dev
   ```

4. Lire l'URL réellement affichée par Vite, habituellement `http://127.0.0.1:5173/`, et l'ouvrir dans Chrome, Edge ou Firefox. Garder le terminal ouvert ; arrêter avec `Ctrl+C`.
5. Cliquer sur *Charger les 3 dépenses JSON fictives*, puis *Illustrer une erreur HTTP 404*. Filtrer *Repas*, saisir une dépense fictive, supprimer et restaurer. À chaque étape, vérifier les totaux et le message visible.
6. Pour une version optimisée à publier :

   ```bash
   npm run build
   npm run preview
   ```

   `npm run build` exécute d'abord TypeScript strict, puis **Vite build**. `npm run preview` sert le résultat construit dans `dist/`, à une adresse indiquée par Vite. Ne pas envoyer `dist/` avec des données privées.

**Sans `npm install` réussi, Vite ne peut pas être lancé.** Le script `npm run build:typescript` ne fait qu'émettre des modules JavaScript dans `dist-browser/` : cela permet de vérifier la compilation, **ce n'est pas le build de production Vite**. Un ordinateur seul/smartphone peut consulter le PDF mais ne suffit pas aux commandes du terminal sans environnement adapté.

## Arborescence et responsabilités

| Zone | Fichiers | Responsabilité |
|---|---|---|
| `src/domain/` | `models.ts`, `validation.ts`, `calculs.ts`, `etat.ts` | Type, règles métier et état, **sans DOM** |
| `src/services/` | `depenses.ts`, `json.ts` | Orchestrer l'état et l'import JSON fictif |
| `src/storage/` | `local.ts` | Lire, écrire et supprimer la sauvegarde versionnée |
| `src/ui/` | `dom.ts`, `form.ts`, `vue.ts`, `controller.ts` | Formulaire, affichage, événements et messages accessibles |
| `src/utils/` | `formatage.ts`, `errors.ts` | Montants MGA et exceptions inconnues |
| `src/data/`, `public/data/` | `depenses.ts`, `depenses-demo.json` | Jeux d'essai fictifs strictement définis |

Voir `docs/architecture.md` pour les flux de données et `docs/migration.md` pour la correspondance complète avant/après.

## Vérifications de l'auteur du cours

```bash
npm run typecheck
npm test
```

Les tests Node couvrent les calculs, la non-régression des fonctionnalités, l'import, les doublons, les erreurs de forme, la sauvegarde corrompue **sans écrasement**, le tri, et un `fetch` réel sur un **serveur HTTP local temporaire**. Les tests purement DOM utilisent un navigateur, pas `npm test`.

**Commandes alternatives si TypeScript est déjà installé globalement** (pour vérifier hors réseau) :

```bash
tsc --noEmit -p tsconfig.json
tsc -p tsconfig.node.json
node --test tests/*.test.mjs
tsc -p tsconfig.browser.json
```

## Dépannage

| Symptôme | Cause fréquente | Réaction précise |
|---|---|---|
| `npm` inconnu | Node absent ou terminal non rouvert | Réinstaller Node puis `node --version` |
| `Cannot find module 'vite'` | Dépendances absentes | Dans le dossier avec `package.json` : `npm install` |
| Accès au registre impossible (`EAI_AGAIN`) | Connexion/DNS insuffisant | Ne pas prétendre que le build est validé ; refaire sur une connexion disponible |
| Page blanche / import TS depuis `file://` | Fichier ouvert directement | Utiliser `npm run dev` et l'URL HTTP de Vite |
| Erreur TypeScript de chemin | Imports déplacés pendant refactorisation | Ouvrir `docs/migration.md` et comparer les chemins |
| Message « sauvegarde locale illisible » | `localStorage` corrompu ou d'ancien format | Vérifier les données fictives, puis **Restaurer** si la suppression est souhaitée |
| Erreur JSON 404 | URL de démonstration absente | Vérifier `public/data/depenses-demo.json` et utiliser le serveur Vite |
| Liste vide | Filtre ou recherche trop strict | Revenir à *Toutes les catégories* et effacer la recherche |

## Contrats et limites

Les montants restent des **entiers sûrs JavaScript** en MGA fictifs. `tsc` vérifie les annotations mais n'inspecte pas réellement les octets du JSON reçu ; `unknown` et `verifierCollection` sont nécessaires. La sauvegarde `localStorage` **n'est pas chiffrée**, est accessible aux scripts de cette origine et peut disparaître selon le navigateur. Ce projet n'est ni un logiciel bancaire ni un service financier. Aucun backend de production, authentification ni synchronisation entre appareils.

## État réel des vérifications de production

- **Réellement exécutés** : `tsc` strict 5.8.3, compilation JS Node et navigateur, tests `node --test` depuis le ZIP, fetch réseau Node vers serveur HTTP local et ses réponses 200/404, scénarios navigateur avec le **JS compilé** et **fetch/Storage simulés**. Aucun dépassement horizontal à 375 px dans le scénario de test.
- **Non exécuté ici** : `npm install`, `npm run build` Vite et rechargement navigateur par véritable URL Vite, car le registre npm n'est pas accessible et les navigations vers les URL HTTP testées sont limitées par la politique du navigateur de l'environnement. Sur l'ordinateur de l'apprenant, ces étapes doivent être vérifiées avant toute annonce de déploiement réussi.

## Documentation officielle

- <https://www.typescriptlang.org/docs/>
- <https://www.typescriptlang.org/docs/handbook/2/narrowing.html>
- <https://vite.dev/guide/>
- <https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage>
- <https://developer.mozilla.org/fr/docs/Web/API/Fetch_API>

## Qualité du niveau suivant

Ce jalon intègre `tests/qualite.test.mjs`, `docs/guide-qualite.md`, `docs/mesures/contraste.mjs` et `docs/mesures/poids.mjs`.
Le cas Budget Tana reste fictif ; les tests automatiques ne certifient pas les critères WCAG ni une sécurité globale.
