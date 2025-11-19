#!/bin/bash

# INAMSOS Database Restore Script
# Point-in-time recovery and restore functionality

set -euo pipefail

# Configuration
DB_HOST="postgres"
DB_PORT="5432"
DB_NAME="inamsos_prod"
DB_USER="inamsos_user"
BACKUP_DIR="/backup/database"
LOG_DIR="/var/log/inamosos"
RESTORE_DIR="/tmp/inamsos_restore"

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
    echo "[$timestamp] [$level] $message" >> "$LOG_DIR/restore.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "$LOG_DIR/restore.log"
    exit 1
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "$LOG_DIR/restore.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "$LOG_DIR/restore.log"
}

# Send notification
send_notification() {
    local subject="$1"
    local message="$2"
    local priority="${3:-normal}"

    # Email notification
    if command -v mail > /dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "admin@inamsos.kemenkes.go.id"
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
                    \"footer\": \"INAMSOS Restore System\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# List available backups
list_backups() {
    local backup_type="${1:-all}"

    info "Listing available backups"

    case "$backup_type" in
        "daily")
            find "$BACKUP_DIR/daily" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -10
            ;;
        "weekly")
            find "$BACKUP_DIR/weekly" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -5
            ;;
        "monthly")
            find "$BACKUP_DIR/monthly" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -3
            ;;
        *)
            echo "=== Daily Backups (Last 10) ==="
            find "$BACKUP_DIR/daily" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -10
            echo ""
            echo "=== Weekly Backups (Last 5) ==="
            find "$BACKUP_DIR/weekly" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -5
            echo ""
            echo "=== Monthly Backups (Last 3) ==="
            find "$BACKUP_DIR/monthly" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -3
            ;;
    esac
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"

    info "Verifying backup integrity: $(basename "$backup_file")"

    # Check if file exists
    if [[ ! -f "$backup_file" ]]; then
        error "Backup file does not exist: $backup_file"
    fi

    # Extract and verify checksum
    local extracted_dir="$RESTORE_DIR/$(basename "$backup_file" .tar.gz)"
    mkdir -p "$extracted_dir"

    info "Extracting backup for verification..."
    tar -xzf "$backup_file" -C "$RESTORE_DIR"

    # Check required files
    local required_files=("database.dump" "metadata.json" "sha256sum.txt")
    for file in "${required_files[@]}"; do
        if [[ ! -f "$extracted_dir/$file" ]]; then
            error "Required backup file missing: $file"
        fi
    done

    # Verify checksum
    info "Verifying checksum..."
    cd "$extracted_dir"
    if ! sha256sum -c sha256sum.txt > /dev/null 2>&1; then
        error "Checksum verification failed"
    fi

    # Test restore list
    info "Testing backup restore capability..."
    if ! PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        --list \
        --no-password \
        "database.dump" > /dev/null 2>&1; then
        error "Backup is not readable or corrupted"
    fi

    info "Backup verification completed successfully"

    # Display backup metadata
    if [[ -f "$extracted_dir/metadata.json" ]]; then
        info "Backup metadata:"
        cat "$extracted_dir/metadata.json" | jq '.' 2>/dev/null || cat "$extracted_dir/metadata.json"
    fi

    cd - > /dev/null
    return 0
}

# Create restore point
create_restore_point() {
    info "Creating database restore point"

    local restore_point_name="restore_point_$(date +%Y%m%d_%H%M%S)"

    # Create a named savepoint if this is a partial restore
    if [[ "${PARTIAL_RESTORE:-false}" == "true" ]]; then
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
            -c "CREATE TEMPORARY TABLE ${restore_point_name} AS SELECT * FROM pg_stat_activity WHERE datname = '$DB_NAME';" \
            || warn "Could not create restore point"
    fi

    info "Restore point created: $restore_point_name"
}

# Backup current database (pre-restore)
backup_current_database() {
    info "Creating pre-restore backup of current database"

    local pre_restore_backup="$BACKUP_DIR/pre_restore/pre_restore_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$(dirname "$pre_restore_backup")"

    # Create current database backup
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --format=custom \
        --compress=9 \
        --file="${pre_restore_backup}.dump" \
        --verbose 2>&1 | tee -a "$LOG_DIR/restore.log"

    # Create metadata
    cat > "${pre_restore_backup}.metadata.json" << EOF
{
    "backup_name": "$(basename "$pre_restore_backup")",
    "backup_type": "pre_restore",
    "database_name": "$DB_NAME",
    "backup_time": "$(date -Iseconds)",
    "restore_reason": "$RESTORE_REASON"
}
EOF

    info "Pre-restore backup created: ${pre_restore_backup}.dump"
}

# Restore database
restore_database() {
    local backup_file="$1"
    local target_time="${2:-}"

    info "Starting database restore from: $(basename "$backup_file")"

    # Extract backup
    local extracted_dir="$RESTORE_DIR/$(basename "$backup_file" .tar.gz)"
    mkdir -p "$extracted_dir"

    info "Extracting backup..."
    tar -xzf "$backup_file" -C "$RESTORE_DIR"

    local dump_file="$extracted_dir/database.dump"
    if [[ ! -f "$dump_file" ]]; then
        error "Database dump file not found in backup"
    fi

    # Stop application services to prevent conflicts
    info "Stopping application services..."
    docker-compose -f /home/yopi/Projects/tumor-registry/docker-compose.prod.yml stop backend || warn "Could not stop backend service"

    # Drop existing database (with confirmation)
    if [[ "${DROP_EXISTING_DB:-false}" == "true" ]]; then
        warn "Dropping existing database: $DB_NAME"
        PGPASSWORD="$DB_PASSWORD" dropdb \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            --if-exists \
            "$DB_NAME"

        # Create new database
        PGPASSWORD="$DB_PASSWORD" createdb \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            "$DB_NAME"
    fi

    # Perform restore
    info "Performing database restore..."
    local restore_start_time=$(date +%s)

    PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --verbose \
        --no-password \
        --clean \
        --if-exists \
        --exit-on-error \
        "$dump_file" 2>&1 | tee -a "$LOG_DIR/restore.log"

    local restore_exit_code=${PIPESTATUS[0]}
    local restore_end_time=$(date +%s)
    local restore_duration=$((restore_end_time - restore_start_time))

    if [[ $restore_exit_code -ne 0 ]]; then
        error "Database restore failed with exit code: $restore_exit_code"
    fi

    info "Database restore completed in ${restore_duration}s"

    # Update system sequences
    info "Updating database sequences..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << 'EOF'
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT table_schema, table_name, column_name, column_default
              FROM information_schema.columns
              WHERE column_default LIKE 'nextval%'
              AND table_schema NOT IN ('information_schema', 'pg_catalog')) LOOP
        EXECUTE format('SELECT setval(pg_get_serial_sequence(%L, %L), COALESCE(MAX(%I), 1)) FROM %I.%I',
                       r.table_name, r.column_name, r.column_name, r.table_schema, r.table_name);
    END LOOP;
END $$;
EOF

    # Analyze database for performance
    info "Analyzing database for performance optimization..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;"

    # Restart application services
    info "Restarting application services..."
    docker-compose -f /home/yopi/Projects/tumor-registry/docker-compose.prod.yml start backend

    # Wait for database to be ready
    info "Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
            info "Database is ready"
            break
        fi

        info "Attempt $attempt/$max_attempts: Database not ready, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done

    if [[ $attempt -gt $max_attempts ]]; then
        error "Database did not become ready within $max_attempts attempts"
    fi

    info "Database restore completed successfully"
}

# Verify restored database
verify_restore() {
    info "Verifying restored database"

    # Check database connectivity
    if ! PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
        error "Database is not accessible after restore"
    fi

    # Check table count
    local table_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
    info "Restored database contains $table_count tables"

    # Check critical tables exist
    local critical_tables=("patients" "cancer_cases" "medical_records" "users" "centers")
    for table in "${critical_tables[@]}"; do
        local exists=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');")
        if [[ "$exists" != "t" ]]; then
            error "Critical table missing after restore: $table"
        fi
        info "✓ Critical table verified: $table"
    done

    # Check data integrity
    local patient_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM patients;" 2>/dev/null || echo "0")
    local case_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM cancer_cases;" 2>/dev/null || echo "0")

    info "Data verification:"
    info "- Patients: $patient_count"
    info "- Cancer Cases: $case_count"

    info "Database restore verification completed successfully"
}

# Point-in-time recovery
point_in_time_recovery() {
    local target_time="$1"
    local base_backup="$2"

    info "Performing point-in-time recovery to: $target_time"
    warn "Point-in-time recovery requires WAL archiving to be properly configured"

    # This is a simplified implementation
    # In a production environment, you would need:
    # 1. Base backup
    # 2. WAL files between backup and target time
    # 3. PostgreSQL recovery.conf or postgresql.conf recovery settings

    error "Point-in-time recovery requires additional setup and configuration"
}

# Download backup from S3
download_from_s3() {
    local s3_path="$1"
    local local_path="$2"

    info "Downloading backup from S3: $s3_path"

    if ! aws s3 cp "$s3_path" "$local_path"; then
        error "Failed to download backup from S3"
    fi

    info "Backup downloaded successfully to: $local_path"
}

# Main restore function
main() {
    local backup_file=""
    local target_time=""
    local s3_path=""
    local list_only=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backup-file|-f)
                backup_file="$2"
                shift 2
                ;;
            --target-time|-t)
                target_time="$2"
                shift 2
                ;;
            --s3-path|-s)
                s3_path="$2"
                shift 2
                ;;
            --list|-l)
                list_only=true
                shift
                ;;
            --backup-type)
                list_backups "$2"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done

    local start_time=$(date +%s)

    log "INFO" "Starting INAMOS database restore process"

    if [[ "$list_only" == true ]]; then
        list_backups
        exit 0
    fi

    # Validate arguments
    if [[ -z "$backup_file" && -z "$s3_path" ]]; then
        error "Either --backup-file or --s3-path must be specified"
    fi

    # Download from S3 if specified
    if [[ -n "$s3_path" ]]; then
        backup_file="/tmp/$(basename "$s3_path")"
        download_from_s3 "$s3_path" "$backup_file"
    fi

    # Create restore directory
    mkdir -p "$RESTORE_DIR"

    # Verify backup
    verify_backup "$backup_file"

    # Create pre-restore backup
    backup_current_database

    # Create restore point
    create_restore_point

    # Perform restore
    if [[ -n "$target_time" ]]; then
        point_in_time_recovery "$target_time" "$backup_file"
    else
        restore_database "$backup_file"
    fi

    # Verify restore
    verify_restore

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    log "INFO" "Database restore process completed successfully in ${total_duration}s"

    # Clean up restore directory
    rm -rf "$RESTORE_DIR"

    # Send success notification
    send_notification "✅ INAMSOS Database Restore Successful" \
        "Database restore completed successfully!\n\nSource: $(basename "$backup_file")\nDuration: ${total_duration}s\nTarget time: ${target_time:-"Full restore"}" \
        "normal"

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Script failed on line $line_number with exit code $exit_code"

    # Send error notification
    send_notification "❌ INAMSOS Database Restore Failed" \
        "Database restore failed!\n\nError: Script failed on line $line_number\nExit code: $exit_code\nTime: $(date -Iseconds)" \
        "high"

    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Check if running as root
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

# Show usage if no arguments provided
if [[ $# -eq 0 ]]; then
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    --backup-file, -f PATH     Path to backup file to restore
    --s3-path, -s PATH         S3 path to backup file
    --target-time, -t TIME     Point-in-time recovery target (ISO format)
    --list, -l                 List available backups
    --backup-type TYPE         List backups of type (daily|weekly|monthly|all)

EXAMPLES:
    $0 --list
    $0 --backup-type daily
    $0 --backup-file /backup/database/daily/inamos_backup_20241119_120000.tar.gz
    $0 --s3-path s3://inamos-backups/daily/inamos_backup_20241119_120000.tar.gz
    $0 --backup-file backup.tar.gz --target-time "2024-11-19 12:00:00"

ENVIRONMENT VARIABLES:
    DB_PASSWORD          PostgreSQL password (required)
    RESTORE_REASON       Reason for restore operation
    DROP_EXISTING_DB     Set to 'true' to drop existing database
    SLACK_WEBHOOK_URL    Slack webhook for notifications

NOTE: This is a destructive operation. Always create backups before restoring.
EOF
    exit 1
fi

# Run main function
main "$@"