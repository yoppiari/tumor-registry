#!/bin/bash

# INAMSOS Development Environment Setup Script
# This script sets up the complete development environment

set -e

echo "🏥 Setting up INAMSOS Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are installed"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating .env file from template..."
    cp .env.example .env
    print_status ".env file created"
else
    print_status ".env file already exists"
fi

# Create logs directories
mkdir -p backend/logs
print_status "Created logs directories"

# Stop any existing containers
print_warning "Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check if containers are running
echo "🔍 Checking container status..."
if docker-compose ps | grep -q "Up"; then
    print_status "All containers are running"
else
    print_error "Some containers failed to start"
    docker-compose ps
    exit 1
fi

# Check database connection
echo "🗄️ Testing database connection..."
if docker-compose exec -T postgres pg_isready -U inamsos -d inamsos &> /dev/null; then
    print_status "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Check Redis connection
echo "📦 Testing Redis connection..."
if docker-compose exec -T redis redis-cli ping &> /dev/null; then
    print_status "Redis connection successful"
else
    print_error "Redis connection failed"
    exit 1
fi

# Check backend health
echo "🔍 Testing backend health..."
sleep 5
if curl -f http://localhost:3001/api/v1/health &> /dev/null; then
    print_status "Backend health check passed"
else
    print_warning "Backend health check failed (may still be starting)"
fi

# Check frontend availability
echo "🖥️ Testing frontend availability..."
sleep 5
if curl -f http://localhost:3000 &> /dev/null; then
    print_status "Frontend is accessible"
else
    print_warning "Frontend not yet accessible (may still be starting)"
fi

# Display access information
echo ""
echo "🎉 INAMSOS Development Environment is ready!"
echo ""
echo "📱 Access URLs:"
echo "  Frontend:           http://localhost:3000"
echo "  Backend API:        http://localhost:3001"
echo "  API Documentation:  http://localhost:3001/api/docs"
echo "  Health Check:       http://localhost/health"
echo "  MinIO Console:      http://localhost:9001"
echo ""
echo "👤 Default Login:"
echo "  Email:    admin@inamsos.id"
echo "  Password: admin123"
echo ""
echo "🔧 Useful Commands:"
echo "  View logs:         docker-compose logs -f [service]"
echo "  Stop environment:  docker-compose down"
echo "  Restart service:   docker-compose restart [service]"
echo "  Access database:   docker-compose exec postgres psql -U inamsos -d inamsos"
echo ""
echo "📚 Documentation:"
echo "  README.md          - Setup and development guide"
echo "  docs/prd.md        - Product requirements"
echo "  docs/architecture.md - Technical architecture"
echo "  docs/sprint-plan.md - Implementation roadmap"
echo ""

print_status "Setup completed successfully!"