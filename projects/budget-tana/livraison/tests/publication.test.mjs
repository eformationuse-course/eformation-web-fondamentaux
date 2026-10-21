import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const config = readFileSync(new URL('vite.config.ts', root), 'utf8');
const ui = readFileSync(new URL('src/ui/controller.ts', root), 'utf8');
const html = readFileSync(new URL('index.html', root), 'utf8');
test('base Vite relative pour site projet sous-repertoire', () => {
  assert.match(config, /base: '\.\/'/);
});
test('fichiers JSON resolus par rapport a la page', () => {
  assert.match(ui, /new URL\('data\/depenses-demo\.json', document\.baseURI\)\.href/);
  assert.match(ui, /new URL\('data\/fichier-absent\.json', document\.baseURI\)\.href/);
});
test('HTML semantique et avertissement pour donnees fictives', () => {
  assert.match(html, /lang="fr"/);
  assert.match(html, /N.entrez aucune vraie donn.e priv.e/);
});
