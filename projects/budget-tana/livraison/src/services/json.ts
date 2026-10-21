import type { Expense, DemoEnvelope } from '../domain/models.ts';
import { verifierCollection } from '../domain/validation.ts';
import { calculerTotal } from '../domain/calculs.ts';

// Un fetch ne prouve ni la forme ni la sûreté des données reçues.
export async function chargerJSON(
  url: string,
  fetchFonction: typeof fetch = fetch
): Promise<Expense[]> {
  const reponse = await fetchFonction(url, { cache: 'no-store' });
  if (!reponse.ok) {
    throw new Error('HTTP ' + reponse.status + ' : fichier indisponible.');
  }
  const inconnu: unknown = await reponse.json();
  if (inconnu === null || typeof inconnu !== 'object' ||
      !('version' in inconnu) || inconnu.version !== 1 ||
      !('depenses' in inconnu)) {
    throw new TypeError('Format JSON de démonstration invalide.');
  }
  const liste: unknown = inconnu.depenses;
  verifierCollection(liste);
  calculerTotal(liste);
  // Ici seulement la compilation sait que liste est Expense[].
  const enveloppe: DemoEnvelope = { version: 1, depenses: liste };
  return enveloppe.depenses.map(item => ({ ...item }));
}
