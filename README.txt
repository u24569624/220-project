# IMY 220 Project - Version Control Website

## Commands to Run the Project

### Option 1: Docker Compose (Recommended)

# 1. Build and run all services
docker-compose up --build

# 2. Access the application
# Frontend: http://localhost:5000
# Backend API: http://localhost:5000
# Test login: test@test.com / test1234

### Stop Commands:

# Stop Docker Compose
docker-compose down

# Stop single container
docker stop version-control-website

### Option 2: Single Dockerfile

# 1. Build Docker image
docker build -t version-control-website .

# 2. Run container with environment variable
docker run -p 3000:3000 -p 5000:5000 -e MONGO_URI from env.

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000

# GitHub: https://github.com/u24569624/220-project.git