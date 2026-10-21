import { categories, type Category, type Expense } from './types.ts';

export function estCategorie(valeur: unknown): valeur is Category {
  return typeof valeur === 'string' &&
    (categories as readonly string[]).includes(valeur);
}

export function dateEstValide(date: unknown): date is string {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const objet = new Date(date + 'T00:00:00Z');
  return !Number.isNaN(objet.getTime()) &&
    objet.toISOString().slice(0, 10) === date;
}

// Entrée réellement inconnue : jamais un cast `as Expense` sans contrôle.
export function verifierDepense(valeur: unknown): asserts valeur is Expense {
  if (valeur === null || typeof valeur !== 'object' || Array.isArray(valeur)) {
    throw new TypeError('Une dépense doit être un objet.');
  }
  const item = valeur as Record<string, unknown>;
  if (typeof item.id !== 'string' || item.id.trim() === '') {
    throw new TypeError('Identifiant de dépense manquant.');
  }
  if (!dateEstValide(item.date)) {
    throw new RangeError('Date invalide : utiliser AAAA-MM-JJ.');
  }
  if (!estCategorie(item.categorie)) {
    throw new RangeError('Catégorie inconnue.');
  }
  if (typeof item.libelle !== 'string' || item.libelle.trim() === '') {
    throw new TypeError('Libellé manquant.');
  }
  if (!Number.isSafeInteger(item.montant) ||
      typeof item.montant !== 'number' || item.montant <= 0) {
    throw new RangeError('Le montant doit être un entier positif en MGA.');
  }
  if (item.note !== undefined && typeof item.note !== 'string') {
    throw new TypeError('Une note doit être du texte.');
  }
}

export function verifierCollection(valeur: unknown): asserts valeur is Expense[] {
  if (!Array.isArray(valeur)) {
    throw new TypeError('Les dépenses doivent former un tableau.');
  }
  const ids = new Set<string>();
  for (const item of valeur as unknown[]) {
    verifierDepense(item);
    if (ids.has(item.id)) {
      throw new RangeError('Identifiant présent deux fois : ' + item.id);
    }
    ids.add(item.id);
  }
}

export function verifierMois(mois: unknown): asserts mois is string {
  if (typeof mois !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mois)) {
    throw new RangeError('Mois invalide : utiliser AAAA-MM.');
  }
}

export function verifierRevenu(revenu: unknown): asserts revenu is number {
  if (typeof revenu !== 'number' || !Number.isSafeInteger(revenu) || revenu < 0) {
    throw new RangeError('Le revenu doit être un entier positif ou nul.');
  }
}
