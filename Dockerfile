FROM node:20-alpine

WORKDIR /app

# Copier uniquement le dossier server
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/

# Installer les dependances du backend
RUN cd server && npm ci --omit=dev

# Generer le client Prisma (le db push se fait au demarrage car la DB n'est pas accessible au build)
RUN cd server && npx prisma generate

# Copier le code du backend
COPY server/ ./server/

# Exposer le port
EXPOSE 5000

# Commande de demarrage : appliquer le schema, maj email admin, puis lancer le serveur
CMD ["sh", "-c", "cd server && npx prisma db push --accept-data-loss && node prisma/ensure-admin-email.js && node src/server.js"]
