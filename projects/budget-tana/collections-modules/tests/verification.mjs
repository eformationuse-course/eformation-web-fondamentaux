// Fichier pour les contrôles du producteur du cours, pas une évaluation.
import assert from 'node:assert/strict';
import { depenses } from '../data/depenses.js';
import { categories, dateEstValide,
  verifierCollection } from '../src/validation.js';
import { depensesDuMois, calculerTotal, trouverDepense,
  depensesParCategorie, totauxParCategorie, trierParMontantDecroissant,
  trierParDate, descriptionsCourtes, bilanMensuel } from '../src/calculs.js';
import { formatMGA } from '../src/formatage.js';

assert.equal(depenses.length, 10);
assert.deepEqual(categories, ['Logement', 'Repas', 'Transport', 'Internet', 'Fournitures']);
assert.equal(calculerTotal(depenses), 780000);
assert.equal(depensesDuMois(depenses, '2026-09').length, 5);
assert.equal(depensesDuMois(depenses, '2026-10').length, 5);
assert.equal(depensesDuMois(depenses, '2026-08').length, 0);
assert.equal(calculerTotal(depensesDuMois(depenses, '2026-09')), 375000);
assert.equal(calculerTotal(depensesDuMois(depenses, '2026-10')), 405000);
assert.deepEqual(bilanMensuel(depenses, '2026-10', 450000), {
  mois: '2026-10', revenu: 450000, total: 405000, reste: 45000, nombre: 5
});
assert.deepEqual(bilanMensuel(depenses, '2026-09', 450000), {
  mois: '2026-09', revenu: 450000, total: 375000, reste: 75000, nombre: 5
});
assert.equal(calculerTotal([]), 0);
assert.equal(trouverDepense(depenses, 'inconnu'), undefined);
assert.equal(trouverDepense(depenses, 'oct-repas')?.montant, 135000);
assert.equal(calculerTotal(depensesParCategorie(depenses, 'Repas')), 255000);
assert.deepEqual(totauxParCategorie(depenses), {
  Logement: 360000, Repas: 255000, Transport: 85000,
  Internet: 50000, Fournitures: 30000
});
const ordreOriginal = depenses.map(d => d.id);
const listeTriee = trierParMontantDecroissant(depenses);
assert.equal(listeTriee[0].montant, 180000);
assert.notEqual(listeTriee, depenses);
assert.deepEqual(depenses.map(d => d.id), ordreOriginal);
assert.equal(trierParDate(depenses)[0].date, '2026-09-02');
assert.deepEqual(descriptionsCourtes(depenses)[0], {
  libelle: 'Loyer septembre', montant: 180000
});
assert.equal(formatMGA(405000).replace(/\s/gu, ' '), '405 000 MGA');
assert.equal(dateEstValide('2026-02-30'), false);
assert.equal(dateEstValide('2026-10-15'), true);
const valid = depenses[0];
const erreur = mod => [{ ...valid, ...mod }];
assert.throws(() => verifierCollection(null), TypeError);
assert.throws(() => verifierCollection({}), TypeError);
assert.throws(() => verifierCollection(erreur({ montant: -1 })), RangeError);
assert.throws(() => verifierCollection(erreur({ montant: 4.5 })), RangeError);
assert.throws(() => verifierCollection(erreur({ montant: Number.NaN })), RangeError);
assert.throws(() => verifierCollection(erreur({ date: '2026-02-30' })), RangeError);
assert.throws(() => verifierCollection(erreur({ categorie: 'Autres' })), RangeError);
assert.throws(() => verifierCollection([valid, { ...valid }]), RangeError);
assert.throws(() => verifierCollection(erreur({ libelle: '' })), TypeError);
assert.throws(() => depensesDuMois(depenses, '2026-13'), RangeError);
assert.throws(() => bilanMensuel(depenses, '2026-10', -1), RangeError);
assert.throws(() => calculerTotal([
  { ...valid, montant: Number.MAX_SAFE_INTEGER },
  { ...valid, id: 'autre', montant: 10 }
]), RangeError);
console.log('OK : 35 assertions de référence, calculs et erreurs.');
