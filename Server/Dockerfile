# Production image for the AIROMOTION API. Build from the Server directory.

FROM node:22-bookworm

# Install ClamAV
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        clamav \
        clamav-daemon && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application
COPY . .

# Update ClamAV database
RUN freshclam || true

# Copy startup script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production

EXPOSE 10000

ENTRYPOINT ["docker-entrypoint.sh"]