export const DELIVERY_ZONES = {
  'Dakar (Centre-ville, Plateau, Médina, Fann)': 1500,
  'Dakar (Almadies, Ngor, Ouakam, Yoff, Mermoz)': 2500,
  'Pikine / Guédiawaye': 3000,
  'Rufisque / Diamniadio': 3500,
  'Thiès / Mbour / Saly': 4500,
  'Saint-Louis': 5000,
  'Autre région du Sénégal': 6500,
}

export const PROMO_CODES = {
  BNS10: { label: 'BNS10', percent: 10, maxDiscount: 20000 },
  BNS15: { label: 'BNS15', percent: 15, maxDiscount: 30000 },
  WELCOME20: { label: 'WELCOME20', percent: 20, maxDiscount: 60000 },
}

export function getDeliveryFee(city) {
  const normalized = city?.trim() || ''
  return DELIVERY_ZONES[normalized] ?? DELIVERY_ZONES['Autre région du Sénégal']
}

export function getPromoDiscount(subtotal, code) {
  const normalized = String(code || '').trim().toUpperCase()
  const promo = PROMO_CODES[normalized]
  if (!promo) return 0

  const discount = (subtotal * promo.percent) / 100
  return Math.min(discount, promo.maxDiscount)
}
