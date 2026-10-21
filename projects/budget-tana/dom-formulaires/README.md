# Budget Tana : interface DOM et formulaires interactifs

Ce site est une démonstration pédagogique **entièrement fictive** à Antananarivo, Madagascar. Il complète les modules de données et calculs du cours précédent.

## Fonctionnement

- Les 10 dépenses initiales de septembre et octobre 2026 proviennent du scénario Budget Tana précédent.
- Ajout d'une dépense par formulaire validé, suppression par bouton, filtrage par catégorie et mise à jour du total.
- Chaque saisie invalide reçoit un message sous le champ concerné et le focus clavier retourne au premier champ incorrect.
- Un bouton efface uniquement les champs, un autre restaure les dix données fictives.
- Aucun stockage local, requête réseau, backend ni transfert de données personnelles.

## Installer Python 3 et ouvrir le site (guide débutant)

1. Téléchargez Python 3 depuis **https://www.python.org/downloads/** sur un ordinateur Windows, macOS ou Linux. L'installation demande une connexion une seule fois ; Budget Tana peut ensuite fonctionner hors ligne.
2. Installez Python suivant les indications de votre système. Sous Windows, autorisez son ajout au PATH si cette option est proposée. **Fermez puis rouvrez le terminal** après l'installation.
3. Vérifiez Python : Windows `py --version` ou `python --version` ; macOS/Linux `python3 --version`. Le terminal doit afficher une version **Python 3.x**.
4. **Extrayez tout le ZIP**, ouvrez le dossier qui contient exactement `index.html`, `src/` et `data/`. Ouvrez un terminal dans ce dossier (VS Code : Terminal → Nouveau terminal). Vérifiez avec `dir index.html` sous Windows ou `ls index.html` sous macOS/Linux.
5. Démarrez le serveur **sur votre ordinateur uniquement** : Windows `py -m http.server 8000 --bind 127.0.0.1` (ou `python -m http.server 8000 --bind 127.0.0.1`) ; macOS/Linux `python3 -m http.server 8000 --bind 127.0.0.1`.
6. Ouvrez **http://127.0.0.1:8000/** dans Chrome, Edge ou Firefox. Ouvrez F12 → Console si nécessaire. Gardez le terminal ouvert et arrêtez le serveur avec **Ctrl+C**.

**Dépannage :** commande Python inconnue → vérifier l'installation et rouvrir le terminal ; erreur 404 → revenir au dossier contenant `index.html` et relancer le serveur ; « adresse déjà utilisée » → utiliser le port `8001` dans la commande **et** l'adresse ; scripts bloqués avec `file://` → utiliser l'adresse HTTP ; écran sans résultats → consulter F12 → Console et Réseau. Aucun `npm install`, compte, service payant ou donnée bancaire n'est nécessaire.

## Démarrer (serveur local)

Depuis ce dossier, dans un terminal :

```bash
python -m http.server 8000
```

Sur Windows, si `python` n'est pas reconnu, essayer `py -m http.server 8000`.
Ouvrir `http://localhost:8000/`. Pour quitter : `Ctrl+C` dans le terminal.
Le serveur local est nécessaire aux importations ES dans le navigateur ; un simple `file://` est souvent bloqué.

## Résultats vérifiables

Au démarrage : **10 dépenses**, **780 000 MGA** pour toutes les catégories ; **255 000 MGA** pour Repas. Ajouter « Cahiers novembre », 12 000, Fournitures, 2026-11-05 augmente le total global à **792 000 MGA** et le nombre à 11. Sous le filtre Repas, le compteur et le total concernent seulement les dépenses Repas. Supprimer la nouvelle dépense revient à 780 000. « Restaurer » rétablit les dix entrées fictives.

## Tester (Node.js)

```bash
node --test tests/*.test.mjs
```

Les tests navigateur Chromium ont été exécutés pendant la production par injection des fichiers, car les adresses locales sont bloquées dans cet environnement. Les utilisateurs n'ont pas besoin de Playwright pour consulter le site.

## Limites

L'application ne persiste pas les entrées ; un rechargement rétablit les dix exemples. Le formulaire `novalidate` délègue les messages à JavaScript : si JavaScript est désactivé, aucune nouvelle dépense ne peut être ajoutée. `textContent` empêche l'interprétation HTML dans les descriptions, mais ne constitue pas une stratégie complète de sécurité pour un véritable service en ligne. Les données saisies dans cette démonstration doivent rester fictives.
