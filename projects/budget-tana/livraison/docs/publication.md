# Livraison statique de Budget Tana

Jalon d'architecture et de qualité conservé. Démonstration fictive à Antananarivo : 10 dépenses / 780 000 MGA ; import de 3 dépenses / +84 000 MGA ; 13 / 864 000 MGA.

## Pourquoi ces deux modifications ?

- `vite.config.ts` utilise `base: './'` : les ressources assemblées sont référencées relativement au document HTML dans `dist/`.
- `src/ui/controller.ts` construit les URLs JSON avec `new URL('data/depenses-demo.json', document.baseURI).href`. Contrairement à `/data/depenses-demo.json`, le résultat tient compte d'un éventuel sous-dossier, par exemple `/budget-tana/`.

## Installation et vérification

Dans ce dossier, avec Node >=20.19 ou >=22.12, lancer :

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

Le build crée `dist/index.html`, `dist/assets/` et `dist/data/depenses-demo.json`. Pour vérifier un sous-dossier de production, placer les fichiers de `dist/` sous `site/budget-tana/` et servir le dossier `site/` sur un serveur HTTP local.

Aucun vrai paiement, API distante ni donnée personnelle n'est impliqué. Les tests automatisés ne prouvent pas le comportement de tous les navigateurs ou l'accessibilité complète. Des vérifications manuelles restent nécessaires.
