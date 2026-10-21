import { verifierCollection } from './validation.js';
import { calculerTotal } from './calculs.js';

// fetch() reçoit ici un chemin du même serveur local, PAS une API payante.
export async function chargerJSON(url, fetchFonction = fetch) {
  const reponse = await fetchFonction(url, { cache: 'no-store' });
  if (!reponse.ok) {
    throw new Error('HTTP ' + reponse.status + ' : fichier indisponible.');
  }
  const donnees = await reponse.json(); // peut lever SyntaxError
  if (!donnees || donnees.version !== 1 ||
      !Array.isArray(donnees.depenses)) {
    throw new TypeError('Format JSON de démonstration invalide.');
  }
  verifierCollection(donnees.depenses);
  calculerTotal(donnees.depenses);
  return donnees.depenses.map(item => ({ ...item }));
}
