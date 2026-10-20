import { depenses } from '../data/depenses.js';
import { calculerTotal, depensesParCategorie, totauxParCategorie,
  trouverDepense, trierParMontantDecroissant,
  bilanMensuel } from './calculs.js';
import { formatMGA } from './formatage.js';

const septembre = bilanMensuel(depenses, '2026-09', 450000);
const octobre = bilanMensuel(depenses, '2026-10', 450000);
const repas = depensesParCategorie(depenses, 'Repas');
const classees = trierParMontantDecroissant(depenses);
const manquante = trouverDepense(depenses, 'inconnu');

console.log('=== BUDGET TANA — DONNÉES FICTIVES ===');
console.log('Septembre : ' + septembre.total + ' MGA de dépenses');
console.log('Reste septembre : ' + septembre.reste + ' MGA');
console.log('Octobre : ' + octobre.total + ' MGA de dépenses');
console.log('Reste octobre : ' + octobre.reste + ' MGA');
console.log('Total des deux mois : ' + calculerTotal(depenses) + ' MGA');
console.log('Repas des deux mois : ' + calculerTotal(repas) + ' MGA');
console.log('Totaux par catégorie :');
console.log(totauxParCategorie(depenses));
console.log('Deux plus grosses dépenses : ' +
  classees.slice(0, 2).map(item => item.montant).join(', ') + ' MGA');
console.log('Recherche inconnue : ' +
  (manquante === undefined ? 'aucun résultat' : manquante.libelle));
console.log('Montant formaté : ' + formatMGA(octobre.total));
