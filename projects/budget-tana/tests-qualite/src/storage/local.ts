import type { Expense, StorageResult } from '../domain/models.ts';
import { verifierCollection } from '../domain/validation.ts';
import { calculerTotal } from '../domain/calculs.ts';

export const CLE_STOCKAGE = 'budget-tana-demo-v1';

export function chargerStockage(
  stockage: Storage | null, cle: string = CLE_STOCKAGE
): StorageResult {
  if (!stockage) return { statut: 'indisponible', liste: null };
  try {
    const texte = stockage.getItem(cle);
    if (texte === null) return { statut: 'absent', liste: null };
    const donnees: unknown = JSON.parse(texte);
    if (donnees === null || typeof donnees !== 'object' ||
        !('version' in donnees) || donnees.version !== 1 ||
        !('depenses' in donnees)) {
      return { statut: 'invalide', liste: null };
    }
    const liste: unknown = donnees.depenses;
    verifierCollection(liste);
    calculerTotal(liste);
    return { statut: 'ok', liste: liste.map(item => ({ ...item })) };
  } catch {
    return { statut: 'invalide', liste: null };
  }
}

export function sauverStockage(
  stockage: Storage | null, liste: Expense[], cle: string = CLE_STOCKAGE
): boolean {
  if (!stockage) return false;
  try {
    verifierCollection(liste);
    calculerTotal(liste);
    stockage.setItem(cle, JSON.stringify({ version: 1, depenses: liste }));
    return true;
  } catch { return false; }
}

export function effacerStockage(
  stockage: Storage | null, cle: string = CLE_STOCKAGE
): boolean {
  if (!stockage) return false;
  try { stockage.removeItem(cle); return true; }
  catch { return false; }
}
