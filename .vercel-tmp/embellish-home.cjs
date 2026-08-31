const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx'
let content = fs.readFileSync(file, 'utf8')

if (content.includes('relative space-y-20 pb-12">')) {
  console.log('Deja embellie')
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

const oldRoot = '  return (\n    <div className="space-y-16 pb-10">'
const newRoot = `  return (
    <div className="relative space-y-20 pb-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#0f2557]/10 via-[#1a3a8a]/5 to-transparent blur-3xl" />
        <div className="absolute top-[40%] right-0 h-[400px] w-[600px] rounded-full bg-[#e87722]/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-[#0f2557]/8 blur-3xl" />
      </div>`
findAndReplace(oldRoot, newRoot, 'root')

const oldHeader = `        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-3xl">
            Nos categories populaires
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Decouvrez nos equipements et accessoires informatiques soigneusement selectionnes
          </p>
        </div>`
const newHeader = `        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e87722]/20 bg-gradient-to-r from-[#e87722]/10 via-white to-[#0f2557]/5 px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e87722] shadow-[0_0_8px_rgba(232,119,34,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f2557]">Explorer par univers</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-4xl">
              Nos <span className="bg-gradient-to-r from-[#e87722] to-[#f09050] bg-clip-text text-transparent">categories</span> populaires
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Decouvrez nos equipements et accessoires informatiques soigneusement selectionnes
            </p>
          </div>
        </div>`
findAndReplace(oldHeader, newHeader, 'header cat')

const oldGrid = `        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">`
const newGrid = `        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-9">`
findAndReplace(oldGrid, newGrid, 'grid cat')

const oldCard = `              <Link
                key={sub.id}
                to={\`/catalogue?subcategory=\${sub.id}\`}
                className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 p-3 text-center shadow-[0_4px_20px_rgba(11,31,58,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#e87722]/60 hover:shadow-[0_14px_35px_rgba(245,166,35,0.18)]"
              >
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-xl bg-[#f8fafc] p-1.5 transition-all duration-300 group-hover:bg-amber-50/60 border border-slate-100">
                  {sub.image ? (
                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <Icon size={26} className="text-[#0f2557]" />
                  )}
                </div>

                <div className="mt-2.5 w-full">
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-[#0f2557] transition-colors group-hover:text-[#e87722]">
                    {sub.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    {sub.count} article{sub.count > 1 ? 's' : ''}
                  </p>
                </div>
              </Link>`
const newCard = `              <Link
                key={sub.id}
                to={\`/catalogue?subcategory=\${sub.id}\`}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-slate-50 to-white p-4 text-center shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#e87722]/15"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#e87722]/10 blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#e87722]/40">
                  {sub.image ? (
                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-2xl"
                      loading="lazy"
                    />
                  ) : (
                    <Icon size={28} className="text-[#0f2557]" />
                  )}
                </div>

                <div className="relative w-full space-y-1">
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-[#0f2557] transition-colors group-hover:text-[#e87722]">
                    {sub.name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    {sub.count} article{sub.count > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e87722] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                  <ArrowRight size={10} />
                </div>
              </Link>`
findAndReplace(oldCard, newCard, 'card cat')

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
          >
            <div className="relative z-10 flex flex-1 gap-4">
              <div className="flex-1 flex flex-col justify-start">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e87722]">
                  {promoLabels[index % promoLabels.length]}
                </span>
                <Link to={\`/produit/\${product.slug}\`} className="block">
                  <h3 className="mt-1.5 text-lg font-black leading-snug text-[#0f2557] transition hover:text-[#e87722] sm:text-xl line-clamp-3">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1.5 text-sm font-semibold text-slate-600">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="w-[120px] sm:w-[150px] flex-shrink-0 flex items-center justify-center">
                <Link to={\`/produit/\${product.slug}\`} className="block w-full">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-h-[150px] w-full object-contain drop-shadow-md transition duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-3">
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
            </div>
          </div>`
const newPromoCard = `          <div
            key={product.id}
            className={\`group relative flex flex-col justify-between min-h-[280px] overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br \${promoStyles[index % promoStyles.length]} p-6 shadow-[0_8px_30px_rgba(11,31,58,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,31,58,0.12)]\`}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#e87722]/10 blur-xl" />

            <div className="relative z-10 flex flex-1 gap-4">
              <div className="flex-1 flex flex-col justify-start">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e87722] to-[#f09050] px-2.5 py-0.5 shadow-md shadow-[#e87722]/20">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">
                    {promoLabels[index % promoLabels.length]}
                  </span>
                </div>
                <Link to={\`/produit/\${product.slug}\`} className="block mt-2">
                  <h3 className="text-lg font-black leading-snug text-[#0f2557] transition hover:text-[#e87722] sm:text-xl line-clamp-3">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-[#0f2557] sm:text-xl">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              <div className="relative w-[120px] sm:w-[150px] flex-shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-75 transition-all duration-500 group-hover:scale-100 group-hover:bg-white/60" />
                <Link to={\`/produit/\${product.slug}\`} className="relative block w-full">
                  <img
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    className="max-h-[160px] w-full object-contain drop-shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />
                </Link>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-[#0f2557]/10 pt-4">
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
            </div>
          </div>`
findAndReplace(oldPromoCard, newPromoCard, 'card promo')

const oldTrendHeader = `      {/* 4. Produits tendance — onglets + slider */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-3xl">
            Nos produits tendance
          </h2>`
const newTrendHeader = `      {/* 4. Produits tendance — onglets + slider */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e87722]/20 bg-gradient-to-r from-[#e87722]/10 via-white to-[#0f2557]/5 px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e87722] shadow-[0_0_8px_rgba(232,119,34,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f2557]">Le meilleur de BNS</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#0f2557] sm:text-4xl">
              Nos produits <span className="bg-gradient-to-r from-[#e87722] to-[#f09050] bg-clip-text text-transparent">tendance</span>
            </h2>
          </div>`
findAndReplace(oldTrendHeader, newTrendHeader, 'header trend')

const oldTrendCard = `            <div
              key={product.id}
              className="group flex w-[230px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_16px_40px_rgba(11,31,58,0.1)] sm:w-[250px]"
            >`
const newTrendCard = `            <div
              key={product.id}
              className="group relative flex w-[230px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-md shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#e87722]/40 hover:shadow-[0_20px_45px_rgba(232,119,34,0.18)] sm:w-[250px]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e87722]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />`
findAndReplace(oldTrendCard, newTrendCard, 'card trend')

fs.writeFileSync(file, content, 'utf8')
console.log('OK: ' + content.length + ' chars')
