import { verifierRevenu } from './validation.js';

const formatFrancais = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0
});

export function formatMGA(montant) {
  verifierRevenu(montant);
  return formatFrancais.format(montant) + ' MGA';
}
