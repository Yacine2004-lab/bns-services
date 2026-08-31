const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Supprimer le badge "En direct" du header principal (lignes 278-284)
content = content.replace(
  /            <span className="inline-flex items-center gap-1\.5 rounded-full bg-emerald-500\/10 border border-emerald-400\/20 px-2\.5 py-0\.5 text-\[10px\] font-bold text-emerald-400">\s*<span className="relative flex h-2 w-2">\s*<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" \/>\s*<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" \/>\s*<\/span>\s*En direct\s*<\/span>\s*\n/g,
  ''
);

// 2. Supprimer le badge "En direct" du header commandes (meme pattern, meme regex)
// Le regex avec /g va matcher les 2 occurrences

// Verifier le resultat
const enDirectCount = (content.match(/En direct/g) || []).length;
console.log('Badge "En direct" restants:', enDirectCount);

fs.writeFileSync(file, content, 'utf8');
console.log('Badges "En direct" supprimes');
