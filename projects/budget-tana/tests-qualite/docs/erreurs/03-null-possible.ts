// Code volontairement FAUX : propriété de `undefined` sans contrôle.
type Expense = { id: string; montant: number };
const liste: Expense[] = [];
const trouve = liste.find(item => item.id === 'absent');
console.log(trouve.montant);
