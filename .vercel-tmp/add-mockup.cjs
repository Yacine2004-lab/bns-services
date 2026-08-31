const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx';
let content = fs.readFileSync(file, 'utf8');

const mockupSection = [
  '',
  '      {/* Mockup presentation */}',
  '      <section className="flex justify-center">',
  '        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2557] to-[#142d60] p-8 shadow-[0_20px_60px_rgba(15,37,87,0.3)]">',
  '          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#e87722]/10 blur-[60px]" />',
  '          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#1a3a8a]/15 blur-[50px]" />',
  '          <div className="relative text-center">',
  '            <img',
  '              src="/bns-mockup.png"',
  '              alt="BNS Services sur ordinateur"',
  '              className="mx-auto max-h-[320px] w-auto rounded-2xl shadow-2xl"',
  '            />',
  '            <p className="mt-6 text-lg font-bold text-white">Votre boutique informatique en ligne</p>',
  '            <p className="mt-1 text-sm text-slate-300">Ordinateurs, accessoires et solutions - Livraison partout au Senegal</p>',
  '          </div>',
  '        </div>',
  '      </section>',
].join('\n');

const lines = content.split('\n');
const insertAfter = lines.findIndex(l => l.trim() === ')}');
// Find the )} that closes the hero carousel (around line 204)
let heroCloseIdx = -1;
for (let i = 195; i < 210; i++) {
  if (lines[i] && lines[i].trim() === ')}') {
    heroCloseIdx = i;
    break;
  }
}

if (heroCloseIdx !== -1) {
  lines.splice(heroCloseIdx + 1, 0, mockupSection);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('OK: Mockup section added after line ' + (heroCloseIdx + 1));
} else {
  console.log('Could not find insertion point');
}
