# Contrôle qualité de Budget Tana — jalon cours

Projet fictif ; les 10 dépenses initiales = 780 000 MGA. Les trois ajouts JSON = 84 000 MGA.
Ce projet reprend le jalon TypeScript architecture et ajoute un **focus visible sur le conteneur principal** ainsi que des preuves de qualité automatisées. Il ne collecte aucune donnée privée.

## Préparer

Node.js >=22.12 ou >=20.19 ; connexion nécessaire à la première installation npm.
Ouvrir le dossier contenant `package.json`, puis :

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

Les tests utilisent `node:test`, inclus dans Node.js. Pas de bibliothèque de tests supplémentaire.
Le script `npm test` compile d'abord les modules TypeScript pour les anciens tests du domaine.

## Observer les corrections

1. Avec la touche Tab, déplacer le focus jusqu'au lien « Aller au contenu » ; Entrée conduit à `<main id="contenu">`. Le conteneur peut recevoir une bordure visible grâce à `main:focus-visible`.
2. Laisser le libellé vide et soumettre. Le texte « Saisissez une description. » apparaît près du champ et le focus y revient ; `aria-invalid=true` est appliqué.
3. Taper les caractères littéraux `<img src=x onerror=alert(1)>` comme description fictive (si le champ respecte 80 caractères). Ils doivent apparaître en **texte**, sans créer d'image ni exécuter un attribut. Ce contrôle ponctuel ne remplace pas un audit de sécurité.
4. Depuis un état initial, retrouver 10 dépenses / 780 000 MGA ; après import JSON, 13 / 864 000 MGA ; un second import n'ajoute rien.
5. Dans DevTools (F12), onglet Network/Réseau, choisir un profil réseau lent, vider le cache puis recharger. Noter les tailles *transferred* et la chronologie ; reconnecter pour refaire la comparaison. Aucune durée absolue n'est promise.

## Mesures locales reproductibles

```sh
node docs/mesures/contraste.mjs
node docs/mesures/poids.mjs
node --test tests/qualite.test.mjs
```

Contraste de l'ancien exemple intentionnellement incorrect `#9fa8b1` sur blanc = 2,41:1 ; contraste actuel `#50677a` sur blanc = 5,90:1. Les calculs sont contrôlés par le script. Ce contrôle n'atteste pas l'accessibilité WCAG de toute l'application.

Les tailles brutes / gzip sont des tailles sur disque et une *simulation gzip locale*, pas des temps réseau. LCP/INP/CLS exigent des mesures dans un navigateur ; consulter Chrome DevTools/Lighthouse et distinguer laboratoire et utilisateurs réels.

## Méthode de diagnostic

- Lire l'échec du test (nom, attendu, réel), identifier le module et corriger la cause, puis relancer.
- Une assertion de chaîne sur le HTML ne remplace pas un test de lecteur d'écran ou un parcours clavier.
- `textContent` protège ce chemin d'insertion de texte précis contre l'interprétation HTML ; cela ne rend ni le stockage local ni toute l'application invulnérables.
- Ne stocker ni mot de passe ni information financière réelle dans `localStorage`.

## Sources

- WCAG 2.2 : https://www.w3.org/TR/WCAG22/
- WAI clavier : https://www.w3.org/WAI/WCAG22/Understanding/keyboard
- MDN textContent : https://developer.mozilla.org/fr/docs/Web/API/Node/textContent
- Web Vitals : https://web.dev/articles/vitals
- OWASP XSS prevention : https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
