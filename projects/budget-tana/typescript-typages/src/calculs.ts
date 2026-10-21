import { categories, type Category, type Expense,
  type MonthlySummary } from './types.ts';
import { verifierCollection, verifierMois, verifierRevenu } from './validation.ts';

// Generic : copie superficielle typée, utile pour une liste de dépenses.
export function copierListe<T extends object>(items: readonly T[]): T[] {
  return items.map(item => ({ ...item }));
}

export function depensesDuMois(liste: Expense[], mois: string): Expense[] {
  verifierCollection(liste);
  verifierMois(mois);
  return liste.filter(item => item.date.startsWith(mois + '-'));
}

export function calculerTotal(liste: Expense[]): number {
  verifierCollection(liste);
  const total = liste.reduce((somme, item) => somme + item.montant, 0);
  if (!Number.isSafeInteger(total)) {
    throw new RangeError('Total trop grand pour un entier sûr.');
  }
  return total;
}

export function trouverDepense(liste: Expense[], id: string): Expense | undefined {
  verifierCollection(liste);
  return liste.find(item => item.id === id);
}

export function depensesParCategorie(liste: Expense[], categorie: Category): Expense[] {
  verifierCollection(liste);
  return liste.filter(item => item.categorie === categorie);
}

export function totauxParCategorie(liste: Expense[]): Record<Category, number> {
  verifierCollection(liste);
  const result = Object.fromEntries(
    categories.map(c => [c, 0])
  ) as Record<Category, number>;
  for (const item of liste) {
    const prochain = result[item.categorie] + item.montant;
    if (!Number.isSafeInteger(prochain)) {
      throw new RangeError('Total de catégorie trop grand.');
    }
    result[item.categorie] = prochain;
  }
  return result;
}

export function trierParMontantDecroissant(liste: Expense[]): Expense[] {
  verifierCollection(liste);
  return [...liste].sort((a, b) =>
    b.montant - a.montant || a.id.localeCompare(b.id));
}

export function trierParDate(liste: Expense[]): Expense[] {
  verifierCollection(liste);
  return [...liste].sort((a, b) => a.date.localeCompare(b.date));
}

export function descriptionsCourtes(
  liste: Expense[]
): Pick<Expense, 'libelle' | 'montant'>[] {
  verifierCollection(liste);
  return liste.map(({ libelle, montant }) => ({ libelle, montant }));
}

export function bilanMensuel(
  liste: Expense[], mois: string, revenu: number
): MonthlySummary {
  verifierRevenu(revenu);
  const choix = depensesDuMois(liste, mois);
  const total = calculerTotal(choix);
  return { mois, revenu, total, reste: revenu - total, nombre: choix.length };
}
