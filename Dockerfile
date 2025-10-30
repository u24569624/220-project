FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build frontend (this creates the dist folder)
RUN npm run build

# Expose both ports
EXPOSE 3000 5000

# Start the server (which should serve the built frontend)
CMD ["node", "backend/server.js"]