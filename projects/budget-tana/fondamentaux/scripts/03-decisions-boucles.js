"use strict";
// Des décisions simples puis une répétition sur trois mois fictifs.
const revenu = 450000;
const depenses = 405000;
const reste = revenu - depenses;

console.log("=== Décisions et boucles ===");
if (reste > 0) {
  console.log("Budget positif : " + reste + " MGA");
} else if (reste === 0) {
  console.log("Budget exactement équilibré");
} else {
  console.log("Dépassement : " + Math.abs(reste) + " MGA");
}

let epargne = 0;
for (let mois = 1; mois <= 3; mois++) {
  epargne = epargne + reste;
  console.log("Mois " + mois + " : " + epargne + " MGA");
}

const depensesExceptionnelles = 505000;
const resteExceptionnel = revenu - depensesExceptionnelles;
console.log("Reste avec un imprévu : " + resteExceptionnel + " MGA");
