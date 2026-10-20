import { depenses } from '../data/depenses.js';

const depensesOctobre = depenses.filter(d => d.date.startsWith('2026-10-'));
const titres = depensesOctobre.map(d => d.libelle);
const total = depensesOctobre.reduce((somme, d) => somme + d.montant, 0);
const manquante = depenses.find(d => d.id === 'absent');
const origine = depenses.map(d => d.id).join(',');
const copieTriee = [...depenses].sort((a, b) => b.montant - a.montant);

console.log('Nombre octobre : ' + depensesOctobre.length);
console.log('Premier titre : ' + titres[0]);
console.log('Total octobre : ' + total + ' MGA');
console.log('Introuvable : ' + (manquante === undefined));
console.log('Premier montant après tri : ' + copieTriee[0].montant);
console.log('Ordre original inchangé : ' +
  (origine === depenses.map(d => d.id).join(','))); 

const { note = 'Sans note' } = depenses[0];
const { note: noteOctobre = 'Sans note' } = depenses[6];
console.log('Valeur par défaut : ' + note);
console.log('Note existante : ' + noteOctobre);

function multiplierClassique(nombre, facteur) {
  return nombre * facteur;
}
const multiplierFleche = (nombre, facteur) => nombre * facteur;
console.log('Même résultat : ' +
  (multiplierClassique(3, 2) === multiplierFleche(3, 2)));
