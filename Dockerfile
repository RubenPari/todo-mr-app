# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copia file di definizione delle dipendenze e usa npm ci per build riproducibili.
COPY package*.json ./
RUN npm ci

# Copia il resto del codice e compila l'app Nest.
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Installa solo le dipendenze runtime usando il lockfile.
COPY package*.json ./
RUN npm ci --omit=dev

# Copia il codice compilato dal layer di build.
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
