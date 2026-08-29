FROM node:20-alpine

WORKDIR /app

# Copier uniquement le dossier server
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/

# Installer les dependances du backend
RUN cd server && npm ci --omit=dev

# Generer le client Prisma
RUN cd server && npx prisma generate

# Copier le code du backend
COPY server/ ./server/

# Exposer le port
EXPOSE 5000

# Commande de demarrage
CMD ["node", "server/src/server.js"]
