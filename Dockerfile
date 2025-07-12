# Use Node.js 20 base image
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  chromium \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install NPM dependencies
RUN npm install

# Expose port for health checks
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
