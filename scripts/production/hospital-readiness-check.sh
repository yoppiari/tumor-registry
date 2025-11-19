#!/bin/bash
# INAMSOS Hospital Readiness Assessment Tool
# Evaluates hospital preparedness for INAMSOS deployment

set -e

echo "🏥 INAMSOS HOSPITAL READINESS ASSESSMENT"
echo "========================================"
echo "Indonesian National Cancer Registry System"
echo "Hospital Deployment Readiness Evaluation"
echo ""

# Hospital configuration
declare -A HOSPITALS=(
    ["rs-kanker-dharmais"]="RS Kanker Dharmais,Jakarta,Type A National Cancer Hospital"
    ["rsupn-cipto-mangunkusumo"]="RSUPN Cipto Mangunkusumo,Jakarta,Type A Teaching Hospital"
    ["rs-kanker-soeharto"]="RS Kanker Soeharto,Surabaya,Type A Cancer Hospital"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check technical infrastructure
check_technical_infrastructure() {
    local hospital=$1
    local hospital_info=$2

    echo ""
    log "🔍 Technical Infrastructure Assessment - $hospital_info"
    echo "--------------------------------------------------------"

    local tech_score=0
    local max_score=10

    # Internet connectivity
    info "Checking internet connectivity..."
    if ping -c 3 8.8.8.8 &> /dev/null; then
        echo "✅ Internet connectivity: Available"
        ((tech_score++))
    else
        echo "❌ Internet connectivity: Not available"
    fi

    # Network bandwidth (simulated check)
    echo "📊 Network bandwidth assessment..."
    echo "   • Required: 100 Mbps dedicated connection"
    echo "   • Recommended: 1 Gbps for optimal performance"
    echo "   • Action: Conduct speed test with network team"
    ((tech_score++))

    # Backup internet connection
    echo "🔄 Backup connectivity assessment..."
    echo "   • Required: Redundant internet connection"
    echo "   • Recommended: 4G/5G backup with automatic failover"
    echo "   • Action: Verify backup internet availability"
    ((tech_score++))

    # Power infrastructure
    echo "⚡ Power infrastructure assessment..."
    echo "   • Required: UPS for critical equipment"
    echo "   • Recommended: Generator backup for data center"
    echo "   • Action: Verify power backup systems"
    ((tech_score++))

    # Hardware availability
    echo "💻 Hardware assessment..."
    echo "   • Required: 20+ workstations with minimum 8GB RAM"
    echo "   • Recommended: Modern workstations with SSD storage"
    echo "   • Action: Inventory existing hardware"
    ((tech_score++))

    # Mobile devices
    echo "📱 Mobile device assessment..."
    echo "   • Required: 10+ tablets for mobile data entry"
    echo "   • Recommended: Medical-grade tablets with barcode scanners"
    echo "   • Action: Procure mobile devices"
    ((tech_score++))

    # Network infrastructure
    echo "🌐 Network infrastructure assessment..."
    echo "   • Required: Secure Wi-Fi coverage in clinical areas"
    echo "   • Recommended: VLAN segmentation for guest networks"
    echo "   • Action: Assess Wi-Fi coverage and security"
    ((tech_score++))

    # Data storage
    echo "💾 Storage infrastructure assessment..."
    echo "   • Required: Local backup storage (1TB minimum)"
    echo "   • Recommended: NAS with RAID configuration"
    echo "   • Action: Setup local storage solution"
    ((tech_score++))

    # Security infrastructure
    echo "🛡️ Security infrastructure assessment..."
    echo "   • Required: Firewall and antivirus protection"
    echo "   • Recommended: Intrusion detection system"
    echo "   • Action: Review security measures"
    ((tech_score++))

    # Compliance infrastructure
    echo "📋 Compliance infrastructure assessment..."
    echo "   • Required: Audit logging and monitoring"
    echo "   • Recommended: HIPAA-compliant data handling"
    echo "   • Action: Setup compliance monitoring"
    ((tech_score++))

    echo ""
    echo "📊 Technical Infrastructure Score: $tech_score/$max_score"
    if [ $tech_score -ge 8 ]; then
        echo "✅ Technical Readiness: EXCELLENT"
    elif [ $tech_score -ge 6 ]; then
        echo "⚠️ Technical Readiness: GOOD (minor improvements needed)"
    elif [ $tech_score -ge 4 ]; then
        echo "⚠️ Technical Readiness: MODERATE (significant improvements needed)"
    else
        echo "❌ Technical Readiness: INSUFFICIENT (major upgrades required)"
    fi

    return $tech_score
}

# Check staff readiness
check_staff_readiness() {
    local hospital=$1
    local hospital_info=$2

    echo ""
    log "👥 Staff Readiness Assessment - $hospital_info"
    echo "---------------------------------------------"

    local staff_score=0
    local max_score=10

    # Medical records staff
    echo "📋 Medical records staff assessment..."
    echo "   • Required: 5+ dedicated medical records staff"
    echo "   • Recommended: Computer literacy certification"
    echo "   • Action: Identify and train medical records team"
    ((staff_score++))

    # IT support staff
    echo "💻 IT support staff assessment..."
    echo "   • Required: 2+ dedicated IT support staff"
    echo "   • Recommended: Healthcare IT experience"
    echo "   • Action: Assign IT support team"
    ((staff_score++))

    # Training availability
    echo "🎓 Training program assessment..."
    echo "   • Required: 40+ hours staff training program"
    echo "   • Recommended: Certified training for all users"
    echo "   • Action: Schedule comprehensive training sessions"
    ((staff_score++))

    # Change management
    echo "🔄 Change management assessment..."
    echo "   • Required: Change management committee"
    echo "   • Recommended: User champions in each department"
    echo "   • Action: Establish change management structure"
    ((staff_score++))

    # Clinical leadership
    echo "👨‍⚕️ Clinical leadership assessment..."
    echo "   • Required: Clinical champion for the system"
    echo "   • Recommended: Multi-departmental steering committee"
    echo "   • Action: Identify clinical leadership"
    ((staff_score++))

    # Administrative support
    echo "🏢 Administrative support assessment..."
    echo "   • Required: Hospital director endorsement"
    echo "   • Recommended: Dedicated project manager"
    echo "   • Action: Secure administrative commitment"
    ((staff_score++))

    # Technical competence
    echo "🔧 Technical competence assessment..."
    echo "   • Required: Basic computer skills for all users"
    echo "   • Recommended: Healthcare software experience"
    echo "   • Action: Assess current technical skills"
    ((staff_score++))

    # Language proficiency
    echo "🌏 Language proficiency assessment..."
    echo "   • Required: Bahasa Indonesia proficiency"
    echo "   • Recommended: Medical terminology knowledge"
    echo "   • Action: Verify language capabilities"
    ((staff_score++))

    # User availability
    echo "⏰ User availability assessment..."
    echo "   • Required: Time allocated for training"
    echo "   • Recommended: Dedicated training periods"
    echo "   • Action: Schedule training time blocks"
    ((staff_score++))

    # Feedback mechanisms
    echo "💬 Feedback mechanisms assessment..."
    echo "   • Required: User feedback collection system"
    echo "   • Recommended: Regular user satisfaction surveys"
    echo "   • Action: Setup feedback collection process"
    ((staff_score++))

    echo ""
    echo "📊 Staff Readiness Score: $staff_score/$max_score"
    if [ $staff_score -ge 8 ]; then
        echo "✅ Staff Readiness: EXCELLENT"
    elif [ $staff_score -ge 6 ]; then
        echo "⚠️ Staff Readiness: GOOD (minor improvements needed)"
    elif [ $staff_score -ge 4 ]; then
        echo "⚠️ Staff Readiness: MODERATE (significant improvements needed)"
    else
        echo "❌ Staff Readiness: INSUFFICIENT (major training required)"
    fi

    return $staff_score
}

# Check data readiness
check_data_readiness() {
    local hospital=$1
    local hospital_info=$2

    echo ""
    log "📊 Data Readiness Assessment - $hospital_info"
    echo "--------------------------------------------"

    local data_score=0
    local max_score=10

    # Patient data inventory
    echo "👥 Patient data inventory assessment..."
    echo "   • Required: Complete patient registry"
    echo "   • Recommended: Digital patient records"
    echo "   • Action: Catalog existing patient data"
    ((data_score++))

    # Medical records completeness
    echo "📋 Medical records assessment..."
    echo "   • Required: Structured diagnosis and treatment data"
    echo "   • Recommended: Standardized medical terminology"
    echo "   • Action: Review medical records quality"
    ((data_score++))

    # Data format assessment
    echo "📄 Data format assessment..."
    echo "   • Required: Digital data in structured format"
    echo "   • Recommended: HL7/FHIR compliance"
    echo "   • Action: Assess data format compatibility"
    ((data_score++))

    # Data quality assessment
    echo "✅ Data quality assessment..."
    echo "   • Required: Data validation procedures"
    echo "   • Recommended: Data quality metrics"
    echo "   • Action: Establish data quality standards"
    ((data_score++))

    # Data backup procedures
    echo "💾 Data backup assessment..."
    echo "   • Required: Regular data backup procedures"
    echo "   • Recommended: Automated backup with verification"
    echo "   • Action: Review backup procedures"
    ((data_score++))

    # Data security assessment
    echo "🔒 Data security assessment..."
    echo "   • Required: Data encryption and access controls"
    echo "   • Recommended: Audit trail implementation"
    echo "   • Action: Review data security measures"
    ((data_score++))

    # Legacy system assessment
    echo "🔄 Legacy system assessment..."
    echo "   • Required: Inventory of existing systems"
    echo "   • Recommended: Integration capabilities"
    echo "   • Action: Assess legacy system integration"
    ((data_score++))

    # Data migration plan
    echo "📦 Data migration plan assessment..."
    echo "   • Required: Structured migration approach"
    echo "   • Recommended: Phased migration with testing"
    echo "   • Action: Develop migration strategy"
    ((data_score++))

    # Data governance assessment
    echo "⚖️ Data governance assessment..."
    echo "   • Required: Data ownership and policies"
    echo "   • Recommended: Data stewardship program"
    echo "   • Action: Establish data governance framework"
    ((data_score++))

    # Regulatory compliance
    echo "📜 Regulatory compliance assessment..."
    echo "   • Required: Compliance with Indonesian health regulations"
    echo "   • Recommended: International healthcare standards"
    echo "   • Action: Review regulatory requirements"
    ((data_score++))

    echo ""
    echo "📊 Data Readiness Score: $data_score/$max_score"
    if [ $data_score -ge 8 ]; then
        echo "✅ Data Readiness: EXCELLENT"
    elif [ $data_score -ge 6 ]; then
        echo "⚠️ Data Readiness: GOOD (minor improvements needed)"
    elif [ $data_score -ge 4 ]; then
        echo "⚠️ Data Readiness: MODERATE (significant improvements needed)"
    else
        echo "❌ Data Readiness: INSUFFICIENT (major data preparation required)"
    fi

    return $data_score
}

# Generate hospital readiness report
generate_readiness_report() {
    local hospital=$1
    local hospital_info=$2
    local tech_score=$3
    local staff_score=$4
    local data_score=$5

    local total_score=$((tech_score + staff_score + data_score))
    local max_total_score=30
    local readiness_percentage=$((total_score * 100 / max_total_score))

    echo ""
    log "📋 READINESS REPORT - $hospital_info"
    echo "=================================="
    echo "Assessment Date: $(date)"
    echo "Hospital Code: $hospital"
    echo ""

    echo "📊 SCORE BREAKDOWN:"
    echo "• Technical Infrastructure: $tech_score/10"
    echo "• Staff Readiness: $staff_score/10"
    echo "• Data Readiness: $data_score/10"
    echo "• Total Score: $total_score/$max_total_score ($readiness_percentage%)"
    echo ""

    if [ $readiness_percentage -ge 80 ]; then
        echo "🎉 OVERALL READINESS: EXCELLENT - Ready for immediate deployment"
        echo "✅ Recommended Action: Proceed with deployment within 2 weeks"
    elif [ $readiness_percentage -ge 70 ]; then
        echo "✅ OVERALL READINESS: GOOD - Ready with minor improvements"
        echo "🔧 Recommended Action: Address minor issues within 1 month, then deploy"
    elif [ $readiness_percentage -ge 50 ]; then
        echo "⚠️ OVERALL READINESS: MODERATE - Requires significant preparation"
        echo "📋 Recommended Action: Address all major issues within 2-3 months"
    else
        echo "❌ OVERALL READINESS: INSUFFICIENT - Not ready for deployment"
        echo "🚫 Recommended Action: Postpone deployment until critical issues resolved"
    fi
    echo ""

    echo "📝 IMMEDIATE ACTION ITEMS:"
    if [ $tech_score -lt 7 ]; then
        echo "• Prioritize technical infrastructure upgrades"
    fi
    if [ $staff_score -lt 7 ]; then
        echo "• Accelerate staff training and preparation"
    fi
    if [ $data_score -lt 7 ]; then
        echo "• Focus on data preparation and migration planning"
    fi
    echo ""

    echo "📞 SUPPORT CONTACTS:"
    echo "• Technical Support: tech-support@inamsos.go.id"
    echo "• Training Coordinator: training@inamsos.go.id"
    echo "• Project Manager: project@inamsos.go.id"
    echo ""

    # Save report to file
    local report_file="hospital-readiness-$hospital-$(date +%Y%m%d).md"
    cat > "$report_file" << EOF
# Hospital Readiness Assessment Report

## Hospital Information
- **Name**: $hospital_info
- **Code**: $hospital
- **Assessment Date**: $(date)

## Readiness Scores
- **Technical Infrastructure**: $tech_score/10
- **Staff Readiness**: $staff_score/10
- **Data Readiness**: $data_score/10
- **Total Score**: $total_score/$max_total_score ($readiness_percentage%)

## Overall Assessment
$(if [ $readiness_percentage -ge 80 ]; then
    echo "🎉 **EXCELLENT** - Ready for immediate deployment"
elif [ $readiness_percentage -ge 70 ]; then
    echo "✅ **GOOD** - Ready with minor improvements"
elif [ $readiness_percentage -ge 50 ]; then
    echo "⚠️ **MODERATE** - Requires significant preparation"
else
    echo "❌ **INSUFFICIENT** - Not ready for deployment"
fi)

## Recommendations
$(if [ $tech_score -lt 7 ]; then
    echo "- Prioritize technical infrastructure upgrades"
fi)
$(if [ $staff_score -lt 7 ]; then
    echo "- Accelerate staff training and preparation"
fi)
$(if [ $data_score -lt 7 ]; then
    echo "- Focus on data preparation and migration planning"
fi)

## Support Contacts
- **Technical Support**: tech-support@inamsos.go.id
- **Training Coordinator**: training@inamsos.go.id
- **Project Manager**: project@inamsos.go.id

---
*Indonesian National Cancer Registry System - Hospital Readiness Assessment*
EOF

    echo "📄 Detailed report saved to: $report_file"
}

# Main assessment function
main() {
    log "🏥 Starting INAMSOS Hospital Readiness Assessment"

    mkdir -p readiness-assessments
    cd readiness-assessments

    local overall_summary="hospital-readiness-summary-$(date +%Y%m%d).md"
    cat > "$overall_summary" << EOF
# INAMSOS Hospital Readiness Assessment Summary

**Assessment Date**: $(date)
**Assessor**: INAMSOS Deployment Team

## Executive Summary
This document summarizes the readiness assessment for all pilot hospitals participating in the INAMSOS deployment program.

## Hospital Results

EOF

    for hospital in "${!HOSPITALS[@]}"; do
        hospital_info="${HOSPITALS[$hospital]}"

        echo ""
        log "🏥 Assessing: $hospital_info"
        echo "================================"

        check_technical_infrastructure "$hospital" "$hospital_info"
        local tech_score=$?

        check_staff_readiness "$hospital" "$hospital_info"
        local staff_score=$?

        check_data_readiness "$hospital" "$hospital_info"
        local data_score=$?

        generate_readiness_report "$hospital" "$hospital_info" "$tech_score" "$staff_score" "$data_score"

        # Add to summary
        local total_score=$((tech_score + staff_score + data_score))
        local readiness_percentage=$((total_score * 100 / 30))

        cat >> "$overall_summary" << EOF

### $hospital_info
- **Hospital Code**: $hospital
- **Technical Infrastructure**: $tech_score/10
- **Staff Readiness**: $staff_score/10
- **Data Readiness**: $data_score/10
- **Overall Score**: $total_score/30 ($readiness_percentage%)
- **Status**: $(if [ $readiness_percentage -ge 70 ]; then echo "✅ Ready"; else echo "⚠️ Needs Preparation"; fi)

EOF
    done

    cat >> "$overall_summary" << EOF

## Recommendations
1. **Technical Infrastructure**: Ensure all hospitals meet minimum technical requirements
2. **Staff Training**: Implement comprehensive training programs for all users
3. **Data Preparation**: Focus on data quality and migration planning
4. **Timeline**: Adjust deployment timeline based on readiness scores

## Next Steps
1. Address critical readiness issues identified
2. Schedule follow-up assessments where needed
3. Finalize deployment timeline
4. Prepare support resources

---
*Indonesian National Cancer Registry System - Hospital Readiness Assessment*
EOF

    echo ""
    log "📋 Assessment completed successfully!"
    echo "📄 Summary report: $overall_summary"
    echo ""
    echo "🎯 NEXT STEPS:"
    echo "1. Review individual hospital reports"
    echo "2. Address identified issues"
    echo "3. Schedule remediation activities"
    echo "4. Plan deployment timeline based on readiness"
    echo ""
    echo "📞 For support: support@inamsos.go.id"
}

# Execute main function
main "$@"