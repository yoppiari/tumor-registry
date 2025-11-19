#!/bin/bash

# INAMSOS Development Setup Test Script
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
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test functions
run_test() {
    local test_name="$1"
    local test_command="$2"

    print_status "Testing: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Check prerequisites
check_prerequisites() {
    echo ""
    echo "🔍 Checking Prerequisites"
    echo "=========================="
    echo ""

    run_test "Docker installation" "command -v docker"
    run_test "Docker Compose installation" "command -v docker-compose"
    run_test "Node.js installation" "command -v node"
    run_test "NPM installation" "command -v npm"

    # Check Docker is running
    run_test "Docker daemon running" "docker info"

    # Check Node.js version
    if command -v node > /dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_status "Node.js version: $NODE_VERSION"

        if [[ $NODE_VERSION =~ ^v(1[8-9]|[2-9][0-9])\. ]]; then
            print_success "Node.js version is compatible"
            ((TESTS_PASSED++))
        else
            print_warning "Node.js version may not be optimal (recommended: v18+)"
            ((TESTS_FAILED++))
        fi
    fi
}

# Check project structure
check_project_structure() {
    echo ""
    echo "📁 Checking Project Structure"
    echo "=============================="
    echo ""

    run_test "Project root directory exists" "[ -d '.' ]"
    run_test "Backend directory exists" "[ -d 'backend' ]"
    run_test "Frontend directory exists" "[ -d 'frontend' ]"
    run_test "Scripts directory exists" "[ -d 'scripts' ]"
    run_test "Database directory exists" "[ -d 'database' ]"

    # Check backend files
    run_test "Backend package.json exists" "[ -f 'backend/package.json' ]"
    run_test "Backend .env.development exists" "[ -f 'backend/.env.development' ]"
    run_test "Backend Dockerfile exists" "[ -f 'backend/Dockerfile.dev' ]"

    # Check frontend files
    run_test "Frontend package.json exists" "[ -f 'frontend/package.json' ]"
    run_test "Frontend .env.local exists" "[ -f 'frontend/.env.local' ]"
    run_test "Frontend Dockerfile exists" "[ -f 'frontend/Dockerfile.dev' ]"

    # Check configuration files
    run_test "Docker Compose dev config exists" "[ -f 'docker-compose.dev.yml' ]"
    run_test "Database init script exists" "[ -f 'database/init.sql' ]"
    run_test "Database seed script exists" "[ -f 'database/seed.sql' ]"
    run_test "Redis config exists" "[ -f 'database/redis.conf' ]"

    # Check scripts
    run_test "Development start script exists" "[ -f 'scripts/start-dev.sh' ]"
    run_test "Development stop script exists" "[ -f 'scripts/stop-dev.sh' ]"
    run_test "Database reset script exists" "[ -f 'scripts/reset-database.sh' ]"
}

# Check dependencies
check_dependencies() {
    echo ""
    echo "📦 Checking Dependencies"
    echo "=========================="
    echo ""

    run_test "Backend node_modules exists" "[ -d 'backend/node_modules' ]"
    run_test "Frontend node_modules exists" "[ -d 'frontend/node_modules' ]"

    # Check key backend packages
    if [ -d 'backend/node_modules' ]; then
        run_test "@nestjs/core installed" "[ -d 'backend/node_modules/@nestjs/core' ]"
        run_test "Prisma installed" "[ -d 'backend/node_modules/@prisma' ]"
        run_test "TypeScript installed" "[ -d 'backend/node_modules/typescript' ]"
    fi

    # Check key frontend packages
    if [ -d 'frontend/node_modules' ]; then
        run_test "Next.js installed" "[ -d 'frontend/node_modules/next' ]"
        run_test "React installed" "[ -d 'frontend/node_modules/react' ]"
        run_test "TypeScript installed" "[ -d 'frontend/node_modules/typescript' ]"
    fi
}

# Test database connectivity
test_database_connectivity() {
    echo ""
    echo "🗄️  Testing Database Connectivity"
    echo "==================================="
    echo ""

    # Check if database services are running
    print_status "Checking if database services are running..."

    if docker-compose -f docker-compose.dev.yml ps postgres redis | grep -q "Up"; then
        print_success "Database services are running"
        ((TESTS_PASSED++))

        # Test PostgreSQL connection
        run_test "PostgreSQL is accessible" "docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U inamsos -d inamsos_dev"

        # Test Redis connection
        run_test "Redis is accessible" "docker-compose -f docker-compose.dev.yml exec redis redis-cli ping"

        # Test database contains data
        run_test "Database has tables" "docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev -t -c \"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';\" | grep -q '[1-9]'"

    else
        print_warning "Database services are not running"
        print_status "Start them with: ./scripts/start-dev.sh"
        ((TESTS_FAILED++))
    fi
}

# Test application services
test_application_services() {
    echo ""
    echo "🚀 Testing Application Services"
    echo "================================="
    echo ""

    # Check if development servers are running
    print_status "Checking if application servers are running..."

    # Test backend API
    if curl -s http://localhost:3001/api > /dev/null 2>&1; then
        print_success "Backend API is accessible"
        ((TESTS_PASSED++))

        # Test API endpoints
        run_test "Health endpoint working" "curl -s http://localhost:3001/api/health"

    else
        print_warning "Backend API is not accessible"
        print_status "Start it with: npm run start:dev (in backend directory)"
        ((TESTS_FAILED++))
    fi

    # Test frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is accessible"
        ((TESTS_PASSED++))
    else
        print_warning "Frontend is not accessible"
        print_status "Start it with: npm run dev (in frontend directory)"
        ((TESTS_FAILED++))
    fi
}

# Check permissions
check_permissions() {
    echo ""
    echo "🔐 Checking File Permissions"
    echo "============================="
    echo ""

    run_test "Scripts are executable" "[ -x 'scripts/start-dev.sh' ]"
    run_test "Backend directory writable" "touch backend/.test_permission && rm backend/.test_permission"
    run_test "Frontend directory writable" "touch frontend/.test_permission && rm frontend/.test_permission"
    run_test "Database directory writable" "touch database/.test_permission && rm database/.test_permission"

    # Check if scripts need to be made executable
    if [ ! -x 'scripts/start-dev.sh' ]; then
        print_status "Making scripts executable..."
        chmod +x scripts/*.sh
    fi
}

# Display test results
display_results() {
    echo ""
    echo "========================================"
    echo "📊 Test Results Summary"
    echo "========================================"
    echo ""

    if [ $TESTS_FAILED -eq 0 ]; then
        echo "🎉 All tests passed! ($TESTS_PASSED/$((TESTS_PASSED + TESTS_FAILED)))"
        echo ""
        echo "Your INAMSOS development environment is ready to use!"
        echo ""
        echo "Next steps:"
        echo "1. Start the development environment: ./scripts/start-dev.sh"
        echo "2. Access the application at: http://localhost:3000"
        echo "3. Login with sample credentials"
    else
        echo "⚠️  Some tests failed ($TESTS_PASSED passed, $TESTS_FAILED failed)"
        echo ""
        echo "Please review the failures above and resolve them before using the development environment."
        echo ""
        echo "Common fixes:"
        echo "- Install missing dependencies: npm install (in backend/ and frontend/)"
        echo "- Start database services: docker-compose -f docker-compose.dev.yml up -d"
        echo "- Make scripts executable: chmod +x scripts/*.sh"
        echo "- Check Docker is running: docker info"
    fi

    echo ""
    echo "========================================"
}

# Main execution
main() {
    echo ""
    echo "🧪 INAMSOS Development Setup Test"
    echo "=================================="
    echo ""
    echo "This script will test your development environment setup."
    echo ""

    check_permissions
    check_prerequisites
    check_project_structure
    check_dependencies
    test_database_connectivity
    test_application_services

    display_results
}

# Check if we're in the correct directory
if [ ! -f "docker-compose.dev.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main "$@"