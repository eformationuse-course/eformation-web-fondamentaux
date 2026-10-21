// L'exception attrapée reste unknown tant que sa forme n'est pas contrôlée.
export function messageErreur(erreur: unknown): string {
  return erreur instanceof Error ? erreur.message : 'Erreur inconnue.';
}
