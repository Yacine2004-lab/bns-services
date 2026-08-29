import { prisma } from '../config/prisma.js'
import { slugify } from '../utils/slugify.js'

// Générateur de référence unique auto-incrémenté (BNS-0001, BNS-0002, ...)
async function generateReference() {
  const lastProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { reference: true },
  })

  if (!lastProduct) return 'BNS-0001'

  const lastRef = lastProduct.reference
  const match = lastRef.match(/BNS-(\d+)/)
  if (!match) return 'BNS-0001'

  const nextNum = parseInt(match[1], 10) + 1
  return `BNS-${String(nextNum).padStart(4, '0')}`
}

// 1. Récupérer les produits avec filtres, recherche, tri et pagination
export async function getProducts(req, res, next) {
  try {
    const {
      category,
      subCategory,
      search,
      featured,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 50,
    } = req.query

    const pageNumber = Math.max(1, parseInt(page) || 1)
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit) || 50))
    const skip = (pageNumber - 1) * limitNumber

    // Construction dynamique de la clause WHERE
    const where = {}

    // Filtre par catégorie
    if (category && category !== 'all') {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
        { category: { name: { equals: category, mode: 'insensitive' } } },
      ]
    }

    // Filtre par sous-catégorie
    if (subCategory && subCategory !== 'all') {
      where.subCategoryId = subCategory
    }

    // Filtre produits vedettes
    if (featured === 'true' || featured === true) {
      where.featured = true
    }

    // Filtre par fourchette de prix
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Recherche textuelle dans le nom, la description et la référence
    if (search && search.trim()) {
      const searchTerms = search.trim()
      where.AND = [
        {
          OR: [
            { name: { contains: searchTerms, mode: 'insensitive' } },
            { description: { contains: searchTerms, mode: 'insensitive' } },
            { reference: { contains: searchTerms, mode: 'insensitive' } },
          ],
        },
      ]
    }

    // Options de tri
    let orderBy = { createdAt: 'desc' }
    if (sortBy === 'price_asc' || sortBy === 'price-asc') {
      orderBy = { price: 'asc' }
    } else if (sortBy === 'price_desc' || sortBy === 'price-desc') {
      orderBy = { price: 'desc' }
    } else if (sortBy === 'featured') {
      orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }]
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    }

    // Exécution des requêtes (données + décompte total)
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          subCategory: { select: { id: true, name: true, slug: true } },
        },
        orderBy,
        skip,
        take: limitNumber,
      }),
      prisma.product.count({ where }),
    ])

    // Formatage pour correspondre au frontend
    const formatProduct = (p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image || (Array.isArray(p.images) ? p.images[0] : ''),
      images: Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean),
      reference: p.reference,
      stock: p.stock,
      rating: p.rating,
      featured: p.featured,
      category: p.category?.name || '',
      categoryId: p.categoryId,
      subCategory: p.subCategory?.name || '',
      subCategoryId: p.subCategoryId,
      createdAt: p.createdAt,
    })

    const formattedProducts = products.map(formatProduct)

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      total: totalCount,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      data: formattedProducts,
    })
  } catch (error) {
    next(error)
  }
}

// 2. Récupérer un produit par son Slug ou son ID
export async function getProductBySlug(req, res, next) {
  try {
    const { idOrSlug } = req.params

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: idOrSlug }, { id: idOrSlug }],
      },
      include: {
        category: true,
        subCategory: true,
      },
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Produit introuvable avec l'identifiant ou slug : ${idOrSlug}`,
      })
    }

    res.status(200).json({
      success: true,
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image || (Array.isArray(product.images) ? product.images[0] : ''),
        images: Array.isArray(product.images) && product.images.length ? product.images : [product.image].filter(Boolean),
        reference: product.reference,
        stock: product.stock,
        rating: product.rating,
        featured: product.featured,
        category: product.category.name,
        categoryId: product.categoryId,
        subCategory: product.subCategory.name,
        subCategoryId: product.subCategoryId,
        createdAt: product.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 3. Créer un nouveau produit
export async function createProduct(req, res, next) {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      stock,
      categoryId,
      subCategoryId,
      featured = false,
    } = req.body

    // Générer automatiquement une référence unique
    const reference = await generateReference()

    // Vérifier que la catégorie et sous-catégorie existent
    const subCat = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    })

    if (!subCat) {
      return res.status(400).json({
        success: false,
        message: `Sous-catégorie introuvable avec l'identifiant : ${subCategoryId}`,
      })
    }

    // Générer un slug unique
    const baseSlug = slugify(name)
    let finalSlug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`
    }

    const normalizedImages = Array.isArray(images) && images.length
      ? [...new Set(images.filter(Boolean).slice(0, 8))]
      : [image].filter(Boolean)

    const primaryImage = normalizedImages[0] || image.trim()

    const product = await prisma.product.create({
      data: {
        slug: finalSlug,
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: primaryImage,
        images: normalizedImages,
        reference: reference.trim(),
        stock: parseInt(stock) || 0,
        featured: Boolean(featured),
        categoryId: categoryId || subCat.categoryId,
        subCategoryId: subCat.id,
      },
      include: {
        category: true,
        subCategory: true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès !',
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image || (Array.isArray(product.images) ? product.images[0] : ''),
        images: Array.isArray(product.images) && product.images.length ? product.images : [product.image].filter(Boolean),
        reference: product.reference,
        stock: product.stock,
        rating: product.rating,
        featured: product.featured,
        category: product.category?.name || '',
        categoryId: product.categoryId,
        subCategory: product.subCategory?.name || '',
        subCategoryId: product.subCategoryId,
        createdAt: product.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 4. Mettre à jour un produit
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    // La référence est auto-générée et immuable — on l'ignore si envoyée
    delete updateData.reference

    // Vérifier que le produit existe
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    })

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Produit introuvable avec l'identifiant : ${id}`,
      })
    }

    // Si le nom est modifié, régénérer un slug
    if (updateData.name && updateData.name !== existing.name) {
      const baseSlug = slugify(updateData.name)
      let finalSlug = baseSlug
      let counter = 1
      while (
        await prisma.product.findFirst({
          where: { slug: finalSlug, NOT: { id: existing.id } },
        })
      ) {
        finalSlug = `${baseSlug}-${counter++}`
      }
      updateData.slug = finalSlug
    }

    if (updateData.images) {
      const nextImages = [...new Set(updateData.images.filter(Boolean).slice(0, 8))]
      updateData.images = nextImages
      if (nextImages.length > 0) updateData.image = nextImages[0]
    }

    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price)
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock)
    if (updateData.featured !== undefined) updateData.featured = Boolean(updateData.featured)

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        category: true,
        subCategory: true,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès !',
      data: {
        id: updated.id,
        slug: updated.slug,
        name: updated.name,
        description: updated.description,
        price: updated.price,
        image: updated.image || (Array.isArray(updated.images) ? updated.images[0] : ''),
        images: Array.isArray(updated.images) && updated.images.length ? updated.images : [updated.image].filter(Boolean),
        reference: updated.reference,
        stock: updated.stock,
        rating: updated.rating,
        featured: updated.featured,
        category: updated.category?.name || '',
        categoryId: updated.categoryId,
        subCategory: updated.subCategory?.name || '',
        subCategoryId: updated.subCategoryId,
        createdAt: updated.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 5. Supprimer un produit
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    })

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Produit introuvable avec l'identifiant : ${id}`,
      })
    }

    await prisma.product.delete({
      where: { id: existing.id },
    })

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès.',
    })
  } catch (error) {
    next(error)
  }
}
