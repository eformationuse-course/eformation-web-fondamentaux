import type { Category, ExpenseInput } from '../domain/models.ts';
import { dateEstValide, estCategorie } from '../domain/validation.ts';

export type Champs = {
  libelle: HTMLInputElement;
  montant: HTMLInputElement;
  categorie: HTMLSelectElement;
  date: HTMLInputElement;
};
type NomChamp = keyof Champs;

// Une seule responsabilité : lire, expliquer les erreurs, guider le focus.
export function creerFormulaire(champs: Champs, document: Document) {
  function signaler(nom: NomChamp, message: string) {
    champs[nom].setAttribute('aria-invalid', String(Boolean(message)));
    const cible = document.querySelector('#erreur-' + nom);
    if (cible) cible.textContent = message;
  }
  function effacer() {
    for (const nom of Object.keys(champs) as NomChamp[]) signaler(nom, '');
  }
  function lire(): ExpenseInput | null {
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
      signaler(nom, erreurs[nom]);
      if (erreurs[nom] && premier === null) premier = champs[nom];
    }
    if (premier) { premier.focus(); return null; }
    if (!estCategorie(categorie) || !dateEstValide(date)) return null;
    const categorieValide: Category = categorie;
    return { libelle, montant, categorie: categorieValide, date };
  }
  return { lire, effacer };
}
