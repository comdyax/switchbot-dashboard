# ---- build stage: compile the Vite bundle with Node ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (cached unless package*.json changes). npm ci needs the
# lockfile and installs devDeps too — Vite lives there and is needed to build.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve stage: ship only static files behind nginx ----
FROM nginx:1.27-alpine

# Our server config (SPA fallback + /api proxy) replaces the default site.
COPY nginx.conf /etc/nginx/conf.d/default.conf
# The built bundle from the previous stage.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# nginx:alpine's base image already runs: nginx -g 'daemon off;'
