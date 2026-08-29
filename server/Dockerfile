FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dependances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dependances
RUN npm ci --omit=dev

# Generer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Commande de demarrage
CMD ["node", "src/server.js"]
