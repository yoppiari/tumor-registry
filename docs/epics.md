# Epics: INAMSOS - Indonesian Musculoskeletal Tumor Registry

**Date:** 2025-12-11
**Project:** Musculoskeletal Tumor Registry for Indonesian Orthopedic Oncology
**Version:** 2.0 (Transformed)
**Total Requirements:** 50+ Functional Requirements organized into 6 Epics

---

## Epic Overview

This document organizes all functional requirements for the INAMSOS Musculoskeletal Tumor Registry into 6 logical epics that align with orthopedic oncology workflows, musculoskeletal data collection, and implementation phases. Each epic includes comprehensive user stories with acceptance criteria written in BDD format.

### Epic Mapping Summary:
- **Epic 1: User Management & Security** - 10 requirements (FR1-10)
- **Epic 2: Musculoskeletal Data Entry & Quality Assurance** - 10 requirements (FR11-20)
- **Epic 3: Research Discovery & Collaboration** - 5 requirements (FR21-25)
- **Epic 4: Research Request Management** - 7 requirements (FR26-32)
- **Epic 5: Analytics & Intelligence** - 9 requirements (FR33-41)
- **Epic 6: Reporting & Administration** - 15 requirements (FR42-56)

---

## Epic 1: User Management & Security

**Epic Goal:** Establish secure, role-based access control system that supports orthopedic oncology subspecialty verification and multi-center architecture while maintaining HIPAA-level compliance across 21 designated musculoskeletal tumor centers.

**Business Value:** Foundation for trust and security in national musculoskeletal tumor database, enabling proper data governance and audit compliance across all orthopedic oncology centers.

**User Roles Involved:** Data Entry Staff, Orthopedic Oncologists, PPDS Orthopedi (Residents), Center Administrators, National Stakeholders, System Administrators

**Functional Requirements:** FR1-10

### User Stories:

**Story 1.1: User Account Creation**
```
As an Orthopedic Oncology Subspecialist
I want to create a secure account with orthopedic subspecialty verification
So that I can access INAMSOS with appropriate permissions for musculoskeletal tumor management

Acceptance Criteria:
- User can register with orthopedic subspecialty verification (Kolegium Orthopedi Indonesia)
- Subspecialty roles: Orthopedic Oncologist, PPDS Orthopedi (Resident), Data Entry Staff
- System assigns initial role based on subspecialty status and center affiliation
- Email verification required before account activation
- Multi-factor authentication setup prompted during registration
- Welcome notification with role-specific guidance for musculoskeletal data entry
```

**Story 1.2: Role-Based Access Control**
```
As a System Administrator
I want to manage user roles and permissions across 21 designated centers
So that musculoskeletal tumor data access follows proper governance and compliance

Acceptance Criteria:
- Administrator can view all user accounts across 21 musculoskeletal centers
- Role modification requires confirmation and audit logging
- Permission inheritance works hierarchically (National > Center > User)
- Role changes take effect immediately with session refresh
- Permission matrix follows healthcare compliance standards
- Orthopedic-specific roles: Orthopedic Oncologist, PPDS Orthopedi, Radiologist, Pathologist
```

**Story 1.3: Secure Authentication**
```
As a User
I want to log in securely with multiple authentication options
So that my account and patient musculoskeletal tumor data remain protected

Acceptance Criteria:
- Support for password, SSO, and social authentication
- Multi-factor authentication available and configurable per role
- Session timeout based on role sensitivity (admin: 30min, staff: 2hrs)
- Failed login attempts trigger security alerts and temporary locks
- Login history available for user review
```

**Story 1.4: Center User Management**
```
As a Center Administrator
I want to create and manage user accounts within my musculoskeletal center
So that our orthopedic staff can access INAMSOS with appropriate local permissions

Acceptance Criteria:
- Can create accounts for Data Entry Staff, Orthopedic Oncologists, PPDS Orthopedi, and local admins
- User creation validates orthopedic subspecialty membership and center affiliation
- Bulk user import capability with CSV template for large centers
- User suspension and reactivation available
- Local user management doesn't affect national-level permissions
```

**Story 1.5: Profile Management**
```
As a User
I want to update my profile information and musculoskeletal subspecialty preferences
So that my account information stays current and I can customize my orthopedic oncology experience

Acceptance Criteria:
- Profile fields include name, contact, orthopedic subspecialties, and preferences
- Avatar upload with automatic resizing and validation
- Notification preferences for different alert types
- Language preference (Indonesia/English) selection
- Musculoskeletal tumor type interests for personalized content
- Profile changes require re-authentication for security
```

**Story 1.6: Audit Trail Management**
```
As a Compliance Officer
I want comprehensive audit logs of all user access and musculoskeletal data operations
So that we maintain healthcare compliance and data governance

Acceptance Criteria:
- All login/logout events logged with timestamp and IP address
- Data access events record what musculoskeletal tumor data was viewed/modified
- Permission changes logged with administrator details
- Audit logs immutable and exportable for compliance reviews
- Real-time alerts for suspicious access patterns
```

**Story 1.7: Single Sign-On Integration**
```
As a Hospital IT Administrator
I want INAMSOS to integrate with existing hospital authentication systems
So that orthopedic staff can use familiar credentials and streamline access management

Acceptance Criteria:
- SAML 2.0 and OpenID Connect support for hospital SSO systems
- Automatic user provisioning from hospital directory services
- Seamless logout synchronization across systems
- Fallback local authentication available during SSO outages
- SSO configuration manageable by center administrators
```

**Story 1.8: Password Policy Management**
```
As a System Administrator
I want to configure and enforce password policies across the system
So that we maintain strong security standards and compliance

Acceptance Criteria:
- Configurable password complexity rules (length, character types, patterns)
- Password history tracking to prevent reuse of recent passwords
- Account lockout policies after failed attempts
- Password expiration notifications and forced resets
- Customizable password policies by role or security level
- Compliance with healthcare password standards (NIST, HIPAA)
```

**Story 1.9: Session Management Across Devices**
```
As a User
I want to manage my active sessions across multiple devices
So that I can maintain security and control over my account access

Acceptance Criteria:
- View all active sessions with device details and locations
- Terminate specific sessions remotely
- Session timeout configuration by role sensitivity
- Concurrent session limits per user
- Device fingerprinting for anomaly detection
- Real-time alerts for suspicious session activities
```

**Story 1.10: Advanced Security Monitoring**
```
As a Security Officer
I want comprehensive security monitoring and threat detection
So that I can proactively identify and respond to security threats

Acceptance Criteria:
- Real-time threat detection using AI/ML algorithms
- Behavioral analytics for anomaly identification
- Security incident logging and workflow management
- Automated response protocols for common threats
- Integration with national cybersecurity frameworks
- Regular security assessment reports and recommendations
```

---

## Epic 2: Musculoskeletal Data Entry & Quality Assurance

**Epic Goal:** Provide intuitive, structured 10-section data entry interface for comprehensive musculoskeletal tumor documentation that ensures high-quality medical data through WHO classification integration, conditional rendering, and automated quality validation.

**Business Value:** Enable accurate, complete musculoskeletal tumor data collection from all 21 designated centers with standardized bone and soft tissue tumor classification while maintaining medical data quality standards.

**User Roles Involved:** Data Entry Staff, Orthopedic Oncologists, PPDS Orthopedi, Center Administrators, Medical Reviewers

**Functional Requirements:** FR11-20

### User Stories:

**Story 2.1: Section 1 - Center & Pathology Type Selection**
```
As an Orthopedic Oncologist
I want to select my center and classify the pathology type
So that the form adapts to show relevant fields for bone tumors vs soft tissue tumors

Acceptance Criteria:
- Dropdown of 21 designated musculoskeletal centers across Indonesia
- Pathology type selection: Bone Tumor / Soft Tissue Tumor / Bone Metastasis / Tumor-like Lesion
- Subspecialist name (Orthopedic Oncologist) field with autocomplete
- PPDS name (Resident) field with optional entry
- Entry date auto-populated with current date (editable if backdating)
- Form sections 5+ conditionally render based on pathology type selection
- Clear visual indicator of selected pathology type throughout form
```

**Story 2.2: Section 2 - Patient Identity & Demographics**
```
As a Data Entry Staff
I want to capture comprehensive patient demographics
So that we have complete patient identification and contact information

Acceptance Criteria:
- Full name field with proper name formatting validation
- Medical Record Number (MRN) with center-specific format validation
- NIK (National Identity Number) with 16-digit validation
- Date of birth field with age auto-calculation (years and months)
- Sex selection (Male/Female) with radio buttons
- Hierarchical address system:
  - Province dropdown (34 provinces of Indonesia)
  - Regency/City dropdown (populated based on province)
  - District dropdown (populated based on regency)
  - Village/Subdistrict dropdown (populated based on district)
  - Detailed address text field
- Patient contact: Phone number, mobile number, email with format validation
- Family contact: Name, relationship, phone number for emergency contact
- Auto-save every 2 minutes to prevent data loss
```

**Story 2.3: Section 3 - Clinical Data & Anamnesis**
```
As an Orthopedic Oncologist
I want to document clinical history and physical examination
So that we capture complete musculoskeletal assessment data

Acceptance Criteria:
- Structured anamnesis:
  - Chief complaint (free text with common templates)
  - Duration of symptoms (months/weeks input with calendar picker)
  - Symptom progression (worsening/stable/improving radio buttons)
- Comorbidities checklist:
  - Diabetes Mellitus, Hypertension, Heart Disease, Kidney Disease, Lung Disease
  - Previous cancer history (Yes/No with details if Yes)
- Cancer history:
  - Personal cancer history (Yes/No with type and year)
  - Family cancer history (Yes/No with relationship and type)
- Physical examination:
  - General condition assessment
  - Local examination findings (swelling, mass, deformity, neurovascular status)
- Karnofsky Performance Score dropdown (0-100 in 10-point increments)
- Pain scale (0-10 VAS) with visual slider and numeric input
- Weight (kg) and height (cm) fields with BMI auto-calculation and BMI category display
- Clinical photo upload:
  - Multiple image upload capability (drag-and-drop interface)
  - Anatomical location tagging for each photo
  - Image preview and rotation tools
  - JPEG/PNG format support with automatic compression
```

**Story 2.4: Section 4 - Diagnostic Investigations**
```
As an Orthopedic Oncologist
I want to enter all diagnostic test results
So that we have comprehensive workup data for musculoskeletal tumor analysis

Acceptance Criteria:
- Laboratory panel:
  - Complete Blood Count: Hemoglobin (g/dL), Leukocyte (10³/µL), Platelet (10³/µL)
  - Alkaline Phosphatase (ALP) (U/L)
  - Lactate Dehydrogenase (LDH) (U/L)
  - Calcium (Ca) (mg/dL)
  - Phosphate (mg/dL)
- Tumor markers:
  - AFP, CEA, CA 19-9, PSA with units and reference ranges
  - Free text field for additional markers
- Radiology findings:
  - X-ray: Date, findings (free text), images upload
  - MRI: Date, findings, images upload, tumor size measurement (cm)
  - CT Scan: Date, findings, images upload
  - Bone Scan: Date, findings, images upload
  - PET-CT: Date, findings, images upload, SUV max value
- Mirels Score calculator (for bone metastasis):
  - Auto-calculated from: Site (upper/lower limb), Pain (mild/moderate/functional), Lesion type (blastic/mixed/lytic), Size (<1/3, 1/3-2/3, >2/3 cortex)
  - Score display: 1-12 with risk interpretation
- Pathology results:
  - FNAB (Fine Needle Aspiration Biopsy): Date, result, adequacy
  - Core biopsy: Date, result
  - Open biopsy: Date, result
- Immunohistochemistry (IHK) results:
  - Multiple marker entry with positive/negative/percentage
  - Common markers: CD99, Desmin, S100, Ki67, etc.
- HUVOS grade dropdown (Grade I / Grade II / Grade III / Grade IV) for chemotherapy response
```

**Story 2.5: Section 5 - Diagnosis & WHO Classification**
```
As an Orthopedic Oncologist
I want to select diagnosis from WHO Classification of Musculoskeletal Tumors
So that we maintain standardized tumor classification

Acceptance Criteria:
- CONDITIONAL RENDERING based on pathology type from Section 1
- If Bone Tumor → WHO Bone Tumor Classification tree picker:
  - Categories: Osteogenic tumors, Chondrogenic tumors, Fibrogenic tumors, Vascular tumors, Osteoclastic giant cell-rich tumors, Notochordal tumors, Other mesenchymal tumors, Hematopoietic neoplasms, Undifferentiated small round cell sarcomas
  - Subcategories and specific diagnoses with ICD-O-3 codes
  - Examples: Osteosarcoma (conventional, telangiectatic, small cell), Ewing sarcoma, Giant cell tumor of bone, Chondrosarcoma
- If Soft Tissue Tumor → WHO Soft Tissue Tumor Classification tree picker:
  - Categories: Adipocytic tumors, Fibroblastic/myofibroblastic tumors, So-called fibrohistiocytic tumors, Smooth muscle tumors, Pericytic (perivascular) tumors, Skeletal muscle tumors, Vascular tumors, Chondro-osseous tumors, Gastrointestinal stromal tumors, Nerve sheath tumors, Tumors of uncertain differentiation
  - Subcategories and specific diagnoses with ICD-O-3 codes
  - Examples: Liposarcoma, Leiomyosarcoma, Rhabdomyosarcoma, Synovial sarcoma, MPNST
- Hierarchical bone location picker (for bone tumors):
  - Level 1: Upper Extremity / Lower Extremity / Axial Skeleton
  - Level 2: Specific bone (Femur, Tibia, Humerus, Radius, Ulna, Fibula, Pelvis, Spine, Ribs, Scapula, Clavicle)
  - Level 3: Longitudinal segment (Proximal / Midshaft / Distal)
  - Anatomical diagram for visual selection
- Soft tissue location picker (for soft tissue tumors):
  - Upper extremity regions: Shoulder, Arm, Forearm, Hand
  - Lower extremity regions: Hip/Buttock, Thigh, Leg, Foot
  - Trunk regions: Chest wall, Abdominal wall, Retroperitoneum, Pelvis
- Tumor side: Right / Left / Midline / Bilateral (radio buttons)
- Tumor syndrome checklist:
  - Li-Fraumeni syndrome (p53 mutation)
  - Neurofibromatosis type 1 (NF1)
  - Ollier disease
  - Maffucci syndrome
  - Multiple hereditary exostoses
  - Retinoblastoma survivors
  - Paget disease of bone
  - Other (specify)
```

**Story 2.6: Section 6 - Staging & Grading**
```
As an Orthopedic Oncologist
I want to document tumor staging and grading
So that we track disease extent and prognostic factors

Acceptance Criteria:
- Enneking staging system dropdown:
  - Stage IA (Low grade, intracompartmental)
  - Stage IB (Low grade, extracompartmental)
  - Stage IIA (High grade, intracompartmental)
  - Stage IIB (High grade, extracompartmental)
  - Stage III (Any grade with metastasis)
- AJCC TNM staging system (8th edition):
  - Stage IA / IB / II / IIIA / IIIB / IVA / IVB
  - T, N, M component entry with dropdown selections
- Tumor grade dropdown:
  - Benign (Grade 0)
  - Grade 1 (Well differentiated)
  - Grade 2 (Moderately differentiated)
  - Grade 3 (Poorly differentiated)
  - Grade X (Cannot be assessed)
- Tumor size in greatest dimension:
  - Numeric input in centimeters (cm) with decimal precision
  - Categorical breakdown: ≤5 cm / >5-10 cm / >10-15 cm / >15 cm
  - Auto-calculated from imaging if available
- Tumor depth dropdown:
  - Superficial (above superficial fascia)
  - Deep (below superficial fascia)
- Metastasis status at diagnosis:
  - None (M0)
  - Lung metastasis (M1a) with number and size
  - Other distant sites (M1b) with location specification
  - Skip metastasis (M1c for bone sarcoma)
- Lymph node involvement:
  - N0 (No regional lymph node metastasis)
  - N1 (Regional lymph node metastasis)
  - Number of involved nodes
```

**Story 2.7: Section 7 - CPC (Cancer Patient Conference) Documentation**
```
As an Orthopedic Oncologist
I want to document Cancer Patient Conference decisions
So that multidisciplinary treatment plans are recorded

Acceptance Criteria:
- CPC date selector with calendar picker
- Attending consultants multi-select checklist:
  - Orthopedic Oncologist (required)
  - Medical Oncologist
  - Radiation Oncologist
  - Radiologist
  - Pathologist
  - Pediatric Oncologist (if pediatric case)
  - Other specialists (specify)
- Treatment decision documentation:
  - Rich text editor with formatting options
  - Template insertion for common decisions
  - Copy/paste from previous CPC notes
- Consensus recommendations capture:
  - Treatment intention (Curative / Palliative)
  - Recommended treatment modalities (Surgery / Chemotherapy / Radiotherapy / Combined)
  - Referral recommendations if needed
- CPC outcome status:
  - Consensus reached
  - Further evaluation needed
  - Second opinion requested
```

**Story 2.8: Section 8 - Treatment Management**
```
As an Orthopedic Oncologist
I want to document complete treatment details
So that we can analyze treatment outcomes and limb salvage rates

Acceptance Criteria:
- Treatment intention radio buttons:
  - Curative (aim for disease elimination)
  - Palliative (symptom control and quality of life)
- Systemic therapy documentation:
  - Neo-adjuvant chemotherapy:
    - Yes/No toggle
    - If Yes: Regimen name (dropdown with common protocols + free text)
    - Number of cycles completed
    - Start and end dates
    - Response assessment (complete/partial/stable/progression)
  - Adjuvant chemotherapy:
    - Yes/No toggle
    - If Yes: Regimen name, cycles, dates, completion status
  - Targeted therapy:
    - Agent name, dosage, start date, ongoing status
- Surgical management:
  - Surgery type dropdown:
    - Limb Salvage Surgery (wide excision with reconstruction)
    - Limb Ablation: Amputation (through bone) / Disarticulation (through joint)
    - Curettage (intralesional surgery for benign/low-grade tumors)
    - No surgery performed
  - Surgery date with calendar picker
  - Margin type achieved dropdown:
    - Wide margin (2-3 cm healthy tissue)
    - Marginal margin (<2 cm healthy tissue)
    - Intralesional (tumor contamination)
    - Radical (entire compartment removed)
  - Margin status (pathological assessment):
    - Wide R0 (negative margins, wide)
    - Marginal R0 (negative margins, marginal)
    - R1 (microscopic positive margins)
    - R2 (macroscopic positive margins)
    - Intralesional (tumor spillage)
  - Reconstruction method (multi-select for limb salvage):
    - Bone reconstruction: Allograft / Autograft / Prosthesis (endoprosthesis) / None
    - Joint reconstruction: Total joint replacement / Arthrodesis / Rotationplasty
    - Soft tissue reconstruction: Local flap / Free flap / Primary closure
  - Operative details:
    - Surgical duration (hours:minutes)
    - Estimated blood loss (mL)
    - Transfusion required (Yes/No with units)
    - Intraoperative complications (free text)
- Radiotherapy documentation:
  - Neo-adjuvant radiotherapy:
    - Yes/No toggle
    - If Yes: Total dose (Gy), Number of fractions, Start and end dates
  - Adjuvant radiotherapy:
    - Yes/No toggle
    - If Yes: Total dose (Gy), Number of fractions, Start and end dates, Completion status
  - Technique: EBRT / IMRT / Brachytherapy / Other (specify)
```

**Story 2.9: Section 9 - Follow-up Management**
```
As an Orthopedic Oncologist
I want to schedule and track 14 follow-up visits over 5 years
So that we monitor outcomes, functional results, and detect recurrence

Acceptance Criteria:
- Automatic 14-visit schedule generation upon treatment completion:
  - Year 1-2: Every 3 months (8 visits: 3, 6, 9, 12, 15, 18, 21, 24 months)
  - Year 3-5: Every 6 months (6 visits: 30, 36, 42, 48, 54, 60 months)
  - Visual timeline display with completed/upcoming visits
- MSTS (Musculoskeletal Tumor Society) Score calculator at each visit:
  - 6 domains scored 0-5 each (total 0-30):
    1. Pain (0=severe, 5=no pain)
    2. Function (0=no function, 5=complete function)
    3. Emotional acceptance (0=poor, 5=enthusiastic)
    4. Supports (0=unable, 5=no supports needed)
    5. Walking (0=unable, 5=normal gait)
    6. Gait (0=major handicap, 5=normal gait)
  - Auto-calculated total score (0-30)
  - Percentage calculation (score/30 × 100%)
  - Score trend visualization across visits
- Recurrence detection:
  - Status: None / Local recurrence / Distant metastasis / Both
  - If Local: Date detected, location, size, treatment plan
  - If Distant: Location (Lung/Bone/Other), date detected, number of lesions
- Metastasis tracking:
  - New metastasis location with date of detection
  - Treatment initiated (Yes/No with details)
- Complication documentation:
  - Surgical complications: Infection, wound dehiscence, hardware failure
  - Systemic complications: Chemotherapy toxicity, radiation effects
  - Functional complications: Limb length discrepancy, joint stiffness
  - Date of complication and management
- Quality of life assessment:
  - EQ-5D-5L questionnaire integration
  - Patient satisfaction score (0-10)
- Automated reminder system:
  - Email/SMS reminders 7 days before scheduled visit
  - Overdue visit alerts to clinic staff
  - Rescheduling capability with automatic timeline adjustment
```

**Story 2.10: Section 10 - Review & Submit**
```
As a Data Entry Staff
I want to review all entered data before submission
So that I can verify accuracy and completeness

Acceptance Criteria:
- Comprehensive summary display of all 9 sections:
  - Section 1: Center and pathology type
  - Section 2: Patient demographics
  - Section 3: Clinical data and anamnesis
  - Section 4: Diagnostic investigations
  - Section 5: WHO diagnosis and location
  - Section 6: Staging and grading
  - Section 7: CPC documentation
  - Section 8: Treatment details
  - Section 9: Follow-up schedule
- Section-by-section review with "Edit" button for each section
- Mandatory field validation checklist:
  - Red indicator for missing mandatory fields
  - Yellow indicator for recommended fields
  - Green checkmark for complete sections
- Data quality score display (0-100%):
  - Based on completeness, consistency, and validation rules
  - Detailed breakdown by section
  - Improvement suggestions for low scores
- Draft save capability:
  - Manual "Save Draft" button
  - Auto-save every 2 minutes (with timestamp display)
  - Draft list for incomplete entries
- Final submission workflow:
  - "Submit for Review" button (if review enabled)
  - "Final Submit" button with confirmation dialog
  - Confirmation message: "You are about to submit patient [NAME] data. This action cannot be undone. Are you sure?"
- Data completeness warnings (non-blocking):
  - List of incomplete optional fields
  - Option to proceed with submission or continue editing
- Post-submission confirmation:
  - Success message with unique submission ID
  - PDF export of submitted data
  - Option to create follow-up entries immediately
```

---

## Epic 3: Research Discovery & Collaboration

**Epic Goal:** Enable researchers to discover musculoskeletal tumor patterns, collaborate with orthopedic oncology experts, and access aggregate data through intuitive geographic visualization and WHO classification filtering capabilities.

**Business Value:** Accelerate musculoskeletal tumor research by providing easy access to national bone and soft tissue tumor data patterns while maintaining patient privacy and enabling multi-center orthopedic collaboration.

**User Roles Involved:** Researchers, Data Scientists, Orthopedic Oncologists, Academic Collaborators

**Functional Requirements:** FR21-25

### User Stories:

**Story 3.1: Aggregate Musculoskeletal Data Browsing**
```
As a Researcher
I want to browse aggregate musculoskeletal tumor statistics without special approval
So that I can explore research questions and identify potential study areas in orthopedic oncology

Acceptance Criteria:
- Public access to anonymized aggregate musculoskeletal tumor statistics
- Interactive charts and graphs for tumor type distributions (bone vs soft tissue)
- Demographic breakdowns (age, gender, geographic regions)
- Time-based trend analysis for musculoskeletal tumor incidence patterns
- WHO classification-based distribution visualizations
- Enneking staging distribution by tumor type
- Limb salvage vs amputation rate trends over time
- Download capability for aggregate datasets with proper citations
- Research methodology documentation and data quality indicators
```

**Story 3.2: Geographic Musculoskeletal Tumor Visualization**
```
As a Researcher
I want interactive geographic visualization of musculoskeletal tumor distribution patterns
So that I can identify regional variations in bone and soft tissue tumors

Acceptance Criteria:
- Interactive Indonesia map with province and district level granularity
- Heat map visualization for bone tumor vs soft tissue tumor densities
- Layer toggling for:
  - All musculoskeletal tumors
  - Bone tumors only (with subcategories: osteosarcoma, Ewing sarcoma, chondrosarcoma, etc.)
  - Soft tissue tumors only (with subcategories: liposarcoma, synovial sarcoma, etc.)
  - Benign vs malignant distribution
- Geographic clustering analysis and pattern detection
- Center location overlay showing 21 designated musculoskeletal centers
- Comparison tools between regions and time periods
- Export capabilities for geographic data (GIS formats)
```

**Story 3.3: Advanced Musculoskeletal Tumor Search**
```
As a Researcher
I want to search and filter data by musculoskeletal-specific criteria
So that I can find specific datasets for orthopedic oncology research needs

Acceptance Criteria:
- Multi-criteria search with filters:
  - Tumor type: Bone tumor / Soft tissue tumor / Tumor-like lesion
  - WHO classification tree navigation for specific diagnoses
  - Enneking staging (IA, IB, IIA, IIB, III)
  - AJCC TNM staging
  - Tumor location: Anatomical region and specific bone/soft tissue site
  - Demographics: Age range, gender, geographic region
  - Treatment modality: Limb salvage / Amputation / Chemotherapy / Radiotherapy
  - Outcome: Local recurrence / Metastasis / Survival status
- Boolean logic support for complex query building
- Saved search functionality with alert notifications
- Search history and query refinement suggestions
- Faceted navigation with result counts for each filter
- Export search results in multiple research formats (CSV, SPSS, Stata)
```

**Story 3.4: Orthopedic Research Collaboration Tools**
```
As a Researcher
I want collaboration tools and orthopedic oncology expert matching capabilities
So that I can form research teams and find relevant musculoskeletal tumor expertise

Acceptance Criteria:
- Researcher profile system with orthopedic subspecialty and publication history
- Expert recommendation algorithm based on musculoskeletal research interests
- Project workspace creation with team management tools
- Shared annotation and commenting capabilities for datasets
- Research milestone tracking and deadline management
- Integration with academic collaboration platforms
- Multi-center study coordination with standardized protocols
```

**Story 3.5: Musculoskeletal Research Planning Support**
```
As a Researcher
I want data quality metrics and availability information for research planning
So that I can assess feasibility and design appropriate musculoskeletal tumor studies

Acceptance Criteria:
- Data availability indicators by:
  - Tumor type (bone vs soft tissue)
  - WHO classification category
  - Geographic region and center
  - Time period (year range)
- Quality scores and completeness metrics for potential datasets
- Sample size calculations with confidence intervals
- Similar research study database for methodology reference
- Feasibility assessment tools with power analysis
- Limb salvage rate analytics by tumor type and stage
- MSTS functional outcome data availability
- 5-year survival data completeness by diagnosis
- Research protocol template integration with INAMSOS data capabilities
```

---

## Epic 4: Research Request Management

**Epic Goal:** Implement secure, transparent workflow for researchers to request detailed musculoskeletal tumor data access while ensuring proper oversight, compliance checking, and time-limited access controls with orthopedic oncology ethics review.

**Business Value:** Enable responsible research access to detailed musculoskeletal tumor data while maintaining patient privacy, ethics compliance, and proper audit trails across 21 designated centers.

**User Roles Involved:** Researchers, Center Administrators, Ethics Reviewers, Orthopedic Oncologists, National Stakeholders

**Functional Requirements:** FR26-32

### User Stories:

**Story 4.1: Structured Musculoskeletal Data Request**
```
As a Researcher
I want to submit structured data requests with orthopedic oncology research justification
So that I can access detailed musculoskeletal tumor datasets needed for my research

Acceptance Criteria:
- Guided request builder with step-by-step form completion
- Research protocol upload and description requirements
- Specific dataset selection with musculoskeletal-specific filters:
  - WHO classification selection
  - Staging and grading criteria
  - Treatment modality filters
  - Follow-up and outcome data requirements
- Justification for each data element requested
- Timeline specification with planned usage duration
- Collaboration partner identification and approval requirements
- Ethics approval documentation upload (IRB/Ethics Committee)
- Request preview and confirmation before submission
```

**Story 4.2: Compliance Checking Integration**
```
As a Center Administrator
I want automated compliance checking for musculoskeletal research requests
So that I can ensure ethical use of patient data and regulatory compliance

Acceptance Criteria:
- Automatic compliance validation against privacy regulations
- IRB approval verification integration
- Patient consent status checking for requested data elements
- Data minimization enforcement (request only necessary data)
- Compliance scoring with risk assessment indicators
- Automated recommendation for approval conditions
- Musculoskeletal data sensitivity assessment (imaging, pathology, genetic data)
```

**Story 4.3: Multi-Level Approval Workflow**
```
As a Center Administrator
I want to review and approve incoming musculoskeletal research requests with clear workflows
So that I can manage data access while protecting patient privacy

Acceptance Criteria:
- Request queue with priority sorting and deadline tracking
- Review dashboard with all relevant request information
- Conditional approval capabilities with data access restrictions
- Request delegation to orthopedic oncology specialists for technical review
- Escalation pathways for complex multi-center requests
- Bulk approval for similar standardized requests
- Approval audit trail with decision rationale documentation
- Integration with ethics committee workflow
```

**Story 4.4: Transparent Status Tracking**
```
As a Researcher
I want transparent status tracking for all my musculoskeletal research requests
So that I can monitor progress and plan my research timeline

Acceptance Criteria:
- Real-time status updates for each request stage:
  - Submitted → Under Review → Ethics Review → Approved/Rejected → Data Preparation → Access Granted
- Estimated completion times based on historical data
- Communication thread for asking questions and clarifications
- Notification system for status changes and additional requirements
- Request history and performance metrics for planning future requests
- Integration with research project management tools
```

**Story 4.5: Time-Limited Access Control**
```
As a System Administrator
I want automatic enforcement of time-limited access for approved musculoskeletal research datasets
So that data access remains secure and compliant with approval conditions

Acceptance Criteria:
- Automatic access revocation when approval period expires
- Renewal workflow with justification for extended access
- Usage monitoring to detect data sharing violations
- Data watermarks for tracking authorized usage
- Immediate revocation capability for policy violations
- Comprehensive access logging for compliance auditing
```

**Story 4.6: Musculoskeletal Data Usage Analytics**
```
As a National Administrator
I want comprehensive analytics on how musculoskeletal research data is being used
So that I can understand research impact and optimize data access policies

Acceptance Criteria:
- Usage metrics tracking (downloads, views, citations, collaborations)
- Research impact assessment with publication and patent tracking
- Data access pattern analysis for policy optimization
- Researcher engagement metrics and satisfaction scores
- Economic impact assessment of data sharing initiatives
- Automated impact reports with ROI analysis
- Top research areas by musculoskeletal tumor type
```

**Story 4.7: Collaborative Multi-Center Research Platform**
```
As a Researcher
I want a collaborative platform for multi-center musculoskeletal tumor studies
So that I can coordinate with multiple orthopedic oncology institutions on large-scale studies

Acceptance Criteria:
- Multi-center study coordination tools with standardized protocols
- Secure data sharing with role-based access per institution
- Centralized study management with milestone tracking
- Communication tools for research teams across 21 designated centers
- Harmonization tools for data from different centers
- Publication collaboration tools with authorship management
- Integrated data pooling with consistent WHO classification
```

---

## Epic 5: Analytics & Intelligence

**Epic Goal:** Provide real-time musculoskeletal tumor intelligence dashboards that enable national stakeholders to monitor bone and soft tissue tumor patterns, identify treatment trends, and make data-driven policy decisions for orthopedic oncology.

**Business Value:** Transform raw musculoskeletal tumor data into actionable intelligence for public health planning, resource allocation, limb salvage program development, and orthopedic oncology control strategies.

**User Roles Involved:** National Stakeholders, Policy Makers, Public Health Officials, Orthopedic Oncology Leadership, Research Directors

**Functional Requirements:** FR33-41

### User Stories:

**Story 5.1: Real-time Musculoskeletal Tumor Distribution Maps**
```
As a National Stakeholder
I want to view real-time musculoskeletal tumor distribution maps
So that I can understand current bone and soft tissue tumor patterns across Indonesia

Acceptance Criteria:
- Live updating maps with data from all 21 connected musculoskeletal centers
- Multiple visualization types (heat maps, choropleth, bubble maps)
- Time-lapse animation for pattern evolution over time
- Filters for:
  - Tumor type: Bone tumor vs Soft tissue tumor
  - WHO classification categories
  - Enneking staging distribution
  - Demographics: Age groups, gender
- Geographic drill-down from national to district level
- Alert system for unusual pattern detection (e.g., geographic clusters)
- Center-specific data contribution visualization
```

**Story 5.2: Musculoskeletal Treatment Outcome Trend Analysis**
```
As a Public Health Official
I want trend analysis with time-series visualization of treatment outcomes
So that I can identify emerging patterns and evaluate intervention effectiveness

Acceptance Criteria:
- Interactive time-series charts for musculoskeletal tumor incidence trends
- Limb salvage rate trends over time:
  - Overall limb salvage vs amputation rates
  - By tumor type (osteosarcoma, Ewing sarcoma, soft tissue sarcoma, etc.)
  - By center with benchmarking
- Survival analysis:
  - 5-year overall survival by WHO classification
  - Disease-free survival trends
- Recurrence rate tracking:
  - Local recurrence rates
  - Distant metastasis rates
- Statistical trend analysis with confidence intervals
- Seasonal pattern detection and visualization
- Intervention impact assessment with before/after comparisons
- Predictive modeling for future trend projections
- Export functionality for reports and presentations
```

**Story 5.3: Center Performance on Functional Outcomes**
```
As a National Stakeholder
I want center comparison analytics with MSTS functional outcome metrics
So that I can identify best practices and centers needing support

Acceptance Criteria:
- Benchmarking dashboard comparing center performance:
  - Data quality scores and completeness by center
  - Average MSTS scores at 1 year, 2 years, 5 years post-treatment
  - Limb salvage success rates
  - Complication rates by center
  - Treatment outcome comparisons with risk-adjusted analysis
- MSTS score domain analysis:
  - Pain control effectiveness
  - Functional restoration rates
  - Patient satisfaction (emotional acceptance)
- Resource utilization efficiency metrics:
  - Average treatment cost per case
  - Length of stay comparisons
- Best practice identification:
  - Top performing centers by outcome measures
  - Treatment protocol analysis for successful outcomes
- Performance improvement recommendations based on data
- Center profiling with strengths and improvement areas
```

**Story 5.4: Predictive Pattern Indicators**
```
As a Public Health Official
I want predictive indicators for emerging musculoskeletal tumor patterns
So that I can allocate resources proactively and implement early interventions

Acceptance Criteria:
- Early warning system for unusual musculoskeletal tumor cluster detection
- Machine learning models for predicting tumor hotspots
- Risk factor correlation analysis with environmental and genetic data
- Resource need prediction based on trend projections
- Intervention effectiveness modeling and simulation
- Confidence intervals and uncertainty quantification for predictions
- Predictive models for limb salvage feasibility by tumor characteristics
```

**Story 5.5: Research Impact Tracking**
```
As a Research Leadership
I want research contribution tracking and impact measurement
So that I can demonstrate the value of musculoskeletal data sharing and guide future investments

Acceptance Criteria:
- Publication tracking using INAMSOS musculoskeletal data with citation analysis
- Research impact metrics including policy changes and clinical guidelines
- Researcher contribution recognition and leaderboard systems
- Collaboration network visualization showing research partnerships
- Innovation metrics including patents and diagnostic tools developed
- ROI analysis for research funding allocation
- Top research areas by musculoskeletal tumor type
- Clinical trial outcomes derived from INAMSOS data
```

**Story 5.6: AI-Powered Musculoskeletal Tumor Insights**
```
As a Researcher
I want AI-generated insights and patterns from musculoskeletal tumor data
So that I can discover novel correlations and research opportunities

Acceptance Criteria:
- Machine learning insights for bone and soft tissue tumor pattern discovery
- Automated hypothesis generation based on data patterns
- Natural language queries for complex data analysis
- Visualization of AI-discovered correlations and clusters
- Validation tools for AI-generated insights
- Integration with external AI research platforms
- Predictive models for treatment outcome optimization
```

**Story 5.7: Real-Time Clinical Decision Support for Orthopedic Oncology**
```
As an Orthopedic Oncologist
I want real-time clinical decision support based on national musculoskeletal tumor data
So that I can make evidence-based decisions for patient care

Acceptance Criteria:
- Real-time treatment recommendations based on similar cases:
  - Limb salvage vs amputation decision support
  - Reconstruction method recommendations
  - Chemotherapy protocol suggestions by tumor type and stage
- Prognosis predictions using national outcome data
- Clinical trial matching based on patient musculoskeletal tumor profiles
- Complication risk assessment with preventive suggestions
- Evidence-based guidelines with source attribution
- Integration with hospital EMR systems
- MSTS score prediction based on treatment choices
```

**Story 5.8: 5-Year Survival Analysis by WHO Classification**
```
As a Research Leadership
I want comprehensive 5-year survival analysis by WHO classification
So that I can understand prognosis and guide treatment protocols

Acceptance Criteria:
- Kaplan-Meier survival curves by:
  - WHO bone tumor classification categories
  - WHO soft tissue tumor classification categories
  - Specific diagnoses (osteosarcoma, Ewing sarcoma, synovial sarcoma, etc.)
- Survival stratified by:
  - Enneking staging (IA, IB, IIA, IIB, III)
  - AJCC TNM staging
  - Treatment modality (limb salvage vs amputation)
  - Margin status (R0, R1, R2)
- Log-rank test results for group comparisons
- Cox proportional hazards regression analysis
- Risk factors identification for survival outcomes
- Export capability for research publications
- Interactive survival curve builder
```

**Story 5.9: MSTS Functional Outcome Tracking**
```
As an Orthopedic Oncologist
I want comprehensive MSTS functional outcome tracking and analysis
So that I can evaluate and improve limb salvage program quality

Acceptance Criteria:
- MSTS score trend analysis over 5-year follow-up period
- Longitudinal tracking showing:
  - Immediate post-operative MSTS scores
  - 6-month recovery trajectory
  - 1-year functional stabilization
  - 2-5 year long-term outcomes
- Domain-specific analysis:
  - Pain reduction over time
  - Functional improvement trajectories
  - Walking and gait restoration patterns
- Comparison by:
  - Reconstruction method (allograft vs prosthesis vs autograft)
  - Anatomical location (upper vs lower extremity)
  - Tumor type and stage
- Center-specific MSTS benchmarking
- Factors associated with excellent outcomes (MSTS >24/30)
- Factors associated with poor outcomes (MSTS <15/30)
- Quality of life correlation with MSTS scores
```

---

## Epic 6: Reporting & Administration

**Epic Goal:** Provide comprehensive reporting capabilities and system administration tools that ensure reliable operation, data governance, and scalability of the INAMSOS musculoskeletal tumor registry platform across 21 designated centers with WHO classification maintenance.

**Business Value:** Enable operational excellence, compliance management, sustainable growth of the national musculoskeletal tumor database infrastructure, and maintenance of orthopedic oncology data standards.

**User Roles Involved:** System Administrators, Center Administrators, National Stakeholders, Compliance Officers, Orthopedic Oncology Leadership

**Functional Requirements:** FR42-56

### User Stories:

**Story 6.1: Customizable Musculoskeletal Tumor Report Generation**
```
As a Center Administrator
I want to generate customizable reports with multiple visualization options for musculoskeletal tumors
So that I can create tailored reports for different stakeholders and purposes

Acceptance Criteria:
- Drag-and-drop report builder with musculoskeletal-specific template library
- Multiple chart types (bar, line, pie, scatter, heat maps)
- Scheduled report generation and automatic distribution
- Report branding with center logos and orthopedic society emblems
- Export in multiple formats (PDF, Excel, PowerPoint, interactive web)
- Report sharing with permission controls and access tracking
- Pre-built templates:
  - Annual center performance report
  - Musculoskeletal tumor incidence report
  - Limb salvage outcomes report
  - WHO classification distribution report
```

**Story 6.2: Data Export Capabilities**
```
As a Researcher
I want data export in standard research formats
So that I can use INAMSOS musculoskeletal tumor data with my preferred analysis tools

Acceptance Criteria:
- Export formats: CSV, JSON, XML, Stata, SAS, R, SPSS
- Medical standard support: HL7 FHIR, DICOM
- Export job queue with progress tracking
- Data anonymization options for research compliance
- Large dataset handling with compression and chunking
- Export history and download management
- Custom field selection for targeted exports
- Metadata export with data dictionary
```

**Story 6.3: Automated Report Generation**
```
As a National Stakeholder
I want automated report generation for regular monitoring
So that I can receive timely insights without manual intervention

Acceptance Criteria:
- Configurable report schedules (daily, weekly, monthly, quarterly, annually)
- Automated data refresh and quality validation before generation
- Executive summary generation with key musculoskeletal tumor insights highlighted
- Distribution to stakeholder lists with personalization
- Version control and report history tracking
- Exception alerts when metrics exceed predefined thresholds
- Key reports:
  - Weekly: New case registrations by center
  - Monthly: Data quality dashboard
  - Quarterly: Treatment outcome trends
  - Annually: National musculoskeletal tumor burden report
```

**Story 6.4: Scheduled Notifications**
```
As a User
I want to schedule recurring reports and notifications
So that I stay informed about relevant updates and changes

Acceptance Criteria:
- Personalized notification preferences by frequency and content type
- Smart notifications based on role and usage patterns
- Digest emails with consolidated updates
- Mobile push notifications for critical alerts
- Notification history and management interface
- Integration with calendar systems for report scheduling
- Role-specific notifications:
  - Orthopedic Oncologist: Follow-up reminders, CPC schedules
  - Data Entry Staff: Quality score alerts, incomplete records
  - Center Admin: Performance benchmarks, system updates
```

**Story 6.5: Report History Tracking**
```
As a Compliance Officer
I want complete report generation history and distribution tracking
So that I can maintain audit trails and compliance documentation

Acceptance Criteria:
- Immutable log of all generated reports with timestamps
- Distribution tracking with recipient lists and delivery confirmation
- Report version control with change documentation
- Access logging showing who viewed each report
- Retention policy enforcement with automatic archival
- Export capability for compliance audits
```

**Story 6.6: 21-Center Network Management**
```
As a System Administrator
I want to onboard and manage 21 designated musculoskeletal centers with verification workflows
So that we can expand INAMSOS coverage while maintaining data quality

Acceptance Criteria:
- Center registration with orthopedic oncology program verification
- Designated center list management:
  - 21 Indonesian musculoskeletal tumor centers
  - Center profile: Name, location, contact, specialties, capacity
  - Orthopedic oncologist roster per center
- Automated configuration templates for different hospital types
- Data import tools with validation and quality checks
- Training assignment and completion tracking for orthopedic staff
- Go-live checklist with automated validation
- Post-launch support monitoring and quality tracking
- Center performance dashboards
- Network-wide coordination for multi-center studies
```

**Story 6.7: System Configuration Management**
```
As a Center Administrator
I want to manage local system configuration and settings
So that INAMSOS works optimally for our musculoskeletal center's specific needs

Acceptance Criteria:
- Configurable form fields and validation rules
- Local terminology and language customization
- Integration settings with existing hospital systems
- User role customization within center policies
- Backup schedule and retention policy configuration
- Performance monitoring and alert threshold settings
- Center-specific WHO classification preferences
- Custom MSTS score thresholds
```

**Story 6.8: Center Performance Monitoring**
```
As a System Administrator
I want center-level performance monitoring and analytics
So that I can identify issues and optimize system performance

Acceptance Criteria:
- Real-time performance metrics (response time, uptime, throughput)
- Resource utilization monitoring (CPU, memory, storage, network)
- User activity patterns and peak usage identification
- Error rate tracking and alerting for anomalies
- Performance benchmarking between 21 musculoskeletal centers
- Optimization recommendations based on usage patterns
- Data entry efficiency metrics per center
```

**Story 6.9: Hierarchical Permission Management**
```
As a National Administrator
I want hierarchical permission management across organizational levels
So that access control follows proper governance structure

Acceptance Criteria:
- Multi-level permission inheritance (National > Center > User)
- Role-based access control with attribute-based constraints
- Permission template system for common configurations
- Emergency access protocols with override capabilities
- Permission audit trails with change justification
- Automated permission review and certification workflow
- Orthopedic-specific role templates:
  - Orthopedic Oncologist (full clinical data access)
  - PPDS Orthopedi (supervised clinical data access)
  - Data Entry Staff (data input only)
  - Researcher (aggregate data access)
```

**Story 6.10: Data Migration Tools**
```
As a Center Administrator
I want tools for data migration and historical musculoskeletal data import
So that we can transition from existing systems to INAMSOS

Acceptance Criteria:
- Data mapping tools with field transformation capabilities
- Validation rules for migrated data quality assurance
- Duplicate detection and resolution workflows
- Migration progress tracking with rollback capabilities
- Historical data preservation with original format backup
- Post-migration reconciliation and quality reports
- WHO classification mapping from legacy coding systems
```

**Story 6.11: System-wide Configuration**
```
As a System Administrator
I want to configure system-wide settings and policies
So that INAMSOS maintains consistency and compliance across all 21 musculoskeletal centers

Acceptance Criteria:
- Global policy configuration (security, privacy, retention)
- System-wide updates and maintenance scheduling
- Compliance rule configuration and enforcement
- Integration settings for national systems and standards
- Emergency response protocols and incident management
- Change management workflow with approval processes
- National data standards enforcement
```

**Story 6.12: Backup and Recovery**
```
As a System Administrator
I want backup and recovery capabilities with medical-grade reliability
So that patient musculoskeletal tumor data is protected and always available

Acceptance Criteria:
- Automated daily backups with verification testing
- Geographic redundancy for disaster recovery
- Point-in-time recovery capabilities with granular restore options
- Backup encryption with secure key management
- Recovery time objective (RTO) < 4 hours for critical systems
- Recovery point objective (RPO) < 1 hour for data loss
- Regular disaster recovery testing with documented results
```

**Story 6.13: System Monitoring and Logging**
```
As a System Administrator
I want comprehensive logging and monitoring for operational health
So that I can maintain system reliability and performance

Acceptance Criteria:
- Centralized log aggregation with real-time analysis
- Performance monitoring with predictive alerting
- Security event detection and incident response automation
- Capacity planning with trend analysis and recommendations
- Integration with national monitoring frameworks
- Automated health checks with self-healing capabilities
- Monitoring across all 21 musculoskeletal centers
```

**Story 6.14: Automated Updates**
```
As a System Administrator
I want automated updates and maintenance scheduling
So that INAMSOS stays current with security patches and features

Acceptance Criteria:
- Rolling update deployment with zero-downtime capability
- Maintenance window scheduling with user notification
- Update rollback with automatic health verification
- Staged deployment (dev → staging → production) with validation
- Update testing with automated regression test suite
- Compliance patch management with SLA tracking
- Coordinated updates across all 21 centers
```

**Story 6.15: Disaster Recovery**
```
As a System Administrator
I want disaster recovery capabilities with documented procedures
So that we can maintain business continuity during major incidents

Acceptance Criteria:
- Complete disaster recovery plan with step-by-step procedures
- Secondary site deployment with data synchronization
- Incident response team with predefined roles and responsibilities
- Communication templates for stakeholder notifications
- Recovery time objective (RTO) and recovery point objective (RPO) monitoring
- Regular disaster recovery drills with performance measurement
```

**Story 6.16: WHO Classification Maintenance**
```
As a National Administrator
I want to maintain and update WHO Classification of Musculoskeletal Tumors
So that INAMSOS stays current with international tumor classification standards

Acceptance Criteria:
- WHO Classification version management:
  - Current version: WHO Classification 5th Edition (2020)
  - Support for previous versions for historical data
  - Update workflow when new WHO editions released
- Classification tree maintenance:
  - Add new tumor entities as WHO updates released
  - Modify existing classifications with proper versioning
  - Deprecate obsolete classifications with migration paths
- ICD-O-3 code synchronization
- Classification change impact analysis:
  - Reports affected by classification updates
  - Historical data migration strategies
- User notification of classification changes
- Training materials for new classifications
- Multi-language support (English/Indonesia) for classifications
```

**Story 6.17: Multi-Tenant Resource Management**
```
As a National Administrator
I want sophisticated resource management across 21 designated centers
So that I can optimize resource allocation and cost efficiency

Acceptance Criteria:
- Dynamic resource scaling based on center usage patterns
- Cost allocation and chargeback capabilities per center
- Resource usage forecasting and capacity planning
- Performance isolation between centers
- Automated resource optimization recommendations
- Integration with cloud provider billing systems
- Fair resource distribution ensuring equity across centers
```

**Story 6.18: Compliance Automation**
```
As a Compliance Officer
I want automated compliance checking and reporting
So that we can maintain continuous compliance with healthcare regulations

Acceptance Criteria:
- Automated HIPAA compliance checking with real-time monitoring
- GDPR-style data privacy compliance for international collaborations
- Healthcare standard compliance (HL7 FHIR, ICD-O-3, WHO classifications)
- Automated compliance report generation for audits
- Regulatory change monitoring and impact assessment
- Compliance gap identification with remediation tracking
- Indonesian Ministry of Health regulation compliance
```

---

## Story Summary by Role

### Data Entry Staff: 10 stories
- Epic 1: User authentication and profile management
- Epic 2: Complete 10-section musculoskeletal data entry workflow

### Orthopedic Oncologists: 18 stories
- Epic 1: Account creation and authentication with subspecialty verification
- Epic 2: Clinical data entry, WHO classification, staging, treatment documentation
- Epic 3: Research collaboration and data discovery
- Epic 5: Clinical decision support and outcome analytics

### PPDS Orthopedi (Residents): 12 stories
- Epic 1: Supervised account access
- Epic 2: Data entry with mentor oversight
- Epic 3: Research participation and learning

### Researchers: 15 stories
- Epic 3: Data discovery, visualization, search, collaboration
- Epic 4: Data requests, compliance, status tracking, access management
- Epic 5: AI-powered insights and advanced analytics
- Epic 6: Report generation and data export

### Center Administrators: 18 stories
- Epic 1: User management and permissions
- Epic 2: Quality monitoring, dashboard access, case review
- Epic 4: Request approval and compliance oversight
- Epic 5: Analytics access and performance tracking
- Epic 6: Report management, system configuration, monitoring

### National Stakeholders: 12 stories
- Epic 1: High-level access and oversight
- Epic 5: Strategic intelligence and trend analysis
- Epic 6: Executive reporting, policy insights, 21-center network management

### System Administrators: 16 stories
- Epic 1: Security and access control
- Epic 6: System administration, monitoring, disaster recovery, WHO classification maintenance

### Total Stories: 65+ comprehensive user stories across 6 epics

---

## Implementation Priority Recommendations

**Phase 1 (Foundation - Epic 1 & 2 Core - 3 months):**
- User authentication and role management with orthopedic subspecialty verification
- 10-section musculoskeletal data entry with WHO classification integration
- Center onboarding for 21 designated musculoskeletal centers
- Basic data quality validation

**Phase 2 (Core Functionality - Epic 2 Advanced & 3 - 3 months):**
- Advanced data entry with conditional rendering by pathology type
- Medical imaging management with DICOM support
- Research discovery and basic analytics
- MSTS score calculator and follow-up scheduling
- Quality assurance workflows

**Phase 3 (Advanced Features - Epic 4 & 5 - 4 months):**
- Research request management with ethics workflow
- Advanced analytics and intelligence dashboards
- Geographic visualization of musculoskeletal tumor distribution
- Limb salvage rate analytics
- 5-year survival analysis by WHO classification
- MSTS functional outcome tracking

**Phase 4 (Enterprise Features - Epic 6 - 3 months):**
- Comprehensive reporting with automated generation
- System administration tools
- Advanced monitoring and disaster recovery
- WHO classification maintenance system
- 21-center network performance management

---

## Musculoskeletal-Specific Features Summary

**Data Collection:**
- 10-section progressive form with conditional rendering
- WHO Classification of Bone and Soft Tissue Tumors integration
- Hierarchical anatomical location picker (bone segments, soft tissue regions)
- Enneking and AJCC staging systems
- Limb salvage vs amputation documentation
- Reconstruction method tracking (allograft, prosthesis, autograft)
- Mirels Score calculator for bone metastasis

**Outcome Tracking:**
- MSTS (Musculoskeletal Tumor Society) Score calculator (6 domains, 0-30 points)
- 14 follow-up visits over 5 years (3-month intervals year 1-2, 6-month intervals year 3-5)
- Functional outcome longitudinal tracking
- Limb salvage success monitoring
- Quality of life assessment integration

**Analytics:**
- Bone tumor vs soft tissue tumor distribution
- Limb salvage rate trends by tumor type and stage
- MSTS functional outcome benchmarking across 21 centers
- 5-year survival analysis by WHO classification
- Geographic clustering of musculoskeletal tumors
- Center performance on functional outcomes

**Network Management:**
- 21 designated Indonesian musculoskeletal tumor centers
- Multi-center research coordination
- Standardized WHO classification across all centers
- Center-specific performance dashboards
- National benchmarking for orthopedic oncology outcomes

---

**Document Status:** Complete - Transformed for Musculoskeletal Tumor Registry - Ready for architecture design and sprint planning
