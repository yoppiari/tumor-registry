#!/bin/bash

# INAMSOS Development Environment Setup Script
# This script sets up a complete development environment for INAMSOS

set -e

echo "🇮🇩 Welcome to INAMSOS Development Setup"
echo "========================================"

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup environment variables
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
POSTGRES_DB=inamsos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=inamsos-super-secret-key-change-in-production
JWT_REFRESH_SECRET=inamsos-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=inamsos-files

# Email Configuration (for development)
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=no-reply@inamsos.local
EMAIL_PASS=

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create logs directory
mkdir -p logs

# Generate Prisma client if needed
if [ -f prisma/schema.prisma ]; then
    echo "🗄️ Generating Prisma client..."
    npx prisma generate
fi

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Start Docker containers
echo ""
echo "🐳 Starting Docker containers..."
docker compose up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo ""
echo "🗄️ Running database migrations..."
cd backend
if [ -f package.json ] && grep -q "db:migrate" package.json; then
    npm run db:migrate
else
    echo "⚠️  Database migration command not found. Please run migrations manually."
fi

# Seed database if needed
if [ -f package.json ] && grep -q "db:seed" package.json; then
    echo "🌱 Seeding database..."
    npm run db:seed
else
    echo "⚠️  Database seeding command not found. Please seed data manually."
fi

cd ..

# Setup pre-commit hooks
echo ""
echo "🪝 Setting up pre-commit hooks..."
if [ ! -f .git/hooks/pre-commit ]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Run linting and tests before commit
echo "🔍 Running pre-commit checks..."

# Backend linting
echo "Linting backend..."
cd backend
npm run lint -- --fix || exit 1
cd ..

# Frontend linting
echo "Linting frontend..."
cd frontend
npm run lint -- --fix || exit 1
cd ..

# Backend tests
echo "Running backend tests..."
cd backend
npm run test || exit 1
cd ..

echo "✅ Pre-commit checks passed!"
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hooks installed"
else
    echo "✅ Pre-commit hooks already exist"
fi

# Create development scripts
echo ""
echo "📜 Creating development scripts..."

# Start script
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting INAMSOS Development Environment..."

# Start Docker containers
echo "Starting Docker containers..."
docker compose up -d

# Start backend
echo "Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001"
echo "🗄️ Database: localhost:5433"
echo "📊 MinIO Console: http://localhost:9001"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development environment..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker compose down
    echo "✅ Development environment stopped"
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Wait for processes
wait
EOF
chmod +x start-dev.sh

# Test script
cat > test-all.sh << 'EOF'
#!/bin/bash

echo "🧪 Running all tests..."

# Backend tests
echo "Running backend tests..."
cd backend
npm run test
BACKEND_EXIT_CODE=$?
cd ..

# Frontend tests
echo "Running frontend tests..."
cd frontend
npm run test
FRONTEND_EXIT_CODE=$?
cd ..

if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "❌ Some tests failed!"
    exit 1
fi
EOF
chmod +x test-all.sh

echo "✅ Development scripts created"

# Final instructions
echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update .env file as needed"
echo "2. Run './start-dev.sh' to start development servers"
echo "3. Run './test-all.sh' to run all tests"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔗 Useful links:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- API Documentation: http://localhost:3001/api/docs"
echo "- MinIO Console: http://localhost:9001"
echo ""
echo "📚 Documentation:"
echo "- CONTRIBUTING.md: Development guidelines"
echo "- README.md: Project overview"
echo "- docs/: Additional documentation"
echo ""
echo "🤝 Happy coding! 🇮🇩"