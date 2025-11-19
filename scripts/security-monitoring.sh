#!/bin/bash

# INAMSOS Real-time Security Monitoring
# Continuous security monitoring and intrusion detection

set -euo pipefail

# Configuration
LOG_DIR="/var/log/inamos"
MONITORING_DIR="/security/monitoring"
ALERT_THRESHOLD=5
SCAN_INTERVAL=300  # 5 minutes
BLOCK_THRESHOLD=10
BLACKLIST_FILE="/security/blacklist.txt"
WHITELIST_FILE="/security/whitelist.txt"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
EMAIL_RECIPIENTS="${EMAIL_RECIPIENTS:-security@inamsos.kemenkes.go.id}"

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
    echo "[$timestamp] [$level] $message" >> "$LOG_DIR/security_monitoring.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "$LOG_DIR/security_monitoring.log"
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "$LOG_DIR/security_monitoring.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "$LOG_DIR/security_monitoring.log"
}

# Send security alert
send_security_alert() {
    local severity="$1"
    local event_type="$2"
    local details="$3"
    local source_ip="$4"

    local color="good"
    [[ "$severity" == "CRITICAL" ]] && color="danger"
    [[ "$severity" == "HIGH" ]] && color="warning"

    # Create alert message
    local message="Security Event: $event_type
Source IP: $source_ip
Time: $(date)
Details: $details"

    # Slack notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"🚨 Security Alert: $severity\",
                    \"text\": \"$message\",
                    \"fields\": [{
                        \"title\": \"Event Type\",
                        \"value\": \"$event_type\",
                        \"short\": true
                    }, {
                        \"title\": \"Source IP\",
                        \"value\": \"$source_ip\",
                        \"short\": true
                    }, {
                        \"title\": \"Severity\",
                        \"value\": \"$severity\",
                        \"short\": true
                    }],
                    \"footer\": \"INAMSOS Security Monitoring\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi

    # Email notification
    if command -v mail > /dev/null 2>&1; then
        {
            echo "Subject: [SECURITY $severity] $event_type from $source_ip"
            echo "From: security-monitoring@inamsos.kemenkes.go.id"
            echo "To: $EMAIL_RECIPIENTS"
            echo ""
            echo "Security Alert: $severity"
            echo "Event Type: $event_type"
            echo "Source IP: $source_ip"
            echo "Time: $(date)"
            echo ""
            echo "Details:"
            echo "$details"
        } | sendmail "$EMAIL_RECIPIENTS" 2>/dev/null || true
    fi

    # Log security event
    echo "$(date -Iseconds),$severity,$event_type,$source_ip,\"$details\"" >> "$MONITORING_DIR/security_events.csv"
}

# Initialize monitoring
initialize_monitoring() {
    info "Initializing security monitoring..."

    # Create directories
    mkdir -p "$MONITORING_DIR"
    mkdir -p "$LOG_DIR"

    # Create blacklist file if it doesn't exist
    if [[ ! -f "$BLACKLIST_FILE" ]]; then
        cat > "$BLACKLIST_FILE" << EOF
# IP Blacklist - Add malicious IPs here
# Format: IP_ADDRESS,TIMESTAMP,REASON
EOF
    fi

    # Create whitelist file if it doesn't exist
    if [[ ! -f "$WHITELIST_FILE" ]]; then
        cat > "$WHITELIST_FILE" << EOF
# IP Whitelist - Add trusted IPs here
# Format: IP_ADDRESS,DESCRIPTION
127.0.0.1,Localhost
::1,Localhost IPv6
172.16.0.0/12,Private network
192.168.0.0/16,Private network
10.0.0.0/8,Private network
EOF
    fi

    # Create security events CSV file with headers
    if [[ ! -f "$MONITORING_DIR/security_events.csv" ]]; then
        echo "timestamp,severity,event_type,source_ip,details" > "$MONITORING_DIR/security_events.csv"
    fi

    info "Security monitoring initialized"
}

# Check if IP is whitelisted
is_whitelisted() {
    local ip="$1"

    # Check exact match
    if grep -q "^$ip," "$WHITELIST_FILE"; then
        return 0
    fi

    # Check CIDR ranges (basic implementation)
    if grep -q ",Private network" "$WHITELIST_FILE"; then
        # Check if it's a private IP
        if [[ "$ip" =~ ^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.) ]]; then
            return 0
        fi
    fi

    return 1
}

# Check if IP is blacklisted
is_blacklisted() {
    local ip="$1"

    if grep -q "^$ip," "$BLACKLIST_FILE"; then
        return 0
    fi

    return 1
}

# Add IP to blacklist
blacklist_ip() {
    local ip="$1"
    local reason="$2"

    if ! is_blacklisted "$ip"; then
        echo "$ip,$(date -Iseconds),$reason" >> "$BLACKLIST_FILE"
        info "Blacklisted IP: $ip - Reason: $reason"

        # Block IP using iptables (if available)
        if command -v iptables > /dev/null 2>&1; then
            iptables -A INPUT -s "$ip" -j DROP 2>/dev/null || true
        fi

        # Block IP using ufw (if available)
        if command -v ufw > /dev/null 2>&1; then
            ufw deny from "$ip" 2>/dev/null || true
        fi
    fi
}

# Monitor failed login attempts
monitor_failed_logins() {
    local threshold=5
    local time_window=300  # 5 minutes

    # Monitor SSH failed logins
    if [[ -f "/var/log/auth.log" ]]; then
        local failed_ssh=$(grep "$(date '+%b %d' | sed 's/^0//')" /var/log/auth.log | grep "Failed password" | awk '{print $NF}' | sort | uniq -c | sort -nr)

        while read -r count ip; do
            if [[ $count -ge $threshold && -n "$ip" ]]; then
                if ! is_whitelisted "$ip" && ! is_blacklisted "$ip"; then
                    send_security_alert "HIGH" "Brute Force Attack" "$count failed SSH login attempts in last $time_window seconds" "$ip"

                    # Blacklist if threshold is exceeded significantly
                    if [[ $count -ge $((threshold * 2)) ]]; then
                        blacklist_ip "$ip" "SSH brute force attack"
                    fi
                fi
            fi
        done <<< "$failed_ssh"
    fi

    # Monitor application failed logins
    if [[ -f "/var/log/nginx/access.log" ]]; then
        local failed_app=$(grep "$(date '+%d/%b/%Y')" /var/log/nginx/access.log | grep -E "POST.*/api/(auth|login)" | grep " 401 " | awk '{print $1}' | sort | uniq -c | sort -nr)

        while read -r count ip; do
            if [[ $count -ge $threshold && -n "$ip" ]]; then
                if ! is_whitelisted "$ip" && ! is_blacklisted "$ip"; then
                    send_security_alert "HIGH" "Application Brute Force" "$count failed application login attempts in last $time_window seconds" "$ip"

                    if [[ $count -ge $((threshold * 3)) ]]; then
                        blacklist_ip "$ip" "Application brute force attack"
                    fi
                fi
            fi
        done <<< "$failed_app"
    fi
}

# Monitor suspicious requests
monitor_suspicious_requests() {
    # Monitor for SQL injection attempts
    if [[ -f "/var/log/nginx/access.log" ]]; then
        local sql_injection=$(grep "$(date '+%d/%b/%Y')" /var/log/nginx/access.log | grep -iE "(union|select|insert|update|delete|drop|exec|script)" | awk '{print $1}' | sort | uniq -c | sort -nr)

        while read -r count ip; do
            if [[ $count -ge 3 && -n "$ip" ]]; then
                if ! is_whitelisted "$ip" && ! is_blacklisted "$ip"; then
                    send_security_alert "HIGH" "SQL Injection Attempt" "$count suspicious requests detected" "$ip"
                fi
            fi
        done <<< "$sql_injection"
    fi

    # Monitor for XSS attempts
    if [[ -f "/var/log/nginx/access.log" ]]; then
        local xss_attempts=$(grep "$(date '+%d/%b/%Y')" /var/log/nginx/access.log | grep -iE "(<script|javascript:|onload=|onerror=)" | awk '{print $1}' | sort | uniq -c | sort -nr)

        while read -r count ip; do
            if [[ $count -ge 2 && -n "$ip" ]]; then
                if ! is_whitelisted "$ip" && ! is_blacklisted "$ip"; then
                    send_security_alert "MEDIUM" "XSS Attempt" "$count XSS attempts detected" "$ip"
                fi
            fi
        done <<< "$xss_attempts"
    fi

    # Monitor for directory traversal attempts
    if [[ -f "/var/log/nginx/access.log" ]]; then
        local dir_traversal=$(grep "$(date '+%d/%b/%Y')" /var/log/nginx/access.log | grep -iE "(\.\./|\.\.\\|%2e%2e%2f|%2e%2e\\)" | awk '{print $1}' | sort | uniq -c | sort -nr)

        while read -r count ip; do
            if [[ $count -ge 2 && -n "$ip" ]]; then
                if ! is_whitelisted "$ip" && ! is_blacklisted "$ip"; then
                    send_security_alert "MEDIUM" "Directory Traversal Attempt" "$count directory traversal attempts detected" "$ip"
                fi
            fi
        done <<< "$dir_traversal"
    fi
}

# Monitor Docker security
monitor_docker_security() {
    # Monitor for unauthorized Docker container creation
    local running_containers=$(docker ps --format "table {{.Names}}\t{{.Image}}" | grep -v NAMES)
    local known_containers_file="$MONITORING_DIR/known_containers.txt"

    if [[ ! -f "$known_containers_file" ]]; then
        echo "$running_containers" > "$known_containers_file"
        return
    fi

    # Compare with known containers
    local unknown_containers=$(diff "$known_containers_file" <(echo "$running_containers") | grep "^>" | cut -d' ' -f2-)

    while read -r container; do
        if [[ -n "$container" ]]; then
            send_security_alert "CRITICAL" "Unauthorized Container" "Unknown Docker container detected: $container" "localhost"
        fi
    done <<< "$unknown_containers"

    # Update known containers
    echo "$running_containers" > "$known_containers_file"

    # Monitor for containers running as root
    local root_containers=$(docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep -v NAMES | grep -v "nodejs\|nextjs")

    while read -r container_info; do
        if [[ -n "$container_info" ]]; then
            local container_name=$(echo "$container_info" | awk '{print $1}')
            send_security_alert "MEDIUM" "Container Running as Root" "Container $container_name may be running with elevated privileges" "localhost"
        fi
    done <<< "$root_containers"
}

# Monitor file integrity
monitor_file_integrity() {
    local critical_files=(
        "/etc/passwd"
        "/etc/shadow"
        "/etc/sudoers"
        "/home/yopi/Projects/tumor-registry/.env.production"
        "/home/yopi/Projects/tumor-registry/nginx/conf.d/"
        "/home/yopi/Projects/tumor-registry/docker-compose.production.yml"
    )

    local checksums_file="$MONITORING_DIR/file_checksums.txt"

    if [[ ! -f "$checksums_file" ]]; then
        # Create initial checksums
        > "$checksums_file"
        for file in "${critical_files[@]}"; do
            if [[ -f "$file" ]]; then
                sha256sum "$file" >> "$checksums_file"
            elif [[ -d "$file" ]]; then
                find "$file" -type f -exec sha256sum {} \; >> "$checksums_file"
            fi
        done
        return
    fi

    # Check for changes
    local temp_checksums="/tmp/temp_checksums.txt"
    > "$temp_checksums"

    for file in "${critical_files[@]}"; do
        if [[ -f "$file" ]]; then
            sha256sum "$file" >> "$temp_checksums"
        elif [[ -d "$file" ]]; then
            find "$file" -type f -exec sha256sum {} \; >> "$temp_checksums"
        fi
    done

    # Compare checksums
    local changes=$(diff "$checksums_file" "$temp_checksums")
    if [[ -n "$changes" ]]; then
        send_security_alert "CRITICAL" "File Integrity Breach" "Changes detected in critical system files" "localhost"
        warn "File integrity changes detected:\n$changes"
    fi

    mv "$temp_checksums" "$checksums_file"
}

# Monitor system processes
monitor_system_processes() {
    # Monitor for suspicious processes
    local suspicious_processes=$(ps aux | grep -E "(nc|netcat|ncat|wget.*sh|curl.*sh|bash.*-i|/bin/sh.*-i)" | grep -v grep)

    if [[ -n "$suspicious_processes" ]]; then
        send_security_alert "HIGH" "Suspicious Process" "Suspicious process detected: $suspicious_processes" "localhost"
    fi

    # Monitor for unusual network connections
    if command -v netstat > /dev/null 2>&1; then
        local unusual_connections=$(netstat -tuln 2>/dev/null | grep -E ":(4444|5555|6666|7777|8888|9999|31337|12345)")

        if [[ -n "$unusual_connections" ]]; then
            send_security_alert "HIGH" "Unusual Network Connection" "Unusual network connection detected: $unusual_connections" "localhost"
        fi
    fi
}

# Generate security dashboard
generate_security_dashboard() {
    local dashboard_file="$MONITORING_DIR/security_dashboard.html"

    # Get statistics
    local total_events=$(tail -n +2 "$MONITORING_DIR/security_events.csv" | wc -l)
    local critical_events=$(grep ",CRITICAL," "$MONITORING_DIR/security_events.csv" | wc -l)
    local high_events=$(grep ",HIGH," "$MONITORING_DIR/security_events.csv" | wc -l)
    local blacklisted_ips=$(wc -l < "$BLACKLIST_FILE")
    local whitelisted_ips=$(wc -l < "$WHITELIST_FILE")

    # Get recent events
    local recent_events=$(tail -n 10 "$MONITORING_DIR/security_events.csv" | tail -n +2)

    cat > "$dashboard_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>INAMSOS Security Dashboard</title>
    <meta http-equiv="refresh" content="300">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat { background: white; padding: 20px; border-radius: 5px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); flex: 1; min-width: 150px; }
        .critical { border-left: 5px solid #e74c3c; }
        .high { border-left: 5px solid #f39c12; }
        .medium { border-left: 5px solid #f1c40f; }
        .low { border-left: 5px solid #3498db; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .section h2 { color: #2c3e50; margin-top: 0; }
        .timestamp { color: #7f8c8d; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .severity-critical { color: #e74c3c; font-weight: bold; }
        .severity-high { color: #f39c12; font-weight: bold; }
        .severity-medium { color: #f1c40f; font-weight: bold; }
        .severity-low { color: #3498db; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 INAMSOS Security Dashboard</h1>
        <p class="timestamp">Last updated: $(date)</p>
        <p>Real-time security monitoring for Indonesia National Cancer Database System</p>
    </div>

    <div class="stats">
        <div class="stat critical">
            <h3>$critical_events</h3>
            <p>Critical Events</p>
        </div>
        <div class="stat high">
            <h3>$high_events</h3>
            <p>High Events</p>
        </div>
        <div class="stat medium">
            <h3>$total_events</h3>
            <p>Total Events</p>
        </div>
        <div class="stat low">
            <h3>$blacklisted_ips</h3>
            <p>Blacklisted IPs</p>
        </div>
        <div class="stat low">
            <h3>$whitelisted_ips</h3>
            <p>Whitelisted IPs</p>
        </div>
    </div>

    <div class="section">
        <h2>Recent Security Events</h2>
        <table>
            <tr><th>Time</th><th>Severity</th><th>Event Type</th><th>Source IP</th><th>Details</th></tr>
$(echo "$recent_events" | while IFS=, read -r timestamp severity event_type source_ip details; do
    echo "<tr>"
    echo "<td>$timestamp</td>"
    echo "<td class=\"severity-$(echo "$severity" | tr '[:upper:]' '[:lower:]')\">$severity</td>"
    echo "<td>$event_type</td>"
    echo "<td>$source_ip</td>"
    echo "<td>$details</td>"
    echo "</tr>"
done)
        </table>
    </div>

    <div class="section">
        <h2>System Status</h2>
        <p><strong>Security Monitoring:</strong> Active</p>
        <p><strong>Last Scan:</strong> $(date)</p>
        <p><strong>Monitoring Mode:</strong> Real-time</p>
        <p><strong>Alert Threshold:</strong> $ALERT_THRESHOLD events</p>
    </div>

    <div class="section">
        <p class="timestamp">Dashboard generated by INAMSOS Security Monitoring System</p>
    </div>
</body>
</html>
EOF

    info "Security dashboard updated: $dashboard_file"
}

# Main monitoring loop
main() {
    local continuous_mode="${1:-false}"

    log "INFO" "Starting INAMSOS security monitoring"

    # Initialize monitoring
    initialize_monitoring

    if [[ "$continuous_mode" == "true" ]]; then
        # Continuous monitoring mode
        log "INFO" "Starting continuous security monitoring (interval: ${SCAN_INTERVAL}s)"

        while true; do
            info "Running security monitoring cycle..."

            # Run all monitoring checks
            monitor_failed_logins
            monitor_suspicious_requests
            monitor_docker_security
            monitor_file_integrity
            monitor_system_processes

            # Generate dashboard
            generate_security_dashboard

            info "Security monitoring cycle completed"

            # Wait for next cycle
            sleep $SCAN_INTERVAL
        done
    else
        # Single run mode
        info "Running single security monitoring cycle..."

        monitor_failed_logins
        monitor_suspicious_requests
        monitor_docker_security
        monitor_file_integrity
        monitor_system_processes
        generate_security_dashboard

        info "Security monitoring cycle completed"
    fi

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Security monitoring failed on line $line_number with exit code $exit_code"
    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root for system-level monitoring"
fi

# Show usage if help requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    --continuous      Run in continuous monitoring mode
    --help, -h        Show this help message

ENVIRONMENT VARIABLES:
    SLACK_WEBHOOK_URL    Slack webhook for security alerts
    EMAIL_RECIPIENTS     Email addresses for security alerts
    SCAN_INTERVAL        Monitoring interval in seconds (default: 300)
    ALERT_THRESHOLD      Alert threshold for events (default: 5)

This script provides real-time security monitoring including:
- Failed login attempt detection
- Suspicious request monitoring
- Docker container security
- File integrity monitoring
- System process monitoring

To run as a service:
sudo systemctl enable inamos-security-monitor
sudo systemctl start inamos-security-monitor

To run continuously:
sudo $0 --continuous
EOF
    exit 0
fi

# Run main function
main "$@"