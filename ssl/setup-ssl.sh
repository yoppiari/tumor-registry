#!/bin/bash

# SSL/TLS Setup Script for INAMSOS Tumor Registry
# This script sets up SSL certificates using Let's Encrypt

set -euo pipefail

# Configuration
DOMAIN="inamsos.kemenkes.go.id"
ADMIN_DOMAIN="admin.inamsos.kemenkes.go.id"
MONITORING_DOMAIN="monitoring.inamsos.kemenkes.go.id"
EMAIL="admin@kemenkes.go.id"
SSL_DIR="/etc/nginx/ssl"
DOCKER_COMPOSE_DIR="/home/yopi/Projects/tumor-registry"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker first."
fi

# Create SSL directory structure
log "Creating SSL directory structure..."
mkdir -p "$SSL_DIR"/{certs,private,archive}

# Generate strong DH parameters
log "Generating strong DH parameters (this may take a few minutes)..."
openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048

# Create self-signed certificates for initial setup
log "Creating self-signed certificates for initial setup..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/inamsos.key" \
    -out "$SSL_DIR/inamsos.crt" \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Kementerian Kesehatan/OU=INAMSOS/CN=$DOMAIN"

# Create default certificates for catch-all server
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/default.key" \
    -out "$SSL_DIR/default.crt" \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Kementerian Kesehatan/OU=INAMSOS/CN=default"

# Set proper permissions
chmod 600 "$SSL_DIR"/*.key
chmod 644 "$SSL_DIR"/*.crt
chmod 644 "$SSL_DIR/dhparam.pem"

# Create Let's Encrypt directory for staging
mkdir -p "$SSL_DIR/letsencrypt"

# Create Certbot configuration
cat > "$SSL_DIR/letsencrypt/cli.ini" << EOF
# Let's Encrypt configuration for INAMSOS
email = $EMAIL
agree-tos = True
non-interactive = True
rsa-key-size = 4096
preferred-challenges = dns,http
staging = False
must-staple = True
key-type = ecdsa
# Use elliptic curve keys for better performance
ecdsa-curve = secp384r1
EOF

# Create systemd service for automatic renewal
log "Creating SSL renewal service..."
sudo tee /etc/systemd/system/ssl-renewal.service > /dev/null << EOF
[Unit]
Description=SSL Certificate Renewal for INAMSOS
After=network.target

[Service]
Type=oneshot
ExecStart=$DOCKER_COMPOSE_DIR/scripts/renew-ssl.sh
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

# Create systemd timer for automatic renewal
sudo tee /etc/systemd/system/ssl-renewal.timer > /dev/null << EOF
[Unit]
Description=SSL Certificate Renewal Timer for INAMSOS
Requires=ssl-renewal.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Enable and start the timer
sudo systemctl daemon-reload
sudo systemctl enable ssl-renewal.timer
sudo systemctl start ssl-renewal.timer

log "SSL renewal service has been configured and started"

# Create certificate validation script
cat > "$DOCKER_COMPOSE_DIR/scripts/validate-ssl.sh" << 'EOF'
#!/bin/bash

# SSL Certificate Validation Script
# This script validates SSL certificates and alerts on issues

set -euo pipefail

DOMAIN="inamsos.kemenkes.go.id"
ADMIN_DOMAIN="admin.inamsos.kemenkes.go.id"
MONITORING_DOMAIN="monitoring.inamsos.kemenkes.go.id"
DAYS_WARNING=30
DAYS_CRITICAL=7

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

check_certificate() {
    local domain=$1
    local port=${2:-443}

    log "Checking certificate for $domain:$port"

    # Get certificate expiration date
    local expiry_date
    expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:$port" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)

    if [[ -z "$expiry_date" ]]; then
        error "Failed to retrieve certificate for $domain:$port"
        return 1
    fi

    # Convert to epoch time
    local expiry_epoch
    expiry_epoch=$(date -d "$expiry_date" +%s)
    local current_epoch
    current_epoch=$(date +%s)
    local days_until_expiry
    days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

    log "Certificate for $domain expires in $days_until_expiry days ($expiry_date)"

    # Check expiration thresholds
    if [[ $days_until_expiry -lt $DAYS_CRITICAL ]]; then
        error "Certificate for $domain expires in $days_until_expiry days (CRITICAL)"
        # Send alert (implement your alert mechanism here)
        return 2
    elif [[ $days_until_expiry -lt $DAYS_WARNING ]]; then
        warn "Certificate for $domain expires in $days_until_expiry days (WARNING)"
        # Send alert (implement your alert mechanism here)
        return 1
    fi

    # Check certificate strength
    local cert_info
    cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:$port" 2>/dev/null | openssl x509 -noout -text)

    # Check key size
    local key_size
    key_size=$(echo "$cert_info" | grep -A1 "Public Key Algorithm" | grep "Public-Key" | cut -d: -f2 | tr -d ' ')

    if [[ -n "$key_size" && "$key_size" -lt 2048 ]]; then
        warn "Certificate for $domain uses a key size smaller than 2048 bits: $key_size"
    fi

    # Check signature algorithm
    local signature_algorithm
    signature_algorithm=$(echo "$cert_info" | grep "Signature Algorithm" | head -1 | cut -d: -f2 | tr -d ' ')

    if [[ "$signature_algorithm" == *"sha1"* ]]; then
        error "Certificate for $domain uses deprecated SHA-1 signature: $signature_algorithm"
        return 1
    fi

    return 0
}

# Main validation
log "Starting SSL certificate validation..."

check_certificate "$DOMAIN"
check_certificate "$ADMIN_DOMAIN"
check_certificate "$MONITORING_DOMAIN"

log "SSL certificate validation completed"
EOF

chmod +x "$DOCKER_COMPOSE_DIR/scripts/validate-ssl.sh"

# Create backup script for certificates
cat > "$DOCKER_COMPOSE_DIR/scripts/backup-ssl.sh" << 'EOF'
#!/bin/bash

# SSL Certificate Backup Script
# This script backs up SSL certificates

set -euo pipefail

SSL_DIR="/etc/nginx/ssl"
BACKUP_DIR="/backup/ssl"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup archive
log "Creating SSL certificate backup..."
tar -czf "$BACKUP_DIR/ssl_backup_$DATE.tar.gz" -C "$SSL_DIR" .

# Create encrypted backup
log "Creating encrypted backup..."
gpg --symmetric --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 --s2k-count 65536 --output "$BACKUP_DIR/ssl_backup_$DATE.tar.gz.gpg" "$BACKUP_DIR/ssl_backup_$DATE.tar.gz"

# Remove unencrypted backup
rm "$BACKUP_DIR/ssl_backup_$DATE.tar.gz"

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "ssl_backup_*.tar.gz.gpg" -mtime +30 -delete

log "SSL certificate backup completed: ssl_backup_$DATE.tar.gz.gpg"

# Test backup integrity
log "Testing backup integrity..."
gpg --decrypt --quiet --output /dev/null --batch --passphrase-fd 0 "$BACKUP_DIR/ssl_backup_$DATE.tar.gz.gpg" <<< "test" 2>/dev/null && log "Backup integrity test passed" || error "Backup integrity test failed"
EOF

chmod +x "$DOCKER_COMPOSE_DIR/scripts/backup-ssl.sh"

log "SSL setup completed successfully!"
log ""
log "Next steps:"
log "1. Update your DNS records to point to your server"
log "2. Run 'docker-compose -f docker-compose.prod.yml up -d nginx' to start with self-signed certificates"
log "3. Once DNS is propagated, run 'sudo /home/yopi/Projects/tumor-registry/scripts/setup-letsencrypt.sh' to get real certificates"
log "4. Monitor certificate renewal with: journalctl -u ssl-renewal.service -f"
log ""
log "SSL certificate validation: $DOCKER_COMPOSE_DIR/scripts/validate-ssl.sh"
log "SSL certificate backup: $DOCKER_COMPOSE_DIR/scripts/backup-ssl.sh"