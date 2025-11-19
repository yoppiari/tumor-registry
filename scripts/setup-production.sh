#!/bin/bash

# INAMSOS Production Setup Script
# One-click setup for production environment

set -euo pipefail

# Configuration
PROJECT_NAME="inamsos"
INSTALL_DIR="/opt/inamsos"
SERVICE_USER="inamsos"
DOMAIN="inamsos.kemenkes.go.id"
ADMIN_DOMAIN="admin.inamsos.kemenkes.go.id"
MONITORING_DOMAIN="monitoring.inamsos.kemenkes.go.id"

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
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    exit 1
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
    fi
}

# Check system requirements
check_requirements() {
    info "Checking system requirements..."

    # Check OS
    if [[ ! -f /etc/os-release ]]; then
        error "Cannot determine operating system"
    fi

    source /etc/os-release
    info "Detected OS: $PRETTY_NAME"

    # Check architecture
    local arch=$(uname -m)
    if [[ "$arch" != "x86_64" ]]; then
        error "Unsupported architecture: $arch. Only x86_64 is supported."
    fi

    # Check minimum resources
    local mem_gb=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $mem_gb -lt 16 ]]; then
        warn "System has less than 16GB RAM ($mem_gb GB detected). Performance may be affected."
    fi

    local cpu_cores=$(nproc)
    if [[ $cpu_cores -lt 4 ]]; then
        warn "System has less than 4 CPU cores ($cpu_cores detected). Performance may be affected."
    fi

    # Check disk space
    local disk_gb=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
    if [[ $disk_gb -lt 100 ]]; then
        error "Insufficient disk space. At least 100GB required, $disk_gb GB available."
    fi

    info "System requirements check passed"
}

# Install system dependencies
install_dependencies() {
    info "Installing system dependencies..."

    if command -v apt-get > /dev/null 2>&1; then
        # Ubuntu/Debian
        apt-get update
        apt-get install -y \
            curl \
            wget \
            git \
            unzip \
            htop \
            iotop \
            software-properties-common \
            apt-transport-https \
            ca-certificates \
            gnupg \
            lsb-release \
            ufw \
            certbot \
            python3-certbot-nginx \
            build-essential \
            python3 \
            python3-pip
    elif command -v yum > /dev/null 2>&1; then
        # CentOS/RHEL
        yum update -y
        yum install -y \
            curl \
            wget \
            git \
            unzip \
            htop \
            iotop \
            epel-release \
            yum-utils \
            firewalld \
            certbot \
            python3 \
            python3-pip \
            gcc \
            gcc-c++ \
            make
    else
        error "Unsupported package manager. Only apt-get and yum are supported."
    fi

    info "System dependencies installed"
}

# Install Docker
install_docker() {
    info "Installing Docker..."

    if command -v docker > /dev/null 2>&1; then
        local docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        info "Docker already installed: $docker_version"
    else
        # Install Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh

        # Start and enable Docker
        systemctl enable docker
        systemctl start docker

        # Add current user to docker group
        usermod -aG docker $SERVICE_USER

        info "Docker installed and started"
    fi

    # Install Docker Compose
    if command -v docker-compose > /dev/null 2>&1; then
        local compose_version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        info "Docker Compose already installed: $compose_version"
    else
        local compose_version="v2.20.0"
        curl -L "https://github.com/docker/compose/releases/download/$compose_version/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        info "Docker Compose $compose_version installed"
    fi
}

# Install security tools
install_security_tools() {
    info "Installing security scanning tools..."

    # Install Trivy
    if ! command -v trivy > /dev/null 2>&1; then
        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
        info "Trivy installed"
    else
        info "Trivy already installed"
    fi

    # Install Node.js for Semgrep
    if ! command -v node > /dev/null 2>&1; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs 2>/dev/null || yum install -y nodejs 2>/dev/null
        info "Node.js installed"
    else
        info "Node.js already installed"
    fi

    # Install Semgrep
    if ! command -v semgrep > /dev/null 2>&1; then
        pip install semgrep
        info "Semgrep installed"
    else
        info "Semgrep already installed"
    fi

    # Install network tools
    if command -v apt-get > /dev/null 2>&1; then
        apt-get install -y nmap openssl testssl.sh 2>/dev/null || true
    else
        yum install -y nmap openssl 2>/dev/null || true
    fi

    info "Security tools installed"
}

# Create service user
create_service_user() {
    info "Creating service user..."

    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/false -d "$INSTALL_DIR" "$SERVICE_USER"
        info "Service user $SERVICE_USER created"
    else
        info "Service user $SERVICE_USER already exists"
    fi
}

# Create directory structure
create_directories() {
    info "Creating directory structure..."

    # Main directories
    mkdir -p "$INSTALL_DIR"
    mkdir -p "/data/$PROJECT_NAME"/{postgres,redis,minio,prometheus,grafana,alertmanager,nginx_logs}
    mkdir -p "/backup"/{database,deployments,ssl,logs}
    mkdir -p "/var/log/$PROJECT_NAME"
    mkdir -p "/security"/{monitoring,blacklist,whitelist}
    mkdir -p "/reports"/{security,backups}

    # Set ownership
    chown -R "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/data/$PROJECT_NAME"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/backup"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/var/log/$PROJECT_NAME"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/security"
    chown -R "$SERVICE_USER:$SERVICE_USER" "/reports"

    # Set permissions
    chmod 755 "$INSTALL_DIR"
    chmod 700 "/backup"
    chmod 700 "/security"
    chmod 755 "/var/log/$PROJECT_NAME"

    info "Directory structure created"
}

# Clone repository
clone_repository() {
    info "Cloning INAMSOS repository..."

    # Check if git repository exists
    if [[ -d "$INSTALL_DIR/.git" ]]; then
        info "Repository already exists, updating..."
        cd "$INSTALL_DIR"
        sudo -u "$SERVICE_USER" git pull origin main
    else
        info "Cloning fresh repository..."
        sudo -u "$SERVICE_USER" git clone https://github.com/kemenkes/inamsos.git "$INSTALL_DIR"
    fi

    info "Repository cloned/updated"
}

# Setup environment configuration
setup_environment() {
    info "Setting up environment configuration..."

    # Generate secure passwords
    local db_password=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    local redis_password=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    local jwt_secret=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    local jwt_refresh_secret=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    local minio_access_key=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    local minio_secret_key=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    local grafana_password=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

    # Create environment file
    cat > "$INSTALL_DIR/.env.production" << EOF
# Database Configuration
DB_PASSWORD=$db_password
POSTGRES_DB=inamsos_prod
POSTGRES_USER=inamsos_user

# Redis Configuration
REDIS_PASSWORD=$redis_password

# JWT Configuration
JWT_SECRET=$jwt_secret
JWT_REFRESH_SECRET=$jwt_refresh_secret

# MinIO Configuration
MINIO_ACCESS_KEY=$minio_access_key
MINIO_SECRET_KEY=$minio_secret_key

# Grafana Configuration
GRAFANA_PASSWORD=$grafana_password

# Application Configuration
VERSION=1.0.0
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VCS_REF=\$(git rev-parse --short HEAD)

# Email Configuration (update with actual values)
SMTP_HOST=smtp.kemenkes.go.id
SMTP_PORT=587
SMTP_USER=noreply@inamsos.kemenkes.go.id
SMTP_PASS=your_smtp_password

# Monitoring Configuration
SLACK_WEBHOOK_URL=
DEPLOYMENT_EMAIL=admin@inamsos.kemenkes.go.id

# Domain Configuration
DOMAIN=$DOMAIN
ADMIN_DOMAIN=$ADMIN_DOMAIN
MONITORING_DOMAIN=$MONITORING_DOMAIN
EOF

    # Secure environment file
    chown "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR/.env.production"
    chmod 600 "$INSTALL_DIR/.env.production"

    info "Environment configuration created"

    # Save passwords for reference
    cat > "/root/inamos_credentials.txt" << EOF
INAMOS Production Credentials
==============================

Database Password: $db_password
Redis Password: $redis_password
JWT Secret: $jwt_secret
JWT Refresh Secret: $jwt_refresh_secret
MinIO Access Key: $minio_access_key
MinIO Secret Key: $minio_secret_key
Grafana Password: $grafana_password

Save this file securely!
EOF

    chmod 600 "/root/inamos_credentials.txt"

    info "Credentials saved to /root/inamos_credentials.txt"
}

# Configure firewall
configure_firewall() {
    info "Configuring firewall..."

    if command -v ufw > /dev/null 2>&1; then
        # Ubuntu/Debian - UFW
        ufw --force reset
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
        info "UFW firewall configured"
    elif command -v firewall-cmd > /dev/null 2>&1; then
        # CentOS/RHEL - firewalld
        systemctl enable firewalld
        systemctl start firewalld
        firewall-cmd --permanent --set-default-zone=public
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        info "firewalld configured"
    else
        warn "No supported firewall found. Please configure manually."
    fi
}

# Configure SSH
configure_ssh() {
    info "Configuring SSH security..."

    # Backup original SSH config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

    # Update SSH configuration
    sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config
    sed -i 's/#Protocol 2/Protocol 2/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 300/' /etc/ssh/sshd_config

    # Restart SSH service
    systemctl restart sshd

    info "SSH security configured"
}

# Setup SSL certificates
setup_ssl() {
    info "Setting up SSL certificates..."

    # Make SSL script executable
    chmod +x "$INSTALL_DIR/ssl/setup-ssl.sh"
    chmod +x "$INSTALL_DIR/scripts/setup-letsencrypt.sh"
    chmod +x "$INSTALL_DIR/scripts/renew-ssl.sh"

    # Run SSL setup
    cd "$INSTALL_DIR"
    sudo -u "$SERVICE_USER" ./ssl/setup-ssl.sh

    info "SSL certificates setup completed"
}

# Deploy application
deploy_application() {
    info "Deploying INAMOS application..."

    cd "$INSTALL_DIR"

    # Load environment variables
    source .env.production

    # Build and deploy
    sudo -u "$SERVICE_USER" docker-compose -f docker-compose.production.yml build
    sudo -u "$SERVICE_USER" docker-compose -f docker-compose.production.yml up -d

    info "Application deployed"
}

# Setup systemd services
setup_services() {
    info "Setting up systemd services..."

    # Security monitoring service
    cat > /etc/systemd/system/inamos-security-monitor.service << EOF
[Unit]
Description=INAMOS Security Monitoring
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/scripts/security-monitoring.sh --continuous
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

    # Backup service
    cat > /etc/systemd/system/inamos-backup.service << EOF
[Unit]
Description=INAMOS Database Backup
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/scripts/backup-database.sh

[Install]
WantedBy=multi-user.target
EOF

    # Backup timer
    cat > /etc/systemd/system/inamos-backup.timer << EOF
[Unit]
Description=INAMOS Database Backup Timer
Requires=inamos-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

    # Enable services
    systemctl daemon-reload
    systemctl enable inamos-security-monitor
    systemctl enable inamos-backup.timer
    systemctl start inamos-backup.timer

    info "Systemd services configured"
}

# Verify installation
verify_installation() {
    info "Verifying installation..."

    # Wait for services to start
    sleep 30

    # Check service status
    if docker-compose -f "$INSTALL_DIR/docker-compose.production.yml" ps | grep -q "Up"; then
        info "✓ Docker services are running"
    else
        error "Docker services are not running properly"
    fi

    # Check database connectivity
    if docker-compose -f "$INSTALL_DIR/docker-compose.production.yml" exec -T postgres pg_isready -U inamsos_user -d inamsos_prod > /dev/null 2>&1; then
        info "✓ Database is accessible"
    else
        warn "Database is not yet ready"
    fi

    # Check Redis connectivity
    if docker-compose -f "$INSTALL_DIR/docker-compose.production.yml" exec -T redis redis-cli ping > /dev/null 2>&1; then
        info "✓ Redis is accessible"
    else
        warn "Redis is not yet ready"
    fi

    info "Installation verification completed"
}

# Generate final report
generate_report() {
    info "Generating installation report..."

    local report_file="/root/inamos_installation_report.txt"

    cat > "$report_file" << EOF
INAMOS Production Installation Report
======================================

Installation Date: $(date)
Server: $(hostname)
IP Address: $(curl -s ifconfig.me 2>/dev/null || echo "Unknown")

Domains Configured:
- Main: $DOMAIN
- Admin: $ADMIN_DOMAIN
- Monitoring: $MONITORING_DOMAIN

Services Status:
$(docker-compose -f "$INSTALL_DIR/docker-compose.production.yml" ps)

Access URLs:
- Main Application: https://$DOMAIN
- Admin Panel: https://$ADMIN_DOMAIN
- Monitoring: https://$MONITORING_DOMAIN

Important Files:
- Application: $INSTALL_DIR
- Data: /data/$PROJECT_NAME
- Backups: /backup
- Logs: /var/log/$PROJECT_NAME
- Credentials: /root/inamos_credentials.txt

Next Steps:
1. Configure DNS records to point to this server
2. Update email configuration in .env.production
3. Test application functionality
4. Configure monitoring alerts
5. Setup backup verification procedures

Service Management:
- Restart services: docker-compose -f $INSTALL_DIR/docker-compose.production.yml restart
- View logs: docker-compose -f $INSTALL_DIR/docker-compose.production.yml logs -f [service]
- Update application: $INSTALL_DIR/scripts/deploy-production.sh

Security Monitoring:
- Status: systemctl status inamos-security-monitor
- Logs: journalctl -u inamos-security-monitor -f

Backup Schedule:
- Daily backups at 2:00 AM
- Weekly verification on Sundays
- Monthly security scans

For support, contact: security@inamsos.kemenkes.go.id
EOF

    info "Installation report generated: $report_file"
}

# Main installation function
main() {
    info "Starting INAMOS production setup..."

    # Check if running as root
    check_root

    # Installation steps
    check_requirements
    install_dependencies
    install_docker
    install_security_tools
    create_service_user
    create_directories
    clone_repository
    setup_environment
    configure_firewall
    configure_ssh
    setup_ssl
    deploy_application
    setup_services
    verify_installation
    generate_report

    info "INAMOS production setup completed successfully!"
    echo ""
    echo "🎉 Setup Complete!"
    echo ""
    echo "Next Steps:"
    echo "1. Configure DNS records for your domains"
    echo "2. Let's Encrypt certificates will be obtained automatically"
    echo "3. Update email configuration in .env.production"
    echo "4. Access the application at https://$DOMAIN"
    echo "5. Check monitoring at https://$MONITORING_DOMAIN"
    echo ""
    echo "Important credentials are saved in: /root/inamos_credentials.txt"
    echo "Installation report: /root/inamos_installation_report.txt"
    echo ""
    echo "For support, contact: security@inamsos.kemenkes.go.id"
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Setup script failed on line $line_number with exit code $exit_code"
    echo ""
    echo "For troubleshooting, check:"
    echo "- System logs: journalctl -xe"
    echo "- Docker logs: docker-compose logs"
    echo "- Setup logs: /var/log/$PROJECT_NAME/"
    echo ""
    echo "For support, contact: security@inamsos.kemenkes.go.id"

    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Show usage if help requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Usage: $0 [OPTIONS]

This script sets up INAMOS production environment with all required components.

OPTIONS:
    --help, -h        Show this help message

REQUIREMENTS:
- Root access
- 16GB+ RAM
- 4+ CPU cores
- 100GB+ disk space
- Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- Static IP address
- Domain names configured

This script installs:
- Docker and Docker Compose
- Security scanning tools
- INAMOS application
- Monitoring stack
- SSL certificates
- Security monitoring
- Backup automation

The setup typically takes 15-30 minutes depending on network speed.
EOF
    exit 0
fi

# Run main function
main "$@"