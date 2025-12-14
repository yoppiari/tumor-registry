import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { UploadClinicalPhotoDto } from './dto/upload-clinical-photo.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClinicalPhotosService {
  private readonly logger = new Logger(ClinicalPhotosService.name);
  private readonly uploadDir = process.env.CLINICAL_PHOTOS_DIR || './uploads/clinical-photos';
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await fs.promises.mkdir(this.uploadDir, { recursive: true });
      await fs.promises.mkdir(path.join(this.uploadDir, 'thumbnails'), { recursive: true });
    } catch (error) {
      this.logger.error('Error creating upload directories', error);
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  private isImageFormat(mimetype: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(mimetype);
  }

  async uploadPhoto(
    uploadDto: UploadClinicalPhotoDto,
    file: any,
    userId: string,
  ): Promise<any> {
    try {
      // Validate file
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (!this.isImageFormat(file.mimetype)) {
        throw new BadRequestException('Only JPG and PNG images are allowed');
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException('File size exceeds 10MB limit');
      }

      // Generate unique filename
      const fileExt = path.extname(file.originalname || file.filename);
      const uniqueFilename = `${uuidv4()}${fileExt}`;
      const filePath = path.join(this.uploadDir, uniqueFilename);

      // Save original file
      await fs.promises.writeFile(filePath, file.buffer);

      // Generate thumbnail
      const thumbnailFilename = `thumb-${uniqueFilename}`;
      const thumbnailPath = path.join(this.uploadDir, 'thumbnails', thumbnailFilename);

      await sharp(file.buffer)
        .resize(300, 300, { fit: 'inside' })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      // Create database record
      const clinicalPhoto = await this.prisma.clinicalPhoto.create({
        data: {
          patientId: uploadDto.patientId,
          fileUrl: `/uploads/clinical-photos/${uniqueFilename}`,
          fileName: uniqueFilename,
          fileSize: file.size,
          mimeType: file.mimetype,
          anatomicalLocation: uploadDto.anatomicalLocation,
          viewType: uploadDto.viewType,
          description: uploadDto.description,
          uploadedBy: userId,
        },
      });

      return {
        success: true,
        message: 'Clinical photo uploaded successfully',
        data: {
          id: clinicalPhoto.id,
          fileName: uniqueFilename,
          fileUrl: clinicalPhoto.fileUrl,
          fileSize: file.size,
          viewType: clinicalPhoto.viewType,
          uploadedAt: clinicalPhoto.uploadDate,
        },
      };
    } catch (error) {
      this.logger.error('Error uploading clinical photo', error);
      throw error;
    }
  }

  async uploadMultiplePhotos(
    patientId: string,
    photos: { file: any; viewType?: string; description?: string }[],
    userId: string,
  ): Promise<any> {
    const uploadedPhotos = [];

    for (const photo of photos) {
      const uploadDto: UploadClinicalPhotoDto = {
        patientId,
        viewType: photo.viewType as any,
        description: photo.description,
      };

      const result = await this.uploadPhoto(uploadDto, photo.file, userId);
      uploadedPhotos.push(result.data);
    }

    return {
      success: true,
      message: `${uploadedPhotos.length} clinical photos uploaded successfully`,
      data: uploadedPhotos,
    };
  }

  async getPhotosByPatientId(patientId: string): Promise<any> {
    const photos = await this.prisma.clinicalPhoto.findMany({
      where: { patientId },
      orderBy: { uploadDate: 'desc' },
    });

    return {
      success: true,
      data: photos,
      meta: {
        total: photos.length,
      },
    };
  }

  async deletePhoto(id: string, userId: string): Promise<any> {
    const photo = await this.prisma.clinicalPhoto.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException('Clinical photo not found');
    }

    // Delete file from disk
    const filePath = path.join(this.uploadDir, photo.fileName);
    const thumbnailPath = path.join(this.uploadDir, 'thumbnails', `thumb-${photo.fileName}`);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      if (fs.existsSync(thumbnailPath)) {
        await fs.promises.unlink(thumbnailPath);
      }
    } catch (error) {
      this.logger.warn('Error deleting photo files from disk', error);
    }

    // Delete from database
    await this.prisma.clinicalPhoto.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Clinical photo deleted successfully',
    };
  }
}
