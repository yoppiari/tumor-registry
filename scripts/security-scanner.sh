#!/bin/bash

# INAMSOS Security Scanner
# Comprehensive security scanning and vulnerability assessment

set -euo pipefail

# Configuration
SCAN_DIR="/home/yopi/Projects/tumor-registry"
REPORT_DIR="/reports/security"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCAN_REPORT="$REPORT_DIR/security_scan_$TIMESTAMP"
ALERT_THRESHOLD="HIGH"
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
    echo "[$timestamp] [$level] $message" >> "$SCAN_REPORT.log"
}

error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] [ERROR] $message${NC}"
    echo "[$timestamp] [ERROR] $message" >> "$SCAN_REPORT.log"
}

warn() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}"
    echo "[$timestamp] [WARN] $message" >> "$SCAN_REPORT.log"
}

info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] [INFO] $message${NC}"
    echo "[$timestamp] [INFO] $message" >> "$SCAN_REPORT.log"
}

# Send security alert
send_security_alert() {
    local severity="$1"
    local message="$2"
    local details="$3"

    local color="good"
    [[ "$severity" == "CRITICAL" ]] && color="danger"
    [[ "$severity" == "HIGH" ]] && color="warning"

    # Slack notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"🔒 Security Alert: $severity\",
                    \"text\": \"$message\",
                    \"fields\": [{
                        \"title\": \"Details\",
                        \"value\": \"$details\",
                        \"short\": false
                    }],
                    \"footer\": \"INAMSOS Security Scanner\",
                    \"ts\": $(date +%s)
                }]
            }" "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi

    # Email notification
    if command -v mail > /dev/null 2>&1; then
        {
            echo "Subject: [SECURITY $severity] $message"
            echo "From: security-scanner@inamsos.kemenkes.go.id"
            echo "To: $EMAIL_RECIPIENTS"
            echo ""
            echo "Security Alert: $severity"
            echo "Time: $(date)"
            echo ""
            echo "Details:"
            echo "$details"
            echo ""
            echo "Full report: $SCAN_REPORT.html"
        } | sendmail "$EMAIL_RECIPIENTS" 2>/dev/null || true
    fi
}

# Create report directory
create_report_dir() {
    mkdir -p "$REPORT_DIR"
    mkdir -p "$SCAN_REPORT"
}

# Docker image security scan
scan_docker_images() {
    info "Scanning Docker images for vulnerabilities..."

    mkdir -p "$SCAN_REPORT/docker"
    local vulnerabilities_found=false

    # Get all Docker images
    local images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep -v REPOSITORY)

    while IFS= read -r image; do
        if [[ "$image" == *"inamsos"* ]]; then
            info "Scanning image: $image"

            # Use Trivy for vulnerability scanning
            if command -v trivy > /dev/null 2>&1; then
                trivy image --format json --output "$SCAN_REPORT/docker/${image//:/_}.json" "$image" 2>/dev/null || true
                trivy image --format table --output "$SCAN_REPORT/docker/${image//:/_}.txt" "$image" 2>/dev/null || true

                # Check for critical vulnerabilities
                local critical_vulns=$(jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "CRITICAL") | .VulnerabilityID' "$SCAN_REPORT/docker/${image//:/_}.json" 2>/dev/null | wc -l || echo "0")
                local high_vulns=$(jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "HIGH") | .VulnerabilityID' "$SCAN_REPORT/docker/${image//:/_}.json" 2>/dev/null | wc -l || echo "0")

                if [[ $critical_vulns -gt 0 || $high_vulns -gt 0 ]]; then
                    warn "Vulnerabilities found in $image: $critical_vulns critical, $high_vulns high"
                    vulnerabilities_found=true
                else
                    info "✓ No critical or high vulnerabilities found in $image"
                fi
            else
                warn "Trivy not installed, skipping Docker image vulnerability scan"
            fi
        fi
    done <<< "$images"

    return $([[ "$vulnerabilities_found" == "true" ]] && echo 1 || echo 0)
}

# Application dependency scan
scan_dependencies() {
    info "Scanning application dependencies for vulnerabilities..."

    mkdir -p "$SCAN_REPORT/dependencies"
    local vulnerabilities_found=false

    # Backend dependencies
    if [[ -f "$SCAN_DIR/backend/package.json" ]]; then
        cd "$SCAN_DIR/backend"

        if command -v npm > /dev/null 2>&1; then
            # npm audit for security vulnerabilities
            npm audit --json > "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || true
            npm audit --audit-level=moderate > "$SCAN_REPORT/dependencies/npm_audit_backend.txt" 2>/dev/null || true

            # Count vulnerabilities
            local critical_vulns=$(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || echo "0")
            local high_vulns=$(jq -r '.metadata.vulnerabilities.high // 0' "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || echo "0")

            if [[ $critical_vulns -gt 0 || $high_vulns -gt 0 ]]; then
                warn "Backend vulnerabilities: $critical_vulns critical, $high_vulns high"
                vulnerabilities_found=true
            else
                info "✓ No critical or high vulnerabilities found in backend dependencies"
            fi
        fi
    fi

    # Frontend dependencies
    if [[ -f "$SCAN_DIR/frontend/package.json" ]]; then
        cd "$SCAN_DIR/frontend"

        if command -v npm > /dev/null 2>&1; then
            npm audit --json > "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || true
            npm audit --audit-level=moderate > "$SCAN_REPORT/dependencies/npm_audit_frontend.txt" 2>/dev/null || true

            local critical_vulns=$(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || echo "0")
            local high_vulns=$(jq -r '.metadata.vulnerabilities.high // 0' "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || echo "0")

            if [[ $critical_vulns -gt 0 || $high_vulns -gt 0 ]]; then
                warn "Frontend vulnerabilities: $critical_vulns critical, $high_vulns high"
                vulnerabilities_found=true
            else
                info "✓ No critical or high vulnerabilities found in frontend dependencies"
            fi
        fi
    fi

    return $([[ "$vulnerabilities_found" == "true" ]] && echo 1 || echo 0)
}

# Code security analysis
scan_source_code() {
    info "Performing source code security analysis..."

    mkdir -p "$SCAN_REPORT/code"
    local issues_found=false

    # Use Semgrep for static code analysis
    if command -v semgrep > /dev/null 2>&1; then
        # Backend code analysis
        if [[ -d "$SCAN_DIR/backend/src" ]]; then
            info "Analyzing backend source code..."
            semgrep --config=auto --json --output="$SCAN_REPORT/code/backend_semgrep.json" "$SCAN_DIR/backend/src" 2>/dev/null || true
            semgrep --config=auto --output="$SCAN_REPORT/code/backend_semgrep.txt" "$SCAN_DIR/backend/src" 2>/dev/null || true

            local backend_issues=$(jq '.results | length' "$SCAN_REPORT/code/backend_semgrep.json" 2>/dev/null || echo "0")
            if [[ $backend_issues -gt 0 ]]; then
                warn "Backend code issues found: $backend_issues"
                issues_found=true
            else
                info "✓ No security issues found in backend source code"
            fi
        fi

        # Frontend code analysis
        if [[ -d "$SCAN_DIR/frontend/src" ]]; then
            info "Analyzing frontend source code..."
            semgrep --config=auto --json --output="$SCAN_REPORT/code/frontend_semgrep.json" "$SCAN_DIR/frontend/src" 2>/dev/null || true
            semgrep --config=auto --output="$SCAN_REPORT/code/frontend_semgrep.txt" "$SCAN_DIR/frontend/src" 2>/dev/null || true

            local frontend_issues=$(jq '.results | length' "$SCAN_REPORT/code/frontend_semgrep.json" 2>/dev/null || echo "0")
            if [[ $frontend_issues -gt 0 ]]; then
                warn "Frontend code issues found: $frontend_issues"
                issues_found=true
            else
                info "✓ No security issues found in frontend source code"
            fi
        fi
    else
        warn "Semgrep not installed, skipping source code analysis"
    fi

    # Check for sensitive data exposure
    info "Checking for sensitive data exposure..."

    # Common patterns to check for
    local patterns=(
        "password"
        "secret"
        "api_key"
        "token"
        "private_key"
        "aws_secret"
        "database_url"
        "jwt_secret"
    )

    for pattern in "${patterns[@]}"; do
        local findings=$(grep -r -i -n --include="*.js" --include="*.ts" --include="*.json" --include="*.env*" "$pattern" "$SCAN_DIR" 2>/dev/null | grep -v node_modules | grep -v ".git" | wc -l || echo "0")
        if [[ $findings -gt 0 ]]; then
            warn "Potential sensitive data exposure: $findings occurrences of '$pattern'"
            grep -r -i -n --include="*.js" --include="*.ts" --include="*.json" --include="*.env*" "$pattern" "$SCAN_DIR" 2>/dev/null | grep -v node_modules | grep -v ".git" > "$SCAN_REPORT/code/sensitive_data_$pattern.txt" || true
            issues_found=true
        fi
    done

    return $([[ "$issues_found" == "true" ]] && echo 1 || echo 0)
}

# Network security scan
scan_network_security() {
    info "Performing network security scan..."

    mkdir -p "$SCAN_REPORT/network"
    local vulnerabilities_found=false

    # Check open ports
    if command -v nmap > /dev/null 2>&1; then
        info "Scanning open ports..."
        nmap -sT -O -p 1-65535 localhost > "$SCAN_REPORT/network/port_scan.txt" 2>/dev/null || true

        # Check for unexpected open ports
        local open_ports=$(grep -E "^[0-9]+/tcp.*open" "$SCAN_REPORT/network/port_scan.txt" | wc -l || echo "0")
        info "Found $open_ports open ports"
    else
        warn "Nmap not installed, skipping port scan"
    fi

    # SSL/TLS certificate check
    if command -v openssl > /dev/null 2>&1; then
        info "Checking SSL/TLS configuration..."

        # Check main domain
        if echo | openssl s_client -connect inamsos.kemenkes.go.id:443 -servername inamsos.kemenkes.go.id 2>/dev/null | openssl x509 -noout -dates > "$SCAN_REPORT/network/ssl_cert_dates.txt" 2>/dev/null; then
            info "✓ SSL certificate information retrieved"
        else
            warn "Failed to retrieve SSL certificate information"
            vulnerabilities_found=true
        fi

        # Check SSL configuration
        if command -v testssl.sh > /dev/null 2>&1; then
            testssl.sh --quiet --jsonfile "$SCAN_REPORT/network/testssl_results.json" inamsos.kemenkes.go.id:443 2>/dev/null || true
        fi
    fi

    return $([[ "$vulnerabilities_found" == "true" ]] && echo 1 || echo 0)
}

# Infrastructure security scan
scan_infrastructure() {
    info "Performing infrastructure security scan..."

    mkdir -p "$SCAN_REPORT/infrastructure"
    local vulnerabilities_found=false

    # Check Docker daemon security
    if command -v docker > /dev/null 2>&1; then
        info "Checking Docker daemon security..."

        # Check if Docker is running as root
        if [[ "$(docker info 2>/dev/null | grep -c 'User: root')" -gt 0 ]]; then
            warn "Docker daemon is running as root"
            vulnerabilities_found=true
        fi

        # Check for exposed Docker socket
        if [[ -e /var/run/docker.sock && "$(stat -c '%a' /var/run/docker.sock)" -gt 600 ]]; then
            warn "Docker socket has overly permissive permissions"
            vulnerabilities_found=true
        fi

        # Check for containers running as root
        local root_containers=$(docker ps --format "table {{.Names}}\t{{.Image}}" | awk 'NR>1 {print $1}' | xargs -I {} docker inspect {} --format='{{.Name}} {{.HostConfig.User}}' 2>/dev/null | grep -c 'root\|""' || echo "0")
        if [[ $root_containers -gt 0 ]]; then
            warn "Found $root_containers containers running as root"
            vulnerabilities_found=true
        fi
    fi

    # Check file permissions
    info "Checking file permissions..."

    # Check for world-writable files
    local world_writable=$(find "$SCAN_DIR" -type f -perm -002 2>/dev/null | wc -l || echo "0")
    if [[ $world_writable -gt 0 ]]; then
        warn "Found $world_writable world-writable files"
        vulnerabilities_found=true
    fi

    # Check for configuration file permissions
    local config_files=("$SCAN_DIR/.env*" "$SCAN_DIR/nginx/*.conf" "$SCAN_DIR/docker-compose*.yml")
    for file in "${config_files[@]}"; do
        if [[ -f "$file" ]]; then
            local perms=$(stat -c "%a" "$file" 2>/dev/null || echo "644")
            if [[ "$perms" -gt 644 ]]; then
                warn "Configuration file $file has permissive permissions: $perms"
                vulnerabilities_found=true
            fi
        fi
    done

    return $([[ "$vulnerabilities_found" == "true" ]] && echo 1 || echo 0)
}

# Generate comprehensive security report
generate_security_report() {
    info "Generating comprehensive security report..."

    local total_critical=0
    local total_high=0
    local total_medium=0
    local total_low=0

    # Count vulnerabilities from all scans
    if [[ -f "$SCAN_REPORT/docker" ]]; then
        total_critical=$((total_critical + $(find "$SCAN_REPORT/docker" -name "*.json" -exec jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "CRITICAL") | .VulnerabilityID' {} \; 2>/dev/null | wc -l || echo 0)))
        total_high=$((total_high + $(find "$SCAN_REPORT/docker" -name "*.json" -exec jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "HIGH") | .VulnerabilityID' {} \; 2>/dev/null | wc -l || echo 0)))
    fi

    if [[ -f "$SCAN_REPORT/dependencies/npm_audit_backend.json" ]]; then
        total_critical=$((total_critical + $(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || echo 0)))
        total_high=$((total_high + $(jq -r '.metadata.vulnerabilities.high // 0' "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || echo 0)))
    fi

    if [[ -f "$SCAN_REPORT/dependencies/npm_audit_frontend.json" ]]; then
        total_critical=$((total_critical + $(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || echo 0)))
        total_high=$((total_high + $(jq -r '.metadata.vulnerabilities.high // 0' "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || echo 0)))
    fi

    # Generate HTML report
    cat > "$SCAN_REPORT.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>INAMSOS Security Scan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; }
        .metric { background: white; padding: 20px; border-radius: 5px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); flex: 1; }
        .critical { border-left: 5px solid #e74c3c; }
        .high { border-left: 5px solid #f39c12; }
        .medium { border-left: 5px solid #f1c40f; }
        .low { border-left: 5px solid #3498db; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .section h2 { color: #2c3e50; margin-top: 0; }
        .timestamp { color: #7f8c8d; font-size: 0.9em; }
        .recommendation { background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .status-pass { color: #27ae60; font-weight: bold; }
        .status-fail { color: #e74c3c; font-weight: bold; }
        .status-warn { color: #f39c12; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 INAMSOS Security Scan Report</h1>
        <p class="timestamp">Generated on $(date)</p>
        <p>Security assessment for Indonesia National Cancer Database System</p>
    </div>

    <div class="summary">
        <div class="metric critical">
            <h3>$total_critical</h3>
            <p>Critical</p>
        </div>
        <div class="metric high">
            <h3>$total_high</h3>
            <p>High</p>
        </div>
        <div class="metric medium">
            <h3>$total_medium</h3>
            <p>Medium</p>
        </div>
        <div class="metric low">
            <h3>$total_low</h3>
            <p>Low</p>
        </div>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p>This security scan identified <strong>$((total_critical + total_high + total_medium + total_low))</strong> total issues:</p>
        <ul>
            <li>$total_critical Critical vulnerabilities requiring immediate attention</li>
            <li>$total_high High vulnerabilities that should be addressed soon</li>
            <li>$total_medium Medium vulnerabilities that should be addressed</li>
            <li>$total_low Low vulnerabilities for improvement</li>
        </ul>
EOF

    # Add risk assessment
    if [[ $total_critical -gt 0 ]]; then
        echo "<p class='status-fail'><strong>RISK LEVEL: CRITICAL</strong> - Immediate action required</p>" >> "$SCAN_REPORT.html"
    elif [[ $total_high -gt 3 ]]; then
        echo "<p class='status-warn'><strong>RISK LEVEL: HIGH</strong> - Prompt action required</p>" >> "$SCAN_REPORT.html"
    elif [[ $total_high -gt 0 || $total_medium -gt 10 ]]; then
        echo "<p class='status-warn'><strong>RISK LEVEL: MEDIUM</strong> - Action recommended</p>" >> "$SCAN_REPORT.html"
    else
        echo "<p class='status-pass'><strong>RISK LEVEL: LOW</strong> - Security posture is good</p>" >> "$SCAN_REPORT.html"
    fi

    cat >> "$SCAN_REPORT.html" << EOF
    </div>

    <div class="section">
        <h2>Scan Results</h2>
        <table>
            <tr><th>Scan Type</th><th>Status</th><th>Issues Found</th><th>Details</th></tr>
            <tr>
                <td>Docker Images</td>
                <td>$([[ -d "$SCAN_REPORT/docker" ]] && echo "Completed" || echo "Skipped")</td>
                <td>$(find "$SCAN_REPORT/docker" -name "*.txt" -exec grep -c "CRITICAL\|HIGH" {} \; 2>/dev/null | awk '{sum+=$1} END {print sum+0}' || echo "0")</td>
                <td>Container vulnerability scan</td>
            </tr>
            <tr>
                <td>Dependencies</td>
                <td>$([[ -d "$SCAN_REPORT/dependencies" ]] && echo "Completed" || echo "Skipped")</td>
                <td>$(((total_critical + total_high) - $(find "$SCAN_REPORT/docker" -name "*.json" -exec jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "CRITICAL" or .Severity == "HIGH") | .VulnerabilityID' {} \; 2>/dev/null | wc -l || echo 0)))</td>
                <td>Application dependency vulnerabilities</td>
            </tr>
            <tr>
                <td>Source Code</td>
                <td>$([[ -d "$SCAN_REPORT/code" ]] && echo "Completed" || echo "Skipped")</td>
                <td>$(find "$SCAN_REPORT/code" -name "*.json" -exec jq '.results | length' {} \; 2>/dev/null | awk '{sum+=$1} END {print sum+0}' || echo "0")</td>
                <td>Static code analysis</td>
            </tr>
            <tr>
                <td>Network</td>
                <td>$([[ -d "$SCAN_REPORT/network" ]] && echo "Completed" || echo "Skipped")</td>
                <td>N/A</td>
                <td>Network and SSL/TLS security</td>
            </tr>
            <tr>
                <td>Infrastructure</td>
                <td>$([[ -d "$SCAN_REPORT/infrastructure" ]] && echo "Completed" || echo "Skipped")</td>
                <td>N/A</td>
                <td>System configuration security</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        <div class="recommendation">
            <strong>Immediate Actions:</strong>
            <ul>
                <li>Address all CRITICAL severity vulnerabilities immediately</li>
                <li>Update Docker images to secure versions</li>
                <li>Apply security patches to application dependencies</li>
            </ul>
        </div>
        <div class="recommendation">
            <strong>Short-term Actions:</strong>
            <ul>
                <li>Review and fix HIGH severity vulnerabilities</li>
                <li>Implement security best practices in source code</li>
                <li>Enhance monitoring and alerting</li>
            </ul>
        </div>
        <div class="recommendation">
            <strong>Long-term Actions:</strong>
            <ul>
                <li>Establish regular security scanning schedule</li>
                <li>Implement security training for development team</li>
                <li>Create security incident response procedures</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Detailed Reports</h2>
        <p>For detailed findings and remediation steps, refer to the individual scan reports in:</p>
        <code>$SCAN_REPORT/</code>
    </div>

    <div class="section">
        <p class="timestamp">Report generated by INAMSOS Security Scanner v1.0</p>
    </div>
</body>
</html>
EOF

    info "✓ Security report generated: $SCAN_REPORT.html"
}

# Main scan function
main() {
    local start_time=$(date +%s)

    log "INFO" "Starting INAMSOS security scan"

    # Create report directory
    create_report_dir

    # Run security scans
    local total_issues=0

    # Docker image scan
    if scan_docker_images; then
        total_issues=$((total_issues + 1))
    fi

    # Dependency scan
    if scan_dependencies; then
        total_issues=$((total_issues + 1))
    fi

    # Source code scan
    if scan_source_code; then
        total_issues=$((total_issues + 1))
    fi

    # Network security scan
    if scan_network_security; then
        total_issues=$((total_issues + 1))
    fi

    # Infrastructure scan
    if scan_infrastructure; then
        total_issues=$((total_issues + 1))
    fi

    # Generate comprehensive report
    generate_security_report

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log "INFO" "Security scan completed in ${duration}s"

    # Send alert if critical issues found
    local critical_issues=$(find "$SCAN_REPORT" -name "*.json" -exec jq -r '.Results[]? // {} | .Vulnerabilities[]? // {} | select(.Severity == "CRITICAL") | .VulnerabilityID' {} \; 2>/dev/null | wc -l || echo 0)
    critical_issues=$((critical_issues + $(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_backend.json" 2>/dev/null || echo 0) + $(jq -r '.metadata.vulnerabilities.critical // 0' "$SCAN_REPORT/dependencies/npm_audit_frontend.json" 2>/dev/null || echo 0)))

    if [[ $critical_issues -gt 0 ]]; then
        send_security_alert "CRITICAL" "Critical security vulnerabilities found" "$critical_issues critical vulnerabilities identified. Immediate action required."
    elif [[ $total_issues -gt 5 ]]; then
        send_security_alert "HIGH" "Multiple security issues found" "$total_issues security issues identified. Review recommended."
    fi

    log "INFO" "Security scan summary: $total_issues scans with issues found, $critical_issues critical vulnerabilities"

    # Clean up old reports (keep last 30 days)
    find "$REPORT_DIR" -name "security_scan_*" -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

    return 0
}

# Error handling
handle_error() {
    local exit_code=$?
    local line_number=$1

    error "Security scanner failed on line $line_number with exit code $exit_code"
    exit $exit_code
}

# Set error handling
trap 'handle_error $LINENO' ERR

# Check if running as root or with appropriate permissions
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root or with sudo privileges"
fi

# Show usage if help requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Usage: $0 [OPTIONS]

OPTIONS:
    --help, -h        Show this help message

ENVIRONMENT VARIABLES:
    SLACK_WEBHOOK_URL   Slack webhook for security alerts
    EMAIL_RECIPIENTS    Email addresses for security alerts

REQUIREMENTS:
    - Docker and Docker Compose
    - Node.js and npm
    - trivy (for Docker image scanning)
    - semgrep (for code analysis)
    - nmap (for network scanning)
    - openssl (for SSL/TLS checking)

This script performs comprehensive security scanning including:
- Docker image vulnerability scanning
- Application dependency analysis
- Source code security analysis
- Network security assessment
- Infrastructure security review

Install required tools:
npm install -g semgrep
apt-get install trivy nmap openssl testssl.sh
EOF
    exit 0
fi

# Run main function
main "$@"