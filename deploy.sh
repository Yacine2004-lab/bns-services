#!/bin/bash
# Script de déploiement rapide pour BNS Services sur VPS
# Usage: bash deploy.sh

set -e

echo "🚀 Déploiement BNS Services..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifier qu'on est root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ce script doit être exécuté en root"
  exit 1
fi

# Variables (à modifier)
DOMAIN="bnsservices.sn"
APP_DIR="/var/www/bns-services"
DB_USER="bns_user"
DB_NAME="bns_services_db"
DB_PASS="CHANGE_ME_STRONG_PASSWORD"

echo -e "${BLUE}📦 Installation des dépendances système...${NC}"
apt update && apt upgrade -y
apt install -y nodejs npm postgresql nginx certbot python3-certbot-nginx git

echo -e "${BLUE}🗄️  Configuration PostgreSQL...${NC}"
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql <<EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

echo -e "${BLUE}📁 Déploiement du code...${NC}"
if [ ! -d "$APP_DIR" ]; then
  mkdir -p $APP_DIR
  echo "⚠️  Copie les fichiers du projet dans $APP_DIR"
  echo "   Exemple: scp -r . root@IP_VPS:$APP_DIR"
  exit 1
fi

cd $APP_DIR/server

echo -e "${BLUE}📦 Installation des dépendances backend...${NC}"
npm install --production

echo -e "${BLUE}🔑 Génération des secrets JWT...${NC}"
CUSTOMER_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
ADMIN_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")

echo -e "${BLUE}⚙️  Configuration .env...${NC}"
cat > .env <<EOF
NODE_ENV=production
PORT=5000
CLIENT_URL=https://${DOMAIN}
JWT_CUSTOMER_SECRET=${CUSTOMER_SECRET}
JWT_ADMIN_SECRET=${ADMIN_SECRET}
JWT_EXPIRES_IN=7d
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?schema=public"
EOF

echo -e "${BLUE}🗄️  Initialisation de la base de données...${NC}"
npx prisma generate
npx prisma migrate deploy

echo -e "${BLUE}🎨 Build du frontend...${NC}"
cd $APP_DIR
cat > .env.production <<EOF
VITE_API_URL=https://${DOMAIN}/api
EOF
npm run build

echo -e "${BLUE}⚙️  Configuration du service systemd...${NC}"
cat > /etc/systemd/system/bns-backend.service <<EOF
[Unit]
Description=BNS Services Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}/server
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable bns-backend
systemctl start bns-backend

echo -e "${BLUE}🌐 Configuration Nginx...${NC}"
cat > /etc/nginx/sites-available/bns-services <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    root ${APP_DIR}/dist;
    index index.html;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias ${APP_DIR}/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/bns-services /etc/nginx/sites-enabled/bns-services
nginx -t
systemctl restart nginx

echo -e "${BLUE}🔒 Configuration SSL...${NC}"
echo "⚠️  Assure-toi que le DNS pointe vers ce serveur"
echo "   Puis exécute: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"

echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Configure le DNS: ${DOMAIN} → $(curl -s ifconfig.me)"
echo "   2. Active SSL: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "   3. Crée un admin: cd ${APP_DIR}/server && node prisma/seed.js"
echo "   4. Vérifie: https://${DOMAIN}"
echo ""
echo "🔧 Commandes utiles :"
echo "   - Logs backend: journalctl -u bns-backend -f"
echo "   - Restart backend: systemctl restart bns-backend"
echo "   - Restart nginx: systemctl restart nginx"
