import test from 'node:test';
import assert from 'node:assert/strict';
import { depenses } from '../data/depenses.js';
import { creerEtat } from '../src/etat.js';
import { calculerTotal } from '../src/calculs.js';
import { dateEstValide } from '../src/validation.js';

test('démarrage avec dix dépenses et 780000 MGA', () => {
  const etat = creerEtat(depenses);
  assert.equal(etat.toutes().length, 10);
  assert.equal(calculerTotal(etat.toutes()), 780000);
});

test('ajouter / supprimer / restaurer sans modifier les données importées', () => {
  const etat = creerEtat(depenses);
  const ajout = etat.ajouter({ date:'2026-11-05', categorie:'Fournitures',
    libelle:'Cahiers novembre', montant:12000 });
  assert.equal(ajout.id, 'nouvelle-1');
  assert.equal(etat.toutes().length, 11);
  assert.equal(calculerTotal(etat.toutes()), 792000);
  assert.equal(depenses.length, 10);
  assert.equal(etat.supprimer(ajout.id), true);
  assert.equal(etat.supprimer('absent'), false);
  assert.equal(calculerTotal(etat.toutes()), 780000);
  etat.ajouter({ date:'2026-11-05', categorie:'Repas',libelle:'Repas',montant:1000 });
  etat.restaurer();
  assert.equal(etat.toutes().length, 10);
  assert.equal(calculerTotal(etat.toutes()), 780000);
});

test('copies défensives empêchent la mutation externe', () => {
  const etat = creerEtat(depenses);
  const copie = etat.toutes();
  copie[0].montant = 1;
  assert.equal(etat.toutes()[0].montant, 180000);
});

test('cas d’erreur : montant, date et catégorie', () => {
  const etat = creerEtat(depenses);
  const base = { date:'2026-11-05',categorie:'Repas',libelle:'X',montant:1000 };
  assert.throws(() => etat.ajouter({ ...base, montant:-1 }), RangeError);
  assert.throws(() => etat.ajouter({ ...base, montant:0 }), RangeError);
  assert.throws(() => etat.ajouter({ ...base, montant:1.5 }), RangeError);
  assert.throws(() => etat.ajouter({ ...base, date:'2026-02-30' }), RangeError);
  assert.throws(() => etat.ajouter({ ...base, categorie:'Autres' }), RangeError);
  assert.equal(dateEstValide('2026-02-30'), false);
  assert.throws(() => etat.ajouter({ ...base, montant:Number.MAX_SAFE_INTEGER }), RangeError);
  assert.equal(etat.toutes().length,10);
});
