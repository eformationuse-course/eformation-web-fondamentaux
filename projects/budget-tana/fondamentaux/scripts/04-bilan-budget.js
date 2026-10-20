"use strict";
// Budget Tana : chiffres entièrement fictifs, exprimés en MGA.
// Une saisie vide, décimale, négative ou non numérique est rejetée.
function convertirMontant(texte) {
  const propre = texte.trim();
  if (propre === "") {
    return null;
  }
  const montant = Number(propre);
  if (!Number.isFinite(montant) ||
      !Number.isSafeInteger(montant) || montant < 0) {
    return null;
  }
  return montant;
}

function calculerTotal(logement, repas, transport, internet, fournitures) {
  return logement + repas + transport + internet + fournitures;
}

function calculerReste(revenu, depenses) {
  return revenu - depenses;
}

function afficherSituation(reste) {
  if (reste > 0) {
    return "Budget positif";
  } else if (reste === 0) {
    return "Budget exactement équilibré";
  }
  return "Budget dépassé";
}

// Les six entrées ci-dessous constituent le scénario de référence.
const revenu = convertirMontant("450000");
const logement = convertirMontant("180000");
const repas = convertirMontant("135000");
const transport = convertirMontant("45000");
const internet = convertirMontant("25000");
const fournitures = convertirMontant("20000");

if (revenu === null || logement === null || repas === null ||
    transport === null || internet === null || fournitures === null) {
  console.error("Montant invalide : corrigez les valeurs du scénario.");
} else {
  const total = calculerTotal(
    logement, repas, transport, internet, fournitures
  );
  const reste = calculerReste(revenu, total);
  console.log("=== BUDGET TANA — DONNÉES FICTIVES ===");
  console.log("Revenu : " + revenu + " MGA");
  console.log("Logement : " + logement + " MGA");
  console.log("Repas : " + repas + " MGA");
  console.log("Transport : " + transport + " MGA");
  console.log("Internet : " + internet + " MGA");
  console.log("Fournitures : " + fournitures + " MGA");
  console.log("Total des dépenses : " + total + " MGA");
  console.log("Reste : " + reste + " MGA");
  console.log("Situation : " + afficherSituation(reste));

  // Projection purement hypothétique : le reste est supposé identique.
  let cumul = 0;
  for (let mois = 1; mois <= 3; mois++) {
    cumul = cumul + reste;
    console.log("Cumul hypothétique mois " + mois + " : " + cumul + " MGA");
  }
}
