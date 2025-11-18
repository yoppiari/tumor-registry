-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "medical";

-- CreateEnum
CREATE TYPE "medical"."genders" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "medical"."blood_types" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "medical"."marital_statuses" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "medical"."record_types" AS ENUM ('INITIAL', 'PROGRESS', 'DISCHARGE', 'CONSULTATION', 'EMERGENCY', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "medical"."diagnosis_types" AS ENUM ('PRIMARY', 'SECONDARY', 'ADMITTING', 'DISCHARGE', 'COMPLICATION');

-- CreateEnum
CREATE TYPE "medical"."diagnosis_severities" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "medical"."diagnosis_statuses" AS ENUM ('ACTIVE', 'RESOLVED', 'CHRONIC', 'RECURRING');

-- CreateEnum
CREATE TYPE "medical"."allergen_types" AS ENUM ('DRUG', 'FOOD', 'ENVIRONMENTAL', 'LATEX', 'OTHER');

-- CreateEnum
CREATE TYPE "medical"."allergy_severities" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'ANAPHYLAXIS');

-- CreateEnum
CREATE TYPE "medical"."allergy_statuses" AS ENUM ('ACTIVE', 'RESOLVED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "medical"."medication_routes" AS ENUM ('ORAL', 'INJECTION', 'INTRAVENOUS', 'TOPICAL', 'INHALATION', 'RECTAL', 'NASAL', 'OPHTHALMIC', 'OTIC');

-- CreateEnum
CREATE TYPE "medical"."result_statuses" AS ENUM ('PENDING', 'COMPLETED', 'ABNORMAL', 'CRITICAL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "medical"."procedure_statuses" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'COMPLICATION');

-- CreateEnum
CREATE TYPE "medical"."consent_types" AS ENUM ('TREATMENT', 'SURGERY', 'ANESTHESIA', 'BLOOD_TRANSFUSION', 'RESEARCH', 'PHOTOGRAPHY', 'TELEHEALTH', 'PRIVACY');

-- CreateEnum
CREATE TYPE "medical"."visit_types" AS ENUM ('OUTPATIENT', 'INPATIENT', 'EMERGENCY', 'DAY_CARE', 'HOME_VISIT', 'TELEHEALTH');

-- CreateEnum
CREATE TYPE "medical"."visit_statuses" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "medical"."patients" (
    "id" TEXT NOT NULL,
    "medicalRecordNumber" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT,
    "gender" "medical"."genders" NOT NULL,
    "bloodType" "medical"."blood_types",
    "religion" TEXT,
    "maritalStatus" "medical"."marital_statuses",
    "occupation" TEXT,
    "education" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "province" TEXT,
    "regency" TEXT,
    "district" TEXT,
    "village" TEXT,
    "postalCode" TEXT,
    "emergencyContact" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeceased" BOOLEAN NOT NULL DEFAULT false,
    "dateOfDeath" TIMESTAMP(3),
    "causeOfDeath" TEXT,
    "centerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."medical_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordType" "medical"."record_types" NOT NULL,
    "recordNumber" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "chiefComplaint" TEXT,
    "historyOfPresent" TEXT,
    "pastMedical" JSONB,
    "surgicalHistory" JSONB,
    "familyHistory" JSONB,
    "socialHistory" JSONB,
    "reviewOfSystems" JSONB,
    "physicalExam" JSONB,
    "assessment" TEXT,
    "plan" TEXT,
    "notes" TEXT,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_diagnoses" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "diagnosisCode" TEXT NOT NULL,
    "diagnosisName" TEXT NOT NULL,
    "diagnosisType" "medical"."diagnosis_types" NOT NULL,
    "severity" "medical"."diagnosis_severities",
    "status" "medical"."diagnosis_statuses" NOT NULL,
    "onsetDate" TIMESTAMP(3),
    "resolutionDate" TIMESTAMP(3),
    "notes" TEXT,
    "providerId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_allergies" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "allergenType" "medical"."allergen_types" NOT NULL,
    "allergenName" TEXT NOT NULL,
    "reaction" TEXT,
    "severity" "medical"."allergy_severities" NOT NULL,
    "status" "medical"."allergy_statuses" NOT NULL,
    "onsetDate" TIMESTAMP(3),
    "notes" TEXT,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_medications" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "genericName" TEXT,
    "brandName" TEXT,
    "dosage" TEXT,
    "frequency" TEXT,
    "route" "medical"."medication_routes" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "purpose" TEXT,
    "instructions" TEXT,
    "sideEffects" TEXT,
    "prescribedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."vital_signs" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "painScale" INTEGER,
    "bloodGlucose" DOUBLE PRECISION,
    "notes" TEXT,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."laboratory_results" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "normalRange" TEXT,
    "unit" TEXT,
    "status" "medical"."result_statuses" NOT NULL,
    "notes" TEXT,
    "orderedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratory_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."radiology_results" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "examinationType" TEXT NOT NULL,
    "indication" TEXT,
    "findings" TEXT,
    "impression" TEXT,
    "recommendation" TEXT,
    "status" "medical"."result_statuses" NOT NULL,
    "radiologistId" TEXT NOT NULL,
    "examinationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "radiology_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_procedures" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "procedureName" TEXT NOT NULL,
    "procedureCode" TEXT,
    "indication" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "medical"."procedure_statuses" NOT NULL,
    "complications" TEXT,
    "outcome" TEXT,
    "performedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_procedures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_consents" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "consentType" "medical"."consent_types" NOT NULL,
    "description" TEXT NOT NULL,
    "isConsented" BOOLEAN NOT NULL,
    "consentDate" TIMESTAMP(3) NOT NULL,
    "expiredDate" TIMESTAMP(3),
    "guardianName" TEXT,
    "guardianRelation" TEXT,
    "providerId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_visits" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "visitType" "medical"."visit_types" NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "dischargeDate" TIMESTAMP(3),
    "department" TEXT,
    "chiefComplaint" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "providerId" TEXT NOT NULL,
    "status" "medical"."visit_statuses" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."patient_insurances" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "memberNumber" TEXT,
    "planType" TEXT,
    "coverageType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_insurances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_medicalRecordNumber_key" ON "medical"."patients"("medicalRecordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_nik_key" ON "medical"."patients"("nik");

-- AddForeignKey
ALTER TABLE "medical"."patients" ADD CONSTRAINT "patients_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."medical_records" ADD CONSTRAINT "medical_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_diagnoses" ADD CONSTRAINT "patient_diagnoses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_allergies" ADD CONSTRAINT "patient_allergies_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_medications" ADD CONSTRAINT "patient_medications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."vital_signs" ADD CONSTRAINT "vital_signs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."laboratory_results" ADD CONSTRAINT "laboratory_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."radiology_results" ADD CONSTRAINT "radiology_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_procedures" ADD CONSTRAINT "patient_procedures_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_consents" ADD CONSTRAINT "patient_consents_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_visits" ADD CONSTRAINT "patient_visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."patient_insurances" ADD CONSTRAINT "patient_insurances_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
