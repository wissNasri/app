# ==================================================================
# ÉTAPE 1: "Builder" - Construire l'application React
# On utilise une image Node.js complète mais temporaire.
# ==================================================================
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Accepter l'URL de l'API comme un argument de build
ARG VITE_REACT_APP_API_URL

# Rendre cet argument disponible comme variable d'environnement pour la commande `npm run build`
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL

# Copier uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package.json package-lock.json ./

# Installer les dépendances. Cette étape ne sera ré-exécutée que si package.json change.
RUN npm install

# Copier le reste du code source de l'application
COPY . .

# Construire l'application pour la production.
# Vite va utiliser VITE_REACT_APP_API_URL pour "graver" la bonne URL dans le code.
RUN npm run build


# ==================================================================
# ÉTAPE 2: "Final" - Servir les fichiers statiques avec Nginx
# On utilise une image Nginx très légère, optimisée pour la production.
# ==================================================================
FROM nginx:stable-alpine

# Définir le répertoire de travail du serveur web
WORKDIR /usr/share/nginx/html

# Supprimer le contenu par défaut de Nginx
RUN rm -rf ./*

# Copier UNIQUEMENT les fichiers construits (le dossier /dist) depuis l'étape "builder"
COPY --from=builder /app/dist .

# Exposer le port 80 (port standard pour Nginx)
EXPOSE 80

# Démarrer le serveur Nginx. C'est la commande standard pour la production.
CMD ["nginx", "-g", "daemon off;"]
