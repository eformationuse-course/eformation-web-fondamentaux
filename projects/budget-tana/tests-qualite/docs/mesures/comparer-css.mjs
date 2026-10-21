// Comparaison d'une optimisation réelle : feuille CSS source -> Vite minifié.
// Exécuter « npm run build » auparavant ; tailles gzip locales, pas réseau.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
const source = readFileSync('src/styles.css');
const css = readdirSync('dist/assets').filter(n => n.endsWith('.css'));
if (css.length !== 1) throw new Error('Un unique CSS construit est attendu');
const genere = readFileSync(join('dist/assets', css[0]));
const afficher = (titre, contenu) => console.log(
  titre + ' : ' + contenu.length + ' octets bruts ; ' +
  gzipSync(contenu).length + ' octets gzip local');
afficher('CSS source', source);
afficher('CSS Vite minifié', genere);
const reduction = (1 - genere.length / source.length) * 100;
console.log('Réduction du poids brut : ' + reduction.toFixed(1) + ' %');
