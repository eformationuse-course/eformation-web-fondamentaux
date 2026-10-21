// Contrôles utiles avant de faire des calculs sur une collection.
export const categories = [
  'Logement',
  'Repas',
  'Transport',
  'Internet',
  'Fournitures',
];

export function dateEstValide(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const valeur = new Date(date + 'T00:00:00Z');
  return (
    !Number.isNaN(valeur.getTime()) && valeur.toISOString().slice(0, 10) === date
  );
}

export function verifierDepense(depense) {
  if (depense === null || typeof depense !== 'object' || Array.isArray(depense)) {
    throw new TypeError('Une dépense doit être un objet.');
  }
  if (typeof depense.id !== 'string' || depense.id.trim() === '') {
    throw new TypeError('Identifiant de dépense manquant.');
  }
  if (!dateEstValide(depense.date)) {
    throw new RangeError('Date invalide : utiliser AAAA-MM-JJ.');
  }
  if (!categories.includes(depense.categorie)) {
    throw new RangeError('Catégorie inconnue.');
  }
  if (typeof depense.libelle !== 'string' || depense.libelle.trim() === '') {
    throw new TypeError('Libellé manquant.');
  }
  if (!Number.isSafeInteger(depense.montant) || depense.montant <= 0) {
    throw new RangeError('Le montant doit être un entier positif en MGA.');
  }
}

export function verifierCollection(liste) {
  if (!Array.isArray(liste)) {
    throw new TypeError('Les dépenses doivent former un tableau.');
  }
  const ids = [];
  for (const depense of liste) {
    verifierDepense(depense);
    if (ids.includes(depense.id)) {
      throw new RangeError('Identifiant présent deux fois : ' + depense.id);
    }
    ids.push(depense.id);
  }
  return liste;
}

export function verifierMois(mois) {
  if (typeof mois !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mois)) {
    throw new RangeError('Mois invalide : utiliser AAAA-MM.');
  }
}

export function verifierRevenu(revenu) {
  if (!Number.isSafeInteger(revenu) || revenu < 0) {
    throw new RangeError('Le revenu doit être un entier positif ou nul.');
  }
}
