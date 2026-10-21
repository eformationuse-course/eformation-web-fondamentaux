# Preuves et limites du jalon Vite / Git

**Faits conservés du cours précédent.** Dix dépenses fictives, 780 000 MGA ; fichier JSON de trois dépenses, +84 000 MGA ; au total 13 et 864 000 MGA, filtre Repas 309 000 MGA. Pas de compte ni de backend.

**Modifications d'organisation.** Déplacement de `data/depenses.js` vers `src/data/depenses.js`, modification de deux imports dans les tests et d'un import dans l'UI ; déplacement de `css/styles.css` vers `src/styles.css` ; JSON statique vers `public/data/` ; liens HTML adaptés pour Vite. Les fonctions métier ont été préservées.

**Contrôles exécutés localement :** `npm run test` = 16/16 réussis ; `node --check` sur les scripts = réussi ; intégrité et montants JSON = réussis ; tests de conflit Git `CONFLICT` → résolution → merge = réussis. Les sources et ressources sont réellement présentes. Ces contrôles ne certifient **pas** le fonctionnement du bundler Vite.

**Contrôles non réalisés dans cet environnement :** téléchargement des paquets npm (`EAI_AGAIN`), `npm run build`, serveur Vite réellement accessible dans un navigateur, `npm run lint`, `npm run format:check`, génération et vérification d'un `package-lock.json` complet. Ils restent à confirmer sur un poste connecté. Ne jamais annoncer `dist/` produit ou la publication web terminée sans preuve.
