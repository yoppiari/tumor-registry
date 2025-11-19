#!/bin/bash

# SSL Certificate Renewal Script for INAMSOS
# This script automatically renews SSL certificates and reloads services

set -euo pipefail

# Configuration
DOMAIN="inamsos.kemenkes.go.id"
DOCKER_COMPOSE_DIR="/home/yopi/Projects/tumor-registry"
SSL_DIR="/etc/nginx/ssl"
LOG_FILE="/var/log/ssl-renewal.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    local message="$1"
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $message${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message" >> "$LOG_FILE"
}

error() {
    local message="$1"
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $message${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $message" >> "$LOG_FILE"
    exit 1
}

warn() {
    local message="$1"
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $message${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $message" >> "$LOG_FILE"
}

# Function to send notification (customize as needed)
send_notification() {
    local subject="$1"
    local message="$2"

    # Email notification (configure as needed)
    if command -v mail > /dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "admin@kemenkes.go.id"
    fi

    # Slack webhook (if configured)
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$subject: $message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Check if certificates need renewal
check_renewal_needed() {
    log "Checking if certificates need renewal..."

    # Check certificate expiration
    if certbot certificates 2>/dev/null | grep -q "NOT EXPIRED"; then
        local expiry_date
        expiry_date=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
        local expiry_epoch
        expiry_epoch=$(date -d "$expiry_date" +%s)
        local current_epoch
        current_epoch=$(date +%s)
        local days_until_expiry
        days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

        log "Certificate expires in $days_until_expiry days"

        if [[ $days_until_expiry -lt 30 ]]; then
            log "Certificate needs renewal"
            return 0
        else
            log "Certificate does not need renewal yet"
            return 1
        fi
    else
        log "No valid certificate found, attempting renewal"
        return 0
    fi
}

# Renew certificates
renew_certificates() {
    log "Starting certificate renewal..."

    # Run certbot renewal
    if certbot renew --quiet --no-self-upgrade; then
        log "✓ Certificate renewal completed successfully"
        return 0
    else
        error "✗ Certificate renewal failed"
        return 1
    fi
}

# Install renewed certificates
install_renewed_certificates() {
    log "Installing renewed SSL certificates..."

    # Check if certificates were actually renewed
    local cert_path="/etc/letsencrypt/live/$DOMAIN"
    if [[ -f "$cert_path/fullchain.pem" && -f "$cert_path/privkey.pem" ]]; then
        # Backup current certificates
        if [[ -f "$SSL_DIR/inamsos.crt" ]]; then
            cp "$SSL_DIR/inamsos.crt" "$SSL_DIR/inamsos.crt.backup.$(date +%Y%m%d_%H%M%S)"
            cp "$SSL_DIR/inamsos.key" "$SSL_DIR/inamsos.key.backup.$(date +%Y%m%d_%H%M%S)"
        fi

        # Install new certificates
        cp "$cert_path/fullchain.pem" "$SSL_DIR/inamsos.crt"
        cp "$cert_path/privkey.pem" "$SSL_DIR/inamsos.key"
        cp "$cert_path/chain.pem" "$SSL_DIR/inamsos-chain.crt"

        # Set proper permissions
        chmod 644 "$SSL_DIR/inamsos.crt"
        chmod 644 "$SSL_DIR/inamsos-chain.crt"
        chmod 600 "$SSL_DIR/inamsos.key"

        # Create certificate bundle
        cat "$SSL_DIR/inamsos.crt" "$SSL_DIR/inamsos-chain.crt" > "$SSL_DIR/inamsos-bundle.crt"

        log "✓ Renewed certificates installed successfully"
        return 0
    else
        error "Renewed certificates not found at $cert_path"
        return 1
    fi
}

# Test renewed certificates
test_renewed_certificates() {
    log "Testing renewed SSL certificates..."

    # Test certificate validity
    if echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -checkend 2592000 > /dev/null 2>&1; then
        log "✓ Certificate validity test passed"
    else
        error "✗ Certificate validity test failed"
        return 1
    fi

    # Test HTTPS connection
    if curl -I --silent --fail "https://$DOMAIN/health" > /dev/null 2>&1; then
        log "✓ HTTPS connection test passed"
    else
        warn "HTTPS connection test failed - may need service restart"
        return 0
    fi

    return 0
}

# Reload services to apply new certificates
reload_services() {
    log "Reloading services to apply renewed certificates..."

    cd "$DOCKER_COMPOSE_DIR"

    # Gracefully reload Nginx
    if docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload; then
        log "✓ Nginx reloaded successfully"
    else
        warn "Failed to reload Nginx, attempting restart..."
        docker-compose -f docker-compose.prod.yml restart nginx
        sleep 10
    fi

    # Restart other services that might need certificate updates
    # Add any additional services here if needed

    log "✓ Services reloaded successfully"
}

# Verify final configuration
verify_configuration() {
    log "Verifying final SSL configuration..."

    # Check if services are responding
    if curl -f --silent "https://$DOMAIN/health" > /dev/null 2>&1; then
        log "✓ SSL configuration verified successfully"
        return 0
    else
        warn "SSL configuration verification failed, but certificates were renewed"
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old certificate backups..."

    # Keep only last 7 days of backups
    find "$SSL_DIR" -name "*.backup.*" -mtime +7 -delete 2>/dev/null || true

    log "✓ Cleanup completed"
}

# Main renewal function
main() {
    log "Starting SSL certificate renewal check"

    # Check if renewal is needed
    if ! check_renewal_needed; then
        log "No renewal needed, exiting"
        exit 0
    fi

    # Send notification that renewal is starting
    send_notification "SSL Certificate Renewal Started" "Starting SSL certificate renewal for INAMSOS"

    # Perform renewal
    if renew_certificates; then
        install_renewed_certificates

        # Test certificates
        if test_renewed_certificates; then
            reload_services
            verify_configuration
            cleanup_old_backups

            # Send success notification
            send_notification "SSL Certificate Renewal Completed" "SSL certificates for INAMSOS have been successfully renewed"

            log "✓ SSL certificate renewal completed successfully"
        else
            # Send warning notification
            send_notification "SSL Certificate Renewal Warning" "SSL certificates were renewed but tests failed. Manual intervention may be required."
            warn "Certificate tests failed, but renewal was completed"
        fi
    else
        # Send error notification
        send_notification "SSL Certificate Renewal Failed" "Failed to renew SSL certificates for INAMSOS. Manual intervention required."
        error "SSL certificate renewal failed"
    fi
}

# Handle script interruption gracefully
trap 'warn "Script interrupted by user"; exit 1' INT TERM

# Run main function
main "$@"