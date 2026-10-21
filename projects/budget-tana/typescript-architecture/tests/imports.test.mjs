import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root=resolve('.');
test('architecture : aucun import du DOM dans le domaine ou stockage',()=>{
  for(const path of ['src/domain/calculs.ts','src/domain/validation.ts',
    'src/domain/etat.ts','src/services/depenses.ts','src/storage/local.ts']){
    const code=readFileSync(join(root,path),'utf8');
    assert.doesNotMatch(code,/from\s+['"][^'"]*\/ui\//i,path);
    assert.doesNotMatch(code,/querySelector|createElement|addEventListener/,path);
  }
});
