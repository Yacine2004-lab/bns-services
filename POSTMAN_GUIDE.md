# 📮 POSTMAN - GUIDE D'UTILISATION

## 📥 Importer la Collection

### Étape 1: Télécharger Postman (si ce n'est pas fait)
- Visite [postman.com/downloads](https://www.postman.com/downloads/)
- Télécharge la version **Windows**
- Installe et lance Postman

### Étape 2: Importer la Collection
1. Clique sur le bouton **"Import"** (coin haut-gauche)
2. Sélectionne **"Upload Files"** ou **"Link"**
3. Trouve le fichier `BNS_Services_Postman_Collection.json` 
4. Valide l'import ✅

### Étape 3: Configurer les Variables
Dans Postman, tu verras la collection **"BNS Services - API Collection"** sur la gauche

Clique sur **Collections** → **BNS Services** → **Variables** pour configurer:
- `baseUrl`: `http://localhost:5000/api` (déjà pré-configurée ✅)
- `customerToken`: À remplir après login client
- `adminToken`: À remplir après login admin

---

## 🚀 Tester l'API

### Flux de Test Recommandé

#### 1️⃣ **Health Check** (Sans authentification)
```
GET http://localhost:5000/api/health
```
✅ Clique sur "Send" → Tu verras une réponse 200 OK

#### 2️⃣ **Récupérer les Produits** (Sans authentification)
```
GET http://localhost:5000/api/products?limit=10
```
✅ Tu verras 10 produits avec tous les détails

#### 3️⃣ **Récupérer les Catégories** (Sans authentification)
```
GET http://localhost:5000/api/categories
```
✅ Tu verras 2 catégories avec sous-catégories

#### 4️⃣ **Créer un Compte Client** (Register)
```
POST http://localhost:5000/api/auth/register
```
Modifie l'email à chaque test (ex: `jean.dupont+1@test.com`, etc.)

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "...",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@test.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 5️⃣ **Se Connecter** (Login)
```
POST http://localhost:5000/api/auth/login
```
Utilise les mêmes credentials qu'au register

**Réponse attendue:**
Tu reçois un `token` JWT

**⚠️ IMPORTANT:** 
- Copie le token de la réponse
- Ouvre l'onglet **Variables** (en bas de Postman)
- Colle le token dans `customerToken`

#### 6️⃣ **Récupérer Mes Infos** (Avec authentification)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer {{customerToken}}
```
✅ Tu recevras tes informations client

---

## 🛒 Créer une Commande

### Endpoint: `POST /orders`

**Headers:**
```
Authorization: Bearer {{customerToken}}
Content-Type: application/json
```

**Body:**
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

**Réponse:**
```json
{
  "success": true,
  "data": {
    "order": {
      "orderNumber": "CMD-748291",
      "total": 76000,
      "status": "PENDING",
      "items": [...]
    }
  }
}
```

---

## 👨‍💼 Authentification Admin

### 1️⃣ Connexion Admin
```
POST http://localhost:5000/api/admin/login
```

**Body:**
```json
{
  "email": "admin@bnsservices.sn",
  "password": "SecureAdminPassword123!"
}
```

**Réponse:**
Tu recevras un token JWT admin

**⚠️ IMPORTANT:** 
- Copie le token
- Colle-le dans la variable `adminToken`

### 2️⃣ Récupérer toutes les Commandes (Admin)
```
GET http://localhost:5000/api/admin/orders
Authorization: Bearer {{adminToken}}
```

### 3️⃣ Mettre à jour le Statut d'une Commande
```
PUT http://localhost:5000/api/admin/orders/CMD-123456/status
Authorization: Bearer {{adminToken}}
```

**Body:**
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

---

## 🔧 CONSEILS PRATIQUES

### Copier/Coller les Tokens
1. Après une réponse Login, copie le token
2. Clique sur l'onglet "Variables" en bas
3. Double-clique sur `customerToken` ou `adminToken`
4. Colle le token et valide

### Modifier une Requête
- Clique sur une requête dans la collection
- Modifie les paramètres dans le formulaire
- Clique "Send" pour exécuter

### Voir la Réponse
- La réponse s'affiche en bas dans l'onglet "Body"
- Tu peux voir le statut HTTP (200, 201, 400, etc.)
- Les temps de réponse sont affichés

### Utiliser les Variables
- Utilise `{{baseUrl}}` pour l'URL de base
- Utilise `{{customerToken}}` pour le token client
- Utilise `{{adminToken}}` pour le token admin
- Les variables se remplacent automatiquement

---

## 📝 EXEMPLES DE TESTS

### ✅ Test 1: Parcourir le catalogue
1. Health Check
2. GET Categories
3. GET Products
4. GET Un produit spécifique

### ✅ Test 2: Créer un compte et passer une commande
1. Register (créer compte)
2. Login (se connecter)
3. GET Products (voir les produits)
4. POST Orders (créer commande)
5. GET Orders (voir mes commandes)

### ✅ Test 3: Gestion Admin
1. Admin Login
2. GET Admin Orders (voir toutes les commandes)
3. PUT Order Status (changer le statut)
4. GET Admin Orders (vérifier le changement)

---

## ⚠️ ERREURS COURANTES

| Erreur | Cause | Solution |
|--------|-------|----------|
| **401 Unauthorized** | Token manquant ou invalide | Copie le token après login |
| **404 Not Found** | Produit/commande n'existe pas | Utilise un slug/ID valide |
| **400 Bad Request** | Données invalides | Vérifie le format JSON |
| **Connection refused** | Backend arrêté | Relance `npm run server` |
| **CORS error** | Problème de cross-origin | Vérifie le baseUrl |

---

## 🎯 RÉSUMÉ

| Fonctionnalité | Endpoint | Authentification |
|----------------|----------|------------------|
| Health Check | GET /health | ❌ Non |
| Catégories | GET /categories | ❌ Non |
| Produits | GET /products | ❌ Non |
| Register | POST /auth/register | ❌ Non |
| Login | POST /auth/login | ❌ Non |
| Mes infos | GET /auth/me | ✅ Oui |
| Créer commande | POST /orders | ✅ Oui |
| Mes commandes | GET /orders | ✅ Oui |
| Admin Login | POST /admin/login | ❌ Non |
| Toutes commandes | GET /admin/orders | ✅ Admin |
| Changer statut | PUT /admin/orders/{id}/status | ✅ Admin |

---

## 🚀 PRÊT À TESTER?

1. Télécharge Postman
2. Importe `BNS_Services_Postman_Collection.json`
3. Commence par "Health Check"
4. Suis le flux de test recommandé
5. Amuse-toi! 🎉

Bon test! 💪
