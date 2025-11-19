#!/bin/bash

# INAMSOS Production Deployment Script
# Zero-downtime deployment with rollback capability

set -euo pipefail

# Configuration
PROJECT_NAME="inamsos"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="/backup/deployments"
ROLLBACK_DIR="/backup/rollback"
HEALTH_CHECK_TIMEOUT=300
MAX_DEPLOYMENT_TIME=1800
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] [$level] $message${NC}"
    echo "[$timestamp] [$level] $message" >> "/var/log/inamos/deployment.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "/var/log/inamos/deployment.log"
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "/var/log/inamos/deployment.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "/var/log/inamos/deployment.log"
}

# Send notification
send_notification() {
    local status="$1"
    local message="$2"
    local priority="${3:-normal}"

    local color="good"
    [[ "$status" == "FAILED" ]] && color="danger"
    [[ "$status" == "WARNING" ]] && color="warning"

    # Slack notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"INAMSOS Deployment $status\",
                    \"text\": \"$message\",
                    \"footer\": \"Production Deployment\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi

    # Email notification (if configured)
    if command -v mail > /dev/null 2>&1 && [[ -n "${DEPLOYMENT_EMAIL:-}" ]]; then
        echo "$message" | mail -s "INAMSOS Deployment $status" "$DEPLOYMENT_EMAIL"
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    info "Running pre-deployment checks..."

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running"
        return 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose > /dev/null 2>&1; then
        error "docker-compose is not installed"
        return 1
    fi

    # Check environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found"
        return 1
    fi

    # Load environment variables
    source "$ENV_FILE"

    # Check required environment variables
    local required_vars=("DB_PASSWORD" "REDIS_PASSWORD" "JWT_SECRET" "MINIO_ACCESS_KEY" "MINIO_SECRET_KEY")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            error "Required environment variable $var is not set"
            return 1
        fi
    done

    # Check available disk space
    local available_space=$(df / | awk 'NR==2 {print $4}')
    local required_space=10485760  # 10GB in KB

    if [[ $available_space -lt $required_space ]]; then
        error "Insufficient disk space for deployment. Available: $((available_space/1024/1024))GB, Required: 10GB"
        return 1
    fi

    # Check current deployment status
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        info "Current deployment is running"
    else
        warn "No running deployment detected"
    fi

    info "Pre-deployment checks completed successfully"
    return 0
}

# Create backup of current deployment
create_deployment_backup() {
    info "Creating deployment backup..."

    local backup_name="deployment_backup_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"

    mkdir -p "$backup_path"

    # Backup Docker images
    info "Backing up Docker images..."
    docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | grep "$PROJECT_NAME" > "$backup_path/images.txt" || true

    # Backup Docker Compose configuration
    cp "$DOCKER_COMPOSE_FILE" "$backup_path/"
    cp "$ENV_FILE" "$backup_path/"

    # Backup running containers configuration
    docker-compose -f "$DOCKER_COMPOSE_FILE" config > "$backup_path/current_config.yml"

    # Create database backup
    if [[ "${SKIP_DB_BACKUP:-false}" != "true" ]]; then
        info "Creating database backup..."
        if /home/yopi/Projects/tumor-registry/scripts/backup-database.sh; then
            cp -r "/backup/database/daily" "$backup_path/" 2>/dev/null || true
        else
            warn "Database backup failed, continuing with deployment"
        fi
    fi

    # Save backup metadata
    cat > "$backup_path/metadata.json" << EOF
{
    "backup_name": "$backup_name",
    "backup_time": "$(date -Iseconds)",
    "deployment_version": "${VERSION:-latest}",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
    "docker_images": "$(docker images --format '{{.Repository}}:{{.Tag}}' | grep "$PROJECT_NAME" | tr '\n' ';')",
    "backup_type": "pre-deployment"
}
EOF

    # Create symlink to latest backup
    ln -sf "$backup_path" "$BACKUP_DIR/latest"

    echo "$backup_path" > "$BACKUP_DIR/current_backup.txt"

    info "Deployment backup created: $backup_path"
}

# Build new Docker images
build_images() {
    info "Building new Docker images..."

    # Set build arguments
    local build_args=""
    build_args="--build-arg NODE_ENV=production"
    build_args="$build_args --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
    build_args="$build_args --build-arg VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    build_args="$build_args --build-arg VERSION=${VERSION:-latest}"

    # Pull latest base images
    info "Pulling latest base images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull --quiet nginx postgres redis minio prometheus grafana || true

    # Build application images
    info "Building application images..."
    if docker-compose -f "$DOCKER_COMPOSE_FILE" build $build_args; then
        info "Docker images built successfully"
    else
        error "Docker image build failed"
        return 1
    fi

    # Tag images with version
    if [[ -n "${VERSION:-}" ]]; then
        info "Tagging images with version: $VERSION"
        docker tag "${PROJECT_NAME}-backend:latest" "${PROJECT_NAME}-backend:$VERSION"
        docker tag "${PROJECT_NAME}-frontend:latest" "${PROJECT_NAME}-frontend:$VERSION"
    fi
}

# Zero-downtime deployment
deploy_zero_downtime() {
    info "Starting zero-downtime deployment..."

    # Scale down frontend gradually
    info "Scaling down frontend service..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --no-deps backend || true

    # Update backend services first
    info "Deploying backend services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --no-deps backend

    # Wait for backend to be healthy
    wait_for_service "backend" 300

    # Update frontend services
    info "Deploying frontend services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --no-deps frontend

    # Wait for frontend to be healthy
    wait_for_service "frontend" 300

    # Update supporting services (nginx, monitoring, etc.)
    info "Deploying supporting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d nginx prometheus grafana alertmanager

    # Wait for nginx to be healthy
    wait_for_service "nginx" 180

    info "Zero-downtime deployment completed"
}

# Wait for service to be healthy
wait_for_service() {
    local service="$1"
    local timeout="$2"
    local interval=10
    local elapsed=0

    info "Waiting for $service to be healthy (timeout: ${timeout}s)..."

    while [[ $elapsed -lt $timeout ]]; do
        local healthy_containers=$(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q "$service" | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null | grep -c "healthy" || echo "0")
        local total_containers=$(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q "$service" | wc -l)

        if [[ $healthy_containers -eq $total_containers && $total_containers -gt 0 ]]; then
            info "✓ $service is healthy ($healthy_containers/$total_containers containers)"
            return 0
        fi

        info "Waiting for $service... ($healthy_containers/$total_containers healthy, ${elapsed}s elapsed)"
        sleep $interval
        elapsed=$((elapsed + interval))
    done

    error "Timeout waiting for $service to be healthy"
    return 1
}

# Health checks
health_checks() {
    info "Running deployment health checks..."

    local checks_passed=true

    # Check main application health
    if curl -f -s --max-time 30 "https://inamsos.kemenkes.go.id/health" > /dev/null; then
        info "✓ Main application health check passed"
    else
        error "✗ Main application health check failed"
        checks_passed=false
    fi

    # Check API health
    if curl -f -s --max-time 30 "https://api.inamsos.kemenkes.go.id/health" > /dev/null; then
        info "✓ API health check passed"
    else
        error "✗ API health check failed"
        checks_passed=false
    fi

    # Check database connectivity
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres pg_isready -U inamsos_user -d inamosos_prod > /dev/null 2>&1; then
        info "✓ Database connectivity check passed"
    else
        error "✗ Database connectivity check failed"
        checks_passed=false
    fi

    # Check Redis connectivity
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T redis redis-cli ping > /dev/null 2>&1; then
        info "✓ Redis connectivity check passed"
    else
        error "✗ Redis connectivity check failed"
        checks_passed=false
    fi

    # Check monitoring services
    if curl -f -s --max-time 30 "http://localhost:9090/-/healthy" > /dev/null; then
        info "✓ Prometheus health check passed"
    else
        warn "⚠ Prometheus health check failed (monitoring may be starting)"
    fi

    if [[ "$checks_passed" == "true" ]]; then
        info "✓ All health checks passed"
        return 0
    else
        error "✗ Some health checks failed"
        return 1
    fi
}

# Post-deployment cleanup
post_deployment_cleanup() {
    info "Performing post-deployment cleanup..."

    # Remove unused Docker images
    info "Cleaning up unused Docker images..."
    docker image prune -f > /dev/null 2>&1 || true

    # Remove old containers
    info "Cleaning up old containers..."
    docker container prune -f > /dev/null 2>&1 || true

    # Clean up old backups (keep last 30 days)
    find "$BACKUP_DIR" -name "deployment_backup_*" -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

    # Clean up old rollback data (keep last 7 days)
    find "$ROLLBACK_DIR" -name "rollback_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

    info "Post-deployment cleanup completed"
}

# Rollback deployment
rollback_deployment() {
    local backup_path="${1:-$BACKUP_DIR/latest}"

    info "Starting deployment rollback..."

    if [[ ! -d "$backup_path" ]]; then
        error "Backup path not found: $backup_path"
        return 1
    fi

    local rollback_name="rollback_$(date +%Y%m%d_%H%M%S)"
    local rollback_path="$ROLLBACK_DIR/$rollback_name"

    mkdir -p "$rollback_path"

    # Stop current services
    info "Stopping current services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down

    # Restore Docker Compose configuration
    info "Restoring Docker Compose configuration..."
    cp "$backup_path/docker-compose.production.yml" "$DOCKER_COMPOSE_FILE.backup"
    cp "$backup_path/.env.production" "$ENV_FILE.backup"

    # Restore Docker images if needed
    if [[ -f "$backup_path/images.txt" ]]; then
        info "Checking Docker images..."
        # This would need custom implementation for image restoration
        warn "Image restoration not implemented - ensure images are available"
    fi

    # Start services with restored configuration
    info "Starting services with restored configuration..."
    if docker-compose -f "$DOCKER_COMPOSE_FILE.backup" up -d; then
        info "Services started successfully"
    else
        error "Failed to start services during rollback"
        return 1
    fi

    # Wait for services to be healthy
    wait_for_service "backend" 300
    wait_for_service "frontend" 300
    wait_for_service "nginx" 180

    # Run health checks
    if health_checks; then
        info "✓ Rollback completed successfully"

        # Move backup files to permanent location
        mv "$DOCKER_COMPOSE_FILE.backup" "$DOCKER_COMPOSE_FILE"
        mv "$ENV_FILE.backup" "$ENV_FILE"

        # Save rollback metadata
        cat > "$rollback_path/metadata.json" << EOF
{
    "rollback_name": "$rollback_name",
    "rollback_time": "$(date -Iseconds)",
    "backup_source": "$backup_path",
    "rollback_reason": "deployment_failure",
    "rollback_success": true
}
EOF

        send_notification "SUCCESS" "Deployment rollback completed successfully" "normal"
        return 0
    else
        error "Rollback health checks failed"
        send_notification "FAILED" "Deployment rollback failed - manual intervention required" "high"
        return 1
    fi
}

# Main deployment function
main() {
    local rollback_only="${1:-false}"
    local start_time=$(date +%s)

    log "INFO" "Starting INAMSOS production deployment"
    send_notification "STARTED" "Production deployment started" "normal"

    # Create necessary directories
    mkdir -p "$BACKUP_DIR" "$ROLLBACK_DIR" "/var/log/inamos"

    # Load environment variables
    source "$ENV_FILE"

    if [[ "$rollback_only" == "true" ]]; then
        rollback_deployment "$2"
        exit $?
    fi

    # Run deployment steps
    if ! pre_deployment_checks; then
        send_notification "FAILED" "Pre-deployment checks failed" "high"
        exit 1
    fi

    create_deployment_backup

    if ! build_images; then
        send_notification "FAILED" "Docker image build failed" "high"
        exit 1
    fi

    if ! deploy_zero_downtime; then
        error "Deployment failed, attempting rollback..."
        if rollback_deployment; then
            send_notification "FAILED" "Deployment failed, rollback completed" "high"
        else
            send_notification "CRITICAL" "Deployment failed and rollback failed - MANUAL INTERVENTION REQUIRED" "high"
        fi
        exit 1
    fi

    if ! health_checks; then
        error "Health checks failed, attempting rollback..."
        if rollback_deployment; then
            send_notification "FAILED" "Health checks failed, rollback completed" "high"
        else
            send_notification "CRITICAL" "Health checks failed and rollback failed - MANUAL INTERVENTION REQUIRED" "high"
        fi
        exit 1
    fi

    post_deployment_cleanup

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log "INFO" "Production deployment completed successfully in ${duration}s"
    send_notification "SUCCESS" "Production deployment completed successfully in ${duration}s" "normal"

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Deployment script failed on line $line_number with exit code $exit_code"
    send_notification "CRITICAL" "Deployment script failed on line $line_number with exit code $exit_code" "high"

    # Attempt automatic rollback
    warn "Attempting automatic rollback..."
    rollback_deployment || true

    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Check if running as root or with appropriate permissions
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root or with sudo privileges"
fi

# Show usage if help requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    --rollback [BACKUP_PATH]    Rollback to previous deployment
    --help, -h                 Show this help message

ENVIRONMENT VARIABLES:
    VERSION                    Deployment version tag
    SKIP_DB_BACKUP            Skip database backup (default: false)
    DEPLOYMENT_EMAIL          Email for notifications
    SLACK_WEBHOOK_URL         Slack webhook for notifications

EXAMPLES:
    $0                        # Deploy latest version
    $0 --rollback            # Rollback to latest backup
    $0 --rollback /backup/deployments/deployment_backup_20241119_120000

NOTE: This script performs zero-downtime deployment with automatic rollback on failure.
"""
    exit 0
fi

# Run main function
main "$@"