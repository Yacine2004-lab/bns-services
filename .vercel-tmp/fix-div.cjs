const fs = require('fs')
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\HomePage.jsx'
let content = fs.readFileSync(file, 'utf8')

// Trouver la fin de la section promo et ajouter le </div> manquant
// Le pattern est : fermeture map, fermeture product, puis </section>
const old = `        ))}
      </section>

      {/* 4. Produits tendance`
const replacement = `        ))}
        </div>
      </section>

      {/* 4. Produits tendance`

if (!content.includes(old)) {
  console.log('Pattern non trouve')
  process.exit(1)
}
content = content.replace(old, replacement)
fs.writeFileSync(file, content, 'utf8')
console.log('OK: </div> ajoute')
