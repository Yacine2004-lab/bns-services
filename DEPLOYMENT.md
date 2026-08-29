# Guide de déploiement VPS — BNS Services

## Prérequis
- Un VPS Ubuntu 22.04+ (DigitalOcean, OVH, Linode, etc.)
- Un nom de domaine pointant vers l'IP du VPS (ex: bnsservices.sn)
- Accès SSH root

## 1. Connexion au serveur

```bash
ssh root@TON_IP_VPS
```

## 2. Installation des dépendances

```bash
# Mise à jour système
apt update && apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PostgreSQL 15
apt install -y postgresql postgresql-contrib

# Nginx (reverse proxy + SSL)
apt install -y nginx certbot python3-certbot-nginx

# Git (optionnel, pour cloner le repo)
apt install -y git
```

## 3. Configuration PostgreSQL

```bash
# Démarrer PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Créer la base de données et l'utilisateur
sudo -u postgres psql
```

Dans le prompt PostgreSQL :
```sql
CREATE USER bns_user WITH PASSWORD 'ton_mot_de_passe_fort';
CREATE DATABASE bns_services_db OWNER bns_user;
GRANT ALL PRIVILEGES ON DATABASE bns_services_db TO bns_user;
\q
```

## 4. Déploiement du code

### Option A : Via Git (recommandé)
```bash
cd /var/www
git clone TON_REPO_GIT bns-services
cd bns-services
```

### Option B : Via SCP (upload manuel)
```bash
# Depuis ta machine locale
scp -r . root@TON_IP_VPS:/var/www/bns-services
```

## 5. Configuration backend

```bash
cd /var/www/bns-services/server

# Installer les dépendances
npm install --production

# Générer des secrets JWT forts
node -e "console.log('CUSTOMER:', require('crypto').randomBytes(48).toString('base64url'))"
node -e "console.log('ADMIN:', require('crypto').randomBytes(48).toString('base64url'))"
```

Créer le fichier `.env` :
```bash
nano .env
```

Contenu :
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://bnsservices.sn

# Secrets JWT (utiliser ceux générés ci-dessus)
JWT_CUSTOMER_SECRET=colle_ici_le_secret_customer
JWT_ADMIN_SECRET=colle_ici_le_secret_admin
JWT_EXPIRES_IN=7d

# PostgreSQL
DATABASE_URL="postgresql://bns_user:ton_mot_de_passe_fort@localhost:5432/bns_services_db?schema=public"
```

Initialiser la base de données :
```bash
npx prisma generate
npx prisma migrate deploy

# Seed initial (optionnel, pour créer un admin)
node prisma/seed.js
```

## 6. Configuration frontend

```bash
cd /var/www/bns-services

# Créer le fichier .env.production
nano .env.production
```

Contenu :
```env
VITE_API_URL=https://bnsservices.sn/api
```

Builder le frontend :
```bash
npm run build
```

## 7. Service systemd (backend)

Créer le fichier service :
```bash
nano /etc/systemd/system/bns-backend.service
```

Contenu :
```ini
[Unit]
Description=BNS Services Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/bns-services/server
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activer et démarrer :
```bash
systemctl daemon-reload
systemctl enable bns-backend
systemctl start bns-backend
systemctl status bns-backend
```

## 8. Configuration Nginx

Créer la configuration :
```bash
nano /etc/nginx/sites-available/bns-services
```

Contenu (remplace `bnsservices.sn` par ton domaine) :
```nginx
server {
    listen 80;
    server_name bnsservices.sn www.bnsservices.sn;

    # Frontend (fichiers statiques)
    root /var/www/bns-services/dist;
    index index.html;

    # API backend (reverse proxy)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads (images produits)
    location /uploads {
        alias /var/www/bns-services/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Activer le site :
```bash
ln -s /etc/nginx/sites-available/bns-services /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 9. SSL avec Let's Encrypt

```bash
certbot --nginx -d bnsservices.sn -d www.bnsservices.sn
```

Suivre les instructions (email, acceptation des conditions).

Certbot va automatiquement modifier la config Nginx pour HTTPS.

## 10. Vérification

```bash
# Tester le backend
curl http://localhost:5000/api/health

# Tester le frontend
curl http://localhost

# Vérifier les services
systemctl status bns-backend
systemctl status nginx
systemctl status postgresql
```

Ouvrir dans un navigateur : `https://bnsservices.sn`

## 11. Maintenance

### Logs
```bash
# Backend
journalctl -u bns-backend -f

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Redémarrage
```bash
systemctl restart bns-backend
systemctl restart nginx
```

### Mise à jour du code
```bash
cd /var/www/bns-services
git pull
cd server
npm install --production
npx prisma migrate deploy
cd ..
npm run build
systemctl restart bns-backend
```

### Sauvegarde base de données
```bash
# Backup
pg_dump -U bns_user bns_services_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U bns_user bns_services_db < backup_20240101.sql
```

## 12. Sécurité additionnelle (optionnel)

### Firewall
```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### Fail2Ban (protection brute-force)
```bash
apt install fail2ban
systemctl enable fail2ban
```

---

**Commandes rapides :**
- Voir les logs backend : `journalctl -u bns-backend -f`
- Redémarrer backend : `systemctl restart bns-backend`
- Redémarrer Nginx : `systemctl restart nginx`
- Tester la config Nginx : `nginx -t`
