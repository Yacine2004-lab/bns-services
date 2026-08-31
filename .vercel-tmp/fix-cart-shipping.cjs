const fs = require('fs');
const cartFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CartPage.jsx';
let cart = fs.readFileSync(cartFile, 'utf8');
const DELIVERY_FEE = 2000;

// Remplacer "Livraison Gratuite" par "Livraison 2000 FCFA"
cart = cart.replace(
  '<span className="font-bold text-green-600">Gratuite</span>',
  '<span className="font-bold text-[#0f2557]">{formatPrice(' + DELIVERY_FEE + ')}</span>'
);

// Mettre a jour le total pour inclure les frais de livraison
cart = cart.replace(
  /\{formatPrice\(total\)\}/g,
  '{formatPrice(total + ' + DELIVERY_FEE + ')}'
);

fs.writeFileSync(cartFile, cart, 'utf8');
console.log('CartPage mis a jour');
