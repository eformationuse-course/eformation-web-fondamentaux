# Portfolio pédagogique — livraison des projets

Il s'agit d'un **modèle de portfolio**, sans identité ni client réel. Il présente Kanto Services (site HTML/CSS fictif) et Budget Tana (dépenses fictives en MGA).

## Prévisualisation autonome

Copier `index.html` et `styles.css` dans un même dossier ; ouvrir `index.html` dans un navigateur. Les liens relatifs vers `kanto-services/` et `budget-tana/` ne fonctionnent que si ces deux dossiers sont fournis dans le même dossier parent, comme dans l'artefact de publication produit par la CI.

## Contrôle statique

`node --test tests/structure.test.mjs` ; Node.js 22.16+ utilisé dans la vérification de préparation.

## Limites et droit d'utilisation

Les exemples ne prouvent pas l'existence de clients, de commandes, de revenus, ni de certification. Ne jamais y ajouter des coordonnées réelles sans autorisation. Les fichiers sont publiés publiquement dans le dépôt : une licence de réutilisation n'a pas été choisie. Ne pas présumer qu'un dépôt public octroie tous les droits de réutilisation.

## Références immuables des démonstrations

Les liens GitHub des deux cartes pointent vers le jalon de référence vérifié
`274ea5dbca2c609ecab110d91b3ae74aed0cc5b5` et non vers la branche mobile
`main`. Les mises à jour ultérieures du portfolio sont consignées dans des commits
séparés. Les liens vers les démonstrations locales restent relatifs au répertoire
de publication.
