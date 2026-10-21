import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';
const fichiers = ['index.html', 'src/styles.css', 'public/data/depenses-demo.json'];
for (const chemin of fichiers) {
  const donnees = readFileSync(resolve(chemin));
  console.log(chemin + ' : ' + statSync(resolve(chemin)).size + ' octets bruts ; ' +
    gzipSync(donnees).length + ' octets gzip (simulation locale)');
}
