# 🚀 ROUTES API - RÉFÉRENCE RAPIDE

## Base URL
```
http://localhost:5000/api
```

---

## 🏥 HEALTH CHECK
```
GET /health
```

---

## 📁 CATÉGORIES
```
GET /categories
GET /categories/{categoryId}
GET /subcategories
GET /subcategories?categoryId=informatique
```

---

## 📦 PRODUITS
```
GET /products?limit=10&offset=0
GET /products/{slug}
POST /products (Admin)
PUT /products/{id} (Admin)
DELETE /products/{id} (Admin)
```

**Slugs disponibles:**
```
webcam-4k
usb-c-hub
router-business
ram-32go
ssd-1to
laptop-gaming
clavier-mecanique
ecran-4k
batterie-externe
adaptateur-multi
```

---

## 🔐 AUTHENTIFICATION CLIENT
```
POST /auth/register
Body: {
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@test.com",
  "phone": "+221781234567",
  "password": "SecurePassword123!"
}
Response: { "token": "..." }
```

```
POST /auth/login
Body: {
  "email": "jean@test.com",
  "password": "SecurePassword123!"
}
Response: { "token": "..." }
```

```
GET /auth/me
Header: Authorization: Bearer {customerToken}
```

---

## 🛒 COMMANDES
```
POST /orders (Requis: customerToken)
Body: {
  "items": [
    { "slug": "webcam-4k", "quantity": 1 },
    { "slug": "usb-c-hub", "quantity": 2 }
  ],
  "customerName": "Jean Dupont",
  "customerPhone": "+221781234567",
  "customerEmail": "jean@test.com",
  "shippingAddress": "123 Rue",
  "shippingCity": "Dakar (Centre-ville, Plateau, Médina, Fann)",
  "shippingNotes": "Livrer entre 9h-18h",
  "paymentMethod": "CASH_ON_DELIVERY"
}
Response: { "orderNumber": "CMD-123456", "token": "..." }
```

```
GET /orders (Requis: customerToken)
GET /orders/{orderNumber} (Requis: customerToken)
GET /orders/{orderNumber}/history (Requis: customerToken)
```

---

## 👨‍💼 AUTHENTIFICATION ADMIN
```
POST /admin/login
Body: {
  "email": "admin@bnsservices.sn",
  "password": "SecureAdminPassword123!"
}
Response: { "token": "..." }
```

```
GET /admin/profile (Requis: adminToken)
```

---

## 📋 COMMANDES (ADMIN)
```
GET /admin/orders (Requis: adminToken)
GET /admin/orders?status=PENDING
GET /admin/orders?startDate=2026-08-01&endDate=2026-08-31
GET /admin/orders/{orderNumber} (Requis: adminToken)
```

```
PUT /admin/orders/{orderNumber}/status (Requis: adminToken)
Body: {
  "status": "CONFIRMED"
}
Statuts: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED
```

```
DELETE /admin/orders/{orderNumber} (Requis: adminToken)
```

---

## 🔑 HEADERS

### Requis pour authentification:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Pour POST/PUT/DELETE:
```
Content-Type: application/json
```

---

## 📊 STATUTS HTTP
```
200 OK - Succès
201 Created - Créé
400 Bad Request - Données invalides
401 Unauthorized - Authentification requise
404 Not Found - Ressource non trouvée
409 Conflict - Conflit (email existant)
422 Unprocessable Entity - Validation erreur
500 Server Error - Erreur serveur
```

---

## 💡 FLUX COMPLET

### Client:
```
1. GET /health → Vérifier API
2. GET /products → Voir produits
3. POST /auth/register → Créer compte
4. POST /auth/login → Se connecter (copier token)
5. POST /orders → Créer commande
6. GET /orders → Voir mes commandes
```

### Admin:
```
1. POST /admin/login → Se connecter (copier token)
2. GET /admin/orders → Voir commandes
3. PUT /admin/orders/{orderNumber}/status → Changer statut
4. DELETE /admin/orders/{orderNumber} → Annuler
```

---

## ✨ COPIE-COLLE PRÊT

### Health Check
```
GET http://localhost:5000/api/health
```

### Produits
```
GET http://localhost:5000/api/products?limit=10
GET http://localhost:5000/api/products/webcam-4k
```

### Catégories
```
GET http://localhost:5000/api/categories
GET http://localhost:5000/api/subcategories
```

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "phone": "+221781111111",
  "password": "TestPass123!"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

### Créer Commande
```
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "items": [
    { "slug": "webcam-4k", "quantity": 1 }
  ],
  "customerName": "Test User",
  "customerPhone": "+221781111111",
  "customerEmail": "test@example.com",
  "shippingAddress": "123 Rue Test",
  "shippingCity": "Dakar (Centre-ville, Plateau, Médina, Fann)",
  "shippingNotes": "Livrer entre 9h-18h",
  "paymentMethod": "CASH_ON_DELIVERY"
}
```

### Admin Login
```
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@bnsservices.sn",
  "password": "SecureAdminPassword123!"
}
```

### Admin Get Orders
```
GET http://localhost:5000/api/admin/orders
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

### Admin Change Status
```
PUT http://localhost:5000/api/admin/orders/CMD-123456/status
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```
