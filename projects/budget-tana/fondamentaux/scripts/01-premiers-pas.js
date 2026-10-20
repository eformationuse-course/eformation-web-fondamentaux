"use strict";
// Les calculs utilisent des montants fictifs en ariary.
const revenuMensuel = 450000;
let totalRepas = 135000;
const nomProjet = "Budget Tana";
const financementConfirmé = false;

console.log("=== Premiers pas ===");
console.log("Projet : " + nomProjet);
console.log("Type du revenu : " + typeof revenuMensuel);
console.log("Type du nom : " + typeof nomProjet);
console.log("Type de la confirmation : " + typeof financementConfirmé);
console.log("450000 === '450000' : " + (450000 === "450000"));
console.log("450000 == '450000' : " + (450000 == "450000"));

totalRepas = totalRepas + 5000;
console.log("Repas après ajustement : " + totalRepas + " MGA");
console.log("Chaîne convertie : " + Number("450000"));
console.log("Texte espacé invalide : " + Number.isNaN(Number("450 000")));
