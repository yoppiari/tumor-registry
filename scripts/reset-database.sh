#!/bin/bash

# INAMSOS Database Reset Script
# Indonesian National Cancer Database - Local Development Environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Confirm database reset
confirm_reset() {
    echo ""
    print_warning "⚠️  This will completely reset the development database!"
    print_warning "   All existing data will be lost."
    echo ""
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm
    if [ "$confirm" != "yes" ]; then
        print_status "Database reset cancelled"
        exit 0
    fi
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Stop database services
stop_databases() {
    print_status "Stopping database services..."
    docker-compose -f docker-compose.dev.yml stop postgres redis
    print_success "Database services stopped"
}

# Start database services
start_databases() {
    print_status "Starting database services..."
    docker-compose -f docker-compose.dev.yml up -d postgres redis

    # Wait for databases to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    until docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U inamsos -d inamsos_dev; do
        sleep 2
    done

    print_status "Waiting for Redis to be ready..."
    until docker-compose -f docker-compose.dev.yml exec redis redis-cli ping; do
        sleep 2
    done

    print_success "Database services are ready"
}

# Reset PostgreSQL database
reset_postgres() {
    print_status "Resetting PostgreSQL database..."

    # Drop and recreate database
    docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d postgres -c "DROP DATABASE IF EXISTS inamsos_dev;"
    docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d postgres -c "CREATE DATABASE inamsos_dev;"

    print_success "PostgreSQL database reset"
}

# Clear Redis cache
clear_redis() {
    print_status "Clearing Redis cache..."
    docker-compose -f docker-compose.dev.yml exec redis redis-cli FLUSHALL
    print_success "Redis cache cleared"
}

# Initialize database with schema and seed data
initialize_database() {
    print_status "Initializing database with schema and seed data..."

    # Run init.sql for schema
    if [ -f "database/init.sql" ]; then
        docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -f /docker-entrypoint-initdb.d/init.sql
        print_success "Database schema initialized"
    else
        print_error "database/init.sql not found"
        return 1
    fi

    # Run seed.sql for sample data
    if [ -f "database/seed.sql" ]; then
        docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -f /docker-entrypoint-initdb.d/seed.sql
        print_success "Sample data loaded"
    else
        print_error "database/seed.sql not found"
        return 1
    fi
}

# Verify database contents
verify_database() {
    print_status "Verifying database contents..."

    # Check tables
    TABLES=$(docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

    if [ "$TABLES" -gt "0" ]; then
        print_success "Database contains $TABLES tables"
    else
        print_error "Database appears to be empty"
        return 1
    fi

    # Check sample data
    PATIENTS=$(docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -t -c "SELECT count(*) FROM patients;" | tr -d ' ')
    USERS=$(docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -t -c "SELECT count(*) FROM users;" | tr -d ' ')
    CENTERS=$(docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -t -c "SELECT count(*) FROM centers;" | tr -d ' ')

    print_success "Database verification complete:"
    echo "   - Users: $USERS"
    echo "   - Centers: $CENTERS"
    echo "   - Patients: $PATIENTS"
}

# Display summary
display_summary() {
    echo ""
    echo "========================================"
    echo "🔄 Database Reset Complete"
    echo "========================================"
    echo ""
    echo "The development database has been reset with:"
    echo ""
    echo "📊 Sample Data:"
    echo "   5 User roles (super_admin, hospital_admin, data_manager, oncologist, researcher)"
    echo "   5 Sample users (one for each role)"
    echo "   15 Medical centers across Indonesian provinces"
    echo "   20 Sample patients with Indonesian names"
    echo "   10 Sample diagnoses"
    echo "   3 Sample treatment plans"
    echo "   3 Sample research requests"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   All users use password: password123"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Start the development servers: ./scripts/start-dev.sh"
    echo "   2. Access the application at: http://localhost:3000"
    echo "   3. Login with any of the sample users"
    echo ""
    echo "========================================"
}

# Main execution
main() {
    echo ""
    echo "🔄 INAMSOS Database Reset"
    echo "=========================="
    echo ""

    confirm_reset
    check_docker

    # If database services are running, stop them first
    if docker-compose -f docker-compose.dev.yml ps postgres redis | grep -q "Up"; then
        stop_databases
    fi

    start_databases
    reset_postgres
    clear_redis
    initialize_database
    verify_database

    display_summary

    print_success "Database reset completed successfully!"
}

# Check if we're in the correct directory
if [ ! -f "docker-compose.dev.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main "$@"