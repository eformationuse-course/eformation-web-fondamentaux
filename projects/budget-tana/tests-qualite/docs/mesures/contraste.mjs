// Mesure déterministe des couleurs sRGB, non certification WCAG complète.
export function luminance(hex) {
  const composantes = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return composantes[0] * 0.2126 + composantes[1] * 0.7152 + composantes[2] * 0.0722;
}
export function contraste(texte, fond) {
  const [a, b] = [luminance(texte), luminance(fond)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
if (process.argv[1]?.endsWith('contraste.mjs')) {
  const insuffisant = contraste('#9fa8b1', '#ffffff').toFixed(2);
  console.log('Exemple gris trop clair : ' + insuffisant + ':1');
  const correct = contraste('#50677a', '#ffffff').toFixed(2);
  console.log('Couleur du projet : ' + correct + ':1');
}
