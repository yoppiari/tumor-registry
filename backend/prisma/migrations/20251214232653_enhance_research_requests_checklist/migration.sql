-- AlterEnum: Add new status values to ResearchRequestStatus
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'SUBMITTED';
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'NEED_MORE_INFO';
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'APPROVED_WITH_CONDITIONS';
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'DATA_READY';
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'ACTIVE';
ALTER TYPE "medical"."research_request_statuses" ADD VALUE 'WITHDRAWN';

-- AlterTable: research_requests - Change default status and add new columns
ALTER TABLE "medical"."research_requests"
  ALTER COLUMN "status" SET DEFAULT 'DRAFT',
  ALTER COLUMN "submittedAt" DROP NOT NULL,
  ADD COLUMN "requestNumber" TEXT,
  ADD COLUMN "researchAbstract" TEXT,
  ADD COLUMN "researcherPhone" TEXT,
  ADD COLUMN "researcherInstitution" TEXT,
  ADD COLUMN "requestedDataFields" JSONB,
  ADD COLUMN "dataFilters" JSONB,
  ADD COLUMN "estimatedPatientCount" INTEGER,
  ADD COLUMN "dataSensitivityScore" INTEGER,
  ADD COLUMN "isAutoApprovalEligible" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "needsEthicsReview" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "needsDataProtectionReview" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "irbCertificateUrl" TEXT,
  ADD COLUMN "protocolUrl" TEXT,
  ADD COLUMN "proposalUrl" TEXT,
  ADD COLUMN "cvUrl" TEXT,
  ADD COLUMN "agreementSigned" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "agreementDate" TIMESTAMP(3),
  ADD COLUMN "dataExportGeneratedAt" TIMESTAMP(3),
  ADD COLUMN "dataExportUrl" TEXT,
  ADD COLUMN "dataExportFileSize" INTEGER,
  ADD COLUMN "dataDownloadedAt" TIMESTAMP(3),
  ADD COLUMN "dataDownloadCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: research_request_activities
CREATE TABLE "medical"."research_request_activities" (
    "id" TEXT NOT NULL,
    "researchRequestId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "statusFrom" TEXT,
    "statusTo" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_request_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique constraint on requestNumber
CREATE UNIQUE INDEX "research_requests_requestNumber_key" ON "medical"."research_requests"("requestNumber");

-- CreateIndex: indexes for research_requests
CREATE INDEX "research_requests_status_idx" ON "medical"."research_requests"("status");
CREATE INDEX "research_requests_priority_idx" ON "medical"."research_requests"("priority");
CREATE INDEX "research_requests_dataSensitivityScore_idx" ON "medical"."research_requests"("dataSensitivityScore");

-- CreateIndex: indexes for research_request_activities
CREATE INDEX "research_request_activities_researchRequestId_idx" ON "medical"."research_request_activities"("researchRequestId");
CREATE INDEX "research_request_activities_actorId_idx" ON "medical"."research_request_activities"("actorId");
CREATE INDEX "research_request_activities_action_idx" ON "medical"."research_request_activities"("action");

-- AddForeignKey: research_request_activities to research_requests
ALTER TABLE "medical"."research_request_activities" ADD CONSTRAINT "research_request_activities_researchRequestId_fkey" FOREIGN KEY ("researchRequestId") REFERENCES "medical"."research_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: research_request_activities to users
ALTER TABLE "medical"."research_request_activities" ADD CONSTRAINT "research_request_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
