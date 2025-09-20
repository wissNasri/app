# ÉTAPE 1: Build de l'application React
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_REACT_APP_API_URL=/api
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL
RUN npm run build

# ÉTAPE 2: Service avec Nginx sécurisé (non-root)
FROM nginx:1.25-alpine

# --- AJOUTS POUR LE MODE NON-ROOT ---
# 1. Créer un utilisateur et un groupe 'nginx'
RUN addgroup -S nginx && adduser -S nginx -G nginx

# 2. Donner les permissions à l'utilisateur nginx sur les répertoires nécessaires
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx

# 3. Passer à l'utilisateur non-root
USER nginx
# --- FIN DES AJOUTS ---

# Copie des fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html
# Copie de la configuration Nginx (nous allons la modifier aussi)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
