import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { depenses } from '../dist/data/depenses.js';
import { calculerTotal, bilanMensuel, totauxParCategorie } from '../dist/domain/calculs.js';
import { creerServiceDepenses } from '../dist/services/depenses.js';
import { chargerJSON } from '../dist/services/json.js';
import { CLE_STOCKAGE } from '../dist/storage/local.js';
import { selectionner } from '../dist/ui/vue.js';
import { verifierCollection } from '../dist/domain/validation.js';

function stockageMemoire(init={}) {
  const map = new Map(Object.entries(init));
  let modifications = 0;
  return {
    getItem(key) { return map.get(key) ?? null; },
    setItem(key, value) { modifications += 1; map.set(key,value); },
    removeItem(key) { modifications += 1; map.delete(key); },
    get ecritures() { return modifications; },
    lire(key) { return map.get(key); }
  };
}
const nouvelExemple = {
  date:'2026-11-05',categorie:'Fournitures',libelle:'Cahiers novembre',montant:12000
};

test('référence stable du projet Budget Tana, sans régression', () => {
  assert.equal(depenses.length,10);
  assert.equal(calculerTotal(depenses),780000);
  assert.equal(bilanMensuel(depenses,'2026-09',450000).total,375000);
  assert.equal(bilanMensuel(depenses,'2026-10',450000).total,405000);
  assert.equal(bilanMensuel(depenses,'2026-10',450000).reste,45000);
  assert.deepEqual(totauxParCategorie(depenses),{
    Logement:360000, Repas:255000, Transport:85000,Internet:50000,Fournitures:30000
  });
});

test('filtre, recherche et tri purs : aucune modification du tableau source', () => {
  const ordre=depenses.map(d=>d.id);
  const repas=selectionner(depenses,{categorie:'Repas',recherche:'',tri:'montant-desc'});
  assert.equal(repas.length,2);
  assert.equal(calculerTotal(repas),255000);
  assert.equal(repas[0].montant,135000);
  assert.equal(selectionner(depenses,{categorie:'toutes',recherche:'CAHIERS',tri:'date-asc'}).length,2);
  assert.equal(selectionner(depenses,{categorie:'Repas',recherche:'inexistant',tri:'date-asc'}).length,0);
  assert.deepEqual(depenses.map(d=>d.id),ordre);
});

test('service : ajout, suppression, restauration et sauvegarde', () => {
  const stockage=stockageMemoire();
  const service=creerServiceDepenses(depenses,stockage);
  assert.match(service.statutInitial(),/Aucune sauvegarde/);
  const { ajout }=service.ajouter(nouvelExemple);
  assert.equal(ajout.id,'nouvelle-1');
  assert.equal(service.toutes().length,11);
  assert.equal(calculerTotal(service.toutes()),792000);
  const attendu=JSON.parse(stockage.lire(CLE_STOCKAGE));
  assert.equal(attendu.depenses.length,11);
  assert.equal(service.supprimer(ajout.id).supprime,true);
  assert.equal(service.supprimer('absent').supprime,false);
  assert.equal(calculerTotal(service.toutes()),780000);
  assert.equal(service.restaurer().includes('effacée'),true);
  assert.equal(stockage.lire(CLE_STOCKAGE),undefined);
});

test('stockage corrompu préservé jusqu’à la restauration explicite', () => {
  const mauvais='{"version":1,"depenses": [';
  const stockage=stockageMemoire({[CLE_STOCKAGE]:mauvais});
  const service=creerServiceDepenses(depenses,stockage);
  assert.match(service.statutInitial(),/illisible/);
  assert.equal(service.toutes().length,10);
  const { message }=service.ajouter(nouvelExemple);
  assert.match(message,/protégée/);
  assert.equal(calculerTotal(service.toutes()),792000);
  assert.equal(stockage.lire(CLE_STOCKAGE),mauvais);
  assert.equal(stockage.ecritures,0);
  service.restaurer();
  assert.equal(stockage.lire(CLE_STOCKAGE),undefined);
  service.ajouter(nouvelExemple);
  assert.equal(JSON.parse(stockage.lire(CLE_STOCKAGE)).depenses.length,11);
});

test('stockage invalide mais JSON syntaxiquement valide : ne pas écraser', () => {
  const faux=JSON.stringify({version:1,depenses:[{id:'mauvais',montant:'100'}]});
  const stockage=stockageMemoire({[CLE_STOCKAGE]:faux});
  const service=creerServiceDepenses(depenses,stockage);
  assert.match(service.statutInitial(),/illisible/);
  assert.equal(service.toutes().length,10);
  assert.equal(stockage.lire(CLE_STOCKAGE),faux);
});

test('stockage indisponible : calcul possible, pas de promesse de persistance', () => {
  const s=creerServiceDepenses(depenses,null);
  assert.match(s.statutInitial(),/indisponible/);
  assert.match(s.ajouter(nouvelExemple).message,/seulement en mémoire/);
});

test('validation runtime : données réseau fausses rejetées, aucune mutation', async () => {
  const s=creerServiceDepenses(depenses,stockageMemoire());
  const mauvaise=async()=>({ok:true,status:200,json:async()=>({version:1,depenses:[
    {...depenses[0],id:'invalide',montant:'12000'}
  ]})});
  await assert.rejects(s.importer('/x',mauvaise),RangeError);
  assert.equal(calculerTotal(s.toutes()),780000);
  assert.throws(()=>verifierCollection([{...depenses[0],date:'2026-02-30'}]),RangeError);
  assert.throws(()=>verifierCollection([depenses[0],depenses[0]]),RangeError);
});

test('import JSON, doublons et erreurs HTTP correctement remontées', async () => {
  const jeu={version:1,depenses:[
    {id:'nov-repas',date:'2026-11-04',categorie:'Repas',libelle:'Repas novembre',montant:54000},
    {id:'nov-transport',date:'2026-11-05',categorie:'Transport',libelle:'Transport novembre',montant:18000},
    {id:'nov-fournitures',date:'2026-11-06',categorie:'Fournitures',libelle:'Fournitures novembre',montant:12000}
  ]};
  const fake=async()=>({ok:true,status:200,json:async()=>jeu});
  const s=creerServiceDepenses(depenses,stockageMemoire());
  assert.equal((await s.importer('/fictif',fake)).nombre,3);
  assert.equal((await s.importer('/fictif',fake)).nombre,0);
  assert.equal(calculerTotal(s.toutes()),864000);
  await assert.rejects(s.importer('/absent',async()=>({ok:false,status:404})),/HTTP 404/);
  assert.equal(calculerTotal(s.toutes()),864000);
});

test('fetch réseau réel vers HTTP localhost : succès et 404, sans faux serveur',async t=>{
  const lignes={version:1,depenses:[
    {id:'nov-repas',date:'2026-11-04',categorie:'Repas',libelle:'Repas novembre',montant:54000},
    {id:'nov-transport',date:'2026-11-05',categorie:'Transport',libelle:'Transport novembre',montant:18000},
    {id:'nov-fournitures',date:'2026-11-06',categorie:'Fournitures',libelle:'Fournitures novembre',montant:12000}
  ]};
  const serveur=http.createServer((req,res)=>{
    if(req.url==='/data/depenses-demo.json'){
      res.writeHead(200,{'content-type':'application/json'});
      res.end(JSON.stringify(lignes));
    }else{res.writeHead(404);res.end('Introuvable');}
  });
  await new Promise((resolve,reject)=>{
    serveur.once('error',reject);
    serveur.listen(0,'127.0.0.1',resolve);
  });
  t.after(()=>serveur.close());
  const url=`http://127.0.0.1:${serveur.address().port}`;
  const s=creerServiceDepenses(depenses,stockageMemoire());
  assert.equal((await s.importer(url+'/data/depenses-demo.json')).nombre,3);
  assert.equal(calculerTotal(s.toutes()),864000);
  await assert.rejects(s.importer(url+'/data/absent.json'),/HTTP 404/);
});
