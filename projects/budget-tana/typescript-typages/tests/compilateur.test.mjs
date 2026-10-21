import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

function diagnostic(source) {
  try {
    execFileSync('tsc',['--strict','--noEmit','--target','ES2022',source], {encoding:'utf8',stdio:'pipe'});
    return {status:0,output:''};
  } catch(e) {
    return {status:e.status,output:(e.stdout||'')+(e.stderr||'')};
  }
}
test('exemples erronés échouent réellement au compilateur',()=>{
  for (const [path,code] of [
    ['docs/erreurs/01-texte-au-lieu-du-montant.ts','TS2322'],
    ['docs/erreurs/02-categorie-inconnue.ts','TS2322'],
    ['docs/erreurs/03-null-possible.ts','TS18048'],
  ]) {
    const r=diagnostic(path);
    assert.notEqual(r.status,0,path+' doit échouer');
    assert.match(r.output,new RegExp(code),path+' : '+r.output);
  }
});
