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

