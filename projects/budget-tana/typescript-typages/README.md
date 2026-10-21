# Budget Tana — TypeScript, typage et diagnostics

Ce jalon fait suite à l'outillage Vite du cours précédent. L'archive `Budget_Tana_TypeScript_sources.zip` contient **28 fichiers source complets**, notamment tous les modules `src/*.ts`, le formulaire, le CSS, les données JSON fictives, les configurations TypeScript, les tests Node et les trois fichiers volontairement erronés du compilateur.

**Démarrage :** télécharger l'archive dans ce dossier, l'extraire complètement, ouvrir `budget-tana-typescript/`, puis `npm install`, `npm run typecheck`, `npm test` et `npm run dev` (voir le README détaillé **à l'intérieur du ZIP**). Node.js 20.19+ ou 22.12+ est requis par Vite 8.

**Tests réellement vérifiés :** TypeScript 5.8.3 compile sans erreur en mode strict, 7 groupes de tests positifs, TS2322 et TS18048 reproduits sur les exemples erronés, opérations DOM vérifiées avec le JavaScript compilé inséré dans Chromium. Tous les montants sont **fictifs** : total initial 780 000 MGA ; 792 000 MGA après ajout fictif de 12 000 MGA.

**Réserve :** l'environnement de production bloque l'accès au registre npm (`EAI_AGAIN`) ; le build Vite et le lancement via serveur local n'y ont pas été vérifiés. La validation de l'interface Vite depuis un ordinateur connecté reste à réaliser. Aucune donnée personnelle ni bancaire n'est nécessaire.
