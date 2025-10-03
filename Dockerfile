FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -la /app/frontend/src/styles/
RUN ls -la /app/frontend/src/components/
# Build frontend
RUN npm run build

# Expose ports 
EXPOSE 5000

CMD ["node", "backend/server.js"]