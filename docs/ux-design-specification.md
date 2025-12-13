# UX Design Specification: INAMSOS

**Date:** 2025-12-11
**Author:** Yoppi
**UX Designer:** Sally
**Project:** Indonesian Musculoskeletal Tumor Registry
**Description:** Registry for orthopedic oncology subspecialty
**Status:** In Progress

---

## Project Vision

### Executive Summary

INAMSOS transforms Indonesia's orthopedic oncology research capabilities from scattered, siloed data into a centralized real-time intelligence system that enables groundbreaking research in musculoskeletal tumors, treatment outcome tracking, and evidence-based orthopedic policy decisions across 21 specialized centers.

### Target Users Summary

**Primary User Roles (7 distinct types):**
1. **Orthopedic Oncologists (Subspecialists)** - Specialist surgeons managing musculoskeletal tumor cases
2. **Residents (PPDS Orthopedi)** - Orthopedic residents learning subspecialty through case documentation
3. **Data Entry Staff** - Local center staff supporting data entry and coordination
4. **Researchers** - Academic researchers accessing musculoskeletal tumor data for studies
5. **Center Administrators** - Managing orthopedic centers and approving requests
6. **National Administrators** - Overseeing national registry operations
7. **National Stakeholders** - Leadership viewing strategic orthopedic oncology intelligence

### Platform & Domain Context

**Platform:** Multi-tenant SaaS web application
**Domain:** Orthopedic Oncology Healthcare with strict compliance and privacy requirements
**Specialty:** Musculoskeletal tumor management (bone tumors, soft tissue sarcomas, metastases)
**Complexity:** HIGH - Specialized medical data, multi-role permissions, longitudinal tracking, real-time analytics

---

## Core Experience and Platform

### Primary User Actions

**Most Critical User Actions:**
- **Data Entry:** Subspecialists and residents inputting musculoskeletal tumor data with WHO classification
- **Follow-up Documentation:** Recording 14 follow-up visits over 5 years with functional outcome tracking
- **MSTS Score Tracking:** Documenting functional outcomes using Musculoskeletal Tumor Society scoring
- **Treatment Outcome Documentation:** Recording limb salvage vs amputation outcomes and complications
- **Data Discovery:** Researchers browsing and requesting musculoskeletal tumor research datasets
- **Request Approval:** Administrators reviewing and approving data access requests
- **Intelligence Viewing:** Leadership accessing strategic orthopedic oncology pattern insights

**Effortless Experiences to Design:**
- Progressive 10-section form design that guides subspecialists through comprehensive musculoskeletal tumor documentation
- Conditional form sections based on pathology type (bone tumor vs soft tissue vs metastasis)
- WHO classification tree pickers for accurate diagnosis coding
- Hierarchical anatomical location pickers (bone segments and soft tissue regions)
- Automated calculators (MSTS score, Mirrel score, BMI)
- Follow-up visit scheduler and tracking (14 visits over 5 years)
- Intuitive research discovery with geographic visualization and filtering
- Clear approval workflows with proper audit trails and compliance
- Actionable intelligence dashboards with drill-down capabilities for orthopedic outcomes

### Platform Deployment

**Primary Platform:** Web-based responsive application (WEB-FIRST)
**Device Support:**
- **Desktop (Primary):** Full-featured workstations for subspecialists, residents, and administrators
- **Tablet (Secondary):** Ward rounds, clinic data entry, and mobile access for clinicians
- **Mobile (Tertiary):** Quick status checks, notifications, and basic viewing for leadership

**Responsive Strategy:**
- Desktop: Optimized for complex medical workflows and data visualization
- Mobile: Simplified interfaces focused on status viewing and quick actions
- Progressive enhancement: Full features on desktop, essential features on mobile

---

## Desired Emotional Response

### User Experience Goals

**Core Emotional Theme: IMPACT & RECOGNITION IN ORTHOPEDIC ONCOLOGY**

**Orthopedic Oncologists (Subspecialists):** **Treatment Excellence & Outcome Leadership**
- Feel empowered to track treatment outcomes and improve limb salvage rates
- Experience pride in contributing to national orthopedic oncology knowledge base
- See recognition for managing complex musculoskeletal tumor cases
- Feel connected to national subspecialty community
- Experience satisfaction from seeing functional outcome improvements over time

**Residents (PPDS Orthopedi):** **Learning & Professional Development**
- Experience learning from comprehensive case database and treatment outcomes
- Feel engaged in documenting cases as part of subspecialty education
- See recognition for thorough documentation and follow-up tracking
- Feel connected to subspecialty training community
- Experience growth through exposure to diverse musculoskeletal tumor cases

**Data Entry Staff:** **Visible Impact Contributor**
- Feel that every data entry contributes to national orthopedic oncology research
- See tangible recognition for data quality and completeness
- Experience pride in being part of nationwide subspecialty research movement
- Feel appreciated by research community when their data leads to discoveries

**Researchers:** **Impact-Driven Musculoskeletal Discovery**
- Feel empowered to make breakthrough discoveries in musculoskeletal oncology with national data
- Experience excitement when finding patterns in treatment outcomes and functional results
- Gain recognition through publications focused on limb salvage, functional outcomes, and quality of life after treatment
- Feel connected to community of orthopedic oncology researchers making real impact

**Administrators:** **Strategic Gatekeeper Impact**
- Feel crucial in enabling life-changing orthopedic research through approvals
- Experience recognition for maintaining data integrity and compliance
- See direct impact of their decisions on research advancement
- Feel valued as protectors of both privacy and scientific progress

**Leadership:** **National Orthopedic Policy Impact**
- Feel empowered to make data-driven decisions that improve musculoskeletal tumor outcomes
- Experience recognition for improving Indonesia's orthopedic oncology outcomes
- See tangible impact of policies on limb salvage rates and functional outcomes
- Feel pride in showcasing Indonesia's orthopedic research leadership globally

---

## Inspiration Analysis

### Key Inspiration: WhatsApp Group Dokter

**Why Medical Staff Love WhatsApp:**
- **Instant Communication:** Real-time sharing of medical cases and insights
- **Efficient Sharing:** Quick photo sharing, case discussions, knowledge exchange
- **Trusted Network:** Known colleagues, professional context
- **Mobile-First:** Accessible anywhere, anytime
- **Simple Interface:** Focus on conversation, not complex features

**Critical UX Elements:**
- **Immediate Feedback:** Message sent/delivered/read receipts
- **Rich Media:** Easy photo/document sharing
- **Threaded Conversations:** Organized discussions by topic
- **Quick Actions:** Forward, reply, react - minimal cognitive load

### Additional System Inspirations

**Research Platforms:**
- **PubMed** - Search and discovery for medical research
- **Tableau Public** - Data visualization and analytics
- **Kaggle** - Dataset discovery and research collaboration
- **Google Scholar** - Research publication tracking

**Dashboard Systems:**
- **Grafana** - Real-time monitoring dashboards
- **PowerBI** - Business intelligence visualization
- **WHO Health Data** - Public health data presentation

**Medical Subspecialty Workflow:**
- **Epic Systems** - Comprehensive medical documentation
- **Orthopedic Assessment Forms** - Structured clinical documentation patterns
- **Longitudinal Tracking Interfaces** - Patient follow-up management over time

### UX Patterns to Adapt from WhatsApp

**Communication-Inspired Data Entry:**
- **Real-time Status:** Clear feedback for data entry completion
- **Rich Media Support:** Easy medical imaging/document upload for clinical photos, radiographs
- **Threaded Organization:** Group related data logically across 10 sections
- **Quick Actions:** Common tasks easily accessible

**Medical Data Entry Principles:**
- **Efisien:** Data tepat di isi tanpa ribet
- **User-Friendly:** Intuitive, tidak perlu training panjang
- **Membantu Presisi:** Support untuk accuracy medical data
- **Mobile-Friendly:** Dapat diisi dari device apapun

**Healthcare Best Practices:**
- Progressive disclosure untuk complex medical forms
- Clear medical terminology dengan contextual help
- Robust validation dengan gentle error prevention
- Accessibility compliance untuk diverse medical staff

**Research System Patterns:**
- Advanced filtering dan search capabilities
- Geographic data visualization
- Collaboration dan sharing features
- Data export dalam standard formats

**Dashboard Intelligence:**
- Clear visual hierarchy untuk metrics
- Drill-down capabilities dari overview ke detail
- Real-time updates dan notifications
- Impact recognition untuk user contributions

---

## Project Complexity Assessment

### UX Complexity Indicators

**High Complexity Factors:**
- **7 Distinct User Roles:** Each with unique workflows, permissions, and priorities
- **Multi-tenant Architecture:** 21 orthopedic centers with data isolation and sharing
- **Medical Compliance:** Strict privacy, security, and validation requirements
- **Specialized Medical Data:** WHO classification systems, anatomical hierarchies, staging systems
- **Conditional Logic:** Form sections that adapt based on pathology type selection
- **Longitudinal Tracking:** 14 follow-up visits over 5 years with outcome measurements
- **Real-time Analytics:** Live dashboards with geographic and temporal data
- **Document Management:** Medical images, radiographs, pathology reports with validation

**Design Strategy:**
- Role-based interface design with clear permission boundaries
- Progressive disclosure for complex 10-section medical forms
- Conditional rendering based on pathology type
- Visual hierarchy for dashboards and intelligence
- Responsive design for various device contexts
- Accessibility as core requirement, not optional

**Facilitation Mode:** UX_INTERMEDIATE
- Balance design concepts with clear explanations
- Provide brief context for UX decisions
- Use familiar analogies when helpful
- Confirm understanding at key points

---

## Visual Foundation

### Design System Decision

**Chosen Theme:** Professional Medical Green
**Palette Selection:** Classic medical green with modern clean aesthetics
**Rationale:** Instantly recognizable as healthcare system, conveys trust and professionalism for orthopedic subspecialty

### Color System

**Primary Colors:**
- **Primary Green:** #10b981 (Main actions, key CTAs, navigation)
- **Secondary Green:** #059669 (Secondary actions, emphasis)
- **Success:** #059669 (Data saved, validation success)

**Semantic Colors:**
- **Warning:** #f59e0b (Alerts, cautions)
- **Error:** #ef4444 (Validation errors, critical issues)
- **Info:** #3b82f6 (Information, help text)

**Neutral Scale:**
- **Light Backgrounds:** #f0fdf4, #dcfce7 (Medical clean feel)
- **Text:** #052e16 (High contrast for readability)
- **Borders:** #e5e7eb (Subtle separation)

### Typography System

**Font Family:** Inter (or system fallbacks) - Clean, modern, highly readable
**Type Scale:**
- **Headings:** 700 weight, tight line-height
- **Body:** 400-500 weight, generous line-height for medical reading
- **Small Text:** 500 weight, clear visibility

### Spacing Foundation

**Base Unit:** 8px (0.5rem) system
**Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
**Usage:** Consistent spacing for medical form layouts and dashboards

---

## Design Direction

### Core UX Principles

**WhatsApp-Inspired Communication:**
- Real-time status feedback (sent/delivered/read patterns)
- Rich media support for medical imaging (clinical photos, X-rays, MRI)
- Threaded organization for related medical data across 10 sections
- Quick actions with minimal cognitive load

**Medical Precision & Trust:**
- Progressive disclosure for complex forms
- Clear medical terminology with contextual help
- Robust validation with gentle error prevention
- Professional medical aesthetic with clean design

**Orthopedic Subspecialty Focus:**
- WHO classification system integration
- Anatomical hierarchy navigation
- Functional outcome tracking (MSTS scores)
- Longitudinal follow-up management

### Component Strategy

**From Design System:**
- Standard UI components (buttons, forms, modals)
- Accessibility compliance built-in
- Responsive patterns
- Icon library for medical symbols

**Custom Components Needed:**
- **WHO Classification Tree Picker** - Interactive hierarchical selection for bone and soft tissue tumor classification
- **Hierarchical Bone Location Picker** - Anatomical region > bone > segment selection
- **Soft Tissue Location Picker** - Region-based soft tissue location selection
- **MSTS Score Calculator** - 6-domain functional assessment tool (0-30 total score)
- **Mirrel Score Calculator** - Automated fracture risk calculator for bone lesions
- **Conditional Section Renderer** - Dynamic form sections based on pathology type (bone/soft tissue/metastasis)
- **Follow-up Visit Scheduler** - 14-visit timeline management over 5 years
- **Multi-step Form Navigation** - Progress indicator and section navigation for 10-section form
- **Medical data entry forms** - Specialized validation for orthopedic oncology data
- **Geographic cancer visualization components** - National center mapping
- **Multi-level approval workflow components** - Research request management
- **Real-time dashboard widgets** - Outcome metrics and analytics

---

## Design Direction Decisions

### 10-Section Multi-Step Form Design

**Overall Approach: Workflow-Oriented Progressive Disclosure**
- **Rationale:** Complex musculoskeletal tumor documentation requires structured, step-by-step guidance
- **Key Features:** Multi-step workflow, progress indicators, conditional sections, comprehensive validation
- **Benefits:** Reduces cognitive load for subspecialists, ensures data completeness, scalable for complex orthopedic data

---

## Section-by-Section Design Specification

### Section 1: Center & Pathology Type

**Purpose:** Establish context and determine form flow

**Fields:**
- **Hospital Selection:** Dropdown menu
  - 21 orthopedic centers across Indonesia
  - Auto-fills center code and location data
- **Pathology Type:** Radio buttons (CRITICAL - determines conditional form flow)
  - Bone Tumor
  - Soft Tissue Sarcoma
  - Metastasis
  - Tumor-like Lesion
- **Subspecialist Name:** Text input with autocomplete from center staff list
- **PPDS Name:** Optional text input for resident involvement
- **Entry Date:** Auto-populated with manual override option

**Conditional Logic:**
- Pathology type selection determines available options in Section 5 (Diagnosis & Location)
- Different WHO classification trees shown based on selection

**Visual Design:**
- Clean card layout
- Large, clear radio buttons for pathology type
- Prominent visual indicator that this affects subsequent form sections
- Help text: "Your pathology type selection will customize the diagnosis and location sections"

**Validation:**
- Hospital: Required
- Pathology Type: Required
- Subspecialist Name: Required
- Entry Date: Required, cannot be future date

---

### Section 2: Patient Identity

**Purpose:** Complete demographic and contact information

**Fields:**
- **Full Name:** Text input
- **Date of Birth:** Date picker with age auto-calculation
- **Gender:** Radio buttons (Male/Female/Other)
- **NIK (National ID):** 16-digit number input with real-time validation
- **Hierarchical Address System:**
  - Province: Dropdown (34 provinces)
  - Regency/City: Dropdown (filtered by province selection)
  - District: Dropdown (filtered by regency selection)
  - Village/Kelurahan: Dropdown (filtered by district selection)
  - Street Address: Text area
  - Postal Code: Number input
- **Phone Number:** Text input with format validation (+62 xxx-xxxx-xxxx)
- **Emergency Contact Name:** Text input
- **Emergency Contact Phone:** Text input with format validation
- **Email:** Text input with email validation (optional)
- **Occupation:** Text input
- **Insurance Type:** Dropdown (BPJS/Private/Self-pay/Other)

**Visual Design:**
- Two-column layout for desktop
- Cascading dropdowns with loading states for hierarchical address
- Clear visual grouping: Demographics | Address | Contact | Insurance
- NIK field shows validation status in real-time (green checkmark or red error)

**Validation:**
- Required: Full Name, Date of Birth, Gender, NIK, Province, Regency, Phone
- NIK: 16 digits, valid format check
- Phone: Indonesian format validation
- Age: Calculated automatically, displayed prominently

**User Experience Notes:**
- Address hierarchy loads dynamically as user selects each level
- NIK validation provides immediate feedback
- Auto-save draft on section completion

---

### Section 3: Clinical Data

**Purpose:** Document comprehensive clinical assessment

**Subsections:**

**3.1 Anamnesis (Structured)**
- **Chief Complaint:** Text area
- **Duration of Symptoms:** Number input + unit dropdown (days/weeks/months/years)
- **Pain Characteristics:**
  - Location: Text input
  - Quality: Checkboxes (Sharp/Dull/Aching/Burning/Other)
  - Timing: Checkboxes (Constant/Intermittent/Night pain/Activity-related)
  - VAS Pain Scale: Slider (0-10) with visual indicators
- **Functional Limitation:** Text area
- **History of Trauma:** Yes/No radio with conditional text area
- **Previous Treatment:** Checkboxes (None/Traditional medicine/Other hospital/Self-medication) with details field
- **Constitutional Symptoms:** Checkboxes (Fever/Weight loss/Night sweats/Fatigue/None)
- **Family History:** Text area

**3.2 Physical Examination**
- **General Condition:** Dropdown (Good/Fair/Poor)
- **Vital Signs:**
  - Blood Pressure: Two number inputs (systolic/diastolic)
  - Heart Rate: Number input (bpm)
  - Respiratory Rate: Number input (per minute)
  - Temperature: Number input (°C)
- **Anthropometric:**
  - Height: Number input (cm)
  - Weight: Number input (kg)
  - BMI: Auto-calculated, displayed with color coding (underweight/normal/overweight/obese)
- **Karnofsky Performance Score:** Dropdown (0-100 in 10-point increments) with descriptive labels
- **Local Tumor Examination:**
  - Inspection: Text area
  - Palpation: Text area
  - Tumor Size: Number input (cm, greatest dimension)
  - Skin Changes: Checkboxes (Normal/Erythema/Ulceration/Discoloration/Peau d'orange)
  - Neurovascular Status: Checkboxes (Intact/Sensory deficit/Motor deficit/Vascular compromise)
- **Regional Lymph Nodes:** Radio (Not palpable/Palpable) with conditional details
- **Distant Examination:** Text area for systemic findings

**3.3 Clinical Photo Upload**
- **Image Upload Component:**
  - Multiple file upload (drag-and-drop or browse)
  - Supported formats: JPG, PNG (max 10MB per image)
  - Image preview thumbnails
  - Labels for each image: Dropdown (Anterior view/Posterior view/Lateral view/Close-up/X-ray/MRI/CT scan/Other)
  - Optional description text for each image

**Visual Design:**
- Accordion layout for subsections (expandable/collapsible)
- Pain scale with emoji indicators (smiling to crying face)
- BMI calculator with immediate visual feedback and color coding
- Karnofsky dropdown with full descriptive text (e.g., "100 - Normal, no complaints")
- Image upload with large drop zone and thumbnail gallery
- Clinical photo section with before/after comparison capability

**Validation:**
- Required: Chief Complaint, Duration, Pain Scale, Karnofsky Score, Vital Signs, Height, Weight
- Vital signs: Range validation (realistic medical values)
- BMI: Auto-calculated, flagged if outside normal range
- Clinical photos: At least one image recommended (warning if skipped)

**User Experience Notes:**
- Karnofsky score dropdown shows full description on hover
- BMI calculation happens in real-time as height/weight entered
- Pain scale is touch-friendly for tablet use
- Image upload shows upload progress
- Auto-save on subsection completion

---

### Section 4: Diagnostic Investigations

**Purpose:** Document all diagnostic workup

**Subsections:**

**4.1 Laboratory Investigations**
- **Complete Blood Count (CBC):**
  - Hemoglobin: Number input (g/dL) with normal range indicator
  - Leukocytes: Number input (cells/μL)
  - Platelets: Number input (cells/μL)
  - Hematocrit: Number input (%)
- **Tumor Markers:**
  - Alkaline Phosphatase (ALP): Number input (U/L)
  - Lactate Dehydrogenase (LDH): Number input (U/L)
  - Calcium: Number input (mg/dL)
  - Phosphate: Number input (mg/dL)
- **Other Markers:** Dynamic add field for additional markers
- **Date Performed:** Date picker

**4.2 Radiological Investigations**
- **X-ray:**
  - Date: Date picker
  - Findings: Text area
  - Images: File upload
  - Interpretation: Dropdown (Lytic/Sclerotic/Mixed/Soft tissue mass/Normal)
- **MRI:**
  - Date: Date picker
  - Sequences: Checkboxes (T1/T2/STIR/Contrast-enhanced)
  - Findings: Text area
  - Images: File upload
  - Tumor dimensions: Three number inputs (Length x Width x Depth in cm)
- **CT Scan:**
  - Date: Date picker
  - Type: Dropdown (Chest/Abdomen/Pelvis/Bone/Other)
  - Findings: Text area
  - Images: File upload
- **Bone Scan:**
  - Date: Date picker
  - Findings: Text area
  - Hot spots: Text area
  - Images: File upload
- **PET Scan:**
  - Date: Date picker
  - SUV Max: Number input
  - Findings: Text area
  - Images: File upload

**4.3 Mirrel Score Calculator (for Bone Lesions)**
- **Auto-calculated based on:**
  - Lesion Size: Radio (< 2/3 diameter = 1 point, > 2/3 diameter = 2 points)
  - Lesion Location: Radio (Upper limb = 1, Lower limb = 2, Peritrochanteric = 3)
  - Lesion Type: Radio (Blastic = 1, Mixed = 2, Lytic = 3)
  - Pain Level: Radio (Mild = 1, Moderate = 2, Functional = 3)
- **Total Score Display:** Large prominent number with color coding
  - 0-7: Low risk (green)
  - 8-9: Moderate risk (yellow)
  - 10-12: High risk (red)
- **Interpretation:** Auto-displayed text based on score

**4.4 Pathology Investigations**
- **Biopsy Type:** Dropdown (FNAB/Core biopsy/Incisional biopsy/Excisional biopsy)
- **Biopsy Date:** Date picker
- **Pathology Report:**
  - Report Number: Text input
  - Histologic Type: Text area (will be confirmed in Section 5 with WHO classification)
  - Grade: Dropdown (Benign/Grade 1/Grade 2/Grade 3/Grade X-undetermined)
  - Immunohistochemistry (IHK): Text area for markers
  - Pathology Images: File upload
- **HUVOS Grade (if neo-adjuvant chemotherapy given):**
  - Radio buttons (Grade I/II/III/IV)
  - Descriptive text for each grade
  - Conditional: Only shown if chemotherapy documented

**Visual Design:**
- Tab interface for different investigation types (Lab | Radiology | Mirrel | Pathology)
- Laboratory values with color-coded normal range indicators (green/yellow/red)
- Mirrel score calculator as prominent card with visual risk indicator
- Image upload sections with thumbnail previews
- HUVOS grade with visual diagram showing necrosis percentages

**Validation:**
- At least one investigation type required
- Laboratory values: Range validation
- Dates: Cannot be future dates
- Mirrel calculator: All 4 inputs required if activated
- Pathology: Biopsy type and date required if pathology section used

**User Experience Notes:**
- Normal range indicators appear next to lab values automatically
- Mirrel score updates in real-time as user selects options
- Clear visual distinction between required and optional investigations
- File upload shows progress and allows multiple files per investigation type
- Auto-save on tab change

---

### Section 5: Diagnosis & Location

**Purpose:** Accurate WHO classification and anatomical localization

**CONDITIONAL LOGIC BASED ON SECTION 1 PATHOLOGY TYPE**

**5.1 If Pathology Type = "Bone Tumor"**

**WHO Bone Tumor Classification Tree Picker:**
- **Interactive Hierarchical Tree Component:**
  - Level 1: Main Categories (expandable)
    - Bone-forming tumors
    - Cartilage tumors
    - Giant cell tumor of bone
    - Vascular tumors
    - Osteoclastic giant cell-rich tumors
    - Notochordal tumors
    - Other mesenchymal tumors
    - Hematopoietic tumors
    - Undifferentiated small round cell sarcomas
  - Level 2: Subcategories (expandable)
  - Level 3: Specific diagnoses (selectable)
- **Search Function:** Type-ahead search to quickly find diagnosis
- **Recently Used:** Shows last 5 diagnoses used by center
- **Selected Diagnosis Display:** Prominent display of full hierarchical path

**Hierarchical Bone Location Picker:**
- **Step 1 - Region:** Dropdown
  - Head and Neck
  - Trunk (Spine, Ribs, Sternum)
  - Upper Limb
  - Pelvis
  - Lower Limb
- **Step 2 - Bone:** Dropdown (filtered by region)
  - Example for Lower Limb: Femur, Tibia, Fibula, Patella, Tarsal bones, Metatarsal bones, Phalanges
- **Step 3 - Bone Segment:** Dropdown (filtered by bone)
  - Example for Femur: Proximal (head, neck, trochanter), Diaphysis (proximal third, middle third, distal third), Distal (metaphysis, condyle)
- **Laterality:** Radio buttons (Right/Left/Midline)
- **Visual Skeleton Map:** Interactive diagram showing selected location

**5.2 If Pathology Type = "Soft Tissue Sarcoma"**

**WHO Soft Tissue Tumor Classification Tree Picker:**
- **Interactive Hierarchical Tree Component:**
  - Level 1: Main Categories (expandable)
    - Adipocytic tumors
    - Fibroblastic and myofibroblastic tumors
    - So-called fibrohistiocytic tumors
    - Smooth muscle tumors
    - Skeletal muscle tumors
    - Vascular tumors
    - Pericytic (perivascular) tumors
    - Chondro-osseous tumors
    - Gastrointestinal stromal tumors
    - Nerve sheath tumors
    - Tumors of uncertain differentiation
    - Undifferentiated small round cell sarcomas
  - Level 2: Subcategories (expandable)
  - Level 3: Specific diagnoses (selectable)
- **Search Function:** Type-ahead search
- **Recently Used:** Last 5 diagnoses
- **Selected Diagnosis Display:** Full hierarchical path

**Soft Tissue Location Picker:**
- **Anatomical Region:** Dropdown
  - Head and Neck
  - Trunk (Chest wall, Abdominal wall, Back)
  - Upper Limb (Shoulder, Arm, Forearm, Hand)
  - Pelvis and Perineum
  - Lower Limb (Hip, Thigh, Leg, Foot)
- **Depth:** Radio buttons (Superficial to fascia/Deep to fascia)
- **Laterality:** Radio buttons (Right/Left/Midline)
- **Specific Location Details:** Text input for precise anatomical description

**5.3 If Pathology Type = "Metastasis"**

**Primary Tumor Site:** Dropdown with common sites
- Breast
- Lung
- Kidney
- Prostate
- Thyroid
- Unknown primary
- Other (with text input)

**Metastatic Location in Musculoskeletal System:**
- Use Hierarchical Bone Location Picker (same as bone tumor)
- Multiple metastatic sites: Checkbox to enable multiple location selection

**5.4 If Pathology Type = "Tumor-like Lesion"**

**Lesion Type:** Dropdown
- Simple bone cyst
- Aneurysmal bone cyst
- Fibrous dysplasia
- Osteofibrous dysplasia
- Eosinophilic granuloma
- Paget disease
- Brown tumor
- Intraosseous ganglion
- Other (with text input)

**Location:** Use Hierarchical Bone Location Picker

**5.5 Common Fields for All Pathology Types**

**Associated Syndromes:** Checkboxes (show if relevant)
- Neurofibromatosis
- Li-Fraumeni syndrome
- Ollier disease
- Maffucci syndrome
- Multiple hereditary exostoses
- McCune-Albright syndrome
- Retinoblastoma
- Other (with text input)

**Multifocal Disease:** Radio (Yes/No) with conditional multiple location picker

**Visual Design:**
- Large prominent classification tree picker with breadcrumb navigation
- Interactive skeleton/body diagram that highlights selected location
- Color-coded regions on anatomical diagrams
- Breadcrumb trail showing: Pathology Type > Classification Category > Specific Diagnosis
- Laterality with visual left/right indicators

**Validation:**
- WHO Classification: Required (specific diagnosis must be selected)
- Location: All hierarchy levels required
- Laterality: Required
- Skeleton diagram: Syncs with dropdown selections

**User Experience Notes:**
- Tree picker supports keyboard navigation
- Search function highlights matching terms
- Recently used diagnoses speed up common entries
- Anatomical diagrams are touch-friendly for tablets
- Breadcrumb allows easy navigation back up hierarchy
- Selected diagnosis displays full code and description

---

### Section 6: Staging

**Purpose:** Complete tumor staging using multiple systems

**Fields:**

**6.1 Enneking Staging System (Musculoskeletal Tumor Society)**
- **Stage:** Dropdown with full descriptions
  - IA: Low-grade, intracompartmental
  - IB: Low-grade, extracompartmental
  - IIA: High-grade, intracompartmental
  - IIB: High-grade, extracompartmental
  - III: Regional or distant metastasis
- **Rationale Fields:**
  - Grade: Radio (Low-grade / High-grade)
  - Compartment: Radio (Intracompartmental / Extracompartmental)
  - Metastasis: Radio (No metastasis / Metastasis present)
- **Auto-calculation:** Stage automatically determined from rationale fields

**6.2 AJCC Staging System (TNM-based)**
- **T (Primary Tumor):**
  - TX: Primary tumor cannot be assessed
  - T0: No evidence of primary tumor
  - T1: Tumor ≤ 5 cm
  - T2: Tumor 5-10 cm
  - T3: Tumor 10-15 cm
  - T4: Tumor > 15 cm
- **N (Regional Lymph Nodes):**
  - NX: Regional lymph nodes cannot be assessed
  - N0: No regional lymph node metastasis
  - N1: Regional lymph node metastasis
- **M (Distant Metastasis):**
  - M0: No distant metastasis
  - M1: Distant metastasis
    - M1a: Lung metastasis
    - M1b: Other distant metastasis
- **Overall Stage:** Auto-calculated from TNM
  - Stage IA: T1, N0, M0, Grade 1
  - Stage IB: T2-T3, N0, M0, Grade 1
  - Stage IIA: T1, N0, M0, Grade 2-3
  - Stage IIB: T2, N0, M0, Grade 2-3
  - Stage III: T3, N0, M0, Grade 2-3 or T4, N0, M0, Any grade
  - Stage IVA: Any T, N0, M1a, Any grade
  - Stage IVB: Any T, N1, Any M, Any grade or Any T, Any N, M1b, Any grade

**6.3 Tumor Characteristics**
- **Tumor Grade:** Dropdown
  - Benign (GX)
  - Grade 1 (Low-grade)
  - Grade 2 (Intermediate-grade)
  - Grade 3 (High-grade)
  - Grade X (Cannot be assessed)
- **Tumor Size:** Number input (cm, greatest dimension)
  - Auto-filled from Section 4 if available
  - Manual override allowed
- **Tumor Depth (for soft tissue):** Radio
  - Superficial (above superficial fascia)
  - Deep (below superficial fascia)

**6.4 Metastasis Documentation**
- **Metastasis Present:** Radio (Yes/No)
- **If Yes - Metastatic Sites:** Checkboxes
  - Lung
  - Bone (other site)
  - Liver
  - Brain
  - Regional lymph nodes
  - Other (with text input)
- **Number of Metastatic Lesions:** Number input
- **Date of Metastasis Detection:** Date picker

**Visual Design:**
- Side-by-side comparison of Enneking and AJCC staging
- Visual staging diagram for Enneking (grid showing grade vs compartment)
- TNM selector with clear visual grouping
- Auto-calculated stages displayed prominently with color coding
- Tumor size with visual size indicator (ruler graphic)
- Metastasis section with body diagram showing affected sites

**Validation:**
- Required: Enneking stage (or rationale fields to auto-calculate)
- Required: AJCC TNM components
- Required: Tumor grade
- Required: Tumor size
- Consistency check: Tumor size matches T classification
- Consistency check: Enneking and AJCC staging agreement warning if discrepant

**User Experience Notes:**
- Staging systems auto-calculate as user fills rationale fields
- Visual feedback if staging systems disagree (warning, not error)
- Tumor size pre-populated from Section 4 but editable
- Helpful tooltips for staging definitions
- Color-coded stage severity (green for early, yellow for intermediate, red for advanced)
- Auto-save on field completion

---

### Section 7: Clinicopathologic Conference (CPC)

**Purpose:** Document multidisciplinary team decision

**Fields:**

**7.1 CPC Details**
- **CPC Date:** Date picker
- **CPC Location:** Dropdown (populated from hospital center) or text input
- **CPC Number/Reference:** Text input (for institutional tracking)

**7.2 Attending Consultants**
- **Multi-select Checkboxes:**
  - Orthopedic Oncologist
  - Medical Oncologist
  - Radiation Oncologist
  - Radiologist
  - Pathologist
  - Other (with text input for additional specialists)
- **Consultant Names:** Dynamic text inputs for each selected specialty

**7.3 Case Presentation Summary**
- **Clinical Summary:** Text area (auto-populated summary from previous sections, editable)
- **Radiological Summary:** Text area (auto-populated from Section 4, editable)
- **Pathological Summary:** Text area (auto-populated from Section 4, editable)

**7.4 Treatment Decision**
- **Primary Treatment Plan:** Text area (rich text editor)
  - Recommended surgical approach
  - Chemotherapy protocol if indicated
  - Radiotherapy plan if indicated
  - Timeline and sequence
- **Alternative Options Discussed:** Text area
- **Rationale for Decision:** Text area

**7.5 Patient/Family Counseling**
- **Counseling Provided:** Radio (Yes/No)
- **Participants:** Text area (family members present)
- **Key Points Discussed:** Checkboxes
  - Diagnosis explained
  - Treatment options
  - Risks and benefits
  - Prognosis
  - Functional outcomes expected
  - Follow-up plan
- **Patient Decision:** Radio (Accepted treatment plan / Requested time to consider / Declined / Seeking second opinion)

**Visual Design:**
- Card-based layout with clear sections
- Auto-populated summaries in collapsible panels (user can expand to review)
- Rich text editor for treatment decision with formatting options
- Consultant selection with profile pictures if available
- Timeline graphic showing treatment sequence
- Color-coded summary indicators (clinical/radiology/pathology)

**Validation:**
- Required: CPC Date
- Required: At least 2 attending consultants
- Required: Treatment decision
- Warning if patient decision is not "Accepted" (alerts team to follow-up needs)

**User Experience Notes:**
- Auto-populated summaries save time but remain editable
- Rich text editor allows structured treatment plans with bullet points, formatting
- Consultant multi-select allows quick team composition
- Timeline visualization helps communicate treatment sequence
- Auto-save after each subsection
- Option to generate PDF summary of CPC decision for patient records

---

### Section 8: Treatment Management

**Purpose:** Comprehensive treatment documentation and surgical details

**Subsections:**

**8.1 Treatment Intent**
- **Primary Intent:** Radio buttons
  - Curative
  - Palliative
  - Adjuvant (post-surgery)
  - Neo-adjuvant (pre-surgery)

**8.2 Chemotherapy Management**
- **Chemotherapy Given:** Radio (Yes/No)
- **If Yes:**
  - **Timing:** Radio (Neo-adjuvant / Adjuvant / Palliative)
  - **Protocol Name:** Dropdown with common protocols
    - MAP (Methotrexate, Adriamycin, Cisplatin)
    - AP (Adriamycin, Cisplatin)
    - IE (Ifosfamide, Etoposide)
    - VAC (Vincristine, Actinomycin D, Cyclophosphamide)
    - Other (with text input)
  - **Number of Cycles Planned:** Number input
  - **Number of Cycles Completed:** Number input
  - **Start Date:** Date picker
  - **End Date:** Date picker
  - **Response Assessment:** Dropdown (Complete response / Partial response / Stable disease / Progressive disease)
  - **HUVOS Grade (if neo-adjuvant):** Radio (I / II / III / IV) with descriptions
  - **Complications:** Checkboxes (Neutropenia / Anemia / Thrombocytopenia / Nausea/vomiting / Renal toxicity / Cardiotoxicity / Other) with severity rating

**8.3 Surgical Management**
- **Surgery Performed:** Radio (Yes/No)
- **If Yes:**

  **8.3.1 Surgical Details**
  - **Surgery Date:** Date picker
  - **Surgical Approach:** Dropdown
    - Limb Salvage Surgery
    - Ablation (Amputation/Disarticulation)
    - Wide Local Excision
    - Intralesional Excision/Curettage
    - Biopsy Only
    - Other
  - **If Limb Salvage Selected:**
    - **Reconstruction Method:** Checkboxes (multiple allowed)
      - Endoprosthesis (specify type)
      - Allograft
      - Autograft (specify type: fibula, iliac crest, other)
      - Arthrodesis
      - Rotationplasty
      - Biological reconstruction
      - Soft tissue coverage (specify: flap type)
      - Other
  - **If Ablation Selected:**
    - **Level:** Dropdown
      - Above-knee amputation
      - Below-knee amputation
      - Hip disarticulation
      - Hemipelvectomy
      - Shoulder disarticulation
      - Above-elbow amputation
      - Below-elbow amputation
      - Forequarter amputation
      - Other

  **8.3.2 Surgical Margins**
  - **Margin Status:** Radio
    - Wide (planned healthy tissue margin)
    - Marginal (reactive zone margin)
    - Intralesional (through tumor)
    - Radical (entire compartment)
  - **Margin Distance:** Number input (mm, closest margin)
  - **Margin Involvement:** Checkboxes (if marginal/intralesional)
    - Anterior
    - Posterior
    - Medial
    - Lateral
    - Proximal
    - Distal

  **8.3.3 Operative Details**
  - **Surgeon Name:** Text input
  - **Assistant Surgeons:** Text area
  - **Anesthesia Type:** Dropdown (General / Regional / Combined)
  - **Duration:** Number input (minutes)
  - **Blood Loss:** Number input (mL)
  - **Transfusion Required:** Radio (Yes/No)
    - If Yes: Number of units
  - **Implants Used:** Checkboxes with details
    - Endoprosthesis (manufacturer, size)
    - Plates/screws
    - External fixator
    - Other
  - **Intraoperative Complications:** Text area

  **8.3.4 Specimen Details**
  - **Specimen Size:** Three number inputs (Length x Width x Depth in cm)
  - **Specimen Weight:** Number input (grams)
  - **Frozen Section Performed:** Radio (Yes/No)
    - If Yes: Result text area
  - **Specimen Sent for Pathology:** Radio (Yes/No)

**8.4 Radiotherapy Management**
- **Radiotherapy Given:** Radio (Yes/No)
- **If Yes:**
  - **Timing:** Radio (Neo-adjuvant / Adjuvant / Palliative / Definitive)
  - **Modality:** Dropdown (External beam / Brachytherapy / Combined)
  - **Total Dose:** Number input (Gy)
  - **Fractionation:** Number input (Gy per fraction)
  - **Number of Fractions:** Number input
  - **Start Date:** Date picker
  - **End Date:** Date picker
  - **Target Volume:** Text area
  - **Completion Status:** Radio (Completed as planned / Incomplete / Modified plan)
  - **Acute Complications:** Checkboxes (Skin reaction / Mucositis / Pain / Edema / Other)

**8.5 Other Treatments**
- **Other Treatments Given:** Checkboxes
  - Targeted therapy (specify drug)
  - Immunotherapy (specify drug)
  - Bisphosphonates
  - Pain management (specify approach)
  - Physical therapy
  - Other (text input)

**Visual Design:**
- Accordion layout for subsections (Chemotherapy | Surgery | Radiotherapy | Other)
- Surgical approach with visual icons (limb salvage vs. ablation)
- Reconstruction method with anatomical diagrams
- Timeline visualization showing treatment sequence (chemo → surgery → radiation)
- Margin status with circular diagram showing margin involvement directions
- Color-coded completion status (completed/ongoing/incomplete)
- Image upload section for intraoperative photos

**Validation:**
- If treatment intent is "Curative", at least one treatment modality required
- Surgery date cannot be before diagnosis date
- Chemotherapy end date must be after start date
- If limb salvage selected, reconstruction method required
- If margin status is "Intralesional", warning message about recurrence risk
- Consistency check: HUVOS grade only if neo-adjuvant chemotherapy given

**User Experience Notes:**
- Conditional fields appear/disappear based on treatment selections
- Timeline graphic updates as treatment dates entered
- Auto-calculation of total radiation dose from fractionation
- Surgical approach icons clearly distinguish limb salvage vs. ablation
- Prominent visual indicator if marginal/intralesional margins achieved (alerts team)
- Auto-save on subsection completion
- Option to upload operative photos, pathology images

---

### Section 9: Follow-up Management

**Purpose:** Longitudinal tracking of functional outcomes and complications over 5 years

**9.1 Follow-up Schedule Display**

**Standard Schedule (14 visits over 5 years):**
- **Year 1:** Every 3 months (4 visits)
- **Year 2:** Every 3 months (4 visits)
- **Year 3:** Every 6 months (2 visits)
- **Year 4:** Every 6 months (2 visits)
- **Year 5:** Every 6 months (2 visits)

**Visual Display:**
- Interactive timeline showing all 14 follow-up points
- Color-coded visit status:
  - Grey: Scheduled (future)
  - Yellow: Due now
  - Green: Completed
  - Red: Missed
- Click on visit to open follow-up form

**9.2 Individual Follow-up Visit Form**

**For Each Visit:**

**Visit Information:**
- **Visit Number:** Auto-generated (1-14)
- **Scheduled Date:** Auto-calculated from surgery date
- **Actual Visit Date:** Date picker
- **Visit Status:** Auto-determined (On time / Late / Missed)
- **Visit Type:** Radio (In-person / Telemedicine / Phone)

**Patient Status:**
- **Vital Status:** Radio
  - Alive, no evidence of disease
  - Alive with disease
  - Deceased (if selected, opens end-of-life form)
  - Lost to follow-up
- **Karnofsky Performance Score:** Dropdown (0-100)

**MSTS Functional Score Calculator:**

**6 Domains (each scored 0-5):**
1. **Pain:**
   - 5: No pain
   - 4: Intermediate
   - 3: Modest, no compromise of function
   - 2: Intermediate
   - 1: Modest, partial compromise of function
   - 0: Severe, total compromise of function

2. **Function:**
   - 5: No restriction
   - 4: Intermediate
   - 3: Partial restriction, recreational restriction
   - 2: Intermediate
   - 1: Partial restriction, occupational and recreational
   - 0: Total restriction

3. **Emotional Acceptance:**
   - 5: Enthusiastic
   - 4: Intermediate
   - 3: Satisfied
   - 2: Intermediate
   - 1: Accepting
   - 0: Dislikes

4. **Supports (Walking aids):**
   - 5: None
   - 4: Intermediate
   - 3: Brace
   - 2: Intermediate
   - 1: One cane or crutch
   - 0: Two canes or crutches

5. **Walking Ability:**
   - 5: Unlimited
   - 4: Intermediate
   - 3: Limited (>6 blocks)
   - 2: Intermediate
   - 1: Limited (2-6 blocks)
   - 0: Limited (<2 blocks)

6. **Gait:**
   - 5: Normal
   - 4: Intermediate
   - 3: Minor cosmetic deficit
   - 2: Intermediate
   - 1: Major cosmetic deficit
   - 0: Major handicap

**Total MSTS Score:** Auto-calculated (0-30)
- Displayed prominently with percentage (score/30 × 100%)
- Color-coded: >80% green, 60-80% yellow, <60% red
- Chart showing score trend across all visits

**Clinical Assessment:**
- **Local Examination:** Text area
- **Neurovascular Status:** Radio (Intact / Impaired) with details
- **Range of Motion:** Text area or structured input for joint angles
- **Muscle Strength:** Dropdown (5/5, 4/5, 3/5, 2/5, 1/5, 0/5)
- **Clinical Photos:** File upload

**Imaging Review:**
- **X-ray:** Radio (Done / Not done)
  - If done: Findings text area, image upload, interpretation dropdown
- **MRI:** Radio (Done / Not done)
  - If done: Findings text area, image upload
- **CT Chest:** Radio (Done / Not done)
  - If done: Findings text area (specifically for lung metastasis screening)
- **Bone Scan:** Radio (Done / Not done)
  - If done: Findings text area

**Disease Status:**
- **Local Recurrence:** Radio (Yes / No)
  - If Yes: Date detected, size, location details
- **Distant Metastasis:** Radio (Yes / No)
  - If Yes: Sites (checkboxes), date detected, number of lesions
- **Second Primary Tumor:** Radio (Yes / No)
  - If Yes: Details text area

**Complications:**
- **Complications Present:** Radio (Yes / No)
- **If Yes - Type:** Checkboxes
  - Infection (superficial / deep)
  - Implant failure
  - Non-union / delayed union
  - Pathological fracture
  - Wound dehiscence
  - Nerve injury
  - Vascular injury
  - Lymphedema
  - Prosthesis loosening
  - Dislocation
  - Other (text input)
- **Complication Management:** Text area
- **Additional Surgery Required:** Radio (Yes / No)
  - If Yes: Details text area

**Treatment During Follow-up:**
- **New Treatment Initiated:** Radio (Yes / No)
- **If Yes:** Checkboxes (Chemotherapy / Radiotherapy / Surgery / Other)
  - Brief details text area

**Next Visit Planning:**
- **Next Visit Scheduled:** Date picker (auto-suggests based on protocol)
- **Specific Investigations Ordered:** Checkboxes (X-ray / MRI / CT / Labs / Other)
- **Notes for Next Visit:** Text area

**9.3 Follow-up Summary Dashboard**

**Visual Components:**
- **MSTS Score Trend Chart:** Line graph showing functional score progression across all visits
- **Visit Compliance:** Percentage of completed visits (14 total expected)
- **Complication Timeline:** Visual timeline showing when complications occurred
- **Disease Status Summary:** Current status with date of last assessment
- **Overall Outcome:** Summary card
  - Alive without disease: X months/years
  - Local control: Achieved / Not achieved
  - Functional outcome: MSTS score at latest visit
  - Prosthesis survival (if applicable): Duration
  - Overall survival: From diagnosis date

**Visual Design:**
- Timeline as primary navigation element
- Interactive visit cards on timeline
- MSTS calculator as prominent widget with visual scoring grid
- Trend charts for MSTS score, Karnofsky score over time
- Color-coded alerts for missed visits, complications, recurrence
- Responsive design: timeline scrolls horizontally on mobile
- Quick-add button for unscheduled visits

**Validation:**
- Visit date required
- Vital status required
- MSTS score: All 6 domains required if patient is alive and ambulatory
- If recurrence/metastasis detected, details required
- If complication present, type and management required

**User Experience Notes:**
- Auto-calculation of MSTS total score as domains selected
- Visual progress indicator showing completion of 14 visits
- Alerts for missed visits
- Trend charts provide longitudinal perspective
- One-click access to previous visit data for comparison
- Auto-save on field completion
- Option to generate follow-up summary report
- Calendar integration to schedule future visits
- Notification system for upcoming visits

---

### Section 10: Review & Submit

**Purpose:** Final validation and submission

**10.1 Comprehensive Case Summary**

**Auto-generated Summary Panels (expandable/collapsible):**

1. **Patient Demographics:**
   - Name, Age, Gender, Hospital, Entry Date
   - Quick-view card

2. **Diagnosis Summary:**
   - Pathology type
   - WHO Classification (full path)
   - Anatomical location
   - Laterality
   - Staging (Enneking and AJCC)

3. **Treatment Summary:**
   - Intent
   - Chemotherapy: Protocol, cycles, response
   - Surgery: Approach, reconstruction, margins, date
   - Radiotherapy: Dose, fractions, dates
   - Timeline graphic showing treatment sequence

4. **Follow-up Summary:**
   - Number of completed visits / 14 total
   - Latest MSTS score
   - Current disease status
   - Complications (if any)

5. **Key Images:**
   - Thumbnail gallery of clinical photos, radiographs (user can select key images to include)

**10.2 Data Quality Score**

**Automated Quality Assessment:**
- **Completeness Score:** Percentage calculation
  - Required fields completed: X%
  - Optional recommended fields: X%
  - Overall completeness: X%
- **Quality Indicators:**
  - Green checkmark: All required fields complete
  - Yellow warning: Missing recommended fields (list shown)
  - Red error: Missing required fields (list shown, prevents submission)
- **Validation Checks:**
  - Date consistency (no future dates, logical sequence)
  - Staging consistency (Enneking and AJCC agreement)
  - Treatment consistency (margins match surgical approach)
  - WHO classification matches pathology type
  - All conditionally required fields completed

**Visual Quality Score Display:**
- Large circular progress indicator (0-100%)
- Color-coded: >90% green, 70-90% yellow, <70% red
- Breakdown by section (each section scored)
- "Fix Issues" button navigates to incomplete sections

**10.3 Validation Checklist**

**User Confirmation Checkboxes (required before final submit):**
- [ ] Patient demographics verified
- [ ] WHO classification confirmed with pathology report
- [ ] Staging accurately reflects disease extent
- [ ] Treatment details complete and accurate
- [ ] Follow-up data entered for all completed visits
- [ ] I have reviewed all entered data for accuracy

**10.4 Action Buttons**

**Draft Save:**
- **Button:** "Save as Draft" (secondary button style)
- **Action:** Saves all current data, allows user to exit and return later
- **Status:** Sets case status to "Draft - In Progress"
- **Notification:** "Draft saved successfully. You can return to complete this case anytime."

**Final Submit:**
- **Button:** "Submit Case" (primary button style, prominent)
- **Enabled only if:**
  - All required fields complete
  - Data quality score > 70%
  - Validation checklist all checked
- **Action:** Finalizes case submission
  - Sets case status to "Submitted - Complete"
  - Generates unique case ID
  - Adds to center's completed case count
  - Creates audit log entry
- **Confirmation Modal:**
  - "Are you sure you want to submit this case? Once submitted, major edits will require administrator approval."
  - "Cancel" / "Confirm Submission"
- **Success Notification:**
  - "Case submitted successfully!"
  - Displays case ID
  - Options: "View case summary" / "Start new case" / "Return to dashboard"

**10.5 Additional Actions**

**Secondary Actions:**
- **Print Summary:** Generate PDF of complete case summary
- **Export Data:** Download case data in structured format (JSON/XML)
- **Share with Colleague:** Send case summary to another user (with permission check)
- **Request Review:** Flag case for senior consultant review before submission

**Visual Design:**
- Clean, spacious layout
- Summary panels with expand/collapse
- Large, clear quality score indicator
- Color-coded validation status
- Prominent action buttons
- Modal confirmations for critical actions
- Success/error notifications with clear messaging

**Validation:**
- Final submit blocked if required fields incomplete
- Warning if quality score < 90% (user can still proceed if > 70%)
- Confirmation required for final submission
- Audit trail: Who submitted, when, from where

**User Experience Notes:**
- Comprehensive summary allows final review without navigating back
- Quality score provides transparent feedback on data completeness
- Draft save allows flexible workflow (can complete over multiple sessions)
- Clear distinction between draft and final submission
- One-click navigation to incomplete sections
- Validation checklist ensures user accountability
- Success confirmation provides closure and next action options
- PDF export enables offline review and sharing

---

## Multi-Step Form Navigation

### Global Form Controls

**Progress Indicator:**
- **Location:** Fixed top of viewport (desktop) / sticky header (mobile)
- **Display:**
  - Section numbers 1-10 with labels
  - Current section highlighted
  - Completed sections: Green checkmark
  - Incomplete sections: Grey number
  - Current section: Blue highlight
- **Interaction:** Click any section to jump (with "unsaved changes" warning if applicable)

**Navigation Buttons:**
- **Location:** Fixed bottom of viewport (desktop) / sticky footer (mobile)
- **Buttons:**
  - "Previous Section" (secondary button, left side)
  - "Save Draft" (secondary button, center)
  - "Next Section" (primary button, right side)
- **Keyboard Shortcuts:**
  - Alt + Left Arrow: Previous section
  - Alt + Right Arrow: Next section
  - Ctrl + S: Save draft

**Auto-save Behavior:**
- Auto-save every 30 seconds (if changes detected)
- Auto-save on section navigation
- Visual indicator: "Saving..." / "All changes saved" timestamp

**Conditional Section Logic:**
- Section 5 (Diagnosis & Location) adapts based on Section 1 pathology type
- Visual indicator if user changes pathology type: "Warning: Changing pathology type will reset Section 5 data"

**Responsive Behavior:**
- **Desktop:** Full 10-section view with side-by-side content
- **Tablet:** Single column, full-width fields
- **Mobile:** Simplified layouts, larger touch targets, collapsible subsections

---

## Component Specifications

### Custom Component Library

**1. WHO Classification Tree Picker**
- **Functionality:**
  - Hierarchical tree structure (3 levels)
  - Expand/collapse categories
  - Type-ahead search
  - Recently used shortcuts
  - Full path breadcrumb display
- **States:** Collapsed / Expanded / Selected / Searching
- **Responsive:** Desktop: tree view / Mobile: drill-down view

**2. Hierarchical Bone Location Picker**
- **Functionality:**
  - Three cascading dropdowns (Region > Bone > Segment)
  - Visual skeleton diagram syncs with selections
  - Laterality selector
  - Quick selection from recent locations
- **States:** Empty / Partial selection / Complete
- **Responsive:** Desktop: side-by-side / Mobile: stacked with collapsible diagram

**3. Soft Tissue Location Picker**
- **Functionality:**
  - Anatomical region dropdown
  - Depth selector (superficial/deep)
  - Laterality selector
  - Free text for specific location
- **States:** Empty / Selected
- **Responsive:** Full-width on all devices

**4. MSTS Score Calculator**
- **Functionality:**
  - 6-domain dropdowns (0-5 points each)
  - Auto-calculates total (0-30)
  - Percentage display
  - Color-coded result
  - Comparison with previous visits
- **States:** Empty / Partial / Complete
- **Responsive:** Desktop: 2-column grid / Mobile: single column

**5. Mirrel Score Calculator**
- **Functionality:**
  - 4 input radio groups
  - Auto-calculates total (0-12)
  - Risk category display (Low/Moderate/High)
  - Color-coded result
  - Clinical interpretation text
- **States:** Empty / Partial / Complete
- **Responsive:** Desktop: compact card / Mobile: full-width

**6. Conditional Section Renderer**
- **Functionality:**
  - Shows/hides sections based on conditions
  - Smooth transitions
  - Preserves data if user changes mind
  - Warning before clearing data
- **States:** Visible / Hidden / Transitioning
- **Responsive:** Inherits section responsiveness

**7. Follow-up Visit Scheduler**
- **Functionality:**
  - Interactive timeline (14 visits)
  - Color-coded status
  - Click to open visit form
  - Visit compliance tracking
  - Missed visit alerts
- **States:** Scheduled / Due / Completed / Missed
- **Responsive:** Desktop: horizontal timeline / Mobile: vertical list

**8. Multi-step Form Navigation**
- **Functionality:**
  - Progress indicator (1-10)
  - Section status (complete/incomplete/current)
  - Previous/Next navigation
  - Jump to section
  - Auto-save
- **States:** Draft / In Progress / Complete
- **Responsive:** Desktop: horizontal / Mobile: dropdown + progress bar

---

## Research Discovery Interface (Unchanged from Original)

### Selected Design Approach

**Direction 3 - Research Hub**
- Study-focused with collaboration tools and research workflows
- Active studies management, dataset browsing, collaboration features
- Supports academic research process, enables team collaboration, study-focused organization

---

## Approval Workflow Interface (Unchanged from Original)

### Selected Design Approach

**Direction 1 - Approval Dashboard**
- Clear status tracking with traditional approval workflows
- Queue management, decision tools, audit trails
- Efficient processing, clear compliance tracking, professional medical interface

---

## Leadership Dashboard Interface (Unchanged from Original)

### Selected Design Approach

**Direction 1 - Strategic Overview**
- High-level insights with decision support for leadership
- National metrics, trend analysis, regional performance
- Strategic intelligence, policy support, executive-ready views

---

## Technical Implementation Strategy

### Component Library Strategy

**Base Components:**
- Standard UI components from design system (buttons, forms, modals)
- Accessibility compliance built-in
- Responsive patterns
- Icon library for medical symbols

**Custom Medical Components:**
- WHO Classification Tree Picker
- Hierarchical Bone/Soft Tissue Location Pickers
- MSTS Score Calculator
- Mirrel Score Calculator
- Conditional Section Renderer
- Follow-up Visit Scheduler
- Multi-step Form Navigation
- Medical data entry forms with validation
- Timeline visualization components

**Research & Analytics Components:**
- Geographic visualization components for research
- Workflow components for approval processes
- Dashboard widgets for leadership intelligence

**Responsive Design Approach:**
- Desktop-first with comprehensive medical workflow support
- Tablet-optimized for ward rounds and clinic data entry
- Mobile-optimized for status checks and quick actions
- Progressive enhancement ensures essential functionality on all devices

---

## Current Status

**Phase:** Design Specification Complete - Musculoskeletal Tumor Registry Focus
**Specialty:** Orthopedic Oncology (Bone Tumors, Soft Tissue Sarcomas, Metastases)
**Form Structure:** 10 Sections with Conditional Logic
**Target Centers:** 21 Orthopedic Oncology Centers
**Follow-up Duration:** 5 years (14 visits)
**Next Step:** Component Development & Implementation
**Readiness:** Ready for frontend development with specialized orthopedic oncology workflows
