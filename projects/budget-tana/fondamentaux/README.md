# Budget Tana — fondamentaux JavaScript

## Projet fictif

Ce projet se déroule à Antananarivo. Tous les montants sont **fictifs** et exprimés en ariary (MGA), sans donnée réelle, paiement ou promesse d'épargne. Ce jalon est un **calculateur en console**, sans interface de saisie, sans stockage ni serveur.

## Démarrer sans installation

1. Ouvrir `index.html` dans Chrome, Edge ou Firefox.
2. Ouvrir Outils de développement → Console (F12 ou Ctrl+Maj+J sous Windows selon navigateur ; macOS Cmd+Option+J dans Chrome).
3. Observer les sorties de `scripts/04-bilan-budget.js` : **405000 MGA** de dépenses, **45000 MGA** restants, et un cumul hypothétique sur 3 mois de **135000 MGA**.
4. Pour étudier chaque étape, changer temporairement la valeur `src` de la dernière balise `<script>` vers `scripts/01-premiers-pas.js`, `02-fonctions.js` ou `03-decisions-boucles.js`, puis recharger.

Chaque script est **autonome** : ne pas charger les quatre simultanément dans la même page car certains noms de variables sont réutilisés.

## Option terminal Node.js

```bash
node scripts/01-premiers-pas.js
node scripts/02-fonctions.js
node scripts/03-decisions-boucles.js
node scripts/04-bilan-budget.js
```

## Données du scénario

Revenu : 450000 MGA. Dépenses : logement 180000, repas 135000, transport 45000, Internet 25000, fournitures 20000 MGA. Total dépenses 405000 MGA ; reste 45000 MGA ; projection strictement fictive de 135000 MGA après trois mois identiques.

## Limites

Le programme ne recueille ni ne transmet aucune information. `convertirMontant` ne valide que des chaînes représentant des entiers sûrs positifs ou zéro, sans séparateurs de milliers ; il refuse les valeurs vides, négatives ou décimales. La projection est une démonstration de boucle, pas une prévision financière. Aucun objet, tableau, module, DOM interactif ou stockage n'est enseigné à ce jalon.

## Documentation

- https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Strict_equality
- https://developer.mozilla.org/fr/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools
