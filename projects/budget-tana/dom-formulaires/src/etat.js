import { verifierCollection, verifierDepense } from './validation.js';
import { calculerTotal } from './calculs.js';

// Les données d'origine sont copiées afin d'éviter de modifier le module importé.
export function creerEtat(depensesInitiales) {
  verifierCollection(depensesInitiales);
  let depenses = depensesInitiales.map(depense => ({ ...depense }));
  let prochainNumero = 1;

  function toutes() {
    return depenses.map(depense => ({ ...depense }));
  }

  function ajouter(valeurs) {
    const depense = {
      ...valeurs,
      id: 'nouvelle-' + prochainNumero
    };
    verifierDepense(depense);
    if (depenses.some(item => item.id === depense.id)) {
      throw new RangeError('Cet identifiant existe déjà.');
    }
    if (!Number.isSafeInteger(calculerTotal(depenses) + depense.montant)) {
      throw new RangeError('Le total dépasse les entiers sûrs.');
    }
    depenses = [...depenses, depense];
    prochainNumero += 1;
    return { ...depense };
  }

  function supprimer(id) {
    const avant = depenses.length;
    depenses = depenses.filter(depense => depense.id !== id);
    return depenses.length !== avant;
  }

  function restaurer() {
    depenses = depensesInitiales.map(depense => ({ ...depense }));
    prochainNumero = 1;
  }

  return { toutes, ajouter, supprimer, restaurer };
}
