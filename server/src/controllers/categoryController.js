import { prisma } from '../config/prisma.js'

// 1. Récupérer toutes les catégories avec leurs sous-catégories
export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Mise en forme pour le frontend
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
      description: cat.description,
      productCount: cat._count.products,
      subCategories: cat.subCategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        icon: sub.icon,
        image: sub.image,
        categoryId: sub.categoryId,
        productCount: sub._count.products,
      })),
    }))

    res.status(200).json({
      success: true,
      count: formattedCategories.length,
      data: formattedCategories,
    })
  } catch (error) {
    next(error)
  }
}

// 2. Récupérer une catégorie par son ID ou son Slug
export async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        subCategories: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Catégorie introuvable avec l'identifiant : ${id}`,
      })
    }

    res.status(200).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

// 3. Récupérer toutes les sous-catégories
export async function getSubCategories(req, res, next) {
  try {
    const { categoryId } = req.query

    const where = categoryId ? { categoryId } : {}

    const subCategories = await prisma.subCategory.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    const formatted = subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      icon: sub.icon,
      image: sub.image,
      categoryId: sub.categoryId,
      categoryName: sub.category.name,
      productCount: sub._count.products,
    }))

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    })
  } catch (error) {
    next(error)
  }
}

// 4. Récupérer une sous-catégorie par son ID ou son Slug
export async function getSubCategoryById(req, res, next) {
  try {
    const { id } = req.params

    const subCategory = await prisma.subCategory.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
    })

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: `Sous-catégorie introuvable avec l'identifiant : ${id}`,
      })
    }

    res.status(200).json({
      success: true,
      data: {
        id: subCategory.id,
        name: subCategory.name,
        slug: subCategory.slug,
        icon: subCategory.icon,
        image: subCategory.image,
        categoryId: subCategory.categoryId,
        categoryName: subCategory.category.name,
        productCount: subCategory._count.products,
      },
    })
  } catch (error) {
    next(error)
  }
}
