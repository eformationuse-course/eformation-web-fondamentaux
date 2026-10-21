import type { Expense, ExpenseInput } from './types.ts';
import { verifierCollection, verifierDepense } from './validation.ts';
import { calculerTotal, copierListe } from './calculs.ts';

export function creerEtat(depensesInitiales: Expense[]) {
  verifierCollection(depensesInitiales);
  let depenses: Expense[] = copierListe(depensesInitiales);
  let prochainNumero = 1;

  function toutes(): Expense[] { return copierListe(depenses); }

  function remplacer(liste: Expense[]): void {
    verifierCollection(liste);
    calculerTotal(liste);
    depenses = copierListe(liste);
    const maxId = depenses.reduce((max, item) => {
      const found = /^nouvelle-(\d+)$/.exec(item.id);
      return found ? Math.max(max, Number(found[1])) : max;
    }, 0);
    prochainNumero = Math.max(prochainNumero, maxId + 1);
  }

  function ajouter(valeurs: ExpenseInput): Expense {
    const depense: Expense = { ...valeurs, id: 'nouvelle-' + prochainNumero };
    verifierDepense(depense);
    if (depenses.some(item => item.id === depense.id)) {
      throw new RangeError('Identifiant déjà présent.');
    }
    remplacer([...depenses, depense]);
    return { ...depense };
  }

  function supprimer(id: string): boolean {
    const reste = depenses.filter(item => item.id !== id);
    if (reste.length === depenses.length) return false;
    remplacer(reste);
    return true;
  }

  function fusionner(liste: Expense[]): number {
    verifierCollection(liste);
    const existants = new Set(depenses.map(item => item.id));
    const nouveaux = liste.filter(item => !existants.has(item.id));
    remplacer([...depenses, ...nouveaux]);
    return nouveaux.length;
  }

  function restaurer(): void {
    depenses = copierListe(depensesInitiales);
    prochainNumero = 1;
  }
  return { toutes, remplacer, ajouter, supprimer, fusionner, restaurer };
}
