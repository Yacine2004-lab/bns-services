import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const CATEGORIES_DATA = [
  {
    id: 'multimedia',
    name: 'Multimédia',
    slug: 'multimedia',
    icon: 'MonitorSmartphone',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    description: 'Audio, vidéo, photo, gaming et accessoires connectés.',
    subCategories: [
      { id: 'accessoires-multimedia', name: 'Accessoires multimédia', slug: 'accessoires-multimedia', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80' },
      { id: 'appareils-photo', name: 'Appareils photo', slug: 'appareils-photo', icon: 'Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80' },
      { id: 'audio-video', name: 'Audio & vidéo', slug: 'audio-video', icon: 'Tv', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80' },
      { id: 'imprimantes-scanners', name: 'Imprimantes & scanners', slug: 'imprimantes-scanners', icon: 'Printer', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80' },
      { id: 'jeux-consoles', name: 'Jeux vidéos & consoles', slug: 'jeux-consoles', icon: 'Gamepad2', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80' },
      { id: 'ordinateurs', name: 'Ordinateurs', slug: 'ordinateurs', icon: 'Laptop2', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80' },
      { id: 'tv-home-cinema', name: 'TV & home cinéma', slug: 'tv-home-cinema', icon: 'Tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80' },
      { id: 'tablettes', name: 'Tablettes', slug: 'tablettes', icon: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
      { id: 'telephones', name: 'Téléphones', slug: 'telephones', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    ],
  },
  {
    id: 'informatique',
    name: 'Informatique',
    slug: 'informatique',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    description: 'Composants, stockage, réseau, câbles et périphériques pro.',
    subCategories: [
      { id: 'ordinateurs-portables', name: 'Ordinateurs portables', slug: 'ordinateurs-portables', icon: 'Laptop2', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
      { id: 'ordinateurs-fixes', name: 'Ordinateurs fixes', slug: 'ordinateurs-fixes', icon: 'Monitor', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80' },
      { id: 'composants-pc', name: 'Composants PC', slug: 'composants-pc', icon: 'Cpu', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' },
      { id: 'stockage-ssd', name: 'Stockage & SSD', slug: 'stockage-ssd', icon: 'HardDrive', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80' },
      { id: 'peripheriques', name: 'Périphériques', slug: 'peripheriques', icon: 'Keyboard', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=500&q=80' },
      { id: 'reseau-wifi', name: 'Réseau & Wi‑Fi', slug: 'reseau-wifi', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80' },
      { id: 'cables-connectique', name: 'Câbles & connectique', slug: 'cables-connectique', icon: 'Cable', image: 'https://images.unsplash.com/photo-1555618564-9cd3f8d579a6?auto=format&fit=crop&w=500&q=80' },
      { id: 'accessoires-bureautique', name: 'Accessoires bureautiques', slug: 'accessoires-bureautique', icon: 'Monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80' },
      { id: 'accessoires-gaming', name: 'Accessoires gaming', slug: 'accessoires-gaming', icon: 'Gamepad2', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80' },
      { id: 'equipements-reseau', name: 'Équipements réseau / sécurité', slug: 'equipements-reseau', icon: 'ShieldCheck', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80' },
      { id: 'routeurs', name: 'Routeurs', slug: 'routeurs', icon: 'Router', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80' },
    ],
  },
]

const PRODUCTS_DATA = [
  {
    id: 'laptop-pro-14',
    slug: 'laptop-pro-14',
    name: 'Laptop Pro 14',
    categoryId: 'informatique',
    subCategoryId: 'ordinateurs-portables',
    price: 349000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    description: 'Ordinateur portable compact et puissant, conçu pour les professionnels et les étudiants exigeants.',
    reference: 'BNS-LP14-01',
    stock: 12,
    rating: 4.8,
    featured: true,
  },
  {
    id: 'desktop-elite-27',
    slug: 'desktop-elite-27',
    name: 'Desktop Elite 27',
    categoryId: 'informatique',
    subCategoryId: 'ordinateurs-fixes',
    price: 489000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
    description: 'Station de travail performante pour bureau, idéal pour le multitâche et les tâches lourdes.',
    reference: 'BNS-DE27-02',
    stock: 8,
    rating: 4.7,
    featured: true,
  },
  {
    id: 'monitor-27-4k',
    slug: 'monitor-27-4k',
    name: 'Écran 27" 4K',
    categoryId: 'multimedia',
    subCategoryId: 'audio-video',
    price: 189000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    description: 'Moniteur ultra net avec un affichage 4K pour un confort visuel optimal et une productivité accrue.',
    reference: 'BNS-M27-03',
    stock: 15,
    rating: 4.6,
    featured: false,
  },
  {
    id: 'keyboard-mecanic',
    slug: 'keyboard-mecanic',
    name: 'Clavier mécanique RGB',
    categoryId: 'informatique',
    subCategoryId: 'peripheriques',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    description: 'Clavier tactile mécanique avec rétroéclairage RGB et réponse rapide pour gamers et professionnels.',
    reference: 'BNS-KB-04',
    stock: 30,
    rating: 4.9,
    featured: true,
  },
  {
    id: 'headset-pro',
    slug: 'headset-pro',
    name: 'Casque Pro Audio',
    categoryId: 'multimedia',
    subCategoryId: 'audio-video',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    description: 'Casque audio avec réduction de bruit et son immersif pour les appels, le travail et les loisirs.',
    reference: 'BNS-HS-05',
    stock: 22,
    rating: 4.5,
    featured: false,
  },
  {
    id: 'ssd-1tb',
    slug: 'ssd-1tb',
    name: 'SSD NVMe 1 To',
    categoryId: 'informatique',
    subCategoryId: 'stockage-ssd',
    price: 56000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80',
    description: 'Mémoire de stockage rapide et fiable, idéale pour booster les performances de votre configuration.',
    reference: 'BNS-SSD-06',
    stock: 40,
    rating: 4.8,
    featured: true,
  },
  {
    id: 'ram-32gb',
    slug: 'ram-32gb',
    name: 'Mémoire RAM 32 Go',
    categoryId: 'informatique',
    subCategoryId: 'composants-pc',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    description: 'Barrette mémoire à haute capacité pour améliorer la fluidité du système et exécuter plusieurs tâches.',
    reference: 'BNS-RAM-07',
    stock: 18,
    rating: 4.7,
    featured: false,
  },
  {
    id: 'router-business',
    slug: 'router-business',
    name: 'Routeur Business WiFi 6',
    categoryId: 'informatique',
    subCategoryId: 'reseau-wifi',
    price: 93000,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    description: 'Solution réseau moderne pour bureau, offrant vitesse, stabilité et couverture maximale.',
    reference: 'BNS-RT-08',
    stock: 10,
    rating: 4.7,
    featured: true,
  },
  {
    id: 'usb-c-hub',
    slug: 'usb-c-hub',
    name: 'Hub USB-C 7 ports',
    categoryId: 'informatique',
    subCategoryId: 'cables-connectique',
    price: 21000,
    image: 'https://images.unsplash.com/photo-1555618564-9cd3f8d579a6?auto=format&fit=crop&w=900&q=80',
    description: 'Hub polyvalent pour étendre les ports USB, HDMI et cartes mémoire d\'un ordinateur portable.',
    reference: 'BNS-HUB-09',
    stock: 26,
    rating: 4.4,
    featured: false,
  },
  {
    id: 'webcam-4k',
    slug: 'webcam-4k',
    name: 'Webcam 4K HD',
    categoryId: 'multimedia',
    subCategoryId: 'accessoires-multimedia',
    price: 33000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
    description: 'Webcam haute définition pour visioconférence, streaming et réunions professionnelles.',
    reference: 'BNS-WC-10',
    stock: 14,
    rating: 4.6,
    featured: false,
  },
]

async function main() {
  console.log('🌱 Démarrage du peuplement (seed) de la base de données...')

  // 1. Créer les Catégories et Sous-catégories
  for (const cat of CATEGORIES_DATA) {
    const category = await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        image: cat.image,
        description: cat.description,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        image: cat.image,
        description: cat.description,
      },
    })

    for (const sub of cat.subCategories) {
      await prisma.subCategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: sub.slug,
          },
        },
        update: {
          name: sub.name,
          icon: sub.icon,
          image: sub.image,
        },
        create: {
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          icon: sub.icon,
          image: sub.image,
          categoryId: category.id,
        },
      })
    }
  }
  console.log('✅ Catégories et sous-catégories insérées.')

  // 2. Créer les Produits
  for (const p of PRODUCTS_DATA) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        reference: p.reference,
        stock: p.stock,
        rating: p.rating,
        featured: p.featured,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        reference: p.reference,
        stock: p.stock,
        rating: p.rating,
        featured: p.featured,
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId,
      },
    })
  }
  console.log('✅ Produits du catalogue insérés.')

  // 3. Creer le compte Administrateur par defaut
  const adminPasswordHash = await bcrypt.hash('admin1234', 10)
  await prisma.adminUser.upsert({
    where: { email: 'contact@bayeniassservices.com' },
    update: {
      name: 'Super Admin BNS',
      password: adminPasswordHash,
    },
    create: {
      email: 'contact@bayeniassservices.com',
      name: 'Super Admin BNS',
      password: adminPasswordHash,
      role: 'admin',
    },
  })
  console.log('✅ Compte Administrateur configure (contact@bayeniassservices.com).')

  console.log('🎉 Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
