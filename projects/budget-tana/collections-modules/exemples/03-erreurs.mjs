import { depenses } from '../data/depenses.js';
import { bilanMensuel, calculerTotal,
  trouverDepense } from '../src/calculs.js';

const moisSansDepense = bilanMensuel(depenses, '2026-08', 450000);
console.log('Mois sans dépense : ' + moisSansDepense.total);
console.log('Liste vide : ' + calculerTotal([]));
const recherche = trouverDepense(depenses, 'aucune');
console.log('Recherche absente : ' + (recherche === undefined));

try {
  calculerTotal([{ id: 'err', date: '2026-02-30',
    categorie: 'Repas', libelle: 'Exemple invalide', montant: -5 }]);
} catch (erreur) {
  console.log('Erreur interceptée : ' + erreur.message);
}
