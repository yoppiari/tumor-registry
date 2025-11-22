/*
  Warnings:

  - You are about to drop the `medical_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medical"."medical_images" DROP CONSTRAINT "medical_images_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "medical"."medical_images" DROP CONSTRAINT "medical_images_patientId_fkey";

-- DropForeignKey
ALTER TABLE "medical"."medical_images" DROP CONSTRAINT "medical_images_recordId_fkey";

-- DropForeignKey
ALTER TABLE "medical"."medical_images" DROP CONSTRAINT "medical_images_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "medical"."medical_images" DROP CONSTRAINT "medical_images_uploadedBy_fkey";

-- DropTable
DROP TABLE "medical"."medical_images";

-- DropEnum
DROP TYPE "medical"."image_categories";

-- DropEnum
DROP TYPE "medical"."medical_image_types";

-- CreateTable
CREATE TABLE "system"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "system"."refresh_tokens"("token");
