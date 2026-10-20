# Kanto Services — site vitrine responsive

Kanto Services est une **entreprise entièrement fictive à Antananarivo**, utilisée pour apprendre HTML, CSS, le responsive design, Git et la publication statique. Aucune offre commerciale ni contact réel.

## Fichiers

```text
kanto-services/
├── index.html
├── css/
│   ├── base.css        # typographie, variables, focus, mouvement réduit
│   ├── layout.css      # mobile-first, Flexbox, Grid, media queries
│   └── components.css  # navigation, cartes, tableau, formulaire
└── assets/
    └── images/
        └── atelier.svg # illustration originale légère
```

## Exécuter le site localement

Aucune installation n'est requise : ouvrir `index.html` dans un navigateur actuel. Les liens sont relatifs, l'image et les feuilles CSS sont locales. On peut aussi utiliser un serveur local facultatif :

```bash
cd projects/kanto-services
python -m http.server 8000
```

Sous Windows, si `python` n'est pas reconnu, essayer `py -m http.server 8000`. Visiter ensuite `http://localhost:8000/`, puis arrêter le serveur avec `Ctrl+C`. Ce serveur ne permet **pas** de recevoir des formulaires.

## Résultats attendus

- 320–600 px : navigation sur plusieurs lignes, accueil et services en une colonne ; tableau défilant *dans son conteneur*.
- À partir de 672 px (`42rem` à racine 16px par défaut) : deux colonnes de cartes de services.
- À partir de 960 px (`60rem` à racine 16px par défaut) : accueil en deux colonnes, trois cartes, formulaire sur la droite.
- Les seuils effectifs en CSS `rem` dépendent des réglages de taille de police racine et du navigateur.
- Les commandes et résultats de test locaux sont détaillés dans le PDF de formation. Test clavier : première tabulation révèle « Aller au contenu principal ».

## Publication GitHub Pages

Le dépôt racine contient plusieurs projets. `docs/publication-github-pages.md` décrit un **workflow GitHub Actions** qui publie uniquement `projects/kanto-services` dans la racine du site Pages. Nécessite de choisir **GitHub Actions** dans `Settings → Pages → Build and deployment → Source` et de contrôler le déploiement. **La présence d'un fichier YAML n'est pas la preuve d'un site publié.**

La publication rend le site publiquement consultable. Ne jamais placer de données personnelles, mots de passe ou secrets dans les fichiers envoyés.

## Limites

Le formulaire sans bouton d'envoi sert à l'apprentissage des champs HTML et de leur mise en forme ; il n'envoie ni ne conserve de messages. Le site n'utilise ni JavaScript, ni serveur applicatif, ni hébergement de données. La qualité de connexion peut affecter le temps de consultation du site distant, mais les fichiers locaux fonctionnent hors ligne.

## Ressources

- [MDN — responsive design](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN — media queries](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [GitHub — configurer la publication Pages](https://docs.github.com/fr/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
