# Dockerfile pour le frontend React de Santhium
# Version optimisée avec gestion flexible des dépendances

# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
# Note: npm install est utilisé car il gère mieux les cas où package-lock.json 
# n'est pas présent ou n'est pas synchronisé
RUN npm install

# Copier le code source
COPY . .

# Build de l'application React
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]