import type { Expense } from '../domain/models.ts';
import { calculerTotal } from '../domain/calculs.ts';
import { formatMGA } from '../utils/formatage.ts';

export type Filtrage = { categorie: string; recherche: string; tri: string };

// Transformation pure : pas de document, pas de stockage, pas de fetch.
export function selectionner(liste: Expense[], options: Filtrage): Expense[] {
  const terme = options.recherche.trim().toLocaleLowerCase('fr');
  const resultat = liste.filter(item =>
    (options.categorie === 'toutes' || item.categorie === options.categorie) &&
    item.libelle.toLocaleLowerCase('fr').includes(terme));
  if (options.tri === 'montant-desc') {
    resultat.sort((a, b) => b.montant - a.montant || a.id.localeCompare(b.id));
  } else if (options.tri === 'montant-asc') {
    resultat.sort((a, b) => a.montant - b.montant || a.id.localeCompare(b.id));
  } else if (options.tri === 'date-asc') {
    resultat.sort((a, b) => a.date.localeCompare(b.date));
  } else {
    resultat.sort((a, b) => b.date.localeCompare(a.date));
  }
  return resultat;
}

// L'interface affiche seulement du texte : jamais innerHTML avec la saisie.
export function afficherDepenses(document: Document, liste: Expense[], cibles: {
  liste: HTMLUListElement;
  compteur: HTMLElement;
  total: HTMLElement;
  etat: HTMLElement;
}) {
  cibles.liste.replaceChildren();
  for (const item of liste) {
    const ligne = document.createElement('li');
    const description = document.createElement('div');
    description.className = 'expense-description';
    const titre = document.createElement('strong');
    titre.textContent = item.libelle;
    const detail = document.createElement('span');
    detail.textContent = item.date + ' · ' + item.categorie +
      ' · ' + formatMGA(item.montant);
    description.append(titre, detail);
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.dataset.deleteId = item.id;
    bouton.textContent = 'Supprimer';
    bouton.setAttribute('aria-label', 'Supprimer ' + item.libelle);
    ligne.append(description, bouton);
    cibles.liste.append(ligne);
  }
  cibles.compteur.textContent = String(liste.length);
  cibles.total.textContent = formatMGA(calculerTotal(liste));
  cibles.etat.textContent = liste.length === 0 ?
    'Aucune dépense ne correspond à ces filtres.' :
    liste.length + ' dépense(s) affichée(s).';
}
