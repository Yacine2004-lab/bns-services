const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx'
let content = fs.readFileSync(file, 'utf8')

if (content.includes('Grille promotions (bento 3×2) - version premium')) {
  console.log('Deja embellie (promo)')
  process.exit(0)
}

const findAndReplace = (oldStr, newStr, label) => {
  const idx = content.indexOf(oldStr)
  if (idx === -1) {
    console.log('ERREUR: ' + label + ' non trouve')
    process.exit(1)
  }
  content = content.slice(0, idx) + newStr + content.slice(idx + oldStr.length)
  console.log('OK: ' + label)
}

const oldPromoStart = `      {/* 3. Grille promotions (bento 3×2) */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">`
const newPromoStart = `      {/* 3. Grille promotions (bento 3×2) - version premium */}
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-3 sm:flex-row sm:justify-between sm:text-left sm:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e87722]/20 bg-gradient-to-r from-[#e87722]/10 via-white to-[#0f2557]/5 px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e87722] shadow-[0_0_8px_rgba(232,119,34,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f2557]">Selection du moment</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-4xl">
              Offres a <span className="bg-gradient-to-r from-[#e87722] to-[#f09050] bg-clip-text text-transparent">saisir</span>
            </h2>
          </div>
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#0f2557] shadow-sm transition-all hover:border-[#e87722] hover:bg-[#e87722]/5 hover:shadow-md"
          >
            Voir tout le catalogue
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">`
findAndReplace(oldPromoStart, newPromoStart, 'promo start')

const oldPromoCard = `          <div
            key={product.id}
            className={\`group relative flex flex-col justify-between min-h-[250px] overflow-hidden rounded-[20px] border border-white/60 bg-gradient-to-br \${promoStyles[index % promoStyles.length]} p-6 shadow-[0_8px_30px_rgba(11,31,58,0.05)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,31,58,0.1)]\`}
          >`
const newPromoCard = `          <div
            key={product.id}
            className={\`group relative flex flex-col justify-between min-h-[280px] overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br \${promoStyles[index % promoStyles.length]} p-6 shadow-[0_8px_30px_rgba(11,31,58,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,31,58,0.12)]\`}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#e87722]/10 blur-xl" />`
findAndReplace(oldPromoCard, newPromoCard, 'card promo root')

const oldLabel = `                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e87722]">
                  {promoLabels[index % promoLabels.length]}
                </span>`
const newLabel = `                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e87722] to-[#f09050] px-2.5 py-0.5 shadow-md shadow-[#e87722]/20">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">
                    {promoLabels[index % promoLabels.length]}
                  </span>
                </div>`
findAndReplace(oldLabel, newLabel, 'card promo label')

const oldPrice = `                <p className="mt-1.5 text-sm font-semibold text-slate-600">
                  {formatPrice(product.price)}
                </p>`
const newPrice = `                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-[#0f2557] sm:text-xl">
                    {formatPrice(product.price)}
                  </span>
                </div>`
findAndReplace(oldPrice, newPrice, 'card promo price')

const oldImg = `              <div className="w-[120px] sm:w-[150px] flex-shrink-0 flex items-center justify-center">
                <Link to={\`/produit/\${product.slug}\`} className="block w-full">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-h-[150px] w-full object-contain drop-shadow-md transition duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  />
                </Link>
              </div>`
const newImg = `              <div className="relative w-[120px] sm:w-[150px] flex-shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-75 transition-all duration-500 group-hover:scale-100 group-hover:bg-white/60" />
                <Link to={\`/produit/\${product.slug}\`} className="relative block w-full">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-h-[160px] w-full object-contain drop-shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />
                </Link>
              </div>`
findAndReplace(oldImg, newImg, 'card promo img')

const oldBtns = `            <div className="relative z-10 mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickBuy(product)}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#e87722] to-[#f09050] px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#0f2557] shadow-md shadow-[#e87722]/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#e87722]/40 active:scale-[0.97] whitespace-nowrap"
              >
                <Zap size={14} className="fill-[#0f2557] transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                Acheter
              </button>
              <Link
                to={\`/produit/\${product.slug}\`}
                className="text-xs font-bold text-[#0f2557] transition-colors hover:text-[#e87722] whitespace-nowrap"
              >
                Détails →
              </Link>
            </div>`
const newBtns = `            <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-[#0f2557]/10 pt-4">
              <button
                type="button"
                onClick={() => handleQuickBuy(product)}
                className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#e87722] to-[#f09050] px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-[#e87722]/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#e87722]/40 active:scale-[0.97] whitespace-nowrap"
              >
                <Zap size={14} className="fill-white transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
                Acheter
              </button>
              <Link
                to={\`/produit/\${product.slug}\`}
                className="group inline-flex items-center gap-1 text-xs font-bold text-[#0f2557] transition-colors hover:text-[#e87722] whitespace-nowrap"
              >
                Détails
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>`
findAndReplace(oldBtns, newBtns, 'card promo btns')

fs.writeFileSync(file, content, 'utf8')
console.log('OK: ' + content.length + ' chars')
