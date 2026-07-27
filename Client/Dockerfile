# Build the Vite application separately from the small static web server image.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

# Render supplies PORT at runtime. The official nginx entrypoint renders this
# template before nginx starts, so the container also works with `docker run`.
ENV PORT=10000

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 10000
