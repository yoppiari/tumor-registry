-- CreateEnum
CREATE TYPE "medical"."medical_image_types" AS ENUM ('HISTOLOGY', 'RADIOLOGY', 'CLINICAL_PHOTO', 'PATHOLOGY', 'ENDOSCOPY', 'ULTRASOUND', 'CT_SCAN', 'MRI', 'XRAY', 'PET_SCAN', 'MAMMOGRAPHY', 'OTHER');

-- CreateEnum
CREATE TYPE "medical"."image_categories" AS ENUM ('HISTOLOGY', 'RADIOLOGY', 'CLINICAL', 'PATHOLOGY', 'DIAGNOSTIC', 'SURGICAL', 'FOLLOW_UP', 'SCREENING', 'OTHER');

-- CreateTable
CREATE TABLE "medical"."medical_images" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordId" TEXT,
    "imageType" "medical"."medical_image_types" NOT NULL,
    "category" "medical"."image_categories" NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "isDicom" BOOLEAN NOT NULL DEFAULT false,
    "dicomMetadata" JSONB,
    "thumbnailPath" TEXT,
    "compressedPath" TEXT,
    "annotations" JSONB,
    "description" TEXT,
    "findings" TEXT,
    "bodyPart" TEXT,
    "modality" TEXT,
    "studyDate" TIMESTAMP(3),
    "seriesNumber" TEXT,
    "instanceNumber" TEXT,
    "isCompressed" BOOLEAN NOT NULL DEFAULT false,
    "compressionRatio" DOUBLE PRECISION,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "quality" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medical"."medical_images" ADD CONSTRAINT "medical_images_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "medical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."medical_images" ADD CONSTRAINT "medical_images_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "medical"."medical_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."medical_images" ADD CONSTRAINT "medical_images_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."medical_images" ADD CONSTRAINT "medical_images_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical"."medical_images" ADD CONSTRAINT "medical_images_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "system"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
