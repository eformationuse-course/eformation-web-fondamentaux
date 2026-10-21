import { depenses } from './data/depenses.js';
import { categories, dateEstValide } from './validation.js';
import { calculerTotal } from './calculs.js';
import { formatMGA } from './formatage.js';
import { creerEtat } from './etat.js';
import { chargerJSON } from './api.js';
import { chargerStockage, sauverStockage, effacerStockage } from './stockage.js';

// L'interface dépend du DOM, pas d'une base de données distante.
export function initialiserInterface(document, fenetre = window) {
  const etat = creerEtat(depenses);
  const elements = {
    formulaire: document.querySelector('#form-depense'),
    liste: document.querySelector('#liste-depenses'),
    filtre: document.querySelector('#filtre-categorie'),
    recherche: document.querySelector('#recherche'),
    tri: document.querySelector('#tri'),
    retour: document.querySelector('#retour-formulaire'),
    reseau: document.querySelector('#etat-reseau'),
    stockage: document.querySelector('#etat-stockage'),
    etatListe: document.querySelector('#etat-liste'),
    total: document.querySelector('#total-depenses'),
    compteur: document.querySelector('#nombre-depenses'),
    restaurer: document.querySelector('#restaurer'),
    charger: document.querySelector('#charger-json'),
    erreurHTTP: document.querySelector('#tester-erreur-http')
  };
  const champs = {
    libelle: document.querySelector('#libelle'),
    montant: document.querySelector('#montant'),
    categorie: document.querySelector('#categorie'),
    date: document.querySelector('#date')
  };

  // Dans certains contextes (mode privé, restrictions), même la lecture
  // de la propriété localStorage peut lancer SecurityError.
  let storage;
  try { storage = fenetre.localStorage; } catch { storage = null; }
  const charge = chargerStockage(storage);
  let autoriserSauvegarde = charge.statut !== 'invalide';
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

  function sauvegarder() {
    if (!autoriserSauvegarde) return;
    if (sauverStockage(storage, etat.toutes())) {
      elements.stockage.textContent =
        'Modifications conservées localement sur cet appareil.';
    } else {
      elements.stockage.textContent =
        'Sauvegarde impossible : modifications seulement en mémoire.';
    }
  }

  function erreurChamp(nom, message) {
    champs[nom].setAttribute('aria-invalid', String(Boolean(message)));
    document.querySelector('#erreur-' + nom).textContent = message;
  }
  function effacerErreurs() {
    for (const nom of Object.keys(champs)) erreurChamp(nom, '');
  }
  function lireFormulaire() {
    const libelle = champs.libelle.value.trim();
    const texte = champs.montant.value.trim();
    const montant = Number(texte);
    const categorie = champs.categorie.value;
    const date = champs.date.value;
    const erreurs = {
      libelle: !libelle ? 'Saisissez une description.' :
        libelle.length > 80 ? '80 caractères maximum.' : '',
      montant: !texte ? 'Saisissez un montant.' :
        !Number.isSafeInteger(montant) || montant <= 0 ?
          'Saisissez un entier positif en MGA.' : '',
      categorie: !categories.includes(categorie) ?
        'Choisissez une catégorie.' : '',
      date: !dateEstValide(date) ? 'Choisissez une date valide.' : ''
    };
    let premier = null;
    for (const nom of Object.keys(champs)) {
      erreurChamp(nom, erreurs[nom]);
      if (erreurs[nom] && premier === null) premier = champs[nom];
    }
    if (premier) { premier.focus(); return null; }
    return { libelle, montant, categorie, date };
  }

  function listeVisible() {
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

  function rendreListe() {
    const visibles = listeVisible();
    elements.liste.replaceChildren();
    for (const depense of visibles) {
      const li = document.createElement('li');
      const description = document.createElement('div');
      description.className = 'expense-description';
      const titre = document.createElement('strong');
      titre.textContent = depense.libelle; // jamais innerHTML
      const detail = document.createElement('span');
      detail.textContent = depense.date + ' · ' + depense.categorie +
        ' · ' + formatMGA(depense.montant);
      description.append(titre, detail);
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.dataset.deleteId = depense.id;
      bouton.textContent = 'Supprimer';
      bouton.setAttribute('aria-label', 'Supprimer ' + depense.libelle);
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
    } catch (erreur) {
      elements.retour.textContent = 'Ajout impossible : ' + erreur.message;
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
    if (!(event.target instanceof fenetre.Element)) return;
    const bouton = event.target.closest('button[data-delete-id]');
    if (!bouton || !elements.liste.contains(bouton)) return;
    if (etat.supprimer(bouton.dataset.deleteId)) {
      sauvegarder();
      rendreListe();
      elements.retour.textContent = 'Dépense supprimée.';
    }
  });

  elements.restaurer.addEventListener('click', () => {
    // L'effacement est explicite : c'est une action de l'utilisateur.
    const efface = effacerStockage(storage);
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

  async function importer(url) {
    elements.charger.disabled = true;
    elements.erreurHTTP.disabled = true;
    elements.reseau.textContent = 'Chargement en cours…';
    try {
      const data = await chargerJSON(url, fenetre.fetch.bind(fenetre));
      const nombre = etat.fusionner(data);
      sauvegarder();
      rendreListe();
      elements.reseau.textContent = nombre +
        ' nouvelle(s) dépense(s) chargée(s) depuis le JSON local.';
    } catch (erreur) {
      // Aucune modification de liste si fetch, HTTP, JSON ou validation échoue.
      elements.reseau.textContent = 'Chargement échoué : ' + erreur.message;
    } finally {
      elements.charger.disabled = false;
      elements.erreurHTTP.disabled = false;
    }
  }
  elements.charger.addEventListener('click', () =>
    importer('data/depenses-demo.json'));
  elements.erreurHTTP.addEventListener('click', () =>
    importer('data/fichier-absent.json'));

  rendreListe();
  return { etat, rendreListe };
}
