#!/bin/bash

# INAMSOS Backup Verification Script
# Comprehensive backup verification and testing system

set -euo pipefail

# Configuration
DB_HOST="postgres"
DB_PORT="5432"
DB_NAME="inamsos_prod"
DB_USER="inamsos_user"
BACKUP_DIR="/backup/database"
TEST_RESTORE_DB="inamsos_test_restore"
TEST_RESTORE_DIR="/tmp/backup_test"
LOG_DIR="/var/log/inamosos"
ALERT_THRESHOLD=3  # Number of failed backups before alert

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
    echo "[$timestamp] [$level] $message" >> "$LOG_DIR/backup_verification.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "$LOG_DIR/backup_verification.log"
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "$LOG_DIR/backup_verification.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "$LOG_DIR/backup_verification.log"
}

# Send notification
send_notification() {
    local subject="$1"
    local message="$2"
    local priority="${3:-normal}"

    # Email notification
    if command -v mail > /dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "backup-team@inamsos.kemenkes.go.id"
    fi

    # Slack notification
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
                    \"footer\": \"INAMSOS Backup Verification\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Test backup file integrity
test_backup_integrity() {
    local backup_file="$1"
    local test_result_dir="$2"

    info "Testing backup integrity: $(basename "$backup_file")"

    # Extract backup for testing
    mkdir -p "$test_result_dir"
    local extract_dir="$test_result_dir/extracted"

    info "Extracting backup for integrity test..."
    tar -xzf "$backup_file" -C "$test_result_dir"

    if [[ ! -d "$extract_dir" ]]; then
        mv "$test_result_dir"/* "$extract_dir" 2>/dev/null || true
    fi

    # Check required files
    local required_files=("database.dump" "metadata.json" "sha256sum.txt")
    local missing_files=()

    for file in "${required_files[@]}"; do
        if [[ ! -f "$extract_dir/$file" ]]; then
            missing_files+=("$file")
        fi
    done

    if [[ ${#missing_files[@]} -gt 0 ]]; then
        error "Missing required files: ${missing_files[*]}"
        return 1
    fi

    # Verify checksum
    info "Verifying backup checksum..."
    cd "$extract_dir"
    if ! sha256sum -c sha256sum.txt > /dev/null 2>&1; then
        error "Checksum verification failed"
        cd - > /dev/null
        return 1
    fi
    cd - > /dev/null

    # Test backup file can be read by pg_restore
    info "Testing backup file readability..."
    if ! PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        --list \
        --no-password \
        "$extract_dir/database.dump" > /dev/null 2>&1; then
        error "Backup file is not readable by pg_restore"
        return 1
    fi

    # Validate metadata
    if ! jq empty "$extract_dir/metadata.json" 2>/dev/null; then
        error "Backup metadata is not valid JSON"
        return 1
    fi

    # Extract metadata for reporting
    local backup_size=$(stat -c%s "$backup_file")
    local backup_date=$(jq -r '.backup_start_time // "unknown"' "$extract_dir/metadata.json")
    local backup_type=$(jq -r '.backup_type // "unknown"' "$extract_dir/metadata.json")

    # Save verification results
    cat > "$test_result_dir/verification_results.json" << EOF
{
    "backup_file": "$(basename "$backup_file")",
    "backup_size_bytes": $backup_size,
    "backup_date": "$backup_date",
    "backup_type": "$backup_type",
    "verification_time": "$(date -Iseconds)",
    "checksum_valid": true,
    "file_readable": true,
    "metadata_valid": true,
    "required_files_present": true,
    "overall_status": "PASS"
}
EOF

    info "✓ Backup integrity test passed: $(basename "$backup_file")"
    return 0
}

# Test database restore functionality
test_database_restore() {
    local backup_file="$1"
    local test_result_dir="$2"

    info "Testing database restore from: $(basename "$backup_file")"

    local extract_dir="$test_result_dir/extracted"
    local dump_file="$extract_dir/database.dump"

    # Create test database
    info "Creating test database: $TEST_RESTORE_DB"
    PGPASSWORD="$DB_PASSWORD" dropdb \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        --if-exists \
        "$TEST_RESTORE_DB" 2>/dev/null || true

    PGPASSWORD="$DB_PASSWORD" createdb \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        "$TEST_RESTORE_DB"

    # Perform test restore
    info "Performing test restore..."
    local restore_start_time=$(date +%s)

    if PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$TEST_RESTORE_DB" \
        --verbose \
        --no-password \
        --clean \
        --if-exists \
        --exit-on-error \
        "$dump_file" > "$test_result_dir/restore.log" 2>&1; then

        local restore_end_time=$(date +%s)
        local restore_duration=$((restore_end_time - restore_start_time))

        info "✓ Test restore completed successfully in ${restore_duration}s"

        # Verify restored database
        info "Verifying restored database..."

        # Check table count
        local table_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_RESTORE_DB" -t -A -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
        info "Restored database contains $table_count tables"

        # Check critical tables
        local critical_tables=("patients" "cancer_cases" "medical_records" "users" "centers")
        local missing_critical_tables=()

        for table in "${critical_tables[@]}"; do
            local exists=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_RESTORE_DB" -t -A -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" 2>/dev/null || echo "f")
            if [[ "$exists" != "t" ]]; then
                missing_critical_tables+=("$table")
            fi
        done

        if [[ ${#missing_critical_tables[@]} -gt 0 ]]; then
            warn "Missing critical tables: ${missing_critical_tables[*]}"
        else
            info "✓ All critical tables present"
        fi

        # Check data integrity
        local patient_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_RESTORE_DB" -t -A -c "SELECT count(*) FROM patients;" 2>/dev/null || echo "0")
        local case_count=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_RESTORE_DB" -t -A -c "SELECT count(*) FROM cancer_cases;" 2>/dev/null || echo "0")

        info "Data verification:"
        info "- Patients: $patient_count"
        info "- Cancer Cases: $case_count"

        # Update verification results
        cat >> "$test_result_dir/verification_results.json" << EOF
,
    "restore_test": {
        "restore_duration_seconds": $restore_duration,
        "table_count": $table_count,
        "missing_critical_tables": $(printf '%s\n' "${missing_critical_tables[@]}" | jq -R . | jq -s .),
        "patient_count": $patient_count,
        "case_count": $case_count,
        "restore_status": "PASS"
    }
}
EOF

    else
        error "Test restore failed"
        return 1
    fi

    # Clean up test database
    info "Cleaning up test database..."
    PGPASSWORD="$DB_PASSWORD" dropdb \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        "$TEST_RESTORE_DB"

    info "✓ Database restore test completed successfully"
    return 0
}

# Test backup performance
test_backup_performance() {
    local backup_file="$1"
    local test_result_dir="$2"

    info "Testing backup performance metrics..."

    local backup_size=$(stat -c%s "$backup_file")
    local extract_dir="$test_result_dir/extracted"
    local dump_file="$extract_dir/database.dump"

    # Test backup decompression speed
    info "Testing decompression speed..."
    local decompress_start_time=$(date +%s)
    tar -xzf "$backup_file" -C "$TEST_RESTORE_DIR" > /dev/null 2>&1
    local decompress_end_time=$(date +%s)
    local decompress_duration=$((decompress_end_time - decompress_start_time))

    # Test backup read speed
    info "Testing backup read speed..."
    local read_start_time=$(date +%s)
    if PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        --list \
        --no-password \
        "$dump_file" > /dev/null 2>&1; then
        local read_end_time=$(date +%s)
        local read_duration=$((read_end_time - read_start_time))

        info "Performance metrics:"
        info "- Backup size: $((backup_size/1024/1024))MB"
        info "- Decompression time: ${decompress_duration}s"
        info "- Read time: ${read_duration}s"
        info "- Decompression speed: $((backup_size/1024/1024/decompress_duration))MB/s"

        # Update verification results
        cat >> "$test_result_dir/verification_results.json" << EOF
,
    "performance_test": {
        "backup_size_mb": $((backup_size/1024/1024)),
        "decompress_duration_seconds": $decompress_duration,
        "read_duration_seconds": $read_duration,
        "decompress_speed_mbps": $((backup_size/1024/1024/decompress_duration)),
        "performance_status": "PASS"
    }
}
EOF

    else
        error "Performance test failed"
        return 1
    fi

    return 0
}

# Generate verification report
generate_verification_report() {
    local test_result_dir="$1"
    local report_file="$test_result_dir/verification_report.html"

    info "Generating verification report..."

    local results_file="$test_result_dir/verification_results.json"

    if [[ ! -f "$results_file" ]]; then
        error "Verification results file not found"
        return 1
    fi

    # Create HTML report
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>INAMSOS Backup Verification Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .pass { background-color: #d4edda; border-color: #c3e6cb; }
        .fail { background-color: #f8d7da; border-color: #f5c6cb; }
        .warn { background-color: #fff3cd; border-color: #ffeaa7; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 3px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INAMSOS Backup Verification Report</h1>
        <p>Generated on $(date -Iseconds)</p>
    </div>

    <div class="section pass">
        <h2>Verification Summary</h2>
        <div class="metric">Status: <strong>$(jq -r '.overall_status // "UNKNOWN"' "$results_file")</strong></div>
        <div class="metric">Backup File: <strong>$(jq -r '.backup_file // "UNKNOWN"' "$results_file")</strong></div>
        <div class="metric">Backup Size: <strong>$(( $(jq -r '.backup_size_bytes // 0' "$results_file") / 1024 / 1024 ))MB</strong></div>
        <div class="metric">Backup Date: <strong>$(jq -r '.backup_date // "UNKNOWN"' "$results_file")</strong></div>
    </div>

    <div class="section">
        <h2>Test Results</h2>
        <table>
            <tr><th>Test</th><th>Status</th><th>Details</th></tr>
            <tr>
                <td>File Integrity</td>
                <td>$(jq -r '.checksum_valid // false' "$results_file" | sed 's/true/✅ PASS/; s/false/❌ FAIL/')</td>
                <td>Checksum verification</td>
            </tr>
            <tr>
                <td>File Readability</td>
                <td>$(jq -r '.file_readable // false' "$results_file" | sed 's/true/✅ PASS/; s/false/❌ FAIL/')</td>
                <td>pg_restore compatibility</td>
            </tr>
            <tr>
                <td>Metadata Validation</td>
                <td>$(jq -r '.metadata_valid // false' "$results_file" | sed 's/true/✅ PASS/; s/false/❌ FAIL/')</td>
                <td>JSON metadata format</td>
            </tr>
EOF

    # Add restore test results if available
    if jq -e '.restore_test' "$results_file" > /dev/null 2>&1; then
        cat >> "$report_file" << EOF
            <tr>
                <td>Database Restore</td>
                <td>$(jq -r '.restore_test.restore_status // "UNKNOWN"' "$results_file" | sed 's/PASS/✅ PASS/; s/FAIL/❌ FAIL/')</td>
                <td>Table count: $(jq -r '.restore_test.table_count // 0' "$results_file") | Patients: $(jq -r '.restore_test.patient_count // 0' "$results_file")</td>
            </tr>
EOF
    fi

    # Add performance test results if available
    if jq -e '.performance_test' "$results_file" > /dev/null 2>&1; then
        cat >> "$report_file" << EOF
            <tr>
                <td>Performance Test</td>
                <td>$(jq -r '.performance_test.performance_status // "UNKNOWN"' "$results_file" | sed 's/PASS/✅ PASS/; s/FAIL/❌ FAIL/')</td>
                <td>Decompression: $(jq -r '.performance_test.decompress_speed_mbps // 0' "$results_file")MB/s</td>
            </tr>
EOF
    fi

    cat >> "$report_file" << EOF
        </table>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            <li>Regular verification of backup integrity is essential</li>
            <li>Monitor backup size trends for storage planning</li>
            <li>Test restore procedures regularly</li>
            <li>Keep backup retention policy aligned with compliance requirements</li>
        </ul>
    </div>

    <div class="section">
        <p class="timestamp">Report generated by INAMOS Backup Verification System</p>
    </div>
</body>
</html>
EOF

    info "✓ Verification report generated: $report_file"
}

# Check recent backups
check_recent_backups() {
    local max_age_hours=24
    local min_backups=1

    info "Checking recent backups (last ${max_age_hours}h)..."

    # Find recent backups
    local recent_backups=$(find "$BACKUP_DIR" -name "inamsos_backup_*.tar.gz" -mtime -$((max_age_hours/24)) -type f)

    local backup_count=$(echo "$recent_backups" | grep -c . || echo "0")

    if [[ $backup_count -lt $min_backups ]]; then
        error "Insufficient recent backups: $backup_count found, minimum required: $min_backups"
        return 1
    fi

    info "✓ Found $backup_count recent backups within last ${max_age_hours}h"

    # Check backup age
    local oldest_backup_age=$(find "$BACKUP_DIR" -name "inamsos_backup_*.tar.gz" -printf "%T@\n" | sort -n | head -1 | cut -d. -f1)
    local current_time=$(date +%s)
    local age_hours=$(((current_time - oldest_backup_age) / 3600))

    if [[ $age_hours -gt $max_age_hours ]]; then
        warn "Oldest backup is ${age_hours}h old, exceeds threshold of ${max_age_hours}h"
    else
        info "✓ All backups are within acceptable age range"
    fi

    return 0
}

# Main verification function
main() {
    local specific_backup="$1"
    local test_restore="${2:-false}"

    local start_time=$(date +%s)
    local test_id="backup_test_$(date +%Y%m%d_%H%M%S)"
    local test_result_dir="$TEST_RESTORE_DIR/$test_id"

    log "INFO" "Starting INAMSOS backup verification"

    # Create test directory
    mkdir -p "$test_result_dir"

    # Check recent backups first
    if ! check_recent_backups; then
        send_notification "⚠️ INAMSOS Backup Verification Warning" \
            "Recent backup check failed. Please investigate backup system." \
            "warning"
    fi

    # Determine which backup to test
    local backup_to_test=""
    if [[ -n "$specific_backup" && -f "$specific_backup" ]]; then
        backup_to_test="$specific_backup"
        info "Testing specified backup: $(basename "$backup_to_test")"
    else
        # Find the most recent backup
        backup_to_test=$(find "$BACKUP_DIR" -name "inamsos_backup_*.tar.gz" -type f -printf "%T@ %p\n" | sort -nr | head -1 | cut -d' ' -f2)
        info "Testing most recent backup: $(basename "$backup_to_test")"
    fi

    if [[ -z "$backup_to_test" || ! -f "$backup_to_test" ]]; then
        error "No valid backup found for testing"
    fi

    local verification_passed=true

    # Test backup integrity
    if ! test_backup_integrity "$backup_to_test" "$test_result_dir"; then
        verification_passed=false
    fi

    # Test backup performance
    if ! test_backup_performance "$backup_to_test" "$test_result_dir"; then
        verification_passed=false
    fi

    # Test database restore (if requested)
    if [[ "$test_restore" == "true" ]]; then
        info "Performing database restore test..."
        if ! test_database_restore "$backup_to_test" "$test_result_dir"; then
            verification_passed=false
        fi
    fi

    # Generate verification report
    generate_verification_report "$test_result_dir"

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    # Update overall status
    if [[ "$verification_passed" == "true" ]]; then
        jq '.overall_status = "PASS"' "$test_result_dir/verification_results.json" > "$test_result_dir/verification_results_temp.json" && mv "$test_result_dir/verification_results_temp.json" "$test_result_dir/verification_results.json"
        log "INFO" "Backup verification completed successfully in ${total_duration}s"

        # Send success notification
        send_notification "✅ INAMSOS Backup Verification Passed" \
            "Backup verification completed successfully!\n\nBackup: $(basename "$backup_to_test")\nDuration: ${total_duration}s\nReport: $test_result_dir/verification_report.html" \
            "normal"
    else
        jq '.overall_status = "FAIL"' "$test_result_dir/verification_results.json" > "$test_result_dir/verification_results_temp.json" && mv "$test_result_dir/verification_results_temp.json" "$test_result_dir/verification_results.json"
        error "Backup verification failed"

        # Send failure notification
        send_notification "❌ INAMSOS Backup Verification Failed" \
            "Backup verification failed!\n\nBackup: $(basename "$backup_to_test")\nDuration: ${total_duration}s\nPlease check logs: $LOG_DIR/backup_verification.log" \
            "high"
    fi

    # Clean up test directory (keep reports)
    find "$TEST_RESTORE_DIR" -name "backup_test_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Script failed on line $line_number with exit code $exit_code"
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

# Show usage if help requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Usage: $0 [OPTIONS] [BACKUP_FILE]

OPTIONS:
    --test-restore    Perform full database restore test
    --help, -h        Show this help message

ARGUMENTS:
    BACKUP_FILE       Specific backup file to test (optional)

EXAMPLES:
    $0                              # Test most recent backup
    $0 /backup/database/daily/inamos_backup_20241119_120000.tar.gz
    $0 --test-restore               # Test most recent backup with restore
    $0 --test-restore /path/to/backup.tar.gz

ENVIRONMENT VARIABLES:
    DB_PASSWORD          PostgreSQL password (required)
    SLACK_WEBHOOK_URL    Slack webhook for notifications

This script performs comprehensive backup verification including:
- File integrity checks
- Checksum verification
- Metadata validation
- Performance testing
- Optional database restore testing
"""
    exit 0
fi

# Run main function
main "$@"