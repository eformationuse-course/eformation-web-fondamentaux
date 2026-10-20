# Budget Tana : interface DOM et formulaires interactifs

Ce site est une démonstration pédagogique **entièrement fictive** à Antananarivo, Madagascar. Il complète les modules de données et calculs du cours précédent.

## Fonctionnement

- Les 10 dépenses initiales de septembre et octobre 2026 proviennent du scénario Budget Tana précédent.
- Ajout d'une dépense par formulaire validé, suppression par bouton, filtrage par catégorie et mise à jour du total.
- Chaque saisie invalide reçoit un message sous le champ concerné et le focus clavier retourne au premier champ incorrect.
- Un bouton efface uniquement les champs, un autre restaure les dix données fictives.
- Aucun stockage local, requête réseau, backend ni transfert de données personnelles.

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
