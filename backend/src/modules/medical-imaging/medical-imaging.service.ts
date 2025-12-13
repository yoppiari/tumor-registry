import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class MedicalImagingService {
  private readonly logger = new Logger(MedicalImagingService.name);
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads/medical-images';
  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
      await mkdirAsync(path.join(this.uploadDir, 'thumbnails'), { recursive: true });
      await mkdirAsync(path.join(this.uploadDir, 'compressed'), { recursive: true });
    } catch (error) {
      this.logger.error('Error creating upload directories', error);
    }
  }

  async uploadImage(
    uploadDto: UploadImageDto,
    file: any,
    userId: string,
  ): Promise<any> {
    try {
      // Validate file
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException('File size exceeds maximum limit');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFilename = this.sanitizeFilename(file.originalname);
      const fileName = `${timestamp}-${sanitizedFilename}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Save original file
      await fs.promises.writeFile(filePath, file.buffer);

      // Get image dimensions
      let width: number | undefined;
      let height: number | undefined;
      let thumbnailPath: string | undefined;
      let compressedPath: string | undefined;
      let isCompressed = false;
      let compressionRatio: number | undefined;

      // Process image if it's a supported format
      if (this.isImageFormat(file.mimetype)) {
        try {
          const metadata = await sharp(file.buffer).metadata();
          width = metadata.width;
          height = metadata.height;

          // Generate thumbnail
          const thumbnailFileName = `thumb-${fileName}`;
          thumbnailPath = path.join(this.uploadDir, 'thumbnails', thumbnailFileName);
          await sharp(file.buffer)
            .resize(200, 200, { fit: 'inside' })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

          // Generate compressed version if original is large
          if (file.size > 5 * 1024 * 1024) { // 5MB
            const compressedFileName = `compressed-${fileName}`;
            compressedPath = path.join(this.uploadDir, 'compressed', compressedFileName);

            const compressedBuffer = await sharp(file.buffer)
              .jpeg({ quality: 75, mozjpeg: true })
              .toBuffer();

            await fs.promises.writeFile(compressedPath, compressedBuffer);
            isCompressed = true;
            compressionRatio = compressedBuffer.length / file.size;
          }
        } catch (error) {
          this.logger.warn('Error processing image, continuing without optimization', error);
        }
      }

      // Create database record
      const medicalImage = await this.prisma.medicalImage.create({
        data: {
          patientId: uploadDto.patientId,
          recordId: uploadDto.recordId,
          imageType: uploadDto.imageType,
          category: uploadDto.category,
          fileName,
          originalFileName: file.originalname,
          filePath,
          fileSize: BigInt(file.size),
          mimeType: file.mimetype,
          width,
          height,
          isDicom: uploadDto.isDicom || false,
          dicomMetadata: uploadDto.dicomMetadata,
          thumbnailPath,
          compressedPath,
          annotations: uploadDto.annotations,
          description: uploadDto.description,
          findings: uploadDto.findings,
          bodyPart: uploadDto.bodyPart,
          modality: uploadDto.modality,
          studyDate: uploadDto.studyDate ? new Date(uploadDto.studyDate) : undefined,
          seriesNumber: uploadDto.seriesNumber,
          instanceNumber: uploadDto.instanceNumber,
          isCompressed,
          compressionRatio,
          tags: uploadDto.tags || [],
          uploadedBy: userId,
          uploadedAt: new Date(),
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPLOAD_MEDICAL_IMAGE',
          resource: 'MedicalImage',
          details: {
            imageId: medicalImage.id,
            patientId: uploadDto.patientId,
            imageType: uploadDto.imageType,
            category: uploadDto.category,
            fileSize: file.size,
          },
        },
      });

      this.logger.log(`Medical image uploaded: ${medicalImage.id} for patient ${uploadDto.patientId}`);

      return {
        ...medicalImage,
        fileSize: medicalImage.fileSize.toString(),
      };
    } catch (error) {
      this.logger.error('Error uploading medical image', error);
      throw error;
    }
  }

  async findAll(
    patientId?: string,
    imageType?: string,
    category?: string,
    page = 1,
    limit = 50,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        isActive: true,
        isDeleted: false,
        ...(patientId && { patientId }),
        ...(imageType && { imageType }),
        ...(category && { category }),
      };

      const [images, total] = await Promise.all([
        this.prisma.medicalImage.findMany({
          where,
          orderBy: { uploadedAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.medicalImage.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        images: images.map(img => ({
          ...img,
          fileSize: img.fileSize.toString(),
        })),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error finding medical images', error);
      throw error;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const image = await this.prisma.medicalImage.findUnique({
        where: { id },
      });

      if (!image) {
        throw new NotFoundException(`Medical image with ID ${id} not found`);
      }

      if (image.isDeleted) {
        throw new NotFoundException(`Medical image with ID ${id} has been deleted`);
      }

      return {
        ...image,
        fileSize: image.fileSize.toString(),
      };
    } catch (error) {
      this.logger.error(`Error finding medical image by ID: ${id}`, error);
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateImageDto, userId: string): Promise<any> {
    try {
      const existingImage = await this.findById(id);

      const updatedImage = await this.prisma.medicalImage.update({
        where: { id },
        data: {
          ...(updateDto.description !== undefined && { description: updateDto.description }),
          ...(updateDto.findings !== undefined && { findings: updateDto.findings }),
          ...(updateDto.bodyPart !== undefined && { bodyPart: updateDto.bodyPart }),
          ...(updateDto.tags !== undefined && { tags: updateDto.tags }),
          ...(updateDto.annotations !== undefined && { annotations: updateDto.annotations }),
          ...(updateDto.quality !== undefined && { quality: updateDto.quality }),
          reviewedBy: userId,
          reviewedAt: new Date(),
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_MEDICAL_IMAGE',
          resource: 'MedicalImage',
          details: {
            imageId: id,
            changes: JSON.parse(JSON.stringify(updateDto)),
          },
        },
      });

      this.logger.log(`Medical image updated: ${id}`);

      return {
        ...updatedImage,
        fileSize: updatedImage.fileSize.toString(),
      };
    } catch (error) {
      this.logger.error(`Error updating medical image with ID: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<any> {
    try {
      const existingImage = await this.findById(id);

      // Soft delete
      const deletedImage = await this.prisma.medicalImage.update({
        where: { id },
        data: {
          isActive: false,
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_MEDICAL_IMAGE',
          resource: 'MedicalImage',
          details: {
            imageId: id,
            patientId: deletedImage.patientId,
          },
        },
      });

      this.logger.log(`Medical image deleted: ${id}`);

      return { message: 'Image deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting medical image with ID: ${id}`, error);
      throw error;
    }
  }

  async getImageFile(id: string): Promise<{ filePath: string; mimeType: string; fileName: string }> {
    try {
      const image = await this.findById(id);

      if (!fs.existsSync(image.filePath)) {
        throw new NotFoundException('Image file not found on disk');
      }

      return {
        filePath: image.filePath,
        mimeType: image.mimeType,
        fileName: image.originalFileName,
      };
    } catch (error) {
      this.logger.error(`Error getting image file for ID: ${id}`, error);
      throw error;
    }
  }

  async getThumbnail(id: string): Promise<{ filePath: string; mimeType: string }> {
    try {
      const image = await this.findById(id);

      if (!image.thumbnailPath || !fs.existsSync(image.thumbnailPath)) {
        throw new NotFoundException('Thumbnail not found');
      }

      return {
        filePath: image.thumbnailPath,
        mimeType: 'image/jpeg',
      };
    } catch (error) {
      this.logger.error(`Error getting thumbnail for ID: ${id}`, error);
      throw error;
    }
  }

  async categorizeImage(id: string, category: string, userId: string): Promise<any> {
    try {
      const image = await this.findById(id);

      const updatedImage = await this.prisma.medicalImage.update({
        where: { id },
        data: { category },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CATEGORIZE_MEDICAL_IMAGE',
          resource: 'MedicalImage',
          details: {
            imageId: id,
            oldCategory: image.category,
            newCategory: category,
          },
        },
      });

      this.logger.log(`Medical image categorized: ${id} as ${category}`);

      return {
        ...updatedImage,
        fileSize: updatedImage.fileSize.toString(),
      };
    } catch (error) {
      this.logger.error(`Error categorizing medical image with ID: ${id}`, error);
      throw error;
    }
  }

  async addAnnotations(id: string, annotations: any, userId: string): Promise<any> {
    try {
      const image = await this.findById(id);

      const updatedImage = await this.prisma.medicalImage.update({
        where: { id },
        data: {
          annotations: {
            ...((image.annotations as any) || {}),
            ...annotations,
            lastModifiedBy: userId,
            lastModifiedAt: new Date().toISOString(),
          },
        },
      });

      // Log audit
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ANNOTATE_MEDICAL_IMAGE',
          resource: 'MedicalImage',
          details: {
            imageId: id,
            annotations,
          },
        },
      });

      this.logger.log(`Annotations added to medical image: ${id}`);

      return {
        ...updatedImage,
        fileSize: updatedImage.fileSize.toString(),
      };
    } catch (error) {
      this.logger.error(`Error adding annotations to image with ID: ${id}`, error);
      throw error;
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  private isImageFormat(mimeType: string): boolean {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff'].includes(mimeType);
  }
}
