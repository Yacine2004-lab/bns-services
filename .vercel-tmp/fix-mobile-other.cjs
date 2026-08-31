const fs = require('fs');

// Fix CartPage
let cartFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CartPage.jsx';
let cart = fs.readFileSync(cartFile, 'utf8');

// 1. CartPage: sticky only on desktop
cart = cart.replace(
  '<div className="sticky top-24 space-y-4">',
  '<div className="space-y-4 lg:sticky lg:top-24">'
);

// 2. CartPage: better mobile padding on card
cart = cart.replace(
  'className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(11,31,58,0.08)]"',
  'className="rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(11,31,58,0.08)]"'
);

// 3. CartPage: better mobile grid gap
cart = cart.replace(
  '<div className="grid gap-6 lg:grid-cols-3">',
  '<div className="grid gap-5 sm:gap-6 lg:grid-cols-3">'
);

fs.writeFileSync(cartFile, cart, 'utf8');
console.log('CartPage mobile fixes applied!');

// Fix ProductPage
let prodFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ProductPage.jsx';
let prod = fs.readFileSync(prodFile, 'utf8');

// 1. ProductPage: sticky only on desktop, h-fit only on desktop
prod = prod.replace(
  '<div className="sticky top-24 h-fit">',
  '<div className="h-fit lg:sticky lg:top-24">'
);

// 2. ProductPage: better mobile gap
prod = prod.replace(
  '<div className="grid gap-8 lg:grid-cols-2">',
  '<div className="grid gap-6 sm:gap-8 lg:grid-cols-2">'
);

fs.writeFileSync(prodFile, prod, 'utf8');
console.log('ProductPage mobile fixes applied!');
