# ÉTAPE 1: Build de l'application React
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# ARG pour l'URL de l'API (utilisé par le build DAST)
ARG VITE_REACT_APP_API_URL=/api
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL
RUN npm run build

# ÉTAPE 2: Service avec Nginx
FROM nginx:1.25-alpine
# Copie des fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html
# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80 (port par défaut de Nginx)
EXPOSE 80

# COMMANDE CRUCIALE : Démarre Nginx en premier plan pour que le conteneur reste actif
CMD ["nginx", "-g", "daemon off;"]
