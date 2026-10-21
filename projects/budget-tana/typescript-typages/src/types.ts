// Types TypeScript : effacés lors de la compilation vers JavaScript.
export const categories = [
  'Logement', 'Repas', 'Transport', 'Internet', 'Fournitures'
] as const;

export type Category = (typeof categories)[number];

export interface Expense {
  id: string;
  date: string;           // AAAA-MM-JJ, vérifié à l'exécution
  categorie: Category;
  libelle: string;
  montant: number;        // entier MGA, vérifié à l'exécution
  note?: string;
}

// L'identifiant est créé par l'état, pas fourni par le formulaire.
export type ExpenseInput = Omit<Expense, 'id'>;
export type MonthlySummary = {
  mois: string;
  revenu: number;
  total: number;
  reste: number;
  nombre: number;
};

// Union discriminée : on sait pourquoi une lecture locale a échoué.
export type StorageResult =
  | { statut: 'ok'; liste: Expense[] }
  | { statut: 'absent' | 'indisponible' | 'invalide'; liste: null };

export type DemoEnvelope = {
  version: 1;
  depenses: Expense[];
};
