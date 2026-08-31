const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const avant = content.length;

// Cible exacte du 2eme bouton (commandes)
const target = `        <button
          type="button"
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
          title="Rafraichir les commandes"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Actualiser
        </button>
`;

if (content.includes(target)) {
  content = content.replace(target, '');
  console.log('Bouton 2 supprime');
} else {
  console.log('Pattern exact non trouve, essai avec regex...');
  // Essai avec regex flexible
  const regex = /<button\s+type="button"\s+onClick=\{\(\) => setRefreshKey\(\(k\) => k \+ 1\)\}[^>]*?title="Rafraichir les commandes"[^>]*?>\s*<RefreshCw[^>]*\/>\s*Actualiser\s*<\/button>\s*\n/g;
  const matches = content.match(regex);
  console.log('Matches trouves:', matches ? matches.length : 0);
  content = content.replace(regex, '');
}

const apres = content.length;
console.log('Caracteres supprimes:', avant - apres);
console.log('"Actualiser" restants:', (content.match(/Actualiser/g) || []).length);

fs.writeFileSync(file, content, 'utf8');
