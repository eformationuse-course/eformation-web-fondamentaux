import { verifierRevenu } from '../domain/validation.ts';

const formatFrancais = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0
});

export function formatMGA(montant: number): string {
  verifierRevenu(montant);
  return formatFrancais.format(montant) + ' MGA';
}
