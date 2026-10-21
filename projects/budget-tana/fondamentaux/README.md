# Budget Tana — fondamentaux JavaScript

## Projet fictif

Ce projet de formation se déroule à Antananarivo, Madagascar. Tous les montants sont **fictifs** et exprimés en ariary (MGA), sans donnée réelle, paiement ou promesse d'épargne. Ce jalon est un **calculateur en console**, sans interface de saisie, sans stockage ni serveur : ces fonctionnalités sont étudiées plus tard.

## Démarrer sans installation

1. Ouvrir `index.html` dans Chrome, Edge ou Firefox.
2. Ouvrir Outils de développement → Console (`F12` ou `Ctrl+Maj+J` sous Windows selon navigateur ; macOS `Cmd+Option+J` dans Chrome).
3. Observer les sorties du fichier `scripts/04-bilan-budget.js` : **405000 MGA** de dépenses, **45000 MGA** restants, et une simulation de cumul sur 3 mois **135000 MGA** (hypothèse strictement constante).
4. Pour découvrir chaque chapitre, saisir une par une les commandes du code correspondant dans la console ou remplacer temporairement le chemin `scripts/04-bilan-budget.js` par `scripts/01-premiers-pas.js`, `scripts/02-fonctions.js` ou `scripts/03-decisions-boucles.js` dans la dernière balise `<script src="...">` de `index.html`, enregistrer, puis recharger la page.

**Remarque :** chaque fichier est autonome et doit être exécuté seul ; éviter d'ajouter tous les fichiers `<script>` sur la même page. Certains exemples utilisent les mêmes noms globaux.

## Option terminal Node.js

Si Node.js est déjà installé, chaque fichier peut être exécuté sans navigateur :

```bash
node scripts/01-premiers-pas.js
node scripts/02-fonctions.js
node scripts/03-decisions-boucles.js
node scripts/04-bilan-budget.js
```

Dans le terminal à la racine du dépôt : `node projects/budget-tana/fondamentaux/scripts/04-bilan-budget.js`.

## Scénario et sortie finale

| Poste | Montant fictif (MGA) |
|---|---:|
| Revenu | 450000 |
| Logement | 180000 |
| Repas | 135000 |
| Transport | 45000 |
| Internet | 25000 |
| Fournitures | 20000 |
| Dépenses totales | 405000 |
| Reste | 45000 |
| Cumul hypothétique après 3 mois identiques | 135000 |

## Sécurité et limites

- Rien n'est envoyé sur Internet ni sauvegardé ; la console est un outil local de lecture.
- `convertirMontant` valide uniquement un texte simplifié représentant un nombre entier non négatif. Pas de saisie humaine réelle, devise internationale, décimales ni formatage de monnaie ; ne pas utiliser pour une vraie application financière.
- JavaScript utilise des nombres à virgule flottante et cette démonstration simplifiée rejette les montants au-delà des entiers sûrs ; elle n'est pas destinée au traitement financier professionnel.
- La projection ne prédit pas l'avenir : elle démontre simplement une boucle avec un même reste répété.

## Sources officielles

- https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Strict_equality
- https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
- https://developer.mozilla.org/fr/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools
