import { depenses } from '../data/depenses.js';
import { categories, dateEstValide } from './validation.js';
import { calculerTotal } from './calculs.js';
import { formatMGA } from './formatage.js';
import { creerEtat } from './etat.js';

// Tous les changements de la page passent par ces fonctions explicites.
export function initialiserInterface(document) {
  const etat = creerEtat(depenses);
  const formulaire = document.querySelector('#form-depense');
  const liste = document.querySelector('#liste-depenses');
  const filtre = document.querySelector('#filtre-categorie');
  const retour = document.querySelector('#retour-formulaire');
  const etatListe = document.querySelector('#etat-liste');
  const total = document.querySelector('#total-depenses');
  const compteur = document.querySelector('#nombre-depenses');
  const restaurer = document.querySelector('#restaurer');

  const champs = {
    libelle: document.querySelector('#libelle'),
    montant: document.querySelector('#montant'),
    categorie: document.querySelector('#categorie'),
    date: document.querySelector('#date')
  };

  function erreurChamp(nom, message) {
    champs[nom].setAttribute('aria-invalid', String(Boolean(message)));
    document.querySelector('#erreur-' + nom).textContent = message;
  }

  function effacerErreurs() {
    for (const nom of Object.keys(champs)) {
      erreurChamp(nom, '');
    }
  }

  function lireFormulaire() {
    const libelle = champs.libelle.value.trim();
    const montantTexte = champs.montant.value.trim();
    const montant = Number(montantTexte);
    const categorie = champs.categorie.value;
    const date = champs.date.value;
    let premierInvalide = null;

    const erreurs = {
      libelle: libelle === '' ? 'Saisissez une description.' :
        libelle.length > 80 ? 'La description dépasse 80 caractères.' : '',
      montant: montantTexte === '' ? 'Saisissez un montant.' :
        !Number.isSafeInteger(montant) || montant <= 0 ?
          'Saisissez un entier positif en MGA.' : '',
      categorie: !categories.includes(categorie) ?
        'Choisissez une catégorie.' : '',
      date: !dateEstValide(date) ? 'Choisissez une date valide.' : ''
    };

    for (const nom of Object.keys(champs)) {
      erreurChamp(nom, erreurs[nom]);
      if (erreurs[nom] && premierInvalide === null) {
        premierInvalide = champs[nom];
      }
    }
    if (premierInvalide) {
      premierInvalide.focus();
      return null;
    }
    return { libelle, montant, categorie, date };
  }

  function rendreListe() {
    const toutes = etat.toutes();
    const visibles = filtre.value === 'toutes' ? toutes :
      toutes.filter(item => item.categorie === filtre.value);
    const totalVisible = calculerTotal(visibles);
    liste.replaceChildren();

    // textContent protège l'affichage : le texte saisi n'est pas du HTML.
    for (const depense of visibles) {
      const ligne = document.createElement('li');
      const description = document.createElement('div');
      description.className = 'expense-description';
      const titre = document.createElement('strong');
      titre.textContent = depense.libelle;
      const detail = document.createElement('span');
      detail.textContent = depense.date + ' · ' + depense.categorie +
        ' · ' + formatMGA(depense.montant);
      description.append(titre, detail);
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.dataset.deleteId = depense.id;
      bouton.textContent = 'Supprimer';
      bouton.setAttribute('aria-label',
        'Supprimer ' + depense.libelle + ', ' + formatMGA(depense.montant));
      ligne.append(description, bouton);
      liste.append(ligne);
    }

    compteur.textContent = String(visibles.length);
    total.textContent = formatMGA(totalVisible);
    etatListe.textContent = visibles.length === 0 ?
      'Aucune dépense pour ce filtre.' :
      visibles.length + ' dépense(s) pour ce filtre.';
  }

  formulaire.addEventListener('submit', event => {
    event.preventDefault(); // Empêche tout envoi ou rechargement.
    retour.textContent = '';
    const valeurs = lireFormulaire();
    if (valeurs === null) {
      retour.textContent = 'Corrigez les champs signalés.';
      return;
    }
    try {
      const nouvelle = etat.ajouter(valeurs);
      effacerErreurs();
      formulaire.reset();
      rendreListe();
      retour.textContent = 'Dépense ajoutée : ' + nouvelle.libelle + '.';
    } catch (erreur) {
      retour.textContent = 'Ajout impossible : ' + erreur.message;
    }
  });

  formulaire.addEventListener('reset', () => {
    effacerErreurs();
    retour.textContent = 'Les champs sont effacés, la liste est conservée.';
  });

  filtre.addEventListener('change', rendreListe);

  // Délégation d'événement : un seul écouteur pour tous les boutons futurs.
  liste.addEventListener('click', event => {
    const cible = event.target;
    if (!(cible instanceof Element)) return;
    const bouton = cible.closest('button[data-delete-id]');
    if (!bouton || !liste.contains(bouton)) return;
    const aSupprimer = bouton.dataset.deleteId;
    if (etat.supprimer(aSupprimer)) {
      rendreListe();
      retour.textContent = 'Dépense supprimée.';
    }
  });

  restaurer.addEventListener('click', () => {
    etat.restaurer();
    filtre.value = 'toutes';
    formulaire.reset();
    rendreListe();
    retour.textContent = 'Les 10 dépenses fictives sont restaurées.';
  });

  rendreListe();
  return { etat, rendreListe };
}
