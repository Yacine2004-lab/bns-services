export function getActivePricing(product, now = new Date()) {
  const promoPrice = Number(product?.promoPrice)
  const originalPrice = Number(product?.originalPrice ?? product?.price)
  const hasPromoPrice = Number.isFinite(promoPrice) && promoPrice > 0 && promoPrice < originalPrice
  const startsAt = product?.promoStartDate ? new Date(product.promoStartDate) : null
  const endsAt = product?.promoEndDate ? new Date(product.promoEndDate) : null
  const isPromoActive = hasPromoPrice && (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now)

  return {
    price: isPromoActive ? promoPrice : originalPrice,
    originalPrice,
    isPromoActive,
    promoPercentage: isPromoActive ? Math.round((1 - promoPrice / originalPrice) * 100) : 0,
  }
}