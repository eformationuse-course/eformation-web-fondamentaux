"use strict";
// Une fonction regroupe un calcul qui sera réutilisé.
function totalDepenses(logement, repas, transport, internet, fournitures) {
  const total = logement + repas + transport + internet + fournitures;
  return total;
}

function calculerReste(revenu, depenses) {
  return revenu - depenses;
}

const revenu = 450000;
const depenses = totalDepenses(180000, 135000, 45000, 25000, 20000);
const reste = calculerReste(revenu, depenses);

console.log("=== Fonctions ===");
console.log("Dépenses : " + depenses + " MGA");
console.log("Reste : " + reste + " MGA");
console.log("Reste si le revenu passe à 400000 : " +
  calculerReste(400000, depenses) + " MGA");
