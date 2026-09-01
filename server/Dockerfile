FROM node:20-alpine

WORKDIR /app

# Installer les outils nécessaires pour sharp (native modules)
RUN apk add --no-cache python3 make g++ libc6-compat

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris dev pour prisma CLI)
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Commande de démarrage : push DB puis démarrer le serveur
CMD npx prisma db push --accept-data-loss && node src/server.js
