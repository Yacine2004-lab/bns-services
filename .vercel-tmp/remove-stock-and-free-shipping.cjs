const fs = require('fs');

// ============================================================
// 1. ProductPage.jsx - Supprimer l'affichage du stock
// ============================================================
const prodFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ProductPage.jsx';
let prod = fs.readFileSync(prodFile, 'utf8');

// Supprimer la section "Disponibilite" complete
const dispoBlock = `            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Disponibilité</p>
              {product.stock > 0 ? (
                <p className="mt-1 inline-flex items-center gap-2 text-lg font-black text-green-600">
                  <Check size={18} />
                  En stock — {product.stock} unité{product.stock > 1 ? 's' : ''}
                </p>
              ) : (
                <p className="mt-1 inline-flex items-center gap-2 text-lg font-black text-red-500">
                  <X size={18} />
                  Plus disponible
                </p>
              )}
            </div>
`;
prod = prod.replace(dispoBlock, '');

// Supprimer "(max X)" du label Quantite
prod = prod.replace(
  /Quantit\u00e9\{product\.stock > 0 && <span className="font-normal text-slate-400"> \(max \{product\.stock\}\)<\/span>\}/,
  'Quantit\u00e9'
);

// Aussi: il y a un label dans la section specs "Stock" - on l'enleve
// Ligne 73: { label: 'Stock', value: `${product.stock} unit\u00e9${product.stock > 1 ? 's' : ''}` },
prod = prod.replace(
  /\s*\{\s*label:\s*'Stock',\s*value:\s*`\$\{product\.stock\} unit\u00e9\$\{product\.stock > 1 \? 's' : ''\}`\s*\},?\s*\n/,
  '\n'
);

fs.writeFileSync(prodFile, prod, 'utf8');
console.log('ProductPage: affichage stock supprime');

// ============================================================
// 2. CartPage.jsx - Livraison payante
// ============================================================
const cartFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CartPage.jsx';
let cart = fs.readFileSync(cartFile, 'utf8');

// Ajouter un frais de livraison (2000 FCFA par defaut)
const DELIVERY_FEE = 2000;

// Trouver le bloc "Livraison Gratuite" et le remplacer
const oldDelivery = `                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Livraison</span>
                  <span className="font-bold text-green-600">Gratuite</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="font-bold text-[#0f2557]">Total</span>
                  <span className="text-3xl font-black text-[#0f2557]">{formatPrice(total)}</span>
                </div>`;

const newDelivery = `                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Livraison</span>
                  <span className="font-bold text-[#0f2557]">{formatPrice(${DELIVERY_FEE})}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="font-bold text-[#0f2557]">Total</span>
                  <span className="text-3xl font-black text-[#0f2557]">{formatPrice(total + ${DELIVERY_FEE})}</span>
                </div>`;

if (cart.includes(oldDelivery)) {
  cart = cart.replace(oldDelivery, newDelivery);
  console.log('CartPage: livraison payante appliquee (2000 FCFA)');
} else {
  console.log('CartPage: ancien bloc non trouve');
}

fs.writeFileSync(cartFile, cart, 'utf8');

// ============================================================
// 3. CheckoutPage.jsx - Livraison payante
// ============================================================
const checkFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CheckoutPage.jsx';
let check = fs.readFileSync(checkFile, 'utf8');

// Trouver le bloc "Frais de livraison Gratuite"
const oldCheckDelivery = `                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-emerald-600">Gratuite</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[#0f2557]">
                  <span className="text-base font-bold">Total à payer</span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2557]">
                    {formatPrice(total)}
                  </span>
                </div>`;

const newCheckDelivery = `                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-[#0f2557]">{formatPrice(${DELIVERY_FEE})}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[#0f2557]">
                  <span className="text-base font-bold">Total à payer</span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2557]">
                    {formatPrice(total + ${DELIVERY_FEE})}
                  </span>
                </div>`;

if (check.includes(oldCheckDelivery)) {
  check = check.replace(oldCheckDelivery, newCheckDelivery);
  console.log('CheckoutPage: livraison payante appliquee (2000 FCFA)');
} else {
  console.log('CheckoutPage: ancien bloc non trouve');
}

fs.writeFileSync(checkFile, check, 'utf8');

// ============================================================
// 4. ConfirmationPage.jsx - Verifier si "Gratuite" est affiche
// ============================================================
const confFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ConfirmationPage.jsx';
if (fs.existsSync(confFile)) {
  const conf = fs.readFileSync(confFile, 'utf8');
  if (conf.includes('Gratuite')) {
    console.log('ConfirmationPage: contient "Gratuite" - a verifier');
  } else {
    console.log('ConfirmationPage: pas de mention "Gratuite"');
  }
}

console.log('\nTermine !');
