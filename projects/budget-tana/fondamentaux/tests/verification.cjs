'use strict';
// Vérification pour l'auteur, non fournie comme évaluation aux apprenants.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const paths = ['01-premiers-pas.js', '02-fonctions.js',
  '03-decisions-boucles.js', '04-bilan-budget.js'];
const expectations = [
  ['Type du revenu : number', "450000 === '450000' : false",
   'Repas après ajustement : 140000 MGA'],
  ['Dépenses : 405000 MGA', 'Reste : 45000 MGA',
   'Reste si le revenu passe à 400000 : -5000 MGA'],
  ['Budget positif : 45000 MGA', 'Mois 3 : 135000 MGA',
   'Reste avec un imprévu : -55000 MGA'],
  ['Total des dépenses : 405000 MGA', 'Reste : 45000 MGA',
   'Cumul hypothétique mois 3 : 135000 MGA']
];
for (let i = 0; i < paths.length; i++) {
  const filename = path.join(root, 'scripts', paths[i]);
  const output = execFileSync(process.execPath, [filename], { encoding: 'utf8' });
  for (const line of expectations[i]) {
    assert.ok(output.includes(line), paths[i] + ' ne contient pas ' + line);
  }
  console.log('OK sortie console : ' + paths[i]);
}
const source = fs.readFileSync(path.join(root, 'scripts',
  '04-bilan-budget.js'), 'utf8');
const output = [];
const context = { console: {
  log: value => output.push(String(value)),
  error: value => output.push('ERROR ' + value)
} };
vm.createContext(context);
vm.runInContext(source, context);
const cases = [
  ['450000',450000], [' 135000 ',135000], ['0',0],
  ['',null], ['   ',null], ['450 000',null], ['abc',null],
  ['-1',null], ['12.5',null], ['Infinity',null],
  ['NaN',null], ['9007199254740992',null]
];
for (const [input,expected] of cases) {
  assert.strictEqual(context.convertirMontant(input),expected,
    'Valeur : ' + JSON.stringify(input));
}
assert.strictEqual(context.calculerTotal(180000,135000,45000,25000,20000),405000);
assert.strictEqual(context.calculerReste(450000,405000),45000);
assert.strictEqual(context.calculerReste(350000,405000),-55000);
assert.strictEqual(context.afficherSituation(1),'Budget positif');
assert.strictEqual(context.afficherSituation(0),'Budget exactement équilibré');
assert.strictEqual(context.afficherSituation(-1),'Budget dépassé');
console.log('OK : 4 scripts et 18 assertions ciblées');
