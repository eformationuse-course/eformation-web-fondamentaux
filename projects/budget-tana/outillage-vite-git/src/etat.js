import { verifierCollection, verifierDepense } from './validation.js';
import { calculerTotal } from './calculs.js';

// Etat en mémoire ; les fichiers importés ne sont jamais modifiés.
export function creerEtat(depensesInitiales) {
  verifierCollection(depensesInitiales);
  let depenses = depensesInitiales.map((item) => ({ ...item }));
  let prochainNumero = 1;

  function toutes() {
    return depenses.map((item) => ({ ...item }));
  }

  function remplacer(liste) {
    verifierCollection(liste);
    calculerTotal(liste); // vérifie aussi le total entier sûr.
    depenses = liste.map((item) => ({ ...item }));
    // Les nouveaux identifiants évitent les collisions après restauration.
    const maxId = depenses.reduce((max, item) => {
      const found = /^nouvelle-(\d+)$/.exec(item.id);
      return found ? Math.max(max, Number(found[1])) : max;
    }, 0);
    prochainNumero = Math.max(prochainNumero, maxId + 1);
  }

  function ajouter(valeurs) {
    // La description provient du formulaire, jamais d'une page distante.
    const depense = { ...valeurs, id: 'nouvelle-' + prochainNumero };
    verifierDepense(depense);
    if (depenses.some((item) => item.id === depense.id)) {
      throw new RangeError('Identifiant déjà présent.');
    }
    remplacer([...depenses, depense]);
    return { ...depense };
  }

  function supprimer(id) {
    const reste = depenses.filter((item) => item.id !== id);
    if (reste.length === depenses.length) return false;
    remplacer(reste);
    return true;
  }

  function fusionner(liste) {
    verifierCollection(liste);
    const existants = new Set(depenses.map((item) => item.id));
    const nouveaux = liste.filter((item) => !existants.has(item.id));
    remplacer([...depenses, ...nouveaux]);
    return nouveaux.length;
  }

  function restaurer() {
    depenses = depensesInitiales.map((item) => ({ ...item }));
    prochainNumero = 1;
  }

  return { toutes, remplacer, ajouter, supprimer, fusionner, restaurer };
}
