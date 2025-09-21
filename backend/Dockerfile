FROM node:18

# Créer un utilisateur non-root
RUN useradd --user-group --create-home --shell /bin/bash appuser

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app






COPY package*.json ./
RUN npm install

COPY . .

# Passer à l'utilisateur non-root
USER appuser

EXPOSE 3000

# Ajouter un healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "run", "start"]
