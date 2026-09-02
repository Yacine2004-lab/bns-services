export const DELIVERY_ZONES = {
  'Dakar (Centre-ville, Plateau, Médina, Fann)': 1500,
  'Dakar (Almadies, Ngor, Ouakam, Yoff, Mermoz)': 2500,
  'Pikine / Guédiawaye': 3000,
  'Rufisque / Diamniadio': 3500,
  'Thiès / Mbour / Saly': 4500,
  'Saint-Louis': 5000,
  'Autre région du Sénégal': 6500,
}

export function getDeliveryFee(city) {
  const normalized = city?.trim() || ''
  return DELIVERY_ZONES[normalized] ?? DELIVERY_ZONES['Autre région du Sénégal']
}
