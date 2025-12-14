import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicalPhotosService } from './clinical-photos.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';

@ApiTags('Clinical Photos')
@Controller('clinical-photos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClinicalPhotosController {
  constructor(private readonly clinicalPhotosService: ClinicalPhotosService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload clinical photo for a patient' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Clinical photo file (JPG, PNG - max 10MB)',
        },
        patientId: { type: 'string', description: 'Patient ID' },
        viewType: {
          type: 'string',
          enum: ['ANTERIOR', 'POSTERIOR', 'LATERAL_LEFT', 'LATERAL_RIGHT', 'OTHER'],
          description: 'Anatomical view type',
        },
        anatomicalLocation: { type: 'string', description: 'Anatomical location (optional)' },
        description: { type: 'string', description: 'Photo description (optional)' },
      },
      required: ['file', 'patientId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or file type' })
  @HttpCode(HttpStatus.CREATED)
  async uploadPhoto(@Req() req: any) {
    const userId = req.user.sub || req.user.userId;

    // Handle Fastify multipart - process all parts
    const parts = req.parts();
    const uploadDto: any = {};
    let fileData: any = null;

    for await (const part of parts) {
      if (part.type === 'file') {
        // This is the file
        const buffer = await part.toBuffer();
        fileData = {
          buffer,
          originalname: part.filename,
          mimetype: part.mimetype,
          size: buffer.length,
        };
      } else {
        // This is a field
        uploadDto[part.fieldname] = part.value;
      }
    }

    if (!fileData) {
      return {
        success: false,
        error: { message: 'No file provided' },
      };
    }

    return await this.clinicalPhotosService.uploadPhoto(uploadDto, fileData, userId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all clinical photos for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Photos retrieved successfully' })
  async getPhotosByPatient(@Param('patientId') patientId: string) {
    return await this.clinicalPhotosService.getPhotosByPatientId(patientId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete clinical photo' })
  @ApiParam({ name: 'id', description: 'Photo ID' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async deletePhoto(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub || req.user.userId;
    return await this.clinicalPhotosService.deletePhoto(id, userId);
  }
}
