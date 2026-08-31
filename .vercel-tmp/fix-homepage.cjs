const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const insertCode = [
  '',
  '      {/* 2. Categories populaires avec photos reelles */}',
  '      <section className="space-y-6">',
  '        <div className="text-center space-y-1">',
  '          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-3xl">',
  '            Nos categories populaires',
  '          </h2>',
  '          <p className="text-xs text-slate-500 max-w-md mx-auto">',
  '            Decouvrez nos equipements et accessoires informatiques soigneusement selectionnes',
  '          </p>',
  '        </div>',
  '',
  '        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">',
];

lines.splice(206, 0, ...insertCode);
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('OK: Section header restored');
