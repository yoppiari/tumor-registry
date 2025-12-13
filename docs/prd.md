# Product Requirements Document: INAMSOS
## Indonesian Musculoskeletal Tumor Registry

**Date:** 2025-12-11
**Author:** Yoppi
**Project Track:** BMad Method
**Version:** 2.0 (Transformed)
**Registry Type:** Musculoskeletal Tumors (Bone & Soft Tissue)

---

## Project Classification

**Project Type:** SaaS B2B (Multi-tenant Healthcare Platform)
**Domain:** Healthcare - Orthopedic Oncology (Musculoskeletal Tumor Registry)
**Complexity Level:** HIGH
**Subspecialty:** Bone & Soft Tissue Tumor Registry
**Input Context:** Indonesian Musculoskeletal Tumor Registry Form (INAM-TURY)

---

## Vision Alignment

### Executive Summary

INAMSOS (Indonesian Musculoskeletal Tumor Registry) transforms Indonesia's orthopedic oncology research capabilities from scattered, siloed data into a centralized real-time intelligence system that enables groundbreaking research in bone and soft tissue tumors, predictive analytics for treatment outcomes, and evidence-based policy decisions for musculoskeletal oncology care across Indonesia.

### Product Differentiator

The unique value proposition is **Indonesia's first comprehensive musculoskeletal tumor registry** following WHO Classification of Bone and Soft Tissue Tumors, designed specifically for orthopedic oncologists, with specialized data capture for limb salvage outcomes, Enneking staging, MSTS functional scores, and 5-year longitudinal follow-up tracking across 21 national referral centers.

### Project Classification Details

- **Product Type:** Multi-tenant SaaS platform with web-based interface
- **Domain Complexity:** Healthcare - Orthopedic Oncology subspecialty requiring specialized medical protocols
- **Registry Type:** Bone tumors, Soft tissue tumors, Bone metastasis, Tumor-like lesions
- **User Base:** Orthopedic oncologists, Sub-specialists, Residents (PPDS), Medical officers, Researchers
- **Data Sensitivity:** High - medical patient information requiring strict privacy controls
- **Classification Standard:** WHO Classification of Tumours of Soft Tissue and Bone (5th Edition)

---

## Success Criteria

### Research Impact Success
- **Publication Velocity:** 30+ musculoskeletal tumor research papers annually citing INAMSOS data
- **Collaboration Rate:** 150% increase in multi-center orthopedic oncology research studies
- **Research Quality:** Improved impact factors in orthopedic oncology publications
- **Data Accessibility:** 48-hour average approval time for research data requests
- **International Recognition:** Recognition from international orthopedic oncology societies (ISOLS, EMSOS)

### Clinical Outcome Success
- **Limb Salvage Rate:** Track and improve limb salvage vs amputation rates nationally
- **Functional Outcomes:** Measure MSTS scores improvement across treatment modalities
- **5-Year Survival:** Comprehensive survival data by tumor type and staging
- **Follow-up Compliance:** >80% completion rate for 14 scheduled follow-up visits
- **Treatment Effectiveness:** Comparative outcomes data for different treatment protocols

### System Adoption Success
- **Orthopedic Oncologist Engagement:** 70% of subspecialists active within 6 months
- **Center Participation:** 21 designated centers feeding real-time data within launch year
- **Data Quality:** >90% completeness across 200+ specialized musculoskeletal fields
- **User Satisfaction:** >85% satisfaction rating across all user types
- **Case Volume:** 1000+ musculoskeletal tumor cases registered in first year

### Strategic Intelligence Success
- **Tumor Pattern Detection:** Geographic distribution analysis of bone and soft tissue tumors
- **Treatment Trend Analysis:** National data on surgical techniques and outcomes
- **Policy Influence:** National orthopedic oncology guidelines citing INAMSOS data
- **Geographic Coverage:** All 21 designated musculoskeletal centers actively contributing
- **Education Impact:** Registry data used in PPDS (resident) training programs

---

## MVP Scope

### Core Capabilities (Launch Phase)

**Specialized Musculoskeletal Data Collection:**
- 10-section comprehensive musculoskeletal tumor registry form
- WHO Classification integration for bone and soft tissue tumors
- Hierarchical anatomical location pickers (bone/soft tissue specific)
- Conditional rendering based on pathology type (bone/soft tissue/metastasis)
- Specialized scoring systems: Enneking, AJCC, Mirrel, Karnofsky, HUVOS
- Clinical photo upload for tumor presentation
- Radiology image management (X-ray, MRI, CT, Bone Scan, PET)
- Pathology report integration (FNAB, Core biopsy, IHK)

**21 National Center Network:**
- All 21 designated musculoskeletal tumor centers pre-configured:
  1. RSUD Dr. Zainoel Abidin Banda Aceh
  2. RSUP H Adam Malik Medan
  3. RSUP Dr. M. Djamil Padang
  4. RSUP Dr. Mohammad Hoesin Palembang
  5. RSUD Arifin Achmad Riau
  6. RSUPN Dr. Cipto Mangunkusumo Jakarta
  7. RSUP Fatmawati Jakarta
  8. RSUP Kanker Dharmais Jakarta
  9. RSUP Persahabatan Jakarta
  10. RS Universitas Indonesia Depok
  11. RSUD Provinsi Banten
  12. RSUP Dr. Hasan Sadikin Bandung
  13. RSUP Dr. Sardjito Yogyakarta
  14. RSOP Prof. Dr. Soeharso Surakarta
  15. RSUD Dr. Moewardhi Surakarta
  16. RSUD Dr. Soetomo Surabaya
  17. RS Universitas Airlangga
  18. RSUD Dr. Syaiful Anwar Malang
  19. RSUD Ulin Banjarmasin
  20. RSUP Prof. Dr. I.G.N.G. Ngoerah Bali
  21. RSUP Dr. Wahidin Sudirohusodo Makassar

**Treatment & Management Tracking:**
- Treatment intention classification (Curative/Palliative)
- Systemic therapy tracking (Neo-adjuvant/Adjuvant chemotherapy with regimen)
- Surgical management detailed capture:
  - Limb salvage vs limb ablation
  - Margin assessment (Wide/Marginal/Intralesional/Radical)
  - Reconstruction methods (Bone/Joint/Soft tissue)
  - Operative details (duration, blood loss, complications)
- Radiotherapy tracking (Neo-adjuvant/Adjuvant with dosage)
- CPC (Cancer Patient Conference) documentation

**14-Visit Longitudinal Follow-up System:**
- Structured follow-up schedule:
  - Year 1-2: Every 3 months (8 visits)
  - Year 3-5: Every 6 months (6 visits)
- MSTS Score calculator and trend tracking
- Follow-up compliance monitoring
- Automated reminder system
- Recurrence and complication tracking
- Quality of life assessment

**Research Access & Discovery:**
- Tumor-specific data browsing with geographic visualization
- Research request workflow with multi-level approval
- Bone tumor vs soft tissue tumor analytics
- Treatment outcome comparisons
- Data export in standard research formats

**Musculoskeletal-Specific Intelligence Dashboard:**
- Real-time tumor type distribution mapping (bone vs soft tissue)
- Limb salvage rate analytics by center and tumor type
- Enneking staging distribution analysis
- Treatment modality effectiveness tracking
- 5-year survival curves by tumor classification
- MSTS functional outcome trends
- Center performance comparison for outcomes

### Growth Features (Phase 2)
- Advanced AI-powered tumor recurrence prediction
- Mobile applications for follow-up data collection
- Integration with international bone tumor databases (ISOLS registry)
- Enhanced collaboration platform for multi-center trials
- Advanced radiological image AI analysis
- Genetic marker tracking for targeted therapies

### Vision Features (Future)
- Predictive treatment outcome analytics by tumor subtype
- Real-time surgical decision support integration
- International research partnership with ISOLS/EMSOS
- Comprehensive genetic and molecular profiling
- AI-driven treatment protocol recommendations
- Patient-reported outcome measures (PROMs) integration

---

## Domain Considerations (Orthopedic Oncology - High Complexity)

### Regulatory Compliance Requirements
- **Patient Privacy:** HIPAA-level privacy protection standards
- **Medical Ethics:** Ethics committee compliance for all research access
- **Data Sovereignty:** Indonesian data residency requirements
- **Research Integrity:** IRB approval integration for all studies
- **Audit Requirements:** Complete audit trails for all data access and modifications

### Clinical Validation Requirements
- **WHO Classification Accuracy:** Strict adherence to WHO 5th Edition taxonomy
- **Staging Validation:** Enneking and AJCC staging accuracy checks
- **Quality Assurance:** Multi-level data quality verification by subspecialists
- **Clinical Review:** Mandatory review for Grade 3 tumors and rare subtypes
- **Standardization:** Consistent anatomical location coding and tumor measurement
- **Traceability:** Complete data provenance from center to national database

### Specialized Medical Requirements
- **Anatomical Precision:** Hierarchical bone and soft tissue location taxonomy
- **Tumor Syndromes:** Integration of hereditary tumor syndromes (Li-Fraumeni, NF1, etc.)
- **Functional Scoring:** Standardized MSTS score calculation and tracking
- **Pathology Integration:** Support for FNAB, core biopsy, open biopsy, IHK reporting
- **Radiological Criteria:** Mirrel score for pathological fracture risk assessment
- **Treatment Protocols:** Standardized chemotherapy regimen coding

### Safety and Security Measures
- **Patient Anonymization:** Multi-tier privacy protection with reversible pseudonymization
- **Access Control:** Role-based permissions with subspecialty-specific granular controls
- **Data Encryption:** End-to-end encryption for sensitive clinical data
- **Security Monitoring:** Real-time security threat detection and audit logging
- **Backup & Recovery:** Medical-grade data protection with 7-year retention minimum

---

## Tenant Model

### Multi-Center Architecture
- **Center-Level Tenancy:** Each of 21 hospitals acts as independent tenant
- **Data Ownership:** Centers maintain ownership of their patient data
- **Shared National Registry:** De-identified aggregated data flows to national musculoskeletal tumor database
- **Hierarchical Permissions:** National > Center > Department > User level access controls
- **Subspecialty Focus:** Orthopedic oncology department-specific workflows

### Center Onboarding Process
1. **Center Registration:** Official Indonesian Orthopedic Association verification
2. **Subspecialist Account Setup:** Orthopedic oncologist, resident, and support staff accounts
3. **Historical Data Migration:** Import existing musculoskeletal tumor case records with validation
4. **Training Completion:** Mandatory training on WHO classification and registry protocols
5. **Go-Live Activation:** Center goes live with real-time case registration

### Resource Isolation
- **Data Storage:** Logical separation of center data with secure shared infrastructure
- **Compute Resources:** Fair resource allocation across 21 centers
- **Network Isolation:** Secure VPN connections from each center
- **Backup Strategy:** Per-center backup with 7-year retention for medical-legal compliance

---

## Permission Matrix

### Role-Based Access Control (RBAC)

**Data Entry Staff:**
- Create and edit musculoskeletal tumor patient records within assigned center
- Upload clinical photos and radiological images
- Complete 10-section registry form with validation
- View local center data only
- Cannot access national database or other centers' data

**Residents (PPDS Orthopedi):**
- Data entry capabilities with supervisor review workflow
- Access to center's complete patient database for learning
- Follow-up visit documentation
- Case presentation preparation tools
- Cannot approve research requests

**Orthopedic Oncologists (Sub-specialists):**
- Full access to center's complete musculoskeletal tumor database
- CPC documentation and decision recording
- Quality control and case review
- Local analytics and outcome tracking
- Research request submission

**Center Administrators:**
- Full access to center's complete dataset
- Approve or deny incoming research requests for center's data
- Manage user accounts within center (orthopedic department)
- View national musculoskeletal tumor analytics
- Center performance benchmarking

**National Musculoskeletal Tumor Registry Administrators:**
- Access to complete anonymized national musculoskeletal tumor database
- Advanced analytics across all 21 centers
- Policy influence and strategic planning tools
- International data sharing coordination (ISOLS, EMSOS)
- Quality assurance across national registry

**Researchers:**
- Browse aggregate national musculoskeletal tumor statistics
- Submit data requests with research protocol justification
- Access approved de-identified datasets with time-limited permissions
- Collaboration tools for multi-center studies
- Cannot access identifiable patient information

### Data Access Levels
- **Level 1 (Public):** Aggregate musculoskeletal tumor statistics, no identifying information
- **Level 2 (Research):** De-identified data with tumor characteristics, treatments, outcomes
- **Level 3 (Clinical):** Limited re-identification for IRB-approved clinical outcome studies
- **Level 4 (Administrative):** Full access with complete patient identifiers (center-level only)

---

## Functional Requirements

### User Management & Access Control

**Account Management:**
- FR1: Subspecialists can create accounts with Indonesian Orthopedic Association verification and role assignment
- FR2: National registry administrators can manage user roles across all 21 centers
- FR3: Center administrators can create and manage orthopedic department user accounts
- FR4: Users can update profile information including subspecialty focus and training background
- FR5: System maintains comprehensive audit logs of all user access and clinical data operations

**Authentication & Security:**
- FR6: Users can log in securely with optional multi-factor authentication
- FR7: System maintains secure sessions with 30-minute timeout for inactive sessions
- FR8: Users can reset passwords via secure email or SMS verification
- FR9: System implements role-based access control with musculoskeletal subspecialty permissions
- FR10: System supports single sign-on integration with hospital information systems

### Musculoskeletal Data Entry & Collection

**10-Section Registry Form:**

**Section 1 - Center & Pathology Type:**
- FR11: System provides dropdown of 21 designated musculoskeletal centers
- FR12: Users select pathology type: Bone Tumor / Soft Tissue Tumor / Bone Metastasis / Tumor-like Lesion
- FR13: System captures subspecialist name, resident (PPDS) name, and entry date

**Section 2 - Patient Identity:**
- FR14: System captures comprehensive patient demographics: Name, Medical Record Number, NIK, DOB, Sex
- FR15: System provides hierarchical address entry: Province > Regency > District > Village > Detailed address
- FR16: System captures patient and family contact information with validation

**Section 3 - Clinical Data:**
- FR17: System provides structured anamnesis form: Chief complaint, Comorbidities, Cancer history, Family cancer history
- FR18: System captures complete physical examination by body system
- FR19: System calculates BMI automatically from weight and height
- FR20: System provides Karnofsky Performance Score dropdown (0-100 in 10-point increments)
- FR21: System provides pain scale assessment (0-10 visual analog scale)
- FR22: Users can upload multiple clinical photos with anatomical location tagging

**Section 4 - Diagnostic Investigations:**
- FR23: System provides laboratory result entry fields (CBC, ALP, LDH, Ca, Phosphate, tumor markers)
- FR24: System captures radiology findings: X-ray, MRI, CT, Bone Scan, PET-CT
- FR25: System calculates Mirrel Score automatically for pathological fracture risk
- FR26: System provides pathology report entry: FNAB, Core biopsy, Open biopsy, Immunohistochemistry
- FR27: System provides HUVOS grade dropdown for chemotherapy response (I/II/III/IV)

**Section 5 - Diagnosis & Location:**
- FR28: System provides WHO-based bone tumor classification tree (conditional on pathology type)
- FR29: System provides WHO-based soft tissue tumor classification tree (conditional on pathology type)
- FR30: System provides hierarchical bone location picker: Upper/Lower extremity/Axial > Specific bone > Proximal/Midshaft/Distal
- FR31: System provides soft tissue location picker with anatomical regions
- FR32: System captures tumor side: Right/Left/Midline
- FR33: System provides tumor syndrome checklist (Li-Fraumeni, NF1, Ollier, Maffucci, etc.)

**Section 6 - Staging:**
- FR34: System provides Enneking staging dropdown: IA/IB/IIA/IIB/III
- FR35: System provides AJCC staging dropdown: IA/IB/IIA/IIB/III/IVA/IVB
- FR36: System provides tumor grade dropdown: Benign/Grade 1/Grade 2/Grade 3/Grade X
- FR37: System captures tumor size in greatest dimension with categorical breakdown
- FR38: System captures tumor depth: Superficial/Deep
- FR39: System captures metastasis status at diagnosis: Lung/Other/None

**Section 7 - CPC (Cancer Patient Conference):**
- FR40: System captures CPC date, attending consultants, and treatment decision

**Section 8 - Treatment Management:**
- FR41: System captures treatment intention: Curative/Palliative
- FR42: System provides chemotherapy tracking: Neo-adjuvant/Adjuvant with regimen, cycles, dates
- FR43: System captures surgical details: Limb salvage vs ablation, Margin type, Reconstruction method
- FR44: System captures operative details: Duration, Blood loss, Complications
- FR45: System provides radiotherapy tracking: Neo-adjuvant/Adjuvant with dose and fractions
- FR46: System captures final surgical margins: Wide R0/Marginal R0/R1/R2/Intralesional

**Section 9 - Follow-up Management:**
- FR47: System implements 14-visit follow-up structure over 5 years
- FR48: System calculates MSTS Score at each follow-up visit (0-30 points)
- FR49: System tracks recurrence, metastasis, and complications at each visit
- FR50: System provides automated follow-up reminders based on schedule

**Section 10 - Review & Submission:**
- FR51: System displays comprehensive summary of all entered data for review
- FR52: System validates completeness of mandatory fields before submission
- FR53: System supports draft saving with auto-save every 2 minutes
- FR54: System provides data quality score upon submission

### Quality Assurance

**Data Validation:**
- FR55: System validates WHO classification selections against latest taxonomy
- FR56: System cross-validates staging, grade, and tumor type consistency
- FR57: System flags unusual values for subspecialist review (e.g., rare tumor types)
- FR58: System requires mandatory review for Grade 3 malignant tumors
- FR59: System maintains complete data provenance with change history

**Quality Dashboards:**
- FR60: System provides center-level data quality scorecards
- FR61: System tracks data completeness by required field groups
- FR62: System identifies missing follow-up visits and compliance gaps
- FR63: System provides quality improvement recommendations

### Research Access & Discovery

**Musculoskeletal Tumor Data Discovery:**
- FR64: Researchers can browse aggregate bone and soft tissue tumor statistics without approval
- FR65: System provides geographic visualization of tumor distribution by type and subtype
- FR66: Researchers can filter by tumor classification, location, stage, treatment modality
- FR67: System provides survival curve visualization by tumor type
- FR68: System displays limb salvage rates by center and tumor type

**Data Request Management:**
- FR69: Researchers submit structured research proposals with IRB documentation
- FR70: System routes research requests to relevant center administrators for approval
- FR71: System provides transparent multi-center request coordination
- FR72: System enforces time-limited dataset access (e.g., 1-year research project duration)
- FR73: System tracks data usage and publication outcomes

### Musculoskeletal Analytics & Intelligence

**Real-time Clinical Dashboards:**
- FR74: Subspecialists view real-time tumor type distribution maps (bone vs soft tissue)
- FR75: System provides Enneking staging distribution analytics
- FR76: System displays limb salvage vs amputation rates by tumor type
- FR77: System tracks treatment modality trends (chemotherapy, surgery, radiotherapy combinations)
- FR78: System provides 5-year survival analysis by tumor classification

**Functional Outcome Analytics:**
- FR79: System tracks MSTS Score trends over 5-year follow-up period
- FR80: System provides functional outcome comparison by surgical technique
- FR81: System analyzes reconstruction method effectiveness
- FR82: System tracks complication rates by procedure type

**Reporting & Export:**
- FR83: Users can generate customizable musculoskeletal tumor reports
- FR84: System supports data export in research formats (CSV, SPSS, Stata)
- FR85: System provides automated quarterly center performance reports
- FR86: System generates national musculoskeletal tumor annual reports
- FR87: System maintains report generation audit trail

### System Administration

**21-Center Network Management:**
- FR88: National administrators onboard new centers with verification workflows
- FR89: Center administrators manage local orthopedic department configuration
- FR90: System provides center performance benchmarking across 21 sites
- FR91: System supports hierarchical permission management (National > Center > User)
- FR92: System provides tools for historical case data migration

**Configuration & Maintenance:**
- FR93: System administrators configure WHO classification updates
- FR94: System provides medical-grade backup with 7-year retention
- FR95: System maintains comprehensive operational and clinical audit logs
- FR96: System supports automated updates with zero-downtime deployment
- FR97: System provides disaster recovery with <4 hour RTO (Recovery Time Objective)

---

## Security Requirements

### Data Protection
- **Encryption:** AES-256 encryption for data at rest and TLS 1.3 for data in transit
- **Anonymization:** Multi-tier de-identification with reversible pseudonymization for approved research
- **Access Control:** Role-based permissions with orthopedic subspecialty-specific attributes
- **Audit Trails:** Immutable audit logs for all clinical data access and modifications
- **Data Retention:** 7-year minimum retention per Indonesian medical-legal requirements

### Privacy Compliance
- **Patient Privacy:** HIPAA-equivalent privacy protection standards
- **Research Ethics:** IRB approval verification and compliance tracking
- **Consent Management:** Patient consent tracking for research participation
- **Data Minimization:** Collect only essential musculoskeletal tumor registry data
- **Breach Notification:** Automated breach detection and 72-hour notification procedures

---

## Scalability Requirements

### Performance Targets
- **Response Time:** <2 seconds for standard dashboard queries
- **Concurrent Users:** Support 500+ concurrent users across 21 centers
- **Data Volume:** Handle growth to 50,000+ musculoskeletal tumor cases over 5 years
- **Geographic Distribution:** Low-latency access from all Indonesian provinces
- **Availability:** 99.9% uptime (43 minutes downtime/month maximum)

### Architecture Scalability
- **Horizontal Scaling:** Support for database read replicas and application server clustering
- **Geographic Distribution:** Regional caching for improved center access speeds
- **Load Balancing:** Intelligent distribution across application servers
- **Database Optimization:** Optimized indexing for complex WHO classification queries
- **Image Storage:** Scalable object storage for clinical photos and radiology images

---

## Integration Requirements

### Healthcare System Integration
- **Hospital Information Systems:** HL7 integration with hospital RIS/PACS for radiology
- **Medical Standards:** Support for DICOM for radiological images
- **Authentication Integration:** SSO with hospital Active Directory systems
- **Pathology Systems:** Integration with anatomical pathology information systems
- **Laboratory Systems:** Import lab results from LIS systems

### Research Tool Integration
- **Statistical Software:** Data export formats for R, Python, SPSS, Stata
- **International Registries:** API integration with ISOLS (International Society of Limb Salvage)
- **Collaboration Platforms:** Support for multi-center research coordination
- **Publication Systems:** DOI integration for dataset citation
- **Orthopedic Societies:** Integration with Indonesian Orthopedic Association systems

---

## PRD Summary

**Total Functional Requirements:** 97 comprehensive requirements covering:
- User Management & Access Control (10 FRs)
- Musculoskeletal Data Entry (10-section form, 44 FRs)
- Quality Assurance (9 FRs)
- Research Access & Discovery (10 FRs)
- Musculoskeletal Analytics (14 FRs)
- System Administration (10 FRs)

**Specialized Musculoskeletal Focus:**
- WHO Classification of Bone and Soft Tissue Tumors integration
- 21 designated national musculoskeletal tumor centers
- 14-visit longitudinal follow-up over 5 years
- MSTS, Enneking, AJCC, Mirrel specialized scoring systems
- Limb salvage vs amputation outcome tracking

**Non-Functional Requirements:** Comprehensive security, scalability, performance, and integration requirements specific to orthopedic oncology subspecialty.

**Implementation Readiness:** PRD provides complete capability contract for UX designers, architects, and development teams to implement Indonesia's first comprehensive musculoskeletal tumor registry with full healthcare compliance and research-focused functionality.

---

**Transformation Notes:**
- **Version 2.0:** Complete transformation from general cancer registry to specialized musculoskeletal tumor registry
- **Date:** 2025-12-11 - Major pivot based on Indonesian Musculoskeletal Tumor Registry (INAM-TURY) form requirements
- **Scope Change:** From generic cancer database to orthopedic oncology subspecialty registry
- **Classification:** WHO 5th Edition Bone and Soft Tissue Tumor taxonomy
- **Network:** 21 designated national referral centers for musculoskeletal tumors

---

**Next Steps:**
1. Architecture transformation for musculoskeletal-specific database schema
2. UX Design for 10-section specialized data entry form
3. Epic and Story rewrite for musculoskeletal registry implementation
4. WHO Classification taxonomy integration
5. 21-center network seeding and configuration
