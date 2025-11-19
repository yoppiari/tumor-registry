-- CreateEnum
CREATE TYPE "medical"."study_types" AS ENUM ('OBSERVATIONAL', 'INTERVENTIONAL', 'CASE_CONTROL', 'COHORT', 'CROSS_SECTIONAL', 'CASE_SERIES', 'META_ANALYSIS', 'SYSTEMATIC_REVIEW', 'QUALITATIVE', 'MIXED_METHODS');

-- CreateEnum
CREATE TYPE "medical"."research_request_statuses" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'UNDER_REVIEW', 'ETHICS_REVIEW', 'APPROVED', 'REJECTED', 'CONDITIONS_MET', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "medical"."ethics_statuses" AS ENUM ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED', 'RESUBMITTED', 'EXEMPTED', 'WAIVED');

-- CreateEnum
CREATE TYPE "medical"."research_priorities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "medical"."approval_levels" AS ENUM ('CENTER_DIRECTOR', 'ETHICS_COMMITTEE', 'DATA_STEWARD', 'PRIVACY_OFFICER', 'NATIONAL_ADMIN', 'SYSTEM_ADMIN');

-- CreateEnum
CREATE TYPE "medical"."approval_statuses" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CONDITIONS', 'DELEGATED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "medical"."collaboration_roles" AS ENUM ('PRINCIPAL_INVESTIGATOR', 'CO_INVESTIGATOR', 'STATISTICIAN', 'DATA_ANALYST', 'CLINICAL_COORDINATOR', 'RESEARCH_ASSISTANT', 'ETHICS_ADVISOR', 'SUBJECT_MATTER_EXPERT', 'CONSULTANT', 'STUDENT_RESEARCHER');

-- CreateEnum
CREATE TYPE "medical"."collaboration_statuses" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "medical"."data_access_levels" AS ENUM ('LIMITED', 'AGGREGATE_ONLY', 'DEIDENTIFIED', 'LIMITED_IDENTIFIABLE', 'FULL_ACCESS');

-- CreateEnum
CREATE TYPE "medical"."session_types" AS ENUM ('QUERY', 'EXPORT', 'ANALYSIS', 'VISUALIZATION', 'REPORT_GENERATION', 'DATA_VALIDATION');

-- CreateEnum
CREATE TYPE "medical"."compliance_statuses" AS ENUM ('COMPLIANT', 'WARNING', 'VIOLATION', 'SUSPENDED', 'INVESTIGATION');

-- CreateEnum
CREATE TYPE "medical"."publication_types" AS ENUM ('JOURNAL_ARTICLE', 'CONFERENCE_PAPER', 'BOOK_CHAPTER', 'THESIS', 'DISSERTATION', 'TECHNICAL_REPORT', 'PREPRINT', 'DATA_PAPER', 'REVIEW_ARTICLE', 'EDITORIAL');

-- CreateEnum
CREATE TYPE "medical"."publication_statuses" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'PUBLISHED', 'REJECTED', 'WITHDRAWN', 'IN_PRESS');

-- CreateEnum
CREATE TYPE "medical"."peer_review_statuses" AS ENUM ('PENDING', 'UNDER_REVIEW', 'MAJOR_REVISION', 'MINOR_REVISION', 'ACCEPTED', 'REJECTED', 'REVISE_AND_RESUBMIT');

-- CreateEnum
CREATE TYPE "medical"."impact_metric_types" AS ENUM ('PUBLICATIONS', 'CITATIONS', 'POLICY_IMPACT', 'CLINICAL_GUIDELINES', 'PATENTS', 'GRANT_FUNDING', 'MEDIA_COVERAGE', 'PATIENT_OUTCOMES', 'SCREENING_RATES', 'SURVIVAL_IMPROVEMENT', 'COST_SAVINGS', 'QUALITY_METRICS');

-- CreateEnum
CREATE TYPE "medical"."data_qualities" AS ENUM ('EXCELLENT', 'GOOD', 'STANDARD', 'POOR', 'INCOMPLETE');

-- CreateTable
CREATE TABLE "medical"."research_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "principalInvestigatorId" TEXT NOT NULL,
    "studyType" "medical"."study_types" NOT NULL,
    "objectives" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "inclusionCriteria" TEXT NOT NULL,
    "exclusionCriteria" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "requiresEthicsApproval" BOOLEAN NOT NULL DEFAULT false,
    "dataRequested" TEXT NOT NULL,
    "confidentialityRequirements" TEXT,
    "fundingSource" TEXT,
    "collaborators" TEXT,
    "status" "medical"."research_request_statuses" NOT NULL DEFAULT 'PENDING_REVIEW',
    "ethicsStatus" "medical"."ethics_statuses" NOT NULL DEFAULT 'NOT_REQUIRED',
    "ethicsApprovalNumber" TEXT,
    "ethicsApprovalDate" TIMESTAMP(3),
    "priority" "medical"."research_priorities" NOT NULL DEFAULT 'MEDIUM',
    "expectedOutcomes" TEXT,
    "riskAssessment" TEXT,
    "dataRetentionPeriod" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_approvals" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "level" "medical"."approval_levels" NOT NULL,
    "status" "medical"."approval_statuses" NOT NULL,
    "comments" TEXT,
    "conditions" TEXT,
    "approvedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "delegationAllowed" BOOLEAN NOT NULL DEFAULT false,
    "delegatedToId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_collaborations" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "role" "medical"."collaboration_roles" NOT NULL,
    "responsibilities" TEXT,
    "affiliation" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "medical"."collaboration_statuses" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "contributionLevel" TEXT,
    "expertise" TEXT,
    "conflictOfInterest" TEXT,
    "dataAccessLevel" "medical"."data_access_levels" NOT NULL DEFAULT 'LIMITED',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."data_access_sessions" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionType" "medical"."session_types" NOT NULL,
    "accessLevel" "medical"."data_access_levels" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "dataAccessed" TEXT,
    "queriesExecuted" TEXT,
    "purpose" TEXT,
    "complianceStatus" "medical"."compliance_statuses" NOT NULL DEFAULT 'COMPLIANT',
    "violationReason" TEXT,
    "automatedMonitoring" BOOLEAN NOT NULL DEFAULT true,
    "approvalReference" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_access_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_publications" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT,
    "authors" TEXT NOT NULL,
    "journal" TEXT,
    "publicationDate" TIMESTAMP(3),
    "volume" TEXT,
    "issue" TEXT,
    "pages" TEXT,
    "doi" TEXT,
    "pmid" TEXT,
    "publicationType" "medical"."publication_types" NOT NULL,
    "status" "medical"."publication_statuses" NOT NULL DEFAULT 'DRAFT',
    "peerReviewStatus" "medical"."peer_review_statuses" NOT NULL DEFAULT 'PENDING',
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "openAccess" BOOLEAN NOT NULL DEFAULT false,
    "license" TEXT,
    "keywords" TEXT,
    "fundingAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "dataAvailability" TEXT,
    "ethicalConsiderations" TEXT,
    "limitations" TEXT,
    "conflictsOfInterest" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."research_impact_metrics" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "metricType" "medical"."impact_metric_types" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "methodology" TEXT,
    "baseline" DOUBLE PRECISION,
    "target" DOUBLE PRECISION,
    "category" TEXT,
    "tags" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_impact_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."cancer_geographic_data" (
    "id" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "regency" TEXT,
    "district" TEXT,
    "cancerType" TEXT NOT NULL,
    "stage" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "count" INTEGER NOT NULL,
    "population" INTEGER,
    "incidenceRate" DOUBLE PRECISION,
    "mortalityRate" DOUBLE PRECISION,
    "ageStandardizedRate" DOUBLE PRECISION,
    "gender" "medical"."genders",
    "ageGroup" TEXT,
    "socioeconomicLevel" TEXT,
    "urbanRural" TEXT,
    "coordinates" JSONB,
    "dataQuality" "medical"."data_qualities" NOT NULL DEFAULT 'STANDARD',
    "reportingCompleteness" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancer_geographic_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."cancer_aggregate_stats" (
    "id" TEXT NOT NULL,
    "cancerType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalCases" INTEGER NOT NULL,
    "maleCases" INTEGER NOT NULL,
    "femaleCases" INTEGER NOT NULL,
    "ageGroup_0_14" INTEGER NOT NULL,
    "ageGroup_15_24" INTEGER NOT NULL,
    "ageGroup_25_44" INTEGER NOT NULL,
    "ageGroup_45_64" INTEGER NOT NULL,
    "ageGroup_65_plus" INTEGER NOT NULL,
    "earlyStage" INTEGER NOT NULL,
    "lateStage" INTEGER NOT NULL,
    "mortalityRate" DOUBLE PRECISION NOT NULL,
    "survivalRate" DOUBLE PRECISION NOT NULL,
    "mostAffectedProvince" TEXT,
    "trendDirection" TEXT,
    "trendPercent" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancer_aggregate_stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medical"."research_requests" ADD CONSTRAINT "research_requests_principalInvestigatorId_fkey" FOREIGN KEY ("principalInvestigatorId") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_requests" ADD CONSTRAINT "research_requests_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_approvals" ADD CONSTRAINT "research_approvals_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_approvals" ADD CONSTRAINT "research_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_approvals" ADD CONSTRAINT "research_approvals_delegatedToId_fkey" FOREIGN KEY ("delegatedToId") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_approvals" ADD CONSTRAINT "research_approvals_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_collaborations" ADD CONSTRAINT "research_collaborations_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_collaborations" ADD CONSTRAINT "research_collaborations_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_collaborations" ADD CONSTRAINT "research_collaborations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."data_access_sessions" ADD CONSTRAINT "data_access_sessions_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."data_access_sessions" ADD CONSTRAINT "data_access_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."data_access_sessions" ADD CONSTRAINT "data_access_sessions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_publications" ADD CONSTRAINT "research_publications_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_publications" ADD CONSTRAINT "research_publications_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_impact_metrics" ADD CONSTRAINT "research_impact_metrics_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_impact_metrics" ADD CONSTRAINT "research_impact_metrics_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."research_impact_metrics" ADD CONSTRAINT "research_impact_metrics_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
