const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Supprimer les boutons "Actualiser" (refresh button)
const avant = content.length;
content = content.replace(
  /          <button\s+type="button"\s+onClick=\{\(\) => setRefreshKey\(\(k\) => k \+ 1\)\}\s+disabled=\{refreshing\}\s+className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2\.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"\s+title="Rafraichir les donn\u00e9es"\s+>\s*<RefreshCw size=\{14\} className=\{refreshing \? 'animate-spin' : ''\} \/>\s*Actualiser\s*<\/button>\s*\n/g,
  ''
);

const apres = content.length;
console.log('Caracteres supprimes:', avant - apres);

const actualiserCount = (content.match(/Actualiser/g) || []).length;
console.log('"Actualiser" restants:', actualiserCount);

fs.writeFileSync(file, content, 'utf8');
console.log('Boutons "Actualiser" supprimes');
