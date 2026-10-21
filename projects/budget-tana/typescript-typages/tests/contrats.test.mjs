import test from 'node:test';
import assert from 'node:assert/strict';
import { depenses } from '../dist/data/depenses.js';
import { categories } from '../dist/types.js';
import { verifierCollection, verifierDepense, dateEstValide, estCategorie } from '../dist/validation.js';
import { calculerTotal, bilanMensuel, totauxParCategorie,
  depensesDuMois, trouverDepense, copierListe } from '../dist/calculs.js';
import { creerEtat } from '../dist/etat.js';
import { chargerJSON } from '../dist/api.js';
import { chargerStockage, sauverStockage, CLE_STOCKAGE } from '../dist/stockage.js';
import { formatMGA } from '../dist/formatage.js';

function depensePartielle(overrides={}) {
  return {id:'t1',date:'2026-11-05',categorie:'Repas',libelle:'Exemple',montant:1000,...overrides};
}
function fausseReponse(payload, ok=true, status=200) {
  return async (_url, _options) => ({ok,status,json:async()=>payload});
}

const banque = depenses.map(x=>({...x}));

test('même base Budget Tana du PDF 8 et résultats de référence', () => {
  assert.equal(categories.length,5);
  assert.equal(banque.length,10);
  assert.equal(calculerTotal(banque),780000);
  assert.equal(bilanMensuel(banque,'2026-09',450000).total,375000);
  assert.equal(bilanMensuel(banque,'2026-10',450000).total,405000);
  assert.equal(bilanMensuel(banque,'2026-10',450000).reste,45000);
  assert.equal(depensesDuMois(banque,'2026-08').length,0);
  assert.deepEqual(totauxParCategorie(banque), {
    Logement:360000, Repas:255000, Transport:85000,
    Internet:50000, Fournitures:30000
  });
  assert.equal(formatMGA(405000).replace(/\s/gu,' '),'405 000 MGA');
});

test('TypeScript n’empêche pas une date inexistante reçue du réseau', () => {
  assert.equal(dateEstValide('2026-02-30'),false);
  assert.equal(dateEstValide('2026-11-05'),true);
  assert.equal(estCategorie('Repas'),true);
  assert.equal(estCategorie('Autres'),false);
  assert.throws(()=>verifierDepense(depensePartielle({date:'2026-02-30'})),RangeError);
  assert.throws(()=>verifierDepense(depensePartielle({montant:'1000'})),RangeError);
  assert.throws(()=>verifierDepense(depensePartielle({categorie:'Autres'})),RangeError);
  assert.throws(()=>verifierDepense(depensePartielle({montant:-2})),RangeError);
  assert.throws(()=>verifierDepense(null),TypeError);
  assert.throws(()=>verifierDepense(depensePartielle({note:1})),TypeError);
});

test('collection invalide, doublons et dépassement d’un entier sûr', () => {
  assert.throws(()=>verifierCollection({}),TypeError);
  assert.throws(()=>verifierCollection([depensePartielle(),depensePartielle()]),RangeError);
  assert.equal(calculerTotal([]),0);
  assert.equal(trouverDepense(banque,'absent'),undefined);
  assert.throws(()=>calculerTotal([
    depensePartielle({montant:Number.MAX_SAFE_INTEGER}),
    depensePartielle({id:'t2',montant:1})]),RangeError);
});

test('copies et état conservent leurs invariants', () => {
  const copies=copierListe(banque);
  copies[0].montant=1;
  assert.equal(banque[0].montant,180000);
  const etat=creerEtat(banque);
  assert.equal(etat.ajouter({date:'2026-11-05',categorie:'Fournitures',libelle:'Cahiers',montant:12000}).id,'nouvelle-1');
  assert.equal(calculerTotal(etat.toutes()),792000);
  assert.equal(etat.supprimer('nouvelle-1'),true);
  assert.equal(etat.supprimer('absent'),false);
  assert.equal(calculerTotal(etat.toutes()),780000);
  etat.restaurer();
  assert.equal(etat.toutes().length,10);
});

test('réponse réseau unknown validée avant usage', async () => {
  const ajout = [
    depensePartielle({id:'nov-repas',montant:54000}),
    depensePartielle({id:'nov-transport',categorie:'Transport',montant:18000}),
    depensePartielle({id:'nov-fournitures',categorie:'Fournitures',montant:12000})
  ];
  const chargee=await chargerJSON('/data/depenses-demo.json',fausseReponse({version:1,depenses:ajout}));
  const etat=creerEtat(banque);
  assert.equal(etat.fusionner(chargee),3);
  assert.equal(etat.fusionner(chargee),0);
  assert.equal(etat.toutes().length,13);
  assert.equal(calculerTotal(etat.toutes()),864000);
  await assert.rejects(chargerJSON('inexistant',fausseReponse(null,false,404)),/HTTP 404/);
  await assert.rejects(chargerJSON('invalide',fausseReponse({version:1,depenses:[depensePartielle({montant:'150'})]})),RangeError);
  await assert.rejects(chargerJSON('structure',fausseReponse({version:2,depenses:[]})),TypeError);
});

test('JSON local vérifié et données corrompues rejetées', () => {
  const map=new Map();
  const storage={
    getItem:key=>map.get(key)??null,
    setItem:(key,value)=>map.set(key,value),
    removeItem:key=>map.delete(key)
  };
  assert.equal(chargerStockage(storage).statut,'absent');
  assert.equal(sauverStockage(storage,banque),true);
  const r=chargerStockage(storage);
  assert.equal(r.statut,'ok');
  assert.equal(calculerTotal(r.liste),780000);
  map.set(CLE_STOCKAGE,'{"version":1,"depenses":');
  assert.equal(chargerStockage(storage).statut,'invalide');
  assert.equal(chargerStockage(null).statut,'indisponible');
});
