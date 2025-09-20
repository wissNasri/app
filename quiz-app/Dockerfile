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

# --- CORRECTION ---
# L'utilisateur 'nginx' existe déjà dans l'image de base.
# Nous n'avons PAS besoin de le créer.

# 1. Donner les permissions à l'utilisateur 'nginx' existant
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /etc/nginx/conf.d
# On ajoute /etc/nginx/conf.d pour s'assurer qu'il peut lire la config, et on rend le tout récursif.
# On s'assure aussi que le fichier pid peut être créé
RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid

# 2. Passer à l'utilisateur non-root 'nginx'
USER nginx
# --- FIN DE LA CORRECTION ---

# Copie des fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html
# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
