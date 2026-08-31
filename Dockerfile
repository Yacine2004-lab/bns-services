FROM node:20-alpine
LABEL rebuild="v3-20260831"

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

EXPOSE 5000

# Au demarrage : schema + serveur (l'email admin est mis a jour dans server.js)
CMD ["sh", "-c", "cd server && npx prisma db push --accept-data-loss && node src/server.js"]
