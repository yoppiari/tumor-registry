#!/bin/bash

# INAMSOS Simple Development Script
# Runs both backend and frontend without Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PID file locations
BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"

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

# Cleanup function
cleanup() {
    print_status "Stopping all services..."

    # Kill backend process
    if [ -f "$BACKEND_PID_FILE" ]; then
        BACKEND_PID=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$BACKEND_PID" 2>/dev/null; then
            kill "$BACKEND_PID" 2>/dev/null || true
            print_success "Backend stopped"
        fi
        rm -f "$BACKEND_PID_FILE"
    fi

    # Kill frontend process
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$FRONTEND_PID" 2>/dev/null; then
            kill "$FRONTEND_PID" 2>/dev/null || true
            print_success "Frontend stopped"
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi

    print_success "All services stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup INT TERM EXIT

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "🏥 INAMSOS Development Environment"
echo "=================================="
echo ""

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed. Please install Bun first: https://bun.sh"
    exit 1
fi

# Kill any processes on required ports
print_status "Cleaning up ports..."
BACKEND_PORT=3002
FRONTEND_PORT=3000

# Kill all dev processes that might be running
print_status "Stopping any existing dev processes..."
pkill -f "bun src/main.ts" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Kill processes on specific ports
for port in 3000 3001 3002 3003; do
    if lsof -ti:$port > /dev/null 2>&1; then
        print_warning "Port $port is in use, killing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    fi
done

sleep 1
print_success "All ports cleaned up"

# Start Backend
print_status "Starting backend server (Bun)..."
cd backend

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found, using .env"
fi

# Start backend in background, redirect output to log file
bun src/main.ts > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "../$BACKEND_PID_FILE"
cd ..

print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend to bind to port
print_status "Waiting for backend to be ready..."
for i in {1..30}; do
    if lsof -ti:3002 > /dev/null 2>&1; then
        print_success "Backend is listening on port 3002"
        break
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        print_error "Backend failed to start. Check backend.log for errors."
        tail -30 backend.log
        exit 1
    fi
    sleep 1
done

if ! lsof -ti:3002 > /dev/null 2>&1; then
    print_error "Backend failed to bind to port 3002. Check backend.log for errors."
    tail -30 backend.log
    exit 1
fi

# Start Frontend
print_status "Starting frontend server..."
cd frontend

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found, creating from .env"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background, redirect output to log file
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "../$FRONTEND_PID_FILE"
cd ..

print_success "Frontend started (PID: $FRONTEND_PID)"

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 5

# Display access information
echo ""
echo "=================================================================="
echo "🏥 INAMSOS Development Environment Ready!"
echo "=================================================================="
echo ""
echo "📊 Application URLs:"
echo "   Frontend:     http://localhost:3000"
echo "   Backend API:  http://localhost:3002/api/v1"
echo "   API Docs:     http://localhost:3002/api/docs"
echo ""
echo "🗄️  Database:"
echo "   Remote PostgreSQL (107.155.75.50:5389)"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛠️  Commands:"
echo "   Stop:     Press Ctrl+C"
echo "   Restart:  Stop and run ./dev.sh again"
echo ""
echo "=================================================================="

print_success "Development environment is running!"
print_status "Press Ctrl+C to stop all services"
echo ""

# Follow logs
tail -f backend.log frontend.log
