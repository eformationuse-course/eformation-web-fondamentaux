import { depenses } from '../data/depenses.ts';
import { creerServiceDepenses } from '../services/depenses.ts';
import { elementObligatoire } from './dom.ts';
import { creerFormulaire } from './form.ts';
import { afficherDepenses, selectionner } from './vue.ts';
import { messageErreur } from '../utils/errors.ts';

// Contrôleur = câblage des événements et synchronisation, pas calcul métier.
export function initialiserInterface(document: Document, fenetre: Window) {
  const chercher = <T extends Element>(selecteur: string, classe: { new(): T }): T =>
    elementObligatoire(document, selecteur, classe);
  const ui = {
    formulaire: chercher('#form-depense', HTMLFormElement),
    liste: chercher('#liste-depenses', HTMLUListElement),
    filtre: chercher('#filtre-categorie', HTMLSelectElement),
    recherche: chercher('#recherche', HTMLInputElement),
    tri: chercher('#tri', HTMLSelectElement),
    retour: chercher('#retour-formulaire', HTMLElement),
    reseau: chercher('#etat-reseau', HTMLElement),
    stockage: chercher('#etat-stockage', HTMLElement),
    etatListe: chercher('#etat-liste', HTMLElement),
    total: chercher('#total-depenses', HTMLElement),
    compteur: chercher('#nombre-depenses', HTMLElement),
    restaurer: chercher('#restaurer', HTMLButtonElement),
    charger: chercher('#charger-json', HTMLButtonElement),
    erreurHTTP: chercher('#tester-erreur-http', HTMLButtonElement)
  };
  const formulaire = creerFormulaire({
    libelle: chercher('#libelle', HTMLInputElement),
    montant: chercher('#montant', HTMLInputElement),
    categorie: chercher('#categorie', HTMLSelectElement),
    date: chercher('#date', HTMLInputElement)
  }, document);
  let stockageLocal: Storage | null;
  try { stockageLocal = fenetre.localStorage; }
  catch { stockageLocal = null; }
  const service = creerServiceDepenses(depenses, stockageLocal);
  ui.stockage.textContent = service.statutInitial();

  function rafraichir() {
    const visibles = selectionner(service.toutes(), {
      categorie: ui.filtre.value,
      recherche: ui.recherche.value,
      tri: ui.tri.value
    });
    afficherDepenses(document, visibles, {
      liste: ui.liste, compteur: ui.compteur,
      total: ui.total, etat: ui.etatListe
    });
  }
  ui.formulaire.addEventListener('submit', evenement => {
    evenement.preventDefault();
    const valeurs = formulaire.lire();
    if (!valeurs) {
      ui.retour.textContent = 'Corrigez les champs signalés.';
      return;
    }
    try {
      const { ajout, message } = service.ajouter(valeurs);
      ui.formulaire.reset();
      formulaire.effacer();
      ui.stockage.textContent = message;
      rafraichir();
      ui.retour.textContent = 'Dépense ajoutée : ' + ajout.libelle + '.';
    } catch (erreur: unknown) {
      ui.retour.textContent = 'Ajout impossible : ' + messageErreur(erreur);
    }
  });
  ui.formulaire.addEventListener('reset', () => {
    formulaire.effacer();
    ui.retour.textContent = 'Champs effacés ; liste conservée.';
  });
  for (const select of [ui.filtre, ui.tri]) select.addEventListener('change', rafraichir);
  ui.recherche.addEventListener('input', rafraichir);
  ui.liste.addEventListener('click', evenement => {
    if (!(evenement.target instanceof Element)) return;
    const bouton = evenement.target.closest<HTMLButtonElement>('button[data-delete-id]');
    if (!bouton || !ui.liste.contains(bouton) || !bouton.dataset.deleteId) return;
    const { supprime, message } = service.supprimer(bouton.dataset.deleteId);
    if (supprime) {
      ui.stockage.textContent = message;
      rafraichir();
      ui.retour.textContent = 'Dépense supprimée.';
    }
  });
  ui.restaurer.addEventListener('click', () => {
    const message = service.restaurer();
    ui.filtre.value = 'toutes';
    ui.recherche.value = '';
    ui.tri.value = 'date-desc';
    ui.formulaire.reset();
    rafraichir();
    ui.retour.textContent = 'Dix dépenses fictives restaurées.';
    ui.stockage.textContent = message;
  });
  async function importer(url: string) {
    ui.charger.disabled = true;
    ui.erreurHTTP.disabled = true;
    ui.reseau.textContent = 'Chargement en cours…';
    try {
      const { nombre, message } = await service.importer(
        url, fenetre.fetch.bind(fenetre));
      if (nombre > 0) ui.stockage.textContent = message;
      rafraichir();
      ui.reseau.textContent = nombre +
        ' nouvelle(s) dépense(s) chargée(s) depuis le JSON local.';
    } catch (erreur: unknown) {
      ui.reseau.textContent = 'Chargement échoué : ' + messageErreur(erreur);
    } finally {
      ui.charger.disabled = false;
      ui.erreurHTTP.disabled = false;
    }
  }
  ui.charger.addEventListener('click', () => void importer('/data/depenses-demo.json'));
  ui.erreurHTTP.addEventListener('click', () => void importer('/data/fichier-absent.json'));
  rafraichir();
  return { service, rafraichir };
}
