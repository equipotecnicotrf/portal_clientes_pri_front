# Utiliza una imagen base de Node.js para construir la aplicación
FROM node:alpine AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de tu aplicación al directorio de trabajo
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto de tu aplicación
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa final, utiliza una imagen de Nginx
FROM nginx:alpine

# Copia los archivos de construcción de la etapa anterior a la ubicación de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia una configuración personalizada de Nginx si es necesario (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 8080
EXPOSE 83

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
