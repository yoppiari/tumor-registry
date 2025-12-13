#!/bin/bash
# INAMSOS Production Deployment Script

set -e

echo "========================================="
echo "INAMSOS Production Deployment"
echo "========================================="
echo "Started at: $(date)"
echo "========================================="

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ .env.production file not found!"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    exit 1
fi

# Create backup before deployment
echo "Creating pre-deployment backup..."
./scripts/backup-database.sh || echo "⚠️  Backup failed, continuing anyway..."

# Pull latest images
echo "Pulling latest Docker images..."
docker-compose -f docker-compose.production.yml pull

# Stop services gracefully
echo "Stopping services..."
docker-compose -f docker-compose.production.yml down --timeout 60

# Remove unused images
echo "Cleaning up unused Docker images..."
docker image prune -f

# Start services
echo "Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.production.yml exec -T backend npx prisma migrate deploy

# Health check
echo "Running health checks..."
./scripts/health-check.sh

echo "========================================="
echo "Deployment completed at: $(date)"
echo "========================================="

exit 0
