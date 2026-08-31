const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CheckoutPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Main container: better mobile spacing
content = content.replace(
  '<div className="space-y-8 pb-16">',
  '<div className="space-y-6 sm:space-y-8 pb-24 sm:pb-16">'
);

// 2. Grid layout: better mobile gap
content = content.replace(
  '<div className="grid gap-8 lg:grid-cols-12">',
  '<div className="grid gap-6 sm:gap-8 lg:grid-cols-12">'
);

// 3. Right column summary: NOT sticky on mobile (causes overlap), sticky only on desktop
content = content.replace(
  '<div className="sticky top-24 space-y-5">',
  '<div className="space-y-5 lg:sticky lg:top-24">'
);

// 4. Summary card: better mobile padding
content = content.replace(
  '<div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-[0_12px_35px_rgba(11,31,58,0.06)] space-y-6">',
  '<div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-7 shadow-[0_12px_35px_rgba(11,31,58,0.06)] space-y-5 sm:space-y-6">'
);

// 5. Submit button: touch-friendly, more visible on mobile
content = content.replace(
  'className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#e87722] py-4 text-lg font-bold text-[#0f2557] shadow-xl shadow-[#e87722]/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"',
  'className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#e87722] via-[#f09050] to-[#e87722] py-4 text-base sm:text-lg font-bold text-[#0f2557] shadow-xl shadow-[#e87722]/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"'
);

// 6. Form fields grid: better mobile layout
content = content.replace(
  '<div className="grid gap-4 sm:grid-cols-2">',
  '<div className="grid gap-3 sm:gap-4 sm:grid-cols-2">'
);

// 7. Total section: smaller text on mobile
content = content.replace(
  '<span className="text-3xl font-black tracking-tight text-[#0f2557]">',
  '<span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2557]">'
);

// 8. Header title: smaller on mobile
content = content.replace(
  '<h1 className="text-3xl font-black tracking-tight text-[#0f2557] sm:text-4xl">',
  '<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0f2557]">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('CheckoutPage mobile fixes applied!');
