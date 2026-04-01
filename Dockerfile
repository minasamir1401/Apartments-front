FROM node:20-alpine

WORKDIR /app

# Install Chromium and dependencies for react-snap (Puppeteer)
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the static server
CMD ["npm", "start"]
