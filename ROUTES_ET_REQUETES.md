# 📚 BNS SERVICES - ROUTES ET REQUÊTES API

## 🌐 Base URL
```
http://localhost:5000/api
```

---

## ✅ 1. HEALTH CHECK (Pas d'authentification)

### 🔹 Vérifier l'état de l'API
```http
GET /health
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "API BNS Services opérationnelle ! 🚀",
  "timestamp": "2026-08-18T16:11:43.170Z",
  "environment": "development"
}
```

---

## 📁 2. CATÉGORIES (Pas d'authentification)

### 🔹 Récupérer toutes les catégories
```http
GET /categories
```

**Paramètres:** Aucun

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "informatique",
      "name": "Informatique",
      "slug": "informatique",
      "icon": "Cpu",
      "image": "https://...",
      "description": "Composants, stockage, réseau...",
      "productCount": 7,
      "subCategories": [...]
    },
    {
      "id": "multimedia",
      "name": "Multimédia",
      "slug": "multimedia",
      "icon": "Music",
      "image": "https://...",
      "description": "Équipements multimédias...",
      "productCount": 3,
      "subCategories": [...]
    }
  ]
}
```

### 🔹 Récupérer une catégorie par ID
```http
GET /categories/{categoryId}
```

**Exemple:**
```http
GET /categories/informatique
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "informatique",
    "name": "Informatique",
    "slug": "informatique",
    "subCategories": [...]
  }
}
```

### 🔹 Récupérer les sous-catégories
```http
GET /subcategories
```

**Paramètres Query (optionnels):**
- `categoryId` - Filtrer par catégorie

**Exemple:**
```http
GET /subcategories?categoryId=informatique
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "ordinateurs-portables",
      "name": "Ordinateurs portables",
      "slug": "ordinateurs-portables",
      "categoryId": "informatique",
      "icon": "Laptop2",
      "productCount": 1
    },
    ...
  ]
}
```

---

## 📦 3. PRODUITS (Pas d'authentification pour GET)

### 🔹 Récupérer tous les produits (avec pagination)
```http
GET /products
```

**Paramètres Query (optionnels):**
- `limit` - Nombre de produits par page (défaut: 10)
- `offset` - Décalage (défaut: 0)
- `category` - Filtrer par catégorie
- `subcategory` - Filtrer par sous-catégorie
- `search` - Recherche par nom
- `minPrice` - Prix minimum
- `maxPrice` - Prix maximum
- `sort` - Tri (featured, price, name)

**Exemple:**
```http
GET /products?limit=10&offset=0&category=informatique&minPrice=10000&maxPrice=100000
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "total": 42,
  "page": 1,
  "totalPages": 5,
  "data": [
    {
      "id": "webcam-4k",
      "slug": "webcam-4k",
      "name": "Webcam 4K HD",
      "description": "Webcam haute définition...",
      "price": 33000,
      "stock": 13,
      "rating": 4.6,
      "featured": false,
      "reference": "BNS-WC-10",
      "category": "Multimédia",
      "categoryId": "multimedia",
      "subCategory": "Accessoires multimédia",
      "subCategoryId": "accessoires-multimedia",
      "image": "https://...",
      "createdAt": "2026-08-18T14:31:26.397Z"
    },
    ...
  ]
}
```

### 🔹 Récupérer un produit par slug
```http
GET /products/{slug}
```

**Exemple:**
```http
GET /products/webcam-4k
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "webcam-4k",
    "slug": "webcam-4k",
    "name": "Webcam 4K HD",
    "description": "Webcam haute définition...",
    "price": 33000,
    "stock": 13,
    "rating": 4.6,
    "reference": "BNS-WC-10",
    "category": "Multimédia",
    "categoryId": "multimedia",
    "subCategory": "Accessoires multimédia",
    "subCategoryId": "accessoires-multimedia",
    "image": "https://...",
    "createdAt": "2026-08-18T14:31:26.397Z"
  }
}
```

### 🔹 Créer un produit (Admin Only)
```http
POST /products
Authorization: Bearer {adminToken}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Souris sans fil Logitech",
  "slug": "souris-logitech-wireless",
  "description": "Souris sans fil professionnelle haute performance",
  "price": 25000,
  "image": "https://example.com/mouse.jpg",
  "reference": "MOUSE-LOGI-001",
  "stock": 50,
  "categoryId": "informatique",
  "subCategoryId": "peripheriques"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "id": "souris-logitech-wireless",
    "slug": "souris-logitech-wireless",
    "name": "Souris sans fil Logitech",
    ...
  }
}
```

### 🔹 Mettre à jour un produit (Admin Only)
```http
PUT /products/{productId}
Authorization: Bearer {adminToken}
Content-Type: application/json
```

**Exemple:**
```http
PUT /products/webcam-4k
```

**Body (champs optionnels):**
```json
{
  "name": "Webcam 4K Ultra HD",
  "price": 35000,
  "stock": 20,
  "description": "Nouvelle description"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Produit mis à jour avec succès",
  "data": {
    "id": "webcam-4k",
    ...
  }
}
```

### 🔹 Supprimer un produit (Admin Only)
```http
DELETE /products/{productId}
Authorization: Bearer {adminToken}
```

**Exemple:**
```http
DELETE /products/webcam-4k
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Produit supprimé avec succès"
}
```

---

## 🔐 4. AUTHENTIFICATION CLIENT

### 🔹 Créer un compte (Register)
```http
POST /auth/register
Content-Type: application/json
```

**Body (requis):**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@test.com",
  "phone": "+221781234567",
  "password": "SecurePassword123!"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Compte client créé avec succès !",
  "data": {
    "customer": {
      "id": "uuid-...",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@test.com",
      "phone": "+221781234567",
      "createdAt": "2026-08-18T14:31:26.397Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🔹 Connexion (Login)
```http
POST /auth/login
Content-Type: application/json
```

**Body (requis):**
```json
{
  "email": "jean.dupont@test.com",
  "password": "SecurePassword123!"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Connexion réussie !",
  "data": {
    "customer": {
      "id": "uuid-...",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@test.com",
      "phone": "+221781234567",
      "createdAt": "2026-08-18T14:31:26.397Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🔹 Récupérer mes infos
```http
GET /auth/me
Authorization: Bearer {customerToken}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@test.com",
    "phone": "+221781234567",
    "createdAt": "2026-08-18T14:31:26.397Z"
  }
}
```

---

## 🛒 5. COMMANDES CLIENT

### 🔹 Créer une commande
```http
POST /orders
Authorization: Bearer {customerToken}
Content-Type: application/json
```

**Body (requis):**
```json
{
  "items": [
    {
      "slug": "webcam-4k",
      "quantity": 1
    },
    {
      "slug": "usb-c-hub",
      "quantity": 2
    }
  ],
  "customerName": "Jean Dupont",
  "customerPhone": "+221781234567",
  "customerEmail": "jean@test.com",
  "shippingAddress": "123 Rue de la Paix",
  "shippingCity": "Dakar (Centre-ville, Plateau, Médina, Fann)",
  "shippingNotes": "Livrer entre 9h-18h",
  "paymentMethod": "CASH_ON_DELIVERY"
}
```

**Notes:**
- `items` - Array avec `slug` (ou `productId`) et `quantity`
- `paymentMethod` - Options: `CASH_ON_DELIVERY`, `BANK_TRANSFER`, `CARD`
- Les prix et taxes sont calculés automatiquement

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "order": {
      "id": "uuid-...",
      "orderNumber": "CMD-748291",
      "customerId": "uuid-...",
      "status": "PENDING",
      "total": 87000,
      "subtotal": 87000,
      "tax": 0,
      "shippingCost": 0,
      "paymentMethod": "CASH_ON_DELIVERY",
      "items": [
        {
          "productId": "webcam-4k",
          "name": "Webcam 4K HD",
          "quantity": 1,
          "price": 33000
        },
        {
          "productId": "usb-c-hub",
          "name": "Hub USB-C 7 ports",
          "quantity": 2,
          "price": 21000
        }
      ],
      "createdAt": "2026-08-18T16:00:00.000Z"
    }
  }
}
```

### 🔹 Récupérer mes commandes
```http
GET /orders
Authorization: Bearer {customerToken}
```

**Paramètres Query (optionnels):**
- `status` - Filtrer par statut (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `limit` - Nombre de commandes par page
- `offset` - Décalage

**Exemple:**
```http
GET /orders?status=PENDING&limit=10
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "uuid-...",
      "orderNumber": "CMD-748291",
      "status": "PENDING",
      "total": 87000,
      "createdAt": "2026-08-18T16:00:00.000Z"
    },
    ...
  ]
}
```

### 🔹 Récupérer une commande spécifique
```http
GET /orders/{orderNumber}
Authorization: Bearer {customerToken}
```

**Exemple:**
```http
GET /orders/CMD-748291
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "orderNumber": "CMD-748291",
    "status": "PENDING",
    "total": 87000,
    "items": [...],
    "customer": {
      "name": "Jean Dupont",
      "email": "jean@test.com",
      "phone": "+221781234567"
    },
    "shipping": {
      "address": "123 Rue de la Paix",
      "city": "Dakar (Centre-ville, Plateau, Médina, Fann)",
      "notes": "Livrer entre 9h-18h"
    },
    "createdAt": "2026-08-18T16:00:00.000Z"
  }
}
```

### 🔹 Récupérer l'historique du statut d'une commande
```http
GET /orders/{orderNumber}/history
Authorization: Bearer {customerToken}
```

**Exemple:**
```http
GET /orders/CMD-748291/history
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "status": "PENDING",
      "timestamp": "2026-08-18T16:00:00.000Z",
      "message": "Commande créée"
    },
    {
      "status": "CONFIRMED",
      "timestamp": "2026-08-18T16:05:00.000Z",
      "message": "Commande confirmée"
    }
  ]
}
```

---

## 👨‍💼 6. AUTHENTIFICATION ADMIN

### 🔹 Connexion Admin
```http
POST /admin/login
Content-Type: application/json
```

**Body (requis):**
```json
{
  "email": "admin@bnsservices.sn",
  "password": "SecureAdminPassword123!"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Connexion administrateur réussie !",
  "data": {
    "admin": {
      "id": "uuid-...",
      "name": "Admin BNS",
      "email": "admin@bnsservices.sn",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🔹 Récupérer le profil admin
```http
GET /admin/profile
Authorization: Bearer {adminToken}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "name": "Admin BNS",
    "email": "admin@bnsservices.sn",
    "role": "admin"
  }
}
```

---

## 📋 7. GESTION DES COMMANDES (ADMIN)

### 🔹 Récupérer toutes les commandes
```http
GET /admin/orders
Authorization: Bearer {adminToken}
```

**Paramètres Query (optionnels):**
- `status` - Filtrer par statut
- `startDate` - Date de début (format: YYYY-MM-DD)
- `endDate` - Date de fin (format: YYYY-MM-DD)
- `limit` - Nombre de commandes par page
- `offset` - Décalage

**Exemples:**
```http
GET /admin/orders?status=PENDING
GET /admin/orders?startDate=2026-08-01&endDate=2026-08-31
GET /admin/orders?status=SHIPPED&limit=20
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "count": 15,
  "total": 42,
  "data": [
    {
      "id": "uuid-...",
      "orderNumber": "CMD-748291",
      "status": "PENDING",
      "total": 87000,
      "customer": {
        "name": "Jean Dupont",
        "email": "jean@test.com"
      },
      "createdAt": "2026-08-18T16:00:00.000Z"
    },
    ...
  ]
}
```

### 🔹 Récupérer une commande (Admin)
```http
GET /admin/orders/{orderNumber}
Authorization: Bearer {adminToken}
```

**Exemple:**
```http
GET /admin/orders/CMD-748291
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "orderNumber": "CMD-748291",
    "status": "PENDING",
    "total": 87000,
    "items": [...],
    "customer": {...},
    "shipping": {...},
    "statusHistory": [...]
  }
}
```

### 🔹 Mettre à jour le statut d'une commande
```http
PUT /admin/orders/{orderNumber}/status
Authorization: Bearer {adminToken}
Content-Type: application/json
```

**Exemple:**
```http
PUT /admin/orders/CMD-748291/status
```

**Body (requis):**
```json
{
  "status": "CONFIRMED"
}
```

**Statuts acceptés:**
- `PENDING` - En attente
- `CONFIRMED` - Confirmée
- `PROCESSING` - En traitement
- `SHIPPED` - Expédiée
- `DELIVERED` - Livrée
- `CANCELLED` - Annulée

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Statut de la commande mis à jour",
  "data": {
    "id": "uuid-...",
    "orderNumber": "CMD-748291",
    "status": "CONFIRMED",
    "updatedAt": "2026-08-18T16:05:00.000Z"
  }
}
```

### 🔹 Annuler une commande
```http
DELETE /admin/orders/{orderNumber}
Authorization: Bearer {adminToken}
```

**Exemple:**
```http
DELETE /admin/orders/CMD-748291
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Commande annulée avec succès",
  "data": {
    "orderNumber": "CMD-748291",
    "status": "CANCELLED"
  }
}
```

---

## 📊 RÉSUMÉ DES ROUTES

| Catégorie | Méthode | Route | Auth | Description |
|-----------|---------|-------|------|-------------|
| **Health** | GET | `/health` | ❌ | État de l'API |
| **Catégories** | GET | `/categories` | ❌ | Toutes les catégories |
| | GET | `/categories/{id}` | ❌ | Une catégorie |
| | GET | `/subcategories` | ❌ | Les sous-catégories |
| **Produits** | GET | `/products` | ❌ | Tous les produits |
| | GET | `/products/{slug}` | ❌ | Un produit |
| | POST | `/products` | ✅ Admin | Créer un produit |
| | PUT | `/products/{id}` | ✅ Admin | Mettre à jour |
| | DELETE | `/products/{id}` | ✅ Admin | Supprimer |
| **Auth Client** | POST | `/auth/register` | ❌ | Créer compte |
| | POST | `/auth/login` | ❌ | Se connecter |
| | GET | `/auth/me` | ✅ Client | Mes infos |
| **Commandes** | POST | `/orders` | ✅ Client | Créer commande |
| | GET | `/orders` | ✅ Client | Mes commandes |
| | GET | `/orders/{orderNumber}` | ✅ Client | Une commande |
| | GET | `/orders/{orderNumber}/history` | ✅ Client | Historique |
| **Admin** | POST | `/admin/login` | ❌ | Connexion admin |
| | GET | `/admin/profile` | ✅ Admin | Profil admin |
| | GET | `/admin/orders` | ✅ Admin | Toutes commandes |
| | GET | `/admin/orders/{orderNumber}` | ✅ Admin | Une commande |
| | PUT | `/admin/orders/{orderNumber}/status` | ✅ Admin | Changer statut |
| | DELETE | `/admin/orders/{orderNumber}` | ✅ Admin | Annuler |

---

## 🔑 VARIABLES UTILISÉES

| Variable | Exemple | Récupération |
|----------|---------|--------------|
| `{baseUrl}` | `http://localhost:5000/api` | Config |
| `{adminToken}` | `eyJhbGciOiJIUzI1NiIs...` | `/admin/login` → `data.token` |
| `{customerToken}` | `eyJhbGciOiJIUzI1NiIs...` | `/auth/login` → `data.token` |
| `{productId}` | `webcam-4k` | `/products` → `data[].id` |
| `{orderNumber}` | `CMD-748291` | `/orders` → `data.orderNumber` |
| `{categoryId}` | `informatique` | `/categories` → `data[].id` |

---

## 📝 NOTES IMPORTANTES

1. **Authentification:** Utilise `Authorization: Bearer {token}` dans les headers
2. **Content-Type:** Toujours ajouter `Content-Type: application/json` pour POST/PUT
3. **Slugs:** Utilisés pour identifier les produits (`webcam-4k`, `usb-c-hub`, etc.)
4. **Pagination:** `limit` et `offset` pour paginer les résultats
5. **Filtres:** Utiliser les query params pour filtrer (`?status=PENDING`, `?categoryId=informatique`)
6. **Erreurs:** Vérifier le status HTTP (200, 201, 400, 401, 404, 500)

---

## ✨ PRODUITS DISPONIBLES (Slugs)

```
- webcam-4k
- usb-c-hub
- router-business
- ram-32go
- ssd-1to
- laptop-gaming
- clavier-mecanique
- ecran-4k
- batterie-externe
- adaptateur-multi
```

Utilise ces slugs dans les requêtes!
