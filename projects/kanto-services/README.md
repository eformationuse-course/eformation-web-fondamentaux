# Kanto Services — HTML et CSS

**Entreprise fictive à Antananarivo.** Aucun service réel n'est proposé.

## Objectif de cette étape

Transformer le HTML sémantique du premier module en interface visuelle structurée : navigation, bloc d'accueil, cartes de services, tableau, formulaire, et pied de page. Il n'y a ni JavaScript ni backend.

## Arborescence

```text
kanto-services/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components.css
└── assets/
    └── images/
        └── atelier.svg
```

- `base.css` : variables de couleurs, typographie, modèle de boîte et focus.
- `layout.css` : placement des sections, Flexbox et Grid.
- `components.css` : navigation, lien à l'apparence de bouton, cartes, tableau, champs et légendes.
- `index.html` : contenu et balises HTML conservant leurs fonctions sémantiques.

## Ouvrir et vérifier

1. Conserver la hiérarchie du dossier ci-dessus.
2. Ouvrir `index.html` dans un navigateur récent. Aucun serveur ni installation n'est nécessaire pour cette étape.
3. Vérifier que l'accueil présente deux colonnes sur un écran suffisamment large, que trois cartes sont alignées, que les liens mènent aux bonnes sections et que le formulaire comporte quatre champs.
4. Naviguer au clavier : `Tab` affiche un contour de focus et rend visible le lien « Aller au contenu principal ».
5. Réduire la fenêtre : les blocs peuvent se réorganiser, sans supposer que cette première adaptation remplace le cours complet de responsive design.
6. Si aucun style n'apparaît, contrôler exactement `css/base.css`, `css/layout.css`, `css/components.css` et les trois balises `link` dans `head`.

## Limites

- Le formulaire n'envoie **aucune** donnée, ne l'enregistre pas et ne contient pas de bouton d'envoi.
- Les états `required` et `type="email"` sont des attributs HTML ; aucune validation au clic n'est démontrée ici.
- Le lien « Découvrir les services » est une navigation interne stylisée **comme un bouton**, et non une action JavaScript.
- L'image est une illustration SVG originale, pas une photographie.
- Ce jalon n'inclut pas de framework CSS, ni de JavaScript, ni de bibliothèque externe, ni de système de publication en ligne.

## Documentation

- [MDN : CSS](https://developer.mozilla.org/fr/docs/Web/CSS)
- [MDN : Flexbox](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_flexible_box_layout)
- [MDN : Grid](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_grid_layout)
- [MDN : Cascade](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_cascade/Cascade)
