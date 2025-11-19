#!/bin/bash

# INAMSOS Database Backup Script
# Comprehensive backup solution for PostgreSQL database with point-in-time recovery

set -euo pipefail

# Configuration
DB_HOST="postgres"
DB_PORT="5432"
DB_NAME="inamsos_prod"
DB_USER="inamsos_user"
BACKUP_DIR="/backup/database"
LOG_DIR="/var/log/inamsos"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="inamsos_backup_${DATE}"
RETENTION_DAYS=30
RETENTION_WEEKS=12
RETENTION_MONTHS=12

# Backup types
FULL_BACKUP_DAY="Sunday"  # Weekly full backup on Sunday
INCREMENTAL_BACKUP=true   # Enable incremental backups

# S3 Configuration (optional)
S3_BUCKET="s3://inamsos-backups"
S3_REGION="ap-southeast-1"

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
    echo "[$timestamp] [$level] $message" >> "$LOG_DIR/backup.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "$LOG_DIR/backup.log"
    exit 1
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "$LOG_DIR/backup.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "$LOG_DIR/backup.log"
}

# Send notification function
send_notification() {
    local subject="$1"
    local message="$2"
    local priority="${3:-normal}"

    # Email notification
    if command -v mail > /dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "backup-team@inamsos.kemenkes.go.id"
    fi

    # Slack notification (if webhook is configured)
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        local color="good"
        [[ "$priority" == "high" ]] && color="danger"
        [[ "$priority" == "warning" ]] && color="warning"

        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"$subject\",
                    \"text\": \"$message\",
                    \"footer\": \"INAMSOS Backup System\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Create backup directories
create_backup_dirs() {
    info "Creating backup directories"
    mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly,incremental,wal}
    mkdir -p "$LOG_DIR"
    chmod 755 "$BACKUP_DIR"
    chmod 700 "$LOG_DIR"
}

# Check database connectivity
check_database() {
    info "Checking database connectivity"

    if ! PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
        error "Database is not ready or accessible"
    fi

    # Test actual connection
    if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        error "Cannot connect to database with provided credentials"
    fi

    info "Database connectivity verified"
}

# Get database statistics
get_db_stats() {
    info "Collecting database statistics"

    local stats_file="$BACKUP_DIR/db_stats_${DATE}.json"

    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -F',' << EOF > "$stats_file"
SELECT
    'database_size' as metric,
    pg_database_size('$DB_NAME') as value,
    'bytes' as unit
UNION ALL
SELECT
    'table_count' as metric,
    count(*)::text as value,
    'count' as unit
FROM information_schema.tables
WHERE table_schema = 'public'
UNION ALL
SELECT
    'total_connections' as metric,
    count(*)::text as value,
    'connections' as unit
FROM pg_stat_activity
WHERE datname = '$DB_NAME';
EOF

    info "Database statistics saved to $stats_file"
}

# Pre-backup checks
pre_backup_checks() {
    info "Running pre-backup checks"

    # Check disk space (need at least 10GB free)
    local available_space=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    local required_space=10485760  # 10GB in KB

    if [[ $available_space -lt $required_space ]]; then
        error "Insufficient disk space for backup. Available: $((available_space/1024/1024))GB, Required: 10GB"
    fi

    # Check database size
    local db_size=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT pg_database_size('$DB_NAME');")
    local required_db_space=$((db_size * 2 / 1024 / 1024))  # Double the DB size in MB for compression

    if [[ $available_space -lt $required_db_space ]]; then
        error "Insufficient disk space for database backup. DB Size: $((db_size/1024/1024))GB, Available: $((available_space/1024/1024))GB"
    fi

    # Check if database is in recovery mode
    local recovery_status=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT pg_is_in_recovery();")
    if [[ "$recovery_status" == "t" ]]; then
        warn "Database is in recovery mode. Backup may not be consistent."
    fi

    info "Pre-backup checks completed successfully"
}

# Create base backup
create_base_backup() {
    local backup_type="$1"
    local backup_path="$BACKUP_DIR/${backup_type}/${BACKUP_NAME}"

    info "Starting ${backup_type} backup"
    local start_time=$(date +%s)

    # Create backup directory
    mkdir -p "$backup_path"

    # Get database size before backup
    local pre_size=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT pg_database_size('$DB_NAME');")

    # Perform database backup with compression
    info "Creating compressed database dump"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --format=custom \
        --compress=9 \
        --verbose \
        --lock-wait-timeout=300000 \
        --no-password \
        --file="$backup_path/database.dump" 2>&1 | tee -a "$LOG_DIR/backup.log"

    local dump_exit_code=${PIPESTATUS[0]}
    if [[ $dump_exit_code -ne 0 ]]; then
        error "Database dump failed with exit code: $dump_exit_code"
    fi

    # Verify backup integrity
    info "Verifying backup integrity"

    if ! PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        --list \
        --no-password \
        "$backup_path/database.dump" > /dev/null 2>&1; then
        error "Backup integrity verification failed"
    fi

    # Create backup metadata
    local backup_size=$(stat -c%s "$backup_path/database.dump")
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    cat > "$backup_path/metadata.json" << EOF
{
    "backup_name": "$BACKUP_NAME",
    "backup_type": "$backup_type",
    "database_name": "$DB_NAME",
    "database_host": "$DB_HOST",
    "database_port": "$DB_PORT",
    "backup_start_time": "$(date -d "@$start_time" -Iseconds)",
    "backup_end_time": "$(date -d "@$end_time" -Iseconds)",
    "backup_duration_seconds": $duration,
    "pre_backup_size_bytes": $pre_size,
    "backup_size_bytes": $backup_size,
    "compression_ratio": $(echo "scale=2; $backup_size / $pre_size" | bc -l),
    "backup_checksum": "$(sha256sum "$backup_path/database.dump" | cut -d' ' -f1)",
    "postgresql_version": "$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT version();")",
    "backup_method": "pg_dump",
    "server_hostname": "$(hostname)",
    "backup_script_version": "1.0"
}
EOF

    # Create checksum file
    sha256sum "$backup_path/database.dump" > "$backup_path/sha256sum.txt"

    # Compress the entire backup directory
    info "Compressing backup directory"
    tar -czf "${backup_path}.tar.gz" -C "$(dirname "$backup_path")" "$(basename "$backup_path")"

    # Remove uncompressed directory
    rm -rf "$backup_path"

    local compressed_size=$(stat -c%s "${backup_path}.tar.gz")
    local final_duration=$(($(date +%s) - start_time))

    info "${backup_type} backup completed successfully"
    info "Backup file: ${backup_path}.tar.gz"
    info "Original size: $((backup_size/1024/1024))MB"
    info "Compressed size: $((compressed_size/1024/1024))MB"
    info "Total duration: ${final_duration}s"

    # Update backup log
    echo "$DATE,$backup_type,$backup_size,$compressed_size,$final_duration,success" >> "$LOG_DIR/backup_history.csv"
}

# Create WAL archive backup
create_wal_backup() {
    info "Creating WAL archive backup"

    local wal_dir="/var/lib/postgresql/wal"
    local wal_backup_path="$BACKUP_DIR/wal/wal_${DATE}.tar.gz"

    # Archive current WAL files
    if [[ -d "$wal_dir" && $(ls -A "$wal_dir" 2>/dev/null) ]]; then
        tar -czf "$wal_backup_path" -C "$(dirname "$wal_dir")" "$(basename "$wal_dir")"
        info "WAL archive created: $wal_backup_path"
    else
        warn "No WAL files found to archive"
    fi
}

# Upload to cloud storage (if configured)
upload_to_cloud() {
    local backup_file="$1"
    local backup_type="$2"

    if [[ -n "${AWS_ACCESS_KEY_ID:-}" && -n "${AWS_SECRET_ACCESS_KEY:-}" && -n "${S3_BUCKET:-}" ]]; then
        info "Uploading backup to S3: ${S3_BUCKET}/${backup_type}/"

        local s3_key="${backup_type}/$(basename "$backup_file")"

        if aws s3 cp "$backup_file" "${S3_BUCKET}/${s3_key}" --region "$S3_REGION" --storage-class STANDARD_IA; then
            info "Successfully uploaded to S3: ${S3_BUCKET}/${s3_key}"

            # Create S3 metadata
            local metadata_file="${backup_file}.s3_metadata.json"
            cat > "$metadata_file" << EOF
{
    "s3_bucket": "$S3_BUCKET",
    "s3_key": "$s3_key",
    "s3_region": "$S3_REGION",
    "upload_time": "$(date -Iseconds)",
    "file_size": $(stat -c%s "$backup_file")
}
EOF

            # Upload metadata
            aws s3 cp "$metadata_file" "${S3_BUCKET}/${s3_key}.metadata" --region "$S3_REGION"

        else
            error "Failed to upload backup to S3"
        fi
    else
        warn "S3 not configured, skipping cloud upload"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    info "Cleaning up old backups"

    # Daily backups - keep last 30 days
    find "$BACKUP_DIR/daily" -name "inamsos_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

    # Weekly backups - keep last 12 weeks
    find "$BACKUP_DIR/weekly" -name "inamsos_backup_*.tar.gz" -mtime +$((RETENTION_WEEKS * 7)) -delete 2>/dev/null || true

    # Monthly backups - keep last 12 months
    find "$BACKUP_DIR/monthly" -name "inamsos_backup_*.tar.gz" -mtime +$((RETENTION_MONTHS * 30)) -delete 2>/dev/null || true

    # WAL archives - keep last 7 days
    find "$BACKUP_DIR/wal" -name "wal_*.tar.gz" -mtime +7 -delete 2>/dev/null || true

    # Clean up old logs
    find "$LOG_DIR" -name "backup.log.*" -mtime +30 -delete 2>/dev/null || true

    info "Old backups cleanup completed"
}

# Verify backup retention
verify_retention() {
    info "Verifying backup retention policy"

    local daily_count=$(find "$BACKUP_DIR/daily" -name "inamsos_backup_*.tar.gz" | wc -l)
    local weekly_count=$(find "$BACKUP_DIR/weekly" -name "inamsos_backup_*.tar.gz" | wc -l)
    local monthly_count=$(find "$BACKUP_DIR/monthly" -name "inamsos_backup_*.tar.gz" | wc -l)

    info "Current backup counts - Daily: $daily_count, Weekly: $weekly_count, Monthly: $monthly_count"

    # Create backup retention report
    cat > "$BACKUP_DIR/retention_report_${DATE}.json" << EOF
{
    "report_date": "$(date -Iseconds)",
    "daily_backups_count": $daily_count,
    "weekly_backups_count": $weekly_count,
    "monthly_backups_count": $monthly_count,
    "retention_policy": {
        "daily_retention_days": $RETENTION_DAYS,
        "weekly_retention_weeks": $RETENTION_WEEKS,
        "monthly_retention_months": $RETENTION_MONTHS
    }
}
EOF
}

# Main backup function
main() {
    local start_time=$(date +%s)
    local backup_type="daily"
    local day_of_week=$(date +%A)

    log "INFO" "Starting INAMSOS database backup process"

    # Create directories
    create_backup_dirs

    # Pre-backup checks
    check_database
    pre_backup_checks
    get_db_stats

    # Determine backup type
    if [[ "$day_of_week" == "$FULL_BACKUP_DAY" ]]; then
        backup_type="weekly"
        # First Sunday of month is monthly backup
        if [[ $(date +%d) -le 7 ]]; then
            backup_type="monthly"
        fi
    fi

    # Create backup
    create_base_backup "$backup_type"
    create_wal_backup

    # Upload to cloud if configured
    local backup_file="${BACKUP_DIR}/${backup_type}/${BACKUP_NAME}.tar.gz"
    upload_to_cloud "$backup_file" "$backup_type"

    # Cleanup
    cleanup_old_backups
    verify_retention

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    log "INFO" "Backup process completed successfully in ${total_duration}s"

    # Send success notification
    send_notification "✅ INAMSOS Database Backup Successful" \
        "Database backup completed successfully!\n\nType: $backup_type\nDuration: ${total_duration}s\nFile: $(basename "$backup_file")\nSize: $((stat -c%s "$backup_file"/1024/1024))MB" \
        "normal"

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Script failed on line $line_number with exit code $exit_code"

    # Send error notification
    send_notification "❌ INAMSOS Database Backup Failed" \
        "Database backup failed!\n\nError: Script failed on line $line_number\nExit code: $exit_code\nTime: $(date -Iseconds)" \
        "high"

    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Check if running as root or with proper permissions
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root or with sudo privileges"
fi

# Load environment variables
if [[ -f "/etc/inamos/backup.env" ]]; then
    source "/etc/inamos/backup.env"
fi

# Validate required environment variables
if [[ -z "${DB_PASSWORD:-}" ]]; then
    error "DB_PASSWORD environment variable is required"
fi

# Run main function
main "$@"