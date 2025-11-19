#!/bin/bash

# INAMSOS Production Deployment Script
# This script deploys the INAMSOS tumor registry application to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="inamosos"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="./backups/pre-deploy-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="./logs/deploy-$(date +%Y%m%d-%H%M%S).log"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check if Docker is installed
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check if Docker Compose is installed
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check if we're in the right directory
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        print_error "Docker Compose file not found. Make sure you're in the project root directory."
        exit 1
    fi

    print_status "Prerequisites check passed ✓"
}

# Function to create backup before deployment
create_backup() {
    print_status "Creating backup before deployment..."

    # Create backup directory
    mkdir -p "$BACKUP_DIR"

    # Backup database
    if docker ps | grep -q inamsos-postgres; then
        print_info "Backing up PostgreSQL database..."
        docker exec inamosos-postgres pg_dump -U inamsos_user inamsos_prod > "$BACKUP_DIR/database.sql"
        print_status "Database backup completed ✓"
    fi

    # Backup current application files
    print_info "Backing up application files..."
    cp -r ./uploads "$BACKUP_DIR/" 2>/dev/null || true
    cp -r ./config "$BACKUP_DIR/" 2>/dev/null || true
    cp -r ./logs "$BACKUP_DIR/" 2>/dev/null || true

    print_status "Backup completed ✓"
}

# Function to build and deploy application
deploy_application() {
    print_status "Building and deploying application..."

    # Pull latest images
    print_info "Pulling latest base images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull

    # Build application image
    print_info "Building application image..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache app

    # Stop existing services
    print_info "Stopping existing services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down

    # Start new services
    print_info "Starting new services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

    print_status "Application deployed ✓"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."

    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    sleep 30

    # Run Prisma migrations
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec app npm run db:migrate

    print_status "Database migrations completed ✓"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."

    # Wait for services to be ready
    sleep 60

    # Check application health
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Application health check passed ✓"
    else
        print_error "Application health check failed"
        return 1
    fi

    # Check database connectivity
    if docker exec inamosos-postgres pg_isready -U inamsos_user -d inamsos_prod > /dev/null 2>&1; then
        print_status "Database connectivity check passed ✓"
    else
        print_error "Database connectivity check failed"
        return 1
    fi

    # Check Redis connectivity
    if docker exec inamosos-redis redis-cli ping > /dev/null 2>&1; then
        print_status "Redis connectivity check passed ✓"
    else
        print_error "Redis connectivity check failed"
        return 1
    fi

    print_status "Deployment verification completed ✓"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    echo ""
    print_info "Application URL: https://api.inamsos.go.id"
    print_info "Admin Panel: https://admin.inamsos.go.id"
    print_info "Monitoring: http://localhost:9090 (Prometheus)"
    print_info "Dashboards: http://localhost:3001 (Grafana)"
}

# Function to rollback in case of failure
rollback() {
    print_error "Deployment failed. Rolling back..."

    # Restore from backup if it exists
    if [ -d "$BACKUP_DIR" ]; then
        print_info "Restoring from backup..."

        # Restore database
        if [ -f "$BACKUP_DIR/database.sql" ]; then
            docker exec -i inamosos-postgres psql -U inamsos_user -d inamsos_prod < "$BACKUP_DIR/database.sql"
        fi

        # Restore application files
        cp -r "$BACKUP_DIR/uploads" ./ 2>/dev/null || true
        cp -r "$BACKUP_DIR/config" ./ 2>/dev/null || true
    fi

    # Restart previous version
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    # Implementation would depend on your previous version management strategy

    print_status "Rollback completed"
}

# Main deployment function
main() {
    print_status "Starting INAMOS Production Deployment"
    print_info "Deployment started at $(date)"
    print_info "Backup directory: $BACKUP_DIR"
    echo ""

    # Create log directory
    mkdir -p ./logs

    # Redirect all output to log file
    exec > >(tee -a "$LOG_FILE")
    exec 2>&1

    # Deployment steps
    check_prerequisites
    create_backup

    # Deploy with rollback on error
    if deploy_application && run_migrations && verify_deployment; then
        show_status
        print_status "🎉 Deployment completed successfully!"
        print_info "Backup stored at: $BACKUP_DIR"
        print_info "Deployment log: $LOG_FILE"
    else
        rollback
        print_error "❌ Deployment failed. Check logs for details."
        exit 1
    fi
}

# Parse command line arguments
case "${1:-}" in
    "backup-only")
        check_prerequisites
        create_backup
        print_status "Backup completed successfully"
        ;;
    "verify-only")
        verify_deployment
        ;;
    "rollback")
        rollback
        ;;
    "help"|"-h"|"--help")
        echo "INAMOS Production Deployment Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  (none)       Full deployment"
        echo "  backup-only   Create backup only"
        echo "  verify-only   Verify current deployment"
        echo "  rollback      Rollback to previous version"
        echo "  help          Show this help message"
        echo ""
        exit 0
        ;;
    *)
        main
        ;;
esac