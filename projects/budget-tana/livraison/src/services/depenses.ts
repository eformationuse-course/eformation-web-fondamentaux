import type { Expense, ExpenseInput, StorageResult } from '../domain/models.ts';
import { creerEtat } from '../domain/etat.ts';
import { chargerJSON } from './json.ts';
import { chargerStockage, sauverStockage, effacerStockage } from '../storage/local.ts';

// Un point d'entrée unique vers l'état et la persistance.
// Il ne connaît ni document, ni bouton, ni HTML.
export function creerServiceDepenses(initiales: Expense[], stockage: Storage | null) {
  const etat = creerEtat(initiales);
  const lecture: StorageResult = chargerStockage(stockage);
  let bloquee = lecture.statut === 'invalide';
  if (lecture.statut === 'ok') etat.remplacer(lecture.liste);

  function conserver(): string {
    if (bloquee) {
      return 'Sauvegarde corrompue protégée : restauration nécessaire.';
    }
    return sauverStockage(stockage, etat.toutes()) ?
      'Modifications conservées localement sur cet appareil.' :
      'Sauvegarde impossible : modifications seulement en mémoire.';
  }

  function ajouter(entree: ExpenseInput) {
    const ajout = etat.ajouter(entree);
    return { ajout, message: conserver() };
  }
  function supprimer(id: string) {
    const supprime = etat.supprimer(id);
    return { supprime, message: supprime ? conserver() : '' };
  }
  function fusionner(liste: Expense[]) {
    const nombre = etat.fusionner(liste);
    return { nombre, message: nombre > 0 ? conserver() : '' };
  }
  async function importer(url: string, serviceFetch: typeof fetch = fetch) {
    const liste = await chargerJSON(url, serviceFetch);
    return fusionner(liste);
  }
  function restaurer() {
    const efface = effacerStockage(stockage);
    bloquee = !efface && stockage !== null;
    etat.restaurer();
    return efface ?
      'Sauvegarde locale effacée ; dix exemples restaurés.' :
      'Données restaurées en mémoire ; stockage non effacé.';
  }
  function statutInitial(): string {
    if (lecture.statut === 'ok') return 'Dépenses retrouvées dans ce navigateur.';
    if (lecture.statut === 'invalide') {
      return 'Sauvegarde locale illisible : données fictives affichées. ' +
        'Les octets corrompus sont conservés jusqu’à votre restauration explicite.';
    }
    if (lecture.statut === 'indisponible') {
      return 'Stockage indisponible : changements seulement en mémoire.';
    }
    return 'Aucune sauvegarde : dix dépenses fictives chargées.';
  }
  return { toutes: etat.toutes, ajouter, supprimer, fusionner, importer,
    restaurer, statutInitial };
}
