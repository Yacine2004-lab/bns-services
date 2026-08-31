const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ClientDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Main container: more padding bottom on mobile for scrollable content
content = content.replace(
  '<div className="space-y-8 pb-12">',
  '<div className="space-y-6 pb-28 sm:space-y-8 sm:pb-12">'
);

// 2. Product cards grid: ensure single column on mobile with proper spacing
content = content.replace(
  '<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">',
  '<div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">'
);

// 3. Product card: remove overflow-hidden that clips buttons, add proper mobile sizing
content = content.replace(
  'className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_14px_35px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_20px_45px_rgba(11,31,58,0.12)]"',
  'className="group relative flex flex-col rounded-[26px] border border-slate-200/90 bg-white shadow-[0_14px_35px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_20px_45px_rgba(11,31,58,0.12)]"'
);

// 4. Product card inner: ensure buttons section has proper spacing on mobile
content = content.replace(
  '{/* ACTIONS DIRECTES : ACHETER & PANIER */}',
  '{/* ACTIONS DIRECTES : ACHETER & PANIER */}'
);

// 5. Make the "Acheter maintenant" button more tappable on mobile
content = content.replace(
  'className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-3 text-sm font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/40 active:scale-[0.98]"',
  'className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-3.5 text-sm font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/40 active:scale-[0.98] touch-manipulation"'
);

// 6. Order cards: better mobile padding and spacing
content = content.replace(
  'className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,58,0.06)]"',
  'className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(11,31,58,0.06)] sm:p-6"'
);

// 7. Order header: better mobile stacking
content = content.replace(
  '<div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">',
  '<div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">'
);

// 8. Order amount: left-align on mobile for better readability
content = content.replace(
  '<div className="text-right">\n                      <p className="text-xs font-semibold text-slate-500">Montant total</p>',
  '<div className="text-left sm:text-right">\n                      <p className="text-xs font-semibold text-slate-500">Montant total</p>'
);

// 9. Order items grid: single column on mobile with proper spacing
content = content.replace(
  '<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">',
  '<div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">'
);

// 10. Delivery info section: better mobile layout with full-width button
content = content.replace(
  '<div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">',
  '<div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">'
);

// 11. WhatsApp tracking button: full width on mobile
content = content.replace(
  'className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 shadow-sm"',
  'className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 shadow-sm sm:w-auto"'
);

// 12. Wishlist grid: better mobile spacing
content = content.replace(
  '<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">',
  '<div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">'
);

// 13. Wishlist card: same overflow fix as product cards
content = content.replace(
  'className="flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.06)]"',
  'className="flex flex-col rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(11,31,58,0.06)] sm:p-5"'
);

// 14. Wishlist "Acheter maintenant" button: touch-friendly
content = content.replace(
  'className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-2.5 text-xs font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/35 active:scale-[0.97]"',
  'className="group/btn w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#f09050] py-3 text-xs font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#e87722]/35 active:scale-[0.97] touch-manipulation"'
);

// 15. Product details section: ensure proper flex growth on mobile
content = content.replace(
  '<div className="flex flex-1 flex-col justify-between p-5 space-y-4">',
  '<div className="flex flex-1 flex-col justify-between p-4 space-y-3 sm:p-5 sm:space-y-4">'
);

// 16. Tab buttons: better mobile sizing
content = content.replace(
  '<div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">',
  '<div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 -mx-1 px-1">'
);

// 17. Header profile: better mobile padding
content = content.replace(
  'className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-r from-[#0f2557] via-[#142d60] to-[#0f2557] p-8 text-white shadow-[0_20px_60px_rgba(11,31,58,0.15)]"',
  'className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/60 bg-gradient-to-r from-[#0f2557] via-[#142d60] to-[#0f2557] p-5 sm:p-8 text-white shadow-[0_20px_60px_rgba(11,31,58,0.15)]"'
);

// 18. Stats grid: better mobile layout
content = content.replace(
  '<div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">',
  '<div className="relative z-10 mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 border-t border-white/10 pt-5 sm:pt-6 sm:grid-cols-4">'
);

// 19. Search bar container: better mobile padding
content = content.replace(
  '<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.04)]">',
  '<div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-[0_10px_30px_rgba(11,31,58,0.04)]">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Mobile fixes applied successfully!');
console.log('Changes:');
console.log('- Product cards: removed overflow-hidden, better padding');
console.log('- Buttons: touch-manipulation, larger tap targets');
console.log('- Order details: better mobile stacking, full-width WhatsApp button');
console.log('- Header: reduced mobile padding');
console.log('- Stats: better mobile grid');
console.log('- Tabs: better mobile spacing');
console.log('- Wishlist: same mobile fixes');
