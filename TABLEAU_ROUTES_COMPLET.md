# 📊 TABLEAU COMPLET DES ROUTES API

## 🏥 Health & Status

| # | Méthode | Endpoint | Auth | Description | Requête Exemple |
|----|---------|----------|------|-------------|-----------------|
| 1 | GET | `/health` | ❌ | Vérifier que l'API fonctionne | `GET /health` |

---

## 📁 Categories

| # | Méthode | Endpoint | Auth | Description | Requête Exemple |
|----|---------|----------|------|-------------|-----------------|
| 2 | GET | `/categories` | ❌ | Toutes les catégories | `GET /categories` |
| 3 | GET | `/categories/{id}` | ❌ | Une catégorie | `GET /categories/informatique` |
| 4 | GET | `/subcategories` | ❌ | Toutes les sous-catégories | `GET /subcategories` |
| 5 | GET | `/subcategories?categoryId={id}` | ❌ | Sous-cat. d'une catégorie | `GET /subcategories?categoryId=informatique` |

---

## 📦 Products

| # | Méthode | Endpoint | Auth | Description | Requête Exemple |
|----|---------|----------|------|-------------|-----------------|
| 6 | GET | `/products` | ❌ | Tous les produits (pagés) | `GET /products?limit=10&offset=0` |
| 7 | GET | `/products?category={id}` | ❌ | Produits d'une catégorie | `GET /products?category=informatique` |
| 8 | GET | `/products?search={term}` | ❌ | Recherche produits | `GET /products?search=webcam` |
| 9 | GET | `/products?minPrice={p}&maxPrice={p}` | ❌ | Filtrer par prix | `GET /products?minPrice=10000&maxPrice=100000` |
| 10 | GET | `/products/{slug}` | ❌ | Un produit détail | `GET /products/webcam-4k` |
| 11 | POST | `/products` | ✅ Admin | Créer produit | `POST /products` |
| 12 | PUT | `/products/{id}` | ✅ Admin | Modifier produit | `PUT /products/webcam-4k` |
| 13 | DELETE | `/products/{id}` | ✅ Admin | Supprimer produit | `DELETE /products/webcam-4k` |

---

## 🔐 Client Authentication

| # | Méthode | Endpoint | Auth | Description | Requête Exemple | Body |
|----|---------|----------|------|-------------|-----------------|------|
| 14 | POST | `/auth/register` | ❌ | Créer compte client | `POST /auth/register` | `{"firstName":"...", "email":"...", "password":"..."}` |
| 15 | POST | `/auth/login` | ❌ | Se connecter client | `POST /auth/login` | `{"email":"...", "password":"..."}` |
| 16 | GET | `/auth/me` | ✅ Client | Mes infos (client) | `GET /auth/me` with Bearer token | - |
| 17 | POST | `/auth/forgot-password` | ❌ | Réinitialiser mot de passe | `POST /auth/forgot-password` | `{"email":"..."}` |
| 18 | POST | `/auth/reset-password` | ❌ | Valider réinitialisation | `POST /auth/reset-password` | `{"token":"...", "newPassword":"..."}` |

---

## 🛒 Orders (Client)

| # | Méthode | Endpoint | Auth | Description | Requête Exemple | Body |
|----|---------|----------|------|-------------|-----------------|------|
| 19 | POST | `/orders` | ✅ Client | Créer une commande | `POST /orders` | `{"items":[...], "customerName":"...", ...}` |
| 20 | GET | `/orders` | ✅ Client | Mes commandes | `GET /orders` | - |
| 21 | GET | `/orders?status={status}` | ✅ Client | Commandes par statut | `GET /orders?status=PENDING` | - |
| 22 | GET | `/orders/{orderNumber}` | ✅ Client | Détail commande | `GET /orders/CMD-123456` | - |
| 23 | GET | `/orders/{orderNumber}/history` | ✅ Client | Historique statut | `GET /orders/CMD-123456/history` | - |

---

## 👨‍💼 Admin Authentication

| # | Méthode | Endpoint | Auth | Description | Requête Exemple | Body |
|----|---------|----------|------|-------------|-----------------|------|
| 24 | POST | `/admin/login` | ❌ | Connexion admin | `POST /admin/login` | `{"email":"admin@bnsservices.sn", "password":"..."}` |
| 25 | GET | `/admin/profile` | ✅ Admin | Profil admin | `GET /admin/profile` with Bearer token | - |

---

## 📋 Orders Management (Admin)

| # | Méthode | Endpoint | Auth | Description | Requête Exemple | Body |
|----|---------|----------|------|-------------|-----------------|------|
| 26 | GET | `/admin/orders` | ✅ Admin | Toutes les commandes | `GET /admin/orders` | - |
| 27 | GET | `/admin/orders?status={status}` | ✅ Admin | Commandes par statut | `GET /admin/orders?status=PENDING` | - |
| 28 | GET | `/admin/orders?startDate={d}&endDate={d}` | ✅ Admin | Commandes par date | `GET /admin/orders?startDate=2026-08-01&endDate=2026-08-31` | - |
| 29 | GET | `/admin/orders/{orderNumber}` | ✅ Admin | Détail commande (admin) | `GET /admin/orders/CMD-123456` | - |
| 30 | PUT | `/admin/orders/{orderNumber}/status` | ✅ Admin | Changer statut | `PUT /admin/orders/CMD-123456/status` | `{"status":"CONFIRMED"}` |
| 31 | DELETE | `/admin/orders/{orderNumber}` | ✅ Admin | Annuler commande | `DELETE /admin/orders/CMD-123456` | - |

---

## 📈 STATISTIQUES COMPLÈTES

- **Total Routes:** 31
- **Sans Authentification:** 13
- **Avec Authentification Client:** 5
- **Avec Authentification Admin:** 9
- **POST Requests:** 6
- **GET Requests:** 22
- **PUT Requests:** 2
- **DELETE Requests:** 2

---

## 🔑 AUTHENTIFICATION

### Headers requis:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Tokens disponibles:
- `customerToken` - Obtenu via `/auth/login`
- `adminToken` - Obtenu via `/admin/login`

---

## 📊 STATUTS COMMANDE VALIDES

```
PENDING (En attente)
CONFIRMED (Confirmée)
PROCESSING (En traitement)
SHIPPED (Expédiée)
DELIVERED (Livrée)
CANCELLED (Annulée)
```

---

## 💳 MÉTHODES DE PAIEMENT

```
CASH_ON_DELIVERY (Paiement à la livraison)
BANK_TRANSFER (Virement bancaire)
CARD (Carte bancaire)
```

---

## 🏷️ PRODUITS DISPONIBLES (Slugs)

| Slug | Nom | Prix | Stock |
|------|-----|------|-------|
| `webcam-4k` | Webcam 4K HD | 33,000 XOF | 13 |
| `usb-c-hub` | Hub USB-C 7 ports | 21,000 XOF | 26 |
| `router-business` | Routeur Business WiFi 6 | 93,000 XOF | 10 |
| `ram-32go` | Mémoire RAM 32 Go | 65,000 XOF | 18 |
| `ssd-1to` | SSD NVMe 1 To | 56,000 XOF | 40 |
| `laptop-gaming` | Laptop Gaming ASUS | 450,000 XOF | 5 |
| `clavier-mecanique` | Clavier Mécanique RGB | 45,000 XOF | 12 |
| `ecran-4k` | Écran 4K 27" | 125,000 XOF | 8 |
| `batterie-externe` | Batterie Externe 20000mAh | 18,000 XOF | 30 |
| `adaptateur-multi` | Adaptateur Multi USB | 12,000 XOF | 50 |

---

## 🌍 CITIES DISPONIBLES (Shipping)

```
Dakar (Centre-ville, Plateau, Médina, Fann)
Dakar (Almadies, Ngor, Ouakam, Yoff, Mermoz)
Pikine / Guédiawaye
Rufisque / Diamniadio
Thiès / Mbour / Saly
Saint-Louis
Autre région du Sénégal
```

---

## 📝 EXEMPLE COMPLET DE FLUX

### 1. Récupérer les produits
```
GET http://localhost:5000/api/products?limit=5
```

### 2. Créer un compte
```
POST http://localhost:5000/api/auth/register
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@test.com",
  "phone": "+221781234567",
  "password": "SecurePassword123!"
}
Response: { "token": "eyJ..." }
```

### 3. Se connecter
```
POST http://localhost:5000/api/auth/login
{
  "email": "jean@test.com",
  "password": "SecurePassword123!"
}
Response: { "token": "eyJ..." }
```

### 4. Créer une commande
```
POST http://localhost:5000/api/orders
Authorization: Bearer eyJ...
{
  "items": [
    { "slug": "webcam-4k", "quantity": 1 },
    { "slug": "usb-c-hub", "quantity": 2 }
  ],
  "customerName": "Jean Dupont",
  "customerPhone": "+221781234567",
  "customerEmail": "jean@test.com",
  "shippingAddress": "123 Rue",
  "shippingCity": "Dakar (Centre-ville, Plateau, Médina, Fann)",
  "paymentMethod": "CASH_ON_DELIVERY"
}
Response: { "orderNumber": "CMD-123456", "total": 75000 }
```

### 5. Admin - Voir les commandes
```
POST http://localhost:5000/api/admin/login
{
  "email": "admin@bnsservices.sn",
  "password": "SecureAdminPassword123!"
}
Response: { "token": "eyJ..." }
```

### 6. Admin - Changer le statut
```
PUT http://localhost:5000/api/admin/orders/CMD-123456/status
Authorization: Bearer eyJ...
{
  "status": "CONFIRMED"
}
```

---

## ✨ RÉSUMÉ VISUEL

```
┌─ HEALTH
│
├─ PRODUCTS (Public)
│  ├─ List
│  ├─ Search
│  ├─ Filter
│  ├─ Detail
│  ├─ Create (Admin)
│  ├─ Update (Admin)
│  └─ Delete (Admin)
│
├─ CATEGORIES (Public)
│  ├─ List
│  ├─ Detail
│  └─ SubCategories
│
├─ CLIENT
│  ├─ Register (Public)
│  ├─ Login (Public)
│  ├─ Profile (Private)
│  ├─ Orders
│  │  ├─ Create
│  │  ├─ List
│  │  ├─ Detail
│  │  └─ History
│  └─ Password (Public)
│     ├─ Forgot
│     └─ Reset
│
└─ ADMIN
   ├─ Login (Public)
   ├─ Profile (Private)
   └─ Orders
      ├─ List
      ├─ Detail
      ├─ Update Status
      └─ Cancel
```

---

**Total: 31 routes testées et documentées ✅**
