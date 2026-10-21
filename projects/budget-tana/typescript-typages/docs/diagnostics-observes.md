# Diagnostiques réels TypeScript 5.8.3

Ces messages ont été obtenus par `tsc --strict --noEmit --target ES2022 FICHIER` le 21 octobre 2026 (environnement de production du support).

```text
docs/erreurs/01-texte-au-lieu-du-montant.ts(2,5): error TS2322: Type 'string' is not assignable to type 'number'.
docs/erreurs/02-categorie-inconnue.ts(3,5): error TS2322: Type '"Autres"' is not assignable to type 'Category'.
docs/erreurs/03-null-possible.ts(5,13): error TS18048: 'trouve' is possibly 'undefined'.
```

Les exemples sont volontairement invalides et exclus de `tsconfig.json`. Le projet de référence passe le contrôle sans diagnostic.
