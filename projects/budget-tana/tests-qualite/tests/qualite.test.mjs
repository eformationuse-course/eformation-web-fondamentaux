import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contraste } from '../docs/mesures/contraste.mjs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const vue = readFileSync(new URL('../src/ui/vue.ts', import.meta.url), 'utf8');
const formulaire = readFileSync(new URL('../src/ui/form.ts', import.meta.url), 'utf8');

test('repères sémantiques de navigation', () => {
  assert.match(html, /<html lang="fr">/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.match(html, /class="skip-link" href="#contenu"/);
  assert.match(html, /<main id="contenu"[^>]*tabindex="-1"/);
});
test('champs du formulaire reliés à leurs étiquettes explicites', () => {
  for (const nom of ['libelle','montant','categorie','date']) {
    assert.match(html, new RegExp('<label for="' + nom + '">'));
    assert.match(html, new RegExp('<(?:input|select) id="' + nom + '"'));
    assert.match(html, new RegExp('id="erreur-' + nom + '"'));
  }
  assert.match(formulaire, /aria-invalid/);
  assert.match(formulaire, /premier\.focus\(\)/);
});
test('retour utilisateur et focus visibles', () => {
  assert.match(html, /id="retour-formulaire"[^>]*role="status"/);
  assert.match(css, /main:focus-visible/);
  assert.match(css, /outline: 3px solid var\(--focus\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
test('contrastes mesurés pour un texte normal sur fond blanc', () => {
  assert.ok(contraste('#50677a','#ffffff') >= 4.5);
  assert.ok(contraste('#9fa8b1','#ffffff') < 4.5);
  assert.match(css, /--muted: #50677a/);
});
test('rendu des données utilisateur sans interpolation innerHTML', () => {
  assert.match(vue, /titre\.textContent = item\.libelle/);
  assert.doesNotMatch(vue, /\.innerHTML\s*=/);
  assert.match(html, /N.entrez aucune vraie donnée privée/);
});
test('page descriptive et ressources statiques locales', () => {
  assert.match(html, /name="description"/);
  assert.match(html, /<title>Budget Tana/);
  assert.match(html, /src="\/src\/main\.ts"/);
  assert.doesNotMatch(html, /<script[^>]*src="https?:/);
});
