#!/bin/bash
# INAMSOS Health Check Script

set -e

BASE_URL="${BASE_URL:-http://localhost}"
API_URL="${API_URL:-http://localhost:3001}"
MAX_RETRIES=10
RETRY_DELAY=5

echo "========================================="
echo "INAMSOS Health Check"
echo "========================================="

check_service() {
    local service_name=$1
    local url=$2
    local retries=0

    echo "Checking ${service_name}..."

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s "${url}" > /dev/null 2>&1; then
            echo "✅ ${service_name} is healthy"
            return 0
        else
            retries=$((retries + 1))
            echo "⏳ ${service_name} not ready, attempt ${retries}/${MAX_RETRIES}..."
            sleep $RETRY_DELAY
        fi
    done

    echo "❌ ${service_name} is unhealthy after ${MAX_RETRIES} attempts"
    return 1
}

# Check frontend
check_service "Frontend" "${BASE_URL}/health" || exit 1

# Check backend
check_service "Backend API" "${API_URL}/health" || exit 1

# Check backend detailed health
echo "Checking backend detailed health..."
HEALTH_RESPONSE=$(curl -s "${API_URL}/health")
echo "Health response: ${HEALTH_RESPONSE}"

# Check database connectivity
echo "Checking database connectivity..."
docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
echo "✅ Database is accessible"

# Check Redis connectivity
echo "Checking Redis connectivity..."
docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping || exit 1
echo "✅ Redis is accessible"

echo "========================================="
echo "All health checks passed!"
echo "========================================="

exit 0
