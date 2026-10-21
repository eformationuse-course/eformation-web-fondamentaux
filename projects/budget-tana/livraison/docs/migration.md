# Migration par responsabilités, sans changement de fonctionnalités

| Ancien (PDF précédent) | Nouveau chemin | Raison de l'extraction |
|---|---|---|
| `src/types.ts` | `src/domain/models.ts` | contrats indépendants de l'interface |
| `src/validation.ts` | `src/domain/validation.ts` | point de contrôle des entrées `unknown` |
| `src/calculs.ts` | `src/domain/calculs.ts` | sommes, bilans, tris métier |
| `src/etat.ts` | `src/domain/etat.ts` | source de vérité des dépenses |
| `src/api.ts` | `src/services/json.ts` | lecture HTTP sans logique DOM |
| `src/stockage.ts` | `src/storage/local.ts` | lecture/écriture des données versionnées |
| `src/ui.ts` | `src/ui/controller.ts` + `form.ts` + `vue.ts` | interactions, saisie et rendu séparés |
| `src/dom.ts` | `src/ui/dom.ts` | sélection sûre des éléments |
| `src/formatage.ts` | `src/utils/formatage.ts` | rendu MGA indépendant du métier |
| nouveau | `src/services/depenses.ts` | orchestration de l'état et de la persistance |
| nouveau | `src/utils/errors.ts` | traitement central des exceptions `unknown` |

La migration s'effectue avec les entrées fictives du PDF précédent, sans convertir des prix ni réinventer des données. Les fichiers d'origine restent disponibles dans l'archive du PDF précédent pour comparer.
