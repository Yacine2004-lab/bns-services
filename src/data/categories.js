import {
  Camera,
  Cable,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop2,
  Monitor,
  MonitorSmartphone,
  Printer,
  Router,
  ShieldCheck,
  Smartphone,
  Tablet,
  Tv,
  Wifi,
} from 'lucide-react'

export const categories = [
  {
    id: 'multimedia',
    name: 'Multimédia',
    icon: MonitorSmartphone,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    description: 'Audio, vidéo, photo, gaming et accessoires connectés.',
    subCategories: [
      {
        id: 'accessoires-multimedia',
        name: 'Accessoires multimédia',
        icon: Headphones,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'appareils-photo',
        name: 'Appareils photo',
        icon: Camera,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'audio-video',
        name: 'Audio & vidéo',
        icon: Tv,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'imprimantes-scanners',
        name: 'Imprimantes & scanners',
        icon: Printer,
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'jeux-consoles',
        name: 'Jeux vidéos & consoles',
        icon: Gamepad2,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'ordinateurs',
        name: 'Ordinateurs',
        icon: Laptop2,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'tv-home-cinema',
        name: 'TV & home cinéma',
        icon: Tv,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'tablettes',
        name: 'Tablettes',
        icon: Tablet,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'telephones',
        name: 'Téléphones',
        icon: Smartphone,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    id: 'informatique',
    name: 'Informatique',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    description: 'Composants, stockage, réseau, câbles et périphériques pro.',
    subCategories: [
      {
        id: 'ordinateurs-portables',
        name: 'Ordinateurs portables',
        icon: Laptop2,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'ordinateurs-fixes',
        name: 'Ordinateurs fixes',
        icon: Monitor,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'composants-pc',
        name: 'Composants PC',
        icon: Cpu,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'stockage-ssd',
        name: 'Stockage & SSD',
        icon: HardDrive,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'peripheriques',
        name: 'Périphériques',
        icon: Keyboard,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'reseau-wifi',
        name: 'Réseau & Wi‑Fi',
        icon: Wifi,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'cables-connectique',
        name: 'Câbles & connectique',
        icon: Cable,
        image: 'https://images.unsplash.com/photo-1555618564-9cd3f8d579a6?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'accessoires-bureautique',
        name: 'Accessoires bureautiques',
        icon: Monitor,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'accessoires-gaming',
        name: 'Accessoires gaming',
        icon: Gamepad2,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'equipements-reseau',
        name: 'Équipements réseau / sécurité',
        icon: ShieldCheck,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 'routeurs',
        name: 'Routeurs',
        icon: Router,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
]

export const allSubCategories = categories.flatMap((category) =>
  category.subCategories.map((subCategory) => ({
    ...subCategory,
    categoryId: category.id,
    categoryName: category.name,
  })),
)

export const getSubCategoryMeta = (subCategoryId) =>
  allSubCategories.find((item) => item.id === subCategoryId) || null
