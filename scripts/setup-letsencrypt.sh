#!/bin/bash

# Let's Encrypt Certificate Setup for INAMSOS
# This script obtains and configures SSL certificates from Let's Encrypt

set -euo pipefail

# Configuration
DOMAIN="inamsos.kemenkes.go.id"
ADMIN_DOMAIN="admin.inamsos.kemenkes.go.id"
MONITORING_DOMAIN="monitoring.inamsos.kemenkes.go.id"
EMAIL="admin@kemenkes.go.id"
SSL_DIR="/etc/nginx/ssl"
DOCKER_COMPOSE_DIR="/home/yopi/Projects/tumor-registry"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

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
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root to install certificates"
fi

# Check if domain is resolving
check_domain_resolution() {
    local domain=$1
    log "Checking DNS resolution for $domain"

    if nslookup "$domain" > /dev/null 2>&1; then
        log "✓ DNS resolution successful for $domain"
        return 0
    else
        error "✗ DNS resolution failed for $domain"
        return 1
    fi
}

# Wait for Nginx to be ready
wait_for_nginx() {
    log "Waiting for Nginx to be ready..."
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost/health > /dev/null 2>&1; then
            log "✓ Nginx is ready"
            return 0
        fi

        log "Attempt $attempt/$max_attempts: Nginx not ready, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done

    error "Nginx did not become ready within $max_attempts attempts"
}

# Install Certbot if not already installed
install_certbot() {
    if ! command -v certbot > /dev/null 2>&1; then
        log "Installing Certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    else
        log "✓ Certbot is already installed"
    fi
}

# Obtain Let's Encrypt certificate
obtain_certificate() {
    local domains=("$DOMAIN" "www.$DOMAIN" "$ADMIN_DOMAIN" "$MONITORING_DOMAIN")
    local domain_args=""

    for domain in "${domains[@]}"; do
        check_domain_resolution "$domain"
        domain_args+=" -d $domain"
    done

    log "Obtaining Let's Encrypt certificate for domains: ${domains[*]}"

    # Use certbot with nginx plugin
    if certbot certonly \
        --nginx \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        --rsa-key-size 4096 \
        --must-staple \
        --staple-ocsp \
        --redirect \
        $domain_args; then
        log "✓ Let's Encrypt certificate obtained successfully"
    else
        error "Failed to obtain Let's Encrypt certificate"
    fi
}

# Install certificate
install_certificate() {
    log "Installing SSL certificates..."

    # Copy certificates to SSL directory
    cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/inamsos.crt"
    cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/inamsos.key"
    cp "/etc/letsencrypt/live/$DOMAIN/chain.pem" "$SSL_DIR/inamsos-chain.crt"

    # Set proper permissions
    chmod 644 "$SSL_DIR/inamsos.crt"
    chmod 644 "$SSL_DIR/inamsos-chain.crt"
    chmod 600 "$SSL_DIR/inamsos.key"

    # Create certificate bundle for haproxy if needed
    cat "$SSL_DIR/inamsos.crt" "$SSL_DIR/inamsos-chain.crt" > "$SSL_DIR/inamsos-bundle.crt"

    log "✓ SSL certificates installed successfully"
}

# Test certificate
test_certificate() {
    log "Testing SSL certificate..."

    # Test with openssl
    if echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
        log "✓ SSL certificate test passed"
    else
        error "✗ SSL certificate test failed"
    fi

    # Test with curl
    if curl -I --silent --fail "https://$DOMAIN/health" > /dev/null 2>&1; then
        log "✓ HTTPS connection test passed"
    else
        warn "HTTPS connection test failed - may need to restart services"
    fi
}

# Restart Nginx to apply new certificates
restart_nginx() {
    log "Restarting Nginx to apply new certificates..."

    cd "$DOCKER_COMPOSE_DIR"
    docker-compose -f docker-compose.prod.yml restart nginx

    # Wait for Nginx to be ready
    sleep 10
    wait_for_nginx

    log "✓ Nginx restarted successfully"
}

# Setup automatic renewal
setup_auto_renewal() {
    log "Setting up automatic certificate renewal..."

    # Test renewal process
    if certbot renew --dry-run > /dev/null 2>&1; then
        log "✓ Certificate renewal test passed"
    else
        warn "Certificate renewal test failed"
    fi

    # Ensure renewal timer is active
    systemctl enable certbot.timer
    systemctl start certbot.timer

    log "✓ Automatic renewal configured"
}

# Main execution
main() {
    log "Starting Let's Encrypt SSL certificate setup for INAMSOS"

    # Check prerequisites
    install_certbot

    # Wait for Nginx
    wait_for_nginx

    # Obtain and install certificate
    obtain_certificate
    install_certificate

    # Test and apply
    test_certificate
    restart_nginx

    # Setup auto-renewal
    setup_auto_renewal

    log "Let's Encrypt SSL certificate setup completed successfully!"
    log ""
    log "Certificate details:"
    log "- Primary domain: $DOMAIN"
    log "- Admin domain: $ADMIN_DOMAIN"
    log "- Monitoring domain: $MONITORING_DOMAIN"
    log "- Certificate location: /etc/letsencrypt/live/$DOMAIN/"
    log "- Auto-renewal: Enabled (daily check)"
    log ""
    log "To check renewal status: systemctl status certbot.timer"
    log "To test renewal: certbot renew --dry-run"
    log "To view certificates: certbot certificates"
}

# Run main function
main "$@"