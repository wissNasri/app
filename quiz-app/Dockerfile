FROM node:18

# Créer un utilisateur non-root
RUN useradd --user-group --create-home --shell /bin/bash appuser

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

# Passer à l'utilisateur non-root
USER appuser

EXPOSE 8080

# Ajouter un healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

CMD ["npm", "run", "start"]
