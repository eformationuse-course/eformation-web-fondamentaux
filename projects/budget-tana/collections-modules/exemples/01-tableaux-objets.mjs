// Exemple autonome : tableaux, objets et références (Node.js).
const montants = [180000, 135000, 45000];
const logement = { categorie: 'Logement', montant: 180000 };
console.log('Premier montant : ' + montants[0]);
console.log('Catégorie : ' + logement.categorie);

const alias = logement;
alias.montant = 175000; // Modifie aussi logement.
console.log('Montant après alias : ' + logement.montant);

const copie = { ...logement }; // Copie superficielle d'un objet.
copie.montant = 180000;
console.log('Original préservé : ' + logement.montant);
console.log('Copie indépendante ici : ' + copie.montant);

const avecSousObjet = { infos: { ville: 'Antananarivo' } };
const copieSuperficielle = { ...avecSousObjet };
copieSuperficielle.infos.ville = 'Toamasina';
console.log('Sous-objet partagé : ' + avecSousObjet.infos.ville);
