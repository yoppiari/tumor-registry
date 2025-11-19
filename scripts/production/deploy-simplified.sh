#!/bin/bash
# INAMSOS Simplified Production Deployment
# Indonesian National Cancer Registry System - Pilot Deployment

set -e

echo "🇮🇩 INAMSOS PRODUCTION DEPLOYMENT - SIMPLIFIED"
echo "=============================================="
echo "Indonesian National Cancer Registry System"
echo "Deploying for pilot hospitals"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if Docker is available
check_docker() {
    log "🔍 Checking Docker availability..."

    if ! command -v docker &> /dev/null; then
        warning "Docker not found. Using local deployment mode."
        return 1
    fi

    if ! docker info &> /dev/null; then
        warning "Docker daemon not running. Using local deployment mode."
        return 1
    fi

    log "✅ Docker is available and running"
    return 0
}

# Setup local development environment
setup_local_environment() {
    log "🏗️ Setting up local development environment..."

    # Ensure we're in the correct directory
    cd /home/yopi/Projects/tumor-registry

    # Create necessary directories
    mkdir -p logs
    mkdir -p backups
    mkdir -p config/hospitals

    # Pilot hospitals
    PILOT_HOSPITALS=("rs-kanker-dharmais" "rsupn-cipto-mangunkusumo" "rs-kanker-soeharto")

    for hospital in "${PILOT_HOSPITALS[@]}"; do
        mkdir -p "config/hospitals/$hospital"

        # Create hospital configuration
        cat > "config/hospitals/$hospital/config.json" << EOF
{
  "hospitalId": "$hospital",
  "hospitalName": "$(echo $hospital | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')",
  "region": "Indonesia",
  "timezone": "Asia/Jakarta",
  "deploymentDate": "$(date)",
  "status": "pilot-ready",
  "features": {
    "patientRegistration": true,
    "medicalRecords": true,
    "analytics": true,
    "research": true,
    "reporting": true
  },
  "api": {
    "baseUrl": "http://localhost:3001/api/v1",
    "documentation": "http://localhost:3001/api/v1/docs"
  }
}
EOF

        log "✅ Configuration created for $hospital"
    done

    log "✅ Local environment setup completed"
}

# Backend setup and verification
setup_backend() {
    log "🚀 Setting up backend application..."

    cd /home/yopi/Projects/tumor-registry/backend

    # Check if backend is already running
    if curl -f http://localhost:3001/api/v1/health &> /dev/null; then
        log "✅ Backend is already running and healthy"
        return 0
    fi

    # Try to start backend with development server
    log "⏳ Starting backend development server..."

    # Kill any existing processes on port 3001
    sudo lsof -ti:3001 | xargs -r kill -9 2>/dev/null || true

    # Start development server in background
    npm run start:dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!

    # Wait for backend to be ready
    for i in {1..30}; do
        if curl -f http://localhost:3001/api/v1/health &> /dev/null; then
            log "✅ Backend started successfully (PID: $BACKEND_PID)"
            return 0
        fi

        if [ $i -eq 30 ]; then
            error "Backend failed to start after 30 attempts"
            return 1
        fi

        sleep 5
    done
}

# Frontend setup and verification
setup_frontend() {
    log "🎨 Setting up frontend application..."

    cd /home/yopi/Projects/tumor-registry/frontend

    # Check if frontend is already running
    if curl -f http://localhost:3000 &> /dev/null; then
        log "✅ Frontend is already running and accessible"
        return 0
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "📦 Installing frontend dependencies..."
        npm install > ../logs/frontend-install.log 2>&1
    fi

    # Start frontend development server
    log "⏳ Starting frontend development server..."

    # Kill any existing processes on port 3000
    sudo lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true

    # Start development server in background
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!

    # Wait for frontend to be ready
    for i in {1..20}; do
        if curl -f http://localhost:3000 &> /dev/null; then
            log "✅ Frontend started successfully (PID: $FRONTEND_PID)"
            return 0
        fi

        if [ $i -eq 20 ]; then
            error "Frontend failed to start after 20 attempts"
            return 1
        fi

        sleep 5
    done
}

# Database setup (SQLite for local development)
setup_database() {
    log "🗄️ Setting up local database..."

    cd /home/yopi/Projects/tumor-registry/backend

    # Check if dev.db exists
    if [ ! -f "dev.db" ]; then
        log "📝 Creating SQLite database..."

        # Create a simple database structure
        cat > create-db.sql << 'EOF'
-- INAMSOS Local Development Database
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    diagnosis TEXT,
    treatment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample hospitals
INSERT OR IGNORE INTO hospitals (name, type, location) VALUES
('RS Kanker Dharmais', 'National Cancer Hospital', 'Jakarta'),
('RSUPN Cipto Mangunkusumo', 'Teaching Hospital', 'Jakarta'),
('RS Kanker Soeharto', 'Cancer Hospital', 'Surabaya');
EOF

        # Create SQLite database
        sqlite3 dev.db < create-db.sql

        log "✅ SQLite database created successfully"
    else
        log "✅ Database already exists"
    fi
}

# Setup monitoring (basic logging for local)
setup_monitoring() {
    log "📊 Setting up basic monitoring..."

    # Create monitoring directory
    mkdir -p monitoring

    # Create basic health check script
    cat > monitoring/health-check.sh << 'EOF'
#!/bin/bash
# Basic health monitoring script

echo "=== INAMSOS Health Check ==="
echo "Timestamp: $(date)"
echo

# Backend health
echo "🔍 Checking Backend Health..."
if curl -f http://localhost:3001/api/v1/health &> /dev/null; then
    echo "✅ Backend: HEALTHY"
else
    echo "❌ Backend: UNHEALTHY"
fi

# Frontend health
echo "🎨 Checking Frontend Health..."
if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Frontend: HEALTHY"
else
    echo "❌ Frontend: UNHEALTHY"
fi

# Database health
echo "🗄️ Checking Database Health..."
if [ -f "../backend/dev.db" ]; then
    echo "✅ Database: AVAILABLE"
else
    echo "❌ Database: NOT FOUND"
fi

echo
echo "=== End Health Check ==="
EOF

    chmod +x monitoring/health-check.sh

    # Run initial health check
    ./monitoring/health-check.sh

    log "✅ Basic monitoring setup completed"
}

# Create deployment summary
create_deployment_summary() {
    log "📋 Creating deployment summary..."

    local summary_file="deployment-summary-$(date +%Y%m%d_%H%M%S).md"

    cat > "$summary_file" << EOF
# INAMSOS Pilot Deployment Summary

## Deployment Information
- **Date**: $(date)
- **Environment**: Local Development (Pilot Preparation)
- **Phase**: Pilot Implementation Preparation
- **Mode**: Development/Testing

## System Status
- ✅ **Backend API**: Running on http://localhost:3001
- ✅ **Frontend Application**: Running on http://localhost:3000
- ✅ **Database**: SQLite development database
- ✅ **Configuration**: Hospital configs prepared
- ✅ **Monitoring**: Basic health checks active

## Access Information
- **Frontend URL**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Documentation**: http://localhost:3001/api/v1/docs
- **Health Check**: ./monitoring/health-check.sh

## Pilot Hospitals Configured
1. RS Kanker Dharmais (Jakarta)
2. RSUPN Cipto Mangunkusumo (Jakarta)
3. RS Kanker Soeharto (Surabaya)

## Next Steps
1. Test system functionality with pilot hospitals
2. Conduct user acceptance testing
3. Prepare production infrastructure
4. Execute full production deployment

## Support Information
- **Technical Support**: Available via logs and monitoring
- **Documentation**: Available in project documentation
- **Status**: Ready for pilot testing

---
*Indonesian National Cancer Registry System - Pilot Deployment*
*Generated: $(date)*
EOF

    log "✅ Deployment summary created: $summary_file"
    echo ""
    echo "📄 View deployment summary: $summary_file"
}

# Main deployment function
main() {
    log "🚀 Starting INAMSOS Simplified Pilot Deployment"

    # Check if Docker is available
    if check_docker; then
        log "🐳 Docker deployment would be attempted here"
        log "⚠️ For this simplified version, we'll use local deployment"
    fi

    # Execute deployment steps
    setup_local_environment
    setup_database
    setup_backend
    setup_frontend
    setup_monitoring
    create_deployment_summary

    log "🎉 INAMSOS Simplified Deployment completed successfully!"
    log "🇮🇩 Indonesian National Cancer Registry System is ready for testing!"

    echo ""
    echo "🎯 SYSTEM ACCESS:"
    echo "• Frontend: http://localhost:3000"
    echo "• Backend API: http://localhost:3001/api/v1"
    echo "• API Docs: http://localhost:3001/api/v1/docs"
    echo ""
    echo "🔧 MANAGEMENT COMMANDS:"
    echo "• Health Check: ./monitoring/health-check.sh"
    echo "• View Logs: tail -f logs/backend.log"
    echo "• Frontend Logs: tail -f logs/frontend.log"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Test the system functionality"
    echo "2. Review the deployment summary"
    echo "3. Begin user acceptance testing"
    echo "4. Prepare for full production deployment"
}

# Error handling
trap 'error "Deployment failed at line $LINENO"' ERR

# Execute main function
main "$@"