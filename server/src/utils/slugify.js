// Utilitaire de génération de slug URL propre et sans accent
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères non alphanumériques par -
    .replace(/(^-|-$)/g, '')         // Supprime les tirets au début et à la fin
}
