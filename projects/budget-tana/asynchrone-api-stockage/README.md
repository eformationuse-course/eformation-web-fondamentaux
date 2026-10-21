# Budget Tana — asynchronisme, API locale et sauvegarde navigateur

**Projet pédagogique fictif à Antananarivo (Madagascar)**, prolongeant les modules « collections » et « DOM ». Les chiffres ne sont pas des dépenses ou revenus réels.

## Objectif vérifiable

- Démarrer avec **10 dépenses, 780 000 MGA** (septembre/octobre 2026).
- Charger **3 dépenses supplémentaires fictives** depuis `data/depenses-demo.json` : **84 000 MGA**, soit **13 dépenses et 864 000 MGA**.
- Recharger la page : dans le même navigateur et à la même origine, retrouver les 13 dépenses par `localStorage`.
- Charger une deuxième fois : **0 nouvelle dépense** grâce aux identifiants uniques ; aucune double addition.
- Filtrer « Repas » : après import JSON, **3 dépenses, 309 000 MGA**.
- Voir volontairement **HTTP 404** en utilisant le bouton « Illustrer une erreur HTTP 404 » : la liste reste intacte.
- Chercher, trier, ajouter, supprimer, puis restaurer les dix dépenses initiales.

## Fichiers

```text
asynchrone-api-stockage/
├── index.html
├── css/styles.css
├── data/depenses.js
├── data/depenses-demo.json
├── src/validation.js
├── src/calculs.js
├── src/formatage.js
├── src/etat.js
├── src/stockage.js
├── src/api.js
├── src/ui.js
├── src/main.js
├── tests/asynchrone.test.mjs
├── tests/etat.test.mjs
└── package.json
```

- `data/depenses.js` : dix données héritées, fictives ; `depenses-demo.json` ajoute trois exemples de novembre.
- `src/api.js` : `fetch()` + `response.ok` + `response.json()` + validation du schéma ; aucune API distante ni clé.
- `src/stockage.js` : sérialisation JSON versionnée et gestion d'erreurs de stockage ; `localStorage` non chiffré.
- `src/etat.js` : état mémoire, contrôle des doublons et total sécurisé, import idempotent.
- `src/ui.js` : DOM, formulaire, chargement, états et messages accessibles.
- `tests/*.test.mjs` : tests techniques de l'auteur, non des questionnaires destinés au lecteur.

## Installer Python 3 et ouvrir le site (guide débutant)

1. Téléchargez Python 3 depuis **https://www.python.org/downloads/** sur un ordinateur Windows, macOS ou Linux. L'installation demande une connexion une seule fois ; Budget Tana peut ensuite fonctionner hors ligne.
2. Installez Python suivant les indications de votre système. Sous Windows, autorisez son ajout au PATH si cette option est proposée. **Fermez puis rouvrez le terminal** après l'installation.
3. Vérifiez Python : Windows `py --version` ou `python --version` ; macOS/Linux `python3 --version`. Le terminal doit afficher une version **Python 3.x**.
4. **Extrayez tout le ZIP**, ouvrez le dossier qui contient exactement `index.html`, `src/` et `data/`. Ouvrez un terminal dans ce dossier (VS Code : Terminal → Nouveau terminal). Vérifiez avec `dir index.html` sous Windows ou `ls index.html` sous macOS/Linux.
5. Démarrez le serveur **sur votre ordinateur uniquement** : Windows `py -m http.server 8000 --bind 127.0.0.1` (ou `python -m ...`) ; macOS/Linux `python3 -m http.server 8000 --bind 127.0.0.1`.
6. Ouvrez **http://127.0.0.1:8000/** dans Chrome, Edge ou Firefox. Ouvrez F12 → Console si nécessaire. Gardez le terminal ouvert et arrêtez le serveur avec **Ctrl+C**.

**Dépannage :** commande Python inconnue → vérifier l'installation et rouvrir le terminal ; erreur 404 → revenir au dossier contenant `index.html` et relancer le serveur ; « adresse déjà utilisée » → utiliser le port `8001` dans la commande **et** l'adresse ; scripts bloqués avec `file://` → utiliser l'adresse HTTP ; écran sans résultats → consulter F12 → Console et Réseau. Aucun `npm install`, compte, service payant ou donnée bancaire n'est nécessaire.

## Démarrage **obligatoire par serveur local**

Avec Python disponible, depuis ce répertoire :

```sh
python -m http.server 8000
```

Windows : `py -m http.server 8000` si `python` n'est pas reconnu. Ouvrir dans Chrome, Firefox ou Edge `http://localhost:8000/`, puis DevTools / Console et Réseau (F12). Arrêter le serveur avec `Ctrl+C`.

Il faut exécuter le serveur depuis **ce dossier**, pas son parent, pour que `data/depenses-demo.json` et `src/*.js` soient accessibles. Un double-clic `file://` ne reproduit pas fidèlement les restrictions des imports ES et du stockage web.

**Sans connexion Internet :** le serveur local et les fichiers déjà téléchargés peuvent fonctionner hors ligne ; le bouton JSON charge un fichier du **même serveur local**, pas une API distante. Le scénario « erreur 404 » dépend de l'absence intentionnelle de `data/fichier-absent.json`.

## Vérifications auteur

Node.js 22 recommandé (pas de dépendance externe) :

```sh
node --test tests/*.test.mjs
```

Le rendu et les événements ont aussi été testés dans Chromium en injectant les modules source dans une page de test, avec un `fetch` et un `localStorage` simulés. Le navigateur de cet environnement bloque les navigations directes vers localhost ; un test réel de chargement HTTP par Chromium depuis localhost reste à effectuer sur un poste classique. Une requête HTTP 200 pour le JSON et HTTP 404 pour le fichier manquant ont été vérifiées séparément par le serveur local.

## Limites de protection des données

Utiliser **exclusivement des données fictives** : les valeurs restent dans la mémoire du navigateur et, en cas de sauvegarde réussie, dans son `localStorage`. Ce stockage n'est **ni chiffré ni sécurisé**, n'assure ni synchronisation entre appareils ni sauvegarde durable ; il peut être effacé ou inaccessible. Un script autorisé de la même origine peut en lire le contenu. Pas d'envoi serveur, pas d'authentification, pas de base de données, pas de vraie API distante.

En cas de sauvegarde corrompue, l'application affiche les données fictives sans écraser le contenu illisible ; « Restaurer » supprime explicitement l'entrée locale de référence et redémarre avec dix dépenses. Les ajouts en cas d'échec de stockage restent en mémoire seulement.

## Sources officielles

- MDN : `fetch` — https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
- MDN : `localStorage` — https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
- MDN : JSON — https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON
- MDN : async/await — https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function
- Python — https://docs.python.org/3/library/http.server.html
