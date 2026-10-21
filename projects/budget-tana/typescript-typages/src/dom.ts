// Generic avec contrainte sur les éléments DOM connus : jamais de `!` aveugle.
export function elementObligatoire<T extends Element>(
  document: Document, selecteur: string, classe: { new (): T }
): T {
  const element = document.querySelector(selecteur);
  if (!(element instanceof classe)) {
    throw new Error('Élément DOM manquant ou de type incorrect : ' + selecteur);
  }
  return element;
}

// Une erreur `unknown` n'a pas nécessairement la propriété `message`.
export function messageErreur(erreur: unknown): string {
  return erreur instanceof Error ? erreur.message : 'Erreur inconnue.';
}
