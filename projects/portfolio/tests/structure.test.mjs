import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
test('portfolio donne l objectif et des liens vers projets locaux', () => {
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /href="\.\/kanto-services\/"/);
  assert.match(html, /href="\.\/budget-tana\/"/);
  assert.match(html, /<main id="contenu"/);
});
test('absence de fausses promesses et formulaire personnel', () => {
  assert.match(html, /Exemples fictifs/);
  assert.doesNotMatch(html, /<form[\s>]/);
  assert.doesNotMatch(html, /@gmail\.com|@yahoo\.com/);
});
test('style adapte aux ecrans et parcours clavier', () => {
  assert.match(css, /grid-template-columns/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});
