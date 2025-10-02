# FROM node:24-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN chmod +x node_modules/.bin/*
# RUN npx vite build

# # production stage
# FROM nginx:latest as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Этап сборки
FROM node:24-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x node_modules/.bin/*
RUN npx vite build

# Этап продакшена с Nginx
FROM nginx:latest as production-stage
LABEL maintainer="your.email@example.com"

# Копируем собранный фронтенд в директорию Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]