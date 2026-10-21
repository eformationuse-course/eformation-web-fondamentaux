import { verifierCollection } from './validation.js';
import { calculerTotal } from './calculs.js';

export const CLE_STOCKAGE = 'budget-tana-demo-v1';

// On n'enregistre que la liste, pas les champs de formulaire ou les secrets.
export function chargerStockage(storage, cle = CLE_STOCKAGE) {
  if (!storage) return { statut: 'indisponible', liste: null };
  try {
    const texte = storage.getItem(cle);
    if (texte === null) return { statut: 'absent', liste: null };
    const enveloppe = JSON.parse(texte);
    if (!enveloppe || enveloppe.version !== 1 || !Array.isArray(enveloppe.depenses)) {
      return { statut: 'invalide', liste: null };
    }
    verifierCollection(enveloppe.depenses);
    calculerTotal(enveloppe.depenses);
    return {
      statut: 'ok',
      liste: enveloppe.depenses.map((item) => ({ ...item })),
    };
  } catch {
    // Syntaxe JSON cassée, données malformées, accès bloqué, etc.
    return { statut: 'invalide', liste: null };
  }
}

export function sauverStockage(storage, liste, cle = CLE_STOCKAGE) {
  if (!storage) return false;
  try {
    verifierCollection(liste);
    calculerTotal(liste);
    storage.setItem(cle, JSON.stringify({ version: 1, depenses: liste }));
    return true;
  } catch {
    // Par exemple SecurityError ou QuotaExceededError.
    return false;
  }
}

export function effacerStockage(storage, cle = CLE_STOCKAGE) {
  if (!storage) return false;
  try {
    storage.removeItem(cle);
    return true;
  } catch {
    return false;
  }
}
