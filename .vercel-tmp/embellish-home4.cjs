const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx'
let content = fs.readFileSync(file, 'utf8')

if (content.includes('Le meilleur de BNS')) {
  console.log('Deja embellie (trending)')
  process.exit(0)
}

const findAndReplace = (oldStr, newStr, label) => {
  const idx = content.indexOf(oldStr)
  if (idx === -1) { console.log('ERREUR: ' + label); process.exit(1) }
  content = content.slice(0, idx) + newStr + content.slice(idx + oldStr.length)
  console.log('OK: ' + label)
}

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
