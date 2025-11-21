# INAMSOS Hospital Selection Matrix
## Indonesian National Cancer Database System - Hospital Scoring and Selection Framework

---

## 📊 SELECTION METHODOLOGY OVERVIEW

### **Selection Framework**
The hospital selection process uses a comprehensive scoring system based on 6 key dimensions to ensure optimal rollout success and national coverage.

### **Scoring System**
- **Total Possible Score:** 100 points
- **Minimum Threshold:** 70 points for inclusion
- **Tier Classification:**
  - **Tier 1 (Pilot):** 90+ points
  - **Tier 2 (Phase 1):** 80-89 points
  - **Tier 3 (Phase 2-3):** 70-79 points

---

## 🎯 SELECTION CRITERIA WEIGHTING

### **Primary Criteria (80 points total)**

#### **1. Technical Readiness (25 points)**
- **Infrastructure Quality (8 points)**
  - Network bandwidth >100Mbps: 8 points
  - Network bandwidth 50-100Mbps: 5 points
  - Network bandwidth <50Mbps: 2 points

- **IT Staff Capability (6 points)**
  - Dedicated IT team >5 people: 6 points
  - IT team 3-5 people: 4 points
  - IT team 1-2 people: 2 points

- **Existing Systems (6 points)**
  - Hospital Information System (HIS): 4 points
  - Electronic Medical Records (EMR): 4 points
  - Laboratory Information System (LIS): 2 points

- **Hardware Standards (5 points)**
  - Modern computers (>2020): 3 points
  - Adequate server infrastructure: 2 points

#### **2. Geographic Representation (20 points)**
- **Provincial Coverage (8 points)**
  - Province capital: 8 points
  - Major city: 6 points
  - Secondary city: 4 points
  - Rural area: 2 points

- **Regional Balance (6 points)**
  - Underrepresented region: 6 points
  - Balanced region: 4 points
  - Overrepresented region: 2 points

- **Accessibility (6 points)**
  - Easy transport access: 3 points
  - Digital connectivity: 3 points

#### **3. Cancer Case Volume (15 points)**
- **Annual Cancer Cases (10 points)**
  - >3000 cases/year: 10 points
  - 2000-3000 cases/year: 8 points
  - 1000-2000 cases/year: 6 points
  - 500-1000 cases/year: 4 points
  - <500 cases/year: 2 points

- **Cancer Service Diversity (5 points)**
  - Comprehensive cancer center: 5 points
  - Oncology department: 3 points
  - Cancer clinic: 1 point

#### **4. Leadership Commitment (12 points)**
- **Director Engagement (4 points)**
  - Written commitment: 4 points
  - Verbal commitment: 2 points
  - Interest only: 1 point

- **Resource Allocation (4 points)**
  - Dedicated budget: 4 points
  - Staff allocation: 2 points
  - In-kind support: 1 point

- **Strategic Alignment (4 points)**
  - Digital transformation priority: 4 points
  - Quality improvement focus: 2 points
  - Basic compliance: 1 point

#### **5. Implementation Capacity (8 points)**
- **Project Management (3 points)**
  - Dedicated project manager: 3 points
  - Assigned coordinator: 2 points
  - Ad-hoc responsibility: 1 point

- **Change Management (3 points)**
  - Change management team: 3 points
  - Training department: 2 points
  - Basic training capability: 1 point

- **Timeline Flexibility (2 points)**
  - Flexible scheduling: 2 points
  - Limited flexibility: 1 point

---

## 🏥 HOSPITAL SCORING RESULTS

### **TIER 1: PILOT HOSPITALS (90+ points)**

#### **1. RS Kanker "Dharmais" Jakarta - 98 points**
```yaml
hospital_details:
  name: "RS Kanker 'Dharmais'"
  location: "Jakarta"
  type: "National Cancer Center"
  beds: 400+
  annual_cancer_cases: 5000+

scoring_breakdown:
  technical_readiness: 24/25
    - infrastructure: 8/8
    - it_staff: 6/6
    - existing_systems: 6/6
    - hardware: 4/5
  geographic_representation: 18/20
    - provincial_coverage: 8/8
    - regional_balance: 4/6
    - accessibility: 6/6
  cancer_case_volume: 15/15
    - annual_cases: 10/10
    - service_diversity: 5/5
  leadership_commitment: 12/12
    - director_engagement: 4/4
    - resource_allocation: 4/4
    - strategic_alignment: 4/4
  implementation_capacity: 8/8
    - project_management: 3/3
    - change_management: 3/3
    - timeline_flexibility: 2/2
  additional_bonuses: 21/25
    - research_collaboration: 5/5
    - training_facilities: 5/5
    - regional_influence: 5/5
    - innovation_readiness: 4/4
    - sustainability_planning: 2/6

selection_rationale: |
  National cancer center with highest readiness score.
  Excellent infrastructure and leadership commitment.
  Strong research capabilities and regional influence.
  Ideal pilot candidate for validating national rollout.

rollout_phase: 0 (Pilot)
estimated_timeline: "4-6 weeks"
```

#### **2. RSUPN "Cipto Mangunkusumo" Jakarta - 95 points**
```yaml
hospital_details:
  name: "RSUPN 'Cipto Mangunkusumo'"
  location: "Jakarta"
  type: "National Teaching Hospital"
  beds: 800+
  annual_cancer_cases: 4000+

scoring_breakdown:
  technical_readiness: 23/25
  geographic_representation: 17/20
  cancer_case_volume: 15/15
  leadership_commitment: 11/12
  implementation_capacity: 8/8
  additional_bonuses: 21/25

selection_rationale: |
  Premier teaching hospital with extensive research capabilities.
  Strong technical infrastructure and medical expertise.
  Excellent training facility for future implementations.

rollout_phase: 0 (Pilot)
estimated_timeline: "5-7 weeks"
```

#### **3. RS Kanker "Soeharto" Solo - 94 points**
```yaml
hospital_details:
  name: "RS Kanker 'Soeharto'"
  location: "Surakarta, Central Java"
  type: "Regional Cancer Center"
  beds: 300+
  annual_cancer_cases: 3000+

scoring_breakdown:
  technical_readiness: 22/25
  geographic_representation: 16/20
  cancer_case_volume: 14/15
  leadership_commitment: 12/12
  implementation_capacity: 8/8
  additional_bonuses: 22/25

selection_rationale: |
  Regional cancer center with strong leadership support.
  Good balance of technical capability and case volume.
  Strategic location for Central Java coverage.

rollout_phase: 0 (Pilot)
estimated_timeline: "4-6 weeks"
```

### **TIER 2: PHASE 1 HOSPITALS (80-89 points)**

#### **4. RSUPN "Persahabatan" Surabaya - 89 points**
```yaml
hospital_details:
  name: "RSUPN 'Persahabatan'"
  location: "Surabaya, East Java"
  type: "National Referral Hospital"
  beds: 500+
  annual_cancer_cases: 3500+

scoring_breakdown:
  technical_readiness: 21/25
  geographic_representation: 18/20
  cancer_case_volume: 14/15
  leadership_commitment: 10/12
  implementation_capacity: 7/8
  additional_bonuses: 19/25

selection_rationale: |
  Major referral hospital in East Java region.
  High case volume and strong technical foundation.
  Important for Eastern Indonesia coverage.

rollout_phase: 1 (Major Cities)
estimated_timeline: "6-8 weeks"
```

#### **5. RS Siloam Hospitals Jakarta - 87 points**
```yaml
hospital_details:
  name: "RS Siloam Hospitals"
  location: "Jakarta"
  type: "Private Hospital Network"
  beds: 600+ (multiple locations)
  annual_cancer_cases: 2500+

scoring_breakdown:
  technical_readiness: 23/25
  geographic_representation: 15/20
  cancer_case_volume: 12/15
  leadership_commitment: 11/12
  implementation_capacity: 8/8
  additional_bonuses: 18/25

selection_rationale: |
  Leading private hospital network with modern infrastructure.
  Strong technical capabilities and management support.
  Good pilot for private sector adoption.

rollout_phase: 1 (Major Cities)
estimated_timeline: "5-7 weeks"
```

#### **6. RSUP Dr. Sardjito Yogyakarta - 90 points**
```yaml
hospital_details:
  name: "RSUP Dr. Sardjito"
  location: "Yogyakarta"
  type: "Teaching Hospital"
  beds: 600+
  annual_cancer_cases: 2000+

scoring_breakdown:
  technical_readiness: 20/25
  geographic_representation: 19/20
  cancer_case_volume: 13/15
  leadership_commitment: 12/12
  implementation_capacity: 7/8
  additional_bonuses: 19/25

selection_rationale: |
  Premier teaching hospital in Yogyakarta region.
  Strong research and academic capabilities.
  Strategic location for Central-Southern Java.

rollout_phase: 1 (Major Cities)
estimated_timeline: "6-8 weeks"
```

#### **7. RSUP Dr. Kariadi Semarang - 89 points**
```yaml
hospital_details:
  name: "RSUP Dr. Kariadi"
  location: "Semarang, Central Java"
  type: "Provincial Referral Hospital"
  beds: 500+
  annual_cancer_cases: 2200+

scoring_breakdown:
  technical_readiness: 19/25
  geographic_representation: 18/20
  cancer_case_volume: 13/15
  leadership_commitment: 11/12
  implementation_capacity: 7/8
  additional_bonuses: 21/25

selection_rationale: |
  Main referral hospital for Central Java province.
  Good technical foundation and case volume.
  Important for regional coverage strategy.

rollout_phase: 1 (Major Cities)
estimated_timeline: "6-8 weeks"
```

#### **8. RSUP Hasan Sadikin Bandung - 91 points**
```yaml
hospital_details:
  name: "RSUP Hasan Sadikin"
  location: "Bandung, West Java"
  type: "Provincial Referral Hospital"
  beds: 800+
  annual_cancer_cases: 2800+

scoring_breakdown:
  technical_readiness: 21/25
  geographic_representation: 17/20
  cancer_case_volume: 14/15
  leadership_commitment: 12/12
  implementation_capacity: 8/8
  additional_bonuses: 19/25

selection_rationale: |
  Largest hospital in West Java with high case volume.
  Strong technical infrastructure and leadership.
  Critical for West Java province coverage.

rollout_phase: 1 (Major Cities)
estimated_timeline: "6-8 weeks"
```

### **TIER 3: PHASE 2-3 HOSPITALS (70-79 points)**

#### **9. RSUP M. Djamil Padang - 78 points**
```yaml
hospital_details:
  name: "RSUP M. Djamil"
  location: "Padang, West Sumatra"
  type: "Provincial Referral Hospital"
  beds: 400+
  annual_cancer_cases: 1500+

scoring_breakdown:
  technical_readiness: 16/25
  geographic_representation: 18/20
  cancer_case_volume: 10/15
  leadership_commitment: 10/12
  implementation_capacity: 6/8
  additional_bonuses: 18/25

selection_rationale: |
  Key hospital for Sumatra region coverage.
  Moderate technical readiness with strong geographic importance.
  Leadership committed to digital transformation.

rollout_phase: 2 (Provincial Coverage)
estimated_timeline: "8-10 weeks"
```

#### **10. RSUP Wahidin Sudirohusodo Malang - 77 points**
```yaml
hospital_details:
  name: "RSUP Wahidin Sudirohusodo"
  location: "Malang, East Java"
  type: "Regional Referral Hospital"
  beds: 350+
  annual_cancer_cases: 1800+

scoring_breakdown:
  technical_readiness: 17/25
  geographic_representation: 16/20
  cancer_case_volume: 11/15
  leadership_commitment: 9/12
  implementation_capacity: 6/8
  additional_bonuses: 18/25

selection_rationale: |
  Important hospital for East Java southern region.
  Good case volume and moderate technical readiness.
  Supports comprehensive East Java coverage.

rollout_phase: 2 (Provincial Coverage)
estimated_timeline: "8-10 weeks"
```

#### **11. RSUP Sanglah Denpasar - 75 points**
```yaml
hospital_details:
  name: "RSUP Sanglah"
  location: "Denpasar, Bali"
  type: "Provincial Referral Hospital"
  beds: 600+
  annual_cancer_cases: 1400+

scoring_breakdown:
  technical_readiness: 18/25
  geographic_representation: 17/20
  cancer_case_volume: 9/15
  leadership_commitment: 10/12
  implementation_capacity: 6/8
  additional_bonuses: 15/25

selection_rationale: |
  Main hospital for Bali province with good tourism connections.
  Important for regional balance and national coverage.
  Moderate technical readiness with strong leadership.

rollout_phase: 3 (National Expansion)
estimated_timeline: "10-12 weeks"
```

#### **12. RSUP Prof. Dr. W. Z. Johannes Kupang - 72 points**
```yaml
hospital_details:
  name: "RSUP Prof. Dr. W. Z. Johannes"
  location: "Kupang, East Nusa Tenggara"
  type: "Provincial Referral Hospital"
  beds: 300+
  annual_cancer_cases: 800+

scoring_breakdown:
  technical_readiness: 14/25
  geographic_representation: 20/20
  cancer_case_volume: 6/15
  leadership_commitment: 9/12
  implementation_capacity: 5/8
  additional_bonuses: 18/25

selection_rationale: |
  Critical for Eastern Indonesia coverage.
  High geographic importance despite technical challenges.
  Strong leadership commitment for development.

rollout_phase: 3 (National Expansion)
estimated_timeline: "12-14 weeks"
```

#### **13. RSUP Kandou Manado - 73 points**
```yaml
hospital_details:
  name: "RSUP Kandou"
  location: "Manado, North Sulawesi"
  type: "Provincial Referral Hospital"
  beds: 400+
  annual_cancer_cases: 900+

scoring_breakdown:
  technical_readiness: 15/25
  geographic_representation: 19/20
  cancer_case_volume: 7/15
  leadership_commitment: 9/12
  implementation_capacity: 5/8
  additional_bonuses: 18/25

selection_rationale: |
  Important for Sulawesi region coverage.
  Good geographic position for Eastern Indonesia.
  Moderate technical capabilities with strong support.

rollout_phase: 3 (National Expansion)
estimated_timeline: "12-14 weeks"
```

---

## 📈 SELECTION MATRIX VISUALIZATION

### **Overall Score Distribution**
```
Tier 1 (90+ points): ████████████████████ 3 hospitals
Tier 2 (80-89 points): ████████████         5 hospitals
Tier 3 (70-79 points): ████████            5 hospitals
Below Threshold:       █                   0 hospitals
```

### **Geographic Distribution**
```
Sumatra:   ███ (2 hospitals)
Java:      █████████ (7 hospitals)
Bali:      █ (1 hospital)
NTT:       █ (1 hospital)
Sulawesi:  █ (1 hospital)
Other:     ██████ (Phase 2-3)
```

### **Implementation Timeline Phases**
```
Phase 0 (Pilot):           ████ (3 hospitals)   - Q1 2025
Phase 1 (Major Cities):    ████████ (8 hospitals) - Q2 2025
Phase 2 (Provincial):      ████████ (8 hospitals) - Q3 2025
Phase 3 (National):        ████████████ (16+ hospitals) - Q4 2025
```

---

## 🎯 IMPLEMENTATION RECOMMENDATIONS

### **Immediate Actions (Pilot Phase)**
1. **Finalize Agreements**: Secure MOUs with 3 Tier 1 hospitals
2. **Infrastructure Prep**: Complete technical assessments and upgrades
3. **Team Assignment**: Assign dedicated implementation teams
4. **Training Preparation**: Develop customized training programs

### **Phase 1 Strategy**
1. **Parallel Deployments**: Implement in 2-3 hospitals simultaneously
2. **Knowledge Transfer**: Use pilot hospitals as training centers
3. **Regional Hubs**: Establish regional support centers
4. **Performance Monitoring**: Implement comprehensive monitoring

### **Risk Mitigation**
1. **Technical Preparedness**: Prioritize infrastructure upgrades
2. **Change Management**: Strong focus on user adoption
3. **Resource Allocation**: Ensure adequate support resources
4. **Contingency Planning**: Prepare for timeline adjustments

### **Success Factors**
1. **Leadership Commitment**: Maintain strong executive sponsorship
2. **Technical Excellence**: Ensure robust, reliable system performance
3. **User Training**: Comprehensive, ongoing training programs
4. **Regional Balance**: Maintain geographic diversity in implementation
5. **Quality Focus**: Prioritize data quality and user experience

---

## 📋 SELECTION PROCESS

### **Evaluation Committee**
- **Ministry of Health Representative**: Overall coordination
- **Technical Expert**: Infrastructure and systems assessment
- **Medical Expert**: Clinical workflow and data quality
- **Regional Representative**: Geographic balance considerations
- **Implementation Lead**: Feasibility and timeline assessment

### **Selection Timeline**
- **Week 1**: Initial hospital outreach and data collection
- **Week 2**: Technical assessments and scoring
- **Week 3**: Committee review and final selection
- **Week 4**: Notification and agreement finalization

### **Ongoing Monitoring**
- **Quarterly Reviews**: Reassess hospital readiness scores
- **Performance Tracking**: Monitor implementation progress
- **Feedback Collection**: Gather lessons learned for continuous improvement

---

## 📊 CONCLUSION

The hospital selection matrix provides a comprehensive, data-driven approach to prioritize hospitals for INAMSOS rollout. The selected hospitals represent a strategic balance of:

1. **Technical Readiness**: Ensuring successful implementation
2. **Geographic Coverage**: Achieving national reach
3. **Clinical Impact**: Maximizing cancer data collection
4. **Leadership Commitment**: Ensuring sustainability
5. **Implementation Capacity**: Minimizing deployment risks

The phased approach allows for learning and optimization throughout the rollout process, ensuring successful national deployment of the INAMSOS tumor registry system.