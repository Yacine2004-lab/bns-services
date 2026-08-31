const fs = require('fs')
const cartFile = 'c:\\Users\\HP\\Desktop\\bns\\src\\pages\\CartPage.jsx'
let cart = fs.readFileSync(cartFile, 'utf8')
const FEE = 2000
cart = cart.replace('<span className="font-bold text-green-600">Gratuite</span>', '<span className="font-bold text-[#0f2557]">{formatPrice(' + FEE + ')}</span>')
cart = cart.replace(/\{formatPrice\(total\)\}/g, '{formatPrice(total + ' + FEE + ')}')
fs.writeFileSync(cartFile, cart, 'utf8')
console.log('CartPage updated with delivery fee')
