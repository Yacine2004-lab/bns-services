import { useMemo } from 'react'
import { useProductStore } from '../context/ProductContext'

export const fetchProducts = async () => {
  const stored = localStorage.getItem('bns_products')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function useProducts() {
  const { products, ready } = useProductStore()

  const getProductById = (productId) =>
    products.find((product) => product.id === productId) || null

  const getProductBySlug = (productSlug) =>
    products.find((product) => product.slug === productSlug) || null

  const getProductsByCategory = (category) => {
    if (!category) return products
    return products.filter((product) => product.category === category)
  }

  const getProductsBySubCategory = (subCategory) => {
    if (!subCategory) return products
    return products.filter((product) => product.subCategory === subCategory)
  }

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  )

  return {
    products,
    ready,
    categories,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getProductsBySubCategory,
  }
}

export default useProducts
