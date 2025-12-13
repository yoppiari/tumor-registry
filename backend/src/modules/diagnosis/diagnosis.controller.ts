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
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DiagnosisService } from './diagnosis.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { DiagnosisType, DiagnosisSeverity, DiagnosisStatus } from '@prisma/client';

@ApiTags('Diagnosis')
@Controller('diagnosis')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient diagnosis' })
  @ApiResponse({ status: 201, description: 'Diagnosis created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or ICD-10 code' })
  @ApiResponse({ status: 409, description: 'Diagnosis already exists' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'diagnosis')
  async createDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    diagnosisType: DiagnosisType;
    severity?: DiagnosisSeverity;
    status: DiagnosisStatus;
    onsetDate?: string;
    resolutionDate?: string;
    notes?: string;
    isPrimary?: boolean;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : undefined,
      resolutionDate: createDiagnosisDto.resolutionDate ? new Date(createDiagnosisDto.resolutionDate) : undefined,
      providerId: 'current-user-id', // This should come from authenticated user
    });
  }

  @Get()
  @ApiOperation({ summary: 'Search diagnoses with filters' })
  @ApiResponse({ status: 200, description: 'Diagnoses retrieved successfully' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  @ApiQuery({ name: 'diagnosisType', required: false, enum: DiagnosisType })
  @ApiQuery({ name: 'severity', required: false, enum: DiagnosisSeverity })
  @ApiQuery({ name: 'status', required: false, enum: DiagnosisStatus })
  @ApiQuery({ name: 'isPrimary', required: false, type: Boolean })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchDiagnoses(@Query() searchQuery: any) {
    const data: any = { ...searchQuery };
    if (searchQuery.dateFrom) {
      data.dateFrom = new Date(searchQuery.dateFrom);
    }
    if (searchQuery.dateTo) {
      data.dateTo = new Date(searchQuery.dateTo);
    }
    return await this.diagnosisService.searchDiagnoses(data);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get diagnosis statistics' })
  @ApiResponse({ status: 200, description: 'Diagnosis statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  async getStatistics(
    @Query('centerId') centerId?: string,
    @Query('providerId') providerId?: string,
  ) {
    return await this.diagnosisService.getDiagnosisStatistics(centerId, providerId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get diagnoses by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient diagnoses retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'diagnosisType', required: false, enum: DiagnosisType })
  @ApiQuery({ name: 'status', required: false, enum: DiagnosisStatus })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('diagnosisType') diagnosisType?: DiagnosisType,
    @Query('status') status?: DiagnosisStatus,
    @Query('includeInactive') includeInactive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.diagnosisService.findByPatientId(
      patientId,
      diagnosisType,
      status,
      includeInactive === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('patient/:patientId/active')
  @ApiOperation({ summary: 'Get active diagnoses for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Active diagnoses retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getActiveDiagnosesByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.diagnosisService.getActiveDiagnosesByPatient(patientId);
  }

  @Get('patient/:patientId/primary')
  @ApiOperation({ summary: 'Get primary diagnoses for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Primary diagnoses retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getPrimaryDiagnosesByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.diagnosisService.getPrimaryDiagnosesByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diagnosis by ID' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.diagnosisService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update diagnosis' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis updated successfully' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  @RequirePermissions('MEDICAL_RECORDS_UPDATE')
  @AuditLog('UPDATE', 'diagnosis')
  async updateDiagnosis(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDiagnosisDto: {
      diagnosisName?: string;
      severity?: DiagnosisSeverity;
      status?: DiagnosisStatus;
      onsetDate?: string;
      resolutionDate?: string;
      notes?: string;
      isPrimary?: boolean;
    },
  ) {
    const data: any = { ...updateDiagnosisDto };
    if (updateDiagnosisDto.onsetDate) {
      data.onsetDate = new Date(updateDiagnosisDto.onsetDate);
    }
    if (updateDiagnosisDto.resolutionDate) {
      data.resolutionDate = new Date(updateDiagnosisDto.resolutionDate);
    }
    return await this.diagnosisService.updateDiagnosis(id, data, 'current-user-id');
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Mark diagnosis as resolved' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis resolved successfully' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  @RequirePermissions('MEDICAL_RECORDS_UPDATE')
  @AuditLog('RESOLVE', 'diagnosis')
  async resolveDiagnosis(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resolveDto: {
      resolutionDate: string;
      notes?: string;
    },
  ) {
    return await this.diagnosisService.resolveDiagnosis(
      id,
      new Date(resolveDto.resolutionDate),
      resolveDto.notes
    );
  }

  // Quick diagnosis templates

  @Post('templates/primary-cancer')
  @ApiOperation({ summary: 'Create primary cancer diagnosis template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'primary_cancer_diagnosis')
  async createPrimaryCancerDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    severity?: DiagnosisSeverity;
    onsetDate?: string;
    notes?: string;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      diagnosisType: 'PRIMARY',
      status: 'ACTIVE',
      isPrimary: true,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
      providerId: 'current-user-id',
    });
  }

  @Post('templates/metastasis')
  @ApiOperation({ summary: 'Create metastasis diagnosis template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'metastasis_diagnosis')
  async createMetastasisDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    severity?: DiagnosisSeverity;
    onsetDate?: string;
    notes?: string;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      diagnosisType: 'SECONDARY',
      status: 'ACTIVE',
      isPrimary: false,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
      providerId: 'current-user-id',
    });
  }

  @Post('templates/complication')
  @ApiOperation({ summary: 'Create complication diagnosis template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'complication_diagnosis')
  async createComplicationDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    severity?: DiagnosisSeverity;
    onsetDate?: string;
    notes?: string;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      diagnosisType: 'COMPLICATION',
      status: 'ACTIVE',
      isPrimary: false,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
      providerId: 'current-user-id',
    });
  }

  @Post('templates/admitting')
  @ApiOperation({ summary: 'Create admitting diagnosis template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'admitting_diagnosis')
  async createAdmittingDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    severity?: DiagnosisSeverity;
    onsetDate?: string;
    notes?: string;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      diagnosisType: 'ADMITTING',
      status: 'ACTIVE',
      isPrimary: false,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
      providerId: 'current-user-id',
    });
  }

  @Post('templates/discharge')
  @ApiOperation({ summary: 'Create discharge diagnosis template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'discharge_diagnosis')
  async createDischargeDiagnosis(@Body() createDiagnosisDto: {
    patientId: string;
    diagnosisCode: string;
    diagnosisName: string;
    severity?: DiagnosisSeverity;
    onsetDate?: string;
    notes?: string;
  }) {
    return await this.diagnosisService.createDiagnosis({
      ...createDiagnosisDto,
      diagnosisType: 'DISCHARGE',
      status: 'ACTIVE',
      isPrimary: false,
      onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
      providerId: 'current-user-id',
    });
  }

  // ICD-10 helper endpoints

  @Get('icd10/search')
  @ApiOperation({ summary: 'Search ICD-10 codes by category' })
  @ApiResponse({ status: 200, description: 'ICD-10 search results' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  @ApiQuery({ name: 'category', required: true, description: 'ICD-10 category (e.g., C00-D48 for neoplasms)' })
  async searchIcd10ByCategory(@Query('category') category: string) {
    // This would typically connect to an ICD-10 database or API
    // For now, return a basic category mapping
    const categories = {
      'C00-D48': 'Neoplasms (Cancers)',
      'A00-B99': 'Infectious and Parasitic Diseases',
      'I00-I99': 'Diseases of the Circulatory System',
      'J00-J99': 'Diseases of the Respiratory System',
    };

    return {
      category,
      description: categories[category] || 'Unknown Category',
      note: 'Full ICD-10 integration would connect to comprehensive medical coding database',
    };
  }

  @Get('icd10/categories')
  @ApiOperation({ summary: 'Get ICD-10 categories' })
  @ApiResponse({ status: 200, description: 'ICD-10 categories retrieved successfully' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  async getIcd10Categories() {
    return {
      categories: [
        { code: 'A00-B99', name: 'Infectious and Parasitic Diseases' },
        { code: 'C00-D48', name: 'Neoplasms' },
        { code: 'D50-D89', name: 'Diseases of Blood and Blood-Forming Organs' },
        { code: 'E00-E90', name: 'Endocrine, Nutritional, and Metabolic Diseases' },
        { code: 'F00-F99', name: 'Mental and Behavioural Disorders' },
        { code: 'G00-G99', name: 'Diseases of the Nervous System' },
        { code: 'H00-H59', name: 'Diseases of the Eye and Adnexa' },
        { code: 'I00-I99', name: 'Diseases of the Circulatory System' },
        { code: 'J00-J99', name: 'Diseases of the Respiratory System' },
        { code: 'K00-K93', name: 'Diseases of the Digestive System' },
      ],
      note: 'Cancer-related codes are primarily in C00-D48 (Neoplasms) category',
    };
  }
}