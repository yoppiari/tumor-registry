-- CreateEnum
CREATE TYPE "system"."security_event_severities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "system"."offline_queue_statuses" AS ENUM ('PENDING', 'PROCESSING', 'SYNCED', 'FAILED', 'CONFLICT', 'RESOLVED');

-- DropForeignKey
ALTER TABLE "medical"."patients" DROP CONSTRAINT "patients_centerId_fkey";

-- CreateTable
CREATE TABLE "system"."password_policies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minLength" INTEGER DEFAULT 8,
    "requireUppercase" BOOLEAN NOT NULL DEFAULT true,
    "requireLowercase" BOOLEAN NOT NULL DEFAULT true,
    "requireNumbers" BOOLEAN NOT NULL DEFAULT true,
    "requireSpecialChars" BOOLEAN NOT NULL DEFAULT true,
    "preventReuse" INTEGER DEFAULT 5,
    "maxAge" INTEGER,
    "lockoutThreshold" INTEGER DEFAULT 5,
    "lockoutDuration" INTEGER,
    "organizationId" TEXT,
    "roleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."password_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."failed_login_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "failed_login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."account_lockouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lockedUntil" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unlockedAt" TIMESTAMP(3),

    CONSTRAINT "account_lockouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "userAgent" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "deviceType" TEXT DEFAULT 'unknown',
    "location" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "terminatedAt" TIMESTAMP(3),
    "terminationReason" TEXT,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."security_alerts" (
    "id" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,
    "severity" "system"."security_event_severities" NOT NULL,
    "affectedUsers" TEXT[],
    "description" TEXT NOT NULL,
    "mitigation" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "security_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical"."quality_metrics" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "completeness" INTEGER NOT NULL,
    "requiredCompleteness" INTEGER NOT NULL,
    "medicalCompleteness" INTEGER NOT NULL,
    "imageCount" INTEGER NOT NULL,
    "recommendations" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."offline_data_queue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "operation" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "localTimestamp" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB,
    "status" "system"."offline_queue_statuses" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "conflictData" JSONB,
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "errorDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offline_data_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_policies_name_key" ON "system"."password_policies"("name");

-- CreateIndex
CREATE INDEX "offline_data_queue_userId_status_idx" ON "system"."offline_data_queue"("userId", "status");

-- CreateIndex
CREATE INDEX "offline_data_queue_status_priority_idx" ON "system"."offline_data_queue"("status", "priority");

-- CreateIndex
CREATE INDEX "offline_data_queue_entityType_entityId_idx" ON "system"."offline_data_queue"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "medical"."patients" ADD CONSTRAINT "patients_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "system"."centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."offline_data_queue" ADD CONSTRAINT "offline_data_queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
