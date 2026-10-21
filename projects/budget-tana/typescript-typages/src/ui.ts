import { depenses } from './data/depenses.ts';
import { estCategorie, dateEstValide } from './validation.ts';
import type { Expense, ExpenseInput } from './types.ts';
import { calculerTotal } from './calculs.ts';
import { formatMGA } from './formatage.ts';
import { creerEtat } from './etat.ts';
import { chargerJSON } from './api.ts';
import { chargerStockage, sauverStockage, effacerStockage } from './stockage.ts';
import { elementObligatoire, messageErreur } from './dom.ts';

type Champs = {
  libelle: HTMLInputElement;
  montant: HTMLInputElement;
  categorie: HTMLSelectElement;
  date: HTMLInputElement;
};
type NomChamp = keyof Champs;

// L'interface HTML existante est conservée ; seules ses données deviennent typées.
export function initialiserInterface(document: Document, fenetre: Window) {
  const chercher = <T extends Element>(selecteur: string, classe: { new (): T }): T =>
    elementObligatoire(document, selecteur, classe);
  const etat = creerEtat(depenses);
  const elements = {
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
  const champs: Champs = {
    libelle: chercher('#libelle', HTMLInputElement),
    montant: chercher('#montant', HTMLInputElement),
    categorie: chercher('#categorie', HTMLSelectElement),
    date: chercher('#date', HTMLInputElement)
  };

  let stockageLocal: Storage | null;
  try { stockageLocal = fenetre.localStorage; }
  catch { stockageLocal = null; }

  const charge = chargerStockage(stockageLocal);
  let autoriserSauvegarde = charge.statut !== 'invalide';
  // L'union discriminée associe 'ok' à une vraie liste Expense[].
  if (charge.statut === 'ok') {
    etat.remplacer(charge.liste);
    elements.stockage.textContent = 'Dépenses retrouvées dans ce navigateur.';
  } else if (charge.statut === 'invalide') {
    elements.stockage.textContent =
      'Sauvegarde locale illisible : données de démonstration affichées. ' +
      'Aucune donnée corrompue ne sera écrasée sans restauration.';
  } else if (charge.statut === 'indisponible') {
    elements.stockage.textContent =
      'Stockage indisponible : les changements restent en mémoire.';
  } else {
    elements.stockage.textContent =
      'Aucune sauvegarde : dix dépenses fictives chargées.';
  }

  function sauvegarder(): void {
    if (!autoriserSauvegarde) return;
    elements.stockage.textContent = sauverStockage(stockageLocal, etat.toutes()) ?
      'Modifications conservées localement sur cet appareil.' :
      'Sauvegarde impossible : modifications seulement en mémoire.';
  }

  function erreurChamp(nom: NomChamp, message: string): void {
    champs[nom].setAttribute('aria-invalid', String(Boolean(message)));
    chercher('#erreur-' + nom, HTMLElement).textContent = message;
  }
  function effacerErreurs(): void {
    for (const nom of Object.keys(champs) as NomChamp[]) erreurChamp(nom, '');
  }

  function lireFormulaire(): ExpenseInput | null {
    const libelle = champs.libelle.value.trim();
    const texte = champs.montant.value.trim();
    const montant = Number(texte);
    const categorie = champs.categorie.value;
    const date = champs.date.value;
    const erreurs: Record<NomChamp, string> = {
      libelle: !libelle ? 'Saisissez une description.' :
        libelle.length > 80 ? '80 caractères maximum.' : '',
      montant: !texte ? 'Saisissez un montant.' :
        !Number.isSafeInteger(montant) || montant <= 0 ?
          'Saisissez un entier positif en MGA.' : '',
      categorie: !estCategorie(categorie) ? 'Choisissez une catégorie.' : '',
      date: !dateEstValide(date) ? 'Choisissez une date valide.' : ''
    };
    let premier: HTMLInputElement | HTMLSelectElement | null = null;
    for (const nom of Object.keys(champs) as NomChamp[]) {
      erreurChamp(nom, erreurs[nom]);
      if (erreurs[nom] && premier === null) premier = champs[nom];
    }
    if (premier) { premier.focus(); return null; }
    // Ces contrôles sont également utiles en runtime, pas uniquement au compilateur.
    if (!estCategorie(categorie) || !dateEstValide(date)) return null;
    return { libelle, montant, categorie, date };
  }

  function listeVisible(): Expense[] {
    const categorie = elements.filtre.value;
    const terme = elements.recherche.value.trim().toLocaleLowerCase('fr');
    const choix = etat.toutes().filter(item =>
      (categorie === 'toutes' || item.categorie === categorie) &&
      item.libelle.toLocaleLowerCase('fr').includes(terme));
    const ordre = elements.tri.value;
    if (ordre === 'montant-desc') {
      choix.sort((a, b) => b.montant - a.montant || a.id.localeCompare(b.id));
    } else if (ordre === 'montant-asc') {
      choix.sort((a, b) => a.montant - b.montant || a.id.localeCompare(b.id));
    } else if (ordre === 'date-asc') {
      choix.sort((a, b) => a.date.localeCompare(b.date));
    } else {
      choix.sort((a, b) => b.date.localeCompare(a.date));
    }
    return choix;
  }

  function rendreListe(): void {
    const visibles = listeVisible();
    elements.liste.replaceChildren();
    for (const item of visibles) {
      const li = document.createElement('li');
      const description = document.createElement('div');
      description.className = 'expense-description';
      const titre = document.createElement('strong');
      titre.textContent = item.libelle; // jamais innerHTML avec les entrées
      const detail = document.createElement('span');
      detail.textContent = item.date + ' · ' + item.categorie +
        ' · ' + formatMGA(item.montant);
      description.append(titre, detail);
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.dataset.deleteId = item.id;
      bouton.textContent = 'Supprimer';
      bouton.setAttribute('aria-label', 'Supprimer ' + item.libelle);
      li.append(description, bouton);
      elements.liste.append(li);
    }
    elements.compteur.textContent = String(visibles.length);
    elements.total.textContent = formatMGA(calculerTotal(visibles));
    elements.etatListe.textContent = visibles.length === 0 ?
      'Aucune dépense ne correspond à ces filtres.' :
      visibles.length + ' dépense(s) affichée(s).';
  }

  elements.formulaire.addEventListener('submit', event => {
    event.preventDefault();
    const valeurs = lireFormulaire();
    if (!valeurs) {
      elements.retour.textContent = 'Corrigez les champs signalés.';
      return;
    }
    try {
      const ajout = etat.ajouter(valeurs);
      elements.formulaire.reset();
      effacerErreurs();
      sauvegarder();
      rendreListe();
      elements.retour.textContent = 'Dépense ajoutée : ' + ajout.libelle + '.';
    } catch (erreur: unknown) {
      elements.retour.textContent = 'Ajout impossible : ' + messageErreur(erreur);
    }
  });
  elements.formulaire.addEventListener('reset', () => {
    effacerErreurs();
    elements.retour.textContent = 'Champs effacés ; liste conservée.';
  });

  for (const element of [elements.filtre, elements.tri]) {
    element.addEventListener('change', rendreListe);
  }
  elements.recherche.addEventListener('input', rendreListe);

  elements.liste.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const bouton = event.target.closest<HTMLButtonElement>('button[data-delete-id]');
    if (!bouton || !elements.liste.contains(bouton) || !bouton.dataset.deleteId) return;
    if (etat.supprimer(bouton.dataset.deleteId)) {
      sauvegarder();
      rendreListe();
      elements.retour.textContent = 'Dépense supprimée.';
    }
  });

  elements.restaurer.addEventListener('click', () => {
    const efface = effacerStockage(stockageLocal);
    autoriserSauvegarde = true;
    etat.restaurer();
    elements.filtre.value = 'toutes';
    elements.recherche.value = '';
    elements.tri.value = 'date-desc';
    elements.formulaire.reset();
    rendreListe();
    elements.retour.textContent = 'Dix dépenses fictives restaurées.';
    elements.stockage.textContent = efface ?
      'Sauvegarde locale effacée ; dix exemples restaurés.' :
      'Exemples restaurés en mémoire ; stockage indisponible.';
  });

  async function importer(url: string): Promise<void> {
    elements.charger.disabled = true;
    elements.erreurHTTP.disabled = true;
    elements.reseau.textContent = 'Chargement en cours…';
    try {
      const liste = await chargerJSON(url, fenetre.fetch.bind(fenetre));
      const nombre = etat.fusionner(liste);
      sauvegarder();
      rendreListe();
      elements.reseau.textContent = nombre +
        ' nouvelle(s) dépense(s) chargée(s) depuis le JSON local.';
    } catch (erreur: unknown) {
      elements.reseau.textContent = 'Chargement échoué : ' + messageErreur(erreur);
    } finally {
      elements.charger.disabled = false;
      elements.erreurHTTP.disabled = false;
    }
  }
  elements.charger.addEventListener('click', () =>
    void importer('/data/depenses-demo.json'));
  elements.erreurHTTP.addEventListener('click', () =>
    void importer('/data/fichier-absent.json'));

  rendreListe();
  return { etat, rendreListe };
}
