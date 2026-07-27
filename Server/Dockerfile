# Production image for the AIROMOTION API. Build from the Server directory.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

ENV NODE_ENV=production \
    PORT=10000

EXPOSE 10000

CMD ["npm", "start"]
