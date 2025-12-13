#!/bin/bash
# INAMSOS SSL Certificate Setup Script
# Using Let's Encrypt with Certbot

set -e

DOMAIN="${DOMAIN:-inamsos.kemenkes.go.id}"
API_DOMAIN="${API_DOMAIN:-api.inamsos.kemenkes.go.id}"
EMAIL="${SSL_EMAIL:-admin@inamsos.kemenkes.go.id}"
SSL_DIR="./ssl"

echo "========================================="
echo "INAMSOS SSL Certificate Setup"
echo "========================================="
echo "Domain: ${DOMAIN}"
echo "API Domain: ${API_DOMAIN}"
echo "Email: ${EMAIL}"
echo "========================================="

# Create SSL directory
mkdir -p "${SSL_DIR}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Generate DH parameters (if not exists)
if [ ! -f "${SSL_DIR}/dhparam.pem" ]; then
    echo "Generating DH parameters (this may take a while)..."
    openssl dhparam -out "${SSL_DIR}/dhparam.pem" 2048
fi

# Request SSL certificate
echo "Requesting SSL certificate from Let's Encrypt..."
sudo certbot certonly \
    --standalone \
    --preferred-challenges http \
    --agree-tos \
    --no-eff-email \
    --email "${EMAIL}" \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}" \
    -d "${API_DOMAIN}"

# Copy certificates to SSL directory
sudo cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" "${SSL_DIR}/"
sudo cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" "${SSL_DIR}/"
sudo cp "/etc/letsencrypt/live/${DOMAIN}/chain.pem" "${SSL_DIR}/"

# Set permissions
sudo chmod 644 "${SSL_DIR}/fullchain.pem"
sudo chmod 600 "${SSL_DIR}/privkey.pem"
sudo chmod 644 "${SSL_DIR}/chain.pem"

# Setup automatic renewal
echo "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 0 * * 0 certbot renew --quiet && docker-compose -f docker-compose.production.yml restart nginx") | crontab -

echo "========================================="
echo "SSL Setup completed!"
echo "========================================="
echo "Certificates location: ${SSL_DIR}"
echo "Renewal cron job added (weekly check)"
echo "========================================="

exit 0
