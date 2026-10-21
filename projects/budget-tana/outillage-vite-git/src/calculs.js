import {
  categories,
  verifierCollection,
  verifierMois,
  verifierRevenu,
} from './validation.js';

// Une nouvelle liste est produite ; l'originale est préservée.
export function depensesDuMois(liste, mois) {
  verifierCollection(liste);
  verifierMois(mois);
  return liste.filter((depense) => depense.date.startsWith(mois + '-'));
}

export function calculerTotal(liste) {
  verifierCollection(liste);
  const total = liste.reduce((somme, depense) => somme + depense.montant, 0);
  if (!Number.isSafeInteger(total)) {
    throw new RangeError('Total trop grand pour un entier sûr.');
  }
  return total;
}

export function trouverDepense(liste, id) {
  verifierCollection(liste);
  return liste.find((depense) => depense.id === id);
}

export function depensesParCategorie(liste, categorie) {
  verifierCollection(liste);
  if (!categories.includes(categorie)) {
    throw new RangeError('Catégorie inconnue.');
  }
  return liste.filter((depense) => depense.categorie === categorie);
}

export function totauxParCategorie(liste) {
  verifierCollection(liste);
  const resultat = {
    Logement: 0,
    Repas: 0,
    Transport: 0,
    Internet: 0,
    Fournitures: 0,
  };
  for (const depense of liste) {
    const nouveau = resultat[depense.categorie] + depense.montant;
    if (!Number.isSafeInteger(nouveau)) {
      throw new RangeError('Total de catégorie trop grand.');
    }
    resultat[depense.categorie] = nouveau;
  }
  return resultat;
}

export function trierParMontantDecroissant(liste) {
  verifierCollection(liste);
  return [...liste].sort((a, b) => b.montant - a.montant || a.id.localeCompare(b.id));
}

export function trierParDate(liste) {
  verifierCollection(liste);
  return [...liste].sort((a, b) => a.date.localeCompare(b.date));
}

export function descriptionsCourtes(liste) {
  verifierCollection(liste);
  return liste.map(({ libelle, montant }) => ({ libelle, montant }));
}

export function bilanMensuel(liste, mois, revenu) {
  verifierRevenu(revenu);
  const choix = depensesDuMois(liste, mois);
  const total = calculerTotal(choix);
  return { mois, revenu, total, reste: revenu - total, nombre: choix.length };
}
