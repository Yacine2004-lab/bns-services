const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx'
let content = fs.readFileSync(file, 'utf8')

if (content.includes('group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-slate-50')) {
  console.log('Deja embellie (card cat)')
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

const oldCard = `              <Link
                key={sub.id}
                to={\`/catalogue?subcategory=\${sub.id}\`}
                className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 p-3 text-center shadow-[0_4px_20px_rgba(11,31,58,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#e87722]/60 hover:shadow-[0_14px_35px_rgba(245,166,35,0.18)]"
              >`

const newCard = `              <Link
                key={sub.id}
                to={\`/catalogue?subcategory=\${sub.id}\`}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-slate-50 to-white p-4 text-center shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#e87722]/15"
              >`
findAndReplace(oldCard, newCard, 'card cat className')

const oldImg = `                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-xl bg-[#f8fafc] p-1.5 transition-all duration-300 group-hover:bg-amber-50/60 border border-slate-100">`
const newImg = `                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#e87722]/10 blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#e87722]/40">`
findAndReplace(oldImg, newImg, 'card cat image container')

const oldImg2 = `                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />`
const newImg2 = `                    <img
                      src={resolveImageUrl(sub.image)}
                      alt={sub.name}
                      className="h-full w-full object-cover rounded-2xl"
                      loading="lazy"
                    />`
findAndReplace(oldImg2, newImg2, 'card cat img')

const oldBottom = `                <div className="mt-2.5 w-full">
                  <p className="line-clamp-2 text-xs font-bold leading-tight text-[#0f2557] transition-colors group-hover:text-[#e87722]">
                    {sub.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    {sub.count} article{sub.count > 1 ? 's' : ''}
                  </p>
                </div>
              </Link>`
const newBottom = `                <div className="relative w-full space-y-1">
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
findAndReplace(oldBottom, newBottom, 'card cat bottom')

fs.writeFileSync(file, content, 'utf8')
console.log('OK: ' + content.length + ' chars')
