# Kanto Services — publier avec GitHub Pages

> Guide de publication. Ne pas annoncer le site en ligne sans vérifier l'exécution du déploiement et l'ouverture réelle de la page.

## Pourquoi utiliser un workflow ?

Le site pédagogique est dans `projects/kanto-services/` tandis que le dépôt contient aussi la documentation et pourra accueillir d'autres projets. Avec l'option « Deploy from a branch », GitHub Pages publie la racine ou `/docs` d'une branche. Le workflow `.github/workflows/publish-kanto.yml` place le dossier Kanto Services à la racine de l'artifact de publication, où se trouve directement `index.html`.

## Configuration à effectuer par le propriétaire du dépôt

1. Ouvrir `https://github.com/eformationuse-course/eformation-web-fondamentaux`.
2. Aller dans **Settings → Pages**. Des droits d'administration ou de maintenance sont nécessaires.
3. Dans **Build and deployment → Source**, sélectionner **GitHub Actions**.
4. Dans l'onglet **Actions**, ouvrir « Publier Kanto Services sur GitHub Pages ». Si nécessaire, cliquer **Run workflow** sur la branche `main`.
5. Consulter l'exécution : Checkout, Configurer GitHub Pages, Charger les fichiers et Déployer doivent se terminer avec succès.
6. Dans **Settings → Pages**, cliquer **Visit site** et noter l'adresse *réellement affichée*. Ne pas déduire une URL de la seule présence du fichier de workflow.
7. Ouvrir l'adresse dans un navigateur non propriétaire, vérifier le titre, les liens, l'image `assets/images/atelier.svg` et les trois CSS. Inspecter l'onglet **Network** des DevTools en cas de doute.
8. Tester le site publié au clavier, sur téléphone et ordinateur, puis relever le SHA du commit réellement déployé.

## Dépannage

- **Erreur 404** : vérifier que Pages a été configuré, que le déploiement est réussi, puis attendre la propagation ; contrôler la racine de l'artifact.
- **Site sans styles** : vérifier les liens `css/base.css`, `css/layout.css`, `css/components.css` ; l'onglet Network permet de voir les statuts HTTP.
- **Illustration absente** : vérifier `assets/images/atelier.svg`, majuscules et minuscules comprises.
- **Workflow échoué** : lire les journaux Actions et vérifier la source Pages, l'autorisation des workflows, le déploiement et les protections de l'environnement `github-pages`.
- **Ancien contenu** : vérifier le dernier SHA déployé, rafraîchir, et contrôler l'éventuel cache.

## Sécurité et limites

Ce site est **statique et public** après mise en ligne ; GitHub Pages ne traite pas les formulaires côté serveur. Aucun contact réel n'est effectué, aucune base de données n'est fournie, aucun secret ne doit être poussé sur le dépôt. Toute personnalisation doit utiliser des informations autorisées.

## Références officielles

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
