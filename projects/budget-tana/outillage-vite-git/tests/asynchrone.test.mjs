import test from 'node:test';
import assert from 'node:assert/strict';
import { depenses } from '../src/data/depenses.js';
import { creerEtat } from '../src/etat.js';
import { calculerTotal } from '../src/calculs.js';
import { chargerJSON } from '../src/api.js';
import { chargerStockage, sauverStockage, effacerStockage, CLE_STOCKAGE } from '../src/stockage.js';

const valide = {
  id: 'nov-repas', date: '2026-11-03', categorie: 'Repas',
  libelle: 'Repas novembre fictifs', montant: 54000
};
const fixture = [
  valide,
  { ...valide, id: 'nov-transport', categorie: 'Transport', montant: 18000 },
  { ...valide, id: 'nov-fournitures', categorie: 'Fournitures', montant: 12000 }
];
function stockageMemoire() {
  const map = new Map();
  return {
    getItem: key => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: key => map.delete(key)
  };
}
function reponse({ok=true,status=200,payload={version:1,depenses:fixture}}={}) {
  return {ok,status,json:async()=>payload};
}
test('référence : 10 dépenses / 780 000 MGA', () => {
  const e = creerEtat(depenses);
  assert.equal(e.toutes().length,10);
  assert.equal(calculerTotal(e.toutes()),780000);
});
test('fusion idempotente : 3 puis 0, et conserve les données existantes', () => {
  const e=creerEtat(depenses);
  assert.equal(e.fusionner(fixture),3);
  assert.equal(e.toutes().length,13);
  assert.equal(calculerTotal(e.toutes()),864000);
  assert.equal(e.fusionner(fixture),0);
  assert.equal(calculerTotal(e.toutes()),864000);
  assert.equal(depenses.length,10);
});
test('ajout puis restauration ne réutilise pas un ID actif', () => {
  const e=creerEtat(depenses);
  const item = { date:'2026-11-11', categorie:'Repas',
    libelle:'Repas fictif', montant:12000 };
  assert.equal(e.ajouter(item).id,'nouvelle-1');
  assert.equal(e.ajouter(item).id,'nouvelle-2');
  assert.equal(e.toutes().length,12);
  e.restaurer();
  assert.equal(e.toutes().length,10);
  assert.equal(e.ajouter(item).id,'nouvelle-1');
});
test('identifiants réhydratés évitent la collision', () => {
  const e=creerEtat(depenses);
  e.remplacer([...depenses,{ ...valide,id:'nouvelle-8' }]);
  const added=e.ajouter({date:'2026-11-11',categorie:'Repas',libelle:'X',montant:1});
  assert.equal(added.id,'nouvelle-9');
});
test('suppression et vérifications des données importées', () => {
  const e=creerEtat(depenses);
  assert.equal(e.supprimer('not-there'),false);
  assert.equal(e.supprimer('sep-repas'),true);
  assert.equal(calculerTotal(e.toutes()),660000);
  assert.throws(()=>e.fusionner([{...valide,montant:-5}]), RangeError);
  assert.throws(()=>e.fusionner([{...valide,date:'2026-02-30'}]), RangeError);
  assert.equal(calculerTotal(e.toutes()),660000);
});
test('chargement JSON valide',async()=>{
  const r=await chargerJSON('demo.json',async()=>reponse());
  assert.equal(calculerTotal(r),84000);
  assert.equal(r.length,3);
});
test('HTTP 404 = rejet contrôlé',async()=>{
  await assert.rejects(()=>chargerJSON('missing.json',async()=>reponse({ok:false,status:404})),/HTTP 404/);
});
test('réseau hors-ligne = rejet contrôlé',async()=>{
  await assert.rejects(()=>chargerJSON('demo.json',async()=>{throw new TypeError('Failed to fetch')}),/fetch/);
});
test('JSON invalide, catégorie inconnue, doublon, montant dangereux',async()=>{
  await assert.rejects(()=>chargerJSON('a',async()=>reponse({payload:{version:3,depenses:[]}})),/Format JSON/);
  await assert.rejects(()=>chargerJSON('a',async()=>reponse({payload:{version:1,depenses:[{...valide,categorie:'Inconnue'}]}})),/Catégorie/);
  await assert.rejects(()=>chargerJSON('a',async()=>reponse({payload:{version:1,depenses:[valide,valide]}})),/Identifiant/);
  await assert.rejects(()=>chargerJSON('a',async()=>reponse({payload:{version:1,depenses:[{...valide,montant:NaN}]}})),/montant/);
  await assert.rejects(()=>chargerJSON('a',async()=>({ok:true,json:async()=>{throw new SyntaxError('Invalid JSON')}})),/JSON/);
});
test('stockage : absent, roundtrip, suppression',()=>{
  const storage=stockageMemoire();
  assert.equal(chargerStockage(storage).statut,'absent');
  assert.equal(sauverStockage(storage,depenses),true);
  assert.equal(chargerStockage(storage).statut,'ok');
  assert.equal(calculerTotal(chargerStockage(storage).liste),780000);
  assert.equal(effacerStockage(storage),true);
  assert.equal(chargerStockage(storage).statut,'absent');
});
test('stockage : corruption non écrasée et mode indisponible',()=>{
  const storage=stockageMemoire();
  storage.setItem(CLE_STOCKAGE,'{broken');
  assert.equal(chargerStockage(storage).statut,'invalide');
  assert.equal(storage.getItem(CLE_STOCKAGE),'{broken');
  storage.setItem(CLE_STOCKAGE,JSON.stringify({version:2,depenses}));
  assert.equal(chargerStockage(storage).statut,'invalide');
  assert.equal(chargerStockage(null).statut,'indisponible');
  assert.equal(sauverStockage(null,[]),false);
});
test('stockage inaccessible et quota, pas de crash',()=>{
  const block={getItem(){throw new Error('SecurityError')},setItem(){throw new Error('QuotaExceededError')},removeItem(){throw new Error('SecurityError')}};
  assert.equal(chargerStockage(block).statut,'invalide');
  assert.equal(sauverStockage(block,depenses),false);
  assert.equal(effacerStockage(block),false);
});
