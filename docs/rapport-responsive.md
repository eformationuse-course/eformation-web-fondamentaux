# Contrôles techniques — Kanto Services responsive

**Méthode :** Chromium headless. Le navigateur d'exécution bloque les URL `file://` et `localhost` ; le rendu a donc été testé par injection de l'HTML réel, des trois CSS réels et de l'illustration SVG locale dans une page de test. Ce contrôle porte sur la mise en page et les comportements DOM ; il ne certifie pas le chargement des assets depuis un hébergement externe.

| Largeur de viewport | Colonnes des services | Débordement document | Image |
|---|---:|---|---|
| 320 px | 1 | absent | chargée |
| 375 px | 1 | absent | chargée |
| 600 px | 1 | absent | chargée |
| 768 px | 2 | absent | chargée |
| 1024 px | 3 | absent | chargée |
| 1440 px | 3 | absent | chargée |

Autres vérifications locales réussies : 4 liens de navigation ; 3 cartes ; une seule balise `h1` ; lien d'évitement visible au clavier ; lien Contact atteignant `#contact` ; quatre champs du formulaire ; absence de bouton d'envoi ; `prefers-reduced-motion: reduce` entraîne `scroll-behavior: auto`. À 320 et 375 px, le tableau défile dans son propre conteneur.

**À vérifier lors de la publication :** réussite de GitHub Actions, URL Pages, code HTTP des CSS/SVG, HTTPS, affichage dans un navigateur externe. Ne pas confondre ces contrôles locaux avec une publication vérifiée.
