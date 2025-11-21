import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MedicalImagingService } from './medical-imaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UploadImageDto } from './dto/upload-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Medical Imaging')
@Controller('medical-imaging')
@UseGuards(JwtAuthGuard)
export class MedicalImagingController {
  constructor(private readonly medicalImagingService: MedicalImagingService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload medical image with metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        patientId: { type: 'string' },
        imageType: { type: 'string', enum: ['HISTOLOGY', 'RADIOLOGY', 'CLINICAL_PHOTO', 'PATHOLOGY', 'ENDOSCOPY', 'ULTRASOUND', 'CT_SCAN', 'MRI', 'XRAY', 'PET_SCAN', 'MAMMOGRAPHY', 'OTHER'] },
        category: { type: 'string', enum: ['HISTOLOGY', 'RADIOLOGY', 'CLINICAL', 'PATHOLOGY', 'DIAGNOSTIC', 'SURGICAL', 'FOLLOW_UP', 'SCREENING', 'OTHER'] },
        description: { type: 'string', required: false },
        findings: { type: 'string', required: false },
        bodyPart: { type: 'string', required: false },
        modality: { type: 'string', required: false },
        studyDate: { type: 'string', format: 'date-time', required: false },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadImageDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.medicalImagingService.uploadImage(uploadDto, file, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medical images with filters' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'imageType', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('imageType') imageType?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.medicalImagingService.findAll(
      patientId,
      imageType,
      category,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical image metadata by ID' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicalImagingService.findById(id);
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Download original image file' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image file retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getImageFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { filePath, mimeType, fileName } = await this.medicalImagingService.getImageFile(id);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get(':id/thumbnail')
  @ApiOperation({ summary: 'Get image thumbnail' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Thumbnail retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Thumbnail not found' })
  async getThumbnail(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { filePath, mimeType } = await this.medicalImagingService.getThumbnail(id);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update medical image metadata' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateImageDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.medicalImagingService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete medical image (soft delete)' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.medicalImagingService.delete(id, userId);
  }

  @Put(':id/categorize')
  @ApiOperation({ summary: 'Change image category' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['HISTOLOGY', 'RADIOLOGY', 'CLINICAL', 'PATHOLOGY', 'DIAGNOSTIC', 'SURGICAL', 'FOLLOW_UP', 'SCREENING', 'OTHER'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image categorized successfully' })
  async categorize(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('category') category: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.medicalImagingService.categorizeImage(id, category, userId);
  }

  @Post(':id/annotations')
  @ApiOperation({ summary: 'Add annotations to image' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        annotations: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Annotations added successfully' })
  async addAnnotations(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('annotations') annotations: any,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.medicalImagingService.addAnnotations(id, annotations, userId);
  }
}
