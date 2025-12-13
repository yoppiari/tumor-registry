#!/bin/bash
# INAMSOS Database Backup Script
# Automated PostgreSQL backup with rotation

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-inamsos_prod}"
POSTGRES_USER="${POSTGRES_USER:-inamsos_prod}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

# Timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/inamsos_backup_${TIMESTAMP}.sql"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

echo "========================================="
echo "INAMSOS Database Backup"
echo "========================================="
echo "Started at: $(date)"
echo "Database: ${POSTGRES_DB}"
echo "Host: ${POSTGRES_HOST}"
echo "========================================="

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Perform backup
echo "Creating database backup..."
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
    -h "${POSTGRES_HOST}" \
    -p "${POSTGRES_PORT}" \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    --format=plain \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    > "${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Database backup created successfully"

    # Compress backup
    echo "Compressing backup..."
    gzip -9 "${BACKUP_FILE}"

    if [ $? -eq 0 ]; then
        echo "✅ Backup compressed successfully"
        BACKUP_SIZE=$(du -h "${BACKUP_FILE_GZ}" | cut -f1)
        echo "Backup size: ${BACKUP_SIZE}"
        echo "Backup location: ${BACKUP_FILE_GZ}"
    else
        echo "❌ Failed to compress backup"
        exit 1
    fi
else
    echo "❌ Database backup failed"
    exit 1
fi

# Remove old backups
echo "Cleaning up old backups (retention: ${BACKUP_RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "inamsos_backup_*.sql.gz" -type f -mtime +${BACKUP_RETENTION_DAYS} -delete
REMAINING_BACKUPS=$(find "${BACKUP_DIR}" -name "inamsos_backup_*.sql.gz" -type f | wc -l)
echo "Remaining backups: ${REMAINING_BACKUPS}"

# Create backup checksum
echo "Creating backup checksum..."
sha256sum "${BACKUP_FILE_GZ}" > "${BACKUP_FILE_GZ}.sha256"

echo "========================================="
echo "Backup completed at: $(date)"
echo "========================================="

exit 0
