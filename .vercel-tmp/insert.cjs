const fs = require('fs')
const target = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\ClientDashboard.jsx'
let content = fs.readFileSync(target, 'utf8')
if (content.includes("activeTab === 'settings' && (")) {
  console.log('Deja insere')
  process.exit(0)
}
const a = fs.readFileSync('c:\\Users\\HP\\Desktop\\bns\\.vercel-tmp\\settings-part-a.txt', 'utf8')
const b = fs.readFileSync('c:\\Users\\HP\\Desktop\\bns\\.vercel-tmp\\settings-part-b.txt', 'utf8')
const c = fs.readFileSync('c:\\Users\\HP\\Desktop\\bns\\.vercel-tmp\\settings-part-c.txt', 'utf8')
const full = a + b + c
const marker = "      {/* MODAL DE CONFIRMATION D'ANNULATION */}"
const idx = content.indexOf(marker)
if (idx === -1) { console.log('Marker non trouve'); process.exit(1) }
const before = content.slice(0, idx)
const after = content.slice(idx)
const result = before + full + after
fs.writeFileSync(target, result, 'utf8')
console.log('OK: ' + (result.length - content.length) + ' chars ajoutes, total: ' + result.length)
