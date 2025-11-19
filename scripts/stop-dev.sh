#!/bin/bash

# INAMSOS Development Stop Script
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

# Stop backend server
stop_backend() {
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            print_status "Stopping backend server (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
            rm -f .backend.pid
            print_success "Backend server stopped"
        else
            print_warning "Backend server not running"
            rm -f .backend.pid
        fi
    else
        print_warning "Backend PID file not found"
    fi
}

# Stop frontend server
stop_frontend() {
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            print_status "Stopping frontend server (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
            rm -f .frontend.pid
            print_success "Frontend server stopped"
        else
            print_warning "Frontend server not running"
            rm -f .frontend.pid
        fi
    else
        print_warning "Frontend PID file not found"
    fi
}

# Stop database services
stop_databases() {
    print_status "Stopping database services..."
    if [ -f "docker-compose.dev.yml" ]; then
        docker-compose -f docker-compose.dev.yml down
        print_success "Database services stopped"
    else
        print_warning "docker-compose.dev.yml not found"
    fi
}

# Kill any remaining processes
cleanup_processes() {
    print_status "Cleaning up remaining processes..."

    # Kill any remaining Node.js processes on ports 3000, 3001
    for port in 3000 3001; do
        PID=$(lsof -ti:$port 2>/dev/null || true)
        if [ ! -z "$PID" ]; then
            print_status "Killing process on port $port (PID: $PID)..."
            kill -9 $PID 2>/dev/null || true
        fi
    done

    print_success "Cleanup completed"
}

# Display summary
display_summary() {
    echo ""
    echo "========================================"
    echo "🛑 INAMSOS Development Stopped"
    echo "========================================"
    echo ""
    echo "All development services have been stopped."
    echo ""
    echo "To restart the development environment:"
    echo "   ./scripts/start-dev.sh"
    echo ""
    echo "To view service logs:"
    echo "   docker-compose -f docker-compose.dev.yml logs -f"
    echo ""
    echo "========================================"
}

# Main execution
main() {
    echo ""
    echo "🛑 Stopping INAMSOS Development Environment"
    echo "============================================"
    echo ""

    stop_backend
    stop_frontend
    stop_databases
    cleanup_processes

    display_summary

    print_success "All development services stopped successfully!"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main "$@"