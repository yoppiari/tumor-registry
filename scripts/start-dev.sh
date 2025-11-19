#!/bin/bash

# INAMSOS Development Startup Script
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

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Start database services
start_databases() {
    print_status "Starting database services..."
    docker-compose -f docker-compose.dev.yml up -d postgres redis minio

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

# Setup backend
setup_backend() {
    print_status "Setting up backend..."

    cd backend

    # Check if .env.development exists
    if [ ! -f .env.development ]; then
        print_error ".env.development file not found in backend directory"
        return 1
    fi

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi

    # Try to build (will skip if there are permission issues)
    print_status "Attempting to build backend..."
    if npm run build 2>/dev/null; then
        print_success "Backend built successfully"
    else
        print_warning "Backend build failed (likely due to dist folder permissions)"
        print_warning "The application will run in development mode"
    fi

    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."

    cd frontend

    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_error ".env.local file not found in frontend directory"
        return 1
    fi

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi

    # Try to build (will skip if there are missing components)
    print_status "Attempting to build frontend..."
    if npm run build 2>/dev/null; then
        print_success "Frontend built successfully"
    else
        print_warning "Frontend build failed (likely due to missing components)"
        print_warning "The application will run in development mode"
    fi

    cd ..
}

# Start backend development server
start_backend() {
    print_status "Starting backend development server..."
    cd backend
    export NODE_ENV=development
    npm run start:dev &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../.backend.pid
    cd ..
    print_success "Backend server started (PID: $BACKEND_PID)"
}

# Start frontend development server
start_frontend() {
    print_status "Starting frontend development server..."
    cd frontend
    export NODE_ENV=development
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../.frontend.pid
    cd ..
    print_success "Frontend server started (PID: $FRONTEND_PID)"
}

# Display access information
display_info() {
    echo ""
    echo "=================================================================="
    echo "🏥 INAMSOS Development Environment Ready!"
    echo "=================================================================="
    echo ""
    echo "📊 Application URLs:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Backend API:  http://localhost:3001"
    echo "   API Docs:     http://localhost:3001/api"
    echo ""
    echo "🗄️  Database Services:"
    echo "   PostgreSQL:   localhost:5432"
    echo "   Redis:        localhost:6379"
    echo "   MinIO:        http://localhost:9000 (minioadmin/minioadmin2025)"
    echo "   pgAdmin:      http://localhost:5050 (admin@inamsos.dev/admin123)"
    echo ""
    echo "👤 Sample Login Credentials:"
    echo "   Super Admin:  admin@inamsos.dev"
    echo "   Hospital:     hospital@siloam.dev"
    echo "   Data Manager: datamanager@dharmais.dev"
    echo "   Oncologist:   dr.santoso@cancer.dev"
    echo "   Researcher:   researcher@ui.dev"
    echo "   Password:     All use password 'password123'"
    echo ""
    echo "📝 Sample Data:"
    echo "   20 Patients with Indonesian names across 20 provinces"
    echo "   10 Sample diagnoses"
    echo "   3 Sample treatment plans"
    echo "   3 Sample research requests"
    echo ""
    echo "🛠️  Development Commands:"
    echo "   Stop servers:     ./scripts/stop-dev.sh"
    echo "   View logs:        docker-compose -f docker-compose.dev.yml logs -f"
    echo "   Reset database:   ./scripts/reset-database.sh"
    echo ""
    echo "⚠️  Development Notes:"
    echo "   - Email is mocked in development mode"
    echo "   - Some TypeScript build issues may exist"
    echo "   - Use .env.development for backend configuration"
    echo "   - Use .env.local for frontend configuration"
    echo ""
    echo "=================================================================="
}

# Main execution
main() {
    echo ""
    echo "🏥 INAMSOS Development Environment Setup"
    echo "========================================"
    echo ""

    check_docker
    start_databases
    setup_backend
    setup_frontend
    start_backend
    start_frontend

    # Wait a moment for servers to start
    sleep 3

    display_info

    print_success "Development environment is ready!"
    print_status "Use Ctrl+C to stop all services"

    # Wait for interrupt signal
    trap 'kill $(cat .backend.pid) $(cat .frontend.pid) 2>/dev/null; docker-compose -f docker-compose.dev.yml down; rm -f .backend.pid .frontend.pid; print_success "All services stopped"; exit 0' INT

    # Keep script running
    wait
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main "$@"